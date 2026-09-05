const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const muteBtn = document.getElementById("mute");
const fileInput = document.getElementById("fileInput");
const playlistEl = document.getElementById("playlist");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const durationEl = document.getElementById("duration");
const currentEl = document.getElementById("currentTime");
const statusEl = document.getElementById("status");

let songs = [
  {title:"SAM AI Demo Track", artist:"Sneha Goyal", src:"demo-track.wav"}
];
let current = 0;

function formatTime(seconds){
  if(!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds/60);
  const s = Math.floor(seconds%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

function renderPlaylist(){
  playlistEl.innerHTML = "";
  songs.forEach((song,i)=>{
    const row = document.createElement("div");
    row.className = "song" + (i===current ? " active" : "");
    row.innerHTML = `<span class="song-number">${String(i+1).padStart(2,"0")}</span>
      <div class="song-details"><b>${escapeHtml(song.title)}</b><span>${escapeHtml(song.artist)}</span></div>`;
    row.addEventListener("click",()=>loadSong(i,true));
    playlistEl.appendChild(row);
  });
}

function escapeHtml(text){
  return text.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
}

function loadSong(index, autoplay=false){
  current = (index + songs.length) % songs.length;
  const song = songs[current];
  audio.src = song.src;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  progress.value = 0;
  currentEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  renderPlaylist();
  statusEl.textContent = "Loaded";
  if(autoplay) audio.play().catch(()=>{});
}

function togglePlay(){
  if(audio.paused) audio.play().catch(()=>{});
  else audio.pause();
}
playBtn.addEventListener("click",togglePlay);

audio.addEventListener("play",()=>{playBtn.textContent="❚❚";statusEl.textContent="Playing";});
audio.addEventListener("pause",()=>{playBtn.textContent="▶";statusEl.textContent="Paused";});
audio.addEventListener("loadedmetadata",()=>{durationEl.textContent=formatTime(audio.duration);});
audio.addEventListener("timeupdate",()=>{
  currentEl.textContent=formatTime(audio.currentTime);
  progress.value=audio.duration ? (audio.currentTime/audio.duration)*100 : 0;
});
audio.addEventListener("ended",()=>loadSong(current+1,true));

progress.addEventListener("input",()=>{
  if(audio.duration) audio.currentTime=(progress.value/100)*audio.duration;
});
volume.addEventListener("input",()=>{audio.volume=volume.value;});
muteBtn.addEventListener("click",()=>{
  audio.muted=!audio.muted;
  muteBtn.textContent=audio.muted?"Unmute":"Mute";
});
prevBtn.addEventListener("click",()=>loadSong(current-1,true));
nextBtn.addEventListener("click",()=>loadSong(current+1,true));

fileInput.addEventListener("change",()=>{
  [...fileInput.files].forEach(file=>{
    songs.push({title:file.name.replace(/\.[^/.]+$/,""),artist:"Local Audio",src:URL.createObjectURL(file)});
  });
  renderPlaylist();
  statusEl.textContent=`${fileInput.files.length} song(s) added`;
  if(songs.length>1) loadSong(songs.length-fileInput.files.length,true);
});

document.getElementById("themeBtn").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
});

audio.volume=0.8;
renderPlaylist();
loadSong(0);
