import { timeDay as n, timeSunday as e, timeMonday as t, timeThursday as r, timeYear as u, utcDay as i, utcSunday as c, utcMonday as o, utcThursday as f, utcYear as a } from "d3-time";
function l(n) {
    if (0 <= n.y && n.y < 100) {
        var e = new Date(-1, n.m, n.d, n.H, n.M, n.S, n.L);
        e.setFullYear(n.y);
        return e;
    }
    return new Date(n.y, n.m, n.d, n.H, n.M, n.S, n.L);
}
function g(n) {
    if (0 <= n.y && n.y < 100) {
        var e = new Date(Date.UTC(-1, n.m, n.d, n.H, n.M, n.S, n.L));
        e.setUTCFullYear(n.y);
        return e;
    }
    return new Date(Date.UTC(n.y, n.m, n.d, n.H, n.M, n.S, n.L));
}
function s(n, e, t) {
    return {
        y: n,
        m: e,
        d: t,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
export default function h(e) {
    var r = e.dateTime, u = e.date, c = e.time, f = e.periods, a = e.days, h = e.shortDays, y = e.months, C = e.shortMonths;
    var U = w(f), d = x(f), D = w(a), N = x(a), nD = w(h), nZ = x(h), nA = w(y), nV = x(y), nW = w(C), nj = x(C);
    var nq = {
        a: nk,
        A: nJ,
        b: nK,
        B: nN,
        c: null,
        d: I,
        e: I,
        f: P,
        g: nu,
        G: nc,
        H: $,
        I: z,
        j: E,
        L: O,
        m: R,
        M: _,
        p: n0,
        q: n1,
        Q: nY,
        s: nF,
        S: k,
        u: J,
        U: K,
        V: nn,
        w: ne,
        W: nt,
        x: null,
        X: null,
        y: nr,
        Y: ni,
        Z: no,
        "%": nS
    };
    var nQ = {
        a: n2,
        A: n3,
        b: n4,
        B: n7,
        c: null,
        d: nf,
        e: nf,
        f: nh,
        g: nM,
        G: nH,
        H: na,
        I: nl,
        j: ng,
        L: ns,
        m: nv,
        M: ny,
        p: n6,
        q: n5,
        Q: nY,
        s: nF,
        S: nC,
        u: nU,
        U: nd,
        V: nw,
        w: nx,
        W: nT,
        x: null,
        X: null,
        y: nm,
        Y: np,
        Z: nL,
        "%": nS
    };
    var nX = {
        a: n$,
        A: nz,
        b: nE,
        B: nO,
        c: nP,
        d: A,
        e: A,
        f: X,
        g: S,
        G: L,
        H: W,
        I: W,
        j: V,
        L: Q,
        m: Z,
        M: j,
        p: nI,
        q: F,
        Q: B,
        s: G,
        S: q,
        u: m,
        U: M,
        V: p,
        w: T,
        W: H,
        x: nR,
        X: n_,
        y: S,
        Y: L,
        Z: Y,
        "%": b
    };
    nq.x = nb(u, nq);
    nq.X = nb(c, nq);
    nq.c = nb(r, nq);
    nQ.x = nb(u, nQ);
    nQ.X = nb(c, nQ);
    nQ.c = nb(r, nQ);
    function nb(n, e) {
        return function(t) {
            var r = [], u = -1, i = 0, c = n.length, o, f, a;
            if (!(t instanceof Date)) t = new Date(+t);
            while(++u < c){
                if (n.charCodeAt(u) === 37) {
                    r.push(n.slice(i, u));
                    if ((f = v[(o = n.charAt(++u))]) != null) o = n.charAt(++u);
                    else f = o === "e" ? " " : "0";
                    if ((a = e[o])) o = a(t, f);
                    r.push(o);
                    i = u + 1;
                }
            }
            r.push(n.slice(i, u));
            return r.join("");
        };
    }
    function nB(e, r) {
        return function(u) {
            var c = s(1900, undefined, 1), f = nG(c, e, (u += ""), 0), a, h;
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
                    (a = g(s(c.y, 0, 1))), (h = a.getUTCDay());
                    a = h > 4 || h === 0 ? o.ceil(a) : o(a);
                    a = i.offset(a, (c.V - 1) * 7);
                    c.y = a.getUTCFullYear();
                    c.m = a.getUTCMonth();
                    c.d = a.getUTCDate() + ((c.w + 6) % 7);
                } else {
                    (a = l(s(c.y, 0, 1))), (h = a.getDay());
                    a = h > 4 || h === 0 ? t.ceil(a) : t(a);
                    a = n.offset(a, (c.V - 1) * 7);
                    c.y = a.getFullYear();
                    c.m = a.getMonth();
                    c.d = a.getDate() + ((c.w + 6) % 7);
                }
            } else if ("W" in c || "U" in c) {
                if (!("w" in c)) c.w = "u" in c ? c.u % 7 : "W" in c ? 1 : 0;
                h = "Z" in c ? g(s(c.y, 0, 1)).getUTCDay() : l(s(c.y, 0, 1)).getDay();
                c.m = 0;
                c.d = "W" in c ? ((c.w + 6) % 7) + c.W * 7 - ((h + 5) % 7) : c.w + c.U * 7 - ((h + 6) % 7);
            }
            if ("Z" in c) {
                c.H += (c.Z / 100) | 0;
                c.M += c.Z % 100;
                return g(c);
            }
            return l(c);
        };
    }
    function nG(n, e, t, r) {
        var u = 0, i = e.length, c = t.length, o, f;
        while(u < i){
            if (r >= c) return -1;
            o = e.charCodeAt(u++);
            if (o === 37) {
                o = e.charAt(u++);
                f = nX[o in v ? e.charAt(u++) : o];
                if (!f || (r = f(n, t, r)) < 0) return -1;
            } else if (o != t.charCodeAt(r++)) {
                return -1;
            }
        }
        return r;
    }
    function nI(n, e, t) {
        var r = U.exec(e.slice(t));
        return r ? ((n.p = d.get(r[0].toLowerCase())), t + r[0].length) : -1;
    }
    function n$(n, e, t) {
        var r = nD.exec(e.slice(t));
        return r ? ((n.w = nZ.get(r[0].toLowerCase())), t + r[0].length) : -1;
    }
    function nz(n, e, t) {
        var r = D.exec(e.slice(t));
        return r ? ((n.w = N.get(r[0].toLowerCase())), t + r[0].length) : -1;
    }
    function nE(n, e, t) {
        var r = nW.exec(e.slice(t));
        return r ? ((n.m = nj.get(r[0].toLowerCase())), t + r[0].length) : -1;
    }
    function nO(n, e, t) {
        var r = nA.exec(e.slice(t));
        return r ? ((n.m = nV.get(r[0].toLowerCase())), t + r[0].length) : -1;
    }
    function nP(n, e, t) {
        return nG(n, r, e, t);
    }
    function nR(n, e, t) {
        return nG(n, u, e, t);
    }
    function n_(n, e, t) {
        return nG(n, c, e, t);
    }
    function nk(n) {
        return h[n.getDay()];
    }
    function nJ(n) {
        return a[n.getDay()];
    }
    function nK(n) {
        return C[n.getMonth()];
    }
    function nN(n) {
        return y[n.getMonth()];
    }
    function n0(n) {
        return f[+(n.getHours() >= 12)];
    }
    function n1(n) {
        return 1 + ~~(n.getMonth() / 3);
    }
    function n2(n) {
        return h[n.getUTCDay()];
    }
    function n3(n) {
        return a[n.getUTCDay()];
    }
    function n4(n) {
        return C[n.getUTCMonth()];
    }
    function n7(n) {
        return y[n.getUTCMonth()];
    }
    function n6(n) {
        return f[+(n.getUTCHours() >= 12)];
    }
    function n5(n) {
        return 1 + ~~(n.getUTCMonth() / 3);
    }
    return {
        format: function(n) {
            var e = nb((n += ""), nq);
            e.toString = function() {
                return n;
            };
            return e;
        },
        parse: function(n) {
            var e = nB((n += ""), false);
            e.toString = function() {
                return n;
            };
            return e;
        },
        utcFormat: function(n) {
            var e = nb((n += ""), nQ);
            e.toString = function() {
                return n;
            };
            return e;
        },
        utcParse: function(n) {
            var e = nB((n += ""), true);
            e.toString = function() {
                return n;
            };
            return e;
        }
    };
};
var v = {
    "-": "",
    _: " ",
    0: "0"
}, y = /^\s*\d+/, C = /^%/, U = /[\\^$*+?|[\]().{}]/g;
function d(n, e, t) {
    var r = n < 0 ? "-" : "", u = (r ? -n : n) + "", i = u.length;
    return (r + (i < t ? new Array(t - i + 1).join(e) + u : u));
}
function D(n) {
    return n.replace(U, "\\$&");
}
function w(n) {
    return new RegExp("^(?:" + n.map(D).join("|") + ")", "i");
}
function x(n) {
    return new Map(n.map((n, e)=>[
            n.toLowerCase(),
            e
        ]));
}
function T(n, e, t) {
    var r = y.exec(e.slice(t, t + 1));
    return r ? ((n.w = +r[0]), t + r[0].length) : -1;
}
function m(n, e, t) {
    var r = y.exec(e.slice(t, t + 1));
    return r ? ((n.u = +r[0]), t + r[0].length) : -1;
}
function M(n, e, t) {
    var r = y.exec(e.slice(t, t + 2));
    return r ? ((n.U = +r[0]), t + r[0].length) : -1;
}
function p(n, e, t) {
    var r = y.exec(e.slice(t, t + 2));
    return r ? ((n.V = +r[0]), t + r[0].length) : -1;
}
function H(n, e, t) {
    var r = y.exec(e.slice(t, t + 2));
    return r ? ((n.W = +r[0]), t + r[0].length) : -1;
}
function L(n, e, t) {
    var r = y.exec(e.slice(t, t + 4));
    return r ? ((n.y = +r[0]), t + r[0].length) : -1;
}
function S(n, e, t) {
    var r = y.exec(e.slice(t, t + 2));
    return r ? ((n.y = +r[0] + (+r[0] > 68 ? 1900 : 2000)), t + r[0].length) : -1;
}
function Y(n, e, t) {
    var r = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(e.slice(t, t + 6));
    return r ? ((n.Z = r[1] ? 0 : -(r[2] + (r[3] || "00"))), t + r[0].length) : -1;
}
function F(n, e, t) {
    var r = y.exec(e.slice(t, t + 1));
    return r ? ((n.q = r[0] * 3 - 3), t + r[0].length) : -1;
}
function Z(n, e, t) {
    var r = y.exec(e.slice(t, t + 2));
    return r ? ((n.m = r[0] - 1), t + r[0].length) : -1;
}
function A(n, e, t) {
    var r = y.exec(e.slice(t, t + 2));
    return r ? ((n.d = +r[0]), t + r[0].length) : -1;
}
function V(n, e, t) {
    var r = y.exec(e.slice(t, t + 3));
    return r ? ((n.m = 0), (n.d = +r[0]), t + r[0].length) : -1;
}
function W(n, e, t) {
    var r = y.exec(e.slice(t, t + 2));
    return r ? ((n.H = +r[0]), t + r[0].length) : -1;
}
function j(n, e, t) {
    var r = y.exec(e.slice(t, t + 2));
    return r ? ((n.M = +r[0]), t + r[0].length) : -1;
}
function q(n, e, t) {
    var r = y.exec(e.slice(t, t + 2));
    return r ? ((n.S = +r[0]), t + r[0].length) : -1;
}
function Q(n, e, t) {
    var r = y.exec(e.slice(t, t + 3));
    return r ? ((n.L = +r[0]), t + r[0].length) : -1;
}
function X(n, e, t) {
    var r = y.exec(e.slice(t, t + 6));
    return r ? ((n.L = Math.floor(r[0] / 1000)), t + r[0].length) : -1;
}
function b(n, e, t) {
    var r = C.exec(e.slice(t, t + 1));
    return r ? t + r[0].length : -1;
}
function B(n, e, t) {
    var r = y.exec(e.slice(t));
    return r ? ((n.Q = +r[0]), t + r[0].length) : -1;
}
function G(n, e, t) {
    var r = y.exec(e.slice(t));
    return r ? ((n.s = +r[0]), t + r[0].length) : -1;
}
function I(n, e) {
    return d(n.getDate(), e, 2);
}
function $(n, e) {
    return d(n.getHours(), e, 2);
}
function z(n, e) {
    return d(n.getHours() % 12 || 12, e, 2);
}
function E(e, t) {
    return d(1 + n.count(u(e), e), t, 3);
}
function O(n, e) {
    return d(n.getMilliseconds(), e, 3);
}
function P(n, e) {
    return O(n, e) + "000";
}
function R(n, e) {
    return d(n.getMonth() + 1, e, 2);
}
function _(n, e) {
    return d(n.getMinutes(), e, 2);
}
function k(n, e) {
    return d(n.getSeconds(), e, 2);
}
function J(n) {
    var e = n.getDay();
    return e === 0 ? 7 : e;
}
function K(n, t) {
    return d(e.count(u(n) - 1, n), t, 2);
}
function N(n) {
    var e = n.getDay();
    return e >= 4 || e === 0 ? r(n) : r.ceil(n);
}
function nn(n, e) {
    n = N(n);
    return d(r.count(u(n), n) + (u(n).getDay() === 4), e, 2);
}
function ne(n) {
    return n.getDay();
}
function nt(n, e) {
    return d(t.count(u(n) - 1, n), e, 2);
}
function nr(n, e) {
    return d(n.getFullYear() % 100, e, 2);
}
function nu(n, e) {
    n = N(n);
    return d(n.getFullYear() % 100, e, 2);
}
function ni(n, e) {
    return d(n.getFullYear() % 10000, e, 4);
}
function nc(n, e) {
    var t = n.getDay();
    n = t >= 4 || t === 0 ? r(n) : r.ceil(n);
    return d(n.getFullYear() % 10000, e, 4);
}
function no(n) {
    var e = n.getTimezoneOffset();
    return ((e > 0 ? "-" : ((e *= -1), "+")) + d((e / 60) | 0, "0", 2) + d(e % 60, "0", 2));
}
function nf(n, e) {
    return d(n.getUTCDate(), e, 2);
}
function na(n, e) {
    return d(n.getUTCHours(), e, 2);
}
function nl(n, e) {
    return d(n.getUTCHours() % 12 || 12, e, 2);
}
function ng(n, e) {
    return d(1 + i.count(a(n), n), e, 3);
}
function ns(n, e) {
    return d(n.getUTCMilliseconds(), e, 3);
}
function nh(n, e) {
    return ns(n, e) + "000";
}
function nv(n, e) {
    return d(n.getUTCMonth() + 1, e, 2);
}
function ny(n, e) {
    return d(n.getUTCMinutes(), e, 2);
}
function nC(n, e) {
    return d(n.getUTCSeconds(), e, 2);
}
function nU(n) {
    var e = n.getUTCDay();
    return e === 0 ? 7 : e;
}
function nd(n, e) {
    return d(c.count(a(n) - 1, n), e, 2);
}
function nD(n) {
    var e = n.getUTCDay();
    return e >= 4 || e === 0 ? f(n) : f.ceil(n);
}
function nw(n, e) {
    n = nD(n);
    return d(f.count(a(n), n) + (a(n).getUTCDay() === 4), e, 2);
}
function nx(n) {
    return n.getUTCDay();
}
function nT(n, e) {
    return d(o.count(a(n) - 1, n), e, 2);
}
function nm(n, e) {
    return d(n.getUTCFullYear() % 100, e, 2);
}
function nM(n, e) {
    n = nD(n);
    return d(n.getUTCFullYear() % 100, e, 2);
}
function np(n, e) {
    return d(n.getUTCFullYear() % 10000, e, 4);
}
function nH(n, e) {
    var t = n.getUTCDay();
    n = t >= 4 || t === 0 ? f(n) : f.ceil(n);
    return d(n.getUTCFullYear() % 10000, e, 4);
}
function nL() {
    return "+0000";
}
function nS() {
    return "%";
}
function nY(n) {
    return +n;
}
function nF(n) {
    return Math.floor(+n / 1000);
}
