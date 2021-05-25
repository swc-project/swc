global.a = { b: null };
let foo = "FAIL";
a.b?.[(foo = "PASS")]?.d((foo = "FAIL"));
console.log(foo);
