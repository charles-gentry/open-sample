export type SamplingType = 'random' | 'grid' | 'clustered';

export interface SamplingParams {
  name: string;
  count: number;
  type: SamplingType;
  minDistance: number; // meters
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
  t: 'r' | 'g' | 'c';
}
