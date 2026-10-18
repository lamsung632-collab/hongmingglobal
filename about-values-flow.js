(()=>{
  'use strict';
  const flow=document.querySelector('.intro-value-flow');
  if(!flow)return;
  const media=window.hongMingMotion;
  const rows=[...flow.querySelectorAll('.intro-story')].map((row,index)=>({row,index,photo:row.querySelector('figure'),copy:row.querySelector(':scope > div'),value:1,target:1}));
  let frame=0,progress=1,targetProgress=1;
  const clamp=v=>Math.min(1,Math.max(0,v));
  function measure(){
    const height=innerHeight;
    for(const item of rows){
      const rect=item.row.getBoundingClientRect();
      item.target=media.matches?1:clamp((height*.94-rect.top)/(Math.min(rect.height,height)*.85));
    }
    const rect=flow.getBoundingClientRect();
    targetProgress=media.matches?1:clamp((height*.66-rect.top)/rect.height);
    if(!frame)frame=requestAnimationFrame(paint);
  }
  function paint(){
    let moving=false;
    for(const item of rows){
      item.value=media.matches?1:item.value+(item.target-item.value)*.18;
      if(Math.abs(item.target-item.value)>.002)moving=true;else item.value=item.target;
      const p=item.value*item.value*(3-2*item.value),hidden=1-p;
      const side=item.index%2===0?-1:1;
      item.photo.style.transform=`translate(${side*hidden*125}px,${hidden*65}px) scale(${1-hidden*.28}) rotate(${side*hidden*3}deg)`;
      item.photo.style.opacity=String(.2+.8*p);
      item.copy.style.transform=`translate(${-side*hidden*90}px,${hidden*50}px) scale(${1-hidden*.12})`;
      item.copy.style.opacity=String(.15+.85*p);
      item.row.classList.toggle('flow-reached',p>.8);
    }
    progress+=(targetProgress-progress)*.18;
    if(Math.abs(targetProgress-progress)>.002)moving=true;else progress=targetProgress;
    flow.style.setProperty('--flow-progress',progress);
    frame=moving?requestAnimationFrame(paint):0;
  }
  document.documentElement.classList.add('values-flow-enabled');
  addEventListener('scroll',measure,{passive:true});
  addEventListener('resize',measure,{passive:true});
  media.addEventListener('change',measure);
  if('ResizeObserver' in window)new ResizeObserver(measure).observe(flow);
  measure();
})();
