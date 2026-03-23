import { useState } from 'react';
import PlanMap from '../components/planning/PlanMap';
import ParameterPanel from '../components/planning/ParameterPanel';
import KmlUploader from '../components/planning/KmlUploader';
import CalendarStrip from '../components/planning/CalendarStrip';
import ShareDialog from '../components/planning/ShareDialog';

export default function PlanView() {
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-800">Open Sample</h1>
        <KmlUploader />
      </header>
      <div className="flex flex-1 min-h-0">
        <div className="flex-1">
          <PlanMap />
        </div>
        <ParameterPanel onShare={() => setShowShare(true)} />
      </div>
      <CalendarStrip />
      {showShare && <ShareDialog onClose={() => setShowShare(false)} />}
    </div>
  );
}
