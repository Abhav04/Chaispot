const ReviewCard = ({ review }) => {
  const { rating, text, userId, createdAt } = review;
  const userEmail = userId?.email || 'Anonymous';
  
  // Create solid stars for the rating, and outline stars for the rest
  const starsStr = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div style={{ 
      backgroundColor: 'var(--card-bg)', 
      border: '1px solid var(--border)', 
      borderRadius: 'var(--radius)', 
      padding: '1.25rem', 
      marginBottom: '0.75rem', 
      boxShadow: 'var(--shadow)',
      textAlign: 'left' 
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>{userEmail}</span>
        <span style={{ color: '#d97706', fontSize: '0.9rem', letterSpacing: '1px' }}>{starsStr}</span>
      </div>
      <p style={{ margin: '0 0 0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
        {text}
      </p>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
        Reviewed on {new Date(createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ReviewCard;
