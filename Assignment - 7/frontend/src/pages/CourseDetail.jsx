import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [studentName, setStudentName] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch course details and reviews parallelly
    const fetchDetails = async () => {
      try {
        const [courseRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${id}`),
          axios.get(`http://localhost:5000/api/reviews/course/${id}`)
        ]);
        setCourse(courseRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName || !comment) return alert('Please fill in all fields');
    
    setIsSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/reviews', {
        courseId: id,
        studentName,
        rating: Number(rating),
        comment
      });
      // Add new review to top of list
      setReviews([res.data, ...reviews]);
      // Reset form
      setStudentName('');
      setComment('');
      setRating('5');
    } catch (err) {
      console.error('Error submitting review', err);
      alert('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (ratingValue) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < Math.round(ratingValue) ? '#F59E0B' : 'transparent'}
        color="#F59E0B"
      />
    ));
  };

  if (loading) return <p className="text-center">Loading course details...</p>;
  if (!course) return <p className="text-center">Course not found.</p>;

  return (
    <div className="detail-container">
      {/* Left Column: Course Info */}
      <div className="detail-section">
        <img src={course.imageUrl} alt={course.title} className="detail-image" />
        <h1 className="detail-title">{course.title}</h1>
        <p style={{ color: 'var(--text-light)', marginBottom: '15px' }}>
          Instructor: <strong>{course.instructor}</strong>
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <div className="rating-stars">{renderStars(course.averageRating)}</div>
          <span>({course.averageRating ? course.averageRating.toFixed(1) : 'No ratings'})</span>
        </div>

        <p style={{ lineHeight: '1.6', marginBottom: '30px' }}>{course.description}</p>

        <h3>Leave a Review</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Rating</label>
            <select 
              className="form-select" 
              value={rating} 
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Comment</label>
            <textarea 
              className="form-textarea" 
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think about this course?"
            ></textarea>
          </div>
          <button type="submit" className="btn btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Right Column: Reviews List */}
      <div className="detail-section">
        <h2 style={{ marginBottom: '20px' }}>Student Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>No reviews yet. Be the first to review!</p>
        ) : (
          <div className="review-list">
            {reviews.map(review => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <span className="review-author">{review.studentName}</span>
                  <div className="rating-stars">{renderStars(review.rating)}</div>
                </div>
                <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {review.comment}
                </p>
                <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '10px', display: 'block' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
