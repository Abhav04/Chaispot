const CouponCard = ({ coupon }) => {
  const { code, shopId, redeemedAt, status } = coupon;
  const shopName = shopId?.name || 'Unknown Shop';
  const shopAddress = shopId?.address || '';

  const getStatusStyle = (badgeStatus) => {
    switch (badgeStatus) {
      case 'ACTIVE':
        return { background: 'rgba(16, 185, 129, 0.08)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' };
      case 'USED':
        return { background: 'rgba(107, 114, 128, 0.08)', color: 'var(--text-muted)', border: '1px solid rgba(107, 114, 128, 0.2)' };
      default:
        return { background: 'rgba(239, 68, 68, 0.08)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' };
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1.25rem 1.5rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'left',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: 'var(--shadow)',
      boxSizing: 'border-box'
    }}>
      <div>
        <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.98rem', color: 'var(--text-main)', fontWeight: 700 }}>{shopName}</h4>
        {shopAddress && <p style={{ margin: '0 0 0.6rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {shopAddress}</p>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ 
            fontFamily: 'monospace', 
            fontSize: '1.05rem', 
            fontWeight: '700', 
            background: 'var(--accent-light)', 
            padding: '0.2rem 0.6rem', 
            borderRadius: '6px', 
            color: 'var(--primary)',
            border: '1px solid rgba(201, 106, 45, 0.1)',
            letterSpacing: '1px'
          }}>
            {code}
          </span>
        </div>
      </div>

      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
        <span style={{ 
          fontSize: '0.72rem', 
          fontWeight: 'bold', 
          padding: '0.2rem 0.5rem', 
          borderRadius: '4px',
          ...getStatusStyle(status)
        }}>
          {status}
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Redeemed {new Date(redeemedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default CouponCard;
