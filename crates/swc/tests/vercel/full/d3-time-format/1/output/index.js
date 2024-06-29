import { _ as n } from "@swc/helpers/_/_instanceof";
import { timeDay as t } from "d3-time";
import { timeSunday as e } from "d3-time";
import { timeMonday as r } from "d3-time";
import { timeThursday as u } from "d3-time";
import { timeYear as i } from "d3-time";
import { utcDay as o } from "d3-time";
import { utcSunday as c } from "d3-time";
import { utcMonday as f } from "d3-time";
import { utcThursday as a } from "d3-time";
import { utcYear as l } from "d3-time";
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
function m(n, t, e) {
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
export default function h(e) {
    var u = e.dateTime, i = e.date, c = e.time, a = e.periods, l = e.days, h = e.shortDays, d = e.months, y = e.shortMonths, C = x(a), U = D(a), p = x(l), nn = D(l), np = x(h), nA = D(h), nV = x(d), nW = D(d), nj = x(y), nq = D(y), nQ = {
        a: function(n) {
            return h[n.getDay()];
        },
        A: function(n) {
            return l[n.getDay()];
        },
        b: function(n) {
            return y[n.getMonth()];
        },
        B: function(n) {
            return d[n.getMonth()];
        },
        c: null,
        d: I,
        e: I,
        f: P,
        g: ni,
        G: nc,
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
        Y: no,
        Z: nf,
        "%": nY
    }, n_ = {
        a: function(n) {
            return h[n.getUTCDay()];
        },
        A: function(n) {
            return l[n.getUTCDay()];
        },
        b: function(n) {
            return y[n.getUTCMonth()];
        },
        B: function(n) {
            return d[n.getUTCMonth()];
        },
        c: null,
        d: na,
        e: na,
        f: nh,
        g: nM,
        G: nH,
        H: nl,
        I: ng,
        j: ns,
        L: nm,
        m: nv,
        M: nd,
        p: function(n) {
            return a[+(n.getUTCHours() >= 12)];
        },
        q: function(n) {
            return 1 + ~~(n.getUTCMonth() / 3);
        },
        Q: nF,
        s: nZ,
        S: ny,
        u: nC,
        U: nU,
        V: nx,
        w: nD,
        W: nT,
        x: null,
        X: null,
        y: nw,
        Y: nL,
        Z: nS,
        "%": nY
    }, nX = {
        a: function(n, t, e) {
            var r = np.exec(t.slice(e));
            return r ? (n.w = nA.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        A: function(n, t, e) {
            var r = p.exec(t.slice(e));
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
        f: X,
        g: Y,
        G: S,
        H: j,
        I: j,
        j: W,
        L: _,
        m: A,
        M: q,
        p: function(n, t, e) {
            var r = C.exec(t.slice(e));
            return r ? (n.p = U.get(r[0].toLowerCase()), e + r[0].length) : -1;
        },
        q: Z,
        Q: B,
        s: G,
        S: Q,
        u: w,
        U: M,
        V: L,
        w: T,
        W: H,
        x: function(n, t, e) {
            return nG(n, i, t, e);
        },
        X: function(n, t, e) {
            return nG(n, c, t, e);
        },
        y: Y,
        Y: S,
        Z: F,
        "%": b
    };
    function nb(t, e) {
        return function(r) {
            var u, i, o, c = [], f = -1, a = 0, l = t.length;
            for(n(r, Date) || (r = new Date(+r)); ++f < l;)37 === t.charCodeAt(f) && (c.push(t.slice(a, f)), null != (i = v[u = t.charAt(++f)]) ? u = t.charAt(++f) : i = "e" === u ? " " : "0", (o = e[u]) && (u = o(r, i)), c.push(u), a = f + 1);
            return c.push(t.slice(a, f)), c.join("");
        };
    }
    function nB(n, e) {
        return function(u) {
            var i, c, a = m(1900, void 0, 1);
            if (nG(a, n, u += "", 0) != u.length) return null;
            if ("Q" in a) return new Date(a.Q);
            if ("s" in a) return new Date(1000 * a.s + ("L" in a ? a.L : 0));
            if (!e || "Z" in a || (a.Z = 0), "p" in a && (a.H = a.H % 12 + 12 * a.p), void 0 === a.m && (a.m = "q" in a ? a.q : 0), "V" in a) {
                if (a.V < 1 || a.V > 53) return null;
                "w" in a || (a.w = 1), "Z" in a ? (i = (c = (i = s(m(a.y, 0, 1))).getUTCDay()) > 4 || 0 === c ? f.ceil(i) : f(i), i = o.offset(i, (a.V - 1) * 7), a.y = i.getUTCFullYear(), a.m = i.getUTCMonth(), a.d = i.getUTCDate() + (a.w + 6) % 7) : (i = (c = (i = g(m(a.y, 0, 1))).getDay()) > 4 || 0 === c ? r.ceil(i) : r(i), i = t.offset(i, (a.V - 1) * 7), a.y = i.getFullYear(), a.m = i.getMonth(), a.d = i.getDate() + (a.w + 6) % 7);
            } else ("W" in a || "U" in a) && ("w" in a || (a.w = "u" in a ? a.u % 7 : "W" in a ? 1 : 0), c = "Z" in a ? s(m(a.y, 0, 1)).getUTCDay() : g(m(a.y, 0, 1)).getDay(), a.m = 0, a.d = "W" in a ? (a.w + 6) % 7 + 7 * a.W - (c + 5) % 7 : a.w + 7 * a.U - (c + 6) % 7);
            return "Z" in a ? (a.H += a.Z / 100 | 0, a.M += a.Z % 100, s(a)) : g(a);
        };
    }
    function nG(n, t, e, r) {
        for(var u, i, o = 0, c = t.length, f = e.length; o < c;){
            if (r >= f) return -1;
            if (37 === (u = t.charCodeAt(o++))) {
                if (!(i = nX[(u = t.charAt(o++)) in v ? t.charAt(o++) : u]) || (r = i(n, e, r)) < 0) return -1;
            } else if (u != e.charCodeAt(r++)) return -1;
        }
        return r;
    }
    return nQ.x = nb(i, nQ), nQ.X = nb(c, nQ), nQ.c = nb(u, nQ), n_.x = nb(i, n_), n_.X = nb(c, n_), n_.c = nb(u, n_), {
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
            var t = nb(n += "", n_);
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
var v = {
    "-": "",
    _: " ",
    0: "0"
}, d = /^\s*\d+/, y = /^%/, C = /[\\^$*+?|[\]().{}]/g;
function U(n, t, e) {
    var r = n < 0 ? "-" : "", u = (r ? -n : n) + "", i = u.length;
    return r + (i < e ? Array(e - i + 1).join(t) + u : u);
}
function p(n) {
    return n.replace(C, "\\$&");
}
function x(n) {
    return RegExp("^(?:" + n.map(p).join("|") + ")", "i");
}
function D(n) {
    return new Map(n.map(function(n, t) {
        return [
            n.toLowerCase(),
            t
        ];
    }));
}
function T(n, t, e) {
    var r = d.exec(t.slice(e, e + 1));
    return r ? (n.w = +r[0], e + r[0].length) : -1;
}
function w(n, t, e) {
    var r = d.exec(t.slice(e, e + 1));
    return r ? (n.u = +r[0], e + r[0].length) : -1;
}
function M(n, t, e) {
    var r = d.exec(t.slice(e, e + 2));
    return r ? (n.U = +r[0], e + r[0].length) : -1;
}
function L(n, t, e) {
    var r = d.exec(t.slice(e, e + 2));
    return r ? (n.V = +r[0], e + r[0].length) : -1;
}
function H(n, t, e) {
    var r = d.exec(t.slice(e, e + 2));
    return r ? (n.W = +r[0], e + r[0].length) : -1;
}
function S(n, t, e) {
    var r = d.exec(t.slice(e, e + 4));
    return r ? (n.y = +r[0], e + r[0].length) : -1;
}
function Y(n, t, e) {
    var r = d.exec(t.slice(e, e + 2));
    return r ? (n.y = +r[0] + (+r[0] > 68 ? 1900 : 2000), e + r[0].length) : -1;
}
function F(n, t, e) {
    var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(e, e + 6));
    return r ? (n.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), e + r[0].length) : -1;
}
function Z(n, t, e) {
    var r = d.exec(t.slice(e, e + 1));
    return r ? (n.q = 3 * r[0] - 3, e + r[0].length) : -1;
}
function A(n, t, e) {
    var r = d.exec(t.slice(e, e + 2));
    return r ? (n.m = r[0] - 1, e + r[0].length) : -1;
}
function V(n, t, e) {
    var r = d.exec(t.slice(e, e + 2));
    return r ? (n.d = +r[0], e + r[0].length) : -1;
}
function W(n, t, e) {
    var r = d.exec(t.slice(e, e + 3));
    return r ? (n.m = 0, n.d = +r[0], e + r[0].length) : -1;
}
function j(n, t, e) {
    var r = d.exec(t.slice(e, e + 2));
    return r ? (n.H = +r[0], e + r[0].length) : -1;
}
function q(n, t, e) {
    var r = d.exec(t.slice(e, e + 2));
    return r ? (n.M = +r[0], e + r[0].length) : -1;
}
function Q(n, t, e) {
    var r = d.exec(t.slice(e, e + 2));
    return r ? (n.S = +r[0], e + r[0].length) : -1;
}
function _(n, t, e) {
    var r = d.exec(t.slice(e, e + 3));
    return r ? (n.L = +r[0], e + r[0].length) : -1;
}
function X(n, t, e) {
    var r = d.exec(t.slice(e, e + 6));
    return r ? (n.L = Math.floor(r[0] / 1000), e + r[0].length) : -1;
}
function b(n, t, e) {
    var r = y.exec(t.slice(e, e + 1));
    return r ? e + r[0].length : -1;
}
function B(n, t, e) {
    var r = d.exec(t.slice(e));
    return r ? (n.Q = +r[0], e + r[0].length) : -1;
}
function G(n, t, e) {
    var r = d.exec(t.slice(e));
    return r ? (n.s = +r[0], e + r[0].length) : -1;
}
function I(n, t) {
    return U(n.getDate(), t, 2);
}
function $(n, t) {
    return U(n.getHours(), t, 2);
}
function z(n, t) {
    return U(n.getHours() % 12 || 12, t, 2);
}
function E(n, e) {
    return U(1 + t.count(i(n), n), e, 3);
}
function O(n, t) {
    return U(n.getMilliseconds(), t, 3);
}
function P(n, t) {
    return O(n, t) + "000";
}
function R(n, t) {
    return U(n.getMonth() + 1, t, 2);
}
function k(n, t) {
    return U(n.getMinutes(), t, 2);
}
function J(n, t) {
    return U(n.getSeconds(), t, 2);
}
function K(n) {
    var t = n.getDay();
    return 0 === t ? 7 : t;
}
function N(n, t) {
    return U(e.count(i(n) - 1, n), t, 2);
}
function nn(n) {
    var t = n.getDay();
    return t >= 4 || 0 === t ? u(n) : u.ceil(n);
}
function nt(n, t) {
    return n = nn(n), U(u.count(i(n), n) + (4 === i(n).getDay()), t, 2);
}
function ne(n) {
    return n.getDay();
}
function nr(n, t) {
    return U(r.count(i(n) - 1, n), t, 2);
}
function nu(n, t) {
    return U(n.getFullYear() % 100, t, 2);
}
function ni(n, t) {
    return U((n = nn(n)).getFullYear() % 100, t, 2);
}
function no(n, t) {
    return U(n.getFullYear() % 10000, t, 4);
}
function nc(n, t) {
    var e = n.getDay();
    return U((n = e >= 4 || 0 === e ? u(n) : u.ceil(n)).getFullYear() % 10000, t, 4);
}
function nf(n) {
    var t = n.getTimezoneOffset();
    return (t > 0 ? "-" : (t *= -1, "+")) + U(t / 60 | 0, "0", 2) + U(t % 60, "0", 2);
}
function na(n, t) {
    return U(n.getUTCDate(), t, 2);
}
function nl(n, t) {
    return U(n.getUTCHours(), t, 2);
}
function ng(n, t) {
    return U(n.getUTCHours() % 12 || 12, t, 2);
}
function ns(n, t) {
    return U(1 + o.count(l(n), n), t, 3);
}
function nm(n, t) {
    return U(n.getUTCMilliseconds(), t, 3);
}
function nh(n, t) {
    return nm(n, t) + "000";
}
function nv(n, t) {
    return U(n.getUTCMonth() + 1, t, 2);
}
function nd(n, t) {
    return U(n.getUTCMinutes(), t, 2);
}
function ny(n, t) {
    return U(n.getUTCSeconds(), t, 2);
}
function nC(n) {
    var t = n.getUTCDay();
    return 0 === t ? 7 : t;
}
function nU(n, t) {
    return U(c.count(l(n) - 1, n), t, 2);
}
function np(n) {
    var t = n.getUTCDay();
    return t >= 4 || 0 === t ? a(n) : a.ceil(n);
}
function nx(n, t) {
    return n = np(n), U(a.count(l(n), n) + (4 === l(n).getUTCDay()), t, 2);
}
function nD(n) {
    return n.getUTCDay();
}
function nT(n, t) {
    return U(f.count(l(n) - 1, n), t, 2);
}
function nw(n, t) {
    return U(n.getUTCFullYear() % 100, t, 2);
}
function nM(n, t) {
    return U((n = np(n)).getUTCFullYear() % 100, t, 2);
}
function nL(n, t) {
    return U(n.getUTCFullYear() % 10000, t, 4);
}
function nH(n, t) {
    var e = n.getUTCDay();
    return U((n = e >= 4 || 0 === e ? a(n) : a.ceil(n)).getUTCFullYear() % 10000, t, 4);
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
import "@swc/helpers/_/_instanceof";
import "d3-time";
export { h as default };
