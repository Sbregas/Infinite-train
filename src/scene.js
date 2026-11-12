import {drawCarriage,drawThumbnail} from './artwork.js';
// Procedural landscape behind the illustrated train. Scene colors live here.
const P={sky:'#142833',horizon:'#31434a',mountain:'#263f47',ridge:'#35535a',forest:'#1c363e',near:'#122b32',bridge:'#172b30',stone:'#314349',mortar:'#22363c',rail:'#b3a38a',star:'#abc6c5',moon:'#e5d7af',moonShade:'#b5c4b6',dark:'#182629',black:'#101e22',iron:'#365255',ironLight:'#64817c',brass:'#c79559',gold:'#f1ca85',wood:'#794d3f',woodLight:'#af7853',woodDark:'#453b34',glass:'#476b65',glassLight:'#7da49a',leaf:'#56775b',leafLight:'#a4b878',leafDark:'#344f41',pot:'#ad6952',cream:'#e9d7a5',warm:'#d7ad63',red:'#a25853',rose:'#ce8f85',roseLight:'#edb4a1',water:'#567f82',blue:'#8ba7b4',paper:'#dfc8a4',smoke:'#83908b',dawnSky:'#b5a491',dawnHorizon:'#dfb589',dawnMountain:'#7f9090',dawnRidge:'#647f82'};
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const line=(c,x1,y1,x2,y2,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(Math.round(x1)+.5,Math.round(y1)+.5);c.lineTo(Math.round(x2)+.5,Math.round(y2)+.5);c.stroke();};
function polygon(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fill();}
function circle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(Math.round(x),Math.round(y),r,0,Math.PI*2);c.fill();}
const noise=n=>{const a=Math.sin(n*127.1+311.7)*43758.5453;return a-Math.floor(a);};
function pine(c,x,y,h,color){rect(c,x-1,y-h,2,h,P.woodDark);for(let j=0;j<4;j++){const yy=y-h+j*h*.2,w=h*(.17+j*.055);polygon(c,[[x,yy],[x-w,yy+h*.35],[x+w,yy+h*.35]],color);}}
export const renderThumbnail=drawThumbnail;
export class Scene {
  constructor(canvas,cars,onSelect){
    this.canvas=canvas;this.c=canvas.getContext('2d');this.cars=cars;this.onSelect=onSelect;this.index=0;this.time=0;this.camera=-20;this.target=-20;this.paused=false;this.dawn=false;this.visible=true;this.hovered=false;this.focused=false;this.raf=0;this.zoom=1;this.scale=2;this.worldWidth=150;this.worldHeight=75;this.pixelRatio=1;
    this.media=matchMedia('(prefers-reduced-motion: reduce)');this.paused=this.media.matches;
    this.resize=new ResizeObserver(()=>this.resizeSurface());this.resize.observe(canvas);
    window.addEventListener('resize',()=>this.resizeSurface());
    this.observer=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;this.wake();});this.observer.observe(canvas);
    document.addEventListener('visibilitychange',()=>this.wake());
    canvas.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')this.hovered=true;});canvas.addEventListener('pointerleave',()=>{this.hovered=false;this.wake();});
    canvas.addEventListener('focus',()=>{this.focused=true;});canvas.addEventListener('blur',()=>{this.focused=false;this.wake();});
    canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;this.drag={x:e.clientX,y:e.clientY,camera:this.camera,moved:false};canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(!this.drag)return;const dx=e.clientX-this.drag.x;if(Math.abs(dx)>8)this.drag.moved=true;if(this.drag.moved){this.camera=this.clamp(this.drag.camera-dx/this.scale);this.target=this.camera;this.draw();}});
    canvas.addEventListener('pointerup',e=>{if(!this.drag)return;const drag=this.drag;this.drag=null;if(drag.moved){const center=this.camera+this.worldWidth/2;let index=Math.max(0,Math.min(cars.length-1,Math.round((center-245)/170)));if(this.zoom===1&&index===this.index&&Math.abs(e.clientX-drag.x)>70)index=Math.max(0,Math.min(cars.length-1,index+(e.clientX<drag.x?1:-1)));if(this.zoom===1||index!==this.index)onSelect(cars[index].id);}else{const bounds=canvas.getBoundingClientRect(),x=(e.clientX-bounds.left)/this.scale+this.camera,y=(e.clientY-bounds.top)/this.scale;const index=Math.floor((x-168)/170);if(index>=0&&index<cars.length&&y>this.ground()-95&&y<this.ground()+4)onSelect(cars[index].id);}this.wake();});
    canvas.addEventListener('pointercancel',()=>{this.drag=null;this.wake();});
    this.frame=this.frame.bind(this);this.wake();
  }
  resizeSurface(){
    const b=this.canvas.getBoundingClientRect();if(!b.width||!b.height)return;
    this.pixelRatio=Math.min(window.devicePixelRatio||1,3);
    this.canvas.width=Math.round(b.width*this.pixelRatio);this.canvas.height=Math.round(b.height*this.pixelRatio);
    this.scale=(b.width>700?3.2:2)*this.zoom;this.worldWidth=b.width/this.scale;this.worldHeight=b.height/this.scale;
    this.select(this.cars[this.index].id,true);
  }
  ground(){return Math.round(this.worldHeight*(this.zoom>1?.84:.75));}
  setZoom(detail){this.zoom=detail?1.8:1;this.canvas.closest('.scene-wrap').classList.toggle('detail-view',detail);this.resizeSurface();}
  clamp(value){return Math.max(-35,Math.min(170*this.cars.length+170-this.worldWidth+35,value));}
  select(id,instant=false){this.index=Math.max(0,this.cars.findIndex(c=>c.id===id));this.target=this.clamp(245+this.index*170-this.worldWidth/2);if(instant||this.media.matches)this.camera=this.target;this.draw();this.wake();}
  setPaused(value){this.paused=value;this.wake();}
  setDawn(value){this.dawn=value;this.draw();this.wake();}
  running(){return !this.paused&&!this.media.matches&&!this.hovered&&!this.focused&&this.visible&&!document.hidden;}
  wake(){if(!this.raf&&this.visible&&!document.hidden)this.raf=requestAnimationFrame(this.frame);}
  frame(now){this.raf=0;const dt=Math.min((now-(this.last||now))/1000,.04);this.last=now;const moving=Math.abs(this.target-this.camera)>.1;if(moving){this.camera+=(this.target-this.camera)*.14;if(this.media.matches)this.camera=this.target;}if(this.running())this.time+=dt;this.draw();if(this.running()||moving)this.wake();}
  draw(){
    const c=this.c,w=this.worldWidth,h=this.worldHeight;if(!w||!h)return;const t=this.time,cam=this.camera,g=this.ground(),p=this.dawn?{sky:P.dawnSky,horizon:P.dawnHorizon,mountain:P.dawnMountain,ridge:P.dawnRidge}:{sky:P.sky,horizon:P.horizon,mountain:P.mountain,ridge:P.ridge};c.setTransform(this.canvas.width/w,0,0,this.canvas.height/h,0,0);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    rect(c,0,0,w,h,p.sky);for(let j=0;j<12;j++){c.globalAlpha=j/20;rect(c,0,h*.17+j*h*.045,w,h*.05,p.horizon);}c.globalAlpha=1;
    if(!this.dawn)for(let j=0;j<95;j++){const x=((noise(j+12)*1400-cam*.05)%w+w)%w,y=10+noise(j+300)*h*.5;c.globalAlpha=.3+noise(j+40)*.6;rect(c,x,y,j%13===0?2:1,1,P.star);if(j%23===0)rect(c,x,y-1,1,3,P.star);}c.globalAlpha=1;
    const mx=w*.75-cam*.025,my=h*.22;circle(c,mx,my,15,this.dawn?P.gold:P.moon);rect(c,mx-8,my-6,5,3,P.moonShade);rect(c,mx+3,my+4,4,5,P.moonShade);rect(c,mx-4,my+9,4,2,P.moonShade);
    for(let layer=0;layer<3;layer++){const points=[[0,h]],offset=cam*(.05+layer*.04)+t*(.4+layer*.3);for(let x=-15;x<w+15;x+=8){const u=x+offset;const y=g-43+layer*20-Math.abs(Math.sin(u*.008+layer*4))*35-Math.abs(Math.sin(u*.023+layer))*16;points.push([x,y]);}points.push([w,h]);polygon(c,points,[p.mountain,p.ridge,P.forest][layer]);}
    for(let j=0;j<35;j++){const x=((j*31-t*2-cam*.25)%(w+60)+w+60)%(w+60)-30;pine(c,x,g+3,18+noise(j)*30,P.near);}
    // Stone railway viaduct: arches are cut visually into the distant valley.
    rect(c,0,g+4,w,h-g,P.bridge);rect(c,0,g+5,w,4,P.stone);
    const shift=(t*10+cam*.7)%72;for(let x=-72-shift;x<w+72;x+=72){rect(c,x+12,g+22,46,h-g,P.near);polygon(c,[[x+12,g+24],[x+18,g+16],[x+26,g+12],[x+44,g+12],[x+52,g+16],[x+58,g+24]],P.near);line(c,x+10,g+24,x+10,h,P.stone);line(c,x+60,g+24,x+60,h,P.stone);for(let y=g+13;y<h;y+=8){line(c,x,y,x+10,y,P.mortar);line(c,x+60,y,x+72,y,P.mortar);}}
    for(let x=-12-(t*18)%13;x<w;x+=13)rect(c,x,g+2,9,2,P.woodLight);rect(c,0,g,w,2,P.rail);rect(c,0,g+4,w,1,P.ironLight);
    // Draw the connecting drawbars behind the transparent carriage sprites.
    for(let i=0;i<this.cars.length;i++){const left=(i===0?154:152+i*170)-cam,right=168+i*170-cam;line(c,left,g-10,right,g-10,P.black,4);line(c,left,g-10,right,g-10,P.brass,1);}
    c.save();c.translate(Math.round(-cam),g-91);drawCarriage(c,'engine',t);
    for(let j=0;j<9;j++){const age=(t*.4+j/9)%1;c.globalAlpha=(1-age)*.22;circle(c,38+age*57,11-age*29,3+age*6,P.smoke);c.globalAlpha=1;}c.restore();
    this.cars.forEach((car,i)=>{const x=168+i*170-cam;if(x<-165||x>w+5)return;c.save();c.translate(Math.round(x),g-91);drawCarriage(c,car.id,t);c.restore();if(i===this.index&&this.zoom===1){rect(c,x+45,g+12,64,1,P.brass);rect(c,x+75,g+10,4,4,P.gold);}});
    // Fireflies and little foreground leaves, kept below the carriage silhouettes.
    for(let j=0;j<11;j++){c.globalAlpha=.3+.3*Math.sin(t+j);rect(c,((noise(j+88)*w+t*(j%2?1:-1))%w+w)%w,g-5-noise(j+100)*30,1,1,P.gold);}c.globalAlpha=1;
  }
}
