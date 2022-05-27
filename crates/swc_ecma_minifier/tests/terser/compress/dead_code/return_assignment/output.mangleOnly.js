function b(a, b, c) {
    return (a = i()), (b = h()), (b = a && (c >>= 5));
}
function c() {
    return (j = i());
}
function d(a) {
    return (a = i());
}
function e() {
    var a;
    return (a = i());
}
function f(a) {
    try {
        return (a = i());
    } catch (b) {
        console.log(a);
    }
}
function g(a) {
    try {
        return (a = i());
    } finally{
        console.log(a);
    }
}
function h() {
    console.log("y");
}
function a(a) {
    var h = 0;
    i = function() {
        h += a;
        if (a < 0) throw h;
        return h;
    };
    [
        b,
        c,
        d,
        e,
        f,
        g
    ].forEach(function(b, a) {
        j = null;
        try {
            a += 1;
            console.log("result " + b(10 * a, 100 * a, 1e3 * a));
        } catch (c) {
            console.log("caught " + c);
        }
        if (null !== j) console.log("e: " + j);
    });
}
var i, j;
a(1);
a(-1);
