//// [nullishCoalescingOperatorInParameterInitializer.ts]
var _a;
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>undefined;
((b = (_a = a()) !== null && _a !== void 0 ? _a : "d")=>{})();
