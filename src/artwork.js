import {getIllustration} from './illustrations.js';
// Procedural fallback, used while the full-resolution illustrations load.
const C = {
  void:'#122328', shadow:'#213235', metal:'#354e50', steel:'#718d88', edge:'#a5b5a2',
  gold:'#d6ab69', light:'#f7d797', copper:'#9b6247', brass:'#bc885a', rust:'#5e4437',
  wood:'#79523d', grain:'#a67b51', darkwood:'#433b30', cream:'#e7d5ad', paper:'#b8ac88',
  red:'#9c5750', rose:'#d69587', blush:'#eec1a4', blue:'#7998a6', teal:'#446963',
  moss:'#3d5b42', leaf:'#759769', lime:'#b8c58a', green:'#506f4f', jade:'#93b29b',
  glass:'#3a605c', reflection:'#bdd1b3', water:'#3f7077', ripple:'#80aaa1', white:'#f0e2c1'
};
const cache=new Map();
const random=n=>{const v=Math.sin(n*127.1+21.7)*43758.5453;return v-Math.floor(v);};
function r(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function path(c,points,color,width=1,close=false){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(close)c.closePath();if(width){c.strokeStyle=color;c.lineWidth=width;c.stroke();}else{c.fillStyle=color;c.fill();}}
function oval(c,x,y,rx,ry,color,angle=0){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,angle,0,Math.PI*2);c.fill();}
function ring(c,x,y,radius,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,radius,0,Math.PI*2);c.stroke();}
function rivet(c,x,y){oval(c,x,y,2,2,C.shadow);r(c,x-1,y-1,2,1,C.light);}
function panel(c,x,y,w,h,color){r(c,x,y,w,h,C.shadow);r(c,x+2,y+2,w-4,h-4,color);r(c,x+3,y+2,w-6,1,C.brass);r(c,x+2,y+h-4,w-4,2,C.darkwood);}
function wood(c,x,y,w,h){r(c,x,y,w,h,C.wood);for(let yy=y+2;yy<y+h;yy+=6){path(c,[[x,yy],[x+w*.4,yy+1],[x+w,yy]],yy%3?C.grain:C.darkwood,1);}for(let xx=x+7;xx<x+w;xx+=33){r(c,xx,y,1,h,C.darkwood);r(c,xx+1,y,1,h,C.brass);}}
function leaf(c,x,y,angle,length,color){c.save();c.translate(x,y);c.rotate(angle);path(c,[[0,0],[length*.28,-length*.28],[length*.8,-length*.2],[length,0],[length*.6,length*.17],[0,0]],color,0,true);path(c,[[1,0],[length*.8,0]],C.jade,.7);c.restore();}
function fern(c,x,y,height,seed){path(c,[[x,y],[x-2,y-height*.6],[x+3,y-height]],C.lime,1.5);for(let i=0;i<9;i++){const yy=y-height+i*height/10,len=9+Math.sin(i/9*Math.PI)*12;leaf(c,x,yy,-.65,len,C.leaf);leaf(c,x,yy,Math.PI+.6,len*.9,C.green);}for(let i=0;i<4;i++){const angle=-Math.PI/2+(i-1.5)*.45,dx=Math.cos(angle)*height*.5,dy=Math.sin(angle)*height*.55;path(c,[[x,y],[x+dx,y+dy]],C.green,1);leaf(c,x+dx,y+dy,angle,10,C.lime);}pot(c,x,y,18+seed%5,18);}
function pot(c,x,y,w,h){path(c,[[x-w/2,y],[x+w/2,y],[x+w*.35,y+h],[x-w*.35,y+h]],C.copper,0,true);r(c,x-w/2-2,y,w+4,4,C.brass);r(c,x-w*.3,y+5,2,h-7,C.rose);path(c,[[x-w*.35,y+h],[x+w*.35,y+h]],C.rust,2);}
function bush(c,x,y,h,seed){for(let i=0;i<18;i++){const angle=random(i+seed)*6.28,xx=x+Math.cos(angle)*h*.3,yy=y-h*.4-random(i+seed+40)*h*.6;path(c,[[x,y],[xx,yy]],C.green,1.2);leaf(c,xx,yy,angle,h*.16+3,[C.leaf,C.lime,C.green,C.jade][i%4]);}pot(c,x,y,25,20);}
function lamp(c,x,y){path(c,[[x,y-24],[x,y]],C.brass,2);path(c,[[x-13,y+14],[x-7,y],[x+7,y],[x+13,y+14]],C.brass,0,true);r(c,x-10,y+14,20,2,C.light);oval(c,x,y+17,4,2,C.white);}
function base(c){
  wood(c,18,288,580,22);r(c,8,310,600,10,C.gold);r(c,6,320,604,9,C.shadow);r(c,18,330,580,6,C.metal);
  r(c,34,336,540,5,C.void);for(let x=24;x<602;x+=22)rivet(c,x,315);
  for(const x of [69,425]){panel(c,x,329,118,10,C.steel);for(let i=0;i<4;i++)path(c,[[x+8,340+i*2],[x+52,344+i*2],[x+106,340+i*2]],C.brass,1);}
  for(const x of [214,284,354]){r(c,x,332,29,15,C.metal);r(c,x+2,334,25,2,C.steel);r(c,x+3,346,23,2,C.void);}
  r(c,-21,320,28,7,C.steel);r(c,609,320,28,7,C.steel);r(c,-20,319,10,2,C.edge);r(c,626,319,9,2,C.edge);
}
function greenhouse(c){
  r(c,30,121,556,165,C.shadow);r(c,36,127,544,152,C.glass);
  // Receding tiled floor and back brick wall establish interior depth.
  r(c,36,247,544,36,C.darkwood);for(let y=248;y<284;y+=7)path(c,[[36,y],[580,y]],C.grain,1);for(let x=40;x<580;x+=25)path(c,[[310,215],[x,284]],C.rust,1);
  for(let y=211;y<247;y+=10){for(let x=38+(y%20?0:12);x<572;x+=28){panel(c,x,y,25,8,C.teal);}}
  // Glasshouse roof with glass slats, braced rafters and condensation.
  path(c,[[18,121],[90,40],[516,40],[598,121]],C.metal,0,true);path(c,[[31,115],[94,47],[513,47],[582,115]],C.glass,0,true);
  for(let x=51;x<578;x+=31){const apex=95+(x-51)*.79;path(c,[[x,115],[apex,47]],C.jade,2);path(c,[[x+3,112],[apex+3,50]],C.teal,1);}
  path(c,[[60,83],[548,83]],C.steel,2);r(c,87,37,432,6,C.steel);r(c,83,43,440,3,C.edge);
  for(let i=0;i<150;i++){const x=40+random(i)*530,y=49+random(i+340)*62;if(x>90-(y-47)*.8&&x<516+(y-47)*.8)r(c,x,y,1,i%4?1:3,i%2?C.jade:C.teal);}
  // Workbench: seed packets, tiny tools, pots, watering can.
  wood(c,49,244,222,8);r(c,61,252,5,31,C.brass);r(c,249,252,5,31,C.brass);r(c,65,272,182,3,C.wood);
  for(let i=0;i<6;i++){pot(c,81+i*26,254,15,16);r(c,77+i*26,259,7,4,C.cream);}r(c,226,232,17,12,C.steel);ring(c,248,237,7,C.edge,2);path(c,[[226,235],[216,228],[212,228]],C.steel,3);
  fern(c,72,233,68,1);bush(c,142,232,79,90);fern(c,222,233,58,3);
  bush(c,391,263,106,130);fern(c,471,262,108,4);bush(c,548,264,63,16);
  for(const [x,y] of [[154,91],[278,77],[426,88]]){path(c,[[x,51],[x-10,y],[x+10,y],[x,51]],C.brass,1);pot(c,x,y,26,17);for(let i=0;i<7;i++){const xx=x-14+i*5,yy=y-7-random(i+x)*15;leaf(c,xx,yy,-.4,13,C.leaf);path(c,[[xx,y],[xx+Math.sin(i)*9,y+20+i*3]],C.green,1);for(let j=0;j<3;j++)leaf(c,xx+Math.sin(i)*9,y+j*8,.8+i,7,C.lime);}}
  // Door, inset handle, glazing and outside structural mullions.
  panel(c,288,135,54,148,C.wood);r(c,295,143,40,109,C.glass);path(c,[[315,144],[315,249]],C.brass,2);r(c,295,194,40,2,C.brass);r(c,330,215,3,9,C.gold);r(c,329,214,6,2,C.light);r(c,290,276,50,8,C.brass);
  for(let x=37;x<586;x+=91){r(c,x,122,6,161,C.steel);r(c,x,122,2,160,C.edge);for(let y=130;y<282;y+=36)rivet(c,x+3,y);}
  r(c,25,119,570,7,C.brass);r(c,27,126,566,2,C.light);r(c,28,282,563,5,C.brass);
  // Restrained transparent diagonal reflections, clipped to the glass.
  c.save();c.beginPath();c.rect(37,130,544,147);c.clip();c.globalAlpha=.11;for(let x=50;x<600;x+=185){path(c,[[x,130],[x+18,130],[x-41,277],[x-60,277]],C.reflection,0,true);}c.restore();
  for(let x=54;x<563;x+=34){path(c,[[x,127],[x+17,130],[x+34,127]],C.rust,1);oval(c,x+17,131,2,3,C.light);}
}
function bookcase(c,x,y,w,h,seed){
  panel(c,x,y,w,h,C.grain);r(c,x+5,y+5,w-10,h-10,C.darkwood);
  for(let shelf=0;shelf<4;shelf++){const bottom=y+32+shelf*31;let xx=x+8;let n=0;while(xx<x+w-10){const bw=4+Math.floor(random(n+seed+shelf)*5),bh=14+random(n+seed+8)*13;const col=[C.red,C.blue,C.paper,C.green,C.copper,C.cream][(n+shelf)%6];r(c,xx,bottom-bh,bw,bh,col);r(c,xx+1,bottom-bh+2,bw-2,1,C.gold);r(c,xx+1,bottom-4,bw-2,1,C.gold);r(c,xx+bw-1,bottom-bh,1,bh,C.shadow);xx+=bw+1;n++;}r(c,x+4,bottom+1,w-8,4,C.grain);r(c,x+5,bottom+5,w-10,2,C.shadow);}
  r(c,x+2,y+4,2,h-8,C.brass);r(c,x+w-4,y+4,2,h-8,C.brass);
}
function library(c){
  r(c,28,90,560,197,C.darkwood);r(c,35,98,546,181,C.wood);
  for(let x=39;x<579;x+=15)r(c,x,98,1,160,C.grain);
  path(c,[[14,91],[39,67],[573,67],[601,91]],C.metal,0,true);path(c,[[30,83],[44,71],[568,71],[585,83]],C.steel,0,true);
  for(let x=49;x<575;x+=19)path(c,[[x,72],[x+10,83]],C.metal,1);r(c,28,90,558,6,C.gold);r(c,32,96,550,3,C.rust);
  wood(c,36,259,544,26);for(let x=44;x<577;x+=43)path(c,[[x,260],[x-9,284]],C.shadow,1);
  bookcase(c,48,109,111,143,13);bookcase(c,171,109,104,143,38);bookcase(c,365,109,98,143,71);bookcase(c,476,109,93,143,95);
  // Center window, drapes, arched brass frame and moonlit glass.
  panel(c,285,110,70,115,C.brass);r(c,291,117,58,101,C.teal);path(c,[[320,119],[320,218]],C.gold,2);r(c,292,163,56,2,C.brass);oval(c,333,136,8,8,C.cream);r(c,288,118,8,88,C.red);r(c,344,118,8,88,C.red);for(let xx=289;xx<351;xx+=3){if(xx<298||xx>341)r(c,xx,120,1,83,C.rose);}
  // Persian runner with a miniature woven border.
  path(c,[[215,266],[404,266],[427,283],[199,283]],C.red,0,true);path(c,[[227,270],[393,270],[407,280],[212,280]],C.brass,1);for(let x=223;x<401;x+=10){r(c,x,274,2,2,C.paper);r(c,x+2,272,2,2,C.paper);}
  // Reading chair, turned legs, quilted back and open book.
  panel(c,291,222,54,47,C.red);r(c,284,241,10,27,C.copper);r(c,343,241,10,27,C.copper);r(c,292,260,54,8,C.brass);r(c,290,266,5,14,C.darkwood);r(c,344,266,5,14,C.darkwood);for(let i=0;i<4;i++)for(let j=0;j<3;j++)r(c,301+i*11,231+j*9,2,2,C.brass);
  path(c,[[301,242],[316,244],[318,256],[304,253]],C.white,0,true);path(c,[[316,244],[334,240],[331,252],[318,256]],C.cream,0,true);for(let i=0;i<3;i++)path(c,[[305,245+i*2],[313,247+i*2]],C.paper,.6);
  wood(c,230,239,46,5);r(c,250,244,3,30,C.brass);r(c,239,274,25,2,C.brass);r(c,235,232,8,7,C.cream);ring(c,246,235,3,C.cream,1);r(c,257,234,13,4,C.red);r(c,259,231,10,3,C.paper);
  // Rolling ladder and ornamental lamp.
  path(c,[[174,147],[155,278]],C.gold,3);path(c,[[191,147],[172,278]],C.gold,3);for(let j=0;j<10;j++)path(c,[[172-j*1.7,157+j*12],[189-j*1.7,157+j*12]],C.brass,2);oval(c,156,279,3,3,C.shadow);oval(c,173,279,3,3,C.shadow);
  lamp(c,319,113);path(c,[[319,92],[319,113]],C.brass,2);lamp(c,81,113);lamp(c,536,113);
  for(let x=35;x<585;x+=130){r(c,x,98,5,187,C.brass);for(let y=106;y<281;y+=38)rivet(c,x+2,y);}r(c,29,282,558,5,C.gold);
}
function koi(c){
  r(c,29,225,558,62,C.darkwood);wood(c,29,247,558,39);r(c,34,222,550,25,C.moss);
  for(let i=0;i<160;i++){const x=40+random(i)*530,y=222+random(i+11)*23;r(c,x,y,2,2,[C.leaf,C.green,C.lime][i%3]);}
  const pond=[[139,223],[166,201],[207,191],[391,190],[432,204],[473,228],[445,250],[202,254],[154,241]];
  path(c,pond,C.steel,0,true);path(c,[[157,223],[179,207],[215,200],[388,200],[424,213],[455,229],[433,241],[205,245],[172,236]],C.water,0,true);
  for(let i=0;i<37;i++){const x=155+random(i+35)*300,y=205+random(i+70)*36;path(c,[[x,y],[x+6+random(i)*13,y]],i%2?C.teal:C.ripple,1);}
  for(let i=0;i<24;i++){const angle=i/24*Math.PI*2,x=305+Math.cos(angle)*159,y=223+Math.sin(angle)*27;oval(c,x,y,8+random(i)*6,4+random(i+1)*3,i%3?C.steel:C.edge,random(i)*.3);path(c,[[x-5,y-1],[x+3,y-2]],C.cream,1);}
  for(const [x,y,a] of [[221,220,-.3],[321,235,.3],[389,218,-.4]]){c.save();c.translate(x,y);c.rotate(a);oval(c,0,0,13,4,C.white);path(c,[[-10,0],[-19,-5],[-17,0],[-19,5]],C.cream,0,true);oval(c,-2,0,4,3,C.red);oval(c,8,-1,2,2,C.copper);r(c,11,-1,1,1,C.shadow);c.restore();}
  oval(c,191,226,9,4,C.leaf);path(c,[[191,226],[200,224]],C.water,1);oval(c,413,227,7,3,C.leaf);oval(c,411,225,3,2,C.rose);
  // Twisted maple trunk with branching silhouette and many individual leaf clusters.
  path(c,[[98,228],[103,190],[92,139],[106,92]],C.wood,13);path(c,[[102,188],[139,143],[165,120]],C.wood,7);path(c,[[99,162],[71,126],[57,110]],C.wood,6);path(c,[[98,145],[123,116],[121,91]],C.wood,5);path(c,[[104,191],[108,216]],C.grain,2);
  for(let i=0;i<340;i++){const a=random(i+80)*Math.PI*2,rad=Math.sqrt(random(i+200)),x=111+Math.cos(a)*91*rad,y=92+Math.sin(a)*49*rad;const col=[C.red,C.rose,C.blush,C.copper][i%4];path(c,[[x,y-3],[x+2,y-1],[x+5,y-2],[x+3,y+1],[x+4,y+4],[x,y+2],[x-3,y+4],[x-2,y],[x-4,y-2]],col,0,true);}
  // Stone lantern, wooden deck and a small tea bench.
  r(c,491,172,12,59,C.rust);r(c,484,228,26,5,C.steel);panel(c,479,132,36,39,C.brass);r(c,484,137,26,27,C.light);r(c,495,137,2,27,C.wood);r(c,484,149,26,2,C.wood);
  path(c,[[469,134],[477,130],[489,116],[503,116],[516,129],[526,134]],C.metal,0,true);path(c,[[474,131],[521,131]],C.edge,2);r(c,491,109,10,7,C.steel);
  wood(c,326,175,57,8);r(c,331,183,5,19,C.wood);r(c,373,183,5,19,C.wood);oval(c,354,172,8,3,C.cream);r(c,352,165,6,7,C.copper);ring(c,360,168,3,C.copper,1);
  fern(c,548,223,59,2);bush(c,59,229,37,52);
  for(let x=33;x<587;x+=38){r(c,x,255,4,39,C.brass);r(c,x-1,252,6,3,C.gold);}r(c,29,263,557,4,C.brass);r(c,29,267,557,1,C.light);
}
function observatory(c){
  r(c,30,150,556,136,C.metal);r(c,37,157,542,121,C.shadow);
  // Copper dome panels with tapered highlight strips and a real open slit.
  const dome=[[96,148],[103,115],[128,75],[167,44],[213,28],[390,28],[443,48],[481,86],[503,123],[510,148]];
  path(c,dome,C.steel,0,true);path(c,[[104,144],[112,115],[137,79],[174,51],[215,35],[388,35],[435,54],[473,91],[495,125],[501,144]],C.teal,0,true);
  for(let i=0;i<9;i++){const x=130+i*43;path(c,[[299,34],[x*.6+120,76],[x,144]],C.jade,2);path(c,[[301,35],[x*.6+123,77],[x+3,144]],C.metal,1);}
  path(c,[[108,119],[498,119]],C.metal,2);path(c,[[133,81],[465,81]],C.steel,1);r(c,277,30,52,117,C.void);r(c,275,29,4,120,C.gold);r(c,328,29,4,120,C.brass);
  for(let i=0;i<26;i++)r(c,282+random(i)*41,38+random(i+1)*103,1,1,C.cream);
  r(c,91,146,424,8,C.brass);r(c,95,151,416,2,C.light);
  wood(c,37,266,542,18);for(let x=43;x<540;x+=89){panel(c,x,177,66,71,C.brass);r(c,x+6,183,54,59,C.glass);r(c,x+31,183,2,59,C.gold);r(c,x+6,211,54,2,C.gold);r(c,x+9,185,2,54,C.jade);}
  // Brass telescope with bands, focus wheel, finderscope and tripod.
  path(c,[[312,236],[279,278]],C.brass,5);path(c,[[312,236],[351,278]],C.brass,5);path(c,[[312,236],[314,279]],C.steel,3);oval(c,312,232,12,9,C.brass);ring(c,312,232,6,C.light,2);
  c.save();c.translate(326,194);c.rotate(-.48);r(c,-31,-15,136,30,C.blue);r(c,-27,-13,130,5,C.jade);r(c,-25,9,129,5,C.teal);for(const x of [-24,26,80]){r(c,x,-17,6,34,C.brass);r(c,x+1,-17,2,34,C.light);}r(c,103,-19,13,38,C.brass);r(c,115,-15,4,30,C.shadow);r(c,114,-11,3,22,C.blue);r(c,-43,-7,14,14,C.brass);r(c,-48,-5,6,10,C.shadow);r(c,20,-28,55,6,C.steel);r(c,23,-22,3,8,C.brass);r(c,65,-22,3,8,C.brass);c.restore();
  // Star chart board and work table, with ticks and constellation lines.
  panel(c,50,162,91,91,C.wood);r(c,56,167,79,79,C.void);ring(c,96,207,30,C.steel,1);ring(c,96,207,19,C.teal,1);path(c,[[68,195],[88,181],[111,203],[103,227],[122,219]],C.gold,1);for(const [x,y]of [[68,195],[88,181],[111,203],[103,227],[122,219]])oval(c,x,y,2,2,C.cream);for(let j=0;j<12;j++){const a=j/12*Math.PI*2;path(c,[[96+Math.cos(a)*28,207+Math.sin(a)*28],[96+Math.cos(a)*31,207+Math.sin(a)*31]],C.steel,1);}
  wood(c,439,249,102,6);r(c,445,255,4,26,C.brass);r(c,529,255,4,26,C.brass);r(c,452,242,38,6,C.cream);r(c,458,238,28,4,C.blue);ring(c,511,236,10,C.gold,2);path(c,[[511,226],[511,246],[501,236],[521,236]],C.brass,1);lamp(c,558,178);
  r(c,31,282,555,6,C.gold);for(let x=40;x<576;x+=18)rivet(c,x,285);path(c,[[552,151],[552,103]],C.brass,2);path(c,[[534,120],[570,120]],C.gold,2);oval(c,552,103,4,4,C.light);
}
function locomotive(c){
  r(c,47,286,516,31,C.shadow);r(c,60,266,493,14,C.gold);r(c,65,280,480,6,C.rust);
  // Cowcatcher and deep circular boiler face.
  path(c,[[9,314],[64,262],[82,314]],C.metal,0,true);for(let i=0;i<7;i++)path(c,[[65,267],[16+i*9,313]],C.steel,2);r(c,6,314,79,4,C.brass);
  r(c,103,148,262,107,C.copper);r(c,109,151,250,8,C.brass);r(c,111,161,246,5,C.gold);r(c,111,168,246,8,C.brass);r(c,111,235,246,18,C.rust);r(c,112,231,246,3,C.wood);
  oval(c,103,202,15,53,C.rust);oval(c,100,199,12,46,C.metal);oval(c,99,197,8,39,C.copper);path(c,[[96,164],[96,228]],C.gold,2);
  for(let x=135;x<360;x+=66){r(c,x,146,10,110,C.brass);r(c,x+2,147,2,107,C.light);r(c,x+8,151,2,103,C.rust);for(let y=151;y<254;y+=16)rivet(c,x+5,y);}
  for(let i=0;i<120;i++){const x=116+random(i)*241,y=180+random(i+30)*47;r(c,x,y,1+random(i+4)*3,1,i%2?C.wood:C.brass);}
  // Smokestack, steam dome, safety valve and copper plumbing.
  panel(c,132,74,47,70,C.copper);r(c,124,57,63,16,C.brass);r(c,126,54,59,4,C.gold);r(c,141,77,4,63,C.gold);r(c,129,140,55,10,C.brass);
  oval(c,278,116,25,15,C.gold);r(c,253,116,50,31,C.brass);r(c,258,118,4,27,C.light);r(c,246,144,64,7,C.rust);r(c,318,129,12,19,C.brass);r(c,312,125,24,5,C.gold);
  path(c,[[228,141],[228,126],[237,117],[237,103]],C.brass,4);ring(c,237,99,7,C.gold,2);path(c,[[222,249],[222,269],[359,269],[359,231]],C.steel,4);path(c,[[224,250],[224,267],[357,267]],C.edge,1);
  // Cab timber, riveted roof, glass and visible controls.
  wood(c,367,91,159,180);path(c,[[350,85],[367,65],[530,65],[551,85]],C.metal,0,true);r(c,358,85,187,8,C.brass);r(c,370,66,159,3,C.edge);for(let x=373;x<529;x+=17)path(c,[[x,71],[x+8,81]],C.steel,1);
  for(const x of [380,451]){panel(c,x,106,59,101,C.brass);r(c,x+5,112,49,89,C.light);r(c,x+9,115,40,82,C.cream);r(c,x+28,113,2,88,C.brass);r(c,x+5,153,49,3,C.brass);r(c,x+9,118,2,30,C.white);}
  r(c,386,189,44,12,C.darkwood);ring(c,405,181,9,C.rust,3);path(c,[[405,172],[405,190],[396,181],[414,181]],C.rust,1);r(c,462,183,39,18,C.darkwood);oval(c,483,176,7,7,C.wood);r(c,474,183,15,16,C.metal);
  panel(c,380,216,125,39,C.wood);oval(c,443,235,22,11,C.brass);r(c,432,232,21,5,C.light);for(let x=374;x<522;x+=18){rivet(c,x,100);rivet(c,x,262);}
  // Coal tender, steps and headlamp.
  wood(c,531,217,56,55);for(let i=0;i<30;i++){const x=534+random(i)*49,y=201+random(i+10)*18;path(c,[[x,y],[x+5,y-4],[x+10,y],[x+8,y+5],[x+2,y+4]],i%3?C.shadow:C.metal,0,true);}r(c,529,217,60,5,C.gold);
  for(let i=0;i<3;i++){r(c,523+i*6,274+i*11,47,4,C.steel);r(c,523+i*6,274+i*11,47,1,C.edge);}panel(c,66,174,24,40,C.brass);r(c,63,181,5,26,C.light);r(c,62,185,3,18,C.white);r(c,67,170,24,4,C.shadow);
  for(let x=72;x<545;x+=22)rivet(c,x,274);r(c,577,303,32,7,C.steel);
}
function wheel(c,x,y,radius,t){
  oval(c,x,y,radius+5,radius+5,C.void);oval(c,x,y,radius+2,radius+2,C.steel);oval(c,x,y,radius-2,radius-2,C.shadow);ring(c,x,y,radius-4,C.brass,2);ring(c,x,y,radius+1,C.edge,1);
  for(let i=0;i<10;i++){const a=t*1.8+i*Math.PI/5;path(c,[[x+Math.cos(a)*5,y+Math.sin(a)*5],[x+Math.cos(a)*(radius-7),y+Math.sin(a)*(radius-7)]],C.steel,3);}
  oval(c,x,y,6,6,C.brass);oval(c,x-1,y-1,2,2,C.light);
}
function wheels(c,kind,t){
  if(kind==='engine'){for(const x of [152,264,384])wheel(c,x,314,43,t);wheel(c,503,323,27,t);const dy=Math.sin(t*1.8)*11,dx=Math.cos(t*1.8)*11;path(c,[[152+dx,314+dy],[384+dx,314+dy]],C.shadow,10);path(c,[[152+dx,313+dy],[384+dx,313+dy]],C.brass,6);for(const x of [152,264,384])oval(c,x+dx,314+dy,4,4,C.edge);}
  else{for(const x of [100,164,456,520])wheel(c,x,345,21,t);for(const [a,b]of [[100,164],[456,520]]){path(c,[[a,344],[b,344]],C.metal,6);path(c,[[a,342],[b,342]],C.edge,1);}}
}
export function getArtwork(kind){
  if(cache.has(kind))return cache.get(kind);
  const canvas=document.createElement('canvas');canvas.width=656;canvas.height=392;
  const c=canvas.getContext('2d');c.translate(20,8);
  if(kind==='engine')locomotive(c);else{base(c);({greenhouse,library,koi,observatory}[kind]||observatory)(c);}
  cache.set(kind,canvas);return canvas;
}
export function drawCarriage(c,kind,t=0){
  const illustration=getIllustration(kind);
  if(illustration){const {image,bounds}=illustration;const height=154*bounds[3]/bounds[2];c.drawImage(image,...bounds,0,92-height,154,height);return;}
  c.save();c.scale(.25,.25);c.drawImage(getArtwork(kind),-20,-8);wheels(c,kind,t);c.restore();
}
export function drawThumbnail(canvas,kind){
  canvas.width=720;canvas.height=408;const c=canvas.getContext('2d');r(c,0,0,720,408,C.void);c.translate(52,12);c.scale(4,4);drawCarriage(c,kind);}
