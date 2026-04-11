// ================= CONFIG =================
const API_KEY = "AIzaSyD6o4Zwpt0Qim-6lLdJ4Ti0gUWJbrMwk-Y";
const CHANNEL_ID = "UC5reF0zkdOnB3GEpVqNJfHw";

let player;
let allVideos = []; // 🔥 store all site videos for local search

// ================= PLAYLISTS =================
const playlists = {
  talk: "PL8W_paC7-AOtTlt5kzJXexdirvM5HGIHf",
  cartoons: "PL8W_paC7-AOuHLHtxjVGMRaeEVFdqpoix",
  musicvideos: "PL8W_paC7-AOs-YVLrcN1rw_MhozUIoESZ",
  music: "PL8W_paC7-AOvTL0ZF6iSiZhYxpjV1uVGD"
};

// ================= PLAYER =================
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    playerVars: { autoplay: 1, rel: 0 }
  });

  initApp();
}

// ================= INIT =================
function initApp() {
  loadAllContent();
  setupSearch();
  loadContinueWatching();
}

// ================= FETCH =================
async function fetchAPI(url) {
  try {
    const res = await fetch(url);
    return await res.json();
  } catch {
    return { items: [] };
  }
}

// ================= LOAD ALL =================
async function loadAllContent() {
  allVideos = [];

  await loadLatest();
  await loadPlaylist(playlists.talk, "row-talk");
  await loadPlaylist(playlists.cartoons, "row-cartoons");
  await loadPlaylist(playlists.musicvideos, "row-musicvideos");
  await loadPlaylist(playlists.music, "row-music");
}

// ================= LATEST =================
async function loadLatest() {
  const url =
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}` +
    `&channelId=${CHANNEL_ID}` +
    `&part=snippet,id&order=date&type=video&maxResults=10`;

  const data = await fetchAPI(url);

  const videos = data.items.map(v => ({
    id: v.id.videoId,
    title: v.snippet.title,
    thumb: v.snippet.thumbnails.medium.url,
    desc: v.snippet.description
  }));

  allVideos.push(...videos);

  displayVideos(videos, "row-latest");

  if (videos[0]) playVideo(videos[0]);
}

// ================= PLAYLIST =================
async function loadPlaylist(id, rowId) {
  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}` +
    `&playlistId=${id}&part=snippet&maxResults=10`;

  const data = await fetchAPI(url);

  const videos = data.items.map(v => ({
    id: v.snippet.resourceId.videoId,
    title: v.snippet.title,
    thumb: v.snippet.thumbnails.medium.url,
    desc: v.snippet.description
  }));

  allVideos.push(...videos);

  displayVideos(videos, rowId);
}

// ================= LOCAL SEARCH =================
function setupSearch() {
  const input = document.querySelector(".search-bar");

  input.addEventListener("input", () => {
    const query = input.value.toLowerCase();

    if (!query) {
      loadAllContent();
      return;
    }

    const results = allVideos.filter(v =>
      v.title.toLowerCase().includes(query)
    );

    clearRows();
    createSearchRow();

    displayVideos(results, "row-search");
  });
}

// ================= DISPLAY =================
function displayVideos(videos, rowId) {
  const row = document.getElementById(rowId);
  if (!row) return;

  row.innerHTML = "";

  videos.forEach(video => {
    const card = document.createElement("div");
    card.classList.add("video-card");

    card.innerHTML = `
      <img src="${video.thumb}">
      <div class="card-title">${video.title}</div>
    `;

    // 🔥 CLICK PLAY
    card.onclick = () => playVideo(video);

    // 🔥 HOVER PREVIEW
    let hoverTimeout;

    card.onmouseenter = () => {
      hoverTimeout = setTimeout(() => {
        playVideo(video, true);
      }, 800); // delay like Netflix
    };

    card.onmouseleave = () => {
      clearTimeout(hoverTimeout);
    };

    row.appendChild(card);
  });
}

// ================= PLAYER =================
function playVideo(video, isPreview = false) {
  if (!player) return;

  player.loadVideoById(video.id);

  document.getElementById("videoTitle").innerText = video.title;
  document.getElementById("videoDesc").innerText = video.desc;

  if (!isPreview) {
    localStorage.setItem("lastVideo", JSON.stringify(video));
    loadContinueWatching();
  }
}

// ================= UI HELPERS =================
function clearRows() {
  document.querySelectorAll(".row").forEach(r => r.innerHTML = "");
}

function createSearchRow() {
  if (document.getElementById("row-search")) return;

  const section = document.querySelector(".rows");

  const title = document.createElement("h3");
  title.innerText = "Search Results";

  const row = document.createElement("div");
  row.id = "row-search";
  row.className = "row";

  section.prepend(row);
  section.prepend(title);
}

// ================= CONTINUE =================
function loadContinueWatching() {
  const video = JSON.parse(localStorage.getItem("lastVideo"));
  if (!video) return;

  const row = document.getElementById("row-continue");
  row.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("video-card");

  card.innerHTML = `<img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg">`;

  card.onclick = () => playVideo(video);

  row.appendChild(card);
}