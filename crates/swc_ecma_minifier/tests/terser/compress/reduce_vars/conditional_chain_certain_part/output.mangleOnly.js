global.a = {
    b: null
};
let b = "FAIL";
a.b.c((b = "PASS"))?.x;
console.log(b);
