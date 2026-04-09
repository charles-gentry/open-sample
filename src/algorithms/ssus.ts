import * as turf from '@turf/turf';
import type { SamplingPoint } from '../types/plan';
import { isInsidePolygon, satisfiesMinDistance } from './common';

function computeGrid(polygon: GeoJSON.Feature<GeoJSON.Polygon>, count: number) {
  const [minLng, minLat, maxLng, maxLat] = turf.bbox(polygon);

  const widthM = turf.distance([minLng, minLat], [maxLng, minLat], { units: 'meters' });
  const heightM = turf.distance([minLng, minLat], [minLng, maxLat], { units: 'meters' });

  // Oversample: polygon may cover only a fraction of its bounding box
  const bboxArea = widthM * heightM;
  const polyArea = turf.area(polygon);
  const coverage = Math.max(0.1, Math.min(1, polyArea / bboxArea));
  const targetCells = Math.ceil(count / coverage);

  const aspect = widthM / heightM;
  const cols = Math.max(1, Math.round(Math.sqrt(targetCells * aspect)));
  const rows = Math.max(1, Math.round(targetCells / cols));

  const cellW = (maxLng - minLng) / cols;
  const cellH = (maxLat - minLat) / rows;

  return { minLng, minLat, maxLng, maxLat, widthM, heightM, cols, rows, cellW, cellH };
}

export function generateSSUS(
  polygon: GeoJSON.Feature<GeoJSON.Polygon>,
  count: number,
  minDistance: number
): SamplingPoint[] {
  if (count <= 0) return [];

  const grid = computeGrid(polygon, count);
  if (grid.widthM === 0 || grid.heightM === 0) return [];

  const { minLng, minLat, cols, rows, cellW, cellH } = grid;

  // SSUS: x-offset varies per ROW, y-offset varies per COLUMN.
  // This breaks alignment — points in the same column get different x-offsets
  // (one per row) and points in the same row get different y-offsets (one per column).
  const xOffsets = Array.from({ length: rows }, () => Math.random() * cellW);
  const yOffsets = Array.from({ length: cols }, () => Math.random() * cellH);

  const points: SamplingPoint[] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const candidate: SamplingPoint = {
        lng: minLng + j * cellW + xOffsets[i],
        lat: minLat + i * cellH + yOffsets[j],
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

export function buildSSUSGridLines(
  polygon: GeoJSON.Feature<GeoJSON.Polygon>,
  count: number
): GeoJSON.FeatureCollection {
  if (count <= 0) return { type: 'FeatureCollection', features: [] };

  const grid = computeGrid(polygon, count);
  const { minLng, minLat, maxLng, maxLat, cols, rows, cellW, cellH } = grid;

  const features: GeoJSON.Feature[] = [];

  // Vertical lines
  for (let j = 0; j <= cols; j++) {
    const lng = minLng + j * cellW;
    features.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [[lng, minLat], [lng, maxLat]],
      },
    });
  }

  // Horizontal lines
  for (let i = 0; i <= rows; i++) {
    const lat = minLat + i * cellH;
    features.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [[minLng, lat], [maxLng, lat]],
      },
    });
  }

  return { type: 'FeatureCollection', features };
}
