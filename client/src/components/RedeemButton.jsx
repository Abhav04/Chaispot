import { useState, useEffect } from 'react';
import api from '../services/api';

const RedeemButton = ({ points, shops, onRedeemSuccess }) => {
  const [selectedShopId, setSelectedShopId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Initialize selectedShopId with first shop if list loads
  useEffect(() => {
    if (shops && shops.length > 0 && !selectedShopId) {
      setSelectedShopId(shops[0]._id);
    }
  }, [shops, selectedShopId]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!selectedShopId) {
      setError('Please select a shop to redeem your coupon.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/rewards/redeem', {
        shopId: selectedShopId
      });

      if (response.data && response.data.success) {
        setSuccess(`Coupon generated successfully: ${response.data.coupon.code}`);
        if (onRedeemSuccess) {
          onRedeemSuccess(response.data.coupon, response.data.remainingPoints);
        }
      }
    } catch (err) {
      console.error('Coupon redemption error:', err);
      const errors = err.response?.data?.errors || [err.message || 'Failed to redeem coupon.'];
      setError(errors[0]);
    } finally {
      setLoading(false);
    }
  };

  const isPointsInsufficient = points < 50;

  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1.75rem',
      boxShadow: 'var(--shadow)',
      textAlign: 'left',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 1rem', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}>
        Redeem Coupon
      </h3>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          padding: '0.6rem 0.8rem',
          borderRadius: '6px',
          color: 'var(--error)',
          fontSize: '0.8rem',
          marginBottom: '1rem'
        }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '0.6rem 0.8rem',
          borderRadius: '6px',
          color: 'var(--success)',
          fontSize: '0.8rem',
          marginBottom: '1rem'
        }}>
          ✓ {success}
        </div>
      )}

      <form onSubmit={handleRedeem}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="shop-select" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Select Chai Shop
          </label>
          <select
            id="shop-select"
            value={selectedShopId}
            onChange={(e) => setSelectedShopId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem',
              borderRadius: '6px',
              border: '1px solid var(--border-dark)',
              background: '#fff',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
            disabled={loading || isPointsInsufficient || !shops || shops.length === 0}
          >
            {shops && shops.length > 0 ? (
              shops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name} ({shop.address})
                </option>
              ))
            ) : (
              <option value="">No shops available</option>
            )}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || isPointsInsufficient || !selectedShopId}
          style={{
            width: '100%',
            padding: '0.7rem',
            background: isPointsInsufficient ? '#E5E7EB' : 'var(--primary)',
            color: isPointsInsufficient ? '#9CA3AF' : '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: isPointsInsufficient || loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: isPointsInsufficient ? 'none' : '0 4px 10px rgba(201, 106, 45, 0.15)'
          }}
        >
          {loading ? 'Redeeming...' : isPointsInsufficient ? 'Need 50 points to redeem' : 'Redeem 50 Points for Coupon'}
        </button>
      </form>
    </div>
  );
};

export default RedeemButton;
