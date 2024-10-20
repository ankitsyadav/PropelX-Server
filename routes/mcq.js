const router = require("express").Router();
const axios = require("axios");
const authenticateUser = require("./verifyToken.js");

/**
 * @swagger
 * /mcq:
 *   get:
 *     summary: Fetches MCQ questions based on a skill
 *     tags: [MCQ]
 *     parameters:
 *       - in: query
 *         name: skill
 *         description: The skill for which questions are required
 *         required: true
 *         schema:
 *           type: string
 *           example: 'JavaScript'
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   question:
 *                     type: string
 *                   options:
 *                     type: object
 *                     properties:
 *                       a:
 *                         type: string
 *                       b:
 *                         type: string
 *                       c:
 *                         type: string
 *                       d:
 *                         type: string
 *                   correctoption:
 *                     type: string
 *                   timePerQuestion:
 *                     type: number
 *       400:
 *         description: Skill query parameter is required
 *       500:
 *         description: An error occurred while fetching questions
 */
router.get("/mcq", authenticateUser, async (req, res) => {
  const skill = req.query.skill;
  if (!skill) {
    return res.status(400).json({ error: "Skill query parameter is required" });
  }

  try {
    const questions = await fetchQuestions(skill);
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

async function fetchQuestions(skill) {
  try {
    const numQuestions = 5;
    const response = await axios.get(
      `https://opentdb.com/api.php?amount=${numQuestions}&category=18&difficulty=medium&type=multiple`
    );

    const data = response.data.results.map((question, index) => ({
      question: question.question,
      options: {
        a: question.incorrect_answers[0],
        b: question.incorrect_answers[1],
        c: question.incorrect_answers[2],
        d: question.correct_answer,
      },
      correctoption: "d", // Note: This is set to 'd' as an example. You need to handle this dynamically.
      timePerQuestion: 1,
    }));

    return data;
  } catch (error) {
    console.error(
      "API request error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch questions");
  }
}

module.exports = router;
