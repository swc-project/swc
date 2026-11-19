//// [optionalChainingInParameterBindingPattern.2.ts]
let a = ()=>void 0;
(({ [a()?.d]: c = "" })=>{})(), (({ [a()?.d]: c })=>{})();
