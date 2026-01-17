console.log("Welcome to Spotify");

// Initialize the variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
    { songName: "Warriyo - Mortals [NCS Release]", filePath: "songs/1.mp3", coverPath: "covers/1.jpg" },
    { songName: "Cielo - Huma-Huma", filePath: "songs/2.mp3", coverPath: "covers/2.jpg" },
    { songName: "DEAF KEV - Invincible [NCS Release]-320k", filePath: "songs/3.mp3", coverPath: "covers/3.jpg" },
    { songName: "Different Heaven & EH!DE - My Heart [NCS Release]", filePath: "songs/4.mp3", coverPath: "covers/4.jpg" },
    { songName: "Janji-Heroes-Tonight-feat-Johnning-NCS-Release", filePath: "songs/5.mp3", coverPath: "covers/5.jpg" },
    { songName: "Rabba - Salam-e-Ishq", filePath: "songs/6.mp3", coverPath: "covers/6.jpg" },
    { songName: "Sakhiyaan - Salam-e-Ishq", filePath: "songs/7.mp3", coverPath: "covers/7.jpg" },
    { songName: "Bhula Dena - Salam-e-Ishq", filePath: "songs/8.mp3", coverPath: "covers/8.jpg" },
    { songName: "Tumhari Kasam - Salam-e-Ishq", filePath: "songs/9.mp3", coverPath: "covers/9.jpg" },
    { songName: "Na Jaana - Salam-e-Ishq", filePath: "songs/10.mp3", coverPath: "covers/10.jpg" },
];

// Populate Song List (Covers and Names)
songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
});

// Helper function to reset all small play icons to 'play' state
const makeALLPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-circle-pause');
        element.classList.add('fa-circle-play');
    });
};

// Handle play/pause click for Master Play Button
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove('fa-circle-play');
        masterPlay.classList.add('fa-circle-pause');
        gif.style.opacity = 1;

        // SYNC: Change the small icon of current song to pause
        let currentIcon = document.getElementById(songIndex);
        currentIcon.classList.remove('fa-circle-play');
        currentIcon.classList.add('fa-circle-pause');
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-circle-pause');
        masterPlay.classList.add('fa-circle-play');
        gif.style.opacity = 0;

        // SYNC: Reset small icons when master is paused
        makeALLPlays();
    }
});

// Listen to Audio Time Update for Progress Bar
audioElement.addEventListener('timeupdate', () => {
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
});

// Seekbar Input
myProgressBar.addEventListener('input', () => {
    audioElement.currentTime = (myProgressBar.value * audioElement.duration) / 100;
});

// Individual Song Item Play Buttons
Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
    element.addEventListener('click', (e) => {
        let clickedIndex = parseInt(e.target.id);

        if (songIndex === clickedIndex && !audioElement.paused) {
            // Pause if clicking the currently playing song
            audioElement.pause();
            e.target.classList.remove('fa-circle-pause');
            e.target.classList.add('fa-circle-play');
            masterPlay.classList.remove('fa-circle-pause');
            masterPlay.classList.add('fa-circle-play');
            gif.style.opacity = 0;
        } else {
            // Play a new song or resume
            makeALLPlays();
            songIndex = clickedIndex;
            
            // Update source if it's a different song
            if (!audioElement.src.includes(songs[songIndex].filePath)) {
                audioElement.src = songs[songIndex].filePath;
                masterSongName.innerText = songs[songIndex].songName;
                audioElement.currentTime = 0;
            }

            audioElement.play();
            gif.style.opacity = 1;
            e.target.classList.remove('fa-circle-play');
            e.target.classList.add('fa-circle-pause');
            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.add('fa-circle-pause');
        }
    });
});

// Next Button
document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex >= 9) ? 0 : songIndex + 1;
    updateSongSource();
});

// Previous Button
document.getElementById('previous').addEventListener('click', () => {
    songIndex = (songIndex <= 0) ? 9 : songIndex - 1;
    updateSongSource();
});

// Helper function to update song across all UI elements
const updateSongSource = () => {
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.classList.remove('fa-circle-play');
    masterPlay.classList.add('fa-circle-pause');

    makeALLPlays();
    let currentIcon = document.getElementById(songIndex);
    currentIcon.classList.remove('fa-circle-play');
    currentIcon.classList.add('fa-circle-pause');
};

// AUTO-PLAY: Play the next song when current one ends
audioElement.addEventListener('ended', () => {
    songIndex = (songIndex >= 9) ? 0 : songIndex + 1;
    updateSongSource();
});