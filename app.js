const API_KEY = "AIzaSyD6o4Zwpt0Qim-6lLdJ4Ti0gUWJbrMwk-Y"; // replace
const CHANNEL_ID = "UC5reF0zkdOnB3GEpVqNJfHw";

let player;

// YouTube API ready
function onYouTubeIframeAPIReady() {
  player = new YT.Player("g0xtSq2ZcQSQ9wx2", {
    height: "100%",
    width: "100%",
    videoId: "dQw4w9WgXcQ", // default video
  });

  loadLatest();
}

// Fetch helper
async function fetchAPI(url) {
  const res = await fetch(url);
  return res.json();
}

// Load latest videos from channel
async function loadLatest() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10`;
  
  const data = await fetchAPI(url);
  displayVideos(data.items, "row-latest");
}

// Display videos
function displayVideos(videos, rowId) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  videos.forEach(video => {
    if (!video.id.videoId) return;

    const videoId = video.id.videoId;

    const card = document.createElement("div");
    card.classList.add("video-card");

    card.innerHTML = `
      <img src="${video.snippet.thumbnails.medium.url}">
    `;

    card.onclick = () => {
      playVideo(videoId, video.snippet.title);
    };

    row.appendChild(card);
  });
}

// Play video
function playVideo(id, title) {
  player.loadVideoById(id);

  document.getElementById("videoTitle").innerText = title;

  localStorage.setItem("lastVideo", JSON.stringify({ id, title }));

  loadContinueWatching();
}

// Continue watching
function loadContinueWatching() {
  const data = JSON.parse(localStorage.getItem("lastVideo"));
  if (!data) return;

  const row = document.getElementById("row-continue");
  row.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("video-card");

  // FIXED (no undefined video object)
  card.innerHTML = `
    <div class="card-info">
      <h4>${data.title}</h4>
      <p>Continue watching</p>
    </div>
  `;

  card.onclick = () => playVideo(data.id, data.title);

  row.appendChild(card);
}