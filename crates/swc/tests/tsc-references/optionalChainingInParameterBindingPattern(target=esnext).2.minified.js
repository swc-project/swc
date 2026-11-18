//// [optionalChainingInParameterBindingPattern.ts]
let a = ()=>void 0;
(({ [a()?.d]: c = "" })=>{})();
