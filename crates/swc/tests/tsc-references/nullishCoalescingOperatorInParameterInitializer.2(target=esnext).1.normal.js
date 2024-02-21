//// [nullishCoalescingOperatorInParameterInitializer.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>undefined;
((b = a() ?? "d")=>{
    var a1;
})();
const x = "";
((b = a() ?? "d", d = x)=>{
    var x1;
})();
