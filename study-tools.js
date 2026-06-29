(()=>{
"use strict";

if(window.StudyTools){
    alert("🚀 Study Tools already running");
    return;
}
window.StudyTools=true;

const STORAGE="UltimateStudyTools";

let data=JSON.parse(localStorage.getItem(STORAGE)||"{}");

data.speed=data.speed||1.75;
data.notes=data.notes||[];
data.marks=data.marks||[];
data.progress=data.progress||{};
data.studyStart=data.studyStart||Date.now();

function save(){
    localStorage.setItem(STORAGE,JSON.stringify(data));
}

function videos(){
    return [...document.querySelectorAll("video")];
}

function currentVideo(){
    return videos()[0];
}

function toast(msg){
    let t=document.createElement("div");
    t.innerHTML=msg;
    t.style=`
    position:fixed;
    bottom:35px;
    left:50%;
    transform:translateX(-50%);
    background:rgba(0,0,0,.85);
    color:white;
    padding:12px 20px;
    border-radius:20px;
    z-index:999999;
    font-family:-apple-system;
    backdrop-filter:blur(10px);
    `;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),1800);
}

function setSpeed(speed){

    data.speed=Number(speed);
    save();

    videos().forEach(v=>{
        v.playbackRate=data.speed;
    });

    toast("⚡ Speed changed to "+data.speed+"x");
}


function formatTime(sec){

    if(!sec || isNaN(sec))
        return "0m";

    let h=Math.floor(sec/3600);
    let m=Math.floor((sec%3600)/60);

    return h?
    `${h}h ${m}m`:
    `${m}m`;

}


function timeInfo(){

    let v=currentVideo();

    if(!v || !v.duration)
        return null;

    return {
        total:v.duration,
        remaining:(v.duration-v.currentTime),
        fast:v.duration/data.speed,
        saved:v.duration-(v.duration/data.speed)
    };
}


function applySpeed(){

    videos().forEach(v=>{
        v.playbackRate=data.speed;
    });

}


new MutationObserver(()=>{
    applySpeed();
})
.observe(document.body,{
    childList:true,
    subtree:true
});


console.log("🚀 Study Tools loaded");

})();
// ===== UI PANEL =====

let panel=document.createElement("div");

panel.id="studyPanel";

panel.style=`
position:fixed;
top:20px;
right:20px;
width:280px;
background:rgba(20,20,25,.85);
color:white;
padding:18px;
border-radius:22px;
z-index:999999;
font-family:-apple-system,BlinkMacSystemFont,sans-serif;
backdrop-filter:blur(18px);
box-shadow:0 15px 40px rgba(0,0,0,.4);
`;

panel.innerHTML=`

<h3 style="margin:0 0 12px">
📚 Study Mode
</h3>

<div>
⚡ Speed:
<b id="speedText">
${data.speed}x
</b>
</div>

<input id="speedSlider"
type="range"
min="0.5"
max="3"
step="0.05"
value="${data.speed}"
style="width:100%"
>


<div id="timeInfo"
style="margin-top:10px;font-size:14px">
Calculating...
</div>


<hr>


<button id="noteBtn">
📝 Add Note
</button>

<button id="markBtn">
🔖 Mark Time
</button>

<button id="focusBtn">
🎯 Focus
</button>


<hr>


<div>
⏱ Pomodoro
</div>

<button id="startTimer">
Start 25 min
</button>

<div id="timer">
25:00
</div>


<hr>


<button id="closeBtn">
✕ Close
</button>

`;

document.body.appendChild(panel);



const slider=
panel.querySelector("#speedSlider");

const speedText=
panel.querySelector("#speedText");


slider.oninput=()=>{

setSpeed(slider.value);

speedText.innerHTML=
slider.value+"x";

updateInfo();

};



function updateInfo(){

let info=timeInfo();

if(!info)
return;

panel.querySelector("#timeInfo").innerHTML=`

🎬 Length:
${formatTime(info.total)}

<br>

🚀 At ${data.speed}x:
${formatTime(info.fast)}

<br>

🔥 Saved:
${formatTime(info.saved)}

<br>

⏳ Left:
${formatTime(info.remaining)}

`;

}


setInterval(updateInfo,1000);



panel.querySelector("#noteBtn")
.onclick=()=>{

let v=currentVideo();

let note=prompt(
"Write note:"
);

if(note){

data.notes.push({

text:note,

time:v?
v.currentTime:
0

});

save();

toast("📝 Note saved");

}

};



panel.querySelector("#markBtn")
.onclick=()=>{

let v=currentVideo();

data.marks.push(
v?v.currentTime:0
);

save();

toast("🔖 Timestamp saved");

};



panel.querySelector("#focusBtn")
.onclick=()=>{

document.body.style.background="#000";

let v=currentVideo();

if(v && v.requestFullscreen)
v.requestFullscreen();

toast("🎯 Focus mode");

};



panel.querySelector("#closeBtn")
.onclick=()=>{

panel.remove();

};



// ===== POMODORO =====

let timerSeconds=1500;
let timerRunning=false;


panel.querySelector("#startTimer")
.onclick=()=>{

timerRunning=!timerRunning;

toast(
timerRunning?
"⏱ Pomodoro started":
"⏸ Pomodoro paused"
);

};


setInterval(()=>{

if(timerRunning){

timerSeconds--;

let m=Math.floor(timerSeconds/60);

let s=timerSeconds%60;

panel.querySelector("#timer")
.innerHTML=
`${m}:${s.toString().padStart(2,"0")}`;

if(timerSeconds<=0){

timerRunning=false;

timerSeconds=1500;

toast("🎉 Pomodoro complete!");

}

}

},1000);


applySpeed();

updateInfo();
// ===== RESUME POSITION =====

let videoCheck=setInterval(()=>{

let v=currentVideo();

if(!v)
return;

clearInterval(videoCheck);


// restore position

if(data.position){

v.currentTime=data.position;

toast(
"▶ Resumed from "+
formatTime(data.position)
);

}


// save position

v.addEventListener("timeupdate",()=>{

data.position=v.currentTime;

save();

});


// completion tracking

v.addEventListener("ended",()=>{

data.completed=true;

save();

toast(
"🎉 Lecture completed!"
);

});


},1000);



// ===== TIMESTAMP LIST =====

let list=document.createElement("div");

list.style=`
margin-top:10px;
font-size:13px;
max-height:120px;
overflow:auto;
`;

panel.appendChild(list);



function showMarks(){

list.innerHTML="<b>🔖 Marks</b><br>";

data.marks.forEach((m,i)=>{

let b=document.createElement("button");

b.innerHTML=
"▶ "+formatTime(m);

b.style="display:block;margin:4px;width:100%";


b.onclick=()=>{

let v=currentVideo();

if(v)
v.currentTime=m;

};


list.appendChild(b);

});

}


showMarks();



// ===== NOTES LIST =====

let notesBox=document.createElement("div");

notesBox.style=`
margin-top:10px;
font-size:13px;
max-height:150px;
overflow:auto;
`;

panel.appendChild(notesBox);



function showNotes(){

notesBox.innerHTML=
"<b>📝 Notes</b><br>";

data.notes.forEach((n)=>{

let item=document.createElement("div");

item.style=
"margin:5px;padding:5px;background:#ffffff22;border-radius:8px";


item.innerHTML=
`
${formatTime(n.time)}
<br>
${n.text}
`;

item.onclick=()=>{

let v=currentVideo();

if(v)
v.currentTime=n.time;

};


notesBox.appendChild(item);


});

}


showNotes();



// ===== KEYBOARD SHORTCUTS =====

document.addEventListener(
"keydown",
(e)=>{

let v=currentVideo();

if(!v)
return;



// Space = play pause

if(e.code==="Space"){

e.preventDefault();

v.paused?
v.play():
v.pause();

}



// Left right seek

if(e.key==="ArrowRight"){

v.currentTime+=10;

toast("⏩ +10 sec");

}


if(e.key==="ArrowLeft"){

v.currentTime-=10;

toast("⏪ -10 sec");

}



// M = mark

if(e.key.toLowerCase()==="m"){

data.marks.push(v.currentTime);

save();

showMarks();

toast("🔖 Mark saved");

}



// N = note

if(e.key.toLowerCase()==="n"){

let text=
prompt("Note:");

if(text){

data.notes.push({

time:v.currentTime,

text:text

});

save();

showNotes();

toast("📝 Note saved");

}

}


});



// ===== STUDY STATS =====

let stats=document.createElement("div");

stats.style=`
margin-top:12px;
font-size:13px;
`;

panel.appendChild(stats);


function updateStats(){

let watched=data.position||0;

stats.innerHTML=
`
📊 Progress:
${formatTime(watched)}

<br>

${data.completed?
"✅ Completed":
"📖 In progress"}

`;

}


setInterval(updateStats,1000);

updateStats();



toast("🚀 Study Tools Ready");
