function f0(x) {
    var i = ++x;
    return (x += i);
}
function f1(x) {
    var a = (x -= 3);
    return (x += a);
}
function f2(x) {
    var z = x,
        a = ++z;
    return (z += a);
}
function f3(x) {
    var a = (x -= 3),
        b = x + a;
    return b;
}
function f4(x) {
    var a = (x -= 3);
    return x + a;
}
function f5(x) {
    var w = e1(),
        v = e2(),
        c = (v = --x),
        b = (w = x);
    return b - c;
}
function f6(x) {
    var w = e1(),
        v = e2(),
        c = (v = --x),
        b = (w = x);
    return c - b;
}
function f7(x) {
    var w = e1(),
        v = e2(),
        c = v - x,
        b = (w = x);
    return b - c;
}
function f8(x) {
    var w = e1(),
        v = e2(),
        b = (w = x),
        c = v - x;
    return b - c;
}
function f9(x) {
    var w = e1(),
        v = e2(),
        b = (w = x),
        c = v - x;
    return c - b;
}
