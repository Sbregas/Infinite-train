import {getIllustration} from './illustrations.js';

export function setupDetailViewer(getSelected){
  const $=id=>document.getElementById(id),dialog=$('detail-viewer'),viewport=$('detail-viewport'),image=$('detail-image');
  let scale=1,minScale=.2,drag;
  function resize(next){
    const oldWidth=image.getBoundingClientRect().width||1;
    const centerX=(viewport.scrollLeft+viewport.clientWidth/2)/oldWidth;
    const centerY=(viewport.scrollTop+viewport.clientHeight/2)/oldWidth;
    scale=Math.max(minScale,Math.min(2,next));
    image.style.width=`${Math.round(image.naturalWidth*scale)}px`;
    $('detail-scale').textContent=`${Math.round(scale*100)}%`;
    $('detail-smaller').disabled=scale<=minScale;
    $('detail-larger').disabled=scale>=2;
    const width=image.getBoundingClientRect().width;
    viewport.scrollLeft=centerX*width-viewport.clientWidth/2;
    viewport.scrollTop=centerY*width-viewport.clientHeight/2;
  }
  $('inspect-car').addEventListener('click',async()=>{
    const car=getSelected(),art=getIllustration(car.id);if(!art)return;
    $('detail-title').textContent=car.name;image.alt=car.description;image.src=art.image.src;
    await image.decode();
    dialog.showModal();minScale=Math.min(1,(viewport.clientWidth-32)/image.naturalWidth);
    resize(Math.max(minScale,.5));viewport.scrollLeft=(viewport.scrollWidth-viewport.clientWidth)/2;viewport.scrollTop=0;
  });
  $('detail-close').addEventListener('click',()=>dialog.close());
  $('detail-larger').addEventListener('click',()=>resize(scale*1.4));
  $('detail-smaller').addEventListener('click',()=>resize(scale/1.4));
  $('detail-fit').addEventListener('click',()=>resize(minScale));
  viewport.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(e.pointerId);});
  viewport.addEventListener('pointermove',e=>{if(!drag)return;viewport.scrollLeft=drag.left+drag.x-e.clientX;viewport.scrollTop=drag.top+drag.y-e.clientY;});
  for(const type of ['pointerup','pointercancel'])viewport.addEventListener(type,()=>{drag=null;});
  window.addEventListener('resize',()=>{if(dialog.open){minScale=Math.min(1,(viewport.clientWidth-32)/image.naturalWidth);resize(scale);}});
}
