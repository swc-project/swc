function f0(o, a, h) {
    var b = 3 - a;
    var obj = o;
    var seven = 7;
    var prop = "run";
    var t = (obj[prop](b)[seven] = h);
    return t;
}
function f1(x) {
    var y = 5 - x;
    return y;
}
function f2(x) {
    const z = foo(),
        y = z / (5 - x);
    return y;
}
function f3(x) {
    var z = foo(),
        y = (5 - x) / z;
    return y;
}
function f4(x) {
    var z = foo(),
        y = (5 - u) / z;
    return y;
}
function f5(x) {
    const z = foo(),
        y = (5 - window.x) / z;
    return y;
}
function f6() {
    var b = window.a * window.z;
    return b && zap();
}
function f7() {
    var b = window.a * window.z;
    return b + b;
}
function f8() {
    var b = window.a * window.z;
    var c = b + 5;
    return b + c;
}
function f9() {
    var b = window.a * window.z;
    return bar() || b;
}
function f10(x) {
    var a = 5,
        b = 3;
    return (a += b);
}
function f11(x) {
    var a = 5,
        b = 3;
    return (a += --b);
}
