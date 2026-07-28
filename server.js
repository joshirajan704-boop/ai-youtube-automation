require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { InferenceClient } = require("@huggingface/inference");
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const hf = new InferenceClient(process.env.HF_TOKEN);
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Backend Running 🚀"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(message);

    const reply = result.response.text();

    res.json({
      reply
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      reply: err.message
    });
  }
});

const PORT = process.env.PORT || 10000;
app.post("/generate-video", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    const video = await hf.textToVideo({
      provider: "fal-ai",
      model: "Wan-AI/Wan2.2-TI2V-5B",
      inputs: prompt,
    });

    const buffer = Buffer.from(await video.arrayBuffer());

    res.setHeader("Content-Type", video.type || "video/mp4");
    res.setHeader("Content-Length", buffer.length);

    return res.send(buffer);
  } catch (err) {
    console.error("Video generation error:", err);

    return res.status(500).json({
      error: err.message || "Video generation failed",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
