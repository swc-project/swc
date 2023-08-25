import { _ as n } from "@swc/helpers/_/_instanceof";
import { timeDay as t, timeSunday as e, timeMonday as r, timeThursday as u, timeYear as c, utcDay as i, utcSunday as o, utcMonday as f, utcThursday as a, utcYear as l } from "d3-time";
function g(n) {
    if (0 <= n.y && n.y < 100) {
        var t = new Date(-1, n.m, n.d, n.H, n.M, n.S, n.L);
        return t.setFullYear(n.y), t;
    }
    return new Date(n.y, n.m, n.d, n.H, n.M, n.S, n.L);
}
function s(n) {
    if (0 <= n.y && n.y < 100) {
        var t = new Date(Date.UTC(-1, n.m, n.d, n.H, n.M, n.S, n.L));
        return t.setUTCFullYear(n.y), t;
    }
    return new Date(Date.UTC(n.y, n.m, n.d, n.H, n.M, n.S, n.L));
}
function h(n, t, e) {
    return {
        y: n,
        m: t,
        d: e,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
export default function v(e) {
    var u = function(t, e) {
        return function(r) {
            var u, c, i, o = [], f = -1, a = 0, l = t.length;
            for(n(r, Date) || (r = new Date(+r)); ++f < l;)37 === t.charCodeAt(f) && (o.push(t.slice(a, f)), null != (c = y[u = t.charAt(++f)]) ? u = t.charAt(++f) : c = "e" === u ? " " : "0", (i = e[u]) && (u = i(r, c)), o.push(u), a = f + 1);
            return o.push(t.slice(a, f)), o.join("");
        };
    }, c = function(n, e) {
        return function(u) {
            var c, a, l = h(1900, void 0, 1);
            if (o(l, n, u += "", 0) != u.length) return null;
            // If a UNIX timestamp is specified, return it.
            if ("Q" in l) return new Date(l.Q);
            if ("s" in l) return new Date(1000 * l.s + ("L" in l ? l.L : 0));
            // Convert day-of-week and week-of-year to day-of-year.
            if (!e || "Z" in l || (l.Z = 0), "p" in l && (l.H = l.H % 12 + 12 * l.p), void 0 === l.m && (l.m = "q" in l ? l.q : 0), "V" in l) {
                if (l.V < 1 || l.V > 53) return null;
                "w" in l || (l.w = 1), "Z" in l ? (c = (a = (c = s(h(l.y, 0, 1))).getUTCDay()) > 4 || 0 === a ? f.ceil(c) : f(c), c = i.offset(c, (l.V - 1) * 7), l.y = c.getUTCFullYear(), l.m = c.getUTCMonth(), l.d = c.getUTCDate() + (l.w + 6) % 7) : (c = (a = (c = g(h(l.y, 0, 1))).getDay()) > 4 || 0 === a ? r.ceil(c) : r(c), c = t.offset(c, (l.V - 1) * 7), l.y = c.getFullYear(), l.m = c.getMonth(), l.d = c.getDate() + (l.w + 6) % 7);
            } else ("W" in l || "U" in l) && ("w" in l || (l.w = "u" in l ? l.u % 7 : "W" in l ? 1 : 0), a = "Z" in l ? s(h(l.y, 0, 1)).getUTCDay() : g(h(l.y, 0, 1)).getDay(), l.m = 0, l.d = "W" in l ? (l.w + 6) % 7 + 7 * l.W - (a + 5) % 7 : l.w + 7 * l.U - (a + 6) % 7);
            return(// If a time zone is specified, all fields are interpreted as UTC and then
            // offset according to the specified time zone.
            "Z" in l ? (l.H += l.Z / 100 | 0, l.M += l.Z % 100, s(l)) : g(l));
        };
    }, o = function(n, t, e, r) {
        for(var u, c, i = 0, o = t.length, f = e.length; i < o;){
            if (r >= f) return -1;
            if (37 === (u = t.charCodeAt(i++))) {
                if (!(c = nG[(u = t.charAt(i++)) in y ? t.charAt(i++) : u]) || (r = c(n, e, r)) < 0) return -1;
            } else if (u != e.charCodeAt(r++)) return -1;
        }
        return r;
    }, a = e.dateTime, l = e.date, v = e.time, C = e.periods, U = e.days, d = e.shortDays, D = e.months, x = e.shortMonths, nn = T(C), nx = m(C), nA = T(U), nV = m(U), nW = T(d), nj = m(d), nq = T(D), nQ = m(D), nX = T(x), n_ = m(x), nb = {
        a: function(n) {
            return d[n.getDay()];
        },
        A: function(n) {
            return U[n.getDay()];
        },
        b: function(n) {
            return x[n.getMonth()];
        },
        B: function(n) {
            return D[n.getMonth()];
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
            return C[+(n.getHours() >= 12)];
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
    }, nB = {
        a: function(n) {
            return d[n.getUTCDay()];
        },
        A: function(n) {
            return U[n.getUTCDay()];
        },
        b: function(n) {
            return x[n.getUTCMonth()];
        },
        B: function(n) {
            return D[n.getUTCMonth()];
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
            return C[+(n.getUTCHours() >= 12)];
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
    }, nG = {
        a: function(n, t, e) {
            var r = nW.exec(t.slice(e));
            return r ? (n.w = nj.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        A: function(n, t, e) {
            var r = nA.exec(t.slice(e));
            return r ? (n.w = nV.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        b: function(n, t, e) {
            var r = nX.exec(t.slice(e));
            return r ? (n.m = n_.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        B: function(n, t, e) {
            var r = nq.exec(t.slice(e));
            return r ? (n.m = nQ.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        c: function(n, t, e) {
            return o(n, a, t, e);
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
            var r = nn.exec(t.slice(e));
            return r ? (n.p = nx.get(r[0].toLowerCase()), e + r[0].length) : -1;
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
            return o(n, l, t, e);
        },
        X: function(n, t, e) {
            return o(n, v, t, e);
        },
        y: Y,
        Y: S,
        Z: F,
        "%": b
    };
    return(// These recursive directive definitions must be deferred.
    nb.x = u(l, nb), nb.X = u(v, nb), nb.c = u(a, nb), nB.x = u(l, nB), nB.X = u(v, nB), nB.c = u(a, nB), {
        format: function(n) {
            var t = u(n += "", nb);
            return t.toString = function() {
                return n;
            }, t;
        },
        parse: function(n) {
            var t = c(n += "", !1);
            return t.toString = function() {
                return n;
            }, t;
        },
        utcFormat: function(n) {
            var t = u(n += "", nB);
            return t.toString = function() {
                return n;
            }, t;
        },
        utcParse: function(n) {
            var t = c(n += "", !0);
            return t.toString = function() {
                return n;
            }, t;
        }
    });
}
var y = {
    "-": "",
    _: " ",
    0: "0"
}, C = /^\s*\d+/, U = /^%/, d = /[\\^$*+?|[\]().{}]/g;
function D(n, t, e) {
    var r = n < 0 ? "-" : "", u = (r ? -n : n) + "", c = u.length;
    return r + (c < e ? Array(e - c + 1).join(t) + u : u);
}
function x(n) {
    return n.replace(d, "\\$&");
}
function T(n) {
    return RegExp("^(?:" + n.map(x).join("|") + ")", "i");
}
function m(n) {
    return new Map(n.map(function(n, t) {
        return [
            n.toLowerCase(),
            t
        ];
    }));
}
function w(n, t, e) {
    var r = C.exec(t.slice(e, e + 1));
    return r ? (n.w = +r[0], e + r[0].length) : -1;
}
function M(n, t, e) {
    var r = C.exec(t.slice(e, e + 1));
    return r ? (n.u = +r[0], e + r[0].length) : -1;
}
function p(n, t, e) {
    var r = C.exec(t.slice(e, e + 2));
    return r ? (n.U = +r[0], e + r[0].length) : -1;
}
function H(n, t, e) {
    var r = C.exec(t.slice(e, e + 2));
    return r ? (n.V = +r[0], e + r[0].length) : -1;
}
function L(n, t, e) {
    var r = C.exec(t.slice(e, e + 2));
    return r ? (n.W = +r[0], e + r[0].length) : -1;
}
function S(n, t, e) {
    var r = C.exec(t.slice(e, e + 4));
    return r ? (n.y = +r[0], e + r[0].length) : -1;
}
function Y(n, t, e) {
    var r = C.exec(t.slice(e, e + 2));
    return r ? (n.y = +r[0] + (+r[0] > 68 ? 1900 : 2000), e + r[0].length) : -1;
}
function F(n, t, e) {
    var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(e, e + 6));
    return r ? (n.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), e + r[0].length) : -1;
}
function Z(n, t, e) {
    var r = C.exec(t.slice(e, e + 1));
    return r ? (n.q = 3 * r[0] - 3, e + r[0].length) : -1;
}
function A(n, t, e) {
    var r = C.exec(t.slice(e, e + 2));
    return r ? (n.m = r[0] - 1, e + r[0].length) : -1;
}
function V(n, t, e) {
    var r = C.exec(t.slice(e, e + 2));
    return r ? (n.d = +r[0], e + r[0].length) : -1;
}
function W(n, t, e) {
    var r = C.exec(t.slice(e, e + 3));
    return r ? (n.m = 0, n.d = +r[0], e + r[0].length) : -1;
}
function j(n, t, e) {
    var r = C.exec(t.slice(e, e + 2));
    return r ? (n.H = +r[0], e + r[0].length) : -1;
}
function q(n, t, e) {
    var r = C.exec(t.slice(e, e + 2));
    return r ? (n.M = +r[0], e + r[0].length) : -1;
}
function Q(n, t, e) {
    var r = C.exec(t.slice(e, e + 2));
    return r ? (n.S = +r[0], e + r[0].length) : -1;
}
function X(n, t, e) {
    var r = C.exec(t.slice(e, e + 3));
    return r ? (n.L = +r[0], e + r[0].length) : -1;
}
function _(n, t, e) {
    var r = C.exec(t.slice(e, e + 6));
    return r ? (n.L = Math.floor(r[0] / 1000), e + r[0].length) : -1;
}
function b(n, t, e) {
    var r = U.exec(t.slice(e, e + 1));
    return r ? e + r[0].length : -1;
}
function B(n, t, e) {
    var r = C.exec(t.slice(e));
    return r ? (n.Q = +r[0], e + r[0].length) : -1;
}
function G(n, t, e) {
    var r = C.exec(t.slice(e));
    return r ? (n.s = +r[0], e + r[0].length) : -1;
}
function I(n, t) {
    return D(n.getDate(), t, 2);
}
function $(n, t) {
    return D(n.getHours(), t, 2);
}
function z(n, t) {
    return D(n.getHours() % 12 || 12, t, 2);
}
function E(n, e) {
    return D(1 + t.count(c(n), n), e, 3);
}
function O(n, t) {
    return D(n.getMilliseconds(), t, 3);
}
function P(n, t) {
    return O(n, t) + "000";
}
function R(n, t) {
    return D(n.getMonth() + 1, t, 2);
}
function k(n, t) {
    return D(n.getMinutes(), t, 2);
}
function J(n, t) {
    return D(n.getSeconds(), t, 2);
}
function K(n) {
    var t = n.getDay();
    return 0 === t ? 7 : t;
}
function N(n, t) {
    return D(e.count(c(n) - 1, n), t, 2);
}
function nn(n) {
    var t = n.getDay();
    return t >= 4 || 0 === t ? u(n) : u.ceil(n);
}
function nt(n, t) {
    return n = nn(n), D(u.count(c(n), n) + (4 === c(n).getDay()), t, 2);
}
function ne(n) {
    return n.getDay();
}
function nr(n, t) {
    return D(r.count(c(n) - 1, n), t, 2);
}
function nu(n, t) {
    return D(n.getFullYear() % 100, t, 2);
}
function nc(n, t) {
    return D((n = nn(n)).getFullYear() % 100, t, 2);
}
function ni(n, t) {
    return D(n.getFullYear() % 10000, t, 4);
}
function no(n, t) {
    var e = n.getDay();
    return D((n = e >= 4 || 0 === e ? u(n) : u.ceil(n)).getFullYear() % 10000, t, 4);
}
function nf(n) {
    var t = n.getTimezoneOffset();
    return (t > 0 ? "-" : (t *= -1, "+")) + D(t / 60 | 0, "0", 2) + D(t % 60, "0", 2);
}
function na(n, t) {
    return D(n.getUTCDate(), t, 2);
}
function nl(n, t) {
    return D(n.getUTCHours(), t, 2);
}
function ng(n, t) {
    return D(n.getUTCHours() % 12 || 12, t, 2);
}
function ns(n, t) {
    return D(1 + i.count(l(n), n), t, 3);
}
function nh(n, t) {
    return D(n.getUTCMilliseconds(), t, 3);
}
function nv(n, t) {
    return nh(n, t) + "000";
}
function ny(n, t) {
    return D(n.getUTCMonth() + 1, t, 2);
}
function nC(n, t) {
    return D(n.getUTCMinutes(), t, 2);
}
function nU(n, t) {
    return D(n.getUTCSeconds(), t, 2);
}
function nd(n) {
    var t = n.getUTCDay();
    return 0 === t ? 7 : t;
}
function nD(n, t) {
    return D(o.count(l(n) - 1, n), t, 2);
}
function nx(n) {
    var t = n.getUTCDay();
    return t >= 4 || 0 === t ? a(n) : a.ceil(n);
}
function nT(n, t) {
    return n = nx(n), D(a.count(l(n), n) + (4 === l(n).getUTCDay()), t, 2);
}
function nm(n) {
    return n.getUTCDay();
}
function nw(n, t) {
    return D(f.count(l(n) - 1, n), t, 2);
}
function nM(n, t) {
    return D(n.getUTCFullYear() % 100, t, 2);
}
function np(n, t) {
    return D((n = nx(n)).getUTCFullYear() % 100, t, 2);
}
function nH(n, t) {
    return D(n.getUTCFullYear() % 10000, t, 4);
}
function nL(n, t) {
    var e = n.getUTCDay();
    return D((n = e >= 4 || 0 === e ? a(n) : a.ceil(n)).getUTCFullYear() % 10000, t, 4);
}
function nS() {
    return "+0000";
}
function nY() {
    return "%";
}
function nF(n) {
    return +n;
}
function nZ(n) {
    return Math.floor(+n / 1000);
}
