import * as turf from '@turf/turf';
import type { SamplingPoint } from '../types/plan';
import { isInsidePolygon, satisfiesMinDistance } from './common';

export function generateSSUS(
  polygon: GeoJSON.Feature<GeoJSON.Polygon>,
  count: number,
  minDistance: number
): SamplingPoint[] {
  if (count <= 0) return [];

  const [minLng, minLat, maxLng, maxLat] = turf.bbox(polygon);

  // Compute real-world dimensions to get proper aspect ratio
  const widthM = turf.distance([minLng, minLat], [maxLng, minLat], { units: 'meters' });
  const heightM = turf.distance([minLng, minLat], [minLng, maxLat], { units: 'meters' });

  if (widthM === 0 || heightM === 0) return [];

  // Determine grid dimensions so rows * cols ≈ count, respecting aspect ratio
  const aspect = widthM / heightM;
  let cols = Math.max(1, Math.round(Math.sqrt(count * aspect)));
  let rows = Math.max(1, Math.round(count / cols));

  const cellW = (maxLng - minLng) / cols;
  const cellH = (maxLat - minLat) / rows;

  // Generate one random x-offset per column and one random y-offset per row
  const xOffsets = Array.from({ length: cols }, () => Math.random() * cellW);
  const yOffsets = Array.from({ length: rows }, () => Math.random() * cellH);

  const points: SamplingPoint[] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const candidate: SamplingPoint = {
        lng: minLng + j * cellW + xOffsets[j],
        lat: minLat + i * cellH + yOffsets[i],
      };

      if (
        isInsidePolygon(candidate, polygon) &&
        satisfiesMinDistance(candidate, points, minDistance)
      ) {
        points.push(candidate);
      }
    }
  }

  return points.slice(0, count);
}
