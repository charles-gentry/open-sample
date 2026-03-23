import { kml as kmlToGeoJSON } from '@tmcw/togeojson';

export function parseKml(kmlString: string): GeoJSON.Feature<GeoJSON.Polygon> | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(kmlString, 'text/xml');
  const geoJson = kmlToGeoJSON(doc);

  for (const feature of geoJson.features) {
    const geom = feature.geometry;
    if (!geom) continue;
    if (geom.type === 'Polygon') {
      return feature as GeoJSON.Feature<GeoJSON.Polygon>;
    }
    if (geom.type === 'MultiPolygon') {
      const coords = (geom as GeoJSON.MultiPolygon).coordinates[0];
      return {
        type: 'Feature',
        properties: feature.properties,
        geometry: { type: 'Polygon', coordinates: coords },
      };
    }
  }
  return null;
}
