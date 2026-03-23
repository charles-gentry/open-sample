import { create } from 'zustand';
import type { SamplingParams, SamplingPoint } from '../types/plan';

interface PlanState {
  params: SamplingParams;
  polygon: GeoJSON.Feature<GeoJSON.Polygon> | null;
  points: SamplingPoint[];
  setParams: (params: Partial<SamplingParams>) => void;
  setPolygon: (polygon: GeoJSON.Feature<GeoJSON.Polygon> | null) => void;
  setPoints: (points: SamplingPoint[]) => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  params: {
    name: '',
    count: 10,
    type: 'random',
    minDistance: 50,
  },
  polygon: null,
  points: [],
  setParams: (params) =>
    set((state) => ({ params: { ...state.params, ...params } })),
  setPolygon: (polygon) => set({ polygon, points: [] }),
  setPoints: (points) => set({ points }),
}));
