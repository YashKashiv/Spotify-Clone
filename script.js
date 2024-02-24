let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder = folder;
    let a = await fetch(`https://github.com/YashKashiv/Spotify-Clone/tree/7f0416f448cce72ea7aad8e06d045a1c55b9ebbd/songs/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML=response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML+ `<li> 
        <img src="img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="img/playnow.svg" alt="">
        </div></li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}

const playMusic = (track, pause=false)=>{
    currentSong.src = `/${currFolder}/` + track
    if(!pause){
        currentSong.play()
        plybtn.src="img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){
    await getSongs("songs/happyhits")
    playMusic(songs[0], true)

    plybtn.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play()
            plybtn.src="img/pause.svg"
        }
        else{
            currentSong.pause()
            plybtn.src="img/play.svg"
        }
    })

    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
    })

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left= percent +"%";
        currentSong.currentTime=((currentSong.duration) * percent)/100
    })

    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="0"
    })

    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left="-100%"
    })

    prvbtn.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })

    nxtbtn.addEventListener("click", ()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1)< songs.length){
            playMusic(songs[index+1])
        }
    })

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            document.querySelector(".left").style.left="0"
            playMusic(songs[0])
        })
    })
}

main()
