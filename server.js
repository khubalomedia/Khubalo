import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.YT_API_KEY;
const CHANNEL_ID = "UC5reF0zkdOnB3GEpVqNJfHw";

// 🔹 Helper function
async function fetchYouTube(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

// ✅ Root route (fix blank page)
app.get("/", (req, res) => {
  res.send("YouTube API backend running 🚀");
});

// ✅ Latest videos
app.get("/latest", async (req, res) => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;
    const data = await fetchYouTube(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch latest videos" });
  }
});

// ✅ Playlist videos
app.get("/playlist", async (req, res) => {
  try {
    const playlistId = req.query.id;

    if (!playlistId) {
      return res.status(400).json({ error: "Missing playlist ID" });
    }

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=20`;
    const data = await fetchYouTube(url);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
});

// ✅ Popular videos
app.get("/popular", async (req, res) => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=viewCount&maxResults=10`;
    const data = await fetchYouTube(url);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch popular videos" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});