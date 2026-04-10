const API_KEY = "AIzaSyD6o4Zwpt0Qim-6lLdJ4Ti0gUWJbrMwk-Y";
const CHANNEL_ID = "UC5reF0zkdOnB3GEpVqNJfHw";

let player;

// PLAYLIST IDs
const playlists = {
  talk: "PL8W_paC7-AOtTlt5kzJXexdirvM5HGIHf",
  cartoons: "PL8W_paC7-AOuHLHtxjVGMRaeEVFdqpoix",
  musicvideos: "PL8W_paC7-AOs-YVLrcN1rw_MhozUIoESZ",
  music: "PL8W_paC7-AOvTL0ZF6iSiZhYxpjV1uVGD"
};

// INIT PLAYER
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "100%",
    width: "100%",
    videoId: "",
  });

  loadAll();
}

// LOAD EVERYTHING
function loadAll() {
  loadLatest();
  loadPlaylist(playlists.talk, "row-talk");
  loadPlaylist(playlists.cartoons, "row-cartoons");
  loadPlaylist(playlists.musicvideos, "row-musicvideos");
  loadPlaylist(playlists.music, "row-music");
  loadPopular();
  loadContinueWatching();
}

// LATEST
async function loadLatest() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20&type=video`;

  const res = await fetch(url);
  const data = await res.json();

  displayVideos(data.items, "row-latest");
}

// PLAYLIST
async function loadPlaylist(id, rowId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${id}&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  displayVideos(data.items, rowId, true);
}

// POPULAR
async function loadPopular() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=ZA&maxResults=20&key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  displayVideos(data.items, "row-popular");
}

// DISPLAY
function displayVideos(videos, rowId, isPlaylist = false) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  videos.forEach(video => {
    const videoId = isPlaylist
      ? video.snippet.resourceId.videoId
      : video.id.videoId || video.id;

    const card = document.createElement("div");
    card.classList.add("video-card");

    card.innerHTML = `<img src="${video.snippet.thumbnails.medium.url}">`;

    // CLICK PLAY
    card.onclick = () => {
      playVideo(videoId, video.snippet.title);
    };

    // HOVER PREVIEW
    card.onmouseenter = () => {
      player.loadVideoById(videoId);
      player.mute();
    };

    card.onmouseleave = () => {
      player.stopVideo();
    };

    row.appendChild(card);
  });
}

// PLAY VIDEO
function playVideo(id, title) {
  player.loadVideoById(id);
  player.unMute();
  document.getElementById("videoTitle").innerText = title;

  // SAVE CONTINUE WATCHING
  localStorage.setItem("lastVideo", JSON.stringify({ id, title }));

  loadContinueWatching();
}

// CONTINUE WATCHING
function loadContinueWatching() {
  const data = JSON.parse(localStorage.getItem("lastVideo"));

  if (!data) return;

  const row = document.getElementById("row-continue");
  row.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("video-card");

  card.innerHTML = `
    <img src="https://img.youtube.com/vi/${data.id}/mqdefault.jpg">
  `;

  card.onclick = () => playVideo(data.id, data.title);

  row.appendChild(card);
}