import * as a from "@swc/helpers";
import { timeDay as b, timeSunday as c, timeMonday as d, timeThursday as e, timeYear as f, utcDay as g, utcSunday as h, utcMonday as i, utcThursday as j, utcYear as k } from "d3-time";
function l(m) {
    if (0 <= m.y && m.y < 100) {
        var n = new Date(-1, m.m, m.d, m.H, m.M, m.S, m.L);
        return n.setFullYear(m.y), n;
    }
    return new Date(m.y, m.m, m.d, m.H, m.M, m.S, m.L);
}
function o(p) {
    if (0 <= p.y && p.y < 100) {
        var q = new Date(Date.UTC(-1, p.m, p.d, p.H, p.M, p.S, p.L));
        return q.setUTCFullYear(p.y), q;
    }
    return new Date(Date.UTC(p.y, p.m, p.d, p.H, p.M, p.S, p.L));
}
function r(s, t, u) {
    return {
        y: s,
        m: t,
        d: u,
        H: 0,
        M: 0,
        S: 0,
        L: 0
    };
}
export default function formatLocale(v) {
    var w = function(x, y) {
        return function(z) {
            var A, B, C, D = [], E = -1, F = 0, G = x.length;
            for(a._instanceof(z, Date) || (z = new Date(+z)); ++E < G;)37 === x.charCodeAt(E) && (D.push(x.slice(F, E)), null != (B = H[A = x.charAt(++E)]) ? A = x.charAt(++E) : B = "e" === A ? " " : "0", (C = y[A]) && (A = C(z, B)), D.push(A), F = E + 1);
            return D.push(x.slice(F, E)), D.join("");
        };
    }, I = function(J, K) {
        return function(L) {
            var M, N, O = r(1900, void 0, 1);
            if (P(O, J, L += "", 0) != L.length) return null;
            if ("Q" in O) return new Date(O.Q);
            if ("s" in O) return new Date(1000 * O.s + ("L" in O ? O.L : 0));
            if (!K || "Z" in O || (O.Z = 0), "p" in O && (O.H = O.H % 12 + 12 * O.p), void 0 === O.m && (O.m = "q" in O ? O.q : 0), "V" in O) {
                if (O.V < 1 || O.V > 53) return null;
                "w" in O || (O.w = 1), "Z" in O ? (M = (N = (M = o(r(O.y, 0, 1))).getUTCDay()) > 4 || 0 === N ? i.ceil(M) : i(M), M = g.offset(M, (O.V - 1) * 7), O.y = M.getUTCFullYear(), O.m = M.getUTCMonth(), O.d = M.getUTCDate() + (O.w + 6) % 7) : (M = (N = (M = l(r(O.y, 0, 1))).getDay()) > 4 || 0 === N ? d.ceil(M) : d(M), M = b.offset(M, (O.V - 1) * 7), O.y = M.getFullYear(), O.m = M.getMonth(), O.d = M.getDate() + (O.w + 6) % 7);
            } else ("W" in O || "U" in O) && ("w" in O || (O.w = "u" in O ? O.u % 7 : "W" in O ? 1 : 0), N = "Z" in O ? o(r(O.y, 0, 1)).getUTCDay() : l(r(O.y, 0, 1)).getDay(), O.m = 0, O.d = "W" in O ? (O.w + 6) % 7 + 7 * O.W - (N + 5) % 7 : O.w + 7 * O.U - (N + 6) % 7);
            return "Z" in O ? (O.H += O.Z / 100 | 0, O.M += O.Z % 100, o(O)) : l(O);
        };
    }, P = function(Q, R, S, T) {
        for(var U, V, W = 0, X = R.length, Y = S.length; W < X;){
            if (T >= Y) return -1;
            if (37 === (U = R.charCodeAt(W++))) {
                if (!(V = Z[(U = R.charAt(W++)) in H ? R.charAt(W++) : U]) || (T = V(Q, S, T)) < 0) return -1;
            } else if (U != S.charCodeAt(T++)) return -1;
        }
        return T;
    }, $ = v.dateTime, _ = v.date, aa = v.time, ba = v.periods, ca = v.days, da = v.shortDays, ea = v.months, fa = v.shortMonths, ga = ha(ba), ia = ja(ba), ka = ha(ca), la = ja(ca), ma = ha(da), na = ja(da), oa = ha(ea), pa = ja(ea), qa = ha(fa), ra = ja(fa), sa = {
        a: function(ta) {
            return da[ta.getDay()];
        },
        A: function(ua) {
            return ca[ua.getDay()];
        },
        b: function(va) {
            return fa[va.getMonth()];
        },
        B: function(wa) {
            return ea[wa.getMonth()];
        },
        c: null,
        d: xa,
        e: xa,
        f: ya,
        g: za,
        G: Aa,
        H: Ba,
        I: Ca,
        j: Da,
        L: Ea,
        m: Fa,
        M: Ga,
        p: function(Ha) {
            return ba[+(Ha.getHours() >= 12)];
        },
        q: function(Ia) {
            return 1 + ~~(Ia.getMonth() / 3);
        },
        Q: Ja,
        s: Ka,
        S: La,
        u: Ma,
        U: Na,
        V: Oa,
        w: Pa,
        W: Qa,
        x: null,
        X: null,
        y: Ra,
        Y: Sa,
        Z: Ta,
        "%": Ua
    }, Va = {
        a: function(Wa) {
            return da[Wa.getUTCDay()];
        },
        A: function(Xa) {
            return ca[Xa.getUTCDay()];
        },
        b: function(Ya) {
            return fa[Ya.getUTCMonth()];
        },
        B: function(Za) {
            return ea[Za.getUTCMonth()];
        },
        c: null,
        d: $a,
        e: $a,
        f: _a,
        g: ab,
        G: bb,
        H: cb,
        I: db,
        j: eb,
        L: fb,
        m: gb,
        M: hb,
        p: function(ib) {
            return ba[+(ib.getUTCHours() >= 12)];
        },
        q: function(jb) {
            return 1 + ~~(jb.getUTCMonth() / 3);
        },
        Q: Ja,
        s: Ka,
        S: kb,
        u: lb,
        U: mb,
        V: nb,
        w: ob,
        W: pb,
        x: null,
        X: null,
        y: qb,
        Y: rb,
        Z: sb,
        "%": Ua
    }, Z = {
        a: function(tb, ub, vb) {
            var wb = ma.exec(ub.slice(vb));
            return wb ? (tb.w = na.get(wb[0].toLowerCase()), vb + wb[0].length) : -1;
        },
        A: function(xb, yb, zb) {
            var Ab = ka.exec(yb.slice(zb));
            return Ab ? (xb.w = la.get(Ab[0].toLowerCase()), zb + Ab[0].length) : -1;
        },
        b: function(Bb, Cb, Db) {
            var Eb = qa.exec(Cb.slice(Db));
            return Eb ? (Bb.m = ra.get(Eb[0].toLowerCase()), Db + Eb[0].length) : -1;
        },
        B: function(Fb, Gb, Hb) {
            var Ib = oa.exec(Gb.slice(Hb));
            return Ib ? (Fb.m = pa.get(Ib[0].toLowerCase()), Hb + Ib[0].length) : -1;
        },
        c: function(Jb, Kb, Lb) {
            return P(Jb, $, Kb, Lb);
        },
        d: Mb,
        e: Mb,
        f: Nb,
        g: Ob,
        G: Pb,
        H: Qb,
        I: Qb,
        j: Rb,
        L: Sb,
        m: Tb,
        M: Ub,
        p: function(Vb, Wb, Xb) {
            var Yb = ga.exec(Wb.slice(Xb));
            return Yb ? (Vb.p = ia.get(Yb[0].toLowerCase()), Xb + Yb[0].length) : -1;
        },
        q: Zb,
        Q: $b,
        s: _b,
        S: ac,
        u: bc,
        U: cc,
        V: dc,
        w: ec,
        W: fc,
        x: function(gc, hc, ic) {
            return P(gc, _, hc, ic);
        },
        X: function(jc, kc, lc) {
            return P(jc, aa, kc, lc);
        },
        y: Ob,
        Y: Pb,
        Z: mc,
        "%": nc
    };
    return sa.x = w(_, sa), sa.X = w(aa, sa), sa.c = w($, sa), Va.x = w(_, Va), Va.X = w(aa, Va), Va.c = w($, Va), {
        format: function(oc) {
            var pc = w(oc += "", sa);
            return pc.toString = function() {
                return oc;
            }, pc;
        },
        parse: function(qc) {
            var rc = I(qc += "", !1);
            return rc.toString = function() {
                return qc;
            }, rc;
        },
        utcFormat: function(sc) {
            var tc = w(sc += "", Va);
            return tc.toString = function() {
                return sc;
            }, tc;
        },
        utcParse: function(uc) {
            var vc = I(uc += "", !0);
            return vc.toString = function() {
                return uc;
            }, vc;
        }
    };
};
var H = {
    "-": "",
    "_": " ",
    "0": "0"
}, wc = /^\s*\d+/, xc = /^%/, yc = /[\\^$*+?|[\]().{}]/g;
function zc(Ac, Bc, Cc) {
    var Dc = Ac < 0 ? "-" : "", Ec = (Dc ? -Ac : Ac) + "", Fc = Ec.length;
    return Dc + (Fc < Cc ? new Array(Cc - Fc + 1).join(Bc) + Ec : Ec);
}
function Gc(Hc) {
    return Hc.replace(yc, "\\$&");
}
function ha(Ic) {
    return new RegExp("^(?:" + Ic.map(Gc).join("|") + ")", "i");
}
function ja(Jc) {
    return new Map(Jc.map(function(Kc, Lc) {
        return [
            Kc.toLowerCase(),
            Lc
        ];
    }));
}
function ec(Mc, Nc, Oc) {
    var Pc = wc.exec(Nc.slice(Oc, Oc + 1));
    return Pc ? (Mc.w = +Pc[0], Oc + Pc[0].length) : -1;
}
function bc(Qc, Rc, Sc) {
    var Tc = wc.exec(Rc.slice(Sc, Sc + 1));
    return Tc ? (Qc.u = +Tc[0], Sc + Tc[0].length) : -1;
}
function cc(Uc, Vc, Wc) {
    var Xc = wc.exec(Vc.slice(Wc, Wc + 2));
    return Xc ? (Uc.U = +Xc[0], Wc + Xc[0].length) : -1;
}
function dc(Yc, Zc, $c) {
    var _c = wc.exec(Zc.slice($c, $c + 2));
    return _c ? (Yc.V = +_c[0], $c + _c[0].length) : -1;
}
function fc(ad, bd, cd) {
    var dd = wc.exec(bd.slice(cd, cd + 2));
    return dd ? (ad.W = +dd[0], cd + dd[0].length) : -1;
}
function Pb(ed, fd, gd) {
    var hd = wc.exec(fd.slice(gd, gd + 4));
    return hd ? (ed.y = +hd[0], gd + hd[0].length) : -1;
}
function Ob(id, jd, kd) {
    var ld = wc.exec(jd.slice(kd, kd + 2));
    return ld ? (id.y = +ld[0] + (+ld[0] > 68 ? 1900 : 2000), kd + ld[0].length) : -1;
}
function mc(md, nd, od) {
    var pd = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(nd.slice(od, od + 6));
    return pd ? (md.Z = pd[1] ? 0 : -(pd[2] + (pd[3] || "00")), od + pd[0].length) : -1;
}
function Zb(qd, rd, sd) {
    var td = wc.exec(rd.slice(sd, sd + 1));
    return td ? (qd.q = 3 * td[0] - 3, sd + td[0].length) : -1;
}
function Tb(ud, vd, wd) {
    var xd = wc.exec(vd.slice(wd, wd + 2));
    return xd ? (ud.m = xd[0] - 1, wd + xd[0].length) : -1;
}
function Mb(yd, zd, Ad) {
    var Bd = wc.exec(zd.slice(Ad, Ad + 2));
    return Bd ? (yd.d = +Bd[0], Ad + Bd[0].length) : -1;
}
function Rb(Cd, Dd, Ed) {
    var Fd = wc.exec(Dd.slice(Ed, Ed + 3));
    return Fd ? (Cd.m = 0, Cd.d = +Fd[0], Ed + Fd[0].length) : -1;
}
function Qb(Gd, Hd, Id) {
    var Jd = wc.exec(Hd.slice(Id, Id + 2));
    return Jd ? (Gd.H = +Jd[0], Id + Jd[0].length) : -1;
}
function Ub(Kd, Ld, Md) {
    var Nd = wc.exec(Ld.slice(Md, Md + 2));
    return Nd ? (Kd.M = +Nd[0], Md + Nd[0].length) : -1;
}
function ac(Od, Pd, Qd) {
    var Rd = wc.exec(Pd.slice(Qd, Qd + 2));
    return Rd ? (Od.S = +Rd[0], Qd + Rd[0].length) : -1;
}
function Sb(Sd, Td, Ud) {
    var Vd = wc.exec(Td.slice(Ud, Ud + 3));
    return Vd ? (Sd.L = +Vd[0], Ud + Vd[0].length) : -1;
}
function Nb(Wd, Xd, Yd) {
    var Zd = wc.exec(Xd.slice(Yd, Yd + 6));
    return Zd ? (Wd.L = Math.floor(Zd[0] / 1000), Yd + Zd[0].length) : -1;
}
function nc($d, _d, ae) {
    var be = xc.exec(_d.slice(ae, ae + 1));
    return be ? ae + be[0].length : -1;
}
function $b(ce, de, ee) {
    var fe = wc.exec(de.slice(ee));
    return fe ? (ce.Q = +fe[0], ee + fe[0].length) : -1;
}
function _b(ge, he, ie) {
    var je = wc.exec(he.slice(ie));
    return je ? (ge.s = +je[0], ie + je[0].length) : -1;
}
function xa(ke, le) {
    return zc(ke.getDate(), le, 2);
}
function Ba(me, ne) {
    return zc(me.getHours(), ne, 2);
}
function Ca(oe, pe) {
    return zc(oe.getHours() % 12 || 12, pe, 2);
}
function Da(qe, re) {
    return zc(1 + b.count(f(qe), qe), re, 3);
}
function Ea(se, te) {
    return zc(se.getMilliseconds(), te, 3);
}
function ya(ue, ve) {
    return Ea(ue, ve) + "000";
}
function Fa(we, xe) {
    return zc(we.getMonth() + 1, xe, 2);
}
function Ga(ye, ze) {
    return zc(ye.getMinutes(), ze, 2);
}
function La(Ae, Be) {
    return zc(Ae.getSeconds(), Be, 2);
}
function Ma(Ce) {
    var De = Ce.getDay();
    return 0 === De ? 7 : De;
}
function Na(Ee, Fe) {
    return zc(c.count(f(Ee) - 1, Ee), Fe, 2);
}
function Ge(He) {
    var Ie = He.getDay();
    return Ie >= 4 || 0 === Ie ? e(He) : e.ceil(He);
}
function Oa(Je, Ke) {
    return Je = Ge(Je), zc(e.count(f(Je), Je) + (4 === f(Je).getDay()), Ke, 2);
}
function Pa(Le) {
    return Le.getDay();
}
function Qa(Me, Ne) {
    return zc(d.count(f(Me) - 1, Me), Ne, 2);
}
function Ra(Oe, Pe) {
    return zc(Oe.getFullYear() % 100, Pe, 2);
}
function za(Qe, Re) {
    return zc((Qe = Ge(Qe)).getFullYear() % 100, Re, 2);
}
function Sa(Se, Te) {
    return zc(Se.getFullYear() % 10000, Te, 4);
}
function Aa(Ue, Ve) {
    var We = Ue.getDay();
    return zc((Ue = We >= 4 || 0 === We ? e(Ue) : e.ceil(Ue)).getFullYear() % 10000, Ve, 4);
}
function Ta(Xe) {
    var Ye = Xe.getTimezoneOffset();
    return (Ye > 0 ? "-" : (Ye *= -1, "+")) + zc(Ye / 60 | 0, "0", 2) + zc(Ye % 60, "0", 2);
}
function $a(Ze, $e) {
    return zc(Ze.getUTCDate(), $e, 2);
}
function cb(_e, af) {
    return zc(_e.getUTCHours(), af, 2);
}
function db(bf, cf) {
    return zc(bf.getUTCHours() % 12 || 12, cf, 2);
}
function eb(df, ef) {
    return zc(1 + g.count(k(df), df), ef, 3);
}
function fb(ff, gf) {
    return zc(ff.getUTCMilliseconds(), gf, 3);
}
function _a(hf, jf) {
    return fb(hf, jf) + "000";
}
function gb(kf, lf) {
    return zc(kf.getUTCMonth() + 1, lf, 2);
}
function hb(mf, nf) {
    return zc(mf.getUTCMinutes(), nf, 2);
}
function kb(of, pf) {
    return zc(of.getUTCSeconds(), pf, 2);
}
function lb(qf) {
    var rf = qf.getUTCDay();
    return 0 === rf ? 7 : rf;
}
function mb(sf, tf) {
    return zc(h.count(k(sf) - 1, sf), tf, 2);
}
function uf(vf) {
    var wf = vf.getUTCDay();
    return wf >= 4 || 0 === wf ? j(vf) : j.ceil(vf);
}
function nb(xf, yf) {
    return xf = uf(xf), zc(j.count(k(xf), xf) + (4 === k(xf).getUTCDay()), yf, 2);
}
function ob(zf) {
    return zf.getUTCDay();
}
function pb(Af, Bf) {
    return zc(i.count(k(Af) - 1, Af), Bf, 2);
}
function qb(Cf, Df) {
    return zc(Cf.getUTCFullYear() % 100, Df, 2);
}
function ab(Ef, Ff) {
    return zc((Ef = uf(Ef)).getUTCFullYear() % 100, Ff, 2);
}
function rb(Gf, Hf) {
    return zc(Gf.getUTCFullYear() % 10000, Hf, 4);
}
function bb(If, Jf) {
    var Kf = If.getUTCDay();
    return zc((If = Kf >= 4 || 0 === Kf ? j(If) : j.ceil(If)).getUTCFullYear() % 10000, Jf, 4);
}
function sb() {
    return "+0000";
}
function Ua() {
    return "%";
}
function Ja(Lf) {
    return +Lf;
}
function Ka(Mf) {
    return Math.floor(+Mf / 1000);
}
