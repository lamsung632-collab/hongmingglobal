(()=>{
 'use strict';
 const header=document.querySelector('.home-header'),nav=header?.querySelector('nav'),menu=header?.querySelector('.menu');
 if(!nav||!menu)return;
 const compact=matchMedia('(max-width:1024px)');
 nav.id=nav.id||'primary-navigation';
 menu.setAttribute('aria-controls',nav.id);
 const labels={vi:['Mở menu','Đóng menu'],en:['Open menu','Close menu'],'zh-Hant':['開啟選單','關閉選單']};
 function sync(){
  const open=compact.matches&&nav.classList.contains('open');
  document.body.classList.toggle('mobile-nav-open',open);
  menu.setAttribute('aria-expanded',String(open));
  const words=labels[document.documentElement.lang]||labels.vi;
  menu.setAttribute('aria-label',words[open?1:0]);
  menu.textContent=open?'×':'☰';
 }
 function close(){nav.classList.remove('open');sync();}
 // Existing page scripts own the menu toggle; observe its resulting state.
 menu.addEventListener('click',()=>queueMicrotask(sync));
 document.addEventListener('click',e=>{
  if(e.target.closest('nav a[href]')||(!header.contains(e.target)&&nav.classList.contains('open')))close();
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&(nav.classList.contains('open')||document.body.classList.contains('mobile-nav-open'))){close();menu.focus();}
 });
 nav.addEventListener('toggle',e=>{
  if(!compact.matches||!e.target.matches('details.nav-group')||!e.target.open)return;
  nav.querySelectorAll('details.nav-group[open]').forEach(group=>{if(group!==e.target)group.open=false;});
 },true);
 compact.addEventListener('change',close);
 document.addEventListener('site-language-change',sync);
 header.querySelector('#lang')?.addEventListener('change',()=>queueMicrotask(sync));
 sync();
})();
