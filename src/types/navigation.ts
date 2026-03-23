export interface NavPoint {
  id: number;
  lng: number;
  lat: number;
}

export type PointStatus = 'pending' | 'current' | 'completed';

export interface NavigationState {
  planName: string;
  points: NavPoint[];
  completedIds: Set<number>;
  currentTargetId: number | null;
}
