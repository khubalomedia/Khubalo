/* =========================================
   BaloTV
   API FEEL VERSION
   NO YOUTUBE API
========================================= */

const playlists = {

  home: [
  
  {
  videoId:"Tivk4nCSVfg",
  title:"Nasty C is my brother from another mother full"
  },
  
  {
  videoId:"S4vNf6UNs8E",
  title:"Ivo Suzee EXPOSED? The Dark Truth"
  },
  
  {
  videoId:"pAHuC9E_Axg",
  title:"Fruity Friends Truth or Truth"
  },
  
  {
  videoId:"QlqznFEUbBw",
  title:"African Casting EXPOSED"
  },
  
  {
  videoId:"V3_SkWqP8pQ",
  title:"Latest Trending Show"
  },
  
  {
  videoId:"5NA25uOG5aA",
  title:"South African Viral Story"
  },
  
  {
  videoId:"REvFwoDyBek",
  title:"Podcast Episode"
  },
  
  {
  videoId:"2YKPm9HMbWs",
  title:"Drama Investigation"
  },


  {
   videoId:"C6DTlkL5u2I",
   title:"Nasty C is my brother from another mother full"
   },
   
   {
   videoId:"9jW2X9q4wg0",
   title:"Ivo Suzee EXPOSED? The Dark Truth"
   },
   
   {
   videoId:"78KRwANWc4E",
   title:"Fruity Friends Truth or Truth"
   },
   
   {
   videoId:"EQ5XdBCeEU0",
   title:"African Casting EXPOSED"
   },
   
   {
   videoId:"yu00Z9IRpB8",
   title:"Latest Trending Show"
   },
   
   {
   videoId:"72TOgTtNvE4",
   title:"South African Viral Story"
   },
   
   {
   videoId:"ii4-VAtg2fg",
   title:"Podcast Episode"
   },
   
   {
   videoId:"_ui2eYlhzNI",
   title:"Drama Investigation"
   },

   {
   videoId:"PVlnMl0jjyg",
   title:"South African Viral Story"
   },
      
   {
   videoId:"cXxhysTLe8U",
   title:"Podcast Episode"
   },
      
   {
   videoId:"o5Rnrl8XudM",
   title:"Drama Investigation"
   }
  
  ],
  
  musicvideos: [
  
  {
  videoId:"9jW2X9q4wg0",
  title:"Music Video 1"
  },
  
  {
  videoId:"C6DTlkL5u2I",
  title:"Music Video 2"
  },
  
  {
  videoId:"podMgq2xSXM",
  title:"Music Video 3"
  },
  
  {
  videoId:"Zzwwj2WBLnk",
  title:"Music Video 4"
  },
  
  {
  videoId:"_Up2TCOa5S0",
  title:"Music Video 5"
  }
  
  ],
  
  cartoons: [
  
  {
  videoId:"fg8uJ0GZ3jk",
  title:"Cartoon Episode 1"
  },
  
  {
  videoId:"j9rRaQbLZLo",
  title:"Cartoon Episode 2"
  },
  
  {
  videoId:"cNBdNIUkq2k",
  title:"Cartoon Episode 3"
  },
  
  {
  videoId:"ii4-VAtg2fg",
  title:"Cartoon Episode 4"
  }
  
  ],
  
  talk: [
  
  {
  videoId:"Tivk4nCSVfg",
  title:"Talk Show 1"
  },
  
  {
  videoId:"S4vNf6UNs8E",
  title:"Talk Show 2"
  },
  
  {
  videoId:"QlqznFEUbBw",
  title:"Talk Show 3"
  },
  
  {
  videoId:"V3_SkWqP8pQ",
  title:"Talk Show 4"
  }
  
  ]
  
  };
  
  /* PLAYER STATE */
  
  let currentPlaylist = [];
  
  let currentIndex = 0;
  
  /* LOAD */
  
  function loadAll(){
  
  for(const category in playlists){
  
  displayVideos(
  playlists[category],
  `row-${category}`
  );
  
  }
  
  }
  
  /* DISPLAY */
  
  function displayVideos(
  videos,
  rowId
  ){
  
  const row =
  document.getElementById(rowId);
  
  if(!row) return;
  
  row.innerHTML = "";
  
  videos.forEach((video,index)=>{
  
  const card =
  document.createElement("div");
  
  card.className =
  "video-card";
  
  card.innerHTML = `
  
  <img
  src="https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg"
  loading="lazy"
  >
  
  <div class="video-card-content">
  
  <h4>${video.title}</h4>
  
  </div>
  
  `;
  
  card.onclick = ()=>{
  
  currentPlaylist = videos;
  
  currentIndex = index;
  
  playVideo(
  video.videoId,
  video.title
  );
  
  updateUpNext();
  
  };
  
  row.appendChild(card);
  
  });
  
  }
  
  /* PLAY VIDEO */
  
  function playVideo(
  videoId,
  title=""
  ){
  
  document
  .getElementById("playerSection")
  .classList.remove("hidden");
  
  const player =
  document.getElementById(
  "video-player"
  );
  
  player.src =
  `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  
  document
  .getElementById("video-title")
  .innerText = title;
  
  window.scrollTo({
  
  top:0,
  behavior:"smooth"
  
  });
  
  localStorage.setItem(
  "lastPlayedVideo",
  JSON.stringify({
  videoId,
  title
  })
  );
  
  }
  
  /* LOAD LAST */
  
  function loadLastPlayed(){
  
  const saved =
  JSON.parse(
  localStorage.getItem(
  "lastPlayedVideo"
  )
  );
  
  if(!saved) return;
  
  playVideo(
  saved.videoId,
  saved.title
  );
  
  }
  
  /* UP NEXT */
  
  function updateUpNext(){
  
  const row =
  document.getElementById(
  "up-next-row"
  );
  
  if(!row) return;
  
  row.innerHTML = "";
  
  const nextVideos =
  currentPlaylist.slice(
  currentIndex + 1,
  currentIndex + 8
  );
  
  nextVideos.forEach((video,index)=>{
  
  const card =
  document.createElement("div");
  
  card.className =
  "video-card";
  
  card.innerHTML = `
  
  <img
  src="https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg"
  >
  
  <div class="video-card-content">
  
  <h4>${video.title}</h4>
  
  </div>
  
  `;
  
  card.onclick = ()=>{
  
  currentIndex =
  currentIndex + index + 1;
  
  playVideo(
  video.videoId,
  video.title
  );
  
  updateUpNext();
  
  };
  
  row.appendChild(card);
  
  });
  
  }
  
  /* NEXT */
  
  function playNext(){
  
  if(
  currentIndex <
  currentPlaylist.length - 1
  ){
  
  currentIndex++;
  
  const nextVideo =
  currentPlaylist[currentIndex];
  
  playVideo(
  nextVideo.videoId,
  nextVideo.title
  );
  
  updateUpNext();
  
  }
  
  }
  
  /* PREVIOUS */
  
  function playPrevious(){
  
  if(currentIndex > 0){
  
  currentIndex--;
  
  const prevVideo =
  currentPlaylist[currentIndex];
  
  playVideo(
  prevVideo.videoId,
  prevVideo.title
  );
  
  updateUpNext();
  
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
  function(){
  
  const value =
  this.value.toLowerCase();
  
  const cards =
  document.querySelectorAll(
  ".video-card"
  );
  
  cards.forEach(card=>{
  
  const text =
  card.innerText.toLowerCase();
  
  card.style.display =
  text.includes(value)
  ? "block"
  : "none";
  
  });
  
  }
  );
  
  /* START */
  
  loadAll();
  
  loadLastPlayed();