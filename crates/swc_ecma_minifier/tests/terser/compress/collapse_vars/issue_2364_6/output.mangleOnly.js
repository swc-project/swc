function b(a, b) {
    var c = a.p;
    b.p = "FAIL";
    return c;
}
var a = {
    p: "PASS"
};
console.log(b(a, a));
