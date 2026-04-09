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

  // Oversample: polygon may cover only a fraction of its bounding box,
  // so create more cells than count to ensure enough survive filtering
  const bboxArea = widthM * heightM;
  const polyArea = turf.area(polygon);
  const coverage = Math.max(0.1, Math.min(1, polyArea / bboxArea));
  const targetCells = Math.ceil(count / coverage);

  // Determine grid dimensions so rows * cols ≈ targetCells, respecting aspect ratio
  const aspect = widthM / heightM;
  const cols = Math.max(1, Math.round(Math.sqrt(targetCells * aspect)));
  const rows = Math.max(1, Math.round(targetCells / cols));

  const cellW = (maxLng - minLng) / cols;
  const cellH = (maxLat - minLat) / rows;

  // SSUS: one random x-offset per column, one random y-offset per row.
  // Points in the same column share an x-offset; points in the same row share a y-offset.
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
        if (points.length >= count) return points;
      }
    }
  }

  return points;
}
