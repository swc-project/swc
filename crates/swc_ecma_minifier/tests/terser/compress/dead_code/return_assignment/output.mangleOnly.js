function n(n, t, r) {
    return (n = l()), (t = f()), (t = n && (r >>= 5));
}
function t() {
    return (e = l());
}
function r(n) {
    return (n = l());
}
function u() {
    var n;
    return (n = l());
}
function o(n) {
    try {
        return (n = l());
    } catch (t) {
        console.log(n);
    }
}
function c(n) {
    try {
        return (n = l());
    } finally{
        console.log(n);
    }
}
function f() {
    console.log("y");
}
function i(f) {
    var i = 0;
    l = function() {
        i += f;
        if (f < 0) throw i;
        return i;
    };
    [
        n,
        t,
        r,
        u,
        o,
        c
    ].forEach(function(n, t) {
        e = null;
        try {
            t += 1;
            console.log("result " + n(10 * t, 100 * t, 1e3 * t));
        } catch (r) {
            console.log("caught " + r);
        }
        if (null !== e) console.log("e: " + e);
    });
}
var l, e;
i(1);
i(-1);
