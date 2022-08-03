var a = "PASS", r;
try {
    r = c.p = 0;
    a = "FAIL";
    r();
} catch (t) {}
console.log(a);
