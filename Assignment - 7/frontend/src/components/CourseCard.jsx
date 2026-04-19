import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function CourseCard({ course }) {
  // Array to loop through for stars
  const starsBadge = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={16}
      fill={i < Math.round(course.averageRating) ? '#F59E0B' : 'transparent'}
      color="#F59E0B"
    />
  ));

  return (
    <div className="card">
      <img src={course.imageUrl} alt={course.title} className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{course.title}</h3>
        <p className="card-subtitle">Instructor: {course.instructor}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
          <div className="rating-stars">{starsBadge}</div>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
            ({course.averageRating ? course.averageRating.toFixed(1) : 'No ratings'})
          </span>
        </div>
        <Link to={`/course/${course._id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}
