export function foo(c, a, f) {
    "use asm";
    var d2 = new c.Int8Array(f);
    var d3 = new c.Int16Array(f);
    var d4 = new c.Int32Array(f);
    var d5 = new c.Uint8Array(f);
    var d6 = new c.Uint16Array(f);
    var d7 = new c.Uint32Array(f);
    var d8 = new c.Float32Array(f);
    var d9 = new c.Float64Array(f);
    var ea = a.DYNAMICTOP_PTR | 0;
    var eb = a.tempDoublePtr | 0;
    var ec = a.ABORT | 0;
    var ed = a.STACKTOP | 0;
    var ee = a.STACK_MAX | 0;
    var ef = a.cttz_i8 | 0;
    var eg = a.___dso_handle | 0;
    var eh = 0;
    var ei = 0;
    var ej = 0;
    var ek = 0;
    var el = c.NaN, em = c.Infinity;
    var en = 0, eo = 0, ep = 0, eq = 0, er = 0.0;
    var es = 0;
    var et = c.Math.floor;
    var eu = c.Math.abs;
    var ev = c.Math.sqrt;
    var ew = c.Math.pow;
    var ex = c.Math.cos;
    var ey = c.Math.sin;
    var ez = c.Math.tan;
    var eA = c.Math.acos;
    var eB = c.Math.asin;
    var eC = c.Math.atan;
    var eD = c.Math.atan2;
    var eE = c.Math.exp;
    var eF = c.Math.log;
    var eG = c.Math.ceil;
    var eH = c.Math.imul;
    var eI = c.Math.min;
    var eJ = c.Math.max;
    var eK = c.Math.clz32;
    var n = c.Math.fround;
    var eL = a.abort;
    var eM = a.assert;
    var eN = a.enlargeMemory;
    var eO = a.getTotalMemory;
    var eP = a.abortOnCannotGrowMemory;
    var eQ = a.invoke_viiiii;
    var eR = a.invoke_vif;
    var eS = a.invoke_vid;
    var eT = a.invoke_fiff;
    var eU = a.invoke_vi;
    var eV = a.invoke_vii;
    var eW = a.invoke_ii;
    var eX = a.invoke_viddi;
    var eY = a.invoke_vidd;
    var eZ = a.invoke_iiii;
    var e$ = a.invoke_diii;
    var e_ = a.invoke_di;
    var e0 = a.invoke_iid;
    var e1 = a.invoke_iii;
    var e2 = a.invoke_viiddi;
    var e3 = a.invoke_viiiiii;
    var e4 = a.invoke_dii;
    var e5 = a.invoke_i;
    var e6 = a.invoke_iiiiii;
    var e7 = a.invoke_viiid;
    var e8 = a.invoke_viififi;
    var e9 = a.invoke_viii;
    var fa = a.invoke_v;
    var fb = a.invoke_viid;
    var fc = a.invoke_idd;
    var fd = a.invoke_viiii;
    var fe = a._emscripten_asm_const_iiiii;
    var ff = a._emscripten_asm_const_iiidddddd;
    var fg = a._emscripten_asm_const_iiiid;
    var fh = a.__nbind_reference_external;
    var fi = a._emscripten_asm_const_iiiiiiii;
    var fj = a._removeAccessorPrefix;
    var fk = a._typeModule;
    var fl = a.__nbind_register_pool;
    var fm = a.__decorate;
    var fn = a._llvm_stackrestore;
    var fo = a.___cxa_atexit;
    var fp = a.__extends;
    var fq = a.__nbind_get_value_object;
    var fr = a.__ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj;
    var fs = a._emscripten_set_main_loop_timing;
    var ft = a.__nbind_register_primitive;
    var fu = a.__nbind_register_type;
    var fv = a._emscripten_memcpy_big;
    var fw = a.__nbind_register_function;
    var fx = a.___setErrNo;
    var fy = a.__nbind_register_class;
    var fz = a.__nbind_finish;
    var fA = a._abort;
    var fB = a._nbind_value;
    var fC = a._llvm_stacksave;
    var fD = a.___syscall54;
    var fE = a._defineHidden;
    var fF = a._emscripten_set_main_loop;
    var fG = a._emscripten_get_now;
    var fH = a.__nbind_register_callback_signature;
    var fI = a._emscripten_asm_const_iiiiii;
    var fJ = a.__nbind_free_external;
    var fK = a._emscripten_asm_const_iiii;
    var fL = a._emscripten_asm_const_iiididi;
    var fM = a.___syscall6;
    var fN = a._atexit;
    var fO = a.___syscall140;
    var fP = a.___syscall146;
    var fQ = n(0);
    const fR = n(0);
    function o(a) {
        a = a | 0;
        var b = 0;
        b = ed;
        ed = (ed + a) | 0;
        ed = (ed + 15) & -16;
        return b | 0;
    }
    function p() {
        return ed | 0;
    }
    function q(a) {
        a = a | 0;
        ed = a;
    }
    function r(a, b) {
        a = a | 0;
        b = b | 0;
        ed = a;
        ee = b;
    }
    function s(a, b) {
        a = a | 0;
        b = b | 0;
        if (!eh) {
            eh = a;
            ei = b;
        }
    }
    function t(a) {
        a = a | 0;
        es = a;
    }
    function u() {
        return es | 0;
    }
    function fS() {
        var a = 0, b = 0;
        dh(8104, 8, 400) | 0;
        dh(8504, 408, 540) | 0;
        a = 9044;
        b = (a + 44) | 0;
        do {
            d4[a >> 2] = 0;
            a = (a + 4) | 0;
        }while ((a | 0) < (b | 0))
        d2[9088] = 0;
        d2[9089] = 1;
        d4[2273] = 0;
        d4[2274] = 948;
        d4[2275] = 948;
        fo(17, 8104, eg | 0) | 0;
        return;
    }
    function v(a) {
        a = a | 0;
        gf((a + 948) | 0);
        return;
    }
    function fT(a) {
        a = n(a);
        return (((iA(a) | 0) & 2147483647) >>> 0 > 2139095040) | 0;
    }
    function fU(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        a: do if (!(d4[(a + (b << 3) + 4) >> 2] | 0)) {
            if ((b | 2 | 0) == 3 ? d4[(a + 60) >> 2] | 0 : 0) {
                a = (a + 56) | 0;
                break;
            }
            switch(b | 0){
                case 0:
                case 2:
                case 4:
                case 5:
                    {
                        if (d4[(a + 52) >> 2] | 0) {
                            a = (a + 48) | 0;
                            break a;
                        }
                        break;
                    }
                default:
                    {}
            }
            if (!(d4[(a + 68) >> 2] | 0)) {
                a = (b | 1 | 0) == 5 ? 948 : c;
                break;
            } else {
                a = (a + 64) | 0;
                break;
            }
        } else a = (a + (b << 3)) | 0;
        while (0)
        return a | 0;
    }
    function fV(b) {
        b = b | 0;
        var a = 0;
        a = c2(1e3) | 0;
        fW(b, (a | 0) != 0, 2456);
        d4[2276] = (d4[2276] | 0) + 1;
        dh(a | 0, 8104, 1e3) | 0;
        if (d2[(b + 2) >> 0] | 0) {
            d4[(a + 4) >> 2] = 2;
            d4[(a + 12) >> 2] = 4;
        }
        d4[(a + 976) >> 2] = b;
        return a | 0;
    }
    function fW(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        e = ed;
        ed = (ed + 16) | 0;
        d = e;
        if (!b) {
            d4[d >> 2] = c;
            hN(a, 5, 3197, d);
        }
        ed = e;
        return;
    }
    function fX() {
        return fV(956) | 0;
    }
    function fY(a) {
        a = a | 0;
        var b = 0;
        b = yH(1e3) | 0;
        fZ(b, a);
        fW(d4[(a + 976) >> 2] | 0, 1, 2456);
        d4[2276] = (d4[2276] | 0) + 1;
        d4[(b + 944) >> 2] = 0;
        return b | 0;
    }
    function fZ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        dh(a | 0, b | 0, 948) | 0;
        hQ((a + 948) | 0, (b + 948) | 0);
        c = (a + 960) | 0;
        a = (b + 960) | 0;
        b = (c + 40) | 0;
        do {
            d4[c >> 2] = d4[a >> 2];
            c = (c + 4) | 0;
            a = (a + 4) | 0;
        }while ((c | 0) < (b | 0))
        return;
    }
    function f$(b) {
        b = b | 0;
        var a = 0, c = 0, d = 0, e = 0;
        a = (b + 944) | 0;
        c = d4[a >> 2] | 0;
        if (c | 0) {
            f_((c + 948) | 0, b) | 0;
            d4[a >> 2] = 0;
        }
        c = f0(b) | 0;
        if (c | 0) {
            a = 0;
            do {
                d4[((f1(b, a) | 0) + 944) >> 2] = 0;
                a = (a + 1) | 0;
            }while ((a | 0) != (c | 0))
        }
        c = (b + 948) | 0;
        d = d4[c >> 2] | 0;
        e = (b + 952) | 0;
        a = d4[e >> 2] | 0;
        if ((a | 0) != (d | 0)) d4[e >> 2] = a + (~(((a + -4 - d) | 0) >>> 2) << 2);
        f2(c);
        c3(b);
        d4[2276] = (d4[2276] | 0) + -1;
        return;
    }
    function f_(a, d) {
        a = a | 0;
        d = d | 0;
        var b = 0, c = 0, e = 0, h = 0, g = 0, f = 0;
        c = d4[a >> 2] | 0;
        f = (a + 4) | 0;
        b = d4[f >> 2] | 0;
        h = b;
        a: do if ((c | 0) == (b | 0)) {
            e = c;
            g = 4;
        } else {
            a = c;
            while(1){
                if ((d4[a >> 2] | 0) == (d | 0)) {
                    e = a;
                    g = 4;
                    break a;
                }
                a = (a + 4) | 0;
                if ((a | 0) == (b | 0)) {
                    a = 0;
                    break;
                }
            }
        }
        while (0)
        if ((g | 0) == 4) if ((e | 0) != (b | 0)) {
            c = (e + 4) | 0;
            a = (h - c) | 0;
            d = a >> 2;
            if (d) {
                dk(e | 0, c | 0, a | 0) | 0;
                b = d4[f >> 2] | 0;
            }
            a = (e + (d << 2)) | 0;
            if ((b | 0) == (a | 0)) a = 1;
            else {
                d4[f >> 2] = b + (~(((b + -4 - a) | 0) >>> 2) << 2);
                a = 1;
            }
        } else a = 0;
        return a | 0;
    }
    function f0(a) {
        a = a | 0;
        return (((d4[(a + 952) >> 2] | 0) - (d4[(a + 948) >> 2] | 0)) >> 2) | 0;
    }
    function f1(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = d4[(a + 948) >> 2] | 0;
        if ((((d4[(a + 952) >> 2] | 0) - c) >> 2) >>> 0 > b >>> 0) a = d4[(c + (b << 2)) >> 2] | 0;
        else a = 0;
        return a | 0;
    }
    function f2(a) {
        a = a | 0;
        var c = 0, d = 0, e = 0, b = 0;
        e = ed;
        ed = (ed + 32) | 0;
        c = e;
        b = d4[a >> 2] | 0;
        d = ((d4[(a + 4) >> 2] | 0) - b) | 0;
        if ((((d4[(a + 8) >> 2] | 0) - b) | 0) >>> 0 > d >>> 0) {
            b = d >> 2;
            iB(c, b, b, (a + 8) | 0);
            iC(a, c);
            iD(c);
        }
        ed = e;
        return;
    }
    function f3(a, e) {
        a = a | 0;
        e = e | 0;
        var b = 0, d = 0, c = 0, f = 0, g = 0, h = 0, j = 0, i = 0;
        i = f0(a) | 0;
        do if (i | 0) {
            if ((d4[((f1(a, 0) | 0) + 944) >> 2] | 0) == (a | 0)) {
                if (!(f_((a + 948) | 0, e) | 0)) break;
                dh((e + 400) | 0, 8504, 540) | 0;
                d4[(e + 944) >> 2] = 0;
                ge(a);
                break;
            }
            g = d4[((d4[(a + 976) >> 2] | 0) + 12) >> 2] | 0;
            h = (a + 948) | 0;
            j = (g | 0) == 0;
            b = 0;
            f = 0;
            do {
                d = d4[((d4[h >> 2] | 0) + (f << 2)) >> 2] | 0;
                if ((d | 0) == (e | 0)) ge(a);
                else {
                    c = fY(d) | 0;
                    d4[((d4[h >> 2] | 0) + (b << 2)) >> 2] = c;
                    d4[(c + 944) >> 2] = a;
                    if (!j) zb[g & 15](d, c, a, b);
                    b = (b + 1) | 0;
                }
                f = (f + 1) | 0;
            }while ((f | 0) != (i | 0))
            if (b >>> 0 < i >>> 0) {
                j = (a + 948) | 0;
                h = (a + 952) | 0;
                g = b;
                b = d4[h >> 2] | 0;
                do {
                    f = ((d4[j >> 2] | 0) + (g << 2)) | 0;
                    d = (f + 4) | 0;
                    c = (b - d) | 0;
                    e = c >> 2;
                    if (!e) c = b;
                    else {
                        dk(f | 0, d | 0, c | 0) | 0;
                        b = d4[h >> 2] | 0;
                        c = b;
                    }
                    d = (f + (e << 2)) | 0;
                    if ((c | 0) != (d | 0)) {
                        b = (c + (~(((c + -4 - d) | 0) >>> 2) << 2)) | 0;
                        d4[h >> 2] = b;
                    }
                    g = (g + 1) | 0;
                }while ((g | 0) != (i | 0))
            }
        }
        while (0)
        return;
    }
    function f4(a) {
        a = a | 0;
        var b = 0, c = 0, e = 0, d = 0;
        f5(a, (f0(a) | 0) == 0, 2491);
        f5(a, (d4[(a + 944) >> 2] | 0) == 0, 2545);
        b = (a + 948) | 0;
        c = d4[b >> 2] | 0;
        e = (a + 952) | 0;
        d = d4[e >> 2] | 0;
        if ((d | 0) != (c | 0)) d4[e >> 2] = d + (~(((d + -4 - c) | 0) >>> 2) << 2);
        f2(b);
        b = (a + 976) | 0;
        c = d4[b >> 2] | 0;
        dh(a | 0, 8104, 1e3) | 0;
        if (d2[(c + 2) >> 0] | 0) {
            d4[(a + 4) >> 2] = 2;
            d4[(a + 12) >> 2] = 4;
        }
        d4[b >> 2] = c;
        return;
    }
    function f5(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        e = ed;
        ed = (ed + 16) | 0;
        d = e;
        if (!b) {
            d4[d >> 2] = c;
            hC(a, 5, 3197, d);
        }
        ed = e;
        return;
    }
    function f6() {
        return d4[2276] | 0;
    }
    function f7() {
        var a = 0;
        a = c2(20) | 0;
        f8((a | 0) != 0, 2592);
        d4[2277] = (d4[2277] | 0) + 1;
        d4[a >> 2] = d4[239];
        d4[(a + 4) >> 2] = d4[240];
        d4[(a + 8) >> 2] = d4[241];
        d4[(a + 12) >> 2] = d4[242];
        d4[(a + 16) >> 2] = d4[243];
        return a | 0;
    }
    function f8(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = ed;
        ed = (ed + 16) | 0;
        c = d;
        if (!a) {
            d4[c >> 2] = b;
            hC(0, 5, 3197, c);
        }
        ed = d;
        return;
    }
    function f9(a) {
        a = a | 0;
        c3(a);
        d4[2277] = (d4[2277] | 0) + -1;
        return;
    }
    function ga(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        if (!b) {
            c = 0;
            b = 0;
        } else {
            f5(a, (f0(a) | 0) == 0, 2629);
            c = 1;
        }
        d4[(a + 964) >> 2] = b;
        d4[(a + 988) >> 2] = c;
        return;
    }
    function gb(a, b, e) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        var c = 0, d = 0, f = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        f = (c + 8) | 0;
        d = (c + 4) | 0;
        g = c;
        d4[d >> 2] = b;
        f5(a, (d4[(b + 944) >> 2] | 0) == 0, 2709);
        f5(a, (d4[(a + 964) >> 2] | 0) == 0, 2763);
        gc(a);
        b = (a + 948) | 0;
        d4[g >> 2] = (d4[b >> 2] | 0) + (e << 2);
        d4[f >> 2] = d4[g >> 2];
        gd(b, f, d) | 0;
        d4[((d4[d >> 2] | 0) + 944) >> 2] = a;
        ge(a);
        ed = c;
        return;
    }
    function gc(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, h = 0, g = 0, c = 0;
        d = f0(a) | 0;
        if (d | 0 ? (d4[((f1(a, 0) | 0) + 944) >> 2] | 0) != (a | 0) : 0) {
            e = d4[((d4[(a + 976) >> 2] | 0) + 12) >> 2] | 0;
            f = (a + 948) | 0;
            h = (e | 0) == 0;
            b = 0;
            do {
                g = d4[((d4[f >> 2] | 0) + (b << 2)) >> 2] | 0;
                c = fY(g) | 0;
                d4[((d4[f >> 2] | 0) + (b << 2)) >> 2] = c;
                d4[(c + 944) >> 2] = a;
                if (!h) zb[e & 15](g, c, a, b);
                b = (b + 1) | 0;
            }while ((b | 0) != (d | 0))
        }
        return;
    }
    function gd(h, d, j) {
        h = h | 0;
        d = d | 0;
        j = j | 0;
        var a = 0, c = 0, b = 0, l = 0, n = 0, r = 0, e = 0, f = 0, o = 0, k = 0, p = 0, q = 0, i = 0, m = 0, g = 0;
        m = ed;
        ed = (ed + 64) | 0;
        o = (m + 52) | 0;
        n = (m + 48) | 0;
        k = (m + 28) | 0;
        p = (m + 24) | 0;
        q = (m + 20) | 0;
        i = m;
        a = d4[h >> 2] | 0;
        b = a;
        d = (a + ((((d4[d >> 2] | 0) - b) >> 2) << 2)) | 0;
        a = (h + 4) | 0;
        c = d4[a >> 2] | 0;
        l = (h + 8) | 0;
        do if (c >>> 0 < (d4[l >> 2] | 0) >>> 0) {
            if ((d | 0) == (c | 0)) {
                d4[d >> 2] = d4[j >> 2];
                d4[a >> 2] = (d4[a >> 2] | 0) + 4;
                break;
            }
            iE(h, d, c, (d + 4) | 0);
            if (d >>> 0 <= j >>> 0) j = (d4[a >> 2] | 0) >>> 0 > j >>> 0 ? (j + 4) | 0 : j;
            d4[d >> 2] = d4[j >> 2];
        } else {
            a = (((c - b) >> 2) + 1) | 0;
            c = hT(h) | 0;
            if (c >>> 0 < a >>> 0) yC(h);
            f = d4[h >> 2] | 0;
            e = ((d4[l >> 2] | 0) - f) | 0;
            b = e >> 1;
            iB(i, (e >> 2) >>> 0 < (c >>> 1) >>> 0 ? b >>> 0 < a >>> 0 ? a : b : c, (d - f) >> 2, (h + 8) | 0);
            f = (i + 8) | 0;
            a = d4[f >> 2] | 0;
            b = (i + 12) | 0;
            e = d4[b >> 2] | 0;
            l = e;
            r = a;
            do if ((a | 0) == (e | 0)) {
                e = (i + 4) | 0;
                a = d4[e >> 2] | 0;
                g = d4[i >> 2] | 0;
                c = g;
                if (a >>> 0 <= g >>> 0) {
                    a = (l - c) >> 1;
                    a = (a | 0) == 0 ? 1 : a;
                    iB(k, a, a >>> 2, d4[(i + 16) >> 2] | 0);
                    d4[p >> 2] = d4[e >> 2];
                    d4[q >> 2] = d4[f >> 2];
                    d4[n >> 2] = d4[p >> 2];
                    d4[o >> 2] = d4[q >> 2];
                    iG(k, n, o);
                    a = d4[i >> 2] | 0;
                    d4[i >> 2] = d4[k >> 2];
                    d4[k >> 2] = a;
                    a = (k + 4) | 0;
                    g = d4[e >> 2] | 0;
                    d4[e >> 2] = d4[a >> 2];
                    d4[a >> 2] = g;
                    a = (k + 8) | 0;
                    g = d4[f >> 2] | 0;
                    d4[f >> 2] = d4[a >> 2];
                    d4[a >> 2] = g;
                    a = (k + 12) | 0;
                    g = d4[b >> 2] | 0;
                    d4[b >> 2] = d4[a >> 2];
                    d4[a >> 2] = g;
                    iD(k);
                    a = d4[f >> 2] | 0;
                    break;
                }
                b = a;
                l = (((((b - c) >> 2) + 1) | 0) / -2) | 0;
                n = (a + (l << 2)) | 0;
                c = (r - b) | 0;
                b = c >> 2;
                if (b) {
                    dk(n | 0, a | 0, c | 0) | 0;
                    a = d4[e >> 2] | 0;
                }
                g = (n + (b << 2)) | 0;
                d4[f >> 2] = g;
                d4[e >> 2] = a + (l << 2);
                a = g;
            }
            while (0)
            d4[a >> 2] = d4[j >> 2];
            d4[f >> 2] = (d4[f >> 2] | 0) + 4;
            d = iF(h, i, d) | 0;
            iD(i);
        }
        while (0)
        ed = m;
        return d | 0;
    }
    function ge(a) {
        a = a | 0;
        var b = 0;
        do {
            b = (a + 984) | 0;
            if (d2[b >> 0] | 0) break;
            d2[b >> 0] = 1;
            d8[(a + 504) >> 2] = n(el);
            a = d4[(a + 944) >> 2] | 0;
        }while ((a | 0) != 0)
        return;
    }
    function gf(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -4 - d) | 0) >>> 2) << 2);
            yJ(b);
        }
        return;
    }
    function gg(a) {
        a = a | 0;
        return d4[(a + 944) >> 2] | 0;
    }
    function gh(a) {
        a = a | 0;
        f5(a, (d4[(a + 964) >> 2] | 0) != 0, 2832);
        ge(a);
        return;
    }
    function gi(a) {
        a = a | 0;
        return ((d2[(a + 984) >> 0] | 0) != 0) | 0;
    }
    function gj(a, b) {
        a = a | 0;
        b = b | 0;
        if (x2(a, b, 400) | 0) {
            dh(a | 0, b | 0, 400) | 0;
            ge(a);
        }
        return;
    }
    function gk(a) {
        a = a | 0;
        var b = fR;
        b = n(d8[(a + 44) >> 2]);
        a = fT(b) | 0;
        return n(a ? n(0.0) : b);
    }
    function gl(a) {
        a = a | 0;
        var b = fR;
        b = n(d8[(a + 48) >> 2]);
        if (fT(b) | 0) b = d2[((d4[(a + 976) >> 2] | 0) + 2) >> 0] | 0 ? n(1.0) : n(0.0);
        return n(b);
    }
    function gm(a, b) {
        a = a | 0;
        b = b | 0;
        d4[(a + 980) >> 2] = b;
        return;
    }
    function gn(a) {
        a = a | 0;
        return d4[(a + 980) >> 2] | 0;
    }
    function go(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 4) | 0;
        if ((d4[c >> 2] | 0) != (b | 0)) {
            d4[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gp(a) {
        a = a | 0;
        return d4[(a + 4) >> 2] | 0;
    }
    function gq(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 8) | 0;
        if ((d4[c >> 2] | 0) != (b | 0)) {
            d4[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gr(a) {
        a = a | 0;
        return d4[(a + 8) >> 2] | 0;
    }
    function gs(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 12) | 0;
        if ((d4[c >> 2] | 0) != (b | 0)) {
            d4[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gt(a) {
        a = a | 0;
        return d4[(a + 12) >> 2] | 0;
    }
    function gu(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 16) | 0;
        if ((d4[c >> 2] | 0) != (b | 0)) {
            d4[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gv(a) {
        a = a | 0;
        return d4[(a + 16) >> 2] | 0;
    }
    function gw(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 20) | 0;
        if ((d4[c >> 2] | 0) != (b | 0)) {
            d4[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gx(a) {
        a = a | 0;
        return d4[(a + 20) >> 2] | 0;
    }
    function gy(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 24) | 0;
        if ((d4[c >> 2] | 0) != (b | 0)) {
            d4[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gz(a) {
        a = a | 0;
        return d4[(a + 24) >> 2] | 0;
    }
    function gA(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 28) | 0;
        if ((d4[c >> 2] | 0) != (b | 0)) {
            d4[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gB(a) {
        a = a | 0;
        return d4[(a + 28) >> 2] | 0;
    }
    function gC(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 32) | 0;
        if ((d4[c >> 2] | 0) != (b | 0)) {
            d4[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gD(a) {
        a = a | 0;
        return d4[(a + 32) >> 2] | 0;
    }
    function gE(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 36) | 0;
        if ((d4[c >> 2] | 0) != (b | 0)) {
            d4[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gF(a) {
        a = a | 0;
        return d4[(a + 36) >> 2] | 0;
    }
    function gG(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0;
        c = (a + 40) | 0;
        if (n(d8[c >> 2]) != b) {
            d8[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gH(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0;
        c = (a + 44) | 0;
        if (n(d8[c >> 2]) != b) {
            d8[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gI(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0;
        c = (a + 48) | 0;
        if (n(d8[c >> 2]) != b) {
            d8[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function gJ(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = (f ^ 1) & 1;
        d = (a + 52) | 0;
        e = (a + 56) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function gK(a, b) {
        a = a | 0;
        b = n(b);
        var d = 0, c = 0;
        c = (a + 52) | 0;
        d = (a + 56) | 0;
        if (!(!(n(d8[c >> 2]) != b) ? (d4[d >> 2] | 0) == 2 : 0)) {
            d8[c >> 2] = b;
            c = fT(b) | 0;
            d4[d >> 2] = c ? 3 : 2;
            ge(a);
        }
        return;
    }
    function gL(b, a) {
        b = b | 0;
        a = a | 0;
        var d = 0, c = 0;
        c = (a + 52) | 0;
        d = d4[(c + 4) >> 2] | 0;
        a = b;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = d;
        return;
    }
    function gM(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = n(c);
        var d = 0, e = 0, f = 0;
        f = fT(c) | 0;
        d = (f ^ 1) & 1;
        e = (b + 132 + (a << 3)) | 0;
        a = (b + 132 + (a << 3) + 4) | 0;
        if (!(f | (n(d8[e >> 2]) == c) ? (d4[a >> 2] | 0) == (d | 0) : 0)) {
            d8[e >> 2] = c;
            d4[a >> 2] = d;
            ge(b);
        }
        return;
    }
    function gN(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = n(c);
        var d = 0, e = 0, f = 0;
        f = fT(c) | 0;
        d = f ? 0 : 2;
        e = (b + 132 + (a << 3)) | 0;
        a = (b + 132 + (a << 3) + 4) | 0;
        if (!(f | (n(d8[e >> 2]) == c) ? (d4[a >> 2] | 0) == (d | 0) : 0)) {
            d8[e >> 2] = c;
            d4[a >> 2] = d;
            ge(b);
        }
        return;
    }
    function gO(c, b, a) {
        c = c | 0;
        b = b | 0;
        a = a | 0;
        var d = 0;
        d = (b + 132 + (a << 3)) | 0;
        b = d4[(d + 4) >> 2] | 0;
        a = c;
        d4[a >> 2] = d4[d >> 2];
        d4[(a + 4) >> 2] = b;
        return;
    }
    function gP(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = n(c);
        var d = 0, e = 0, f = 0;
        f = fT(c) | 0;
        d = (f ^ 1) & 1;
        e = (b + 60 + (a << 3)) | 0;
        a = (b + 60 + (a << 3) + 4) | 0;
        if (!(f | (n(d8[e >> 2]) == c) ? (d4[a >> 2] | 0) == (d | 0) : 0)) {
            d8[e >> 2] = c;
            d4[a >> 2] = d;
            ge(b);
        }
        return;
    }
    function gQ(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = n(c);
        var d = 0, e = 0, f = 0;
        f = fT(c) | 0;
        d = f ? 0 : 2;
        e = (b + 60 + (a << 3)) | 0;
        a = (b + 60 + (a << 3) + 4) | 0;
        if (!(f | (n(d8[e >> 2]) == c) ? (d4[a >> 2] | 0) == (d | 0) : 0)) {
            d8[e >> 2] = c;
            d4[a >> 2] = d;
            ge(b);
        }
        return;
    }
    function gR(c, b, a) {
        c = c | 0;
        b = b | 0;
        a = a | 0;
        var d = 0;
        d = (b + 60 + (a << 3)) | 0;
        b = d4[(d + 4) >> 2] | 0;
        a = c;
        d4[a >> 2] = d4[d >> 2];
        d4[(a + 4) >> 2] = b;
        return;
    }
    function gS(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 60 + (b << 3) + 4) | 0;
        if ((d4[c >> 2] | 0) != 3) {
            d8[(a + 60 + (b << 3)) >> 2] = n(el);
            d4[c >> 2] = 3;
            ge(a);
        }
        return;
    }
    function gT(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = n(c);
        var d = 0, e = 0, f = 0;
        f = fT(c) | 0;
        d = (f ^ 1) & 1;
        e = (b + 204 + (a << 3)) | 0;
        a = (b + 204 + (a << 3) + 4) | 0;
        if (!(f | (n(d8[e >> 2]) == c) ? (d4[a >> 2] | 0) == (d | 0) : 0)) {
            d8[e >> 2] = c;
            d4[a >> 2] = d;
            ge(b);
        }
        return;
    }
    function gU(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = n(c);
        var d = 0, e = 0, f = 0;
        f = fT(c) | 0;
        d = f ? 0 : 2;
        e = (b + 204 + (a << 3)) | 0;
        a = (b + 204 + (a << 3) + 4) | 0;
        if (!(f | (n(d8[e >> 2]) == c) ? (d4[a >> 2] | 0) == (d | 0) : 0)) {
            d8[e >> 2] = c;
            d4[a >> 2] = d;
            ge(b);
        }
        return;
    }
    function gV(c, b, a) {
        c = c | 0;
        b = b | 0;
        a = a | 0;
        var d = 0;
        d = (b + 204 + (a << 3)) | 0;
        b = d4[(d + 4) >> 2] | 0;
        a = c;
        d4[a >> 2] = d4[d >> 2];
        d4[(a + 4) >> 2] = b;
        return;
    }
    function gW(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = n(c);
        var d = 0, e = 0, f = 0;
        f = fT(c) | 0;
        d = (f ^ 1) & 1;
        e = (b + 276 + (a << 3)) | 0;
        a = (b + 276 + (a << 3) + 4) | 0;
        if (!(f | (n(d8[e >> 2]) == c) ? (d4[a >> 2] | 0) == (d | 0) : 0)) {
            d8[e >> 2] = c;
            d4[a >> 2] = d;
            ge(b);
        }
        return;
    }
    function gX(a, b) {
        a = a | 0;
        b = b | 0;
        return n(d8[(a + 276 + (b << 3)) >> 2]);
    }
    function gY(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = (f ^ 1) & 1;
        d = (a + 348) | 0;
        e = (a + 352) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function gZ(a, b) {
        a = a | 0;
        b = n(b);
        var d = 0, c = 0;
        c = (a + 348) | 0;
        d = (a + 352) | 0;
        if (!(!(n(d8[c >> 2]) != b) ? (d4[d >> 2] | 0) == 2 : 0)) {
            d8[c >> 2] = b;
            c = fT(b) | 0;
            d4[d >> 2] = c ? 3 : 2;
            ge(a);
        }
        return;
    }
    function g$(a) {
        a = a | 0;
        var b = 0;
        b = (a + 352) | 0;
        if ((d4[b >> 2] | 0) != 3) {
            d8[(a + 348) >> 2] = n(el);
            d4[b >> 2] = 3;
            ge(a);
        }
        return;
    }
    function g_(b, a) {
        b = b | 0;
        a = a | 0;
        var d = 0, c = 0;
        c = (a + 348) | 0;
        d = d4[(c + 4) >> 2] | 0;
        a = b;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = d;
        return;
    }
    function g0(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = (f ^ 1) & 1;
        d = (a + 356) | 0;
        e = (a + 360) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function g1(a, b) {
        a = a | 0;
        b = n(b);
        var d = 0, c = 0;
        c = (a + 356) | 0;
        d = (a + 360) | 0;
        if (!(!(n(d8[c >> 2]) != b) ? (d4[d >> 2] | 0) == 2 : 0)) {
            d8[c >> 2] = b;
            c = fT(b) | 0;
            d4[d >> 2] = c ? 3 : 2;
            ge(a);
        }
        return;
    }
    function g2(a) {
        a = a | 0;
        var b = 0;
        b = (a + 360) | 0;
        if ((d4[b >> 2] | 0) != 3) {
            d8[(a + 356) >> 2] = n(el);
            d4[b >> 2] = 3;
            ge(a);
        }
        return;
    }
    function g3(b, a) {
        b = b | 0;
        a = a | 0;
        var d = 0, c = 0;
        c = (a + 356) | 0;
        d = d4[(c + 4) >> 2] | 0;
        a = b;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = d;
        return;
    }
    function g4(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = (f ^ 1) & 1;
        d = (a + 364) | 0;
        e = (a + 368) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function g5(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = f ? 0 : 2;
        d = (a + 364) | 0;
        e = (a + 368) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function g6(b, a) {
        b = b | 0;
        a = a | 0;
        var d = 0, c = 0;
        c = (a + 364) | 0;
        d = d4[(c + 4) >> 2] | 0;
        a = b;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = d;
        return;
    }
    function g7(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = (f ^ 1) & 1;
        d = (a + 372) | 0;
        e = (a + 376) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function g8(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = f ? 0 : 2;
        d = (a + 372) | 0;
        e = (a + 376) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function g9(b, a) {
        b = b | 0;
        a = a | 0;
        var d = 0, c = 0;
        c = (a + 372) | 0;
        d = d4[(c + 4) >> 2] | 0;
        a = b;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = d;
        return;
    }
    function ha(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = (f ^ 1) & 1;
        d = (a + 380) | 0;
        e = (a + 384) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function hb(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = f ? 0 : 2;
        d = (a + 380) | 0;
        e = (a + 384) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function hc(b, a) {
        b = b | 0;
        a = a | 0;
        var d = 0, c = 0;
        c = (a + 380) | 0;
        d = d4[(c + 4) >> 2] | 0;
        a = b;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = d;
        return;
    }
    function hd(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = (f ^ 1) & 1;
        d = (a + 388) | 0;
        e = (a + 392) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function he(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0, d = 0, e = 0, f = 0;
        f = fT(b) | 0;
        c = f ? 0 : 2;
        d = (a + 388) | 0;
        e = (a + 392) | 0;
        if (!(f | (n(d8[d >> 2]) == b) ? (d4[e >> 2] | 0) == (c | 0) : 0)) {
            d8[d >> 2] = b;
            d4[e >> 2] = c;
            ge(a);
        }
        return;
    }
    function hf(b, a) {
        b = b | 0;
        a = a | 0;
        var d = 0, c = 0;
        c = (a + 388) | 0;
        d = d4[(c + 4) >> 2] | 0;
        a = b;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = d;
        return;
    }
    function hg(a, b) {
        a = a | 0;
        b = n(b);
        var c = 0;
        c = (a + 396) | 0;
        if (n(d8[c >> 2]) != b) {
            d8[c >> 2] = b;
            ge(a);
        }
        return;
    }
    function hh(a) {
        a = a | 0;
        return n(d8[(a + 396) >> 2]);
    }
    function hi(a) {
        a = a | 0;
        return n(d8[(a + 400) >> 2]);
    }
    function hj(a) {
        a = a | 0;
        return n(d8[(a + 404) >> 2]);
    }
    function hk(a) {
        a = a | 0;
        return n(d8[(a + 408) >> 2]);
    }
    function hl(a) {
        a = a | 0;
        return n(d8[(a + 412) >> 2]);
    }
    function hm(a) {
        a = a | 0;
        return n(d8[(a + 416) >> 2]);
    }
    function hn(a) {
        a = a | 0;
        return n(d8[(a + 420) >> 2]);
    }
    function ho(b, a) {
        b = b | 0;
        a = a | 0;
        f5(b, (a | 0) < 6, 2918);
        switch(a | 0){
            case 0:
                {
                    a = (d4[(b + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    a = (d4[(b + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return n(d8[(b + 424 + (a << 2)) >> 2]);
    }
    function hp(b, a) {
        b = b | 0;
        a = a | 0;
        f5(b, (a | 0) < 6, 2918);
        switch(a | 0){
            case 0:
                {
                    a = (d4[(b + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    a = (d4[(b + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return n(d8[(b + 448 + (a << 2)) >> 2]);
    }
    function hq(b, a) {
        b = b | 0;
        a = a | 0;
        f5(b, (a | 0) < 6, 2918);
        switch(a | 0){
            case 0:
                {
                    a = (d4[(b + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    a = (d4[(b + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return n(d8[(b + 472 + (a << 2)) >> 2]);
    }
    function hr(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = fR;
        c = d4[(a + 4) >> 2] | 0;
        if ((c | 0) == (d4[(b + 4) >> 2] | 0)) {
            if (!c) a = 1;
            else {
                d = n(d8[a >> 2]);
                a = n(eu(n(d - n(d8[b >> 2])))) < n(0.0000999999974);
            }
        } else a = 0;
        return a | 0;
    }
    function hs(a, b) {
        a = n(a);
        b = n(b);
        var c = 0;
        if (fT(a) | 0) c = fT(b) | 0;
        else c = n(eu(n(a - b))) < n(0.0000999999974);
        return c | 0;
    }
    function ht(a, b) {
        a = a | 0;
        b = b | 0;
        hu(a, b);
        return;
    }
    function hu(b, d) {
        b = b | 0;
        d = d | 0;
        var c = 0, a = 0;
        c = ed;
        ed = (ed + 16) | 0;
        a = (c + 4) | 0;
        d4[a >> 2] = 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        fr(a | 0, b | 0, d | 0, 0);
        hC(b, 3, (d2[(a + 11) >> 0] | 0) < 0 ? d4[a >> 2] | 0 : a, c);
        yK(a);
        ed = c;
        return;
    }
    function hv(a, d, e, c) {
        a = n(a);
        d = n(d);
        e = e | 0;
        c = c | 0;
        var b = fR;
        a = n(a * d);
        b = n(yz(a, n(1.0)));
        do if (!(hs(b, n(0.0)) | 0)) {
            a = n(a - b);
            if (hs(b, n(1.0)) | 0) {
                a = n(a + n(1.0));
                break;
            }
            if (e) {
                a = n(a + n(1.0));
                break;
            }
            if (!c) {
                if (b > n(0.5)) b = n(1.0);
                else {
                    c = hs(b, n(0.5)) | 0;
                    b = c ? n(1.0) : n(0.0);
                }
                a = n(a + b);
            }
        } else a = n(a - b);
        while (0)
        return n(a / d);
    }
    function hw(c, h, d, i, j, k, l, m, e, f, q, r, a) {
        c = c | 0;
        h = n(h);
        d = d | 0;
        i = n(i);
        j = j | 0;
        k = n(k);
        l = l | 0;
        m = n(m);
        e = n(e);
        f = n(f);
        q = n(q);
        r = n(r);
        a = a | 0;
        var g = 0, b = fR, s = fR, t = fR, u = fR, o = fR, p = fR;
        if ((e < n(0.0)) | (f < n(0.0))) a = 0;
        else {
            if ((a | 0) != 0 ? ((b = n(d8[(a + 4) >> 2])), b != n(0.0)) : 0) {
                t = n(hv(h, b, 0, 0));
                u = n(hv(i, b, 0, 0));
                s = n(hv(k, b, 0, 0));
                b = n(hv(m, b, 0, 0));
            } else {
                s = k;
                t = h;
                b = m;
                u = i;
            }
            if ((j | 0) == (c | 0)) g = hs(s, t) | 0;
            else g = 0;
            if ((l | 0) == (d | 0)) a = hs(b, u) | 0;
            else a = 0;
            if ((!g ? ((o = n(h - q)), !(hx(c, o, e) | 0)) : 0) ? !(hy(c, o, j, e) | 0) : 0) g = hz(c, o, j, k, e) | 0;
            else g = 1;
            if ((!a ? ((p = n(i - r)), !(hx(d, p, f) | 0)) : 0) ? !(hy(d, p, l, f) | 0) : 0) a = hz(d, p, l, m, f) | 0;
            else a = 1;
            a = g & a;
        }
        return a | 0;
    }
    function hx(a, b, c) {
        a = a | 0;
        b = n(b);
        c = n(c);
        if ((a | 0) == 1) a = hs(b, c) | 0;
        else a = 0;
        return a | 0;
    }
    function hy(a, b, d, c) {
        a = a | 0;
        b = n(b);
        d = d | 0;
        c = n(c);
        if (((a | 0) == 2) & ((d | 0) == 0)) {
            if (!(b >= c)) a = hs(b, c) | 0;
            else a = 1;
        } else a = 0;
        return a | 0;
    }
    function hz(a, b, d, e, c) {
        a = a | 0;
        b = n(b);
        d = d | 0;
        e = n(e);
        c = n(c);
        if (((a | 0) == 2) & ((d | 0) == 2) & (e > b)) {
            if (!(c <= b)) a = hs(b, c) | 0;
            else a = 1;
        } else a = 0;
        return a | 0;
    }
    function hA(a, i, j, t, f, g, u, D, h, v, w) {
        a = a | 0;
        i = n(i);
        j = n(j);
        t = t | 0;
        f = f | 0;
        g = g | 0;
        u = n(u);
        D = n(D);
        h = h | 0;
        v = v | 0;
        w = w | 0;
        var c = 0, b = 0, k = 0, m = 0, E = fR, F = fR, d = 0, x = 0, o = 0, r = 0, e = 0, p = 0, q = 0, H = 0, G = 0, s = 0, l = 0, y = fR, z = fR, A = fR, B = 0.0, C = 0.0;
        l = ed;
        ed = (ed + 160) | 0;
        H = (l + 152) | 0;
        q = (l + 120) | 0;
        p = (l + 104) | 0;
        o = (l + 72) | 0;
        m = (l + 56) | 0;
        e = (l + 8) | 0;
        x = l;
        r = ((d4[2279] | 0) + 1) | 0;
        d4[2279] = r;
        G = (a + 984) | 0;
        if ((d2[G >> 0] | 0) != 0 ? (d4[(a + 512) >> 2] | 0) != (d4[2278] | 0) : 0) d = 4;
        else if ((d4[(a + 516) >> 2] | 0) == (t | 0)) s = 0;
        else d = 4;
        if ((d | 0) == 4) {
            d4[(a + 520) >> 2] = 0;
            d4[(a + 924) >> 2] = -1;
            d4[(a + 928) >> 2] = -1;
            d8[(a + 932) >> 2] = n(-1.0);
            d8[(a + 936) >> 2] = n(-1.0);
            s = 1;
        }
        a: do if (!(d4[(a + 964) >> 2] | 0)) {
            if (h) {
                c = (a + 916) | 0;
                if (!(hs(n(d8[c >> 2]), i) | 0)) {
                    d = 21;
                    break;
                }
                if (!(hs(n(d8[(a + 920) >> 2]), j) | 0)) {
                    d = 21;
                    break;
                }
                if ((d4[(a + 924) >> 2] | 0) != (f | 0)) {
                    d = 21;
                    break;
                }
                c = (d4[(a + 928) >> 2] | 0) == (g | 0) ? c : 0;
                d = 22;
                break;
            }
            k = d4[(a + 520) >> 2] | 0;
            if (!k) d = 21;
            else {
                b = 0;
                while(1){
                    c = (a + 524 + ((b * 24) | 0)) | 0;
                    if (((hs(n(d8[c >> 2]), i) | 0 ? hs(n(d8[(a + 524 + ((b * 24) | 0) + 4) >> 2]), j) | 0 : 0) ? (d4[(a + 524 + ((b * 24) | 0) + 8) >> 2] | 0) == (f | 0) : 0) ? (d4[(a + 524 + ((b * 24) | 0) + 12) >> 2] | 0) == (g | 0) : 0) {
                        d = 22;
                        break a;
                    }
                    b = (b + 1) | 0;
                    if (b >>> 0 >= k >>> 0) {
                        d = 21;
                        break;
                    }
                }
            }
        } else {
            E = n(hB(a, 2, u));
            F = n(hB(a, 0, u));
            c = (a + 916) | 0;
            A = n(d8[c >> 2]);
            z = n(d8[(a + 920) >> 2]);
            y = n(d8[(a + 932) >> 2]);
            if (!(hw(f, i, g, j, d4[(a + 924) >> 2] | 0, A, d4[(a + 928) >> 2] | 0, z, y, n(d8[(a + 936) >> 2]), E, F, w) | 0)) {
                k = d4[(a + 520) >> 2] | 0;
                if (!k) d = 21;
                else {
                    b = 0;
                    while(1){
                        c = (a + 524 + ((b * 24) | 0)) | 0;
                        y = n(d8[c >> 2]);
                        z = n(d8[(a + 524 + ((b * 24) | 0) + 4) >> 2]);
                        A = n(d8[(a + 524 + ((b * 24) | 0) + 16) >> 2]);
                        if (hw(f, i, g, j, d4[(a + 524 + ((b * 24) | 0) + 8) >> 2] | 0, y, d4[(a + 524 + ((b * 24) | 0) + 12) >> 2] | 0, z, A, n(d8[(a + 524 + ((b * 24) | 0) + 20) >> 2]), E, F, w) | 0) {
                            d = 22;
                            break a;
                        }
                        b = (b + 1) | 0;
                        if (b >>> 0 >= k >>> 0) {
                            d = 21;
                            break;
                        }
                    }
                }
            } else d = 22;
        }
        while (0)
        do if ((d | 0) == 21) {
            if (!(d2[11697] | 0)) {
                c = 0;
                d = 31;
            } else {
                c = 0;
                d = 28;
            }
        } else if ((d | 0) == 22) {
            b = (d2[11697] | 0) != 0;
            if (!(((c | 0) != 0) & (s ^ 1))) if (b) {
                d = 28;
                break;
            } else {
                d = 31;
                break;
            }
            m = (c + 16) | 0;
            d4[(a + 908) >> 2] = d4[m >> 2];
            k = (c + 20) | 0;
            d4[(a + 912) >> 2] = d4[k >> 2];
            if (!(((d2[11698] | 0) == 0) | (b ^ 1))) {
                d4[x >> 2] = hD(r) | 0;
                d4[(x + 4) >> 2] = r;
                hC(a, 4, 2972, x);
                b = d4[(a + 972) >> 2] | 0;
                if (b | 0) yS[b & 127](a);
                f = hE(f, h) | 0;
                g = hE(g, h) | 0;
                C = +n(d8[m >> 2]);
                B = +n(d8[k >> 2]);
                d4[e >> 2] = f;
                d4[(e + 4) >> 2] = g;
                d9[(e + 8) >> 3] = +i;
                d9[(e + 16) >> 3] = +j;
                d9[(e + 24) >> 3] = C;
                d9[(e + 32) >> 3] = B;
                d4[(e + 40) >> 2] = v;
                hC(a, 4, 2989, e);
            }
        }
        while (0)
        if ((d | 0) == 28) {
            b = hD(r) | 0;
            d4[m >> 2] = b;
            d4[(m + 4) >> 2] = r;
            d4[(m + 8) >> 2] = s ? 3047 : 11699;
            hC(a, 4, 3038, m);
            b = d4[(a + 972) >> 2] | 0;
            if (b | 0) yS[b & 127](a);
            e = hE(f, h) | 0;
            d = hE(g, h) | 0;
            d4[o >> 2] = e;
            d4[(o + 4) >> 2] = d;
            d9[(o + 8) >> 3] = +i;
            d9[(o + 16) >> 3] = +j;
            d4[(o + 24) >> 2] = v;
            hC(a, 4, 3049, o);
            d = 31;
        }
        if ((d | 0) == 31) {
            hF(a, i, j, t, f, g, u, D, h, w);
            if (d2[11697] | 0) {
                b = d4[2279] | 0;
                e = hD(b) | 0;
                d4[p >> 2] = e;
                d4[(p + 4) >> 2] = b;
                d4[(p + 8) >> 2] = s ? 3047 : 11699;
                hC(a, 4, 3083, p);
                b = d4[(a + 972) >> 2] | 0;
                if (b | 0) yS[b & 127](a);
                e = hE(f, h) | 0;
                p = hE(g, h) | 0;
                B = +n(d8[(a + 908) >> 2]);
                C = +n(d8[(a + 912) >> 2]);
                d4[q >> 2] = e;
                d4[(q + 4) >> 2] = p;
                d9[(q + 8) >> 3] = B;
                d9[(q + 16) >> 3] = C;
                d4[(q + 24) >> 2] = v;
                hC(a, 4, 3092, q);
            }
            d4[(a + 516) >> 2] = t;
            if (!c) {
                b = (a + 520) | 0;
                c = d4[b >> 2] | 0;
                if ((c | 0) == 16) {
                    if (d2[11697] | 0) hC(a, 4, 3124, H);
                    d4[b >> 2] = 0;
                    c = 0;
                }
                if (h) c = (a + 916) | 0;
                else {
                    d4[b >> 2] = c + 1;
                    c = (a + 524 + ((c * 24) | 0)) | 0;
                }
                d8[c >> 2] = i;
                d8[(c + 4) >> 2] = j;
                d4[(c + 8) >> 2] = f;
                d4[(c + 12) >> 2] = g;
                d4[(c + 16) >> 2] = d4[(a + 908) >> 2];
                d4[(c + 20) >> 2] = d4[(a + 912) >> 2];
                c = 0;
            }
        }
        if (h) {
            d4[(a + 416) >> 2] = d4[(a + 908) >> 2];
            d4[(a + 420) >> 2] = d4[(a + 912) >> 2];
            d2[(a + 985) >> 0] = 1;
            d2[G >> 0] = 0;
        }
        d4[2279] = (d4[2279] | 0) + -1;
        d4[(a + 512) >> 2] = d4[2278];
        ed = l;
        return s | ((c | 0) == 0) | 0;
    }
    function hB(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        var d = fR;
        d = n(hU(a, b, c));
        return n(d + n(hV(a, b, c)));
    }
    function hC(b, c, d, a) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        a = a | 0;
        var e = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        e = f;
        d4[e >> 2] = a;
        if (!b) a = 0;
        else a = d4[(b + 976) >> 2] | 0;
        hO(a, b, c, d, e);
        ed = f;
        return;
    }
    function hD(a) {
        a = a | 0;
        return (a >>> 0 > 60 ? 3201 : (3201 + (60 - a)) | 0) | 0;
    }
    function hE(a, e) {
        a = a | 0;
        e = e | 0;
        var b = 0, c = 0, d = 0;
        d = ed;
        ed = (ed + 32) | 0;
        b = (d + 12) | 0;
        c = d;
        d4[b >> 2] = d4[254];
        d4[(b + 4) >> 2] = d4[255];
        d4[(b + 8) >> 2] = d4[256];
        d4[c >> 2] = d4[257];
        d4[(c + 4) >> 2] = d4[258];
        d4[(c + 8) >> 2] = d4[259];
        if ((a | 0) > 2) a = 11699;
        else a = d4[((e ? c : b) + (a << 2)) >> 2] | 0;
        ed = d;
        return a | 0;
    }
    function hF(d, a, i, w, L, u, p, M, D, V) {
        d = d | 0;
        a = n(a);
        i = n(i);
        w = w | 0;
        L = L | 0;
        u = u | 0;
        p = n(p);
        M = n(M);
        D = D | 0;
        V = V | 0;
        var b = 0, c = 0, g = 0, r = 0, x = fR, f = fR, j = fR, m = fR, z = fR, s = fR, G = fR, q = 0, N = 0, A = 0, R = fR, B = fR, S = 0, C = fR, X = 0, az = 0, ac = 0, ad = 0, ao = 0, aA = 0, aB = 0, Y = 0, aC = 0, aj = 0, ak = 0, aD = 0, aE = 0, aF = 0, o = 0, Z = 0, aG = 0, ae = 0, aH = fR, aI = fR, al = fR, am = fR, af = fR, H = 0, W = 0, T = 0, $ = 0, ap = 0, aq = fR, an = fR, ar = fR, as = fR, I = fR, E = fR, _ = 0, v = fR, at = fR, O = fR, ag = fR, P = fR, ah = fR, au = 0, av = 0, ai = fR, J = fR, aa = 0, aw = 0, ax = 0, ay = 0, k = fR, y = 0, F = 0, Q = 0, K = 0, l = 0, h = 0, ab = 0, e = fR, U = 0, t = 0;
        ab = ed;
        ed = (ed + 16) | 0;
        H = (ab + 12) | 0;
        W = (ab + 8) | 0;
        T = (ab + 4) | 0;
        $ = ab;
        f5(d, ((L | 0) == 0) | ((fT(a) | 0) ^ 1), 3326);
        f5(d, ((u | 0) == 0) | ((fT(i) | 0) ^ 1), 3406);
        F = hY(d, w) | 0;
        d4[(d + 496) >> 2] = F;
        l = hZ(2, F) | 0;
        h = hZ(0, F) | 0;
        d8[(d + 440) >> 2] = n(hU(d, l, p));
        d8[(d + 444) >> 2] = n(hV(d, l, p));
        d8[(d + 428) >> 2] = n(hU(d, h, p));
        d8[(d + 436) >> 2] = n(hV(d, h, p));
        d8[(d + 464) >> 2] = n(h$(d, l));
        d8[(d + 468) >> 2] = n(h_(d, l));
        d8[(d + 452) >> 2] = n(h$(d, h));
        d8[(d + 460) >> 2] = n(h_(d, h));
        d8[(d + 488) >> 2] = n(h0(d, l, p));
        d8[(d + 492) >> 2] = n(h1(d, l, p));
        d8[(d + 476) >> 2] = n(h0(d, h, p));
        d8[(d + 484) >> 2] = n(h1(d, h, p));
        do if (!(d4[(d + 964) >> 2] | 0)) {
            Q = (d + 948) | 0;
            K = ((d4[(d + 952) >> 2] | 0) - (d4[Q >> 2] | 0)) >> 2;
            if (!K) {
                h3(d, a, i, L, u, p, M);
                break;
            }
            if (!D ? h4(d, a, i, L, u, p, M) | 0 : 0) break;
            gc(d);
            Z = (d + 508) | 0;
            d2[Z >> 0] = 0;
            l = hZ(d4[(d + 4) >> 2] | 0, F) | 0;
            h = h5(l, F) | 0;
            y = hW(l) | 0;
            aG = d4[(d + 8) >> 2] | 0;
            aw = (d + 28) | 0;
            ae = (d4[aw >> 2] | 0) != 0;
            P = y ? p : M;
            ai = y ? M : p;
            aH = n(h6(d, l, p));
            aI = n(h7(d, l, p));
            x = n(h6(d, h, p));
            ah = n(h8(d, l, p));
            J = n(h8(d, h, p));
            A = y ? L : u;
            aa = y ? u : L;
            k = y ? ah : J;
            z = y ? J : ah;
            ag = n(hB(d, 2, p));
            m = n(hB(d, 0, p));
            f = n(n(hK((d + 364) | 0, p)) - k);
            j = n(n(hK((d + 380) | 0, p)) - k);
            s = n(n(hK((d + 372) | 0, M)) - z);
            G = n(n(hK((d + 388) | 0, M)) - z);
            al = y ? f : s;
            am = y ? j : G;
            ag = n(a - ag);
            a = n(ag - k);
            if (fT(a) | 0) k = a;
            else k = n(yv(n(yx(a, j)), f));
            at = n(i - m);
            a = n(at - z);
            if (fT(a) | 0) O = a;
            else O = n(yv(n(yx(a, G)), s));
            f = y ? k : O;
            v = y ? O : k;
            a: do if ((A | 0) == 1) {
                w = 0;
                c = 0;
                while(1){
                    b = f1(d, c) | 0;
                    if (!w) {
                        if (n(ia(b)) > n(0.0) ? n(ib(b)) > n(0.0) : 0) w = b;
                        else w = 0;
                    } else if (h9(b) | 0) {
                        r = 0;
                        break a;
                    }
                    c = (c + 1) | 0;
                    if (c >>> 0 >= K >>> 0) {
                        r = w;
                        break;
                    }
                }
            } else r = 0;
            while (0)
            q = (r + 500) | 0;
            N = (r + 504) | 0;
            w = 0;
            b = 0;
            a = n(0.0);
            g = 0;
            do {
                c = d4[((d4[Q >> 2] | 0) + (g << 2)) >> 2] | 0;
                if ((d4[(c + 36) >> 2] | 0) == 1) {
                    ic(c);
                    d2[(c + 985) >> 0] = 1;
                    d2[(c + 984) >> 0] = 0;
                } else {
                    hI(c);
                    if (D) hL(c, hY(c, F) | 0, f, v, k);
                    do if ((d4[(c + 24) >> 2] | 0) != 1) {
                        if ((c | 0) == (r | 0)) {
                            d4[q >> 2] = d4[2278];
                            d8[N >> 2] = n(0.0);
                            break;
                        } else {
                            id(d, c, k, L, O, k, O, u, F, V);
                            break;
                        }
                    } else {
                        if (b | 0) d4[(b + 960) >> 2] = c;
                        d4[(c + 960) >> 2] = 0;
                        b = c;
                        w = (w | 0) == 0 ? c : w;
                    }
                    while (0)
                    E = n(d8[(c + 504) >> 2]);
                    a = n(a + n(E + n(hB(c, l, k))));
                }
                g = (g + 1) | 0;
            }while ((g | 0) != (K | 0))
            ac = a > f;
            _ = ae & (((A | 0) == 2) & ac) ? 1 : A;
            X = (aa | 0) == 1;
            ao = X & (D ^ 1);
            aA = (_ | 0) == 1;
            aB = (_ | 0) == 2;
            Y = (976 + (l << 2)) | 0;
            aC = (aa | 2 | 0) == 2;
            aF = X & (ae ^ 1);
            aj = (1040 + (h << 2)) | 0;
            ak = (1040 + (l << 2)) | 0;
            aD = (976 + (h << 2)) | 0;
            aE = (aa | 0) != 1;
            ac = ae & (((A | 0) != 0) & ac);
            az = (d + 976) | 0;
            X = X ^ 1;
            a = f;
            S = 0;
            ad = 0;
            E = n(0.0);
            af = n(0.0);
            while(1){
                b: do if (S >>> 0 < K >>> 0) {
                    N = d4[Q >> 2] | 0;
                    g = 0;
                    G = n(0.0);
                    s = n(0.0);
                    j = n(0.0);
                    f = n(0.0);
                    c = 0;
                    b = 0;
                    r = S;
                    while(1){
                        q = d4[(N + (r << 2)) >> 2] | 0;
                        if ((d4[(q + 36) >> 2] | 0) != 1 ? ((d4[(q + 940) >> 2] = ad), (d4[(q + 24) >> 2] | 0) != 1) : 0) {
                            m = n(hB(q, l, k));
                            o = d4[Y >> 2] | 0;
                            i = n(hK((q + 380 + (o << 3)) | 0, P));
                            z = n(d8[(q + 504) >> 2]);
                            i = n(yx(i, z));
                            i = n(yv(n(hK((q + 364 + (o << 3)) | 0, P)), i));
                            if (ae & ((g | 0) != 0) & (n(m + n(s + i)) > a)) {
                                u = g;
                                m = G;
                                A = r;
                                break b;
                            }
                            m = n(m + i);
                            i = n(s + m);
                            m = n(G + m);
                            if (h9(q) | 0) {
                                j = n(j + n(ia(q)));
                                f = n(f - n(z * n(ib(q))));
                            }
                            if (b | 0) d4[(b + 960) >> 2] = q;
                            d4[(q + 960) >> 2] = 0;
                            g = (g + 1) | 0;
                            b = q;
                            c = (c | 0) == 0 ? q : c;
                        } else {
                            m = G;
                            i = s;
                        }
                        r = (r + 1) | 0;
                        if (r >>> 0 < K >>> 0) {
                            G = m;
                            s = i;
                        } else {
                            u = g;
                            A = r;
                            break;
                        }
                    }
                } else {
                    u = 0;
                    m = n(0.0);
                    j = n(0.0);
                    f = n(0.0);
                    c = 0;
                    A = S;
                }
                while (0)
                o = (j > n(0.0)) & (j < n(1.0));
                R = o ? n(1.0) : j;
                o = (f > n(0.0)) & (f < n(1.0));
                G = o ? n(1.0) : f;
                do if (!aA) {
                    if (!((m < al) & ((fT(al) | 0) ^ 1))) {
                        if (!((m > am) & ((fT(am) | 0) ^ 1))) {
                            if (!(d2[((d4[az >> 2] | 0) + 3) >> 0] | 0)) {
                                if (!(R == n(0.0)) ? !(n(ia(d)) == n(0.0)) : 0) {
                                    o = 53;
                                    break;
                                }
                                a = m;
                                o = 53;
                            } else o = 51;
                        } else {
                            a = am;
                            o = 51;
                        }
                    } else {
                        a = al;
                        o = 51;
                    }
                } else o = 51;
                while (0)
                if ((o | 0) == 51) {
                    o = 0;
                    if (fT(a) | 0) o = 53;
                    else {
                        B = n(a - m);
                        C = a;
                    }
                }
                if ((o | 0) == 53) {
                    o = 0;
                    if (m < n(0.0)) {
                        B = n(-m);
                        C = a;
                    } else {
                        B = n(0.0);
                        C = a;
                    }
                }
                if (!ao ? ((ap = (c | 0) == 0), !ap) : 0) {
                    g = d4[Y >> 2] | 0;
                    r = B < n(0.0);
                    z = n(B / G);
                    q = B > n(0.0);
                    s = n(B / R);
                    j = n(0.0);
                    m = n(0.0);
                    a = n(0.0);
                    b = c;
                    do {
                        i = n(hK((b + 380 + (g << 3)) | 0, P));
                        f = n(hK((b + 364 + (g << 3)) | 0, P));
                        f = n(yx(i, n(yv(f, n(d8[(b + 504) >> 2])))));
                        if (r) {
                            i = n(f * n(ib(b)));
                            if (i != n(-0.0) ? ((e = n(f - n(z * i))), (aq = n(ie(b, l, e, C, k))), e != aq) : 0) {
                                j = n(j - n(aq - f));
                                a = n(a + i);
                            }
                        } else if ((q ? ((an = n(ia(b))), an != n(0.0)) : 0) ? ((e = n(f + n(s * an))), (ar = n(ie(b, l, e, C, k))), e != ar) : 0) {
                            j = n(j - n(ar - f));
                            m = n(m - an);
                        }
                        b = d4[(b + 960) >> 2] | 0;
                    }while ((b | 0) != 0)
                    a = n(G + a);
                    f = n(B + j);
                    if (!ap) {
                        z = n(R + m);
                        r = d4[Y >> 2] | 0;
                        q = f < n(0.0);
                        N = a == n(0.0);
                        s = n(f / a);
                        g = f > n(0.0);
                        z = n(f / z);
                        a = n(0.0);
                        do {
                            e = n(hK((c + 380 + (r << 3)) | 0, P));
                            j = n(hK((c + 364 + (r << 3)) | 0, P));
                            j = n(yx(e, n(yv(j, n(d8[(c + 504) >> 2])))));
                            if (q) {
                                e = n(j * n(ib(c)));
                                f = n(-e);
                                if (e != n(-0.0)) {
                                    e = n(s * f);
                                    f = n(ie(c, l, n(j + (N ? f : e)), C, k));
                                } else f = j;
                            } else if (g ? ((as = n(ia(c))), as != n(0.0)) : 0) f = n(ie(c, l, n(j + n(z * as)), C, k));
                            else f = j;
                            a = n(a - n(f - j));
                            m = n(hB(c, l, k));
                            i = n(hB(c, h, k));
                            f = n(f + m);
                            d8[W >> 2] = f;
                            d4[$ >> 2] = 1;
                            j = n(d8[(c + 396) >> 2]);
                            c: do if (fT(j) | 0) {
                                b = fT(v) | 0;
                                do if (!b) {
                                    if (ac | (hJ(c, h, v) | 0 | X)) break;
                                    if ((ig(d, c) | 0) != 4) break;
                                    if ((d4[((ih(c, h) | 0) + 4) >> 2] | 0) == 3) break;
                                    if ((d4[((ii(c, h) | 0) + 4) >> 2] | 0) == 3) break;
                                    d8[H >> 2] = v;
                                    d4[T >> 2] = 1;
                                    break c;
                                }
                                while (0)
                                if (hJ(c, h, v) | 0) {
                                    b = d4[(c + 992 + (d4[aD >> 2] << 2)) >> 2] | 0;
                                    e = n(i + n(hK(b, v)));
                                    d8[H >> 2] = e;
                                    b = aE & ((d4[(b + 4) >> 2] | 0) == 2);
                                    d4[T >> 2] = ((fT(e) | 0 | b) ^ 1) & 1;
                                    break;
                                } else {
                                    d8[H >> 2] = v;
                                    d4[T >> 2] = b ? 0 : 2;
                                    break;
                                }
                            } else {
                                e = n(f - m);
                                R = n(e / j);
                                e = n(j * e);
                                d4[T >> 2] = 1;
                                d8[H >> 2] = n(i + (y ? R : e));
                            }
                            while (0)
                            ij(c, l, C, k, $, W);
                            ij(c, h, v, k, T, H);
                            do if (!(hJ(c, h, v) | 0) ? (ig(d, c) | 0) == 4 : 0) {
                                if ((d4[((ih(c, h) | 0) + 4) >> 2] | 0) == 3) {
                                    b = 0;
                                    break;
                                }
                                b = (d4[((ii(c, h) | 0) + 4) >> 2] | 0) != 3;
                            } else b = 0;
                            while (0)
                            e = n(d8[W >> 2]);
                            R = n(d8[H >> 2]);
                            U = d4[$ >> 2] | 0;
                            t = d4[T >> 2] | 0;
                            hA(c, y ? e : R, y ? R : e, F, y ? U : t, y ? t : U, k, O, D & (b ^ 1), 3488, V) | 0;
                            d2[Z >> 0] = d2[Z >> 0] | d2[(c + 508) >> 0];
                            c = d4[(c + 960) >> 2] | 0;
                        }while ((c | 0) != 0)
                    } else a = n(0.0);
                } else a = n(0.0);
                a = n(B + a);
                t = (a < n(0.0)) & 1;
                d2[Z >> 0] = t | d5[Z >> 0];
                if (aB & (a > n(0.0))) {
                    b = d4[Y >> 2] | 0;
                    if ((d4[(d + 364 + (b << 3) + 4) >> 2] | 0) != 0 ? ((I = n(hK((d + 364 + (b << 3)) | 0, P))), I >= n(0.0)) : 0) f = n(yv(n(0.0), n(I - n(C - a))));
                    else f = n(0.0);
                } else f = a;
                q = S >>> 0 < A >>> 0;
                if (q) {
                    r = d4[Q >> 2] | 0;
                    g = S;
                    b = 0;
                    do {
                        c = d4[(r + (g << 2)) >> 2] | 0;
                        if (!(d4[(c + 24) >> 2] | 0)) {
                            b = ((((d4[((ih(c, l) | 0) + 4) >> 2] | 0) == 3) & 1) + b) | 0;
                            b = (b + (((d4[((ii(c, l) | 0) + 4) >> 2] | 0) == 3) & 1)) | 0;
                        }
                        g = (g + 1) | 0;
                    }while ((g | 0) != (A | 0))
                    if (b) {
                        m = n(0.0);
                        i = n(0.0);
                    } else o = 101;
                } else o = 101;
                d: do if ((o | 0) == 101) {
                    o = 0;
                    switch(aG | 0){
                        case 1:
                            {
                                b = 0;
                                m = n(f * n(0.5));
                                i = n(0.0);
                                break d;
                            }
                        case 2:
                            {
                                b = 0;
                                m = f;
                                i = n(0.0);
                                break d;
                            }
                        case 3:
                            {
                                if (u >>> 0 <= 1) {
                                    b = 0;
                                    m = n(0.0);
                                    i = n(0.0);
                                    break d;
                                }
                                i = n(((u + -1) | 0) >>> 0);
                                b = 0;
                                m = n(0.0);
                                i = n(n(yv(f, n(0.0))) / i);
                                break d;
                            }
                        case 5:
                            {
                                i = n(f / n(((u + 1) | 0) >>> 0));
                                b = 0;
                                m = i;
                                break d;
                            }
                        case 4:
                            {
                                i = n(f / n(u >>> 0));
                                b = 0;
                                m = n(i * n(0.5));
                                break d;
                            }
                        default:
                            {
                                b = 0;
                                m = n(0.0);
                                i = n(0.0);
                                break d;
                            }
                    }
                }
                while (0)
                a = n(aH + m);
                if (q) {
                    j = n(f / n(b | 0));
                    g = d4[Q >> 2] | 0;
                    c = S;
                    f = n(0.0);
                    do {
                        b = d4[(g + (c << 2)) >> 2] | 0;
                        e: do if ((d4[(b + 36) >> 2] | 0) != 1) {
                            switch(d4[(b + 24) >> 2] | 0){
                                case 1:
                                    {
                                        if (ik(b, l) | 0) {
                                            if (!D) break e;
                                            e = n(il(b, l, C));
                                            e = n(e + n(h$(d, l)));
                                            e = n(e + n(hU(b, l, k)));
                                            d8[(b + 400 + (d4[ak >> 2] << 2)) >> 2] = e;
                                            break e;
                                        }
                                        break;
                                    }
                                case 0:
                                    {
                                        t = (d4[((ih(b, l) | 0) + 4) >> 2] | 0) == 3;
                                        e = n(j + a);
                                        a = t ? e : a;
                                        if (D) {
                                            t = (b + 400 + (d4[ak >> 2] << 2)) | 0;
                                            d8[t >> 2] = n(a + n(d8[t >> 2]));
                                        }
                                        t = (d4[((ii(b, l) | 0) + 4) >> 2] | 0) == 3;
                                        e = n(j + a);
                                        a = t ? e : a;
                                        if (ao) {
                                            e = n(i + n(hB(b, l, k)));
                                            f = v;
                                            a = n(a + n(e + n(d8[(b + 504) >> 2])));
                                            break e;
                                        } else {
                                            a = n(a + n(i + n(im(b, l, k))));
                                            f = n(yv(f, n(im(b, h, k))));
                                            break e;
                                        }
                                    }
                                default:
                                    {}
                            }
                            if (D) {
                                e = n(m + n(h$(d, l)));
                                t = (b + 400 + (d4[ak >> 2] << 2)) | 0;
                                d8[t >> 2] = n(e + n(d8[t >> 2]));
                            }
                        }
                        while (0)
                        c = (c + 1) | 0;
                    }while ((c | 0) != (A | 0))
                } else f = n(0.0);
                i = n(aI + a);
                if (aC) m = n(n(ie(d, h, n(J + f), ai, p)) - J);
                else m = v;
                j = n(n(ie(d, h, n(J + (aF ? v : f)), ai, p)) - J);
                if (q & D) {
                    c = S;
                    do {
                        g = d4[((d4[Q >> 2] | 0) + (c << 2)) >> 2] | 0;
                        do if ((d4[(g + 36) >> 2] | 0) != 1) {
                            if ((d4[(g + 24) >> 2] | 0) == 1) {
                                if (ik(g, h) | 0) {
                                    e = n(il(g, h, v));
                                    e = n(e + n(h$(d, h)));
                                    e = n(e + n(hU(g, h, k)));
                                    b = d4[aj >> 2] | 0;
                                    d8[(g + 400 + (b << 2)) >> 2] = e;
                                    if (!(fT(e) | 0)) break;
                                } else b = d4[aj >> 2] | 0;
                                e = n(h$(d, h));
                                d8[(g + 400 + (b << 2)) >> 2] = n(e + n(hU(g, h, k)));
                                break;
                            }
                            b = ig(d, g) | 0;
                            do if ((b | 0) == 4) {
                                if ((d4[((ih(g, h) | 0) + 4) >> 2] | 0) == 3) {
                                    o = 139;
                                    break;
                                }
                                if ((d4[((ii(g, h) | 0) + 4) >> 2] | 0) == 3) {
                                    o = 139;
                                    break;
                                }
                                if (hJ(g, h, v) | 0) {
                                    a = x;
                                    break;
                                }
                                U = d4[(g + 908 + (d4[Y >> 2] << 2)) >> 2] | 0;
                                d4[H >> 2] = U;
                                a = n(d8[(g + 396) >> 2]);
                                t = fT(a) | 0;
                                f = ((d4[eb >> 2] = U), n(d8[eb >> 2]));
                                if (t) a = j;
                                else {
                                    B = n(hB(g, h, k));
                                    e = n(f / a);
                                    a = n(a * f);
                                    a = n(B + (y ? e : a));
                                }
                                d8[W >> 2] = a;
                                d8[H >> 2] = n(n(hB(g, l, k)) + f);
                                d4[T >> 2] = 1;
                                d4[$ >> 2] = 1;
                                ij(g, l, C, k, T, H);
                                ij(g, h, v, k, $, W);
                                a = n(d8[H >> 2]);
                                B = n(d8[W >> 2]);
                                e = y ? a : B;
                                a = y ? B : a;
                                t = ((fT(e) | 0) ^ 1) & 1;
                                hA(g, e, a, F, t, ((fT(a) | 0) ^ 1) & 1, k, O, 1, 3493, V) | 0;
                                a = x;
                            } else o = 139;
                            while (0)
                            f: do if ((o | 0) == 139) {
                                o = 0;
                                a = n(m - n(im(g, h, k)));
                                do if ((d4[((ih(g, h) | 0) + 4) >> 2] | 0) == 3) {
                                    if ((d4[((ii(g, h) | 0) + 4) >> 2] | 0) != 3) break;
                                    a = n(x + n(yv(n(0.0), n(a * n(0.5)))));
                                    break f;
                                }
                                while (0)
                                if ((d4[((ii(g, h) | 0) + 4) >> 2] | 0) == 3) {
                                    a = x;
                                    break;
                                }
                                if ((d4[((ih(g, h) | 0) + 4) >> 2] | 0) == 3) {
                                    a = n(x + n(yv(n(0.0), a)));
                                    break;
                                }
                                switch(b | 0){
                                    case 1:
                                        {
                                            a = x;
                                            break f;
                                        }
                                    case 2:
                                        {
                                            a = n(x + n(a * n(0.5)));
                                            break f;
                                        }
                                    default:
                                        {
                                            a = n(x + a);
                                            break f;
                                        }
                                }
                            }
                            while (0)
                            e = n(E + a);
                            t = (g + 400 + (d4[aj >> 2] << 2)) | 0;
                            d8[t >> 2] = n(e + n(d8[t >> 2]));
                        }
                        while (0)
                        c = (c + 1) | 0;
                    }while ((c | 0) != (A | 0))
                }
                E = n(E + j);
                af = n(yv(af, i));
                u = (ad + 1) | 0;
                if (A >>> 0 >= K >>> 0) break;
                else {
                    a = C;
                    S = A;
                    ad = u;
                }
            }
            do if (D) {
                b = u >>> 0 > 1;
                if (!b ? !(io(d) | 0) : 0) break;
                if (!(fT(v) | 0)) {
                    a = n(v - E);
                    g: do switch(d4[(d + 12) >> 2] | 0){
                        case 3:
                            {
                                x = n(x + a);
                                s = n(0.0);
                                break;
                            }
                        case 2:
                            {
                                x = n(x + n(a * n(0.5)));
                                s = n(0.0);
                                break;
                            }
                        case 4:
                            {
                                if (v > E) s = n(a / n(u >>> 0));
                                else s = n(0.0);
                                break;
                            }
                        case 7:
                            if (v > E) {
                                x = n(x + n(a / n((u << 1) >>> 0)));
                                s = n(a / n(u >>> 0));
                                s = b ? s : n(0.0);
                                break g;
                            } else {
                                x = n(x + n(a * n(0.5)));
                                s = n(0.0);
                                break g;
                            }
                        case 6:
                            {
                                s = n(a / n(ad >>> 0));
                                s = (v > E) & b ? s : n(0.0);
                                break;
                            }
                        default:
                            s = n(0.0);
                    }
                    while (0)
                    if (u | 0) {
                        q = (1040 + (h << 2)) | 0;
                        N = (976 + (h << 2)) | 0;
                        r = 0;
                        c = 0;
                        while(1){
                            h: do if (c >>> 0 < K >>> 0) {
                                f = n(0.0);
                                j = n(0.0);
                                a = n(0.0);
                                g = c;
                                while(1){
                                    b = d4[((d4[Q >> 2] | 0) + (g << 2)) >> 2] | 0;
                                    do if ((d4[(b + 36) >> 2] | 0) != 1 ? (d4[(b + 24) >> 2] | 0) == 0 : 0) {
                                        if ((d4[(b + 940) >> 2] | 0) != (r | 0)) break h;
                                        if (ip(b, h) | 0) {
                                            e = n(d8[(b + 908 + (d4[N >> 2] << 2)) >> 2]);
                                            a = n(yv(a, n(e + n(hB(b, h, k)))));
                                        }
                                        if ((ig(d, b) | 0) != 5) break;
                                        I = n(iq(b));
                                        I = n(I + n(hU(b, 0, k)));
                                        e = n(d8[(b + 912) >> 2]);
                                        e = n(n(e + n(hB(b, 0, k))) - I);
                                        I = n(yv(j, I));
                                        e = n(yv(f, e));
                                        f = e;
                                        j = I;
                                        a = n(yv(a, n(I + e)));
                                    }
                                    while (0)
                                    b = (g + 1) | 0;
                                    if (b >>> 0 < K >>> 0) g = b;
                                    else {
                                        g = b;
                                        break;
                                    }
                                }
                            } else {
                                j = n(0.0);
                                a = n(0.0);
                                g = c;
                            }
                            while (0)
                            z = n(s + a);
                            i = x;
                            x = n(x + z);
                            if (c >>> 0 < g >>> 0) {
                                m = n(i + j);
                                b = c;
                                do {
                                    c = d4[((d4[Q >> 2] | 0) + (b << 2)) >> 2] | 0;
                                    i: do if ((d4[(c + 36) >> 2] | 0) != 1 ? (d4[(c + 24) >> 2] | 0) == 0 : 0) switch(ig(d, c) | 0){
                                        case 1:
                                            {
                                                e = n(i + n(hU(c, h, k)));
                                                d8[(c + 400 + (d4[q >> 2] << 2)) >> 2] = e;
                                                break i;
                                            }
                                        case 3:
                                            {
                                                e = n(n(x - n(hV(c, h, k))) - n(d8[(c + 908 + (d4[N >> 2] << 2)) >> 2]));
                                                d8[(c + 400 + (d4[q >> 2] << 2)) >> 2] = e;
                                                break i;
                                            }
                                        case 2:
                                            {
                                                e = n(i + n(n(z - n(d8[(c + 908 + (d4[N >> 2] << 2)) >> 2])) * n(0.5)));
                                                d8[(c + 400 + (d4[q >> 2] << 2)) >> 2] = e;
                                                break i;
                                            }
                                        case 4:
                                            {
                                                e = n(i + n(hU(c, h, k)));
                                                d8[(c + 400 + (d4[q >> 2] << 2)) >> 2] = e;
                                                if (hJ(c, h, v) | 0) break i;
                                                if (y) {
                                                    f = n(d8[(c + 908) >> 2]);
                                                    a = n(f + n(hB(c, l, k)));
                                                    j = z;
                                                } else {
                                                    j = n(d8[(c + 912) >> 2]);
                                                    j = n(j + n(hB(c, h, k)));
                                                    a = z;
                                                    f = n(d8[(c + 908) >> 2]);
                                                }
                                                if (hs(a, f) | 0 ? hs(j, n(d8[(c + 912) >> 2])) | 0 : 0) break i;
                                                hA(c, a, j, F, 1, 1, k, O, 1, 3501, V) | 0;
                                                break i;
                                            }
                                        case 5:
                                            {
                                                d8[(c + 404) >> 2] = n(n(m - n(iq(c))) + n(il(c, 0, v)));
                                                break i;
                                            }
                                        default:
                                            break i;
                                    }
                                    while (0)
                                    b = (b + 1) | 0;
                                }while ((b | 0) != (g | 0))
                            }
                            r = (r + 1) | 0;
                            if ((r | 0) == (u | 0)) break;
                            else c = g;
                        }
                    }
                }
            }
            while (0)
            d8[(d + 908) >> 2] = n(ie(d, 2, ag, p, p));
            d8[(d + 912) >> 2] = n(ie(d, 0, at, M, p));
            if ((_ | 0) != 0 ? ((au = d4[(d + 32) >> 2] | 0), (av = (_ | 0) == 2), !(av & ((au | 0) != 2))) : 0) {
                if (av & ((au | 0) == 2)) {
                    a = n(ah + C);
                    a = n(yv(n(yx(a, n(ir(d, l, af, P)))), ah));
                    o = 198;
                }
            } else {
                a = n(ie(d, l, af, P, p));
                o = 198;
            }
            if ((o | 0) == 198) d8[(d + 908 + (d4[(976 + (l << 2)) >> 2] << 2)) >> 2] = a;
            if ((aa | 0) != 0 ? ((ax = d4[(d + 32) >> 2] | 0), (ay = (aa | 0) == 2), !(ay & ((ax | 0) != 2))) : 0) {
                if (ay & ((ax | 0) == 2)) {
                    a = n(J + v);
                    a = n(yv(n(yx(a, n(ir(d, h, n(J + E), ai)))), J));
                    o = 204;
                }
            } else {
                a = n(ie(d, h, n(J + E), ai, p));
                o = 204;
            }
            if ((o | 0) == 204) d8[(d + 908 + (d4[(976 + (h << 2)) >> 2] << 2)) >> 2] = a;
            if (D) {
                if ((d4[aw >> 2] | 0) == 2) {
                    c = (976 + (h << 2)) | 0;
                    g = (1040 + (h << 2)) | 0;
                    b = 0;
                    do {
                        r = f1(d, b) | 0;
                        if (!(d4[(r + 24) >> 2] | 0)) {
                            U = d4[c >> 2] | 0;
                            e = n(d8[(d + 908 + (U << 2)) >> 2]);
                            t = (r + 400 + (d4[g >> 2] << 2)) | 0;
                            e = n(e - n(d8[t >> 2]));
                            d8[t >> 2] = n(e - n(d8[(r + 908 + (U << 2)) >> 2]));
                        }
                        b = (b + 1) | 0;
                    }while ((b | 0) != (K | 0))
                }
                if (w | 0) {
                    b = y ? _ : L;
                    do {
                        is(d, w, k, b, O, F, V);
                        w = d4[(w + 960) >> 2] | 0;
                    }while ((w | 0) != 0)
                }
                b = (l | 2 | 0) == 3;
                c = (h | 2 | 0) == 3;
                if (b | c) {
                    w = 0;
                    do {
                        g = d4[((d4[Q >> 2] | 0) + (w << 2)) >> 2] | 0;
                        if ((d4[(g + 36) >> 2] | 0) != 1) {
                            if (b) it(d, g, l);
                            if (c) it(d, g, h);
                        }
                        w = (w + 1) | 0;
                    }while ((w | 0) != (K | 0))
                }
            }
        } else h2(d, a, i, L, u, p, M);
        while (0)
        ed = ab;
        return;
    }
    function hG(b, a) {
        b = b | 0;
        a = n(a);
        var c = 0;
        fW(b, a >= n(0.0), 3147);
        c = a == n(0.0);
        d8[(b + 4) >> 2] = c ? n(0.0) : a;
        return;
    }
    function hH(a, b, c, h) {
        a = a | 0;
        b = n(b);
        c = n(c);
        h = h | 0;
        var d = fR, e = fR, i = 0, f = 0, g = 0;
        d4[2278] = (d4[2278] | 0) + 1;
        hI(a);
        if (!(hJ(a, 2, b) | 0)) {
            d = n(hK((a + 380) | 0, b));
            if (!(d >= n(0.0))) {
                g = ((fT(b) | 0) ^ 1) & 1;
                d = b;
            } else g = 2;
        } else {
            d = n(hK(d4[(a + 992) >> 2] | 0, b));
            g = 1;
            d = n(d + n(hB(a, 2, b)));
        }
        if (!(hJ(a, 0, c) | 0)) {
            e = n(hK((a + 388) | 0, c));
            if (!(e >= n(0.0))) {
                f = ((fT(c) | 0) ^ 1) & 1;
                e = c;
            } else f = 2;
        } else {
            e = n(hK(d4[(a + 996) >> 2] | 0, c));
            f = 1;
            e = n(e + n(hB(a, 0, b)));
        }
        i = (a + 976) | 0;
        if (hA(a, d, e, h, g, f, b, c, 1, 3189, d4[i >> 2] | 0) | 0 ? (hL(a, d4[(a + 496) >> 2] | 0, b, c, b), hM(a, n(d8[((d4[i >> 2] | 0) + 4) >> 2]), n(0.0), n(0.0)), d2[11696] | 0) : 0) ht(a, 7);
        return;
    }
    function hI(b) {
        b = b | 0;
        var f = 0, a = 0, g = 0, h = 0, i = 0, j = 0, c = 0, d = 0, k = 0, e = 0;
        c = ed;
        ed = (ed + 32) | 0;
        j = (c + 24) | 0;
        i = (c + 16) | 0;
        g = (c + 8) | 0;
        h = c;
        a = 0;
        do {
            f = (b + 380 + (a << 3)) | 0;
            if (!((d4[(b + 380 + (a << 3) + 4) >> 2] | 0) != 0 ? ((d = f), (k = d4[(d + 4) >> 2] | 0), (e = g), (d4[e >> 2] = d4[d >> 2]), (d4[(e + 4) >> 2] = k), (e = (b + 364 + (a << 3)) | 0), (k = d4[(e + 4) >> 2] | 0), (d = h), (d4[d >> 2] = d4[e >> 2]), (d4[(d + 4) >> 2] = k), (d4[i >> 2] = d4[g >> 2]), (d4[(i + 4) >> 2] = d4[(g + 4) >> 2]), (d4[j >> 2] = d4[h >> 2]), (d4[(j + 4) >> 2] = d4[(h + 4) >> 2]), hr(i, j) | 0) : 0)) f = (b + 348 + (a << 3)) | 0;
            d4[(b + 992 + (a << 2)) >> 2] = f;
            a = (a + 1) | 0;
        }while ((a | 0) != 2)
        ed = c;
        return;
    }
    function hJ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        var d = 0;
        a = d4[(a + 992 + (d4[(976 + (b << 2)) >> 2] << 2)) >> 2] | 0;
        switch(d4[(a + 4) >> 2] | 0){
            case 0:
            case 3:
                {
                    a = 0;
                    break;
                }
            case 1:
                {
                    if (n(d8[a >> 2]) < n(0.0)) a = 0;
                    else d = 5;
                    break;
                }
            case 2:
                {
                    if (n(d8[a >> 2]) < n(0.0)) a = 0;
                    else a = (fT(c) | 0) ^ 1;
                    break;
                }
            default:
                d = 5;
        }
        if ((d | 0) == 5) a = 1;
        return a | 0;
    }
    function hK(b, a) {
        b = b | 0;
        a = n(a);
        switch(d4[(b + 4) >> 2] | 0){
            case 2:
                {
                    a = n(n(n(d8[b >> 2]) * a) / n(100.0));
                    break;
                }
            case 1:
                {
                    a = n(d8[b >> 2]);
                    break;
                }
            default:
                a = n(el);
        }
        return n(a);
    }
    function hL(a, b, c, f, d) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        f = n(f);
        d = n(d);
        var e = 0, g = fR;
        b = d4[(a + 944) >> 2] | 0 ? b : 1;
        e = hZ(d4[(a + 4) >> 2] | 0, b) | 0;
        b = h5(e, b) | 0;
        c = n(iz(a, e, c));
        f = n(iz(a, b, f));
        g = n(c + n(hU(a, e, d)));
        d8[(a + 400 + (d4[(1040 + (e << 2)) >> 2] << 2)) >> 2] = g;
        c = n(c + n(hV(a, e, d)));
        d8[(a + 400 + (d4[(1e3 + (e << 2)) >> 2] << 2)) >> 2] = c;
        c = n(f + n(hU(a, b, d)));
        d8[(a + 400 + (d4[(1040 + (b << 2)) >> 2] << 2)) >> 2] = c;
        d = n(f + n(hV(a, b, d)));
        d8[(a + 400 + (d4[(1e3 + (b << 2)) >> 2] << 2)) >> 2] = d;
        return;
    }
    function hM(c, a, e, h) {
        c = c | 0;
        a = n(a);
        e = n(e);
        h = n(h);
        var b = 0, d = 0, k = fR, q = fR, f = 0, l = 0, i = fR, m = 0, j = fR, o = fR, p = fR, g = fR;
        if (!(a == n(0.0))) {
            b = (c + 400) | 0;
            g = n(d8[b >> 2]);
            d = (c + 404) | 0;
            p = n(d8[d >> 2]);
            m = (c + 416) | 0;
            o = n(d8[m >> 2]);
            l = (c + 420) | 0;
            k = n(d8[l >> 2]);
            j = n(g + e);
            i = n(p + h);
            h = n(j + o);
            q = n(i + k);
            f = (d4[(c + 988) >> 2] | 0) == 1;
            d8[b >> 2] = n(hv(g, a, 0, f));
            d8[d >> 2] = n(hv(p, a, 0, f));
            e = n(yz(n(o * a), n(1.0)));
            if (hs(e, n(0.0)) | 0) d = 0;
            else d = (hs(e, n(1.0)) | 0) ^ 1;
            e = n(yz(n(k * a), n(1.0)));
            if (hs(e, n(0.0)) | 0) b = 0;
            else b = (hs(e, n(1.0)) | 0) ^ 1;
            g = n(hv(h, a, f & d, f & (d ^ 1)));
            d8[m >> 2] = n(g - n(hv(j, a, 0, f)));
            g = n(hv(q, a, f & b, f & (b ^ 1)));
            d8[l >> 2] = n(g - n(hv(i, a, 0, f)));
            d = ((d4[(c + 952) >> 2] | 0) - (d4[(c + 948) >> 2] | 0)) >> 2;
            if (d | 0) {
                b = 0;
                do {
                    hM(f1(c, b) | 0, a, j, i);
                    b = (b + 1) | 0;
                }while ((b | 0) != (d | 0))
            }
        }
        return;
    }
    function w(a, e, d, b, c) {
        a = a | 0;
        e = e | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        switch(d | 0){
            case 5:
            case 0:
                {
                    a = x3(d4[489] | 0, b, c) | 0;
                    break;
                }
            default:
                a = yB(b, c) | 0;
        }
        return a | 0;
    }
    function hN(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, f = 0;
        e = ed;
        ed = (ed + 16) | 0;
        f = e;
        d4[f >> 2] = d;
        hO(a, 0, b, c, f);
        ed = e;
        return;
    }
    function hO(a, c, b, d, e) {
        a = a | 0;
        c = c | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        a = a | 0 ? a : 956;
        y4[d4[(a + 8) >> 2] & 1](a, c, b, d, e) | 0;
        if ((b | 0) == 5) fA();
        else return;
    }
    function hP(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d2[(a + b) >> 0] = c & 1;
        return;
    }
    function hQ(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, c = 0;
        d4[a >> 2] = 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        d = (b + 4) | 0;
        c = ((d4[d >> 2] | 0) - (d4[b >> 2] | 0)) >> 2;
        if (c | 0) {
            hR(a, c);
            hS(a, d4[b >> 2] | 0, d4[d >> 2] | 0, c);
        }
        return;
    }
    function hR(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        if ((hT(a) | 0) >>> 0 < b >>> 0) yC(a);
        if (b >>> 0 > 1073741823) fA();
        else {
            c = yH(b << 2) | 0;
            d4[(a + 4) >> 2] = c;
            d4[a >> 2] = c;
            d4[(a + 8) >> 2] = c + (b << 2);
            return;
        }
    }
    function hS(a, c, d, b) {
        a = a | 0;
        c = c | 0;
        d = d | 0;
        b = b | 0;
        b = (a + 4) | 0;
        a = (d - c) | 0;
        if ((a | 0) > 0) {
            dh(d4[b >> 2] | 0, c | 0, a | 0) | 0;
            d4[b >> 2] = (d4[b >> 2] | 0) + ((a >>> 2) << 2);
        }
        return;
    }
    function hT(a) {
        a = a | 0;
        return 1073741823;
    }
    function hU(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        if (hW(b) | 0 ? (d4[(a + 96) >> 2] | 0) != 0 : 0) a = (a + 92) | 0;
        else a = fU((a + 60) | 0, d4[(1040 + (b << 2)) >> 2] | 0, 992) | 0;
        return n(hX(a, c));
    }
    function hV(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        if (hW(b) | 0 ? (d4[(a + 104) >> 2] | 0) != 0 : 0) a = (a + 100) | 0;
        else a = fU((a + 60) | 0, d4[(1e3 + (b << 2)) >> 2] | 0, 992) | 0;
        return n(hX(a, c));
    }
    function hW(a) {
        a = a | 0;
        return ((a | 1 | 0) == 3) | 0;
    }
    function hX(b, a) {
        b = b | 0;
        a = n(a);
        if ((d4[(b + 4) >> 2] | 0) == 3) a = n(0.0);
        else a = n(hK(b, a));
        return n(a);
    }
    function hY(a, b) {
        a = a | 0;
        b = b | 0;
        a = d4[a >> 2] | 0;
        return ((a | 0) == 0 ? ((b | 0) > 1 ? b : 1) : a) | 0;
    }
    function hZ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        a: do if ((b | 0) == 2) {
            switch(a | 0){
                case 2:
                    {
                        a = 3;
                        break a;
                    }
                case 3:
                    break;
                default:
                    {
                        c = 4;
                        break a;
                    }
            }
            a = 2;
        } else c = 4;
        while (0)
        return a | 0;
    }
    function h$(a, b) {
        a = a | 0;
        b = b | 0;
        var c = fR;
        if (!((hW(b) | 0 ? (d4[(a + 312) >> 2] | 0) != 0 : 0) ? ((c = n(d8[(a + 308) >> 2])), c >= n(0.0)) : 0)) c = n(yv(n(d8[(fU((a + 276) | 0, d4[(1040 + (b << 2)) >> 2] | 0, 992) | 0) >> 2]), n(0.0)));
        return n(c);
    }
    function h_(a, b) {
        a = a | 0;
        b = b | 0;
        var c = fR;
        if (!((hW(b) | 0 ? (d4[(a + 320) >> 2] | 0) != 0 : 0) ? ((c = n(d8[(a + 316) >> 2])), c >= n(0.0)) : 0)) c = n(yv(n(d8[(fU((a + 276) | 0, d4[(1e3 + (b << 2)) >> 2] | 0, 992) | 0) >> 2]), n(0.0)));
        return n(c);
    }
    function h0(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        var d = fR;
        if (!((hW(b) | 0 ? (d4[(a + 240) >> 2] | 0) != 0 : 0) ? ((d = n(hK((a + 236) | 0, c))), d >= n(0.0)) : 0)) d = n(yv(n(hK(fU((a + 204) | 0, d4[(1040 + (b << 2)) >> 2] | 0, 992) | 0, c)), n(0.0)));
        return n(d);
    }
    function h1(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        var d = fR;
        if (!((hW(b) | 0 ? (d4[(a + 248) >> 2] | 0) != 0 : 0) ? ((d = n(hK((a + 244) | 0, c))), d >= n(0.0)) : 0)) d = n(yv(n(hK(fU((a + 204) | 0, d4[(1e3 + (b << 2)) >> 2] | 0, 992) | 0, c)), n(0.0)));
        return n(d);
    }
    function h2(a, b, d, f, g, c, i) {
        a = a | 0;
        b = n(b);
        d = n(d);
        f = f | 0;
        g = g | 0;
        c = n(c);
        i = n(i);
        var m = fR, o = fR, j = fR, k = fR, h = fR, e = fR, l = 0, p = 0, q = 0;
        q = ed;
        ed = (ed + 16) | 0;
        l = q;
        p = (a + 964) | 0;
        f5(a, (d4[p >> 2] | 0) != 0, 3519);
        m = n(h8(a, 2, b));
        o = n(h8(a, 0, b));
        j = n(hB(a, 2, b));
        k = n(hB(a, 0, b));
        if (fT(b) | 0) h = b;
        else h = n(yv(n(0.0), n(n(b - j) - m)));
        if (fT(d) | 0) e = d;
        else e = n(yv(n(0.0), n(n(d - k) - o)));
        if (((f | 0) == 1) & ((g | 0) == 1)) {
            d8[(a + 908) >> 2] = n(ie(a, 2, n(b - j), c, c));
            b = n(ie(a, 0, n(d - k), i, c));
        } else {
            y6[d4[p >> 2] & 1](l, a, h, f, e, g);
            h = n(m + n(d8[l >> 2]));
            e = n(b - j);
            d8[(a + 908) >> 2] = n(ie(a, 2, (f | 2 | 0) == 2 ? h : e, c, c));
            e = n(o + n(d8[(l + 4) >> 2]));
            b = n(d - k);
            b = n(ie(a, 0, (g | 2 | 0) == 2 ? e : b, i, c));
        }
        d8[(a + 912) >> 2] = b;
        ed = q;
        return;
    }
    function h3(a, c, d, e, f, b, g) {
        a = a | 0;
        c = n(c);
        d = n(d);
        e = e | 0;
        f = f | 0;
        b = n(b);
        g = n(g);
        var h = fR, i = fR, j = fR, k = fR;
        j = n(h8(a, 2, b));
        h = n(h8(a, 0, b));
        k = n(hB(a, 2, b));
        i = n(hB(a, 0, b));
        c = n(c - k);
        d8[(a + 908) >> 2] = n(ie(a, 2, (e | 2 | 0) == 2 ? j : c, b, b));
        d = n(d - i);
        d8[(a + 912) >> 2] = n(ie(a, 0, (f | 2 | 0) == 2 ? h : d, g, b));
        return;
    }
    function h4(a, b, e, g, f, c, h) {
        a = a | 0;
        b = n(b);
        e = n(e);
        g = g | 0;
        f = f | 0;
        c = n(c);
        h = n(h);
        var d = 0, i = fR, j = fR;
        d = (g | 0) == 2;
        if ((!((b <= n(0.0)) & d) ? !((e <= n(0.0)) & ((f | 0) == 2)) : 0) ? !(((g | 0) == 1) & ((f | 0) == 1)) : 0) a = 0;
        else {
            i = n(hB(a, 0, c));
            j = n(hB(a, 2, c));
            d = ((b < n(0.0)) & d) | (fT(b) | 0);
            b = n(b - j);
            d8[(a + 908) >> 2] = n(ie(a, 2, d ? n(0.0) : b, c, c));
            b = n(e - i);
            d = ((e < n(0.0)) & ((f | 0) == 2)) | (fT(e) | 0);
            d8[(a + 912) >> 2] = n(ie(a, 0, d ? n(0.0) : b, h, c));
            a = 1;
        }
        return a | 0;
    }
    function h5(a, b) {
        a = a | 0;
        b = b | 0;
        if (iu(a) | 0) a = hZ(2, b) | 0;
        else a = 0;
        return a | 0;
    }
    function h6(b, c, a) {
        b = b | 0;
        c = c | 0;
        a = n(a);
        a = n(h0(b, c, a));
        return n(a + n(h$(b, c)));
    }
    function h7(b, c, a) {
        b = b | 0;
        c = c | 0;
        a = n(a);
        a = n(h1(b, c, a));
        return n(a + n(h_(b, c)));
    }
    function h8(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        var d = fR;
        d = n(h6(a, b, c));
        return n(d + n(h7(a, b, c)));
    }
    function h9(a) {
        a = a | 0;
        if (!(d4[(a + 24) >> 2] | 0)) {
            if (n(ia(a)) != n(0.0)) a = 1;
            else a = n(ib(a)) != n(0.0);
        } else a = 0;
        return a | 0;
    }
    function ia(b) {
        b = b | 0;
        var a = fR;
        if (d4[(b + 944) >> 2] | 0) {
            a = n(d8[(b + 44) >> 2]);
            if (fT(a) | 0) {
                a = n(d8[(b + 40) >> 2]);
                b = (a > n(0.0)) & ((fT(a) | 0) ^ 1);
                return n(b ? a : n(0.0));
            }
        } else a = n(0.0);
        return n(a);
    }
    function ib(a) {
        a = a | 0;
        var b = fR, d = 0, c = fR;
        do if (d4[(a + 944) >> 2] | 0) {
            b = n(d8[(a + 48) >> 2]);
            if (fT(b) | 0) {
                d = d2[((d4[(a + 976) >> 2] | 0) + 2) >> 0] | 0;
                if ((d << 24) >> 24 == 0 ? ((c = n(d8[(a + 40) >> 2])), (c < n(0.0)) & ((fT(c) | 0) ^ 1)) : 0) {
                    b = n(-c);
                    break;
                }
                b = (d << 24) >> 24 ? n(1.0) : n(0.0);
            }
        } else b = n(0.0);
        while (0)
        return n(b);
    }
    function ic(a) {
        a = a | 0;
        var c = 0, b = 0;
        de((a + 400) | 0, 0, 540) | 0;
        d2[(a + 985) >> 0] = 1;
        gc(a);
        b = f0(a) | 0;
        if (b | 0) {
            c = (a + 948) | 0;
            a = 0;
            do {
                ic(d4[((d4[c >> 2] | 0) + (a << 2)) >> 2] | 0);
                a = (a + 1) | 0;
            }while ((a | 0) != (b | 0))
        }
        return;
    }
    function id(s, a, d, B, e, b, c, C, v, D) {
        s = s | 0;
        a = a | 0;
        d = n(d);
        B = B | 0;
        e = n(e);
        b = n(b);
        c = n(c);
        C = C | 0;
        v = v | 0;
        D = D | 0;
        var f = 0, h = fR, g = 0, i = 0, p = fR, q = fR, w = 0, x = fR, t = 0, y = fR, o = 0, z = 0, j = 0, k = 0, l = 0, m = 0, A = 0, u = 0, r = 0, E = 0;
        r = ed;
        ed = (ed + 16) | 0;
        j = (r + 12) | 0;
        k = (r + 8) | 0;
        l = (r + 4) | 0;
        m = r;
        u = hZ(d4[(s + 4) >> 2] | 0, v) | 0;
        o = hW(u) | 0;
        h = n(hK(iv(a) | 0, o ? b : c));
        z = hJ(a, 2, b) | 0;
        A = hJ(a, 0, c) | 0;
        do if (!(fT(h) | 0) ? !(fT(o ? d : e) | 0) : 0) {
            f = (a + 504) | 0;
            if (!(fT(n(d8[f >> 2])) | 0)) {
                if (!(iw(d4[(a + 976) >> 2] | 0, 0) | 0)) break;
                if ((d4[(a + 500) >> 2] | 0) == (d4[2278] | 0)) break;
            }
            d8[f >> 2] = n(yv(h, n(h8(a, u, b))));
        } else g = 7;
        while (0)
        do if ((g | 0) == 7) {
            t = o ^ 1;
            if (!(t | (z ^ 1))) {
                c = n(hK(d4[(a + 992) >> 2] | 0, b));
                d8[(a + 504) >> 2] = n(yv(c, n(h8(a, 2, b))));
                break;
            }
            if (!(o | (A ^ 1))) {
                c = n(hK(d4[(a + 996) >> 2] | 0, c));
                d8[(a + 504) >> 2] = n(yv(c, n(h8(a, 0, b))));
                break;
            }
            d8[j >> 2] = n(el);
            d8[k >> 2] = n(el);
            d4[l >> 2] = 0;
            d4[m >> 2] = 0;
            x = n(hB(a, 2, b));
            y = n(hB(a, 0, b));
            if (z) {
                p = n(x + n(hK(d4[(a + 992) >> 2] | 0, b)));
                d8[j >> 2] = p;
                d4[l >> 2] = 1;
                i = 1;
            } else {
                i = 0;
                p = n(el);
            }
            if (A) {
                h = n(y + n(hK(d4[(a + 996) >> 2] | 0, c)));
                d8[k >> 2] = h;
                d4[m >> 2] = 1;
                f = 1;
            } else {
                f = 0;
                h = n(el);
            }
            g = d4[(s + 32) >> 2] | 0;
            if (!(o & ((g | 0) == 2))) {
                if (fT(p) | 0 ? !(fT(d) | 0) : 0) {
                    d8[j >> 2] = d;
                    d4[l >> 2] = 2;
                    i = 2;
                    p = d;
                }
            } else g = 2;
            if ((!(((g | 0) == 2) & t) ? fT(h) | 0 : 0) ? !(fT(e) | 0) : 0) {
                d8[k >> 2] = e;
                d4[m >> 2] = 2;
                f = 2;
                h = e;
            }
            q = n(d8[(a + 396) >> 2]);
            w = fT(q) | 0;
            do if (!w) {
                if (((i | 0) == 1) & t) {
                    d8[k >> 2] = n(n(p - x) / q);
                    d4[m >> 2] = 1;
                    f = 1;
                    g = 1;
                    break;
                }
                if (o & ((f | 0) == 1)) {
                    d8[j >> 2] = n(q * n(h - y));
                    d4[l >> 2] = 1;
                    f = 1;
                    g = 1;
                } else g = i;
            } else g = i;
            while (0)
            E = fT(d) | 0;
            i = (ig(s, a) | 0) != 4;
            if (!(o | z | (((B | 0) != 1) | E) | (i | ((g | 0) == 1))) ? ((d8[j >> 2] = d), (d4[l >> 2] = 1), !w) : 0) {
                d8[k >> 2] = n(n(d - x) / q);
                d4[m >> 2] = 1;
                f = 1;
            }
            if (!(A | t | (((C | 0) != 1) | (fT(e) | 0)) | (i | ((f | 0) == 1))) ? ((d8[k >> 2] = e), (d4[m >> 2] = 1), !w) : 0) {
                d8[j >> 2] = n(q * n(e - y));
                d4[l >> 2] = 1;
            }
            ij(a, 2, b, b, l, j);
            ij(a, 0, c, b, m, k);
            d = n(d8[j >> 2]);
            e = n(d8[k >> 2]);
            hA(a, d, e, v, d4[l >> 2] | 0, d4[m >> 2] | 0, b, c, 0, 3565, D) | 0;
            c = n(d8[(a + 908 + (d4[(976 + (u << 2)) >> 2] << 2)) >> 2]);
            d8[(a + 504) >> 2] = n(yv(c, n(h8(a, u, b))));
        }
        while (0)
        d4[(a + 500) >> 2] = d4[2278];
        ed = r;
        return;
    }
    function ie(b, c, d, a, e) {
        b = b | 0;
        c = c | 0;
        d = n(d);
        a = n(a);
        e = n(e);
        a = n(ir(b, c, d, a));
        return n(yv(a, n(h8(b, c, e))));
    }
    function ig(b, a) {
        b = b | 0;
        a = a | 0;
        a = (a + 20) | 0;
        a = d4[((d4[a >> 2] | 0) == 0 ? (b + 16) | 0 : a) >> 2] | 0;
        if ((a | 0) == 5 ? iu(d4[(b + 4) >> 2] | 0) | 0 : 0) a = 1;
        return a | 0;
    }
    function ih(b, a) {
        b = b | 0;
        a = a | 0;
        if (hW(a) | 0 ? (d4[(b + 96) >> 2] | 0) != 0 : 0) a = 4;
        else a = d4[(1040 + (a << 2)) >> 2] | 0;
        return (b + 60 + (a << 3)) | 0;
    }
    function ii(b, a) {
        b = b | 0;
        a = a | 0;
        if (hW(a) | 0 ? (d4[(b + 104) >> 2] | 0) != 0 : 0) a = 5;
        else a = d4[(1e3 + (a << 2)) >> 2] | 0;
        return (b + 60 + (a << 3)) | 0;
    }
    function ij(e, f, a, b, c, d) {
        e = e | 0;
        f = f | 0;
        a = n(a);
        b = n(b);
        c = c | 0;
        d = d | 0;
        a = n(hK((e + 380 + (d4[(976 + (f << 2)) >> 2] << 3)) | 0, a));
        a = n(a + n(hB(e, f, b)));
        switch(d4[c >> 2] | 0){
            case 2:
            case 1:
                {
                    c = fT(a) | 0;
                    b = n(d8[d >> 2]);
                    d8[d >> 2] = c | (b < a) ? b : a;
                    break;
                }
            case 0:
                {
                    if (!(fT(a) | 0)) {
                        d4[c >> 2] = 2;
                        d8[d >> 2] = a;
                    }
                    break;
                }
            default:
                {}
        }
        return;
    }
    function ik(a, b) {
        a = a | 0;
        b = b | 0;
        a = (a + 132) | 0;
        if (hW(b) | 0 ? (d4[((fU(a, 4, 948) | 0) + 4) >> 2] | 0) != 0 : 0) a = 1;
        else a = (d4[((fU(a, d4[(1040 + (b << 2)) >> 2] | 0, 948) | 0) + 4) >> 2] | 0) != 0;
        return a | 0;
    }
    function il(a, d, b) {
        a = a | 0;
        d = d | 0;
        b = n(b);
        var c = 0, e = 0;
        a = (a + 132) | 0;
        if (hW(d) | 0 ? ((c = fU(a, 4, 948) | 0), (d4[(c + 4) >> 2] | 0) != 0) : 0) e = 4;
        else {
            c = fU(a, d4[(1040 + (d << 2)) >> 2] | 0, 948) | 0;
            if (!(d4[(c + 4) >> 2] | 0)) b = n(0.0);
            else e = 4;
        }
        if ((e | 0) == 4) b = n(hK(c, b));
        return n(b);
    }
    function im(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        var d = fR;
        d = n(d8[(a + 908 + (d4[(976 + (b << 2)) >> 2] << 2)) >> 2]);
        d = n(d + n(hU(a, b, c)));
        return n(d + n(hV(a, b, c)));
    }
    function io(b) {
        b = b | 0;
        var a = 0, c = 0, d = 0;
        a: do if (!(iu(d4[(b + 4) >> 2] | 0) | 0)) {
            if ((d4[(b + 16) >> 2] | 0) != 5) {
                c = f0(b) | 0;
                if (!c) a = 0;
                else {
                    a = 0;
                    while(1){
                        d = f1(b, a) | 0;
                        if ((d4[(d + 24) >> 2] | 0) == 0 ? (d4[(d + 20) >> 2] | 0) == 5 : 0) {
                            a = 1;
                            break a;
                        }
                        a = (a + 1) | 0;
                        if (a >>> 0 >= c >>> 0) {
                            a = 0;
                            break;
                        }
                    }
                }
            } else a = 1;
        } else a = 0;
        while (0)
        return a | 0;
    }
    function ip(a, b) {
        a = a | 0;
        b = b | 0;
        var c = fR;
        c = n(d8[(a + 908 + (d4[(976 + (b << 2)) >> 2] << 2)) >> 2]);
        return ((c >= n(0.0)) & ((fT(c) | 0) ^ 1)) | 0;
    }
    function iq(a) {
        a = a | 0;
        var c = fR, b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = fR;
        b = d4[(a + 968) >> 2] | 0;
        if (!b) {
            f = f0(a) | 0;
            do if (f | 0) {
                b = 0;
                e = 0;
                while(1){
                    d = f1(a, e) | 0;
                    if (d4[(d + 940) >> 2] | 0) {
                        g = 8;
                        break;
                    }
                    if ((d4[(d + 24) >> 2] | 0) != 1) {
                        h = (ig(a, d) | 0) == 5;
                        if (h) {
                            b = d;
                            break;
                        } else b = (b | 0) == 0 ? d : b;
                    }
                    e = (e + 1) | 0;
                    if (e >>> 0 >= f >>> 0) {
                        g = 8;
                        break;
                    }
                }
                if ((g | 0) == 8) if (!b) break;
                c = n(iq(b));
                return n(c + n(d8[(b + 404) >> 2]));
            }
            while (0)
            c = n(d8[(a + 912) >> 2]);
        } else {
            i = n(d8[(a + 908) >> 2]);
            c = n(d8[(a + 912) >> 2]);
            c = n(yR[b & 0](a, i, c));
            f5(a, (fT(c) | 0) ^ 1, 3573);
        }
        return n(c);
    }
    function ir(f, b, c, a) {
        f = f | 0;
        b = b | 0;
        c = n(c);
        a = n(a);
        var e = fR, d = 0;
        if (!(iu(b) | 0)) {
            if (hW(b) | 0) {
                b = 0;
                d = 3;
            } else {
                a = n(el);
                e = n(el);
            }
        } else {
            b = 1;
            d = 3;
        }
        if ((d | 0) == 3) {
            e = n(hK((f + 364 + (b << 3)) | 0, a));
            a = n(hK((f + 380 + (b << 3)) | 0, a));
        }
        d = (a < c) & ((a >= n(0.0)) & ((fT(a) | 0) ^ 1));
        c = d ? a : c;
        d = (e >= n(0.0)) & ((fT(e) | 0) ^ 1) & (c < e);
        return n(d ? e : c);
    }
    function is(e, a, g, l, j, m, q) {
        e = e | 0;
        a = a | 0;
        g = n(g);
        l = l | 0;
        j = n(j);
        m = m | 0;
        q = q | 0;
        var f = fR, c = fR, o = 0, k = 0, r = fR, s = fR, t = fR, i = 0, p = 0, h = 0, u = 0, b = fR, d = 0;
        h = hZ(d4[(e + 4) >> 2] | 0, m) | 0;
        i = h5(h, m) | 0;
        p = hW(h) | 0;
        r = n(hB(a, 2, g));
        s = n(hB(a, 0, g));
        if (!(hJ(a, 2, g) | 0)) {
            if (ik(a, 2) | 0 ? ix(a, 2) | 0 : 0) {
                f = n(d8[(e + 908) >> 2]);
                c = n(h$(e, 2));
                c = n(f - n(c + n(h_(e, 2))));
                f = n(il(a, 2, g));
                f = n(ie(a, 2, n(c - n(f + n(iy(a, 2, g)))), g, g));
            } else f = n(el);
        } else f = n(r + n(hK(d4[(a + 992) >> 2] | 0, g)));
        if (!(hJ(a, 0, j) | 0)) {
            if (ik(a, 0) | 0 ? ix(a, 0) | 0 : 0) {
                c = n(d8[(e + 912) >> 2]);
                b = n(h$(e, 0));
                b = n(c - n(b + n(h_(e, 0))));
                c = n(il(a, 0, j));
                c = n(ie(a, 0, n(b - n(c + n(iy(a, 0, j)))), j, g));
            } else c = n(el);
        } else c = n(s + n(hK(d4[(a + 996) >> 2] | 0, j)));
        o = fT(f) | 0;
        k = fT(c) | 0;
        do if (o ^ k ? ((t = n(d8[(a + 396) >> 2])), !(fT(t) | 0)) : 0) if (o) {
            f = n(r + n(n(c - s) * t));
            break;
        } else {
            b = n(s + n(n(f - r) / t));
            c = k ? b : c;
            break;
        }
        while (0)
        k = fT(f) | 0;
        o = fT(c) | 0;
        if (k | o) {
            d = (k ^ 1) & 1;
            l = (g > n(0.0)) & (((l | 0) != 0) & k);
            f = p ? f : l ? g : f;
            hA(a, f, c, m, p ? d : l ? 2 : d, k & (o ^ 1) & 1, f, c, 0, 3623, q) | 0;
            f = n(d8[(a + 908) >> 2]);
            f = n(f + n(hB(a, 2, g)));
            c = n(d8[(a + 912) >> 2]);
            c = n(c + n(hB(a, 0, g)));
        }
        hA(a, f, c, m, 1, 1, f, c, 1, 3635, q) | 0;
        if (ix(a, h) | 0 ? !(ik(a, h) | 0) : 0) {
            d = d4[(976 + (h << 2)) >> 2] | 0;
            b = n(d8[(e + 908 + (d << 2)) >> 2]);
            b = n(b - n(d8[(a + 908 + (d << 2)) >> 2]));
            b = n(b - n(h_(e, h)));
            b = n(b - n(hV(a, h, g)));
            b = n(b - n(iy(a, h, p ? g : j)));
            d8[(a + 400 + (d4[(1040 + (h << 2)) >> 2] << 2)) >> 2] = b;
        } else u = 21;
        do if ((u | 0) == 21) {
            if (!(ik(a, h) | 0) ? (d4[(e + 8) >> 2] | 0) == 1 : 0) {
                d = d4[(976 + (h << 2)) >> 2] | 0;
                b = n(d8[(e + 908 + (d << 2)) >> 2]);
                b = n(n(b - n(d8[(a + 908 + (d << 2)) >> 2])) * n(0.5));
                d8[(a + 400 + (d4[(1040 + (h << 2)) >> 2] << 2)) >> 2] = b;
                break;
            }
            if (!(ik(a, h) | 0) ? (d4[(e + 8) >> 2] | 0) == 2 : 0) {
                d = d4[(976 + (h << 2)) >> 2] | 0;
                b = n(d8[(e + 908 + (d << 2)) >> 2]);
                b = n(b - n(d8[(a + 908 + (d << 2)) >> 2]));
                d8[(a + 400 + (d4[(1040 + (h << 2)) >> 2] << 2)) >> 2] = b;
            }
        }
        while (0)
        if (ix(a, i) | 0 ? !(ik(a, i) | 0) : 0) {
            d = d4[(976 + (i << 2)) >> 2] | 0;
            b = n(d8[(e + 908 + (d << 2)) >> 2]);
            b = n(b - n(d8[(a + 908 + (d << 2)) >> 2]));
            b = n(b - n(h_(e, i)));
            b = n(b - n(hV(a, i, g)));
            b = n(b - n(iy(a, i, p ? j : g)));
            d8[(a + 400 + (d4[(1040 + (i << 2)) >> 2] << 2)) >> 2] = b;
        } else u = 30;
        do if ((u | 0) == 30 ? !(ik(a, i) | 0) : 0) {
            if ((ig(e, a) | 0) == 2) {
                d = d4[(976 + (i << 2)) >> 2] | 0;
                b = n(d8[(e + 908 + (d << 2)) >> 2]);
                b = n(n(b - n(d8[(a + 908 + (d << 2)) >> 2])) * n(0.5));
                d8[(a + 400 + (d4[(1040 + (i << 2)) >> 2] << 2)) >> 2] = b;
                break;
            }
            d = (ig(e, a) | 0) == 3;
            if (d ^ ((d4[(e + 28) >> 2] | 0) == 2)) {
                d = d4[(976 + (i << 2)) >> 2] | 0;
                b = n(d8[(e + 908 + (d << 2)) >> 2]);
                b = n(b - n(d8[(a + 908 + (d << 2)) >> 2]));
                d8[(a + 400 + (d4[(1040 + (i << 2)) >> 2] << 2)) >> 2] = b;
            }
        }
        while (0)
        return;
    }
    function it(d, b, c) {
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var a = fR, e = 0;
        e = d4[(976 + (c << 2)) >> 2] | 0;
        a = n(d8[(b + 908 + (e << 2)) >> 2]);
        a = n(n(d8[(d + 908 + (e << 2)) >> 2]) - a);
        a = n(a - n(d8[(b + 400 + (d4[(1040 + (c << 2)) >> 2] << 2)) >> 2]));
        d8[(b + 400 + (d4[(1e3 + (c << 2)) >> 2] << 2)) >> 2] = a;
        return;
    }
    function iu(a) {
        a = a | 0;
        return ((a | 1 | 0) == 1) | 0;
    }
    function iv(a) {
        a = a | 0;
        var b = fR;
        switch(d4[(a + 56) >> 2] | 0){
            case 0:
            case 3:
                {
                    b = n(d8[(a + 40) >> 2]);
                    if ((b > n(0.0)) & ((fT(b) | 0) ^ 1)) a = d2[((d4[(a + 976) >> 2] | 0) + 2) >> 0] | 0 ? 1056 : 992;
                    else a = 1056;
                    break;
                }
            default:
                a = (a + 52) | 0;
        }
        return a | 0;
    }
    function iw(a, b) {
        a = a | 0;
        b = b | 0;
        return ((d2[(a + b) >> 0] | 0) != 0) | 0;
    }
    function ix(a, b) {
        a = a | 0;
        b = b | 0;
        a = (a + 132) | 0;
        if (hW(b) | 0 ? (d4[((fU(a, 5, 948) | 0) + 4) >> 2] | 0) != 0 : 0) a = 1;
        else a = (d4[((fU(a, d4[(1e3 + (b << 2)) >> 2] | 0, 948) | 0) + 4) >> 2] | 0) != 0;
        return a | 0;
    }
    function iy(a, d, b) {
        a = a | 0;
        d = d | 0;
        b = n(b);
        var c = 0, e = 0;
        a = (a + 132) | 0;
        if (hW(d) | 0 ? ((c = fU(a, 5, 948) | 0), (d4[(c + 4) >> 2] | 0) != 0) : 0) e = 4;
        else {
            c = fU(a, d4[(1e3 + (d << 2)) >> 2] | 0, 948) | 0;
            if (!(d4[(c + 4) >> 2] | 0)) b = n(0.0);
            else e = 4;
        }
        if ((e | 0) == 4) b = n(hK(c, b));
        return n(b);
    }
    function iz(b, c, a) {
        b = b | 0;
        c = c | 0;
        a = n(a);
        if (ik(b, c) | 0) a = n(il(b, c, a));
        else a = n(-n(iy(b, c, a)));
        return n(a);
    }
    function iA(a) {
        a = n(a);
        return ((d8[eb >> 2] = a), d4[eb >> 2] | 0) | 0;
    }
    function iB(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 1073741823) fA();
            else {
                d = yH(b << 2) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 2)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 2);
        return;
    }
    function iC(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 2)) << 2)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function iD(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -4 - c) | 0) >>> 2) << 2);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function iE(a, c, d, b) {
        a = a | 0;
        c = c | 0;
        d = d | 0;
        b = b | 0;
        var h = 0, e = 0, f = 0, g = 0;
        f = (a + 4) | 0;
        g = d4[f >> 2] | 0;
        h = (g - b) | 0;
        e = h >> 2;
        a = (c + (e << 2)) | 0;
        if (a >>> 0 < d >>> 0) {
            b = g;
            do {
                d4[b >> 2] = d4[a >> 2];
                a = (a + 4) | 0;
                b = ((d4[f >> 2] | 0) + 4) | 0;
                d4[f >> 2] = b;
            }while (a >>> 0 < d >>> 0)
        }
        if (e | 0) dk((g + ((0 - e) << 2)) | 0, c | 0, h | 0) | 0;
        return;
    }
    function iF(c, g, d) {
        c = c | 0;
        g = g | 0;
        d = d | 0;
        var e = 0, f = 0, a = 0, b = 0, h = 0, i = 0;
        h = (g + 4) | 0;
        i = d4[h >> 2] | 0;
        f = d4[c >> 2] | 0;
        b = d;
        a = (b - f) | 0;
        e = (i + ((0 - (a >> 2)) << 2)) | 0;
        d4[h >> 2] = e;
        if ((a | 0) > 0) dh(e | 0, f | 0, a | 0) | 0;
        f = (c + 4) | 0;
        a = (g + 8) | 0;
        e = ((d4[f >> 2] | 0) - b) | 0;
        if ((e | 0) > 0) {
            dh(d4[a >> 2] | 0, d | 0, e | 0) | 0;
            d4[a >> 2] = (d4[a >> 2] | 0) + ((e >>> 2) << 2);
        }
        b = d4[c >> 2] | 0;
        d4[c >> 2] = d4[h >> 2];
        d4[h >> 2] = b;
        b = d4[f >> 2] | 0;
        d4[f >> 2] = d4[a >> 2];
        d4[a >> 2] = b;
        b = (c + 8) | 0;
        d = (g + 12) | 0;
        c = d4[b >> 2] | 0;
        d4[b >> 2] = d4[d >> 2];
        d4[d >> 2] = c;
        d4[g >> 2] = d4[h >> 2];
        return i | 0;
    }
    function iG(a, d, b) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        var e = 0, f = 0, g = 0, c = 0;
        c = d4[d >> 2] | 0;
        g = d4[b >> 2] | 0;
        if ((c | 0) != (g | 0)) {
            f = (a + 8) | 0;
            b = ((((g + -4 - c) | 0) >>> 2) + 1) | 0;
            a = c;
            e = d4[f >> 2] | 0;
            do {
                d4[e >> 2] = d4[a >> 2];
                e = ((d4[f >> 2] | 0) + 4) | 0;
                d4[f >> 2] = e;
                a = (a + 4) | 0;
            }while ((a | 0) != (g | 0))
            d4[d >> 2] = c + (b << 2);
        }
        return;
    }
    function x() {
        fS();
        return;
    }
    function y() {
        var a = 0;
        a = yH(4) | 0;
        iH(a);
        return a | 0;
    }
    function iH(a) {
        a = a | 0;
        d4[a >> 2] = f7() | 0;
        return;
    }
    function z(a) {
        a = a | 0;
        if (a | 0) {
            iI(a);
            yJ(a);
        }
        return;
    }
    function iI(a) {
        a = a | 0;
        f9(d4[a >> 2] | 0);
        return;
    }
    function A(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        hP(d4[a >> 2] | 0, b, c);
        return;
    }
    function B(a, b) {
        a = a | 0;
        b = n(b);
        hG(d4[a >> 2] | 0, b);
        return;
    }
    function C(a, b) {
        a = a | 0;
        b = b | 0;
        return iw(d4[a >> 2] | 0, b) | 0;
    }
    function D() {
        var a = 0;
        a = yH(8) | 0;
        iJ(a, 0);
        return a | 0;
    }
    function iJ(b, a) {
        b = b | 0;
        a = a | 0;
        if (!a) a = fX() | 0;
        else a = fV(d4[a >> 2] | 0) | 0;
        d4[b >> 2] = a;
        d4[(b + 4) >> 2] = 0;
        gm(a, b);
        return;
    }
    function E(a) {
        a = a | 0;
        var b = 0;
        b = yH(8) | 0;
        iJ(b, a);
        return b | 0;
    }
    function F(a) {
        a = a | 0;
        if (a | 0) {
            iK(a);
            yJ(a);
        }
        return;
    }
    function iK(a) {
        a = a | 0;
        var b = 0;
        f$(d4[a >> 2] | 0);
        b = (a + 4) | 0;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = 0;
        if (a | 0) {
            iL(a);
            yJ(a);
        }
        return;
    }
    function iL(a) {
        a = a | 0;
        iM(a);
        return;
    }
    function iM(a) {
        a = a | 0;
        a = d4[a >> 2] | 0;
        if (a | 0) fJ(a | 0);
        return;
    }
    function iN(a) {
        a = a | 0;
        return gn(a) | 0;
    }
    function G(a) {
        a = a | 0;
        var b = 0, c = 0;
        c = (a + 4) | 0;
        b = d4[c >> 2] | 0;
        d4[c >> 2] = 0;
        if (b | 0) {
            iL(b);
            yJ(b);
        }
        f4(d4[a >> 2] | 0);
        return;
    }
    function H(a, b) {
        a = a | 0;
        b = b | 0;
        gj(d4[a >> 2] | 0, d4[b >> 2] | 0);
        return;
    }
    function I(a, b) {
        a = a | 0;
        b = b | 0;
        gy(d4[a >> 2] | 0, b);
        return;
    }
    function J(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        gM(d4[a >> 2] | 0, b, n(c));
        return;
    }
    function K(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        gN(d4[a >> 2] | 0, b, n(c));
        return;
    }
    function L(a, b) {
        a = a | 0;
        b = b | 0;
        gs(d4[a >> 2] | 0, b);
        return;
    }
    function M(a, b) {
        a = a | 0;
        b = b | 0;
        gu(d4[a >> 2] | 0, b);
        return;
    }
    function N(a, b) {
        a = a | 0;
        b = b | 0;
        gw(d4[a >> 2] | 0, b);
        return;
    }
    function O(a, b) {
        a = a | 0;
        b = b | 0;
        go(d4[a >> 2] | 0, b);
        return;
    }
    function P(a, b) {
        a = a | 0;
        b = b | 0;
        gA(d4[a >> 2] | 0, b);
        return;
    }
    function Q(a, b) {
        a = a | 0;
        b = b | 0;
        gq(d4[a >> 2] | 0, b);
        return;
    }
    function R(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        gP(d4[a >> 2] | 0, b, n(c));
        return;
    }
    function S(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        gQ(d4[a >> 2] | 0, b, n(c));
        return;
    }
    function T(a, b) {
        a = a | 0;
        b = b | 0;
        gS(d4[a >> 2] | 0, b);
        return;
    }
    function U(a, b) {
        a = a | 0;
        b = b | 0;
        gC(d4[a >> 2] | 0, b);
        return;
    }
    function V(a, b) {
        a = a | 0;
        b = b | 0;
        gE(d4[a >> 2] | 0, b);
        return;
    }
    function W(a, b) {
        a = a | 0;
        b = +b;
        gG(d4[a >> 2] | 0, n(b));
        return;
    }
    function X(a, b) {
        a = a | 0;
        b = +b;
        gJ(d4[a >> 2] | 0, n(b));
        return;
    }
    function Y(a, b) {
        a = a | 0;
        b = +b;
        gK(d4[a >> 2] | 0, n(b));
        return;
    }
    function Z(a, b) {
        a = a | 0;
        b = +b;
        gH(d4[a >> 2] | 0, n(b));
        return;
    }
    function $(a, b) {
        a = a | 0;
        b = +b;
        gI(d4[a >> 2] | 0, n(b));
        return;
    }
    function _(a, b) {
        a = a | 0;
        b = +b;
        gY(d4[a >> 2] | 0, n(b));
        return;
    }
    function aa(a, b) {
        a = a | 0;
        b = +b;
        gZ(d4[a >> 2] | 0, n(b));
        return;
    }
    function ab(a) {
        a = a | 0;
        g$(d4[a >> 2] | 0);
        return;
    }
    function ac(a, b) {
        a = a | 0;
        b = +b;
        g0(d4[a >> 2] | 0, n(b));
        return;
    }
    function ad(a, b) {
        a = a | 0;
        b = +b;
        g1(d4[a >> 2] | 0, n(b));
        return;
    }
    function ae(a) {
        a = a | 0;
        g2(d4[a >> 2] | 0);
        return;
    }
    function af(a, b) {
        a = a | 0;
        b = +b;
        g4(d4[a >> 2] | 0, n(b));
        return;
    }
    function ag(a, b) {
        a = a | 0;
        b = +b;
        g5(d4[a >> 2] | 0, n(b));
        return;
    }
    function ah(a, b) {
        a = a | 0;
        b = +b;
        g7(d4[a >> 2] | 0, n(b));
        return;
    }
    function ai(a, b) {
        a = a | 0;
        b = +b;
        g8(d4[a >> 2] | 0, n(b));
        return;
    }
    function aj(a, b) {
        a = a | 0;
        b = +b;
        ha(d4[a >> 2] | 0, n(b));
        return;
    }
    function ak(a, b) {
        a = a | 0;
        b = +b;
        hb(d4[a >> 2] | 0, n(b));
        return;
    }
    function al(a, b) {
        a = a | 0;
        b = +b;
        hd(d4[a >> 2] | 0, n(b));
        return;
    }
    function am(a, b) {
        a = a | 0;
        b = +b;
        he(d4[a >> 2] | 0, n(b));
        return;
    }
    function an(a, b) {
        a = a | 0;
        b = +b;
        hg(d4[a >> 2] | 0, n(b));
        return;
    }
    function ao(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        gW(d4[a >> 2] | 0, b, n(c));
        return;
    }
    function ap(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        gT(d4[a >> 2] | 0, b, n(c));
        return;
    }
    function aq(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        gU(d4[a >> 2] | 0, b, n(c));
        return;
    }
    function ar(a) {
        a = a | 0;
        return gz(d4[a >> 2] | 0) | 0;
    }
    function as(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = d;
        gO(e, d4[b >> 2] | 0, c);
        iO(a, e);
        ed = d;
        return;
    }
    function iO(b, a) {
        b = b | 0;
        a = a | 0;
        iP(b, d4[(a + 4) >> 2] | 0, +n(d8[a >> 2]));
        return;
    }
    function iP(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d4[a >> 2] = b;
        d9[(a + 8) >> 3] = c;
        return;
    }
    function at(a) {
        a = a | 0;
        return gt(d4[a >> 2] | 0) | 0;
    }
    function au(a) {
        a = a | 0;
        return gv(d4[a >> 2] | 0) | 0;
    }
    function av(a) {
        a = a | 0;
        return gx(d4[a >> 2] | 0) | 0;
    }
    function aw(a) {
        a = a | 0;
        return gp(d4[a >> 2] | 0) | 0;
    }
    function ax(a) {
        a = a | 0;
        return gB(d4[a >> 2] | 0) | 0;
    }
    function ay(a) {
        a = a | 0;
        return gr(d4[a >> 2] | 0) | 0;
    }
    function az(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = d;
        gR(e, d4[b >> 2] | 0, c);
        iO(a, e);
        ed = d;
        return;
    }
    function aA(a) {
        a = a | 0;
        return gD(d4[a >> 2] | 0) | 0;
    }
    function aB(a) {
        a = a | 0;
        return gF(d4[a >> 2] | 0) | 0;
    }
    function aC(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        gL(d, d4[b >> 2] | 0);
        iO(a, d);
        ed = c;
        return;
    }
    function aD(a) {
        a = a | 0;
        return +(+n(gk(d4[a >> 2] | 0)));
    }
    function aE(a) {
        a = a | 0;
        return +(+n(gl(d4[a >> 2] | 0)));
    }
    function aF(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        g_(d, d4[b >> 2] | 0);
        iO(a, d);
        ed = c;
        return;
    }
    function aG(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        g3(d, d4[b >> 2] | 0);
        iO(a, d);
        ed = c;
        return;
    }
    function aH(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        g6(d, d4[b >> 2] | 0);
        iO(a, d);
        ed = c;
        return;
    }
    function aI(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        g9(d, d4[b >> 2] | 0);
        iO(a, d);
        ed = c;
        return;
    }
    function aJ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        hc(d, d4[b >> 2] | 0);
        iO(a, d);
        ed = c;
        return;
    }
    function aK(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        hf(d, d4[b >> 2] | 0);
        iO(a, d);
        ed = c;
        return;
    }
    function aL(a) {
        a = a | 0;
        return +(+n(hh(d4[a >> 2] | 0)));
    }
    function aM(a, b) {
        a = a | 0;
        b = b | 0;
        return +(+n(gX(d4[a >> 2] | 0, b)));
    }
    function aN(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = d;
        gV(e, d4[b >> 2] | 0, c);
        iO(a, e);
        ed = d;
        return;
    }
    function aO(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        gb(d4[a >> 2] | 0, d4[b >> 2] | 0, c);
        return;
    }
    function aP(a, b) {
        a = a | 0;
        b = b | 0;
        f3(d4[a >> 2] | 0, d4[b >> 2] | 0);
        return;
    }
    function aQ(a) {
        a = a | 0;
        return f0(d4[a >> 2] | 0) | 0;
    }
    function aR(a) {
        a = a | 0;
        a = gg(d4[a >> 2] | 0) | 0;
        if (!a) a = 0;
        else a = iN(a) | 0;
        return a | 0;
    }
    function aS(a, b) {
        a = a | 0;
        b = b | 0;
        a = f1(d4[a >> 2] | 0, b) | 0;
        if (!a) a = 0;
        else a = iN(a) | 0;
        return a | 0;
    }
    function aT(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0, d = 0;
        d = yH(4) | 0;
        iQ(d, a);
        c = (b + 4) | 0;
        a = d4[c >> 2] | 0;
        d4[c >> 2] = d;
        if (a | 0) {
            iL(a);
            yJ(a);
        }
        ga(d4[b >> 2] | 0, 1);
        return;
    }
    function iQ(a, b) {
        a = a | 0;
        b = b | 0;
        i7(a, b);
        return;
    }
    function aU(a, c, d, e, f, g) {
        a = a | 0;
        c = c | 0;
        d = n(d);
        e = e | 0;
        f = n(f);
        g = g | 0;
        var h = 0, b = 0;
        h = ed;
        ed = (ed + 16) | 0;
        b = h;
        iR(b, gn(c) | 0, +d, e, +f, g);
        d8[a >> 2] = n(+d9[b >> 3]);
        d8[(a + 4) >> 2] = n(+d9[(b + 8) >> 3]);
        ed = h;
        return;
    }
    function iR(b, c, d, e, f, g) {
        b = b | 0;
        c = c | 0;
        d = +d;
        e = e | 0;
        f = +f;
        g = g | 0;
        var a = 0, h = 0, i = 0, j = 0, k = 0;
        a = ed;
        ed = (ed + 32) | 0;
        k = (a + 8) | 0;
        j = (a + 20) | 0;
        i = a;
        h = (a + 16) | 0;
        d9[k >> 3] = d;
        d4[j >> 2] = e;
        d9[i >> 3] = f;
        d4[h >> 2] = g;
        iS(b, d4[(c + 4) >> 2] | 0, k, j, i, h);
        ed = a;
        return;
    }
    function iS(b, a, c, d, e, f) {
        b = b | 0;
        a = a | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0;
        g = ed;
        ed = (ed + 16) | 0;
        h = g;
        xD(h);
        a = iT(a) | 0;
        iU(b, a, +d9[c >> 3], d4[d >> 2] | 0, +d9[e >> 3], d4[f >> 2] | 0);
        xF(h);
        ed = g;
        return;
    }
    function iT(a) {
        a = a | 0;
        return d4[a >> 2] | 0;
    }
    function iU(d, e, a, b, c, f) {
        d = d | 0;
        e = e | 0;
        a = +a;
        b = b | 0;
        c = +c;
        f = f | 0;
        var g = 0;
        g = iW(iV() | 0) | 0;
        a = +iX(a);
        b = iY(b) | 0;
        c = +iX(c);
        iZ(d, fL(0, g | 0, e | 0, +a, b | 0, +c, iY(f) | 0) | 0);
        return;
    }
    function iV() {
        var a = 0;
        if (!(d2[7608] | 0)) {
            i4(9120);
            a = 7608;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 9120;
    }
    function iW(a) {
        a = a | 0;
        return d4[(a + 8) >> 2] | 0;
    }
    function iX(a) {
        a = +a;
        return +(+i3(a));
    }
    function iY(a) {
        a = a | 0;
        return i2(a) | 0;
    }
    function iZ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        e = ed;
        ed = (ed + 32) | 0;
        c = e;
        d = b;
        if (!(d & 1)) {
            d4[a >> 2] = d4[b >> 2];
            d4[(a + 4) >> 2] = d4[(b + 4) >> 2];
            d4[(a + 8) >> 2] = d4[(b + 8) >> 2];
            d4[(a + 12) >> 2] = d4[(b + 12) >> 2];
        } else {
            i$(c, 0);
            fq(d | 0, c | 0) | 0;
            i_(a, c);
            i0(c);
        }
        ed = e;
        return;
    }
    function i$(a, b) {
        a = a | 0;
        b = b | 0;
        i1(a, b);
        d4[(a + 8) >> 2] = 0;
        d2[(a + 24) >> 0] = 0;
        return;
    }
    function i_(b, a) {
        b = b | 0;
        a = a | 0;
        a = (a + 8) | 0;
        d4[b >> 2] = d4[a >> 2];
        d4[(b + 4) >> 2] = d4[(a + 4) >> 2];
        d4[(b + 8) >> 2] = d4[(a + 8) >> 2];
        d4[(b + 12) >> 2] = d4[(a + 12) >> 2];
        return;
    }
    function i0(a) {
        a = a | 0;
        d2[(a + 24) >> 0] = 0;
        return;
    }
    function i1(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = b;
        return;
    }
    function i2(a) {
        a = a | 0;
        return a | 0;
    }
    function i3(a) {
        a = +a;
        return +a;
    }
    function i4(a) {
        a = a | 0;
        i6(a, i5() | 0, 4);
        return;
    }
    function i5() {
        return 1064;
    }
    function i6(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        d4[(a + 8) >> 2] = fH(b | 0, (c + 1) | 0) | 0;
        return;
    }
    function i7(b, a) {
        b = b | 0;
        a = a | 0;
        a = d4[a >> 2] | 0;
        d4[b >> 2] = a;
        fh(a | 0);
        return;
    }
    function aV(a) {
        a = a | 0;
        var b = 0, c = 0;
        c = (a + 4) | 0;
        b = d4[c >> 2] | 0;
        d4[c >> 2] = 0;
        if (b | 0) {
            iL(b);
            yJ(b);
        }
        ga(d4[a >> 2] | 0, 0);
        return;
    }
    function aW(a) {
        a = a | 0;
        gh(d4[a >> 2] | 0);
        return;
    }
    function aX(a) {
        a = a | 0;
        return gi(d4[a >> 2] | 0) | 0;
    }
    function aY(a, b, c, d) {
        a = a | 0;
        b = +b;
        c = +c;
        d = d | 0;
        hH(d4[a >> 2] | 0, n(b), n(c), d);
        return;
    }
    function aZ(a) {
        a = a | 0;
        return +(+n(hi(d4[a >> 2] | 0)));
    }
    function a$(a) {
        a = a | 0;
        return +(+n(hk(d4[a >> 2] | 0)));
    }
    function a_(a) {
        a = a | 0;
        return +(+n(hj(d4[a >> 2] | 0)));
    }
    function a0(a) {
        a = a | 0;
        return +(+n(hl(d4[a >> 2] | 0)));
    }
    function a1(a) {
        a = a | 0;
        return +(+n(hm(d4[a >> 2] | 0)));
    }
    function a2(a) {
        a = a | 0;
        return +(+n(hn(d4[a >> 2] | 0)));
    }
    function a3(a, b) {
        a = a | 0;
        b = b | 0;
        d9[a >> 3] = +n(hi(d4[b >> 2] | 0));
        d9[(a + 8) >> 3] = +n(hk(d4[b >> 2] | 0));
        d9[(a + 16) >> 3] = +n(hj(d4[b >> 2] | 0));
        d9[(a + 24) >> 3] = +n(hl(d4[b >> 2] | 0));
        d9[(a + 32) >> 3] = +n(hm(d4[b >> 2] | 0));
        d9[(a + 40) >> 3] = +n(hn(d4[b >> 2] | 0));
        return;
    }
    function a4(a, b) {
        a = a | 0;
        b = b | 0;
        return +(+n(ho(d4[a >> 2] | 0, b)));
    }
    function a5(a, b) {
        a = a | 0;
        b = b | 0;
        return +(+n(hp(d4[a >> 2] | 0, b)));
    }
    function a6(a, b) {
        a = a | 0;
        b = b | 0;
        return +(+n(hq(d4[a >> 2] | 0, b)));
    }
    function a7() {
        return f6() | 0;
    }
    function a8() {
        i8();
        i9();
        ja();
        jb();
        jc();
        jd();
        return;
    }
    function i8() {
        to(11713, 4938, 1);
        return;
    }
    function i9() {
        sW(10448);
        return;
    }
    function ja() {
        sG(10408);
        return;
    }
    function jb() {
        sc(10324);
        return;
    }
    function jc() {
        qA(10096);
        return;
    }
    function jd() {
        je(9132);
        return;
    }
    function je(b) {
        b = b | 0;
        var c = 0, a = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, $ = 0, _ = 0, aa = 0, ab = 0, ac = 0, ad = 0, ae = 0, af = 0, ag = 0, ah = 0, ai = 0, aj = 0, ak = 0, al = 0, am = 0, an = 0, ao = 0, ap = 0, aq = 0, ar = 0, as = 0, at = 0, au = 0, av = 0, aw = 0, ax = 0, ay = 0, az = 0, aA = 0, aB = 0, aC = 0, aD = 0, aE = 0;
        c = ed;
        ed = (ed + 672) | 0;
        a = (c + 656) | 0;
        aE = (c + 648) | 0;
        aD = (c + 640) | 0;
        aC = (c + 632) | 0;
        aB = (c + 624) | 0;
        aA = (c + 616) | 0;
        az = (c + 608) | 0;
        ay = (c + 600) | 0;
        ax = (c + 592) | 0;
        aw = (c + 584) | 0;
        av = (c + 576) | 0;
        au = (c + 568) | 0;
        at = (c + 560) | 0;
        as = (c + 552) | 0;
        ar = (c + 544) | 0;
        aq = (c + 536) | 0;
        ap = (c + 528) | 0;
        ao = (c + 520) | 0;
        an = (c + 512) | 0;
        am = (c + 504) | 0;
        al = (c + 496) | 0;
        ak = (c + 488) | 0;
        aj = (c + 480) | 0;
        ai = (c + 472) | 0;
        ah = (c + 464) | 0;
        ag = (c + 456) | 0;
        af = (c + 448) | 0;
        ae = (c + 440) | 0;
        ad = (c + 432) | 0;
        ac = (c + 424) | 0;
        ab = (c + 416) | 0;
        aa = (c + 408) | 0;
        _ = (c + 400) | 0;
        $ = (c + 392) | 0;
        Z = (c + 384) | 0;
        Y = (c + 376) | 0;
        X = (c + 368) | 0;
        W = (c + 360) | 0;
        V = (c + 352) | 0;
        U = (c + 344) | 0;
        T = (c + 336) | 0;
        S = (c + 328) | 0;
        R = (c + 320) | 0;
        Q = (c + 312) | 0;
        P = (c + 304) | 0;
        O = (c + 296) | 0;
        N = (c + 288) | 0;
        M = (c + 280) | 0;
        L = (c + 272) | 0;
        K = (c + 264) | 0;
        J = (c + 256) | 0;
        I = (c + 248) | 0;
        H = (c + 240) | 0;
        G = (c + 232) | 0;
        F = (c + 224) | 0;
        E = (c + 216) | 0;
        D = (c + 208) | 0;
        C = (c + 200) | 0;
        B = (c + 192) | 0;
        A = (c + 184) | 0;
        z = (c + 176) | 0;
        y = (c + 168) | 0;
        x = (c + 160) | 0;
        w = (c + 152) | 0;
        v = (c + 144) | 0;
        u = (c + 136) | 0;
        t = (c + 128) | 0;
        s = (c + 120) | 0;
        r = (c + 112) | 0;
        q = (c + 104) | 0;
        p = (c + 96) | 0;
        o = (c + 88) | 0;
        n = (c + 80) | 0;
        m = (c + 72) | 0;
        l = (c + 64) | 0;
        k = (c + 56) | 0;
        j = (c + 48) | 0;
        i = (c + 40) | 0;
        h = (c + 32) | 0;
        g = (c + 24) | 0;
        f = (c + 16) | 0;
        e = (c + 8) | 0;
        d = c;
        jf(b, 3646);
        jg(b, 3651, 2) | 0;
        jh(b, 3665, 2) | 0;
        ji(b, 3682, 18) | 0;
        d4[aE >> 2] = 19;
        d4[(aE + 4) >> 2] = 0;
        d4[a >> 2] = d4[aE >> 2];
        d4[(a + 4) >> 2] = d4[(aE + 4) >> 2];
        jj(b, 3690, a) | 0;
        d4[aD >> 2] = 1;
        d4[(aD + 4) >> 2] = 0;
        d4[a >> 2] = d4[aD >> 2];
        d4[(a + 4) >> 2] = d4[(aD + 4) >> 2];
        jk(b, 3696, a) | 0;
        d4[aC >> 2] = 2;
        d4[(aC + 4) >> 2] = 0;
        d4[a >> 2] = d4[aC >> 2];
        d4[(a + 4) >> 2] = d4[(aC + 4) >> 2];
        jl(b, 3706, a) | 0;
        d4[aB >> 2] = 1;
        d4[(aB + 4) >> 2] = 0;
        d4[a >> 2] = d4[aB >> 2];
        d4[(a + 4) >> 2] = d4[(aB + 4) >> 2];
        jm(b, 3722, a) | 0;
        d4[aA >> 2] = 2;
        d4[(aA + 4) >> 2] = 0;
        d4[a >> 2] = d4[aA >> 2];
        d4[(a + 4) >> 2] = d4[(aA + 4) >> 2];
        jm(b, 3734, a) | 0;
        d4[az >> 2] = 3;
        d4[(az + 4) >> 2] = 0;
        d4[a >> 2] = d4[az >> 2];
        d4[(a + 4) >> 2] = d4[(az + 4) >> 2];
        jl(b, 3753, a) | 0;
        d4[ay >> 2] = 4;
        d4[(ay + 4) >> 2] = 0;
        d4[a >> 2] = d4[ay >> 2];
        d4[(a + 4) >> 2] = d4[(ay + 4) >> 2];
        jl(b, 3769, a) | 0;
        d4[ax >> 2] = 5;
        d4[(ax + 4) >> 2] = 0;
        d4[a >> 2] = d4[ax >> 2];
        d4[(a + 4) >> 2] = d4[(ax + 4) >> 2];
        jl(b, 3783, a) | 0;
        d4[aw >> 2] = 6;
        d4[(aw + 4) >> 2] = 0;
        d4[a >> 2] = d4[aw >> 2];
        d4[(a + 4) >> 2] = d4[(aw + 4) >> 2];
        jl(b, 3796, a) | 0;
        d4[av >> 2] = 7;
        d4[(av + 4) >> 2] = 0;
        d4[a >> 2] = d4[av >> 2];
        d4[(a + 4) >> 2] = d4[(av + 4) >> 2];
        jl(b, 3813, a) | 0;
        d4[au >> 2] = 8;
        d4[(au + 4) >> 2] = 0;
        d4[a >> 2] = d4[au >> 2];
        d4[(a + 4) >> 2] = d4[(au + 4) >> 2];
        jl(b, 3825, a) | 0;
        d4[at >> 2] = 3;
        d4[(at + 4) >> 2] = 0;
        d4[a >> 2] = d4[at >> 2];
        d4[(a + 4) >> 2] = d4[(at + 4) >> 2];
        jm(b, 3843, a) | 0;
        d4[as >> 2] = 4;
        d4[(as + 4) >> 2] = 0;
        d4[a >> 2] = d4[as >> 2];
        d4[(a + 4) >> 2] = d4[(as + 4) >> 2];
        jm(b, 3853, a) | 0;
        d4[ar >> 2] = 9;
        d4[(ar + 4) >> 2] = 0;
        d4[a >> 2] = d4[ar >> 2];
        d4[(a + 4) >> 2] = d4[(ar + 4) >> 2];
        jl(b, 3870, a) | 0;
        d4[aq >> 2] = 10;
        d4[(aq + 4) >> 2] = 0;
        d4[a >> 2] = d4[aq >> 2];
        d4[(a + 4) >> 2] = d4[(aq + 4) >> 2];
        jl(b, 3884, a) | 0;
        d4[ap >> 2] = 11;
        d4[(ap + 4) >> 2] = 0;
        d4[a >> 2] = d4[ap >> 2];
        d4[(a + 4) >> 2] = d4[(ap + 4) >> 2];
        jl(b, 3896, a) | 0;
        d4[ao >> 2] = 1;
        d4[(ao + 4) >> 2] = 0;
        d4[a >> 2] = d4[ao >> 2];
        d4[(a + 4) >> 2] = d4[(ao + 4) >> 2];
        jn(b, 3907, a) | 0;
        d4[an >> 2] = 2;
        d4[(an + 4) >> 2] = 0;
        d4[a >> 2] = d4[an >> 2];
        d4[(a + 4) >> 2] = d4[(an + 4) >> 2];
        jn(b, 3915, a) | 0;
        d4[am >> 2] = 3;
        d4[(am + 4) >> 2] = 0;
        d4[a >> 2] = d4[am >> 2];
        d4[(a + 4) >> 2] = d4[(am + 4) >> 2];
        jn(b, 3928, a) | 0;
        d4[al >> 2] = 4;
        d4[(al + 4) >> 2] = 0;
        d4[a >> 2] = d4[al >> 2];
        d4[(a + 4) >> 2] = d4[(al + 4) >> 2];
        jn(b, 3948, a) | 0;
        d4[ak >> 2] = 5;
        d4[(ak + 4) >> 2] = 0;
        d4[a >> 2] = d4[ak >> 2];
        d4[(a + 4) >> 2] = d4[(ak + 4) >> 2];
        jn(b, 3960, a) | 0;
        d4[aj >> 2] = 6;
        d4[(aj + 4) >> 2] = 0;
        d4[a >> 2] = d4[aj >> 2];
        d4[(a + 4) >> 2] = d4[(aj + 4) >> 2];
        jn(b, 3974, a) | 0;
        d4[ai >> 2] = 7;
        d4[(ai + 4) >> 2] = 0;
        d4[a >> 2] = d4[ai >> 2];
        d4[(a + 4) >> 2] = d4[(ai + 4) >> 2];
        jn(b, 3983, a) | 0;
        d4[ah >> 2] = 20;
        d4[(ah + 4) >> 2] = 0;
        d4[a >> 2] = d4[ah >> 2];
        d4[(a + 4) >> 2] = d4[(ah + 4) >> 2];
        jj(b, 3999, a) | 0;
        d4[ag >> 2] = 8;
        d4[(ag + 4) >> 2] = 0;
        d4[a >> 2] = d4[ag >> 2];
        d4[(a + 4) >> 2] = d4[(ag + 4) >> 2];
        jn(b, 4012, a) | 0;
        d4[af >> 2] = 9;
        d4[(af + 4) >> 2] = 0;
        d4[a >> 2] = d4[af >> 2];
        d4[(a + 4) >> 2] = d4[(af + 4) >> 2];
        jn(b, 4022, a) | 0;
        d4[ae >> 2] = 21;
        d4[(ae + 4) >> 2] = 0;
        d4[a >> 2] = d4[ae >> 2];
        d4[(a + 4) >> 2] = d4[(ae + 4) >> 2];
        jj(b, 4039, a) | 0;
        d4[ad >> 2] = 10;
        d4[(ad + 4) >> 2] = 0;
        d4[a >> 2] = d4[ad >> 2];
        d4[(a + 4) >> 2] = d4[(ad + 4) >> 2];
        jn(b, 4053, a) | 0;
        d4[ac >> 2] = 11;
        d4[(ac + 4) >> 2] = 0;
        d4[a >> 2] = d4[ac >> 2];
        d4[(a + 4) >> 2] = d4[(ac + 4) >> 2];
        jn(b, 4065, a) | 0;
        d4[ab >> 2] = 12;
        d4[(ab + 4) >> 2] = 0;
        d4[a >> 2] = d4[ab >> 2];
        d4[(a + 4) >> 2] = d4[(ab + 4) >> 2];
        jn(b, 4084, a) | 0;
        d4[aa >> 2] = 13;
        d4[(aa + 4) >> 2] = 0;
        d4[a >> 2] = d4[aa >> 2];
        d4[(a + 4) >> 2] = d4[(aa + 4) >> 2];
        jn(b, 4097, a) | 0;
        d4[_ >> 2] = 14;
        d4[(_ + 4) >> 2] = 0;
        d4[a >> 2] = d4[_ >> 2];
        d4[(a + 4) >> 2] = d4[(_ + 4) >> 2];
        jn(b, 4117, a) | 0;
        d4[$ >> 2] = 15;
        d4[($ + 4) >> 2] = 0;
        d4[a >> 2] = d4[$ >> 2];
        d4[(a + 4) >> 2] = d4[($ + 4) >> 2];
        jn(b, 4129, a) | 0;
        d4[Z >> 2] = 16;
        d4[(Z + 4) >> 2] = 0;
        d4[a >> 2] = d4[Z >> 2];
        d4[(a + 4) >> 2] = d4[(Z + 4) >> 2];
        jn(b, 4148, a) | 0;
        d4[Y >> 2] = 17;
        d4[(Y + 4) >> 2] = 0;
        d4[a >> 2] = d4[Y >> 2];
        d4[(a + 4) >> 2] = d4[(Y + 4) >> 2];
        jn(b, 4161, a) | 0;
        d4[X >> 2] = 18;
        d4[(X + 4) >> 2] = 0;
        d4[a >> 2] = d4[X >> 2];
        d4[(a + 4) >> 2] = d4[(X + 4) >> 2];
        jn(b, 4181, a) | 0;
        d4[W >> 2] = 5;
        d4[(W + 4) >> 2] = 0;
        d4[a >> 2] = d4[W >> 2];
        d4[(a + 4) >> 2] = d4[(W + 4) >> 2];
        jm(b, 4196, a) | 0;
        d4[V >> 2] = 6;
        d4[(V + 4) >> 2] = 0;
        d4[a >> 2] = d4[V >> 2];
        d4[(a + 4) >> 2] = d4[(V + 4) >> 2];
        jm(b, 4206, a) | 0;
        d4[U >> 2] = 7;
        d4[(U + 4) >> 2] = 0;
        d4[a >> 2] = d4[U >> 2];
        d4[(a + 4) >> 2] = d4[(U + 4) >> 2];
        jm(b, 4217, a) | 0;
        d4[T >> 2] = 3;
        d4[(T + 4) >> 2] = 0;
        d4[a >> 2] = d4[T >> 2];
        d4[(a + 4) >> 2] = d4[(T + 4) >> 2];
        jo(b, 4235, a) | 0;
        d4[S >> 2] = 1;
        d4[(S + 4) >> 2] = 0;
        d4[a >> 2] = d4[S >> 2];
        d4[(a + 4) >> 2] = d4[(S + 4) >> 2];
        jp(b, 4251, a) | 0;
        d4[R >> 2] = 4;
        d4[(R + 4) >> 2] = 0;
        d4[a >> 2] = d4[R >> 2];
        d4[(a + 4) >> 2] = d4[(R + 4) >> 2];
        jo(b, 4263, a) | 0;
        d4[Q >> 2] = 5;
        d4[(Q + 4) >> 2] = 0;
        d4[a >> 2] = d4[Q >> 2];
        d4[(a + 4) >> 2] = d4[(Q + 4) >> 2];
        jo(b, 4279, a) | 0;
        d4[P >> 2] = 6;
        d4[(P + 4) >> 2] = 0;
        d4[a >> 2] = d4[P >> 2];
        d4[(a + 4) >> 2] = d4[(P + 4) >> 2];
        jo(b, 4293, a) | 0;
        d4[O >> 2] = 7;
        d4[(O + 4) >> 2] = 0;
        d4[a >> 2] = d4[O >> 2];
        d4[(a + 4) >> 2] = d4[(O + 4) >> 2];
        jo(b, 4306, a) | 0;
        d4[N >> 2] = 8;
        d4[(N + 4) >> 2] = 0;
        d4[a >> 2] = d4[N >> 2];
        d4[(a + 4) >> 2] = d4[(N + 4) >> 2];
        jo(b, 4323, a) | 0;
        d4[M >> 2] = 9;
        d4[(M + 4) >> 2] = 0;
        d4[a >> 2] = d4[M >> 2];
        d4[(a + 4) >> 2] = d4[(M + 4) >> 2];
        jo(b, 4335, a) | 0;
        d4[L >> 2] = 2;
        d4[(L + 4) >> 2] = 0;
        d4[a >> 2] = d4[L >> 2];
        d4[(a + 4) >> 2] = d4[(L + 4) >> 2];
        jp(b, 4353, a) | 0;
        d4[K >> 2] = 12;
        d4[(K + 4) >> 2] = 0;
        d4[a >> 2] = d4[K >> 2];
        d4[(a + 4) >> 2] = d4[(K + 4) >> 2];
        jq(b, 4363, a) | 0;
        d4[J >> 2] = 1;
        d4[(J + 4) >> 2] = 0;
        d4[a >> 2] = d4[J >> 2];
        d4[(a + 4) >> 2] = d4[(J + 4) >> 2];
        jr(b, 4376, a) | 0;
        d4[I >> 2] = 2;
        d4[(I + 4) >> 2] = 0;
        d4[a >> 2] = d4[I >> 2];
        d4[(a + 4) >> 2] = d4[(I + 4) >> 2];
        jr(b, 4388, a) | 0;
        d4[H >> 2] = 13;
        d4[(H + 4) >> 2] = 0;
        d4[a >> 2] = d4[H >> 2];
        d4[(a + 4) >> 2] = d4[(H + 4) >> 2];
        jq(b, 4402, a) | 0;
        d4[G >> 2] = 14;
        d4[(G + 4) >> 2] = 0;
        d4[a >> 2] = d4[G >> 2];
        d4[(a + 4) >> 2] = d4[(G + 4) >> 2];
        jq(b, 4411, a) | 0;
        d4[F >> 2] = 15;
        d4[(F + 4) >> 2] = 0;
        d4[a >> 2] = d4[F >> 2];
        d4[(a + 4) >> 2] = d4[(F + 4) >> 2];
        jq(b, 4421, a) | 0;
        d4[E >> 2] = 16;
        d4[(E + 4) >> 2] = 0;
        d4[a >> 2] = d4[E >> 2];
        d4[(a + 4) >> 2] = d4[(E + 4) >> 2];
        jq(b, 4433, a) | 0;
        d4[D >> 2] = 17;
        d4[(D + 4) >> 2] = 0;
        d4[a >> 2] = d4[D >> 2];
        d4[(a + 4) >> 2] = d4[(D + 4) >> 2];
        jq(b, 4446, a) | 0;
        d4[C >> 2] = 18;
        d4[(C + 4) >> 2] = 0;
        d4[a >> 2] = d4[C >> 2];
        d4[(a + 4) >> 2] = d4[(C + 4) >> 2];
        jq(b, 4458, a) | 0;
        d4[B >> 2] = 3;
        d4[(B + 4) >> 2] = 0;
        d4[a >> 2] = d4[B >> 2];
        d4[(a + 4) >> 2] = d4[(B + 4) >> 2];
        jr(b, 4471, a) | 0;
        d4[A >> 2] = 1;
        d4[(A + 4) >> 2] = 0;
        d4[a >> 2] = d4[A >> 2];
        d4[(a + 4) >> 2] = d4[(A + 4) >> 2];
        js(b, 4486, a) | 0;
        d4[z >> 2] = 10;
        d4[(z + 4) >> 2] = 0;
        d4[a >> 2] = d4[z >> 2];
        d4[(a + 4) >> 2] = d4[(z + 4) >> 2];
        jo(b, 4496, a) | 0;
        d4[y >> 2] = 11;
        d4[(y + 4) >> 2] = 0;
        d4[a >> 2] = d4[y >> 2];
        d4[(a + 4) >> 2] = d4[(y + 4) >> 2];
        jo(b, 4508, a) | 0;
        d4[x >> 2] = 3;
        d4[(x + 4) >> 2] = 0;
        d4[a >> 2] = d4[x >> 2];
        d4[(a + 4) >> 2] = d4[(x + 4) >> 2];
        jp(b, 4519, a) | 0;
        d4[w >> 2] = 4;
        d4[(w + 4) >> 2] = 0;
        d4[a >> 2] = d4[w >> 2];
        d4[(a + 4) >> 2] = d4[(w + 4) >> 2];
        jt(b, 4530, a) | 0;
        d4[v >> 2] = 19;
        d4[(v + 4) >> 2] = 0;
        d4[a >> 2] = d4[v >> 2];
        d4[(a + 4) >> 2] = d4[(v + 4) >> 2];
        ju(b, 4542, a) | 0;
        d4[u >> 2] = 12;
        d4[(u + 4) >> 2] = 0;
        d4[a >> 2] = d4[u >> 2];
        d4[(a + 4) >> 2] = d4[(u + 4) >> 2];
        jv(b, 4554, a) | 0;
        d4[t >> 2] = 13;
        d4[(t + 4) >> 2] = 0;
        d4[a >> 2] = d4[t >> 2];
        d4[(a + 4) >> 2] = d4[(t + 4) >> 2];
        jw(b, 4568, a) | 0;
        d4[s >> 2] = 2;
        d4[(s + 4) >> 2] = 0;
        d4[a >> 2] = d4[s >> 2];
        d4[(a + 4) >> 2] = d4[(s + 4) >> 2];
        jx(b, 4578, a) | 0;
        d4[r >> 2] = 20;
        d4[(r + 4) >> 2] = 0;
        d4[a >> 2] = d4[r >> 2];
        d4[(a + 4) >> 2] = d4[(r + 4) >> 2];
        jy(b, 4587, a) | 0;
        d4[q >> 2] = 22;
        d4[(q + 4) >> 2] = 0;
        d4[a >> 2] = d4[q >> 2];
        d4[(a + 4) >> 2] = d4[(q + 4) >> 2];
        jj(b, 4602, a) | 0;
        d4[p >> 2] = 23;
        d4[(p + 4) >> 2] = 0;
        d4[a >> 2] = d4[p >> 2];
        d4[(a + 4) >> 2] = d4[(p + 4) >> 2];
        jj(b, 4619, a) | 0;
        d4[o >> 2] = 14;
        d4[(o + 4) >> 2] = 0;
        d4[a >> 2] = d4[o >> 2];
        d4[(a + 4) >> 2] = d4[(o + 4) >> 2];
        jz(b, 4629, a) | 0;
        d4[n >> 2] = 1;
        d4[(n + 4) >> 2] = 0;
        d4[a >> 2] = d4[n >> 2];
        d4[(a + 4) >> 2] = d4[(n + 4) >> 2];
        jA(b, 4637, a) | 0;
        d4[m >> 2] = 4;
        d4[(m + 4) >> 2] = 0;
        d4[a >> 2] = d4[m >> 2];
        d4[(a + 4) >> 2] = d4[(m + 4) >> 2];
        jr(b, 4653, a) | 0;
        d4[l >> 2] = 5;
        d4[(l + 4) >> 2] = 0;
        d4[a >> 2] = d4[l >> 2];
        d4[(a + 4) >> 2] = d4[(l + 4) >> 2];
        jr(b, 4669, a) | 0;
        d4[k >> 2] = 6;
        d4[(k + 4) >> 2] = 0;
        d4[a >> 2] = d4[k >> 2];
        d4[(a + 4) >> 2] = d4[(k + 4) >> 2];
        jr(b, 4686, a) | 0;
        d4[j >> 2] = 7;
        d4[(j + 4) >> 2] = 0;
        d4[a >> 2] = d4[j >> 2];
        d4[(a + 4) >> 2] = d4[(j + 4) >> 2];
        jr(b, 4701, a) | 0;
        d4[i >> 2] = 8;
        d4[(i + 4) >> 2] = 0;
        d4[a >> 2] = d4[i >> 2];
        d4[(a + 4) >> 2] = d4[(i + 4) >> 2];
        jr(b, 4719, a) | 0;
        d4[h >> 2] = 9;
        d4[(h + 4) >> 2] = 0;
        d4[a >> 2] = d4[h >> 2];
        d4[(a + 4) >> 2] = d4[(h + 4) >> 2];
        jr(b, 4736, a) | 0;
        d4[g >> 2] = 21;
        d4[(g + 4) >> 2] = 0;
        d4[a >> 2] = d4[g >> 2];
        d4[(a + 4) >> 2] = d4[(g + 4) >> 2];
        jB(b, 4754, a) | 0;
        d4[f >> 2] = 2;
        d4[(f + 4) >> 2] = 0;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        js(b, 4772, a) | 0;
        d4[e >> 2] = 3;
        d4[(e + 4) >> 2] = 0;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        js(b, 4790, a) | 0;
        d4[d >> 2] = 4;
        d4[(d + 4) >> 2] = 0;
        d4[a >> 2] = d4[d >> 2];
        d4[(a + 4) >> 2] = d4[(d + 4) >> 2];
        js(b, 4808, a) | 0;
        ed = c;
        return;
    }
    function jf(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = qq() | 0;
        d4[a >> 2] = c;
        qr(c, b);
        tI(d4[a >> 2] | 0);
        return;
    }
    function jg(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        qb(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function jh(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        pU(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function ji(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        pF(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function jj(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        po(b, f, e);
        ed = d;
        return b | 0;
    }
    function jk(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        o4(b, f, e);
        ed = d;
        return b | 0;
    }
    function jl(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        oP(b, f, e);
        ed = d;
        return b | 0;
    }
    function jm(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        oy(b, f, e);
        ed = d;
        return b | 0;
    }
    function jn(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        oh(b, f, e);
        ed = d;
        return b | 0;
    }
    function jo(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        n0(b, f, e);
        ed = d;
        return b | 0;
    }
    function jp(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        nL(b, f, e);
        ed = d;
        return b | 0;
    }
    function jq(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        ni(b, f, e);
        ed = d;
        return b | 0;
    }
    function jr(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        m1(b, f, e);
        ed = d;
        return b | 0;
    }
    function js(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        mM(b, f, e);
        ed = d;
        return b | 0;
    }
    function jt(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        mv(b, f, e);
        ed = d;
        return b | 0;
    }
    function ju(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        mb(b, f, e);
        ed = d;
        return b | 0;
    }
    function jv(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        lV(b, f, e);
        ed = d;
        return b | 0;
    }
    function jw(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        lE(b, f, e);
        ed = d;
        return b | 0;
    }
    function jx(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        lj(b, f, e);
        ed = d;
        return b | 0;
    }
    function jy(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        kZ(b, f, e);
        ed = d;
        return b | 0;
    }
    function jz(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        kH(b, f, e);
        ed = d;
        return b | 0;
    }
    function jA(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        kk(b, f, e);
        ed = d;
        return b | 0;
    }
    function jB(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        jC(b, f, e);
        ed = d;
        return b | 0;
    }
    function jC(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        jE(e, a, d, 1);
        ed = c;
        return;
    }
    function jD(a) {
        a = a | 0;
        return a | 0;
    }
    function jE(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = jF() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = jG(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, jH(a, g) | 0, g);
        ed = d;
        return;
    }
    function jF() {
        var a = 0, b = 0;
        if (!(d2[7616] | 0)) {
            jT(9136);
            fo(24, 9136, eg | 0) | 0;
            b = 7616;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9136) | 0)) {
            a = 9136;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            jT(9136);
        }
        return 9136;
    }
    function jG(a) {
        a = a | 0;
        return 0;
    }
    function jH(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = jF() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            jN(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            jO(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function jI(c, d, e, f, g, b) {
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        b = b | 0;
        var a = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        a = ed;
        ed = (ed + 32) | 0;
        m = (a + 24) | 0;
        l = (a + 20) | 0;
        i = (a + 16) | 0;
        k = (a + 12) | 0;
        j = (a + 8) | 0;
        h = (a + 4) | 0;
        n = a;
        d4[l >> 2] = d;
        d4[i >> 2] = e;
        d4[k >> 2] = f;
        d4[j >> 2] = g;
        d4[h >> 2] = b;
        b = (c + 28) | 0;
        d4[n >> 2] = d4[b >> 2];
        d4[m >> 2] = d4[n >> 2];
        jJ((c + 24) | 0, m, l, k, j, i, h) | 0;
        d4[b >> 2] = d4[d4[b >> 2] >> 2];
        ed = a;
        return;
    }
    function jJ(b, a, c, d, e, f, g) {
        b = b | 0;
        a = a | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        b = jK(a) | 0;
        a = yH(24) | 0;
        jL((a + 4) | 0, d4[c >> 2] | 0, d4[d >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0, d4[g >> 2] | 0);
        d4[a >> 2] = d4[b >> 2];
        d4[b >> 2] = a;
        return a | 0;
    }
    function jK(a) {
        a = a | 0;
        return d4[a >> 2] | 0;
    }
    function jL(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        d4[(a + 8) >> 2] = d;
        d4[(a + 12) >> 2] = e;
        d4[(a + 16) >> 2] = f;
        return;
    }
    function jM(a, b) {
        a = a | 0;
        b = b | 0;
        return b | a | 0;
    }
    function jN(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function jO(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = jP(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            jQ(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            jN(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            jR(a, g);
            jS(g);
            ed = h;
            return;
        }
    }
    function jP(a) {
        a = a | 0;
        return 357913941;
    }
    function jQ(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function jR(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function jS(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function jT(a) {
        a = a | 0;
        jW(a);
        return;
    }
    function a9(a) {
        a = a | 0;
        jV((a + 24) | 0);
        return;
    }
    function jU(a) {
        a = a | 0;
        return d4[a >> 2] | 0;
    }
    function jV(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function jW(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 3, b, jY() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function jX() {
        return 9228;
    }
    function jY() {
        return 1140;
    }
    function ba(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, c = 0, f = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        c = d;
        f = j$(a) | 0;
        a = d4[(f + 4) >> 2] | 0;
        d4[c >> 2] = d4[f >> 2];
        d4[(c + 4) >> 2] = a;
        d4[e >> 2] = d4[c >> 2];
        d4[(e + 4) >> 2] = d4[(c + 4) >> 2];
        b = j_(b, e) | 0;
        ed = d;
        return b | 0;
    }
    function jZ(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        d4[(a + 8) >> 2] = d;
        d4[(a + 12) >> 2] = e;
        d4[(a + 16) >> 2] = f;
        return;
    }
    function j$(a) {
        a = a | 0;
        return ((d4[((jF() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function j_(b, a) {
        b = b | 0;
        a = a | 0;
        var d = 0, c = 0, e = 0;
        e = ed;
        ed = (ed + 48) | 0;
        c = e;
        d = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) d = d4[((d4[b >> 2] | 0) + d) >> 2] | 0;
        yT[d & 31](c, b);
        c = j0(c) | 0;
        ed = e;
        return c | 0;
    }
    function j0(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, c = 0;
        c = ed;
        ed = (ed + 32) | 0;
        b = (c + 12) | 0;
        d = c;
        e = j2(j1() | 0) | 0;
        if (!e) a = j7(a) | 0;
        else {
            j3(b, e);
            j4(d, b);
            j5(a, d);
            a = j6(b) | 0;
        }
        ed = c;
        return a | 0;
    }
    function j1() {
        var a = 0;
        if (!(d2[7632] | 0)) {
            kf(9184);
            fo(25, 9184, eg | 0) | 0;
            a = 7632;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 9184;
    }
    function j2(a) {
        a = a | 0;
        return d4[(a + 36) >> 2] | 0;
    }
    function j3(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = a;
        d4[(a + 8) >> 2] = 0;
        return;
    }
    function j4(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d4[(b + 4) >> 2];
        d4[(a + 8) >> 2] = 0;
        return;
    }
    function j5(a, b) {
        a = a | 0;
        b = b | 0;
        j9(b, a, (a + 8) | 0, (a + 16) | 0, (a + 24) | 0, (a + 32) | 0, (a + 40) | 0) | 0;
        return;
    }
    function j6(a) {
        a = a | 0;
        return d4[((d4[(a + 4) >> 2] | 0) + 8) >> 2] | 0;
    }
    function j7(b) {
        b = b | 0;
        var c = 0, f = 0, g = 0, h = 0, i = 0, d = 0, a = 0, e = 0;
        e = ed;
        ed = (ed + 16) | 0;
        f = (e + 4) | 0;
        g = e;
        h = cJ(8) | 0;
        i = h;
        d = yH(48) | 0;
        a = d;
        c = (a + 48) | 0;
        do {
            d4[a >> 2] = d4[b >> 2];
            a = (a + 4) | 0;
            b = (b + 4) | 0;
        }while ((a | 0) < (c | 0))
        c = (i + 4) | 0;
        d4[c >> 2] = d;
        a = yH(8) | 0;
        d = d4[c >> 2] | 0;
        d4[g >> 2] = 0;
        d4[f >> 2] = d4[g >> 2];
        j8(a, d, f);
        d4[h >> 2] = a;
        ed = e;
        return i | 0;
    }
    function j8(b, c, a) {
        b = b | 0;
        c = c | 0;
        a = a | 0;
        d4[b >> 2] = c;
        a = yH(16) | 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        d4[a >> 2] = 1092;
        d4[(a + 12) >> 2] = c;
        d4[(b + 4) >> 2] = a;
        return;
    }
    function bb(a) {
        a = a | 0;
        c9(a);
        yJ(a);
        return;
    }
    function bc(a) {
        a = a | 0;
        a = d4[(a + 12) >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function bd(a) {
        a = a | 0;
        yJ(a);
        return;
    }
    function j9(c, d, e, f, g, b, a) {
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        b = b | 0;
        a = a | 0;
        b = ka(d4[c >> 2] | 0, d, e, f, g, b, a) | 0;
        a = (c + 4) | 0;
        d4[((d4[a >> 2] | 0) + 8) >> 2] = b;
        return d4[((d4[a >> 2] | 0) + 8) >> 2] | 0;
    }
    function ka(a, c, d, e, f, g, b) {
        a = a | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        b = b | 0;
        var h = 0, i = 0;
        h = ed;
        ed = (ed + 16) | 0;
        i = h;
        xD(i);
        a = iT(a) | 0;
        b = kb(a, +d9[c >> 3], +d9[d >> 3], +d9[e >> 3], +d9[f >> 3], +d9[g >> 3], +d9[b >> 3]) | 0;
        xF(i);
        ed = h;
        return b | 0;
    }
    function kb(f, a, b, c, d, e, g) {
        f = f | 0;
        a = +a;
        b = +b;
        c = +c;
        d = +d;
        e = +e;
        g = +g;
        var h = 0;
        h = iW(kc() | 0) | 0;
        a = +iX(a);
        b = +iX(b);
        c = +iX(c);
        d = +iX(d);
        e = +iX(e);
        return ff(0, h | 0, f | 0, +a, +b, +c, +d, +e, +(+iX(g))) | 0;
    }
    function kc() {
        var a = 0;
        if (!(d2[7624] | 0)) {
            kd(9172);
            a = 7624;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 9172;
    }
    function kd(a) {
        a = a | 0;
        i6(a, ke() | 0, 6);
        return;
    }
    function ke() {
        return 1112;
    }
    function kf(a) {
        a = a | 0;
        kj(a);
        return;
    }
    function be(a) {
        a = a | 0;
        bf((a + 24) | 0);
        kg((a + 16) | 0);
        return;
    }
    function bf(a) {
        a = a | 0;
        ki(a);
        return;
    }
    function kg(a) {
        a = a | 0;
        kh(a);
        return;
    }
    function kh(b) {
        b = b | 0;
        var a = 0, c = 0;
        a = d4[b >> 2] | 0;
        if (a | 0) do {
            c = a;
            a = d4[a >> 2] | 0;
            yJ(c);
        }while ((a | 0) != 0)
        d4[b >> 2] = 0;
        return;
    }
    function ki(b) {
        b = b | 0;
        var a = 0, c = 0;
        a = d4[b >> 2] | 0;
        if (a | 0) do {
            c = a;
            a = d4[a >> 2] | 0;
            yJ(c);
        }while ((a | 0) != 0)
        d4[b >> 2] = 0;
        return;
    }
    function kj(a) {
        a = a | 0;
        var b = 0;
        d4[(a + 16) >> 2] = 0;
        d4[(a + 20) >> 2] = 0;
        b = (a + 24) | 0;
        d4[b >> 2] = 0;
        d4[(a + 28) >> 2] = b;
        d4[(a + 36) >> 2] = 0;
        d2[(a + 40) >> 0] = 0;
        d2[(a + 41) >> 0] = 0;
        return;
    }
    function kk(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        kl(e, a, d, 0);
        ed = c;
        return;
    }
    function kl(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = km() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = kn(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, ko(a, g) | 0, g);
        ed = d;
        return;
    }
    function km() {
        var a = 0, b = 0;
        if (!(d2[7640] | 0)) {
            kv(9232);
            fo(26, 9232, eg | 0) | 0;
            b = 7640;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9232) | 0)) {
            a = 9232;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            kv(9232);
        }
        return 9232;
    }
    function kn(a) {
        a = a | 0;
        return 0;
    }
    function ko(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = km() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            kp(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            kq(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function kp(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function kq(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = kr(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            ks(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            kp(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            kt(a, g);
            ku(g);
            ed = h;
            return;
        }
    }
    function kr(a) {
        a = a | 0;
        return 357913941;
    }
    function ks(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function kt(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function ku(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function kv(a) {
        a = a | 0;
        kx(a);
        return;
    }
    function bg(a) {
        a = a | 0;
        kw((a + 24) | 0);
        return;
    }
    function kw(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function kx(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 1, b, ky() | 0, 3);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function ky() {
        return 1144;
    }
    function bh(a, e, f, g, h) {
        a = a | 0;
        e = e | 0;
        f = +f;
        g = +g;
        h = h | 0;
        var c = 0, d = 0, b = 0, i = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        i = kz(a) | 0;
        a = d4[(i + 4) >> 2] | 0;
        d4[b >> 2] = d4[i >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        kA(e, d, f, g, h);
        ed = c;
        return;
    }
    function kz(a) {
        a = a | 0;
        return ((d4[((km() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function kA(b, a, c, d, g) {
        b = b | 0;
        a = a | 0;
        c = +c;
        d = +d;
        g = g | 0;
        var h = 0, i = 0, j = 0, e = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        i = (f + 2) | 0;
        j = (f + 1) | 0;
        e = f;
        h = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) h = d4[((d4[b >> 2] | 0) + h) >> 2] | 0;
        kB(i, c);
        c = +kC(i, c);
        kB(j, d);
        d = +kC(j, d);
        kD(e, g);
        e = kE(e, g) | 0;
        yV[h & 1](b, c, d, e);
        ed = f;
        return;
    }
    function kB(a, b) {
        a = a | 0;
        b = +b;
        return;
    }
    function kC(b, a) {
        b = b | 0;
        a = +a;
        return +(+kG(a));
    }
    function kD(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function kE(b, a) {
        b = b | 0;
        a = a | 0;
        return kF(a) | 0;
    }
    function kF(a) {
        a = a | 0;
        return a | 0;
    }
    function kG(a) {
        a = +a;
        return +a;
    }
    function kH(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        kI(e, a, d, 1);
        ed = c;
        return;
    }
    function kI(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = kJ() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = kK(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, kL(a, g) | 0, g);
        ed = d;
        return;
    }
    function kJ() {
        var a = 0, b = 0;
        if (!(d2[7648] | 0)) {
            kS(9268);
            fo(27, 9268, eg | 0) | 0;
            b = 7648;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9268) | 0)) {
            a = 9268;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            kS(9268);
        }
        return 9268;
    }
    function kK(a) {
        a = a | 0;
        return 0;
    }
    function kL(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = kJ() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            kM(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            kN(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function kM(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function kN(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = kO(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            kP(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            kM(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            kQ(a, g);
            kR(g);
            ed = h;
            return;
        }
    }
    function kO(a) {
        a = a | 0;
        return 357913941;
    }
    function kP(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function kQ(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function kR(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function kS(a) {
        a = a | 0;
        kU(a);
        return;
    }
    function bi(a) {
        a = a | 0;
        kT((a + 24) | 0);
        return;
    }
    function kT(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function kU(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 4, b, kV() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function kV() {
        return 1160;
    }
    function bj(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, c = 0, f = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        c = d;
        f = kW(a) | 0;
        a = d4[(f + 4) >> 2] | 0;
        d4[c >> 2] = d4[f >> 2];
        d4[(c + 4) >> 2] = a;
        d4[e >> 2] = d4[c >> 2];
        d4[(e + 4) >> 2] = d4[(c + 4) >> 2];
        b = kX(b, e) | 0;
        ed = d;
        return b | 0;
    }
    function kW(a) {
        a = a | 0;
        return ((d4[((kJ() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function kX(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0;
        c = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) c = d4[((d4[b >> 2] | 0) + c) >> 2] | 0;
        return kY(yU[c & 31](b) | 0) | 0;
    }
    function kY(a) {
        a = a | 0;
        return (a & 1) | 0;
    }
    function kZ(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        k$(e, a, d, 0);
        ed = c;
        return;
    }
    function k$(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = k_() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = k0(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, k1(a, g) | 0, g);
        ed = d;
        return;
    }
    function k_() {
        var a = 0, b = 0;
        if (!(d2[7656] | 0)) {
            k8(9304);
            fo(28, 9304, eg | 0) | 0;
            b = 7656;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9304) | 0)) {
            a = 9304;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            k8(9304);
        }
        return 9304;
    }
    function k0(a) {
        a = a | 0;
        return 0;
    }
    function k1(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = k_() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            k2(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            k3(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function k2(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function k3(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = k4(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            k5(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            k2(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            k6(a, g);
            k7(g);
            ed = h;
            return;
        }
    }
    function k4(a) {
        a = a | 0;
        return 357913941;
    }
    function k5(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function k6(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function k7(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function k8(a) {
        a = a | 0;
        la(a);
        return;
    }
    function bk(a) {
        a = a | 0;
        k9((a + 24) | 0);
        return;
    }
    function k9(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function la(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 5, b, lb() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function lb() {
        return 1164;
    }
    function bl(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var c = 0, d = 0, b = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        g = lc(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[b >> 2] = d4[g >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        ld(e, d, f);
        ed = c;
        return;
    }
    function lc(a) {
        a = a | 0;
        return ((d4[((k_() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function ld(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = c | 0;
        var d = 0, e = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        e = f;
        d = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) d = d4[((d4[b >> 2] | 0) + d) >> 2] | 0;
        le(e, c);
        c = lf(e, c) | 0;
        yT[d & 31](b, c);
        lg(e);
        ed = f;
        return;
    }
    function le(a, b) {
        a = a | 0;
        b = b | 0;
        lh(a, b);
        return;
    }
    function lf(a, b) {
        a = a | 0;
        b = b | 0;
        return a | 0;
    }
    function lg(a) {
        a = a | 0;
        iL(a);
        return;
    }
    function lh(a, b) {
        a = a | 0;
        b = b | 0;
        li(a, b);
        return;
    }
    function li(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = b;
        return;
    }
    function lj(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        lk(e, a, d, 0);
        ed = c;
        return;
    }
    function lk(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = ll() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = lm(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, ln(a, g) | 0, g);
        ed = d;
        return;
    }
    function ll() {
        var a = 0, b = 0;
        if (!(d2[7664] | 0)) {
            lu(9340);
            fo(29, 9340, eg | 0) | 0;
            b = 7664;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9340) | 0)) {
            a = 9340;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            lu(9340);
        }
        return 9340;
    }
    function lm(a) {
        a = a | 0;
        return 0;
    }
    function ln(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = ll() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            lo(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            lp(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function lo(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function lp(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = lq(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            lr(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            lo(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            ls(a, g);
            lt(g);
            ed = h;
            return;
        }
    }
    function lq(a) {
        a = a | 0;
        return 357913941;
    }
    function lr(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function ls(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function lt(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function lu(a) {
        a = a | 0;
        lw(a);
        return;
    }
    function bm(a) {
        a = a | 0;
        lv((a + 24) | 0);
        return;
    }
    function lv(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function lw(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 4, b, lx() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function lx() {
        return 1180;
    }
    function bn(a, f, b) {
        a = a | 0;
        f = f | 0;
        b = b | 0;
        var d = 0, e = 0, c = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        c = d;
        g = ly(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[c >> 2] = d4[g >> 2];
        d4[(c + 4) >> 2] = a;
        d4[e >> 2] = d4[c >> 2];
        d4[(e + 4) >> 2] = d4[(c + 4) >> 2];
        b = lz(f, e, b) | 0;
        ed = d;
        return b | 0;
    }
    function ly(a) {
        a = a | 0;
        return ((d4[((ll() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function lz(c, a, d) {
        c = c | 0;
        a = a | 0;
        d = d | 0;
        var e = 0, b = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        b = f;
        e = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        c = (c + (a >> 1)) | 0;
        if (a & 1) e = d4[((d4[c >> 2] | 0) + e) >> 2] | 0;
        lA(b, d);
        b = lB(b, d) | 0;
        b = lC(y_[e & 15](c, b) | 0) | 0;
        ed = f;
        return b | 0;
    }
    function lA(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function lB(b, a) {
        b = b | 0;
        a = a | 0;
        return lD(a) | 0;
    }
    function lC(a) {
        a = a | 0;
        return a | 0;
    }
    function lD(a) {
        a = a | 0;
        return a | 0;
    }
    function lE(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        lF(e, a, d, 0);
        ed = c;
        return;
    }
    function lF(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = lG() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = lH(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, lI(a, g) | 0, g);
        ed = d;
        return;
    }
    function lG() {
        var a = 0, b = 0;
        if (!(d2[7672] | 0)) {
            lP(9376);
            fo(30, 9376, eg | 0) | 0;
            b = 7672;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9376) | 0)) {
            a = 9376;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            lP(9376);
        }
        return 9376;
    }
    function lH(a) {
        a = a | 0;
        return 0;
    }
    function lI(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = lG() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            lJ(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            lK(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function lJ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function lK(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = lL(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            lM(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            lJ(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            lN(a, g);
            lO(g);
            ed = h;
            return;
        }
    }
    function lL(a) {
        a = a | 0;
        return 357913941;
    }
    function lM(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function lN(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function lO(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function lP(a) {
        a = a | 0;
        lR(a);
        return;
    }
    function bo(a) {
        a = a | 0;
        lQ((a + 24) | 0);
        return;
    }
    function lQ(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function lR(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 5, b, lS() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function lS() {
        return 1196;
    }
    function bp(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, c = 0, f = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        c = d;
        f = lT(a) | 0;
        a = d4[(f + 4) >> 2] | 0;
        d4[c >> 2] = d4[f >> 2];
        d4[(c + 4) >> 2] = a;
        d4[e >> 2] = d4[c >> 2];
        d4[(e + 4) >> 2] = d4[(c + 4) >> 2];
        b = lU(b, e) | 0;
        ed = d;
        return b | 0;
    }
    function lT(a) {
        a = a | 0;
        return ((d4[((lG() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function lU(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0;
        c = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) c = d4[((d4[b >> 2] | 0) + c) >> 2] | 0;
        return lC(yU[c & 31](b) | 0) | 0;
    }
    function lV(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        lW(e, a, d, 1);
        ed = c;
        return;
    }
    function lW(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = lX() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = lY(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, lZ(a, g) | 0, g);
        ed = d;
        return;
    }
    function lX() {
        var a = 0, b = 0;
        if (!(d2[7680] | 0)) {
            l4(9412);
            fo(31, 9412, eg | 0) | 0;
            b = 7680;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9412) | 0)) {
            a = 9412;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            l4(9412);
        }
        return 9412;
    }
    function lY(a) {
        a = a | 0;
        return 0;
    }
    function lZ(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = lX() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            l$(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            l_(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function l$(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function l_(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = l0(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            l1(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            l$(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            l2(a, g);
            l3(g);
            ed = h;
            return;
        }
    }
    function l0(a) {
        a = a | 0;
        return 357913941;
    }
    function l1(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function l2(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function l3(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function l4(a) {
        a = a | 0;
        l6(a);
        return;
    }
    function bq(a) {
        a = a | 0;
        l5((a + 24) | 0);
        return;
    }
    function l5(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function l6(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 6, b, l7() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function l7() {
        return 1200;
    }
    function br(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, c = 0, f = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        c = d;
        f = l8(a) | 0;
        a = d4[(f + 4) >> 2] | 0;
        d4[c >> 2] = d4[f >> 2];
        d4[(c + 4) >> 2] = a;
        d4[e >> 2] = d4[c >> 2];
        d4[(e + 4) >> 2] = d4[(c + 4) >> 2];
        b = l9(b, e) | 0;
        ed = d;
        return b | 0;
    }
    function l8(a) {
        a = a | 0;
        return ((d4[((lX() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function l9(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0;
        c = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) c = d4[((d4[b >> 2] | 0) + c) >> 2] | 0;
        return ma(yU[c & 31](b) | 0) | 0;
    }
    function ma(a) {
        a = a | 0;
        return a | 0;
    }
    function mb(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        mc(e, a, d, 0);
        ed = c;
        return;
    }
    function mc(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = md() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = me(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, mf(a, g) | 0, g);
        ed = d;
        return;
    }
    function md() {
        var a = 0, b = 0;
        if (!(d2[7688] | 0)) {
            mm(9448);
            fo(32, 9448, eg | 0) | 0;
            b = 7688;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9448) | 0)) {
            a = 9448;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            mm(9448);
        }
        return 9448;
    }
    function me(a) {
        a = a | 0;
        return 0;
    }
    function mf(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = md() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            mg(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            mh(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function mg(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function mh(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = mi(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            mj(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            mg(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            mk(a, g);
            ml(g);
            ed = h;
            return;
        }
    }
    function mi(a) {
        a = a | 0;
        return 357913941;
    }
    function mj(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function mk(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function ml(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function mm(a) {
        a = a | 0;
        mo(a);
        return;
    }
    function bs(a) {
        a = a | 0;
        mn((a + 24) | 0);
        return;
    }
    function mn(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function mo(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 6, b, mp() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function mp() {
        return 1204;
    }
    function bt(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var c = 0, d = 0, b = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        g = mq(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[b >> 2] = d4[g >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        mr(e, d, f);
        ed = c;
        return;
    }
    function mq(a) {
        a = a | 0;
        return ((d4[((md() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function mr(b, a, d) {
        b = b | 0;
        a = a | 0;
        d = d | 0;
        var e = 0, c = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        c = f;
        e = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) e = d4[((d4[b >> 2] | 0) + e) >> 2] | 0;
        ms(c, d);
        c = mt(c, d) | 0;
        yT[e & 31](b, c);
        ed = f;
        return;
    }
    function ms(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function mt(b, a) {
        b = b | 0;
        a = a | 0;
        return mu(a) | 0;
    }
    function mu(a) {
        a = a | 0;
        return a | 0;
    }
    function mv(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        mw(e, a, d, 0);
        ed = c;
        return;
    }
    function mw(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = mx() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = my(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, mz(a, g) | 0, g);
        ed = d;
        return;
    }
    function mx() {
        var a = 0, b = 0;
        if (!(d2[7696] | 0)) {
            mG(9484);
            fo(33, 9484, eg | 0) | 0;
            b = 7696;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9484) | 0)) {
            a = 9484;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            mG(9484);
        }
        return 9484;
    }
    function my(a) {
        a = a | 0;
        return 0;
    }
    function mz(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = mx() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            mA(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            mB(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function mA(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function mB(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = mC(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            mD(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            mA(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            mE(a, g);
            mF(g);
            ed = h;
            return;
        }
    }
    function mC(a) {
        a = a | 0;
        return 357913941;
    }
    function mD(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function mE(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function mF(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function mG(a) {
        a = a | 0;
        mI(a);
        return;
    }
    function bu(a) {
        a = a | 0;
        mH((a + 24) | 0);
        return;
    }
    function mH(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function mI(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 1, b, mJ() | 0, 2);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function mJ() {
        return 1212;
    }
    function bv(a, e, f, g) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var c = 0, d = 0, b = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = mK(a) | 0;
        a = d4[(h + 4) >> 2] | 0;
        d4[b >> 2] = d4[h >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        mL(e, d, f, g);
        ed = c;
        return;
    }
    function mK(a) {
        a = a | 0;
        return ((d4[((mx() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function mL(b, a, e, f) {
        b = b | 0;
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, c = 0, d = 0, h = 0;
        h = ed;
        ed = (ed + 16) | 0;
        c = (h + 1) | 0;
        d = h;
        g = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) g = d4[((d4[b >> 2] | 0) + g) >> 2] | 0;
        ms(c, e);
        c = mt(c, e) | 0;
        lA(d, f);
        d = lB(d, f) | 0;
        y7[g & 15](b, c, d);
        ed = h;
        return;
    }
    function mM(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        mN(e, a, d, 1);
        ed = c;
        return;
    }
    function mN(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = mO() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = mP(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, mQ(a, g) | 0, g);
        ed = d;
        return;
    }
    function mO() {
        var a = 0, b = 0;
        if (!(d2[7704] | 0)) {
            mX(9520);
            fo(34, 9520, eg | 0) | 0;
            b = 7704;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9520) | 0)) {
            a = 9520;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            mX(9520);
        }
        return 9520;
    }
    function mP(a) {
        a = a | 0;
        return 0;
    }
    function mQ(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = mO() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            mR(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            mS(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function mR(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function mS(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = mT(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            mU(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            mR(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            mV(a, g);
            mW(g);
            ed = h;
            return;
        }
    }
    function mT(a) {
        a = a | 0;
        return 357913941;
    }
    function mU(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function mV(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function mW(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function mX(a) {
        a = a | 0;
        mZ(a);
        return;
    }
    function bw(a) {
        a = a | 0;
        mY((a + 24) | 0);
        return;
    }
    function mY(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function mZ(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 1, b, m$() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function m$() {
        return 1224;
    }
    function bx(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var h = 0.0, c = 0, d = 0, b = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        g = m_(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[b >> 2] = d4[g >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        h = +m0(e, d, f);
        ed = c;
        return +h;
    }
    function m_(a) {
        a = a | 0;
        return ((d4[((mO() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function m0(b, a, d) {
        b = b | 0;
        a = a | 0;
        d = d | 0;
        var e = 0, c = 0, f = 0, g = 0.0;
        f = ed;
        ed = (ed + 16) | 0;
        c = f;
        e = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) e = d4[((d4[b >> 2] | 0) + e) >> 2] | 0;
        kD(c, d);
        c = kE(c, d) | 0;
        g = +i3(+y2[e & 7](b, c));
        ed = f;
        return +g;
    }
    function m1(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        m2(e, a, d, 1);
        ed = c;
        return;
    }
    function m2(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = m3() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = m4(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, m5(a, g) | 0, g);
        ed = d;
        return;
    }
    function m3() {
        var a = 0, b = 0;
        if (!(d2[7712] | 0)) {
            nc(9556);
            fo(35, 9556, eg | 0) | 0;
            b = 7712;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9556) | 0)) {
            a = 9556;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            nc(9556);
        }
        return 9556;
    }
    function m4(a) {
        a = a | 0;
        return 0;
    }
    function m5(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = m3() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            m6(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            m7(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function m6(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function m7(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = m8(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            m9(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            m6(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            na(a, g);
            nb(g);
            ed = h;
            return;
        }
    }
    function m8(a) {
        a = a | 0;
        return 357913941;
    }
    function m9(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function na(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function nb(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function nc(a) {
        a = a | 0;
        ne(a);
        return;
    }
    function by(a) {
        a = a | 0;
        nd((a + 24) | 0);
        return;
    }
    function nd(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function ne(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 5, b, nf() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function nf() {
        return 1232;
    }
    function bz(a, e) {
        a = a | 0;
        e = e | 0;
        var g = 0.0, c = 0, d = 0, b = 0, f = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        f = ng(a) | 0;
        a = d4[(f + 4) >> 2] | 0;
        d4[b >> 2] = d4[f >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        g = +nh(e, d);
        ed = c;
        return +g;
    }
    function ng(a) {
        a = a | 0;
        return ((d4[((m3() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function nh(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0;
        c = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) c = d4[((d4[b >> 2] | 0) + c) >> 2] | 0;
        return +(+i3(+yZ[c & 15](b)));
    }
    function ni(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        nj(e, a, d, 1);
        ed = c;
        return;
    }
    function nj(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = nk() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = nl(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, nm(a, g) | 0, g);
        ed = d;
        return;
    }
    function nk() {
        var a = 0, b = 0;
        if (!(d2[7720] | 0)) {
            nt(9592);
            fo(36, 9592, eg | 0) | 0;
            b = 7720;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9592) | 0)) {
            a = 9592;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            nt(9592);
        }
        return 9592;
    }
    function nl(a) {
        a = a | 0;
        return 0;
    }
    function nm(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = nk() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            nn(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            no(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function nn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function no(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = np(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            nq(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            nn(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            nr(a, g);
            ns(g);
            ed = h;
            return;
        }
    }
    function np(a) {
        a = a | 0;
        return 357913941;
    }
    function nq(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function nr(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function ns(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function nt(a) {
        a = a | 0;
        nv(a);
        return;
    }
    function bA(a) {
        a = a | 0;
        nu((a + 24) | 0);
        return;
    }
    function nu(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function nv(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 7, b, nw() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function nw() {
        return 1276;
    }
    function bB(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, c = 0, f = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        c = d;
        f = nx(a) | 0;
        a = d4[(f + 4) >> 2] | 0;
        d4[c >> 2] = d4[f >> 2];
        d4[(c + 4) >> 2] = a;
        d4[e >> 2] = d4[c >> 2];
        d4[(e + 4) >> 2] = d4[(c + 4) >> 2];
        b = ny(b, e) | 0;
        ed = d;
        return b | 0;
    }
    function nx(a) {
        a = a | 0;
        return ((d4[((nk() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function ny(b, a) {
        b = b | 0;
        a = a | 0;
        var d = 0, c = 0, e = 0;
        e = ed;
        ed = (ed + 16) | 0;
        c = e;
        d = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) d = d4[((d4[b >> 2] | 0) + d) >> 2] | 0;
        yT[d & 31](c, b);
        c = nz(c) | 0;
        ed = e;
        return c | 0;
    }
    function nz(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, c = 0;
        c = ed;
        ed = (ed + 32) | 0;
        b = (c + 12) | 0;
        d = c;
        e = j2(nA() | 0) | 0;
        if (!e) a = nC(a) | 0;
        else {
            j3(b, e);
            j4(d, b);
            nB(a, d);
            a = j6(b) | 0;
        }
        ed = c;
        return a | 0;
    }
    function nA() {
        var a = 0;
        if (!(d2[7736] | 0)) {
            nK(9640);
            fo(25, 9640, eg | 0) | 0;
            a = 7736;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 9640;
    }
    function nB(a, b) {
        a = a | 0;
        b = b | 0;
        nE(b, a, (a + 8) | 0) | 0;
        return;
    }
    function nC(a) {
        a = a | 0;
        var e = 0, d = 0, f = 0, g = 0, c = 0, h = 0, b = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = (d + 4) | 0;
        h = d;
        f = cJ(8) | 0;
        e = f;
        b = yH(16) | 0;
        d4[b >> 2] = d4[a >> 2];
        d4[(b + 4) >> 2] = d4[(a + 4) >> 2];
        d4[(b + 8) >> 2] = d4[(a + 8) >> 2];
        d4[(b + 12) >> 2] = d4[(a + 12) >> 2];
        c = (e + 4) | 0;
        d4[c >> 2] = b;
        a = yH(8) | 0;
        c = d4[c >> 2] | 0;
        d4[h >> 2] = 0;
        d4[g >> 2] = d4[h >> 2];
        nD(a, c, g);
        d4[f >> 2] = a;
        ed = d;
        return e | 0;
    }
    function nD(b, c, a) {
        b = b | 0;
        c = c | 0;
        a = a | 0;
        d4[b >> 2] = c;
        a = yH(16) | 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        d4[a >> 2] = 1244;
        d4[(a + 12) >> 2] = c;
        d4[(b + 4) >> 2] = a;
        return;
    }
    function bC(a) {
        a = a | 0;
        c9(a);
        yJ(a);
        return;
    }
    function bD(a) {
        a = a | 0;
        a = d4[(a + 12) >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function bE(a) {
        a = a | 0;
        yJ(a);
        return;
    }
    function nE(c, b, a) {
        c = c | 0;
        b = b | 0;
        a = a | 0;
        b = nF(d4[c >> 2] | 0, b, a) | 0;
        a = (c + 4) | 0;
        d4[((d4[a >> 2] | 0) + 8) >> 2] = b;
        return d4[((d4[a >> 2] | 0) + 8) >> 2] | 0;
    }
    function nF(a, c, b) {
        a = a | 0;
        c = c | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = d;
        xD(e);
        a = iT(a) | 0;
        b = nG(a, d4[c >> 2] | 0, +d9[b >> 3]) | 0;
        xF(e);
        ed = d;
        return b | 0;
    }
    function nG(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = +c;
        var d = 0;
        d = iW(nH() | 0) | 0;
        a = iY(a) | 0;
        return fg(0, d | 0, b | 0, a | 0, +(+iX(c))) | 0;
    }
    function nH() {
        var a = 0;
        if (!(d2[7728] | 0)) {
            nI(9628);
            a = 7728;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 9628;
    }
    function nI(a) {
        a = a | 0;
        i6(a, nJ() | 0, 2);
        return;
    }
    function nJ() {
        return 1264;
    }
    function nK(a) {
        a = a | 0;
        kj(a);
        return;
    }
    function nL(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        nM(e, a, d, 1);
        ed = c;
        return;
    }
    function nM(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = nN() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = nO(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, nP(a, g) | 0, g);
        ed = d;
        return;
    }
    function nN() {
        var a = 0, b = 0;
        if (!(d2[7744] | 0)) {
            nW(9684);
            fo(37, 9684, eg | 0) | 0;
            b = 7744;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9684) | 0)) {
            a = 9684;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            nW(9684);
        }
        return 9684;
    }
    function nO(a) {
        a = a | 0;
        return 0;
    }
    function nP(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = nN() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            nQ(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            nR(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function nQ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function nR(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = nS(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            nT(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            nQ(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            nU(a, g);
            nV(g);
            ed = h;
            return;
        }
    }
    function nS(a) {
        a = a | 0;
        return 357913941;
    }
    function nT(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function nU(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function nV(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function nW(a) {
        a = a | 0;
        nY(a);
        return;
    }
    function bF(a) {
        a = a | 0;
        nX((a + 24) | 0);
        return;
    }
    function nX(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function nY(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 5, b, nZ() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function nZ() {
        return 1280;
    }
    function bG(a, f, b) {
        a = a | 0;
        f = f | 0;
        b = b | 0;
        var d = 0, e = 0, c = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        c = d;
        g = n$(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[c >> 2] = d4[g >> 2];
        d4[(c + 4) >> 2] = a;
        d4[e >> 2] = d4[c >> 2];
        d4[(e + 4) >> 2] = d4[(c + 4) >> 2];
        b = n_(f, e, b) | 0;
        ed = d;
        return b | 0;
    }
    function n$(a) {
        a = a | 0;
        return ((d4[((nN() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function n_(c, a, d) {
        c = c | 0;
        a = a | 0;
        d = d | 0;
        var e = 0, g = 0, b = 0, f = 0;
        f = ed;
        ed = (ed + 32) | 0;
        g = f;
        b = (f + 16) | 0;
        e = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        c = (c + (a >> 1)) | 0;
        if (a & 1) e = d4[((d4[c >> 2] | 0) + e) >> 2] | 0;
        kD(b, d);
        b = kE(b, d) | 0;
        y7[e & 15](g, c, b);
        b = nz(g) | 0;
        ed = f;
        return b | 0;
    }
    function n0(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        n1(e, a, d, 1);
        ed = c;
        return;
    }
    function n1(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = n2() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = n3(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, n4(a, g) | 0, g);
        ed = d;
        return;
    }
    function n2() {
        var a = 0, b = 0;
        if (!(d2[7752] | 0)) {
            ob(9720);
            fo(38, 9720, eg | 0) | 0;
            b = 7752;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9720) | 0)) {
            a = 9720;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            ob(9720);
        }
        return 9720;
    }
    function n3(a) {
        a = a | 0;
        return 0;
    }
    function n4(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = n2() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            n5(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            n6(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function n5(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function n6(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = n7(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            n8(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            n5(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            n9(a, g);
            oa(g);
            ed = h;
            return;
        }
    }
    function n7(a) {
        a = a | 0;
        return 357913941;
    }
    function n8(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function n9(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function oa(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function ob(a) {
        a = a | 0;
        od(a);
        return;
    }
    function bH(a) {
        a = a | 0;
        oc((a + 24) | 0);
        return;
    }
    function oc(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function od(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 8, b, oe() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function oe() {
        return 1288;
    }
    function bI(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, c = 0, f = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        c = d;
        f = of(a) | 0;
        a = d4[(f + 4) >> 2] | 0;
        d4[c >> 2] = d4[f >> 2];
        d4[(c + 4) >> 2] = a;
        d4[e >> 2] = d4[c >> 2];
        d4[(e + 4) >> 2] = d4[(c + 4) >> 2];
        b = og(b, e) | 0;
        ed = d;
        return b | 0;
    }
    function of(a) {
        a = a | 0;
        return ((d4[((n2() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function og(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0;
        c = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) c = d4[((d4[b >> 2] | 0) + c) >> 2] | 0;
        return i2(yU[c & 31](b) | 0) | 0;
    }
    function oh(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        oi(e, a, d, 0);
        ed = c;
        return;
    }
    function oi(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = oj() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = ok(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, ol(a, g) | 0, g);
        ed = d;
        return;
    }
    function oj() {
        var a = 0, b = 0;
        if (!(d2[7760] | 0)) {
            os(9756);
            fo(39, 9756, eg | 0) | 0;
            b = 7760;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9756) | 0)) {
            a = 9756;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            os(9756);
        }
        return 9756;
    }
    function ok(a) {
        a = a | 0;
        return 0;
    }
    function ol(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = oj() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            om(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            on(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function om(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function on(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = oo(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            op(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            om(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            oq(a, g);
            or(g);
            ed = h;
            return;
        }
    }
    function oo(a) {
        a = a | 0;
        return 357913941;
    }
    function op(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function oq(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function or(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function os(a) {
        a = a | 0;
        ou(a);
        return;
    }
    function bJ(a) {
        a = a | 0;
        ot((a + 24) | 0);
        return;
    }
    function ot(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function ou(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 8, b, ov() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function ov() {
        return 1292;
    }
    function bK(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = +f;
        var c = 0, d = 0, b = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        g = ow(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[b >> 2] = d4[g >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        ox(e, d, f);
        ed = c;
        return;
    }
    function ow(a) {
        a = a | 0;
        return ((d4[((oj() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function ox(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = +c;
        var d = 0, e = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        e = f;
        d = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) d = d4[((d4[b >> 2] | 0) + d) >> 2] | 0;
        kB(e, c);
        c = +kC(e, c);
        yQ[d & 31](b, c);
        ed = f;
        return;
    }
    function oy(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        oz(e, a, d, 0);
        ed = c;
        return;
    }
    function oz(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = oA() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = oB(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, oC(a, g) | 0, g);
        ed = d;
        return;
    }
    function oA() {
        var a = 0, b = 0;
        if (!(d2[7768] | 0)) {
            oJ(9792);
            fo(40, 9792, eg | 0) | 0;
            b = 7768;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9792) | 0)) {
            a = 9792;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            oJ(9792);
        }
        return 9792;
    }
    function oB(a) {
        a = a | 0;
        return 0;
    }
    function oC(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = oA() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            oD(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            oE(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function oD(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function oE(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = oF(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            oG(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            oD(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            oH(a, g);
            oI(g);
            ed = h;
            return;
        }
    }
    function oF(a) {
        a = a | 0;
        return 357913941;
    }
    function oG(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function oH(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function oI(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function oJ(a) {
        a = a | 0;
        oL(a);
        return;
    }
    function bL(a) {
        a = a | 0;
        oK((a + 24) | 0);
        return;
    }
    function oK(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function oL(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 1, b, oM() | 0, 2);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function oM() {
        return 1300;
    }
    function bM(a, e, f, g) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        g = +g;
        var c = 0, d = 0, b = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = oN(a) | 0;
        a = d4[(h + 4) >> 2] | 0;
        d4[b >> 2] = d4[h >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        oO(e, d, f, g);
        ed = c;
        return;
    }
    function oN(a) {
        a = a | 0;
        return ((d4[((oA() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function oO(b, a, e, c) {
        b = b | 0;
        a = a | 0;
        e = e | 0;
        c = +c;
        var f = 0, d = 0, h = 0, g = 0;
        g = ed;
        ed = (ed + 16) | 0;
        d = (g + 1) | 0;
        h = g;
        f = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) f = d4[((d4[b >> 2] | 0) + f) >> 2] | 0;
        kD(d, e);
        d = kE(d, e) | 0;
        kB(h, c);
        c = +kC(h, c);
        y9[f & 15](b, d, c);
        ed = g;
        return;
    }
    function oP(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        oQ(e, a, d, 0);
        ed = c;
        return;
    }
    function oQ(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = oR() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = oS(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, oT(a, g) | 0, g);
        ed = d;
        return;
    }
    function oR() {
        var a = 0, b = 0;
        if (!(d2[7776] | 0)) {
            o$(9828);
            fo(41, 9828, eg | 0) | 0;
            b = 7776;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9828) | 0)) {
            a = 9828;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            o$(9828);
        }
        return 9828;
    }
    function oS(a) {
        a = a | 0;
        return 0;
    }
    function oT(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = oR() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            oU(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            oV(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function oU(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function oV(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = oW(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            oX(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            oU(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            oY(a, g);
            oZ(g);
            ed = h;
            return;
        }
    }
    function oW(a) {
        a = a | 0;
        return 357913941;
    }
    function oX(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function oY(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function oZ(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function o$(a) {
        a = a | 0;
        o0(a);
        return;
    }
    function bN(a) {
        a = a | 0;
        o_((a + 24) | 0);
        return;
    }
    function o_(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function o0(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 7, b, o1() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function o1() {
        return 1312;
    }
    function bO(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var c = 0, d = 0, b = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        g = o2(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[b >> 2] = d4[g >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        o3(e, d, f);
        ed = c;
        return;
    }
    function o2(a) {
        a = a | 0;
        return ((d4[((oR() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function o3(b, a, d) {
        b = b | 0;
        a = a | 0;
        d = d | 0;
        var e = 0, c = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        c = f;
        e = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) e = d4[((d4[b >> 2] | 0) + e) >> 2] | 0;
        kD(c, d);
        c = kE(c, d) | 0;
        yT[e & 31](b, c);
        ed = f;
        return;
    }
    function o4(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        o5(e, a, d, 0);
        ed = c;
        return;
    }
    function o5(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = o6() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = o7(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, o8(a, g) | 0, g);
        ed = d;
        return;
    }
    function o6() {
        var a = 0, b = 0;
        if (!(d2[7784] | 0)) {
            pf(9864);
            fo(42, 9864, eg | 0) | 0;
            b = 7784;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9864) | 0)) {
            a = 9864;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            pf(9864);
        }
        return 9864;
    }
    function o7(a) {
        a = a | 0;
        return 0;
    }
    function o8(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = o6() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            o9(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            pa(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function o9(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function pa(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = pb(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            pc(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            o9(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            pd(a, g);
            pe(g);
            ed = h;
            return;
        }
    }
    function pb(a) {
        a = a | 0;
        return 357913941;
    }
    function pc(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function pd(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function pe(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function pf(a) {
        a = a | 0;
        ph(a);
        return;
    }
    function bP(a) {
        a = a | 0;
        pg((a + 24) | 0);
        return;
    }
    function pg(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function ph(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 8, b, pi() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function pi() {
        return 1320;
    }
    function bQ(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var c = 0, d = 0, b = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        g = pj(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[b >> 2] = d4[g >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        pk(e, d, f);
        ed = c;
        return;
    }
    function pj(a) {
        a = a | 0;
        return ((d4[((o6() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function pk(b, a, d) {
        b = b | 0;
        a = a | 0;
        d = d | 0;
        var e = 0, c = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        c = f;
        e = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) e = d4[((d4[b >> 2] | 0) + e) >> 2] | 0;
        pl(c, d);
        c = pm(c, d) | 0;
        yT[e & 31](b, c);
        ed = f;
        return;
    }
    function pl(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function pm(b, a) {
        b = b | 0;
        a = a | 0;
        return pn(a) | 0;
    }
    function pn(a) {
        a = a | 0;
        return a | 0;
    }
    function po(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        pp(e, a, d, 0);
        ed = c;
        return;
    }
    function pp(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = pq() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = pr(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, ps(a, g) | 0, g);
        ed = d;
        return;
    }
    function pq() {
        var a = 0, b = 0;
        if (!(d2[7792] | 0)) {
            pz(9900);
            fo(43, 9900, eg | 0) | 0;
            b = 7792;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9900) | 0)) {
            a = 9900;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            pz(9900);
        }
        return 9900;
    }
    function pr(a) {
        a = a | 0;
        return 0;
    }
    function ps(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = pq() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            pt(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            pu(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function pt(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function pu(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = pv(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            pw(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            pt(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            px(a, g);
            py(g);
            ed = h;
            return;
        }
    }
    function pv(a) {
        a = a | 0;
        return 357913941;
    }
    function pw(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function px(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function py(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function pz(a) {
        a = a | 0;
        pB(a);
        return;
    }
    function bR(a) {
        a = a | 0;
        pA((a + 24) | 0);
        return;
    }
    function pA(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function pB(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 22, b, pC() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function pC() {
        return 1344;
    }
    function bS(a, e) {
        a = a | 0;
        e = e | 0;
        var c = 0, d = 0, b = 0, f = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        f = pD(a) | 0;
        a = d4[(f + 4) >> 2] | 0;
        d4[b >> 2] = d4[f >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        pE(e, d);
        ed = c;
        return;
    }
    function pD(a) {
        a = a | 0;
        return ((d4[((pq() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function pE(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0;
        c = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) c = d4[((d4[b >> 2] | 0) + c) >> 2] | 0;
        yS[c & 127](b);
        return;
    }
    function pF(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = pG() | 0;
        a = pH(b) | 0;
        jI(f, d, e, a, pI(b, c) | 0, c);
        return;
    }
    function pG() {
        var a = 0, b = 0;
        if (!(d2[7800] | 0)) {
            pP(9936);
            fo(44, 9936, eg | 0) | 0;
            b = 7800;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9936) | 0)) {
            a = 9936;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            pP(9936);
        }
        return 9936;
    }
    function pH(a) {
        a = a | 0;
        return a | 0;
    }
    function pI(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = pG() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            pJ(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            pK(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function pJ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function pK(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = pL(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            pM(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            pJ(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            pN(a, c);
            pO(c);
            ed = h;
            return;
        }
    }
    function pL(a) {
        a = a | 0;
        return 536870911;
    }
    function pM(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function pN(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function pO(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function pP(a) {
        a = a | 0;
        pR(a);
        return;
    }
    function bT(a) {
        a = a | 0;
        pQ((a + 24) | 0);
        return;
    }
    function pQ(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function pR(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 23, b, mp() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function bU(a, b) {
        a = a | 0;
        b = b | 0;
        pT(d4[(pS(a) | 0) >> 2] | 0, b);
        return;
    }
    function pS(a) {
        a = a | 0;
        return ((d4[((pG() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function pT(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        ms(d, a);
        a = mt(d, a) | 0;
        yS[b & 127](a);
        ed = c;
        return;
    }
    function pU(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = pV() | 0;
        a = pW(b) | 0;
        jI(f, d, e, a, pX(b, c) | 0, c);
        return;
    }
    function pV() {
        var a = 0, b = 0;
        if (!(d2[7808] | 0)) {
            p2(9972);
            fo(45, 9972, eg | 0) | 0;
            b = 7808;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(9972) | 0)) {
            a = 9972;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            p2(9972);
        }
        return 9972;
    }
    function pW(a) {
        a = a | 0;
        return a | 0;
    }
    function pX(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = pV() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            pY(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            pZ(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function pY(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function pZ(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = p$(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            p_(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            pY(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            p0(a, c);
            p1(c);
            ed = h;
            return;
        }
    }
    function p$(a) {
        a = a | 0;
        return 536870911;
    }
    function p_(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function p0(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function p1(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function p2(a) {
        a = a | 0;
        p4(a);
        return;
    }
    function bV(a) {
        a = a | 0;
        p3((a + 24) | 0);
        return;
    }
    function p3(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function p4(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 9, b, p5() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function p5() {
        return 1348;
    }
    function bW(a, b) {
        a = a | 0;
        b = b | 0;
        return p7(d4[(p6(a) | 0) >> 2] | 0, b) | 0;
    }
    function p6(a) {
        a = a | 0;
        return ((d4[((pV() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function p7(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        p8(d, a);
        a = p9(d, a) | 0;
        a = lC(yU[b & 31](a) | 0) | 0;
        ed = c;
        return a | 0;
    }
    function p8(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function p9(b, a) {
        b = b | 0;
        a = a | 0;
        return qa(a) | 0;
    }
    function qa(a) {
        a = a | 0;
        return a | 0;
    }
    function qb(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = qc() | 0;
        a = qd(b) | 0;
        jI(f, d, e, a, qe(b, c) | 0, c);
        return;
    }
    function qc() {
        var a = 0, b = 0;
        if (!(d2[7816] | 0)) {
            ql(10008);
            fo(46, 10008, eg | 0) | 0;
            b = 7816;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10008) | 0)) {
            a = 10008;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            ql(10008);
        }
        return 10008;
    }
    function qd(a) {
        a = a | 0;
        return a | 0;
    }
    function qe(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = qc() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            qf(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            qg(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function qf(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function qg(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = qh(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            qi(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            qf(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            qj(a, c);
            qk(c);
            ed = h;
            return;
        }
    }
    function qh(a) {
        a = a | 0;
        return 536870911;
    }
    function qi(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function qj(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function qk(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function ql(a) {
        a = a | 0;
        qn(a);
        return;
    }
    function bX(a) {
        a = a | 0;
        qm((a + 24) | 0);
        return;
    }
    function qm(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function qn(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 15, b, lS() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function bY(a) {
        a = a | 0;
        return qp(d4[(qo(a) | 0) >> 2] | 0) | 0;
    }
    function qo(a) {
        a = a | 0;
        return ((d4[((qc() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function qp(a) {
        a = a | 0;
        return lC(y3[a & 7]() | 0) | 0;
    }
    function qq() {
        var a = 0;
        if (!(d2[7832] | 0)) {
            qz(10052);
            fo(25, 10052, eg | 0) | 0;
            a = 7832;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10052;
    }
    function qr(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = qs() | 0;
        d4[(a + 4) >> 2] = qt() | 0;
        d4[(a + 12) >> 2] = b;
        d4[(a + 8) >> 2] = qu() | 0;
        d4[(a + 32) >> 2] = 2;
        return;
    }
    function qs() {
        return 11709;
    }
    function qt() {
        return 1188;
    }
    function qu() {
        return qx() | 0;
    }
    function bZ(d, a, b, c) {
        d = d | 0;
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if ((qv(c, 896) | 0) == 512) {
            if (b | 0) {
                qw(b);
                yJ(b);
            }
        } else if (a | 0) {
            iK(a);
            yJ(a);
        }
        return;
    }
    function qv(a, b) {
        a = a | 0;
        b = b | 0;
        return (b & a) | 0;
    }
    function qw(a) {
        a = a | 0;
        a = d4[(a + 4) >> 2] | 0;
        if (a | 0) yF(a);
        return;
    }
    function qx() {
        var a = 0;
        if (!(d2[7824] | 0)) {
            d4[2511] = qy() | 0;
            d4[2512] = 0;
            a = 7824;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10044;
    }
    function qy() {
        return 0;
    }
    function qz(a) {
        a = a | 0;
        kj(a);
        return;
    }
    function qA(b) {
        b = b | 0;
        var c = 0, a = 0, d = 0, e = 0, f = 0;
        c = ed;
        ed = (ed + 32) | 0;
        a = (c + 24) | 0;
        f = (c + 16) | 0;
        e = (c + 8) | 0;
        d = c;
        qB(b, 4827);
        qC(b, 4834, 3) | 0;
        qD(b, 3682, 47) | 0;
        d4[f >> 2] = 9;
        d4[(f + 4) >> 2] = 0;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        qE(b, 4841, a) | 0;
        d4[e >> 2] = 1;
        d4[(e + 4) >> 2] = 0;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        qF(b, 4871, a) | 0;
        d4[d >> 2] = 10;
        d4[(d + 4) >> 2] = 0;
        d4[a >> 2] = d4[d >> 2];
        d4[(a + 4) >> 2] = d4[(d + 4) >> 2];
        qG(b, 4891, a) | 0;
        ed = c;
        return;
    }
    function qB(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = r5() | 0;
        d4[a >> 2] = c;
        r6(c, b);
        tI(d4[a >> 2] | 0);
        return;
    }
    function qC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        rQ(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function qD(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        rA(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function qE(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        rg(b, f, e);
        ed = d;
        return b | 0;
    }
    function qF(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        qY(b, f, e);
        ed = d;
        return b | 0;
    }
    function qG(b, f, c) {
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, e = 0, a = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        a = d;
        g = d4[(c + 4) >> 2] | 0;
        d4[a >> 2] = d4[c >> 2];
        d4[(a + 4) >> 2] = g;
        d4[e >> 2] = d4[a >> 2];
        d4[(e + 4) >> 2] = d4[(a + 4) >> 2];
        qH(b, f, e);
        ed = d;
        return b | 0;
    }
    function qH(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        qI(e, a, d, 1);
        ed = c;
        return;
    }
    function qI(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = qJ() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = qK(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, qL(a, g) | 0, g);
        ed = d;
        return;
    }
    function qJ() {
        var a = 0, b = 0;
        if (!(d2[7840] | 0)) {
            qS(10100);
            fo(48, 10100, eg | 0) | 0;
            b = 7840;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10100) | 0)) {
            a = 10100;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            qS(10100);
        }
        return 10100;
    }
    function qK(a) {
        a = a | 0;
        return 0;
    }
    function qL(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = qJ() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            qM(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            qN(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function qM(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function qN(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = qO(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            qP(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            qM(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            qQ(a, g);
            qR(g);
            ed = h;
            return;
        }
    }
    function qO(a) {
        a = a | 0;
        return 357913941;
    }
    function qP(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function qQ(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function qR(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function qS(a) {
        a = a | 0;
        qU(a);
        return;
    }
    function b$(a) {
        a = a | 0;
        qT((a + 24) | 0);
        return;
    }
    function qT(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function qU(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 6, b, qV() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function qV() {
        return 1364;
    }
    function b_(a, f, b) {
        a = a | 0;
        f = f | 0;
        b = b | 0;
        var d = 0, e = 0, c = 0, g = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 8) | 0;
        c = d;
        g = qW(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[c >> 2] = d4[g >> 2];
        d4[(c + 4) >> 2] = a;
        d4[e >> 2] = d4[c >> 2];
        d4[(e + 4) >> 2] = d4[(c + 4) >> 2];
        b = qX(f, e, b) | 0;
        ed = d;
        return b | 0;
    }
    function qW(a) {
        a = a | 0;
        return ((d4[((qJ() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function qX(c, a, d) {
        c = c | 0;
        a = a | 0;
        d = d | 0;
        var e = 0, b = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        b = f;
        e = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        c = (c + (a >> 1)) | 0;
        if (a & 1) e = d4[((d4[c >> 2] | 0) + e) >> 2] | 0;
        kD(b, d);
        b = kE(b, d) | 0;
        b = kY(y_[e & 15](c, b) | 0) | 0;
        ed = f;
        return b | 0;
    }
    function qY(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        qZ(e, a, d, 0);
        ed = c;
        return;
    }
    function qZ(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = q$() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = q_(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, q0(a, g) | 0, g);
        ed = d;
        return;
    }
    function q$() {
        var a = 0, b = 0;
        if (!(d2[7848] | 0)) {
            q7(10136);
            fo(49, 10136, eg | 0) | 0;
            b = 7848;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10136) | 0)) {
            a = 10136;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            q7(10136);
        }
        return 10136;
    }
    function q_(a) {
        a = a | 0;
        return 0;
    }
    function q0(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = q$() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            q1(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            q2(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function q1(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function q2(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = q3(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            q4(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            q1(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            q5(a, g);
            q6(g);
            ed = h;
            return;
        }
    }
    function q3(a) {
        a = a | 0;
        return 357913941;
    }
    function q4(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function q5(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function q6(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function q7(a) {
        a = a | 0;
        q9(a);
        return;
    }
    function b0(a) {
        a = a | 0;
        q8((a + 24) | 0);
        return;
    }
    function q8(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function q9(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 9, b, ra() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function ra() {
        return 1372;
    }
    function b1(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = +f;
        var c = 0, d = 0, b = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        g = rb(a) | 0;
        a = d4[(g + 4) >> 2] | 0;
        d4[b >> 2] = d4[g >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        rc(e, d, f);
        ed = c;
        return;
    }
    function rb(a) {
        a = a | 0;
        return ((d4[((q$() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function rc(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = +c;
        var d = 0, e = 0, f = 0, g = fR;
        f = ed;
        ed = (ed + 16) | 0;
        e = f;
        d = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) d = d4[((d4[b >> 2] | 0) + d) >> 2] | 0;
        rd(e, c);
        g = n(re(e, c));
        yP[d & 1](b, g);
        ed = f;
        return;
    }
    function rd(a, b) {
        a = a | 0;
        b = +b;
        return;
    }
    function re(b, a) {
        b = b | 0;
        a = +a;
        return n(rf(a));
    }
    function rf(a) {
        a = +a;
        return n(a);
    }
    function rg(e, f, a) {
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var c = 0, d = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = d4[a >> 2] | 0;
        g = d4[(a + 4) >> 2] | 0;
        a = jD(f) | 0;
        d4[b >> 2] = h;
        d4[(b + 4) >> 2] = g;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        rh(e, a, d, 0);
        ed = c;
        return;
    }
    function rh(c, h, b, g) {
        c = c | 0;
        h = h | 0;
        b = b | 0;
        g = g | 0;
        var d = 0, a = 0, k = 0, e = 0, i = 0, j = 0, f = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = (d + 16) | 0;
        f = (d + 8) | 0;
        e = d;
        j = d4[b >> 2] | 0;
        i = d4[(b + 4) >> 2] | 0;
        k = d4[c >> 2] | 0;
        c = ri() | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        d4[a >> 2] = d4[f >> 2];
        d4[(a + 4) >> 2] = d4[(f + 4) >> 2];
        b = rj(a) | 0;
        d4[e >> 2] = j;
        d4[(e + 4) >> 2] = i;
        d4[a >> 2] = d4[e >> 2];
        d4[(a + 4) >> 2] = d4[(e + 4) >> 2];
        jI(k, h, c, b, rk(a, g) | 0, g);
        ed = d;
        return;
    }
    function ri() {
        var a = 0, b = 0;
        if (!(d2[7856] | 0)) {
            rr(10172);
            fo(50, 10172, eg | 0) | 0;
            b = 7856;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10172) | 0)) {
            a = 10172;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            rr(10172);
        }
        return 10172;
    }
    function rj(a) {
        a = a | 0;
        return 0;
    }
    function rk(a, b) {
        a = a | 0;
        b = b | 0;
        var h = 0, i = 0, e = 0, j = 0, d = 0, f = 0, k = 0, l = 0, c = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        e = (c + 24) | 0;
        d = (c + 16) | 0;
        f = c;
        k = (c + 8) | 0;
        j = d4[a >> 2] | 0;
        i = d4[(a + 4) >> 2] | 0;
        d4[f >> 2] = j;
        d4[(f + 4) >> 2] = i;
        g = ri() | 0;
        l = (g + 24) | 0;
        a = jM(b, 4) | 0;
        d4[k >> 2] = a;
        b = (g + 28) | 0;
        h = d4[b >> 2] | 0;
        if (h >>> 0 < (d4[(g + 32) >> 2] | 0) >>> 0) {
            d4[d >> 2] = j;
            d4[(d + 4) >> 2] = i;
            d4[e >> 2] = d4[d >> 2];
            d4[(e + 4) >> 2] = d4[(d + 4) >> 2];
            rl(h, e, a);
            a = ((d4[b >> 2] | 0) + 12) | 0;
            d4[b >> 2] = a;
        } else {
            rm(l, f, k);
            a = d4[b >> 2] | 0;
        }
        ed = c;
        return (((((a - (d4[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function rl(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = d4[(b + 4) >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = c;
        return;
    }
    function rm(a, i, e) {
        a = a | 0;
        i = i | 0;
        e = e | 0;
        var j = 0, c = 0, d = 0, f = 0, g = 0, b = 0, h = 0, k = 0, l = 0, m = 0;
        h = ed;
        ed = (ed + 48) | 0;
        j = (h + 32) | 0;
        f = (h + 24) | 0;
        g = h;
        b = (a + 4) | 0;
        c = ((((((d4[b >> 2] | 0) - (d4[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        d = rn(a) | 0;
        if (d >>> 0 < c >>> 0) yC(a);
        else {
            k = d4[a >> 2] | 0;
            m = ((((d4[(a + 8) >> 2] | 0) - k) | 0) / 12) | 0;
            l = m << 1;
            ro(g, m >>> 0 < (d >>> 1) >>> 0 ? (l >>> 0 < c >>> 0 ? c : l) : d, ((((d4[b >> 2] | 0) - k) | 0) / 12) | 0, (a + 8) | 0);
            b = (g + 8) | 0;
            d = d4[b >> 2] | 0;
            c = d4[(i + 4) >> 2] | 0;
            e = d4[e >> 2] | 0;
            d4[f >> 2] = d4[i >> 2];
            d4[(f + 4) >> 2] = c;
            d4[j >> 2] = d4[f >> 2];
            d4[(j + 4) >> 2] = d4[(f + 4) >> 2];
            rl(d, j, e);
            d4[b >> 2] = (d4[b >> 2] | 0) + 12;
            rp(a, g);
            rq(g);
            ed = h;
            return;
        }
    }
    function rn(a) {
        a = a | 0;
        return 357913941;
    }
    function ro(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 357913941) fA();
            else {
                d = yH((b * 12) | 0) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + ((e * 12) | 0)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + ((b * 12) | 0);
        return;
    }
    function rp(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + (((((f | 0) / -12) | 0) * 12) | 0)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function rq(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + ((~(((((b + -12 - c) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function rr(a) {
        a = a | 0;
        rt(a);
        return;
    }
    function b2(a) {
        a = a | 0;
        rs((a + 24) | 0);
        return;
    }
    function rs(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + ((~(((((c + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            yJ(b);
        }
        return;
    }
    function rt(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 2, 3, b, ru() | 0, 2);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function ru() {
        return 1380;
    }
    function b3(a, e, f, g) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var c = 0, d = 0, b = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 8) | 0;
        b = c;
        h = rv(a) | 0;
        a = d4[(h + 4) >> 2] | 0;
        d4[b >> 2] = d4[h >> 2];
        d4[(b + 4) >> 2] = a;
        d4[d >> 2] = d4[b >> 2];
        d4[(d + 4) >> 2] = d4[(b + 4) >> 2];
        rw(e, d, f, g);
        ed = c;
        return;
    }
    function rv(a) {
        a = a | 0;
        return ((d4[((ri() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function rw(b, a, e, f) {
        b = b | 0;
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, c = 0, d = 0, h = 0;
        h = ed;
        ed = (ed + 16) | 0;
        c = (h + 1) | 0;
        d = h;
        g = d4[a >> 2] | 0;
        a = d4[(a + 4) >> 2] | 0;
        b = (b + (a >> 1)) | 0;
        if (a & 1) g = d4[((d4[b >> 2] | 0) + g) >> 2] | 0;
        kD(c, e);
        c = kE(c, e) | 0;
        rx(d, f);
        d = ry(d, f) | 0;
        y7[g & 15](b, c, d);
        ed = h;
        return;
    }
    function rx(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function ry(b, a) {
        b = b | 0;
        a = a | 0;
        return rz(a) | 0;
    }
    function rz(a) {
        a = a | 0;
        return ((a | 0) != 0) | 0;
    }
    function rA(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = rB() | 0;
        a = rC(b) | 0;
        jI(f, d, e, a, rD(b, c) | 0, c);
        return;
    }
    function rB() {
        var a = 0, b = 0;
        if (!(d2[7864] | 0)) {
            rK(10208);
            fo(51, 10208, eg | 0) | 0;
            b = 7864;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10208) | 0)) {
            a = 10208;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            rK(10208);
        }
        return 10208;
    }
    function rC(a) {
        a = a | 0;
        return a | 0;
    }
    function rD(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = rB() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            rE(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            rF(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function rE(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function rF(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = rG(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            rH(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            rE(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            rI(a, c);
            rJ(c);
            ed = h;
            return;
        }
    }
    function rG(a) {
        a = a | 0;
        return 536870911;
    }
    function rH(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function rI(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function rJ(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function rK(a) {
        a = a | 0;
        rM(a);
        return;
    }
    function b4(a) {
        a = a | 0;
        rL((a + 24) | 0);
        return;
    }
    function rL(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function rM(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 24, b, rN() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function rN() {
        return 1392;
    }
    function b5(a, b) {
        a = a | 0;
        b = b | 0;
        rP(d4[(rO(a) | 0) >> 2] | 0, b);
        return;
    }
    function rO(a) {
        a = a | 0;
        return ((d4[((rB() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function rP(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        p8(d, a);
        a = p9(d, a) | 0;
        yS[b & 127](a);
        ed = c;
        return;
    }
    function rQ(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = rR() | 0;
        a = rS(b) | 0;
        jI(f, d, e, a, rT(b, c) | 0, c);
        return;
    }
    function rR() {
        var a = 0, b = 0;
        if (!(d2[7872] | 0)) {
            r$(10244);
            fo(52, 10244, eg | 0) | 0;
            b = 7872;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10244) | 0)) {
            a = 10244;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            r$(10244);
        }
        return 10244;
    }
    function rS(a) {
        a = a | 0;
        return a | 0;
    }
    function rT(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = rR() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            rU(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            rV(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function rU(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function rV(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = rW(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            rX(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            rU(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            rY(a, c);
            rZ(c);
            ed = h;
            return;
        }
    }
    function rW(a) {
        a = a | 0;
        return 536870911;
    }
    function rX(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function rY(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function rZ(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function r$(a) {
        a = a | 0;
        r0(a);
        return;
    }
    function b6(a) {
        a = a | 0;
        r_((a + 24) | 0);
        return;
    }
    function r_(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function r0(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 16, b, r1() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function r1() {
        return 1400;
    }
    function b7(a) {
        a = a | 0;
        return r3(d4[(r2(a) | 0) >> 2] | 0) | 0;
    }
    function r2(a) {
        a = a | 0;
        return ((d4[((rR() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function r3(a) {
        a = a | 0;
        return r4(y3[a & 7]() | 0) | 0;
    }
    function r4(a) {
        a = a | 0;
        return a | 0;
    }
    function r5() {
        var a = 0;
        if (!(d2[7880] | 0)) {
            sb(10280);
            fo(25, 10280, eg | 0) | 0;
            a = 7880;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10280;
    }
    function r6(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = r7() | 0;
        d4[(a + 4) >> 2] = r8() | 0;
        d4[(a + 12) >> 2] = b;
        d4[(a + 8) >> 2] = r9() | 0;
        d4[(a + 32) >> 2] = 4;
        return;
    }
    function r7() {
        return 11711;
    }
    function r8() {
        return 1356;
    }
    function r9() {
        return qx() | 0;
    }
    function b8(d, a, b, c) {
        d = d | 0;
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if ((qv(c, 896) | 0) == 512) {
            if (b | 0) {
                sa(b);
                yJ(b);
            }
        } else if (a | 0) {
            iI(a);
            yJ(a);
        }
        return;
    }
    function sa(a) {
        a = a | 0;
        a = d4[(a + 4) >> 2] | 0;
        if (a | 0) yF(a);
        return;
    }
    function sb(a) {
        a = a | 0;
        kj(a);
        return;
    }
    function sc(a) {
        a = a | 0;
        sd(a, 4920);
        se(a) | 0;
        sf(a) | 0;
        return;
    }
    function sd(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = nA() | 0;
        d4[a >> 2] = c;
        sz(c, b);
        tI(d4[a >> 2] | 0);
        return;
    }
    function se(a) {
        a = a | 0;
        var b = 0;
        b = d4[a >> 2] | 0;
        sh(b, sq() | 0);
        return a | 0;
    }
    function sf(a) {
        a = a | 0;
        var b = 0;
        b = d4[a >> 2] | 0;
        sh(b, sg() | 0);
        return a | 0;
    }
    function sg() {
        var a = 0;
        if (!(d2[7888] | 0)) {
            si(10328);
            fo(53, 10328, eg | 0) | 0;
            a = 7888;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        if (!(jU(10328) | 0)) si(10328);
        return 10328;
    }
    function sh(a, b) {
        a = a | 0;
        b = b | 0;
        jI(a, 0, b, 0, 0, 0);
        return;
    }
    function si(a) {
        a = a | 0;
        sk(a);
        sl(a, 10);
        return;
    }
    function b9(a) {
        a = a | 0;
        sj((a + 24) | 0);
        return;
    }
    function sj(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function sk(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 5, 1, b, so() | 0, 2);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function ca(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        sm(a, b, c);
        return;
    }
    function sl(a, b) {
        a = a | 0;
        b = b | 0;
        d4[(a + 20) >> 2] = b;
        return;
    }
    function sm(d, b, c) {
        d = d | 0;
        b = b | 0;
        c = +c;
        var a = 0, e = 0, f = 0, g = 0, h = 0;
        a = ed;
        ed = (ed + 16) | 0;
        f = (a + 8) | 0;
        h = (a + 13) | 0;
        e = a;
        g = (a + 12) | 0;
        kD(h, b);
        d4[f >> 2] = kE(h, b) | 0;
        kB(g, c);
        d9[e >> 3] = +kC(g, c);
        sn(d, f, e);
        ed = a;
        return;
    }
    function sn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        iP((a + 8) | 0, d4[b >> 2] | 0, +d9[c >> 3]);
        d2[(a + 24) >> 0] = 1;
        return;
    }
    function so() {
        return 1404;
    }
    function cb(a, b) {
        a = a | 0;
        b = +b;
        return sp(a, b) | 0;
    }
    function sp(a, e) {
        a = a | 0;
        e = +e;
        var f = 0, c = 0, g = 0, d = 0, b = 0, h = 0, i = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 4) | 0;
        b = (c + 8) | 0;
        h = c;
        g = cJ(8) | 0;
        f = g;
        i = yH(16) | 0;
        kD(d, a);
        a = kE(d, a) | 0;
        kB(b, e);
        iP(i, a, +kC(b, e));
        b = (f + 4) | 0;
        d4[b >> 2] = i;
        a = yH(8) | 0;
        b = d4[b >> 2] | 0;
        d4[h >> 2] = 0;
        d4[d >> 2] = d4[h >> 2];
        nD(a, b, d);
        d4[g >> 2] = a;
        ed = c;
        return f | 0;
    }
    function sq() {
        var a = 0;
        if (!(d2[7896] | 0)) {
            sr(10364);
            fo(54, 10364, eg | 0) | 0;
            a = 7896;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        if (!(jU(10364) | 0)) sr(10364);
        return 10364;
    }
    function sr(a) {
        a = a | 0;
        st(a);
        sl(a, 55);
        return;
    }
    function cc(a) {
        a = a | 0;
        ss((a + 24) | 0);
        return;
    }
    function ss(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function st(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 5, 4, b, sx() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function cd(a) {
        a = a | 0;
        su(a);
        return;
    }
    function su(a) {
        a = a | 0;
        sv(a);
        return;
    }
    function sv(a) {
        a = a | 0;
        sw((a + 8) | 0);
        d2[(a + 24) >> 0] = 1;
        return;
    }
    function sw(a) {
        a = a | 0;
        d4[a >> 2] = 0;
        d9[(a + 8) >> 3] = 0.0;
        return;
    }
    function sx() {
        return 1424;
    }
    function ce() {
        return sy() | 0;
    }
    function sy() {
        var d = 0, c = 0, e = 0, a = 0, f = 0, b = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        f = (c + 4) | 0;
        g = c;
        e = cJ(8) | 0;
        d = e;
        a = yH(16) | 0;
        sw(a);
        b = (d + 4) | 0;
        d4[b >> 2] = a;
        a = yH(8) | 0;
        b = d4[b >> 2] | 0;
        d4[g >> 2] = 0;
        d4[f >> 2] = d4[g >> 2];
        nD(a, b, f);
        d4[e >> 2] = a;
        ed = c;
        return d | 0;
    }
    function sz(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = sA() | 0;
        d4[(a + 4) >> 2] = sB() | 0;
        d4[(a + 12) >> 2] = b;
        d4[(a + 8) >> 2] = sC() | 0;
        d4[(a + 32) >> 2] = 5;
        return;
    }
    function sA() {
        return 11710;
    }
    function sB() {
        return 1416;
    }
    function sC() {
        return sE() | 0;
    }
    function cf(d, b, a, c) {
        d = d | 0;
        b = b | 0;
        a = a | 0;
        c = c | 0;
        if ((qv(c, 896) | 0) == 512) {
            if (a | 0) {
                sD(a);
                yJ(a);
            }
        } else if (b | 0) yJ(b);
        return;
    }
    function sD(a) {
        a = a | 0;
        a = d4[(a + 4) >> 2] | 0;
        if (a | 0) yF(a);
        return;
    }
    function sE() {
        var a = 0;
        if (!(d2[7904] | 0)) {
            d4[2600] = sF() | 0;
            d4[2601] = 0;
            a = 7904;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10400;
    }
    function sF() {
        return d4[357] | 0;
    }
    function sG(a) {
        a = a | 0;
        sH(a, 4926);
        sI(a) | 0;
        return;
    }
    function sH(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = j1() | 0;
        d4[a >> 2] = c;
        sR(c, b);
        tI(d4[a >> 2] | 0);
        return;
    }
    function sI(a) {
        a = a | 0;
        var b = 0;
        b = d4[a >> 2] | 0;
        sh(b, sJ() | 0);
        return a | 0;
    }
    function sJ() {
        var a = 0;
        if (!(d2[7912] | 0)) {
            sK(10412);
            fo(56, 10412, eg | 0) | 0;
            a = 7912;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        if (!(jU(10412) | 0)) sK(10412);
        return 10412;
    }
    function sK(a) {
        a = a | 0;
        sM(a);
        sl(a, 57);
        return;
    }
    function cg(a) {
        a = a | 0;
        sL((a + 24) | 0);
        return;
    }
    function sL(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function sM(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 5, 5, b, sP() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function ch(a) {
        a = a | 0;
        sN(a);
        return;
    }
    function sN(a) {
        a = a | 0;
        sO(a);
        return;
    }
    function sO(b) {
        b = b | 0;
        var a = 0, c = 0;
        a = (b + 8) | 0;
        c = (a + 48) | 0;
        do {
            d4[a >> 2] = 0;
            a = (a + 4) | 0;
        }while ((a | 0) < (c | 0))
        d2[(b + 56) >> 0] = 1;
        return;
    }
    function sP() {
        return 1432;
    }
    function ci() {
        return sQ() | 0;
    }
    function sQ() {
        var d = 0, e = 0, f = 0, g = 0, h = 0, a = 0, c = 0, b = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = (c + 4) | 0;
        e = c;
        f = cJ(8) | 0;
        g = f;
        h = yH(48) | 0;
        a = h;
        b = (a + 48) | 0;
        do {
            d4[a >> 2] = 0;
            a = (a + 4) | 0;
        }while ((a | 0) < (b | 0))
        a = (g + 4) | 0;
        d4[a >> 2] = h;
        b = yH(8) | 0;
        a = d4[a >> 2] | 0;
        d4[e >> 2] = 0;
        d4[d >> 2] = d4[e >> 2];
        j8(b, a, d);
        d4[f >> 2] = b;
        ed = c;
        return g | 0;
    }
    function sR(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = sS() | 0;
        d4[(a + 4) >> 2] = sT() | 0;
        d4[(a + 12) >> 2] = b;
        d4[(a + 8) >> 2] = sU() | 0;
        d4[(a + 32) >> 2] = 6;
        return;
    }
    function sS() {
        return 11704;
    }
    function sT() {
        return 1436;
    }
    function sU() {
        return sE() | 0;
    }
    function cj(d, b, a, c) {
        d = d | 0;
        b = b | 0;
        a = a | 0;
        c = c | 0;
        if ((qv(c, 896) | 0) == 512) {
            if (a | 0) {
                sV(a);
                yJ(a);
            }
        } else if (b | 0) yJ(b);
        return;
    }
    function sV(a) {
        a = a | 0;
        a = d4[(a + 4) >> 2] | 0;
        if (a | 0) yF(a);
        return;
    }
    function sW(a) {
        a = a | 0;
        sX(a, 4933);
        sY(a) | 0;
        sZ(a) | 0;
        return;
    }
    function sX(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = th() | 0;
        d4[a >> 2] = c;
        ti(c, b);
        tI(d4[a >> 2] | 0);
        return;
    }
    function sY(a) {
        a = a | 0;
        var b = 0;
        b = d4[a >> 2] | 0;
        sh(b, s8() | 0);
        return a | 0;
    }
    function sZ(a) {
        a = a | 0;
        var b = 0;
        b = d4[a >> 2] | 0;
        sh(b, s$() | 0);
        return a | 0;
    }
    function s$() {
        var a = 0;
        if (!(d2[7920] | 0)) {
            s_(10452);
            fo(58, 10452, eg | 0) | 0;
            a = 7920;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        if (!(jU(10452) | 0)) s_(10452);
        return 10452;
    }
    function s_(a) {
        a = a | 0;
        s1(a);
        sl(a, 1);
        return;
    }
    function ck(a) {
        a = a | 0;
        s0((a + 24) | 0);
        return;
    }
    function s0(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function s1(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 5, 1, b, s5() | 0, 2);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function cl(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        s2(a, b, c);
        return;
    }
    function s2(d, b, c) {
        d = d | 0;
        b = +b;
        c = +c;
        var a = 0, e = 0, f = 0, g = 0, h = 0;
        a = ed;
        ed = (ed + 32) | 0;
        f = (a + 8) | 0;
        h = (a + 17) | 0;
        e = a;
        g = (a + 16) | 0;
        kB(h, b);
        d9[f >> 3] = +kC(h, b);
        kB(g, c);
        d9[e >> 3] = +kC(g, c);
        s3(d, f, e);
        ed = a;
        return;
    }
    function s3(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        s4((a + 8) | 0, +d9[b >> 3], +d9[c >> 3]);
        d2[(a + 24) >> 0] = 1;
        return;
    }
    function s4(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        d9[a >> 3] = b;
        d9[(a + 8) >> 3] = c;
        return;
    }
    function s5() {
        return 1472;
    }
    function cm(a, b) {
        a = +a;
        b = +b;
        return s6(a, b) | 0;
    }
    function s6(b, f) {
        b = +b;
        f = +f;
        var g = 0, d = 0, h = 0, c = 0, e = 0, a = 0, i = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = (d + 4) | 0;
        a = (d + 8) | 0;
        i = d;
        h = cJ(8) | 0;
        g = h;
        c = yH(16) | 0;
        kB(e, b);
        b = +kC(e, b);
        kB(a, f);
        s4(c, b, +kC(a, f));
        a = (g + 4) | 0;
        d4[a >> 2] = c;
        c = yH(8) | 0;
        a = d4[a >> 2] | 0;
        d4[i >> 2] = 0;
        d4[e >> 2] = d4[i >> 2];
        s7(c, a, e);
        d4[h >> 2] = c;
        ed = d;
        return g | 0;
    }
    function s7(b, c, a) {
        b = b | 0;
        c = c | 0;
        a = a | 0;
        d4[b >> 2] = c;
        a = yH(16) | 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        d4[a >> 2] = 1452;
        d4[(a + 12) >> 2] = c;
        d4[(b + 4) >> 2] = a;
        return;
    }
    function cn(a) {
        a = a | 0;
        c9(a);
        yJ(a);
        return;
    }
    function co(a) {
        a = a | 0;
        a = d4[(a + 12) >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function cp(a) {
        a = a | 0;
        yJ(a);
        return;
    }
    function s8() {
        var a = 0;
        if (!(d2[7928] | 0)) {
            s9(10488);
            fo(59, 10488, eg | 0) | 0;
            a = 7928;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        if (!(jU(10488) | 0)) s9(10488);
        return 10488;
    }
    function s9(a) {
        a = a | 0;
        tb(a);
        sl(a, 60);
        return;
    }
    function cq(a) {
        a = a | 0;
        ta((a + 24) | 0);
        return;
    }
    function ta(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function tb(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 5, 6, b, tf() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function cr(a) {
        a = a | 0;
        tc(a);
        return;
    }
    function tc(a) {
        a = a | 0;
        td(a);
        return;
    }
    function td(a) {
        a = a | 0;
        te((a + 8) | 0);
        d2[(a + 24) >> 0] = 1;
        return;
    }
    function te(a) {
        a = a | 0;
        d4[a >> 2] = 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        d4[(a + 12) >> 2] = 0;
        return;
    }
    function tf() {
        return 1492;
    }
    function cs() {
        return tg() | 0;
    }
    function tg() {
        var d = 0, c = 0, e = 0, a = 0, f = 0, b = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        f = (c + 4) | 0;
        g = c;
        e = cJ(8) | 0;
        d = e;
        a = yH(16) | 0;
        te(a);
        b = (d + 4) | 0;
        d4[b >> 2] = a;
        a = yH(8) | 0;
        b = d4[b >> 2] | 0;
        d4[g >> 2] = 0;
        d4[f >> 2] = d4[g >> 2];
        s7(a, b, f);
        d4[e >> 2] = a;
        ed = c;
        return d | 0;
    }
    function th() {
        var a = 0;
        if (!(d2[7936] | 0)) {
            tn(10524);
            fo(25, 10524, eg | 0) | 0;
            a = 7936;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10524;
    }
    function ti(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = tj() | 0;
        d4[(a + 4) >> 2] = tk() | 0;
        d4[(a + 12) >> 2] = b;
        d4[(a + 8) >> 2] = tl() | 0;
        d4[(a + 32) >> 2] = 7;
        return;
    }
    function tj() {
        return 11700;
    }
    function tk() {
        return 1484;
    }
    function tl() {
        return sE() | 0;
    }
    function ct(d, b, a, c) {
        d = d | 0;
        b = b | 0;
        a = a | 0;
        c = c | 0;
        if ((qv(c, 896) | 0) == 512) {
            if (a | 0) {
                tm(a);
                yJ(a);
            }
        } else if (b | 0) yJ(b);
        return;
    }
    function tm(a) {
        a = a | 0;
        a = d4[(a + 4) >> 2] | 0;
        if (a | 0) yF(a);
        return;
    }
    function tn(a) {
        a = a | 0;
        kj(a);
        return;
    }
    function to(c, b, a) {
        c = c | 0;
        b = b | 0;
        a = a | 0;
        c = jD(b) | 0;
        b = tp(a) | 0;
        a = tq(a, 0) | 0;
        tX(c, b, a, tr() | 0, 0);
        return;
    }
    function tp(a) {
        a = a | 0;
        return a | 0;
    }
    function tq(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = tr() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            tx(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            ty(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function tr() {
        var a = 0, b = 0;
        if (!(d2[7944] | 0)) {
            ts(10568);
            fo(61, 10568, eg | 0) | 0;
            b = 7944;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10568) | 0)) {
            a = 10568;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            ts(10568);
        }
        return 10568;
    }
    function ts(a) {
        a = a | 0;
        tu(a);
        return;
    }
    function cu(a) {
        a = a | 0;
        tt((a + 24) | 0);
        return;
    }
    function tt(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function tu(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 17, b, l7() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function cv(a) {
        a = a | 0;
        return tw(d4[(tv(a) | 0) >> 2] | 0) | 0;
    }
    function tv(a) {
        a = a | 0;
        return ((d4[((tr() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function tw(a) {
        a = a | 0;
        return ma(y3[a & 7]() | 0) | 0;
    }
    function tx(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function ty(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = tz(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            tA(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            tx(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            tB(a, c);
            tC(c);
            ed = h;
            return;
        }
    }
    function tz(a) {
        a = a | 0;
        return 536870911;
    }
    function tA(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function tB(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function tC(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function cw() {
        tD();
        return;
    }
    function tD() {
        tE(10604);
        return;
    }
    function tE(a) {
        a = a | 0;
        tF(a, 4955);
        return;
    }
    function tF(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = tG() | 0;
        d4[a >> 2] = c;
        tH(c, b);
        tI(d4[a >> 2] | 0);
        return;
    }
    function tG() {
        var a = 0;
        if (!(d2[7952] | 0)) {
            tQ(10612);
            fo(25, 10612, eg | 0) | 0;
            a = 7952;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10612;
    }
    function tH(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = tM() | 0;
        d4[(a + 4) >> 2] = tN() | 0;
        d4[(a + 12) >> 2] = b;
        d4[(a + 8) >> 2] = tO() | 0;
        d4[(a + 32) >> 2] = 8;
        return;
    }
    function tI(a) {
        a = a | 0;
        var b = 0, c = 0;
        b = ed;
        ed = (ed + 16) | 0;
        c = b;
        tJ() | 0;
        d4[c >> 2] = a;
        tK(10608, c);
        ed = b;
        return;
    }
    function tJ() {
        if (!(d2[11714] | 0)) {
            d4[2652] = 0;
            fo(62, 10608, eg | 0) | 0;
            d2[11714] = 1;
        }
        return 10608;
    }
    function tK(a, c) {
        a = a | 0;
        c = c | 0;
        var b = 0;
        b = yH(8) | 0;
        d4[(b + 4) >> 2] = d4[c >> 2];
        d4[b >> 2] = d4[a >> 2];
        d4[a >> 2] = b;
        return;
    }
    function cx(a) {
        a = a | 0;
        tL(a);
        return;
    }
    function tL(b) {
        b = b | 0;
        var a = 0, c = 0;
        a = d4[b >> 2] | 0;
        if (a | 0) do {
            c = a;
            a = d4[a >> 2] | 0;
            yJ(c);
        }while ((a | 0) != 0)
        d4[b >> 2] = 0;
        return;
    }
    function tM() {
        return 11715;
    }
    function tN() {
        return 1496;
    }
    function tO() {
        return qx() | 0;
    }
    function cy(d, b, a, c) {
        d = d | 0;
        b = b | 0;
        a = a | 0;
        c = c | 0;
        if ((qv(c, 896) | 0) == 512) {
            if (a | 0) {
                tP(a);
                yJ(a);
            }
        } else if (b | 0) yJ(b);
        return;
    }
    function tP(a) {
        a = a | 0;
        a = d4[(a + 4) >> 2] | 0;
        if (a | 0) yF(a);
        return;
    }
    function tQ(a) {
        a = a | 0;
        kj(a);
        return;
    }
    function cz(c, d) {
        c = c | 0;
        d = d | 0;
        var a = 0, b = 0;
        tJ() | 0;
        a = d4[2652] | 0;
        a: do if (a | 0) {
            while(1){
                b = d4[(a + 4) >> 2] | 0;
                if (b | 0 ? (x1(tR(b) | 0, c) | 0) == 0 : 0) break;
                a = d4[a >> 2] | 0;
                if (!a) break a;
            }
            tS(b, d);
        }
        while (0)
        return;
    }
    function tR(a) {
        a = a | 0;
        return d4[(a + 12) >> 2] | 0;
    }
    function tS(b, c) {
        b = b | 0;
        c = c | 0;
        var a = 0;
        b = (b + 36) | 0;
        a = d4[b >> 2] | 0;
        if (a | 0) {
            iL(a);
            yJ(a);
        }
        a = yH(4) | 0;
        iQ(a, c);
        d4[b >> 2] = a;
        return;
    }
    function tT() {
        if (!(d2[11716] | 0)) {
            d4[2664] = 0;
            fo(63, 10656, eg | 0) | 0;
            d2[11716] = 1;
        }
        return 10656;
    }
    function tU() {
        var a = 0;
        if (!(d2[11717] | 0)) {
            tV();
            d4[2665] = 1504;
            d2[11717] = 1;
            a = 1504;
        } else a = d4[2665] | 0;
        return a | 0;
    }
    function tV() {
        if (!(d2[11740] | 0)) {
            d2[11718] = jM(jM(8, 0) | 0, 0) | 0;
            d2[11719] = jM(jM(0, 0) | 0, 0) | 0;
            d2[11720] = jM(jM(0, 16) | 0, 0) | 0;
            d2[11721] = jM(jM(8, 0) | 0, 0) | 0;
            d2[11722] = jM(jM(0, 0) | 0, 0) | 0;
            d2[11723] = jM(jM(8, 0) | 0, 0) | 0;
            d2[11724] = jM(jM(0, 0) | 0, 0) | 0;
            d2[11725] = jM(jM(8, 0) | 0, 0) | 0;
            d2[11726] = jM(jM(0, 0) | 0, 0) | 0;
            d2[11727] = jM(jM(8, 0) | 0, 0) | 0;
            d2[11728] = jM(jM(0, 0) | 0, 0) | 0;
            d2[11729] = jM(jM(0, 0) | 0, 32) | 0;
            d2[11730] = jM(jM(0, 0) | 0, 32) | 0;
            d2[11740] = 1;
        }
        return;
    }
    function tW() {
        return 1572;
    }
    function tX(b, c, d, e, f) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var a = 0, g = 0, h = 0, i = 0, j = 0, k = 0;
        a = ed;
        ed = (ed + 32) | 0;
        k = (a + 16) | 0;
        j = (a + 12) | 0;
        i = (a + 8) | 0;
        h = (a + 4) | 0;
        g = a;
        d4[k >> 2] = b;
        d4[j >> 2] = c;
        d4[i >> 2] = d;
        d4[h >> 2] = e;
        d4[g >> 2] = f;
        tT() | 0;
        tY(10656, k, j, i, h, g);
        ed = a;
        return;
    }
    function tY(a, c, d, e, f, g) {
        a = a | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var b = 0;
        b = yH(24) | 0;
        jL((b + 4) | 0, d4[c >> 2] | 0, d4[d >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0, d4[g >> 2] | 0);
        d4[b >> 2] = d4[a >> 2];
        d4[a >> 2] = b;
        return;
    }
    function tZ(k, c, l) {
        k = k | 0;
        c = c | 0;
        l = l | 0;
        var a = 0, e = 0, f = 0, m = 0, g = 0, p = 0, i = 0, q = 0, r = 0, s = 0, j = 0, d = 0, b = 0, n = 0, o = 0, h = 0;
        h = ed;
        ed = (ed + 32) | 0;
        d = (h + 20) | 0;
        b = (h + 8) | 0;
        n = (h + 4) | 0;
        o = h;
        c = d4[c >> 2] | 0;
        if (c | 0) {
            j = (d + 4) | 0;
            p = (d + 8) | 0;
            i = (b + 4) | 0;
            q = (b + 8) | 0;
            r = (b + 8) | 0;
            s = (d + 8) | 0;
            do {
                m = (c + 4) | 0;
                g = t$(m) | 0;
                if (g | 0) {
                    e = t_(g) | 0;
                    d4[d >> 2] = 0;
                    d4[j >> 2] = 0;
                    d4[p >> 2] = 0;
                    a = ((t0(g) | 0) + 1) | 0;
                    t1(d, a);
                    if (a | 0) while(1){
                        a = (a + -1) | 0;
                        xx(b, d4[e >> 2] | 0);
                        f = d4[j >> 2] | 0;
                        if (f >>> 0 < (d4[s >> 2] | 0) >>> 0) {
                            d4[f >> 2] = d4[b >> 2];
                            d4[j >> 2] = (d4[j >> 2] | 0) + 4;
                        } else t2(d, b);
                        if (!a) break;
                        else e = (e + 4) | 0;
                    }
                    a = t3(g) | 0;
                    d4[b >> 2] = 0;
                    d4[i >> 2] = 0;
                    d4[q >> 2] = 0;
                    a: do if (d4[a >> 2] | 0) {
                        e = 0;
                        f = 0;
                        while(1){
                            if ((e | 0) == (f | 0)) t4(b, a);
                            else {
                                d4[e >> 2] = d4[a >> 2];
                                d4[i >> 2] = (d4[i >> 2] | 0) + 4;
                            }
                            a = (a + 4) | 0;
                            if (!(d4[a >> 2] | 0)) break a;
                            e = d4[i >> 2] | 0;
                            f = d4[r >> 2] | 0;
                        }
                    }
                    while (0)
                    d4[n >> 2] = t5(m) | 0;
                    d4[o >> 2] = jU(g) | 0;
                    t6(l, k, n, o, d, b);
                    t7(b);
                    t8(d);
                }
                c = d4[c >> 2] | 0;
            }while ((c | 0) != 0)
        }
        ed = h;
        return;
    }
    function t$(a) {
        a = a | 0;
        return d4[(a + 12) >> 2] | 0;
    }
    function t_(a) {
        a = a | 0;
        return d4[(a + 12) >> 2] | 0;
    }
    function t0(a) {
        a = a | 0;
        return d4[(a + 16) >> 2] | 0;
    }
    function t1(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        e = ed;
        ed = (ed + 32) | 0;
        c = e;
        d = d4[a >> 2] | 0;
        if ((((d4[(a + 8) >> 2] | 0) - d) >> 2) >>> 0 < b >>> 0) {
            uC(c, b, ((d4[(a + 4) >> 2] | 0) - d) >> 2, (a + 8) | 0);
            uD(a, c);
            uE(c);
        }
        ed = e;
        return;
    }
    function t2(a, e) {
        a = a | 0;
        e = e | 0;
        var c = 0, f = 0, d = 0, b = 0, g = 0, h = 0, i = 0, j = 0;
        g = ed;
        ed = (ed + 32) | 0;
        c = g;
        f = (a + 4) | 0;
        d = ((((d4[f >> 2] | 0) - (d4[a >> 2] | 0)) >> 2) + 1) | 0;
        b = uy(a) | 0;
        if (b >>> 0 < d >>> 0) yC(a);
        else {
            h = d4[a >> 2] | 0;
            j = ((d4[(a + 8) >> 2] | 0) - h) | 0;
            i = j >> 1;
            uC(c, (j >> 2) >>> 0 < (b >>> 1) >>> 0 ? i >>> 0 < d >>> 0 ? d : i : b, ((d4[f >> 2] | 0) - h) >> 2, (a + 8) | 0);
            b = (c + 8) | 0;
            d4[d4[b >> 2] >> 2] = d4[e >> 2];
            d4[b >> 2] = (d4[b >> 2] | 0) + 4;
            uD(a, c);
            uE(c);
            ed = g;
            return;
        }
    }
    function t3(a) {
        a = a | 0;
        return d4[(a + 8) >> 2] | 0;
    }
    function t4(a, e) {
        a = a | 0;
        e = e | 0;
        var c = 0, f = 0, d = 0, b = 0, g = 0, h = 0, i = 0, j = 0;
        g = ed;
        ed = (ed + 32) | 0;
        c = g;
        f = (a + 4) | 0;
        d = ((((d4[f >> 2] | 0) - (d4[a >> 2] | 0)) >> 2) + 1) | 0;
        b = uv(a) | 0;
        if (b >>> 0 < d >>> 0) yC(a);
        else {
            h = d4[a >> 2] | 0;
            j = ((d4[(a + 8) >> 2] | 0) - h) | 0;
            i = j >> 1;
            uz(c, (j >> 2) >>> 0 < (b >>> 1) >>> 0 ? i >>> 0 < d >>> 0 ? d : i : b, ((d4[f >> 2] | 0) - h) >> 2, (a + 8) | 0);
            b = (c + 8) | 0;
            d4[d4[b >> 2] >> 2] = d4[e >> 2];
            d4[b >> 2] = (d4[b >> 2] | 0) + 4;
            uA(a, c);
            uB(c);
            ed = g;
            return;
        }
    }
    function t5(a) {
        a = a | 0;
        return d4[a >> 2] | 0;
    }
    function t6(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        t9(a, b, c, d, e, f);
        return;
    }
    function t7(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -4 - d) | 0) >>> 2) << 2);
            yJ(b);
        }
        return;
    }
    function t8(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -4 - d) | 0) >>> 2) << 2);
            yJ(b);
        }
        return;
    }
    function t9(b, g, c, d, h, i) {
        b = b | 0;
        g = g | 0;
        c = c | 0;
        d = d | 0;
        h = h | 0;
        i = i | 0;
        var a = 0, j = 0, e = 0, f = 0, k = 0, l = 0;
        a = ed;
        ed = (ed + 48) | 0;
        k = (a + 40) | 0;
        j = (a + 32) | 0;
        l = (a + 24) | 0;
        e = (a + 12) | 0;
        f = a;
        xD(j);
        b = iT(b) | 0;
        d4[l >> 2] = d4[g >> 2];
        c = d4[c >> 2] | 0;
        d = d4[d >> 2] | 0;
        ua(e, h);
        ub(f, i);
        d4[k >> 2] = d4[l >> 2];
        uc(b, k, c, d, e, f);
        t7(f);
        t8(e);
        xF(j);
        ed = a;
        return;
    }
    function ua(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, c = 0;
        d4[a >> 2] = 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        d = (b + 4) | 0;
        c = ((d4[d >> 2] | 0) - (d4[b >> 2] | 0)) >> 2;
        if (c | 0) {
            uw(a, c);
            ux(a, d4[b >> 2] | 0, d4[d >> 2] | 0, c);
        }
        return;
    }
    function ub(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, c = 0;
        d4[a >> 2] = 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        d = (b + 4) | 0;
        c = ((d4[d >> 2] | 0) - (d4[b >> 2] | 0)) >> 2;
        if (c | 0) {
            ut(a, c);
            uu(a, d4[b >> 2] | 0, d4[d >> 2] | 0, c);
        }
        return;
    }
    function uc(k, h, i, j, c, d) {
        k = k | 0;
        h = h | 0;
        i = i | 0;
        j = j | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, l = 0, a = 0, b = 0;
        e = ed;
        ed = (ed + 32) | 0;
        a = (e + 28) | 0;
        b = (e + 24) | 0;
        f = (e + 12) | 0;
        g = e;
        l = iW(ud() | 0) | 0;
        d4[b >> 2] = d4[h >> 2];
        d4[a >> 2] = d4[b >> 2];
        h = ue(a) | 0;
        i = uf(i) | 0;
        j = ug(j) | 0;
        d4[f >> 2] = d4[c >> 2];
        a = (c + 4) | 0;
        d4[(f + 4) >> 2] = d4[a >> 2];
        b = (c + 8) | 0;
        d4[(f + 8) >> 2] = d4[b >> 2];
        d4[b >> 2] = 0;
        d4[a >> 2] = 0;
        d4[c >> 2] = 0;
        c = uh(f) | 0;
        d4[g >> 2] = d4[d >> 2];
        a = (d + 4) | 0;
        d4[(g + 4) >> 2] = d4[a >> 2];
        b = (d + 8) | 0;
        d4[(g + 8) >> 2] = d4[b >> 2];
        d4[b >> 2] = 0;
        d4[a >> 2] = 0;
        d4[d >> 2] = 0;
        fi(0, l | 0, k | 0, h | 0, i | 0, j | 0, c | 0, ui(g) | 0) | 0;
        t7(g);
        t8(f);
        ed = e;
        return;
    }
    function ud() {
        var a = 0;
        if (!(d2[7968] | 0)) {
            ur(10708);
            a = 7968;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10708;
    }
    function ue(a) {
        a = a | 0;
        return um(a) | 0;
    }
    function uf(a) {
        a = a | 0;
        return uk(a) | 0;
    }
    function ug(a) {
        a = a | 0;
        return ma(a) | 0;
    }
    function uh(a) {
        a = a | 0;
        return ul(a) | 0;
    }
    function ui(a) {
        a = a | 0;
        return uj(a) | 0;
    }
    function uj(c) {
        c = c | 0;
        var b = 0, d = 0, a = 0;
        a = ((d4[(c + 4) >> 2] | 0) - (d4[c >> 2] | 0)) | 0;
        d = a >> 2;
        a = cJ((a + 4) | 0) | 0;
        d4[a >> 2] = d;
        if (d | 0) {
            b = 0;
            do {
                d4[(a + 4 + (b << 2)) >> 2] = uk(d4[((d4[c >> 2] | 0) + (b << 2)) >> 2] | 0) | 0;
                b = (b + 1) | 0;
            }while ((b | 0) != (d | 0))
        }
        return a | 0;
    }
    function uk(a) {
        a = a | 0;
        return a | 0;
    }
    function ul(c) {
        c = c | 0;
        var b = 0, d = 0, a = 0;
        a = ((d4[(c + 4) >> 2] | 0) - (d4[c >> 2] | 0)) | 0;
        d = a >> 2;
        a = cJ((a + 4) | 0) | 0;
        d4[a >> 2] = d;
        if (d | 0) {
            b = 0;
            do {
                d4[(a + 4 + (b << 2)) >> 2] = um(((d4[c >> 2] | 0) + (b << 2)) | 0) | 0;
                b = (b + 1) | 0;
            }while ((b | 0) != (d | 0))
        }
        return a | 0;
    }
    function um(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, c = 0;
        c = ed;
        ed = (ed + 32) | 0;
        b = (c + 12) | 0;
        d = c;
        e = j2(un() | 0) | 0;
        if (!e) a = uo(a) | 0;
        else {
            j3(b, e);
            j4(d, b);
            xA(a, d);
            a = j6(b) | 0;
        }
        ed = c;
        return a | 0;
    }
    function un() {
        var a = 0;
        if (!(d2[7960] | 0)) {
            uq(10664);
            fo(25, 10664, eg | 0) | 0;
            a = 7960;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10664;
    }
    function uo(a) {
        a = a | 0;
        var d = 0, c = 0, e = 0, f = 0, b = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        f = (c + 4) | 0;
        g = c;
        e = cJ(8) | 0;
        d = e;
        h = yH(4) | 0;
        d4[h >> 2] = d4[a >> 2];
        b = (d + 4) | 0;
        d4[b >> 2] = h;
        a = yH(8) | 0;
        b = d4[b >> 2] | 0;
        d4[g >> 2] = 0;
        d4[f >> 2] = d4[g >> 2];
        up(a, b, f);
        d4[e >> 2] = a;
        ed = c;
        return d | 0;
    }
    function up(b, c, a) {
        b = b | 0;
        c = c | 0;
        a = a | 0;
        d4[b >> 2] = c;
        a = yH(16) | 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        d4[a >> 2] = 1656;
        d4[(a + 12) >> 2] = c;
        d4[(b + 4) >> 2] = a;
        return;
    }
    function cA(a) {
        a = a | 0;
        c9(a);
        yJ(a);
        return;
    }
    function cB(a) {
        a = a | 0;
        a = d4[(a + 12) >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function cC(a) {
        a = a | 0;
        yJ(a);
        return;
    }
    function uq(a) {
        a = a | 0;
        kj(a);
        return;
    }
    function ur(a) {
        a = a | 0;
        i6(a, us() | 0, 5);
        return;
    }
    function us() {
        return 1676;
    }
    function ut(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        if ((uv(a) | 0) >>> 0 < b >>> 0) yC(a);
        if (b >>> 0 > 1073741823) fA();
        else {
            c = yH(b << 2) | 0;
            d4[(a + 4) >> 2] = c;
            d4[a >> 2] = c;
            d4[(a + 8) >> 2] = c + (b << 2);
            return;
        }
    }
    function uu(a, c, d, b) {
        a = a | 0;
        c = c | 0;
        d = d | 0;
        b = b | 0;
        b = (a + 4) | 0;
        a = (d - c) | 0;
        if ((a | 0) > 0) {
            dh(d4[b >> 2] | 0, c | 0, a | 0) | 0;
            d4[b >> 2] = (d4[b >> 2] | 0) + ((a >>> 2) << 2);
        }
        return;
    }
    function uv(a) {
        a = a | 0;
        return 1073741823;
    }
    function uw(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        if ((uy(a) | 0) >>> 0 < b >>> 0) yC(a);
        if (b >>> 0 > 1073741823) fA();
        else {
            c = yH(b << 2) | 0;
            d4[(a + 4) >> 2] = c;
            d4[a >> 2] = c;
            d4[(a + 8) >> 2] = c + (b << 2);
            return;
        }
    }
    function ux(a, c, d, b) {
        a = a | 0;
        c = c | 0;
        d = d | 0;
        b = b | 0;
        b = (a + 4) | 0;
        a = (d - c) | 0;
        if ((a | 0) > 0) {
            dh(d4[b >> 2] | 0, c | 0, a | 0) | 0;
            d4[b >> 2] = (d4[b >> 2] | 0) + ((a >>> 2) << 2);
        }
        return;
    }
    function uy(a) {
        a = a | 0;
        return 1073741823;
    }
    function uz(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 1073741823) fA();
            else {
                d = yH(b << 2) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 2)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 2);
        return;
    }
    function uA(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 2)) << 2)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function uB(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -4 - c) | 0) >>> 2) << 2);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function uC(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 1073741823) fA();
            else {
                d = yH(b << 2) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 2)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 2);
        return;
    }
    function uD(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 2)) << 2)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function uE(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -4 - c) | 0) >>> 2) << 2);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function cD(e, f, j, o, l) {
        e = e | 0;
        f = f | 0;
        j = j | 0;
        o = o | 0;
        l = l | 0;
        var a = 0, c = 0, d = 0, g = 0, k = 0, b = 0, h = 0, m = 0, n = 0, p = 0, i = 0;
        i = ed;
        ed = (ed + 32) | 0;
        b = (i + 20) | 0;
        h = (i + 12) | 0;
        k = (i + 16) | 0;
        m = (i + 4) | 0;
        n = i;
        p = (i + 8) | 0;
        d = tU() | 0;
        a = d4[d >> 2] | 0;
        c = d4[a >> 2] | 0;
        if (c | 0) {
            g = d4[(d + 8) >> 2] | 0;
            d = d4[(d + 4) >> 2] | 0;
            while(1){
                xx(b, c);
                uF(e, b, d, g);
                a = (a + 4) | 0;
                c = d4[a >> 2] | 0;
                if (!c) break;
                else {
                    g = (g + 1) | 0;
                    d = (d + 1) | 0;
                }
            }
        }
        a = tW() | 0;
        c = d4[a >> 2] | 0;
        if (c | 0) do {
            xx(b, c);
            d4[h >> 2] = d4[(a + 4) >> 2];
            uG(f, b, h);
            a = (a + 8) | 0;
            c = d4[a >> 2] | 0;
        }while ((c | 0) != 0)
        a = d4[(tJ() | 0) >> 2] | 0;
        if (a | 0) do {
            f = d4[(a + 4) >> 2] | 0;
            xx(b, d4[(uH(f) | 0) >> 2] | 0);
            d4[h >> 2] = tR(f) | 0;
            uI(j, b, h);
            a = d4[a >> 2] | 0;
        }while ((a | 0) != 0)
        xx(k, 0);
        a = tT() | 0;
        d4[b >> 2] = d4[k >> 2];
        tZ(b, a, l);
        a = d4[(tJ() | 0) >> 2] | 0;
        if (a | 0) {
            e = (b + 4) | 0;
            f = (b + 8) | 0;
            j = (b + 8) | 0;
            do {
                g = d4[(a + 4) >> 2] | 0;
                xx(h, d4[(uH(g) | 0) >> 2] | 0);
                uK(m, uJ(g) | 0);
                c = d4[m >> 2] | 0;
                if (c | 0) {
                    d4[b >> 2] = 0;
                    d4[e >> 2] = 0;
                    d4[f >> 2] = 0;
                    do {
                        xx(n, d4[(uH(d4[(c + 4) >> 2] | 0) | 0) >> 2] | 0);
                        d = d4[e >> 2] | 0;
                        if (d >>> 0 < (d4[j >> 2] | 0) >>> 0) {
                            d4[d >> 2] = d4[n >> 2];
                            d4[e >> 2] = (d4[e >> 2] | 0) + 4;
                        } else t2(b, n);
                        c = d4[c >> 2] | 0;
                    }while ((c | 0) != 0)
                    uL(o, h, b);
                    t8(b);
                }
                d4[p >> 2] = d4[h >> 2];
                k = uM(g) | 0;
                d4[b >> 2] = d4[p >> 2];
                tZ(b, k, l);
                kg(m);
                a = d4[a >> 2] | 0;
            }while ((a | 0) != 0)
        }
        ed = i;
        return;
    }
    function uF(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        u$(a, b, c, d);
        return;
    }
    function uG(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        uZ(a, b, c);
        return;
    }
    function uH(a) {
        a = a | 0;
        return a | 0;
    }
    function uI(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        uU(a, b, c);
        return;
    }
    function uJ(a) {
        a = a | 0;
        return (a + 16) | 0;
    }
    function uK(a, b) {
        a = a | 0;
        b = b | 0;
        var f = 0, d = 0, e = 0, g = 0, c = 0, i = 0, h = 0;
        g = ed;
        ed = (ed + 16) | 0;
        e = (g + 8) | 0;
        f = g;
        d4[a >> 2] = 0;
        d = d4[b >> 2] | 0;
        d4[e >> 2] = d;
        d4[f >> 2] = a;
        f = uS(f) | 0;
        if (d | 0) {
            d = yH(12) | 0;
            c = ((uT(e) | 0) + 4) | 0;
            a = d4[(c + 4) >> 2] | 0;
            b = (d + 4) | 0;
            d4[b >> 2] = d4[c >> 2];
            d4[(b + 4) >> 2] = a;
            b = d4[d4[e >> 2] >> 2] | 0;
            d4[e >> 2] = b;
            if (!b) a = d;
            else {
                b = d;
                while(1){
                    a = yH(12) | 0;
                    h = ((uT(e) | 0) + 4) | 0;
                    i = d4[(h + 4) >> 2] | 0;
                    c = (a + 4) | 0;
                    d4[c >> 2] = d4[h >> 2];
                    d4[(c + 4) >> 2] = i;
                    d4[b >> 2] = a;
                    c = d4[d4[e >> 2] >> 2] | 0;
                    d4[e >> 2] = c;
                    if (!c) break;
                    else b = a;
                }
            }
            d4[a >> 2] = d4[f >> 2];
            d4[f >> 2] = d;
        }
        ed = g;
        return;
    }
    function uL(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        uN(a, b, c);
        return;
    }
    function uM(a) {
        a = a | 0;
        return (a + 24) | 0;
    }
    function uN(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var a = 0, f = 0, c = 0, g = 0, h = 0;
        a = ed;
        ed = (ed + 32) | 0;
        g = (a + 24) | 0;
        f = (a + 16) | 0;
        h = (a + 12) | 0;
        c = a;
        xD(f);
        b = iT(b) | 0;
        d4[h >> 2] = d4[d >> 2];
        ua(c, e);
        d4[g >> 2] = d4[h >> 2];
        uO(b, g, c);
        t8(c);
        xF(f);
        ed = a;
        return;
    }
    function uO(g, e, a) {
        g = g | 0;
        e = e | 0;
        a = a | 0;
        var f = 0, b = 0, h = 0, c = 0, d = 0;
        f = ed;
        ed = (ed + 32) | 0;
        c = (f + 16) | 0;
        d = (f + 12) | 0;
        b = f;
        h = iW(uP() | 0) | 0;
        d4[d >> 2] = d4[e >> 2];
        d4[c >> 2] = d4[d >> 2];
        e = ue(c) | 0;
        d4[b >> 2] = d4[a >> 2];
        c = (a + 4) | 0;
        d4[(b + 4) >> 2] = d4[c >> 2];
        d = (a + 8) | 0;
        d4[(b + 8) >> 2] = d4[d >> 2];
        d4[d >> 2] = 0;
        d4[c >> 2] = 0;
        d4[a >> 2] = 0;
        fe(0, h | 0, g | 0, e | 0, uh(b) | 0) | 0;
        t8(b);
        ed = f;
        return;
    }
    function uP() {
        var a = 0;
        if (!(d2[7976] | 0)) {
            uQ(10720);
            a = 7976;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10720;
    }
    function uQ(a) {
        a = a | 0;
        i6(a, uR() | 0, 2);
        return;
    }
    function uR() {
        return 1732;
    }
    function uS(a) {
        a = a | 0;
        return d4[a >> 2] | 0;
    }
    function uT(a) {
        a = a | 0;
        return d4[a >> 2] | 0;
    }
    function uU(a, d, b) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        var c = 0, e = 0, f = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        f = (c + 16) | 0;
        e = (c + 8) | 0;
        g = c;
        xD(e);
        a = iT(a) | 0;
        d4[g >> 2] = d4[d >> 2];
        b = d4[b >> 2] | 0;
        d4[f >> 2] = d4[g >> 2];
        uV(a, f, b);
        xF(e);
        ed = c;
        return;
    }
    function uV(c, a, d) {
        c = c | 0;
        a = a | 0;
        d = d | 0;
        var b = 0, g = 0, e = 0, f = 0;
        b = ed;
        ed = (ed + 16) | 0;
        e = (b + 4) | 0;
        f = b;
        g = iW(uW() | 0) | 0;
        d4[f >> 2] = d4[a >> 2];
        d4[e >> 2] = d4[f >> 2];
        a = ue(e) | 0;
        fe(0, g | 0, c | 0, a | 0, uf(d) | 0) | 0;
        ed = b;
        return;
    }
    function uW() {
        var a = 0;
        if (!(d2[7984] | 0)) {
            uX(10732);
            a = 7984;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10732;
    }
    function uX(a) {
        a = a | 0;
        i6(a, uY() | 0, 2);
        return;
    }
    function uY() {
        return 1744;
    }
    function uZ(a, d, b) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        var c = 0, e = 0, f = 0, g = 0;
        c = ed;
        ed = (ed + 32) | 0;
        f = (c + 16) | 0;
        e = (c + 8) | 0;
        g = c;
        xD(e);
        a = iT(a) | 0;
        d4[g >> 2] = d4[d >> 2];
        b = d4[b >> 2] | 0;
        d4[f >> 2] = d4[g >> 2];
        uV(a, f, b);
        xF(e);
        ed = c;
        return;
    }
    function u$(a, e, b, c) {
        a = a | 0;
        e = e | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, f = 0, g = 0, h = 0;
        d = ed;
        ed = (ed + 32) | 0;
        g = (d + 16) | 0;
        f = (d + 8) | 0;
        h = d;
        xD(f);
        a = iT(a) | 0;
        d4[h >> 2] = d4[e >> 2];
        b = d2[b >> 0] | 0;
        c = d2[c >> 0] | 0;
        d4[g >> 2] = d4[h >> 2];
        u_(a, g, b, c);
        xF(f);
        ed = d;
        return;
    }
    function u_(d, a, b, e) {
        d = d | 0;
        a = a | 0;
        b = b | 0;
        e = e | 0;
        var c = 0, h = 0, f = 0, g = 0;
        c = ed;
        ed = (ed + 16) | 0;
        f = (c + 4) | 0;
        g = c;
        h = iW(u0() | 0) | 0;
        d4[g >> 2] = d4[a >> 2];
        d4[f >> 2] = d4[g >> 2];
        a = ue(f) | 0;
        b = u1(b) | 0;
        fI(0, h | 0, d | 0, a | 0, b | 0, u1(e) | 0) | 0;
        ed = c;
        return;
    }
    function u0() {
        var a = 0;
        if (!(d2[7992] | 0)) {
            u3(10744);
            a = 7992;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10744;
    }
    function u1(a) {
        a = a | 0;
        return u2(a) | 0;
    }
    function u2(a) {
        a = a | 0;
        return (a & 255) | 0;
    }
    function u3(a) {
        a = a | 0;
        i6(a, u4() | 0, 3);
        return;
    }
    function u4() {
        return 1756;
    }
    function cE(f, b, h) {
        f = f | 0;
        b = b | 0;
        h = h | 0;
        var i = 0, k = 0, l = 0, m = 0, e = 0, a = 0, d = 0, g = 0, c = 0, j = 0;
        j = ed;
        ed = (ed + 32) | 0;
        e = (j + 8) | 0;
        a = (j + 4) | 0;
        d = (j + 20) | 0;
        g = j;
        li(f, 0);
        i = xz(b) | 0;
        d4[e >> 2] = 0;
        c = (e + 4) | 0;
        d4[c >> 2] = 0;
        d4[(e + 8) >> 2] = 0;
        switch((i << 24) >> 24){
            case 0:
                {
                    d2[d >> 0] = 0;
                    u5(a, h, d);
                    u6(f, a) | 0;
                    iM(a);
                    break;
                }
            case 8:
                {
                    c = xy(b) | 0;
                    d2[d >> 0] = 8;
                    xx(g, d4[(c + 4) >> 2] | 0);
                    u7(a, h, d, g, (c + 8) | 0);
                    u6(f, a) | 0;
                    iM(a);
                    break;
                }
            case 9:
                {
                    l = xy(b) | 0;
                    b = d4[(l + 4) >> 2] | 0;
                    if (b | 0) {
                        m = (e + 8) | 0;
                        k = (l + 12) | 0;
                        while(1){
                            b = (b + -1) | 0;
                            xx(a, d4[k >> 2] | 0);
                            i = d4[c >> 2] | 0;
                            if (i >>> 0 < (d4[m >> 2] | 0) >>> 0) {
                                d4[i >> 2] = d4[a >> 2];
                                d4[c >> 2] = (d4[c >> 2] | 0) + 4;
                            } else t2(e, a);
                            if (!b) break;
                            else k = (k + 4) | 0;
                        }
                    }
                    d2[d >> 0] = 9;
                    xx(g, d4[(l + 8) >> 2] | 0);
                    u8(a, h, d, g, e);
                    u6(f, a) | 0;
                    iM(a);
                    break;
                }
            default:
                {
                    c = xy(b) | 0;
                    d2[d >> 0] = i;
                    xx(g, d4[(c + 4) >> 2] | 0);
                    u9(a, h, d, g);
                    u6(f, a) | 0;
                    iM(a);
                }
        }
        t8(e);
        ed = j;
        return;
    }
    function u5(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = c | 0;
        var d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        e = d;
        xD(e);
        a = iT(a) | 0;
        vn(b, a, d2[c >> 0] | 0);
        xF(e);
        ed = d;
        return;
    }
    function u6(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = d4[a >> 2] | 0;
        if (c | 0) fJ(c | 0);
        d4[a >> 2] = d4[b >> 2];
        d4[b >> 2] = 0;
        return a | 0;
    }
    function u7(e, a, b, f, c) {
        e = e | 0;
        a = a | 0;
        b = b | 0;
        f = f | 0;
        c = c | 0;
        var d = 0, g = 0, h = 0, i = 0;
        d = ed;
        ed = (ed + 32) | 0;
        h = (d + 16) | 0;
        g = (d + 8) | 0;
        i = d;
        xD(g);
        a = iT(a) | 0;
        b = d2[b >> 0] | 0;
        d4[i >> 2] = d4[f >> 2];
        c = d4[c >> 2] | 0;
        d4[h >> 2] = d4[i >> 2];
        vj(e, a, b, h, c);
        xF(g);
        ed = d;
        return;
    }
    function u8(e, b, c, f, g) {
        e = e | 0;
        b = b | 0;
        c = c | 0;
        f = f | 0;
        g = g | 0;
        var a = 0, h = 0, d = 0, i = 0, j = 0;
        a = ed;
        ed = (ed + 32) | 0;
        i = (a + 24) | 0;
        h = (a + 16) | 0;
        j = (a + 12) | 0;
        d = a;
        xD(h);
        b = iT(b) | 0;
        c = d2[c >> 0] | 0;
        d4[j >> 2] = d4[f >> 2];
        ua(d, g);
        d4[i >> 2] = d4[j >> 2];
        vf(e, b, c, i, d);
        t8(d);
        xF(h);
        ed = a;
        return;
    }
    function u9(d, a, b, e) {
        d = d | 0;
        a = a | 0;
        b = b | 0;
        e = e | 0;
        var c = 0, f = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 32) | 0;
        g = (c + 16) | 0;
        f = (c + 8) | 0;
        h = c;
        xD(f);
        a = iT(a) | 0;
        b = d2[b >> 0] | 0;
        d4[h >> 2] = d4[e >> 2];
        d4[g >> 2] = d4[h >> 2];
        va(d, a, b, g);
        xF(f);
        ed = c;
        return;
    }
    function va(c, d, a, e) {
        c = c | 0;
        d = d | 0;
        a = a | 0;
        e = e | 0;
        var b = 0, f = 0, h = 0, g = 0;
        b = ed;
        ed = (ed + 16) | 0;
        f = (b + 4) | 0;
        g = b;
        h = iW(vb() | 0) | 0;
        a = u1(a) | 0;
        d4[g >> 2] = d4[e >> 2];
        d4[f >> 2] = d4[g >> 2];
        vc(c, fe(0, h | 0, d | 0, a | 0, ue(f) | 0) | 0);
        ed = b;
        return;
    }
    function vb() {
        var a = 0;
        if (!(d2[8e3] | 0)) {
            vd(10756);
            a = 8e3;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10756;
    }
    function vc(a, b) {
        a = a | 0;
        b = b | 0;
        li(a, b);
        return;
    }
    function vd(a) {
        a = a | 0;
        i6(a, ve() | 0, 2);
        return;
    }
    function ve() {
        return 1772;
    }
    function vf(h, i, e, f, a) {
        h = h | 0;
        i = i | 0;
        e = e | 0;
        f = f | 0;
        a = a | 0;
        var g = 0, b = 0, j = 0, c = 0, d = 0;
        g = ed;
        ed = (ed + 32) | 0;
        c = (g + 16) | 0;
        d = (g + 12) | 0;
        b = g;
        j = iW(vg() | 0) | 0;
        e = u1(e) | 0;
        d4[d >> 2] = d4[f >> 2];
        d4[c >> 2] = d4[d >> 2];
        f = ue(c) | 0;
        d4[b >> 2] = d4[a >> 2];
        c = (a + 4) | 0;
        d4[(b + 4) >> 2] = d4[c >> 2];
        d = (a + 8) | 0;
        d4[(b + 8) >> 2] = d4[d >> 2];
        d4[d >> 2] = 0;
        d4[c >> 2] = 0;
        d4[a >> 2] = 0;
        vc(h, fI(0, j | 0, i | 0, e | 0, f | 0, uh(b) | 0) | 0);
        t8(b);
        ed = g;
        return;
    }
    function vg() {
        var a = 0;
        if (!(d2[8008] | 0)) {
            vh(10768);
            a = 8008;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10768;
    }
    function vh(a) {
        a = a | 0;
        i6(a, vi() | 0, 3);
        return;
    }
    function vi() {
        return 1784;
    }
    function vj(d, e, a, b, f) {
        d = d | 0;
        e = e | 0;
        a = a | 0;
        b = b | 0;
        f = f | 0;
        var c = 0, i = 0, g = 0, h = 0;
        c = ed;
        ed = (ed + 16) | 0;
        g = (c + 4) | 0;
        h = c;
        i = iW(vk() | 0) | 0;
        a = u1(a) | 0;
        d4[h >> 2] = d4[b >> 2];
        d4[g >> 2] = d4[h >> 2];
        b = ue(g) | 0;
        vc(d, fI(0, i | 0, e | 0, a | 0, b | 0, ug(f) | 0) | 0);
        ed = c;
        return;
    }
    function vk() {
        var a = 0;
        if (!(d2[8016] | 0)) {
            vl(10780);
            a = 8016;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10780;
    }
    function vl(a) {
        a = a | 0;
        i6(a, vm() | 0, 3);
        return;
    }
    function vm() {
        return 1800;
    }
    function vn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = iW(vo() | 0) | 0;
        vc(a, fK(0, d | 0, b | 0, u1(c) | 0) | 0);
        return;
    }
    function vo() {
        var a = 0;
        if (!(d2[8024] | 0)) {
            vp(10792);
            a = 8024;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 10792;
    }
    function vp(a) {
        a = a | 0;
        i6(a, vq() | 0, 1);
        return;
    }
    function vq() {
        return 1816;
    }
    function cF() {
        vr();
        vs();
        vt();
        return;
    }
    function vr() {
        d4[2702] = yI(65536) | 0;
        return;
    }
    function vs() {
        vL(10856);
        return;
    }
    function vt() {
        vu(10816);
        return;
    }
    function vu(a) {
        a = a | 0;
        vv(a, 5044);
        vw(a) | 0;
        return;
    }
    function vv(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = un() | 0;
        d4[a >> 2] = c;
        vG(c, b);
        tI(d4[a >> 2] | 0);
        return;
    }
    function vw(a) {
        a = a | 0;
        var b = 0;
        b = d4[a >> 2] | 0;
        sh(b, vx() | 0);
        return a | 0;
    }
    function vx() {
        var a = 0;
        if (!(d2[8032] | 0)) {
            vy(10820);
            fo(64, 10820, eg | 0) | 0;
            a = 8032;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        if (!(jU(10820) | 0)) vy(10820);
        return 10820;
    }
    function vy(a) {
        a = a | 0;
        vA(a);
        sl(a, 25);
        return;
    }
    function cG(a) {
        a = a | 0;
        vz((a + 24) | 0);
        return;
    }
    function vz(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function vA(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 5, 18, b, vE() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function cH(a, b) {
        a = a | 0;
        b = b | 0;
        vB(a, b);
        return;
    }
    function vB(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = ed;
        ed = (ed + 16) | 0;
        d = b;
        e = (b + 4) | 0;
        lA(e, a);
        d4[d >> 2] = lB(e, a) | 0;
        vC(c, d);
        ed = b;
        return;
    }
    function vC(a, b) {
        a = a | 0;
        b = b | 0;
        vD((a + 4) | 0, d4[b >> 2] | 0);
        d2[(a + 8) >> 0] = 1;
        return;
    }
    function vD(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = b;
        return;
    }
    function vE() {
        return 1824;
    }
    function cI(a) {
        a = a | 0;
        return vF(a) | 0;
    }
    function vF(a) {
        a = a | 0;
        var e = 0, d = 0, f = 0, b = 0, c = 0, g = 0, h = 0;
        d = ed;
        ed = (ed + 16) | 0;
        b = (d + 4) | 0;
        g = d;
        f = cJ(8) | 0;
        e = f;
        h = yH(4) | 0;
        lA(b, a);
        vD(h, lB(b, a) | 0);
        c = (e + 4) | 0;
        d4[c >> 2] = h;
        a = yH(8) | 0;
        c = d4[c >> 2] | 0;
        d4[g >> 2] = 0;
        d4[b >> 2] = d4[g >> 2];
        up(a, c, b);
        d4[f >> 2] = a;
        ed = d;
        return e | 0;
    }
    function cJ(a) {
        a = a | 0;
        var b = 0, c = 0;
        a = (a + 7) & -8;
        if (a >>> 0 <= 32768 ? ((b = d4[2701] | 0), a >>> 0 <= ((65536 - b) | 0) >>> 0) : 0) {
            c = ((d4[2702] | 0) + b) | 0;
            d4[2701] = b + a;
            a = c;
        } else {
            a = yI((a + 8) | 0) | 0;
            d4[a >> 2] = d4[2703];
            d4[2703] = a;
            a = (a + 8) | 0;
        }
        return a | 0;
    }
    function vG(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = vH() | 0;
        d4[(a + 4) >> 2] = vI() | 0;
        d4[(a + 12) >> 2] = b;
        d4[(a + 8) >> 2] = vJ() | 0;
        d4[(a + 32) >> 2] = 9;
        return;
    }
    function vH() {
        return 11744;
    }
    function vI() {
        return 1832;
    }
    function vJ() {
        return sE() | 0;
    }
    function cK(d, b, a, c) {
        d = d | 0;
        b = b | 0;
        a = a | 0;
        c = c | 0;
        if ((qv(c, 896) | 0) == 512) {
            if (a | 0) {
                vK(a);
                yJ(a);
            }
        } else if (b | 0) yJ(b);
        return;
    }
    function vK(a) {
        a = a | 0;
        a = d4[(a + 4) >> 2] | 0;
        if (a | 0) yF(a);
        return;
    }
    function vL(a) {
        a = a | 0;
        vM(a, 5052);
        vN(a) | 0;
        vO(a, 5058, 26) | 0;
        vP(a, 5069, 1) | 0;
        vQ(a, 5077, 10) | 0;
        vR(a, 5087, 19) | 0;
        vS(a, 5094, 27) | 0;
        return;
    }
    function vM(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = xq() | 0;
        d4[a >> 2] = c;
        xr(c, b);
        tI(d4[a >> 2] | 0);
        return;
    }
    function vN(a) {
        a = a | 0;
        var b = 0;
        b = d4[a >> 2] | 0;
        sh(b, xh() | 0);
        return a | 0;
    }
    function vO(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        w$(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function vP(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        wK(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function vQ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        wn(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function vR(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        v7(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function cL(b, c) {
        b = b | 0;
        c = c | 0;
        var a = 0, d = 0;
        a: while(1){
            a = d4[2703] | 0;
            while(1){
                if ((a | 0) == (c | 0)) break a;
                d = d4[a >> 2] | 0;
                d4[2703] = d;
                if (!a) a = d;
                else break;
            }
            yJ(a);
        }
        d4[2701] = b;
        return;
    }
    function vS(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        vT(a, jD(b) | 0, c, 0);
        return a | 0;
    }
    function vT(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = vU() | 0;
        a = vV(b) | 0;
        jI(f, d, e, a, vW(b, c) | 0, c);
        return;
    }
    function vU() {
        var a = 0, b = 0;
        if (!(d2[8040] | 0)) {
            v1(10860);
            fo(65, 10860, eg | 0) | 0;
            b = 8040;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10860) | 0)) {
            a = 10860;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            v1(10860);
        }
        return 10860;
    }
    function vV(a) {
        a = a | 0;
        return a | 0;
    }
    function vW(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = vU() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            vX(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            vY(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function vX(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function vY(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = vZ(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            v$(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            vX(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            v_(a, c);
            v0(c);
            ed = h;
            return;
        }
    }
    function vZ(a) {
        a = a | 0;
        return 536870911;
    }
    function v$(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function v_(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function v0(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function v1(a) {
        a = a | 0;
        v3(a);
        return;
    }
    function cM(a) {
        a = a | 0;
        v2((a + 24) | 0);
        return;
    }
    function v2(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function v3(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 11, b, v4() | 0, 2);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function v4() {
        return 1840;
    }
    function cN(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        v6(d4[(v5(a) | 0) >> 2] | 0, b, c);
        return;
    }
    function v5(a) {
        a = a | 0;
        return ((d4[((vU() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function v6(d, a, b) {
        d = d | 0;
        a = a | 0;
        b = b | 0;
        var c = 0, e = 0, f = 0;
        c = ed;
        ed = (ed + 16) | 0;
        f = (c + 1) | 0;
        e = c;
        lA(f, a);
        a = lB(f, a) | 0;
        lA(e, b);
        b = lB(e, b) | 0;
        yT[d & 31](a, b);
        ed = c;
        return;
    }
    function v7(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = v8() | 0;
        a = v9(b) | 0;
        jI(f, d, e, a, wa(b, c) | 0, c);
        return;
    }
    function v8() {
        var a = 0, b = 0;
        if (!(d2[8048] | 0)) {
            wh(10896);
            fo(66, 10896, eg | 0) | 0;
            b = 8048;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10896) | 0)) {
            a = 10896;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            wh(10896);
        }
        return 10896;
    }
    function v9(a) {
        a = a | 0;
        return a | 0;
    }
    function wa(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = v8() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            wb(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            wc(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function wb(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function wc(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = wd(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            we(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            wb(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            wf(a, c);
            wg(c);
            ed = h;
            return;
        }
    }
    function wd(a) {
        a = a | 0;
        return 536870911;
    }
    function we(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function wf(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function wg(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function wh(a) {
        a = a | 0;
        wj(a);
        return;
    }
    function cO(a) {
        a = a | 0;
        wi((a + 24) | 0);
        return;
    }
    function wi(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function wj(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 11, b, wk() | 0, 1);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function wk() {
        return 1852;
    }
    function cP(a, b) {
        a = a | 0;
        b = b | 0;
        return wm(d4[(wl(a) | 0) >> 2] | 0, b) | 0;
    }
    function wl(a) {
        a = a | 0;
        return ((d4[((v8() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function wm(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        lA(d, a);
        a = lB(d, a) | 0;
        a = ma(yU[b & 31](a) | 0) | 0;
        ed = c;
        return a | 0;
    }
    function wn(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = wo() | 0;
        a = wp(b) | 0;
        jI(f, d, e, a, wq(b, c) | 0, c);
        return;
    }
    function wo() {
        var a = 0, b = 0;
        if (!(d2[8056] | 0)) {
            wx(10932);
            fo(67, 10932, eg | 0) | 0;
            b = 8056;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10932) | 0)) {
            a = 10932;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            wx(10932);
        }
        return 10932;
    }
    function wp(a) {
        a = a | 0;
        return a | 0;
    }
    function wq(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = wo() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            wr(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            ws(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function wr(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function ws(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = wt(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            wu(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            wr(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            wv(a, c);
            ww(c);
            ed = h;
            return;
        }
    }
    function wt(a) {
        a = a | 0;
        return 536870911;
    }
    function wu(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function wv(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function ww(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function wx(a) {
        a = a | 0;
        wz(a);
        return;
    }
    function cQ(a) {
        a = a | 0;
        wy((a + 24) | 0);
        return;
    }
    function wy(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function wz(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 7, b, wA() | 0, 2);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function wA() {
        return 1860;
    }
    function cR(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        return wC(d4[(wB(a) | 0) >> 2] | 0, b, c) | 0;
    }
    function wB(a) {
        a = a | 0;
        return ((d4[((wo() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function wC(f, c, a) {
        f = f | 0;
        c = c | 0;
        a = a | 0;
        var b = 0, d = 0, e = 0, g = 0, h = 0, i = 0;
        b = ed;
        ed = (ed + 32) | 0;
        g = (b + 12) | 0;
        e = (b + 8) | 0;
        h = b;
        i = (b + 16) | 0;
        d = (b + 4) | 0;
        wD(i, c);
        wE(h, i, c);
        le(d, a);
        a = lf(d, a) | 0;
        d4[g >> 2] = d4[h >> 2];
        y7[f & 15](e, g, a);
        a = wF(e) | 0;
        iM(e);
        lg(d);
        ed = b;
        return a | 0;
    }
    function wD(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function wE(a, c, b) {
        a = a | 0;
        c = c | 0;
        b = b | 0;
        wG(a, b);
        return;
    }
    function wF(a) {
        a = a | 0;
        return iT(a) | 0;
    }
    function wG(b, c) {
        b = b | 0;
        c = c | 0;
        var a = 0, d = 0, e = 0;
        e = ed;
        ed = (ed + 16) | 0;
        a = e;
        d = c;
        if (!(d & 1)) d4[b >> 2] = d4[c >> 2];
        else {
            wH(a, 0);
            fq(d | 0, a | 0) | 0;
            wI(b, a);
            wJ(a);
        }
        ed = e;
        return;
    }
    function wH(a, b) {
        a = a | 0;
        b = b | 0;
        i1(a, b);
        d4[(a + 4) >> 2] = 0;
        d2[(a + 8) >> 0] = 0;
        return;
    }
    function wI(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = d4[(b + 4) >> 2];
        return;
    }
    function wJ(a) {
        a = a | 0;
        d2[(a + 8) >> 0] = 0;
        return;
    }
    function wK(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = wL() | 0;
        a = wM(b) | 0;
        jI(f, d, e, a, wN(b, c) | 0, c);
        return;
    }
    function wL() {
        var a = 0, b = 0;
        if (!(d2[8064] | 0)) {
            wU(10968);
            fo(68, 10968, eg | 0) | 0;
            b = 8064;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(10968) | 0)) {
            a = 10968;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            wU(10968);
        }
        return 10968;
    }
    function wM(a) {
        a = a | 0;
        return a | 0;
    }
    function wN(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = wL() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            wO(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            wP(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function wO(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function wP(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = wQ(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            wR(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            wO(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            wS(a, c);
            wT(c);
            ed = h;
            return;
        }
    }
    function wQ(a) {
        a = a | 0;
        return 536870911;
    }
    function wR(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function wS(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function wT(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function wU(a) {
        a = a | 0;
        wW(a);
        return;
    }
    function cS(a) {
        a = a | 0;
        wV((a + 24) | 0);
        return;
    }
    function wV(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function wW(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 1, b, wX() | 0, 5);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function wX() {
        return 1872;
    }
    function cT(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        wZ(d4[(wY(a) | 0) >> 2] | 0, b, c, d, e, f);
        return;
    }
    function wY(a) {
        a = a | 0;
        return ((d4[((wL() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function wZ(l, b, c, d, e, f) {
        l = l | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var a = 0, g = 0, h = 0, i = 0, j = 0, k = 0;
        a = ed;
        ed = (ed + 32) | 0;
        g = (a + 16) | 0;
        h = (a + 12) | 0;
        i = (a + 8) | 0;
        j = (a + 4) | 0;
        k = a;
        le(g, b);
        b = lf(g, b) | 0;
        le(h, c);
        c = lf(h, c) | 0;
        le(i, d);
        d = lf(i, d) | 0;
        le(j, e);
        e = lf(j, e) | 0;
        le(k, f);
        f = lf(k, f) | 0;
        yO[l & 1](b, c, d, e, f);
        lg(k);
        lg(j);
        lg(i);
        lg(h);
        lg(g);
        ed = a;
        return;
    }
    function w$(a, d, b, c) {
        a = a | 0;
        d = d | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        f = d4[a >> 2] | 0;
        e = w_() | 0;
        a = w0(b) | 0;
        jI(f, d, e, a, w1(b, c) | 0, c);
        return;
    }
    function w_() {
        var a = 0, b = 0;
        if (!(d2[8072] | 0)) {
            w8(11004);
            fo(69, 11004, eg | 0) | 0;
            b = 8072;
            d4[b >> 2] = 1;
            d4[(b + 4) >> 2] = 0;
        }
        if (!(jU(11004) | 0)) {
            a = 11004;
            b = (a + 36) | 0;
            do {
                d4[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            w8(11004);
        }
        return 11004;
    }
    function w0(a) {
        a = a | 0;
        return a | 0;
    }
    function w1(c, a) {
        c = c | 0;
        a = a | 0;
        var b = 0, f = 0, g = 0, h = 0, i = 0, d = 0, e = 0;
        d = ed;
        ed = (ed + 16) | 0;
        g = d;
        h = (d + 4) | 0;
        d4[g >> 2] = c;
        e = w_() | 0;
        i = (e + 24) | 0;
        a = jM(a, 4) | 0;
        d4[h >> 2] = a;
        b = (e + 28) | 0;
        f = d4[b >> 2] | 0;
        if (f >>> 0 < (d4[(e + 32) >> 2] | 0) >>> 0) {
            w2(f, c, a);
            a = ((d4[b >> 2] | 0) + 8) | 0;
            d4[b >> 2] = a;
        } else {
            w3(i, g, h);
            a = d4[b >> 2] | 0;
        }
        ed = d;
        return (((a - (d4[i >> 2] | 0)) >> 3) + -1) | 0;
    }
    function w2(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d4[a >> 2] = b;
        d4[(a + 4) >> 2] = c;
        return;
    }
    function w3(a, e, f) {
        a = a | 0;
        e = e | 0;
        f = f | 0;
        var d = 0, c = 0, g = 0, b = 0, h = 0, i = 0, j = 0, k = 0;
        h = ed;
        ed = (ed + 32) | 0;
        c = h;
        g = (a + 4) | 0;
        b = ((((d4[g >> 2] | 0) - (d4[a >> 2] | 0)) >> 3) + 1) | 0;
        d = w4(a) | 0;
        if (d >>> 0 < b >>> 0) yC(a);
        else {
            i = d4[a >> 2] | 0;
            k = ((d4[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 2;
            w5(c, (k >> 3) >>> 0 < (d >>> 1) >>> 0 ? j >>> 0 < b >>> 0 ? b : j : d, ((d4[g >> 2] | 0) - i) >> 3, (a + 8) | 0);
            b = (c + 8) | 0;
            w2(d4[b >> 2] | 0, d4[e >> 2] | 0, d4[f >> 2] | 0);
            d4[b >> 2] = (d4[b >> 2] | 0) + 8;
            w6(a, c);
            w7(c);
            ed = h;
            return;
        }
    }
    function w4(a) {
        a = a | 0;
        return 536870911;
    }
    function w5(a, b, e, c) {
        a = a | 0;
        b = b | 0;
        e = e | 0;
        c = c | 0;
        var d = 0;
        d4[(a + 12) >> 2] = 0;
        d4[(a + 16) >> 2] = c;
        do if (b) {
            if (b >>> 0 > 536870911) fA();
            else {
                d = yH(b << 3) | 0;
                break;
            }
        } else d = 0;
        while (0)
        d4[a >> 2] = d;
        c = (d + (e << 3)) | 0;
        d4[(a + 8) >> 2] = c;
        d4[(a + 4) >> 2] = c;
        d4[(a + 12) >> 2] = d + (b << 3);
        return;
    }
    function w6(b, e) {
        b = b | 0;
        e = e | 0;
        var g = 0, c = 0, f = 0, a = 0, d = 0;
        c = d4[b >> 2] | 0;
        d = (b + 4) | 0;
        a = (e + 4) | 0;
        f = ((d4[d >> 2] | 0) - c) | 0;
        g = ((d4[a >> 2] | 0) + ((0 - (f >> 3)) << 3)) | 0;
        d4[a >> 2] = g;
        if ((f | 0) > 0) {
            dh(g | 0, c | 0, f | 0) | 0;
            c = a;
            g = d4[a >> 2] | 0;
        } else c = a;
        a = d4[b >> 2] | 0;
        d4[b >> 2] = g;
        d4[c >> 2] = a;
        a = (e + 8) | 0;
        f = d4[d >> 2] | 0;
        d4[d >> 2] = d4[a >> 2];
        d4[a >> 2] = f;
        a = (b + 8) | 0;
        d = (e + 12) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[d >> 2];
        d4[d >> 2] = b;
        d4[e >> 2] = d4[c >> 2];
        return;
    }
    function w7(a) {
        a = a | 0;
        var c = 0, d = 0, b = 0;
        c = d4[(a + 4) >> 2] | 0;
        d = (a + 8) | 0;
        b = d4[d >> 2] | 0;
        if ((b | 0) != (c | 0)) d4[d >> 2] = b + (~(((b + -8 - c) | 0) >>> 3) << 3);
        a = d4[a >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function w8(a) {
        a = a | 0;
        xa(a);
        return;
    }
    function cU(a) {
        a = a | 0;
        w9((a + 24) | 0);
        return;
    }
    function w9(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function xa(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 1, 12, b, xb() | 0, 2);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function xb() {
        return 1896;
    }
    function cV(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        xd(d4[(xc(a) | 0) >> 2] | 0, b, c);
        return;
    }
    function xc(a) {
        a = a | 0;
        return ((d4[((w_() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function xd(e, a, b) {
        e = e | 0;
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, f = 0;
        c = ed;
        ed = (ed + 16) | 0;
        f = (c + 4) | 0;
        d = c;
        xe(f, a);
        a = xf(f, a) | 0;
        le(d, b);
        b = lf(d, b) | 0;
        yT[e & 31](a, b);
        lg(d);
        ed = c;
        return;
    }
    function xe(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function xf(b, a) {
        b = b | 0;
        a = a | 0;
        return xg(a) | 0;
    }
    function xg(a) {
        a = a | 0;
        return a | 0;
    }
    function xh() {
        var a = 0;
        if (!(d2[8080] | 0)) {
            xi(11040);
            fo(70, 11040, eg | 0) | 0;
            a = 8080;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        if (!(jU(11040) | 0)) xi(11040);
        return 11040;
    }
    function xi(a) {
        a = a | 0;
        xk(a);
        sl(a, 71);
        return;
    }
    function cW(a) {
        a = a | 0;
        xj((a + 24) | 0);
        return;
    }
    function xj(a) {
        a = a | 0;
        var c = 0, b = 0, d = 0;
        b = d4[a >> 2] | 0;
        d = b;
        if (b | 0) {
            a = (a + 4) | 0;
            c = d4[a >> 2] | 0;
            if ((c | 0) != (b | 0)) d4[a >> 2] = c + (~(((c + -8 - d) | 0) >>> 3) << 3);
            yJ(b);
        }
        return;
    }
    function xk(a) {
        a = a | 0;
        var b = 0;
        b = jX() | 0;
        jZ(a, 5, 7, b, xn() | 0, 0);
        d4[(a + 24) >> 2] = 0;
        d4[(a + 28) >> 2] = 0;
        d4[(a + 32) >> 2] = 0;
        return;
    }
    function cX(a) {
        a = a | 0;
        xl(a);
        return;
    }
    function xl(a) {
        a = a | 0;
        xm(a);
        return;
    }
    function xm(a) {
        a = a | 0;
        d2[(a + 8) >> 0] = 1;
        return;
    }
    function xn() {
        return 1936;
    }
    function cY() {
        return xo() | 0;
    }
    function xo() {
        var c = 0, b = 0, d = 0, e = 0, f = 0, a = 0, g = 0;
        b = ed;
        ed = (ed + 16) | 0;
        f = (b + 4) | 0;
        g = b;
        d = cJ(8) | 0;
        c = d;
        a = (c + 4) | 0;
        d4[a >> 2] = yH(1) | 0;
        e = yH(8) | 0;
        a = d4[a >> 2] | 0;
        d4[g >> 2] = 0;
        d4[f >> 2] = d4[g >> 2];
        xp(e, a, f);
        d4[d >> 2] = e;
        ed = b;
        return c | 0;
    }
    function xp(b, c, a) {
        b = b | 0;
        c = c | 0;
        a = a | 0;
        d4[b >> 2] = c;
        a = yH(16) | 0;
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = 0;
        d4[a >> 2] = 1916;
        d4[(a + 12) >> 2] = c;
        d4[(b + 4) >> 2] = a;
        return;
    }
    function cZ(a) {
        a = a | 0;
        c9(a);
        yJ(a);
        return;
    }
    function c$(a) {
        a = a | 0;
        a = d4[(a + 12) >> 2] | 0;
        if (a | 0) yJ(a);
        return;
    }
    function c_(a) {
        a = a | 0;
        yJ(a);
        return;
    }
    function xq() {
        var a = 0;
        if (!(d2[8088] | 0)) {
            xw(11076);
            fo(25, 11076, eg | 0) | 0;
            a = 8088;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 11076;
    }
    function xr(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = xs() | 0;
        d4[(a + 4) >> 2] = xt() | 0;
        d4[(a + 12) >> 2] = b;
        d4[(a + 8) >> 2] = xu() | 0;
        d4[(a + 32) >> 2] = 10;
        return;
    }
    function xs() {
        return 11745;
    }
    function xt() {
        return 1940;
    }
    function xu() {
        return qx() | 0;
    }
    function c0(d, b, a, c) {
        d = d | 0;
        b = b | 0;
        a = a | 0;
        c = c | 0;
        if ((qv(c, 896) | 0) == 512) {
            if (a | 0) {
                xv(a);
                yJ(a);
            }
        } else if (b | 0) yJ(b);
        return;
    }
    function xv(a) {
        a = a | 0;
        a = d4[(a + 4) >> 2] | 0;
        if (a | 0) yF(a);
        return;
    }
    function xw(a) {
        a = a | 0;
        kj(a);
        return;
    }
    function xx(a, b) {
        a = a | 0;
        b = b | 0;
        d4[a >> 2] = b;
        return;
    }
    function xy(a) {
        a = a | 0;
        return d4[a >> 2] | 0;
    }
    function xz(a) {
        a = a | 0;
        return d2[d4[a >> 2] >> 0] | 0;
    }
    function xA(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        d4[d >> 2] = d4[a >> 2];
        xB(b, d) | 0;
        ed = c;
        return;
    }
    function xB(b, a) {
        b = b | 0;
        a = a | 0;
        var c = 0;
        c = xC(d4[b >> 2] | 0, a) | 0;
        a = (b + 4) | 0;
        d4[((d4[a >> 2] | 0) + 8) >> 2] = c;
        return d4[((d4[a >> 2] | 0) + 8) >> 2] | 0;
    }
    function xC(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = ed;
        ed = (ed + 16) | 0;
        d = c;
        xD(d);
        a = iT(a) | 0;
        b = xE(a, d4[b >> 2] | 0) | 0;
        xF(d);
        ed = c;
        return b | 0;
    }
    function xD(a) {
        a = a | 0;
        d4[a >> 2] = d4[2701];
        d4[(a + 4) >> 2] = d4[2703];
        return;
    }
    function xE(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = iW(xG() | 0) | 0;
        return fK(0, c | 0, a | 0, ug(b) | 0) | 0;
    }
    function xF(a) {
        a = a | 0;
        cL(d4[a >> 2] | 0, d4[(a + 4) >> 2] | 0);
        return;
    }
    function xG() {
        var a = 0;
        if (!(d2[8096] | 0)) {
            xH(11120);
            a = 8096;
            d4[a >> 2] = 1;
            d4[(a + 4) >> 2] = 0;
        }
        return 11120;
    }
    function xH(a) {
        a = a | 0;
        i6(a, xI() | 0, 1);
        return;
    }
    function xI() {
        return 1948;
    }
    function c1() {
        xJ();
        return;
    }
    function xJ() {
        var a = 0, b = 0, d = 0, c = 0, f = 0, m = 0, l = 0, k = 0, j = 0, e = 0, h = 0, i = 0, n = 0, p = 0, o = 0, g = 0;
        o = ed;
        ed = (ed + 16) | 0;
        h = (o + 4) | 0;
        i = o;
        fl(65536, 10804, d4[2702] | 0, 10812);
        d = tU() | 0;
        b = d4[d >> 2] | 0;
        a = d4[b >> 2] | 0;
        if (a | 0) {
            c = d4[(d + 8) >> 2] | 0;
            d = d4[(d + 4) >> 2] | 0;
            while(1){
                ft(a | 0, d5[d >> 0] | 0 | 0, d2[c >> 0] | 0);
                b = (b + 4) | 0;
                a = d4[b >> 2] | 0;
                if (!a) break;
                else {
                    c = (c + 1) | 0;
                    d = (d + 1) | 0;
                }
            }
        }
        a = tW() | 0;
        b = d4[a >> 2] | 0;
        if (b | 0) do {
            fu(b | 0, d4[(a + 4) >> 2] | 0);
            a = (a + 8) | 0;
            b = d4[a >> 2] | 0;
        }while ((b | 0) != 0)
        fu(xK() | 0, 5167);
        e = tJ() | 0;
        a = d4[e >> 2] | 0;
        a: do if (a | 0) {
            do {
                xL(d4[(a + 4) >> 2] | 0);
                a = d4[a >> 2] | 0;
            }while ((a | 0) != 0)
            a = d4[e >> 2] | 0;
            if (a | 0) {
                j = e;
                do {
                    while(1){
                        f = a;
                        a = d4[a >> 2] | 0;
                        f = d4[(f + 4) >> 2] | 0;
                        if (!(xM(f) | 0)) break;
                        d4[i >> 2] = j;
                        d4[h >> 2] = d4[i >> 2];
                        xN(e, h) | 0;
                        if (!a) break a;
                    }
                    xO(f);
                    j = d4[j >> 2] | 0;
                    b = xP(f) | 0;
                    m = fC() | 0;
                    l = ed;
                    ed = (ed + ((((1 * (b << 2)) | 0) + 15) & -16)) | 0;
                    k = ed;
                    ed = (ed + ((((1 * (b << 2)) | 0) + 15) & -16)) | 0;
                    b = d4[(uJ(f) | 0) >> 2] | 0;
                    if (b | 0) {
                        d = l;
                        c = k;
                        while(1){
                            d4[d >> 2] = d4[(uH(d4[(b + 4) >> 2] | 0) | 0) >> 2];
                            d4[c >> 2] = d4[(b + 8) >> 2];
                            b = d4[b >> 2] | 0;
                            if (!b) break;
                            else {
                                d = (d + 4) | 0;
                                c = (c + 4) | 0;
                            }
                        }
                    }
                    g = uH(f) | 0;
                    b = xQ(f) | 0;
                    d = xP(f) | 0;
                    c = xR(f) | 0;
                    fy(g | 0, b | 0, l | 0, k | 0, d | 0, c | 0, tR(f) | 0);
                    fn(m | 0);
                }while ((a | 0) != 0)
            }
        }
        while (0)
        a = d4[(tT() | 0) >> 2] | 0;
        if (a | 0) do {
            g = (a + 4) | 0;
            e = t$(g) | 0;
            f = t3(e) | 0;
            m = t_(e) | 0;
            l = ((t0(e) | 0) + 1) | 0;
            k = xS(e) | 0;
            j = xT(g) | 0;
            e = jU(e) | 0;
            h = t5(g) | 0;
            i = xU(g) | 0;
            fw(0, f | 0, m | 0, l | 0, k | 0, j | 0, e | 0, h | 0, i | 0, xV(g) | 0);
            a = d4[a >> 2] | 0;
        }while ((a | 0) != 0)
        a = d4[(tJ() | 0) >> 2] | 0;
        b: do if (a | 0) {
            c: while(1){
                b = d4[(a + 4) >> 2] | 0;
                if (b | 0 ? ((n = d4[(uH(b) | 0) >> 2] | 0), (p = d4[(uM(b) | 0) >> 2] | 0), p | 0) : 0) {
                    d = p;
                    do {
                        b = (d + 4) | 0;
                        c = t$(b) | 0;
                        d: do if (c | 0) switch(jU(c) | 0){
                            case 0:
                                break c;
                            case 4:
                            case 3:
                            case 2:
                                {
                                    k = t3(c) | 0;
                                    j = t_(c) | 0;
                                    e = ((t0(c) | 0) + 1) | 0;
                                    h = xS(c) | 0;
                                    i = jU(c) | 0;
                                    g = t5(b) | 0;
                                    fw(n | 0, k | 0, j | 0, e | 0, h | 0, 0, i | 0, g | 0, xU(b) | 0, xV(b) | 0);
                                    break d;
                                }
                            case 1:
                                {
                                    l = t3(c) | 0;
                                    k = t_(c) | 0;
                                    j = ((t0(c) | 0) + 1) | 0;
                                    e = xS(c) | 0;
                                    h = xT(b) | 0;
                                    i = jU(c) | 0;
                                    g = t5(b) | 0;
                                    fw(n | 0, l | 0, k | 0, j | 0, e | 0, h | 0, i | 0, g | 0, xU(b) | 0, xV(b) | 0);
                                    break d;
                                }
                            case 5:
                                {
                                    e = t3(c) | 0;
                                    h = t_(c) | 0;
                                    i = ((t0(c) | 0) + 1) | 0;
                                    g = xS(c) | 0;
                                    fw(n | 0, e | 0, h | 0, i | 0, g | 0, xW(c) | 0, jU(c) | 0, 0, 0, 0);
                                    break d;
                                }
                            default:
                                break d;
                        }
                        while (0)
                        d = d4[d >> 2] | 0;
                    }while ((d | 0) != 0)
                }
                a = d4[a >> 2] | 0;
                if (!a) break b;
            }
            fA();
        }
        while (0)
        fz();
        ed = o;
        return;
    }
    function xK() {
        return 11703;
    }
    function xL(a) {
        a = a | 0;
        d2[(a + 40) >> 0] = 0;
        return;
    }
    function xM(a) {
        a = a | 0;
        return ((d2[(a + 40) >> 0] | 0) != 0) | 0;
    }
    function xN(b, a) {
        b = b | 0;
        a = a | 0;
        a = xX(a) | 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = d4[b >> 2];
        yJ(b);
        return d4[a >> 2] | 0;
    }
    function xO(a) {
        a = a | 0;
        d2[(a + 40) >> 0] = 1;
        return;
    }
    function xP(a) {
        a = a | 0;
        return d4[(a + 20) >> 2] | 0;
    }
    function xQ(a) {
        a = a | 0;
        return d4[(a + 8) >> 2] | 0;
    }
    function xR(a) {
        a = a | 0;
        return d4[(a + 32) >> 2] | 0;
    }
    function xS(a) {
        a = a | 0;
        return d4[(a + 4) >> 2] | 0;
    }
    function xT(a) {
        a = a | 0;
        return d4[(a + 4) >> 2] | 0;
    }
    function xU(a) {
        a = a | 0;
        return d4[(a + 8) >> 2] | 0;
    }
    function xV(a) {
        a = a | 0;
        return d4[(a + 16) >> 2] | 0;
    }
    function xW(a) {
        a = a | 0;
        return d4[(a + 20) >> 2] | 0;
    }
    function xX(a) {
        a = a | 0;
        return d4[a >> 2] | 0;
    }
    function c2(b) {
        b = b | 0;
        var a = 0, c = 0, e = 0, h = 0, f = 0, k = 0, m = 0, i = 0, j = 0, n = 0, l = 0, r = 0, s = 0, t = 0, q = 0, u = 0, v = 0, o = 0, g = 0, d = 0, p = 0;
        p = ed;
        ed = (ed + 16) | 0;
        r = p;
        do if (b >>> 0 < 245) {
            j = b >>> 0 < 11 ? 16 : (b + 11) & -8;
            b = j >>> 3;
            l = d4[2783] | 0;
            c = l >>> b;
            if ((c & 3) | 0) {
                a = (((c & 1) ^ 1) + b) | 0;
                b = (11172 + ((a << 1) << 2)) | 0;
                c = (b + 8) | 0;
                e = d4[c >> 2] | 0;
                h = (e + 8) | 0;
                f = d4[h >> 2] | 0;
                if ((b | 0) == (f | 0)) d4[2783] = l & ~(1 << a);
                else {
                    d4[(f + 12) >> 2] = b;
                    d4[c >> 2] = f;
                }
                d = a << 3;
                d4[(e + 4) >> 2] = d | 3;
                d = (e + d + 4) | 0;
                d4[d >> 2] = d4[d >> 2] | 1;
                d = h;
                ed = p;
                return d | 0;
            }
            n = d4[2785] | 0;
            if (j >>> 0 > n >>> 0) {
                if (c | 0) {
                    a = 2 << b;
                    a = (c << b) & (a | (0 - a));
                    a = ((a & (0 - a)) + -1) | 0;
                    k = (a >>> 12) & 16;
                    a = a >>> k;
                    c = (a >>> 5) & 8;
                    a = a >>> c;
                    h = (a >>> 2) & 4;
                    a = a >>> h;
                    b = (a >>> 1) & 2;
                    a = a >>> b;
                    e = (a >>> 1) & 1;
                    e = ((c | k | h | b | e) + (a >>> e)) | 0;
                    a = (11172 + ((e << 1) << 2)) | 0;
                    b = (a + 8) | 0;
                    h = d4[b >> 2] | 0;
                    k = (h + 8) | 0;
                    c = d4[k >> 2] | 0;
                    if ((a | 0) == (c | 0)) {
                        b = l & ~(1 << e);
                        d4[2783] = b;
                    } else {
                        d4[(c + 12) >> 2] = a;
                        d4[b >> 2] = c;
                        b = l;
                    }
                    f = ((e << 3) - j) | 0;
                    d4[(h + 4) >> 2] = j | 3;
                    e = (h + j) | 0;
                    d4[(e + 4) >> 2] = f | 1;
                    d4[(e + f) >> 2] = f;
                    if (n | 0) {
                        h = d4[2788] | 0;
                        a = n >>> 3;
                        c = (11172 + ((a << 1) << 2)) | 0;
                        a = 1 << a;
                        if (!(b & a)) {
                            d4[2783] = b | a;
                            a = c;
                            b = (c + 8) | 0;
                        } else {
                            b = (c + 8) | 0;
                            a = d4[b >> 2] | 0;
                        }
                        d4[b >> 2] = h;
                        d4[(a + 12) >> 2] = h;
                        d4[(h + 8) >> 2] = a;
                        d4[(h + 12) >> 2] = c;
                    }
                    d4[2785] = f;
                    d4[2788] = e;
                    d = k;
                    ed = p;
                    return d | 0;
                }
                m = d4[2784] | 0;
                if (m) {
                    c = ((m & (0 - m)) + -1) | 0;
                    k = (c >>> 12) & 16;
                    c = c >>> k;
                    f = (c >>> 5) & 8;
                    c = c >>> f;
                    i = (c >>> 2) & 4;
                    c = c >>> i;
                    e = (c >>> 1) & 2;
                    c = c >>> e;
                    b = (c >>> 1) & 1;
                    b = d4[(11436 + (((f | k | i | e | b) + (c >>> b)) << 2)) >> 2] | 0;
                    c = ((d4[(b + 4) >> 2] & -8) - j) | 0;
                    e = d4[(b + 16 + ((((d4[(b + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                    if (!e) {
                        i = b;
                        f = c;
                    } else {
                        do {
                            k = ((d4[(e + 4) >> 2] & -8) - j) | 0;
                            i = k >>> 0 < c >>> 0;
                            c = i ? k : c;
                            b = i ? e : b;
                            e = d4[(e + 16 + ((((d4[(e + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                        }while ((e | 0) != 0)
                        i = b;
                        f = c;
                    }
                    k = (i + j) | 0;
                    if (i >>> 0 < k >>> 0) {
                        h = d4[(i + 24) >> 2] | 0;
                        a = d4[(i + 12) >> 2] | 0;
                        do if ((a | 0) == (i | 0)) {
                            b = (i + 20) | 0;
                            a = d4[b >> 2] | 0;
                            if (!a) {
                                b = (i + 16) | 0;
                                a = d4[b >> 2] | 0;
                                if (!a) {
                                    c = 0;
                                    break;
                                }
                            }
                            while(1){
                                c = (a + 20) | 0;
                                e = d4[c >> 2] | 0;
                                if (e | 0) {
                                    a = e;
                                    b = c;
                                    continue;
                                }
                                c = (a + 16) | 0;
                                e = d4[c >> 2] | 0;
                                if (!e) break;
                                else {
                                    a = e;
                                    b = c;
                                }
                            }
                            d4[b >> 2] = 0;
                            c = a;
                        } else {
                            c = d4[(i + 8) >> 2] | 0;
                            d4[(c + 12) >> 2] = a;
                            d4[(a + 8) >> 2] = c;
                            c = a;
                        }
                        while (0)
                        do if (h | 0) {
                            a = d4[(i + 28) >> 2] | 0;
                            b = (11436 + (a << 2)) | 0;
                            if ((i | 0) == (d4[b >> 2] | 0)) {
                                d4[b >> 2] = c;
                                if (!c) {
                                    d4[2784] = m & ~(1 << a);
                                    break;
                                }
                            } else {
                                d4[(h + 16 + ((((d4[(h + 16) >> 2] | 0) != (i | 0)) & 1) << 2)) >> 2] = c;
                                if (!c) break;
                            }
                            d4[(c + 24) >> 2] = h;
                            a = d4[(i + 16) >> 2] | 0;
                            if (a | 0) {
                                d4[(c + 16) >> 2] = a;
                                d4[(a + 24) >> 2] = c;
                            }
                            a = d4[(i + 20) >> 2] | 0;
                            if (a | 0) {
                                d4[(c + 20) >> 2] = a;
                                d4[(a + 24) >> 2] = c;
                            }
                        }
                        while (0)
                        if (f >>> 0 < 16) {
                            d = (f + j) | 0;
                            d4[(i + 4) >> 2] = d | 3;
                            d = (i + d + 4) | 0;
                            d4[d >> 2] = d4[d >> 2] | 1;
                        } else {
                            d4[(i + 4) >> 2] = j | 3;
                            d4[(k + 4) >> 2] = f | 1;
                            d4[(k + f) >> 2] = f;
                            if (n | 0) {
                                e = d4[2788] | 0;
                                a = n >>> 3;
                                c = (11172 + ((a << 1) << 2)) | 0;
                                a = 1 << a;
                                if (!(l & a)) {
                                    d4[2783] = l | a;
                                    a = c;
                                    b = (c + 8) | 0;
                                } else {
                                    b = (c + 8) | 0;
                                    a = d4[b >> 2] | 0;
                                }
                                d4[b >> 2] = e;
                                d4[(a + 12) >> 2] = e;
                                d4[(e + 8) >> 2] = a;
                                d4[(e + 12) >> 2] = c;
                            }
                            d4[2785] = f;
                            d4[2788] = k;
                        }
                        d = (i + 8) | 0;
                        ed = p;
                        return d | 0;
                    } else l = j;
                } else l = j;
            } else l = j;
        } else if (b >>> 0 <= 4294967231) {
            b = (b + 11) | 0;
            j = b & -8;
            i = d4[2784] | 0;
            if (i) {
                e = (0 - j) | 0;
                b = b >>> 8;
                if (b) {
                    if (j >>> 0 > 16777215) m = 31;
                    else {
                        l = (((b + 1048320) | 0) >>> 16) & 8;
                        g = b << l;
                        n = (((g + 520192) | 0) >>> 16) & 4;
                        g = g << n;
                        m = (((g + 245760) | 0) >>> 16) & 2;
                        m = (14 - (n | l | m) + ((g << m) >>> 15)) | 0;
                        m = ((j >>> ((m + 7) | 0)) & 1) | (m << 1);
                    }
                } else m = 0;
                c = d4[(11436 + (m << 2)) >> 2] | 0;
                a: do if (!c) {
                    c = 0;
                    b = 0;
                    g = 57;
                } else {
                    b = 0;
                    k = j << ((m | 0) == 31 ? 0 : (25 - (m >>> 1)) | 0);
                    f = 0;
                    while(1){
                        h = ((d4[(c + 4) >> 2] & -8) - j) | 0;
                        if (h >>> 0 < e >>> 0) if (!h) {
                            b = c;
                            e = 0;
                            h = c;
                            g = 61;
                            break a;
                        } else {
                            b = c;
                            e = h;
                        }
                        h = d4[(c + 20) >> 2] | 0;
                        c = d4[(c + 16 + ((k >>> 31) << 2)) >> 2] | 0;
                        f = ((h | 0) == 0) | ((h | 0) == (c | 0)) ? f : h;
                        h = (c | 0) == 0;
                        if (h) {
                            c = f;
                            g = 57;
                            break;
                        } else k = k << ((h ^ 1) & 1);
                    }
                }
                while (0)
                if ((g | 0) == 57) {
                    if (((c | 0) == 0) & ((b | 0) == 0)) {
                        b = 2 << m;
                        b = i & (b | (0 - b));
                        if (!b) {
                            l = j;
                            break;
                        }
                        l = ((b & (0 - b)) + -1) | 0;
                        k = (l >>> 12) & 16;
                        l = l >>> k;
                        f = (l >>> 5) & 8;
                        l = l >>> f;
                        m = (l >>> 2) & 4;
                        l = l >>> m;
                        n = (l >>> 1) & 2;
                        l = l >>> n;
                        c = (l >>> 1) & 1;
                        b = 0;
                        c = d4[(11436 + (((f | k | m | n | c) + (l >>> c)) << 2)) >> 2] | 0;
                    }
                    if (!c) {
                        m = b;
                        k = e;
                    } else {
                        h = c;
                        g = 61;
                    }
                }
                if ((g | 0) == 61) while(1){
                    g = 0;
                    c = ((d4[(h + 4) >> 2] & -8) - j) | 0;
                    l = c >>> 0 < e >>> 0;
                    c = l ? c : e;
                    b = l ? h : b;
                    h = d4[(h + 16 + ((((d4[(h + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                    if (!h) {
                        m = b;
                        k = c;
                        break;
                    } else {
                        e = c;
                        g = 61;
                    }
                }
                if ((m | 0) != 0 ? k >>> 0 < (((d4[2785] | 0) - j) | 0) >>> 0 : 0) {
                    f = (m + j) | 0;
                    if (m >>> 0 >= f >>> 0) {
                        d = 0;
                        ed = p;
                        return d | 0;
                    }
                    h = d4[(m + 24) >> 2] | 0;
                    a = d4[(m + 12) >> 2] | 0;
                    do if ((a | 0) == (m | 0)) {
                        b = (m + 20) | 0;
                        a = d4[b >> 2] | 0;
                        if (!a) {
                            b = (m + 16) | 0;
                            a = d4[b >> 2] | 0;
                            if (!a) {
                                a = 0;
                                break;
                            }
                        }
                        while(1){
                            c = (a + 20) | 0;
                            e = d4[c >> 2] | 0;
                            if (e | 0) {
                                a = e;
                                b = c;
                                continue;
                            }
                            c = (a + 16) | 0;
                            e = d4[c >> 2] | 0;
                            if (!e) break;
                            else {
                                a = e;
                                b = c;
                            }
                        }
                        d4[b >> 2] = 0;
                    } else {
                        d = d4[(m + 8) >> 2] | 0;
                        d4[(d + 12) >> 2] = a;
                        d4[(a + 8) >> 2] = d;
                    }
                    while (0)
                    do if (h) {
                        b = d4[(m + 28) >> 2] | 0;
                        c = (11436 + (b << 2)) | 0;
                        if ((m | 0) == (d4[c >> 2] | 0)) {
                            d4[c >> 2] = a;
                            if (!a) {
                                e = i & ~(1 << b);
                                d4[2784] = e;
                                break;
                            }
                        } else {
                            d4[(h + 16 + ((((d4[(h + 16) >> 2] | 0) != (m | 0)) & 1) << 2)) >> 2] = a;
                            if (!a) {
                                e = i;
                                break;
                            }
                        }
                        d4[(a + 24) >> 2] = h;
                        b = d4[(m + 16) >> 2] | 0;
                        if (b | 0) {
                            d4[(a + 16) >> 2] = b;
                            d4[(b + 24) >> 2] = a;
                        }
                        b = d4[(m + 20) >> 2] | 0;
                        if (b) {
                            d4[(a + 20) >> 2] = b;
                            d4[(b + 24) >> 2] = a;
                            e = i;
                        } else e = i;
                    } else e = i;
                    while (0)
                    do if (k >>> 0 >= 16) {
                        d4[(m + 4) >> 2] = j | 3;
                        d4[(f + 4) >> 2] = k | 1;
                        d4[(f + k) >> 2] = k;
                        a = k >>> 3;
                        if (k >>> 0 < 256) {
                            c = (11172 + ((a << 1) << 2)) | 0;
                            b = d4[2783] | 0;
                            a = 1 << a;
                            if (!(b & a)) {
                                d4[2783] = b | a;
                                a = c;
                                b = (c + 8) | 0;
                            } else {
                                b = (c + 8) | 0;
                                a = d4[b >> 2] | 0;
                            }
                            d4[b >> 2] = f;
                            d4[(a + 12) >> 2] = f;
                            d4[(f + 8) >> 2] = a;
                            d4[(f + 12) >> 2] = c;
                            break;
                        }
                        a = k >>> 8;
                        if (a) {
                            if (k >>> 0 > 16777215) a = 31;
                            else {
                                g = (((a + 1048320) | 0) >>> 16) & 8;
                                d = a << g;
                                o = (((d + 520192) | 0) >>> 16) & 4;
                                d = d << o;
                                a = (((d + 245760) | 0) >>> 16) & 2;
                                a = (14 - (o | g | a) + ((d << a) >>> 15)) | 0;
                                a = ((k >>> ((a + 7) | 0)) & 1) | (a << 1);
                            }
                        } else a = 0;
                        c = (11436 + (a << 2)) | 0;
                        d4[(f + 28) >> 2] = a;
                        b = (f + 16) | 0;
                        d4[(b + 4) >> 2] = 0;
                        d4[b >> 2] = 0;
                        b = 1 << a;
                        if (!(e & b)) {
                            d4[2784] = e | b;
                            d4[c >> 2] = f;
                            d4[(f + 24) >> 2] = c;
                            d4[(f + 12) >> 2] = f;
                            d4[(f + 8) >> 2] = f;
                            break;
                        }
                        b = k << ((a | 0) == 31 ? 0 : (25 - (a >>> 1)) | 0);
                        c = d4[c >> 2] | 0;
                        while(1){
                            if (((d4[(c + 4) >> 2] & -8) | 0) == (k | 0)) {
                                g = 97;
                                break;
                            }
                            e = (c + 16 + ((b >>> 31) << 2)) | 0;
                            a = d4[e >> 2] | 0;
                            if (!a) {
                                g = 96;
                                break;
                            } else {
                                b = b << 1;
                                c = a;
                            }
                        }
                        if ((g | 0) == 96) {
                            d4[e >> 2] = f;
                            d4[(f + 24) >> 2] = c;
                            d4[(f + 12) >> 2] = f;
                            d4[(f + 8) >> 2] = f;
                            break;
                        } else if ((g | 0) == 97) {
                            g = (c + 8) | 0;
                            d = d4[g >> 2] | 0;
                            d4[(d + 12) >> 2] = f;
                            d4[g >> 2] = f;
                            d4[(f + 8) >> 2] = d;
                            d4[(f + 12) >> 2] = c;
                            d4[(f + 24) >> 2] = 0;
                            break;
                        }
                    } else {
                        d = (k + j) | 0;
                        d4[(m + 4) >> 2] = d | 3;
                        d = (m + d + 4) | 0;
                        d4[d >> 2] = d4[d >> 2] | 1;
                    }
                    while (0)
                    d = (m + 8) | 0;
                    ed = p;
                    return d | 0;
                } else l = j;
            } else l = j;
        } else l = -1;
        while (0)
        c = d4[2785] | 0;
        if (c >>> 0 >= l >>> 0) {
            a = (c - l) | 0;
            b = d4[2788] | 0;
            if (a >>> 0 > 15) {
                d = (b + l) | 0;
                d4[2788] = d;
                d4[2785] = a;
                d4[(d + 4) >> 2] = a | 1;
                d4[(d + a) >> 2] = a;
                d4[(b + 4) >> 2] = l | 3;
            } else {
                d4[2785] = 0;
                d4[2788] = 0;
                d4[(b + 4) >> 2] = c | 3;
                d = (b + c + 4) | 0;
                d4[d >> 2] = d4[d >> 2] | 1;
            }
            d = (b + 8) | 0;
            ed = p;
            return d | 0;
        }
        k = d4[2786] | 0;
        if (k >>> 0 > l >>> 0) {
            o = (k - l) | 0;
            d4[2786] = o;
            d = d4[2789] | 0;
            g = (d + l) | 0;
            d4[2789] = g;
            d4[(g + 4) >> 2] = o | 1;
            d4[(d + 4) >> 2] = l | 3;
            d = (d + 8) | 0;
            ed = p;
            return d | 0;
        }
        if (!(d4[2901] | 0)) {
            d4[2903] = 4096;
            d4[2902] = 4096;
            d4[2904] = -1;
            d4[2905] = -1;
            d4[2906] = 0;
            d4[2894] = 0;
            b = (r & -16) ^ 1431655768;
            d4[r >> 2] = b;
            d4[2901] = b;
            b = 4096;
        } else b = d4[2903] | 0;
        m = (l + 48) | 0;
        i = (l + 47) | 0;
        f = (b + i) | 0;
        h = (0 - b) | 0;
        j = f & h;
        if (j >>> 0 <= l >>> 0) {
            d = 0;
            ed = p;
            return d | 0;
        }
        b = d4[2893] | 0;
        if (b | 0 ? ((n = d4[2891] | 0), (r = (n + j) | 0), (r >>> 0 <= n >>> 0) | (r >>> 0 > b >>> 0)) : 0) {
            d = 0;
            ed = p;
            return d | 0;
        }
        b: do if (!(d4[2894] & 4)) {
            c = d4[2789] | 0;
            c: do if (c) {
                e = 11580;
                while(1){
                    b = d4[e >> 2] | 0;
                    if (b >>> 0 <= c >>> 0 ? ((q = (e + 4) | 0), ((b + (d4[q >> 2] | 0)) | 0) >>> 0 > c >>> 0) : 0) break;
                    b = d4[(e + 8) >> 2] | 0;
                    if (!b) {
                        g = 118;
                        break c;
                    } else e = b;
                }
                a = (f - k) & h;
                if (a >>> 0 < 2147483647) {
                    b = dj(a | 0) | 0;
                    if ((b | 0) == (((d4[e >> 2] | 0) + (d4[q >> 2] | 0)) | 0)) {
                        if ((b | 0) != (-1 | 0)) {
                            k = a;
                            f = b;
                            g = 135;
                            break b;
                        }
                    } else {
                        e = b;
                        g = 126;
                    }
                } else a = 0;
            } else g = 118;
            while (0)
            do if ((g | 0) == 118) {
                c = dj(0) | 0;
                if ((c | 0) != (-1 | 0) ? ((a = c), (s = d4[2902] | 0), (t = (s + -1) | 0), (a = ((((t & a) | 0) == 0 ? 0 : (((t + a) & (0 - s)) - a) | 0) + j) | 0), (s = d4[2891] | 0), (t = (a + s) | 0), (a >>> 0 > l >>> 0) & (a >>> 0 < 2147483647)) : 0) {
                    q = d4[2893] | 0;
                    if (q | 0 ? (t >>> 0 <= s >>> 0) | (t >>> 0 > q >>> 0) : 0) {
                        a = 0;
                        break;
                    }
                    b = dj(a | 0) | 0;
                    if ((b | 0) == (c | 0)) {
                        k = a;
                        f = c;
                        g = 135;
                        break b;
                    } else {
                        e = b;
                        g = 126;
                    }
                } else a = 0;
            }
            while (0)
            do if ((g | 0) == 126) {
                c = (0 - a) | 0;
                if (!((m >>> 0 > a >>> 0) & ((a >>> 0 < 2147483647) & ((e | 0) != (-1 | 0))))) if ((e | 0) == (-1 | 0)) {
                    a = 0;
                    break;
                } else {
                    k = a;
                    f = e;
                    g = 135;
                    break b;
                }
                b = d4[2903] | 0;
                b = (i - a + b) & (0 - b);
                if (b >>> 0 >= 2147483647) {
                    k = a;
                    f = e;
                    g = 135;
                    break b;
                }
                if ((dj(b | 0) | 0) == (-1 | 0)) {
                    dj(c | 0) | 0;
                    a = 0;
                    break;
                } else {
                    k = (b + a) | 0;
                    f = e;
                    g = 135;
                    break b;
                }
            }
            while (0)
            d4[2894] = d4[2894] | 4;
            g = 133;
        } else {
            a = 0;
            g = 133;
        }
        while (0)
        if (((g | 0) == 133 ? j >>> 0 < 2147483647 : 0) ? ((o = dj(j | 0) | 0), (q = dj(0) | 0), (u = (q - o) | 0), (v = u >>> 0 > ((l + 40) | 0) >>> 0), !(((o | 0) == (-1 | 0)) | (v ^ 1) | (((o >>> 0 < q >>> 0) & (((o | 0) != (-1 | 0)) & ((q | 0) != (-1 | 0)))) ^ 1))) : 0) {
            k = v ? u : a;
            f = o;
            g = 135;
        }
        if ((g | 0) == 135) {
            a = ((d4[2891] | 0) + k) | 0;
            d4[2891] = a;
            if (a >>> 0 > (d4[2892] | 0) >>> 0) d4[2892] = a;
            i = d4[2789] | 0;
            do if (i) {
                a = 11580;
                while(1){
                    b = d4[a >> 2] | 0;
                    c = (a + 4) | 0;
                    e = d4[c >> 2] | 0;
                    if ((f | 0) == ((b + e) | 0)) {
                        g = 145;
                        break;
                    }
                    h = d4[(a + 8) >> 2] | 0;
                    if (!h) break;
                    else a = h;
                }
                if (((g | 0) == 145 ? ((d4[(a + 12) >> 2] & 8) | 0) == 0 : 0) ? (i >>> 0 < f >>> 0) & (i >>> 0 >= b >>> 0) : 0) {
                    d4[c >> 2] = e + k;
                    d = (i + 8) | 0;
                    d = ((d & 7) | 0) == 0 ? 0 : (0 - d) & 7;
                    g = (i + d) | 0;
                    d = ((d4[2786] | 0) + (k - d)) | 0;
                    d4[2789] = g;
                    d4[2786] = d;
                    d4[(g + 4) >> 2] = d | 1;
                    d4[(g + d + 4) >> 2] = 40;
                    d4[2790] = d4[2905];
                    break;
                }
                if (f >>> 0 < (d4[2787] | 0) >>> 0) d4[2787] = f;
                c = (f + k) | 0;
                a = 11580;
                while(1){
                    if ((d4[a >> 2] | 0) == (c | 0)) {
                        g = 153;
                        break;
                    }
                    b = d4[(a + 8) >> 2] | 0;
                    if (!b) break;
                    else a = b;
                }
                if ((g | 0) == 153 ? ((d4[(a + 12) >> 2] & 8) | 0) == 0 : 0) {
                    d4[a >> 2] = f;
                    n = (a + 4) | 0;
                    d4[n >> 2] = (d4[n >> 2] | 0) + k;
                    n = (f + 8) | 0;
                    n = (f + (((n & 7) | 0) == 0 ? 0 : (0 - n) & 7)) | 0;
                    a = (c + 8) | 0;
                    a = (c + (((a & 7) | 0) == 0 ? 0 : (0 - a) & 7)) | 0;
                    j = (n + l) | 0;
                    m = (a - n - l) | 0;
                    d4[(n + 4) >> 2] = l | 3;
                    do if ((a | 0) != (i | 0)) {
                        if ((a | 0) == (d4[2788] | 0)) {
                            d = ((d4[2785] | 0) + m) | 0;
                            d4[2785] = d;
                            d4[2788] = j;
                            d4[(j + 4) >> 2] = d | 1;
                            d4[(j + d) >> 2] = d;
                            break;
                        }
                        b = d4[(a + 4) >> 2] | 0;
                        if (((b & 3) | 0) == 1) {
                            k = b & -8;
                            e = b >>> 3;
                            d: do if (b >>> 0 < 256) {
                                b = d4[(a + 8) >> 2] | 0;
                                c = d4[(a + 12) >> 2] | 0;
                                if ((c | 0) == (b | 0)) {
                                    d4[2783] = d4[2783] & ~(1 << e);
                                    break;
                                } else {
                                    d4[(b + 12) >> 2] = c;
                                    d4[(c + 8) >> 2] = b;
                                    break;
                                }
                            } else {
                                f = d4[(a + 24) >> 2] | 0;
                                b = d4[(a + 12) >> 2] | 0;
                                do if ((b | 0) == (a | 0)) {
                                    e = (a + 16) | 0;
                                    c = (e + 4) | 0;
                                    b = d4[c >> 2] | 0;
                                    if (!b) {
                                        b = d4[e >> 2] | 0;
                                        if (!b) {
                                            b = 0;
                                            break;
                                        } else c = e;
                                    }
                                    while(1){
                                        e = (b + 20) | 0;
                                        h = d4[e >> 2] | 0;
                                        if (h | 0) {
                                            b = h;
                                            c = e;
                                            continue;
                                        }
                                        e = (b + 16) | 0;
                                        h = d4[e >> 2] | 0;
                                        if (!h) break;
                                        else {
                                            b = h;
                                            c = e;
                                        }
                                    }
                                    d4[c >> 2] = 0;
                                } else {
                                    d = d4[(a + 8) >> 2] | 0;
                                    d4[(d + 12) >> 2] = b;
                                    d4[(b + 8) >> 2] = d;
                                }
                                while (0)
                                if (!f) break;
                                c = d4[(a + 28) >> 2] | 0;
                                e = (11436 + (c << 2)) | 0;
                                do if ((a | 0) != (d4[e >> 2] | 0)) {
                                    d4[(f + 16 + ((((d4[(f + 16) >> 2] | 0) != (a | 0)) & 1) << 2)) >> 2] = b;
                                    if (!b) break d;
                                } else {
                                    d4[e >> 2] = b;
                                    if (b | 0) break;
                                    d4[2784] = d4[2784] & ~(1 << c);
                                    break d;
                                }
                                while (0)
                                d4[(b + 24) >> 2] = f;
                                c = (a + 16) | 0;
                                e = d4[c >> 2] | 0;
                                if (e | 0) {
                                    d4[(b + 16) >> 2] = e;
                                    d4[(e + 24) >> 2] = b;
                                }
                                c = d4[(c + 4) >> 2] | 0;
                                if (!c) break;
                                d4[(b + 20) >> 2] = c;
                                d4[(c + 24) >> 2] = b;
                            }
                            while (0)
                            a = (a + k) | 0;
                            h = (k + m) | 0;
                        } else h = m;
                        a = (a + 4) | 0;
                        d4[a >> 2] = d4[a >> 2] & -2;
                        d4[(j + 4) >> 2] = h | 1;
                        d4[(j + h) >> 2] = h;
                        a = h >>> 3;
                        if (h >>> 0 < 256) {
                            c = (11172 + ((a << 1) << 2)) | 0;
                            b = d4[2783] | 0;
                            a = 1 << a;
                            if (!(b & a)) {
                                d4[2783] = b | a;
                                a = c;
                                b = (c + 8) | 0;
                            } else {
                                b = (c + 8) | 0;
                                a = d4[b >> 2] | 0;
                            }
                            d4[b >> 2] = j;
                            d4[(a + 12) >> 2] = j;
                            d4[(j + 8) >> 2] = a;
                            d4[(j + 12) >> 2] = c;
                            break;
                        }
                        a = h >>> 8;
                        do if (!a) a = 0;
                        else {
                            if (h >>> 0 > 16777215) {
                                a = 31;
                                break;
                            }
                            g = (((a + 1048320) | 0) >>> 16) & 8;
                            d = a << g;
                            o = (((d + 520192) | 0) >>> 16) & 4;
                            d = d << o;
                            a = (((d + 245760) | 0) >>> 16) & 2;
                            a = (14 - (o | g | a) + ((d << a) >>> 15)) | 0;
                            a = ((h >>> ((a + 7) | 0)) & 1) | (a << 1);
                        }
                        while (0)
                        e = (11436 + (a << 2)) | 0;
                        d4[(j + 28) >> 2] = a;
                        b = (j + 16) | 0;
                        d4[(b + 4) >> 2] = 0;
                        d4[b >> 2] = 0;
                        b = d4[2784] | 0;
                        c = 1 << a;
                        if (!(b & c)) {
                            d4[2784] = b | c;
                            d4[e >> 2] = j;
                            d4[(j + 24) >> 2] = e;
                            d4[(j + 12) >> 2] = j;
                            d4[(j + 8) >> 2] = j;
                            break;
                        }
                        b = h << ((a | 0) == 31 ? 0 : (25 - (a >>> 1)) | 0);
                        c = d4[e >> 2] | 0;
                        while(1){
                            if (((d4[(c + 4) >> 2] & -8) | 0) == (h | 0)) {
                                g = 194;
                                break;
                            }
                            e = (c + 16 + ((b >>> 31) << 2)) | 0;
                            a = d4[e >> 2] | 0;
                            if (!a) {
                                g = 193;
                                break;
                            } else {
                                b = b << 1;
                                c = a;
                            }
                        }
                        if ((g | 0) == 193) {
                            d4[e >> 2] = j;
                            d4[(j + 24) >> 2] = c;
                            d4[(j + 12) >> 2] = j;
                            d4[(j + 8) >> 2] = j;
                            break;
                        } else if ((g | 0) == 194) {
                            g = (c + 8) | 0;
                            d = d4[g >> 2] | 0;
                            d4[(d + 12) >> 2] = j;
                            d4[g >> 2] = j;
                            d4[(j + 8) >> 2] = d;
                            d4[(j + 12) >> 2] = c;
                            d4[(j + 24) >> 2] = 0;
                            break;
                        }
                    } else {
                        d = ((d4[2786] | 0) + m) | 0;
                        d4[2786] = d;
                        d4[2789] = j;
                        d4[(j + 4) >> 2] = d | 1;
                    }
                    while (0)
                    d = (n + 8) | 0;
                    ed = p;
                    return d | 0;
                }
                a = 11580;
                while(1){
                    b = d4[a >> 2] | 0;
                    if (b >>> 0 <= i >>> 0 ? ((d = (b + (d4[(a + 4) >> 2] | 0)) | 0), d >>> 0 > i >>> 0) : 0) break;
                    a = d4[(a + 8) >> 2] | 0;
                }
                h = (d + -47) | 0;
                b = (h + 8) | 0;
                b = (h + (((b & 7) | 0) == 0 ? 0 : (0 - b) & 7)) | 0;
                h = (i + 16) | 0;
                b = b >>> 0 < h >>> 0 ? i : b;
                a = (b + 8) | 0;
                c = (f + 8) | 0;
                c = ((c & 7) | 0) == 0 ? 0 : (0 - c) & 7;
                g = (f + c) | 0;
                c = (k + -40 - c) | 0;
                d4[2789] = g;
                d4[2786] = c;
                d4[(g + 4) >> 2] = c | 1;
                d4[(g + c + 4) >> 2] = 40;
                d4[2790] = d4[2905];
                c = (b + 4) | 0;
                d4[c >> 2] = 27;
                d4[a >> 2] = d4[2895];
                d4[(a + 4) >> 2] = d4[2896];
                d4[(a + 8) >> 2] = d4[2897];
                d4[(a + 12) >> 2] = d4[2898];
                d4[2895] = f;
                d4[2896] = k;
                d4[2898] = 0;
                d4[2897] = a;
                a = (b + 24) | 0;
                do {
                    g = a;
                    a = (a + 4) | 0;
                    d4[a >> 2] = 7;
                }while (((g + 8) | 0) >>> 0 < d >>> 0)
                if ((b | 0) != (i | 0)) {
                    f = (b - i) | 0;
                    d4[c >> 2] = d4[c >> 2] & -2;
                    d4[(i + 4) >> 2] = f | 1;
                    d4[b >> 2] = f;
                    a = f >>> 3;
                    if (f >>> 0 < 256) {
                        c = (11172 + ((a << 1) << 2)) | 0;
                        b = d4[2783] | 0;
                        a = 1 << a;
                        if (!(b & a)) {
                            d4[2783] = b | a;
                            a = c;
                            b = (c + 8) | 0;
                        } else {
                            b = (c + 8) | 0;
                            a = d4[b >> 2] | 0;
                        }
                        d4[b >> 2] = i;
                        d4[(a + 12) >> 2] = i;
                        d4[(i + 8) >> 2] = a;
                        d4[(i + 12) >> 2] = c;
                        break;
                    }
                    a = f >>> 8;
                    if (a) {
                        if (f >>> 0 > 16777215) c = 31;
                        else {
                            g = (((a + 1048320) | 0) >>> 16) & 8;
                            d = a << g;
                            o = (((d + 520192) | 0) >>> 16) & 4;
                            d = d << o;
                            c = (((d + 245760) | 0) >>> 16) & 2;
                            c = (14 - (o | g | c) + ((d << c) >>> 15)) | 0;
                            c = ((f >>> ((c + 7) | 0)) & 1) | (c << 1);
                        }
                    } else c = 0;
                    e = (11436 + (c << 2)) | 0;
                    d4[(i + 28) >> 2] = c;
                    d4[(i + 20) >> 2] = 0;
                    d4[h >> 2] = 0;
                    a = d4[2784] | 0;
                    b = 1 << c;
                    if (!(a & b)) {
                        d4[2784] = a | b;
                        d4[e >> 2] = i;
                        d4[(i + 24) >> 2] = e;
                        d4[(i + 12) >> 2] = i;
                        d4[(i + 8) >> 2] = i;
                        break;
                    }
                    b = f << ((c | 0) == 31 ? 0 : (25 - (c >>> 1)) | 0);
                    c = d4[e >> 2] | 0;
                    while(1){
                        if (((d4[(c + 4) >> 2] & -8) | 0) == (f | 0)) {
                            g = 216;
                            break;
                        }
                        e = (c + 16 + ((b >>> 31) << 2)) | 0;
                        a = d4[e >> 2] | 0;
                        if (!a) {
                            g = 215;
                            break;
                        } else {
                            b = b << 1;
                            c = a;
                        }
                    }
                    if ((g | 0) == 215) {
                        d4[e >> 2] = i;
                        d4[(i + 24) >> 2] = c;
                        d4[(i + 12) >> 2] = i;
                        d4[(i + 8) >> 2] = i;
                        break;
                    } else if ((g | 0) == 216) {
                        g = (c + 8) | 0;
                        d = d4[g >> 2] | 0;
                        d4[(d + 12) >> 2] = i;
                        d4[g >> 2] = i;
                        d4[(i + 8) >> 2] = d;
                        d4[(i + 12) >> 2] = c;
                        d4[(i + 24) >> 2] = 0;
                        break;
                    }
                }
            } else {
                d = d4[2787] | 0;
                if (((d | 0) == 0) | (f >>> 0 < d >>> 0)) d4[2787] = f;
                d4[2895] = f;
                d4[2896] = k;
                d4[2898] = 0;
                d4[2792] = d4[2901];
                d4[2791] = -1;
                a = 0;
                do {
                    d = (11172 + ((a << 1) << 2)) | 0;
                    d4[(d + 12) >> 2] = d;
                    d4[(d + 8) >> 2] = d;
                    a = (a + 1) | 0;
                }while ((a | 0) != 32)
                d = (f + 8) | 0;
                d = ((d & 7) | 0) == 0 ? 0 : (0 - d) & 7;
                g = (f + d) | 0;
                d = (k + -40 - d) | 0;
                d4[2789] = g;
                d4[2786] = d;
                d4[(g + 4) >> 2] = d | 1;
                d4[(g + d + 4) >> 2] = 40;
                d4[2790] = d4[2905];
            }
            while (0)
            a = d4[2786] | 0;
            if (a >>> 0 > l >>> 0) {
                o = (a - l) | 0;
                d4[2786] = o;
                d = d4[2789] | 0;
                g = (d + l) | 0;
                d4[2789] = g;
                d4[(g + 4) >> 2] = o | 1;
                d4[(d + 4) >> 2] = l | 3;
                d = (d + 8) | 0;
                ed = p;
                return d | 0;
            }
        }
        d4[(xZ() | 0) >> 2] = 12;
        d = 0;
        ed = p;
        return d | 0;
    }
    function c3(a) {
        a = a | 0;
        var b = 0, c = 0, g = 0, i = 0, h = 0, f = 0, d = 0, e = 0;
        if (!a) return;
        c = (a + -8) | 0;
        i = d4[2787] | 0;
        a = d4[(a + -4) >> 2] | 0;
        b = a & -8;
        e = (c + b) | 0;
        do if (!(a & 1)) {
            g = d4[c >> 2] | 0;
            if (!(a & 3)) return;
            f = (c + (0 - g)) | 0;
            h = (g + b) | 0;
            if (f >>> 0 < i >>> 0) return;
            if ((f | 0) == (d4[2788] | 0)) {
                a = (e + 4) | 0;
                b = d4[a >> 2] | 0;
                if (((b & 3) | 0) != 3) {
                    d = f;
                    b = h;
                    break;
                }
                d4[2785] = h;
                d4[a >> 2] = b & -2;
                d4[(f + 4) >> 2] = h | 1;
                d4[(f + h) >> 2] = h;
                return;
            }
            c = g >>> 3;
            if (g >>> 0 < 256) {
                a = d4[(f + 8) >> 2] | 0;
                b = d4[(f + 12) >> 2] | 0;
                if ((b | 0) == (a | 0)) {
                    d4[2783] = d4[2783] & ~(1 << c);
                    d = f;
                    b = h;
                    break;
                } else {
                    d4[(a + 12) >> 2] = b;
                    d4[(b + 8) >> 2] = a;
                    d = f;
                    b = h;
                    break;
                }
            }
            i = d4[(f + 24) >> 2] | 0;
            a = d4[(f + 12) >> 2] | 0;
            do if ((a | 0) == (f | 0)) {
                c = (f + 16) | 0;
                b = (c + 4) | 0;
                a = d4[b >> 2] | 0;
                if (!a) {
                    a = d4[c >> 2] | 0;
                    if (!a) {
                        a = 0;
                        break;
                    } else b = c;
                }
                while(1){
                    c = (a + 20) | 0;
                    g = d4[c >> 2] | 0;
                    if (g | 0) {
                        a = g;
                        b = c;
                        continue;
                    }
                    c = (a + 16) | 0;
                    g = d4[c >> 2] | 0;
                    if (!g) break;
                    else {
                        a = g;
                        b = c;
                    }
                }
                d4[b >> 2] = 0;
            } else {
                d = d4[(f + 8) >> 2] | 0;
                d4[(d + 12) >> 2] = a;
                d4[(a + 8) >> 2] = d;
            }
            while (0)
            if (i) {
                b = d4[(f + 28) >> 2] | 0;
                c = (11436 + (b << 2)) | 0;
                if ((f | 0) == (d4[c >> 2] | 0)) {
                    d4[c >> 2] = a;
                    if (!a) {
                        d4[2784] = d4[2784] & ~(1 << b);
                        d = f;
                        b = h;
                        break;
                    }
                } else {
                    d4[(i + 16 + ((((d4[(i + 16) >> 2] | 0) != (f | 0)) & 1) << 2)) >> 2] = a;
                    if (!a) {
                        d = f;
                        b = h;
                        break;
                    }
                }
                d4[(a + 24) >> 2] = i;
                b = (f + 16) | 0;
                c = d4[b >> 2] | 0;
                if (c | 0) {
                    d4[(a + 16) >> 2] = c;
                    d4[(c + 24) >> 2] = a;
                }
                b = d4[(b + 4) >> 2] | 0;
                if (b) {
                    d4[(a + 20) >> 2] = b;
                    d4[(b + 24) >> 2] = a;
                    d = f;
                    b = h;
                } else {
                    d = f;
                    b = h;
                }
            } else {
                d = f;
                b = h;
            }
        } else {
            d = c;
            f = c;
        }
        while (0)
        if (f >>> 0 >= e >>> 0) return;
        a = (e + 4) | 0;
        g = d4[a >> 2] | 0;
        if (!(g & 1)) return;
        if (!(g & 2)) {
            a = d4[2788] | 0;
            if ((e | 0) == (d4[2789] | 0)) {
                e = ((d4[2786] | 0) + b) | 0;
                d4[2786] = e;
                d4[2789] = d;
                d4[(d + 4) >> 2] = e | 1;
                if ((d | 0) != (a | 0)) return;
                d4[2788] = 0;
                d4[2785] = 0;
                return;
            }
            if ((e | 0) == (a | 0)) {
                e = ((d4[2785] | 0) + b) | 0;
                d4[2785] = e;
                d4[2788] = f;
                d4[(d + 4) >> 2] = e | 1;
                d4[(f + e) >> 2] = e;
                return;
            }
            i = ((g & -8) + b) | 0;
            c = g >>> 3;
            do if (g >>> 0 < 256) {
                b = d4[(e + 8) >> 2] | 0;
                a = d4[(e + 12) >> 2] | 0;
                if ((a | 0) == (b | 0)) {
                    d4[2783] = d4[2783] & ~(1 << c);
                    break;
                } else {
                    d4[(b + 12) >> 2] = a;
                    d4[(a + 8) >> 2] = b;
                    break;
                }
            } else {
                h = d4[(e + 24) >> 2] | 0;
                a = d4[(e + 12) >> 2] | 0;
                do if ((a | 0) == (e | 0)) {
                    c = (e + 16) | 0;
                    b = (c + 4) | 0;
                    a = d4[b >> 2] | 0;
                    if (!a) {
                        a = d4[c >> 2] | 0;
                        if (!a) {
                            c = 0;
                            break;
                        } else b = c;
                    }
                    while(1){
                        c = (a + 20) | 0;
                        g = d4[c >> 2] | 0;
                        if (g | 0) {
                            a = g;
                            b = c;
                            continue;
                        }
                        c = (a + 16) | 0;
                        g = d4[c >> 2] | 0;
                        if (!g) break;
                        else {
                            a = g;
                            b = c;
                        }
                    }
                    d4[b >> 2] = 0;
                    c = a;
                } else {
                    c = d4[(e + 8) >> 2] | 0;
                    d4[(c + 12) >> 2] = a;
                    d4[(a + 8) >> 2] = c;
                    c = a;
                }
                while (0)
                if (h | 0) {
                    a = d4[(e + 28) >> 2] | 0;
                    b = (11436 + (a << 2)) | 0;
                    if ((e | 0) == (d4[b >> 2] | 0)) {
                        d4[b >> 2] = c;
                        if (!c) {
                            d4[2784] = d4[2784] & ~(1 << a);
                            break;
                        }
                    } else {
                        d4[(h + 16 + ((((d4[(h + 16) >> 2] | 0) != (e | 0)) & 1) << 2)) >> 2] = c;
                        if (!c) break;
                    }
                    d4[(c + 24) >> 2] = h;
                    a = (e + 16) | 0;
                    b = d4[a >> 2] | 0;
                    if (b | 0) {
                        d4[(c + 16) >> 2] = b;
                        d4[(b + 24) >> 2] = c;
                    }
                    a = d4[(a + 4) >> 2] | 0;
                    if (a | 0) {
                        d4[(c + 20) >> 2] = a;
                        d4[(a + 24) >> 2] = c;
                    }
                }
            }
            while (0)
            d4[(d + 4) >> 2] = i | 1;
            d4[(f + i) >> 2] = i;
            if ((d | 0) == (d4[2788] | 0)) {
                d4[2785] = i;
                return;
            }
        } else {
            d4[a >> 2] = g & -2;
            d4[(d + 4) >> 2] = b | 1;
            d4[(f + b) >> 2] = b;
            i = b;
        }
        a = i >>> 3;
        if (i >>> 0 < 256) {
            c = (11172 + ((a << 1) << 2)) | 0;
            b = d4[2783] | 0;
            a = 1 << a;
            if (!(b & a)) {
                d4[2783] = b | a;
                a = c;
                b = (c + 8) | 0;
            } else {
                b = (c + 8) | 0;
                a = d4[b >> 2] | 0;
            }
            d4[b >> 2] = d;
            d4[(a + 12) >> 2] = d;
            d4[(d + 8) >> 2] = a;
            d4[(d + 12) >> 2] = c;
            return;
        }
        a = i >>> 8;
        if (a) {
            if (i >>> 0 > 16777215) a = 31;
            else {
                f = (((a + 1048320) | 0) >>> 16) & 8;
                e = a << f;
                h = (((e + 520192) | 0) >>> 16) & 4;
                e = e << h;
                a = (((e + 245760) | 0) >>> 16) & 2;
                a = (14 - (h | f | a) + ((e << a) >>> 15)) | 0;
                a = ((i >>> ((a + 7) | 0)) & 1) | (a << 1);
            }
        } else a = 0;
        g = (11436 + (a << 2)) | 0;
        d4[(d + 28) >> 2] = a;
        d4[(d + 20) >> 2] = 0;
        d4[(d + 16) >> 2] = 0;
        b = d4[2784] | 0;
        c = 1 << a;
        do if (b & c) {
            b = i << ((a | 0) == 31 ? 0 : (25 - (a >>> 1)) | 0);
            c = d4[g >> 2] | 0;
            while(1){
                if (((d4[(c + 4) >> 2] & -8) | 0) == (i | 0)) {
                    a = 73;
                    break;
                }
                g = (c + 16 + ((b >>> 31) << 2)) | 0;
                a = d4[g >> 2] | 0;
                if (!a) {
                    a = 72;
                    break;
                } else {
                    b = b << 1;
                    c = a;
                }
            }
            if ((a | 0) == 72) {
                d4[g >> 2] = d;
                d4[(d + 24) >> 2] = c;
                d4[(d + 12) >> 2] = d;
                d4[(d + 8) >> 2] = d;
                break;
            } else if ((a | 0) == 73) {
                f = (c + 8) | 0;
                e = d4[f >> 2] | 0;
                d4[(e + 12) >> 2] = d;
                d4[f >> 2] = d;
                d4[(d + 8) >> 2] = e;
                d4[(d + 12) >> 2] = c;
                d4[(d + 24) >> 2] = 0;
                break;
            }
        } else {
            d4[2784] = b | c;
            d4[g >> 2] = d;
            d4[(d + 24) >> 2] = g;
            d4[(d + 12) >> 2] = d;
            d4[(d + 8) >> 2] = d;
        }
        while (0)
        e = ((d4[2791] | 0) + -1) | 0;
        d4[2791] = e;
        if (!e) a = 11588;
        else return;
        while(1){
            a = d4[a >> 2] | 0;
            if (!a) break;
            else a = (a + 8) | 0;
        }
        d4[2791] = -1;
        return;
    }
    function c4() {
        return 11628;
    }
    function c5(a) {
        a = a | 0;
        var b = 0, c = 0;
        b = ed;
        ed = (ed + 16) | 0;
        c = b;
        d4[c >> 2] = x0(d4[(a + 60) >> 2] | 0) | 0;
        a = xY(fM(6, c | 0) | 0) | 0;
        ed = b;
        return a | 0;
    }
    function c6(c, f, g) {
        c = c | 0;
        f = f | 0;
        g = g | 0;
        var d = 0, a = 0, b = 0, m = 0, k = 0, l = 0, i = 0, n = 0, j = 0, h = 0, e = 0;
        j = ed;
        ed = (ed + 48) | 0;
        i = (j + 16) | 0;
        b = j;
        a = (j + 32) | 0;
        k = (c + 28) | 0;
        d = d4[k >> 2] | 0;
        d4[a >> 2] = d;
        l = (c + 20) | 0;
        d = ((d4[l >> 2] | 0) - d) | 0;
        d4[(a + 4) >> 2] = d;
        d4[(a + 8) >> 2] = f;
        d4[(a + 12) >> 2] = g;
        d = (d + g) | 0;
        m = (c + 60) | 0;
        d4[b >> 2] = d4[m >> 2];
        d4[(b + 4) >> 2] = a;
        d4[(b + 8) >> 2] = 2;
        b = xY(fP(146, b | 0) | 0) | 0;
        a: do if ((d | 0) != (b | 0)) {
            f = 2;
            while(1){
                if ((b | 0) < 0) break;
                d = (d - b) | 0;
                e = d4[(a + 4) >> 2] | 0;
                h = b >>> 0 > e >>> 0;
                a = h ? (a + 8) | 0 : a;
                f = (((h << 31) >> 31) + f) | 0;
                e = (b - (h ? e : 0)) | 0;
                d4[a >> 2] = (d4[a >> 2] | 0) + e;
                h = (a + 4) | 0;
                d4[h >> 2] = (d4[h >> 2] | 0) - e;
                d4[i >> 2] = d4[m >> 2];
                d4[(i + 4) >> 2] = a;
                d4[(i + 8) >> 2] = f;
                b = xY(fP(146, i | 0) | 0) | 0;
                if ((d | 0) == (b | 0)) {
                    n = 3;
                    break a;
                }
            }
            d4[(c + 16) >> 2] = 0;
            d4[k >> 2] = 0;
            d4[l >> 2] = 0;
            d4[c >> 2] = d4[c >> 2] | 32;
            if ((f | 0) == 2) g = 0;
            else g = (g - (d4[(a + 4) >> 2] | 0)) | 0;
        } else n = 3;
        while (0)
        if ((n | 0) == 3) {
            e = d4[(c + 44) >> 2] | 0;
            d4[(c + 16) >> 2] = e + (d4[(c + 48) >> 2] | 0);
            d4[k >> 2] = e;
            d4[l >> 2] = e;
        }
        ed = j;
        return g | 0;
    }
    function c7(b, e, f) {
        b = b | 0;
        e = e | 0;
        f = f | 0;
        var c = 0, d = 0, a = 0;
        d = ed;
        ed = (ed + 32) | 0;
        a = d;
        c = (d + 20) | 0;
        d4[a >> 2] = d4[(b + 60) >> 2];
        d4[(a + 4) >> 2] = 0;
        d4[(a + 8) >> 2] = e;
        d4[(a + 12) >> 2] = c;
        d4[(a + 16) >> 2] = f;
        if ((xY(fO(140, a | 0) | 0) | 0) < 0) {
            d4[c >> 2] = -1;
            b = -1;
        } else b = d4[c >> 2] | 0;
        ed = d;
        return b | 0;
    }
    function xY(a) {
        a = a | 0;
        if (a >>> 0 > 4294963200) {
            d4[(xZ() | 0) >> 2] = 0 - a;
            a = -1;
        }
        return a | 0;
    }
    function xZ() {
        return ((x$() | 0) + 64) | 0;
    }
    function x$() {
        return x_() | 0;
    }
    function x_() {
        return 2084;
    }
    function x0(a) {
        a = a | 0;
        return a | 0;
    }
    function c8(a, d, e) {
        a = a | 0;
        d = d | 0;
        e = e | 0;
        var b = 0, c = 0;
        c = ed;
        ed = (ed + 32) | 0;
        b = c;
        d4[(a + 36) >> 2] = 1;
        if (((d4[a >> 2] & 64) | 0) == 0 ? ((d4[b >> 2] = d4[(a + 60) >> 2]), (d4[(b + 4) >> 2] = 21523), (d4[(b + 8) >> 2] = c + 16), fD(54, b | 0) | 0) : 0) d2[(a + 75) >> 0] = -1;
        b = c6(a, d, e) | 0;
        ed = c;
        return b | 0;
    }
    function x1(a, c) {
        a = a | 0;
        c = c | 0;
        var b = 0, d = 0;
        b = d2[a >> 0] | 0;
        d = d2[c >> 0] | 0;
        if ((b << 24) >> 24 == 0 ? 1 : (b << 24) >> 24 != (d << 24) >> 24) a = d;
        else {
            do {
                a = (a + 1) | 0;
                c = (c + 1) | 0;
                b = d2[a >> 0] | 0;
                d = d2[c >> 0] | 0;
            }while (!((b << 24) >> 24 == 0 ? 1 : (b << 24) >> 24 != (d << 24) >> 24))
            a = d;
        }
        return ((b & 255) - (a & 255)) | 0;
    }
    function x2(a, c, b) {
        a = a | 0;
        c = c | 0;
        b = b | 0;
        var d = 0, e = 0;
        a: do if (!b) a = 0;
        else {
            while(1){
                d = d2[a >> 0] | 0;
                e = d2[c >> 0] | 0;
                if ((d << 24) >> 24 != (e << 24) >> 24) break;
                b = (b + -1) | 0;
                if (!b) {
                    a = 0;
                    break a;
                } else {
                    a = (a + 1) | 0;
                    c = (c + 1) | 0;
                }
            }
            a = ((d & 255) - (e & 255)) | 0;
        }
        while (0)
        return a | 0;
    }
    function x3(a, f, b) {
        a = a | 0;
        f = f | 0;
        b = b | 0;
        var c = 0, d = 0, l = 0, m = 0, j = 0, n = 0, p = 0, g = 0, h = 0, o = 0, k = 0, i = 0, e = 0;
        e = ed;
        ed = (ed + 224) | 0;
        g = (e + 120) | 0;
        h = (e + 80) | 0;
        k = e;
        i = (e + 136) | 0;
        c = h;
        d = (c + 40) | 0;
        do {
            d4[c >> 2] = 0;
            c = (c + 4) | 0;
        }while ((c | 0) < (d | 0))
        d4[g >> 2] = d4[b >> 2];
        if ((x4(0, f, g, k, h) | 0) < 0) b = -1;
        else {
            if ((d4[(a + 76) >> 2] | 0) > -1) o = x5(a) | 0;
            else o = 0;
            b = d4[a >> 2] | 0;
            p = b & 32;
            if ((d2[(a + 74) >> 0] | 0) < 1) d4[a >> 2] = b & -33;
            c = (a + 48) | 0;
            if (!(d4[c >> 2] | 0)) {
                d = (a + 44) | 0;
                l = d4[d >> 2] | 0;
                d4[d >> 2] = i;
                m = (a + 28) | 0;
                d4[m >> 2] = i;
                j = (a + 20) | 0;
                d4[j >> 2] = i;
                d4[c >> 2] = 80;
                n = (a + 16) | 0;
                d4[n >> 2] = i + 80;
                b = x4(a, f, g, k, h) | 0;
                if (l) {
                    yX[d4[(a + 36) >> 2] & 7](a, 0, 0) | 0;
                    b = (d4[j >> 2] | 0) == 0 ? -1 : b;
                    d4[d >> 2] = l;
                    d4[c >> 2] = 0;
                    d4[n >> 2] = 0;
                    d4[m >> 2] = 0;
                    d4[j >> 2] = 0;
                }
            } else b = x4(a, f, g, k, h) | 0;
            c = d4[a >> 2] | 0;
            d4[a >> 2] = c | p;
            if (o | 0) x6(a);
            b = ((c & 32) | 0) == 0 ? b : -1;
        }
        ed = e;
        return b | 0;
    }
    function x4(o, d, s, v, t) {
        o = o | 0;
        d = d | 0;
        s = s | 0;
        v = v | 0;
        t = t | 0;
        var g = 0, b = 0, c = 0, a = 0, h = 0, q = 0, j = 0, m = 0, k = 0, n = 0, e = 0, i = 0, f = 0, w = 0, r = 0, A = 0, x = 0, B = 0, p = 0, l = 0, y = 0, z = 0, u = 0;
        u = ed;
        ed = (ed + 64) | 0;
        p = (u + 16) | 0;
        l = u;
        x = (u + 24) | 0;
        y = (u + 8) | 0;
        z = (u + 20) | 0;
        d4[p >> 2] = d;
        w = (o | 0) != 0;
        r = (x + 40) | 0;
        A = r;
        x = (x + 39) | 0;
        B = (y + 4) | 0;
        b = 0;
        g = 0;
        q = 0;
        a: while(1){
            do if ((g | 0) > -1) if ((b | 0) > ((2147483647 - g) | 0)) {
                d4[(xZ() | 0) >> 2] = 75;
                g = -1;
                break;
            } else {
                g = (b + g) | 0;
                break;
            }
            while (0)
            b = d2[d >> 0] | 0;
            if (!((b << 24) >> 24)) {
                f = 87;
                break;
            } else c = d;
            b: while(1){
                switch((b << 24) >> 24){
                    case 37:
                        {
                            b = c;
                            f = 9;
                            break b;
                        }
                    case 0:
                        {
                            b = c;
                            break b;
                        }
                    default:
                        {}
                }
                i = (c + 1) | 0;
                d4[p >> 2] = i;
                b = d2[i >> 0] | 0;
                c = i;
            }
            c: do if ((f | 0) == 9) while(1){
                f = 0;
                if ((d2[(c + 1) >> 0] | 0) != 37) break c;
                b = (b + 1) | 0;
                c = (c + 2) | 0;
                d4[p >> 2] = c;
                if ((d2[c >> 0] | 0) == 37) f = 9;
                else break;
            }
            while (0)
            b = (b - d) | 0;
            if (w) x7(o, d, b);
            if (b | 0) {
                d = c;
                continue;
            }
            a = (c + 1) | 0;
            b = ((d2[a >> 0] | 0) + -48) | 0;
            if (b >>> 0 < 10) {
                i = (d2[(c + 2) >> 0] | 0) == 36;
                e = i ? b : -1;
                q = i ? 1 : q;
                a = i ? (c + 3) | 0 : a;
            } else e = -1;
            d4[p >> 2] = a;
            b = d2[a >> 0] | 0;
            c = (((b << 24) >> 24) + -32) | 0;
            d: do if (c >>> 0 < 32) {
                h = 0;
                j = b;
                while(1){
                    b = 1 << c;
                    if (!(b & 75913)) {
                        b = j;
                        break d;
                    }
                    h = b | h;
                    a = (a + 1) | 0;
                    d4[p >> 2] = a;
                    b = d2[a >> 0] | 0;
                    c = (((b << 24) >> 24) + -32) | 0;
                    if (c >>> 0 >= 32) break;
                    else j = b;
                }
            } else h = 0;
            while (0)
            if ((b << 24) >> 24 == 42) {
                c = (a + 1) | 0;
                b = ((d2[c >> 0] | 0) + -48) | 0;
                if (b >>> 0 < 10 ? (d2[(a + 2) >> 0] | 0) == 36 : 0) {
                    d4[(t + (b << 2)) >> 2] = 10;
                    b = d4[(v + (((d2[c >> 0] | 0) + -48) << 3)) >> 2] | 0;
                    q = 1;
                    a = (a + 3) | 0;
                } else {
                    if (q | 0) {
                        g = -1;
                        break;
                    }
                    if (w) {
                        q = ((d4[s >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                        b = d4[q >> 2] | 0;
                        d4[s >> 2] = q + 4;
                        q = 0;
                        a = c;
                    } else {
                        b = 0;
                        q = 0;
                        a = c;
                    }
                }
                d4[p >> 2] = a;
                i = (b | 0) < 0;
                b = i ? (0 - b) | 0 : b;
                h = i ? h | 8192 : h;
            } else {
                b = x8(p) | 0;
                if ((b | 0) < 0) {
                    g = -1;
                    break;
                }
                a = d4[p >> 2] | 0;
            }
            do if ((d2[a >> 0] | 0) == 46) {
                if ((d2[(a + 1) >> 0] | 0) != 42) {
                    d4[p >> 2] = a + 1;
                    c = x8(p) | 0;
                    a = d4[p >> 2] | 0;
                    break;
                }
                j = (a + 2) | 0;
                c = ((d2[j >> 0] | 0) + -48) | 0;
                if (c >>> 0 < 10 ? (d2[(a + 3) >> 0] | 0) == 36 : 0) {
                    d4[(t + (c << 2)) >> 2] = 10;
                    c = d4[(v + (((d2[j >> 0] | 0) + -48) << 3)) >> 2] | 0;
                    a = (a + 4) | 0;
                    d4[p >> 2] = a;
                    break;
                }
                if (q | 0) {
                    g = -1;
                    break a;
                }
                if (w) {
                    i = ((d4[s >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    c = d4[i >> 2] | 0;
                    d4[s >> 2] = i + 4;
                } else c = 0;
                d4[p >> 2] = j;
                a = j;
            } else c = -1;
            while (0)
            n = 0;
            while(1){
                if ((((d2[a >> 0] | 0) + -65) | 0) >>> 0 > 57) {
                    g = -1;
                    break a;
                }
                i = (a + 1) | 0;
                d4[p >> 2] = i;
                j = d2[((d2[a >> 0] | 0) + -65 + (5178 + ((n * 58) | 0))) >> 0] | 0;
                m = j & 255;
                if (((m + -1) | 0) >>> 0 < 8) {
                    n = m;
                    a = i;
                } else break;
            }
            if (!((j << 24) >> 24)) {
                g = -1;
                break;
            }
            k = (e | 0) > -1;
            do if ((j << 24) >> 24 == 19) {
                if (k) {
                    g = -1;
                    break a;
                } else f = 49;
            } else {
                if (k) {
                    d4[(t + (e << 2)) >> 2] = m;
                    k = (v + (e << 3)) | 0;
                    e = d4[(k + 4) >> 2] | 0;
                    f = l;
                    d4[f >> 2] = d4[k >> 2];
                    d4[(f + 4) >> 2] = e;
                    f = 49;
                    break;
                }
                if (!w) {
                    g = 0;
                    break a;
                }
                x9(l, m, s);
            }
            while (0)
            if ((f | 0) == 49 ? ((f = 0), !w) : 0) {
                b = 0;
                d = i;
                continue;
            }
            a = d2[a >> 0] | 0;
            a = ((n | 0) != 0) & (((a & 15) | 0) == 3) ? a & -33 : a;
            k = h & -65537;
            e = ((h & 8192) | 0) == 0 ? h : k;
            e: do switch(a | 0){
                case 110:
                    switch(((n & 255) << 24) >> 24){
                        case 0:
                            {
                                d4[d4[l >> 2] >> 2] = g;
                                b = 0;
                                d = i;
                                continue a;
                            }
                        case 1:
                            {
                                d4[d4[l >> 2] >> 2] = g;
                                b = 0;
                                d = i;
                                continue a;
                            }
                        case 2:
                            {
                                b = d4[l >> 2] | 0;
                                d4[b >> 2] = g;
                                d4[(b + 4) >> 2] = (((g | 0) < 0) << 31) >> 31;
                                b = 0;
                                d = i;
                                continue a;
                            }
                        case 3:
                            {
                                d3[d4[l >> 2] >> 1] = g;
                                b = 0;
                                d = i;
                                continue a;
                            }
                        case 4:
                            {
                                d2[d4[l >> 2] >> 0] = g;
                                b = 0;
                                d = i;
                                continue a;
                            }
                        case 6:
                            {
                                d4[d4[l >> 2] >> 2] = g;
                                b = 0;
                                d = i;
                                continue a;
                            }
                        case 7:
                            {
                                b = d4[l >> 2] | 0;
                                d4[b >> 2] = g;
                                d4[(b + 4) >> 2] = (((g | 0) < 0) << 31) >> 31;
                                b = 0;
                                d = i;
                                continue a;
                            }
                        default:
                            {
                                b = 0;
                                d = i;
                                continue a;
                            }
                    }
                case 112:
                    {
                        a = 120;
                        c = c >>> 0 > 8 ? c : 8;
                        d = e | 8;
                        f = 61;
                        break;
                    }
                case 88:
                case 120:
                    {
                        d = e;
                        f = 61;
                        break;
                    }
                case 111:
                    {
                        a = l;
                        d = d4[a >> 2] | 0;
                        a = d4[(a + 4) >> 2] | 0;
                        m = yb(d, a, r) | 0;
                        k = (A - m) | 0;
                        h = 0;
                        j = 5642;
                        c = (((e & 8) | 0) == 0) | ((c | 0) > (k | 0)) ? c : (k + 1) | 0;
                        k = e;
                        f = 67;
                        break;
                    }
                case 105:
                case 100:
                    {
                        a = l;
                        d = d4[a >> 2] | 0;
                        a = d4[(a + 4) >> 2] | 0;
                        if ((a | 0) < 0) {
                            d = dc(0, 0, d | 0, a | 0) | 0;
                            a = es;
                            h = l;
                            d4[h >> 2] = d;
                            d4[(h + 4) >> 2] = a;
                            h = 1;
                            j = 5642;
                            f = 66;
                            break e;
                        } else {
                            h = (((e & 2049) | 0) != 0) & 1;
                            j = ((e & 2048) | 0) == 0 ? ((e & 1) | 0) == 0 ? 5642 : 5644 : 5643;
                            f = 66;
                            break e;
                        }
                    }
                case 117:
                    {
                        a = l;
                        h = 0;
                        j = 5642;
                        d = d4[a >> 2] | 0;
                        a = d4[(a + 4) >> 2] | 0;
                        f = 66;
                        break;
                    }
                case 99:
                    {
                        d2[x >> 0] = d4[l >> 2];
                        d = x;
                        h = 0;
                        j = 5642;
                        m = r;
                        a = 1;
                        c = k;
                        break;
                    }
                case 109:
                    {
                        a = yd(d4[(xZ() | 0) >> 2] | 0) | 0;
                        f = 71;
                        break;
                    }
                case 115:
                    {
                        a = d4[l >> 2] | 0;
                        a = a | 0 ? a : 5652;
                        f = 71;
                        break;
                    }
                case 67:
                    {
                        d4[y >> 2] = d4[l >> 2];
                        d4[B >> 2] = 0;
                        d4[l >> 2] = y;
                        m = -1;
                        a = y;
                        f = 75;
                        break;
                    }
                case 83:
                    {
                        d = d4[l >> 2] | 0;
                        if (!c) {
                            yf(o, 32, b, 0, e);
                            d = 0;
                            f = 84;
                        } else {
                            m = c;
                            a = d;
                            f = 75;
                        }
                        break;
                    }
                case 65:
                case 71:
                case 70:
                case 69:
                case 97:
                case 103:
                case 102:
                case 101:
                    {
                        b = yh(o, +d9[l >> 3], b, c, e, a) | 0;
                        d = i;
                        continue a;
                    }
                default:
                    {
                        h = 0;
                        j = 5642;
                        m = r;
                        a = c;
                        c = e;
                    }
            }
            while (0)
            f: do if ((f | 0) == 61) {
                e = l;
                n = d4[e >> 2] | 0;
                e = d4[(e + 4) >> 2] | 0;
                m = ya(n, e, r, a & 32) | 0;
                j = (((d & 8) | 0) == 0) | (((n | 0) == 0) & ((e | 0) == 0));
                h = j ? 0 : 2;
                j = j ? 5642 : (5642 + (a >> 4)) | 0;
                k = d;
                d = n;
                a = e;
                f = 67;
            } else if ((f | 0) == 66) {
                m = yc(d, a, r) | 0;
                k = e;
                f = 67;
            } else if ((f | 0) == 71) {
                f = 0;
                e = ye(a, 0, c) | 0;
                n = (e | 0) == 0;
                d = a;
                h = 0;
                j = 5642;
                m = n ? (a + c) | 0 : e;
                a = n ? c : (e - a) | 0;
                c = k;
            } else if ((f | 0) == 75) {
                f = 0;
                j = a;
                d = 0;
                c = 0;
                while(1){
                    h = d4[j >> 2] | 0;
                    if (!h) break;
                    c = yg(z, h) | 0;
                    if (((c | 0) < 0) | (c >>> 0 > ((m - d) | 0) >>> 0)) break;
                    d = (c + d) | 0;
                    if (m >>> 0 > d >>> 0) j = (j + 4) | 0;
                    else break;
                }
                if ((c | 0) < 0) {
                    g = -1;
                    break a;
                }
                yf(o, 32, b, d, e);
                if (!d) {
                    d = 0;
                    f = 84;
                } else {
                    h = 0;
                    while(1){
                        c = d4[a >> 2] | 0;
                        if (!c) {
                            f = 84;
                            break f;
                        }
                        c = yg(z, c) | 0;
                        h = (c + h) | 0;
                        if ((h | 0) > (d | 0)) {
                            f = 84;
                            break f;
                        }
                        x7(o, z, c);
                        if (h >>> 0 >= d >>> 0) {
                            f = 84;
                            break;
                        } else a = (a + 4) | 0;
                    }
                }
            }
            while (0)
            if ((f | 0) == 67) {
                f = 0;
                a = ((d | 0) != 0) | ((a | 0) != 0);
                e = ((c | 0) != 0) | a;
                a = (((a ^ 1) & 1) + (A - m)) | 0;
                d = e ? m : r;
                m = r;
                a = e ? ((c | 0) > (a | 0) ? c : a) : c;
                c = (c | 0) > -1 ? k & -65537 : k;
            } else if ((f | 0) == 84) {
                f = 0;
                yf(o, 32, b, d, e ^ 8192);
                b = (b | 0) > (d | 0) ? b : d;
                d = i;
                continue;
            }
            n = (m - d) | 0;
            k = (a | 0) < (n | 0) ? n : a;
            e = (k + h) | 0;
            b = (b | 0) < (e | 0) ? e : b;
            yf(o, 32, b, e, c);
            x7(o, j, h);
            yf(o, 48, b, e, c ^ 65536);
            yf(o, 48, k, n, 0);
            x7(o, d, n);
            yf(o, 32, b, e, c ^ 8192);
            d = i;
        }
        g: do if ((f | 0) == 87) if (!o) if (!q) g = 0;
        else {
            g = 1;
            while(1){
                d = d4[(t + (g << 2)) >> 2] | 0;
                if (!d) break;
                x9((v + (g << 3)) | 0, d, s);
                g = (g + 1) | 0;
                if ((g | 0) >= 10) {
                    g = 1;
                    break g;
                }
            }
            while(1){
                if (d4[(t + (g << 2)) >> 2] | 0) {
                    g = -1;
                    break g;
                }
                g = (g + 1) | 0;
                if ((g | 0) >= 10) {
                    g = 1;
                    break;
                }
            }
        }
        while (0)
        ed = u;
        return g | 0;
    }
    function x5(a) {
        a = a | 0;
        return 0;
    }
    function x6(a) {
        a = a | 0;
        return;
    }
    function x7(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if (!(d4[a >> 2] & 32)) yt(b, c, a) | 0;
        return;
    }
    function x8(d) {
        d = d | 0;
        var b = 0, a = 0, c = 0;
        a = d4[d >> 2] | 0;
        c = ((d2[a >> 0] | 0) + -48) | 0;
        if (c >>> 0 < 10) {
            b = 0;
            do {
                b = (c + ((b * 10) | 0)) | 0;
                a = (a + 1) | 0;
                d4[d >> 2] = a;
                c = ((d2[a >> 0] | 0) + -48) | 0;
            }while (c >>> 0 < 10)
        } else b = 0;
        return b | 0;
    }
    function x9(e, d, c) {
        e = e | 0;
        d = d | 0;
        c = c | 0;
        var a = 0, b = 0, f = 0.0;
        a: do if (d >>> 0 <= 20) do switch(d | 0){
            case 9:
                {
                    a = ((d4[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    d = d4[a >> 2] | 0;
                    d4[c >> 2] = a + 4;
                    d4[e >> 2] = d;
                    break a;
                }
            case 10:
                {
                    a = ((d4[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    d = d4[a >> 2] | 0;
                    d4[c >> 2] = a + 4;
                    a = e;
                    d4[a >> 2] = d;
                    d4[(a + 4) >> 2] = (((d | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 11:
                {
                    a = ((d4[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    d = d4[a >> 2] | 0;
                    d4[c >> 2] = a + 4;
                    a = e;
                    d4[a >> 2] = d;
                    d4[(a + 4) >> 2] = 0;
                    break a;
                }
            case 12:
                {
                    a = ((d4[c >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    d = a;
                    b = d4[d >> 2] | 0;
                    d = d4[(d + 4) >> 2] | 0;
                    d4[c >> 2] = a + 8;
                    a = e;
                    d4[a >> 2] = b;
                    d4[(a + 4) >> 2] = d;
                    break a;
                }
            case 13:
                {
                    b = ((d4[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    a = d4[b >> 2] | 0;
                    d4[c >> 2] = b + 4;
                    a = ((a & 65535) << 16) >> 16;
                    b = e;
                    d4[b >> 2] = a;
                    d4[(b + 4) >> 2] = (((a | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 14:
                {
                    b = ((d4[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    a = d4[b >> 2] | 0;
                    d4[c >> 2] = b + 4;
                    b = e;
                    d4[b >> 2] = a & 65535;
                    d4[(b + 4) >> 2] = 0;
                    break a;
                }
            case 15:
                {
                    b = ((d4[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    a = d4[b >> 2] | 0;
                    d4[c >> 2] = b + 4;
                    a = ((a & 255) << 24) >> 24;
                    b = e;
                    d4[b >> 2] = a;
                    d4[(b + 4) >> 2] = (((a | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 16:
                {
                    b = ((d4[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    a = d4[b >> 2] | 0;
                    d4[c >> 2] = b + 4;
                    b = e;
                    d4[b >> 2] = a & 255;
                    d4[(b + 4) >> 2] = 0;
                    break a;
                }
            case 17:
                {
                    b = ((d4[c >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    f = +d9[b >> 3];
                    d4[c >> 2] = b + 8;
                    d9[e >> 3] = f;
                    break a;
                }
            case 18:
                {
                    b = ((d4[c >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    f = +d9[b >> 3];
                    d4[c >> 2] = b + 8;
                    d9[e >> 3] = f;
                    break a;
                }
            default:
                break a;
        }
        while (0)
        while (0)
        return;
    }
    function ya(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if (!(((a | 0) == 0) & ((b | 0) == 0))) do {
            c = (c + -1) | 0;
            d2[c >> 0] = d5[(5694 + (a & 15)) >> 0] | 0 | d;
            a = dg(a | 0, b | 0, 4) | 0;
            b = es;
        }while (!(((a | 0) == 0) & ((b | 0) == 0)))
        return c | 0;
    }
    function yb(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if (!(((a | 0) == 0) & ((b | 0) == 0))) do {
            c = (c + -1) | 0;
            d2[c >> 0] = (a & 7) | 48;
            a = dg(a | 0, b | 0, 3) | 0;
            b = es;
        }while (!(((a | 0) == 0) & ((b | 0) == 0)))
        return c | 0;
    }
    function yc(b, a, c) {
        b = b | 0;
        a = a | 0;
        c = c | 0;
        var d = 0;
        if ((a >>> 0 > 0) | (((a | 0) == 0) & (b >>> 0 > 4294967295))) {
            while(1){
                d = dl(b | 0, a | 0, 10, 0) | 0;
                c = (c + -1) | 0;
                d2[c >> 0] = (d & 255) | 48;
                d = b;
                b = di(b | 0, a | 0, 10, 0) | 0;
                if (!((a >>> 0 > 9) | (((a | 0) == 9) & (d >>> 0 > 4294967295)))) break;
                else a = es;
            }
            a = b;
        } else a = b;
        if (a) while(1){
            c = (c + -1) | 0;
            d2[c >> 0] = (a >>> 0) % 10 | 0 | 48;
            if (a >>> 0 < 10) break;
            else a = ((a >>> 0) / 10) | 0;
        }
        return c | 0;
    }
    function yd(a) {
        a = a | 0;
        return yo(a, d4[((yn() | 0) + 188) >> 2] | 0) | 0;
    }
    function ye(b, e, a) {
        b = b | 0;
        e = e | 0;
        a = a | 0;
        var d = 0, f = 0, g = 0, c = 0;
        g = e & 255;
        d = (a | 0) != 0;
        a: do if (d & (((b & 3) | 0) != 0)) {
            f = e & 255;
            while(1){
                if ((d2[b >> 0] | 0) == (f << 24) >> 24) {
                    c = 6;
                    break a;
                }
                b = (b + 1) | 0;
                a = (a + -1) | 0;
                d = (a | 0) != 0;
                if (!(d & (((b & 3) | 0) != 0))) {
                    c = 5;
                    break;
                }
            }
        } else c = 5;
        while (0)
        if ((c | 0) == 5) if (d) c = 6;
        else a = 0;
        b: do if ((c | 0) == 6) {
            f = e & 255;
            if ((d2[b >> 0] | 0) != (f << 24) >> 24) {
                d = eH(g, 16843009) | 0;
                c: do if (a >>> 0 > 3) while(1){
                    g = d4[b >> 2] ^ d;
                    if ((((g & -2139062144) ^ -2139062144) & (g + -16843009)) | 0) break;
                    b = (b + 4) | 0;
                    a = (a + -4) | 0;
                    if (a >>> 0 <= 3) {
                        c = 11;
                        break c;
                    }
                }
                else c = 11;
                while (0)
                if ((c | 0) == 11) if (!a) {
                    a = 0;
                    break;
                }
                while(1){
                    if ((d2[b >> 0] | 0) == (f << 24) >> 24) break b;
                    b = (b + 1) | 0;
                    a = (a + -1) | 0;
                    if (!a) {
                        a = 0;
                        break;
                    }
                }
            }
        }
        while (0)
        return (a | 0 ? b : 0) | 0;
    }
    function yf(e, b, c, d, a) {
        e = e | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        a = a | 0;
        var f = 0, g = 0;
        g = ed;
        ed = (ed + 256) | 0;
        f = g;
        if (((c | 0) > (d | 0)) & (((a & 73728) | 0) == 0)) {
            a = (c - d) | 0;
            de(f | 0, b | 0, (a >>> 0 < 256 ? a : 256) | 0) | 0;
            if (a >>> 0 > 255) {
                b = (c - d) | 0;
                do {
                    x7(e, f, 256);
                    a = (a + -256) | 0;
                }while (a >>> 0 > 255)
                a = b & 255;
            }
            x7(e, f, a);
        }
        ed = g;
        return;
    }
    function yg(a, b) {
        a = a | 0;
        b = b | 0;
        if (!a) a = 0;
        else a = yl(a, b, 0) | 0;
        return a | 0;
    }
    function yh(h, g, u, i, p, x) {
        h = h | 0;
        g = +g;
        u = u | 0;
        i = i | 0;
        p = p | 0;
        x = x | 0;
        var a = 0, e = 0, b = 0, c = 0, f = 0, k = 0, l = 0, s = 0.0, d = 0, v = 0, m = 0, y = 0, q = 0, j = 0, r = 0, C = 0, A = 0, z = 0, n = 0, w = 0, t = 0, o = 0, B = 0;
        B = ed;
        ed = (ed + 560) | 0;
        b = (B + 8) | 0;
        m = B;
        o = (B + 524) | 0;
        t = o;
        c = (B + 512) | 0;
        d4[m >> 2] = 0;
        w = (c + 12) | 0;
        yi(g) | 0;
        if ((es | 0) < 0) {
            g = -g;
            z = 1;
            A = 5659;
        } else {
            z = (((p & 2049) | 0) != 0) & 1;
            A = ((p & 2048) | 0) == 0 ? ((p & 1) | 0) == 0 ? 5660 : 5665 : 5662;
        }
        yi(g) | 0;
        n = es & 2146435072;
        do if ((n >>> 0 < 2146435072) | (((n | 0) == 2146435072) & (0 < 0))) {
            s = +yj(g, m) * 2.0;
            a = s != 0.0;
            if (a) d4[m >> 2] = (d4[m >> 2] | 0) + -1;
            q = x | 32;
            if ((q | 0) == 97) {
                d = x & 32;
                l = (d | 0) == 0 ? A : (A + 9) | 0;
                k = z | 2;
                a = (12 - i) | 0;
                do if (!((i >>> 0 > 11) | ((a | 0) == 0))) {
                    g = 8.0;
                    do {
                        a = (a + -1) | 0;
                        g = g * 16.0;
                    }while ((a | 0) != 0)
                    if ((d2[l >> 0] | 0) == 45) {
                        g = -(g + (-s - g));
                        break;
                    } else {
                        g = s + g - g;
                        break;
                    }
                } else g = s;
                while (0)
                e = d4[m >> 2] | 0;
                a = (e | 0) < 0 ? (0 - e) | 0 : e;
                a = yc(a, (((a | 0) < 0) << 31) >> 31, w) | 0;
                if ((a | 0) == (w | 0)) {
                    a = (c + 11) | 0;
                    d2[a >> 0] = 48;
                }
                d2[(a + -1) >> 0] = ((e >> 31) & 2) + 43;
                f = (a + -2) | 0;
                d2[f >> 0] = x + 15;
                c = (i | 0) < 1;
                b = ((p & 8) | 0) == 0;
                a = o;
                do {
                    n = ~~g;
                    e = (a + 1) | 0;
                    d2[a >> 0] = d5[(5694 + n) >> 0] | d;
                    g = (g - +(n | 0)) * 16.0;
                    if (((e - t) | 0) == 1 ? !(b & (c & (g == 0.0))) : 0) {
                        d2[e >> 0] = 46;
                        a = (a + 2) | 0;
                    } else a = e;
                }while (g != 0.0)
                n = (a - t) | 0;
                t = (w - f) | 0;
                w = ((i | 0) != 0) & (((n + -2) | 0) < (i | 0)) ? (i + 2) | 0 : n;
                a = (t + k + w) | 0;
                yf(h, 32, u, a, p);
                x7(h, l, k);
                yf(h, 48, u, a, p ^ 65536);
                x7(h, o, n);
                yf(h, 48, (w - n) | 0, 0, 0);
                x7(h, f, t);
                yf(h, 32, u, a, p ^ 8192);
                break;
            }
            e = (i | 0) < 0 ? 6 : i;
            if (a) {
                a = ((d4[m >> 2] | 0) + -28) | 0;
                d4[m >> 2] = a;
                g = s * 268435456.0;
            } else {
                g = s;
                a = d4[m >> 2] | 0;
            }
            n = (a | 0) < 0 ? b : (b + 288) | 0;
            b = n;
            do {
                r = ~~g >>> 0;
                d4[b >> 2] = r;
                b = (b + 4) | 0;
                g = (g - +(r >>> 0)) * 1.0e9;
            }while (g != 0.0)
            if ((a | 0) > 0) {
                c = n;
                k = b;
                while(1){
                    f = (a | 0) < 29 ? a : 29;
                    a = (k + -4) | 0;
                    if (a >>> 0 >= c >>> 0) {
                        b = 0;
                        do {
                            j = df(d4[a >> 2] | 0, 0, f | 0) | 0;
                            j = dd(j | 0, es | 0, b | 0, 0) | 0;
                            r = es;
                            y = dl(j | 0, r | 0, 1e9, 0) | 0;
                            d4[a >> 2] = y;
                            b = di(j | 0, r | 0, 1e9, 0) | 0;
                            a = (a + -4) | 0;
                        }while (a >>> 0 >= c >>> 0)
                        if (b) {
                            c = (c + -4) | 0;
                            d4[c >> 2] = b;
                        }
                    }
                    b = k;
                    while(1){
                        if (b >>> 0 <= c >>> 0) break;
                        a = (b + -4) | 0;
                        if (!(d4[a >> 2] | 0)) b = a;
                        else break;
                    }
                    a = ((d4[m >> 2] | 0) - f) | 0;
                    d4[m >> 2] = a;
                    if ((a | 0) > 0) k = b;
                    else break;
                }
            } else c = n;
            if ((a | 0) < 0) {
                i = (((((e + 25) | 0) / 9) | 0) + 1) | 0;
                v = (q | 0) == 102;
                do {
                    d = (0 - a) | 0;
                    d = (d | 0) < 9 ? d : 9;
                    if (c >>> 0 < b >>> 0) {
                        f = ((1 << d) + -1) | 0;
                        k = 1e9 >>> d;
                        l = 0;
                        a = c;
                        do {
                            r = d4[a >> 2] | 0;
                            d4[a >> 2] = (r >>> d) + l;
                            l = eH(r & f, k) | 0;
                            a = (a + 4) | 0;
                        }while (a >>> 0 < b >>> 0)
                        a = (d4[c >> 2] | 0) == 0 ? (c + 4) | 0 : c;
                        if (!l) {
                            c = a;
                            a = b;
                        } else {
                            d4[b >> 2] = l;
                            c = a;
                            a = (b + 4) | 0;
                        }
                    } else {
                        c = (d4[c >> 2] | 0) == 0 ? (c + 4) | 0 : c;
                        a = b;
                    }
                    b = v ? n : c;
                    b = (((a - b) >> 2) | 0) > (i | 0) ? (b + (i << 2)) | 0 : a;
                    a = ((d4[m >> 2] | 0) + d) | 0;
                    d4[m >> 2] = a;
                }while ((a | 0) < 0)
                a = c;
                i = b;
            } else {
                a = c;
                i = b;
            }
            r = n;
            if (a >>> 0 < i >>> 0) {
                b = (((r - a) >> 2) * 9) | 0;
                f = d4[a >> 2] | 0;
                if (f >>> 0 >= 10) {
                    c = 10;
                    do {
                        c = (c * 10) | 0;
                        b = (b + 1) | 0;
                    }while (f >>> 0 >= c >>> 0)
                }
            } else b = 0;
            v = (q | 0) == 103;
            y = (e | 0) != 0;
            c = (e - ((q | 0) != 102 ? b : 0) + (((y & v) << 31) >> 31)) | 0;
            if ((c | 0) < ((((((i - r) >> 2) * 9) | 0) + -9) | 0)) {
                c = (c + 9216) | 0;
                d = (n + 4 + (((((c | 0) / 9) | 0) + -1024) << 2)) | 0;
                c = (((c | 0) % 9 | 0) + 1) | 0;
                if ((c | 0) < 9) {
                    f = 10;
                    do {
                        f = (f * 10) | 0;
                        c = (c + 1) | 0;
                    }while ((c | 0) != 9)
                } else f = 10;
                k = d4[d >> 2] | 0;
                l = (k >>> 0) % (f >>> 0) | 0;
                c = ((d + 4) | 0) == (i | 0);
                if (!(c & ((l | 0) == 0))) {
                    s = (((((k >>> 0) / (f >>> 0)) | 0) & 1) | 0) == 0 ? 9007199254740992.0 : 9007199254740994.0;
                    j = ((f | 0) / 2) | 0;
                    g = l >>> 0 < j >>> 0 ? 0.5 : c & ((l | 0) == (j | 0)) ? 1.0 : 1.5;
                    if (z) {
                        j = (d2[A >> 0] | 0) == 45;
                        g = j ? -g : g;
                        s = j ? -s : s;
                    }
                    c = (k - l) | 0;
                    d4[d >> 2] = c;
                    if (s + g != s) {
                        j = (c + f) | 0;
                        d4[d >> 2] = j;
                        if (j >>> 0 > 999999999) {
                            b = d;
                            while(1){
                                c = (b + -4) | 0;
                                d4[b >> 2] = 0;
                                if (c >>> 0 < a >>> 0) {
                                    a = (a + -4) | 0;
                                    d4[a >> 2] = 0;
                                }
                                j = ((d4[c >> 2] | 0) + 1) | 0;
                                d4[c >> 2] = j;
                                if (j >>> 0 > 999999999) b = c;
                                else break;
                            }
                        } else c = d;
                        b = (((r - a) >> 2) * 9) | 0;
                        k = d4[a >> 2] | 0;
                        if (k >>> 0 >= 10) {
                            f = 10;
                            do {
                                f = (f * 10) | 0;
                                b = (b + 1) | 0;
                            }while (k >>> 0 >= f >>> 0)
                        }
                    } else c = d;
                } else c = d;
                c = (c + 4) | 0;
                c = i >>> 0 > c >>> 0 ? c : i;
                j = a;
            } else {
                c = i;
                j = a;
            }
            q = c;
            while(1){
                if (q >>> 0 <= j >>> 0) {
                    m = 0;
                    break;
                }
                a = (q + -4) | 0;
                if (!(d4[a >> 2] | 0)) q = a;
                else {
                    m = 1;
                    break;
                }
            }
            i = (0 - b) | 0;
            do if (v) {
                a = (((y ^ 1) & 1) + e) | 0;
                if (((a | 0) > (b | 0)) & ((b | 0) > -5)) {
                    f = (x + -1) | 0;
                    e = (a + -1 - b) | 0;
                } else {
                    f = (x + -2) | 0;
                    e = (a + -1) | 0;
                }
                a = p & 8;
                if (!a) {
                    if (m ? ((C = d4[(q + -4) >> 2] | 0), (C | 0) != 0) : 0) {
                        if (!((C >>> 0) % 10 | 0)) {
                            c = 0;
                            a = 10;
                            do {
                                a = (a * 10) | 0;
                                c = (c + 1) | 0;
                            }while (!((C >>> 0) % (a >>> 0) | 0 | 0))
                        } else c = 0;
                    } else c = 9;
                    a = (((((q - r) >> 2) * 9) | 0) + -9) | 0;
                    if ((f | 32 | 0) == 102) {
                        d = (a - c) | 0;
                        d = (d | 0) > 0 ? d : 0;
                        e = (e | 0) < (d | 0) ? e : d;
                        d = 0;
                        break;
                    } else {
                        d = (a + b - c) | 0;
                        d = (d | 0) > 0 ? d : 0;
                        e = (e | 0) < (d | 0) ? e : d;
                        d = 0;
                        break;
                    }
                } else d = a;
            } else {
                f = x;
                d = p & 8;
            }
            while (0)
            v = e | d;
            k = ((v | 0) != 0) & 1;
            l = (f | 32 | 0) == 102;
            if (l) {
                y = 0;
                a = (b | 0) > 0 ? b : 0;
            } else {
                a = (b | 0) < 0 ? i : b;
                a = yc(a, (((a | 0) < 0) << 31) >> 31, w) | 0;
                c = w;
                if (((c - a) | 0) < 2) do {
                    a = (a + -1) | 0;
                    d2[a >> 0] = 48;
                }while (((c - a) | 0) < 2)
                d2[(a + -1) >> 0] = ((b >> 31) & 2) + 43;
                a = (a + -2) | 0;
                d2[a >> 0] = f;
                y = a;
                a = (c - a) | 0;
            }
            a = (z + 1 + e + k + a) | 0;
            yf(h, 32, u, a, p);
            x7(h, A, z);
            yf(h, 48, u, a, p ^ 65536);
            if (l) {
                f = j >>> 0 > n >>> 0 ? n : j;
                d = (o + 9) | 0;
                k = d;
                l = (o + 8) | 0;
                c = f;
                do {
                    b = yc(d4[c >> 2] | 0, 0, d) | 0;
                    if ((c | 0) == (f | 0)) {
                        if ((b | 0) == (d | 0)) {
                            d2[l >> 0] = 48;
                            b = l;
                        }
                    } else if (b >>> 0 > o >>> 0) {
                        de(o | 0, 48, (b - t) | 0) | 0;
                        do b = (b + -1) | 0;
                        while (b >>> 0 > o >>> 0)
                    }
                    x7(h, b, (k - b) | 0);
                    c = (c + 4) | 0;
                }while (c >>> 0 <= n >>> 0)
                if (v | 0) x7(h, 5710, 1);
                if ((c >>> 0 < q >>> 0) & ((e | 0) > 0)) while(1){
                    b = yc(d4[c >> 2] | 0, 0, d) | 0;
                    if (b >>> 0 > o >>> 0) {
                        de(o | 0, 48, (b - t) | 0) | 0;
                        do b = (b + -1) | 0;
                        while (b >>> 0 > o >>> 0)
                    }
                    x7(h, b, (e | 0) < 9 ? e : 9);
                    c = (c + 4) | 0;
                    b = (e + -9) | 0;
                    if (!((c >>> 0 < q >>> 0) & ((e | 0) > 9))) {
                        e = b;
                        break;
                    } else e = b;
                }
                yf(h, 48, (e + 9) | 0, 9, 0);
            } else {
                v = m ? q : (j + 4) | 0;
                if ((e | 0) > -1) {
                    m = (o + 9) | 0;
                    d = (d | 0) == 0;
                    i = m;
                    k = (0 - t) | 0;
                    l = (o + 8) | 0;
                    f = j;
                    do {
                        b = yc(d4[f >> 2] | 0, 0, m) | 0;
                        if ((b | 0) == (m | 0)) {
                            d2[l >> 0] = 48;
                            b = l;
                        }
                        do if ((f | 0) == (j | 0)) {
                            c = (b + 1) | 0;
                            x7(h, b, 1);
                            if (d & ((e | 0) < 1)) {
                                b = c;
                                break;
                            }
                            x7(h, 5710, 1);
                            b = c;
                        } else {
                            if (b >>> 0 <= o >>> 0) break;
                            de(o | 0, 48, (b + k) | 0) | 0;
                            do b = (b + -1) | 0;
                            while (b >>> 0 > o >>> 0)
                        }
                        while (0)
                        t = (i - b) | 0;
                        x7(h, b, (e | 0) > (t | 0) ? t : e);
                        e = (e - t) | 0;
                        f = (f + 4) | 0;
                    }while ((f >>> 0 < v >>> 0) & ((e | 0) > -1))
                }
                yf(h, 48, (e + 18) | 0, 18, 0);
                x7(h, y, (w - y) | 0);
            }
            yf(h, 32, u, a, p ^ 8192);
        } else {
            o = ((x & 32) | 0) != 0;
            a = (z + 3) | 0;
            yf(h, 32, u, a, p & -65537);
            x7(h, A, z);
            x7(h, (g != g) | (0.0 != 0.0) ? o ? 5686 : 5690 : o ? 5678 : 5682, 3);
            yf(h, 32, u, a, p ^ 8192);
        }
        while (0)
        ed = B;
        return ((a | 0) < (u | 0) ? u : a) | 0;
    }
    function yi(a) {
        a = +a;
        var b = 0;
        d9[eb >> 3] = a;
        b = d4[eb >> 2] | 0;
        es = d4[(eb + 4) >> 2] | 0;
        return b | 0;
    }
    function yj(a, b) {
        a = +a;
        b = b | 0;
        return +(+yk(a, b));
    }
    function yk(a, b) {
        a = +a;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        d9[eb >> 3] = a;
        c = d4[eb >> 2] | 0;
        d = d4[(eb + 4) >> 2] | 0;
        e = dg(c | 0, d | 0, 52) | 0;
        switch(e & 2047){
            case 0:
                {
                    if (a != 0.0) {
                        a = +yk(a * 18446744073709551616.0, b);
                        c = ((d4[b >> 2] | 0) + -64) | 0;
                    } else c = 0;
                    d4[b >> 2] = c;
                    break;
                }
            case 2047:
                break;
            default:
                {
                    d4[b >> 2] = (e & 2047) + -1022;
                    d4[eb >> 2] = c;
                    d4[(eb + 4) >> 2] = (d & -2146435073) | 1071644672;
                    a = +d9[eb >> 3];
                }
        }
        return +a;
    }
    function yl(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        do if (a) {
            if (b >>> 0 < 128) {
                d2[a >> 0] = b;
                a = 1;
                break;
            }
            if (!(d4[d4[((ym() | 0) + 188) >> 2] >> 2] | 0)) if (((b & -128) | 0) == 57216) {
                d2[a >> 0] = b;
                a = 1;
                break;
            } else {
                d4[(xZ() | 0) >> 2] = 84;
                a = -1;
                break;
            }
            if (b >>> 0 < 2048) {
                d2[a >> 0] = (b >>> 6) | 192;
                d2[(a + 1) >> 0] = (b & 63) | 128;
                a = 2;
                break;
            }
            if ((b >>> 0 < 55296) | (((b & -8192) | 0) == 57344)) {
                d2[a >> 0] = (b >>> 12) | 224;
                d2[(a + 1) >> 0] = ((b >>> 6) & 63) | 128;
                d2[(a + 2) >> 0] = (b & 63) | 128;
                a = 3;
                break;
            }
            if (((b + -65536) | 0) >>> 0 < 1048576) {
                d2[a >> 0] = (b >>> 18) | 240;
                d2[(a + 1) >> 0] = ((b >>> 12) & 63) | 128;
                d2[(a + 2) >> 0] = ((b >>> 6) & 63) | 128;
                d2[(a + 3) >> 0] = (b & 63) | 128;
                a = 4;
                break;
            } else {
                d4[(xZ() | 0) >> 2] = 84;
                a = -1;
                break;
            }
        } else a = 1;
        while (0)
        return a | 0;
    }
    function ym() {
        return x_() | 0;
    }
    function yn() {
        return x_() | 0;
    }
    function yo(a, d) {
        a = a | 0;
        d = d | 0;
        var b = 0, c = 0;
        c = 0;
        while(1){
            if ((d5[(5712 + c) >> 0] | 0) == (a | 0)) {
                a = 2;
                break;
            }
            b = (c + 1) | 0;
            if ((b | 0) == 87) {
                b = 5800;
                c = 87;
                a = 5;
                break;
            } else c = b;
        }
        if ((a | 0) == 2) if (!c) b = 5800;
        else {
            b = 5800;
            a = 5;
        }
        if ((a | 0) == 5) while(1){
            do {
                a = b;
                b = (b + 1) | 0;
            }while ((d2[a >> 0] | 0) != 0)
            c = (c + -1) | 0;
            if (!c) break;
            else a = 5;
        }
        return yp(b, d4[(d + 20) >> 2] | 0) | 0;
    }
    function yp(a, b) {
        a = a | 0;
        b = b | 0;
        return yq(a, b) | 0;
    }
    function yq(b, a) {
        b = b | 0;
        a = a | 0;
        if (!a) a = 0;
        else a = yr(d4[a >> 2] | 0, d4[(a + 4) >> 2] | 0, b) | 0;
        return (a | 0 ? a : b) | 0;
    }
    function yr(c, d, j) {
        c = c | 0;
        d = d | 0;
        j = j | 0;
        var a = 0, b = 0, f = 0, k = 0, h = 0, l = 0, i = 0, m = 0, g = 0, e = 0;
        e = ((d4[c >> 2] | 0) + 1794895138) | 0;
        f = ys(d4[(c + 8) >> 2] | 0, e) | 0;
        a = ys(d4[(c + 12) >> 2] | 0, e) | 0;
        b = ys(d4[(c + 16) >> 2] | 0, e) | 0;
        a: do if ((f >>> 0 < (d >>> 2) >>> 0 ? ((g = (d - (f << 2)) | 0), (a >>> 0 < g >>> 0) & (b >>> 0 < g >>> 0)) : 0) ? (((b | a) & 3) | 0) == 0 : 0) {
            g = a >>> 2;
            m = b >>> 2;
            i = 0;
            while(1){
                h = f >>> 1;
                l = (i + h) | 0;
                k = l << 1;
                b = (k + g) | 0;
                a = ys(d4[(c + (b << 2)) >> 2] | 0, e) | 0;
                b = ys(d4[(c + ((b + 1) << 2)) >> 2] | 0, e) | 0;
                if (!((b >>> 0 < d >>> 0) & (a >>> 0 < ((d - b) | 0) >>> 0))) {
                    a = 0;
                    break a;
                }
                if (d2[(c + (b + a)) >> 0] | 0) {
                    a = 0;
                    break a;
                }
                a = x1(j, (c + b) | 0) | 0;
                if (!a) break;
                a = (a | 0) < 0;
                if ((f | 0) == 1) {
                    a = 0;
                    break a;
                } else {
                    i = a ? i : l;
                    f = a ? h : (f - h) | 0;
                }
            }
            a = (k + m) | 0;
            b = ys(d4[(c + (a << 2)) >> 2] | 0, e) | 0;
            a = ys(d4[(c + ((a + 1) << 2)) >> 2] | 0, e) | 0;
            if ((a >>> 0 < d >>> 0) & (b >>> 0 < ((d - a) | 0) >>> 0)) a = (d2[(c + (a + b)) >> 0] | 0) == 0 ? (c + a) | 0 : 0;
            else a = 0;
        } else a = 0;
        while (0)
        return a | 0;
    }
    function ys(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = dm(a | 0) | 0;
        return ((b | 0) == 0 ? a : c) | 0;
    }
    function yt(f, d, e) {
        f = f | 0;
        d = d | 0;
        e = e | 0;
        var a = 0, c = 0, g = 0, b = 0, h = 0;
        a = (e + 16) | 0;
        c = d4[a >> 2] | 0;
        if (!c) {
            if (!(yu(e) | 0)) {
                c = d4[a >> 2] | 0;
                g = 5;
            } else a = 0;
        } else g = 5;
        a: do if ((g | 0) == 5) {
            h = (e + 20) | 0;
            b = d4[h >> 2] | 0;
            a = b;
            if (((c - b) | 0) >>> 0 < d >>> 0) {
                a = yX[d4[(e + 36) >> 2] & 7](e, f, d) | 0;
                break;
            }
            b: do if ((d2[(e + 75) >> 0] | 0) > -1) {
                b = d;
                while(1){
                    if (!b) {
                        g = 0;
                        c = f;
                        break b;
                    }
                    c = (b + -1) | 0;
                    if ((d2[(f + c) >> 0] | 0) == 10) break;
                    else b = c;
                }
                a = yX[d4[(e + 36) >> 2] & 7](e, f, b) | 0;
                if (a >>> 0 < b >>> 0) break a;
                g = b;
                c = (f + b) | 0;
                d = (d - b) | 0;
                a = d4[h >> 2] | 0;
            } else {
                g = 0;
                c = f;
            }
            while (0)
            dh(a | 0, c | 0, d | 0) | 0;
            d4[h >> 2] = (d4[h >> 2] | 0) + d;
            a = (g + d) | 0;
        }
        while (0)
        return a | 0;
    }
    function yu(a) {
        a = a | 0;
        var c = 0, b = 0;
        c = (a + 74) | 0;
        b = d2[c >> 0] | 0;
        d2[c >> 0] = (b + 255) | b;
        c = d4[a >> 2] | 0;
        if (!(c & 8)) {
            d4[(a + 8) >> 2] = 0;
            d4[(a + 4) >> 2] = 0;
            b = d4[(a + 44) >> 2] | 0;
            d4[(a + 28) >> 2] = b;
            d4[(a + 20) >> 2] = b;
            d4[(a + 16) >> 2] = b + (d4[(a + 48) >> 2] | 0);
            a = 0;
        } else {
            d4[a >> 2] = c | 32;
            a = -1;
        }
        return a | 0;
    }
    function yv(a, b) {
        a = n(a);
        b = n(b);
        var c = 0, d = 0;
        c = yw(a) | 0;
        do if ((c & 2147483647) >>> 0 <= 2139095040) {
            d = yw(b) | 0;
            if ((d & 2147483647) >>> 0 <= 2139095040) if (((d ^ c) | 0) < 0) {
                a = (c | 0) < 0 ? b : a;
                break;
            } else {
                a = a < b ? b : a;
                break;
            }
        } else a = b;
        while (0)
        return n(a);
    }
    function yw(a) {
        a = n(a);
        return ((d8[eb >> 2] = a), d4[eb >> 2] | 0) | 0;
    }
    function yx(a, b) {
        a = n(a);
        b = n(b);
        var c = 0, d = 0;
        c = yy(a) | 0;
        do if ((c & 2147483647) >>> 0 <= 2139095040) {
            d = yy(b) | 0;
            if ((d & 2147483647) >>> 0 <= 2139095040) if (((d ^ c) | 0) < 0) {
                a = (c | 0) < 0 ? a : b;
                break;
            } else {
                a = a < b ? a : b;
                break;
            }
        } else a = b;
        while (0)
        return n(a);
    }
    function yy(a) {
        a = n(a);
        return ((d8[eb >> 2] = a), d4[eb >> 2] | 0) | 0;
    }
    function yz(g, e) {
        g = n(g);
        e = n(e);
        var a = 0, b = 0, c = 0, d = 0, h = 0, f = 0, i = 0, j = 0;
        d = ((d8[eb >> 2] = g), d4[eb >> 2] | 0);
        f = ((d8[eb >> 2] = e), d4[eb >> 2] | 0);
        a = (d >>> 23) & 255;
        h = (f >>> 23) & 255;
        i = d & -2147483648;
        c = f << 1;
        a: do if ((c | 0) != 0 ? !(((a | 0) == 255) | (((yA(e) | 0) & 2147483647) >>> 0 > 2139095040)) : 0) {
            b = d << 1;
            if (b >>> 0 <= c >>> 0) {
                e = n(g * n(0.0));
                return n((b | 0) == (c | 0) ? e : g);
            }
            if (!a) {
                a = d << 9;
                if ((a | 0) > -1) {
                    b = a;
                    a = 0;
                    do {
                        a = (a + -1) | 0;
                        b = b << 1;
                    }while ((b | 0) > -1)
                } else a = 0;
                b = d << (1 - a);
            } else b = (d & 8388607) | 8388608;
            if (!h) {
                d = f << 9;
                if ((d | 0) > -1) {
                    c = 0;
                    do {
                        c = (c + -1) | 0;
                        d = d << 1;
                    }while ((d | 0) > -1)
                } else c = 0;
                h = c;
                f = f << (1 - c);
            } else f = (f & 8388607) | 8388608;
            c = (b - f) | 0;
            d = (c | 0) > -1;
            b: do if ((a | 0) > (h | 0)) {
                while(1){
                    if (d) if (!c) break;
                    else b = c;
                    b = b << 1;
                    a = (a + -1) | 0;
                    c = (b - f) | 0;
                    d = (c | 0) > -1;
                    if ((a | 0) <= (h | 0)) break b;
                }
                e = n(g * n(0.0));
                break a;
            }
            while (0)
            if (d) if (!c) {
                e = n(g * n(0.0));
                break;
            } else b = c;
            if (b >>> 0 < 8388608) do {
                b = b << 1;
                a = (a + -1) | 0;
            }while (b >>> 0 < 8388608)
            if ((a | 0) > 0) a = (b + -8388608) | (a << 23);
            else a = b >>> ((1 - a) | 0);
            e = ((d4[eb >> 2] = a | i), n(d8[eb >> 2]));
        } else j = 3;
        while (0)
        if ((j | 0) == 3) {
            e = n(g * e);
            e = n(e / e);
        }
        return n(e);
    }
    function yA(a) {
        a = n(a);
        return ((d8[eb >> 2] = a), d4[eb >> 2] | 0) | 0;
    }
    function yB(a, b) {
        a = a | 0;
        b = b | 0;
        return x3(d4[582] | 0, a, b) | 0;
    }
    function yC(a) {
        a = a | 0;
        fA();
    }
    function c9(a) {
        a = a | 0;
        return;
    }
    function da(a, b) {
        a = a | 0;
        b = b | 0;
        return 0;
    }
    function yD(a) {
        a = a | 0;
        if ((yE((a + 4) | 0) | 0) == -1) {
            yS[d4[((d4[a >> 2] | 0) + 8) >> 2] & 127](a);
            a = 1;
        } else a = 0;
        return a | 0;
    }
    function yE(a) {
        a = a | 0;
        var b = 0;
        b = d4[a >> 2] | 0;
        d4[a >> 2] = b + -1;
        return (b + -1) | 0;
    }
    function yF(a) {
        a = a | 0;
        if (yD(a) | 0) yG(a);
        return;
    }
    function yG(a) {
        a = a | 0;
        var b = 0;
        b = (a + 8) | 0;
        if (!((d4[b >> 2] | 0) != 0 ? (yE(b) | 0) != -1 : 0)) yS[d4[((d4[a >> 2] | 0) + 16) >> 2] & 127](a);
        return;
    }
    function yH(a) {
        a = a | 0;
        var b = 0;
        b = (a | 0) == 0 ? 1 : a;
        while(1){
            a = c2(b) | 0;
            if (a | 0) break;
            a = yL() | 0;
            if (!a) {
                a = 0;
                break;
            }
            y8[a & 0]();
        }
        return a | 0;
    }
    function yI(a) {
        a = a | 0;
        return yH(a) | 0;
    }
    function yJ(a) {
        a = a | 0;
        c3(a);
        return;
    }
    function yK(a) {
        a = a | 0;
        if ((d2[(a + 11) >> 0] | 0) < 0) yJ(d4[a >> 2] | 0);
        return;
    }
    function yL() {
        var a = 0;
        a = d4[2923] | 0;
        d4[2923] = a + 0;
        return a | 0;
    }
    function db() {}
    function dc(b, d, c, a) {
        b = b | 0;
        d = d | 0;
        c = c | 0;
        a = a | 0;
        a = (d - a - ((c >>> 0 > b >>> 0) | 0)) >>> 0;
        return ((es = a), ((b - c) >>> 0) | 0) | 0;
    }
    function dd(b, c, a, d) {
        b = b | 0;
        c = c | 0;
        a = a | 0;
        d = d | 0;
        a = (b + a) >>> 0;
        return ((es = (c + d + ((a >>> 0 < b >>> 0) | 0)) >>> 0), a | 0) | 0;
    }
    function de(a, c, d) {
        a = a | 0;
        c = c | 0;
        d = d | 0;
        var f = 0, g = 0, e = 0, b = 0;
        e = (a + d) | 0;
        c = c & 255;
        if ((d | 0) >= 67) {
            while(a & 3){
                d2[a >> 0] = c;
                a = (a + 1) | 0;
            }
            f = (e & -4) | 0;
            g = (f - 64) | 0;
            b = c | (c << 8) | (c << 16) | (c << 24);
            while((a | 0) <= (g | 0)){
                d4[a >> 2] = b;
                d4[(a + 4) >> 2] = b;
                d4[(a + 8) >> 2] = b;
                d4[(a + 12) >> 2] = b;
                d4[(a + 16) >> 2] = b;
                d4[(a + 20) >> 2] = b;
                d4[(a + 24) >> 2] = b;
                d4[(a + 28) >> 2] = b;
                d4[(a + 32) >> 2] = b;
                d4[(a + 36) >> 2] = b;
                d4[(a + 40) >> 2] = b;
                d4[(a + 44) >> 2] = b;
                d4[(a + 48) >> 2] = b;
                d4[(a + 52) >> 2] = b;
                d4[(a + 56) >> 2] = b;
                d4[(a + 60) >> 2] = b;
                a = (a + 64) | 0;
            }
            while((a | 0) < (f | 0)){
                d4[a >> 2] = b;
                a = (a + 4) | 0;
            }
        }
        while((a | 0) < (e | 0)){
            d2[a >> 0] = c;
            a = (a + 1) | 0;
        }
        return (e - d) | 0;
    }
    function df(b, c, a) {
        b = b | 0;
        c = c | 0;
        a = a | 0;
        if ((a | 0) < 32) {
            es = (c << a) | ((b & (((1 << a) - 1) << (32 - a))) >>> (32 - a));
            return b << a;
        }
        es = b << (a - 32);
        return 0;
    }
    function dg(c, b, a) {
        c = c | 0;
        b = b | 0;
        a = a | 0;
        if ((a | 0) < 32) {
            es = b >>> a;
            return (c >>> a) | ((b & ((1 << a) - 1)) << (32 - a));
        }
        es = 0;
        return (b >>> (a - 32)) | 0;
    }
    function dh(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var f = 0, d = 0, e = 0;
        if ((c | 0) >= 8192) return fv(a | 0, b | 0, c | 0) | 0;
        e = a | 0;
        d = (a + c) | 0;
        if ((a & 3) == (b & 3)) {
            while(a & 3){
                if (!c) return e | 0;
                d2[a >> 0] = d2[b >> 0] | 0;
                a = (a + 1) | 0;
                b = (b + 1) | 0;
                c = (c - 1) | 0;
            }
            c = (d & -4) | 0;
            f = (c - 64) | 0;
            while((a | 0) <= (f | 0)){
                d4[a >> 2] = d4[b >> 2];
                d4[(a + 4) >> 2] = d4[(b + 4) >> 2];
                d4[(a + 8) >> 2] = d4[(b + 8) >> 2];
                d4[(a + 12) >> 2] = d4[(b + 12) >> 2];
                d4[(a + 16) >> 2] = d4[(b + 16) >> 2];
                d4[(a + 20) >> 2] = d4[(b + 20) >> 2];
                d4[(a + 24) >> 2] = d4[(b + 24) >> 2];
                d4[(a + 28) >> 2] = d4[(b + 28) >> 2];
                d4[(a + 32) >> 2] = d4[(b + 32) >> 2];
                d4[(a + 36) >> 2] = d4[(b + 36) >> 2];
                d4[(a + 40) >> 2] = d4[(b + 40) >> 2];
                d4[(a + 44) >> 2] = d4[(b + 44) >> 2];
                d4[(a + 48) >> 2] = d4[(b + 48) >> 2];
                d4[(a + 52) >> 2] = d4[(b + 52) >> 2];
                d4[(a + 56) >> 2] = d4[(b + 56) >> 2];
                d4[(a + 60) >> 2] = d4[(b + 60) >> 2];
                a = (a + 64) | 0;
                b = (b + 64) | 0;
            }
            while((a | 0) < (c | 0)){
                d4[a >> 2] = d4[b >> 2];
                a = (a + 4) | 0;
                b = (b + 4) | 0;
            }
        } else {
            c = (d - 4) | 0;
            while((a | 0) < (c | 0)){
                d2[a >> 0] = d2[b >> 0] | 0;
                d2[(a + 1) >> 0] = d2[(b + 1) >> 0] | 0;
                d2[(a + 2) >> 0] = d2[(b + 2) >> 0] | 0;
                d2[(a + 3) >> 0] = d2[(b + 3) >> 0] | 0;
                a = (a + 4) | 0;
                b = (b + 4) | 0;
            }
        }
        while((a | 0) < (d | 0)){
            d2[a >> 0] = d2[b >> 0] | 0;
            a = (a + 1) | 0;
            b = (b + 1) | 0;
        }
        return e | 0;
    }
    function yM(b) {
        b = b | 0;
        var a = 0;
        a = d2[(ef + (b & 255)) >> 0] | 0;
        if ((a | 0) < 8) return a | 0;
        a = d2[(ef + ((b >> 8) & 255)) >> 0] | 0;
        if ((a | 0) < 8) return (a + 8) | 0;
        a = d2[(ef + ((b >> 16) & 255)) >> 0] | 0;
        if ((a | 0) < 8) return (a + 16) | 0;
        return ((d2[(ef + (b >>> 24)) >> 0] | 0) + 24) | 0;
    }
    function yN(l, f, o, n, a) {
        l = l | 0;
        f = f | 0;
        o = o | 0;
        n = n | 0;
        a = a | 0;
        var c = 0, h = 0, b = 0, j = 0, e = 0, i = 0, m = 0, k = 0, g = 0, d = 0;
        i = l;
        j = f;
        e = j;
        h = o;
        k = n;
        b = k;
        if (!e) {
            c = (a | 0) != 0;
            if (!b) {
                if (c) {
                    d4[a >> 2] = (i >>> 0) % (h >>> 0);
                    d4[(a + 4) >> 2] = 0;
                }
                k = 0;
                a = ((i >>> 0) / (h >>> 0)) >>> 0;
                return ((es = k), a) | 0;
            } else {
                if (!c) {
                    k = 0;
                    a = 0;
                    return ((es = k), a) | 0;
                }
                d4[a >> 2] = l | 0;
                d4[(a + 4) >> 2] = f & 0;
                k = 0;
                a = 0;
                return ((es = k), a) | 0;
            }
        }
        c = (b | 0) == 0;
        do if (h) {
            if (!c) {
                c = ((eK(b | 0) | 0) - (eK(e | 0) | 0)) | 0;
                if (c >>> 0 <= 31) {
                    m = (c + 1) | 0;
                    b = (31 - c) | 0;
                    f = (c - 31) >> 31;
                    h = m;
                    l = ((i >>> (m >>> 0)) & f) | (e << b);
                    f = (e >>> (m >>> 0)) & f;
                    c = 0;
                    b = i << b;
                    break;
                }
                if (!a) {
                    k = 0;
                    a = 0;
                    return ((es = k), a) | 0;
                }
                d4[a >> 2] = l | 0;
                d4[(a + 4) >> 2] = j | (f & 0);
                k = 0;
                a = 0;
                return ((es = k), a) | 0;
            }
            c = (h - 1) | 0;
            if ((c & h) | 0) {
                b = ((eK(h | 0) | 0) + 33 - (eK(e | 0) | 0)) | 0;
                d = (64 - b) | 0;
                m = (32 - b) | 0;
                j = m >> 31;
                g = (b - 32) | 0;
                f = g >> 31;
                h = b;
                l = (((m - 1) >> 31) & (e >>> (g >>> 0))) | (((e << m) | (i >>> (b >>> 0))) & f);
                f = f & (e >>> (b >>> 0));
                c = (i << d) & j;
                b = (((e << d) | (i >>> (g >>> 0))) & j) | ((i << m) & ((b - 33) >> 31));
                break;
            }
            if (a | 0) {
                d4[a >> 2] = c & i;
                d4[(a + 4) >> 2] = 0;
            }
            if ((h | 0) == 1) {
                g = j | (f & 0);
                d = l | 0 | 0;
                return ((es = g), d) | 0;
            } else {
                d = yM(h | 0) | 0;
                g = (e >>> (d >>> 0)) | 0;
                d = (e << (32 - d)) | (i >>> (d >>> 0)) | 0;
                return ((es = g), d) | 0;
            }
        } else {
            if (c) {
                if (a | 0) {
                    d4[a >> 2] = (e >>> 0) % (h >>> 0);
                    d4[(a + 4) >> 2] = 0;
                }
                g = 0;
                d = ((e >>> 0) / (h >>> 0)) >>> 0;
                return ((es = g), d) | 0;
            }
            if (!i) {
                if (a | 0) {
                    d4[a >> 2] = 0;
                    d4[(a + 4) >> 2] = (e >>> 0) % (b >>> 0);
                }
                g = 0;
                d = ((e >>> 0) / (b >>> 0)) >>> 0;
                return ((es = g), d) | 0;
            }
            c = (b - 1) | 0;
            if (!(c & b)) {
                if (a | 0) {
                    d4[a >> 2] = l | 0;
                    d4[(a + 4) >> 2] = (c & e) | (f & 0);
                }
                g = 0;
                d = e >>> ((yM(b | 0) | 0) >>> 0);
                return ((es = g), d) | 0;
            }
            c = ((eK(b | 0) | 0) - (eK(e | 0) | 0)) | 0;
            if (c >>> 0 <= 30) {
                f = (c + 1) | 0;
                b = (31 - c) | 0;
                h = f;
                l = (e << b) | (i >>> (f >>> 0));
                f = e >>> (f >>> 0);
                c = 0;
                b = i << b;
                break;
            }
            if (!a) {
                g = 0;
                d = 0;
                return ((es = g), d) | 0;
            }
            d4[a >> 2] = l | 0;
            d4[(a + 4) >> 2] = j | (f & 0);
            g = 0;
            d = 0;
            return ((es = g), d) | 0;
        }
        while (0)
        if (!h) {
            e = b;
            j = 0;
            b = 0;
        } else {
            m = o | 0 | 0;
            i = k | (n & 0);
            e = dd(m | 0, i | 0, -1, -1) | 0;
            o = es;
            j = b;
            b = 0;
            do {
                n = j;
                j = (c >>> 31) | (j << 1);
                c = b | (c << 1);
                n = (l << 1) | (n >>> 31) | 0;
                k = (l >>> 31) | (f << 1) | 0;
                dc(e | 0, o | 0, n | 0, k | 0) | 0;
                d = es;
                g = (d >> 31) | (((d | 0) < 0 ? -1 : 0) << 1);
                b = g & 1;
                l = dc(n | 0, k | 0, (g & m) | 0, (((((d | 0) < 0 ? -1 : 0) >> 31) | (((d | 0) < 0 ? -1 : 0) << 1)) & i) | 0) | 0;
                f = es;
                h = (h - 1) | 0;
            }while ((h | 0) != 0)
            e = j;
            j = 0;
        }
        h = 0;
        if (a | 0) {
            d4[a >> 2] = l;
            d4[(a + 4) >> 2] = f;
        }
        g = ((c | 0) >>> 31) | ((e | h) << 1) | (((h << 1) | (c >>> 31)) & 0) | j;
        d = (((c << 1) | (0 >>> 31)) & -2) | b;
        return ((es = g), d) | 0;
    }
    function di(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        return yN(a, b, c, d, 0) | 0;
    }
    function dj(a) {
        a = a | 0;
        var b = 0, c = 0;
        c = ((a + 15) & -16) | 0;
        b = d4[ea >> 2] | 0;
        a = (b + c) | 0;
        if ((((c | 0) > 0) & ((a | 0) < (b | 0))) | ((a | 0) < 0)) {
            eP() | 0;
            fx(12);
            return -1;
        }
        d4[ea >> 2] = a;
        if ((a | 0) > (eO() | 0) ? (eN() | 0) == 0 : 0) {
            d4[ea >> 2] = b;
            fx(12);
            return -1;
        }
        return b | 0;
    }
    function dk(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        if (((b | 0) < (a | 0)) & ((a | 0) < ((b + c) | 0))) {
            d = a;
            b = (b + c) | 0;
            a = (a + c) | 0;
            while((c | 0) > 0){
                a = (a - 1) | 0;
                b = (b - 1) | 0;
                c = (c - 1) | 0;
                d2[a >> 0] = d2[b >> 0] | 0;
            }
            a = d;
        } else dh(a, b, c) | 0;
        return a | 0;
    }
    function dl(b, c, d, e) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        var a = 0, f = 0;
        f = ed;
        ed = (ed + 16) | 0;
        a = f | 0;
        yN(b, c, d, e, a) | 0;
        ed = f;
        return ((es = d4[(a + 4) >> 2] | 0), d4[a >> 2] | 0) | 0;
    }
    function dm(a) {
        a = a | 0;
        return (((a & 255) << 24) | (((a >> 8) & 255) << 16) | (((a >> 16) & 255) << 8) | (a >>> 24) | 0);
    }
    function dn(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        yO[a & 1](b | 0, c | 0, d | 0, e | 0, f | 0);
    }
    function dp(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        yP[a & 1](b | 0, n(c));
    }
    function dq(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        yQ[a & 31](b | 0, +c);
    }
    function dr(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        d = n(d);
        return n(yR[a & 0](b | 0, n(c), n(d)));
    }
    function ds(a, b) {
        a = a | 0;
        b = b | 0;
        yS[a & 127](b | 0);
    }
    function dt(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        yT[a & 31](b | 0, c | 0);
    }
    function du(a, b) {
        a = a | 0;
        b = b | 0;
        return yU[a & 31](b | 0) | 0;
    }
    function dv(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        e = e | 0;
        yV[a & 1](b | 0, +c, +d, e | 0);
    }
    function dw(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        yW[a & 1](b | 0, +c, +d);
    }
    function dx(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        return yX[a & 7](b | 0, c | 0, d | 0) | 0;
    }
    function dy(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        return +yY[a & 1](b | 0, c | 0, d | 0);
    }
    function dz(a, b) {
        a = a | 0;
        b = b | 0;
        return +yZ[a & 15](b | 0);
    }
    function dA(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        return y$[a & 1](b | 0, +c) | 0;
    }
    function dB(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        return y_[a & 15](b | 0, c | 0) | 0;
    }
    function dC(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        e = +e;
        f = f | 0;
        y0[a & 1](b | 0, c | 0, +d, +e, f | 0);
    }
    function dD(a, b, c, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        y1[a & 1](b | 0, c | 0, d | 0, e | 0, f | 0, g | 0);
    }
    function dE(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        return +y2[a & 7](b | 0, c | 0);
    }
    function dF(a) {
        a = a | 0;
        return y3[a & 7]() | 0;
    }
    function dG(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        return y4[a & 1](b | 0, c | 0, d | 0, e | 0, f | 0) | 0;
    }
    function dH(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = +e;
        y5[a & 1](b | 0, c | 0, d | 0, +e);
    }
    function dI(a, b, c, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = n(d);
        e = e | 0;
        f = n(f);
        g = g | 0;
        y6[a & 1](b | 0, c | 0, n(d), e | 0, n(f), g | 0);
    }
    function dJ(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        y7[a & 15](b | 0, c | 0, d | 0);
    }
    function dK(a) {
        a = a | 0;
        y8[a & 0]();
    }
    function dL(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        y9[a & 15](b | 0, c | 0, +d);
    }
    function dM(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        return za[a & 1](+b, +c) | 0;
    }
    function dN(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        zb[a & 15](b | 0, c | 0, d | 0, e | 0);
    }
    function dO(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        eL(0);
    }
    function dP(a, b) {
        a = a | 0;
        b = n(b);
        eL(1);
    }
    function d(a, b) {
        a = a | 0;
        b = +b;
        eL(2);
    }
    function dQ(a, b, c) {
        a = a | 0;
        b = n(b);
        c = n(c);
        eL(3);
        return fR;
    }
    function b(a) {
        a = a | 0;
        eL(4);
    }
    function j(a, b) {
        a = a | 0;
        b = b | 0;
        eL(5);
    }
    function e(a) {
        a = a | 0;
        eL(6);
        return 0;
    }
    function dR(a, b, c, d) {
        a = a | 0;
        b = +b;
        c = +c;
        d = d | 0;
        eL(7);
    }
    function dS(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        eL(8);
    }
    function dT(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        eL(9);
        return 0;
    }
    function dU(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        eL(10);
        return 0.0;
    }
    function g(a) {
        a = a | 0;
        eL(11);
        return 0.0;
    }
    function dV(a, b) {
        a = a | 0;
        b = +b;
        eL(12);
        return 0;
    }
    function k(a, b) {
        a = a | 0;
        b = b | 0;
        eL(13);
        return 0;
    }
    function dW(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        e = e | 0;
        eL(14);
    }
    function dX(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        eL(15);
    }
    function m(a, b) {
        a = a | 0;
        b = b | 0;
        eL(16);
        return 0.0;
    }
    function dY() {
        eL(17);
        return 0;
    }
    function dZ(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        eL(18);
        return 0;
    }
    function d$(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        eL(19);
    }
    function d_(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = n(c);
        d = d | 0;
        e = n(e);
        f = f | 0;
        eL(20);
    }
    function l(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        eL(21);
    }
    function d0() {
        eL(22);
    }
    function h(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        eL(23);
    }
    function d1(a, b) {
        a = +a;
        b = +b;
        eL(24);
        return 0;
    }
    function i(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        eL(25);
    }
    var yO = [
        dO,
        cD
    ];
    var yP = [
        dP,
        B
    ];
    var yQ = [
        d,
        W,
        X,
        Y,
        Z,
        $,
        _,
        aa,
        ac,
        ad,
        af,
        ag,
        ah,
        ai,
        aj,
        ak,
        al,
        am,
        an,
        d,
        d,
        d,
        d,
        d,
        d,
        d,
        d,
        d,
        d,
        d,
        d,
        d, 
    ];
    var yR = [
        dQ
    ];
    var yS = [
        b,
        c9,
        bb,
        bc,
        bd,
        bC,
        bD,
        bE,
        cn,
        co,
        cp,
        cA,
        cB,
        cC,
        cZ,
        c$,
        c_,
        v,
        F,
        G,
        ab,
        ae,
        aV,
        aW,
        a9,
        be,
        bg,
        bi,
        bk,
        bm,
        bo,
        bq,
        bs,
        bu,
        bw,
        by,
        bA,
        bF,
        bH,
        bJ,
        bL,
        bN,
        bP,
        bR,
        bT,
        bV,
        bX,
        z,
        b$,
        b0,
        b2,
        b4,
        b6,
        b9,
        cc,
        cd,
        cg,
        ch,
        ck,
        cq,
        cr,
        cu,
        cx,
        bf,
        cG,
        cM,
        cO,
        cQ,
        cS,
        cU,
        cW,
        cX,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b,
        b, 
    ];
    var yT = [
        j,
        H,
        I,
        L,
        M,
        N,
        O,
        P,
        Q,
        T,
        U,
        V,
        aC,
        aF,
        aG,
        aH,
        aI,
        aJ,
        aK,
        aP,
        aT,
        a3,
        bS,
        bU,
        b5,
        cH,
        cz,
        cL,
        j,
        j,
        j,
        j, 
    ];
    var yU = [
        e,
        c5,
        E,
        ar,
        at,
        au,
        av,
        aw,
        ax,
        ay,
        aA,
        aB,
        aQ,
        aR,
        aX,
        bY,
        b7,
        cv,
        cI,
        cJ,
        e,
        e,
        e,
        e,
        e,
        e,
        e,
        e,
        e,
        e,
        e,
        e, 
    ];
    var yV = [
        dR,
        aY
    ];
    var yW = [
        dS,
        cl
    ];
    var yX = [
        dT,
        c6,
        c7,
        c8,
        bn,
        bG,
        b_,
        cR
    ];
    var yY = [
        dU,
        bx
    ];
    var yZ = [
        g,
        aD,
        aE,
        aL,
        aZ,
        a$,
        a_,
        a0,
        a1,
        a2,
        g,
        g,
        g,
        g,
        g,
        g
    ];
    var y$ = [
        dV,
        cb
    ];
    var y_ = [
        k,
        da,
        aS,
        ba,
        bj,
        bp,
        br,
        bB,
        bI,
        bW,
        C,
        cP,
        k,
        k,
        k,
        k
    ];
    var y0 = [
        dW,
        bh
    ];
    var y1 = [
        dX,
        cT
    ];
    var y2 = [
        m,
        aM,
        a4,
        a5,
        a6,
        bz,
        m,
        m
    ];
    var y3 = [
        dY,
        a7,
        D,
        y,
        ce,
        ci,
        cs,
        cY
    ];
    var y4 = [
        dZ,
        w
    ];
    var y5 = [
        d$,
        bM
    ];
    var y6 = [
        d_,
        aU
    ];
    var y7 = [
        l,
        as,
        az,
        aN,
        aO,
        bl,
        bt,
        bO,
        bQ,
        A,
        cE,
        cN,
        cV,
        l,
        l,
        l
    ];
    var y8 = [
        d0
    ];
    var y9 = [
        h,
        J,
        K,
        R,
        S,
        ao,
        ap,
        aq,
        bK,
        b1,
        ca,
        h,
        h,
        h,
        h,
        h
    ];
    var za = [
        d1,
        cm
    ];
    var zb = [
        i,
        bv,
        bZ,
        b3,
        b8,
        cf,
        cj,
        ct,
        cy,
        cK,
        c0,
        i,
        i,
        i,
        i,
        i
    ];
    return {
        _llvm_bswap_i32: dm,
        dynCall_idd: dM,
        dynCall_i: dF,
        _i64Subtract: dc,
        ___udivdi3: di,
        dynCall_vif: dp,
        setThrew: s,
        dynCall_viii: dJ,
        _bitshift64Lshr: dg,
        _bitshift64Shl: df,
        dynCall_vi: ds,
        dynCall_viiddi: dC,
        dynCall_diii: dy,
        dynCall_iii: dB,
        _memset: de,
        _sbrk: dj,
        _memcpy: dh,
        __GLOBAL__sub_I_Yoga_cpp: x,
        dynCall_vii: dt,
        ___uremdi3: dl,
        dynCall_vid: dq,
        stackAlloc: o,
        _nbind_init: c1,
        getTempRet0: u,
        dynCall_di: dz,
        dynCall_iid: dA,
        setTempRet0: t,
        _i64Add: dd,
        dynCall_fiff: dr,
        dynCall_iiii: dx,
        _emscripten_get_global_libc: c4,
        dynCall_viid: dL,
        dynCall_viiid: dH,
        dynCall_viififi: dI,
        dynCall_ii: du,
        __GLOBAL__sub_I_Binding_cc: cF,
        dynCall_viiii: dN,
        dynCall_iiiiii: dG,
        stackSave: p,
        dynCall_viiiii: dn,
        __GLOBAL__sub_I_nbind_cc: a8,
        dynCall_vidd: dw,
        _free: c3,
        runPostSets: db,
        dynCall_viiiiii: dD,
        establishStackSpace: r,
        _memmove: dk,
        stackRestore: q,
        _malloc: c2,
        __GLOBAL__sub_I_common_cc: cw,
        dynCall_viddi: dv,
        dynCall_dii: dE,
        dynCall_v: dK
    };
}
