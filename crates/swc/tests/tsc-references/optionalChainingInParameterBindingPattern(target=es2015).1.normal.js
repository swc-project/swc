//// [optionalChainingInParameterBindingPattern.ts]
var _a;
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>undefined;
(({ [(_a = a()) === null || _a === void 0 ? void 0 : _a.d]: c = "" })=>{})();
