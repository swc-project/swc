function o(n, o, t) {
    return (n = f()), (o = e()), (o = n && (t >>= 5));
}
function t() {
    return (i = f());
}
function r(n) {
    return (n = f());
}
function c() {
    var n;
    return (n = f());
}
function u(n) {
    try {
        return (n = f());
    } catch (o) {
        console.log(n);
    }
}
function l(n) {
    try {
        return (n = f());
    } finally{
        console.log(n);
    }
}
function e() {
    console.log("y");
}
function n(n) {
    var e = 0;
    f = function() {
        e += n;
        if (n < 0) throw e;
        return e;
    };
    [
        o,
        t,
        r,
        c,
        u,
        l
    ].forEach(function(n, o) {
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
n(1);
n(-1);
