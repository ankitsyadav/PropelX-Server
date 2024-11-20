// models/QuizScore.js
const mongoose = require("mongoose");

const QuizScoreSchema = new mongoose.Schema({
  studentId: {
    type: String, // Unique ID for the student (could be email, userId, etc.)
    required: true,
  },
  score: {
    type: Number, // Quiz score
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // When the quiz was submitted
  },
});

module.exports = mongoose.model("QuizScore", QuizScoreSchema);
