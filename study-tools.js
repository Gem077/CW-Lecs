(()=>{
"use strict";

if(window.UltimateStudyTools){
    alert("🚀 Study Tools already running");
    return;
}

window.UltimateStudyTools=true;


const STORAGE_KEY="UltimateStudyTools_v1";


let data=JSON.parse(
    localStorage.getItem(STORAGE_KEY)
    ||
    "{}"
);


data.speed=data.speed||1.75;
data.notes=data.notes||[];
data.marks=data.marks||[];
data.completed=data.completed||false;
data.position=data.position||0;
data.totalWatched=data.totalWatched||0;


function save(){
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}


function toast(message){

    let box=document.createElement("div");

    box.textContent=message;

    box.style=`
    position:fixed;
    bottom:30px;
    left:50%;
    transform:translateX(-50%);
    background:rgba(0,0,0,.85);
    color:white;
    padding:12px 22px;
    border-radius:30px;
    z-index:999999;
    font-family:-apple-system,BlinkMacSystemFont;
    backdrop-filter:blur(10px);
    `;

    document.body.appendChild(box);

    setTimeout(()=>{
        box.remove();
    },1800);
}



function getVideo(){

    return document.querySelector("video");

}



function formatTime(seconds){

    if(!seconds || isNaN(seconds))
        return "0m";

    let h=Math.floor(seconds/3600);

    let m=Math.floor(
        (seconds%3600)/60
    );

    let s=Math.floor(seconds%60);


    if(h)
        return `${h}h ${m}m`;

    if(m)
        return `${m}m ${s}s`;

    return `${s}s`;
}



function applySpeed(){

    document
    .querySelectorAll("video")
    .forEach(video=>{

        video.playbackRate=data.speed;

    });

}



function setSpeed(value){

    data.speed=Number(value);

    save();

    applySpeed();

    document
    .getElementById("speedValue")
    .textContent=data.speed+"x";


    toast(
        "⚡ Speed changed to "+
        data.speed+
        "x"
    );

    updateInfo();

}




function getInfo(){

    let video=getVideo();

    if(!video || !video.duration)
        return null;


    return {

        total:video.duration,

        remaining:
        video.duration-video.currentTime,

        fast:
        video.duration/data.speed,

        saved:
        video.duration-
        (video.duration/data.speed)

    };

}




function updateInfo(){

    let info=getInfo();

    let area=
    document.getElementById("videoInfo");


    if(!area || !info)
        return;


    area.innerHTML=`

    🎬 Total:
    ${formatTime(info.total)}

    <br>

    🚀 Finish at ${data.speed}x:
    ${formatTime(info.fast)}

    <br>

    🔥 Time saved:
    ${formatTime(info.saved)}

    <br>

    ⏳ Remaining:
    ${formatTime(info.remaining)}

    `;

}





// ===== PANEL =====


let panel=document.createElement("div");


panel.id="studyPanel";


panel.style=`

position:fixed;
top:20px;
right:20px;
width:300px;
max-height:80vh;
overflow:auto;

background:
rgba(20,20,25,.82);

color:white;

padding:18px;

border-radius:24px;

z-index:999999;

font-family:
-apple-system,BlinkMacSystemFont,sans-serif;

backdrop-filter:
blur(18px);

box-shadow:
0 15px 40px rgba(0,0,0,.4);

`;



panel.innerHTML=`

<h2 style="margin-top:0">
📚 Study Mode
</h2>


<div>
⚡ Speed:
<b id="speedValue">
${data.speed}x
</b>
</div>


<input
id="speedSlider"
type="range"
min="0.5"
max="3"
step="0.05"
value="${data.speed}"
style="width:100%"
>


<div
id="videoInfo"
style="
margin-top:12px;
font-size:14px;
line-height:1.6
">
Loading...
</div>


<hr>


<button id="noteBtn">
📝 Note
</button>

<button id="markBtn">
🔖 Mark
</button>


<button id="focusBtn">
🎯 Focus
</button>


<hr>

<div id="notesArea"></div>

<div id="marksArea"></div>

`;


document.body.appendChild(panel);



document
.getElementById("speedSlider")
.oninput=function(){

    setSpeed(this.value);

};


// ===== BUTTON ACTIONS =====


document
.getElementById("noteBtn")
.onclick=()=>{

let video=getVideo();

let text=prompt(
"📝 Write note:"
);


if(text){

data.notes.push({

text:text,

time:
video?
video.currentTime:
0

});


save();

renderNotes();

toast("📝 Note saved");

}

};





document
.getElementById("markBtn")
.onclick=()=>{


let video=getVideo();


if(video){

data.marks.push(
video.currentTime
);


save();

renderMarks();


toast("🔖 Timestamp saved");

}

};





document
.getElementById("focusBtn")
.onclick=()=>{


document.body.style.background="black";


let video=getVideo();


if(video && video.requestFullscreen){

video.requestFullscreen();

}


toast("🎯 Focus mode ON");

};





// ===== NOTES DISPLAY =====


function renderNotes(){


let box=
document.getElementById("notesArea");


box.innerHTML=
"<hr><b>📝 Notes</b><br>";


data.notes.forEach(note=>{


let item=document.createElement("div");


item.style=`

margin:6px 0;
padding:8px;
background:#ffffff18;
border-radius:10px;
cursor:pointer;

`;


item.innerHTML=
`
${formatTime(note.time)}
<br>
${note.text}
`;


item.onclick=()=>{

let video=getVideo();

if(video)
video.currentTime=note.time;

};


box.appendChild(item);


});


}






// ===== MARK DISPLAY =====



function renderMarks(){


let box=
document.getElementById("marksArea");


box.innerHTML=
"<hr><b>🔖 Marks</b><br>";



data.marks.forEach(mark=>{


let button=document.createElement("button");


button.textContent=
"▶ "+formatTime(mark);



button.style=
"display:block;width:100%;margin:5px 0";


button.onclick=()=>{


let video=getVideo();


if(video)
video.currentTime=mark;


};


box.appendChild(button);



});


}






// ===== RESUME SYSTEM =====


let resumeCheck=setInterval(()=>{


let video=getVideo();


if(!video)
return;


clearInterval(resumeCheck);



if(data.position>5){


video.currentTime=data.position;


toast(
"▶ Resumed from "+
formatTime(data.position)
);


}




video.addEventListener(
"timeupdate",
()=>{


data.position=
video.currentTime;


data.totalWatched+=1;


save();


updateInfo();


}
);



video.addEventListener(
"ended",
()=>{


data.completed=true;


save();


toast(
"🎉 Lecture completed!"
);


});



applySpeed();


},1000);






// ===== POMODORO =====


let pomodoro=1500;

let running=false;


let timer=document.createElement("div");


timer.style=
"margin-top:12px";


panel.appendChild(timer);



let timerButton=document.createElement("button");


timerButton.textContent=
"⏱ Start Pomodoro";


panel.appendChild(timerButton);



timerButton.onclick=()=>{


running=!running;


toast(
running?
"⏱ Pomodoro started":
"⏸ Pomodoro paused"
);


};





setInterval(()=>{


if(running){


pomodoro--;


let m=Math.floor(
pomodoro/60
);


let s=pomodoro%60;


timer.textContent=
`⏱ ${m}:${String(s).padStart(2,"0")}`;



if(pomodoro<=0){


running=false;

pomodoro=1500;


toast(
"🎉 Pomodoro complete!"
);


}


}


},1000);







// ===== KEYBOARD SHORTCUTS =====



document.addEventListener(
"keydown",
e=>{


let video=getVideo();


if(!video)
return;



if(e.code==="Space"){


e.preventDefault();


video.paused?
video.play():
video.pause();


}



if(e.key==="ArrowRight"){

video.currentTime+=10;

toast("⏩ +10 sec");

}



if(e.key==="ArrowLeft"){

video.currentTime-=10;

toast("⏪ -10 sec");

}



if(e.key.toLowerCase()==="m"){


data.marks.push(
video.currentTime
);


save();

renderMarks();


toast("🔖 Mark added");


}



if(e.key.toLowerCase()==="n"){


let text=prompt(
"📝 Note:"
);


if(text){


data.notes.push({

text:text,

time:video.currentTime

});


save();

renderNotes();


toast("📝 Note saved");


}


}



});







// ===== AUTO UPDATE FOR NEW VIDEOS =====



new MutationObserver(()=>{

applySpeed();

})
.observe(
document.body,
{
childList:true,
subtree:true
}
);





renderNotes();

renderMarks();

applySpeed();

updateInfo();


toast(
"🚀 Study Tools Ready"
);


})();
