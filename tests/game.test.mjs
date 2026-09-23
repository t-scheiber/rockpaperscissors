import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {compile,renderToStaticMarkup,Button,Image,Link,dictionary} from './harness.mjs';
const choices=['Rock','Paper','Scissors'];
test('all nine real result combinations and both translations follow the game rules',async()=>{
 for(const locale of ['en','de'])for(const [i,computer] of choices.entries())for(const player of choices){
  const t=key=>dictionary(locale).result[key];
  const Result=compile('app/[locale]/result/page.tsx',{'next/image':Image,'next/link':Link,'@/components/ui/button':{Button},'next-intl/server':{getLocale:async()=>locale,getTranslations:async()=>t}},'',{Math:Object.assign(Object.create(Math),{random:()=>i/3+0.001})}).default;
  const html=renderToStaticMarkup(await Result({searchParams:Promise.resolve({selectedValue:player})}));
  const wins={Rock:'Scissors',Paper:'Rock',Scissors:'Paper'},expected=player===computer?'draw':wins[player]===computer?'win':'lose';
  assert.ok(new JSDOM(html).window.document.body.textContent.includes(t(expected)));assert.ok(html.includes(`href="/${locale}"`));assert.ok(html.includes(t(player.toLowerCase())));
 }
});
test('missing, unknown and repeated result choices produce no fabricated winner',async()=>{
 for(const selectedValue of [undefined,'invalid',['Rock','Paper']]){
  const Result=compile('app/[locale]/result/page.tsx',{'next/image':Image,'next/link':Link,'@/components/ui/button':{Button},'next-intl/server':{getLocale:async()=>'en',getTranslations:async()=>(key)=>dictionary('en').result[key]}}).default;
  const html=renderToStaticMarkup(await Result({searchParams:Promise.resolve({selectedValue})}));assert.equal((html.match(/<img/g)||[]).length,0);
 }
});
test('all mouse choices preserve their localized destination and value',async()=>{
 for(const locale of ['en','de']){
  const Page=compile('app/[locale]/mousegame/page.tsx',{'next/image':Image,'next/link':Link,'next-intl/server':{getLocale:async()=>locale,getTranslations:async()=>(key)=>dictionary(locale).mousegame[key]}}).default;
  const html=renderToStaticMarkup(await Page());for(const choice of choices)assert.ok(html.includes(`href="/${locale}/result?selectedValue=${choice}"`));
 }
});
