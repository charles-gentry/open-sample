import { useEffect, useMemo, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { decodePlan } from '../services/sharing';
import { useNavStore } from '../stores/navStore';
import { useGeolocation } from '../hooks/useGeolocation';
import { useCompass } from '../hooks/useCompass';
import { useIsMobile } from '../hooks/useIsMobile';
import { bearing as calcBearing, distance as calcDistance } from '../lib/geo';
import CompassArrow from '../components/navigation/CompassArrow';
import DistanceDisplay from '../components/navigation/DistanceDisplay';
import PointProgress from '../components/navigation/PointProgress';
import MarkCompleteButton from '../components/navigation/MarkCompleteButton';
import CompletionNotice from '../components/navigation/CompletionNotice';
import NavMiniMap from '../components/navigation/NavMiniMap';
import ExportMenu from '../components/navigation/ExportMenu';


export default function NavigateView() {
  const { data } = useParams<{ data: string }>();
  const {
    planName,
    points,
    completions,
    currentTargetId,
    setPlan,
    markComplete,
    setCurrentTarget,
  } = useNavStore();
  const { position, error: geoError } = useGeolocation();
  const { heading, needsPermission, requestPermission } = useCompass();
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);

  // Derive completedIds Set for child components that don't need full records
  const completedIds = useMemo(
    () => new Set(completions.keys()),
    [completions]
  );

  // Decode plan from URL
  useEffect(() => {
    if (!data) return;
    try {
      const decoded = decodePlan(data);
      const navPoints = decoded.points.map((pt, i) => ({
        id: i,
        lng: pt.lng,
        lat: pt.lat,
      }));
      setPlan(decoded.name, navPoints);
      setTargetDate(decoded.targetDate);
    } catch (e) {
      console.error('Failed to decode plan:', e);
    }
  }, [data, setPlan]);

  // Auto-select nearest uncompleted point with hysteresis to prevent flickering
  useEffect(() => {
    if (!position || points.length === 0) return;
    const uncompleted = points.filter((p) => !completedIds.has(p.id));
    if (uncompleted.length === 0) {
      setCurrentTarget(null);
      return;
    }

    let nearest = uncompleted[0];
    let minDist = calcDistance(position, nearest);
    for (let i = 1; i < uncompleted.length; i++) {
      const d = calcDistance(position, uncompleted[i]);
      if (d < minDist) {
        minDist = d;
        nearest = uncompleted[i];
      }
    }

    // If no current target or current target was completed, select nearest
    const currentStillValid =
      currentTargetId !== null &&
      uncompleted.some((p) => p.id === currentTargetId);

    if (!currentStillValid) {
      setCurrentTarget(nearest.id);
      return;
    }

    // Hysteresis: only switch if nearest is significantly closer than current
    if (nearest.id !== currentTargetId) {
      const currentDist = calcDistance(
        position,
        uncompleted.find((p) => p.id === currentTargetId)!
      );
      if (
        currentDist - minDist > 10 &&
        currentDist - minDist > currentDist * 0.2
      ) {
        setCurrentTarget(nearest.id);
      }
    }
  }, [position, points, completedIds, currentTargetId, setCurrentTarget]);

  const target = useMemo(
    () => points.find((p) => p.id === currentTargetId) ?? null,
    [points, currentTargetId]
  );

  const dist = useMemo(() => {
    if (!position || !target) return null;
    return calcDistance(position, target);
  }, [position, target]);

  const bearingToTarget = useMemo(() => {
    if (!position || !target) return 0;
    return calcBearing(position, target);
  }, [position, target]);

  const arrowRotation = useMemo(() => {
    if (heading === null) return bearingToTarget;
    return ((bearingToTarget - heading + 720) % 360);
  }, [bearingToTarget, heading]);

  const handleMarkComplete = useCallback(() => {
    if (currentTargetId !== null && position) {
      markComplete(currentTargetId, position);
    }
  }, [currentTargetId, markComplete, position]);

  const centroid = useMemo(() => {
    if (points.length === 0) return null;
    const sumLat = points.reduce((s, p) => s + p.lat, 0);
    const sumLng = points.reduce((s, p) => s + p.lng, 0);
    return { lat: sumLat / points.length, lng: sumLng / points.length };
  }, [points]);

  const isMobile = useIsMobile();
  const allDone = points.length > 0 && completedIds.size >= points.length;

  const today = new Date().toLocaleDateString('en-CA');
  const isOffTargetDate = targetDate !== null && today !== targetDate;

  if (!isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center bg-surface">
        <h2 className="text-xl font-semibold text-slate-800">Mobile Only</h2>
        <p className="text-slate-500 max-w-sm">
          Navigation is designed for mobile. Open the shared link on your phone
          to start navigating with GPS and compass.
        </p>
      </div>
    );
  }

  if (allDone) {
    return <CompletionNotice planName={planName} total={points.length} />;
  }

  return (
    <div className="flex flex-col h-full bg-surface p-4 gap-4 safe-area-inset">
      {planName && (
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">
            {planName}
          </h2>
          {completions.size > 0 && (
            <button
              onClick={() => setShowExport((v) => !v)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Export data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
            </button>
          )}
        </div>
      )}

      {showExport && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <ExportMenu />
        </div>
      )}

      {isOffTargetDate && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700 text-center">
          Target sampling date: {new Date(targetDate + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      )}

      {needsPermission && (
        <button
          onClick={requestPermission}
          className="bg-brand text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md shadow-brand-glow"
        >
          Enable Compass
        </button>
      )}

      {geoError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          GPS Error: {geoError}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        <CompassArrow rotation={arrowRotation} />
        {dist !== null && <DistanceDisplay meters={dist} />}
        {target && (
          <p className="text-sm text-slate-400 font-medium">
            Point {target.id + 1}
          </p>
        )}
      </div>

      <PointProgress completed={completedIds.size} total={points.length} />

      <MarkCompleteButton
        onMark={handleMarkComplete}
        isNear={dist !== null && dist < 5}
        disabled={!position}
      />

      <NavMiniMap
        points={points}
        completedIds={completedIds}
        currentTargetId={currentTargetId}
        userLat={position?.lat ?? null}
        userLng={position?.lng ?? null}
        centroid={centroid}
      />
    </div>
  );
}
