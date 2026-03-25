import { useEffect, useMemo, useCallback } from 'react';
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


export default function NavigateView() {
  const { data } = useParams<{ data: string }>();
  const {
    planName,
    points,
    completedIds,
    currentTargetId,
    setPlan,
    markComplete,
    setCurrentTarget,
  } = useNavStore();
  const { position, error: geoError } = useGeolocation();
  const { heading, needsPermission, requestPermission } = useCompass();

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
    if (currentTargetId !== null) {
      markComplete(currentTargetId);
    }
  }, [currentTargetId, markComplete]);

  const centroid = useMemo(() => {
    if (points.length === 0) return null;
    const sumLat = points.reduce((s, p) => s + p.lat, 0);
    const sumLng = points.reduce((s, p) => s + p.lng, 0);
    return { lat: sumLat / points.length, lng: sumLng / points.length };
  }, [points]);

  const isMobile = useIsMobile();
  const allDone = points.length > 0 && completedIds.size >= points.length;

  if (!isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center bg-retro-bg">
        <h2 className="text-xl font-bold text-retro-amber uppercase tracking-wider">Mobile Only</h2>
        <p className="text-retro-text max-w-sm">
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
    <div className="flex flex-col h-full bg-retro-bg p-4 gap-4 safe-area-inset">
      {planName && (
        <h2 className="text-lg font-bold text-retro-green text-center uppercase tracking-wider">
          {planName}
        </h2>
      )}

      {needsPermission && (
        <button
          onClick={requestPermission}
          className="border-2 border-retro-amber text-retro-amber bg-retro-bg px-4 py-2 text-sm uppercase tracking-wider hover:bg-retro-amber hover:text-retro-bg transition-colors"
        >
          Enable Compass
        </button>
      )}

      {geoError && (
        <div className="bg-retro-panel border border-retro-red text-retro-red p-2 text-sm">
          GPS Error: {geoError}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 flex-1 justify-center">
        <CompassArrow rotation={arrowRotation} />
        {dist !== null && <DistanceDisplay meters={dist} />}
        {target && (
          <p className="text-sm text-retro-green-dim">
            Point {target.id + 1} of {points.length}
          </p>
        )}
      </div>

      <PointProgress completed={completedIds.size} total={points.length} />

      <MarkCompleteButton
        onMark={handleMarkComplete}
        isNear={dist !== null && dist < 5}
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
