global.a = {
    b: null
};
let b = "FAIL";
a.b?.[(b = "PASS")]?.d((b = "FAIL"));
console.log(b);
