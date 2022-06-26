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
    var d = b.dateTime, e = b.date, g = b.time, i = b.periods, j = b.days, n = b.shortDays, p = b.months, q = b.shortMonths;
    var r = u(i), s = v(i), t = u(j), _ = v(j), at = u(n), aF = v(n), aG = u(p), aH = v(p), aI = u(q), aJ = v(q);
    var aK = {
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
    var aL = {
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
    aK.x = aN(e, aK);
    aK.X = aN(g, aK);
    aK.c = aN(d, aK);
    aL.x = aN(e, aL);
    aL.X = aN(g, aL);
    aL.c = aN(d, aL);
    function aN(a, b) {
        return function(c) {
            var d = [], e = -1, f = 0, g = a.length, h, i, j;
            if (!(c instanceof Date)) c = new Date(+c);
            while(++e < g){
                if (a.charCodeAt(e) === 37) {
                    d.push(a.slice(f, e));
                    if ((i = o[(h = a.charAt(++e))]) != null) h = a.charAt(++e);
                    else i = h === "e" ? " " : "0";
                    if ((j = b[h])) h = j(c, i);
                    d.push(h);
                    f = e + 1;
                }
            }
            d.push(a.slice(f, e));
            return d.join("");
        };
    }
    function aO(b, d) {
        return function(e) {
            var g = m(1900, undefined, 1), i = aP(g, b, (e += ""), 0), j, n;
            if (i != e.length) return null;
            if ("Q" in g) return new Date(g.Q);
            if ("s" in g) return new Date(g.s * 1000 + ("L" in g ? g.L : 0));
            if (d && !("Z" in g)) g.Z = 0;
            if ("p" in g) g.H = (g.H % 12) + g.p * 12;
            if (g.m === undefined) g.m = "q" in g ? g.q : 0;
            if ("V" in g) {
                if (g.V < 1 || g.V > 53) return null;
                if (!("w" in g)) g.w = 1;
                if ("Z" in g) {
                    (j = l(m(g.y, 0, 1))), (n = j.getUTCDay());
                    j = n > 4 || n === 0 ? h.ceil(j) : h(j);
                    j = f.offset(j, (g.V - 1) * 7);
                    g.y = j.getUTCFullYear();
                    g.m = j.getUTCMonth();
                    g.d = j.getUTCDate() + ((g.w + 6) % 7);
                } else {
                    (j = k(m(g.y, 0, 1))), (n = j.getDay());
                    j = n > 4 || n === 0 ? c.ceil(j) : c(j);
                    j = a.offset(j, (g.V - 1) * 7);
                    g.y = j.getFullYear();
                    g.m = j.getMonth();
                    g.d = j.getDate() + ((g.w + 6) % 7);
                }
            } else if ("W" in g || "U" in g) {
                if (!("w" in g)) g.w = "u" in g ? g.u % 7 : "W" in g ? 1 : 0;
                n = "Z" in g ? l(m(g.y, 0, 1)).getUTCDay() : k(m(g.y, 0, 1)).getDay();
                g.m = 0;
                g.d = "W" in g ? ((g.w + 6) % 7) + g.W * 7 - ((n + 5) % 7) : g.w + g.U * 7 - ((n + 6) % 7);
            }
            if ("Z" in g) {
                g.H += (g.Z / 100) | 0;
                g.M += g.Z % 100;
                return l(g);
            }
            return k(g);
        };
    }
    function aP(a, b, c, d) {
        var e = 0, f = b.length, g = c.length, h, i;
        while(e < f){
            if (d >= g) return -1;
            h = b.charCodeAt(e++);
            if (h === 37) {
                h = b.charAt(e++);
                i = aM[h in o ? b.charAt(e++) : h];
                if (!i || (d = i(a, c, d)) < 0) return -1;
            } else if (h != c.charCodeAt(d++)) {
                return -1;
            }
        }
        return d;
    }
    function aQ(a, b, c) {
        var d = r.exec(b.slice(c));
        return d ? ((a.p = s.get(d[0].toLowerCase())), c + d[0].length) : -1;
    }
    function aR(a, b, c) {
        var d = at.exec(b.slice(c));
        return d ? ((a.w = aF.get(d[0].toLowerCase())), c + d[0].length) : -1;
    }
    function aS(a, b, c) {
        var d = t.exec(b.slice(c));
        return d ? ((a.w = _.get(d[0].toLowerCase())), c + d[0].length) : -1;
    }
    function aT(a, b, c) {
        var d = aI.exec(b.slice(c));
        return d ? ((a.m = aJ.get(d[0].toLowerCase())), c + d[0].length) : -1;
    }
    function aU(a, b, c) {
        var d = aG.exec(b.slice(c));
        return d ? ((a.m = aH.get(d[0].toLowerCase())), c + d[0].length) : -1;
    }
    function aV(a, b, c) {
        return aP(a, d, b, c);
    }
    function aW(a, b, c) {
        return aP(a, e, b, c);
    }
    function aX(a, b, c) {
        return aP(a, g, b, c);
    }
    function aY(a) {
        return n[a.getDay()];
    }
    function aZ(a) {
        return j[a.getDay()];
    }
    function a$(a) {
        return q[a.getMonth()];
    }
    function a_(a) {
        return p[a.getMonth()];
    }
    function a0(a) {
        return i[+(a.getHours() >= 12)];
    }
    function a1(a) {
        return 1 + ~~(a.getMonth() / 3);
    }
    function a2(a) {
        return n[a.getUTCDay()];
    }
    function a3(a) {
        return j[a.getUTCDay()];
    }
    function a4(a) {
        return q[a.getUTCMonth()];
    }
    function a5(a) {
        return p[a.getUTCMonth()];
    }
    function a6(a) {
        return i[+(a.getUTCHours() >= 12)];
    }
    function a7(a) {
        return 1 + ~~(a.getUTCMonth() / 3);
    }
    return {
        format: function(a) {
            var b = aN((a += ""), aK);
            b.toString = function() {
                return a;
            };
            return b;
        },
        parse: function(a) {
            var b = aO((a += ""), false);
            b.toString = function() {
                return a;
            };
            return b;
        },
        utcFormat: function(a) {
            var b = aN((a += ""), aL);
            b.toString = function() {
                return a;
            };
            return b;
        },
        utcParse: function(a) {
            var b = aO((a += ""), true);
            b.toString = function() {
                return a;
            };
            return b;
        }
    };
};
var o = {
    "-": "",
    _: " ",
    0: "0"
}, p = /^\s*\d+/, q = /^%/, r = /[\\^$*+?|[\]().{}]/g;
function s(a, b, c) {
    var d = a < 0 ? "-" : "", e = (d ? -a : a) + "", f = e.length;
    return (d + (f < c ? new Array(c - f + 1).join(b) + e : e));
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
function w(a, b, c) {
    var d = p.exec(b.slice(c, c + 1));
    return d ? ((a.w = +d[0]), c + d[0].length) : -1;
}
function x(a, b, c) {
    var d = p.exec(b.slice(c, c + 1));
    return d ? ((a.u = +d[0]), c + d[0].length) : -1;
}
function y(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? ((a.U = +d[0]), c + d[0].length) : -1;
}
function z(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? ((a.V = +d[0]), c + d[0].length) : -1;
}
function A(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? ((a.W = +d[0]), c + d[0].length) : -1;
}
function B(a, b, c) {
    var d = p.exec(b.slice(c, c + 4));
    return d ? ((a.y = +d[0]), c + d[0].length) : -1;
}
function C(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? ((a.y = +d[0] + (+d[0] > 68 ? 1900 : 2000)), c + d[0].length) : -1;
}
function D(a, b, c) {
    var d = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(b.slice(c, c + 6));
    return d ? ((a.Z = d[1] ? 0 : -(d[2] + (d[3] || "00"))), c + d[0].length) : -1;
}
function E(a, b, c) {
    var d = p.exec(b.slice(c, c + 1));
    return d ? ((a.q = d[0] * 3 - 3), c + d[0].length) : -1;
}
function F(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? ((a.m = d[0] - 1), c + d[0].length) : -1;
}
function G(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? ((a.d = +d[0]), c + d[0].length) : -1;
}
function H(a, b, c) {
    var d = p.exec(b.slice(c, c + 3));
    return d ? ((a.m = 0), (a.d = +d[0]), c + d[0].length) : -1;
}
function I(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? ((a.H = +d[0]), c + d[0].length) : -1;
}
function J(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? ((a.M = +d[0]), c + d[0].length) : -1;
}
function K(a, b, c) {
    var d = p.exec(b.slice(c, c + 2));
    return d ? ((a.S = +d[0]), c + d[0].length) : -1;
}
function L(a, b, c) {
    var d = p.exec(b.slice(c, c + 3));
    return d ? ((a.L = +d[0]), c + d[0].length) : -1;
}
function M(a, b, c) {
    var d = p.exec(b.slice(c, c + 6));
    return d ? ((a.L = Math.floor(d[0] / 1000)), c + d[0].length) : -1;
}
function N(a, b, c) {
    var d = q.exec(b.slice(c, c + 1));
    return d ? c + d[0].length : -1;
}
function O(a, b, c) {
    var d = p.exec(b.slice(c));
    return d ? ((a.Q = +d[0]), c + d[0].length) : -1;
}
function P(a, b, c) {
    var d = p.exec(b.slice(c));
    return d ? ((a.s = +d[0]), c + d[0].length) : -1;
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
function Z(a) {
    var b = a.getDay();
    return b === 0 ? 7 : b;
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
function ag(a, b) {
    var c = a.getDay();
    a = c >= 4 || c === 0 ? d(a) : d.ceil(a);
    return s(a.getFullYear() % 10000, b, 4);
}
function ah(a) {
    var b = a.getTimezoneOffset();
    return ((b > 0 ? "-" : ((b *= -1), "+")) + s((b / 60) | 0, "0", 2) + s(b % 60, "0", 2));
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
function ar(a) {
    var b = a.getUTCDay();
    return b === 0 ? 7 : b;
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
function aA(a, b) {
    var c = a.getUTCDay();
    a = c >= 4 || c === 0 ? i(a) : i.ceil(a);
    return s(a.getUTCFullYear() % 10000, b, 4);
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
