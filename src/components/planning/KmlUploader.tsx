import { useCallback } from 'react';
import { parseKml } from '../../lib/kml';
import { usePlanStore } from '../../stores/planStore';

export default function KmlUploader() {
  const setPolygon = usePlanStore((s) => s.setPolygon);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const polygon = parseKml(text);
      if (polygon) {
        setPolygon(polygon);
      } else {
        alert('No polygon found in the KML file.');
      }
      e.target.value = '';
    },
    [setPolygon]
  );

  return (
    <label className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded cursor-pointer border border-gray-300">
      <span>Upload KML</span>
      <input
        type="file"
        accept=".kml"
        onChange={handleFile}
        className="hidden"
      />
    </label>
  );
}
