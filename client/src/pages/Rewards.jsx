import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PointsCard from '../components/PointsCard';
import RedeemButton from '../components/RedeemButton';
import CouponCard from '../components/CouponCard';

const Rewards = () => {
  const { refreshUser } = useAuth();
  const [points, setPoints] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch points, coupons list, and geocoded shops from backend
  const fetchRewardsData = useCallback(async () => {
    try {
      const [pointsRes, couponsRes, shopsRes] = await Promise.all([
        api.get('/users/me/points'),
        api.get('/users/me/coupons'),
        api.get('/shops')
      ]);

      if (pointsRes.data && pointsRes.data.success) {
        setPoints(pointsRes.data.points);
      }
      if (couponsRes.data && couponsRes.data.success) {
        setCoupons(couponsRes.data.data);
      }
      if (shopsRes.data && shopsRes.data.success) {
        setShops(shopsRes.data.data);
      }
      
      // Sync global user state points balance
      refreshUser();
    } catch (err) {
      console.error('Fetch rewards dashboard error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to retrieve rewards details.');
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    fetchRewardsData();
  }, [fetchRewardsData]);

  const handleRedeemSuccess = (newCoupon, remainingPoints) => {
    // 1. Instantly update points balance state
    setPoints(remainingPoints);
    // 2. Prepend the new coupon to the list history
    setCoupons((prevCoupons) => [newCoupon, ...prevCoupons]);
    // 3. Re-fetch coupons to populate shop metadata details properly
    fetchRewardsData();
    // 4. Update the global context
    refreshUser();
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }}>⏳</span>
        <h3>Loading rewards dashboard...</h3>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '1100px',
      width: '100%',
      margin: '2rem auto',
      padding: '0 1.5rem 4rem',
      fontFamily: 'var(--sans)',
      boxSizing: 'border-box'
    }}>
      {/* Header and Back navigation */}
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
            Rewards Program
          </h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Redeem review points for unique platform tea coupons
          </p>
        </div>
        <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Dashboard
        </Link>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          padding: '1rem',
          borderRadius: '8px',
          color: 'var(--error)',
          fontSize: '0.9rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="rewards-grid" style={{ textAlign: 'left' }}>
        
        {/* Left Column: Points & Redeem */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <PointsCard points={points} />
          <RedeemButton 
            points={points} 
            shops={shops} 
            onRedeemSuccess={handleRedeemSuccess} 
          />
        </div>

        {/* Right Column: Coupon History */}
        <div>
          <h3 style={{ margin: '0 0 1.25rem', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 800 }}>
            Coupons History
          </h3>
          {coupons && coupons.length > 0 ? (
            <div style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: '0.4rem' }}>
              {coupons.map((coupon) => (
                <CouponCard key={coupon._id} coupon={coupon} />
              ))}
            </div>
          ) : (
            <div style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              border: '1.5px dashed var(--border-dark)',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--card-bg)',
              fontSize: '0.9rem'
            }}>
              🎟️ You haven't redeemed any coupons yet. Earn points by reviewing shops to get started!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Rewards;
