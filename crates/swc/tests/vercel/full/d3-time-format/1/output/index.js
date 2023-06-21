import { _ as e } from "@swc/helpers/_/_instanceof";
import { timeDay as n, timeSunday as t, timeMonday as r, timeThursday as u, timeYear as i, utcDay as c, utcSunday as o, utcMonday as l, utcThursday as a, utcYear as f } from "d3-time";
function s(e) {
    if (0 <= e.y && e.y < 100) {
        var n = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
        return n.setFullYear(e.y), n;
    }
    return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L);
}
function g(e) {
    if (0 <= e.y && e.y < 100) {
        var n = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
        return n.setUTCFullYear(e.y), n;
    }
    return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L));
}
function h(e, n, t) {
    return {
        y: e,
        m: n,
        d: t,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
export default function v(t) {
    var u = function(n, t) {
        return function(r) {
            var u, i, c, o = [], l = -1, a = 0, f = n.length;
            for(e(r, Date) || (r = new Date(+r)); ++l < f;)37 === n.charCodeAt(l) && (o.push(n.slice(a, l)), null != (i = x[u = n.charAt(++l)]) ? u = n.charAt(++l) : i = "e" === u ? " " : "0", (c = t[u]) && (u = c(r, i)), o.push(u), a = l + 1);
            return o.push(n.slice(a, l)), o.join("");
        };
    }, i = function(e, t) {
        return function(u) {
            var i, a, f = h(1900, void 0, 1);
            if (o(f, e, u += "", 0) != u.length) return null;
            if ("Q" in f) return new Date(f.Q);
            if ("s" in f) return new Date(1000 * f.s + ("L" in f ? f.L : 0));
            if (!t || "Z" in f || (f.Z = 0), "p" in f && (f.H = f.H % 12 + 12 * f.p), void 0 === f.m && (f.m = "q" in f ? f.q : 0), "V" in f) {
                if (f.V < 1 || f.V > 53) return null;
                "w" in f || (f.w = 1), "Z" in f ? (i = (a = (i = g(h(f.y, 0, 1))).getUTCDay()) > 4 || 0 === a ? l.ceil(i) : l(i), i = c.offset(i, (f.V - 1) * 7), f.y = i.getUTCFullYear(), f.m = i.getUTCMonth(), f.d = i.getUTCDate() + (f.w + 6) % 7) : (i = (a = (i = s(h(f.y, 0, 1))).getDay()) > 4 || 0 === a ? r.ceil(i) : r(i), i = n.offset(i, (f.V - 1) * 7), f.y = i.getFullYear(), f.m = i.getMonth(), f.d = i.getDate() + (f.w + 6) % 7);
            } else ("W" in f || "U" in f) && ("w" in f || (f.w = "u" in f ? f.u % 7 : "W" in f ? 1 : 0), a = "Z" in f ? g(h(f.y, 0, 1)).getUTCDay() : s(h(f.y, 0, 1)).getDay(), f.m = 0, f.d = "W" in f ? (f.w + 6) % 7 + 7 * f.W - (a + 5) % 7 : f.w + 7 * f.U - (a + 6) % 7);
            return "Z" in f ? (f.H += f.Z / 100 | 0, f.M += f.Z % 100, g(f)) : s(f);
        };
    }, o = function(e, n, t, r) {
        for(var u, i, c = 0, o = n.length, l = t.length; c < o;){
            if (r >= l) return -1;
            if (37 === (u = n.charCodeAt(c++))) {
                if (!(i = en[(u = n.charAt(c++)) in x ? n.charAt(c++) : u]) || (r = i(e, t, r)) < 0) return -1;
            } else if (u != t.charCodeAt(r++)) return -1;
        }
        return r;
    }, a = t.dateTime, f = t.date, v = t.time, d = t.periods, m = t.days, w = t.shortDays, y = t.months, B = t.shortMonths, E = p(d), G = C(d), I = p(m), P = C(m), R = p(w), k = C(w), z = p(y), J = C(y), K = p(B), N = C(B), O = {
        c: null,
        x: null,
        X: null
    }, ee = {
        c: null,
        x: null,
        X: null
    }, en = {
        a: function(e, n, t) {
            var r = R.exec(n.slice(t));
            return r ? (e.w = k.get(r[0].toLowerCase()), t + r[0].length) : -1;
        },
        A: function(e, n, t) {
            var r = I.exec(n.slice(t));
            return r ? (e.w = P.get(r[0].toLowerCase()), t + r[0].length) : -1;
        },
        b: function(e, n, t) {
            var r = K.exec(n.slice(t));
            return r ? (e.m = N.get(r[0].toLowerCase()), t + r[0].length) : -1;
        },
        B: function(e, n, t) {
            var r = z.exec(n.slice(t));
            return r ? (e.m = J.get(r[0].toLowerCase()), t + r[0].length) : -1;
        },
        c: function(e, n, t) {
            return o(e, a, n, t);
        },
        d: W,
        e: W,
        f: _,
        g: Z,
        G: H,
        H: X,
        I: X,
        j: F,
        L: Q,
        m: V,
        M: Y,
        p: function(e, n, t) {
            var r = E.exec(n.slice(t));
            return r ? (e.p = G.get(r[0].toLowerCase()), t + r[0].length) : -1;
        },
        q: A,
        Q: $,
        s: b,
        S: q,
        u: L,
        U: M,
        V: U,
        w: D,
        W: S,
        x: function(e, n, t) {
            return o(e, f, n, t);
        },
        X: function(e, n, t) {
            return o(e, v, n, t);
        },
        y: Z,
        Y: H,
        Z: T,
        "%": j
    };
    return O.x = u(f, O), O.X = u(v, O), O.c = u(a, O), ee.x = u(f, ee), ee.X = u(v, ee), ee.c = u(a, ee), {
        format: function(e) {
            var n = u(e += "", O);
            return n.toString = function() {
                return e;
            }, n;
        },
        parse: function(e) {
            var n = i(e += "", !1);
            return n.toString = function() {
                return e;
            }, n;
        },
        utcFormat: function(e) {
            var n = u(e += "", ee);
            return n.toString = function() {
                return e;
            }, n;
        },
        utcParse: function(e) {
            var n = i(e += "", !0);
            return n.toString = function() {
                return e;
            }, n;
        }
    };
}
var x = {
    "-": "",
    _: " ",
    0: "0"
}, d = /^\s*\d+/, m = /^%/, w = /[\\^$*+?|[\]().{}]/g;
function y(e) {
    return e.replace(w, "\\$&");
}
function p(e) {
    return RegExp("^(?:" + e.map(y).join("|") + ")", "i");
}
function C(e) {
    return new Map(e.map(function(e, n) {
        return [
            e.toLowerCase(),
            n
        ];
    }));
}
function D(e, n, t) {
    var r = d.exec(n.slice(t, t + 1));
    return r ? (e.w = +r[0], t + r[0].length) : -1;
}
function L(e, n, t) {
    var r = d.exec(n.slice(t, t + 1));
    return r ? (e.u = +r[0], t + r[0].length) : -1;
}
function M(e, n, t) {
    var r = d.exec(n.slice(t, t + 2));
    return r ? (e.U = +r[0], t + r[0].length) : -1;
}
function U(e, n, t) {
    var r = d.exec(n.slice(t, t + 2));
    return r ? (e.V = +r[0], t + r[0].length) : -1;
}
function S(e, n, t) {
    var r = d.exec(n.slice(t, t + 2));
    return r ? (e.W = +r[0], t + r[0].length) : -1;
}
function H(e, n, t) {
    var r = d.exec(n.slice(t, t + 4));
    return r ? (e.y = +r[0], t + r[0].length) : -1;
}
function Z(e, n, t) {
    var r = d.exec(n.slice(t, t + 2));
    return r ? (e.y = +r[0] + (+r[0] > 68 ? 1900 : 2000), t + r[0].length) : -1;
}
function T(e, n, t) {
    var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(n.slice(t, t + 6));
    return r ? (e.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), t + r[0].length) : -1;
}
function A(e, n, t) {
    var r = d.exec(n.slice(t, t + 1));
    return r ? (e.q = 3 * r[0] - 3, t + r[0].length) : -1;
}
function V(e, n, t) {
    var r = d.exec(n.slice(t, t + 2));
    return r ? (e.m = r[0] - 1, t + r[0].length) : -1;
}
function W(e, n, t) {
    var r = d.exec(n.slice(t, t + 2));
    return r ? (e.d = +r[0], t + r[0].length) : -1;
}
function F(e, n, t) {
    var r = d.exec(n.slice(t, t + 3));
    return r ? (e.m = 0, e.d = +r[0], t + r[0].length) : -1;
}
function X(e, n, t) {
    var r = d.exec(n.slice(t, t + 2));
    return r ? (e.H = +r[0], t + r[0].length) : -1;
}
function Y(e, n, t) {
    var r = d.exec(n.slice(t, t + 2));
    return r ? (e.M = +r[0], t + r[0].length) : -1;
}
function q(e, n, t) {
    var r = d.exec(n.slice(t, t + 2));
    return r ? (e.S = +r[0], t + r[0].length) : -1;
}
function Q(e, n, t) {
    var r = d.exec(n.slice(t, t + 3));
    return r ? (e.L = +r[0], t + r[0].length) : -1;
}
function _(e, n, t) {
    var r = d.exec(n.slice(t, t + 6));
    return r ? (e.L = Math.floor(r[0] / 1000), t + r[0].length) : -1;
}
function j(e, n, t) {
    var r = m.exec(n.slice(t, t + 1));
    return r ? t + r[0].length : -1;
}
function $(e, n, t) {
    var r = d.exec(n.slice(t));
    return r ? (e.Q = +r[0], t + r[0].length) : -1;
}
function b(e, n, t) {
    var r = d.exec(n.slice(t));
    return r ? (e.s = +r[0], t + r[0].length) : -1;
}
