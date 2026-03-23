import { useRef, useCallback, useEffect } from 'react';
import Map, { Source, Layer, type MapRef } from 'react-map-gl/maplibre';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'maplibre-gl/dist/maplibre-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { usePlanStore } from '../../stores/planStore';

export default function PlanMap() {
  const mapRef = useRef<MapRef>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const { polygon, points, setPolygon } = usePlanStore();

  const onMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { polygon: true, trash: true },
    });
    drawRef.current = draw;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.addControl(draw as any);

    const updatePolygon = () => {
      const data = draw.getAll();
      if (data.features.length > 0) {
        const feat = data.features[data.features.length - 1];
        if (feat.geometry.type === 'Polygon') {
          setPolygon(feat as GeoJSON.Feature<GeoJSON.Polygon>);
        }
      } else {
        setPolygon(null);
      }
    };

    map.on('draw.create', updatePolygon);
    map.on('draw.update', updatePolygon);
    map.on('draw.delete', updatePolygon);
  }, [setPolygon]);

  // If polygon is set externally (e.g. KML upload), add it to draw
  useEffect(() => {
    if (drawRef.current && polygon) {
      const existing = drawRef.current.getAll();
      if (existing.features.length === 0) {
        drawRef.current.add(polygon);
      }
    }
  }, [polygon]);

  const pointsGeoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: points.map((pt, i) => ({
      type: 'Feature' as const,
      properties: { index: i + 1 },
      geometry: { type: 'Point' as const, coordinates: [pt.lng, pt.lat] },
    })),
  };

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: -98.5, latitude: 39.8, zoom: 4 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://tiles.openfreemap.org/styles/liberty"
      onLoad={onMapLoad}
    >
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
  );
}
