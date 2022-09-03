//// [optionalChainingInParameterInitializer.2.ts]
const a = ()=>void 0;
((b = a()?.d)=>{
    var a1;
})();
const x = "";
((b = a()?.d, d = "")=>{
    var x;
})();
