import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch courses from API
    axios.get('http://localhost:5000/api/courses')
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Explore Top Courses</h1>
        <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
          Discover and review the latest courses added by top instructors.
        </p>
      </div>

      {loading ? (
        <p className="text-center">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center">No courses found. Add some from the backend!</p>
      ) : (
        <div className="course-grid">
          {courses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
