import { create } from 'zustand';
import type { NavPoint, CompletionRecord } from '../types/navigation';
import type { GeoPosition } from '../hooks/useGeolocation';

interface NavState {
  planName: string;
  points: NavPoint[];
  completions: Map<number, CompletionRecord>;
  currentTargetId: number | null;
  setPlan: (name: string, points: NavPoint[]) => void;
  markComplete: (id: number, position: GeoPosition) => void;
  setCurrentTarget: (id: number | null) => void;
}

export const useNavStore = create<NavState>((set) => ({
  planName: '',
  points: [],
  completions: new Map(),
  currentTargetId: null,
  setPlan: (name, points) =>
    set({
      planName: name,
      points,
      completions: new Map(),
      currentTargetId: points.length > 0 ? points[0].id : null,
    }),
  markComplete: (id, position) =>
    set((state) => {
      const newCompletions = new Map(state.completions);
      newCompletions.set(id, {
        pointId: id,
        actualLat: position.lat,
        actualLng: position.lng,
        accuracy: position.accuracy,
        timestamp: position.timestamp,
      });
      return { completions: newCompletions };
    }),
  setCurrentTarget: (id) => set({ currentTargetId: id }),
}));
