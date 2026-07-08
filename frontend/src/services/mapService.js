/**
 * MapLibre Map Service
 * Utilities for map styling, configurations, and drawing route vectors on OSM tiles.
 */

export const getOsmStyle = () => {
  return {
    version: 8,
    sources: {
      osm: {
        type: 'raster',
        tiles: [
          'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        tileSize: 256,
        attribution: '© OpenStreetMap contributors'
      }
    },
    layers: [
      {
        id: 'osm-tiles',
        type: 'raster',
        source: 'osm',
        minzoom: 0,
        maxzoom: 19
      }
    ]
  };
};

export const DEFAULT_CENTER = [78.9629, 20.5937]; // India center [longitude, latitude]
export const DEFAULT_ZOOM = 5;

/**
 * Draw a routing track line on a MapLibre map instance.
 */
export const drawRouteLine = (map, routeGeometry) => {
  if (!map) return;

  // 1. Remove existing route layers and sources
  clearRouteLine(map);

  // 2. Add route source containing the line coordinates
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: routeGeometry
    }
  });

  // 3. Add styling layer for the route line
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#3b82f6', // Premium blue color
      'line-width': 6
    }
  });
};

/**
 * Remove route elements from map instance
 */
export const clearRouteLine = (map) => {
  if (!map) return;
  if (map.getLayer('route')) {
    map.removeLayer('route');
  }
  if (map.getSource('route')) {
    map.removeSource('route');
  }
};
