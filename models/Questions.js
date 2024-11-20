// models/Question.js
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: Map,
    of: String, // Option keys (a, b, c, d) with corresponding text
    required: true,
  },
  correctOption: {
    type: String, // 'a', 'b', 'c', or 'd'
    required: true,
    enum: ["a", "b", "c", "d"], // Valid option keys
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
