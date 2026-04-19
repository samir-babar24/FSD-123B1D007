import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Header() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <BookOpen size={28} color="var(--primary)" />
        CourseHub
      </Link>
    </nav>
  );
}
