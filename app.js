const API_KEY = "AIzaSyD6o4Zwpt0Qim-6lLdJ4Ti0gUWJbrMwk-Y";
const CHANNEL_ID = "UC5reF0zkdOnB3GEpVqNJfHw";

let player;
let videoQueue = [];
let currentIndex = 0;

function onYouTubeIframeAPIReady() {
player = new YT.Player("player", {
height: "100%",
width: "100%",
videoId: "",
events: {
onStateChange: onPlayerStateChange
}
});
}

async function loadVideos() {
const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20`;

const res = await fetch(url);
const data = await res.json();

const videos = data.items.filter(item => item.id.videoId);

videoQueue = videos;

displayRow(videos);
playVideo(0);
}

function displayRow(videos) {
const row = document.getElementById("row1");

videos.forEach((video, index) => {
const card = document.createElement("div");
card.classList.add("video-card");

card.innerHTML = `
<img src="${video.snippet.thumbnails.medium.url}">
`;

card.onclick = () => playVideo(index);

row.appendChild(card);
});
}

function playVideo(index) {
currentIndex = index;

const video = videoQueue[index];

player.loadVideoById(video.id.videoId);

document.getElementById("videoTitle").innerText =
video.snippet.title;
}

function onPlayerStateChange(event) {
if (event.data === YT.PlayerState.ENDED) {
currentIndex++;

if (currentIndex < videoQueue.length) {
playVideo(currentIndex);
}
}
}

loadVideos();