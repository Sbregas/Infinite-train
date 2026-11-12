import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
const output=path.resolve(process.argv[2]||'test-results/details');await mkdir(output,{recursive:true});
const browser=await chromium.launch();
for(const [name,width,height,dpr] of [['desktop-hd',1440,1080,1],['retina-hd',1440,1080,2],['mobile-hd',390,844,3]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr,reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4173/Infinite-train/');await page.locator('html[data-ready]').waitFor();
  await page.screenshot({path:path.join(output,`${name}.png`),fullPage:true});
  await page.locator('#zoom').click();
  await page.locator('.scene-wrap').screenshot({path:path.join(output,`${name}-greenhouse.png`)});
  if(name==='retina-hd')for(const car of ['library','koi','observatory']){await page.locator(`[data-car="${car}"]`).click();await page.locator('.scene-wrap').screenshot({path:path.join(output,`${name}-${car}.png`)});}
  console.log(name,await page.locator('#scene').evaluate(c=>({backing:[c.width,c.height],display:[c.clientWidth,c.clientHeight],overflow:document.documentElement.scrollWidth>innerWidth})));
  await page.close();
}await browser.close();
