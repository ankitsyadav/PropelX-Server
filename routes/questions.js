// routes/questions.js
const express = require("express");
const Question = require("../models/Questions");
const router = express.Router();

// POST /api/admin/questions - Add a new question
router.post("/questions", async (req, res) => {
  const { question, options, correctOption } = req.body;

  // Validation
  if (!question || !options || !correctOption) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  if (!options[correctOption]) {
    return res
      .status(400)
      .json({ success: false, message: "Correct option must match one of the provided options." });
  }

  try {
    // Save question to DB
    const newQuestion = new Question({
      question,
      options,
      correctOption,
    });
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: "Question added successfully!",
      data: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// GET /api/admin/questions - Fetch all questions for the quiz
router.get("/questions", async (req, res) => {
  try {
    // Fetch all questions, excluding the correct answer
    const questions = await Question.find({}, { correctOption: 0 });

    res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
