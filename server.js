require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "AI YouTube Automation Backend Running 🚀",
  });
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
  contents: message,
});

    res.json({
      reply: response.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Gemini API Error",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
