global.a = { b: null };
let l = "PASS";
a.b?.c((l = "FAIL"));
console.log(l);
