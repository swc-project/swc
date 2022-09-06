global.a = { b: null };
let l = "FAIL";
a.b?.[(l = "PASS")]?.d((l = "FAIL"));
console.log(l);
