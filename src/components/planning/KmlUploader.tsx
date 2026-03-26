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
    <label className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-brand hover:text-brand text-slate-600 transition-colors duration-150">
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
