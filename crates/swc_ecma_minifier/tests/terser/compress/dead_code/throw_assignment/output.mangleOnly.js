function o() {
    throw (w = a());
}
function n(o) {
    throw (o = a());
}
function t() {
    var o;
    throw (o = a());
}
function c() {
    try {
        throw (w = a());
    } catch (o) {
        console.log(w);
    }
}
function l(o) {
    try {
        throw (o = a());
    } catch (n) {
        console.log(o);
    }
}
function r() {
    var o;
    try {
        throw (o = a());
    } catch (n) {
        console.log(o);
    }
}
function f() {
    try {
        throw (w = a());
    } finally {
        console.log(w);
    }
}
function i(o) {
    try {
        throw (o = a());
    } finally {
        console.log(o);
    }
}
function h() {
    var o;
    try {
        throw (o = a());
    } finally {
        console.log(o);
    }
}
function u(u) {
    var y = 0;
    a = function () {
        y += u;
        if (u < 0) throw y;
        return y;
    };
    [o, n, t, c, l, r, f, i, h].forEach(function (o, n) {
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
u(1);
u(-1);
