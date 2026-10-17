(() => {
  'use strict';
  const groups = [...document.querySelectorAll('.nav-group')];
  groups.forEach(group => group.addEventListener('toggle', () => {
    if (group.open) groups.forEach(other => { if (other !== group) other.open = false; });
  }));
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-group')) groups.forEach(group => group.open = false);
    if (event.target.closest('nav a')) groups.forEach(group => group.open = false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') groups.forEach(group => {if(group.open){group.open=false;group.querySelector('summary').focus();}});
  });
  const library=document.querySelector('#solution-library');
  function openHash(hash){if(!hash||hash==='#')return;let target;try{target=document.querySelector(hash)}catch{return}if(target&&target.closest('#solution-library'))library.open=true;}
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(a)openHash(a.hash);});
  window.addEventListener('hashchange',()=>openHash(location.hash));openHash(location.hash);
  const revealTargets=document.querySelectorAll('.section-heading,.energy-layout,.digital-grid,.project-card,.leader-section,.benefit-card,.services-heading,.service-rail,.about-gallery,.home-heading,.home-actions');
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}}),{threshold:.08});revealTargets.forEach((el,i)=>{el.classList.add('scroll-reveal');el.style.setProperty('--reveal-delay',(i%3)*65+'ms');io.observe(el)});}
  const rail=document.querySelector('.service-rail');
  if(rail&&!rail.classList.contains('services-grid')){
    const cards=[...rail.querySelectorAll('.service-card')];
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const toggle=document.querySelector('#service-autoplay');
    let enabled=!reduced.matches, direction=1, timer=0, hovering=false, focused=false, touching=false, visible=false;
    const words={vi:['Tạm dừng','Tự chạy','Giải pháp trước','Giải pháp tiếp theo'],en:['Pause','Auto play','Previous solutions','Next solutions'],'zh-Hant':['暫停','自動播放','上一個解決方案','下一個解決方案']};
    function labels(){const w=words[document.documentElement.lang]||words.vi;toggle.innerHTML=(enabled?'Ⅱ ':'▶ ')+'<span>'+(enabled?w[0]:w[1])+'</span>';toggle.setAttribute('aria-pressed',String(enabled));toggle.setAttribute('aria-label',enabled?w[0]:w[1]);document.querySelector('[data-service-direction="-1"]').setAttribute('aria-label',w[2]);document.querySelector('[data-service-direction="1"]').setAttribute('aria-label',w[3]);}
    function step(){return cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:rail.clientWidth;}
    function advance(dir){const max=rail.scrollWidth-rail.clientWidth;const target=Math.max(0,Math.min(max,Math.round(rail.scrollLeft/step())*step()+dir*step()));rail.scrollTo({left:target,behavior:reduced.matches?'auto':'smooth'});}
    function schedule(){clearTimeout(timer);if(enabled&&visible&&!document.hidden&&!hovering&&!focused&&!touching){timer=setTimeout(()=>{const max=rail.scrollWidth-rail.clientWidth;if(rail.scrollLeft>=max-3)direction=-1;else if(rail.scrollLeft<=3)direction=1;advance(direction);schedule();},4500);}}
    document.querySelectorAll('[data-service-direction]').forEach(b=>b.addEventListener('click',()=>{direction=Number(b.dataset.serviceDirection);advance(direction);schedule();}));
    toggle.addEventListener('click',()=>{enabled=!enabled;labels();schedule();});
    rail.addEventListener('mouseenter',()=>{hovering=true;schedule();});rail.addEventListener('mouseleave',()=>{hovering=false;schedule();});
    rail.addEventListener('focusin',()=>{focused=true;schedule();});rail.addEventListener('focusout',e=>{focused=rail.contains(e.relatedTarget);schedule();});
    rail.addEventListener('pointerdown',()=>{touching=true;schedule();});window.addEventListener('pointerup',()=>{touching=false;schedule();});window.addEventListener('pointercancel',()=>{touching=false;schedule();});
    document.addEventListener('visibilitychange',schedule);document.addEventListener('site-language-change',labels);
    reduced.addEventListener?.('change',()=>{if(reduced.matches)enabled=false;labels();schedule();});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(rail);
    else{visible=true;schedule();}labels();
  }
  const top=document.querySelector('#back-top');if(top){window.addEventListener('scroll',()=>top.classList.toggle('visible',scrollY>600),{passive:true});}
})();
