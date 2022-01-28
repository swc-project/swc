global.a = { b: null };
let foo = "FAIL";
a.b.c((foo = "PASS"))?.x;
console.log("PASS");
