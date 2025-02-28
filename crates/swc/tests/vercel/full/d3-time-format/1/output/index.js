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
    var a = e.dateTime, l = e.date, v = e.time, C = e.periods, U = e.days, d = e.shortDays, D = e.months, x = e.shortMonths, nn = T(C), nx = m(C), nA = T(U), nV = m(U), nW = T(d), nj = m(d), nq = T(D), nQ = m(D), nX = T(x), n_ = m(x), u = {
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
    }, c = {
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
    }, nb = {
        a: function(e, r, t) {
            var n = nW.exec(r.slice(t));
            return n ? (e.w = nj.get(n[0].toLowerCase()), t + n[0].length) : -1;
        },
        A: function(e, r, t) {
            var n = nA.exec(r.slice(t));
            return n ? (e.w = nV.get(n[0].toLowerCase()), t + n[0].length) : -1;
        },
        b: function(e, r, t) {
            var n = nX.exec(r.slice(t));
            return n ? (e.m = n_.get(n[0].toLowerCase()), t + n[0].length) : -1;
        },
        B: function(e, r, t) {
            var n = nq.exec(r.slice(t));
            return n ? (e.m = nQ.get(n[0].toLowerCase()), t + n[0].length) : -1;
        },
        c: function(n, t, e) {
            return nG(n, a, t, e);
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
        p: function(e, r, t) {
            var n = nn.exec(r.slice(t));
            return n ? (e.p = nx.get(n[0].toLowerCase()), t + n[0].length) : -1;
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
            return nG(n, l, t, e);
        },
        X: function(n, t, e) {
            return nG(n, v, t, e);
        },
        y: Y,
        Y: S,
        Z: F,
        "%": b
    };
    function o(t, e) {
        return function(i) {
            var o, f, a, r = [], u = -1, c = 0, l = t.length;
            for(n(i, Date) || (i = new Date(+i)); ++u < l;)37 === t.charCodeAt(u) && (r.push(t.slice(c, u)), null != (f = y[o = t.charAt(++u)]) ? o = t.charAt(++u) : f = "e" === o ? " " : "0", (a = e[o]) && (o = a(i, f)), r.push(o), c = u + 1);
            return r.push(t.slice(c, u)), r.join("");
        };
    }
    function nB(n, e) {
        return function(o) {
            var a, c, u = h(1900, void 0, 1);
            if (nG(u, n, o += "", 0) != o.length) return null;
            if ("Q" in u) return new Date(u.Q);
            if ("s" in u) return new Date(1000 * u.s + ("L" in u ? u.L : 0));
            if (!e || "Z" in u || (u.Z = 0), "p" in u && (u.H = u.H % 12 + 12 * u.p), void 0 === u.m && (u.m = "q" in u ? u.q : 0), "V" in u) {
                if (u.V < 1 || u.V > 53) return null;
                "w" in u || (u.w = 1), "Z" in u ? (a = (c = (a = s(h(u.y, 0, 1))).getUTCDay()) > 4 || 0 === c ? f.ceil(a) : f(a), u.y = (a = i.offset(a, (u.V - 1) * 7)).getUTCFullYear(), u.m = a.getUTCMonth(), u.d = a.getUTCDate() + (u.w + 6) % 7) : (a = (c = (a = g(h(u.y, 0, 1))).getDay()) > 4 || 0 === c ? r.ceil(a) : r(a), u.y = (a = t.offset(a, (u.V - 1) * 7)).getFullYear(), u.m = a.getMonth(), u.d = a.getDate() + (u.w + 6) % 7);
            } else ("W" in u || "U" in u) && ("w" in u || (u.w = "u" in u ? u.u % 7 : +("W" in u)), c = "Z" in u ? s(h(u.y, 0, 1)).getUTCDay() : g(h(u.y, 0, 1)).getDay(), u.m = 0, u.d = "W" in u ? (u.w + 6) % 7 + 7 * u.W - (c + 5) % 7 : u.w + 7 * u.U - (c + 6) % 7);
            return "Z" in u ? (u.H += u.Z / 100 | 0, u.M += u.Z % 100, s(u)) : g(u);
        };
    }
    function nG(t, e, r, n) {
        for(var u, c, i = 0, o = e.length, f = r.length; i < o;){
            if (n >= f) return -1;
            if (37 === (u = e.charCodeAt(i++))) {
                if (!(c = nb[(u = e.charAt(i++)) in y ? e.charAt(i++) : u]) || (n = c(t, r, n)) < 0) return -1;
            } else if (u != r.charCodeAt(n++)) return -1;
        }
        return n;
    }
    return u.x = o(l, u), u.X = o(v, u), u.c = o(a, u), c.x = o(l, c), c.X = o(v, c), c.c = o(a, c), {
        format: function(t) {
            var n = o(t += "", u);
            return n.toString = function() {
                return t;
            }, n;
        },
        parse: function(t) {
            var n = nB(t += "", !1);
            return n.toString = function() {
                return t;
            }, n;
        },
        utcFormat: function(t) {
            var n = o(t += "", c);
            return n.toString = function() {
                return t;
            }, n;
        },
        utcParse: function(t) {
            var n = nB(t += "", !0);
            return n.toString = function() {
                return t;
            }, n;
        }
    };
}
var y = {
    "-": "",
    _: " ",
    0: "0"
}, C = /^\s*\d+/, U = /^%/, d = /[\\^$*+?|[\]().{}]/g;
function D(n, c, e) {
    var r = n < 0 ? "-" : "", t = (r ? -n : n) + "", u = t.length;
    return r + (u < e ? Array(e - u + 1).join(c) + t : t);
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
function w(e, r, n) {
    var t = C.exec(r.slice(n, n + 1));
    return t ? (e.w = +t[0], n + t[0].length) : -1;
}
function M(e, r, n) {
    var t = C.exec(r.slice(n, n + 1));
    return t ? (e.u = +t[0], n + t[0].length) : -1;
}
function p(e, r, n) {
    var t = C.exec(r.slice(n, n + 2));
    return t ? (e.U = +t[0], n + t[0].length) : -1;
}
function H(e, r, n) {
    var t = C.exec(r.slice(n, n + 2));
    return t ? (e.V = +t[0], n + t[0].length) : -1;
}
function L(e, r, n) {
    var t = C.exec(r.slice(n, n + 2));
    return t ? (e.W = +t[0], n + t[0].length) : -1;
}
function S(e, r, n) {
    var t = C.exec(r.slice(n, n + 4));
    return t ? (e.y = +t[0], n + t[0].length) : -1;
}
function Y(e, r, t) {
    var n = C.exec(r.slice(t, t + 2));
    return n ? (e.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), t + n[0].length) : -1;
}
function F(e, r, t) {
    var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(r.slice(t, t + 6));
    return n ? (e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), t + n[0].length) : -1;
}
function Z(e, r, n) {
    var t = C.exec(r.slice(n, n + 1));
    return t ? (e.q = 3 * t[0] - 3, n + t[0].length) : -1;
}
function A(e, r, n) {
    var t = C.exec(r.slice(n, n + 2));
    return t ? (e.m = t[0] - 1, n + t[0].length) : -1;
}
function V(e, r, n) {
    var t = C.exec(r.slice(n, n + 2));
    return t ? (e.d = +t[0], n + t[0].length) : -1;
}
function W(e, r, n) {
    var t = C.exec(r.slice(n, n + 3));
    return t ? (e.m = 0, e.d = +t[0], n + t[0].length) : -1;
}
function j(e, r, n) {
    var t = C.exec(r.slice(n, n + 2));
    return t ? (e.H = +t[0], n + t[0].length) : -1;
}
function q(e, r, n) {
    var t = C.exec(r.slice(n, n + 2));
    return t ? (e.M = +t[0], n + t[0].length) : -1;
}
function Q(e, r, n) {
    var t = C.exec(r.slice(n, n + 2));
    return t ? (e.S = +t[0], n + t[0].length) : -1;
}
function X(e, r, n) {
    var t = C.exec(r.slice(n, n + 3));
    return t ? (e.L = +t[0], n + t[0].length) : -1;
}
function _(e, r, n) {
    var t = C.exec(r.slice(n, n + 6));
    return t ? (e.L = Math.floor(t[0] / 1000), n + t[0].length) : -1;
}
function b(r, e, n) {
    var t = U.exec(e.slice(n, n + 1));
    return t ? n + t[0].length : -1;
}
function B(e, r, t) {
    var n = C.exec(r.slice(t));
    return n ? (e.Q = +n[0], t + n[0].length) : -1;
}
function G(e, r, t) {
    var n = C.exec(r.slice(t));
    return n ? (e.s = +n[0], t + n[0].length) : -1;
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
function K(t) {
    var n = t.getDay();
    return 0 === n ? 7 : n;
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
function no(n, e) {
    var t = n.getDay();
    return D((n = t >= 4 || 0 === t ? u(n) : u.ceil(n)).getFullYear() % 10000, e, 4);
}
function nf(t) {
    var n = t.getTimezoneOffset();
    return (n > 0 ? "-" : (n *= -1, "+")) + D(n / 60 | 0, "0", 2) + D(n % 60, "0", 2);
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
function nd(t) {
    var n = t.getUTCDay();
    return 0 === n ? 7 : n;
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
function nL(n, e) {
    var t = n.getUTCDay();
    return D((n = t >= 4 || 0 === t ? a(n) : a.ceil(n)).getUTCFullYear() % 10000, e, 4);
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
