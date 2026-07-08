import { useState, useEffect } from 'react';
import api from '../services/api';

const ReviewForm = ({ shopId, existingReview, onSubmitSuccess }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Pre-populate input fields if the logged-in user already wrote a review
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setText(existingReview.text);
    } else {
      setRating(5);
      setText('');
    }
    setError(null);
    setSuccessMsg(null);
  }, [existingReview, shopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Review text is required.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await api.post(`/shops/${shopId}/reviews`, {
        rating: parseInt(rating),
        text: text.trim()
      });

      if (response.data && response.data.success) {
        setSuccessMsg(existingReview ? 'Review updated successfully!' : 'Review submitted successfully!');
        if (onSubmitSuccess) {
          onSubmitSuccess(response.data.data);
        }
      }
    } catch (err) {
      console.error('Post review error:', err);
      const errors = err.response?.data?.errors || [err.message || 'Failed to submit review.'];
      setError(errors[0]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ 
      backgroundColor: 'var(--card-bg)', 
      border: '1px solid var(--border)', 
      borderRadius: 'var(--radius)', 
      padding: '1.75rem', 
      textAlign: 'left',
      boxShadow: 'var(--shadow)',
      boxSizing: 'border-box'
    }}>
      <h4 style={{ margin: '0 0 1rem', color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 700 }}>
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h4>

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

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '0.6rem 0.8rem',
          borderRadius: '6px',
          color: 'var(--success)',
          fontSize: '0.8rem',
          marginBottom: '1rem'
        }}>
          ✓ {successMsg}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="rating-select" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Rating
        </label>
        <select
          id="rating-select"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '0.6rem', 
            borderRadius: '6px', 
            border: '1px solid var(--border-dark)', 
            outline: 'none',
            background: '#fff', 
            color: 'var(--text-main)', 
            fontSize: '0.85rem' 
          }}
          disabled={loading}
        >
          <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
          <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
          <option value="3">⭐⭐⭐ (3 - Average)</option>
          <option value="2">⭐⭐ (2 - Poor)</option>
          <option value="1">⭐ (1 - Terrible)</option>
        </select>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="review-text" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Review details
        </label>
        <textarea
          id="review-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share details of your experience..."
          rows="4"
          maxLength="500"
          style={{ 
            width: '100%', 
            padding: '0.6rem', 
            borderRadius: '6px', 
            border: '1px solid var(--border-dark)', 
            outline: 'none',
            fontSize: '0.85rem', 
            color: 'var(--text-main)',
            resize: 'vertical',
            fontFamily: 'var(--sans)',
            lineHeight: '1.4',
            boxSizing: 'border-box'
          }}
          disabled={loading}
          required
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
          <span>Max 500 characters</span>
          <span>{text.length}/500</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '0.65rem', 
          background: 'var(--primary)', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '8px', 
          fontWeight: 'bold', 
          fontSize: '0.85rem', 
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 10px rgba(201, 106, 45, 0.15)'
        }}
      >
        {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
