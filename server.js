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

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: message,
    });

    console.log(response);

    let reply = "";

    if (response.text) {
      reply =
        typeof response.text === "function"
          ? response.text()
          : response.text;
    } else if (
      response.candidates &&
      response.candidates.length > 0
    ) {
      reply =
        response.candidates[0].content.parts[0].text;
    } else {
      reply = "No response from AI.";
    }

    res.json({
      reply,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message || "Gemini API Error",
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
