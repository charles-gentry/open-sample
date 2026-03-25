import { useMemo } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { NavPoint } from '../../types/navigation';
import DirectionsButton from './DirectionsButton';

interface Props {
  points: NavPoint[];
  completedIds: Set<number>;
  currentTargetId: number | null;
  userLat: number | null;
  userLng: number | null;
  centroid: { lat: number; lng: number } | null;
}

export default function NavMiniMap({
  points,
  completedIds,
  currentTargetId,
  userLat,
  userLng,
  centroid,
}: Props) {
  const geojson: GeoJSON.FeatureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: points.map((pt) => ({
        type: 'Feature' as const,
        properties: {
          id: pt.id,
          status: completedIds.has(pt.id)
            ? 'completed'
            : pt.id === currentTargetId
            ? 'current'
            : 'pending',
        },
        geometry: { type: 'Point' as const, coordinates: [pt.lng, pt.lat] },
      })),
    }),
    [points, completedIds, currentTargetId]
  );

  const center = useMemo(() => {
    if (userLat != null && userLng != null) return { lat: userLat, lng: userLng };
    if (points.length > 0) return { lat: points[0].lat, lng: points[0].lng };
    return { lat: 39.8, lng: -98.5 };
  }, [points, userLat, userLng]);

  return (
    <div className="relative w-full h-48 overflow-hidden border-2 border-retro-green-muted">
      {centroid && (
        <div className="absolute top-2 right-2 z-10">
          <DirectionsButton lat={centroid.lat} lng={centroid.lng} />
        </div>
      )}
      <Map
        longitude={center.lng}
        latitude={center.lat}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        interactive={false}
      >
        <Source id="nav-points" type="geojson" data={geojson}>
          <Layer
            id="nav-points-circle"
            type="circle"
            paint={{
              'circle-radius': 7,
              'circle-color': [
                'match',
                ['get', 'status'],
                'completed', '#1a3a1a',
                'current', '#ffb000',
                '#00aa2a',
              ],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#00ff41',
            }}
          />
        </Source>
        {userLat != null && userLng != null && (
          <Marker longitude={userLng} latitude={userLat}>
            <div className="w-4 h-4 bg-retro-green border-2 border-retro-bg" style={{ boxShadow: '0 0 6px #00ff41' }} />
          </Marker>
        )}
      </Map>
    </div>
  );
}
