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
    var u = e.dateTime, c = e.date, o = e.time, a = e.periods, l = e.days, v = e.shortDays, C = e.months, U = e.shortMonths, d = T(a), D = m(a), x = T(l), nn = m(l), nx = T(v), nA = m(v), nV = T(C), nW = m(C), nj = T(U), nq = m(U), nQ = {
        a: function(n) {
            return v[n.getDay()];
        },
        A: function(n) {
            return l[n.getDay()];
        },
        b: function(n) {
            return U[n.getMonth()];
        },
        B: function(n) {
            return C[n.getMonth()];
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
            return a[+(n.getHours() >= 12)];
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
    }, nX = {
        a: function(n) {
            return v[n.getUTCDay()];
        },
        A: function(n) {
            return l[n.getUTCDay()];
        },
        b: function(n) {
            return U[n.getUTCMonth()];
        },
        B: function(n) {
            return C[n.getUTCMonth()];
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
            return a[+(n.getUTCHours() >= 12)];
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
    }, n_ = {
        a: function(n, t, e) {
            var r = nx.exec(t.slice(e));
            return r ? (n.w = nA.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        A: function(n, t, e) {
            var r = x.exec(t.slice(e));
            return r ? (n.w = nn.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        b: function(n, t, e) {
            var r = nj.exec(t.slice(e));
            return r ? (n.m = nq.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        B: function(n, t, e) {
            var r = nV.exec(t.slice(e));
            return r ? (n.m = nW.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        c: function(n, t, e) {
            return nG(n, u, t, e);
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
            var r = d.exec(t.slice(e));
            return r ? (n.p = D.get(r[0].toLowerCase()), e + r[0].length) : -1;
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
            return nG(n, c, t, e);
        },
        X: function(n, t, e) {
            return nG(n, o, t, e);
        },
        y: Y,
        Y: S,
        Z: F,
        "%": b
    };
    function nb(t, e) {
        return function(r) {
            var u, c, i, o = [], f = -1, a = 0, l = t.length;
            for(n(r, Date) || (r = new Date(+r)); ++f < l;)37 === t.charCodeAt(f) && (o.push(t.slice(a, f)), null != (c = y[u = t.charAt(++f)]) ? u = t.charAt(++f) : c = "e" === u ? " " : "0", (i = e[u]) && (u = i(r, c)), o.push(u), a = f + 1);
            return o.push(t.slice(a, f)), o.join("");
        };
    }
    function nB(n, e) {
        return function(u) {
            var c, o, a = h(1900, void 0, 1);
            if (nG(a, n, u += "", 0) != u.length) return null;
            if ("Q" in a) return new Date(a.Q);
            if ("s" in a) return new Date(1000 * a.s + ("L" in a ? a.L : 0));
            if (!e || "Z" in a || (a.Z = 0), "p" in a && (a.H = a.H % 12 + 12 * a.p), void 0 === a.m && (a.m = "q" in a ? a.q : 0), "V" in a) {
                if (a.V < 1 || a.V > 53) return null;
                "w" in a || (a.w = 1), "Z" in a ? (c = (o = (c = s(h(a.y, 0, 1))).getUTCDay()) > 4 || 0 === o ? f.ceil(c) : f(c), c = i.offset(c, (a.V - 1) * 7), a.y = c.getUTCFullYear(), a.m = c.getUTCMonth(), a.d = c.getUTCDate() + (a.w + 6) % 7) : (c = (o = (c = g(h(a.y, 0, 1))).getDay()) > 4 || 0 === o ? r.ceil(c) : r(c), c = t.offset(c, (a.V - 1) * 7), a.y = c.getFullYear(), a.m = c.getMonth(), a.d = c.getDate() + (a.w + 6) % 7);
            } else ("W" in a || "U" in a) && ("w" in a || (a.w = "u" in a ? a.u % 7 : "W" in a ? 1 : 0), o = "Z" in a ? s(h(a.y, 0, 1)).getUTCDay() : g(h(a.y, 0, 1)).getDay(), a.m = 0, a.d = "W" in a ? (a.w + 6) % 7 + 7 * a.W - (o + 5) % 7 : a.w + 7 * a.U - (o + 6) % 7);
            return "Z" in a ? (a.H += a.Z / 100 | 0, a.M += a.Z % 100, s(a)) : g(a);
        };
    }
    function nG(n, t, e, r) {
        for(var u, c, i = 0, o = t.length, f = e.length; i < o;){
            if (r >= f) return -1;
            if (37 === (u = t.charCodeAt(i++))) {
                if (!(c = n_[(u = t.charAt(i++)) in y ? t.charAt(i++) : u]) || (r = c(n, e, r)) < 0) return -1;
            } else if (u != e.charCodeAt(r++)) return -1;
        }
        return r;
    }
    return nQ.x = nb(c, nQ), nQ.X = nb(o, nQ), nQ.c = nb(u, nQ), nX.x = nb(c, nX), nX.X = nb(o, nX), nX.c = nb(u, nX), {
        format: function(n) {
            var t = nb(n += "", nQ);
            return t.toString = function() {
                return n;
            }, t;
        },
        parse: function(n) {
            var t = nB(n += "", !1);
            return t.toString = function() {
                return n;
            }, t;
        },
        utcFormat: function(n) {
            var t = nb(n += "", nX);
            return t.toString = function() {
                return n;
            }, t;
        },
        utcParse: function(n) {
            var t = nB(n += "", !0);
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
