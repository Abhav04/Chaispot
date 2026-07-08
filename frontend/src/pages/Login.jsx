import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setErrors(result.errors || ['Failed to authenticate']);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1.5rem',
      backgroundColor: 'var(--bg)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--card-bg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border)',
        boxSizing: 'border-box',
        textAlign: 'left'
      }}>
        {/* Title & Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🍵</span>
          <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Log in to your ChaiSpot account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email input field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.75rem',
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

          {/* Password input field */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem',
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

          {/* Errors display */}
          {errors.length > 0 && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.75rem',
              borderRadius: '8px',
              color: 'var(--error)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
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
            {submitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
