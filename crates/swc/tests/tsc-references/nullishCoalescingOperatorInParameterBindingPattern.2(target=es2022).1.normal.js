//// [nullishCoalescingOperatorInParameterBindingPattern.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>undefined;
(({ [a() ?? "d"]: c = ""  })=>{
    var a1;
})();
const x = "";
(({ [a() ?? "d"]: c = "" , d =x  })=>{
    var x1;
})();
