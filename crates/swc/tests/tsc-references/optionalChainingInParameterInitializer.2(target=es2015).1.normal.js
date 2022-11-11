//// [optionalChainingInParameterInitializer.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var _a, _a1;
const a = ()=>undefined;
((b = (_a = a()) === null || _a === void 0 ? void 0 : _a.d)=>{
    var a1;
})();
const x = "";
((b = (_a1 = a()) === null || _a1 === void 0 ? void 0 : _a1.d, d = x)=>{
    var x1;
})();
