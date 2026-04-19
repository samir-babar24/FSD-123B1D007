const mongoose = require('mongoose');
const Course = require('./models/Course');
const Review = require('./models/Review');

const sampleCourses = [
  {
    title: 'Advanced React patterns and practices',
    description: 'Learn modern React hooks, state management, and enterprise-grade patterns to build scalable web applications. A perfect course for developers looking to master React.',
    instructor: 'Jane Doe',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    averageRating: 0
  },
  {
    title: 'Node.js Backend Architecture',
    description: 'Master Express, MongoDB, and architectural patterns like MVC, microservices, and secure API design in this comprehensive backend course.',
    instructor: 'John Smith',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    averageRating: 0
  },
  {
    title: 'UI/UX Design for Developers',
    description: 'Bite-sized design principles for developers. Learn layout, typography, colors, and accessibility to make your apps look stunning without being a designer.',
    instructor: 'Alice Williams',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    averageRating: 0
  }
];

mongoose.connect('mongodb://localhost:27017/course-feedback')
  .then(async () => {
    console.log('Connected to DB for seeding');
    await Course.deleteMany({});
    await Review.deleteMany({});
    await Course.insertMany(sampleCourses);
    console.log('Database seeded with courses!');
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
