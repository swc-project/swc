//// [nullishCoalescingOperatorInParameterBindingPattern.2.ts]
var ref, ref1;
const a = ()=>void 0;
(({ [null !== (ref = a()) && void 0 !== ref ? ref : "d"]: c = ""  })=>{
    var a1;
})();
const x = "";
(({ [null !== (ref1 = a()) && void 0 !== ref1 ? ref1 : "d"]: c = "" , d =""  })=>{
    var x;
})();
