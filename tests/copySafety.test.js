import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { FACE_ANALYZER_PUBLIC_FIELDS } from '../src/faceAnalyzer.js';

const SRC_DIR = new URL('../src', import.meta.url).pathname;
const BANNED_COPY = [
  '정확한 맞춤 보장 판단',
  '가입 가능',
  '보험료 확인',
  '보험료 계산',
  '견적',
  '전화 상담',
  '상담 신청',
  '가입 신청',
];
const BANNED_FACE_KEYS = [
  'raw',
  'descriptor',
  'embedding',
  'tensor',
  'mesh',
  'race',
  'emotion',
  'canvas',
  'image',
  'frame',
  'blob',
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith('.js') || full.endsWith('.css') ? [full] : [];
  });
}

describe('copy and privacy safety', () => {
  it('does not contain high-risk conversion or suitability copy', () => {
    const combined = walk(SRC_DIR)
      .map((file) => readFileSync(file, 'utf8'))
      .join('\n');

    for (const phrase of BANNED_COPY) {
      expect(combined.includes(phrase), `${phrase} should not appear in app copy`).toBe(false);
    }
  });

  it('face analyzer public DTO allowlist is minimal', () => {
    expect(FACE_ANALYZER_PUBLIC_FIELDS).toEqual([
      'apparentAge',
      'ageBucket',
      'apparentGender',
      'genderConfidence',
      'faceConfidence',
      'uncertainReason',
    ]);
    for (const key of BANNED_FACE_KEYS) {
      expect(FACE_ANALYZER_PUBLIC_FIELDS.includes(key)).toBe(false);
    }
  });
});
