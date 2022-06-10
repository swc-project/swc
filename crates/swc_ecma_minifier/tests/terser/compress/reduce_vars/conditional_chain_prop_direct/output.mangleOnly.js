global.a = {
    b: null
};
let b = "PASS";
a.b?.[(b = "FAIL")];
console.log(b);
