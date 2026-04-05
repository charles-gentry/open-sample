import { useNavStore } from '../../stores/navStore';
import {
  exportAsGeoJSON,
  exportAsCSV,
  downloadFile,
  buildFilename,
} from '../../services/export';

export default function ExportMenu() {
  const { planName, points, completions } = useNavStore();

  const data = { planName, points, completions };

  const handleGeoJSON = () => {
    const content = exportAsGeoJSON(data);
    downloadFile(content, buildFilename(planName, 'geojson'), 'application/geo+json');
  };

  const handleCSV = () => {
    const content = exportAsCSV(data);
    downloadFile(content, buildFilename(planName, 'csv'), 'text/csv');
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-xs text-slate-400 text-center">
        {completions.size} of {points.length} points completed
      </p>
      <button
        onClick={handleGeoJSON}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand-glow transition-all"
      >
        Export GeoJSON
      </button>
      <button
        onClick={handleCSV}
        className="w-full py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 shadow-sm transition-all"
      >
        Export CSV
      </button>
    </div>
  );
}
