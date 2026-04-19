const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new course
router.post('/', async (req, res) => {
  const course = new Course({
    title: req.body.title,
    description: req.body.description,
    instructor: req.body.instructor,
    imageUrl: req.body.imageUrl
  });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
