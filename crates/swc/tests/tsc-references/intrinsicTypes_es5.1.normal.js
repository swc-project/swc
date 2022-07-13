// @strict: true
// @declaration: true
function foo1(s, x, y) {
    s = x;
    s = y;
    x = s; // Error
    x = y;
    y = s; // Error
    y = x; // Error
}
function foo2(x) {
    var s = x;
}
function foo4(x) {
    return foo3(x);
}
