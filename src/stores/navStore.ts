import { create } from 'zustand';
import type { NavPoint } from '../types/navigation';

interface NavState {
  planName: string;
  points: NavPoint[];
  completedIds: Set<number>;
  currentTargetId: number | null;
  setPlan: (name: string, points: NavPoint[]) => void;
  markComplete: (id: number) => void;
  setCurrentTarget: (id: number | null) => void;
}

export const useNavStore = create<NavState>((set) => ({
  planName: '',
  points: [],
  completedIds: new Set(),
  currentTargetId: null,
  setPlan: (name, points) =>
    set({
      planName: name,
      points,
      completedIds: new Set(),
      currentTargetId: points.length > 0 ? points[0].id : null,
    }),
  markComplete: (id) =>
    set((state) => {
      const newCompleted = new Set(state.completedIds);
      newCompleted.add(id);
      return { completedIds: newCompleted };
    }),
  setCurrentTarget: (id) => set({ currentTargetId: id }),
}));
