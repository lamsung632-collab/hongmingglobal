(()=>{
'use strict';const boxes=[...document.querySelectorAll('.mes-slideshow')];
function initialize(box){
const viewport=box.querySelector('.mes-slides'),images=[...viewport.querySelectorAll('img')],motion=matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.querySelector('#service-autoplay');if(images.length<2)return;
const track=document.createElement('span');track.className='mes-filmstrip';images.forEach(im=>{im.loading='eager';im.decoding='async';track.append(im)});const clone=images[0].cloneNode(true);clone.alt='';clone.setAttribute('aria-hidden','true');track.append(clone);viewport.append(track);box.classList.add('mes-smooth');track.style.width=((images.length+1)*100)+'%';track.style.setProperty('--mes-loop-end',(-100*images.length/(images.length+1))+'%');track.style.setProperty('--mes-loop-duration',(images.length*5)+'s');[...track.children].forEach(im=>im.style.flexBasis=(100/(images.length+1))+'%');
let visible=false,ready=false;function sync(){track.style.animationPlayState=ready&&visible&&!document.hidden&&!motion.matches&&(!toggle||toggle.getAttribute('aria-pressed')==='true')?'running':'paused'}
document.addEventListener('visibilitychange',sync);motion.addEventListener?.('change',sync);if(toggle)new MutationObserver(sync).observe(toggle,{attributes:true,attributeFilter:['aria-pressed']});if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.1}).observe(box);else visible=true;
Promise.allSettled([...track.children].map(im=>im.decode?im.decode():Promise.resolve())).then(()=>{ready=true;box.classList.add('mes-continuous');sync()});sync();
}
if('IntersectionObserver'in window){const loader=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){loader.unobserve(entry.target);initialize(entry.target)}})},{rootMargin:'250px'});boxes.forEach(box=>loader.observe(box));}else boxes.forEach(initialize);
})();
