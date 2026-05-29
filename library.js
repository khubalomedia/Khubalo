/* =========================================
   BaloTV
========================================= */

/* PLAYLISTS */

const playlists = {

   talk: [
 
     {
       videoId: "Tivk4nCSVfg",
       title: "Talk Show 1"
     },
 
     {
       videoId: "S4vNf6UNs8E",
       title: "Talk Show 2"
     },
 
     {
       videoId: "QlqznFEUbBw",
       title: "Talk Show 3"
     },
 
     {
       videoId: "V3_SkWqP8pQ",
       title: "Talk Show 4"
     },
 
     {
       videoId: "5NA25uOG5aA",
       title: "Talk Show 5"
     }
 
   ],
 
   cartoons: [
 
     {
       videoId: "pAHuC9E_Axg",
       title: "Cartoon Episode 1"
     },
 
     {
       videoId: "fg8uJ0GZ3jk",
       title: "Cartoon Episode 2"
     },
 
     {
       videoId: "j9rRaQbLZLo",
       title: "Cartoon Episode 3"
     }
 
   ],
 
   musicvideos: [
 
     {
       videoId: "9jW2X9q4wg0",
       title: "Music Video 1"
     },
 
     {
       videoId: "C6DTlkL5u2I",
       title: "Music Video 2"
     },
 
     {
       videoId: "podMgq2xSXM",
       title: "Music Video 3"
     }
 
   ]
 
 };
 
 /* PLAYER STATE */
 
 let currentPlaylist = [];
 
 let currentIndex = 0;
 
 /* ELEMENTS */
 
 const playerSection =
   document.getElementById(
     "playerSection"
   );
 
 const player =
   document.getElementById(
     "video-player"
   );
 
 const videoTitle =
   document.getElementById(
     "video-title"
   );
 
 /* HIDE PLAYER INITIALLY */
 
 playerSection.classList.add(
   "hidden"
 );
 
 /* LOAD ALL VIDEOS */
 
 function loadAll() {
 
   displayVideos(
     playlists.talk,
     "row-talk"
   );
 
   displayVideos(
     playlists.cartoons,
     "row-cartoons"
   );
 
   displayVideos(
     playlists.musicvideos,
     "row-musicvideos"
   );
 
 }
 
 /* DISPLAY VIDEOS */
 
 function displayVideos(
   videos,
   rowId
 ) {
 
   const row =
     document.getElementById(rowId);
 
   if (!row) return;
 
   row.innerHTML = "";
 
   videos.forEach((video, index) => {
 
     const card =
       document.createElement("div");
 
     card.className =
       "video-card";
 
     card.innerHTML = `
 
       <img
         class="video-thumb"
         src="https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg"
         loading="lazy"
       >
 
       <div class="video-card-content">
 
         <h4>${video.title}</h4>
 
       </div>
 
     `;
 
     card.onclick = () => {
 
       currentPlaylist = videos;
 
       currentIndex = index;
 
       playVideo(
         video.videoId,
         video.title
       );
 
     };
 
     row.appendChild(card);
 
   });
 
 }
 
 /* PLAY VIDEO */
 
 function playVideo(
   videoId,
   title = ""
 ) {
 
   playerSection.classList.remove(
     "hidden"
   );
 
   player.src =
     `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
 
   videoTitle.innerText =
     title;
 
   window.scrollTo({
 
     top: 0,
 
     behavior: "smooth"
 
   });
 
   localStorage.setItem(
     "lastPlayedVideo",
     JSON.stringify({
       videoId,
       title
     })
   );
 
 }
 
 /* LOAD LAST PLAYED */
 
 function loadLastPlayed() {
 
   const saved =
     JSON.parse(
       localStorage.getItem(
         "lastPlayedVideo"
       )
     );
 
   if (!saved) return;
 
   playVideo(
     saved.videoId,
     saved.title
   );
 
 }
 
 /* NEXT VIDEO */
 
 function playNext() {
 
   if (
     currentIndex <
     currentPlaylist.length - 1
   ) {
 
     currentIndex++;
 
     const nextVideo =
       currentPlaylist[currentIndex];
 
     playVideo(
       nextVideo.videoId,
       nextVideo.title
     );
 
   }
 
 }
 
 /* PREVIOUS VIDEO */
 
 function playPrevious() {
 
   if (currentIndex > 0) {
 
     currentIndex--;
 
     const prevVideo =
       currentPlaylist[currentIndex];
 
     playVideo(
       prevVideo.videoId,
       prevVideo.title
     );
 
   }
 
 }
 
 /* BUTTONS */
 
 document
   .getElementById("nextBtn")
   .addEventListener(
     "click",
     playNext
   );
 
 document
   .getElementById("prevBtn")
   .addEventListener(
     "click",
     playPrevious
   );
 
 /* SEARCH */
 
 document
   .getElementById("searchInput")
   .addEventListener(
     "input",
     function () {
 
       const value =
         this.value.toLowerCase();
 
       const cards =
         document.querySelectorAll(
           ".video-card"
         );
 
       cards.forEach(card => {
 
         const text =
           card.innerText.toLowerCase();
 
         card.style.display =
           text.includes(value)
             ? "block"
             : "none";
 
       });
 
     }
   );
 
 /* SERVICE WORKER */
 
 if (
   "serviceWorker" in navigator
 ) {
 
   navigator
     .serviceWorker
     .register(
       "/service-worker.js"
     );
 
 }
 
 /* START */
 
 loadAll();
 
 /* COMMENT THIS OUT
    IF YOU DON'T WANT
    PLAYER TO AUTO-OPEN
 */
 
 /*
 loadLastPlayed();
 */