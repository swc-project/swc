function log(x) {
    return console.log(x), x;
}
function f0(c) {
    var a = 3 / c;
    return (a = a);
}
function f1(c) {
    const a = 3 / c;
    const b = 1 - a;
    return b;
}
function f2(c) {
    var a = 3 / c;
    var b = a - 7;
    return log((c = b));
}
function f3(c) {
    var a = 3 / c;
    var b = a - 7;
    return log((c |= b));
}
function f4(c) {
    var a = 3 / c;
    var b = 2;
    return log((b += a));
}
function f5(c) {
    var b = 2;
    var a = 3 / c;
    return log((b += a));
}
function f6(c) {
    var b = g();
    var a = 3 / c;
    return log((b += a));
}
