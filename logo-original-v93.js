(function(){
const $=s=>document.querySelector(s);let RM=window.hongMingMotion.matches;
/* ---------- particles → HM mark (original yellow and white) ---------- */
const PCFG={stiff:.01,damp:.9,gather:1.7,hold:4,explode:1.7,power:12,wander:.3,mR:160,mS:4,color:"#E9BE28",RES:600,gap:1};
const PS={img:null,parts:[],targets:[],phase:"gather",t:0,last:0,running:false,vis:true,io:null,mouse:{x:-9999,y:-9999,on:false},W:0,H:0,center:{x:0,y:0},box:300,size:3};
function psInit(){
 PS.cv=$("#particles"); if(!PS.cv) return;
 PS.ctx=PS.cv.getContext("2d"); PS.hero=PS.cv.parentElement; PS.stage=$("#heroStage");
 PS.hero.addEventListener("pointermove",e=>{const r=PS.cv.getBoundingClientRect();PS.mouse.x=e.clientX-r.left;PS.mouse.y=e.clientY-r.top;PS.mouse.on=true});
 const off=()=>{PS.mouse.on=false;PS.mouse.x=PS.mouse.y=-9999};
 PS.hero.addEventListener("pointerleave",off); PS.hero.addEventListener("pointercancel",off);
 PS.hero.addEventListener("pointerup",e=>{if(e.pointerType!=="mouse")off()});
 psResize();
 if(!PS.img){PS.img=new Image();PS.img.onload=()=>{psSample();psStart()};PS.img.src="assets__hm-mark-original.png"}
 else if(PS.img.complete){psSample();psStart()}
 if("IntersectionObserver" in window){if(PS.io)PS.io.disconnect();PS.io=new IntersectionObserver(en=>{PS.vis=en[0].isIntersecting;psStart()});PS.io.observe(PS.hero)}
}
function psResize(){
 if(!PS.cv) return;
 const r=PS.hero.getBoundingClientRect(), mob=innerWidth<=768;
 PS.W=r.width; PS.H=r.height; PS.dpr=Math.min(mob?1.5:2,devicePixelRatio||1);
 PS.cv.width=Math.round(PS.W*PS.dpr); PS.cv.height=Math.round(PS.H*PS.dpr);
 PS.ctx.setTransform(PS.dpr,0,0,PS.dpr,0,0);
 const s=PS.stage.getBoundingClientRect(), rd=PS.stage.querySelector(".reading");
 const rh=rd?rd.offsetHeight+28:0, availH=Math.max(160,s.height-rh);
 PS.center={x:s.left-r.left+s.width/2,y:s.top-r.top+availH/2};
 PS.box=Math.min(s.width*.9,availH*.95);
}
function psSample(){
 const img=PS.img; if(!img||!img.naturalWidth) return;
 const ar=img.naturalWidth/img.naturalHeight, box=PS.box;
 let dW=box,dH=box/ar; if(dH>box){dH=box;dW=box*ar}
 let rw=Math.min(PCFG.RES,Math.ceil(dW)),rh=Math.round(rw/ar); if(rh>PCFG.RES){rh=PCFG.RES;rw=Math.round(PCFG.RES*ar)}
 const oc=document.createElement("canvas"); oc.width=rw; oc.height=rh;
 const ox=oc.getContext("2d",{willReadFrequently:true}); ox.drawImage(img,0,0,rw,rh);
 const data=ox.getImageData(0,0,rw,rh).data, g=PCFG.gap, pts=[];
 for(let y=0;y<rh;y+=g) for(let x=0;x<rw;x+=g){ if(data[(y*rw+x)*4+3]>60) pts.push({x:((x+.5)/rw-.5)*dW,y:((y+.5)/rh-.5)*dH,white:data[(y*rw+x)*4+2]>180}) }
 PS.size=(dW/rw*g)*.52;
 PS.cv.dataset.particleSize=(PS.size*2).toFixed(2);PS.cv.dataset.particleCount=String(pts.length);
 PS.targets=pts;
 const mob=PS.W<=768;
 while(PS.parts.length<pts.length){
  const x=(mob?PS.W*.05:PS.W*.3)+Math.random()*(mob?PS.W*.9:PS.W*.7), y=Math.random()*PS.H;
  PS.parts.push({pos:{x,y},prev:{x,y},vel:{x:(Math.random()-.5)*4,y:(Math.random()-.5)*4},jit:.5+Math.random()*1.5,wa:Math.random()*Math.PI*2});
 }
 if(PS.parts.length>pts.length) PS.parts.length=pts.length;
 PS.parts.forEach((p,i)=>p.tg=pts[i]);
 if(RM){PS.parts.forEach(p=>{p.pos.x=p.prev.x=PS.center.x+p.tg.x;p.pos.y=p.prev.y=PS.center.y+p.tg.y});psDraw()}
}
function psWander(p,a){p.wa+=(Math.random()-.5)*.5;return{x:Math.cos(p.wa)*a*p.jit*.15,y:Math.sin(p.wa)*a*p.jit*.15}}
function psExplode(){
 const c=PS.center;
 for(const p of PS.parts){
  let dx=p.pos.x-c.x,dy=p.pos.y-c.y; if(Math.hypot(dx,dy)<1){dx=Math.random()-.5;dy=Math.random()-.5}
  const m=Math.hypot(dx,dy)||1,k=PCFG.power*(.6+Math.random()*.8),sp=PCFG.power*(Math.random()-.5)*.6;
  p.vel.x+=dx/m*k+(-dy/m)*sp; p.vel.y+=dy/m*k+(dx/m)*sp;
 }
}
function psStep(dt){
 PS.t+=dt;
 if(PS.phase==="gather"&&PS.t>=PCFG.gather){PS.phase="hold";PS.t=0}
 else if(PS.phase==="hold"&&PS.t>=PCFG.hold){PS.phase="explode";PS.t=0;psExplode()}
 else if(PS.phase==="explode"&&PS.t>=PCFG.explode){PS.phase="gather";PS.t=0}
 const c=PS.center, M=PS.mouse, ex=PS.phase==="explode";
 for(const p of PS.parts){
  p.prev.x=p.pos.x; p.prev.y=p.pos.y;
  let fx=0,fy=0;
  if(!ex){const dx=c.x+p.tg.x-p.pos.x,dy=c.y+p.tg.y-p.pos.y;fx+=dx*PCFG.stiff;fy+=dy*PCFG.stiff;const w=psWander(p,PCFG.wander*Math.min(1,Math.hypot(dx,dy)/40));fx+=w.x;fy+=w.y}
  else{const w=psWander(p,PCFG.wander*1.5);fx+=w.x;fy+=w.y}
  if(M.on){const dx=p.pos.x-M.x,dy=p.pos.y-M.y,d=Math.hypot(dx,dy);if(d<PCFG.mR&&d>.01){const f=PCFG.mS*(1-d/PCFG.mR);fx+=dx/d*f;fy+=dy/d*f}}
  p.vel.x=(p.vel.x+fx)*(ex?.96:PCFG.damp); p.vel.y=(p.vel.y+fy)*(ex?.96:PCFG.damp);
  const max=ex?25:15,s=Math.hypot(p.vel.x,p.vel.y); if(s>max){p.vel.x=p.vel.x/s*max;p.vel.y=p.vel.y/s*max}
  p.pos.x+=p.vel.x; p.pos.y+=p.vel.y;
 }
}
function psDraw(){
 const x=PS.ctx; if(!x) return;
 x.clearRect(0,0,PS.W,PS.H); x.strokeStyle=PCFG.color; x.lineWidth=PS.size*2; x.lineCap="round";
 for(const white of [false,true]){x.strokeStyle=white?"#ffffff":PCFG.color;x.beginPath();for(const p of PS.parts){if(p.tg.white!==white)continue;x.moveTo(p.prev.x,p.prev.y);x.lineTo(p.pos.x,p.pos.y)}x.stroke();}
}
function psLoop(now){
 if(!PS.running) return;
 let dt=(now-PS.last)/1000; PS.last=now; if(dt>.05)dt=.05;
 psStep(dt); psDraw(); requestAnimationFrame(psLoop);
}
function psStart(){
 if(RM||!PS.targets.length) return;
 const go=PS.vis&&!document.hidden;
 if(go&&!PS.running){PS.running=true;PS.last=performance.now();requestAnimationFrame(psLoop)}
 if(!go) PS.running=false;
}


const button=document.querySelector('#motion-toggle');
function controlLabel(){const lang=document.documentElement.lang;const text=RM?{vi:'Phát hiệu ứng',en:'Play animation','zh-Hant':'播放動畫'}:{vi:'Tạm dừng hiệu ứng',en:'Pause animation','zh-Hant':'暫停動畫'};button.setAttribute('aria-pressed',String(RM));button.querySelector('.motion-icon').textContent=RM?'▷':'Ⅱ';button.querySelector('[data-t]').textContent=text[lang]||text.vi;}
button.addEventListener('click',()=>{RM=!RM;if(RM)PS.running=false;else psStart();controlLabel()});
document.addEventListener('site-language-change',controlLabel);
document.addEventListener('visibilitychange',psStart);
window.addEventListener('resize',()=>{psResize();psSample()});
psInit();if(PS.img){PS.img.addEventListener('load',()=>document.querySelector('#brand-stage').classList.add('original-ready'));if(PS.img.complete&&PS.img.naturalWidth)document.querySelector('#brand-stage').classList.add('original-ready');}controlLabel();
})();
