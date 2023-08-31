//// [optionalChainingInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>void 0;
((b = null === (_a = a()) || void 0 === _a ? void 0 : _a.d)=>{
    var _a;
})();
