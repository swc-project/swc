//// [optionalChainingInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>undefined;
((b = (()=>{
    var _a;
    return (_a = a()) === null || _a === void 0 ? void 0 : _a.d;
})())=>{})();
