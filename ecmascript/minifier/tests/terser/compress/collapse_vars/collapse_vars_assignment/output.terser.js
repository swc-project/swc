function log(x) {
    return console.log(x), x;
}
function f0(c) {
    var a = 3 / c;
    return (a = a);
}
function f1(c) {
    return 1 - 3 / c;
}
function f2(c) {
    return log((c = 3 / c - 7));
}
function f3(c) {
    return log((c |= 3 / c - 7));
}
function f4(c) {
    var b = 2;
    return log((b += 3 / c));
}
function f5(c) {
    var b = 2;
    return log((b += 3 / c));
}
function f6(c) {
    var b = g();
    return log((b += 3 / c));
}
