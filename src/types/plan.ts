export type SamplingType = 'random' | 'grid' | 'clustered' | 'w';

export interface SamplingParams {
  name: string;
  count: number;
  type: SamplingType;
  minDistance: number; // meters
  clusterCount?: number; // only used when type === 'clustered'
  minClusterDistance?: number; // only used when type === 'clustered'
}

export interface SamplingPoint {
  lng: number;
  lat: number;
}

export interface SamplingPlan {
  params: SamplingParams;
  polygon: GeoJSON.Feature<GeoJSON.Polygon> | null;
  points: SamplingPoint[];
}

export interface SharePayload {
  v: 1;
  n: string;
  p: [number, number][]; // [lng, lat] pairs
  t: 'r' | 'g' | 'c' | 'w';
  d?: string; // target sample date (ISO date string)
}
