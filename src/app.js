import {cars,REPOSITORY} from './catalog.js';
import {readVotes,saveVotes,toggleVote,rankCars,fetchPublicVotes} from './model.js';
import {Scene,renderThumbnail} from './scene.js';
import {getIllustration,loadIllustrations} from './illustrations.js';
import {setupDetailViewer} from './detail-viewer.js';
const $=id=>document.getElementById(id),ids=cars.map(c=>c.id);
let storage;try{storage=window.localStorage;}catch{storage=null;}
let votes=readVotes(storage,ids),selected=cars[0],mode='demo',publicVotes={},loading=false,volatile=false,screen='journey';
const params=new URLSearchParams(location.search);
if(ids.includes(params.get('car')))selected=cars.find(c=>c.id===params.get('car'));
if(params.get('mode')==='public')mode='public';
if(params.get('view')==='ranking')screen='ranking';
const scene=new Scene($('scene'),cars,id=>selectCar(id));
const say=text=>{$('announcement').textContent=text;};
function urlState(){const q=new URLSearchParams();q.set('car',selected.id);if(mode==='public')q.set('mode','public');if(screen==='ranking')q.set('view','ranking');history.replaceState(null,'',`${location.pathname}?${q}`);}
function statusText(car){const state=publicVotes[car.id];if(loading)return 'Caricamento…';if(!state||state.status==='unconfigured')return 'Da attivare';if(state.status==='error')return 'Non disponibile';return `${state.count} voti pubblici`;}
function renderVote(){const button=$('vote-button');button.disabled=false;button.setAttribute('aria-pressed',String(mode==='demo'&&votes[selected.id]===true));
  if(mode==='demo'){$('vote-label').textContent=votes[selected.id]?'Voto demo aggiunto':'Vota nella demo';$('vote-count').textContent=selected.demoVotes+(votes[selected.id]?1:0);$('vote-count').hidden=false;$('vote-note').textContent=volatile?'Voto valido in questa sessione; salvataggio non disponibile.':'Voti di prova, salvati solo qui.';}
  else{const state=publicVotes[selected.id];button.disabled=loading||state?.status!=='ready';$('vote-label').textContent=loading?'Caricamento…':state?.status==='ready'?'Vota su GitHub':'Voto non attivo';$('vote-count').hidden=state?.status!=='ready';$('vote-count').textContent=state?.count??'';$('vote-note').textContent=state?.status==='ready'?'Conta la reazione +1 sulla Issue GitHub.':`${statusText(selected)}. Nessun voto demo incluso.`;}
}
function renderList(){for(const car of cars){const button=document.querySelector(`[data-car="${car.id}"]`);button.setAttribute('aria-pressed',String(car.id===selected.id));button.querySelector('.score').textContent=mode==='demo'?`${car.demoVotes+(votes[car.id]?1:0)} voti demo`:statusText(car);}}
function renderRanking(){const rows=mode==='demo'?rankCars(cars,votes):[...cars].sort((a,b)=>(publicVotes[b.id]?.count??-1)-(publicVotes[a.id]?.count??-1));$('ranking').replaceChildren();
  for(const [i,car]of rows.entries()){const li=document.createElement('li');li.className='ranking-row';const position=document.createElement('span');position.className='rank-position';position.textContent=mode==='demo'||publicVotes[car.id]?.status==='ready'?String(i+1).padStart(2,'0'):'—';const title=document.createElement('button');title.className='rank-title';title.textContent=car.name;title.addEventListener('click',()=>{setScreen('journey');selectCar(car.id);$('scene').focus({preventScroll:true});});const score=document.createElement('span');score.className='rank-score';score.textContent=mode==='demo'?`${car.score} voti demo`:statusText(car);li.append(position,title,score);$('ranking').append(li);}
  $('ranking-description').textContent=mode==='demo'?'Classifica dimostrativa: i tuoi voti cambiano solo questo browser.':'Solo reazioni +1 alle Issue GitHub. I vagoni non collegati restano senza punteggio.';
}
function selectCar(id,announce=true){selected=cars.find(c=>c.id===id)||cars[0];$('car-number').textContent=selected.number;$('car-title').textContent=selected.name;$('car-subtitle').textContent=selected.subtitle;$('car-story').textContent=selected.description;scene.select(selected.id);$('inspect-car').disabled=!getIllustration(selected.id);renderVote();renderList();urlState();if(announce)say(selected.name);}
function setScreen(value){screen=value;$('journey-panel').hidden=value!=='journey';$('ranking-panel').hidden=value!=='ranking';for(const key of ['journey','ranking']){$(`${key}-tab`).setAttribute('aria-pressed',String(key===value));$(`${key}-tab`).classList.toggle('active',key===value);}renderRanking();urlState();}
async function refreshPublic(){loading=true;renderVote();renderList();renderRanking();$('refresh-votes').disabled=true;$('refresh-votes').setAttribute('aria-busy','true');publicVotes=await fetchPublicVotes(cars);loading=false;$('refresh-votes').disabled=false;$('refresh-votes').setAttribute('aria-busy','false');renderVote();renderList();renderRanking();}
function setMode(value){mode=value;$('demo-mode').setAttribute('aria-pressed',String(value==='demo'));$('public-mode').setAttribute('aria-pressed',String(value==='public'));$('public-notice').hidden=value!=='public';renderVote();renderList();renderRanking();urlState();if(value==='public'&&!Object.keys(publicVotes).length)refreshPublic();}
for(const car of cars){const button=document.createElement('button');button.className='carriage-card';button.dataset.car=car.id;button.setAttribute('aria-label',`Esplora ${car.name}`);button.setAttribute('aria-pressed','false');const thumbnail=document.createElement('canvas');thumbnail.setAttribute('aria-hidden','true');renderThumbnail(thumbnail,car.id);const caption=document.createElement('span');caption.className='card-caption';caption.innerHTML=`<span class="card-heading"><strong></strong><span class="number"></span></span><span class="card-meta"><span class="kind"></span><span class="score"></span></span>`;caption.querySelector('strong').textContent=car.name;caption.querySelector('.number').textContent=car.number;caption.querySelector('.kind').textContent=car.kind;button.append(thumbnail,caption);button.addEventListener('click',()=>{setScreen('journey');selectCar(car.id);});$('carriage-list').append(button);}
$('previous').addEventListener('click',()=>selectCar(cars[(ids.indexOf(selected.id)-1+cars.length)%cars.length].id));$('next').addEventListener('click',()=>selectCar(cars[(ids.indexOf(selected.id)+1)%cars.length].id));
$('scene').addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();$(e.key==='ArrowRight'?'next':'previous').click();}if(e.key==='Home'){e.preventDefault();selectCar(cars[0].id);}if(e.key==='End'){e.preventDefault();selectCar(cars.at(-1).id);}});
$('vote-button').addEventListener('click',()=>{if(mode==='public'){if(publicVotes[selected.id]?.status==='ready')window.open(`https://github.com/${REPOSITORY}/issues/${selected.issue}`,'_blank','noopener,noreferrer');return;}votes=toggleVote(votes,selected.id,ids);volatile=!saveVotes(storage,votes);renderVote();renderList();renderRanking();say(votes[selected.id]?'Voto demo aggiunto solo in questo browser.':'Voto demo rimosso.');});
$('story-toggle').addEventListener('click',()=>{const open=$('story-toggle').getAttribute('aria-expanded')!=='true';$('story-toggle').setAttribute('aria-expanded',String(open));$('car-story').hidden=!open;$('story-toggle').querySelector('span').textContent=open?'−':'+';});
$('demo-mode').addEventListener('click',()=>setMode('demo'));$('public-mode').addEventListener('click',()=>setMode('public'));$('refresh-votes').addEventListener('click',refreshPublic);$('journey-tab').addEventListener('click',()=>setScreen('journey'));$('ranking-tab').addEventListener('click',()=>setScreen('ranking'));
function syncPause(){$('pause').disabled=scene.media.matches;$('pause').setAttribute('aria-pressed',String(scene.paused));$('pause').setAttribute('aria-label',scene.media.matches?'Movimento ridotto attivo':scene.paused?'Riprendi il viaggio':'Metti in pausa il viaggio');$('pause').title=scene.media.matches?'Animazioni disattivate dalle preferenze del dispositivo':'';$('pause').querySelector('path').setAttribute('d',scene.paused?'m9 5 10 7-10 7Z':'M8 5v14M16 5v14');}
$('pause').addEventListener('click',()=>{scene.setPaused(!scene.paused);syncPause();});scene.media.addEventListener('change',()=>{scene.setPaused(scene.media.matches);syncPause();});syncPause();
$('dawn').addEventListener('click',()=>{scene.setDawn(!scene.dawn);$('dawn').setAttribute('aria-pressed',String(scene.dawn));$('dawn').setAttribute('aria-label',scene.dawn?'Torna al paesaggio notturno':'Passa al paesaggio dell’alba');$('landscape-name').textContent=scene.dawn?'Incontro alla prima luce':'Attraversando la notte';});
$('zoom').addEventListener('click',()=>{const detail=$('zoom').getAttribute('aria-pressed')!=='true';scene.setZoom(detail);$('zoom').setAttribute('aria-pressed',String(detail));$('zoom').setAttribute('aria-label',detail?'Mostra il convoglio':'Ingrandisci il vagone');$('zoom').title=detail?'Torna alla vista del convoglio':'Osserva i dettagli';$('scene-help').textContent=detail?'Vista dettagli: trascina per esplorare':'Trascina per esplorare';});
const dialog=$('contribute');document.querySelectorAll('.create-car').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));$('close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function contributionUrl(){const title=$('car-name').value.trim()||'Il mio vagone';const idea=$('car-idea').value.trim()||'Racconta qui la tua idea.';const q=new URLSearchParams({title:`[Vagone] ${title}`,body:`## Idea\n${idea}\n\n## Immagini e crediti\nAggiungi qui il tuo disegno e indica chi lo ha creato.\n\n## Permesso\nIndica con quale licenza condividi il contributo.`,template:'blank'});$('contribute-link').href=`https://github.com/${REPOSITORY}/issues/new?${q}`;}
$('contribution-form').addEventListener('input',contributionUrl);$('contribution-form').addEventListener('submit',e=>e.preventDefault());contributionUrl();
selectCar(selected.id,false);setMode(mode);setScreen(screen);

document.documentElement.dataset.ready="true";
setupDetailViewer(()=>selected);
async function refreshIllustrations(){
  document.documentElement.dataset.artwork='loading';$('art-status').hidden=false;
  $('art-message').textContent='Caricamento illustrazioni…';$('retry-art').hidden=true;
  const failures=await loadIllustrations();
  document.documentElement.dataset.artwork=failures?'partial':'ready';
  $('art-message').textContent=failures?'Alcune illustrazioni non sono disponibili. Riprova.':'';
  $('retry-art').hidden=!failures;$('art-status').hidden=!failures;
  $('inspect-car').disabled=!getIllustration(selected.id);
  for(const car of cars)renderThumbnail(document.querySelector(`[data-car="${car.id}"] canvas`),car.id);
  scene.draw();scene.wake();
}
$('retry-art').addEventListener('click',refreshIllustrations);
refreshIllustrations();
