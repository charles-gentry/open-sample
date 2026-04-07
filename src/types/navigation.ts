export interface NavPoint {
  id: number;
  lng: number;
  lat: number;
}

export interface CompletionRecord {
  pointId: number;
  actualLat: number;
  actualLng: number;
  accuracy: number;
  timestamp: number;
}

export type PointStatus = 'pending' | 'current' | 'completed';

export interface NavigationState {
  planName: string;
  points: NavPoint[];
  completions: Map<number, CompletionRecord>;
  currentTargetId: number | null;
}
