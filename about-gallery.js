(()=>{
 const gallery=document.querySelector('#about .about-gallery');
 if(!gallery)return;
 const phone=matchMedia('(max-width:680px)'),motion=matchMedia('(prefers-reduced-motion: reduce)');
 const originals=[...new Map([...gallery.querySelectorAll('.gallery-sequence:not([aria-hidden="true"]) img')].map(img=>[img.getAttribute('src'),img.cloneNode(true)])).values()];
 let started=false,ready=false,near=false,generation=0;
 const update=()=>gallery.classList.toggle('gallery-running',ready&&near&&!document.hidden&&!motion.matches);
 async function prepare(){
  if(started)return;
  started=true;const current=generation;
  const pictures=[...gallery.querySelectorAll('img')];
  pictures.forEach(img=>{img.loading='eager';});
  await Promise.all(pictures.map(async img=>{
   try{await img.decode();}
   catch{if(!img.complete)await new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});});}
  }));
  if(current!==generation)return;
  ready=true;update();
 }
 function layout(){
  generation++;started=false;ready=false;gallery.classList.remove('gallery-running');
  const columns=phone.matches?2:4,fragment=document.createDocumentFragment();
  for(let i=0;i<columns;i++){
   const column=document.createElement('div');column.className='gallery-column';
   const track=document.createElement('div');track.className='gallery-track';
   const sequence=document.createElement('div');sequence.className='gallery-sequence';
   const subset=originals.filter((_,index)=>index%columns===i);
   subset.forEach(img=>sequence.append(img.cloneNode(true)));
   const repeat=sequence.cloneNode(true);repeat.setAttribute('aria-hidden','true');
   repeat.querySelectorAll('img').forEach(img=>img.alt='');
   track.style.setProperty('--gallery-duration',`${subset.length*6}s`);
   track.append(sequence,repeat);column.append(track);fragment.append(column);
  }
  gallery.replaceChildren(fragment);
  if(near)prepare();
 }
 layout();phone.addEventListener('change',layout);
 if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{near=entries[0].isIntersecting;if(near)prepare();update();},{rootMargin:'180px 0px'}).observe(gallery);
 }else{near=true;prepare();}
 document.addEventListener('visibilitychange',update);
 motion.addEventListener('change',update);
})();
