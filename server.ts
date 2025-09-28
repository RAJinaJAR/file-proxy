import express = require("express");
import fetch from "node-fetch";
import cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url as string;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing url query parameter" });
  }

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch target" });
    }

    // Stream the file back
    res.setHeader("Access-Control-Allow-Origin", "*");
    response.body.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

