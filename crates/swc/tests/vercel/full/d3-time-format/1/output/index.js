import * as a from "@swc/helpers";
import { timeDay as b, timeSunday as c, timeMonday as d, timeThursday as e, timeYear as f, utcDay as g, utcSunday as h, utcMonday as i, utcThursday as j, utcYear as k } from "d3-time";
function l(a) {
    if (0 <= a.y && a.y < 100) {
        var b = new Date(-1, a.m, a.d, a.H, a.M, a.S, a.L);
        return b.setFullYear(a.y), b;
    }
    return new Date(a.y, a.m, a.d, a.H, a.M, a.S, a.L);
}
function m(a) {
    if (0 <= a.y && a.y < 100) {
        var b = new Date(Date.UTC(-1, a.m, a.d, a.H, a.M, a.S, a.L));
        return b.setUTCFullYear(a.y), b;
    }
    return new Date(Date.UTC(a.y, a.m, a.d, a.H, a.M, a.S, a.L));
}
function n(a, b, c) {
    return {
        y: a,
        m: b,
        d: c,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
export default function o(c) {
    var e = function(b, c) {
        return function(d) {
            var e, f, g, h = [], i = -1, j = 0, k = b.length;
            for(a._instanceof(d, Date) || (d = new Date(+d)); ++i < k;)37 === b.charCodeAt(i) && (h.push(b.slice(j, i)), null != (f = p[e = b.charAt(++i)]) ? e = b.charAt(++i) : f = "e" === e ? " " : "0", (g = c[e]) && (e = g(d, f)), h.push(e), j = i + 1);
            return h.push(b.slice(j, i)), h.join("");
        };
    }, f = function(a, c) {
        return function(e) {
            var f, j, k = n(1900, void 0, 1);
            if (h(k, a, e += "", 0) != e.length) return null;
            if ("Q" in k) return new Date(k.Q);
            if ("s" in k) return new Date(1000 * k.s + ("L" in k ? k.L : 0));
            if (!c || "Z" in k || (k.Z = 0), "p" in k && (k.H = k.H % 12 + 12 * k.p), void 0 === k.m && (k.m = "q" in k ? k.q : 0), "V" in k) {
                if (k.V < 1 || k.V > 53) return null;
                "w" in k || (k.w = 1), "Z" in k ? (f = (j = (f = m(n(k.y, 0, 1))).getUTCDay()) > 4 || 0 === j ? i.ceil(f) : i(f), f = g.offset(f, (k.V - 1) * 7), k.y = f.getUTCFullYear(), k.m = f.getUTCMonth(), k.d = f.getUTCDate() + (k.w + 6) % 7) : (f = (j = (f = l(n(k.y, 0, 1))).getDay()) > 4 || 0 === j ? d.ceil(f) : d(f), f = b.offset(f, (k.V - 1) * 7), k.y = f.getFullYear(), k.m = f.getMonth(), k.d = f.getDate() + (k.w + 6) % 7);
            } else ("W" in k || "U" in k) && ("w" in k || (k.w = "u" in k ? k.u % 7 : "W" in k ? 1 : 0), j = "Z" in k ? m(n(k.y, 0, 1)).getUTCDay() : l(n(k.y, 0, 1)).getDay(), k.m = 0, k.d = "W" in k ? (k.w + 6) % 7 + 7 * k.W - (j + 5) % 7 : k.w + 7 * k.U - (j + 6) % 7);
            return "Z" in k ? (k.H += k.Z / 100 | 0, k.M += k.Z % 100, m(k)) : l(k);
        };
    }, h = function(a, b, c, d) {
        for(var e, f, g = 0, h = b.length, i = c.length; g < h;){
            if (d >= i) return -1;
            if (37 === (e = b.charCodeAt(g++))) {
                if (!(f = Qa[(e = b.charAt(g++)) in p ? b.charAt(g++) : e]) || (d = f(a, c, d)) < 0) return -1;
            } else if (e != c.charCodeAt(d++)) return -1;
        }
        return d;
    }, j = c.dateTime, k = c.date, o = c.time, q = c.periods, r = c.days, s = c.shortDays, t = c.months, u = c.shortMonths, aa = v(q), ua = w(q), Ga = v(r), Ha = w(r), Ia = v(s), Ja = w(s), Ka = v(t), La = w(t), Ma = v(u), Na = w(u), Oa = {
        a: function(a) {
            return s[a.getDay()];
        },
        A: function(a) {
            return r[a.getDay()];
        },
        b: function(a) {
            return u[a.getMonth()];
        },
        B: function(a) {
            return t[a.getMonth()];
        },
        c: null,
        d: R,
        e: R,
        f: W,
        g: fa,
        G: ha,
        H: S,
        I: T,
        j: U,
        L: V,
        m: X,
        M: Y,
        p: function(a) {
            return q[+(a.getHours() >= 12)];
        },
        q: function(a) {
            return 1 + ~~(a.getMonth() / 3);
        },
        Q: Ea,
        s: Fa,
        S: Z,
        u: $,
        U: _,
        V: ba,
        w: ca,
        W: da,
        x: null,
        X: null,
        y: ea,
        Y: ga,
        Z: ia,
        "%": Da
    }, Pa = {
        a: function(a) {
            return s[a.getUTCDay()];
        },
        A: function(a) {
            return r[a.getUTCDay()];
        },
        b: function(a) {
            return u[a.getUTCMonth()];
        },
        B: function(a) {
            return t[a.getUTCMonth()];
        },
        c: null,
        d: ja,
        e: ja,
        f: oa,
        g: za,
        G: Ba,
        H: ka,
        I: la,
        j: ma,
        L: na,
        m: pa,
        M: qa,
        p: function(a) {
            return q[+(a.getUTCHours() >= 12)];
        },
        q: function(a) {
            return 1 + ~~(a.getUTCMonth() / 3);
        },
        Q: Ea,
        s: Fa,
        S: ra,
        u: sa,
        U: ta,
        V: va,
        w: wa,
        W: xa,
        x: null,
        X: null,
        y: ya,
        Y: Aa,
        Z: Ca,
        "%": Da
    }, Qa = {
        a: function(a, b, c) {
            var d = Ia.exec(b.slice(c));
            return d ? (a.w = Ja.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        A: function(a, b, c) {
            var d = Ga.exec(b.slice(c));
            return d ? (a.w = Ha.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        b: function(a, b, c) {
            var d = Ma.exec(b.slice(c));
            return d ? (a.m = Na.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        B: function(a, b, c) {
            var d = Ka.exec(b.slice(c));
            return d ? (a.m = La.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        c: function(a, b, c) {
            return h(a, j, b, c);
        },
        d: H,
        e: H,
        f: N,
        g: D,
        G: C,
        H: J,
        I: J,
        j: I,
        L: M,
        m: G,
        M: K,
        p: function(a, b, c) {
            var d = aa.exec(b.slice(c));
            return d ? (a.p = ua.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        q: F,
        Q: P,
        s: Q,
        S: L,
        u: y,
        U: z,
        V: A,
        w: x,
        W: B,
        x: function(a, b, c) {
            return h(a, k, b, c);
        },
        X: function(a, b, c) {
            return h(a, o, b, c);
        },
        y: D,
        Y: C,
        Z: E,
        "%": O
    };
    return Oa.x = e(k, Oa), Oa.X = e(o, Oa), Oa.c = e(j, Oa), Pa.x = e(k, Pa), Pa.X = e(o, Pa), Pa.c = e(j, Pa), {
        format: function(a) {
            var b = e(a += "", Oa);
            return b.toString = function() {
                return a;
            }, b;
        },
        parse: function(a) {
            var b = f(a += "", !1);
            return b.toString = function() {
                return a;
            }, b;
        },
        utcFormat: function(a) {
            var b = e(a += "", Pa);
            return b.toString = function() {
                return a;
            }, b;
        },
        utcParse: function(a) {
            var b = f(a += "", !0);
            return b.toString = function() {
                return a;
            }, b;
        }
    };
};
var p = {
    "-": "",
    "_": " ",
    "0": "0"
}, q = /^\s*\d+/, r = /^%/, s = /[\\^$*+?|[\]().{}]/g;
function t(a, b, c) {
    var d = a < 0 ? "-" : "", e = (d ? -a : a) + "", f = e.length;
    return d + (f < c ? new Array(c - f + 1).join(b) + e : e);
}
function u(a) {
    return a.replace(s, "\\$&");
}
function v(a) {
    return new RegExp("^(?:" + a.map(u).join("|") + ")", "i");
}
function w(a) {
    return new Map(a.map(function(a, b) {
        return [
            a.toLowerCase(),
            b
        ];
    }));
}
function x(a, b, c) {
    var d = q.exec(b.slice(c, c + 1));
    return d ? (a.w = +d[0], c + d[0].length) : -1;
}
function y(a, b, c) {
    var d = q.exec(b.slice(c, c + 1));
    return d ? (a.u = +d[0], c + d[0].length) : -1;
}
function z(a, b, c) {
    var d = q.exec(b.slice(c, c + 2));
    return d ? (a.U = +d[0], c + d[0].length) : -1;
}
function A(a, b, c) {
    var d = q.exec(b.slice(c, c + 2));
    return d ? (a.V = +d[0], c + d[0].length) : -1;
}
function B(a, b, c) {
    var d = q.exec(b.slice(c, c + 2));
    return d ? (a.W = +d[0], c + d[0].length) : -1;
}
function C(a, b, c) {
    var d = q.exec(b.slice(c, c + 4));
    return d ? (a.y = +d[0], c + d[0].length) : -1;
}
function D(a, b, c) {
    var d = q.exec(b.slice(c, c + 2));
    return d ? (a.y = +d[0] + (+d[0] > 68 ? 1900 : 2000), c + d[0].length) : -1;
}
function E(a, b, c) {
    var d = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(b.slice(c, c + 6));
    return d ? (a.Z = d[1] ? 0 : -(d[2] + (d[3] || "00")), c + d[0].length) : -1;
}
function F(a, b, c) {
    var d = q.exec(b.slice(c, c + 1));
    return d ? (a.q = 3 * d[0] - 3, c + d[0].length) : -1;
}
function G(a, b, c) {
    var d = q.exec(b.slice(c, c + 2));
    return d ? (a.m = d[0] - 1, c + d[0].length) : -1;
}
function H(a, b, c) {
    var d = q.exec(b.slice(c, c + 2));
    return d ? (a.d = +d[0], c + d[0].length) : -1;
}
function I(a, b, c) {
    var d = q.exec(b.slice(c, c + 3));
    return d ? (a.m = 0, a.d = +d[0], c + d[0].length) : -1;
}
function J(a, b, c) {
    var d = q.exec(b.slice(c, c + 2));
    return d ? (a.H = +d[0], c + d[0].length) : -1;
}
function K(a, b, c) {
    var d = q.exec(b.slice(c, c + 2));
    return d ? (a.M = +d[0], c + d[0].length) : -1;
}
function L(a, b, c) {
    var d = q.exec(b.slice(c, c + 2));
    return d ? (a.S = +d[0], c + d[0].length) : -1;
}
function M(a, b, c) {
    var d = q.exec(b.slice(c, c + 3));
    return d ? (a.L = +d[0], c + d[0].length) : -1;
}
function N(a, b, c) {
    var d = q.exec(b.slice(c, c + 6));
    return d ? (a.L = Math.floor(d[0] / 1000), c + d[0].length) : -1;
}
function O(a, b, c) {
    var d = r.exec(b.slice(c, c + 1));
    return d ? c + d[0].length : -1;
}
function P(a, b, c) {
    var d = q.exec(b.slice(c));
    return d ? (a.Q = +d[0], c + d[0].length) : -1;
}
function Q(a, b, c) {
    var d = q.exec(b.slice(c));
    return d ? (a.s = +d[0], c + d[0].length) : -1;
}
function R(a, b) {
    return t(a.getDate(), b, 2);
}
function S(a, b) {
    return t(a.getHours(), b, 2);
}
function T(a, b) {
    return t(a.getHours() % 12 || 12, b, 2);
}
function U(a, c) {
    return t(1 + b.count(f(a), a), c, 3);
}
function V(a, b) {
    return t(a.getMilliseconds(), b, 3);
}
function W(a, b) {
    return V(a, b) + "000";
}
function X(a, b) {
    return t(a.getMonth() + 1, b, 2);
}
function Y(a, b) {
    return t(a.getMinutes(), b, 2);
}
function Z(a, b) {
    return t(a.getSeconds(), b, 2);
}
function $(a) {
    var b = a.getDay();
    return 0 === b ? 7 : b;
}
function _(a, b) {
    return t(c.count(f(a) - 1, a), b, 2);
}
function aa(a) {
    var b = a.getDay();
    return b >= 4 || 0 === b ? e(a) : e.ceil(a);
}
function ba(a, b) {
    return a = aa(a), t(e.count(f(a), a) + (4 === f(a).getDay()), b, 2);
}
function ca(a) {
    return a.getDay();
}
function da(a, b) {
    return t(d.count(f(a) - 1, a), b, 2);
}
function ea(a, b) {
    return t(a.getFullYear() % 100, b, 2);
}
function fa(a, b) {
    return t((a = aa(a)).getFullYear() % 100, b, 2);
}
function ga(a, b) {
    return t(a.getFullYear() % 10000, b, 4);
}
function ha(a, b) {
    var c = a.getDay();
    return t((a = c >= 4 || 0 === c ? e(a) : e.ceil(a)).getFullYear() % 10000, b, 4);
}
function ia(a) {
    var b = a.getTimezoneOffset();
    return (b > 0 ? "-" : (b *= -1, "+")) + t(b / 60 | 0, "0", 2) + t(b % 60, "0", 2);
}
function ja(a, b) {
    return t(a.getUTCDate(), b, 2);
}
function ka(a, b) {
    return t(a.getUTCHours(), b, 2);
}
function la(a, b) {
    return t(a.getUTCHours() % 12 || 12, b, 2);
}
function ma(a, b) {
    return t(1 + g.count(k(a), a), b, 3);
}
function na(a, b) {
    return t(a.getUTCMilliseconds(), b, 3);
}
function oa(a, b) {
    return na(a, b) + "000";
}
function pa(a, b) {
    return t(a.getUTCMonth() + 1, b, 2);
}
function qa(a, b) {
    return t(a.getUTCMinutes(), b, 2);
}
function ra(a, b) {
    return t(a.getUTCSeconds(), b, 2);
}
function sa(a) {
    var b = a.getUTCDay();
    return 0 === b ? 7 : b;
}
function ta(a, b) {
    return t(h.count(k(a) - 1, a), b, 2);
}
function ua(a) {
    var b = a.getUTCDay();
    return b >= 4 || 0 === b ? j(a) : j.ceil(a);
}
function va(a, b) {
    return a = ua(a), t(j.count(k(a), a) + (4 === k(a).getUTCDay()), b, 2);
}
function wa(a) {
    return a.getUTCDay();
}
function xa(a, b) {
    return t(i.count(k(a) - 1, a), b, 2);
}
function ya(a, b) {
    return t(a.getUTCFullYear() % 100, b, 2);
}
function za(a, b) {
    return t((a = ua(a)).getUTCFullYear() % 100, b, 2);
}
function Aa(a, b) {
    return t(a.getUTCFullYear() % 10000, b, 4);
}
function Ba(a, b) {
    var c = a.getUTCDay();
    return t((a = c >= 4 || 0 === c ? j(a) : j.ceil(a)).getUTCFullYear() % 10000, b, 4);
}
function Ca() {
    return "+0000";
}
function Da() {
    return "%";
}
function Ea(a) {
    return +a;
}
function Fa(a) {
    return Math.floor(+a / 1000);
}
