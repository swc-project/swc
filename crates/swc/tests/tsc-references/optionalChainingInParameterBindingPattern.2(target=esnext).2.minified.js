//// [optionalChainingInParameterBindingPattern.2.ts]
let a = ()=>void 0;
(({ [a()?.d]: c = "" })=>{})();
let x = "";
(({ [a()?.d]: c }, d = x)=>{})();
