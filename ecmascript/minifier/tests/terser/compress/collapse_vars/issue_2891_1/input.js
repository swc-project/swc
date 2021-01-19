var a = "PASS",
    b;
try {
    b = c.p = 0;
    a = "FAIL";
    b();
} catch (e) {}
console.log(a);
