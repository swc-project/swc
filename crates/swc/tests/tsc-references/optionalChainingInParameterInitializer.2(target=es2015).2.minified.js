//// [optionalChainingInParameterInitializer.2.ts]
let a = ()=>void 0;
((b = null == (_a = a()) ? void 0 : _a.d)=>{
    var _a;
})();
let x = "";
((b = null == (_a = a()) ? void 0 : _a.d, d = x)=>{
    var _a;
})();
