import { useState, useEffect } from 'react';
import { usePlanStore } from '../../stores/planStore';
import type { SamplingType } from '../../types/plan';
import KmlUploader from './KmlUploader';
import CollapsibleSection from './CollapsibleSection';
import FormField, { fieldClass } from './FormField';

interface ParameterPanelProps {
  isDrawing: boolean;
  vertices: [number, number][];
  polygon: GeoJSON.Feature<GeoJSON.Polygon> | null;
  startDrawing: () => void;
  finishDrawing: () => void;
  clearDrawing: () => void;
}

const TYPE_LABELS: Record<SamplingType, string> = {
  random: 'Random',
  grid: 'Grid',
  clustered: 'Clustered',
  w: 'W Pattern',
  ssus: 'Stratified (SSUS)',
};

export default function ParameterPanel({
  isDrawing,
  vertices,
  polygon,
  startDrawing,
  finishDrawing,
  clearDrawing,
}: ParameterPanelProps) {
  const { params, polygon: storePolygon, setParams } = usePlanStore();
  const [areaOpen, setAreaOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);

  // Auto-collapse area and expand config when polygon is drawn
  useEffect(() => {
    if (storePolygon) {
      setAreaOpen(false);
      setConfigOpen(true);
    } else {
      setAreaOpen(true);
      setConfigOpen(false);
    }
  }, [storePolygon]);

  const areaStatus = storePolygon
    ? { label: 'Defined', color: 'green' as const }
    : undefined;

  const configStatus = storePolygon
    ? { label: `${TYPE_LABELS[params.type]} · ${params.count} pts`, color: 'slate' as const }
    : undefined;

  return (
    <div className="flex flex-col gap-3 p-5 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60">
      {/* Section 1: Define Area */}
      <CollapsibleSection
        title="Define Area"
        status={areaStatus}
        open={areaOpen}
        onToggle={() => setAreaOpen((v) => !v)}
      >
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

        <FormField label="Buffer Distance (meters)">
          <input
            type="number"
            className={fieldClass}
            min={0}
            value={params.bufferDistance}
            onChange={(e) => setParams({ bufferDistance: Math.max(0, +e.target.value) })}
          />
        </FormField>
      </CollapsibleSection>

      <hr className="border-slate-200/60" />

      {/* Section 2: Configuration */}
      <CollapsibleSection
        title="Configuration"
        status={configStatus}
        open={configOpen}
        onToggle={() => setConfigOpen((v) => !v)}
      >
        <FormField label="Number of Points (1-99)">
          <input
            type="number"
            className={fieldClass}
            min={1}
            max={99}
            value={params.count}
            onChange={(e) => setParams({ count: Math.min(99, Math.max(1, +e.target.value)) })}
          />
        </FormField>

        <FormField label="Sampling Type">
          <select
            className={fieldClass}
            value={params.type}
            onChange={(e) => setParams({ type: e.target.value as SamplingType })}
          >
            <option value="random">Random</option>
            <option value="grid">Grid</option>
            <option value="clustered">Clustered</option>
            <option value="w">W Pattern</option>
            <option value="ssus">Stratified (SSUS)</option>
          </select>
        </FormField>

        {params.type === 'clustered' && (
          <FormField label="Number of Clusters (2+)">
            <input
              type="number"
              className={fieldClass}
              min={2}
              value={params.clusterCount ?? 3}
              onChange={(e) => setParams({ clusterCount: Math.max(2, +e.target.value) })}
            />
          </FormField>
        )}

        {params.type === 'clustered' && (
          <FormField label="Min Cluster Distance (meters)">
            <input
              type="number"
              className={fieldClass}
              min={0}
              value={params.minClusterDistance ?? 150}
              onChange={(e) => setParams({ minClusterDistance: Math.max(0, +e.target.value) })}
            />
          </FormField>
        )}

        {params.type !== 'grid' && params.type !== 'ssus' && (
          <FormField label="Min Distance (meters)">
            <input
              type="number"
              className={fieldClass}
              min={0}
              value={params.minDistance}
              onChange={(e) => setParams({ minDistance: Math.max(0, +e.target.value) })}
            />
          </FormField>
        )}
      </CollapsibleSection>
    </div>
  );
}
