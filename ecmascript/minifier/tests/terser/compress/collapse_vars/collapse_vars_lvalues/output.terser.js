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
    var a = (x -= 3);
    return x + a;
}
function f4(x) {
    var a = (x -= 3);
    return x + a;
}
function f5(x) {
    var w = e1(),
        v = e2(),
        c = (v = --x);
    return (w = x) - c;
}
function f6(x) {
    var w = e1(),
        v = e2();
    return (v = --x) - (w = x);
}
function f7(x) {
    var w = e1();
    return (w = x) - (e2() - x);
}
function f8(x) {
    var w = e1();
    return (w = x) - (e2() - x);
}
function f9(x) {
    var w = e1();
    return e2() - x - (w = x);
}
