function f0(x) {
    foo();
    return bar() || x;
}
function f1(x) {
    foo();
    return bar() && x;
}
function f2(x) {
    var a = foo(),
        b = bar();
    return x && a && b;
}
function f3(x) {
    var a = foo();
    bar();
    return a && x;
}
function f4(x) {
    var a = foo(),
        b = bar();
    return a && x && b;
}
function f5(x) {
    var a = foo(),
        b = bar();
    return x || a || b;
}
function f6(x) {
    var a = foo(),
        b = bar();
    return a || x || b;
}
function f7(x) {
    var a = foo(),
        b = bar();
    return a && b && x;
}
function f8(x, y) {
    var a = foo(),
        b = bar();
    return (x || a) && (y || b);
}
function f9(x, y) {
    var a = foo(),
        b = bar();
    return (x && a) || (y && b);
}
function f10(x, y) {
    var a = foo(),
        b = bar();
    return x - a || y - b;
}
function f11(x, y) {
    var a = foo();
    return x - bar() || y - a;
}
function f12(x, y) {
    var a = foo(),
        b = bar();
    return x - y || b - a;
}
function f13(x, y) {
    return foo() - bar() || x - y;
}
function f14(x, y) {
    var a = foo();
    return bar() - a || x - y;
}
