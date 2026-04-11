const API_KEY = "AIzaSyD6o4Zwpt0Qim-6lLdJ4Ti0gUWJbrMwk-Y";
const CHANNEL_ID = "UC5reF0zkdOnB3GEpVqNJfHw";
let player;

const playlists = {
  talk: "PL8W_paC7-AOtTlt5kzJXexdirvM5HGIHf",
  cartoons: "PL8W_paC7-AOuHLHtxjVGMRaeEVFdqpoix",
  musicvideos: "PL8W_paC7-AOs-YVLrcN1rw_MhozUIoESZ",
  music: "PL8W_paC7-AOvTL0ZF6iSiZhYxpjV1uVGD"
};

function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    videoId: "",
  });

  loadAll();
}

async function fetchAPI(url) {
  const res = await fetch(url);
  return res.json();
}

function loadAll() {
  loadLatest();
  loadPlaylist(playlists.talk, "row-talk");
  loadPlaylist(playlists.cartoons, "row-cartoons");
  loadPlaylist(playlists.musicvideos, "row-musicvideos");
  loadPlaylist(playlists.music, "row-music");
  loadPopular();
  loadContinueWatching();
}

async function loadLatest() {
  const url = `${API_KEY}/latest`;
  const data = await fetchAPI(url);
  displayVideos(data.items, "row-latest");
}

async function loadPlaylist(id, rowId) {
  const url = `${API_KEY}/playlist?id=${id}`;
  const data = await fetchAPI(url);
  displayVideos(data.items, rowId, true);
}

async function loadPopular() {
  const url = `${API_KEY}/popular`;
  const data = await fetchAPI(url);
  displayVideos(data.items, "row-popular");
}

function displayVideos(videos, rowId, isPlaylist = false) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  videos.forEach(video => {
    const videoId = isPlaylist
      ? video.snippet.resourceId.videoId
      : video.id.videoId || video.id;

    const card = document.createElement("div");
    card.classList.add("video-card");
    card.innerHTML = `<img loading='lazy' src="${video.snippet.thumbnails.medium.url}">`;

    card.onclick = () => {
      playVideo(videoId, video.snippet.title);
    };

    row.appendChild(card);
  });
}

function playVideo(id, title) {
  player.loadVideoById(id);
  player.unMute();
  document.getElementById("videoTitle").innerText = title;

  localStorage.setItem("lastVideo", JSON.stringify({ id, title }));
  loadContinueWatching();
}

function loadContinueWatching() {
  const data = JSON.parse(localStorage.getItem("lastVideo"));
  if (!data) return;

  const row = document.getElementById("row-continue");
  row.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("video-card");
  card.innerHTML = `<img src="https://img.youtube.com/vi/${data.id}/mqdefault.jpg">`;

  card.onclick = () => playVideo(data.id, data.title);

  row.appendChild(card);
}
