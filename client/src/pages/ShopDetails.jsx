import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';

const ShopDetails = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();

  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shop metadata and corresponding reviews list
  const fetchShopData = useCallback(async () => {
    try {
      const [shopRes, reviewsRes] = await Promise.all([
        api.get(`/shops/${id}`),
        api.get(`/shops/${id}/reviews`)
      ]);

      if (shopRes.data && shopRes.data.success) {
        setShop(shopRes.data.data);
      }
      if (reviewsRes.data && reviewsRes.data.success) {
        setReviews(reviewsRes.data.data);
      }
    } catch (err) {
      console.error('Fetch shop details error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to retrieve shop details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  const handleReviewSubmitSuccess = () => {
    // Re-fetch updated reviews & shop stats immediately on submission
    fetchShopData();
    // Update global user points balance in header and dashboard
    refreshUser();
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem', animation: 'spin 1s linear infinite' }}>⏳</span>
        <h3>Loading shop profile details...</h3>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          padding: '2rem',
          borderRadius: 'var(--radius)',
          color: 'var(--error)'
        }}>
          <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>Error Loading Details</h4>
          <p>{error || 'Shop profile could not be found.'}</p>
        </div>
        <Link to="/shops" style={{ display: 'inline-block', marginTop: '1.5rem', color: 'var(--primary)', fontWeight: 'bold' }}>
          Back to Shops List
        </Link>
      </div>
    );
  }

  // Check if current user has already reviewed the shop
  const existingReview = reviews.find(
    (rev) => rev.userId === user?._id || rev.userId?._id === user?._id
  );

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
            {shop.name}
          </h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            📍 {shop.address}
          </p>
        </div>
        <Link to="/shops" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
          ← Back to Shops
        </Link>
      </div>

      {/* Main Details Dashboard Grid */}
      <div className="details-grid">
        
        {/* Left Side: Shop Stats & Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Shop photo if available */}
          {shop.photoUrl && (
            <div style={{
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border)'
            }}>
              <img
                src={shop.photoUrl}
                alt={shop.name}
                style={{ width: '100%', maxHeight: '350px', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.target.parentNode.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Description & Stats cards */}
          <div style={{ 
            backgroundColor: 'var(--card-bg)', 
            border: '1px solid var(--border)', 
            borderRadius: 'var(--radius)', 
            padding: '2rem', 
            textAlign: 'left',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ margin: '0 0 0.75rem', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}>
              Description
            </h3>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {shop.description}
            </p>
            
            <div style={{
              display: 'flex',
              gap: '3rem',
              borderTop: '1px solid var(--border)',
              paddingTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                  Average Rating
                </span>
                <span style={{ fontSize: '1.8rem', color: '#d97706', fontWeight: 800 }}>
                  ⭐ {shop.averageRating ? shop.averageRating.toFixed(1) : '0.0'}
                </span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                  Reviews count
                </span>
                <span style={{ fontSize: '1.8rem', color: 'var(--text-main)', fontWeight: 800 }}>
                  💬 {shop.reviewCount || 0} reviews
                </span>
              </div>
            </div>
          </div>

          {/* Reviews list */}
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              User Reviews
            </h3>
            <ReviewList reviews={reviews} />
          </div>
        </div>

        {/* Right Side: Submission Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {user ? (
            <ReviewForm 
              shopId={shop._id} 
              existingReview={existingReview} 
              onSubmitSuccess={handleReviewSubmitSuccess} 
            />
          ) : (
            <div style={{ 
              backgroundColor: 'var(--card-bg)', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius)', 
              padding: '2rem 1.5rem', 
              textAlign: 'center',
              boxShadow: 'var(--shadow)',
              boxSizing: 'border-box'
            }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🔑</span>
              <p style={{ margin: '0 0 1.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                Please log in to your account to write a review or update your rating.
              </p>
              <Link to="/login" style={{ 
                display: 'block', 
                padding: '0.6rem 1.25rem', 
                background: 'var(--primary)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: 'bold', 
                fontSize: '0.85rem', 
                textDecoration: 'none',
                boxShadow: '0 4px 10px rgba(201, 106, 45, 0.15)'
              }}>
                Login Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
