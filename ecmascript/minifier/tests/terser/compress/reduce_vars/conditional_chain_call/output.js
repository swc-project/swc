global.a = { b: null };
let foo = "PASS";
a.b?.c((foo = "FAIL"));
console.log(foo);
