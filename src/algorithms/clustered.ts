import type { SamplingPoint } from '../types/plan';
import { generateRandom } from './random';
import { satisfiesMinDistance, isInsidePolygon } from './common';

function randomPointInCircle(center: SamplingPoint, radiusMeters: number): SamplingPoint {
  const r = radiusMeters * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;
  // Approximate meters to degrees
  const dLat = (r * Math.cos(theta)) / 111320;
  const dLng = (r * Math.sin(theta)) / (111320 * Math.cos((center.lat * Math.PI) / 180));
  return { lng: center.lng + dLng, lat: center.lat + dLat };
}

export function generateClustered(
  polygon: GeoJSON.Feature<GeoJSON.Polygon>,
  count: number,
  minDistance: number
): SamplingPoint[] {
  const k = Math.max(2, Math.ceil(count / 5));
  const centers = generateRandom(polygon, k, minDistance * 3);

  if (centers.length === 0) return [];

  const points: SamplingPoint[] = [];
  const pointsPerCluster = Math.ceil(count / centers.length);
  const clusterRadius = Math.max(minDistance * 3, 100);

  for (const center of centers) {
    let added = 0;
    let attempts = 0;
    while (added < pointsPerCluster && points.length < count && attempts < 200) {
      attempts++;
      const candidate = randomPointInCircle(center, clusterRadius);
      if (!isInsidePolygon(candidate, polygon)) continue;
      if (!satisfiesMinDistance(candidate, points, minDistance)) continue;
      points.push(candidate);
      added++;
    }
  }

  return points;
}
