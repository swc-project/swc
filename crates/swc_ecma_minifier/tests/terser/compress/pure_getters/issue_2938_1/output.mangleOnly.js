function a(a) {
    a.b = "PASS";
}
var b = {};
a(b);
console.log(b.b);
