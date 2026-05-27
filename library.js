const API_KEY = "AIzaSyD6o4Zwpt0Qim-6lLdJ4Ti0gUWJbrMwk-Y";
const CHANNEL_ID = "UC5reF0zkdOnB3GEpVqNJfHw";

/* PLAYLISTS */

const playlists = {

  home: "PL8W_paC7-AOtnMN3II9_ukOAeNqBUZsy5",

  talk: "PL8W_paC7-AOtTlt5kzJXexdirvM5HGIHf",

  cartoons: "PL8W_paC7-AOuHLHtxjVGMRaeEVFdqpoix",

  musicvideos: "PL8W_paC7-AOs-YVLrcN1rw_MhozUIoESZ",

  
};

/* LOAD */

async function loadAll() {

  for (const category in playlists) {
    loadPlaylist(playlists[category], `row-${category}`);
  }

  loadContinueWatching();
}

/* LOAD PLAYLIST */

async function loadPlaylist(id, rowId) {

  let allVideos = [];
  let nextPageToken = "";

  try {

    do {

      const url =
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${id}&pageToken=${nextPageToken}&key=${API_KEY}`;

      const res = await fetch(url);

      const data = await res.json();

      allVideos.push(...data.items);

      nextPageToken = data.nextPageToken || "";

    } while (nextPageToken);

    displayVideos(allVideos, rowId);

  } catch (err) {

    console.log(err);

  }

}

/* GLOBAL PLAYER STATE */

let currentPlaylist = [];
let currentIndex = 0;

/* DISPLAY VIDEOS */

function displayVideos(videos, rowId) {

  const row = document.getElementById(rowId);

  row.innerHTML = "";

  videos.forEach((video, index) => {

    if (
      !video.snippet ||
      !video.snippet.resourceId
    ) return;

    const videoId =
      video.snippet.resourceId.videoId;

    const shortTitle =
      video.snippet.title.length > 50
        ? video.snippet.title.slice(0, 50) + "..."
        : video.snippet.title;

    const card =
      document.createElement("div");

    card.className = "video-card";

    card.innerHTML = `

      <img
        src="${video.snippet.thumbnails.medium.url}"
      >

      <div class="video-card-content">

        <h4>${shortTitle}</h4>

      </div>

    `;

    /* CLICK VIDEO */

    card.onclick = () => {

      /* CREATE QUEUE FROM CURRENT CATEGORY */

      currentPlaylist = videos;

      currentIndex = index;

      playVideo(
        videoId,
        video.snippet.title,
        video.snippet.description
      );

      updateUpNext();

    };

    row.appendChild(card);

  });

}

/* PLAY VIDEO */

function playVideo(
  videoId,
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
    `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

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
      videoId,
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



/* LOAD LAST PLAYED VIDEO */

function loadLastPlayedVideo(){

  const saved =
    JSON.parse(
      localStorage.getItem(
        "lastPlayedVideo"
      )
    );

  if(!saved) return;

  playVideo(
    saved.videoId,
    saved.title,
    saved.description
  );

}



/* UP NEXT QUEUE */

function updateUpNext(){

  const row =
    document.getElementById("up-next-row");

  if(!row) return;

  row.innerHTML = "";

  const nextVideos =
    currentPlaylist.slice(
      currentIndex + 1,
      currentIndex + 8
    );

  nextVideos.forEach((video, index) => {

    const videoId =
      video.snippet.resourceId.videoId;

    const card =
      document.createElement("div");

    card.className = "video-card";

    card.innerHTML = `

      <img
        src="${video.snippet.thumbnails.medium.url}"
      >

      <div class="video-card-content">

        <h4>
          ${video.snippet.title.slice(0, 45)}
        </h4>

      </div>

    `;

    card.onclick = () => {

      currentIndex =
        currentIndex + index + 1;

      playVideo(
        videoId,
        video.snippet.title,
        video.snippet.description
      );

      updateUpNext();

    };

    row.appendChild(card);

  });

}




/* NEXT VIDEO */

function playNext(){

  if(
    currentIndex <
    currentPlaylist.length - 1
  ){

    currentIndex++;

    const nextVideo =
      currentPlaylist[currentIndex];

    const videoId =
      nextVideo.snippet.resourceId.videoId;

    playVideo(
      videoId,
      nextVideo.snippet.title,
      nextVideo.snippet.description
    );

    updateUpNext();

  }

}


/* PREVIOUS VIDEO */

function playPrevious(){

  if(currentIndex > 0){

    currentIndex--;

    const prevVideo =
      currentPlaylist[currentIndex];

    const videoId =
      prevVideo.snippet.resourceId.videoId;

    playVideo(
      videoId,
      prevVideo.snippet.title,
      prevVideo.snippet.description
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




/* HIDE PLAYER WHEN SWITCHING CATEGORY */

document
  .getElementById("playerSection")
  .classList.add("hidden");



  

/* SAVE */

function saveLastVideo(id, title) {

  localStorage.setItem(
    "lastVideo",
    JSON.stringify({ id, title })
  );

}



/* CATEGORY SWITCHING */

const buttons =
  document.querySelectorAll(".category-btn");

const sections =
  document.querySelectorAll(".category-section");

buttons.forEach(button => {

  button.addEventListener("click", () => {

    buttons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    const category =
      button.dataset.category;

    sections.forEach(section =>
      section.classList.add("hidden")
    );

    document
      .getElementById(`section-${category}`)
      .classList.remove("hidden");

  });

});

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








let isLogin = true;

const authModal =
  document.getElementById("authModal");

const authTitle =
  document.getElementById("authTitle");

const switchAuth =
  document.getElementById("switchAuth");

/* LOGIN BUTTON */

document
  .getElementById("loginBtn")
  .addEventListener("click", () => {

    authModal.classList.remove("hidden");

    authTitle.innerText = "Login";

    isLogin = true;

  });

/* REGISTER BUTTON */

document
  .getElementById("registerBtn")
  .addEventListener("click", () => {

    authModal.classList.remove("hidden");

    authTitle.innerText = "Register";

    isLogin = false;

  });

/* BOTTOM REGISTER BUTTON */

document
  .getElementById("bottomRegisterBtn")
  .addEventListener("click", () => {

    authModal.classList.remove("hidden");

    authTitle.innerText = "Register";

    isLogin = false;

  });

/* SWITCH */

switchAuth.addEventListener("click", () => {

  isLogin = !isLogin;

  authTitle.innerText =
    isLogin ? "Login" : "Register";

  switchAuth.innerText =
    isLogin
      ? "Don't have an account? Register"
      : "Already have an account? Login";

});

/* SUBMIT */

document
  .getElementById("authSubmit")
  .addEventListener("click", async () => {

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value.trim();

    if (!email || !password) {

      alert("Please fill in all fields");

      return;

    }

    try {

      if (isLogin) {

        await auth.signInWithEmailAndPassword(
          email,
          password
        );

        alert("Logged in successfully!");

      } else {

        await auth.createUserWithEmailAndPassword(
          email,
          password
        );

        alert("Account created successfully!");

      }

      authModal.classList.add("hidden");

    } catch (error) {

      console.error(error);

      alert(error.message);

    }

  });

/* FORGOT PASSWORD */

document
  .getElementById("forgotPassword")
  .addEventListener("click", async () => {

    const email =
      document.getElementById("email").value.trim();

    if (!email) {

      alert("Enter your email");

      return;

    }

    try {

      await auth.sendPasswordResetEmail(email);

      alert("Password reset email sent!");

    } catch (error) {

      alert(error.message);

    }

  });

/* AUTH STATE */

auth.onAuthStateChanged(user => {

  if (user) {

    document.querySelector(".logo").innerText =
      `BaloTV • ${user.email}`;

  } else {

    document.querySelector(".logo").innerText =
      "BaloTV";

  }

});


auth.onAuthStateChanged(user => {

  if (user) {

    document.querySelector(".logo").innerText =
      `BaloTV • ${user.email}`;

  }

});



const firebaseConfig = {

  apiKey: "AIzaSyD6o4Zwpt0Qim-6lLdJ4Ti0gUWJbrMwk-Y",

  authDomain: "balotv-d9c1d.firebaseapp.com",

  projectId: "balotv-d9c1d",

  storageBucket: "balotv-d9c1d.firebasestorage.app",

  messagingSenderId: "96925959779",

  appId: "1:96925959779:web:ed8cef5de90a0f410ada56"

};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

auth.setPersistence(
  firebase.auth.Auth.Persistence.LOCAL
);


if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}



let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  showInstallButton(); // we create this next
});

function showInstallButton() {
  const btn = document.createElement("button");
  btn.innerText = "📲 Install BaloTV App";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.padding = "12px 16px";
  btn.style.background = "#000";
  btn.style.color = "#fff";
  btn.style.border = "1px solid #fff";
  btn.style.borderRadius = "8px";
  btn.style.zIndex = "9999";

  document.body.appendChild(btn);

  btn.addEventListener("click", async () => {
    btn.style.display = "none";

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      console.log("User installed app");
    }

    deferredPrompt = null;
  });
}



