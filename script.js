const songs = [
    {
        name: "song2",
        title: "tab tabi tab",
        artist: "Chill Mood",
        cover: "images/cover2.jpg"
    },
    {
        
        name: "song1",
        title: "hamud habibi",
        artist: "Soft Artist",
        cover: "images/cover1.jpg"
        
    },
    {
        name: "song3",
        title: "peaceful morning",
        artist: "LoFi Star",
        cover: "images/cover3.jpg"
    }
];

let likedSongs = new Set();

const audio=document.getElementById("audio");
const playBtn=document.getElementById("play");
const prevBtn=document.getElementById("prev");
const nextBtn=document.getElementById("next");
const title=document.getElementById("title");
const artist=document.getElementById("artist");
const cover=document.getElementById("cover");
const progress=document.getElementById("progress");
const progressContainer=document.getElementById("progress-container");
const playlist=document.getElementById("playlist");
const themeToggle=document.getElementById("theme-toggle");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistToggle = document.getElementById("playlist-toggle");
const playlistDrawer = document.getElementById("playlist-drawer");
const likeBtn = document.getElementById("like");

likeBtn.addEventListener("click", () => {

    const currentSongName = songs[songIndex].name;

    if (likedSongs.has(currentSongName)) {
        likedSongs.delete(currentSongName);
        likeBtn.textContent = "🤍";
    } else {
        likedSongs.add(currentSongName);
        likeBtn.textContent = "❤️";
    }
});

const repeatBtn = document.getElementById("repeat");
let isRepeat = false;

repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.style.opacity = isRepeat ? "1" : "0.7";
});

playlistToggle.addEventListener("click", () => {
    playlistDrawer.classList.toggle("open");
});

const shuffleBtn = document.getElementById("shuffle");
let isShuffle = false;

shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active");
});

let songIndex=0;
let isPlaying=false;

function loadSong(song){
    title.textContent=song.title;
    artist.textContent=song.artist;
    cover.src=song.cover;
    audio.src=`songs/${song.name}.mp3`;

    if (likedSongs.has(song.name)) {
        likeBtn.textContent = "❤️";
    } else {
        likeBtn.textContent = "🤍";
    }
}

 function playSong(){
    audio.play();
}

function pauseSong(){
    audio.pause();
}

playBtn.addEventListener("click", () => {
    if(audio.paused){
        playSong();
    } else {
        pauseSong();
    }
});
nextBtn.addEventListener("click", nextSong);

prevBtn.addEventListener("click", () => {

    if (isShuffle) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        songIndex = (songIndex - 1 + songs.length) % songs.length;
    }

    loadSong(songs[songIndex]);
    audio.play();
    updateActive();
});

audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Current Time
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60)
        .toString()
        .padStart(2, "0");

    currentTimeEl.textContent = `${minutes}:${seconds}`;

    // Duration
    const totalMinutes = Math.floor(audio.duration / 60);
    const totalSeconds = Math.floor(audio.duration % 60)
        .toString()
        .padStart(2, "0");

    durationEl.textContent = `${totalMinutes}:${totalSeconds}`;
});

audio.addEventListener("play", () => {
    playBtn.textContent = "⏸";
});

audio.addEventListener("pause", () => {
    playBtn.textContent = "▶";
});


audio.addEventListener("ended", () => {
    if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
    } else {
        nextSong();
    }
});

function nextSong() {

    if (isShuffle) {
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === songIndex && songs.length > 1);

        songIndex = randomIndex;

    } else {
        songIndex++;
        if (songIndex >= songs.length) {
            songIndex = 0;
        }
    }

    loadSong(songs[songIndex]);
    audio.play();
    updateActive();
}

progressContainer.addEventListener("click",(e)=>{
    const width=progressContainer.clientWidth;
    audio.currentTime=(e.offsetX/width)*audio.duration;
});

songs.forEach((song,index)=>{
    const li=document.createElement("li");
    li.textContent="🎵 " + song.title;

    li.addEventListener("click",()=>{
        songIndex=index;
        loadSong(song);
        playSong();
        updateActive();
    });

    playlist.appendChild(li);
});


volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

function updateActive(){
    const items = document.querySelectorAll("#playlist li");
    items.forEach(item => item.classList.remove("active"));
    items[songIndex].classList.add("active");
}

themeToggle.addEventListener("change",()=>{
    document.body.classList.toggle("dark");
});

loadSong(songs[songIndex]);
