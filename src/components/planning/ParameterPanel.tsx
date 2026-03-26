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

  return (
    <div className="flex flex-col gap-4 p-5 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60">
      <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Sampling Parameters</h2>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Define Area</h3>
        {!isDrawing && !polygon && (
          <button
            onClick={startDrawing}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand transition-colors duration-150"
          >
            Draw Polygon
          </button>
        )}
        {isDrawing && vertices.length >= 3 && (
          <button
            onClick={finishDrawing}
            className="bg-brand text-white rounded-xl px-3 py-2 text-sm font-semibold hover:bg-brand-hover shadow-sm shadow-brand-glow transition-all duration-150"
          >
            Finish
          </button>
        )}
        {(polygon || isDrawing) && (
          <button
            onClick={clearDrawing}
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-red-500 hover:border-red-300 hover:bg-red-50 transition-colors duration-150"
          >
            Clear
          </button>
        )}
        {isDrawing && (
          <p className="text-xs text-slate-400">
            Click map to add points{vertices.length >= 3 ? ', double-click to finish' : ''}
          </p>
        )}
        <KmlUploader />
      </div>

      <hr className="border-slate-200/60" />

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Plan Name</span>
        <input
          type="text"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-glow/50 transition-colors duration-150"
          value={params.name}
          onChange={(e) => setParams({ name: e.target.value })}
          placeholder="My sampling plan"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Number of Points (1-99)</span>
        <input
          type="number"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-glow/50 transition-colors duration-150"
          min={1}
          max={99}
          value={params.count}
          onChange={(e) => setParams({ count: Math.min(99, Math.max(1, +e.target.value)) })}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Sampling Type</span>
        <select
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-glow/50 transition-colors duration-150"
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
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Number of Clusters (2+)</span>
          <input
            type="number"
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-glow/50 transition-colors duration-150"
            min={2}
            value={params.clusterCount ?? 3}
            onChange={(e) => setParams({ clusterCount: Math.max(2, +e.target.value) })}
          />
        </label>
      )}

      {params.type === 'clustered' && (
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Min Cluster Distance (meters)</span>
          <input
            type="number"
            className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-glow/50 transition-colors duration-150"
            min={0}
            value={params.minClusterDistance ?? 150}
            onChange={(e) => setParams({ minClusterDistance: Math.max(0, +e.target.value) })}
          />
        </label>
      )}

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Min Distance (meters)</span>
        <input
          type="number"
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-glow/50 transition-colors duration-150"
          min={0}
          value={params.minDistance}
          onChange={(e) => setParams({ minDistance: Math.max(0, +e.target.value) })}
        />
      </label>

      <button
        onClick={handleGenerate}
        disabled={!storePolygon}
        className="bg-brand text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-brand-hover shadow-md shadow-brand-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        Generate Points
      </button>

      {warning && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3 py-2 text-xs leading-relaxed">
          {warning}
        </div>
      )}

      <button
        onClick={onShare}
        disabled={usePlanStore.getState().points.length === 0}
        className="bg-emerald-600 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-emerald-700 shadow-md shadow-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        Share Plan
      </button>
    </div>
  );
}
