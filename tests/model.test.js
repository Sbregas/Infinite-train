import test from 'node:test';
import assert from 'node:assert/strict';
import { readVotes, toggleVote, rankCars, fetchPublicVotes, saveVotes } from '../src/model.js';

const cars = [{id:'a',demoVotes:5,issue:null},{id:'b',demoVotes:5,issue:null}];
test('corrupt or unavailable storage starts with no personal votes', () => {
  for (const value of ['broken','null','[]','{"a":999,"b":true,"evil":true}']) {
    const votes = readVotes({getItem:()=>value}, ['a','b']);
    assert.deepEqual(votes, value.includes('evil') ? {b:true} : {});
  }
  assert.deepEqual(readVotes({getItem:()=>{throw Error();}},['a']),{});
  assert.equal(saveVotes({setItem:()=>{throw Error();}},{}),false);
});
test('demo votes toggle once and unknown ids cannot gain votes', () => {
  assert.deepEqual(toggleVote({},'a',['a']),{a:true});
  assert.deepEqual(toggleVote({a:true},'a',['a']),{});
  assert.deepEqual(toggleVote({},'x',['a']),{});
});
test('ranking is stable on ties, responds to votes, and never mutates catalog', () => {
  assert.deepEqual(rankCars(cars,{}).map(c=>c.id),['a','b']);
  assert.deepEqual(rankCars(cars,{b:true}).map(c=>c.id),['b','a']);
  assert.equal(cars[1].demoVotes,5);
});
test('unconfigured public votes never call network or return demo counts', async () => {
  const result = await fetchPublicVotes(cars,()=>{throw Error('unexpected call');});
  assert.deepEqual(result,{a:{status:'unconfigured'},b:{status:'unconfigured'}});
});
test('public scores use positive reactions only, and failures stay unavailable', async () => {
  const configured=[{id:'a',issue:1},{id:'b',issue:2}];
  const result=await fetchPublicVotes(configured,async url=>({ok:url.endsWith('/1'),json:async()=>({reactions:{'+1':7,total_count:100}})}));
  assert.deepEqual(result,{a:{status:'ready',count:7},b:{status:'error'}});
  for (const count of [-1,'7',null,1.5]) {
    const bad=await fetchPublicVotes([configured[0]],async()=>({ok:true,json:async()=>({reactions:{'+1':count}})}));
    assert.equal(bad.a.status,'error');
  }
});
