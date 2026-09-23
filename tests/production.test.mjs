import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
const expectedAssets=JSON.parse(fs.readFileSync('tests/retained-assets.json','utf8'));
function retainedAssets(){
 const files=[];
 function walk(filename){const stat=fs.lstatSync(filename);assert.ok(!stat.isSymbolicLink());if(stat.isDirectory()){for(const name of fs.readdirSync(filename))walk(path.posix.join(filename,name));return;}assert.ok(stat.isFile());const bytes=fs.readFileSync(filename);files.push({path:filename,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}
 for(const filename of ['Trainingsdaten_AI_Modell','AI','public','favicon.ico','logo.png'])walk(filename);
 files.sort((a,b)=>Buffer.compare(Buffer.from(a.path),Buffer.from(b.path)));return files;
}
const assets=retainedAssets();
function request(port,route,maximum=4000000){return new Promise((resolve,reject)=>{
 const chunks=[];let bytes=0;
 const req=http.get({hostname:'127.0.0.1',port,path:route,timeout:4000},res=>{res.on('data',chunk=>{bytes+=chunk.length;if(bytes>maximum){req.destroy(Error('Loopback response budget exceeded'));return;}chunks.push(chunk);});res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)}));res.on('error',reject);});req.on('timeout',()=>req.destroy(Error('Loopback request timed out')));req.on('error',reject);
});}
test('actual Next production server serves both locales, game routes and every original public asset', {timeout:90000},async()=>{
 assert.equal(JSON.parse(fs.readFileSync('package.json')).scripts.start,'next start');
 const port=18734,server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{stdio:'ignore',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
 try{
  let ready=false;const deadline=Date.now()+20000;
  while(Date.now()<deadline){try{const r=await request(port,'/en');if(r.status===200){ready=true;break;}}catch{/* bounded startup polling */}await new Promise(resolve=>setTimeout(resolve,150));}
  assert.ok(ready,'built server became ready');
  const root=await request(port,'/');assert.ok([307,308].includes(root.status));assert.equal(root.headers.location,'/en');
  for(const locale of ['en','de'])for(const route of ['', '/mousegame','/keyboardgame','/cameragame','/result?selectedValue=Rock','/result?selectedValue=invalid']){
   const r=await request(port,'/'+locale+route);assert.equal(r.status,200,locale+route);
   const dom=new JSDOM(r.body.toString('utf8'));assert.equal(dom.window.document.documentElement.lang,locale);assert.ok(dom.window.document.querySelector('main'));dom.window.close();
  }
  assert.equal((await request(port,'/en/does-not-exist')).status,404);
  for(const asset of assets.filter(x=>x.path.startsWith('public/'))){const r=await request(port,'/'+asset.path.slice(7));assert.equal(r.status,200,asset.path);assert.equal(r.body.length,asset.bytes,asset.path);assert.equal(createHash('sha256').update(r.body).digest('hex'),asset.sha256,asset.path);}
 }finally{
  if(server.exitCode===null){server.kill('SIGTERM');await Promise.race([new Promise(resolve=>server.once('exit',resolve)),new Promise(resolve=>setTimeout(resolve,2000))]);if(server.exitCode===null)server.kill('SIGKILL');}
 }
});
test('all retained training images, model files and application assets remain byte-identical',()=>{
 assert.equal(assets.length,expectedAssets.files);assert.equal(assets.filter(x=>x.path.startsWith('Trainingsdaten_AI_Modell/')).length,expectedAssets.trainingImages);
 assert.equal(createHash('sha256').update(JSON.stringify(assets)).digest('hex'),expectedAssets.sha256);
 for(const item of assets){const bytes=fs.readFileSync(item.path);assert.equal(bytes.length,item.bytes,item.path);assert.equal(createHash('sha256').update(bytes).digest('hex'),item.sha256,item.path);}
});

test('the retained model metadata and 263 weight tensors match the complete local binary',()=>{
 const metadata=JSON.parse(fs.readFileSync('public/AI/metadata.json','utf8'));
 assert.deepEqual(metadata.labels,['Rock','Paper','Scissors']);assert.equal(metadata.imageSize,224);
 const model=JSON.parse(fs.readFileSync('public/AI/model.json','utf8'));assert.equal(model.weightsManifest.length,1);
 const group=model.weightsManifest[0];assert.deepEqual(group.paths,['weights.bin']);assert.equal(group.weights.length,263);
 let bytes=0;
 for(const weight of group.weights){assert.equal(weight.dtype,'float32');assert.ok(Array.isArray(weight.shape)&&weight.shape.every(n=>Number.isSafeInteger(n)&&n>0));bytes+=weight.shape.reduce((a,b)=>a*b,1)*4;}
 assert.equal(bytes,fs.statSync('public/AI/weights.bin').size);
 // The archival AI/ model is a different original artifact; both versions are preserved above.
});
