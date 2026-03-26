import { useState } from 'react';
import PlanMap from '../components/planning/PlanMap';
import ParameterPanel from '../components/planning/ParameterPanel';
import CalendarStrip from '../components/planning/CalendarStrip';
import ShareDialog from '../components/planning/ShareDialog';
import { usePolygonDraw } from '../hooks/usePolygonDraw';
import { useIsMobile } from '../hooks/useIsMobile';

export default function PlanView() {
  const isMobile = useIsMobile();
  const [showShare, setShowShare] = useState(false);
  const [calendarCollapsed, setCalendarCollapsed] = useState(false);
  const draw = usePolygonDraw();

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
        />
      </div>

      {/* Floating brand header pill */}
      <header className="absolute top-4 left-4 z-20 flex items-center px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/60">
        <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">Open Sample</h1>
      </header>

      {/* Floating ParameterPanel */}
      <div className={`absolute top-4 right-4 z-20 w-80 overflow-y-auto transition-all duration-300 ${calendarCollapsed ? 'bottom-16' : 'bottom-52'}`}>
        <ParameterPanel
          onShare={() => setShowShare(true)}
          isDrawing={draw.isDrawing}
          vertices={draw.vertices}
          polygon={draw.polygon}
          startDrawing={draw.startDrawing}
          finishDrawing={draw.finishDrawing}
          clearDrawing={draw.clearDrawing}
        />
      </div>

      {/* Floating CalendarStrip */}
      <div className="absolute bottom-4 left-4 right-[22rem] z-20">
        <CalendarStrip collapsed={calendarCollapsed} onToggleCollapsed={() => setCalendarCollapsed((v) => !v)} />
      </div>

      {showShare && <ShareDialog onClose={() => setShowShare(false)} />}
    </div>
  );
}
