// Ultimate Study Tools v2 - Apple Liquid Glass Edition // Single file:
study-tools.js // Features: // - Liquid glass floating dashboard // -
Minimize/reopen button // - Speed slider 0.5x-3x // - Saved playback
speed // - Video time saved calculator // - Resume position // - Lecture
progress // - Notes with timestamps // - Timestamp bookmarks // -
Pomodoro timer // - Focus mode // - Keyboard shortcuts
(()=>{ “use strict”;
if(window.UltimateStudyToolsV2)return; window.UltimateStudyToolsV2=true;
const KEY=“StudyGlassV2”;
let data=JSON.parse(localStorage.getItem(KEY)||“{}”);
Object.assign(data,{ speed:data.speed||1.75, notes:data.notes||[],
marks:data.marks||[], position:data.position||0,
completed:data.completed||false, studied:data.studied||0 });
const save=()=>localStorage.setItem(KEY,JSON.stringify(data)); const
getVideo=()=>document.querySelector(“video”);
function toast(msg){ const t=document.createElement(“div”);
t.textContent=msg;
t.style=position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:rgba(20,20,25,.75); color:white; padding:12px 22px; border-radius:30px; backdrop-filter:blur(25px); z-index:999999; font-family:-apple-system;;
document.body.appendChild(t); setTimeout(()=>t.remove(),1600); }
function applySpeed(){ document.querySelectorAll(“video”).forEach(v=>{
v.playbackRate=data.speed; }); }
function time(s){ if(!s||isNaN(s))return “0m”; let h=Math.floor(s/3600);
let m=Math.floor((s%3600)/60); return h?${h}h ${m}m:${m}m; }
let panel=document.createElement(“div”);
panel.innerHTML=`
📚 Study Glass
−
⚡ Speed
📝 Note
🔖 Mark
🎯 Focus
⏱ Pomodoro
`;
panel.style=position:fixed; top:20px; right:20px; width:320px; padding:20px; border-radius:32px; background:rgba(255,255,255,.18); backdrop-filter:blur(35px); -webkit-backdrop-filter:blur(35px); border:1px solid rgba(255,255,255,.35); box-shadow:0 20px 60px rgba(0,0,0,.25); z-index:999999; font-family:-apple-system,BlinkMacSystemFont;;
document.body.appendChild(panel);
let slider=panel.querySelector(“#speedSlider”); slider.value=data.speed;
function update(){
panel.querySelector(“#speed”).textContent=data.speed+“x”;
let v=getVideo();
if(v&&v.duration){ panel.querySelector(“#stats”).innerHTML=
🎬 Length: ${time(v.duration)} <br> 🚀 At ${data.speed}x: ${time(v.duration/data.speed)} <br> 🔥 Saved: ${time(v.duration-v.duration/data.speed)} <br> ⏳ Left: ${time(v.duration-v.currentTime)};
} }
slider.oninput=()=>{ data.speed=Number(slider.value); save();
applySpeed(); update(); toast(“⚡ Speed changed to”+data.speed+“x”); };
panel.querySelector(“#hide”).onclick=()=>{ panel.remove();
let b=document.createElement(“button”); b.textContent=“📚”;
b.style=“position:fixed;right:20px;bottom:20px;z-index:999999;font-size:25px;border-radius:50%”;
b.onclick=()=>{ b.remove(); document.body.appendChild(panel); };
document.body.appendChild(b); };
panel.querySelector(“#note”).onclick=()=>{ let n=prompt(“Note”); if(n){
data.notes.push({text:n,time:getVideo()?.currentTime||0}); save();
toast(“📝 Saved”); } render(); };
panel.querySelector(“#mark”).onclick=()=>{
data.marks.push(getVideo()?.currentTime||0); save(); render(); toast(“🔖
Saved”); };
panel.querySelector(“#focus”).onclick=()=>{
document.body.style.background=“#000”;
getVideo()?.requestFullscreen?.(); };
let timer=1500; let running=false;
panel.querySelector(“#pomodoro”).onclick=()=>{ running=!running;
toast(running?“⏱ Started”:“Paused”); };
setInterval(()=>{ if(running){ timer–;
panel.querySelector(“#timer”).textContent=
Math.floor(timer/60)+“:”+String(timer%60).padStart(2,“0”); } },1000);
function render(){
panel.querySelector(“#notes”).innerHTML= “📝 Notes”+
data.notes.map(n=>${time(n.time)} - ${n.text}).join(“”);
panel.querySelector(“#marks”).innerHTML= “🔖 Marks”+
data.marks.map(m=>time(m)).join(“”); }
let check=setInterval(()=>{ let v=getVideo(); if(v){
clearInterval(check);
if(data.position>5) v.currentTime=data.position;
v.ontimeupdate=()=>{ data.position=v.currentTime; save(); };
v.onended=()=>{ data.completed=true; save(); toast(“🎉 Completed”); }; }
},1000);
document.onkeydown=e=>{ let v=getVideo(); if(!v)return;
if(e.code===“Space”){ e.preventDefault(); v.paused?v.play():v.pause(); }
if(e.key===“ArrowRight”)v.currentTime+=10;
if(e.key===“ArrowLeft”)v.currentTime-=10; if(e.key.toLowerCase()===“m”){
data.marks.push(v.currentTime); save(); } };
new MutationObserver(applySpeed)
.observe(document.body,{childList:true,subtree:true});
render(); applySpeed(); update();
toast(“🚀 Study Glass v2 Ready”);
})();
