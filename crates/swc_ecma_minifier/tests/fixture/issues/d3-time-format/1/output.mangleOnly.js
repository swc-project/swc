import { timeDay as n, timeSunday as t, timeMonday as e, timeThursday as r, timeYear as u, utcDay as i, utcSunday as c, utcMonday as o, utcThursday as f, utcYear as $ } from "d3-time";
function l(n) {
    if (0 <= n.y && n.y < 100) {
        var t = new Date(-1, n.m, n.d, n.H, n.M, n.S, n.L);
        t.setFullYear(n.y);
        return t;
    }
    return new Date(n.y, n.m, n.d, n.H, n.M, n.S, n.L);
}
function a(n) {
    if (0 <= n.y && n.y < 100) {
        var t = new Date(Date.UTC(-1, n.m, n.d, n.H, n.M, n.S, n.L));
        t.setUTCFullYear(n.y);
        return t;
    }
    return new Date(Date.UTC(n.y, n.m, n.d, n.H, n.M, n.S, n.L));
}
function g(n, t, e) {
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
export default function _(t) {
    var r = t.dateTime, u = t.date, c = t.time, f = t.periods, $ = t.days, _ = t.shortDays, h = t.months, v = t.shortMonths;
    var y = T(f), C = x(f), U = T($), R = x($), nC = T(_), nS = x(_), nY = T(h), n1 = x(h), n5 = T(v), nF = x(v);
    var n2 = {
        a: n3,
        A: n7,
        b: nz,
        B: nO,
        c: null,
        d: B,
        e: B,
        f: P,
        g: nu,
        G: nc,
        H: G,
        I: I,
        j: z,
        L: O,
        m: k,
        M: E,
        p: nP,
        q: n6,
        Q: nL,
        s: np,
        S: J,
        u: K,
        U: N,
        V: nn,
        w: nt,
        W: ne,
        x: null,
        X: null,
        y: nr,
        Y: ni,
        Z: no,
        "%": nH
    };
    var nA = {
        a: n8,
        A: n9,
        b: nk,
        B: nE,
        c: null,
        d: nf,
        e: nf,
        f: n_,
        g: nw,
        G: nM,
        H: n$,
        I: nl,
        j: na,
        L: ng,
        m: ns,
        M: nh,
        p: nJ,
        q: nK,
        Q: nL,
        s: np,
        S: nv,
        u: n0,
        U: ny,
        V: nU,
        w: nT,
        W: nx,
        x: null,
        X: null,
        y: nd,
        Y: nm,
        Z: nD,
        "%": nH
    };
    var n4 = {
        a: nQ,
        A: nW,
        b: nX,
        B: nb,
        c: nB,
        d: F,
        e: F,
        f: Q,
        g: L,
        G: H,
        H: V,
        I: V,
        j: A,
        L: q,
        m: Y,
        M: Z,
        p: nq,
        q: S,
        Q: X,
        s: b,
        S: j,
        u: w,
        U: m,
        V: M,
        w: d,
        W: D,
        x: nG,
        X: nI,
        y: L,
        Y: H,
        Z: p,
        "%": W
    };
    n2.x = nV(u, n2);
    n2.X = nV(c, n2);
    n2.c = nV(r, n2);
    nA.x = nV(u, nA);
    nA.X = nV(c, nA);
    nA.c = nV(r, nA);
    function nV(n, t) {
        return function(e) {
            var r = [], u = -1, i = 0, c = n.length, o, f, $;
            if (!(e instanceof Date)) e = new Date(+e);
            while(++u < c){
                if (n.charCodeAt(u) === 37) {
                    r.push(n.slice(i, u));
                    if ((f = s[(o = n.charAt(++u))]) != null) o = n.charAt(++u);
                    else f = o === "e" ? " " : "0";
                    if (($ = t[o])) o = $(e, f);
                    r.push(o);
                    i = u + 1;
                }
            }
            r.push(n.slice(i, u));
            return r.join("");
        };
    }
    function nZ(t, r) {
        return function(u) {
            var c = g(1900, undefined, 1), f = nj(c, t, (u += ""), 0), $, _;
            if (f != u.length) return null;
            if ("Q" in c) return new Date(c.Q);
            if ("s" in c) return new Date(c.s * 1000 + ("L" in c ? c.L : 0));
            if (r && !("Z" in c)) c.Z = 0;
            if ("p" in c) c.H = (c.H % 12) + c.p * 12;
            if (c.m === undefined) c.m = "q" in c ? c.q : 0;
            if ("V" in c) {
                if (c.V < 1 || c.V > 53) return null;
                if (!("w" in c)) c.w = 1;
                if ("Z" in c) {
                    ($ = a(g(c.y, 0, 1))), (_ = $.getUTCDay());
                    $ = _ > 4 || _ === 0 ? o.ceil($) : o($);
                    $ = i.offset($, (c.V - 1) * 7);
                    c.y = $.getUTCFullYear();
                    c.m = $.getUTCMonth();
                    c.d = $.getUTCDate() + ((c.w + 6) % 7);
                } else {
                    ($ = l(g(c.y, 0, 1))), (_ = $.getDay());
                    $ = _ > 4 || _ === 0 ? e.ceil($) : e($);
                    $ = n.offset($, (c.V - 1) * 7);
                    c.y = $.getFullYear();
                    c.m = $.getMonth();
                    c.d = $.getDate() + ((c.w + 6) % 7);
                }
            } else if ("W" in c || "U" in c) {
                if (!("w" in c)) c.w = "u" in c ? c.u % 7 : "W" in c ? 1 : 0;
                _ = "Z" in c ? a(g(c.y, 0, 1)).getUTCDay() : l(g(c.y, 0, 1)).getDay();
                c.m = 0;
                c.d = "W" in c ? ((c.w + 6) % 7) + c.W * 7 - ((_ + 5) % 7) : c.w + c.U * 7 - ((_ + 6) % 7);
            }
            if ("Z" in c) {
                c.H += (c.Z / 100) | 0;
                c.M += c.Z % 100;
                return a(c);
            }
            return l(c);
        };
    }
    function nj(n, t, e, r) {
        var u = 0, i = t.length, c = e.length, o, f;
        while(u < i){
            if (r >= c) return -1;
            o = t.charCodeAt(u++);
            if (o === 37) {
                o = t.charAt(u++);
                f = n4[o in s ? t.charAt(u++) : o];
                if (!f || (r = f(n, e, r)) < 0) return -1;
            } else if (o != e.charCodeAt(r++)) {
                return -1;
            }
        }
        return r;
    }
    function nq(n, t, e) {
        var r = y.exec(t.slice(e));
        return r ? ((n.p = C.get(r[0].toLowerCase())), e + r[0].length) : -1;
    }
    function nQ(n, t, e) {
        var r = nC.exec(t.slice(e));
        return r ? ((n.w = nS.get(r[0].toLowerCase())), e + r[0].length) : -1;
    }
    function nW(n, t, e) {
        var r = U.exec(t.slice(e));
        return r ? ((n.w = R.get(r[0].toLowerCase())), e + r[0].length) : -1;
    }
    function nX(n, t, e) {
        var r = n5.exec(t.slice(e));
        return r ? ((n.m = nF.get(r[0].toLowerCase())), e + r[0].length) : -1;
    }
    function nb(n, t, e) {
        var r = nY.exec(t.slice(e));
        return r ? ((n.m = n1.get(r[0].toLowerCase())), e + r[0].length) : -1;
    }
    function nB(n, t, e) {
        return nj(n, r, t, e);
    }
    function nG(n, t, e) {
        return nj(n, u, t, e);
    }
    function nI(n, t, e) {
        return nj(n, c, t, e);
    }
    function n3(n) {
        return _[n.getDay()];
    }
    function n7(n) {
        return $[n.getDay()];
    }
    function nz(n) {
        return v[n.getMonth()];
    }
    function nO(n) {
        return h[n.getMonth()];
    }
    function nP(n) {
        return f[+(n.getHours() >= 12)];
    }
    function n6(n) {
        return 1 + ~~(n.getMonth() / 3);
    }
    function n8(n) {
        return _[n.getUTCDay()];
    }
    function n9(n) {
        return $[n.getUTCDay()];
    }
    function nk(n) {
        return v[n.getUTCMonth()];
    }
    function nE(n) {
        return h[n.getUTCMonth()];
    }
    function nJ(n) {
        return f[+(n.getUTCHours() >= 12)];
    }
    function nK(n) {
        return 1 + ~~(n.getUTCMonth() / 3);
    }
    return {
        format: function(n) {
            var t = nV((n += ""), n2);
            t.toString = function() {
                return n;
            };
            return t;
        },
        parse: function(n) {
            var t = nZ((n += ""), false);
            t.toString = function() {
                return n;
            };
            return t;
        },
        utcFormat: function(n) {
            var t = nV((n += ""), nA);
            t.toString = function() {
                return n;
            };
            return t;
        },
        utcParse: function(n) {
            var t = nZ((n += ""), true);
            t.toString = function() {
                return n;
            };
            return t;
        }
    };
};
var s = {
    "-": "",
    _: " ",
    0: "0"
}, h = /^\s*\d+/, v = /^%/, y = /[\\^$*+?|[\]().{}]/g;
function C(n, t, e) {
    var r = n < 0 ? "-" : "", u = (r ? -n : n) + "", i = u.length;
    return (r + (i < e ? new Array(e - i + 1).join(t) + u : u));
}
function U(n) {
    return n.replace(y, "\\$&");
}
function T(n) {
    return new RegExp("^(?:" + n.map(U).join("|") + ")", "i");
}
function x(n) {
    return new Map(n.map((n, t)=>[
            n.toLowerCase(),
            t
        ]));
}
function d(n, t, e) {
    var r = h.exec(t.slice(e, e + 1));
    return r ? ((n.w = +r[0]), e + r[0].length) : -1;
}
function w(n, t, e) {
    var r = h.exec(t.slice(e, e + 1));
    return r ? ((n.u = +r[0]), e + r[0].length) : -1;
}
function m(n, t, e) {
    var r = h.exec(t.slice(e, e + 2));
    return r ? ((n.U = +r[0]), e + r[0].length) : -1;
}
function M(n, t, e) {
    var r = h.exec(t.slice(e, e + 2));
    return r ? ((n.V = +r[0]), e + r[0].length) : -1;
}
function D(n, t, e) {
    var r = h.exec(t.slice(e, e + 2));
    return r ? ((n.W = +r[0]), e + r[0].length) : -1;
}
function H(n, t, e) {
    var r = h.exec(t.slice(e, e + 4));
    return r ? ((n.y = +r[0]), e + r[0].length) : -1;
}
function L(n, t, e) {
    var r = h.exec(t.slice(e, e + 2));
    return r ? ((n.y = +r[0] + (+r[0] > 68 ? 1900 : 2000)), e + r[0].length) : -1;
}
function p(n, t, e) {
    var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(e, e + 6));
    return r ? ((n.Z = r[1] ? 0 : -(r[2] + (r[3] || "00"))), e + r[0].length) : -1;
}
function S(n, t, e) {
    var r = h.exec(t.slice(e, e + 1));
    return r ? ((n.q = r[0] * 3 - 3), e + r[0].length) : -1;
}
function Y(n, t, e) {
    var r = h.exec(t.slice(e, e + 2));
    return r ? ((n.m = r[0] - 1), e + r[0].length) : -1;
}
function F(n, t, e) {
    var r = h.exec(t.slice(e, e + 2));
    return r ? ((n.d = +r[0]), e + r[0].length) : -1;
}
function A(n, t, e) {
    var r = h.exec(t.slice(e, e + 3));
    return r ? ((n.m = 0), (n.d = +r[0]), e + r[0].length) : -1;
}
function V(n, t, e) {
    var r = h.exec(t.slice(e, e + 2));
    return r ? ((n.H = +r[0]), e + r[0].length) : -1;
}
function Z(n, t, e) {
    var r = h.exec(t.slice(e, e + 2));
    return r ? ((n.M = +r[0]), e + r[0].length) : -1;
}
function j(n, t, e) {
    var r = h.exec(t.slice(e, e + 2));
    return r ? ((n.S = +r[0]), e + r[0].length) : -1;
}
function q(n, t, e) {
    var r = h.exec(t.slice(e, e + 3));
    return r ? ((n.L = +r[0]), e + r[0].length) : -1;
}
function Q(n, t, e) {
    var r = h.exec(t.slice(e, e + 6));
    return r ? ((n.L = Math.floor(r[0] / 1000)), e + r[0].length) : -1;
}
function W(n, t, e) {
    var r = v.exec(t.slice(e, e + 1));
    return r ? e + r[0].length : -1;
}
function X(n, t, e) {
    var r = h.exec(t.slice(e));
    return r ? ((n.Q = +r[0]), e + r[0].length) : -1;
}
function b(n, t, e) {
    var r = h.exec(t.slice(e));
    return r ? ((n.s = +r[0]), e + r[0].length) : -1;
}
function B(n, t) {
    return C(n.getDate(), t, 2);
}
function G(n, t) {
    return C(n.getHours(), t, 2);
}
function I(n, t) {
    return C(n.getHours() % 12 || 12, t, 2);
}
function z(t, e) {
    return C(1 + n.count(u(t), t), e, 3);
}
function O(n, t) {
    return C(n.getMilliseconds(), t, 3);
}
function P(n, t) {
    return O(n, t) + "000";
}
function k(n, t) {
    return C(n.getMonth() + 1, t, 2);
}
function E(n, t) {
    return C(n.getMinutes(), t, 2);
}
function J(n, t) {
    return C(n.getSeconds(), t, 2);
}
function K(n) {
    var t = n.getDay();
    return t === 0 ? 7 : t;
}
function N(n, e) {
    return C(t.count(u(n) - 1, n), e, 2);
}
function R(n) {
    var t = n.getDay();
    return t >= 4 || t === 0 ? r(n) : r.ceil(n);
}
function nn(n, t) {
    n = R(n);
    return C(r.count(u(n), n) + (u(n).getDay() === 4), t, 2);
}
function nt(n) {
    return n.getDay();
}
function ne(n, t) {
    return C(e.count(u(n) - 1, n), t, 2);
}
function nr(n, t) {
    return C(n.getFullYear() % 100, t, 2);
}
function nu(n, t) {
    n = R(n);
    return C(n.getFullYear() % 100, t, 2);
}
function ni(n, t) {
    return C(n.getFullYear() % 10000, t, 4);
}
function nc(n, t) {
    var e = n.getDay();
    n = e >= 4 || e === 0 ? r(n) : r.ceil(n);
    return C(n.getFullYear() % 10000, t, 4);
}
function no(n) {
    var t = n.getTimezoneOffset();
    return ((t > 0 ? "-" : ((t *= -1), "+")) + C((t / 60) | 0, "0", 2) + C(t % 60, "0", 2));
}
function nf(n, t) {
    return C(n.getUTCDate(), t, 2);
}
function n$(n, t) {
    return C(n.getUTCHours(), t, 2);
}
function nl(n, t) {
    return C(n.getUTCHours() % 12 || 12, t, 2);
}
function na(n, t) {
    return C(1 + i.count($(n), n), t, 3);
}
function ng(n, t) {
    return C(n.getUTCMilliseconds(), t, 3);
}
function n_(n, t) {
    return ng(n, t) + "000";
}
function ns(n, t) {
    return C(n.getUTCMonth() + 1, t, 2);
}
function nh(n, t) {
    return C(n.getUTCMinutes(), t, 2);
}
function nv(n, t) {
    return C(n.getUTCSeconds(), t, 2);
}
function n0(n) {
    var t = n.getUTCDay();
    return t === 0 ? 7 : t;
}
function ny(n, t) {
    return C(c.count($(n) - 1, n), t, 2);
}
function nC(n) {
    var t = n.getUTCDay();
    return t >= 4 || t === 0 ? f(n) : f.ceil(n);
}
function nU(n, t) {
    n = nC(n);
    return C(f.count($(n), n) + ($(n).getUTCDay() === 4), t, 2);
}
function nT(n) {
    return n.getUTCDay();
}
function nx(n, t) {
    return C(o.count($(n) - 1, n), t, 2);
}
function nd(n, t) {
    return C(n.getUTCFullYear() % 100, t, 2);
}
function nw(n, t) {
    n = nC(n);
    return C(n.getUTCFullYear() % 100, t, 2);
}
function nm(n, t) {
    return C(n.getUTCFullYear() % 10000, t, 4);
}
function nM(n, t) {
    var e = n.getUTCDay();
    n = e >= 4 || e === 0 ? f(n) : f.ceil(n);
    return C(n.getUTCFullYear() % 10000, t, 4);
}
function nD() {
    return "+0000";
}
function nH() {
    return "%";
}
function nL(n) {
    return +n;
}
function np(n) {
    return Math.floor(+n / 1000);
}
