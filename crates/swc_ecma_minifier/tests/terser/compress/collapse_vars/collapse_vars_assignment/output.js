function log(x) {
    return console.log(x), x;
}
function f0(c) {
    return 3 / c;
}
function f1(c) {
    return 1 - 3 / c;
}
function f2(c) {
    return log(c = 3 / c - 7);
}
function f3(c) {
    var a = 3 / c;
    return log(c |= a - 7);
}
function f4(c) {
    return log(2 + 3 / c);
}
function f5(c) {
    return log(2 + 3 / c);
}
function f6(c) {
    var b = g();
    return log(b += 3 / c);
}
