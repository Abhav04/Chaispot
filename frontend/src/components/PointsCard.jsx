const PointsCard = ({ points }) => {
  return (
    <div style={{
      backgroundColor: 'var(--card-bg)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      color: 'var(--text-main)',
      boxShadow: 'var(--shadow)',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.05em' }}>
        ✨ Platform Reward Balance
      </h3>
      <span style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: '800', display: 'block', margin: '0.5rem 0' }}>
        {points}
      </span>
      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
        Earn 10–15 points per shop review. Redeem 50 points for a reward coupon code.
      </p>
    </div>
  );
};

export default PointsCard;
