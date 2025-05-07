console.log("Lets write javascript code");

let currentSong = new Audio();
let songs;
let currFolder;
function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let secs = Math.round(seconds % 60);  // Round seconds

    // Ensure correct formatting
    if (secs === 60) {
        secs = 0;
        minutes += 1;
    }

    return hours > 0
        ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
        : `${minutes}:${String(secs).padStart(2, "0")}`;
}




async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    console.log(as);
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    }


    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = ""; // Clear the existing list
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
    
                            <img style="width: 38px;" src="Music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("http://127.0.0.1:3000/Songs/dbz%20", " ")}</div>
                                <div>Bruce-Faulkner</div>
                            </div>
                            <div class="playnow">
                                <span>Play-Now</span>
                                <img  style="width: 40px;" src = "play.svg" alt="">
                            </div>
                            
                        
        
        
        
        </li>`;
    }

    //var audio  = new Audio(songs[0]); 
    //audio.play();
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        }

        )
    })
    return songs;



}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/Songs/"+track);
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
    }
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

};

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/Songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
   let array = Array.from(anchors);
        for(let index = 0;index < array.length;index++){
            const e = array[index];
        
        if (e.href.includes("/Songs")) {
            let folder = (e.href.split("/").slice(-2)[0]);
            let a = await fetch(`http://127.0.0.1:3000/Songs/${folder}/info.json`);
            let response = await a.json();
            console.log(response);
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card ">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                                <!-- Green Circle Background -->
                                <circle cx="12" cy="12" r="10" fill="green" />
                                <!-- Smaller Centered Play Button -->
                                <path d="M10 8v8l6-4z" fill="black" />
                            </svg>
                        </div>

                        <img aria-hidden="false" draggable="false" loading="lazy"
                            src="/Songs/${folder}/Cover.jpeg"
                            alt=""
                            >
                        <h2>${response.title} </h2>
                        <p>${response.description}</p>

                    </div>`;

        }
    }
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        console.log(e);
        e.addEventListener("click", async (item) => {
            console.log(item, item.currentTarget.dataset);
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);
        })

    })

    console.log(anchors);

}
async function main() {

    await getSongs("Songs/DBZ-Themes");
    playMusic(songs[0], true);
    displayAlbums();

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }

    })
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    document.querySelector(".hamburger").addEventListener("click", () => {

        document.querySelector(".left").style.left = "0";

    })
    document.querySelector(".close").addEventListener("click", () => {

        document.querySelector(".left").style.left = "-120%";

    })
    // previous.addEventListener("click", () => {
    //     console.log(currentSong);
    //     console.log(songs);
    //     let index = songs.indexOf((currentSong.src.split("/Songs/").slice(-1)[0]));
    //     if (index - 1 >= 0) {
    //         playMusic(songs[index - 1]);
    //     }
    // })

    // next.addEventListener("click", () => {
    //     console.log(currentSong);
    //     let index = songs.indexOf((currentSong.src.split("/Songs/").slice(-1)[0]));
    //     console.log(index, songs.length);
    //     if (index + 1 < songs.length) {
    //         playMusic(songs[index + 1]);
    //     }

    // })
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume>0)
        {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg");
        }
    })
   document.querySelector(".volume>img").addEventListener("click", (e) => {

    if(e.target.src.includes("volume.svg")){
      e.target.src =  e.target.src.replace("volume.svg","mute.svg") ;
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        
    }
    else{
       e.target.src = e.target.src.replace("mute.svg","volume.svg") ;
        currentSong.volume = 0.10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
   })

}
main();
