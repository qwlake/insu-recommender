export function isCameraSupported() {
  return Boolean(navigator.mediaDevices?.getUserMedia);
}

export async function startCamera(videoElement) {
  if (!isCameraSupported()) {
    throw new Error('unsupported-camera');
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
      width: { ideal: 960 },
      height: { ideal: 720 },
    },
    audio: false,
  });

  videoElement.srcObject = stream;
  videoElement.muted = true;
  videoElement.playsInline = true;
  await videoElement.play();
  return stream;
}

export function stopCamera(streamOrVideo) {
  const stream = streamOrVideo?.getTracks ? streamOrVideo : streamOrVideo?.srcObject;
  if (stream?.getTracks) {
    for (const track of stream.getTracks()) track.stop();
  }
  if (streamOrVideo?.srcObject) streamOrVideo.srcObject = null;
}

export function describeCameraError(error) {
  const name = error?.name || error?.message || '';
  if (name.includes('NotAllowed') || name.includes('Permission')) return '카메라 권한이 허용되지 않았습니다.';
  if (name.includes('NotFound') || name.includes('DevicesNotFound')) return '사용 가능한 카메라를 찾지 못했습니다.';
  if (name.includes('unsupported-camera')) return '이 브라우저에서는 카메라 API를 사용할 수 없습니다.';
  return '카메라를 준비하는 중 문제가 발생했습니다.';
}
