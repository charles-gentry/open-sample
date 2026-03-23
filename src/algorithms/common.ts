import * as turf from '@turf/turf';
import type { SamplingPoint } from '../types/plan';

export function satisfiesMinDistance(
  candidate: SamplingPoint,
  existing: SamplingPoint[],
  minDistance: number
): boolean {
  for (const pt of existing) {
    const dist = turf.distance(
      [candidate.lng, candidate.lat],
      [pt.lng, pt.lat],
      { units: 'meters' }
    );
    if (dist < minDistance) return false;
  }
  return true;
}

export function randomPointInBBox(bbox: ReturnType<typeof turf.bbox>): SamplingPoint {
  const lng = bbox[0] + Math.random() * (bbox[2] - bbox[0]);
  const lat = bbox[1] + Math.random() * (bbox[3] - bbox[1]);
  return { lng, lat };
}

export function isInsidePolygon(
  point: SamplingPoint,
  polygon: GeoJSON.Feature<GeoJSON.Polygon>
): boolean {
  return turf.booleanPointInPolygon([point.lng, point.lat], polygon);
}
