// Manual diagnostics use the release measurement implementation and gates.
import { cpSync, copyFileSync, linkSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { freemem } from 'node:os';
import { spawnSync } from 'node:child_process';
import { measureLoads, createMeasurementCache, validateMeasurements } from './measurements.mjs';
const [product, rawPath, carrierPath, filename, target = "x86_64-apple-darwin"] = process.argv.slice(2);
const stage=mkdtempSync(resolve('target/diagnostic-'));
const cacheRoot=createMeasurementCache();
function variant(name, source, hold=false, root=stage) {
 const dir=join(root,name), base=resolve('packages',product);
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
 let coldRaw, sampleNumber;
 const smoke=(entry,addon,cache)=>{
  const result=spawnSync(process.execPath,[resolve('scripts/native/smoke.cjs'),product,entry,addon,target],{encoding:'utf8',env:{...process.env,SWC_NATIVE_BINDING_CACHE:cache}});
  process.stderr.write(result.stderr);
  if(result.status)throw Error(result.stderr);
  const value=JSON.parse(result.stdout.trim().split('\n').at(-1));
  console.error(JSON.stringify({entry,cache,loadMs:value.loadMs}));
  if(cache===join(cacheRoot,'warm') && process.env.NATIVE_DIAGNOSTIC_EXPERIMENT?.endsWith('-samples')) {
   console.error(JSON.stringify({sample:sampleNumber ?? 'prime',freeBytes:freemem(),parentRss:process.memoryUsage().rss,
    vm:spawnSync('/usr/bin/vm_stat',[],{encoding:'utf8'}).stdout,
    swap:spawnSync('/usr/sbin/sysctl',['vm.swapusage'],{encoding:'utf8'}).stdout,
    cacheKiB:spawnSync('/usr/bin/du',['-sk',cacheRoot],{encoding:'utf8'}).stdout}));
   if(coldRaw && process.env.NATIVE_DIAGNOSTIC_EXPERIMENT==='cleanup-samples') {
    rmSync(dirname(coldRaw.entry),{recursive:true,force:true});
    rmSync(join(cacheRoot,'cold-'+sampleNumber),{recursive:true,force:true});
   }
  }
  return value;
 };
 const result={target,...measureLoads({raw,carrier,copyRaw:(i,root)=>{sampleNumber=i;return coldRaw=variant('cold-raw-'+i,rawPath,false,root)},smoke,cacheRoot})};
 console.log(JSON.stringify(result)); validateMeasurements(result);
} finally {rmSync(stage,{recursive:true,force:true});rmSync(cacheRoot,{recursive:true,force:true});}
