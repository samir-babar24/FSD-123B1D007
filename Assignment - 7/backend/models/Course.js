const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  imageUrl: { type: String, default: 'https://via.placeholder.com/400x300?text=Course' },
  averageRating: { type: Number, default: 0 },
});

module.exports = mongoose.model('Course', courseSchema);
