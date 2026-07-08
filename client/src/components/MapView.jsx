import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getOsmStyle, DEFAULT_CENTER, DEFAULT_ZOOM } from '../services/mapService';

const MapView = ({ onMapInit }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // Prevent double initialization

    // Initialize MapLibre GL instance
    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getOsmStyle(),
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM
    });

    // Add zoom and orientation controls
    mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');

    mapInstance.on('load', () => {
      mapInstance.resize();
      setTimeout(() => {
        if (mapInstance && mapInstance.getContainer()) {
          mapInstance.resize();
        }
      }, 100);
      mapRef.current = mapInstance;
      if (onMapInit) {
        onMapInit(mapInstance);
      }
    });

    // Clean up map instance on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onMapInit]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ width: '100%', height: '100%', borderRadius: '12px', minHeight: '400px' }} 
    />
  );
};

export default MapView;
