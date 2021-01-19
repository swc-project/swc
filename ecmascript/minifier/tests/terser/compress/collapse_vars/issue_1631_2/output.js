function f() {
    return (a = 2), 4;
}
function g() {
    var t = f();
    return (b = a + t);
}
var a = 0,
    b = 1;
console.log(g());
