import { usePlanStore } from '../../stores/planStore';
import { generateRandom } from '../../algorithms/random';
import { generateGrid } from '../../algorithms/grid';
import { generateClustered } from '../../algorithms/clustered';
import type { SamplingType } from '../../types/plan';

export default function ParameterPanel({ onShare }: { onShare: () => void }) {
  const { params, polygon, setParams, setPoints } = usePlanStore();

  const handleGenerate = () => {
    if (!polygon) return;
    let pts;
    switch (params.type) {
      case 'grid':
        pts = generateGrid(polygon, params.count, params.minDistance);
        break;
      case 'clustered':
        pts = generateClustered(polygon, params.count, params.minDistance);
        break;
      default:
        pts = generateRandom(polygon, params.count, params.minDistance);
    }
    setPoints(pts);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white border-l border-gray-200 w-80 overflow-y-auto">
      <h2 className="text-lg font-semibold text-gray-800">Sampling Parameters</h2>

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
        disabled={!polygon}
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

      {!polygon && (
        <p className="text-xs text-gray-400">Draw a polygon on the map to begin.</p>
      )}
    </div>
  );
}
