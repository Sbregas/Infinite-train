import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
const output=path.resolve(process.argv[2]||'test-results/worlds');await mkdir(output,{recursive:true});
const browser=await chromium.launch();
for(const [name,width,height,dpr] of [['desktop',1440,1080,1],['retina',1920,1080,2],['mobile',390,844,3],['small-mobile',320,740,2]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr,reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4173/Infinite-train/?car=library');
  await page.locator('html[data-artwork="ready"]').waitFor();
  await page.screenshot({path:path.join(output,`inhabited-${name}.png`),fullPage:true});
  console.log(name,await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth})));
  await page.locator('#inspect-car').click();
  await page.locator('#detail-viewer[open]').waitFor();
  await page.screenshot({path:path.join(output,`library-detail-${name}.png`)});
  console.log(name,await page.locator('#detail-image').evaluate(i=>({native:[i.naturalWidth,i.naturalHeight],display:i.getBoundingClientRect().width})));
  await page.keyboard.press('Escape');
  if(name==='desktop')for(const car of ['greenhouse','koi','observatory']){await page.locator(`[data-car="${car}"]`).click();await page.locator('.scene-wrap').screenshot({path:path.join(output,`${car}-world.png`)});}
  await page.close();
}await browser.close();
