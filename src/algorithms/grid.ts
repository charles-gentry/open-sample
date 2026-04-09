import * as turf from '@turf/turf';
import type { SamplingPoint } from '../types/plan';

export function generateGrid(
  polygon: GeoJSON.Feature<GeoJSON.Polygon>,
  count: number
): SamplingPoint[] {
  const area = turf.area(polygon);
  let cellSize = Math.sqrt(area / count);

  // Iteratively adjust cell size to converge on target count
  for (let iteration = 0; iteration < 10; iteration++) {
    const grid = turf.pointGrid(turf.bbox(polygon), cellSize / 1000, {
      units: 'kilometers',
    });

    const filtered = grid.features.filter((pt) =>
      turf.booleanPointInPolygon(pt, polygon)
    );

    if (Math.abs(filtered.length - count) <= Math.max(1, count * 0.1)) {
      return filtered.slice(0, count).map((f) => ({
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
      }));
    }

    if (filtered.length > count) {
      cellSize *= 1.1;
    } else {
      cellSize *= 0.9;
    }
  }

  // Final attempt with current cell size
  const grid = turf.pointGrid(turf.bbox(polygon), cellSize / 1000, {
    units: 'kilometers',
  });
  const filtered = grid.features.filter((pt) =>
    turf.booleanPointInPolygon(pt, polygon)
  );
  return filtered.slice(0, count).map((f) => ({
    lng: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
  }));
}
