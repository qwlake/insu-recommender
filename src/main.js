import './styles.css';
import { COPY } from './copy.js';
import { startCamera, stopCamera, describeCameraError, isCameraSupported } from './camera.js';
import { loadFaceAnalyzer, analyzeFace } from './faceAnalyzer.js';
import { recommend, recommendationReason } from './recommendations.js';
import { ageBucket, ageBucketLabel } from './utils/ageBucket.js';

const app = document.querySelector('#app');
let stream = null;
let currentProfile = null;
const MIN_RECOMMENDATION_AGE = 20;

function genderLabel(gender) {
  return ({ female: '여성 추정', male: '남성 추정', unknown: '미확인' })[gender] || '미확인';
}

function manualGenderLabel(gender) {
  return ({ female: '여성', male: '남성', unknown: '선택 안 함' })[gender] || '선택 안 함';
}

function isUserConfirmedSource(source) {
  return source === 'manual' || source === 'confirmed';
}

function recommendationAge(age) {
  const numericAge = Number(age);
  if (!Number.isFinite(numericAge)) return null;
  return Math.max(MIN_RECOMMENDATION_AGE, Math.round(numericAge));
}

function percent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return '표시 안 함';
  return `${Math.round(numeric * 100)}%`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
}

function isDebugMode() {
  try {
    return new URLSearchParams(window.location.search).has('debug');
  } catch {
    return false;
  }
}

function debugNotice() {
  if (!isDebugMode()) return '';
  return '<div class="notice debug">디버그 모드: 나이·성별·품질 점수 숫자만 dev 서버 로그로 전송됩니다.</div>';
}

function baseShell(content) {
  app.innerHTML = `
    <main class="app-shell">
      <div class="container">
        <header class="app-header" aria-label="서비스 정보">
          <div class="brand-lockup">
            <img class="brand-logo" src="/hanwha-logo.svg" alt="Hanwha" width="145" height="40" />
            <div>
              <strong>${COPY.appTitle}</strong>
            </div>
          </div>
        </header>
        ${content}
      </div>
    </main>
  `;
}

function renderIntro() {
  stopActiveCamera();
  baseShell(`
    <section class="hero">
      <div class="card hero-card">
        <h1 class="page-title">${COPY.heroTitle}</h1>
        <p class="muted hero-body">${COPY.heroBody}</p>
        <div class="badges">
          <span class="badge">브라우저 분석</span>
          <span class="badge">얼굴 입체 스캔</span>
        </div>
        <div class="flow-strip" aria-label="진행 방식">
          <div><b>1</b><span>카메라 권한 허용</span></div>
          <div><b>2</b><span>얼굴 입체 스캔</span></div>
          <div><b>3</b><span>상품 확인</span></div>
        </div>
        ${debugNotice()}
        <div class="actions">
          <button class="btn orange" id="start-camera">${COPY.startButton}</button>
          <button class="btn secondary" id="manual-start">${COPY.manualButton}</button>
        </div>
      </div>
      <aside class="card trust-card">
        <p class="eyebrow">Privacy first</p>
        <h2>카메라 데이터는 저장하지 않습니다.</h2>
        <ul class="privacy-list">
          ${COPY.privacyBullets.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </aside>
    </section>
  `);

  document.querySelector('#start-camera').addEventListener('click', handleStartCamera);
  document.querySelector('#manual-start').addEventListener('click', () => renderFallback('사용자가 수동 입력을 선택했습니다.'));
}

function renderLoading(status = COPY.loadingModel) {
  baseShell(`
    <section class="card center-card">
      <p class="eyebrow">모델 준비</p>
      <h1 class="page-title">${COPY.loadingModel}</h1>
      <p class="muted" id="load-status">${escapeHtml(status)}</p>
      <div class="loading-bar" aria-hidden="true"><span></span></div>
      <div class="actions"><button class="btn secondary" id="back-home">${COPY.resetButton}</button></div>
    </section>
  `);
  document.querySelector('#back-home').addEventListener('click', renderIntro);
}

async function handleStartCamera() {
  if (!isCameraSupported()) {
    renderFallback('이 브라우저에서는 카메라 API를 사용할 수 없습니다.');
    return;
  }

  try {
    renderLoading();
    await loadFaceAnalyzer((status) => {
      const el = document.querySelector('#load-status');
      if (el) el.textContent = status;
    });
    renderCamera();
    const video = document.querySelector('#camera-video');
    stream = await startCamera(video);
    setStatus(COPY.cameraReady);
  } catch (error) {
    renderFallback(describeCameraError(error));
  }
}

function renderCamera() {
  baseShell(`
    <section class="card stage">
      <div>
        <h1 class="page-title">단계에 따라 얼굴을 입체적으로 분석합니다</h1>
        <p class="muted">안내가 바뀔 때까지 천천히 움직이면 됩니다. 라이브 프레임만 브라우저 메모리에서 분석합니다.</p>
      </div>
      <div class="camera-grid">
        <div class="video-wrap">
          <video id="camera-video" autoplay muted playsinline></video>
          <div class="scan-hud" aria-hidden="true">
            <div class="scan-grid"></div>
            <div class="scan-line"></div>
            <div class="face-frame">
              <span class="corner top-left"></span>
              <span class="corner top-right"></span>
              <span class="corner bottom-left"></span>
              <span class="corner bottom-right"></span>
            </div>
            <div class="scan-pulse"></div>
          </div>
          <div class="video-overlay"><span id="video-overlay-label">얼굴을 가이드 안에 맞춰주세요</span></div>
        </div>
        <aside class="status-panel card inner-card">
          <p class="eyebrow">Guided scan</p>
          <div class="scan-phase" id="scan-phase">준비되면 스캔을 시작하세요.</div>
          <div class="scan-progress"><span id="scan-progress-bar"></span></div>
          <ol class="scan-steps" id="scan-steps">
            <li data-step="center-start"><span class="step-mark">1</span><span class="step-copy">정면</span></li>
            <li data-step="first-side"><span class="step-mark">2</span><span class="step-copy">한쪽</span></li>
            <li data-step="opposite-side"><span class="step-mark">3</span><span class="step-copy">반대쪽</span></li>
            <li data-step="center-end"><span class="step-mark">4</span><span class="step-copy">정면 복귀</span></li>
          </ol>
          <div class="status-line" id="status-line">카메라 준비 중…</div>
          ${debugNotice()}
          <button class="btn orange" id="analyze-face">${COPY.analyzeButton}</button>
          <button class="btn secondary" id="manual-fallback">${COPY.manualButton}</button>
          <button class="btn secondary" id="stop-camera">${COPY.stopCameraButton}</button>
        </aside>
      </div>
    </section>
  `);
  document.querySelector('#analyze-face').addEventListener('click', handleAnalyze);
  document.querySelector('#manual-fallback').addEventListener('click', () => renderFallback('수동 입력을 선택했습니다.'));
  document.querySelector('#stop-camera').addEventListener('click', renderIntro);
}

function setStatus(status) {
  const el = document.querySelector('#status-line');
  if (el) el.textContent = status;
}

function updateScanUi({ progress = 0, phase = '', samplesCaptured = 0, yawDegrees = null, step = '', completedSteps = [] }) {
  const phaseEl = document.querySelector('#scan-phase');
  const barEl = document.querySelector('#scan-progress-bar');
  const videoWrap = document.querySelector('.video-wrap');
  const overlayLabel = document.querySelector('#video-overlay-label');
  const pct = Math.min(100, Math.max(0, Math.round(progress * 100)));
  const phaseText = phase || '얼굴을 화면 안에 맞춰주세요.';
  if (phaseEl) phaseEl.textContent = phaseText;
  if (overlayLabel) overlayLabel.textContent = pct >= 100 ? '스캔 완료' : phaseText;
  if (barEl) barEl.style.width = `${pct}%`;
  if (videoWrap) {
    videoWrap.classList.add('is-scanning');
    videoWrap.classList.toggle('scan-complete', pct >= 100);
    videoWrap.style.setProperty('--scan-progress', `${pct}%`);
    videoWrap.style.setProperty('--scan-y', `${pct * 2.3}px`);
    if (step) videoWrap.dataset.scanStep = step;
  }

  document.querySelectorAll('#scan-steps [data-step]').forEach((stepEl) => {
    const isDone = completedSteps.includes(stepEl.dataset.step);
    const isActive = stepEl.dataset.step === step && !isDone && pct < 100;
    stepEl.classList.toggle('done', isDone);
    stepEl.classList.toggle('active', isActive);
    stepEl.setAttribute('aria-current', isActive ? 'step' : 'false');
  });

  const yawText = Number.isFinite(yawDegrees) ? ` · yaw ${Math.round(yawDegrees)}°` : '';
  setStatus(`스캔 진행 ${pct}% · 샘플 ${samplesCaptured}개${yawText}`);
}

async function handleAnalyze() {
  const video = document.querySelector('#camera-video');
  const button = document.querySelector('#analyze-face');
  try {
    button.disabled = true;
    setStatus(COPY.analyzing);
    const result = await analyzeFace(video, {
      onProgress: updateScanUi,
    });
    if (result.uncertainReason || !result.apparentAge || result.apparentGender === 'unknown') {
      currentProfile = result;
      renderFallback(result.uncertainReason || '추정값이 불안정합니다.', result);
      return;
    }
    currentProfile = result;
    stopActiveCamera();
    renderProfileConfirm(result);
  } catch (error) {
    renderFallback('얼굴 분석 중 문제가 발생했습니다. 수동 입력을 사용할 수 있습니다.');
  } finally {
    if (button) button.disabled = false;
  }
}

function renderProfileConfirm(profile) {
  const gender = profile.apparentGender && profile.apparentGender !== 'unknown' ? profile.apparentGender : 'unknown';
  baseShell(`
    <section class="confirm-layout">
      <div class="card">
        <p class="eyebrow">추정값 확인</p>
        <h1 class="page-title">나이와 성별을 확인해 주세요</h1>
        <p class="muted">카메라 모델은 외형 기반 추정만 하므로 실제 나이와 다를 수 있습니다. 이 화면에서 직접 수정할 수 있습니다.</p>
        <div class="estimate-summary">
          <div><span>추정 나이</span><b>${profile.apparentAge ? `${escapeHtml(profile.apparentAge)}세` : '미확인'}</b></div>
          <div><span>추정 성별</span><b>${escapeHtml(genderLabel(profile.apparentGender))}</b></div>
        </div>
      </div>
      <form id="confirm-form" class="card form-card">
        <h2>표시할 기준값</h2>
        <p class="muted">이 값은 상품 카드 선택에만 사용됩니다.</p>
        <div class="form-grid">
          <div class="field">
            <label for="confirm-age">나이</label>
            <input id="confirm-age" name="age" type="number" min="20" max="100" inputmode="numeric" value="${escapeHtml(profile.apparentAge || '')}" required />
          </div>
          <div class="field">
            <label for="confirm-gender">성별 선택</label>
            <select id="confirm-gender" name="gender">
              <option value="unknown" ${gender === 'unknown' ? 'selected' : ''}>선택 안 함</option>
              <option value="female" ${gender === 'female' ? 'selected' : ''}>여성</option>
              <option value="male" ${gender === 'male' ? 'selected' : ''}>남성</option>
            </select>
          </div>
        </div>
        <div class="actions">
          <button class="btn orange" type="submit">이 값으로 상품 보기</button>
          <button class="btn secondary" type="button" id="retry-camera">${COPY.retryButton}</button>
        </div>
      </form>
    </section>
  `);

  document.querySelector('#confirm-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const numericAge = recommendationAge(form.get('age'));
    const confirmedProfile = {
      apparentAge: numericAge,
      ageBucket: ageBucket(numericAge),
      apparentGender: form.get('gender') || 'unknown',
      genderConfidence: 1,
      faceConfidence: profile.faceConfidence,
      uncertainReason: '',
      confirmed: true,
    };
    currentProfile = confirmedProfile;
    renderResult(confirmedProfile, 'confirmed');
  });
  document.querySelector('#retry-camera').addEventListener('click', handleStartCamera);
}

function renderFallback(reason, partialProfile = null) {
  stopActiveCamera();
  const age = partialProfile?.apparentAge || '';
  const gender = partialProfile?.apparentGender && partialProfile.apparentGender !== 'unknown' ? partialProfile.apparentGender : 'unknown';
  baseShell(`
    <section class="card center-card">
      <p class="eyebrow">수동 입력</p>
      <h1 class="page-title">${COPY.fallbackTitle}</h1>
      <p class="muted">${COPY.fallbackBody}</p>
      <div class="notice compact">사유: ${escapeHtml(reason)}</div>
      <form id="manual-form" class="form-grid">
        <div class="field">
          <label for="manual-age">나이</label>
          <input id="manual-age" name="age" type="number" min="20" max="100" inputmode="numeric" value="${escapeHtml(age)}" required />
        </div>
        <div class="field">
          <label for="manual-gender">성별 선택</label>
          <select id="manual-gender" name="gender">
            <option value="unknown" ${gender === 'unknown' ? 'selected' : ''}>선택 안 함</option>
            <option value="female" ${gender === 'female' ? 'selected' : ''}>여성</option>
            <option value="male" ${gender === 'male' ? 'selected' : ''}>남성</option>
          </select>
        </div>
        <div class="actions">
          <button class="btn orange" type="submit">상품 보기</button>
          <button class="btn secondary" type="button" id="retry-camera">${COPY.retryButton}</button>
        </div>
      </form>
    </section>
  `);
  document.querySelector('#manual-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const numericAge = recommendationAge(form.get('age'));
    const profile = {
      apparentAge: numericAge,
      ageBucket: ageBucket(numericAge),
      apparentGender: form.get('gender') || 'unknown',
      genderConfidence: 1,
      faceConfidence: 0,
      uncertainReason: '',
      manual: true,
    };
    currentProfile = profile;
    renderResult(profile, 'manual');
  });
  document.querySelector('#retry-camera').addEventListener('click', handleStartCamera);
}

function renderResult(profile, source) {
  const bucketLabel = ageBucketLabel(profile.ageBucket);
  const enrichedProfile = { ...profile, ageBucketLabel: bucketLabel };
  const items = recommend(enrichedProfile);
  const sourceLabel = source === 'manual' ? '수동 입력' : source === 'confirmed' ? '추정값 확인' : COPY.estimateBadge;
  const isConfirmed = isUserConfirmedSource(source);

  baseShell(`
    <section class="stage">
      <div class="card result-hero">
        <p class="eyebrow">${sourceLabel}</p>
        <h1 class="page-title">추천 상품 ${items.length}가지를 보여드립니다</h1>
      </div>
      <div class="result-grid">
        <aside class="card profile-card">
          <span class="badge">${sourceLabel}</span>
          <h2>분석/입력 정보</h2>
          <div class="metric"><b>나이</b><span>${profile.apparentAge ? `${profile.apparentAge}세` : '미확인'}</span></div>
          <div class="metric"><b>연령대</b><span>${bucketLabel}</span></div>
          <div class="metric"><b>성별</b><span>${isConfirmed ? manualGenderLabel(profile.apparentGender) : genderLabel(profile.apparentGender)}</span></div>
          <div class="actions">
            <button class="btn secondary" id="edit-manual">수정하기</button>
            <button class="btn secondary" id="home">${COPY.resetButton}</button>
          </div>
        </aside>
        <div class="product-grid">
          ${items.map((product) => renderProductCard(product, enrichedProfile)).join('')}
        </div>
      </div>
    </section>
  `);
  document.querySelector('#edit-manual').addEventListener('click', () => renderFallback('사용자가 결과 수정을 선택했습니다.', currentProfile));
  document.querySelector('#home').addEventListener('click', renderIntro);
}

function renderProductCard(product, profile) {
  const thumbnailTone = productThumbnailTone(product.thumbnailTone);
  const thumbnailTitle = product.thumbnailIcon || product.category;

  return `
    <article class="product-card">
      <div class="product-thumbnail product-thumbnail--${thumbnailTone}" aria-hidden="true">
        <div class="thumbnail-copy">
          <span class="thumbnail-brand">HANWHA</span>
          <strong>${escapeHtml(thumbnailTitle)}</strong>
        </div>
        ${productThumbnailArt(product.id)}
      </div>
      <div class="product-topline">
        <div class="category">${escapeHtml(product.category)}</div>
        <span>추천 상품</span>
      </div>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.summary)}</p>
      <p class="muted">${escapeHtml(recommendationReason(product, profile))}</p>
      <p class="caveat">${escapeHtml(product.caveat)}</p>
      <a class="source-link" href="${escapeHtml(product.sourceUrl)}" target="_blank" rel="noreferrer noopener">
        ${COPY.productSourceLabel} · ${escapeHtml(product.sourceLabel)} · 확인일 ${escapeHtml(product.sourceCheckedAt)}
      </a>
    </article>
  `;
}

const THUMBNAIL_TONES = new Set(['orange', 'blue', 'purple', 'green', 'pink', 'teal', 'sky', 'navy', 'gold']);

function productThumbnailTone(tone) {
  return THUMBNAIL_TONES.has(tone) ? tone : 'orange';
}

function productThumbnailArt(productId) {
  switch (productId) {
    case 'direct-driver':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M39 129C61 118 100 113 139 116C185 119 219 125 242 137H35C29 137 28 132 39 129Z"/>
          <path class="thumb-road" d="M38 119C76 96 128 95 223 111"/>
          <path class="thumb-fill" d="M76 77C84 55 98 43 124 43H164C184 43 197 53 206 77L223 82C232 85 237 93 237 103V114H55V99C55 90 61 83 70 81L76 77Z"/>
          <path class="thumb-light" d="M95 76L104 58H161C173 58 181 63 188 76H95Z"/>
          <circle class="thumb-dark" cx="91" cy="114" r="18"/>
          <circle class="thumb-dark" cx="197" cy="114" r="18"/>
          <circle class="thumb-white" cx="91" cy="114" r="7"/>
          <circle class="thumb-white" cx="197" cy="114" r="7"/>
          <path class="thumb-line" d="M51 92H29M49 104H19M231 76H245" />
        </svg>`;
    case 'direct-cancer':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M70 130C104 116 178 116 221 133H63C54 133 57 132 70 130Z"/>
          <path class="thumb-shield" d="M139 22L210 46V86C210 115 181 133 139 141C97 133 68 115 68 86V46L139 22Z"/>
          <path class="thumb-fill" d="M129 45C108 46 96 60 98 78C100 94 115 101 130 91C121 110 129 124 142 122C155 120 159 105 148 91C165 102 181 94 182 78C183 60 169 45 148 45C144 45 141 47 139 50C137 47 134 45 129 45Z"/>
          <path class="thumb-line" d="M139 52C131 65 128 78 139 92C150 78 147 65 139 52Z"/>
          <circle class="thumb-white" cx="89" cy="43" r="8"/>
          <circle class="thumb-white soft" cx="205" cy="34" r="5"/>
        </svg>`;
    case 'medical-indemnity':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M57 132C92 117 177 117 226 134H48C40 134 43 132 57 132Z"/>
          <path class="thumb-shield" d="M137 19L205 43V82C205 112 177 132 137 139C97 132 69 112 69 82V43L137 19Z"/>
          <rect class="thumb-white" x="121" y="50" width="32" height="78" rx="8"/>
          <rect class="thumb-white" x="98" y="73" width="78" height="32" rx="8"/>
          <path class="thumb-line" d="M68 112L50 126M205 39L225 26M216 67L238 63"/>
          <circle class="thumb-fill" cx="96" cy="39" r="13"/>
        </svg>`;
    case 'signature-women-health':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M56 132C94 118 179 119 221 135H49C39 135 42 133 56 132Z"/>
          <circle class="thumb-white soft" cx="137" cy="70" r="54"/>
          <path class="thumb-fill" d="M137 36C121 36 111 47 111 61C111 79 128 89 137 98C146 89 163 79 163 61C163 47 153 36 137 36Z"/>
          <path class="thumb-dark" d="M137 100C153 100 165 111 166 129H108C109 111 121 100 137 100Z"/>
          <circle class="thumb-white" cx="137" cy="66" r="19"/>
          <path class="thumb-line" d="M96 48C87 57 83 68 85 83M181 47C190 59 193 73 189 88"/>
        </svg>`;
    case 'direct-fire':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M53 133C91 118 181 119 226 136H46C36 136 39 134 53 133Z"/>
          <path class="thumb-white" d="M75 77L139 32L203 77V130H75V77Z"/>
          <path class="thumb-dark" d="M139 32L213 84L205 95L139 49L73 95L65 84L139 32Z"/>
          <rect class="thumb-fill" x="117" y="88" width="38" height="42" rx="7"/>
          <path class="thumb-flame" d="M198 100C209 87 204 75 196 66C197 78 184 82 184 97C184 110 194 119 207 119C219 119 228 110 228 98C228 88 222 81 215 75C217 91 206 92 198 100Z"/>
          <path class="thumb-line" d="M91 92H110M166 92H185"/>
        </svg>`;
    case 'direct-dental':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M72 131C108 118 178 118 220 134H62C53 134 57 132 72 131Z"/>
          <path class="thumb-white" d="M102 35C117 27 129 36 138 36C147 36 159 27 174 35C197 46 194 80 184 105C176 126 162 140 151 134C143 130 145 107 138 107C131 107 133 130 125 134C114 140 100 126 92 105C82 80 79 46 102 35Z"/>
          <path class="thumb-fill" d="M113 61C123 66 132 67 142 66C153 66 164 62 173 55"/>
          <path class="thumb-line" d="M75 52L55 43M199 50L220 39M74 92L49 97M204 92L227 98"/>
          <circle class="thumb-fill" cx="190" cy="29" r="10"/>
        </svg>`;
    case 'direct-travel':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M46 132C80 119 175 118 232 136H40C30 136 33 134 46 132Z"/>
          <path class="thumb-white soft" d="M64 73C67 59 80 51 94 56C102 42 124 39 135 55C146 51 162 58 163 73H64Z"/>
          <path class="thumb-fill" d="M68 95L221 41C230 38 237 47 230 54L185 99L194 132L181 137L162 113L125 124L113 111L151 87L110 76L97 56L142 71L201 49L64 83L68 95Z"/>
          <path class="thumb-line" d="M48 104C76 98 101 99 124 105M175 35C189 26 205 25 222 30"/>
          <circle class="thumb-white" cx="78" cy="37" r="8"/>
        </svg>`;
    case 'comprehensive-health':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M59 132C97 118 176 118 224 136H50C40 136 43 134 59 132Z"/>
          <path class="thumb-shield" d="M137 19L207 44V84C207 114 178 134 137 141C96 134 67 114 67 84V44L137 19Z"/>
          <path class="thumb-fill" d="M137 116C134 112 99 89 99 63C99 48 109 38 123 38C131 38 136 43 137 48C139 43 144 38 152 38C166 38 176 48 176 63C176 89 141 112 137 116Z"/>
          <path class="thumb-white" d="M133 62H145V78H161V90H145V106H133V90H117V78H133V62Z"/>
          <path class="thumb-line" d="M73 99L50 112M207 38L225 24"/>
        </svg>`;
    case 'senior-care':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M61 133C97 119 179 119 223 136H52C42 136 45 134 61 133Z"/>
          <circle class="thumb-white soft" cx="142" cy="63" r="45"/>
          <circle class="thumb-fill" cx="124" cy="58" r="17"/>
          <circle class="thumb-dark" cx="167" cy="58" r="17"/>
          <path class="thumb-fill" d="M90 119C95 95 111 82 128 82C139 82 147 87 151 96C144 103 139 112 137 125H90V119Z"/>
          <path class="thumb-dark" d="M142 125C145 101 160 82 178 82C197 82 210 96 214 125H142Z"/>
          <path class="thumb-white" d="M73 102C96 106 111 115 121 130C96 132 77 124 65 109C62 105 68 101 73 102Z"/>
          <path class="thumb-white" d="M222 102C199 106 184 115 174 130C199 132 218 124 230 109C233 105 227 101 222 102Z"/>
        </svg>`;
    case 'direct-golf':
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M54 131C93 117 178 119 228 136H46C37 136 40 133 54 131Z"/>
          <path class="thumb-line" d="M149 28V123"/>
          <path class="thumb-fill" d="M149 31L211 47L149 64V31Z"/>
          <path class="thumb-white" d="M71 125C91 107 121 98 151 100C181 102 205 112 224 126H71Z"/>
          <circle class="thumb-white" cx="104" cy="107" r="15"/>
          <circle class="thumb-dark" cx="104" cy="107" r="4"/>
          <path class="thumb-fill" d="M193 127C193 116 183 109 171 109C158 109 149 116 149 127H193Z"/>
        </svg>`;
    default:
      return `
        <svg class="thumbnail-art" viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="thumb-shadow" d="M58 132C96 118 177 118 224 136H50C40 136 43 134 58 132Z"/>
          <path class="thumb-shield" d="M137 19L207 44V84C207 114 178 134 137 141C96 134 67 114 67 84V44L137 19Z"/>
          <path class="thumb-white" d="M133 57H145V78H166V90H145V111H133V90H112V78H133V57Z"/>
        </svg>`;
  }
}

function stopActiveCamera() {
  if (stream) {
    stopCamera(stream);
    stream = null;
  }
}

window.addEventListener('beforeunload', stopActiveCamera);
renderIntro();
