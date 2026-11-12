import {test,expect} from '@playwright/test';
test('journey loads below a Pages subpath and navigates without overflow',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('./');
  await expect(page.getByRole('heading',{name:'The Infinite Train',exact:true})).toBeVisible();
  await expect(page.locator('#car-title')).toHaveText('La serra errante');
  await page.getByRole('button',{name:'Vagone successivo'}).click();
  await expect(page.locator('#car-title')).toHaveText('La biblioteca delle ore');
  await page.locator('#scene').focus();await page.keyboard.press('ArrowRight');
  await expect(page.locator('#car-title')).toHaveText('Il giardino sospeso');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  expect(errors).toEqual([]);
});
test('local votes persist and never leak into public mode',async({page})=>{
  await page.goto('./');
  await page.getByRole('button',{name:'Vota nella demo',exact:true}).click();
  await expect(page.locator('#vote-button')).toHaveAttribute('aria-pressed','true');
  await page.reload();
  await expect(page.locator('#vote-button')).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button',{name:'Voti pubblici',exact:true}).click();
  await expect(page.locator('#vote-note')).toContainText('Da attivare');
  await expect(page.locator('#vote-button')).toBeDisabled();
  await page.getByRole('button',{name:'Classifica',exact:true}).click();
  await expect(page.locator('#ranking')).not.toContainText('129');
  await expect(page.locator('#ranking')).toContainText('Da attivare');
});
test('contribution opens a reviewable GitHub issue and Escape closes dialog',async({page})=>{
  await page.goto('./');
  await page.getByRole('button',{name:'Crea un vagone',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('Nome del vagone').fill('La mia officina');
  await page.getByLabel('La tua idea').fill('Un’officina con tanti piccoli robot.');
  await expect(page.getByRole('link',{name:'Continua su GitHub'})).toHaveAttribute('href',/github.com\/Sbregas\/Infinite-train\/issues\/new\?/);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('reduced motion starts paused; blocked storage does not break voting',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}));
  await page.goto('./');
  await expect(page.locator('#pause')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#pause')).toBeDisabled();
  await page.getByRole('button',{name:'Vota nella demo',exact:true}).click();
  await expect(page.locator('#vote-note')).toContainText('sessione');
});
test('no-script visitors can still read the concept and contribution link',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  await page.goto('http://127.0.0.1:4173/Infinite-train/');
  await expect(page.getByRole('heading',{name:'The Infinite Train',exact:true})).toBeVisible();
  await expect(page.locator('#fallback')).toBeVisible();
  await expect(page.locator('#fallback')).toContainText('JavaScript');
  await context.close();
});
test('public API errors are explicit and retry loads only real reaction counts',async({page})=>{
  await page.route('**/src/catalog.js',async route=>{const response=await route.fetch();const body=(await response.text()).replace('issue:null','issue:1');await route.fulfill({response,body});});
  let fail=true;
  await page.route('https://api.github.com/repos/Sbregas/Infinite-train/issues/1',async route=>{if(fail)await route.fulfill({status:503,body:'Unavailable'});else await route.fulfill({json:{reactions:{'+1':7,total_count:99}}});});
  await page.goto('./?mode=public');
  await expect(page.locator('#vote-note')).toContainText('Non disponibile');
  await expect(page.locator('#vote-button')).toBeDisabled();
  fail=false;await page.locator('#refresh-votes').click();
  await expect(page.locator('#vote-count')).toHaveText('7');
  await expect(page.locator('#vote-button')).toBeEnabled();
  await page.getByRole('button',{name:'Classifica',exact:true}).click();
  await expect(page.locator('#ranking')).toContainText('7 voti pubblici');
  await expect(page.locator('#ranking')).not.toContainText('128');
});
test('touch swipe changes carriage and the dawn control changes the landscape',async({page})=>{
  await page.goto('./');await page.emulateMedia({reducedMotion:'reduce'});
  const box=await page.locator('#scene').boundingBox();const x=box.x+box.width*.84,y=box.y+box.height*.58;
  const session=await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-Math.min(230,box.width*.7),y}]});
  await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await expect(page.locator('#car-title')).not.toHaveText('La serra errante');
  await page.locator('#dawn').click();await expect(page.locator('#landscape-name')).toHaveText('Incontro alla prima luce');
});
test('reduced motion produces a stable canvas and keyboard input stays inside the form',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');
  const first=await page.locator('#scene').evaluate(c=>c.toDataURL());await page.waitForTimeout(150);
  expect(await page.locator('#scene').evaluate(c=>c.toDataURL())).toBe(first);
  await page.getByRole('button',{name:'Crea un vagone',exact:true}).click();
  await page.getByLabel('Nome del vagone').fill('Il mio vagone');await page.keyboard.press('ArrowRight');
  await expect(page.locator('#car-title')).toHaveText('La serra errante');
});
test('scene and carriage previews retain detail at device pixel density',async({page})=>{
  await page.goto('./');await page.locator('html[data-ready]').waitFor();
  const metrics=await page.locator('#scene').evaluate(c=>({w:c.width,h:c.height,box:c.getBoundingClientRect().toJSON(),dpr:Math.min(devicePixelRatio,3)}));
  expect(metrics.w).toBeGreaterThanOrEqual(Math.floor(metrics.box.width*metrics.dpr));
  expect(metrics.h).toBeGreaterThanOrEqual(Math.floor(metrics.box.height*metrics.dpr));
  expect(await page.locator('.carriage-card canvas').first().evaluate(c=>c.width)).toBeGreaterThanOrEqual(616);
});
test('detail zoom preserves selected carriage and pointer navigation',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./?car=library');
  await page.getByRole('button',{name:'Ingrandisci il vagone'}).click();
  await expect(page.locator('#zoom')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#car-title')).toHaveText('La biblioteca delle ore');
  const box=await page.locator('#scene').boundingBox();
  await page.mouse.click(box.x+box.width/2,box.y+box.height*.55);
  await expect(page.locator('#car-title')).toHaveText('La biblioteca delle ore');
  await page.getByRole('button',{name:'Vagone successivo'}).click();
  await expect(page.locator('#car-title')).toHaveText('Il giardino sospeso');
  await page.getByRole('button',{name:'Mostra il convoglio'}).click();
  await expect(page.locator('#zoom')).toHaveAttribute('aria-pressed','false');
});
