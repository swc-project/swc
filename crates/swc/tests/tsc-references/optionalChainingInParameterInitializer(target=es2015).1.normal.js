//// [optionalChainingInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var _a;
const a = ()=>undefined;
((b = (_a = a()) === null || _a === void 0 ? void 0 : _a.d)=>{})();
