// Study Glass v4 - Apple Liquid Glass Edition // Single file:
study-tools.js

(()=>{ “use strict”;

if(window.StudyGlassV4){ alert(“Study Glass already running”); return; }
window.StudyGlassV4=true;

const KEY=“StudyGlassV4”; let
data=JSON.parse(localStorage.getItem(KEY)||“{}”);

data.speed=data.speed||1.75; data.notes=data.notes||[];
data.marks=data.marks||[]; data.position=data.position||0;

const save=()=>localStorage.setItem(KEY,JSON.stringify(data)); const
getVideo=()=>document.querySelector(“video”);

function toast(msg){ const t=document.createElement(“div”);
t.textContent=msg;
t.style=position:fixed;     bottom:30px;     left:50%;     transform:translateX(-50%);     background:rgba(20,20,25,.75);     color:white;     padding:12px 22px;     border-radius:30px;     backdrop-filter:blur(20px);     z-index:999999;     font-family:-apple-system,BlinkMacSystemFont;;
document.body.appendChild(t); setTimeout(()=>t.remove(),1800); }

function applySpeed(){ document.querySelectorAll(“video”).forEach(v=>{
v.playbackRate=data.speed; }); }

function format(sec){ if(!sec || isNaN(sec)) return “0m”; let
h=Math.floor(sec/3600); let m=Math.floor((sec%3600)/60); return h ?
${h}h ${m}m : ${m}m; }

const panel=document.createElement(“div”);

panel.innerHTML=`

Study Glass

Speed:

Note
Mark
Focus
`;

panel.style=position:fixed; top:20px; right:20px; width:320px; padding:20px; border-radius:32px; background:rgba(255,255,255,.18); backdrop-filter:blur(30px); -webkit-backdrop-filter:blur(30px); border:1px solid rgba(255,255,255,.3); box-shadow:0 20px 50px rgba(0,0,0,.25); z-index:999999; font-family:-apple-system,BlinkMacSystemFont;;

document.body.appendChild(panel);

const slider=panel.querySelector(“#slider”); slider.value=data.speed;

function update(){
panel.querySelector(“#speed”).textContent=data.speed+“x”; const
v=getVideo();

    if(v && v.duration){
        panel.querySelector("#info").innerHTML=`
         Length: ${format(v.duration)}
        <br>
         At speed: ${format(v.duration/data.speed)}
        <br>
         Saved: ${format(v.duration-(v.duration/data.speed))}
        <br>
         Left: ${format(v.duration-v.currentTime)}
        `;
    }

}

slider.oninput=()=>{ data.speed=Number(slider.value); save();
applySpeed(); update(); toast(” Speed changed to “+data.speed+”x”); };

panel.querySelector(“#close”).onclick=()=>{ panel.remove();

    const reopen=document.createElement("button");
    reopen.textContent="";
    reopen.style=`
    position:fixed;
    right:20px;
    bottom:20px;
    z-index:999999;
    font-size:24px;
    border-radius:50%;
    padding:12px;
    `;

    reopen.onclick=()=>{
        reopen.remove();
        document.body.appendChild(panel);
    };

    document.body.appendChild(reopen);

};

panel.querySelector(“#note”).onclick=()=>{ const n=prompt(“Write note”);
if(n){ data.notes.push({text:n,time:getVideo()?.currentTime||0});
save(); toast(” Note saved”); } };

panel.querySelector(“#mark”).onclick=()=>{
data.marks.push(getVideo()?.currentTime||0); save(); toast(” Mark
saved”); };

panel.querySelector(“#focus”).onclick=()=>{
document.body.style.background=“black”;
getVideo()?.requestFullscreen?.(); };

setInterval(()=>{ const v=getVideo();

    if(v){
        data.position=v.currentTime;
        save();
    }

    applySpeed();
    update();

},2000);

applySpeed(); update(); toast(” Study Glass v4 Ready”);

})();
