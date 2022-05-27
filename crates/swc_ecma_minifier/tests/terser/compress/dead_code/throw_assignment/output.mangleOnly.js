function b() {
    throw (l = k());
}
function c(a) {
    throw (a = k());
}
function d() {
    var a;
    throw (a = k());
}
function e() {
    try {
        throw (l = k());
    } catch (a) {
        console.log(l);
    }
}
function f(a) {
    try {
        throw (a = k());
    } catch (b) {
        console.log(a);
    }
}
function g() {
    var a;
    try {
        throw (a = k());
    } catch (b) {
        console.log(a);
    }
}
function h() {
    try {
        throw (l = k());
    } finally{
        console.log(l);
    }
}
function i(a) {
    try {
        throw (a = k());
    } finally{
        console.log(a);
    }
}
function j() {
    var a;
    try {
        throw (a = k());
    } finally{
        console.log(a);
    }
}
function a(a) {
    var m = 0;
    k = function() {
        m += a;
        if (a < 0) throw m;
        return m;
    };
    [
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        i,
        j
    ].forEach(function(a, b) {
        l = null;
        try {
            a(10 * (1 + b));
        } catch (c) {
            console.log("caught " + c);
        }
        if (null !== l) console.log("a: " + l);
    });
}
var k, l;
a(1);
a(-1);
