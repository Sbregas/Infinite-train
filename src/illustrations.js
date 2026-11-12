const kinds=['engine','greenhouse','library','koi','observatory'];
const illustrations=new Map();
export const getIllustration=kind=>illustrations.get(kind);

// Keep the original files intact; trim transparent margins only while drawing.
function bounds(image){
  const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
  const c=canvas.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
  const {data}=c.getImageData(0,0,canvas.width,canvas.height);
  let left=canvas.width,top=canvas.height,right=0,bottom=0;
  for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++)if(data[(y*canvas.width+x)*4+3]>20){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
  return right>=left?[left,top,right-left+1,bottom-top+1]:[0,0,canvas.width,canvas.height];
}
export async function loadIllustrations(){
  const results=await Promise.allSettled(kinds.map(async kind=>{
    if(illustrations.has(kind))return;
    const image=new Image();image.decoding='async';image.src=new URL(`../assets/carriages/${kind}.png`,import.meta.url).href;
    await image.decode();illustrations.set(kind,{image,bounds:bounds(image)});
  }));
  return results.filter(result=>result.status==='rejected').length;
}
