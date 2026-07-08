import ReviewCard from './ReviewCard';

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div style={{ 
        padding: '3rem 1.5rem', 
        textAlign: 'center', 
        color: 'var(--text-muted)', 
        border: '1.5px dashed var(--border-dark)', 
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--card-bg)',
        fontSize: '0.9rem'
      }}>
        💬 No reviews submitted for this shop yet. Be the first to share your experience!
      </div>
    );
  }

  return (
    <div style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: '0.4rem' }}>
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
