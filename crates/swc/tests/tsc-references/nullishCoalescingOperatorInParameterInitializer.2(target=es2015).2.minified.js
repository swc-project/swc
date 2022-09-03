//// [nullishCoalescingOperatorInParameterInitializer.2.ts]
var ref, ref1;
const a = ()=>void 0;
((b = null !== (ref = a()) && void 0 !== ref ? ref : "d")=>{
    var a1;
})();
const x = "";
((b = null !== (ref1 = a()) && void 0 !== ref1 ? ref1 : "d", d = "")=>{
    var x;
})();
