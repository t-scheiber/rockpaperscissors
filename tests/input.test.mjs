import test from 'node:test';
import assert from 'node:assert/strict';
import {compile,React,act,mounted,Button,Image,Link,dictionary} from './harness.mjs';
function camera({capture=()=>null,predict=async()=> 'Rock'}={}){
 const Webcam=React.forwardRef(function FakeCamera(_props,ref){React.useImperativeHandle(ref,()=>({getScreenshot:capture}));return React.createElement('video');});
 const t=key=>dictionary('en').webaicomp[key];
 return compile('components/WebcamAIComponent.tsx',{'react-webcam':Webcam,'next/image':Image,'next/link':Link,'next-intl':{useLocale:()=> 'en',useTranslations:()=>t},'./ui/button':{Button},'@/lib/teachableModel':{predictHandFromImage:predict}}).default;
}
async function click(button){await act(async()=>button.dispatchEvent(new window.MouseEvent('click',{bubbles:true})));}
test('a missing camera frame keeps capture available and explains the failure',async()=>{
 const page=await mounted(camera());try{await click(document.querySelector('button'));assert.ok(document.querySelector('video'));assert.ok(document.querySelector('button'));assert.ok(document.querySelector('[role="alert"]'));}finally{await page.close();}
});
test('a failed prediction offers an in-place retry and a later valid capture reaches the result',async()=>{
 let attempt=0;const page=await mounted(camera({capture:()=> 'data:image/jpeg;base64,AA==',predict:async()=>{if(++attempt===1)throw Error('Synthetic offline model failure');return 'Paper';}}));
 try{await click(document.querySelector('button'));assert.ok(document.querySelector('[role="alert"]'));const retry=[...document.querySelectorAll('button')].find(b=>b.textContent===dictionary('en').webaicomp.retryButton);assert.ok(retry);await click(retry);assert.ok(document.querySelector('video'));await click(document.querySelector('button'));assert.ok(document.querySelector('a[href="/en/result?selectedValue=Paper"]'));assert.equal(document.querySelector('[role="alert"]'),null);}finally{await page.close();}
});
test('keyboard shortcuts recognize choices but preserve browser modifiers and ignore repeat/editing',async()=>{
 const routed=[];
 // Compile after the DOM is established so the listener captures the actual test window.
 let Listener;function Wrapper(){Listener??=compile('components/KeyboardShortcutsListener.tsx',{'next/navigation':{useRouter:()=>({push:value=>routed.push(value)})}}).default;return React.createElement(Listener,{resultUrl:'/de/result'});}
 const page=await mounted(Wrapper);try{
  for(const key of ['r','P','s'])await act(async()=>window.dispatchEvent(new window.KeyboardEvent('keydown',{key})));
  assert.deepEqual(routed,['/de/result?selectedValue=Rock','/de/result?selectedValue=Paper','/de/result?selectedValue=Scissors']);routed.length=0;
  for(const flags of [{ctrlKey:true},{metaKey:true},{altKey:true},{repeat:true}])await act(async()=>window.dispatchEvent(new window.KeyboardEvent('keydown',{key:'p',...flags})));
  const input=document.createElement('input');document.body.append(input);await act(async()=>input.dispatchEvent(new window.KeyboardEvent('keydown',{key:'r',bubbles:true})));
  assert.deepEqual(routed,[]);
 }finally{await page.close();}
});
