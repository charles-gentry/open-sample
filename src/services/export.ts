import type { NavPoint, CompletionRecord } from '../types/navigation';

export interface ExportData {
  planName: string;
  points: NavPoint[];
  completions: Map<number, CompletionRecord>;
}

export function exportAsGeoJSON(data: ExportData): string {
  const features = data.points.map((pt) => {
    const completion = data.completions.get(pt.id);
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [pt.lng, pt.lat],
      },
      properties: {
        point_id: pt.id + 1,
        status: completion ? 'completed' : 'pending',
        planned_lat: pt.lat,
        planned_lng: pt.lng,
        actual_lat: completion?.actualLat ?? null,
        actual_lng: completion?.actualLng ?? null,
        accuracy_m: completion ? Math.round(completion.accuracy * 10) / 10 : null,
        completed_at: completion
          ? new Date(completion.timestamp).toISOString()
          : null,
      },
    };
  });

  const featureCollection = {
    type: 'FeatureCollection' as const,
    properties: {
      plan_name: data.planName,
      exported_at: new Date().toISOString(),
      total_points: data.points.length,
      completed_points: data.completions.size,
    },
    features,
  };

  return JSON.stringify(featureCollection, null, 2);
}

export function exportAsCSV(data: ExportData): string {
  const header =
    'point_id,planned_lat,planned_lng,actual_lat,actual_lng,accuracy_m,timestamp,status';

  const rows = data.points.map((pt) => {
    const c = data.completions.get(pt.id);
    const fields = [
      pt.id + 1,
      pt.lat,
      pt.lng,
      c?.actualLat ?? '',
      c?.actualLng ?? '',
      c ? Math.round(c.accuracy * 10) / 10 : '',
      c ? new Date(c.timestamp).toISOString() : '',
      c ? 'completed' : 'pending',
    ];
    return fields.join(',');
  });

  return [header, ...rows].join('\n');
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function buildFilename(
  planName: string,
  format: 'geojson' | 'csv'
): string {
  const slug = sanitizeFilename(planName) || 'export';
  const date = new Date().toISOString().slice(0, 10);
  const ext = format === 'geojson' ? 'geojson' : 'csv';
  return `${slug}_${date}.${ext}`;
}
