import {cpSync, copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawnSync} from 'node:child_process';
import {measureLoads, createMeasurementCache} from './measurements.mjs';
const root=createMeasurementCache();
const rawPath=resolve('target/diagnostic-input/raw.node');
function variant(name) {
 const dir=join(root,name), base=resolve('packages/core');
 cpSync(base,dir,{recursive:true,filter:path=>!/(^|\/)(node_modules|scripts|target|artifacts|artifacts_cli)(\/|$)/.test(path.slice(base.length))&&!path.endsWith('.node')});
 const addon=join(dir,'swc.darwin-x64.node');copyFileSync(rawPath,addon);return {entry:join(dir,'index.js'),addon};
}
try {
 let source=readFileSync(new URL('./measurements.mjs',import.meta.url),'utf8');
 const from=source.indexOf('        rawMs.push(smoke(raw.entry');
 const to=source.indexOf('\n    }\n    const result',from);
 source=source.slice(0,from)+`        const actions = [
            () => rawMs.push(smoke(raw.entry, raw.addon, "0").loadMs),
            () => { const r = copyRaw(sample); rawColdMs.push(smoke(r.entry, r.addon, "0").loadMs); },
            () => coldMs.push(smoke(carrier.entry, carrier.addon, join(cacheRoot, "cold-" + sample)).loadMs),
            () => warmMs.push(smoke(carrier.entry, carrier.addon, warmCache).loadMs),
        ];
        if (sample % 2) actions.reverse();
        for (const action of actions) action();`+source.slice(to);
 const balancedPath=join(root,'balanced.mjs');writeFileSync(balancedPath,source);
 const balanced=(await import(pathToFileURL(balancedPath))).measureLoads;
 for (const [name,measure] of [['fixed',measureLoads],['balanced',balanced]]) {
  const raw=variant(name+'-raw'),carrier=variant(name+'-carrier');
  const smoke=(entry,addon,cache)=>{
   const match=cache.match(/cold-(\d+)$/);
   if(match)({entry,addon}=variant(name+'-carrier-cold-'+match[1]));
   const r=spawnSync(process.execPath,[resolve('scripts/native/smoke.cjs'),'core',entry,addon,'x86_64-apple-darwin'],{encoding:'utf8',env:{...process.env,SWC_NATIVE_BINDING_CACHE:'0'}});
   if(r.status)throw Error(r.stderr);
   const value=JSON.parse(r.stdout.trim().split('\n').at(-1));
   console.log(JSON.stringify({name,entry,loadMs:value.loadMs}));return value;
  };
  smoke(raw.entry,raw.addon,'0');
  console.log(JSON.stringify({name,target:'x86_64-apple-darwin',...measure({raw,carrier,copyRaw:i=>variant(name+'-raw-cold-'+i),smoke,cacheRoot:join(root,name+'-cache')})}));
 }
}finally{rmSync(root,{recursive:true,force:true});}
