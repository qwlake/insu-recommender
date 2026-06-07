import { mkdirSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';

const LOG_PATH = join(process.cwd(), 'output', 'face-debug.ndjson');
const ALLOWED_GENDERS = new Set(['female', 'male', 'unknown']);

function safeNumber(value, digits = 3) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Number(numeric.toFixed(digits));
}

function safeInteger(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return Math.round(numeric);
}

function safeGender(value) {
  return ALLOWED_GENDERS.has(value) ? value : 'unknown';
}

function safeSample(sample) {
  if (!sample || typeof sample !== 'object') return null;
  return {
    apparentAge: safeInteger(sample.apparentAge),
    apparentGender: safeGender(sample.apparentGender),
    genderConfidence: safeNumber(sample.genderConfidence),
    faceConfidence: safeNumber(sample.faceConfidence),
    boxScore: safeNumber(sample.boxScore),
    faceScore: safeNumber(sample.faceScore),
    yawDegrees: safeInteger(sample.yawDegrees),
  };
}

function safePayload(payload) {
  const sample = safeSample(payload.sample);
  const samples = Array.isArray(payload.samples)
    ? payload.samples.slice(0, 40).map(safeSample).filter(Boolean)
    : undefined;

  return {
    ts: new Date().toISOString(),
    event: String(payload.event || 'face-debug').slice(0, 64),
    source: String(payload.source || 'unknown').slice(0, 64),
    sampleIndex: safeInteger(payload.sampleIndex),
    elapsedMs: safeInteger(payload.elapsedMs),
    durationMs: safeInteger(payload.durationMs),
    phase: typeof payload.phase === 'string' ? payload.phase.slice(0, 80) : undefined,
    step: typeof payload.step === 'string' ? payload.step.slice(0, 40) : undefined,
    completedSteps: Array.isArray(payload.completedSteps) ? payload.completedSteps.slice(0, 8).map((step) => String(step).slice(0, 40)) : [],
    scanCompleted: Boolean(payload.scanCompleted),
    yawDegrees: safeInteger(payload.yawDegrees),
    framesRequested: safeInteger(payload.framesRequested),
    facesDetected: safeInteger(payload.facesDetected),
    sample,
    samples,
    apparentAge: safeInteger(payload.apparentAge),
    apparentGender: safeGender(payload.apparentGender),
    genderConfidence: safeNumber(payload.genderConfidence),
    faceConfidence: safeNumber(payload.faceConfidence),
    uncertainReason: typeof payload.uncertainReason === 'string' ? payload.uncertainReason.slice(0, 200) : '',
  };
}

function summaryLine(payload) {
  if (payload.event === 'face-scan-sample') {
    const sample = payload.sample;
    return `sample=${payload.sampleIndex} step=${payload.step || '-'} yaw=${payload.yawDegrees ?? sample?.yawDegrees ?? '-'} age=${sample?.apparentAge ?? '-'} gender=${sample?.apparentGender ?? '-'} genderScore=${Math.round((sample?.genderConfidence || 0) * 100)} face=${Math.round((sample?.faceConfidence || 0) * 100)} phase=${payload.phase || '-'}`;
  }

  return `summary completed=${payload.scanCompleted ? 'yes' : 'no'} steps=${payload.completedSteps?.length || 0} samples=${payload.samples?.length || 0} faces=${payload.facesDetected ?? '-'} age=${payload.apparentAge ?? '-'} gender=${payload.apparentGender ?? '-'} genderScore=${Math.round((payload.genderConfidence || 0) * 100)} face=${Math.round((payload.faceConfidence || 0) * 100)} reason="${payload.uncertainReason || ''}"`;
}

function faceDebugPlugin() {
  return {
    name: 'face-debug-log',
    configureServer(server) {
      server.middlewares.use('/__face_debug', (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
          body += chunk;
          if (body.length > 64_000) req.destroy();
        });
        req.on('end', () => {
          try {
            const payload = safePayload(JSON.parse(body || '{}'));
            mkdirSync(join(process.cwd(), 'output'), { recursive: true });
            appendFileSync(LOG_PATH, `${JSON.stringify(payload)}\n`);
            server.config.logger.info(`[face-debug] ${summaryLine(payload)}`);
          } catch (error) {
            server.config.logger.warn(`[face-debug] ignored invalid payload: ${error?.message || error}`);
          }
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [faceDebugPlugin()],
});
