//// [nullishCoalescingOperatorInParameterBindingPattern.2.ts]
const a = ()=>void 0;
(({ [a() ?? "d"]: c = ""  })=>{
    var a1;
})();
const x = "";
(({ [a() ?? "d"]: c = "" , d =""  })=>{
    var x;
})();
