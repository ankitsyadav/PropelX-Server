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

router.get("/check-completion", async (req, res) => {
  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).json({
      success: false,
      message: "Student ID is required.",
    });
  }

  try {
    // Fetch all questions to calculate the total
    const totalQuestions = await Question.countDocuments({});

    // Check if the student has already submitted the quiz
    const existingSubmission = await QuizScore.findOne({ studentId });

    if (existingSubmission) {
      // Fetch all scores sorted by highest score and earliest submission
      const scores = await QuizScore.find({}).sort({ score: -1, timestamp: 1 });

      // Fetch user details for all student IDs
      const studentIds = scores.map((score) => score.studentId);
      const users = await User.find({ _id: { $in: studentIds } });

      // Create a leaderboard with student details
      const leaderboard = scores.map((score, index) => {
        const user = users.find((user) => user._id.toString() === score.studentId.toString());
        return {
          _id: score._id,
          studentId: score.studentId,
          studentName: user?.name || "Unknown", // Include student name
          score: score.score,
          timestamp: score.timestamp,
          rank: index + 1, // Calculate rank based on sorted position
        };
      });

      // Find the student's rank and score
      const studentRank =
        leaderboard.findIndex((entry) => entry.studentId === studentId) + 1;
      const studentEntry = leaderboard.find((entry) => entry.studentId === studentId);

      return res.status(200).json({
        completed: true,
        leaderboard,
        studentRank,
        studentName: studentEntry?.studentName || "Unknown", // Include student's name
        studentScore: studentEntry?.score || 0, // Include student's score
        totalQuestions, // Include the total number of questions
      });
    }

    res.status(200).json({
      completed: false,
      message: "The student has not yet completed the quiz.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
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
