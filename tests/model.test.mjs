import test from 'node:test';
import assert from 'node:assert/strict';
import {compile} from './harness.mjs';
test('failed model and metadata loads can recover without reloading the application',async()=>{
 let loads=0,fetches=0;
 const compiled=compile('lib/teachableModel.ts',{'@tensorflow/tfjs':{ready:async()=>{},loadLayersModel:async()=>{if(++loads===1)throw Error('Temporary model fetch failure');return {identity:'model-stub'};}}},'module.exports.testOnly={getModel,getMetadata};',{fetch:async()=>({ok:++fetches>1,json:async()=>({labels:['Rock','Paper','Scissors'],imageSize:224})})});
 await assert.rejects(compiled.testOnly.getModel());assert.equal((await compiled.testOnly.getModel()).identity,'model-stub');assert.equal(loads,2);
 await assert.rejects(compiled.testOnly.getMetadata());assert.equal((await compiled.testOnly.getMetadata()).imageSize,224);assert.equal(fetches,2);
});
