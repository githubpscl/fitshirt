// Matching algorithm: finds the best shirt pattern for given body measurements
// and fit preference. Three phases: filter by fit group, weighted distance score,
// fine-tune shirt length and sleeve length based on body height/arm length.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PATTERNS_PATH = join(__dirname, '..', 'data', 'patterns.json');

let patternsCache = null;

export async function loadPatterns() {
  if (patternsCache) return patternsCache;
  const raw = await readFile(PATTERNS_PATH, 'utf8');
  patternsCache = JSON.parse(raw);
  return patternsCache;
}

// Weights for the distance score. Only fields where the customer measurement
// and the shirt pattern measurement use the same unit/semantic are scored here.
// backLength, armLength, neck are derived from body height / arm length in
// Phase 3 instead — comparing them directly would mix unrelated quantities
// (customer's neck-to-waist length vs shirt top-to-bottom length, etc).
const WEIGHTS = {
  chest: 0.42,
  shoulder: 0.30,
  upperArm: 0.18,
  waist: 0.10,
};

// Ease values per fit group (extra cm shirt vs body) for the scored fields.
const EASE_VALUES = {
  slim:      { chest: 3,  shoulder: 1, upperArm: 2, waist: 4 },
  athletic:  { chest: 6,  shoulder: 2, upperArm: 3, waist: 6 },
  regular:   { chest: 10, shoulder: 2, upperArm: 4, waist: 12 },
  relaxed:   { chest: 16, shoulder: 3, upperArm: 6, waist: 18 },
  oversized: { chest: 24, shoulder: 4, upperArm: 8, waist: 24 },
};

// Length offsets in cm
const LENGTH_OFFSETS = {
  kurz: -3,
  normal: 0,
  lang: 3,
};

// Maps customer measurement key to shirt pattern key
const KEY_MAP = {
  chest: 'chest',
  shoulder: 'shoulder',
  upperArm: 'upperArm',
  waist: 'waist',
};

function calculateScore(measurements, pattern, fitPreference) {
  const ease = EASE_VALUES[fitPreference] || EASE_VALUES.regular;
  let totalScore = 0;

  for (const [bodyKey, weight] of Object.entries(WEIGHTS)) {
    const shirtKey = KEY_MAP[bodyKey];
    const customerTarget = (measurements[bodyKey] || 0) + (ease[bodyKey] || 0);
    const patternValue = pattern[shirtKey];
    if (patternValue == null) continue;
    const diff = Math.abs(patternValue - customerTarget);
    totalScore += weight * diff;
  }

  return totalScore;
}

function confidenceFromScore(score) {
  if (score < 2.5) return 'high';
  if (score < 5.5) return 'medium';
  return 'low';
}

// Convert internal distance score (~0..15) to a "match %" the customer sees.
function scoreToPercent(score) {
  const pct = Math.max(50, Math.round(100 - score * 5));
  return Math.min(100, pct);
}

export async function findMatch({
  measurements,
  fitPreference,
  sleeveType = 'kurzarm',
  lengthPreference = 'normal',
}) {
  if (!measurements) throw new Error('measurements required');
  if (!fitPreference) throw new Error('fitPreference required');

  const patterns = await loadPatterns();

  // Phase 1: filter by fit group, fall back to all if empty
  let pool = patterns.filter((p) => p.fitGroup === fitPreference);
  if (pool.length === 0) pool = patterns;

  // Phase 2: score every pattern
  const scored = pool
    .map((p) => {
      const score = calculateScore(measurements, p, fitPreference);
      return { pattern: p, score };
    })
    .sort((a, b) => a.score - b.score);

  const best = scored[0];
  const alternatives = scored.slice(1, 4).map((s) => ({
    patternId: s.pattern.id,
    patternName: s.pattern.name,
    matchScore: scoreToPercent(s.score),
    fitGroup: s.pattern.fitGroup,
  }));

  // Phase 3: fine-tune length and sleeve length
  const bodyHeight = measurements.height || 175;
  const armLengthCustomer = measurements.armLength || 60;
  const offset = LENGTH_OFFSETS[lengthPreference] ?? 0;
  const tunedBackLength = Math.round((bodyHeight * 0.42 + offset) * 10) / 10;
  const tunedSleeveLength = sleeveType === 'langarm'
    ? Math.round(armLengthCustomer * 0.92 * 10) / 10
    : Math.round(armLengthCustomer * 0.35 * 10) / 10;

  const shirtMeasurements = {
    chest: best.pattern.chest,
    shoulder: best.pattern.shoulder,
    upperArm: best.pattern.upperArm,
    armLength: tunedSleeveLength,
    backLength: tunedBackLength,
    neckWidth: best.pattern.neckWidth,
    waist: best.pattern.waist,
  };

  // Outlier detection: customer measurements far from any pattern -> low confidence
  const isOutlier = best.score > 7;

  return {
    patternId: best.pattern.id,
    patternName: best.pattern.name,
    matchScore: scoreToPercent(best.score),
    rawScore: Math.round(best.score * 100) / 100,
    shirtMeasurements,
    fitGroup: best.pattern.fitGroup,
    confidence: confidenceFromScore(best.score),
    alternatives,
    outlier: isOutlier,
    notes: best.pattern.notes,
  };
}
