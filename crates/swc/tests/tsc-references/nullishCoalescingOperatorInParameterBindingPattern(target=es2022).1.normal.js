//// [nullishCoalescingOperatorInParameterBindingPattern.ts]
// https://github.com/microsoft/TypeScript/issues/36295
const a = ()=>undefined;
(({ [a() ?? "d"]: c = ""  })=>{})();
