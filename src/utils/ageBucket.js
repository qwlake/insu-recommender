export const AGE_BUCKETS = Object.freeze({
  TWENTIES: '20s',
  THIRTIES: '30s',
  FORTIES: '40s',
  FIFTIES: '50s',
  SIXTIES_PLUS: '60plus',
  UNKNOWN: 'unknown',
});

export function ageBucket(age) {
  const numericAge = Number(age);
  if (!Number.isFinite(numericAge) || numericAge < 0) return AGE_BUCKETS.UNKNOWN;
  if (numericAge < 30) return AGE_BUCKETS.TWENTIES;
  if (numericAge < 40) return AGE_BUCKETS.THIRTIES;
  if (numericAge < 50) return AGE_BUCKETS.FORTIES;
  if (numericAge < 60) return AGE_BUCKETS.FIFTIES;
  return AGE_BUCKETS.SIXTIES_PLUS;
}

export function ageBucketLabel(bucket) {
  return ({
    [AGE_BUCKETS.TWENTIES]: '20대',
    [AGE_BUCKETS.THIRTIES]: '30대',
    [AGE_BUCKETS.FORTIES]: '40대',
    [AGE_BUCKETS.FIFTIES]: '50대',
    [AGE_BUCKETS.SIXTIES_PLUS]: '60대 이상',
    [AGE_BUCKETS.UNKNOWN]: '연령대 미확인',
  })[bucket] || '연령대 미확인';
}
