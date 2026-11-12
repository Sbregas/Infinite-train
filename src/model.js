import {REPOSITORY} from './catalog.js';
export const STORAGE_KEY='infinite-train.demo-votes.v1';
export function readVotes(storage, ids) {
  try {
    const value=JSON.parse(storage.getItem(STORAGE_KEY));
    if (!value || Array.isArray(value) || typeof value!=='object') return {};
    return Object.fromEntries(ids.filter(id=>value[id]===true).map(id=>[id,true]));
  } catch { return {}; }
}
export function saveVotes(storage,votes) {
  try {storage.setItem(STORAGE_KEY,JSON.stringify(votes)); return true;} catch {return false;}
}
export function toggleVote(votes,id,ids) {
  if (!ids.includes(id)) return {...votes};
  const next={...votes};
  if (next[id]) delete next[id]; else next[id]=true;
  return next;
}
export function rankCars(cars,votes) {
  return cars.map((car,index)=>({...car,score:car.demoVotes+(votes[car.id]===true?1:0),index}))
    .sort((a,b)=>b.score-a.score||a.index-b.index);
}
export async function fetchPublicVotes(cars,fetcher=fetch) {
  return Object.fromEntries(await Promise.all(cars.map(async car=>{
    if (!Number.isSafeInteger(car.issue)||car.issue<=0) return [car.id,{status:'unconfigured'}];
    try {
      const response=await fetcher(`https://api.github.com/repos/${REPOSITORY}/issues/${car.issue}`,{
        headers:{Accept:'application/vnd.github+json'},signal:AbortSignal.timeout(8000)
      });
      if (!response.ok) throw Error('GitHub unavailable');
      const issue=await response.json();
      const count=issue.reactions?.['+1'];
      if (issue.pull_request || !Number.isSafeInteger(count)||count<0) throw Error('Invalid vote data');
      return [car.id,{status:'ready',count}];
    } catch {return [car.id,{status:'error'}];}
  })));
}
