import { describe, expect, it } from 'vitest';
import { HUMAN_CONFIG, summarizeFaceSamples } from '../src/faceAnalyzer.js';

describe('face analyzer config', () => {
  it('enables the Human face description model used for age and gender', () => {
    expect(HUMAN_CONFIG.face.description.enabled).toBe(true);
  });

  it('enables face mesh so the guided scan can detect head direction', () => {
    expect(HUMAN_CONFIG.face.mesh.enabled).toBe(true);
  });

  it('does not rely on unsupported separate age/gender face config keys', () => {
    expect(HUMAN_CONFIG.face).not.toHaveProperty('age');
    expect(HUMAN_CONFIG.face).not.toHaveProperty('gender');
  });

  it('does not return face tensors because this app never needs raw face images', () => {
    expect(HUMAN_CONFIG.face.detector.return).toBe(false);
  });

  it('uses a realistic gender confidence threshold aligned with the Human model config', () => {
    expect(HUMAN_CONFIG.face.description.minConfidence).toBe(0.15);
  });
});

describe('summarizeFaceSamples', () => {
  it('aggregates several frames instead of failing on one weak frame', () => {
    const profile = summarizeFaceSamples([
      { age: 32, gender: 'female', genderScore: 0.16, boxScore: 0.81, faceScore: 0.74 },
      { age: 35, gender: 'female', genderScore: 0.22, boxScore: 0.84, faceScore: 0.76 },
      { age: 34, gender: 'unknown', genderScore: 0, boxScore: 0.78, faceScore: 0.73 },
      { age: 33, gender: 'female', genderScore: 0.18, boxScore: 0.82, faceScore: 0.75 },
    ], 5);

    expect(profile.apparentAge).toBe(34);
    expect(profile.apparentGender).toBe('female');
    expect(profile.genderConfidence).toBe(0.22);
    expect(profile.uncertainReason).toBe('');
  });

  it('still reports a clear fallback reason when no face is found', () => {
    const profile = summarizeFaceSamples([], 5);
    expect(profile).toMatchObject({
      apparentAge: null,
      ageBucket: 'unknown',
      apparentGender: 'unknown',
      uncertainReason: '얼굴을 찾지 못했습니다.',
    });
  });

  it('does not accept a gender below the configured minimum', () => {
    const profile = summarizeFaceSamples([
      { age: 41, gender: 'male', genderScore: 0.12, boxScore: 0.8, faceScore: 0.7 },
    ], 5);

    expect(profile.apparentGender).toBe('unknown');
    expect(profile.uncertainReason).toContain('성별 추정값을 확정하기 어렵습니다.');
  });

  it('prefers a repeated adult age cluster over an under-20-biased median during scan', () => {
    const profile = summarizeFaceSamples([
      { age: 17, gender: 'male', genderScore: 0.63, boxScore: 0.78 },
      { age: 17, gender: 'male', genderScore: 0.55, boxScore: 0.8 },
      { age: 17, gender: 'male', genderScore: 0.58, boxScore: 0.79 },
      { age: 16, gender: 'male', genderScore: 0.53, boxScore: 0.81 },
      { age: 29, gender: 'male', genderScore: 0.16, boxScore: 0.78 },
      { age: 16, gender: 'male', genderScore: 0.47, boxScore: 0.88 },
      { age: 16, gender: 'male', genderScore: 0.46, boxScore: 0.83 },
      { age: 29, gender: 'male', genderScore: 0.32, boxScore: 0.83 },
      { age: 29, gender: 'male', genderScore: 0.26, boxScore: 0.81 },
      { age: 16, gender: 'male', genderScore: 0.49, boxScore: 0.77 },
      { age: 16, gender: 'male', genderScore: 0.52, boxScore: 0.79 },
      { age: 16, gender: 'male', genderScore: 0.38, boxScore: 0.88 },
      { age: 16, gender: 'male', genderScore: 0.51, boxScore: 0.87 },
      { age: 16, gender: 'male', genderScore: 0.53, boxScore: 0.88 },
      { age: 16, gender: 'male', genderScore: 0.36, boxScore: 0.79 },
    ], 20);

    expect(profile.apparentAge).toBe(29);
  });

  it('uses a repeated adult cluster even when the guided scan collected many under-20-biased frames', () => {
    const profile = summarizeFaceSamples([
      { age: 17, gender: 'male', genderScore: 0.77, boxScore: 0.88, faceScore: 1 },
      { age: 17, gender: 'male', genderScore: 0.74, boxScore: 0.89, faceScore: 1 },
      { age: 17, gender: 'male', genderScore: 0.83, boxScore: 0.88, faceScore: 1 },
      { age: 17, gender: 'male', genderScore: 0.85, boxScore: 0.89, faceScore: 1 },
      { age: 17, gender: 'male', genderScore: 0.71, boxScore: 0.88, faceScore: 1 },
      { age: 16, gender: 'male', genderScore: 0.39, boxScore: 0.9, faceScore: 1 },
      { age: 16, gender: 'male', genderScore: 0.39, boxScore: 0.93, faceScore: 1 },
      { age: 16, gender: 'male', genderScore: 0.44, boxScore: 0.93, faceScore: 1 },
      { age: 16, gender: 'male', genderScore: 0.3, boxScore: 0.93, faceScore: 1 },
      { age: 16, gender: 'unknown', genderScore: 0, boxScore: 0.88, faceScore: 1 },
      { age: 17, gender: 'male', genderScore: 0.7, boxScore: 0.9, faceScore: 1 },
      { age: 29, gender: 'male', genderScore: 0.27, boxScore: 0.93, faceScore: 1 },
      { age: 29, gender: 'male', genderScore: 0.2, boxScore: 0.93, faceScore: 1 },
      { age: 16, gender: 'male', genderScore: 0.17, boxScore: 0.92, faceScore: 1 },
      { age: 29, gender: 'unknown', genderScore: 0, boxScore: 0.92, faceScore: 1 },
      { age: 16, gender: 'male', genderScore: 0.69, boxScore: 0.92, faceScore: 1 },
      { age: 17, gender: 'male', genderScore: 0.9, boxScore: 0.9, faceScore: 1 },
    ], 12);

    expect(profile.apparentAge).toBe(29);
  });

  it('displays under-20-biased face inference as the 20s minimum', () => {
    const profile = summarizeFaceSamples([
      { age: 16, gender: 'male', genderScore: 0.7, boxScore: 0.9, faceScore: 1 },
      { age: 16, gender: 'male', genderScore: 0.68, boxScore: 0.91, faceScore: 1 },
      { age: 17, gender: 'male', genderScore: 0.72, boxScore: 0.9, faceScore: 1 },
    ], 3);

    expect(profile.apparentAge).toBe(20);
    expect(profile.ageBucket).toBe('20s');
  });
});
