// Original procedural pixel artwork. All scene colors are collected in this palette.
const P={sky:'#142833',horizon:'#31434a',mountain:'#263f47',ridge:'#35535a',forest:'#1c363e',near:'#122b32',bridge:'#172b30',stone:'#314349',mortar:'#22363c',rail:'#b3a38a',star:'#abc6c5',moon:'#e5d7af',moonShade:'#b5c4b6',dark:'#182629',black:'#101e22',iron:'#365255',ironLight:'#64817c',brass:'#c79559',gold:'#f1ca85',wood:'#794d3f',woodLight:'#af7853',woodDark:'#453b34',glass:'#476b65',glassLight:'#7da49a',leaf:'#56775b',leafLight:'#a4b878',leafDark:'#344f41',pot:'#ad6952',cream:'#e9d7a5',warm:'#d7ad63',red:'#a25853',rose:'#ce8f85',roseLight:'#edb4a1',water:'#567f82',blue:'#8ba7b4',paper:'#dfc8a4',smoke:'#83908b',dawnSky:'#b5a491',dawnHorizon:'#dfb589',dawnMountain:'#7f9090',dawnRidge:'#647f82'};
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const line=(c,x1,y1,x2,y2,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(Math.round(x1)+.5,Math.round(y1)+.5);c.lineTo(Math.round(x2)+.5,Math.round(y2)+.5);c.stroke();};
function polygon(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(Math.round(x),Math.round(y)):c.moveTo(Math.round(x),Math.round(y)));c.closePath();c.fill();}
function circle(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(Math.round(x),Math.round(y),r,0,Math.PI*2);c.fill();}
const noise=n=>{const a=Math.sin(n*127.1+311.7)*43758.5453;return a-Math.floor(a);};
function wheel(c,x,y,r,t){circle(c,x,y,r+2,P.black);circle(c,x,y,r,P.ironLight);circle(c,x,y,r-2,P.dark);for(let j=0;j<6;j++){const a=t*1.8+j*Math.PI/3;line(c,x,y,x+Math.cos(a)*(r-2),y+Math.sin(a)*(r-2),P.brass);}circle(c,x,y,2,P.gold);}
function plant(c,x,y,h,seed=0){rect(c,x-4,y,9,7,P.pot);rect(c,x-5,y,11,2,P.woodLight);line(c,x,y,x,y-h,P.leafLight);for(let j=0;j<5;j++){const yy=y-h+j*h/5;const side=j%2?1:-1;rect(c,x+(side<0?-7:0),yy,7,3,j%2?P.leaf:P.leafLight);rect(c,x+(side<0?-5:2),yy-2,4,3,P.leaf);}if(seed)rect(c,x-1,y-h-3,3,3,P.cream);}
function chassis(c,t){rect(c,0,79,154,6,P.black);rect(c,2,77,150,3,P.brass);rect(c,4,72,146,5,P.woodDark);rect(c,8,82,138,3,P.iron);for(let x=11;x<148;x+=10)rect(c,x,78,2,1,P.gold);for(const x of [25,41,114,130])wheel(c,x,86,6,t);rect(c,-8,80,10,3,P.ironLight);rect(c,151,80,10,3,P.ironLight);line(c,18,86,47,86,P.ironLight,2);line(c,107,86,137,86,P.ironLight,2);}
function carriage(c,kind,t=0){
  chassis(c,t);
  if(kind==='greenhouse'){
    rect(c,7,31,140,41,P.leafDark);polygon(c,[[4,31],[22,10],[130,10],[150,31]],P.glass);polygon(c,[[10,29],[25,13],[127,13],[143,29]],P.glassLight);
    for(let x=10;x<147;x+=23){rect(c,x,32,19,36,P.glass);rect(c,x+2,34,2,25,P.glassLight);line(c,x,31,x+7,12,P.brass);}
    rect(c,6,29,142,3,P.brass);rect(c,21,9,110,3,P.ironLight);for(let x=9;x<148;x+=23)rect(c,x,30,3,42,P.ironLight);
    rect(c,12,62,128,3,P.woodLight);for(const [x,h] of [[21,18],[41,24],[63,16],[91,28],[119,19],[138,13]])plant(c,x,64,h,x%2);
    for(let x=28;x<127;x+=31){line(c,x,13,x,27,P.woodLight);rect(c,x-4,27,9,4,P.pot);rect(c,x-7,23,14,4,P.leaf);rect(c,x-4,20,9,4,P.leafLight);}
    rect(c,74,35,12,36,P.woodDark);rect(c,76,37,8,25,P.glassLight);line(c,80,37,80,63,P.iron);rect(c,82,56,2,2,P.gold);rect(c,73,69,15,3,P.brass);
    line(c,9,71,145,71,P.gold);for(let j=0;j<7;j++){rect(c,13+j*18,16+Math.sin(j)*3,2,2,P.cream);}
  }else if(kind==='library'){
    rect(c,7,23,140,49,P.wood);rect(c,10,25,134,43,P.woodDark);polygon(c,[[3,23],[10,17],[144,17],[151,23]],P.iron);rect(c,10,16,134,2,P.ironLight);rect(c,8,24,138,2,P.brass);
    for(let x=14;x<140;x+=32){rect(c,x,29,26,34,P.warm);rect(c,x+2,31,22,30,P.woodDark);for(let row=0;row<3;row++){for(let j=0;j<6;j++){const h=5+Math.floor(noise(x+row+j)*4);rect(c,x+3+j*3,39+row*10-h,2,h,[P.red,P.leaf,P.paper,P.blue,P.woodLight][(j+row)%5]);}rect(c,x+2,40+row*10,22,2,P.woodLight);}rect(c,x,27,26,2,P.gold);}
    rect(c,64,40,22,28,P.wood);rect(c,66,42,18,18,P.warm);rect(c,71,43,9,12,P.cream);rect(c,71,57,9,3,P.brass);rect(c,70,63,13,5,P.red);rect(c,68,66,17,3,P.woodLight);
    rect(c,48,59,12,3,P.paper);rect(c,53,62,2,9,P.brass);rect(c,48,71,12,1,P.brass);rect(c,50,56,4,3,P.cream);
    for(let x=11;x<149;x+=32)rect(c,x,26,2,46,P.brass);rect(c,7,70,140,3,P.brass);
    line(c,76,19,76,30,P.brass);polygon(c,[[69,35],[72,29],[80,29],[83,35]],P.gold);rect(c,73,35,6,2,P.cream);
  }else if(kind==='koi'){
    rect(c,7,58,140,14,P.leafDark);rect(c,10,56,135,4,P.leaf);rect(c,10,61,133,7,P.wood);for(let x=14;x<145;x+=9)rect(c,x,62,1,6,P.woodLight);
    polygon(c,[[29,55],[43,48],[108,48],[125,56],[116,63],[44,63]],P.ironLight);polygon(c,[[35,55],[48,50],[105,50],[117,56],[108,61],[47,61]],P.water);
    for(let i=0;i<3;i++){const x=53+i*20+Math.sin(t*.8+i)*6,y=54+(i%2)*3;rect(c,x,y,6,2,P.cream);rect(c,x+2,y,2,2,P.red);rect(c,x-2,y+1,2,1,P.cream);}
    rect(c,24,24,5,33,P.wood);line(c,27,35,43,22,P.wood,3);line(c,25,38,14,22,P.wood,3);
    for(let i=0;i<50;i++){const x=7+noise(i+8)*49,y=9+noise(i+97)*25;if(((x-31)/29)**2+((y-22)/17)**2<1)rect(c,x,y,5+noise(i)*5,4,[P.red,P.rose,P.roseLight][i%3]);}
    for(let j=0;j<8;j++){const yy=26+(t*4+j*7)%32;rect(c,35+j*11+Math.sin(t+j)*3,yy,2,1,P.rose);}
    rect(c,121,35,4,23,P.woodDark);rect(c,117,32,12,10,P.cream);rect(c,116,31,14,2,P.woodDark);polygon(c,[[113,31],[123,25],[133,31]],P.woodDark);line(c,121,33,121,41,P.brass);
    for(let x=9;x<150;x+=17){rect(c,x,63,2,11,P.woodLight);}rect(c,7,65,142,2,P.brass);plant(c,138,52,10);rect(c,79,44,16,4,P.woodLight);rect(c,82,48,2,6,P.wood);rect(c,91,48,2,6,P.wood);
  }else{
    rect(c,8,38,138,34,P.iron);rect(c,11,40,132,29,P.dark);polygon(c,[[25,37],[28,23],[39,12],[54,6],[100,6],[117,16],[126,29],[128,37]],P.ironLight);polygon(c,[[30,36],[34,23],[44,15],[58,10],[99,10],[114,19],[121,31],[122,36]],P.iron);
    for(let x=46;x<118;x+=19)line(c,77,8,x,37,P.glassLight);rect(c,69,7,13,30,P.black);rect(c,69,7,2,30,P.brass);
    for(let x=15;x<141;x+=26){rect(c,x,45,18,20,P.brass);rect(c,x+2,47,14,16,P.glass);rect(c,x+3,48,4,7,P.glassLight);rect(c,x+9,49,3,3,P.cream);}
    line(c,78,60,86,43,P.brass,3);line(c,78,58,67,70,P.brass,2);line(c,78,58,89,70,P.brass,2);polygon(c,[[77,41],[81,49],[108,32],[104,24]],P.blue);line(c,79,41,104,26,P.cream,2);line(c,103,23,109,33,P.brass,3);
    rect(c,9,70,136,3,P.brass);rect(c,136,28,2,12,P.woodLight);line(c,131,33,143,33,P.brass);rect(c,135,25,4,4,P.gold);
  }
}
function engine(c,t){
  rect(c,10,70,132,10,P.woodDark);rect(c,15,66,125,4,P.brass);rect(c,5,74,10,5,P.brass);polygon(c,[[3,78],[18,66],[18,79]],P.ironLight);
  rect(c,26,37,65,29,P.wood);rect(c,25,40,66,5,P.woodLight);rect(c,22,44,6,18,P.brass);rect(c,31,34,49,3,P.brass);rect(c,33,62,56,3,P.woodLight);
  for(let x=34;x<89;x+=17){rect(c,x,37,3,28,P.brass);rect(c,x+1,39,1,20,P.gold);}
  rect(c,33,17,12,20,P.woodDark);rect(c,30,14,18,5,P.brass);rect(c,35,19,7,15,P.wood);rect(c,31,34,16,3,P.gold);rect(c,63,28,13,9,P.brass);rect(c,65,25,9,4,P.gold);
  rect(c,91,21,40,48,P.wood);rect(c,94,27,14,24,P.warm);rect(c,111,27,15,24,P.warm);rect(c,96,29,10,19,P.cream);rect(c,113,29,11,19,P.cream);rect(c,98,43,8,6,P.woodDark);rect(c,115,39,6,10,P.woodDark);rect(c,91,53,39,3,P.brass);
  polygon(c,[[86,21],[91,15],[132,15],[138,21]],P.iron);rect(c,90,14,43,2,P.ironLight);rect(c,131,49,14,20,P.woodDark);rect(c,132,44,13,7,P.dark);for(let j=0;j<5;j++)rect(c,133+j*2,42-noise(j)*4,3,5,P.black);
  wheel(c,38,78,12,t);wheel(c,66,78,12,t);wheel(c,96,78,12,t);wheel(c,125,80,8,t);line(c,38,78+Math.sin(t*1.8)*4,96,78+Math.sin(t*1.8)*4,P.gold,3);
  rect(c,16,44,7,11,P.gold);rect(c,14,46,3,7,P.cream);rect(c,17,42,6,2,P.black);rect(c,135,72,12,4,P.brass);rect(c,145,76,8,3,P.ironLight);
  for(let j=0;j<7;j++){const age=(t*.45+j/7)%1;c.globalAlpha=(1-age)*.3;rect(c,35+age*52,13-age*35,8+age*18,5+age*8,P.smoke);c.globalAlpha=1;}
}
function pine(c,x,y,h,color){rect(c,x-1,y-h,2,h,P.woodDark);for(let j=0;j<4;j++){const yy=y-h+j*h*.2,w=h*(.17+j*.055);polygon(c,[[x,yy],[x-w,yy+h*.35],[x+w,yy+h*.35]],color);}}
export function renderThumbnail(canvas,kind){canvas.width=180;canvas.height=102;const c=canvas.getContext('2d');rect(c,0,0,180,102,P.near);c.save();c.translate(13,3);carriage(c,kind);c.restore();}
export class Scene {
  constructor(canvas,cars,onSelect){
    this.canvas=canvas;this.c=canvas.getContext('2d');this.cars=cars;this.onSelect=onSelect;this.index=0;this.time=0;this.camera=-20;this.target=-20;this.paused=false;this.dawn=false;this.visible=true;this.hovered=false;this.focused=false;this.raf=0;
    this.media=matchMedia('(prefers-reduced-motion: reduce)');this.paused=this.media.matches;
    this.resize=new ResizeObserver(()=>{const b=canvas.getBoundingClientRect();if(b.width===0)return;canvas.width=Math.round(b.width/2);canvas.height=Math.round(b.height/2);this.select(this.cars[this.index].id,true);});this.resize.observe(canvas);
    this.observer=new IntersectionObserver(([entry])=>{this.visible=entry.isIntersecting;this.wake();});this.observer.observe(canvas);
    document.addEventListener('visibilitychange',()=>this.wake());
    canvas.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')this.hovered=true;});canvas.addEventListener('pointerleave',()=>{this.hovered=false;this.wake();});
    canvas.addEventListener('focus',()=>{this.focused=true;});canvas.addEventListener('blur',()=>{this.focused=false;this.wake();});
    canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;this.drag={x:e.clientX,y:e.clientY,camera:this.camera,moved:false};canvas.setPointerCapture(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(!this.drag)return;const dx=e.clientX-this.drag.x;if(Math.abs(dx)>8)this.drag.moved=true;if(this.drag.moved){this.camera=this.clamp(this.drag.camera-dx/2);this.target=this.camera;this.draw();}});
    canvas.addEventListener('pointerup',e=>{if(!this.drag)return;const drag=this.drag;this.drag=null;if(drag.moved){const center=this.camera+canvas.width/2;const index=Math.max(0,Math.min(cars.length-1,Math.round((center-245)/170)));onSelect(cars[index].id);}else{const bounds=canvas.getBoundingClientRect(),x=(e.clientX-bounds.left)/2+this.camera,y=(e.clientY-bounds.top)/2;const index=Math.floor((x-168)/170);if(index>=0&&index<cars.length&&y>canvas.height*.75-95&&y<canvas.height*.75+4)onSelect(cars[index].id);}this.wake();});
    canvas.addEventListener('pointercancel',()=>{this.drag=null;this.wake();});
    this.frame=this.frame.bind(this);this.wake();
  }
  clamp(value){return Math.max(-35,Math.min(170*this.cars.length+170-this.canvas.width+35,value));}
  select(id,instant=false){this.index=Math.max(0,this.cars.findIndex(c=>c.id===id));this.target=this.clamp(245+this.index*170-this.canvas.width/2);if(instant||this.media.matches)this.camera=this.target;this.draw();this.wake();}
  setPaused(value){this.paused=value;this.wake();}
  setDawn(value){this.dawn=value;this.draw();this.wake();}
  running(){return !this.paused&&!this.media.matches&&!this.hovered&&!this.focused&&this.visible&&!document.hidden;}
  wake(){if(!this.raf&&this.visible&&!document.hidden)this.raf=requestAnimationFrame(this.frame);}
  frame(now){this.raf=0;const dt=Math.min((now-(this.last||now))/1000,.04);this.last=now;const moving=Math.abs(this.target-this.camera)>.1;if(moving){this.camera+=(this.target-this.camera)*.14;if(this.media.matches)this.camera=this.target;}if(this.running())this.time+=dt;this.draw();if(this.running()||moving)this.wake();}
  draw(){
    const c=this.c,w=this.canvas.width,h=this.canvas.height;if(!w||!h)return;const t=this.time,cam=this.camera,g=Math.round(h*.75),p=this.dawn?{sky:P.dawnSky,horizon:P.dawnHorizon,mountain:P.dawnMountain,ridge:P.dawnRidge}:{sky:P.sky,horizon:P.horizon,mountain:P.mountain,ridge:P.ridge};c.imageSmoothingEnabled=false;
    rect(c,0,0,w,h,p.sky);for(let j=0;j<12;j++){c.globalAlpha=j/20;rect(c,0,h*.17+j*h*.045,w,h*.05,p.horizon);}c.globalAlpha=1;
    if(!this.dawn)for(let j=0;j<95;j++){const x=((noise(j+12)*1400-cam*.05)%w+w)%w,y=10+noise(j+300)*h*.5;c.globalAlpha=.3+noise(j+40)*.6;rect(c,x,y,j%13===0?2:1,1,P.star);if(j%23===0)rect(c,x,y-1,1,3,P.star);}c.globalAlpha=1;
    const mx=w*.75-cam*.025,my=h*.22;circle(c,mx,my,15,this.dawn?P.gold:P.moon);rect(c,mx-8,my-6,5,3,P.moonShade);rect(c,mx+3,my+4,4,5,P.moonShade);rect(c,mx-4,my+9,4,2,P.moonShade);
    for(let layer=0;layer<3;layer++){const points=[[0,h]],offset=cam*(.05+layer*.04)+t*(.4+layer*.3);for(let x=-15;x<w+15;x+=8){const u=x+offset;const y=g-43+layer*20-Math.abs(Math.sin(u*.008+layer*4))*35-Math.abs(Math.sin(u*.023+layer))*16;points.push([x,y]);}points.push([w,h]);polygon(c,points,[p.mountain,p.ridge,P.forest][layer]);}
    for(let j=0;j<35;j++){const x=((j*31-t*2-cam*.25)%(w+60)+w+60)%(w+60)-30;pine(c,x,g+3,18+noise(j)*30,P.near);}
    // Stone railway viaduct: arches are cut visually into the distant valley.
    rect(c,0,g+4,w,h-g,P.bridge);rect(c,0,g+5,w,4,P.stone);
    const shift=(t*10+cam*.7)%72;for(let x=-72-shift;x<w+72;x+=72){rect(c,x+12,g+22,46,h-g,P.near);polygon(c,[[x+12,g+24],[x+18,g+16],[x+26,g+12],[x+44,g+12],[x+52,g+16],[x+58,g+24]],P.near);line(c,x+10,g+24,x+10,h,P.stone);line(c,x+60,g+24,x+60,h,P.stone);for(let y=g+13;y<h;y+=8){line(c,x,y,x+10,y,P.mortar);line(c,x+60,y,x+72,y,P.mortar);}}
    for(let x=-12-(t*18)%13;x<w;x+=13)rect(c,x,g+2,9,2,P.woodLight);rect(c,0,g,w,2,P.rail);rect(c,0,g+4,w,1,P.ironLight);
    c.save();c.translate(Math.round(-cam),g-91);engine(c,t);c.restore();
    this.cars.forEach((car,i)=>{const x=168+i*170-cam;if(x<-165||x>w+5)return;c.save();c.translate(Math.round(x),g-91);carriage(c,car.id,t);c.restore();if(i===this.index){rect(c,x+45,g+12,64,1,P.brass);rect(c,x+75,g+10,4,4,P.gold);}});
    // Fireflies and little foreground leaves, kept below the carriage silhouettes.
    for(let j=0;j<11;j++){c.globalAlpha=.3+.3*Math.sin(t+j);rect(c,((noise(j+88)*w+t*(j%2?1:-1))%w+w)%w,g-5-noise(j+100)*30,1,1,P.gold);}c.globalAlpha=1;
  }
}
