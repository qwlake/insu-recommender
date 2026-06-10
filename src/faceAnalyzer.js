import { ageBucket } from './utils/ageBucket.js';

let humanInstance;
let loadPromise;

const GUIDED_SCAN_TIMEOUT_MS = 12000;
const ANALYSIS_SAMPLE_INTERVAL_MS = 220;
const EXPECTED_ANALYSIS_SAMPLE_COUNT = 12;
const MIN_GENDER_CONFIDENCE = 0.15;
const MIN_FACE_CONFIDENCE = 0.25;
const MIN_DISPLAY_AGE = 20;
const CENTER_YAW_DEGREES = 12;
const SIDE_YAW_DEGREES = 18;
const REQUIRED_STABLE_SAMPLES = 2;

const SCAN_STEPS = Object.freeze({
  CENTER_START: 'center-start',
  FIRST_SIDE: 'first-side',
  OPPOSITE_SIDE: 'opposite-side',
  CENTER_END: 'center-end',
  DONE: 'done',
});

export const HUMAN_CONFIG = Object.freeze({
  backend: 'webgl',
  async: true,
  debug: false,
  modelBasePath: 'https://cdn.jsdelivr.net/npm/@vladmandic/human/models',
  cacheSensitivity: 0,
  filter: { enabled: true, autoBrightness: true, equalization: false, flip: false },
  face: {
    enabled: true,
    detector: { enabled: true, rotation: false, maxDetected: 1, minConfidence: 0.2, return: false },
    mesh: { enabled: true },
    iris: { enabled: false },
    description: { enabled: true, minConfidence: MIN_GENDER_CONFIDENCE },
    emotion: { enabled: false },
    antispoof: { enabled: false },
    liveness: { enabled: false },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false },
});

export async function loadFaceAnalyzer(onStatus = () => {}) {
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    onStatus('모델 모듈을 불러오고 있습니다.');
    const module = await import('@vladmandic/human');
    const Human = module.default || module.Human;
    humanInstance = new Human(HUMAN_CONFIG);
    onStatus('분석 모델을 초기화하고 있습니다.');
    await humanInstance.load();
    await humanInstance.warmup();
    onStatus('분석 모델 준비가 완료되었습니다.');
    return true;
  })();

  return loadPromise;
}

function normalizeGender(gender) {
  const value = String(gender || '').toLowerCase();
  if (value.includes('female') || value.includes('woman')) return 'female';
  if (value.includes('male') || value.includes('man')) return 'male';
  return 'unknown';
}

function numberOrZero(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function clamp01(value) {
  const numeric = numberOrZero(value);
  if (numeric < 0) return 0;
  if (numeric > 1) return 1;
  return numeric;
}

function radiansToDegrees(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.round((numeric * 180) / Math.PI);
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function clusterAges(ageSamples) {
  const sorted = [...ageSamples].sort((a, b) => a - b);
  const clusters = [];

  for (const age of sorted) {
    const current = clusters.at(-1);
    if (!current || age - current.values.at(-1) > 2) {
      clusters.push({ values: [age] });
    } else {
      current.values.push(age);
    }
  }

  return clusters.map((cluster) => ({
    count: cluster.values.length,
    min: cluster.values[0],
    max: cluster.values.at(-1),
    median: Math.round(median(cluster.values)),
  }));
}

function pickAge(samples) {
  const ageSamples = samples.map((sample) => sample.apparentAge).filter((age) => age > 0);
  if (!ageSamples.length) return { apparentAge: null, ageSamples };

  const baselineAge = Math.round(median(ageSamples));
  const minAge = Math.min(...ageSamples);
  const maxAge = Math.max(...ageSamples);
  const hasWideAgeSpread = maxAge - minAge >= 8;

  if (baselineAge < 20 && hasWideAgeSpread) {
    const repeatedAdultCluster = clusterAges(ageSamples)
      .filter((cluster) => (
        cluster.median >= 20
        && cluster.median >= baselineAge + 6
        && cluster.count >= 3
      ))
      .sort((a, b) => b.count - a.count || b.median - a.median)[0];

    if (repeatedAdultCluster) {
      return {
        apparentAge: repeatedAdultCluster.median,
        ageSamples,
      };
    }
  }

  return { apparentAge: baselineAge, ageSamples };
}

function displayAgeForRecommendation(apparentAge) {
  if (!apparentAge) return apparentAge;
  return apparentAge < MIN_DISPLAY_AGE ? MIN_DISPLAY_AGE : apparentAge;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForVideoSample(videoElement, delayMs = ANALYSIS_SAMPLE_INTERVAL_MS) {
  await wait(delayMs);
  if (typeof videoElement?.requestVideoFrameCallback === 'function') {
    await new Promise((resolve) => videoElement.requestVideoFrameCallback(() => resolve()));
    return;
  }
}

function faceYawDegrees(face) {
  return radiansToDegrees(face?.rotation?.angle?.yaw);
}

function normalizeFaceSample(face) {
  const apparentAge = Math.round(numberOrZero(face?.age));
  const apparentGender = normalizeGender(face?.gender);
  const genderConfidence = clamp01(face?.genderScore ?? face?.genderConfidence);
  const boxScore = clamp01(face?.boxScore);
  const faceScore = clamp01(face?.faceScore);
  const faceConfidence = Math.max(
    clamp01(face?.score),
    boxScore,
    faceScore,
  );
  const yawDegrees = faceYawDegrees(face);

  return {
    apparentAge: apparentAge > 0 ? apparentAge : null,
    apparentGender,
    genderConfidence,
    faceConfidence,
    boxScore,
    faceScore,
    yawDegrees,
  };
}

function pickGender(samples) {
  const totals = { female: 0, male: 0 };
  for (const sample of samples) {
    if (sample.apparentGender === 'female' || sample.apparentGender === 'male') {
      totals[sample.apparentGender] += sample.genderConfidence;
    }
  }

  const apparentGender = totals.female > totals.male ? 'female' : totals.male > totals.female ? 'male' : 'unknown';
  if (apparentGender === 'unknown') return { apparentGender: 'unknown', genderConfidence: 0 };

  const genderConfidence = Math.max(
    ...samples
      .filter((sample) => sample.apparentGender === apparentGender)
      .map((sample) => sample.genderConfidence),
    0,
  );

  if (genderConfidence < MIN_GENDER_CONFIDENCE) {
    return { apparentGender: 'unknown', genderConfidence };
  }

  return { apparentGender, genderConfidence };
}

export function summarizeFaceSamples(faces, requestedSamples = EXPECTED_ANALYSIS_SAMPLE_COUNT) {
  const samples = faces.filter(Boolean).map(normalizeFaceSample);

  if (!samples.length) {
    return {
      apparentAge: null,
      ageBucket: 'unknown',
      apparentGender: 'unknown',
      genderConfidence: 0,
      faceConfidence: 0,
      uncertainReason: '얼굴을 찾지 못했습니다.',
    };
  }

  const { apparentAge: rawApparentAge, ageSamples } = pickAge(samples);
  const apparentAge = displayAgeForRecommendation(rawApparentAge);
  const { apparentGender, genderConfidence } = pickGender(samples);
  const faceConfidence = Math.max(...samples.map((sample) => sample.faceConfidence), 0);
  const uncertain = [];

  if (!apparentAge) uncertain.push(`나이 추정값이 불안정합니다. (${ageSamples.length}/${requestedSamples}프레임)`);
  if (apparentGender === 'unknown') uncertain.push(`성별 추정값을 확정하기 어렵습니다. (최고 ${Math.round(genderConfidence * 100)}%)`);
  if (faceConfidence && faceConfidence < MIN_FACE_CONFIDENCE) uncertain.push(`얼굴 감지 품질이 낮습니다. (${Math.round(faceConfidence * 100)}%)`);

  return {
    apparentAge,
    ageBucket: apparentAge ? ageBucket(apparentAge) : 'unknown',
    apparentGender,
    genderConfidence,
    faceConfidence,
    uncertainReason: uncertain.join(' ') || '',
  };
}

export async function detectFacePresence(videoElement) {
  await loadFaceAnalyzer();
  if (!humanInstance) throw new Error('face-analyzer-not-loaded');

  const result = await humanInstance.detect(videoElement);
  const face = result?.face?.[0];
  if (!face) {
    return {
      detected: false,
      faceConfidence: 0,
      yawDegrees: null,
    };
  }

  const sample = normalizeFaceSample(face);
  return {
    detected: sample.faceConfidence > 0,
    faceConfidence: sample.faceConfidence,
    yawDegrees: sample.yawDegrees,
  };
}

function createScanState() {
  return {
    step: SCAN_STEPS.CENTER_START,
    stableSamples: 0,
    firstSideSign: 0,
    completedSteps: [],
  };
}

function scanStepLabel(step) {
  return ({
    [SCAN_STEPS.CENTER_START]: '정면이 화면 중앙에 오도록 맞춰주세요',
    [SCAN_STEPS.FIRST_SIDE]: '좋습니다. 얼굴을 한쪽으로 천천히 돌려주세요',
    [SCAN_STEPS.OPPOSITE_SIDE]: '좋습니다. 이제 반대쪽으로 천천히 돌려주세요',
    [SCAN_STEPS.CENTER_END]: '마지막으로 다시 정면을 바라봐 주세요',
    [SCAN_STEPS.DONE]: '스캔 완료. 결과를 정리하고 있습니다',
  })[step] || '얼굴이 화면 안에 들어오게 맞춰주세요';
}

function completedScanProgress(state) {
  return Math.min(1, state.completedSteps.length / 4);
}

function updateScanState(state, face) {
  const yawDegrees = faceYawDegrees(face);
  let matched = false;

  if (state.step === SCAN_STEPS.CENTER_START || state.step === SCAN_STEPS.CENTER_END) {
    matched = Number.isFinite(yawDegrees) && Math.abs(yawDegrees) <= CENTER_YAW_DEGREES;
  } else if (state.step === SCAN_STEPS.FIRST_SIDE) {
    matched = Number.isFinite(yawDegrees) && Math.abs(yawDegrees) >= SIDE_YAW_DEGREES;
  } else if (state.step === SCAN_STEPS.OPPOSITE_SIDE) {
    matched = Number.isFinite(yawDegrees) && state.firstSideSign !== 0 && yawDegrees * state.firstSideSign <= -SIDE_YAW_DEGREES;
  }

  if (!matched) {
    state.stableSamples = 0;
    return {
      yawDegrees,
      step: state.step,
      phase: face ? scanStepLabel(state.step) : '얼굴이 화면 중앙에 오도록 맞춰주세요',
      completedSteps: [...state.completedSteps],
      scanCompleted: state.step === SCAN_STEPS.DONE,
    };
  }

  state.stableSamples += 1;
  if (state.stableSamples < REQUIRED_STABLE_SAMPLES) {
    return {
      yawDegrees,
      step: state.step,
      phase: `${scanStepLabel(state.step)} · 잠시 유지해 주세요`,
      completedSteps: [...state.completedSteps],
      scanCompleted: false,
    };
  }

  if (state.step === SCAN_STEPS.CENTER_START) {
    state.completedSteps.push(SCAN_STEPS.CENTER_START);
    state.step = SCAN_STEPS.FIRST_SIDE;
  } else if (state.step === SCAN_STEPS.FIRST_SIDE) {
    state.completedSteps.push(SCAN_STEPS.FIRST_SIDE);
    state.firstSideSign = Math.sign(yawDegrees) || 1;
    state.step = SCAN_STEPS.OPPOSITE_SIDE;
  } else if (state.step === SCAN_STEPS.OPPOSITE_SIDE) {
    state.completedSteps.push(SCAN_STEPS.OPPOSITE_SIDE);
    state.step = SCAN_STEPS.CENTER_END;
  } else if (state.step === SCAN_STEPS.CENTER_END) {
    state.completedSteps.push(SCAN_STEPS.CENTER_END);
    state.step = SCAN_STEPS.DONE;
  }
  state.stableSamples = 0;

  return {
    yawDegrees,
    step: state.step,
    phase: scanStepLabel(state.step),
    completedSteps: [...state.completedSteps],
    scanCompleted: state.step === SCAN_STEPS.DONE,
  };
}

function emitProgress(onProgress, payload) {
  if (typeof onProgress === 'function') {
    onProgress(payload);
  }
}

export async function analyzeFace(videoElement, options = {}) {
  await loadFaceAnalyzer();
  if (!humanInstance) throw new Error('face-analyzer-not-loaded');

  const faces = [];
  const scanState = createScanState();
  const startedAt = performance.now();
  let scanInfo = {
    step: scanState.step,
    phase: scanStepLabel(scanState.step),
    completedSteps: [],
    scanCompleted: false,
    yawDegrees: null,
  };

  while (performance.now() - startedAt < GUIDED_SCAN_TIMEOUT_MS && !scanInfo.scanCompleted) {
    const elapsedMs = performance.now() - startedAt;

    const result = await humanInstance.detect(videoElement);
    const face = result?.face?.[0];
    if (face) faces.push(face);
    scanInfo = updateScanState(scanState, face);

    emitProgress(options.onProgress, {
      elapsedMs,
      durationMs: GUIDED_SCAN_TIMEOUT_MS,
      progress: completedScanProgress(scanState),
      phase: scanInfo.phase,
      samplesCaptured: faces.length,
      yawDegrees: scanInfo.yawDegrees,
      step: scanInfo.step,
      completedSteps: scanInfo.completedSteps,
      scanCompleted: scanInfo.scanCompleted,
    });

    const remainingMs = GUIDED_SCAN_TIMEOUT_MS - (performance.now() - startedAt);
    if (remainingMs <= 0) break;
    await waitForVideoSample(videoElement, Math.min(ANALYSIS_SAMPLE_INTERVAL_MS, remainingMs));
  }

  const durationMs = Math.round(performance.now() - startedAt);
  const profile = summarizeFaceSamples(faces, EXPECTED_ANALYSIS_SAMPLE_COUNT);
  profile.scanCompleted = scanInfo.scanCompleted;
  profile.completedSteps = scanInfo.completedSteps;
  emitProgress(options.onProgress, {
    elapsedMs: durationMs,
    durationMs: GUIDED_SCAN_TIMEOUT_MS,
    progress: 1,
    phase: '분석 결과를 정리하고 있습니다',
    samplesCaptured: faces.length,
    yawDegrees: scanInfo.yawDegrees,
    step: scanInfo.step,
    completedSteps: scanInfo.completedSteps,
    scanCompleted: scanInfo.scanCompleted,
  });
  return profile;
}

export const FACE_ANALYZER_PUBLIC_FIELDS = Object.freeze([
  'apparentAge',
  'ageBucket',
  'apparentGender',
  'genderConfidence',
  'faceConfidence',
  'uncertainReason',
]);
