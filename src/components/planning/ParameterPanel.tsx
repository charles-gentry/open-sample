import { usePlanStore } from '../../stores/planStore';
import { generateRandom } from '../../algorithms/random';
import { generateGrid } from '../../algorithms/grid';
import { generateClustered } from '../../algorithms/clustered';
import type { SamplingType } from '../../types/plan';
import KmlUploader from './KmlUploader';

interface ParameterPanelProps {
  onShare: () => void;
  isDrawing: boolean;
  vertices: [number, number][];
  polygon: GeoJSON.Feature<GeoJSON.Polygon> | null;
  startDrawing: () => void;
  finishDrawing: () => void;
  clearDrawing: () => void;
}

export default function ParameterPanel({
  onShare,
  isDrawing,
  vertices,
  polygon,
  startDrawing,
  finishDrawing,
  clearDrawing,
}: ParameterPanelProps) {
  const { params, polygon: storePolygon, setParams, setPoints } = usePlanStore();

  const handleGenerate = () => {
    if (!storePolygon) return;
    let pts;
    switch (params.type) {
      case 'grid':
        pts = generateGrid(storePolygon, params.count, params.minDistance);
        break;
      case 'clustered':
        pts = generateClustered(storePolygon, params.count, params.minDistance, params.clusterCount ?? 3);
        break;
      default:
        pts = generateRandom(storePolygon, params.count, params.minDistance);
    }
    setPoints(pts);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border-l border-gray-200 w-80 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800">Sampling Parameters</h2>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-gray-700">Define Area</h3>
        {!isDrawing && !polygon && (
          <button
            onClick={startDrawing}
            className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Draw Polygon
          </button>
        )}
        {isDrawing && vertices.length >= 3 && (
          <button
            onClick={finishDrawing}
            className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm font-medium hover:bg-blue-700"
          >
            Finish
          </button>
        )}
        {(polygon || isDrawing) && (
          <button
            onClick={clearDrawing}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Clear
          </button>
        )}
        {isDrawing && (
          <p className="text-xs text-gray-500">
            Click map to add points{vertices.length >= 3 ? ', double-click to finish' : ''}
          </p>
        )}
        <KmlUploader />
      </div>

      <hr className="border-gray-200" />

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Plan Name</span>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          value={params.name}
          onChange={(e) => setParams({ name: e.target.value })}
          placeholder="My sampling plan"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Number of Points (1-99)</span>
        <input
          type="number"
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          min={1}
          max={99}
          value={params.count}
          onChange={(e) => setParams({ count: Math.min(99, Math.max(1, +e.target.value)) })}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Sampling Type</span>
        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          value={params.type}
          onChange={(e) => setParams({ type: e.target.value as SamplingType })}
        >
          <option value="random">Random</option>
          <option value="grid">Grid</option>
          <option value="clustered">Clustered</option>
        </select>
      </label>

      {params.type === 'clustered' && (
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-600">Number of Clusters (2+)</span>
          <input
            type="number"
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            min={2}
            value={params.clusterCount ?? 3}
            onChange={(e) => setParams({ clusterCount: Math.max(2, +e.target.value) })}
          />
        </label>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-600">Min Distance (meters)</span>
        <input
          type="number"
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          min={0}
          value={params.minDistance}
          onChange={(e) => setParams({ minDistance: Math.max(0, +e.target.value) })}
        />
      </label>

      <button
        onClick={handleGenerate}
        disabled={!storePolygon}
        className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate Points
      </button>

      <button
        onClick={onShare}
        disabled={usePlanStore.getState().points.length === 0}
        className="bg-green-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Share Plan
      </button>
    </div>
  );
}
