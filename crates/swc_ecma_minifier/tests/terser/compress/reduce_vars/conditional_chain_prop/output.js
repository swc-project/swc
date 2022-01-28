global.a = null;
let foo = "PASS";
a?.b[(foo = "FAIL")];
console.log(foo);
