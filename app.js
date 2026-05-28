/* =========================================
   BaloTV — GitHub Ready
   NO YOUTUBE API
   PLAYLIST EMBED VERSION
========================================= */

/* PLAYLIST CATEGORIES */

const playlists = {

  home: [

    {
      title: "Home",
      playlistId:
        "PL8W_paC7-AOtnMN3II9_ukOAeNqBUZsy5",

      thumbnail:
        "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",

      description:
        "Featured home videos"
    }

  ],

  talk: [

    {
      title: "Talk Shows",
      playlistId:
        "PL8W_paC7-AOtTlt5kzJXexdirvM5HGIHf",

      thumbnail:
        "https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg",

      description:
        "Talk shows and interviews"
    }

  ],

  cartoons: [

    {
      title: "Cartoons",
      playlistId:
        "PL8W_paC7-AOuHLHtxjVGMRaeEVFdqpoix",

      thumbnail:
        "https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg",

      description:
        "Cartoon entertainment"
    }

  ],

  musicvideos: [

    {
      title: "Music Videos",
      playlistId:
        "PL8W_paC7-AOs-YVLrcN1rw_MhozUIoESZ",

      thumbnail:
        "https://img.youtube.com/vi/kJQP7kiw5Fk/hqdefault.jpg",

      description:
        "Latest music videos"
    }

  ]

};

/* GLOBAL PLAYER STATE */

let currentPlaylist = [];
let currentIndex = 0;

/* LOAD */

function loadAll() {

  for (const category in playlists) {

    displayVideos(
      playlists[category],
      `row-${category}`
    );

  }

}

/* DISPLAY VIDEOS */

function displayVideos(videos, rowId) {

  const row =
    document.getElementById(rowId);

  if (!row) return;

  row.innerHTML = "";

  videos.forEach((video, index) => {

    const shortTitle =
      video.title.length > 50
        ? video.title.slice(0, 50) + "..."
        : video.title;

    const card =
      document.createElement("div");

    card.className = "video-card";

    card.innerHTML = `

      <img
        src="${video.thumbnail}"
        loading="lazy"
      >

      <div class="video-card-content">

        <h4>${shortTitle}</h4>

      </div>

    `;

    /* CLICK CATEGORY */

    card.onclick = () => {

      currentPlaylist = videos;

      currentIndex = index;

      playVideo(
        video.playlistId,
        video.title,
        video.description
      );

      updateUpNext();

    };

    row.appendChild(card);

  });

}

/* PLAY PLAYLIST */

function playVideo(
  playlistId,
  title = "",
  description = ""
){

  /* SHOW PLAYER */

  document
    .getElementById("playerSection")
    .classList.remove("hidden");

  const player =
    document.getElementById("video-player");

  player.src =
    `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1&rel=0`;

  /* SHORT DESCRIPTION */

  let shortDescription =
    description;

  if(description.length > 180){

    shortDescription =
      description.slice(0,180) + "...";

  }

  document.getElementById(
    "video-title"
  ).innerText = title;

  document.getElementById(
    "video-description"
  ).innerText =
    shortDescription ||
    "No description available.";

  /* SAVE LAST PLAYED */

  localStorage.setItem(
    "lastPlayedVideo",
    JSON.stringify({
      playlistId,
      title,
      description
    })
  );

  /* SCROLL TO PLAYER */

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}

/* LOAD LAST PLAYED */

function loadLastPlayedVideo(){

  const saved =
    JSON.parse(
      localStorage.getItem(
        "lastPlayedVideo"
      )
    );

  if(!saved) return;

  playVideo(
    saved.playlistId,
    saved.title,
    saved.description
  );

}

/* UP NEXT */

function updateUpNext(){

  const row =
    document.getElementById("up-next-row");

  if(!row) return;

  row.innerHTML = "";

  currentPlaylist.forEach((video, index) => {

    if(index === currentIndex) return;

    const card =
      document.createElement("div");

    card.className = "video-card";

    card.innerHTML = `

      <img
        src="${video.thumbnail}"
      >

      <div class="video-card-content">

        <h4>
          ${video.title.slice(0,45)}
        </h4>

      </div>

    `;

    card.onclick = () => {

      currentIndex = index;

      playVideo(
        video.playlistId,
        video.title,
        video.description
      );

      updateUpNext();

    };

    row.appendChild(card);

  });

}

/* NEXT CATEGORY */

function playNext(){

  if(
    currentIndex <
    currentPlaylist.length - 1
  ){

    currentIndex++;

    const nextVideo =
      currentPlaylist[currentIndex];

    playVideo(
      nextVideo.playlistId,
      nextVideo.title,
      nextVideo.description
    );

    updateUpNext();

  }

}

/* PREVIOUS CATEGORY */

function playPrevious(){

  if(currentIndex > 0){

    currentIndex--;

    const prevVideo =
      currentPlaylist[currentIndex];

    playVideo(
      prevVideo.playlistId,
      prevVideo.title,
      prevVideo.description
    );

    updateUpNext();

  }

}

/* BUTTONS */

document
  .getElementById("nextBtn")
  .addEventListener("click", playNext);

document
  .getElementById("prevBtn")
  .addEventListener("click", playPrevious);

/* HIDE PLAYER INITIALLY */

document
  .getElementById("playerSection")
  .classList.add("hidden");

/* SEARCH */

document
  .getElementById("searchInput")
  .addEventListener("input", function () {

    const value =
      this.value.toLowerCase();

    const cards =
      document.querySelectorAll(".video-card");

    cards.forEach(card => {

      const text =
        card.innerText.toLowerCase();

      card.style.display =
        text.includes(value)
          ? "block"
          : "none";

    });

  });

/* START */

loadAll();

loadLastPlayedVideo();

/* SERVICE WORKER */

if ("serviceWorker" in navigator) {

  navigator.serviceWorker
    .register("/service-worker.js");

}

/* INSTALL PROMPT */

let deferredPrompt;

window.addEventListener(
  "beforeinstallprompt",
  (e) => {

    e.preventDefault();

    deferredPrompt = e;

    showInstallButton();

  }
);

function showInstallButton() {

  const btn =
    document.createElement("button");

  btn.innerText =
    "📲 Install BaloTV App";

  btn.style.position = "fixed";

  btn.style.bottom = "20px";

  btn.style.right = "20px";

  btn.style.padding = "12px 16px";

  btn.style.background = "#000";

  btn.style.color = "#fff";

  btn.style.border =
    "1px solid #fff";

  btn.style.borderRadius = "8px";

  btn.style.zIndex = "9999";

  document.body.appendChild(btn);

  btn.addEventListener(
    "click",
    async () => {

      btn.style.display = "none";

      deferredPrompt.prompt();

      const choice =
        await deferredPrompt.userChoice;

      if (
        choice.outcome ===
        "accepted"
      ) {

        console.log(
          "User installed app"
        );

      }

      deferredPrompt = null;

    }
  );

}