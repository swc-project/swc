//// [nullishCoalescingOperatorInParameterInitializer.2.ts]
var _a, _a1;
let a = ()=>void 0;
((b = null != (_a = a()) ? _a : "d")=>{})(), ((b = null != (_a1 = a()) ? _a1 : "d")=>{})();
