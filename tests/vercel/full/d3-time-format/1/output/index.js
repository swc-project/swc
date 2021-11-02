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
export default function c(e) {
    var f = function(b, c) {
        return function(d) {
            var e, f, g, h = [], i = -1, j = 0, k = b.length;
            for(a._instanceof(d, Date) || (d = new Date(+d)); ++i < k;)37 === b.charCodeAt(i) && (h.push(b.slice(j, i)), null != (f = o[e = b.charAt(++i)]) ? e = b.charAt(++i) : f = "e" === e ? " " : "0", (g = c[e]) && (e = g(d, f)), h.push(e), j = i + 1);
            return h.push(b.slice(j, i)), h.join("");
        };
    }, h = function(a, c) {
        return function(e) {
            var f, h, k = n(1900, void 0, 1);
            if (j(k, a, e += "", 0) != e.length) return null;
            if ("Q" in k) return new Date(k.Q);
            if ("s" in k) return new Date(1000 * k.s + ("L" in k ? k.L : 0));
            if (!c || "Z" in k || (k.Z = 0), "p" in k && (k.H = k.H % 12 + 12 * k.p), void 0 === k.m && (k.m = "q" in k ? k.q : 0), "V" in k) {
                if (k.V < 1 || k.V > 53) return null;
                "w" in k || (k.w = 1), "Z" in k ? (f = (h = (f = m(n(k.y, 0, 1))).getUTCDay()) > 4 || 0 === h ? i.ceil(f) : i(f), f = g.offset(f, (k.V - 1) * 7), k.y = f.getUTCFullYear(), k.m = f.getUTCMonth(), k.d = f.getUTCDate() + (k.w + 6) % 7) : (f = (h = (f = l(n(k.y, 0, 1))).getDay()) > 4 || 0 === h ? d.ceil(f) : d(f), f = b.offset(f, (k.V - 1) * 7), k.y = f.getFullYear(), k.m = f.getMonth(), k.d = f.getDate() + (k.w + 6) % 7);
            } else ("W" in k || "U" in k) && ("w" in k || (k.w = "u" in k ? k.u % 7 : "W" in k ? 1 : 0), h = "Z" in k ? m(n(k.y, 0, 1)).getUTCDay() : l(n(k.y, 0, 1)).getDay(), k.m = 0, k.d = "W" in k ? (k.w + 6) % 7 + 7 * k.W - (h + 5) % 7 : k.w + 7 * k.U - (h + 6) % 7);
            return "Z" in k ? (k.H += k.Z / 100 | 0, k.M += k.Z % 100, m(k)) : l(k);
        };
    }, j = function(a, b, c, d) {
        for(var e, f, g = 0, h = b.length, i = c.length; g < h;){
            if (d >= i) return -1;
            if (37 === (e = b.charCodeAt(g++))) {
                if (!(f = Ra[(e = b.charAt(g++)) in o ? b.charAt(g++) : e]) || (d = f(a, c, d)) < 0) return -1;
            } else if (e != c.charCodeAt(d++)) return -1;
        }
        return d;
    }, k = e.dateTime, p = e.date, q = e.time, r = e.periods, s = e.days, t = e.shortDays, _ = e.months, ta = e.shortMonths, Fa = u(r), Ga = v(r), Ha = u(s), Ia = v(s), Ja = u(t), Ka = v(t), La = u(_), Ma = v(_), Na = u(ta), Oa = v(ta), Pa = {
        a: function(a) {
            return t[a.getDay()];
        },
        A: function(a) {
            return s[a.getDay()];
        },
        b: function(a) {
            return ta[a.getMonth()];
        },
        B: function(a) {
            return _[a.getMonth()];
        },
        c: null,
        d: Q,
        e: Q,
        f: V,
        g: ea,
        G: ga,
        H: R,
        I: S,
        j: T,
        L: U,
        m: W,
        M: X,
        p: function(a) {
            return r[+(a.getHours() >= 12)];
        },
        q: function(a) {
            return 1 + ~~(a.getMonth() / 3);
        },
        Q: Da,
        s: Ea,
        S: Y,
        u: Z,
        U: $,
        V: aa,
        w: ba,
        W: ca,
        x: null,
        X: null,
        y: da,
        Y: fa,
        Z: ha,
        "%": Ca
    }, Qa = {
        a: function(a) {
            return t[a.getUTCDay()];
        },
        A: function(a) {
            return s[a.getUTCDay()];
        },
        b: function(a) {
            return ta[a.getUTCMonth()];
        },
        B: function(a) {
            return _[a.getUTCMonth()];
        },
        c: null,
        d: ia,
        e: ia,
        f: na,
        g: ya,
        G: Aa,
        H: ja,
        I: ka,
        j: la,
        L: ma,
        m: oa,
        M: pa,
        p: function(a) {
            return r[+(a.getUTCHours() >= 12)];
        },
        q: function(a) {
            return 1 + ~~(a.getUTCMonth() / 3);
        },
        Q: Da,
        s: Ea,
        S: qa,
        u: ra,
        U: sa,
        V: ua,
        w: va,
        W: wa,
        x: null,
        X: null,
        y: xa,
        Y: za,
        Z: Ba,
        "%": Ca
    }, Ra = {
        a: function(a, b, c) {
            var d = Ja.exec(b.slice(c));
            return d ? (a.w = Ka.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        A: function(a, b, c) {
            var d = Ha.exec(b.slice(c));
            return d ? (a.w = Ia.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        b: function(a, b, c) {
            var d = Na.exec(b.slice(c));
            return d ? (a.m = Oa.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        B: function(a, b, c) {
            var d = La.exec(b.slice(c));
            return d ? (a.m = Ma.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        c: function(a, b, c) {
            return j(a, k, b, c);
        },
        d: G,
        e: G,
        f: M,
        g: C,
        G: B,
        H: I,
        I: I,
        j: H,
        L: L,
        m: F,
        M: J,
        p: function(a, b, c) {
            var d = Fa.exec(b.slice(c));
            return d ? (a.p = Ga.get(d[0].toLowerCase()), c + d[0].length) : -1;
        },
        q: E,
        Q: O,
        s: P,
        S: K,
        u: x,
        U: y,
        V: z,
        w: w,
        W: A,
        x: function(a, b, c) {
            return j(a, p, b, c);
        },
        X: function(a, b, c) {
            return j(a, q, b, c);
        },
        y: C,
        Y: B,
        Z: D,
        "%": N
    };
    return Pa.x = f(p, Pa), Pa.X = f(q, Pa), Pa.c = f(k, Pa), Qa.x = f(p, Qa), Qa.X = f(q, Qa), Qa.c = f(k, Qa), {
        format: function(a) {
            var b = f(a += "", Pa);
            return b.toString = function() {
                return a;
            }, b;
        },
        parse: function(a) {
            var b = h(a += "", !1);
            return b.toString = function() {
                return a;
            }, b;
        },
        utcFormat: function(a) {
            var b = f(a += "", Qa);
            return b.toString = function() {
                return a;
            }, b;
        },
        utcParse: function(a) {
            var b = h(a += "", !0);
            return b.toString = function() {
                return a;
            }, b;
        }
    };
};
var o = {
    "-": "",
    "_": " ",
    "0": "0"
}, p = /^\s*\d+/, q = /^%/, r = /[\\^$*+?|[\]().{}]/g;
function s(a, b, c) {
    var d = a < 0 ? "-" : "", e = (d ? -a : a) + "", f = e.length;
    return d + (f < c ? new Array(c - f + 1).join(b) + e : e);
}
function t(a) {
    return a.replace(r, "\\$&");
}
function u(a) {
    return new RegExp("^(?:" + a.map(t).join("|") + ")", "i");
}
function v(a) {
    return new Map(a.map(function(a, b) {
        return [
            a.toLowerCase(),
            b
        ];
    }));
}
function w(a, b, c) {
    var d = p.exec(b.slice(c, c + 1));
    return d ? (a.w = +d[0], c + d[0].length) : -1;
}
function x(a, b, c) {
    var d = p.exec(b.slice(c, c + 1));
    return d ? (a.u = +d[0], c + d[0].length) : -1;
}
function y(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? (a.U = +d[0], c + d[0].length) : -1;
}
function z(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? (a.V = +d[0], c + d[0].length) : -1;
}
function A(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? (a.W = +d[0], c + d[0].length) : -1;
}
function B(a, b, c) {
    var d = p.exec(b.slice(c, c + 4));
    return d ? (a.y = +d[0], c + d[0].length) : -1;
}
function C(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? (a.y = +d[0] + (+d[0] > 68 ? 1900 : 2000), c + d[0].length) : -1;
}
function D(a, b, c) {
    var d = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(b.slice(c, c + 6));
    return d ? (a.Z = d[1] ? 0 : -(d[2] + (d[3] || "00")), c + d[0].length) : -1;
}
function E(a, b, c) {
    var d = p.exec(b.slice(c, c + 1));
    return d ? (a.q = 3 * d[0] - 3, c + d[0].length) : -1;
}
function F(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? (a.m = d[0] - 1, c + d[0].length) : -1;
}
function G(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? (a.d = +d[0], c + d[0].length) : -1;
}
function H(a, b, c) {
    var d = p.exec(b.slice(c, c + 3));
    return d ? (a.m = 0, a.d = +d[0], c + d[0].length) : -1;
}
function I(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? (a.H = +d[0], c + d[0].length) : -1;
}
function J(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? (a.M = +d[0], c + d[0].length) : -1;
}
function K(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? (a.S = +d[0], c + d[0].length) : -1;
}
function L(a, b, c) {
    var d = p.exec(b.slice(c, c + 3));
    return d ? (a.L = +d[0], c + d[0].length) : -1;
}
function M(a, b, c) {
    var d = p.exec(b.slice(c, c + 6));
    return d ? (a.L = Math.floor(d[0] / 1000), c + d[0].length) : -1;
}
function N(a, b, c) {
    var d = q.exec(b.slice(c, c + 1));
    return d ? c + d[0].length : -1;
}
function O(a, b, c) {
    var d = p.exec(b.slice(c));
    return d ? (a.Q = +d[0], c + d[0].length) : -1;
}
function P(a, b, c) {
    var d = p.exec(b.slice(c));
    return d ? (a.s = +d[0], c + d[0].length) : -1;
}
function Q(a, b) {
    return s(a.getDate(), b, 2);
}
function R(a, b) {
    return s(a.getHours(), b, 2);
}
function S(a, b) {
    return s(a.getHours() % 12 || 12, b, 2);
}
function T(a, c) {
    return s(1 + b.count(f(a), a), c, 3);
}
function U(a, b) {
    return s(a.getMilliseconds(), b, 3);
}
function V(a, b) {
    return U(a, b) + "000";
}
function W(a, b) {
    return s(a.getMonth() + 1, b, 2);
}
function X(a, b) {
    return s(a.getMinutes(), b, 2);
}
function Y(a, b) {
    return s(a.getSeconds(), b, 2);
}
function Z(a) {
    var b = a.getDay();
    return 0 === b ? 7 : b;
}
function $(a, b) {
    return s(c.count(f(a) - 1, a), b, 2);
}
function _(a) {
    var b = a.getDay();
    return b >= 4 || 0 === b ? e(a) : e.ceil(a);
}
function aa(a, b) {
    return a = _(a), s(e.count(f(a), a) + (4 === f(a).getDay()), b, 2);
}
function ba(a) {
    return a.getDay();
}
function ca(a, b) {
    return s(d.count(f(a) - 1, a), b, 2);
}
function da(a, b) {
    return s(a.getFullYear() % 100, b, 2);
}
function ea(a, b) {
    return s((a = _(a)).getFullYear() % 100, b, 2);
}
function fa(a, b) {
    return s(a.getFullYear() % 10000, b, 4);
}
function ga(a, b) {
    var c = a.getDay();
    return s((a = c >= 4 || 0 === c ? e(a) : e.ceil(a)).getFullYear() % 10000, b, 4);
}
function ha(a) {
    var b = a.getTimezoneOffset();
    return (b > 0 ? "-" : (b *= -1, "+")) + s(b / 60 | 0, "0", 2) + s(b % 60, "0", 2);
}
function ia(a, b) {
    return s(a.getUTCDate(), b, 2);
}
function ja(a, b) {
    return s(a.getUTCHours(), b, 2);
}
function ka(a, b) {
    return s(a.getUTCHours() % 12 || 12, b, 2);
}
function la(a, b) {
    return s(1 + g.count(k(a), a), b, 3);
}
function ma(a, b) {
    return s(a.getUTCMilliseconds(), b, 3);
}
function na(a, b) {
    return ma(a, b) + "000";
}
function oa(a, b) {
    return s(a.getUTCMonth() + 1, b, 2);
}
function pa(a, b) {
    return s(a.getUTCMinutes(), b, 2);
}
function qa(a, b) {
    return s(a.getUTCSeconds(), b, 2);
}
function ra(a) {
    var b = a.getUTCDay();
    return 0 === b ? 7 : b;
}
function sa(a, b) {
    return s(h.count(k(a) - 1, a), b, 2);
}
function ta(a) {
    var b = a.getUTCDay();
    return b >= 4 || 0 === b ? j(a) : j.ceil(a);
}
function ua(a, b) {
    return a = ta(a), s(j.count(k(a), a) + (4 === k(a).getUTCDay()), b, 2);
}
function va(a) {
    return a.getUTCDay();
}
function wa(a, b) {
    return s(i.count(k(a) - 1, a), b, 2);
}
function xa(a, b) {
    return s(a.getUTCFullYear() % 100, b, 2);
}
function ya(a, b) {
    return s((a = ta(a)).getUTCFullYear() % 100, b, 2);
}
function za(a, b) {
    return s(a.getUTCFullYear() % 10000, b, 4);
}
function Aa(a, b) {
    var c = a.getUTCDay();
    return s((a = c >= 4 || 0 === c ? j(a) : j.ceil(a)).getUTCFullYear() % 10000, b, 4);
}
function Ba() {
    return "+0000";
}
function Ca() {
    return "%";
}
function Da(a) {
    return +a;
}
function Ea(a) {
    return Math.floor(+a / 1000);
}
