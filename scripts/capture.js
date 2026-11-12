import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
const output=path.resolve(process.argv[2]||'test-results/previews');await mkdir(output,{recursive:true});
const browser=await chromium.launch();
for(const [name,width,height]of [['desktop',1440,1080],['mobile',390,844],['small',320,740],['wide',1920,1080]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4173/Infinite-train/');await page.locator('html[data-ready]').waitFor();
  await page.screenshot({path:path.join(output,`${name}.png`),fullPage:true});
  console.log(name,await page.evaluate(()=>({width:innerWidth,content:document.documentElement.scrollWidth})));
  if(name==='desktop'){await page.locator('#dawn').click();await page.screenshot({path:path.join(output,'dawn.png'),fullPage:true});}
  await page.close();
}await browser.close();
