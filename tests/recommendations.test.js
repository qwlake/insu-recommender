import { describe, expect, it } from 'vitest';
import { recommend } from '../src/recommendations.js';
import { AGE_BUCKETS } from '../src/utils/ageBucket.js';
import { products } from '../src/products.js';

describe('recommend', () => {
  it('always returns 2 to 4 products for major age/gender combinations', () => {
    for (const bucket of Object.values(AGE_BUCKETS)) {
      for (const gender of ['female', 'male', 'unknown']) {
        const result = recommend({ ageBucket: bucket, apparentGender: gender });
        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result.length).toBeLessThanOrEqual(4);
      }
    }
  });

  it('does not show women-specific product for male or unknown gender', () => {
    for (const gender of ['male', 'unknown']) {
      const result = recommend({ ageBucket: AGE_BUCKETS.THIRTIES, apparentGender: gender });
      expect(result.some((product) => product.genderSpecific === 'female')).toBe(false);
    }
  });

  it('can show women-specific product when female is selected or inferred', () => {
    const result = recommend({ ageBucket: AGE_BUCKETS.THIRTIES, apparentGender: 'female' });
    expect(result.some((product) => product.genderSpecific === 'female')).toBe(true);
  });

  it('replaces cancer with medical indemnity for 20s and 30s', () => {
    for (const bucket of [AGE_BUCKETS.TWENTIES, AGE_BUCKETS.THIRTIES]) {
      const result = recommend({ ageBucket: bucket, apparentGender: 'male' });
      expect(result.some((product) => product.id === 'medical-indemnity')).toBe(true);
      expect(result.some((product) => product.id === 'direct-cancer')).toBe(false);
    }
  });

  it('uses distinct recommendations for 50s and 60plus', () => {
    const fifties = recommend({ ageBucket: AGE_BUCKETS.FIFTIES, apparentGender: 'male' }).map((product) => product.id);
    const sixtiesPlus = recommend({ ageBucket: AGE_BUCKETS.SIXTIES_PLUS, apparentGender: 'male' }).map((product) => product.id);

    expect(sixtiesPlus).toContain('senior-care');
    expect(sixtiesPlus).not.toContain('medical-indemnity');
    expect(sixtiesPlus).not.toEqual(fifties);
  });

  it('all products have required metadata', () => {
    for (const product of products) {
      expect(product).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        category: expect.any(String),
        thumbnailIcon: expect.any(String),
        thumbnailTone: expect.any(String),
        sourceUrl: expect.stringMatching(/^https:\/\//),
        sourceCheckedAt: expect.any(String),
        caveat: expect.any(String),
      });
    }
  });
});
