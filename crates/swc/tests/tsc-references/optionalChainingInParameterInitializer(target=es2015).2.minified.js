//// [optionalChainingInParameterInitializer.ts]
let a = ()=>void 0;
((b = (()=>{
    var _a;
    return null == (_a = a()) ? void 0 : _a.d;
})())=>{})();
