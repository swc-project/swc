//// [nullishCoalescingOperatorInParameterInitializer.2.ts]
let a = ()=>void 0;
((b = a() ?? "d")=>{})(), ((b = a() ?? "d")=>{})();
