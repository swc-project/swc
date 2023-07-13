import { _ as n } from "@swc/helpers/_/_instanceof";
import { timeDay as t, timeSunday as e, timeMonday as r, timeThursday as u, timeYear as c, utcDay as i, utcSunday as o, utcMonday as f, utcThursday as a, utcYear as l } from "d3-time";
function g(g) {
    if (0 <= g.y && g.y < 100) {
        var s = new Date(-1, g.m, g.d, g.H, g.M, g.S, g.L);
        return s.setFullYear(g.y), s;
    }
    return new Date(g.y, g.m, g.d, g.H, g.M, g.S, g.L);
}
function s(g) {
    if (0 <= g.y && g.y < 100) {
        var s = new Date(Date.UTC(-1, g.m, g.d, g.H, g.M, g.S, g.L));
        return s.setUTCFullYear(g.y), s;
    }
    return new Date(Date.UTC(g.y, g.m, g.d, g.H, g.M, g.S, g.L));
}
function h(g, s, h) {
    return {
        y: g,
        m: s,
        d: h,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
export default function v(v) {
    var C = function(t, e) {
        return function(r) {
            var u, c, i, o = [], f = -1, a = 0, l = t.length;
            for(n(r, Date) || (r = new Date(+r)); ++f < l;)37 === t.charCodeAt(f) && (o.push(t.slice(a, f)), null != (c = y[u = t.charAt(++f)]) ? u = t.charAt(++f) : c = "e" === u ? " " : "0", (i = e[u]) && (u = i(r, c)), o.push(u), a = f + 1);
            return o.push(t.slice(a, f)), o.join("");
        };
    }, U = function(n, e) {
        return function(u) {
            var c, o, a = h(1900, void 0, 1);
            if (d(a, n, u += "", 0) != u.length) return null;
            if ("Q" in a) return new Date(a.Q);
            if ("s" in a) return new Date(1000 * a.s + ("L" in a ? a.L : 0));
            if (!e || "Z" in a || (a.Z = 0), "p" in a && (a.H = a.H % 12 + 12 * a.p), void 0 === a.m && (a.m = "q" in a ? a.q : 0), "V" in a) {
                if (a.V < 1 || a.V > 53) return null;
                "w" in a || (a.w = 1), "Z" in a ? (c = (o = (c = s(h(a.y, 0, 1))).getUTCDay()) > 4 || 0 === o ? f.ceil(c) : f(c), c = i.offset(c, (a.V - 1) * 7), a.y = c.getUTCFullYear(), a.m = c.getUTCMonth(), a.d = c.getUTCDate() + (a.w + 6) % 7) : (c = (o = (c = g(h(a.y, 0, 1))).getDay()) > 4 || 0 === o ? r.ceil(c) : r(c), c = t.offset(c, (a.V - 1) * 7), a.y = c.getFullYear(), a.m = c.getMonth(), a.d = c.getDate() + (a.w + 6) % 7);
            } else ("W" in a || "U" in a) && ("w" in a || (a.w = "u" in a ? a.u % 7 : "W" in a ? 1 : 0), o = "Z" in a ? s(h(a.y, 0, 1)).getUTCDay() : g(h(a.y, 0, 1)).getDay(), a.m = 0, a.d = "W" in a ? (a.w + 6) % 7 + 7 * a.W - (o + 5) % 7 : a.w + 7 * a.U - (o + 6) % 7);
            return "Z" in a ? (a.H += a.Z / 100 | 0, a.M += a.Z % 100, s(a)) : g(a);
        };
    }, d = function(n, t, e, r) {
        for(var u, c, i = 0, o = t.length, f = e.length; i < o;){
            if (r >= f) return -1;
            if (37 === (u = t.charCodeAt(i++))) {
                if (!(c = nP[(u = t.charAt(i++)) in y ? t.charAt(i++) : u]) || (r = c(n, e, r)) < 0) return -1;
            } else if (u != e.charCodeAt(r++)) return -1;
        }
        return r;
    }, D = v.dateTime, x = v.date, nn = v.time, nx = v.periods, nA = v.days, nV = v.shortDays, nW = v.months, nj = v.shortMonths, nq = T(nx), nQ = m(nx), nX = T(nA), n_ = m(nA), nb = T(nV), nB = m(nV), nG = T(nW), nI = m(nW), n$ = T(nj), nz = m(nj), nE = {
        a: function(n) {
            return nV[n.getDay()];
        },
        A: function(n) {
            return nA[n.getDay()];
        },
        b: function(n) {
            return nj[n.getMonth()];
        },
        B: function(n) {
            return nW[n.getMonth()];
        },
        c: null,
        d: I,
        e: I,
        f: P,
        g: nc,
        G: no,
        H: $,
        I: z,
        j: E,
        L: O,
        m: R,
        M: k,
        p: function(n) {
            return nx[+(n.getHours() >= 12)];
        },
        q: function(n) {
            return 1 + ~~(n.getMonth() / 3);
        },
        Q: nF,
        s: nZ,
        S: J,
        u: K,
        U: N,
        V: nt,
        w: ne,
        W: nr,
        x: null,
        X: null,
        y: nu,
        Y: ni,
        Z: nf,
        "%": nY
    }, nO = {
        a: function(n) {
            return nV[n.getUTCDay()];
        },
        A: function(n) {
            return nA[n.getUTCDay()];
        },
        b: function(n) {
            return nj[n.getUTCMonth()];
        },
        B: function(n) {
            return nW[n.getUTCMonth()];
        },
        c: null,
        d: na,
        e: na,
        f: nv,
        g: np,
        G: nL,
        H: nl,
        I: ng,
        j: ns,
        L: nh,
        m: ny,
        M: nC,
        p: function(n) {
            return nx[+(n.getUTCHours() >= 12)];
        },
        q: function(n) {
            return 1 + ~~(n.getUTCMonth() / 3);
        },
        Q: nF,
        s: nZ,
        S: nU,
        u: nd,
        U: nD,
        V: nT,
        w: nm,
        W: nw,
        x: null,
        X: null,
        y: nM,
        Y: nH,
        Z: nS,
        "%": nY
    }, nP = {
        a: function(n, t, e) {
            var r = nb.exec(t.slice(e));
            return r ? (n.w = nB.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        A: function(n, t, e) {
            var r = nX.exec(t.slice(e));
            return r ? (n.w = n_.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        b: function(n, t, e) {
            var r = n$.exec(t.slice(e));
            return r ? (n.m = nz.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        B: function(n, t, e) {
            var r = nG.exec(t.slice(e));
            return r ? (n.m = nI.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        c: function(n, t, e) {
            return d(n, D, t, e);
        },
        d: V,
        e: V,
        f: _,
        g: Y,
        G: S,
        H: j,
        I: j,
        j: W,
        L: X,
        m: A,
        M: q,
        p: function(n, t, e) {
            var r = nq.exec(t.slice(e));
            return r ? (n.p = nQ.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        q: Z,
        Q: B,
        s: G,
        S: Q,
        u: M,
        U: p,
        V: H,
        w: w,
        W: L,
        x: function(n, t, e) {
            return d(n, x, t, e);
        },
        X: function(n, t, e) {
            return d(n, nn, t, e);
        },
        y: Y,
        Y: S,
        Z: F,
        "%": b
    };
    return nE.x = C(x, nE), nE.X = C(nn, nE), nE.c = C(D, nE), nO.x = C(x, nO), nO.X = C(nn, nO), nO.c = C(D, nO), {
        format: function(n) {
            var t = C(n += "", nE);
            return t.toString = function() {
                return n;
            }, t;
        },
        parse: function(n) {
            var t = U(n += "", !1);
            return t.toString = function() {
                return n;
            }, t;
        },
        utcFormat: function(n) {
            var t = C(n += "", nO);
            return t.toString = function() {
                return n;
            }, t;
        },
        utcParse: function(n) {
            var t = U(n += "", !0);
            return t.toString = function() {
                return n;
            }, t;
        }
    };
}
var y = {
    "-": "",
    _: " ",
    0: "0"
}, C = /^\s*\d+/, U = /^%/, d = /[\\^$*+?|[\]().{}]/g;
function D(g, s, h) {
    var v = g < 0 ? "-" : "", y = (v ? -g : g) + "", C = y.length;
    return v + (C < h ? Array(h - C + 1).join(s) + y : y);
}
function x(g) {
    return g.replace(d, "\\$&");
}
function T(g) {
    return RegExp("^(?:" + g.map(x).join("|") + ")", "i");
}
function m(g) {
    return new Map(g.map(function(n, t) {
        return [
            n.toLowerCase(),
            t
        ];
    }));
}
function w(g, s, h) {
    var v = C.exec(s.slice(h, h + 1));
    return v ? (g.w = +v[0], h + v[0].length) : -1;
}
function M(g, s, h) {
    var v = C.exec(s.slice(h, h + 1));
    return v ? (g.u = +v[0], h + v[0].length) : -1;
}
function p(g, s, h) {
    var v = C.exec(s.slice(h, h + 2));
    return v ? (g.U = +v[0], h + v[0].length) : -1;
}
function H(g, s, h) {
    var v = C.exec(s.slice(h, h + 2));
    return v ? (g.V = +v[0], h + v[0].length) : -1;
}
function L(g, s, h) {
    var v = C.exec(s.slice(h, h + 2));
    return v ? (g.W = +v[0], h + v[0].length) : -1;
}
function S(g, s, h) {
    var v = C.exec(s.slice(h, h + 4));
    return v ? (g.y = +v[0], h + v[0].length) : -1;
}
function Y(g, s, h) {
    var v = C.exec(s.slice(h, h + 2));
    return v ? (g.y = +v[0] + (+v[0] > 68 ? 1900 : 2000), h + v[0].length) : -1;
}
function F(g, s, h) {
    var v = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(s.slice(h, h + 6));
    return v ? (g.Z = v[1] ? 0 : -(v[2] + (v[3] || "00")), h + v[0].length) : -1;
}
function Z(g, s, h) {
    var v = C.exec(s.slice(h, h + 1));
    return v ? (g.q = 3 * v[0] - 3, h + v[0].length) : -1;
}
function A(g, s, h) {
    var v = C.exec(s.slice(h, h + 2));
    return v ? (g.m = v[0] - 1, h + v[0].length) : -1;
}
function V(g, s, h) {
    var v = C.exec(s.slice(h, h + 2));
    return v ? (g.d = +v[0], h + v[0].length) : -1;
}
function W(g, s, h) {
    var v = C.exec(s.slice(h, h + 3));
    return v ? (g.m = 0, g.d = +v[0], h + v[0].length) : -1;
}
function j(g, s, h) {
    var v = C.exec(s.slice(h, h + 2));
    return v ? (g.H = +v[0], h + v[0].length) : -1;
}
function q(g, s, h) {
    var v = C.exec(s.slice(h, h + 2));
    return v ? (g.M = +v[0], h + v[0].length) : -1;
}
function Q(g, s, h) {
    var v = C.exec(s.slice(h, h + 2));
    return v ? (g.S = +v[0], h + v[0].length) : -1;
}
function X(g, s, h) {
    var v = C.exec(s.slice(h, h + 3));
    return v ? (g.L = +v[0], h + v[0].length) : -1;
}
function _(g, s, h) {
    var v = C.exec(s.slice(h, h + 6));
    return v ? (g.L = Math.floor(v[0] / 1000), h + v[0].length) : -1;
}
function b(g, s, h) {
    var v = U.exec(s.slice(h, h + 1));
    return v ? h + v[0].length : -1;
}
function B(g, s, h) {
    var v = C.exec(s.slice(h));
    return v ? (g.Q = +v[0], h + v[0].length) : -1;
}
function G(g, s, h) {
    var v = C.exec(s.slice(h));
    return v ? (g.s = +v[0], h + v[0].length) : -1;
}
function I(g, s) {
    return D(g.getDate(), s, 2);
}
function $(g, s) {
    return D(g.getHours(), s, 2);
}
function z(g, s) {
    return D(g.getHours() % 12 || 12, s, 2);
}
function E(g, s) {
    return D(1 + t.count(c(g), g), s, 3);
}
function O(g, s) {
    return D(g.getMilliseconds(), s, 3);
}
function P(g, s) {
    return O(g, s) + "000";
}
function R(g, s) {
    return D(g.getMonth() + 1, s, 2);
}
function k(g, s) {
    return D(g.getMinutes(), s, 2);
}
function J(g, s) {
    return D(g.getSeconds(), s, 2);
}
function K(g) {
    var s = g.getDay();
    return 0 === s ? 7 : s;
}
function N(g, s) {
    return D(e.count(c(g) - 1, g), s, 2);
}
function nn(g) {
    var s = g.getDay();
    return s >= 4 || 0 === s ? u(g) : u.ceil(g);
}
function nt(g, s) {
    return g = nn(g), D(u.count(c(g), g) + (4 === c(g).getDay()), s, 2);
}
function ne(g) {
    return g.getDay();
}
function nr(g, s) {
    return D(r.count(c(g) - 1, g), s, 2);
}
function nu(g, s) {
    return D(g.getFullYear() % 100, s, 2);
}
function nc(g, s) {
    return D((g = nn(g)).getFullYear() % 100, s, 2);
}
function ni(g, s) {
    return D(g.getFullYear() % 10000, s, 4);
}
function no(g, s) {
    var h = g.getDay();
    return g = h >= 4 || 0 === h ? u(g) : u.ceil(g), D(g.getFullYear() % 10000, s, 4);
}
function nf(g) {
    var s = g.getTimezoneOffset();
    return (s > 0 ? "-" : (s *= -1, "+")) + D(s / 60 | 0, "0", 2) + D(s % 60, "0", 2);
}
function na(g, s) {
    return D(g.getUTCDate(), s, 2);
}
function nl(g, s) {
    return D(g.getUTCHours(), s, 2);
}
function ng(g, s) {
    return D(g.getUTCHours() % 12 || 12, s, 2);
}
function ns(g, s) {
    return D(1 + i.count(l(g), g), s, 3);
}
function nh(g, s) {
    return D(g.getUTCMilliseconds(), s, 3);
}
function nv(g, s) {
    return nh(g, s) + "000";
}
function ny(g, s) {
    return D(g.getUTCMonth() + 1, s, 2);
}
function nC(g, s) {
    return D(g.getUTCMinutes(), s, 2);
}
function nU(g, s) {
    return D(g.getUTCSeconds(), s, 2);
}
function nd(g) {
    var s = g.getUTCDay();
    return 0 === s ? 7 : s;
}
function nD(g, s) {
    return D(o.count(l(g) - 1, g), s, 2);
}
function nx(g) {
    var s = g.getUTCDay();
    return s >= 4 || 0 === s ? a(g) : a.ceil(g);
}
function nT(g, s) {
    return g = nx(g), D(a.count(l(g), g) + (4 === l(g).getUTCDay()), s, 2);
}
function nm(g) {
    return g.getUTCDay();
}
function nw(g, s) {
    return D(f.count(l(g) - 1, g), s, 2);
}
function nM(g, s) {
    return D(g.getUTCFullYear() % 100, s, 2);
}
function np(g, s) {
    return D((g = nx(g)).getUTCFullYear() % 100, s, 2);
}
function nH(g, s) {
    return D(g.getUTCFullYear() % 10000, s, 4);
}
function nL(g, s) {
    var h = g.getUTCDay();
    return g = h >= 4 || 0 === h ? a(g) : a.ceil(g), D(g.getUTCFullYear() % 10000, s, 4);
}
function nS() {
    return "+0000";
}
function nY() {
    return "%";
}
function nF(g) {
    return +g;
}
function nZ(g) {
    return Math.floor(+g / 1000);
}
