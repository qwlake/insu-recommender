import { describe, expect, it } from 'vitest';
import { ageBucket, AGE_BUCKETS } from '../src/utils/ageBucket.js';

describe('ageBucket', () => {
  it.each([
    [-1, AGE_BUCKETS.UNKNOWN],
    [0, AGE_BUCKETS.TWENTIES],
    [19, AGE_BUCKETS.TWENTIES],
    [20, AGE_BUCKETS.TWENTIES],
    [29, AGE_BUCKETS.TWENTIES],
    [30, AGE_BUCKETS.THIRTIES],
    [39, AGE_BUCKETS.THIRTIES],
    [40, AGE_BUCKETS.FORTIES],
    [49, AGE_BUCKETS.FORTIES],
    [50, AGE_BUCKETS.FIFTIES],
    [59, AGE_BUCKETS.FIFTIES],
    [60, AGE_BUCKETS.SIXTIES_PLUS],
    ['x', AGE_BUCKETS.UNKNOWN],
  ])('maps %s to %s', (age, expected) => {
    expect(ageBucket(age)).toBe(expected);
  });
});
