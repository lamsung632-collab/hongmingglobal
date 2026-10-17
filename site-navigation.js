(()=>{
'use strict';
const connection=navigator.connection;
if(connection?.saveData||/^(slow-2g|2g)$/.test(connection?.effectiveType||''))return;
const allowed=new Set(['index.html','green-power-shield.html','mes-iot.html','r-optimizer.html','rfid.html','ems.html','smb.html','mes.html','about.html']);
const warmed=new Set();let timer;
function warm(anchor){
 if(!anchor||document.hidden||anchor.hasAttribute('download')||anchor.target==='_blank')return;
 const url=new URL(anchor.href,location.href);
 if(url.origin!==location.origin||url.search)return;
 const page=(url.pathname.split('/').pop()||'index').replace(/\.html$/,'')+'.html';
 const current=(location.pathname.split('/').pop()||'index').replace(/\.html$/,'')+'.html';
 if(!allowed.has(page)||page===current||warmed.has(page))return;
 warmed.add(page);url.hash='';
 const link=document.createElement('link');link.rel='prefetch';link.as='document';link.href=url.href;document.head.append(link);
}
document.addEventListener('pointerover',e=>{const a=e.target.closest?.('a[href]');clearTimeout(timer);if(a)timer=setTimeout(()=>warm(a),90)},{passive:true});
document.addEventListener('pointerout',()=>clearTimeout(timer),{passive:true});
document.addEventListener('focusin',e=>warm(e.target.closest?.('a[href]')));
document.addEventListener('pointerdown',e=>warm(e.target.closest?.('a[href]')),{passive:true});
})();

// Close the mobile menu on navigation; reveal deep links inside collapsed sections.
(()=>{
 const nav=document.querySelector('header nav'),menu=document.querySelector('.menu');
 function close(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
 document.addEventListener('click',event=>{if(event.target.closest?.('nav a[href]'))close();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
 function reveal(hash,scroll){
  if(!hash||hash==='#')return;
  let target;try{target=document.getElementById(decodeURIComponent(hash.slice(1)));}catch{return;}
  if(!target)return;
  let parent=target.parentElement,opened=false;
  while(parent){if(parent.tagName==='DETAILS'&&!parent.open){parent.open=true;opened=true;}parent=parent.parentElement;}
  if(opened&&scroll)requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));
 }
 document.addEventListener('click',event=>{const a=event.target.closest?.('a[href]');if(!a)return;const u=new URL(a.href,location.href);if(u.origin===location.origin&&u.pathname===location.pathname)reveal(u.hash,false);});
 addEventListener('hashchange',()=>reveal(location.hash,true));reveal(location.hash,true);
})();
