import { useState } from 'react';
import { usePlanStore } from '../../stores/planStore';
import { generateRandom } from '../../algorithms/random';
import { generateGrid } from '../../algorithms/grid';
import { generateClustered } from '../../algorithms/clustered';
import { generateW } from '../../algorithms/w';
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
  const [warning, setWarning] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!storePolygon) return;
    let pts;
    switch (params.type) {
      case 'grid':
        pts = generateGrid(storePolygon, params.count, params.minDistance);
        break;
      case 'clustered':
        pts = generateClustered(storePolygon, params.count, params.minDistance, params.clusterCount ?? 3, params.minClusterDistance ?? 150);
        break;
      case 'w':
        pts = generateW(storePolygon, params.count, params.minDistance);
        break;
      default:
        pts = generateRandom(storePolygon, params.count, params.minDistance);
    }
    setPoints(pts);
    if (pts.length < params.count) {
      setWarning(
        `Only ${pts.length} of ${params.count} points could be placed. Try reducing the minimum distance or the number of points.`
      );
    } else {
      setWarning(null);
    }
  };

  const inputClass = "bg-retro-bg border border-retro-green-muted text-retro-text px-3 py-2 text-sm focus:border-retro-green focus:outline-none";
  const labelClass = "text-sm text-retro-green-dim";
  const btnOutline = "border border-retro-green-muted text-retro-text px-3 py-1.5 text-sm font-bold uppercase tracking-wider hover:border-retro-green hover:text-retro-green transition-colors";

  return (
    <div className="flex flex-col gap-4 p-4 bg-retro-panel border-l border-retro-green-muted w-80 overflow-y-auto">
      <h2 className="text-lg font-bold text-retro-green uppercase tracking-wider">Parameters</h2>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold text-retro-green uppercase tracking-wider">Define Area</h3>
        {!isDrawing && !polygon && (
          <button onClick={startDrawing} className={btnOutline}>
            Draw Polygon
          </button>
        )}
        {isDrawing && vertices.length >= 3 && (
          <button
            onClick={finishDrawing}
            className="border-2 border-retro-green text-retro-green px-3 py-1.5 text-sm font-bold uppercase tracking-wider hover:bg-retro-green hover:text-retro-bg transition-colors"
          >
            Finish
          </button>
        )}
        {(polygon || isDrawing) && (
          <button
            onClick={clearDrawing}
            className="border border-retro-red text-retro-red px-3 py-1.5 text-sm font-bold uppercase tracking-wider hover:bg-retro-red hover:text-retro-bg transition-colors"
          >
            Clear
          </button>
        )}
        {isDrawing && (
          <p className="text-xs text-retro-green-dim">
            Click map to add points{vertices.length >= 3 ? ', double-click to finish' : ''}
          </p>
        )}
        <KmlUploader />
      </div>

      <hr className="border-retro-green-muted" />

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Plan Name</span>
        <input
          type="text"
          className={inputClass}
          value={params.name}
          onChange={(e) => setParams({ name: e.target.value })}
          placeholder="My sampling plan"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Number of Points (1-99)</span>
        <input
          type="number"
          className={inputClass}
          min={1}
          max={99}
          value={params.count}
          onChange={(e) => setParams({ count: Math.min(99, Math.max(1, +e.target.value)) })}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Sampling Type</span>
        <select
          className={inputClass}
          value={params.type}
          onChange={(e) => setParams({ type: e.target.value as SamplingType })}
        >
          <option value="random">Random</option>
          <option value="grid">Grid</option>
          <option value="clustered">Clustered</option>
          <option value="w">W Pattern</option>
        </select>
      </label>

      {params.type === 'clustered' && (
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Number of Clusters (2+)</span>
          <input
            type="number"
            className={inputClass}
            min={2}
            value={params.clusterCount ?? 3}
            onChange={(e) => setParams({ clusterCount: Math.max(2, +e.target.value) })}
          />
        </label>
      )}

      {params.type === 'clustered' && (
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Min Cluster Distance (meters)</span>
          <input
            type="number"
            className={inputClass}
            min={0}
            value={params.minClusterDistance ?? 150}
            onChange={(e) => setParams({ minClusterDistance: Math.max(0, +e.target.value) })}
          />
        </label>
      )}

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Min Distance (meters)</span>
        <input
          type="number"
          className={inputClass}
          min={0}
          value={params.minDistance}
          onChange={(e) => setParams({ minDistance: Math.max(0, +e.target.value) })}
        />
      </label>

      <button
        onClick={handleGenerate}
        disabled={!storePolygon}
        className="border-2 border-retro-green text-retro-green bg-retro-bg px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-retro-green hover:text-retro-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-retro-bg disabled:hover:text-retro-green"
      >
        Generate Points
      </button>

      {warning && (
        <div className="bg-retro-bg border border-retro-amber text-retro-amber px-3 py-2 text-sm">
          {warning}
        </div>
      )}

      <button
        onClick={onShare}
        disabled={usePlanStore.getState().points.length === 0}
        className="border-2 border-retro-amber text-retro-amber bg-retro-bg px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-retro-amber hover:text-retro-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-retro-bg disabled:hover:text-retro-amber"
      >
        Share Plan
      </button>
    </div>
  );
}
