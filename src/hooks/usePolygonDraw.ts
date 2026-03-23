import { useState, useCallback, useMemo } from 'react';
import { usePlanStore } from '../stores/planStore';

export function usePolygonDraw() {
  const [vertices, setVertices] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const { polygon, setPolygon } = usePlanStore();

  const startDrawing = useCallback(() => {
    setVertices([]);
    setIsDrawing(true);
    setPolygon(null);
  }, [setPolygon]);

  const handleClick = useCallback(
    (lngLat: { lng: number; lat: number }) => {
      if (!isDrawing) return;
      setVertices((prev) => [...prev, [lngLat.lng, lngLat.lat]]);
    },
    [isDrawing]
  );

  const finishDrawing = useCallback(() => {
    if (vertices.length < 3) return;
    const closed = [...vertices, vertices[0]];
    const feature: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [closed],
      },
    };
    setPolygon(feature);
    setIsDrawing(false);
  }, [vertices, setPolygon]);

  const clearDrawing = useCallback(() => {
    setVertices([]);
    setIsDrawing(false);
    setPolygon(null);
  }, [setPolygon]);

  // GeoJSON for rendering while drawing
  const verticesGeoJson: GeoJSON.FeatureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: vertices.map((v, i) => ({
        type: 'Feature' as const,
        properties: { index: i },
        geometry: { type: 'Point' as const, coordinates: v },
      })),
    }),
    [vertices]
  );

  const lineGeoJson: GeoJSON.FeatureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features:
        vertices.length >= 2
          ? [
              {
                type: 'Feature' as const,
                properties: {},
                geometry: {
                  type: 'LineString' as const,
                  coordinates: vertices,
                },
              },
            ]
          : [],
    }),
    [vertices]
  );

  const previewPolygonGeoJson: GeoJSON.FeatureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features:
        vertices.length >= 3
          ? [
              {
                type: 'Feature' as const,
                properties: {},
                geometry: {
                  type: 'Polygon' as const,
                  coordinates: [[...vertices, vertices[0]]],
                },
              },
            ]
          : [],
    }),
    [vertices]
  );

  // GeoJSON for rendering the finalized polygon (from store, covers both drawn and KML)
  const polygonGeoJson: GeoJSON.FeatureCollection = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: polygon && !isDrawing ? [polygon] : [],
    }),
    [polygon, isDrawing]
  );

  return {
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
  };
}
