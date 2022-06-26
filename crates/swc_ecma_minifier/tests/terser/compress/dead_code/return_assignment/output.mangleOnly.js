function a(a, b, c) {
    return (a = i()), (b = g()), (b = a && (c >>= 5));
}
function b() {
    return (j = i());
}
function c(a) {
    return (a = i());
}
function d() {
    var a;
    return (a = i());
}
function e(a) {
    try {
        return (a = i());
    } catch (b) {
        console.log(a);
    }
}
function f(a) {
    try {
        return (a = i());
    } finally{
        console.log(a);
    }
}
function g() {
    console.log("y");
}
function h(g) {
    var h = 0;
    i = function() {
        h += g;
        if (g < 0) throw h;
        return h;
    };
    [
        a,
        b,
        c,
        d,
        e,
        f
    ].forEach(function(a, b) {
        j = null;
        try {
            b += 1;
            console.log("result " + a(10 * b, 100 * b, 1e3 * b));
        } catch (c) {
            console.log("caught " + c);
        }
        if (null !== j) console.log("e: " + j);
    });
}
var i, j;
h(1);
h(-1);
