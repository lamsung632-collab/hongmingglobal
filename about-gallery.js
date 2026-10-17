(()=>{
  const gallery=document.querySelector('#about .about-gallery');
  if(!gallery)return;
  let started=false,ready=false,near=false;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>gallery.classList.toggle('gallery-running',ready&&near&&!document.hidden&&!motion.matches);
  async function prepare(){
    if(started)return;
    started=true;
    const pictures=[...gallery.querySelectorAll('img')];
    // Reverse tracks begin far below the viewport: load both complete sequences
    // before moving them, rather than waiting for native lazy-load visibility.
    pictures.forEach(img=>{img.loading='eager';});
    await Promise.all(pictures.map(async img=>{
      try {await img.decode();}
      catch {if(!img.complete)await new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});});}
    }));
    ready=true;update();
  }
  if('IntersectionObserver' in window){
    new IntersectionObserver(entries=>{
      near=entries[0].isIntersecting;
      if(near)prepare();
      update();
    },{rootMargin:'180px 0px'}).observe(gallery);
  }else{near=true;prepare();}
  document.addEventListener('visibilitychange',update);
  motion.addEventListener('change',update);
})();
