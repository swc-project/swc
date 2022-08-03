global.a = {
    b: null
};
let l = "PASS";
a.b?.[(l = "FAIL")];
console.log(l);
