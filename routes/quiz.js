// routes/quiz.js
const express = require("express");
const QuizScore = require("../models/QuizScore");
const Question = require("../models/Questions");
const router = express.Router();


router.get("/leaderboard", async (req, res) => {
    const { studentId } = req.query;
  
    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required." });
    }
  
    try {
      // Fetch all scores, sorted by highest score and earliest submission
      const scores = await QuizScore.find({}).sort({ score: -1, timestamp: 1 });
  
      // Calculate the student's rank
      const rank = scores.findIndex((score) => score.studentId === studentId) + 1;
  
      res.status(200).json({
        success: true,
        leaderboard: scores.slice(0, 10), // Top 10 students
        studentRank: rank,
        totalStudents: scores.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  });

// POST /api/quiz/submit - Submit quiz answers and calculate score
router.post("/submit", async (req, res) => {
  const { studentId, answers } = req.body;

  if (!studentId || !answers) {
    return res.status(400).json({ success: false, message: "Student ID and answers are required." });
  }

  try {
    // Fetch all questions
    const questions = await Question.find({});

    // Calculate the score
    let score = 0;
    questions.forEach((question) => {
      if (answers[question._id] === question.correctOption) {
        score++;
      }
    });

    // Save the score to the database
    const quizScore = new QuizScore({ studentId, score });
    await quizScore.save();

    res.status(200).json({ success: true, score, message: "Quiz submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});
module.exports = router;
