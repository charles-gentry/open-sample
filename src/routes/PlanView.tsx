import { useState, useEffect } from 'react';
import PlanMap from '../components/planning/PlanMap';
import ParameterPanel from '../components/planning/ParameterPanel';
import CalendarStrip from '../components/planning/CalendarStrip';
import ShareDialog from '../components/planning/ShareDialog';
import { usePolygonDraw } from '../hooks/usePolygonDraw';
import { useIsMobile } from '../hooks/useIsMobile';
import { usePlanStore } from '../stores/planStore';

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
  const draw = usePolygonDraw();
  const { center, status } = useCoarseLocation();
  const pointCount = usePlanStore((s) => s.points.length);

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

      {/* Share FAB */}
      <button
        onClick={() => setShowShare(true)}
        disabled={pointCount === 0}
        className="absolute bottom-4 right-4 z-20 flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
        aria-label="Share plan"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
        </svg>
      </button>

      {showShare && <ShareDialog onClose={() => setShowShare(false)} />}
    </div>
  );
}
