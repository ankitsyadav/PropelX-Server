// routes/quiz.js
const express = require("express");
const QuizScore = require("../models/QuizScore");
const Question = require("../models/Questions");
const User = require("../models/UserModel");
const router = express.Router();

router.get("/status", async (req, res) => {
  const { studentId } = req.query;

  if (!studentId) {
    return res
      .status(400)
      .json({ success: false, message: "Student ID is required." });
  }

  try {
    // Check if the student has already submitted the quiz
    const studentScore = await QuizScore.findOne({ studentId });

    if (studentScore) {
      // Fetch all scores, sorted by highest score and earliest submission
      const scores = await QuizScore.find({}).sort({ score: -1, timestamp: 1 });

      // Enrich scores with user details
      const leaderboard = await Promise.all(
        scores.map(async (score) => {
          const user = await User.findOne({ _id: score.studentId });
          return {
            studentId: score.studentId,
            score: score.score,
            timestamp: score.timestamp,
            name: user?.name || "Unknown",
            // profileImageUrl: user?.profileImageUrl || null,
          };
        })
      );

      // Find the student's rank
      const rank =
        leaderboard.findIndex((entry) => entry.studentId === studentId) + 1;

      // Get the top 10 students for the leaderboard
      const topLeaderboard = leaderboard.slice(0, 10);

      return res.status(200).json({
        success: true,
        completed: true,
        leaderboard: topLeaderboard,
        studentRank: rank,
        totalStudents: leaderboard.length,
      });
    }

    // If no submission found
    res.status(200).json({
      success: true,
      completed: false,
      message: "The student has not yet completed the quiz.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/leaderboard", async (req, res) => {
  const { studentId } = req.query;

  if (!studentId) {
    return res
      .status(400)
      .json({ success: false, message: "Student ID is required." });
  }

  try {
    // Fetch all scores, sorted by highest score and earliest submission
    const scores = await QuizScore.find({}).sort({ score: -1, timestamp: 1 });

    // Enrich scores with user details
    const leaderboard = await Promise.all(
      scores.map(async (score) => {
        const user = await User.findOne({ _id: score.studentId });
        return {
          studentId: score.studentId,
          score: score.score,
          timestamp: score.timestamp,
          name: user?.name || "Unknown",
          // profileImageUrl: user?.profileImageUrl || null,
        };
      })
    );

    // Find the student's rank
    const rank =
      leaderboard.findIndex((entry) => entry.studentId === studentId) + 1;

    // Get the top 10 students for the leaderboard
    const topLeaderboard = leaderboard.slice(0, 10);

    res.status(200).json({
      success: true,
      leaderboard: topLeaderboard,
      studentRank: rank,
      totalStudents: leaderboard.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

// POST /api/quiz/submit - Submit quiz answers and calculate score
router.post("/submit", async (req, res) => {
  const { studentId, answers } = req.body;

  if (!studentId || !answers) {
    return res.status(400).json({
      success: false,
      message: "Student ID and answers are required.",
    });
  }

  try {
    // Check if the student has already submitted the quiz
    const existingSubmission = await QuizScore.findOne({ studentId });

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message:
          "You have already submitted the quiz. Multiple submissions are not allowed.",
      });
    }

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

    res.status(200).json({
      success: true,
      score,
      message: "Quiz submitted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
