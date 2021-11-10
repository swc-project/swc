global.a = { b: null };
let foo = "PASS";
a.b?.[(foo = "FAIL")];
console.log(foo);
