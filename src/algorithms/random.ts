import * as turf from '@turf/turf';
import type { SamplingPoint } from '../types/plan';
import { satisfiesMinDistance, randomPointInBBox, isInsidePolygon } from './common';

export function generateRandom(
  polygon: GeoJSON.Feature<GeoJSON.Polygon>,
  count: number,
  minDistance: number
): SamplingPoint[] {
  const bbox = turf.bbox(polygon);
  const points: SamplingPoint[] = [];
  const maxAttempts = count * 200;
  let attempts = 0;

  while (points.length < count && attempts < maxAttempts) {
    attempts++;
    const candidate = randomPointInBBox(bbox);
    if (!isInsidePolygon(candidate, polygon)) continue;
    if (!satisfiesMinDistance(candidate, points, minDistance)) continue;
    points.push(candidate);
  }

  return points;
}
