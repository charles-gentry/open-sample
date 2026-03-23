import { useCallback } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import type { MapLayerMouseEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { usePlanStore } from '../../stores/planStore';
import { usePolygonDraw } from '../../hooks/usePolygonDraw';

export default function PlanMap() {
  const points = usePlanStore((s) => s.points);
  const {
    isDrawing,
    vertices,
    polygon,
    startDrawing,
    handleClick,
    finishDrawing,
    clearDrawing,
    verticesGeoJson,
    lineGeoJson,
    previewPolygonGeoJson,
    polygonGeoJson,
  } = usePolygonDraw();

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
        initialViewState={{ longitude: -98.5, latitude: 39.8, zoom: 4 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        cursor={isDrawing ? 'crosshair' : undefined}
        onClick={onClick}
        onDblClick={onDblClick}
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

      {/* Draw control buttons */}
      <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
        {!isDrawing && !polygon && (
          <button
            onClick={startDrawing}
            className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-medium text-gray-700 shadow hover:bg-gray-50"
          >
            Draw Polygon
          </button>
        )}
        {isDrawing && vertices.length >= 3 && (
          <button
            onClick={finishDrawing}
            className="bg-blue-600 text-white rounded px-3 py-1.5 text-sm font-medium shadow hover:bg-blue-700"
          >
            Finish
          </button>
        )}
        {(polygon || isDrawing) && (
          <button
            onClick={clearDrawing}
            className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-medium text-red-600 shadow hover:bg-red-50"
          >
            Clear
          </button>
        )}
        {isDrawing && (
          <span className="bg-white/90 rounded px-2 py-1 text-xs text-gray-500 shadow">
            Click to add points{vertices.length >= 3 ? ', double-click to finish' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
