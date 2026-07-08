import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import maplibregl from 'maplibre-gl';
import api from '../services/api';
import MapView from '../components/MapView';
import ShopMarker from '../components/ShopMarker';
import DirectionControls from '../components/DirectionControls';
import { fetchRoute } from '../services/routingService';
import { clearRouteLine, drawRouteLine } from '../services/mapService';

const MapPage = () => {
  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [shopsError, setShopsError] = useState(null);

  const [map, setMap] = useState(null);

  // Directions state
  const [activeDirectionsShop, setActiveDirectionsShop] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);

  // Markers references to remove when clearing routes
  const startMarkerRef = useRef(null);
  const destinationMarkerRef = useRef(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await api.get('/api/shops');
        if (response.data && response.data.success) {
          setShops(response.data.data);
        }
      } catch (err) {
        console.error('Fetch shops map error:', err);
        setShopsError(err.response?.data?.message || err.message || 'Failed to retrieve shops.');
      } finally {
        setLoadingShops(false);
      }
    };

    fetchShops();
  }, []);

  // Auto-fit map viewport bounds to show all markers when map & shops list are ready
  useEffect(() => {
    if (!map || shops.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    let hasValidCoords = false;

    shops.forEach((shop) => {
      const coords = shop.location?.coordinates;
      if (coords && coords.length >= 2) {
        bounds.extend(coords);
        hasValidCoords = true;
      }
    });

    if (hasValidCoords) {
      if (shops.length === 1) {
        const coords = shops[0].location.coordinates;
        map.flyTo({
          center: coords,
          zoom: 13,
          essential: true
        });
      } else {
        map.fitBounds(bounds, {
          padding: 80,
          maxZoom: 14,
          duration: 1000
        });
      }
    }
  }, [map, shops]);

  const handleMapInit = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const handleGetDirections = useCallback((selectedShop) => {
    setActiveDirectionsShop(selectedShop);
    setRouteError(null);
    setRouteInfo(null);
  }, []);

  const handleStartCoordsResolved = async (startCoords, startPlaceName) => {
    if (!map || !activeDirectionsShop) return;

    // Clear previous route lines and markers first
    clearActiveRoute();

    setRouteLoading(true);
    setRouteError(null);

    const endCoords = activeDirectionsShop.location.coordinates; // [lon, lat]

    try {
      // 1. Fetch Driving Route Geometry from OSRM
      const routeResult = await fetchRoute(startCoords, endCoords);
      const { geometry, distance, duration } = routeResult;

      // 2. Draw Blue Route Line on the MapLibre Map instance
      drawRouteLine(map, geometry);

      // 3. Add Start Marker (Green)
      const startEl = document.createElement('div');
      startMarkerRef.current = new maplibregl.Marker({ color: '#10B981' }) // green
        .setLngLat(startCoords)
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Start:</strong> ${startPlaceName}`))
        .addTo(map);

      // 4. Add Destination Marker (Primary Orange)
      destinationMarkerRef.current = new maplibregl.Marker({ color: '#C96A2D' }) // primary orange
        .setLngLat(endCoords)
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<strong>Destination:</strong> ${activeDirectionsShop.name}`))
        .addTo(map);

      // 5. Fit the map bounds to show start, end, and entire route
      const coordinates = geometry.coordinates;
      const bounds = coordinates.reduce((acc, coord) => {
        return acc.extend(coord);
      }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));

      map.fitBounds(bounds, { padding: 80, maxZoom: 15 });

      // Save routing distance/duration
      setRouteInfo({
        distance: (distance / 1000).toFixed(1), // km
        duration: Math.round(duration / 60) // minutes
      });

    } catch (err) {
      console.error('Route creation failure:', err);
      setRouteError(err.message || 'Failed to generate driving directions.');
    } finally {
      setRouteLoading(false);
    }
  };

  const clearActiveRoute = () => {
    if (!map) return;

    // Remove old route layer & source
    clearRouteLine(map);

    // Remove start marker
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }

    // Remove destination marker
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }

    setRouteError(null);
    setRouteInfo(null);
  };

  const handleCancelDirections = () => {
    clearActiveRoute();
    setActiveDirectionsShop(null);
    
    // Zoom back to default map center in India
    if (map) {
      map.flyTo({
        center: [78.9629, 20.5937],
        zoom: 5,
        essential: true
      });
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      width: '100%',
      margin: '2rem auto',
      padding: '0 1.5rem 4rem',
      fontFamily: 'var(--sans)',
      boxSizing: 'border-box'
    }}>
      {/* Title Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
        textAlign: 'left'
      }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
            Interactive Map
          </h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Discover and locate registered chai spots, and calculate your driving route
          </p>
        </div>
        <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="map-grid">
        {/* Map Canvas Card */}
        <div style={{
          position: 'relative',
          border: '1px solid var(--border-dark)',
          borderRadius: 'var(--radius)',
          backgroundColor: '#eae8e4',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)'
        }}>
          {loadingShops && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(255, 249, 244, 0.85)',
              zIndex: 10
            }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }}>⏳</span>
              <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Loading Map Canvas...</h3>
            </div>
          )}
          <MapView onMapInit={handleMapInit} />
        </div>

        {/* Side Panel: directions controls & route summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeDirectionsShop ? (
            <DirectionControls
              shop={activeDirectionsShop}
              onStartCoordsResolved={handleStartCoordsResolved}
              onCancel={handleCancelDirections}
            />
          ) : (
            <div style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-dark)',
              borderRadius: 'var(--radius)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow)',
              boxSizing: 'border-box'
            }}>
              <div>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>📍</span>
                <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: 'var(--text-main)' }}>No Shop Selected</p>
                <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.4' }}>
                  Click on any red shop marker on the map and choose <strong>Get Directions</strong> to draw a routing track.
                </p>
              </div>
            </div>
          )}

          {/* Loader or Route Metrics */}
          {(routeLoading || routeError || routeInfo) && (
            <div style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-dark)',
              borderRadius: 'var(--radius)',
              padding: '1.25rem',
              textAlign: 'left',
              boxShadow: 'var(--shadow)',
              boxSizing: 'border-box'
            }}>
              {routeLoading && (
                <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  ⏳ Calculating driving route...
                </div>
              )}
              {routeError && (
                <div style={{ color: 'var(--error)', fontSize: '0.85rem', fontWeight: 600 }}>
                  ❌ {routeError}
                </div>
              )}
              {routeInfo && (
                <div>
                  <h4 style={{ margin: '0 0 0.6rem', color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 700 }}>
                    🏎️ Route Metrics
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Distance:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{routeInfo.distance} km</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                      <strong style={{ color: 'var(--text-main)' }}>{routeInfo.duration} mins</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Render Shop Markers on the MapLibre Map instance */}
      {map && shops.map((shop) => (
        <ShopMarker
          key={shop._id}
          map={map}
          shop={shop}
          onGetDirections={handleGetDirections}
        />
      ))}

      {shopsError && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          color: 'var(--error)',
          fontSize: '0.9rem',
          textAlign: 'left'
        }}>
          ❌ {shopsError}
        </div>
      )}
    </div>
  );
};

export default MapPage;
