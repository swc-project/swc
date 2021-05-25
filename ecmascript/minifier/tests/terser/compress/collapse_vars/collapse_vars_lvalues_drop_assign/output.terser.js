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
    e1(), e2();
    var c = --x;
    return x - c;
}
function f6(x) {
    return e1(), e2(), --x - x;
}
function f7(x) {
    return e1(), x - (e2() - x);
}
function f8(x) {
    return e1(), x - (e2() - x);
}
function f9(x) {
    return e1(), e2() - x - x;
}
