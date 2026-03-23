import * as turf from '@turf/turf';
import type { SamplingPoint } from '../types/plan';

export function bearing(from: SamplingPoint, to: SamplingPoint): number {
  return turf.bearing([from.lng, from.lat], [to.lng, to.lat]);
}

export function distance(from: SamplingPoint, to: SamplingPoint): number {
  return turf.distance([from.lng, from.lat], [to.lng, to.lat], { units: 'meters' });
}

export function findNearest(
  current: SamplingPoint,
  candidates: SamplingPoint[]
): SamplingPoint | null {
  if (candidates.length === 0) return null;
  let nearest = candidates[0];
  let minDist = distance(current, nearest);
  for (let i = 1; i < candidates.length; i++) {
    const d = distance(current, candidates[i]);
    if (d < minDist) {
      minDist = d;
      nearest = candidates[i];
    }
  }
  return nearest;
}
