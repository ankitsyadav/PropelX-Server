const router = require("express").Router();
const { OpenAI } = require("openai");


const openAiApiKeyesssS = process.env.OPEN_API_KEY;

const openai = new OpenAI({
  apiKey: openAiApiKeyesssS,
});

router.post("/latest-articles", async (req, res) => {
  const { skill } = req.body;

  if (typeof skill !== "string" || !skill.trim()) {
    return res.status(400).json({ error: "Skill must be a non-empty string" });
  }

  try {
    const prompt = `Generate a list of 10 article suggestions for the following topics: "${skill}". 
    Format the response strictly in JSON like this:
    [
      { "title": "Title 1", "link": "https://example.com/article1" },
      { "title": "Title 2", "link": "https://example.com/article2" },
      ...
    ]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an assistant that generates JSON responses only." },
        { role: "user", content: prompt },
      ],
    });

    const rawContent = response.choices[0].message.content;

    let articles;
    try {
      // Validate JSON
      articles = JSON.parse(rawContent);
    } catch (err) {
      console.error("Invalid JSON response:", rawContent);
      return res.status(500).json({
        error: "Invalid JSON response. Please try again.",
        response: rawContent, // Return the raw response for debugging
      });
    }

    res.status(200).json({ articles });
  } catch (error) {
    console.error("Error generating articles:", error.message);
    res.status(500).json({ error: "An error occurred while generating articles" });
  }
});

module.exports = router;
