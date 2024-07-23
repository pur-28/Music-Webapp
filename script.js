const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    mainAudio = wrapper.querySelector("#main-audio"),
    progressBar = wrapper.querySelector(".progress-bar"),
    progressArea = wrapper.querySelector(".progress-area"),
    musicList = wrapper.querySelector(".music-list"),
    moreMusicBtn = wrapper.querySelector("#more-music"),
    closemoreMusic = wrapper.querySelector("#close")


//show Music List onclick Music Icon
moreMusicBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", ()=>{
    moreMusicBtn.click();
})

//Load Funcion
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
});

function loadMusic(i){
    musicName.innerText = allMusic[i - 1].name;
    musicArtist.innerText = allMusic[i - 1].artist;
    musicImg.src = `img/${allMusic[i - 1].src}.jpg`;
    mainAudio.src = `songs/${allMusic[i - 1].src}.mp3`;
}

//Music List 
const ulTag = wrapper.querySelector("ul");

for(let i =0; i < allMusic.length; i++){
    let liTag = `
    <li li-index="${i + 1}">
        <div class="row">
            <span>${allMusic[i].name}</span>
            <p>${allMusic[i].artist}</p>
        </div>
        <span id="${allMusic[i].src}" class="audio-duration">0:00</span>
        <audio src="songs/${allMusic[i].src}.mp3" class="${allMusic[i].src}"></audio>
    </li>
    `;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDurationtag = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let duration = liAudioTag.duration;
        let totalMin = Math.floor(duration / 60);
        let totalSec = Math.floor(duration % 60);

        if(totalSec < 10){
            totalSec = `0${totalSec}`
        }

        liAudioDurationtag.innerText = `${totalMin}:${totalSec}`;
        liAudioDurationtag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });

}

//Playing Song
function playingSong(){
    const allLiTag = ulTag.querySelectorAll("li");

    for(let j = 0; j < allLiTag.length; j++){
        let audioTag = allLiTag[j].querySelector(".audio-duration");
        
        if(allLiTag[j].classList.contains("playing")){
            allLiTag[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if(allLiTag[j].getAttribute("li-index")== musicIndex){
            allLiTag[j].classList.add("playing");
            audioTag.innerText = "playing";
        }
        allLiTag[j].setAttribute("onclick", "clicked(this)");
    }

}

function clicked(e){
    let getLiIndex = e.getAttribute("li-index");
    musicIndex = getLiIndex;

    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//play and Pause Event
playPauseBtn.addEventListener("click", () => {
    const isMusicPlay = wrapper.classList.contains("paused");

    if(isMusicPlay == true){
        pauseMusic();
    }
    else{
        playMusic();
    }
    playingSong();
})

//play music Function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//Pause Music Function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

//Update Progress Bar as to music Curr Time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current-time"),
        musicDuration = wrapper.querySelector(".max-duration");

        mainAudio.addEventListener("loadeddata", () => {
            let mainadDuration = mainAudio.duration;
            let totalMin = Math.floor(mainadDuration / 60);
            let totalSec = Math.floor(mainadDuration % 60);
    
            if(totalSec < 10){
                totalSec = `0${totalSec}`;
            }
            musicDuration.innerText = `${totalMin}:${totalSec}`
        });

        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);

        if (currentSec < 10){
            currentSec = `0${currentSec}`
        }

        musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})

//update Music curr time as to Progress Bar
progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedoffsetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedoffsetX / progressWidth) * songDuration;
    playMusic();
    playingSong();
})

//next event
nextBtn.addEventListener("click", () => {
    nextMusic();
});

//next Function
function nextMusic(){
    musicIndex++;
    if(musicIndex > allMusic.length){
        musicIndex = 1 ;
    }
    else{
        musicIndex = musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

//Prev Event
prevBtn.addEventListener("click", () => {
    prevMusic();
})

// Prev Function
function prevMusic(){
    musicIndex--;
    if (musicIndex < 1){
        musicIndex = allMusic.length ;
    }
    else{
       musicIndex = musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}
//change loop shuffle and repeat icon
const repeatBtn = wrapper.querySelector("#repeat-plist");

repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback Shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped");
            break;
    }
})

//After End Song

mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0 ;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randerIndex = Math.floor((Math.random() * allMusic.length) + 1);

            do {
                randerIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randerIndex);

            musicIndex = randerIndex ;
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
})