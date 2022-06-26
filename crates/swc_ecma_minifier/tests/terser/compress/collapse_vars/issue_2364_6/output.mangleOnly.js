function a(a, b) {
    var c = a.p;
    b.p = "FAIL";
    return c;
}
var b = {
    p: "PASS"
};
console.log(a(b, b));
