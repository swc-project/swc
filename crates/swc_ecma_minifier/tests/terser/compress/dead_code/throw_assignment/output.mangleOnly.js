function t() {
    throw (w = a());
}
function o(t) {
    throw (t = a());
}
function n() {
    var t;
    throw (t = a());
}
function r() {
    try {
        throw (w = a());
    } catch (t) {
        console.log(w);
    }
}
function c(t) {
    try {
        throw (t = a());
    } catch (o) {
        console.log(t);
    }
}
function f() {
    var t;
    try {
        throw (t = a());
    } catch (o) {
        console.log(t);
    }
}
function l() {
    try {
        throw (w = a());
    } finally{
        console.log(w);
    }
}
function i(t) {
    try {
        throw (t = a());
    } finally{
        console.log(t);
    }
}
function h() {
    var t;
    try {
        throw (t = a());
    } finally{
        console.log(t);
    }
}
function u(u) {
    var y = 0;
    a = function() {
        y += u;
        if (u < 0) throw y;
        return y;
    };
    [
        t,
        o,
        n,
        r,
        c,
        f,
        l,
        i,
        h
    ].forEach(function(t, o) {
        w = null;
        try {
            t(10 * (1 + o));
        } catch (n) {
            console.log("caught " + n);
        }
        if (null !== w) console.log("a: " + w);
    });
}
var a, w;
u(1);
u(-1);
