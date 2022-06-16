function a() {
    throw (l = k());
}
function b(a) {
    throw (a = k());
}
function c() {
    var a;
    throw (a = k());
}
function d() {
    try {
        throw (l = k());
    } catch (a) {
        console.log(l);
    }
}
function e(a) {
    try {
        throw (a = k());
    } catch (b) {
        console.log(a);
    }
}
function f() {
    var a;
    try {
        throw (a = k());
    } catch (b) {
        console.log(a);
    }
}
function g() {
    try {
        throw (l = k());
    } finally{
        console.log(l);
    }
}
function h(a) {
    try {
        throw (a = k());
    } finally{
        console.log(a);
    }
}
function i() {
    var a;
    try {
        throw (a = k());
    } finally{
        console.log(a);
    }
}
function j(j) {
    var m = 0;
    k = function() {
        m += j;
        if (j < 0) throw m;
        return m;
    };
    [
        a,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        i
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
j(1);
j(-1);
