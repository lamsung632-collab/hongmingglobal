(()=>{
'use strict';
const page=document.querySelector('.ems-page'),items=[...document.querySelectorAll('[data-ems-reveal]')];
if(!page||!('IntersectionObserver'in window))return;
const media=window.hongMingMotion;let observer;
function setup(){
 observer?.disconnect();page.classList.remove('ems-motion');
 if(media.matches)return;
 observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{
  if(entry.isIntersecting)entry.target.classList.add('is-visible');
  else if(entry.boundingClientRect.top>innerHeight)entry.target.classList.remove('is-visible');
 })},{threshold:.12,rootMargin:'0px 0px -35px 0px'});
 items.forEach(el=>{el.classList.toggle('is-visible',el.getBoundingClientRect().top<innerHeight*.88);observer.observe(el)});
 page.classList.add('ems-motion');
}
media.addEventListener?.('change',setup);setup();
})();
