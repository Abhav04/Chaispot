import { Link } from 'react-router-dom';

const ShopCard = ({ shop }) => {
  const { name, address, description, photoUrl, location, averageRating, reviewCount } = shop;
  const longitude = location?.coordinates?.[0];
  const latitude = location?.coordinates?.[1];

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1.5rem',
      backgroundColor: 'var(--card-bg)',
      boxShadow: 'var(--shadow)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
      textAlign: 'left',
      boxSizing: 'border-box',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--shadow)';
    }}
    >
      {/* Photo header if url exists */}
      {photoUrl && (
        <img
          src={photoUrl}
          alt={name}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '0.4rem'
          }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      )}

      <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: 700 }}>
        {name}
      </h3>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        📍 <strong>Address:</strong> {address}
      </p>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        📝 <strong>Description:</strong> {description}
      </p>
      
      {longitude !== undefined && latitude !== undefined && (
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          🌐 Lon {longitude.toFixed(6)}, Lat {latitude.toFixed(6)}
        </p>
      )}

      {/* Card ratings footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.5rem',
        borderTop: '1px solid var(--border)',
        paddingTop: '0.75rem'
      }}>
        <div style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 700 }}>
          <span>⭐ {averageRating ? averageRating.toFixed(1) : '0.0'} ({reviewCount || 0} reviews)</span>
        </div>
        <Link 
          to={`/shops/${shop._id}`} 
          style={{ 
            padding: '0.45rem 1rem', 
            background: 'var(--primary)', 
            color: '#fff', 
            borderRadius: '6px', 
            textDecoration: 'none', 
            fontWeight: 'bold', 
            fontSize: '0.8rem',
            boxShadow: '0 2px 5px rgba(201, 106, 45, 0.1)'
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ShopCard;
