const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  lessons: [{
    title: String,
    content: String,
    videoUrl: String,
  }],
});

module.exports = mongoose.model('Course', courseSchema);