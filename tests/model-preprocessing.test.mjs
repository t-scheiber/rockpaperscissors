import test from 'node:test';
import assert from 'node:assert/strict';
import {compile} from './harness.mjs';

// Fixed expected input contract from the published @teachablemachine/image 0.8.5
// capture/cropTo implementations. Inputs and model outputs are synthetic.
function fixture(width=640,height=480,{contextMissing=false}={}) {
 const trace={draws:[],input:null,fromPixels:null,resizeCalls:0};
 class Tensor {
  constructor(values,shape=[224,224,3]) {this.values=values;this.shape=shape;}
  toFloat(){return new Tensor(this.values.map(Math.fround),this.shape);}
  div(number){return new Tensor(this.values.map(value=>Math.fround(value/number)),this.shape);}
  sub(number){return new Tensor(this.values.map(value=>Math.fround(value-number)),this.shape);}
  expandDims(){return new Tensor(this.values,[1,...this.shape]);}
 }
 const tf={ready:async()=>{},tidy:fn=>fn(),scalar:value=>value,
  browser:{fromPixels(element){trace.fromPixels=element;return new Tensor([0,127,255]);}},
  image:{resizeBilinear(tensor){trace.resizeCalls++;return tensor;}},
  loadLayersModel:async()=>({predict(input){trace.input=input;return {data:async()=>new Float32Array([0.1,0.8,0.1]),dispose(){}};}})};
 class Image {constructor(){this.width=width;this.height=height;}set src(value){assert.match(value,/^data:/);Promise.resolve().then(()=>this.onload());}}
 const document={createElement(name){assert.equal(name,'canvas');const canvas={width:0,height:0,getContext(kind){assert.equal(kind,'2d');return contextMissing?null:{drawImage(...args){trace.draws.push(args);}};}};return canvas;}};
 const compiled=compile('lib/teachableModel.ts',{'@tensorflow/tfjs':tf},'',{Image,document,fetch:async()=>({ok:true,json:async()=>({labels:['Rock','Paper','Scissors'],imageSize:224})})});
 return {trace,predict:()=>compiled.predictHandFromImage('data:image/png;base64,c3ludGhldGlj')};
}

test('actual prediction helper uses Teachable Machine 0.8.5 normalization, including exact divisor 127',async()=>{
 const {trace,predict}=fixture();assert.equal(await predict(),'Paper');
 const expected=[-1,0,128/127];
 trace.input.values.forEach((value,index)=>assert.ok(Math.abs(value-expected[index])<1e-6,`channel ${index} has incompatible normalization`));
 assert.deepEqual(Array.from(trace.input.shape),[1,224,224,3]);
});

for(const [width,height,draw] of [[640,480,[-37,0,299,224]],[480,640,[0,-37,224,299]],[224,224,[0,0,224,224]],[641,479,[-38,0,300,224]]]) {
 test(`actual prediction helper center-crops ${width}x${height} without stretching or flipping`,async()=>{
  const {trace,predict}=fixture(width,height);await predict();assert.equal(trace.draws.length,1);
  assert.deepEqual(trace.draws[0].slice(1).map(value=>value===0?0:value),draw);assert.equal(trace.resizeCalls,0);
  assert.equal(trace.fromPixels.width,224);assert.equal(trace.fromPixels.height,224);
 });
}

test('unavailable canvas context rejects rather than passing incorrectly prepared pixels to the model',async()=>{
 const {trace,predict}=fixture(640,480,{contextMissing:true});await assert.rejects(predict,/canvas/i);assert.equal(trace.input,null);
});
