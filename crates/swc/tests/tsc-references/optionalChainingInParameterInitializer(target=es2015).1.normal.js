//// [optionalChainingInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var ref;
const a = ()=>undefined;
((b = (ref = a()) === null || ref === void 0 ? void 0 : ref.d)=>{})();
