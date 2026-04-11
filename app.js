// ================= CONFIG =================
const API_KEY = "AIzaSyD6o4Zwpt0Qim-6lLdJ4Ti0gUWJbrMwk-Y"; // <-- replace this
const CHANNEL_ID = "UC5reF0zkdOnB3GEpVqNJfHw";

let player;

// Playlists
const playlists = {
  talk: "PL8W_paC7-AOtTlt5kzJXexdirvM5HGIHf",
  cartoons: "PL8W_paC7-AOuHLHtxjVGMRaeEVFdqpoix",
  musicvideos: "PL8W_paC7-AOs-YVLrcN1rw_MhozUIoESZ",
  music: "PL8W_paC7-AOvTL0ZF6iSiZhYxpjV1uVGD"
};

// ================= YOUTUBE PLAYER =================
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    videoId: "",
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1
    }
  });

  loadAll();
}

// ================= FETCH HELPER =================
async function fetchAPI(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API request failed");
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return { items: [] };
  }
}

// ================= LOADERS =================
function loadAll() {
  loadLatest();
  loadPlaylist(playlists.talk, "row-talk");
  loadPlaylist(playlists.cartoons, "row-cartoons");
  loadPlaylist(playlists.musicvideos, "row-musicvideos");
  loadPlaylist(playlists.music, "row-music");
  loadContinueWatching();
}

// 🔹 Latest Videos
async function loadLatest() {
  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?key=${API_KEY}` +
    `&channelId=${CHANNEL_ID}` +
    `&part=snippet,id` +
    `&order=date` +
    `&maxResults=12`;

  const data = await fetchAPI(url);
  displayVideos(data.items, "row-latest");
}

// 🔹 Playlist Videos
async function loadPlaylist(playlistId, rowId) {
  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?key=${API_KEY}` +
    `&playlistId=${playlistId}` +
    `&part=snippet` +
    `&maxResults=12`;

  const data = await fetchAPI(url);
  displayVideos(data.items, rowId, true);
}

// ================= UI RENDER =================
function displayVideos(videos, rowId, isPlaylist = false) {
  const row = document.getElementById(rowId);
  if (!row) return;

  row.innerHTML = "";

  videos.forEach(video => {
    const videoId = isPlaylist
      ? video.snippet?.resourceId?.videoId
      : video.id?.videoId || video.id;

    if (!videoId) return;

    const thumbnail = video.snippet?.thumbnails?.medium?.url;
    const title = video.snippet?.title;

    const card = document.createElement("div");
    card.classList.add("video-card");

    card.innerHTML = `
      <img loading="lazy" src="${thumbnail}" alt="${title}">
    `;

    card.onclick = () => playVideo(videoId, title);

    row.appendChild(card);
  });
}

// ================= PLAYER CONTROL =================
function playVideo(videoId, title) {
  if (!player) return;

  player.loadVideoById(videoId);
  player.unMute();

  document.getElementById("videoTitle").innerText = title;

  // Save to Continue Watching
  localStorage.setItem(
    "lastVideo",
    JSON.stringify({ id: videoId, title })
  );

  loadContinueWatching();
}

// ================= CONTINUE WATCHING =================
function loadContinueWatching() {
  const data = JSON.parse(localStorage.getItem("lastVideo"));
  if (!data) return;

  const row = document.getElementById("row-continue");
  if (!row) return;

  row.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("video-card");

  card.innerHTML = `
    <img src="https://img.youtube.com/vi/${data.id}/mqdefault.jpg">
  `;

  card.onclick = () => playVideo(data.id, data.title);

  row.appendChild(card);
}