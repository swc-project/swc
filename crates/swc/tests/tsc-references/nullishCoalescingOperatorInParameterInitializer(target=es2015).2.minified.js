//// [nullishCoalescingOperatorInParameterInitializer.ts]
var _a;
let a = ()=>void 0;
((b = null != (_a = a()) ? _a : "d")=>{})();
