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

/* Shared scroll-linked connectors, matching the About page's blue value timeline. */
(()=>{
 'use strict';
 if(document.querySelector('[data-hm-linked-flow]'))return;
 const configs=[];
 function wrap(selector,itemSelector,mode){
  document.querySelectorAll(selector).forEach(section=>{
   const items=[...section.children].filter(el=>el.matches(itemSelector));
   if(items.length<2)return;
   const group=document.createElement('div');
   section.insertBefore(group,items[0]);
   items.forEach(item=>group.append(item));
   configs.push({group,items,mode});
  });
 }
 wrap('#mes-solution,#ems-applications','.ems-story','stories');
 wrap('.mes-cases','.mes-case','side');
 wrap('.gps-projects','.gps-case','side');
 document.querySelectorAll('.ems-timeline,.rfid-problems,.mes-steps,#process .process-grid').forEach(group=>{
  const items=[...group.children].filter(el=>el.matches('article'));
  if(items.length<2)return;
  const mode=group.matches('.ems-timeline')?'timeline':group.matches('.rfid-problems')?'side':group.matches('.mes-steps')?'steps':'process';
  configs.push({group,items,mode});
 });
 if(!configs.length)return;
 const style=document.createElement('style');
 style.dataset.hmLinkedFlow='';
 style.textContent=`
 .hm-linked-flow{position:relative;--hm-line-x:50%;--hm-flow-progress:0;isolation:isolate}
 .hm-linked-flow>.hm-flow-rail{position:absolute;left:var(--hm-line-x);width:3px;margin-left:-1.5px;border-radius:4px;background:#d9edf7;pointer-events:none;z-index:0;overflow:visible}
 .hm-linked-flow>.hm-flow-rail>i{display:block;position:absolute;inset:0;border-radius:4px;background:linear-gradient(180deg,#1c74ef,#00c5ed);transform:scaleY(var(--hm-flow-progress));transform-origin:top;box-shadow:0 0 10px #00b8e75c;transition:transform .16s linear}
 .hm-linked-flow>.hm-flow-node{position:absolute;left:var(--hm-line-x);width:14px;height:14px;margin:-7px 0 0 -7px;border:3px solid #fff;box-sizing:border-box;border-radius:50%;background:#bcd8e9;box-shadow:0 0 0 3px #e4f2f8;pointer-events:none;z-index:3;transition:background .25s,box-shadow .25s}
 .hm-linked-flow>.hm-flow-node.hm-reached{background:#00b8e7;box-shadow:0 0 0 4px #d9f5fc,0 0 15px #00b8e780}
 .hm-linked-flow.hm-near>.hm-flow-node.hm-current{animation:hm-flow-glow 2.4s ease-in-out infinite}
 @keyframes hm-flow-glow{50%{box-shadow:0 0 0 6px #d9f5fcaa,0 0 20px #00b8e7aa}}
 .hm-linked-flow>.hm-flow-row{position:relative;min-width:0;z-index:1}
 .hm-flow-stories>.ems-story{gap:64px}
 .hm-flow-stories>.ems-story .ems-number{color:#00a7ce}
 .hm-flow-side{--hm-line-x:8px;padding-left:34px}
 .hm-flow-side>.hm-flow-row{margin-left:0}
 .hm-flow-side.rfid-problems article>span{color:#00a7ce}
 .hm-flow-timeline:before,.hm-flow-timeline>article:after,#process .hm-flow-process:before,#process .hm-flow-process>article:after{display:none}
 .hm-flow-timeline .ems-step{color:#009dc4}
 .hm-flow-steps.mes-steps{display:flex;flex-direction:column;gap:24px;max-width:980px;padding:12px 0}
 .hm-flow-steps.mes-steps>article{width:calc(50% - 32px);margin:0;min-height:0;box-sizing:border-box;padding:26px;border:1px solid #dfeaf0;background:linear-gradient(130deg,#f3f8fb,#fff);box-shadow:0 6px 20px #21365608;transition:border-color .3s,box-shadow .3s}
 .hm-flow-steps.mes-steps>article:nth-of-type(even){align-self:flex-end}
 .hm-flow-steps.mes-steps>article>span{color:#00a7ce;margin-bottom:16px}
 .hm-flow-steps.mes-steps>article.hm-reached{border-color:#c7e8f3;box-shadow:0 7px 24px #008db00c}
 .hm-flow-steps.mes-steps h3{font-size:22px}
 #process .hm-flow-process .step-number{color:#009dc4}
 @media(max-width:760px){
  .hm-flow-stories{--hm-line-x:8px;padding-left:32px}
  .hm-flow-stories>.ems-story{grid-template-columns:minmax(0,1fr);gap:20px}
  .hm-flow-stories>.ems-story:nth-of-type(even) .ems-story-image{order:0}
  .hm-flow-side{padding-left:28px}
  .hm-flow-timeline{--hm-line-x:8px}
  .hm-flow-timeline.ems-timeline>article,.hm-flow-timeline.ems-timeline>article:nth-child(even){margin-left:0;width:100%;padding:0 0 28px 38px;box-sizing:border-box}
  .hm-flow-timeline .ems-step,.hm-flow-timeline article:nth-child(even) .ems-step{left:19px;right:auto;font-size:9px}
  .hm-flow-steps.mes-steps{--hm-line-x:8px;padding:8px 0 8px 32px;gap:20px}
  .hm-flow-steps.mes-steps>article{width:100%;padding:22px 20px;align-self:stretch}
  .hm-flow-steps.mes-steps h3{font-size:21px}
  .hm-flow-steps.mes-steps p{font-size:15px}
 }
 @media(max-width:680px){#process .hm-flow-process{--hm-line-x:15px}}
 `;
 document.head.append(style);
 const groups=configs.map(({group,items,mode})=>{
  group.classList.add('hm-linked-flow','hm-flow-'+mode);
  group.dataset.hmFlowCount=String(items.length);
  const rail=document.createElement('span');rail.className='hm-flow-rail';rail.setAttribute('aria-hidden','true');rail.append(document.createElement('i'));
  const nodes=items.map(item=>{
   item.classList.add('hm-flow-row');
   const node=document.createElement('span');node.className='hm-flow-node';node.setAttribute('aria-hidden','true');return node;
  });
  group.append(rail,...nodes);
  return {group,items,mode,rail,nodes,ys:[],start:0,length:1};
 });
 function relativeTop(el,ancestor){let y=0;for(let at=el;at&&at!==ancestor;at=at.offsetParent)y+=at.offsetTop;return y;}
 function layout(){
  for(const g of groups){
   if(!g.group.offsetHeight)continue;
   g.ys=g.items.map(item=>{
    const top=relativeTop(item,g.group);
    if(g.mode==='timeline')return top+27;
    if(g.mode==='side')return top+Math.min(50,item.offsetHeight/2);
    if(g.mode==='process')return top+(innerWidth<=680?39:Math.max(20,(item.offsetHeight-24)/2));
    return top+Math.min(g.mode==='stories'?item.offsetHeight/2:48,item.offsetHeight/2);
   });
   g.start=Math.max(0,relativeTop(g.items[0],g.group));
   g.length=Math.max(1,g.ys[g.ys.length-1]-g.start+24);
   g.rail.style.top=g.start+'px';g.rail.style.height=g.length+'px';
   g.nodes.forEach((node,i)=>node.style.top=g.ys[i]+'px');
  }
 }
 let frame=0,dirty=true;
 function update(){
  frame=0;if(document.hidden)return;
  if(dirty){layout();dirty=false;}
  const cursor=innerHeight*.66;
  const measurements=groups.map(g=>({g,rect:g.group.getBoundingClientRect()}));
  for(const {g,rect} of measurements){
   const near=rect.height>0&&rect.bottom>0&&rect.top<innerHeight;
   g.group.classList.toggle('hm-near',near);
   if(!rect.height)continue;
   const p=Math.max(0,Math.min(1,(cursor-rect.top-g.start)/g.length));
   g.group.style.setProperty('--hm-flow-progress',String(p));
   let current=-1;
   g.ys.forEach((y,i)=>{if(y<=cursor-rect.top)current=i;});
   g.nodes.forEach((node,i)=>{const reached=i<=current;node.classList.toggle('hm-reached',reached);node.classList.toggle('hm-current',i===current);g.items[i].classList.toggle('hm-reached',reached);});
  }
 }
 function schedule(resize=false){dirty=dirty||resize;if(!frame)frame=requestAnimationFrame(update);}
 addEventListener('scroll',()=>schedule(),{passive:true});
 addEventListener('resize',()=>schedule(true),{passive:true});
 document.addEventListener('visibilitychange',()=>schedule(true));
 document.addEventListener('site-language-change',()=>schedule(true));
 document.addEventListener('toggle',()=>schedule(true),true);
 if('ResizeObserver'in window){const observer=new ResizeObserver(()=>schedule(true));groups.forEach(g=>{observer.observe(g.group);g.items.forEach(item=>observer.observe(item));});}
 if(document.fonts)document.fonts.ready.then(()=>schedule(true));
 schedule(true);
})();
