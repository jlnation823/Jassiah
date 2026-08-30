const audio=document.getElementById("audio"), fileInput=document.getElementById("fileInput"), songList=document.getElementById("songList"), empty=document.getElementById("empty"), playBtn=document.getElementById("playBtn"), progress=document.getElementById("progress"), current=document.getElementById("current"), duration=document.getElementById("duration"), volume=document.getElementById("volume"), search=document.getElementById("search"); let songs=[],index=-1;
const fmt=s=>{if(!isFinite(s))return"0:00";let m=Math.floor(s/60),sec=Math.floor(s%60).toString().padStart(2,"0");return`${m}:${sec}`};
function render(filter=""){songList.innerHTML="";let shown=songs.map((s,i)=>({s,i})).filter(x=>x.s.name.toLowerCase().includes(filter.toLowerCase()));empty.style.display=shown.length?"none":"block";shown.forEach(({s,i},n)=>{let row=document.createElement("div");row.className="song";row.innerHTML=`<div class="song-num">${n+1}</div><div class="song-info"><strong>${esc(s.name.replace(/\.[^/.]+$/,""))}</strong><span>Your library</span></div><button title="Play">▶</button>`;row.querySelector("button").onclick=()=>load(i,true);songList.appendChild(row)})}
function esc(x){return x.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function load(i,autoplay=false){index=i;let s=songs[i];audio.src=s.url;document.getElementById("nowTitle").textContent=s.name.replace(/\.[^/.]+$/,"");document.getElementById("nowArtist").textContent="Your library";document.getElementById("miniArt").textContent="♪";if(autoplay){audio.play();playBtn.textContent="Ⅱ"}else playBtn.textContent="▶"}
fileInput.onchange=e=>{[...e.target.files].filter(f=>f.type.startsWith("audio/")).forEach(f=>songs.push({name:f.name,url:URL.createObjectURL(f)}));render();if(index<0&&songs.length)load(0);fileInput.value=""};
playBtn.onclick=()=>{if(index<0&&songs.length)load(0,true);else if(audio.paused){audio.play();playBtn.textContent="Ⅱ"}else{audio.pause();playBtn.textContent="▶"}};
document.getElementById("nextBtn").onclick=()=>{if(!songs.length)return;load((index+1)%songs.length,true)};
document.getElementById("prevBtn").onclick=()=>{if(!songs.length)return;load((index-1+songs.length)%songs.length,true)};
audio.ontimeupdate=()=>{progress.value=audio.duration?(audio.currentTime/audio.duration*100):0;current.textContent=fmt(audio.currentTime)};
audio.onloadedmetadata=()=>duration.textContent=fmt(audio.duration);
audio.onended=()=>document.getElementById("nextBtn").click();
progress.oninput=()=>{if(audio.duration)audio.currentTime=progress.value/100*audio.duration};
volume.oninput=()=>audio.volume=volume.value;
search.oninput=()=>render(search.value);
document.getElementById("browseBtn").onclick=()=>document.getElementById("library").scrollIntoView({behavior:"smooth"});
document.getElementById("themeBtn").onclick=()=>document.body.classList.toggle("light");
audio.volume=.8;render();
