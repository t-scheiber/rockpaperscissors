import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import React, {act} from 'react';
import {JSDOM} from 'jsdom';
import {createRoot} from 'react-dom/client';
import * as jsx from 'react/jsx-runtime';
import {renderToStaticMarkup} from 'react-dom/server';
export {React,act,renderToStaticMarkup};
export function compile(filename,imports,extra='',globals={}){
 const input=fs.readFileSync(filename,'utf8');
 const code=ts.transpileModule(input,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const compiledModule={exports:{}};
 vm.runInNewContext(code+'\n'+extra,{module:compiledModule,exports:compiledModule.exports,require(name){if(name==='react')return React;if(name==='react/jsx-runtime')return jsx;if(Object.hasOwn(imports,name))return imports[name];if(name.endsWith('.png'))return {src:name.replace('@/public',''),width:40,height:40};throw Error('Unexpected test import '+name);},console,Promise,URLSearchParams,window:globalThis.window,HTMLElement:globalThis.HTMLElement,...globals},{filename,timeout:5000});
 return compiledModule.exports;
}
export async function mounted(Component,props={}){
 const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/'});
 for(const [key,value] of Object.entries({window:dom.window,document:dom.window.document,HTMLElement:dom.window.HTMLElement,Node:dom.window.Node,IS_REACT_ACT_ENVIRONMENT:true}))Object.defineProperty(globalThis,key,{value,writable:true,configurable:true});
 const root=createRoot(document.getElementById('root'));
 await act(async()=>root.render(React.createElement(Component,props)));
 return {dom,async close(){await act(async()=>root.unmount());dom.window.close();}};
}
export const Button=({children,...props})=>React.createElement('button',props,children);
export const Image=({src,alt})=>React.createElement('img',{src:typeof src==='string'?src:src.src,alt});
export const Link=({href,children})=>React.createElement('a',{href:typeof href==='string'?href:href.pathname+'?'+new URLSearchParams(href.query)},children);
export const dictionary=(locale)=>JSON.parse(fs.readFileSync('dictionaries/'+locale+'.json','utf8'));
