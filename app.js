const API_KEY = "AIzaSyD6o4Zwpt0Qim-6lLdJ4Ti0gUWJbrMwk-Y";
const CHANNEL_ID = "UC5reF0zkdOnB3GEpVqNJfHw";

// PLAYLISTS
const playlists = {
  talk: "PL8W_paC7-AOtTlt5kzJXexdirvM5HGIHf",
  cartoons: "PL8W_paC7-AOuHLHtxjVGMRaeEVFdqpoix",
  musicvideos: "PL8W_paC7-AOs-YVLrcN1rw_MhozUIoESZ",
  music: "PL8W_paC7-AOvTL0ZF6iSiZhYxpjV1uVGD"
};

// LOAD EVERYTHING
function loadAll() {
  loadPlaylist(playlists.talk, "row-talk");
  loadPlaylist(playlists.cartoons, "row-cartoons");
  loadPlaylist(playlists.musicvideos, "row-musicvideos");
  loadPlaylist(playlists.music, "row-music");
  loadContinueWatching();
}

// FETCH PLAYLIST
async function loadPlaylist(id, rowId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${id}&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    displayVideos(data.items, rowId);
  } catch (err) {
    console.error("Error loading playlist:", err);
  }
}

// DISPLAY VIDEOS
function displayVideos(videos, rowId) {
  const row = document.getElementById(rowId);
  row.innerHTML = "";

  videos.forEach(video => {
    const videoId = video.snippet.resourceId.videoId;

    const card = document.createElement("div");
    card.classList.add("video-card");

    card.innerHTML = `
      <img src="${video.snippet.thumbnails.medium.url}">
      <p>${video.snippet.title}</p>
    `;

    card.onclick = () => {
      const videoData = {
        id: videoId,
        title: video.snippet.title
      };

      localStorage.setItem("lastVideo", JSON.stringify(videoData));

      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    };

    row.appendChild(card);
  });
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
    <p>${data.title}</p>
  `;

  card.onclick = () => {
    window.open(`https://www.youtube.com/watch?v=${data.id}`, "_blank");
  };

  row.appendChild(card);
}

// INIT
loadAll();