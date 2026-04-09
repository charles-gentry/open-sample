import { useCallback, useMemo, useRef } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapLayerMouseEvent, MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as turf from '@turf/turf';
import { usePlanStore } from '../../stores/planStore';
import { buildSSUSGridLines } from '../../algorithms/ssus';

interface PlanMapProps {
  isDrawing: boolean;
  handleClick: (lngLat: { lng: number; lat: number }) => void;
  finishDrawing: () => void;
  verticesGeoJson: GeoJSON.FeatureCollection;
  lineGeoJson: GeoJSON.FeatureCollection;
  previewPolygonGeoJson: GeoJSON.FeatureCollection;
  polygonGeoJson: GeoJSON.FeatureCollection;
  initialCenter: { lng: number; lat: number };
}

export default function PlanMap({
  isDrawing,
  handleClick,
  finishDrawing,
  verticesGeoJson,
  lineGeoJson,
  previewPolygonGeoJson,
  polygonGeoJson,
  initialCenter,
}: PlanMapProps) {
  const points = usePlanStore((s) => s.points);
  const polygon = usePlanStore((s) => s.polygon);
  const params = usePlanStore((s) => s.params);
  const bufferDistance = params.bufferDistance;
  const mapRef = useRef<MapRef>(null);

  const gridLinesGeoJson: GeoJSON.FeatureCollection = useMemo(() => {
    if (!polygon || params.type !== 'ssus' || points.length === 0) {
      return { type: 'FeatureCollection', features: [] };
    }
    return buildSSUSGridLines(polygon, params.count);
  }, [polygon, params.type, params.count, points.length]);

  const bufferGeoJson: GeoJSON.FeatureCollection = useMemo(() => {
    if (!polygon || bufferDistance <= 0) {
      return { type: 'FeatureCollection', features: [] };
    }
    const buffered = turf.buffer(polygon, -bufferDistance / 1000, { units: 'kilometers' });
    if (!buffered || !buffered.geometry) {
      return { type: 'FeatureCollection', features: [] };
    }
    return { type: 'FeatureCollection', features: [buffered] };
  }, [polygon, bufferDistance]);

  const onLoad = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const map = mapRef.current?.getMap();
        if (map) {
          console.log('[PlanMap] Browser geolocation:', coords.latitude, coords.longitude);
          map.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 13,
            duration: 2000,
          });
        }
      },
      (err) => {
        console.log('[PlanMap] Browser geolocation unavailable:', err.code, err.message);
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 300_000 }
    );
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
        initialViewState={{ longitude: initialCenter.lng, latitude: initialCenter.lat, zoom: 10 }}
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

        {/* Buffered polygon (inner boundary) */}
        <Source id="buffer-polygon" type="geojson" data={bufferGeoJson}>
          <Layer
            id="buffer-polygon-outline"
            type="line"
            paint={{
              'line-color': '#f59e0b',
              'line-width': 2,
              'line-dasharray': [4, 3],
            }}
          />
        </Source>

        {/* SSUS grid lines */}
        <Source id="ssus-grid" type="geojson" data={gridLinesGeoJson}>
          <Layer
            id="ssus-grid-lines"
            type="line"
            paint={{
              'line-color': '#94a3b8',
              'line-width': 1,
              'line-opacity': 0.5,
              'line-dasharray': [3, 2],
            }}
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
