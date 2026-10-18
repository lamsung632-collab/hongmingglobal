(()=>{
 'use strict';
 const logo=document.querySelector('.footer-logo-motion');if(!logo)return;
 const stage=logo.querySelector('.footer-mark-stage'),image=stage.querySelector('img'),canvas=stage.querySelector('canvas');
 const ctx=canvas.getContext('2d');if(!ctx)return;
 let particles=[],width=190,height=120,visible=false,ready=false,frame=0,last=0,painted=0,phase='gather',elapsed=0,particleSize=1,padLeft=0,padRight=0,padTop=120,padBottom=0;
 function resize(){
  const rect=stage.getBoundingClientRect();width=rect.width;height=rect.height;
  if(!width||!height||!image.naturalWidth)return;
  padLeft=Math.max(0,Math.min(180,rect.left));padRight=Math.max(0,Math.min(220,document.documentElement.clientWidth-rect.right));
  padBottom=Math.max(0,Math.min(100,document.documentElement.scrollHeight-(rect.bottom+scrollY)));
  const cw=width+padLeft+padRight,ch=height+padTop+padBottom;
  canvas.style.left=`${-padLeft}px`;canvas.style.top=`${-padTop}px`;canvas.style.width=`${cw}px`;canvas.style.height=`${ch}px`;
  const ratio=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(cw*ratio);canvas.height=Math.round(ch*ratio);ctx.setTransform(ratio,0,0,ratio,padLeft*ratio,padTop*ratio);
  const sample=document.createElement('canvas');sample.width=Math.ceil(width*.85);sample.height=Math.round(sample.width*image.naturalHeight/image.naturalWidth);
  const sc=sample.getContext('2d',{willReadFrequently:true});if(!sc)return;
  sc.drawImage(image,0,0,sample.width,sample.height);
  let data;try{data=sc.getImageData(0,0,sample.width,sample.height).data;}catch{return;}
  const dw=width*.85,dh=dw*sample.height/sample.width,targets=[];
  particleSize=dw/sample.width;
  for(let y=0;y<sample.height;y++)for(let x=0;x<sample.width;x++){
   if(data[(y*sample.width+x)*4+3]>60){
    const tx=width/2+((x+.5)/sample.width-.5)*dw,ty=height/2+((y+.5)/sample.height-.5)*dh;
    const i=(y*sample.width+x)*4,color=`rgb(${data[i]},${data[i+1]},${data[i+2]})`;
    targets.push({tx,ty,color,x:width/2+Math.cos(Math.random()*Math.PI*2)*(50+Math.random()*150),y:height/2+Math.sin(Math.random()*Math.PI*2)*(40+Math.random()*100),vx:0,vy:0});
   }
  }
  logo.dataset.particleCount=String(targets.length);logo.dataset.particleSize=particleSize.toFixed(2);
  particles=targets;phase='gather';elapsed=0;ready=particles.length>0;
  if(ready){draw();logo.classList.add('is-ready');sync();}
 }
 function draw(){
  ctx.clearRect(-padLeft,-padTop,width+padLeft+padRight,height+padTop+padBottom);
  const size=particleSize+0.08,half=size/2;
  for(const p of particles){ctx.fillStyle=p.color;ctx.fillRect(p.x-half,p.y-half,size,size);}
 }
 function loop(now){
  frame=0;if(!visible||document.hidden||!ready)return;
  if(now-painted<1000/30){frame=requestAnimationFrame(loop);return;}
  const dt=Math.min((now-last)/1000,.08);last=now;painted=now;elapsed+=dt;
  if(phase==='gather'&&elapsed>=1.7){phase='hold';elapsed=0;}
  else if(phase==='hold'&&elapsed>=4){
   phase='explode';elapsed=0;
   particles.forEach(p=>{const angle=Math.atan2(p.ty-height/2,p.tx-width/2)+(Math.random()-.5)*2.8,speed=40+Math.random()*110;p.vx=Math.cos(angle)*speed;p.vy=Math.sin(angle)*speed;});
  }else if(phase==='explode'&&elapsed>=1.3){phase='gather';elapsed=0;}
  if(logo.dataset.motionPhase!==phase)logo.dataset.motionPhase=phase;
  const ease=1-Math.exp(-dt*5);
  for(const p of particles){
   if(phase==='explode'){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-dt*.8);p.vy*=Math.exp(-dt*.8);}
   else{p.x+=(p.tx-p.x)*ease;p.y+=(p.ty-p.y)*ease;}
  }
  draw();frame=requestAnimationFrame(loop);
 }
 function sync(){
  const running=ready&&visible&&!document.hidden;logo.dataset.motionState=running?'running':'paused';
  if(running&&!frame){last=performance.now();painted=last;frame=requestAnimationFrame(loop);}
  else if(!running&&frame){cancelAnimationFrame(frame);frame=0;}
 }
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.08}).observe(stage);
 else visible=true;
 image.addEventListener('load',resize,{once:true});if(image.complete&&image.naturalWidth)resize();
 document.addEventListener('visibilitychange',sync);
 if('ResizeObserver'in window)new ResizeObserver(resize).observe(stage);else addEventListener('resize',resize,{passive:true});
})();
