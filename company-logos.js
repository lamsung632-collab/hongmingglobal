(()=>{
'use strict';
const rows=[...document.querySelectorAll('.company-logo-row')],motion=window.hongMingMotion;
rows.forEach(row=>{
 const track=row.querySelector('.company-logo-track'),sequence=track.firstElementChild,originals=[...sequence.children];let visible=false,width=0;
 function sync(){track.style.animationPlayState=visible&&!document.hidden&&!motion.matches?'running':'paused';}
 function build(){
  const next=row.clientWidth;if(!next||next===width)return;width=next;
  row.classList.remove('is-animated');track.querySelectorAll('[data-logo-clone]').forEach(el=>el.remove());sequence.querySelectorAll('[data-logo-repeat]').forEach(el=>el.remove());
  // Make a complete sequence at least as wide as its viewport before duplicating it.
  const repeats=Math.max(1,Math.ceil(next/Math.max(sequence.scrollWidth,1)));
  for(let n=1;n<repeats;n++)originals.forEach(el=>{const clone=el.cloneNode(true);clone.dataset.logoRepeat='';clone.setAttribute('aria-hidden','true');sequence.append(clone)});
  const clone=sequence.cloneNode(true);clone.dataset.logoClone='';clone.setAttribute('aria-hidden','true');track.append(clone);
  track.style.setProperty('--logo-duration',Math.max(25,sequence.scrollWidth/32)+'s');row.classList.add('is-animated');sync();
 }
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)build();sync();},{rootMargin:'150px'}).observe(row);else{visible=true;build()}
 if('ResizeObserver'in window)new ResizeObserver(()=>{if(visible)build()}).observe(row);else window.addEventListener('resize',build,{passive:true});
 document.addEventListener('visibilitychange',sync);motion.addEventListener?.('change',sync);
});
})();
