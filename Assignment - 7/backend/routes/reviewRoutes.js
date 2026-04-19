const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Course = require('../models/Course');

// Get reviews for a specific course
router.get('/course/:courseId', async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit a new review
router.post('/', async (req, res) => {
  const { courseId, studentName, rating, comment } = req.body;

  const review = new Review({
    courseId,
    studentName,
    rating,
    comment
  });

  try {
    const newReview = await review.save();
    
    // Update the course's average rating
    const allReviews = await Review.find({ courseId });
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = totalRating / allReviews.length;
    
    await Course.findByIdAndUpdate(courseId, { averageRating: avgRating });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
