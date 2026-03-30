import { useState, useEffect } from 'react';
import PlanMap from '../components/planning/PlanMap';
import ParameterPanel from '../components/planning/ParameterPanel';
import CalendarStrip from '../components/planning/CalendarStrip';
import ShareDialog from '../components/planning/ShareDialog';
import { usePolygonDraw } from '../hooks/usePolygonDraw';
import { useIsMobile } from '../hooks/useIsMobile';
import { usePlanStore } from '../stores/planStore';
import { generateRandom } from '../algorithms/random';
import { generateGrid } from '../algorithms/grid';
import { generateClustered } from '../algorithms/clustered';
import { generateW } from '../algorithms/w';

const DEFAULT_CENTER = { lng: -98.5, lat: 39.8 };

function useCoarseLocation() {
  const [center, setCenter] = useState<{ lng: number; lat: number } | null>(null);
  const [status, setStatus] = useState('Locating you…');

  useEffect(() => {
    let cancelled = false;

    async function fetchLocation() {
      try {
        setStatus('Getting your approximate location…');
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (!cancelled && data.latitude && data.longitude) {
          console.log('[PlanView] IP geolocation:', data.latitude, data.longitude);
          setCenter({ lng: data.longitude, lat: data.latitude });
          return;
        }
      } catch {
        console.log('[PlanView] IP geolocation failed');
      }
      if (!cancelled) {
        setCenter(DEFAULT_CENTER);
      }
    }

    fetchLocation();
    return () => { cancelled = true; };
  }, []);

  return { center, status };
}

export default function PlanView() {
  const isMobile = useIsMobile();
  const [showShare, setShowShare] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const draw = usePolygonDraw();
  const { center, status } = useCoarseLocation();
  const pointCount = usePlanStore((s) => s.points.length);
  const params = usePlanStore((s) => s.params);
  const setParams = usePlanStore((s) => s.setParams);
  const storePolygon = usePlanStore((s) => s.polygon);
  const setPoints = usePlanStore((s) => s.setPoints);

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

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center bg-surface">
        <h2 className="text-xl font-semibold text-slate-800">Desktop Only</h2>
        <p className="text-slate-500 max-w-sm">
          Planning is designed for desktop. Open this page on a computer to draw
          your sampling area and generate points.
        </p>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-surface">
        <div className="h-10 w-10 rounded-full border-4 border-brand border-t-transparent animate-spin" />
        <p className="text-sm text-slate-500">{status}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Full-screen map */}
      <div className="absolute inset-0">
        <PlanMap
          isDrawing={draw.isDrawing}
          handleClick={draw.handleClick}
          finishDrawing={draw.finishDrawing}
          verticesGeoJson={draw.verticesGeoJson}
          lineGeoJson={draw.lineGeoJson}
          previewPolygonGeoJson={draw.previewPolygonGeoJson}
          polygonGeoJson={draw.polygonGeoJson}
          initialCenter={center}
        />
      </div>

      {/* Floating brand header pill */}
      <header className="absolute top-4 left-4 z-20 flex items-center px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/60">
        <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Open Sample</h1>
      </header>

      {/* Editable plan name header (top centre) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <input
          type="text"
          value={params.name}
          onChange={(e) => setParams({ name: e.target.value })}
          placeholder="My Sampling Plan"
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/60 px-5 py-2 text-center text-lg font-bold text-slate-800 tracking-tight placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-all duration-150 min-w-[200px] max-w-[400px]"
        />
      </div>

      {/* Floating ParameterPanel */}
      <div className="absolute top-4 right-4 z-20 w-80">
        <ParameterPanel
          isDrawing={draw.isDrawing}
          vertices={draw.vertices}
          polygon={draw.polygon}
          startDrawing={draw.startDrawing}
          finishDrawing={draw.finishDrawing}
          clearDrawing={draw.clearDrawing}
        />
      </div>

      {/* Floating CalendarStrip */}
      <div className="absolute bottom-4 left-0 z-20">
        <CalendarStrip />
      </div>

      {/* FAB group (bottom-right) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3">
        {/* Generate FAB */}
        <button
          onClick={handleGenerate}
          disabled={!storePolygon}
          className="flex items-center gap-2 px-5 h-14 rounded-full bg-brand text-white shadow-lg hover:bg-brand-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 text-sm font-semibold"
          aria-label="Generate points"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Generate Points
        </button>

        {/* Share FAB */}
        <button
          onClick={() => setShowShare(true)}
          disabled={pointCount === 0}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          aria-label="Share plan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
      </div>

      {/* Generate warning toast */}
      {warning && (
        <div className="absolute bottom-20 right-4 z-20 max-w-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-3 py-2 text-xs leading-relaxed shadow-lg">
          {warning}
        </div>
      )}

      {showShare && <ShareDialog onClose={() => setShowShare(false)} />}
    </div>
  );
}
