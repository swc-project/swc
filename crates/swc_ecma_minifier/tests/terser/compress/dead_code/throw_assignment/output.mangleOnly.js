function n() {
    throw (w = a());
}
function t(o) {
    throw (o = a());
}
function c() {
    var o;
    throw (o = a());
}
function l() {
    try {
        throw (w = a());
    } catch (o) {
        console.log(w);
    }
}
function r(o) {
    try {
        throw (o = a());
    } catch (n) {
        console.log(o);
    }
}
function f() {
    var o;
    try {
        throw (o = a());
    } catch (n) {
        console.log(o);
    }
}
function i() {
    try {
        throw (w = a());
    } finally{
        console.log(w);
    }
}
function h(o) {
    try {
        throw (o = a());
    } finally{
        console.log(o);
    }
}
function u() {
    var o;
    try {
        throw (o = a());
    } finally{
        console.log(o);
    }
}
function o(o) {
    var y = 0;
    a = function() {
        y += o;
        if (o < 0) throw y;
        return y;
    };
    [
        n,
        t,
        c,
        l,
        r,
        f,
        i,
        h,
        u
    ].forEach(function(o, n) {
        w = null;
        try {
            o(10 * (1 + n));
        } catch (o) {
            console.log("caught " + o);
        }
        if (null !== w) console.log("a: " + w);
    });
}
var a, w;
o(1);
o(-1);
