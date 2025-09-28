// Use CommonJS-compatible import style
import express = require("express");
import fetch from "node-fetch";
import cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/proxy", async (req, res) => {
  const targetUrl = req.query.url as string;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing ?url parameter" });
  }

  try {
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch ${targetUrl}`,
        status: response.status,
        statusText: response.statusText,
      });
    }

    if (!response.body) {
      return res.status(500).json({ error: "Empty response body" });
    }

    // Forward headers (important for binary/zip files)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "application/octet-stream"
    );

    response.body.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy request failed", details: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
