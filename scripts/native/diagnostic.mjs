// Manual diagnostics use the release measurement implementation and gates.
import { cpSync, copyFileSync, linkSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { measureLoads, createMeasurementCache, validateMeasurements } from './measurements.mjs';
const [product, rawPath, carrierPath, filename, target = "x86_64-apple-darwin"] = process.argv.slice(2);
const stage=mkdtempSync(resolve('target/diagnostic-'));
const cacheRoot=createMeasurementCache();
function variant(name, source, hold=false) {
 const dir=join(name.startsWith('cold-raw') && process.env.NATIVE_DIAGNOSTIC_EXPERIMENT?.includes('home') ? cacheRoot : stage,name), base=resolve('packages',product);
 cpSync(base,dir,{recursive:true,filter:path=>{
  const relative=path.slice(base.length);
  return !/(^|\/)(node_modules|scripts|target|artifacts|artifacts_cli)(\/|$)/.test(relative) && !relative.endsWith('.node');
 }});
 const addon=join(dir,filename); copyFileSync(source,addon);
 if(hold)linkSync(addon,join(dir,'.hold'));
 return {entry:join(dir,'index.js'),addon};
}
try {
 const raw=variant('raw',rawPath), carrier=variant('carrier',carrierPath,true);
 const smoke=(entry,addon,cache)=>{
  const result=spawnSync(process.execPath,[resolve('scripts/native/smoke.cjs'),product,entry,addon,target],{encoding:'utf8',env:{...process.env,SWC_NATIVE_BINDING_CACHE:cache}});
  process.stderr.write(result.stderr);
  if(result.status)throw Error(result.stderr);
  const value=JSON.parse(result.stdout.trim().split('\n').at(-1));
  console.error(JSON.stringify({entry,cache,loadMs:value.loadMs}));
  return value;
 };
 const result={target,...measureLoads({raw,carrier,copyRaw:i=>variant('cold-raw-'+i,rawPath),smoke,cacheRoot})};
 console.log(JSON.stringify(result)); validateMeasurements(result);
} finally {rmSync(stage,{recursive:true,force:true});rmSync(cacheRoot,{recursive:true,force:true});}
