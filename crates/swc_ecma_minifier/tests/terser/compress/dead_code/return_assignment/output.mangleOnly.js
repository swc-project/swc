function n(n, o, t) {
    return (n = f()), (o = l()), (o = n && (t >>= 5));
}
function o() {
    return (i = f());
}
function t(n) {
    return (n = f());
}
function r() {
    var n;
    return (n = f());
}
function c(n) {
    try {
        return (n = f());
    } catch (o) {
        console.log(n);
    }
}
function u(n) {
    try {
        return (n = f());
    } finally {
        console.log(n);
    }
}
function l() {
    console.log("y");
}
function e(l) {
    var e = 0;
    f = function () {
        e += l;
        if (l < 0) throw e;
        return e;
    };
    [n, o, t, r, c, u].forEach(function (n, o) {
        i = null;
        try {
            o += 1;
            console.log("result " + n(10 * o, 100 * o, 1e3 * o));
        } catch (n) {
            console.log("caught " + n);
        }
        if (null !== i) console.log("e: " + i);
    });
}
var f, i;
e(1);
e(-1);
