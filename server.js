const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "AI YouTube Automation Backend is Running 🚀"
  });
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  res.json({
    reply: `You said: ${message}`
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
