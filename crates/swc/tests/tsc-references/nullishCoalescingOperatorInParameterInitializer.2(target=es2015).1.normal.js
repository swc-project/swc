//// [nullishCoalescingOperatorInParameterInitializer.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>undefined;
var _a;
((b = (_a = a()) !== null && _a !== void 0 ? _a : "d")=>{
    var a1;
})();
const x = "";
var _a1;
((b = (_a1 = a()) !== null && _a1 !== void 0 ? _a1 : "d", d = x)=>{
    var x1;
})();
