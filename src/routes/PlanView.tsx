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
  const draw = usePolygonDraw();

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center bg-retro-bg">
        <h2 className="text-xl font-bold text-retro-amber uppercase tracking-wider">Desktop Only</h2>
        <p className="text-retro-text max-w-sm">
          Planning is designed for desktop. Open this page on a computer to draw
          your sampling area and generate points.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-retro-bg">
      <header className="flex items-center px-4 py-2 bg-retro-panel border-b border-retro-green-muted">
        <h1 className="text-lg font-bold text-retro-green uppercase tracking-wider">Open Sample</h1>
      </header>
      <div className="flex flex-1 min-h-0">
        <div className="flex-1">
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
      <CalendarStrip />
      {showShare && <ShareDialog onClose={() => setShowShare(false)} />}
    </div>
  );
}
