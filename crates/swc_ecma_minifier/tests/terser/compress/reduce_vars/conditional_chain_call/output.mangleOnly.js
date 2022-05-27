global.a = {
    b: null
};
let b = "PASS";
a.b?.c((b = "FAIL"));
console.log(b);
