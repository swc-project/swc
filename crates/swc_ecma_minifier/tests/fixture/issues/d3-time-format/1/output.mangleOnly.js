import { timeDay as a, timeSunday as b, timeMonday as c, timeThursday as d, timeYear as e, utcDay as f, utcSunday as g, utcMonday as h, utcThursday as i, utcYear as j } from "d3-time";
function k(a) {
    if (0 <= a.y && a.y < 100) {
        var b = new Date(-1, a.m, a.d, a.H, a.M, a.S, a.L);
        b.setFullYear(a.y);
        return b;
    }
    return new Date(a.y, a.m, a.d, a.H, a.M, a.S, a.L);
}
function l(a) {
    if (0 <= a.y && a.y < 100) {
        var b = new Date(Date.UTC(-1, a.m, a.d, a.H, a.M, a.S, a.L));
        b.setUTCFullYear(a.y);
        return b;
    }
    return new Date(Date.UTC(a.y, a.m, a.d, a.H, a.M, a.S, a.L));
}
function m(a, b, c) {
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
export default function n(b) {
    var g = b.dateTime, i = b.date, j = b.time, n = b.periods, p = b.days, q = b.shortDays, r = b.months, s = b.shortMonths;
    var t = u(n), _ = v(n), at = u(p), aF = v(p), aG = u(q), aH = v(q), aI = u(r), aJ = v(r), aK = u(s), aL = v(s);
    var d = {
        a: aY,
        A: aZ,
        b: a$,
        B: a_,
        c: null,
        d: Q,
        e: Q,
        f: V,
        g: ae,
        G: ag,
        H: R,
        I: S,
        j: T,
        L: U,
        m: W,
        M: X,
        p: a0,
        q: a1,
        Q: aD,
        s: aE,
        S: Y,
        u: Z,
        U: $,
        V: aa,
        w: ab,
        W: ac,
        x: null,
        X: null,
        y: ad,
        Y: af,
        Z: ah,
        "%": aC
    };
    var e = {
        a: a2,
        A: a3,
        b: a4,
        B: a5,
        c: null,
        d: ai,
        e: ai,
        f: an,
        g: ay,
        G: aA,
        H: aj,
        I: ak,
        j: al,
        L: am,
        m: ao,
        M: ap,
        p: a6,
        q: a7,
        Q: aD,
        s: aE,
        S: aq,
        u: ar,
        U: as,
        V: au,
        w: av,
        W: aw,
        x: null,
        X: null,
        y: ax,
        Y: az,
        Z: aB,
        "%": aC
    };
    var aM = {
        a: aR,
        A: aS,
        b: aT,
        B: aU,
        c: aV,
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
        p: aQ,
        q: E,
        Q: O,
        s: P,
        S: K,
        u: x,
        U: y,
        V: z,
        w: w,
        W: A,
        x: aW,
        X: aX,
        y: C,
        Y: B,
        Z: D,
        "%": N
    };
    d.x = aN(i, d);
    d.X = aN(j, d);
    d.c = aN(g, d);
    e.x = aN(i, e);
    e.X = aN(j, e);
    e.c = aN(g, e);
    function aN(a, b) {
        return function(e) {
            var f = [], c = -1, g = 0, j = a.length, d, h, i;
            if (!(e instanceof Date)) e = new Date(+e);
            while(++c < j){
                if (a.charCodeAt(c) === 37) {
                    f.push(a.slice(g, c));
                    if ((h = o[(d = a.charAt(++c))]) != null) d = a.charAt(++c);
                    else h = d === "e" ? " " : "0";
                    if ((i = b[d])) d = i(e, h);
                    f.push(d);
                    g = c + 1;
                }
            }
            f.push(a.slice(g, c));
            return f.join("");
        };
    }
    function aO(b, d) {
        return function(j) {
            var e = m(1900, undefined, 1), n = aP(e, b, (j += ""), 0), g, i;
            if (n != j.length) return null;
            if ("Q" in e) return new Date(e.Q);
            if ("s" in e) return new Date(e.s * 1000 + ("L" in e ? e.L : 0));
            if (d && !("Z" in e)) e.Z = 0;
            if ("p" in e) e.H = (e.H % 12) + e.p * 12;
            if (e.m === undefined) e.m = "q" in e ? e.q : 0;
            if ("V" in e) {
                if (e.V < 1 || e.V > 53) return null;
                if (!("w" in e)) e.w = 1;
                if ("Z" in e) {
                    (g = l(m(e.y, 0, 1))), (i = g.getUTCDay());
                    g = i > 4 || i === 0 ? h.ceil(g) : h(g);
                    g = f.offset(g, (e.V - 1) * 7);
                    e.y = g.getUTCFullYear();
                    e.m = g.getUTCMonth();
                    e.d = g.getUTCDate() + ((e.w + 6) % 7);
                } else {
                    (g = k(m(e.y, 0, 1))), (i = g.getDay());
                    g = i > 4 || i === 0 ? c.ceil(g) : c(g);
                    g = a.offset(g, (e.V - 1) * 7);
                    e.y = g.getFullYear();
                    e.m = g.getMonth();
                    e.d = g.getDate() + ((e.w + 6) % 7);
                }
            } else if ("W" in e || "U" in e) {
                if (!("w" in e)) e.w = "u" in e ? e.u % 7 : "W" in e ? 1 : 0;
                i = "Z" in e ? l(m(e.y, 0, 1)).getUTCDay() : k(m(e.y, 0, 1)).getDay();
                e.m = 0;
                e.d = "W" in e ? ((e.w + 6) % 7) + e.W * 7 - ((i + 5) % 7) : e.w + e.U * 7 - ((i + 6) % 7);
            }
            if ("Z" in e) {
                e.H += (e.Z / 100) | 0;
                e.M += e.Z % 100;
                return l(e);
            }
            return k(e);
        };
    }
    function aP(g, c, e, b) {
        var d = 0, h = c.length, i = e.length, a, f;
        while(d < h){
            if (b >= i) return -1;
            a = c.charCodeAt(d++);
            if (a === 37) {
                a = c.charAt(d++);
                f = aM[a in o ? c.charAt(d++) : a];
                if (!f || (b = f(g, e, b)) < 0) return -1;
            } else if (a != e.charCodeAt(b++)) {
                return -1;
            }
        }
        return b;
    }
    function aQ(c, d, b) {
        var a = t.exec(d.slice(b));
        return a ? ((c.p = _.get(a[0].toLowerCase())), b + a[0].length) : -1;
    }
    function aR(c, d, b) {
        var a = aG.exec(d.slice(b));
        return a ? ((c.w = aH.get(a[0].toLowerCase())), b + a[0].length) : -1;
    }
    function aS(c, d, b) {
        var a = at.exec(d.slice(b));
        return a ? ((c.w = aF.get(a[0].toLowerCase())), b + a[0].length) : -1;
    }
    function aT(c, d, b) {
        var a = aK.exec(d.slice(b));
        return a ? ((c.m = aL.get(a[0].toLowerCase())), b + a[0].length) : -1;
    }
    function aU(c, d, b) {
        var a = aI.exec(d.slice(b));
        return a ? ((c.m = aJ.get(a[0].toLowerCase())), b + a[0].length) : -1;
    }
    function aV(a, b, c) {
        return aP(a, g, b, c);
    }
    function aW(a, b, c) {
        return aP(a, i, b, c);
    }
    function aX(a, b, c) {
        return aP(a, j, b, c);
    }
    function aY(a) {
        return q[a.getDay()];
    }
    function aZ(a) {
        return p[a.getDay()];
    }
    function a$(a) {
        return s[a.getMonth()];
    }
    function a_(a) {
        return r[a.getMonth()];
    }
    function a0(a) {
        return n[+(a.getHours() >= 12)];
    }
    function a1(a) {
        return 1 + ~~(a.getMonth() / 3);
    }
    function a2(a) {
        return q[a.getUTCDay()];
    }
    function a3(a) {
        return p[a.getUTCDay()];
    }
    function a4(a) {
        return s[a.getUTCMonth()];
    }
    function a5(a) {
        return r[a.getUTCMonth()];
    }
    function a6(a) {
        return n[+(a.getUTCHours() >= 12)];
    }
    function a7(a) {
        return 1 + ~~(a.getUTCMonth() / 3);
    }
    return {
        format: function(b) {
            var a = aN((b += ""), d);
            a.toString = function() {
                return b;
            };
            return a;
        },
        parse: function(b) {
            var a = aO((b += ""), false);
            a.toString = function() {
                return b;
            };
            return a;
        },
        utcFormat: function(b) {
            var a = aN((b += ""), e);
            a.toString = function() {
                return b;
            };
            return a;
        },
        utcParse: function(b) {
            var a = aO((b += ""), true);
            a.toString = function() {
                return b;
            };
            return a;
        }
    };
};
var o = {
    "-": "",
    _: " ",
    0: "0"
}, p = /^\s*\d+/, q = /^%/, r = /[\\^$*+?|[\]().{}]/g;
function s(a, f, c) {
    var d = a < 0 ? "-" : "", b = (d ? -a : a) + "", e = b.length;
    return (d + (e < c ? new Array(c - e + 1).join(f) + b : b));
}
function t(a) {
    return a.replace(r, "\\$&");
}
function u(a) {
    return new RegExp("^(?:" + a.map(t).join("|") + ")", "i");
}
function v(a) {
    return new Map(a.map((a, b)=>[
            a.toLowerCase(),
            b
        ]));
}
function w(c, d, a) {
    var b = p.exec(d.slice(a, a + 1));
    return b ? ((c.w = +b[0]), a + b[0].length) : -1;
}
function x(c, d, a) {
    var b = p.exec(d.slice(a, a + 1));
    return b ? ((c.u = +b[0]), a + b[0].length) : -1;
}
function y(c, d, a) {
    var b = p.exec(d.slice(a, a + 2));
    return b ? ((c.U = +b[0]), a + b[0].length) : -1;
}
function z(c, d, a) {
    var b = p.exec(d.slice(a, a + 2));
    return b ? ((c.V = +b[0]), a + b[0].length) : -1;
}
function A(c, d, a) {
    var b = p.exec(d.slice(a, a + 2));
    return b ? ((c.W = +b[0]), a + b[0].length) : -1;
}
function B(c, d, a) {
    var b = p.exec(d.slice(a, a + 4));
    return b ? ((c.y = +b[0]), a + b[0].length) : -1;
}
function C(c, d, b) {
    var a = p.exec(d.slice(b, b + 2));
    return a ? ((c.y = +a[0] + (+a[0] > 68 ? 1900 : 2000)), b + a[0].length) : -1;
}
function D(c, d, b) {
    var a = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(d.slice(b, b + 6));
    return a ? ((c.Z = a[1] ? 0 : -(a[2] + (a[3] || "00"))), b + a[0].length) : -1;
}
function E(c, d, a) {
    var b = p.exec(d.slice(a, a + 1));
    return b ? ((c.q = b[0] * 3 - 3), a + b[0].length) : -1;
}
function F(c, d, a) {
    var b = p.exec(d.slice(a, a + 2));
    return b ? ((c.m = b[0] - 1), a + b[0].length) : -1;
}
function G(c, d, a) {
    var b = p.exec(d.slice(a, a + 2));
    return b ? ((c.d = +b[0]), a + b[0].length) : -1;
}
function H(c, d, a) {
    var b = p.exec(d.slice(a, a + 3));
    return b ? ((c.m = 0), (c.d = +b[0]), a + b[0].length) : -1;
}
function I(c, d, a) {
    var b = p.exec(d.slice(a, a + 2));
    return b ? ((c.H = +b[0]), a + b[0].length) : -1;
}
function J(c, d, a) {
    var b = p.exec(d.slice(a, a + 2));
    return b ? ((c.M = +b[0]), a + b[0].length) : -1;
}
function K(c, d, a) {
    var b = p.exec(d.slice(a, a + 2));
    return b ? ((c.S = +b[0]), a + b[0].length) : -1;
}
function L(c, d, a) {
    var b = p.exec(d.slice(a, a + 3));
    return b ? ((c.L = +b[0]), a + b[0].length) : -1;
}
function M(c, d, a) {
    var b = p.exec(d.slice(a, a + 6));
    return b ? ((c.L = Math.floor(b[0] / 1000)), a + b[0].length) : -1;
}
function N(d, c, a) {
    var b = q.exec(c.slice(a, a + 1));
    return b ? a + b[0].length : -1;
}
function O(c, d, b) {
    var a = p.exec(d.slice(b));
    return a ? ((c.Q = +a[0]), b + a[0].length) : -1;
}
function P(c, d, b) {
    var a = p.exec(d.slice(b));
    return a ? ((c.s = +a[0]), b + a[0].length) : -1;
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
function T(b, c) {
    return s(1 + a.count(e(b), b), c, 3);
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
function Z(b) {
    var a = b.getDay();
    return a === 0 ? 7 : a;
}
function $(a, c) {
    return s(b.count(e(a) - 1, a), c, 2);
}
function _(a) {
    var b = a.getDay();
    return b >= 4 || b === 0 ? d(a) : d.ceil(a);
}
function aa(a, b) {
    a = _(a);
    return s(d.count(e(a), a) + (e(a).getDay() === 4), b, 2);
}
function ab(a) {
    return a.getDay();
}
function ac(a, b) {
    return s(c.count(e(a) - 1, a), b, 2);
}
function ad(a, b) {
    return s(a.getFullYear() % 100, b, 2);
}
function ae(a, b) {
    a = _(a);
    return s(a.getFullYear() % 100, b, 2);
}
function af(a, b) {
    return s(a.getFullYear() % 10000, b, 4);
}
function ag(a, c) {
    var b = a.getDay();
    a = b >= 4 || b === 0 ? d(a) : d.ceil(a);
    return s(a.getFullYear() % 10000, c, 4);
}
function ah(b) {
    var a = b.getTimezoneOffset();
    return ((a > 0 ? "-" : ((a *= -1), "+")) + s((a / 60) | 0, "0", 2) + s(a % 60, "0", 2));
}
function ai(a, b) {
    return s(a.getUTCDate(), b, 2);
}
function aj(a, b) {
    return s(a.getUTCHours(), b, 2);
}
function ak(a, b) {
    return s(a.getUTCHours() % 12 || 12, b, 2);
}
function al(a, b) {
    return s(1 + f.count(j(a), a), b, 3);
}
function am(a, b) {
    return s(a.getUTCMilliseconds(), b, 3);
}
function an(a, b) {
    return am(a, b) + "000";
}
function ao(a, b) {
    return s(a.getUTCMonth() + 1, b, 2);
}
function ap(a, b) {
    return s(a.getUTCMinutes(), b, 2);
}
function aq(a, b) {
    return s(a.getUTCSeconds(), b, 2);
}
function ar(b) {
    var a = b.getUTCDay();
    return a === 0 ? 7 : a;
}
function as(a, b) {
    return s(g.count(j(a) - 1, a), b, 2);
}
function at(a) {
    var b = a.getUTCDay();
    return b >= 4 || b === 0 ? i(a) : i.ceil(a);
}
function au(a, b) {
    a = at(a);
    return s(i.count(j(a), a) + (j(a).getUTCDay() === 4), b, 2);
}
function av(a) {
    return a.getUTCDay();
}
function aw(a, b) {
    return s(h.count(j(a) - 1, a), b, 2);
}
function ax(a, b) {
    return s(a.getUTCFullYear() % 100, b, 2);
}
function ay(a, b) {
    a = at(a);
    return s(a.getUTCFullYear() % 100, b, 2);
}
function az(a, b) {
    return s(a.getUTCFullYear() % 10000, b, 4);
}
function aA(a, c) {
    var b = a.getUTCDay();
    a = b >= 4 || b === 0 ? i(a) : i.ceil(a);
    return s(a.getUTCFullYear() % 10000, c, 4);
}
function aB() {
    return "+0000";
}
function aC() {
    return "%";
}
function aD(a) {
    return +a;
}
function aE(a) {
    return Math.floor(+a / 1000);
}
