function a(a, b) {
    return a ? a : b;
}
function b() {
    return c ? c : d;
}
var c = 4;
var d = 5;
console.log(a(3, null), a(0, 7), a(true, false), b());
