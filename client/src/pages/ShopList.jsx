import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import ShopCard from '../components/ShopCard';
import { useAuth } from '../context/AuthContext';

const ShopList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await api.get('/shops');
        if (response.data && response.data.success) {
          setShops(response.data.data);
        }
      } catch (err) {
        console.error('Fetch Shops Error:', err);
        setError(err.response?.data?.message || err.message || 'Failed to retrieve shops list.');
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <div style={{
      maxWidth: '1100px',
      width: '100%',
      margin: '2rem auto',
      padding: '0 1.5rem 4rem',
      fontFamily: 'var(--sans)',
      boxSizing: 'border-box'
    }}>
      {/* Title Header Section */}
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
            Chai Shops
          </h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Discover and browse registered chai shops across the platform
          </p>
        </div>

        {isAuthenticated && (
          <button
            onClick={() => navigate('/add-shop')}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(201, 106, 45, 0.15)',
              transition: 'background-color 0.2s'
            }}
          >
            + Add Chai Shop
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>⏳</span>
          <h3>Loading shops list...</h3>
        </div>
      )}

      {/* Error alert message */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          padding: '1.25rem',
          borderRadius: 'var(--radius)',
          color: 'var(--error)',
          fontSize: '0.9rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Empty shops state */}
      {!loading && !error && shops.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--card-bg)',
          border: '1px dashed var(--border-dark)',
          borderRadius: 'var(--radius)',
          color: 'var(--text-muted)'
        }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🍂</span>
          <p style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 500 }}>
            No shops registered yet. Be the first to discover and share one!
          </p>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/add-shop')}
              style={{
                padding: '0.5rem 1.25rem',
                background: 'transparent',
                border: '1.5px solid var(--primary)',
                borderRadius: '6px',
                color: 'var(--primary)',
                fontWeight: 'bold',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Add Shop Now
            </button>
          ) : (
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none' }}>
              Log in to register a shop
            </Link>
          )}
        </div>
      )}

      {/* Responsive Grid layout of shop cards */}
      {!loading && !error && shops.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '1.5rem'
        }}>
          {shops.map((shop) => (
            <ShopCard key={shop._id} shop={shop} />
          ))}
        </div>
      )}

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ShopList;
