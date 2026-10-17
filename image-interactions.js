(()=>{
  'use strict';
  const isImage=target=>target instanceof Element&&target.closest('img,.intro-value-photo');
  document.addEventListener('contextmenu',event=>{if(isImage(event.target))event.preventDefault();},true);
  document.addEventListener('dragstart',event=>{if(isImage(event.target))event.preventDefault();},true);
})();
