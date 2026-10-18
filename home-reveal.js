(()=>{
'use strict';
if(!('IntersectionObserver'in window))return;
const groups=['.home-story-row','#process .process-step-card','#process .process-note','#industries .industry-list article','#esg .esg-services article','#knowledge .knowledge-grid details','#knowledge .compact-faq details'];
const items=[];groups.forEach(selector=>document.querySelectorAll(selector).forEach((el,i)=>{el.dataset.homeReveal='';el.style.setProperty('--home-reveal-delay',Math.min(i%3,2)*80+'ms');items.push(el)}));
const motion=window.hongMingMotion;let observer;
function setup(){observer?.disconnect();document.body.classList.remove('home-reveal-active');if(motion.matches)return;
 observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('is-revealed');else if(entry.boundingClientRect.top>innerHeight)entry.target.classList.remove('is-revealed')}),{threshold:.12,rootMargin:'0px 0px -30px 0px'});
 items.forEach(el=>{el.classList.toggle('is-revealed',el.getBoundingClientRect().top<innerHeight*.9);observer.observe(el)});document.body.classList.add('home-reveal-active');}
 document.addEventListener('focusin',e=>e.target.closest('[data-home-reveal]')?.classList.add('is-revealed'));
 motion.addEventListener?.('change',setup);setup();
})();
