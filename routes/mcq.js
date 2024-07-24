const router = require("express").Router();
const axios = require("axios");
const authenticateUser = require("./verifyToken.js");


router.get('/mcq',authenticateUser, async (req, res) => {
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
    const response = await axios.get(`https://opentdb.com/api.php?amount=${numQuestions}&category=18&difficulty=easy&type=multiple`);

    const data = response.data.results.map((question, index) => ({
      question: question.question,
      options: {
        a: question.incorrect_answers[0],
        b: question.incorrect_answers[1],
        c: question.incorrect_answers[2],
        d: question.correct_answer
      },
      correctoption: 'd', // Note: This is set to 'd' as an example. You need to handle this dynamically.
      timePerQuestion: 1
    }));

    return data;
  } catch (error) {
    console.error("API request error:", error.response ? error.response.data : error.message);
    throw new Error("Failed to fetch questions");
  }
}




module.exports = router;
