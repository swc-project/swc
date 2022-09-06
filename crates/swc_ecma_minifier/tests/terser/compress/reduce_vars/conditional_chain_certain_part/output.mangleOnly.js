global.a = { b: null };
let l = "FAIL";
a.b.c((l = "PASS"))?.x;
console.log(l);
