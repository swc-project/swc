//// [nullishCoalescingOperatorInParameterBindingPattern.ts]
var _a;
let a = ()=>void 0;
(({ [null != (_a = a()) ? _a : "d"]: c = "" })=>{})();
