function n(n) {
    return console.log(n), n;
}
function r(n) {
    var r = 3 / n;
    return (r = r);
}
function t(n) {
    const r = 3 / n;
    const t = 1 - r;
    return t;
}
function u(r) {
    var t = 3 / r;
    var u = t - 7;
    return n((r = u));
}
function o(r) {
    var t = 3 / r;
    var u = t - 7;
    return n((r |= u));
}
function a(r) {
    var t = 3 / r;
    var u = 2;
    return n((u += t));
}
function c(r) {
    var t = 2;
    var u = 3 / r;
    return n((t += u));
}
function v(r) {
    var t = g();
    var u = 3 / r;
    return n((t += u));
}
