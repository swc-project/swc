//// [optionalChainingInParameterInitializer.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var ref, ref1;
const a = ()=>undefined;
((b = (ref = a()) === null || ref === void 0 ? void 0 : ref.d)=>{
    var a1;
})();
const x = "";
((b = (ref1 = a()) === null || ref1 === void 0 ? void 0 : ref1.d, d = x)=>{
    var x1;
})();
