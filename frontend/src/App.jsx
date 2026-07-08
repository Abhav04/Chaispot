import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ShopList from './pages/ShopList';
import AddShop from './pages/AddShop';
import MapPage from './pages/MapPage';
import ShopDetails from './pages/ShopDetails';
import Rewards from './pages/Rewards';
import './App.css';

// Global Navigation Header Bar
const NavigationBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hide nav on login and signup pages for a clean full-screen look
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? 'var(--primary)' : 'var(--text-muted)',
    fontWeight: location.pathname === path ? '700' : '500',
    textDecoration: 'none',
    fontSize: '0.9rem',
    padding: '0.5rem 0.25rem',
    borderBottom: location.pathname === path ? '2px solid var(--primary)' : '2px solid transparent',
    transition: 'all 0.15s ease-in-out'
  });

  return (
    <header style={{
      backgroundColor: 'var(--card-bg)',
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Logo and Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
          <span>🍵</span>
          <span style={{ fontFamily: 'var(--sans)', letterSpacing: '-0.025em' }}>ChaiSpot</span>
        </Link>

        {/* Navigation links */}
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/map" style={linkStyle('/map')}>View Map</Link>
          <Link to="/shops" style={linkStyle('/shops')}>Browse Shops</Link>
          {user && (
            <>
              <Link to="/add-shop" style={linkStyle('/add-shop')}>Add Shop</Link>
              <Link to="/rewards" style={linkStyle('/rewards')}>Rewards</Link>
            </>
          )}
        </nav>

        {/* User control buttons on right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{user.email}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✨ {user.points || 0} Points</span>
              </div>
              <button
                onClick={logout}
                style={{
                  padding: '0.45rem 1rem',
                  backgroundColor: 'transparent',
                  color: 'var(--error)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out'
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, padding: '0.5rem 1rem' }}>
                Login
              </Link>
              <Link to="/signup" style={{
                fontSize: '0.9rem',
                color: '#fff',
                backgroundColor: 'var(--primary)',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: 'bold',
                boxShadow: '0 4px 10px rgba(201, 106, 45, 0.15)'
              }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Dashboard component for the protected root (/)
const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div style={{
      maxWidth: '800px',
      width: '100%',
      margin: '4rem auto',
      padding: '0 1.5rem',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-md)',
        padding: '3rem 2rem',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🍵</span>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)' }}>
          Welcome back to ChaiSpot!
        </h1>
        <p style={{ margin: '0 0 2rem', color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Discover local chai shops, share reviews, and claim rewards.
        </p>

        {/* Profile Card Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2.5rem',
          textAlign: 'left'
        }}>
          <div style={{
            background: 'var(--accent-light)',
            border: '1px solid var(--border-dark)',
            padding: '1.25rem 1.5rem',
            borderRadius: '8px'
          }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              Account Profile
            </span>
            <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', marginTop: '0.25rem', wordBreak: 'break-all' }}>
              {user?.email}
            </span>
          </div>

          <div style={{
            background: 'var(--accent-light)',
            border: '1px solid var(--border-dark)',
            padding: '1.25rem 1.5rem',
            borderRadius: '8px'
          }}>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
              Platform Points
            </span>
            <span style={{ display: 'block', fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.1rem' }}>
              ✨ {user?.points || 0} Points
            </span>
          </div>
        </div>

        {/* Navigation Quick Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/map" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--primary)',
            color: '#fff',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            boxShadow: '0 4px 10px rgba(201, 106, 45, 0.15)'
          }}>
            Explore Interactive Map
          </Link>
          <Link to="/shops" style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '0.95rem'
          }}>
            Browse Shops List
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/shops" element={<ShopList />} />
            <Route path="/shops/:id" element={<ShopDetails />} />
            <Route path="/map" element={<MapPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-shop"
              element={
                <ProtectedRoute>
                  <AddShop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
