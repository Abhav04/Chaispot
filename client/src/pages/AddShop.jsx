import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddShop = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const response = await api.post('/shops', {
        name,
        address,
        description,
        photoUrl
      });
      setSubmitting(false);
      if (response.data && response.data.success) {
        navigate('/shops');
      }
    } catch (error) {
      setSubmitting(false);
      console.error('Add Shop Request Error:', error);
      const errorsList = error.response?.data?.errors || [error.message || 'Failed to create shop'];
      setErrors(errorsList);
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      width: '100%',
      margin: '3rem auto',
      padding: '0 1.5rem 4rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-md)',
        padding: '2.5rem',
        textAlign: 'left',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <h2 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
          Add New Chai Shop
        </h2>
        <p style={{ margin: '0 0 2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Describe the shop. The address will be automatically geocoded on the server using OpenStreetMap.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Shop Name field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Shop Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Raju Chai Stall"
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: '8px',
                border: '1px solid var(--border-dark)',
                outline: 'none',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              required
              disabled={submitting}
            />
          </div>

          {/* Address field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="address" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Ramphal Chowk, Dwarka, Delhi"
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: '8px',
                border: '1px solid var(--border-dark)',
                outline: 'none',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              required
              disabled={submitting}
            />
          </div>

          {/* Description field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the specials, seating, and tea taste..."
              rows="4"
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: '8px',
                border: '1px solid var(--border-dark)',
                outline: 'none',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                fontFamily: 'var(--sans)',
                lineHeight: '1.4',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
              required
              disabled={submitting}
            />
          </div>

          {/* Photo URL field */}
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="photoUrl" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Photo URL (Optional)
            </label>
            <input
              id="photoUrl"
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: '8px',
                border: '1px solid var(--border-dark)',
                outline: 'none',
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              disabled={submitting}
            />
          </div>

          {/* Errors display */}
          {errors.length > 0 && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.75rem',
              borderRadius: '8px',
              color: 'var(--error)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                boxShadow: '0 4px 10px rgba(201, 106, 45, 0.15)'
              }}
            >
              {submitting ? 'Geocoding & Adding...' : 'Add Shop'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/shops')}
              disabled={submitting}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-dark)',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--border)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShop;
