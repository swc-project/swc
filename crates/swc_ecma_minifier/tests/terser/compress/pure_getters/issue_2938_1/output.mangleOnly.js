function b(a) {
    a.b = "PASS";
}
var a = {};
b(a);
console.log(a.b);
