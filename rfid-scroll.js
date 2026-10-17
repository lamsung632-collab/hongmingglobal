(()=>{
'use strict';
const grid=document.querySelector('#rfid-gallery .rfid-screens');
if(!grid)return;
const cards=[...grid.children],motion=matchMedia('(prefers-reduced-motion: reduce)');
let frame=0,last=0;
const values=cards.map(()=>1),clamp=n=>Math.max(0,Math.min(1,n));
function render(time){
 frame=0;
 if(document.hidden||motion.matches){grid.classList.remove('rfid-scroll-ready');return;}
 const rect=grid.getBoundingClientRect(),height=window.innerHeight;
 const blend=1-Math.exp(-Math.min(time-last||16,50)/70);last=time;
 let moving=false;
 // offsetTop is the layout position, independent of the animated transform.
 cards.forEach((card,i)=>{
  let target=clamp((height*.92-rect.top-card.offsetTop)/(height*.65));
  if(card.contains(document.activeElement))target=1;
  values[i]+= (target-values[i])*blend;
  if(Math.abs(target-values[i])<.001)values[i]=target;else moving=true;
  const ease=values[i]*values[i]*(3-2*values[i]),rest=1-ease;
  const spread=innerWidth<=760?0:(i%2===0?1:-1)*110;
  card.style.setProperty('--rfid-x',(spread*rest).toFixed(2)+'px');
  card.style.setProperty('--rfid-y',(110*rest).toFixed(2)+'px');
  card.style.setProperty('--rfid-scale',(1-.38*rest).toFixed(4));
  card.style.setProperty('--rfid-opacity',(1-.92*rest).toFixed(4));
 });
 grid.classList.add('rfid-scroll-ready');
 if(moving)frame=requestAnimationFrame(render);
}
function update(){if(!frame){last=0;frame=requestAnimationFrame(render);}}
window.addEventListener('scroll',update,{passive:true});
window.addEventListener('resize',update,{passive:true});
grid.addEventListener('focusin',update);grid.addEventListener('focusout',update);
document.addEventListener('visibilitychange',update);
motion.addEventListener?.('change',update);
if('ResizeObserver'in window)new ResizeObserver(update).observe(grid);
window.addEventListener('pageshow',update);update();
})();
