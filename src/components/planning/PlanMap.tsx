import { useCallback, useEffect, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapLayerMouseEvent, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { usePlanStore } from '../../stores/planStore';

interface PlanMapProps {
  isDrawing: boolean;
  handleClick: (lngLat: { lng: number; lat: number }) => void;
  finishDrawing: () => void;
  verticesGeoJson: GeoJSON.FeatureCollection;
  lineGeoJson: GeoJSON.FeatureCollection;
  previewPolygonGeoJson: GeoJSON.FeatureCollection;
  polygonGeoJson: GeoJSON.FeatureCollection;
}

export default function PlanMap({
  isDrawing,
  handleClick,
  finishDrawing,
  verticesGeoJson,
  lineGeoJson,
  previewPolygonGeoJson,
  polygonGeoJson,
}: PlanMapProps) {
  const points = usePlanStore((s) => s.points);

  const mapRef = useRef<MapRef>(null);
  const pendingCenter = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const center: [number, number] = [coords.longitude, coords.latitude];
      if (mapRef.current) {
        mapRef.current.flyTo({ center, zoom: 10 });
      } else {
        pendingCenter.current = center;
      }
    });
  }, []);

  const onLoad = useCallback(() => {
    if (pendingCenter.current) {
      mapRef.current?.flyTo({ center: pendingCenter.current, zoom: 10 });
      pendingCenter.current = null;
    }
  }, []);

  const onClick = useCallback(
    (e: MapLayerMouseEvent) => {
      handleClick(e.lngLat);
    },
    [handleClick]
  );

  const onDblClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      finishDrawing();
    },
    [isDrawing, finishDrawing]
  );

  const pointsGeoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: points.map((pt, i) => ({
      type: 'Feature' as const,
      properties: { index: i + 1 },
      geometry: { type: 'Point' as const, coordinates: [pt.lng, pt.lat] },
    })),
  };

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        initialViewState={{ longitude: -98.5, latitude: 39.8, zoom: 4 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        cursor={isDrawing ? 'crosshair' : undefined}
        onClick={onClick}
        onDblClick={onDblClick}
        onLoad={onLoad}
      >
        {/* Finalized polygon (drawn or KML-uploaded) */}
        <Source id="polygon-fill" type="geojson" data={polygonGeoJson}>
          <Layer
            id="polygon-fill-layer"
            type="fill"
            paint={{ 'fill-color': '#3b82f6', 'fill-opacity': 0.15 }}
          />
          <Layer
            id="polygon-outline-layer"
            type="line"
            paint={{ 'line-color': '#3b82f6', 'line-width': 2 }}
          />
        </Source>

        {/* Drawing preview: polygon fill */}
        <Source id="draw-preview" type="geojson" data={previewPolygonGeoJson}>
          <Layer
            id="draw-preview-fill"
            type="fill"
            paint={{ 'fill-color': '#3b82f6', 'fill-opacity': 0.1 }}
          />
        </Source>

        {/* Drawing preview: connecting line */}
        <Source id="draw-line" type="geojson" data={lineGeoJson}>
          <Layer
            id="draw-line-stroke"
            type="line"
            paint={{
              'line-color': '#3b82f6',
              'line-width': 2,
              'line-dasharray': [2, 2],
            }}
          />
        </Source>

        {/* Drawing preview: vertex dots */}
        <Source id="draw-vertices" type="geojson" data={verticesGeoJson}>
          <Layer
            id="draw-vertices-circle"
            type="circle"
            paint={{
              'circle-radius': 5,
              'circle-color': '#3b82f6',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
        </Source>

        {/* Sample points */}
        <Source id="sample-points" type="geojson" data={pointsGeoJson}>
          <Layer
            id="sample-points-circle"
            type="circle"
            paint={{
              'circle-radius': 6,
              'circle-color': '#e63946',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
          <Layer
            id="sample-points-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'index'],
              'text-size': 11,
              'text-offset': [0, -1.5],
            }}
            paint={{ 'text-color': '#1d3557' }}
          />
        </Source>
      </Map>

    </div>
  );
}
