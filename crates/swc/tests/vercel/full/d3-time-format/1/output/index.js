import n from "@swc/helpers/src/_instanceof.mjs";
import { timeDay as t, timeSunday as e, timeMonday as r, timeThursday as u, timeYear as c, utcDay as i, utcSunday as o, utcMonday as $, utcThursday as f, utcYear as l } from "d3-time";
function a(n) {
    if (0 <= n.y && n.y < 100) {
        var t = new Date(-1, n.m, n.d, n.H, n.M, n.S, n.L);
        return t.setFullYear(n.y), t;
    }
    return new Date(n.y, n.m, n.d, n.H, n.M, n.S, n.L);
}
function g(n) {
    if (0 <= n.y && n.y < 100) {
        var t = new Date(Date.UTC(-1, n.m, n.d, n.H, n.M, n.S, n.L));
        return t.setUTCFullYear(n.y), t;
    }
    return new Date(Date.UTC(n.y, n.m, n.d, n.H, n.M, n.S, n.L));
}
function _(n, t, e) {
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
export default function s(e) {
    var u = function(t, e) {
        return function(r) {
            var u, c, i, o = [], $ = -1, f = 0, l = t.length;
            for(n(r, Date) || (r = new Date(+r)); ++$ < l;)37 === t.charCodeAt($) && (o.push(t.slice(f, $)), null != (c = h[u = t.charAt(++$)]) ? u = t.charAt(++$) : c = "e" === u ? " " : "0", (i = e[u]) && (u = i(r, c)), o.push(u), f = $ + 1);
            return o.push(t.slice(f, $)), o.join("");
        };
    }, c = function(n, e) {
        return function(u) {
            var c, f, l = _(1900, void 0, 1), s = o(l, n, u += "", 0);
            if (s != u.length) return null;
            if ("Q" in l) return new Date(l.Q);
            if ("s" in l) return new Date(1000 * l.s + ("L" in l ? l.L : 0));
            if (!e || "Z" in l || (l.Z = 0), "p" in l && (l.H = l.H % 12 + 12 * l.p), void 0 === l.m && (l.m = "q" in l ? l.q : 0), "V" in l) {
                if (l.V < 1 || l.V > 53) return null;
                "w" in l || (l.w = 1), "Z" in l ? (c = g(_(l.y, 0, 1)), c = (f = c.getUTCDay()) > 4 || 0 === f ? $.ceil(c) : $(c), c = i.offset(c, (l.V - 1) * 7), l.y = c.getUTCFullYear(), l.m = c.getUTCMonth(), l.d = c.getUTCDate() + (l.w + 6) % 7) : (c = a(_(l.y, 0, 1)), c = (f = c.getDay()) > 4 || 0 === f ? r.ceil(c) : r(c), c = t.offset(c, (l.V - 1) * 7), l.y = c.getFullYear(), l.m = c.getMonth(), l.d = c.getDate() + (l.w + 6) % 7);
            } else ("W" in l || "U" in l) && ("w" in l || (l.w = "u" in l ? l.u % 7 : "W" in l ? 1 : 0), f = "Z" in l ? g(_(l.y, 0, 1)).getUTCDay() : a(_(l.y, 0, 1)).getDay(), l.m = 0, l.d = "W" in l ? (l.w + 6) % 7 + 7 * l.W - (f + 5) % 7 : l.w + 7 * l.U - (f + 6) % 7);
            return "Z" in l ? (l.H += l.Z / 100 | 0, l.M += l.Z % 100, g(l)) : a(l);
        };
    }, o = function(n, t, e, r) {
        for(var u, c, i = 0, o = t.length, $ = e.length; i < o;){
            if (r >= $) return -1;
            if (37 === (u = t.charCodeAt(i++))) {
                if (c = nN[(u = t.charAt(i++)) in h ? t.charAt(i++) : u], !c || (r = c(n, e, r)) < 0) return -1;
            } else if (u != e.charCodeAt(r++)) return -1;
        }
        return r;
    }, f = function(n, t, e) {
        var r = n3.exec(t.slice(e));
        return r ? (n.p = n7.get(r[0].toLowerCase()), e + r[0].length) : -1;
    }, l = function(n, t, e) {
        var r = nz.exec(t.slice(e));
        return r ? (n.w = nO.get(r[0].toLowerCase()), e + r[0].length) : -1;
    }, s = function(n, t, e) {
        var r = n8.exec(t.slice(e));
        return r ? (n.w = n9.get(r[0].toLowerCase()), e + r[0].length) : -1;
    }, v = function(n, t, e) {
        var r = nk.exec(t.slice(e));
        return r ? (n.m = nE.get(r[0].toLowerCase()), e + r[0].length) : -1;
    }, y = function(n, t, e) {
        var r = nP.exec(t.slice(e));
        return r ? (n.m = n6.get(r[0].toLowerCase()), e + r[0].length) : -1;
    }, C = function(n, t, e) {
        return o(n, nj, t, e);
    }, U = function(n, t, e) {
        return o(n, nq, t, e);
    }, d = function(n, t, e) {
        return o(n, nQ, t, e);
    }, nn = function(n) {
        return nB[n.getDay()];
    }, nU = function(n) {
        return nb[n.getDay()];
    }, nY = function(n) {
        return nI[n.getMonth()];
    }, n1 = function(n) {
        return nG[n.getMonth()];
    }, n5 = function(n) {
        return nX[+(n.getHours() >= 12)];
    }, nF = function(n) {
        return 1 + ~~(n.getMonth() / 3);
    }, n2 = function(n) {
        return nB[n.getUTCDay()];
    }, nZ = function(n) {
        return nb[n.getUTCDay()];
    }, nA = function(n) {
        return nI[n.getUTCMonth()];
    }, nV = function(n) {
        return nG[n.getUTCMonth()];
    }, n4 = function(n) {
        return nX[+(n.getUTCHours() >= 12)];
    }, nW = function(n) {
        return 1 + ~~(n.getUTCMonth() / 3);
    }, nj = e.dateTime, nq = e.date, nQ = e.time, nX = e.periods, nb = e.days, nB = e.shortDays, nG = e.months, nI = e.shortMonths, n3 = T(nX), n7 = m(nX), n8 = T(nb), n9 = m(nb), nz = T(nB), nO = m(nB), nP = T(nG), n6 = m(nG), nk = T(nI), nE = m(nI), nJ = {
        a: nn,
        A: nU,
        b: nY,
        B: n1,
        c: null,
        d: G,
        e: G,
        f: k,
        g: nc,
        G: no,
        H: I,
        I: z,
        j: O,
        L: P,
        m: E,
        M: J,
        p: n5,
        q: nF,
        Q: nL,
        s: nS,
        S: K,
        u: N,
        U: R,
        V: nt,
        w: ne,
        W: nr,
        x: null,
        X: null,
        y: nu,
        Y: ni,
        Z: n$,
        "%": nH
    }, nK = {
        a: n2,
        A: nZ,
        b: nA,
        B: nV,
        c: null,
        d: nf,
        e: nf,
        f: ns,
        g: nw,
        G: nD,
        H: nl,
        I: na,
        j: ng,
        L: n_,
        m: nh,
        M: nv,
        p: n4,
        q: nW,
        Q: nL,
        s: nS,
        S: n0,
        u: ny,
        U: nC,
        V: nd,
        w: nT,
        W: nm,
        x: null,
        X: null,
        y: nx,
        Y: nM,
        Z: np,
        "%": nH
    }, nN = {
        a: l,
        A: s,
        b: v,
        B: y,
        c: C,
        d: Z,
        e: Z,
        f: Q,
        g: L,
        G: H,
        H: V,
        I: V,
        j: A,
        L: q,
        m: F,
        M: W,
        p: f,
        q: Y,
        Q: b,
        s: B,
        S: j,
        u: w,
        U: M,
        V: D,
        w: x,
        W: p,
        x: U,
        X: d,
        y: L,
        Y: H,
        Z: S,
        "%": X
    };
    return nJ.x = u(nq, nJ), nJ.X = u(nQ, nJ), nJ.c = u(nj, nJ), nK.x = u(nq, nK), nK.X = u(nQ, nK), nK.c = u(nj, nK), {
        format: function(n) {
            var t = u(n += "", nJ);
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
            var t = u(n += "", nK);
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
    };
};
var h = {
    "-": "",
    _: " ",
    0: "0"
}, v = /^\s*\d+/, y = /^%/, C = /[\\^$*+?|[\]().{}]/g;
function U(n, t, e) {
    var r = n < 0 ? "-" : "", u = (r ? -n : n) + "", c = u.length;
    return r + (c < e ? Array(e - c + 1).join(t) + u : u);
}
function d(n) {
    return n.replace(C, "\\$&");
}
function T(n) {
    return RegExp("^(?:" + n.map(d).join("|") + ")", "i");
}
function m(n) {
    return new Map(n.map(function(n, t) {
        return [
            n.toLowerCase(),
            t
        ];
    }));
}
function x(n, t, e) {
    var r = v.exec(t.slice(e, e + 1));
    return r ? (n.w = +r[0], e + r[0].length) : -1;
}
function w(n, t, e) {
    var r = v.exec(t.slice(e, e + 1));
    return r ? (n.u = +r[0], e + r[0].length) : -1;
}
function M(n, t, e) {
    var r = v.exec(t.slice(e, e + 2));
    return r ? (n.U = +r[0], e + r[0].length) : -1;
}
function D(n, t, e) {
    var r = v.exec(t.slice(e, e + 2));
    return r ? (n.V = +r[0], e + r[0].length) : -1;
}
function p(n, t, e) {
    var r = v.exec(t.slice(e, e + 2));
    return r ? (n.W = +r[0], e + r[0].length) : -1;
}
function H(n, t, e) {
    var r = v.exec(t.slice(e, e + 4));
    return r ? (n.y = +r[0], e + r[0].length) : -1;
}
function L(n, t, e) {
    var r = v.exec(t.slice(e, e + 2));
    return r ? (n.y = +r[0] + (+r[0] > 68 ? 1900 : 2000), e + r[0].length) : -1;
}
function S(n, t, e) {
    var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(e, e + 6));
    return r ? (n.Z = r[1] ? 0 : -(r[2] + (r[3] || "00")), e + r[0].length) : -1;
}
function Y(n, t, e) {
    var r = v.exec(t.slice(e, e + 1));
    return r ? (n.q = 3 * r[0] - 3, e + r[0].length) : -1;
}
function F(n, t, e) {
    var r = v.exec(t.slice(e, e + 2));
    return r ? (n.m = r[0] - 1, e + r[0].length) : -1;
}
function Z(n, t, e) {
    var r = v.exec(t.slice(e, e + 2));
    return r ? (n.d = +r[0], e + r[0].length) : -1;
}
function A(n, t, e) {
    var r = v.exec(t.slice(e, e + 3));
    return r ? (n.m = 0, n.d = +r[0], e + r[0].length) : -1;
}
function V(n, t, e) {
    var r = v.exec(t.slice(e, e + 2));
    return r ? (n.H = +r[0], e + r[0].length) : -1;
}
function W(n, t, e) {
    var r = v.exec(t.slice(e, e + 2));
    return r ? (n.M = +r[0], e + r[0].length) : -1;
}
function j(n, t, e) {
    var r = v.exec(t.slice(e, e + 2));
    return r ? (n.S = +r[0], e + r[0].length) : -1;
}
function q(n, t, e) {
    var r = v.exec(t.slice(e, e + 3));
    return r ? (n.L = +r[0], e + r[0].length) : -1;
}
function Q(n, t, e) {
    var r = v.exec(t.slice(e, e + 6));
    return r ? (n.L = Math.floor(r[0] / 1000), e + r[0].length) : -1;
}
function X(n, t, e) {
    var r = y.exec(t.slice(e, e + 1));
    return r ? e + r[0].length : -1;
}
function b(n, t, e) {
    var r = v.exec(t.slice(e));
    return r ? (n.Q = +r[0], e + r[0].length) : -1;
}
function B(n, t, e) {
    var r = v.exec(t.slice(e));
    return r ? (n.s = +r[0], e + r[0].length) : -1;
}
function G(n, t) {
    return U(n.getDate(), t, 2);
}
function I(n, t) {
    return U(n.getHours(), t, 2);
}
function z(n, t) {
    return U(n.getHours() % 12 || 12, t, 2);
}
function O(n, e) {
    return U(1 + t.count(c(n), n), e, 3);
}
function P(n, t) {
    return U(n.getMilliseconds(), t, 3);
}
function k(n, t) {
    return P(n, t) + "000";
}
function E(n, t) {
    return U(n.getMonth() + 1, t, 2);
}
function J(n, t) {
    return U(n.getMinutes(), t, 2);
}
function K(n, t) {
    return U(n.getSeconds(), t, 2);
}
function N(n) {
    var t = n.getDay();
    return 0 === t ? 7 : t;
}
function R(n, t) {
    return U(e.count(c(n) - 1, n), t, 2);
}
function nn(n) {
    var t = n.getDay();
    return t >= 4 || 0 === t ? u(n) : u.ceil(n);
}
function nt(n, t) {
    return n = nn(n), U(u.count(c(n), n) + (4 === c(n).getDay()), t, 2);
}
function ne(n) {
    return n.getDay();
}
function nr(n, t) {
    return U(r.count(c(n) - 1, n), t, 2);
}
function nu(n, t) {
    return U(n.getFullYear() % 100, t, 2);
}
function nc(n, t) {
    return n = nn(n), U(n.getFullYear() % 100, t, 2);
}
function ni(n, t) {
    return U(n.getFullYear() % 10000, t, 4);
}
function no(n, t) {
    var e = n.getDay();
    return n = e >= 4 || 0 === e ? u(n) : u.ceil(n), U(n.getFullYear() % 10000, t, 4);
}
function n$(n) {
    var t = n.getTimezoneOffset();
    return (t > 0 ? "-" : (t *= -1, "+")) + U(t / 60 | 0, "0", 2) + U(t % 60, "0", 2);
}
function nf(n, t) {
    return U(n.getUTCDate(), t, 2);
}
function nl(n, t) {
    return U(n.getUTCHours(), t, 2);
}
function na(n, t) {
    return U(n.getUTCHours() % 12 || 12, t, 2);
}
function ng(n, t) {
    return U(1 + i.count(l(n), n), t, 3);
}
function n_(n, t) {
    return U(n.getUTCMilliseconds(), t, 3);
}
function ns(n, t) {
    return n_(n, t) + "000";
}
function nh(n, t) {
    return U(n.getUTCMonth() + 1, t, 2);
}
function nv(n, t) {
    return U(n.getUTCMinutes(), t, 2);
}
function n0(n, t) {
    return U(n.getUTCSeconds(), t, 2);
}
function ny(n) {
    var t = n.getUTCDay();
    return 0 === t ? 7 : t;
}
function nC(n, t) {
    return U(o.count(l(n) - 1, n), t, 2);
}
function nU(n) {
    var t = n.getUTCDay();
    return t >= 4 || 0 === t ? f(n) : f.ceil(n);
}
function nd(n, t) {
    return n = nU(n), U(f.count(l(n), n) + (4 === l(n).getUTCDay()), t, 2);
}
function nT(n) {
    return n.getUTCDay();
}
function nm(n, t) {
    return U($.count(l(n) - 1, n), t, 2);
}
function nx(n, t) {
    return U(n.getUTCFullYear() % 100, t, 2);
}
function nw(n, t) {
    return n = nU(n), U(n.getUTCFullYear() % 100, t, 2);
}
function nM(n, t) {
    return U(n.getUTCFullYear() % 10000, t, 4);
}
function nD(n, t) {
    var e = n.getUTCDay();
    return n = e >= 4 || 0 === e ? f(n) : f.ceil(n), U(n.getUTCFullYear() % 10000, t, 4);
}
function np() {
    return "+0000";
}
function nH() {
    return "%";
}
function nL(n) {
    return +n;
}
function nS(n) {
    return Math.floor(+n / 1000);
}
