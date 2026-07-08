import { useState } from 'react';
import api from '../services/api';

const DirectionControls = ({ shop, onStartCoordsResolved, onCancel }) => {
  const [method, setMethod] = useState('current'); // 'current' or 'manual'
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Browser Geolocation is not supported by your browser.');
      setLoading(false);
      setMethod('manual');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const { longitude, latitude } = position.coords;
        onStartCoordsResolved([longitude, latitude], 'My Location');
      },
      (geoError) => {
        setLoading(false);
        console.error('Geolocation Error:', geoError);
        let msg = 'Failed to acquire location.';
        if (geoError.code === 1) {
          msg = 'Geolocation permission denied. Please enter starting address manually.';
        } else if (geoError.code === 2) {
          msg = 'Location unavailable. Please enter starting address manually.';
        } else if (geoError.code === 3) {
          msg = 'Geolocation timed out. Please enter starting address manually.';
        }
        setError(msg);
        setMethod('manual');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleGeocodeManualAddress = async (e) => {
    e.preventDefault();
    if (!address || address.trim() === '') return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/shops/geocode?address=${encodeURIComponent(address.trim())}`);
      setLoading(false);
      if (response.data && response.data.success) {
        const { longitude, latitude, placeName } = response.data.data;
        onStartCoordsResolved([longitude, latitude], placeName || address);
      }
    } catch (err) {
      setLoading(false);
      console.error('Geocoding start location failure:', err);
      const errors = err.response?.data?.errors || [err.message || 'Geocoding failed'];
      setError(errors[0] === 'Address could not be located.' ? 'Address could not be located.' : errors[0]);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--border-dark)',
      borderRadius: 'var(--radius)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-md)',
      color: 'var(--text-main)',
      textAlign: 'left',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 0.25rem', color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: 700 }}>
        Directions to {shop.name}
      </h3>
      <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
        Select starting location to calculate driving route
      </p>

      {/* Select Starting Location Method */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => {
            setMethod('current');
            setError(null);
          }}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '6px',
            border: method === 'current' ? '1.5px solid var(--primary)' : '1px solid var(--border-dark)',
            background: method === 'current' ? 'var(--accent-light)' : 'transparent',
            color: method === 'current' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 'bold',
            transition: 'all 0.15s ease'
          }}
        >
          🛰️ Current Location
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod('manual');
            setError(null);
          }}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '6px',
            border: method === 'manual' ? '1.5px solid var(--primary)' : '1px solid var(--border-dark)',
            background: method === 'manual' ? 'var(--accent-light)' : 'transparent',
            color: method === 'manual' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 'bold',
            transition: 'all 0.15s ease'
          }}
        >
          ✍️ Enter Address
        </button>
      </div>

      {method === 'current' && (
        <div style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.6rem',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 6px rgba(201, 106, 45, 0.1)'
            }}
          >
            {loading ? 'Finding location...' : 'Get My Coordinates'}
          </button>
        </div>
      )}

      {method === 'manual' && (
        <form onSubmit={handleGeocodeManualAddress} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Connaught Place, New Delhi"
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border-dark)',
                outline: 'none',
                fontSize: '0.85rem',
                color: 'var(--text-main)',
                backgroundColor: '#fff'
              }}
              required
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.5rem 1rem',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Searching...' : 'Find'}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          color: 'var(--error)',
          fontSize: '0.8rem',
          marginBottom: '1rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      <button
        type="button"
        onClick={onCancel}
        style={{
          width: '100%',
          padding: '0.5rem',
          background: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-dark)',
          borderRadius: '6px',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--border)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        Cancel Directions
      </button>
    </div>
  );
};

export default DirectionControls;
