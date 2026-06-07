export const VIEW = Object.freeze({
  INTRO: 'intro',
  LOADING_MODEL: 'loadingModel',
  CAMERA_READY: 'cameraReady',
  ANALYZING: 'analyzing',
  RESULT: 'result',
  FALLBACK: 'fallback',
  ERROR: 'error',
});

export function createInitialState() {
  return {
    view: VIEW.INTRO,
    stream: null,
    status: '',
    error: '',
    profile: null,
  };
}
