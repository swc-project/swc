export function foo(a, b, c) {
    "use asm";
    var d = new a.Int8Array(c);
    var e = new a.Int16Array(c);
    var f = new a.Int32Array(c);
    var g = new a.Uint8Array(c);
    var h = new a.Uint16Array(c);
    var i = new a.Uint32Array(c);
    var j = new a.Float32Array(c);
    var k = new a.Float64Array(c);
    var l = b.DYNAMICTOP_PTR | 0;
    var m = b.tempDoublePtr | 0;
    var n = b.ABORT | 0;
    var o = b.STACKTOP | 0;
    var p = b.STACK_MAX | 0;
    var q = b.cttz_i8 | 0;
    var r = b.___dso_handle | 0;
    var s = 0;
    var t = 0;
    var u = 0;
    var v = 0;
    var w = a.NaN, x = a.Infinity;
    var y = 0, z = 0, A = 0, B = 0, C = 0.0;
    var D = 0;
    var E = a.Math.floor;
    var F = a.Math.abs;
    var G = a.Math.sqrt;
    var H = a.Math.pow;
    var I = a.Math.cos;
    var J = a.Math.sin;
    var K = a.Math.tan;
    var L = a.Math.acos;
    var M = a.Math.asin;
    var N = a.Math.atan;
    var O = a.Math.atan2;
    var P = a.Math.exp;
    var Q = a.Math.log;
    var R = a.Math.ceil;
    var S = a.Math.imul;
    var T = a.Math.min;
    var U = a.Math.max;
    var V = a.Math.clz32;
    var W = a.Math.fround;
    var X = b.abort;
    var Y = b.assert;
    var Z = b.enlargeMemory;
    var $ = b.getTotalMemory;
    var _ = b.abortOnCannotGrowMemory;
    var aa = b.invoke_viiiii;
    var ab = b.invoke_vif;
    var ac = b.invoke_vid;
    var ad = b.invoke_fiff;
    var ae = b.invoke_vi;
    var af = b.invoke_vii;
    var ag = b.invoke_ii;
    var ah = b.invoke_viddi;
    var ai = b.invoke_vidd;
    var aj = b.invoke_iiii;
    var ak = b.invoke_diii;
    var al = b.invoke_di;
    var am = b.invoke_iid;
    var an = b.invoke_iii;
    var ao = b.invoke_viiddi;
    var ap = b.invoke_viiiiii;
    var aq = b.invoke_dii;
    var ar = b.invoke_i;
    var as = b.invoke_iiiiii;
    var at = b.invoke_viiid;
    var au = b.invoke_viififi;
    var av = b.invoke_viii;
    var aw = b.invoke_v;
    var ax = b.invoke_viid;
    var ay = b.invoke_idd;
    var az = b.invoke_viiii;
    var aA = b._emscripten_asm_const_iiiii;
    var aB = b._emscripten_asm_const_iiidddddd;
    var aC = b._emscripten_asm_const_iiiid;
    var aD = b.__nbind_reference_external;
    var aE = b._emscripten_asm_const_iiiiiiii;
    var aF = b._removeAccessorPrefix;
    var aG = b._typeModule;
    var aH = b.__nbind_register_pool;
    var aI = b.__decorate;
    var aJ = b._llvm_stackrestore;
    var aK = b.___cxa_atexit;
    var aL = b.__extends;
    var aM = b.__nbind_get_value_object;
    var aN = b.__ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj;
    var aO = b._emscripten_set_main_loop_timing;
    var aP = b.__nbind_register_primitive;
    var aQ = b.__nbind_register_type;
    var aR = b._emscripten_memcpy_big;
    var aS = b.__nbind_register_function;
    var aT = b.___setErrNo;
    var aU = b.__nbind_register_class;
    var aV = b.__nbind_finish;
    var aW = b._abort;
    var aX = b._nbind_value;
    var aY = b._llvm_stacksave;
    var aZ = b.___syscall54;
    var a$ = b._defineHidden;
    var a_ = b._emscripten_set_main_loop;
    var a0 = b._emscripten_get_now;
    var a1 = b.__nbind_register_callback_signature;
    var a2 = b._emscripten_asm_const_iiiiii;
    var a3 = b.__nbind_free_external;
    var a4 = b._emscripten_asm_const_iiii;
    var a5 = b._emscripten_asm_const_iiididi;
    var a6 = b.___syscall6;
    var a7 = b._atexit;
    var a8 = b.___syscall140;
    var a9 = b.___syscall146;
    var ba = W(0);
    const bb = W(0);
    function bc(a) {
        a = a | 0;
        var b = 0;
        b = o;
        o = (o + a) | 0;
        o = (o + 15) & -16;
        return b | 0;
    }
    function bd() {
        return o | 0;
    }
    function be(a) {
        a = a | 0;
        o = a;
    }
    function bf(a, b) {
        a = a | 0;
        b = b | 0;
        o = a;
        p = b;
    }
    function bg(a, b) {
        a = a | 0;
        b = b | 0;
        if (!s) {
            s = a;
            t = b;
        }
    }
    function bh(a) {
        a = a | 0;
        D = a;
    }
    function bi() {
        return D | 0;
    }
    function bj() {
        var a = 0, b = 0;
        xS(8104, 8, 400) | 0;
        xS(8504, 408, 540) | 0;
        a = 9044;
        b = (a + 44) | 0;
        do {
            f[a >> 2] = 0;
            a = (a + 4) | 0;
        }while ((a | 0) < (b | 0))
        d[9088] = 0;
        d[9089] = 1;
        f[2273] = 0;
        f[2274] = 948;
        f[2275] = 948;
        aK(17, 8104, r | 0) | 0;
        return;
    }
    function bk(a) {
        a = a | 0;
        bJ((a + 948) | 0);
        return;
    }
    function bl(a) {
        a = W(a);
        return (((d2(a) | 0) & 2147483647) >>> 0 > 2139095040) | 0;
    }
    function bm(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        a: do if (!(f[(a + (b << 3) + 4) >> 2] | 0)) {
            if ((b | 2 | 0) == 3 ? f[(a + 60) >> 2] | 0 : 0) {
                a = (a + 56) | 0;
                break;
            }
            switch(b | 0){
                case 0:
                case 2:
                case 4:
                case 5:
                    {
                        if (f[(a + 52) >> 2] | 0) {
                            a = (a + 48) | 0;
                            break a;
                        }
                        break;
                    }
                default:
                    {}
            }
            if (!(f[(a + 68) >> 2] | 0)) {
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
    function bn(a) {
        a = a | 0;
        var b = 0;
        b = wP(1e3) | 0;
        bo(a, (b | 0) != 0, 2456);
        f[2276] = (f[2276] | 0) + 1;
        xS(b | 0, 8104, 1e3) | 0;
        if (d[(a + 2) >> 0] | 0) {
            f[(b + 4) >> 2] = 2;
            f[(b + 12) >> 2] = 4;
        }
        f[(b + 976) >> 2] = a;
        return b | 0;
    }
    function bo(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        e = o;
        o = (o + 16) | 0;
        d = e;
        if (!b) {
            f[d >> 2] = c;
            dg(a, 5, 3197, d);
        }
        o = e;
        return;
    }
    function bp() {
        return bn(956) | 0;
    }
    function bq(a) {
        a = a | 0;
        var b = 0;
        b = xH(1e3) | 0;
        br(b, a);
        bo(f[(a + 976) >> 2] | 0, 1, 2456);
        f[2276] = (f[2276] | 0) + 1;
        f[(b + 944) >> 2] = 0;
        return b | 0;
    }
    function br(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        xS(a | 0, b | 0, 948) | 0;
        dj((a + 948) | 0, (b + 948) | 0);
        c = (a + 960) | 0;
        a = (b + 960) | 0;
        b = (c + 40) | 0;
        do {
            f[c >> 2] = f[a >> 2];
            c = (c + 4) | 0;
            a = (a + 4) | 0;
        }while ((c | 0) < (b | 0))
        return;
    }
    function bs(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0;
        b = (a + 944) | 0;
        c = f[b >> 2] | 0;
        if (c | 0) {
            bt((c + 948) | 0, a) | 0;
            f[b >> 2] = 0;
        }
        c = bu(a) | 0;
        if (c | 0) {
            b = 0;
            do {
                f[((bv(a, b) | 0) + 944) >> 2] = 0;
                b = (b + 1) | 0;
            }while ((b | 0) != (c | 0))
        }
        c = (a + 948) | 0;
        d = f[c >> 2] | 0;
        e = (a + 952) | 0;
        b = f[e >> 2] | 0;
        if ((b | 0) != (d | 0)) f[e >> 2] = b + (~(((b + -4 - d) | 0) >>> 2) << 2);
        bw(c);
        wQ(a);
        f[2276] = (f[2276] | 0) + -1;
        return;
    }
    function bt(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0;
        d = f[a >> 2] | 0;
        i = (a + 4) | 0;
        c = f[i >> 2] | 0;
        g = c;
        a: do if ((d | 0) == (c | 0)) {
            e = d;
            h = 4;
        } else {
            a = d;
            while(1){
                if ((f[a >> 2] | 0) == (b | 0)) {
                    e = a;
                    h = 4;
                    break a;
                }
                a = (a + 4) | 0;
                if ((a | 0) == (c | 0)) {
                    a = 0;
                    break;
                }
            }
        }
        while (0)
        if ((h | 0) == 4) if ((e | 0) != (c | 0)) {
            d = (e + 4) | 0;
            a = (g - d) | 0;
            b = a >> 2;
            if (b) {
                xX(e | 0, d | 0, a | 0) | 0;
                c = f[i >> 2] | 0;
            }
            a = (e + (b << 2)) | 0;
            if ((c | 0) == (a | 0)) a = 1;
            else {
                f[i >> 2] = c + (~(((c + -4 - a) | 0) >>> 2) << 2);
                a = 1;
            }
        } else a = 0;
        return a | 0;
    }
    function bu(a) {
        a = a | 0;
        return (((f[(a + 952) >> 2] | 0) - (f[(a + 948) >> 2] | 0)) >> 2) | 0;
    }
    function bv(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = f[(a + 948) >> 2] | 0;
        if ((((f[(a + 952) >> 2] | 0) - c) >> 2) >>> 0 > b >>> 0) a = f[(c + (b << 2)) >> 2] | 0;
        else a = 0;
        return a | 0;
    }
    function bw(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0;
        d = o;
        o = (o + 32) | 0;
        b = d;
        e = f[a >> 2] | 0;
        c = ((f[(a + 4) >> 2] | 0) - e) | 0;
        if ((((f[(a + 8) >> 2] | 0) - e) | 0) >>> 0 > c >>> 0) {
            e = c >> 2;
            d3(b, e, e, (a + 8) | 0);
            d4(a, b);
            d5(b);
        }
        o = d;
        return;
    }
    function bx(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0;
        k = bu(a) | 0;
        do if (k | 0) {
            if ((f[((bv(a, 0) | 0) + 944) >> 2] | 0) == (a | 0)) {
                if (!(bt((a + 948) | 0, b) | 0)) break;
                xS((b + 400) | 0, 8504, 540) | 0;
                f[(b + 944) >> 2] = 0;
                bI(a);
                break;
            }
            h = f[((f[(a + 976) >> 2] | 0) + 12) >> 2] | 0;
            i = (a + 948) | 0;
            j = (h | 0) == 0;
            c = 0;
            g = 0;
            do {
                d = f[((f[i >> 2] | 0) + (g << 2)) >> 2] | 0;
                if ((d | 0) == (b | 0)) bI(a);
                else {
                    e = bq(d) | 0;
                    f[((f[i >> 2] | 0) + (c << 2)) >> 2] = e;
                    f[(e + 944) >> 2] = a;
                    if (!j) zb[h & 15](d, e, a, c);
                    c = (c + 1) | 0;
                }
                g = (g + 1) | 0;
            }while ((g | 0) != (k | 0))
            if (c >>> 0 < k >>> 0) {
                j = (a + 948) | 0;
                i = (a + 952) | 0;
                h = c;
                c = f[i >> 2] | 0;
                do {
                    g = ((f[j >> 2] | 0) + (h << 2)) | 0;
                    d = (g + 4) | 0;
                    e = (c - d) | 0;
                    b = e >> 2;
                    if (!b) e = c;
                    else {
                        xX(g | 0, d | 0, e | 0) | 0;
                        c = f[i >> 2] | 0;
                        e = c;
                    }
                    d = (g + (b << 2)) | 0;
                    if ((e | 0) != (d | 0)) {
                        c = (e + (~(((e + -4 - d) | 0) >>> 2) << 2)) | 0;
                        f[i >> 2] = c;
                    }
                    h = (h + 1) | 0;
                }while ((h | 0) != (k | 0))
            }
        }
        while (0)
        return;
    }
    function by(a) {
        a = a | 0;
        var b = 0, c = 0, e = 0, g = 0;
        bz(a, (bu(a) | 0) == 0, 2491);
        bz(a, (f[(a + 944) >> 2] | 0) == 0, 2545);
        b = (a + 948) | 0;
        c = f[b >> 2] | 0;
        e = (a + 952) | 0;
        g = f[e >> 2] | 0;
        if ((g | 0) != (c | 0)) f[e >> 2] = g + (~(((g + -4 - c) | 0) >>> 2) << 2);
        bw(b);
        b = (a + 976) | 0;
        c = f[b >> 2] | 0;
        xS(a | 0, 8104, 1e3) | 0;
        if (d[(c + 2) >> 0] | 0) {
            f[(a + 4) >> 2] = 2;
            f[(a + 12) >> 2] = 4;
        }
        f[b >> 2] = c;
        return;
    }
    function bz(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        e = o;
        o = (o + 16) | 0;
        d = e;
        if (!b) {
            f[d >> 2] = c;
            c4(a, 5, 3197, d);
        }
        o = e;
        return;
    }
    function bA() {
        return f[2276] | 0;
    }
    function bB() {
        var a = 0;
        a = wP(20) | 0;
        bC((a | 0) != 0, 2592);
        f[2277] = (f[2277] | 0) + 1;
        f[a >> 2] = f[239];
        f[(a + 4) >> 2] = f[240];
        f[(a + 8) >> 2] = f[241];
        f[(a + 12) >> 2] = f[242];
        f[(a + 16) >> 2] = f[243];
        return a | 0;
    }
    function bC(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = o;
        o = (o + 16) | 0;
        c = d;
        if (!a) {
            f[c >> 2] = b;
            c4(0, 5, 3197, c);
        }
        o = d;
        return;
    }
    function bD(a) {
        a = a | 0;
        wQ(a);
        f[2277] = (f[2277] | 0) + -1;
        return;
    }
    function bE(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        if (!b) {
            c = 0;
            b = 0;
        } else {
            bz(a, (bu(a) | 0) == 0, 2629);
            c = 1;
        }
        f[(a + 964) >> 2] = b;
        f[(a + 988) >> 2] = c;
        return;
    }
    function bF(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        g = (d + 8) | 0;
        e = (d + 4) | 0;
        h = d;
        f[e >> 2] = b;
        bz(a, (f[(b + 944) >> 2] | 0) == 0, 2709);
        bz(a, (f[(a + 964) >> 2] | 0) == 0, 2763);
        bG(a);
        b = (a + 948) | 0;
        f[h >> 2] = (f[b >> 2] | 0) + (c << 2);
        f[g >> 2] = f[h >> 2];
        bH(b, g, e) | 0;
        f[((f[e >> 2] | 0) + 944) >> 2] = a;
        bI(a);
        o = d;
        return;
    }
    function bG(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0;
        c = bu(a) | 0;
        if (c | 0 ? (f[((bv(a, 0) | 0) + 944) >> 2] | 0) != (a | 0) : 0) {
            d = f[((f[(a + 976) >> 2] | 0) + 12) >> 2] | 0;
            e = (a + 948) | 0;
            g = (d | 0) == 0;
            b = 0;
            do {
                h = f[((f[e >> 2] | 0) + (b << 2)) >> 2] | 0;
                i = bq(h) | 0;
                f[((f[e >> 2] | 0) + (b << 2)) >> 2] = i;
                f[(i + 944) >> 2] = a;
                if (!g) zb[d & 15](h, i, a, b);
                b = (b + 1) | 0;
            }while ((b | 0) != (c | 0))
        }
        return;
    }
    function bH(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0, s = 0, t = 0;
        s = o;
        o = (o + 64) | 0;
        m = (s + 52) | 0;
        i = (s + 48) | 0;
        n = (s + 28) | 0;
        p = (s + 24) | 0;
        q = (s + 20) | 0;
        r = s;
        d = f[a >> 2] | 0;
        g = d;
        b = (d + ((((f[b >> 2] | 0) - g) >> 2) << 2)) | 0;
        d = (a + 4) | 0;
        e = f[d >> 2] | 0;
        h = (a + 8) | 0;
        do if (e >>> 0 < (f[h >> 2] | 0) >>> 0) {
            if ((b | 0) == (e | 0)) {
                f[b >> 2] = f[c >> 2];
                f[d >> 2] = (f[d >> 2] | 0) + 4;
                break;
            }
            d6(a, b, e, (b + 4) | 0);
            if (b >>> 0 <= c >>> 0) c = (f[d >> 2] | 0) >>> 0 > c >>> 0 ? (c + 4) | 0 : c;
            f[b >> 2] = f[c >> 2];
        } else {
            d = (((e - g) >> 2) + 1) | 0;
            e = dm(a) | 0;
            if (e >>> 0 < d >>> 0) xA(a);
            l = f[a >> 2] | 0;
            k = ((f[h >> 2] | 0) - l) | 0;
            g = k >> 1;
            d3(r, (k >> 2) >>> 0 < (e >>> 1) >>> 0 ? g >>> 0 < d >>> 0 ? d : g : e, (b - l) >> 2, (a + 8) | 0);
            l = (r + 8) | 0;
            d = f[l >> 2] | 0;
            g = (r + 12) | 0;
            k = f[g >> 2] | 0;
            h = k;
            j = d;
            do if ((d | 0) == (k | 0)) {
                k = (r + 4) | 0;
                d = f[k >> 2] | 0;
                t = f[r >> 2] | 0;
                e = t;
                if (d >>> 0 <= t >>> 0) {
                    d = (h - e) >> 1;
                    d = (d | 0) == 0 ? 1 : d;
                    d3(n, d, d >>> 2, f[(r + 16) >> 2] | 0);
                    f[p >> 2] = f[k >> 2];
                    f[q >> 2] = f[l >> 2];
                    f[i >> 2] = f[p >> 2];
                    f[m >> 2] = f[q >> 2];
                    d8(n, i, m);
                    d = f[r >> 2] | 0;
                    f[r >> 2] = f[n >> 2];
                    f[n >> 2] = d;
                    d = (n + 4) | 0;
                    t = f[k >> 2] | 0;
                    f[k >> 2] = f[d >> 2];
                    f[d >> 2] = t;
                    d = (n + 8) | 0;
                    t = f[l >> 2] | 0;
                    f[l >> 2] = f[d >> 2];
                    f[d >> 2] = t;
                    d = (n + 12) | 0;
                    t = f[g >> 2] | 0;
                    f[g >> 2] = f[d >> 2];
                    f[d >> 2] = t;
                    d5(n);
                    d = f[l >> 2] | 0;
                    break;
                }
                g = d;
                h = (((((g - e) >> 2) + 1) | 0) / -2) | 0;
                i = (d + (h << 2)) | 0;
                e = (j - g) | 0;
                g = e >> 2;
                if (g) {
                    xX(i | 0, d | 0, e | 0) | 0;
                    d = f[k >> 2] | 0;
                }
                t = (i + (g << 2)) | 0;
                f[l >> 2] = t;
                f[k >> 2] = d + (h << 2);
                d = t;
            }
            while (0)
            f[d >> 2] = f[c >> 2];
            f[l >> 2] = (f[l >> 2] | 0) + 4;
            b = d7(a, r, b) | 0;
            d5(r);
        }
        while (0)
        o = s;
        return b | 0;
    }
    function bI(a) {
        a = a | 0;
        var b = 0;
        do {
            b = (a + 984) | 0;
            if (d[b >> 0] | 0) break;
            d[b >> 0] = 1;
            j[(a + 504) >> 2] = W(w);
            a = f[(a + 944) >> 2] | 0;
        }while ((a | 0) != 0)
        return;
    }
    function bJ(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -4 - d) | 0) >>> 2) << 2);
            xJ(c);
        }
        return;
    }
    function bK(a) {
        a = a | 0;
        return f[(a + 944) >> 2] | 0;
    }
    function bL(a) {
        a = a | 0;
        bz(a, (f[(a + 964) >> 2] | 0) != 0, 2832);
        bI(a);
        return;
    }
    function bM(a) {
        a = a | 0;
        return ((d[(a + 984) >> 0] | 0) != 0) | 0;
    }
    function bN(a, b) {
        a = a | 0;
        b = b | 0;
        if (w0(a, b, 400) | 0) {
            xS(a | 0, b | 0, 400) | 0;
            bI(a);
        }
        return;
    }
    function bO(a) {
        a = a | 0;
        var b = bb;
        b = W(j[(a + 44) >> 2]);
        a = bl(b) | 0;
        return W(a ? W(0.0) : b);
    }
    function bP(a) {
        a = a | 0;
        var b = bb;
        b = W(j[(a + 48) >> 2]);
        if (bl(b) | 0) b = d[((f[(a + 976) >> 2] | 0) + 2) >> 0] | 0 ? W(1.0) : W(0.0);
        return W(b);
    }
    function bQ(a, b) {
        a = a | 0;
        b = b | 0;
        f[(a + 980) >> 2] = b;
        return;
    }
    function bR(a) {
        a = a | 0;
        return f[(a + 980) >> 2] | 0;
    }
    function bS(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 4) | 0;
        if ((f[c >> 2] | 0) != (b | 0)) {
            f[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function bT(a) {
        a = a | 0;
        return f[(a + 4) >> 2] | 0;
    }
    function bU(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 8) | 0;
        if ((f[c >> 2] | 0) != (b | 0)) {
            f[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function bV(a) {
        a = a | 0;
        return f[(a + 8) >> 2] | 0;
    }
    function bW(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 12) | 0;
        if ((f[c >> 2] | 0) != (b | 0)) {
            f[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function bX(a) {
        a = a | 0;
        return f[(a + 12) >> 2] | 0;
    }
    function bY(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 16) | 0;
        if ((f[c >> 2] | 0) != (b | 0)) {
            f[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function bZ(a) {
        a = a | 0;
        return f[(a + 16) >> 2] | 0;
    }
    function b$(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 20) | 0;
        if ((f[c >> 2] | 0) != (b | 0)) {
            f[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function b_(a) {
        a = a | 0;
        return f[(a + 20) >> 2] | 0;
    }
    function b0(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 24) | 0;
        if ((f[c >> 2] | 0) != (b | 0)) {
            f[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function b1(a) {
        a = a | 0;
        return f[(a + 24) >> 2] | 0;
    }
    function b2(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 28) | 0;
        if ((f[c >> 2] | 0) != (b | 0)) {
            f[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function b3(a) {
        a = a | 0;
        return f[(a + 28) >> 2] | 0;
    }
    function b4(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 32) | 0;
        if ((f[c >> 2] | 0) != (b | 0)) {
            f[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function b5(a) {
        a = a | 0;
        return f[(a + 32) >> 2] | 0;
    }
    function b6(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 36) | 0;
        if ((f[c >> 2] | 0) != (b | 0)) {
            f[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function b7(a) {
        a = a | 0;
        return f[(a + 36) >> 2] | 0;
    }
    function b8(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0;
        c = (a + 40) | 0;
        if (W(j[c >> 2]) != b) {
            j[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function b9(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0;
        c = (a + 44) | 0;
        if (W(j[c >> 2]) != b) {
            j[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function ca(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0;
        c = (a + 48) | 0;
        if (W(j[c >> 2]) != b) {
            j[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function cb(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = (g ^ 1) & 1;
        d = (a + 52) | 0;
        e = (a + 56) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cc(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0;
        d = (a + 52) | 0;
        c = (a + 56) | 0;
        if (!(!(W(j[d >> 2]) != b) ? (f[c >> 2] | 0) == 2 : 0)) {
            j[d >> 2] = b;
            d = bl(b) | 0;
            f[c >> 2] = d ? 3 : 2;
            bI(a);
        }
        return;
    }
    function cd(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = (b + 52) | 0;
        c = f[(d + 4) >> 2] | 0;
        b = a;
        f[b >> 2] = f[d >> 2];
        f[(b + 4) >> 2] = c;
        return;
    }
    function ce(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0, e = 0, g = 0;
        g = bl(c) | 0;
        d = (g ^ 1) & 1;
        e = (a + 132 + (b << 3)) | 0;
        b = (a + 132 + (b << 3) + 4) | 0;
        if (!(g | (W(j[e >> 2]) == c) ? (f[b >> 2] | 0) == (d | 0) : 0)) {
            j[e >> 2] = c;
            f[b >> 2] = d;
            bI(a);
        }
        return;
    }
    function cf(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0, e = 0, g = 0;
        g = bl(c) | 0;
        d = g ? 0 : 2;
        e = (a + 132 + (b << 3)) | 0;
        b = (a + 132 + (b << 3) + 4) | 0;
        if (!(g | (W(j[e >> 2]) == c) ? (f[b >> 2] | 0) == (d | 0) : 0)) {
            j[e >> 2] = c;
            f[b >> 2] = d;
            bI(a);
        }
        return;
    }
    function cg(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = (b + 132 + (c << 3)) | 0;
        b = f[(d + 4) >> 2] | 0;
        c = a;
        f[c >> 2] = f[d >> 2];
        f[(c + 4) >> 2] = b;
        return;
    }
    function ch(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0, e = 0, g = 0;
        g = bl(c) | 0;
        d = (g ^ 1) & 1;
        e = (a + 60 + (b << 3)) | 0;
        b = (a + 60 + (b << 3) + 4) | 0;
        if (!(g | (W(j[e >> 2]) == c) ? (f[b >> 2] | 0) == (d | 0) : 0)) {
            j[e >> 2] = c;
            f[b >> 2] = d;
            bI(a);
        }
        return;
    }
    function ci(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0, e = 0, g = 0;
        g = bl(c) | 0;
        d = g ? 0 : 2;
        e = (a + 60 + (b << 3)) | 0;
        b = (a + 60 + (b << 3) + 4) | 0;
        if (!(g | (W(j[e >> 2]) == c) ? (f[b >> 2] | 0) == (d | 0) : 0)) {
            j[e >> 2] = c;
            f[b >> 2] = d;
            bI(a);
        }
        return;
    }
    function cj(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = (b + 60 + (c << 3)) | 0;
        b = f[(d + 4) >> 2] | 0;
        c = a;
        f[c >> 2] = f[d >> 2];
        f[(c + 4) >> 2] = b;
        return;
    }
    function ck(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = (a + 60 + (b << 3) + 4) | 0;
        if ((f[c >> 2] | 0) != 3) {
            j[(a + 60 + (b << 3)) >> 2] = W(w);
            f[c >> 2] = 3;
            bI(a);
        }
        return;
    }
    function cl(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0, e = 0, g = 0;
        g = bl(c) | 0;
        d = (g ^ 1) & 1;
        e = (a + 204 + (b << 3)) | 0;
        b = (a + 204 + (b << 3) + 4) | 0;
        if (!(g | (W(j[e >> 2]) == c) ? (f[b >> 2] | 0) == (d | 0) : 0)) {
            j[e >> 2] = c;
            f[b >> 2] = d;
            bI(a);
        }
        return;
    }
    function cm(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0, e = 0, g = 0;
        g = bl(c) | 0;
        d = g ? 0 : 2;
        e = (a + 204 + (b << 3)) | 0;
        b = (a + 204 + (b << 3) + 4) | 0;
        if (!(g | (W(j[e >> 2]) == c) ? (f[b >> 2] | 0) == (d | 0) : 0)) {
            j[e >> 2] = c;
            f[b >> 2] = d;
            bI(a);
        }
        return;
    }
    function cn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = (b + 204 + (c << 3)) | 0;
        b = f[(d + 4) >> 2] | 0;
        c = a;
        f[c >> 2] = f[d >> 2];
        f[(c + 4) >> 2] = b;
        return;
    }
    function co(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0, e = 0, g = 0;
        g = bl(c) | 0;
        d = (g ^ 1) & 1;
        e = (a + 276 + (b << 3)) | 0;
        b = (a + 276 + (b << 3) + 4) | 0;
        if (!(g | (W(j[e >> 2]) == c) ? (f[b >> 2] | 0) == (d | 0) : 0)) {
            j[e >> 2] = c;
            f[b >> 2] = d;
            bI(a);
        }
        return;
    }
    function cp(a, b) {
        a = a | 0;
        b = b | 0;
        return W(j[(a + 276 + (b << 3)) >> 2]);
    }
    function cq(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = (g ^ 1) & 1;
        d = (a + 348) | 0;
        e = (a + 352) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cr(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0;
        d = (a + 348) | 0;
        c = (a + 352) | 0;
        if (!(!(W(j[d >> 2]) != b) ? (f[c >> 2] | 0) == 2 : 0)) {
            j[d >> 2] = b;
            d = bl(b) | 0;
            f[c >> 2] = d ? 3 : 2;
            bI(a);
        }
        return;
    }
    function cs(a) {
        a = a | 0;
        var b = 0;
        b = (a + 352) | 0;
        if ((f[b >> 2] | 0) != 3) {
            j[(a + 348) >> 2] = W(w);
            f[b >> 2] = 3;
            bI(a);
        }
        return;
    }
    function ct(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = (b + 348) | 0;
        c = f[(d + 4) >> 2] | 0;
        b = a;
        f[b >> 2] = f[d >> 2];
        f[(b + 4) >> 2] = c;
        return;
    }
    function cu(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = (g ^ 1) & 1;
        d = (a + 356) | 0;
        e = (a + 360) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cv(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0;
        d = (a + 356) | 0;
        c = (a + 360) | 0;
        if (!(!(W(j[d >> 2]) != b) ? (f[c >> 2] | 0) == 2 : 0)) {
            j[d >> 2] = b;
            d = bl(b) | 0;
            f[c >> 2] = d ? 3 : 2;
            bI(a);
        }
        return;
    }
    function cw(a) {
        a = a | 0;
        var b = 0;
        b = (a + 360) | 0;
        if ((f[b >> 2] | 0) != 3) {
            j[(a + 356) >> 2] = W(w);
            f[b >> 2] = 3;
            bI(a);
        }
        return;
    }
    function cx(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = (b + 356) | 0;
        c = f[(d + 4) >> 2] | 0;
        b = a;
        f[b >> 2] = f[d >> 2];
        f[(b + 4) >> 2] = c;
        return;
    }
    function cy(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = (g ^ 1) & 1;
        d = (a + 364) | 0;
        e = (a + 368) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cz(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = g ? 0 : 2;
        d = (a + 364) | 0;
        e = (a + 368) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cA(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = (b + 364) | 0;
        c = f[(d + 4) >> 2] | 0;
        b = a;
        f[b >> 2] = f[d >> 2];
        f[(b + 4) >> 2] = c;
        return;
    }
    function cB(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = (g ^ 1) & 1;
        d = (a + 372) | 0;
        e = (a + 376) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cC(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = g ? 0 : 2;
        d = (a + 372) | 0;
        e = (a + 376) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cD(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = (b + 372) | 0;
        c = f[(d + 4) >> 2] | 0;
        b = a;
        f[b >> 2] = f[d >> 2];
        f[(b + 4) >> 2] = c;
        return;
    }
    function cE(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = (g ^ 1) & 1;
        d = (a + 380) | 0;
        e = (a + 384) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cF(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = g ? 0 : 2;
        d = (a + 380) | 0;
        e = (a + 384) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cG(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = (b + 380) | 0;
        c = f[(d + 4) >> 2] | 0;
        b = a;
        f[b >> 2] = f[d >> 2];
        f[(b + 4) >> 2] = c;
        return;
    }
    function cH(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = (g ^ 1) & 1;
        d = (a + 388) | 0;
        e = (a + 392) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cI(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0;
        g = bl(b) | 0;
        c = g ? 0 : 2;
        d = (a + 388) | 0;
        e = (a + 392) | 0;
        if (!(g | (W(j[d >> 2]) == b) ? (f[e >> 2] | 0) == (c | 0) : 0)) {
            j[d >> 2] = b;
            f[e >> 2] = c;
            bI(a);
        }
        return;
    }
    function cJ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = (b + 388) | 0;
        c = f[(d + 4) >> 2] | 0;
        b = a;
        f[b >> 2] = f[d >> 2];
        f[(b + 4) >> 2] = c;
        return;
    }
    function cK(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0;
        c = (a + 396) | 0;
        if (W(j[c >> 2]) != b) {
            j[c >> 2] = b;
            bI(a);
        }
        return;
    }
    function cL(a) {
        a = a | 0;
        return W(j[(a + 396) >> 2]);
    }
    function cM(a) {
        a = a | 0;
        return W(j[(a + 400) >> 2]);
    }
    function cN(a) {
        a = a | 0;
        return W(j[(a + 404) >> 2]);
    }
    function cO(a) {
        a = a | 0;
        return W(j[(a + 408) >> 2]);
    }
    function cP(a) {
        a = a | 0;
        return W(j[(a + 412) >> 2]);
    }
    function cQ(a) {
        a = a | 0;
        return W(j[(a + 416) >> 2]);
    }
    function cR(a) {
        a = a | 0;
        return W(j[(a + 420) >> 2]);
    }
    function cS(a, b) {
        a = a | 0;
        b = b | 0;
        bz(a, (b | 0) < 6, 2918);
        switch(b | 0){
            case 0:
                {
                    b = (f[(a + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    b = (f[(a + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return W(j[(a + 424 + (b << 2)) >> 2]);
    }
    function cT(a, b) {
        a = a | 0;
        b = b | 0;
        bz(a, (b | 0) < 6, 2918);
        switch(b | 0){
            case 0:
                {
                    b = (f[(a + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    b = (f[(a + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return W(j[(a + 448 + (b << 2)) >> 2]);
    }
    function cU(a, b) {
        a = a | 0;
        b = b | 0;
        bz(a, (b | 0) < 6, 2918);
        switch(b | 0){
            case 0:
                {
                    b = (f[(a + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    b = (f[(a + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return W(j[(a + 472 + (b << 2)) >> 2]);
    }
    function cV(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = bb;
        c = f[(a + 4) >> 2] | 0;
        if ((c | 0) == (f[(b + 4) >> 2] | 0)) {
            if (!c) a = 1;
            else {
                d = W(j[a >> 2]);
                a = W(F(W(d - W(j[b >> 2])))) < W(0.0000999999974);
            }
        } else a = 0;
        return a | 0;
    }
    function cW(a, b) {
        a = W(a);
        b = W(b);
        var c = 0;
        if (bl(a) | 0) c = bl(b) | 0;
        else c = W(F(W(a - b))) < W(0.0000999999974);
        return c | 0;
    }
    function cX(a, b) {
        a = a | 0;
        b = b | 0;
        cY(a, b);
        return;
    }
    function cY(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, e = 0;
        c = o;
        o = (o + 16) | 0;
        e = (c + 4) | 0;
        f[e >> 2] = 0;
        f[(e + 4) >> 2] = 0;
        f[(e + 8) >> 2] = 0;
        aN(e | 0, a | 0, b | 0, 0);
        c4(a, 3, (d[(e + 11) >> 0] | 0) < 0 ? f[e >> 2] | 0 : e, c);
        xK(e);
        o = c;
        return;
    }
    function cZ(a, b, c, d) {
        a = W(a);
        b = W(b);
        c = c | 0;
        d = d | 0;
        var e = bb;
        a = W(a * b);
        e = W(xx(a, W(1.0)));
        do if (!(cW(e, W(0.0)) | 0)) {
            a = W(a - e);
            if (cW(e, W(1.0)) | 0) {
                a = W(a + W(1.0));
                break;
            }
            if (c) {
                a = W(a + W(1.0));
                break;
            }
            if (!d) {
                if (e > W(0.5)) e = W(1.0);
                else {
                    d = cW(e, W(0.5)) | 0;
                    e = d ? W(1.0) : W(0.0);
                }
                a = W(a + e);
            }
        } else a = W(a - e);
        while (0)
        return W(a / b);
    }
    function c$(a, b, c, d, e, f, g, h, i, k, l, m, n) {
        a = a | 0;
        b = W(b);
        c = c | 0;
        d = W(d);
        e = e | 0;
        f = W(f);
        g = g | 0;
        h = W(h);
        i = W(i);
        k = W(k);
        l = W(l);
        m = W(m);
        n = n | 0;
        var o = 0, p = bb, q = bb, r = bb, s = bb, t = bb, u = bb;
        if ((i < W(0.0)) | (k < W(0.0))) n = 0;
        else {
            if ((n | 0) != 0 ? ((p = W(j[(n + 4) >> 2])), p != W(0.0)) : 0) {
                r = W(cZ(b, p, 0, 0));
                s = W(cZ(d, p, 0, 0));
                q = W(cZ(f, p, 0, 0));
                p = W(cZ(h, p, 0, 0));
            } else {
                q = f;
                r = b;
                p = h;
                s = d;
            }
            if ((e | 0) == (a | 0)) o = cW(q, r) | 0;
            else o = 0;
            if ((g | 0) == (c | 0)) n = cW(p, s) | 0;
            else n = 0;
            if ((!o ? ((t = W(b - l)), !(c_(a, t, i) | 0)) : 0) ? !(c0(a, t, e, i) | 0) : 0) o = c1(a, t, e, f, i) | 0;
            else o = 1;
            if ((!n ? ((u = W(d - m)), !(c_(c, u, k) | 0)) : 0) ? !(c0(c, u, g, k) | 0) : 0) n = c1(c, u, g, h, k) | 0;
            else n = 1;
            n = o & n;
        }
        return n | 0;
    }
    function c_(a, b, c) {
        a = a | 0;
        b = W(b);
        c = W(c);
        if ((a | 0) == 1) a = cW(b, c) | 0;
        else a = 0;
        return a | 0;
    }
    function c0(a, b, c, d) {
        a = a | 0;
        b = W(b);
        c = c | 0;
        d = W(d);
        if (((a | 0) == 2) & ((c | 0) == 0)) {
            if (!(b >= d)) a = cW(b, d) | 0;
            else a = 1;
        } else a = 0;
        return a | 0;
    }
    function c1(a, b, c, d, e) {
        a = a | 0;
        b = W(b);
        c = c | 0;
        d = W(d);
        e = W(e);
        if (((a | 0) == 2) & ((c | 0) == 2) & (d > b)) {
            if (!(e <= b)) a = cW(b, e) | 0;
            else a = 1;
        } else a = 0;
        return a | 0;
    }
    function c2(a, b, c, e, g, h, i, l, m, n, p) {
        a = a | 0;
        b = W(b);
        c = W(c);
        e = e | 0;
        g = g | 0;
        h = h | 0;
        i = W(i);
        l = W(l);
        m = m | 0;
        n = n | 0;
        p = p | 0;
        var q = 0, r = 0, s = 0, t = 0, u = bb, v = bb, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = bb, I = bb, J = bb, K = 0.0, L = 0.0;
        G = o;
        o = (o + 160) | 0;
        D = (G + 152) | 0;
        C = (G + 120) | 0;
        B = (G + 104) | 0;
        y = (G + 72) | 0;
        t = (G + 56) | 0;
        A = (G + 8) | 0;
        x = G;
        z = ((f[2279] | 0) + 1) | 0;
        f[2279] = z;
        E = (a + 984) | 0;
        if ((d[E >> 0] | 0) != 0 ? (f[(a + 512) >> 2] | 0) != (f[2278] | 0) : 0) w = 4;
        else if ((f[(a + 516) >> 2] | 0) == (e | 0)) F = 0;
        else w = 4;
        if ((w | 0) == 4) {
            f[(a + 520) >> 2] = 0;
            f[(a + 924) >> 2] = -1;
            f[(a + 928) >> 2] = -1;
            j[(a + 932) >> 2] = W(-1.0);
            j[(a + 936) >> 2] = W(-1.0);
            F = 1;
        }
        a: do if (!(f[(a + 964) >> 2] | 0)) {
            if (m) {
                q = (a + 916) | 0;
                if (!(cW(W(j[q >> 2]), b) | 0)) {
                    w = 21;
                    break;
                }
                if (!(cW(W(j[(a + 920) >> 2]), c) | 0)) {
                    w = 21;
                    break;
                }
                if ((f[(a + 924) >> 2] | 0) != (g | 0)) {
                    w = 21;
                    break;
                }
                q = (f[(a + 928) >> 2] | 0) == (h | 0) ? q : 0;
                w = 22;
                break;
            }
            s = f[(a + 520) >> 2] | 0;
            if (!s) w = 21;
            else {
                r = 0;
                while(1){
                    q = (a + 524 + ((r * 24) | 0)) | 0;
                    if (((cW(W(j[q >> 2]), b) | 0 ? cW(W(j[(a + 524 + ((r * 24) | 0) + 4) >> 2]), c) | 0 : 0) ? (f[(a + 524 + ((r * 24) | 0) + 8) >> 2] | 0) == (g | 0) : 0) ? (f[(a + 524 + ((r * 24) | 0) + 12) >> 2] | 0) == (h | 0) : 0) {
                        w = 22;
                        break a;
                    }
                    r = (r + 1) | 0;
                    if (r >>> 0 >= s >>> 0) {
                        w = 21;
                        break;
                    }
                }
            }
        } else {
            u = W(c3(a, 2, i));
            v = W(c3(a, 0, i));
            q = (a + 916) | 0;
            J = W(j[q >> 2]);
            I = W(j[(a + 920) >> 2]);
            H = W(j[(a + 932) >> 2]);
            if (!(c$(g, b, h, c, f[(a + 924) >> 2] | 0, J, f[(a + 928) >> 2] | 0, I, H, W(j[(a + 936) >> 2]), u, v, p) | 0)) {
                s = f[(a + 520) >> 2] | 0;
                if (!s) w = 21;
                else {
                    r = 0;
                    while(1){
                        q = (a + 524 + ((r * 24) | 0)) | 0;
                        H = W(j[q >> 2]);
                        I = W(j[(a + 524 + ((r * 24) | 0) + 4) >> 2]);
                        J = W(j[(a + 524 + ((r * 24) | 0) + 16) >> 2]);
                        if (c$(g, b, h, c, f[(a + 524 + ((r * 24) | 0) + 8) >> 2] | 0, H, f[(a + 524 + ((r * 24) | 0) + 12) >> 2] | 0, I, J, W(j[(a + 524 + ((r * 24) | 0) + 20) >> 2]), u, v, p) | 0) {
                            w = 22;
                            break a;
                        }
                        r = (r + 1) | 0;
                        if (r >>> 0 >= s >>> 0) {
                            w = 21;
                            break;
                        }
                    }
                }
            } else w = 22;
        }
        while (0)
        do if ((w | 0) == 21) {
            if (!(d[11697] | 0)) {
                q = 0;
                w = 31;
            } else {
                q = 0;
                w = 28;
            }
        } else if ((w | 0) == 22) {
            r = (d[11697] | 0) != 0;
            if (!(((q | 0) != 0) & (F ^ 1))) if (r) {
                w = 28;
                break;
            } else {
                w = 31;
                break;
            }
            t = (q + 16) | 0;
            f[(a + 908) >> 2] = f[t >> 2];
            s = (q + 20) | 0;
            f[(a + 912) >> 2] = f[s >> 2];
            if (!(((d[11698] | 0) == 0) | (r ^ 1))) {
                f[x >> 2] = c5(z) | 0;
                f[(x + 4) >> 2] = z;
                c4(a, 4, 2972, x);
                r = f[(a + 972) >> 2] | 0;
                if (r | 0) yS[r & 127](a);
                g = c6(g, m) | 0;
                h = c6(h, m) | 0;
                L = +W(j[t >> 2]);
                K = +W(j[s >> 2]);
                f[A >> 2] = g;
                f[(A + 4) >> 2] = h;
                k[(A + 8) >> 3] = +b;
                k[(A + 16) >> 3] = +c;
                k[(A + 24) >> 3] = L;
                k[(A + 32) >> 3] = K;
                f[(A + 40) >> 2] = n;
                c4(a, 4, 2989, A);
            }
        }
        while (0)
        if ((w | 0) == 28) {
            r = c5(z) | 0;
            f[t >> 2] = r;
            f[(t + 4) >> 2] = z;
            f[(t + 8) >> 2] = F ? 3047 : 11699;
            c4(a, 4, 3038, t);
            r = f[(a + 972) >> 2] | 0;
            if (r | 0) yS[r & 127](a);
            A = c6(g, m) | 0;
            w = c6(h, m) | 0;
            f[y >> 2] = A;
            f[(y + 4) >> 2] = w;
            k[(y + 8) >> 3] = +b;
            k[(y + 16) >> 3] = +c;
            f[(y + 24) >> 2] = n;
            c4(a, 4, 3049, y);
            w = 31;
        }
        if ((w | 0) == 31) {
            c7(a, b, c, e, g, h, i, l, m, p);
            if (d[11697] | 0) {
                r = f[2279] | 0;
                A = c5(r) | 0;
                f[B >> 2] = A;
                f[(B + 4) >> 2] = r;
                f[(B + 8) >> 2] = F ? 3047 : 11699;
                c4(a, 4, 3083, B);
                r = f[(a + 972) >> 2] | 0;
                if (r | 0) yS[r & 127](a);
                A = c6(g, m) | 0;
                B = c6(h, m) | 0;
                K = +W(j[(a + 908) >> 2]);
                L = +W(j[(a + 912) >> 2]);
                f[C >> 2] = A;
                f[(C + 4) >> 2] = B;
                k[(C + 8) >> 3] = K;
                k[(C + 16) >> 3] = L;
                f[(C + 24) >> 2] = n;
                c4(a, 4, 3092, C);
            }
            f[(a + 516) >> 2] = e;
            if (!q) {
                r = (a + 520) | 0;
                q = f[r >> 2] | 0;
                if ((q | 0) == 16) {
                    if (d[11697] | 0) c4(a, 4, 3124, D);
                    f[r >> 2] = 0;
                    q = 0;
                }
                if (m) q = (a + 916) | 0;
                else {
                    f[r >> 2] = q + 1;
                    q = (a + 524 + ((q * 24) | 0)) | 0;
                }
                j[q >> 2] = b;
                j[(q + 4) >> 2] = c;
                f[(q + 8) >> 2] = g;
                f[(q + 12) >> 2] = h;
                f[(q + 16) >> 2] = f[(a + 908) >> 2];
                f[(q + 20) >> 2] = f[(a + 912) >> 2];
                q = 0;
            }
        }
        if (m) {
            f[(a + 416) >> 2] = f[(a + 908) >> 2];
            f[(a + 420) >> 2] = f[(a + 912) >> 2];
            d[(a + 985) >> 0] = 1;
            d[E >> 0] = 0;
        }
        f[2279] = (f[2279] | 0) + -1;
        f[(a + 512) >> 2] = f[2278];
        o = G;
        return F | ((q | 0) == 0) | 0;
    }
    function c3(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = bb;
        d = W(dn(a, b, c));
        return W(d + W(dp(a, b, c)));
    }
    function c4(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = o;
        o = (o + 16) | 0;
        e = g;
        f[e >> 2] = d;
        if (!a) d = 0;
        else d = f[(a + 976) >> 2] | 0;
        dh(d, a, b, c, e);
        o = g;
        return;
    }
    function c5(a) {
        a = a | 0;
        return (a >>> 0 > 60 ? 3201 : (3201 + (60 - a)) | 0) | 0;
    }
    function c6(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        e = o;
        o = (o + 32) | 0;
        c = (e + 12) | 0;
        d = e;
        f[c >> 2] = f[254];
        f[(c + 4) >> 2] = f[255];
        f[(c + 8) >> 2] = f[256];
        f[d >> 2] = f[257];
        f[(d + 4) >> 2] = f[258];
        f[(d + 8) >> 2] = f[259];
        if ((a | 0) > 2) a = 11699;
        else a = f[((b ? d : c) + (a << 2)) >> 2] | 0;
        o = e;
        return a | 0;
    }
    function c7(a, b, c, e, h, i, k, l, n, p) {
        a = a | 0;
        b = W(b);
        c = W(c);
        e = e | 0;
        h = h | 0;
        i = i | 0;
        k = W(k);
        l = W(l);
        n = n | 0;
        p = p | 0;
        var q = 0, r = 0, s = 0, t = 0, u = bb, v = bb, w = bb, x = bb, y = bb, z = bb, A = bb, B = 0, C = 0, D = 0, E = bb, F = bb, G = 0, H = bb, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, X = 0, Y = 0, Z = 0, $ = 0, _ = bb, aa = bb, ab = bb, ac = bb, ad = bb, ae = 0, af = 0, ag = 0, ah = 0, ai = 0, aj = bb, ak = bb, al = bb, am = bb, an = bb, ao = bb, ap = 0, aq = bb, ar = bb, as = bb, at = bb, au = bb, av = bb, aw = 0, ax = 0, ay = bb, az = bb, aA = 0, aB = 0, aC = 0, aD = 0, aE = bb, aF = 0, aG = 0, aH = 0, aI = 0, aJ = 0, aK = 0, aL = 0, aM = bb, aN = 0, aO = 0;
        aL = o;
        o = (o + 16) | 0;
        ae = (aL + 12) | 0;
        af = (aL + 8) | 0;
        ag = (aL + 4) | 0;
        ah = aL;
        bz(a, ((h | 0) == 0) | ((bl(b) | 0) ^ 1), 3326);
        bz(a, ((i | 0) == 0) | ((bl(c) | 0) ^ 1), 3406);
        aG = ds(a, e) | 0;
        f[(a + 496) >> 2] = aG;
        aJ = dt(2, aG) | 0;
        aK = dt(0, aG) | 0;
        j[(a + 440) >> 2] = W(dn(a, aJ, k));
        j[(a + 444) >> 2] = W(dp(a, aJ, k));
        j[(a + 428) >> 2] = W(dn(a, aK, k));
        j[(a + 436) >> 2] = W(dp(a, aK, k));
        j[(a + 464) >> 2] = W(du(a, aJ));
        j[(a + 468) >> 2] = W(dv(a, aJ));
        j[(a + 452) >> 2] = W(du(a, aK));
        j[(a + 460) >> 2] = W(dv(a, aK));
        j[(a + 488) >> 2] = W(dw(a, aJ, k));
        j[(a + 492) >> 2] = W(dx(a, aJ, k));
        j[(a + 476) >> 2] = W(dw(a, aK, k));
        j[(a + 484) >> 2] = W(dx(a, aK, k));
        do if (!(f[(a + 964) >> 2] | 0)) {
            aH = (a + 948) | 0;
            aI = ((f[(a + 952) >> 2] | 0) - (f[aH >> 2] | 0)) >> 2;
            if (!aI) {
                dz(a, b, c, h, i, k, l);
                break;
            }
            if (!n ? dA(a, b, c, h, i, k, l) | 0 : 0) break;
            bG(a);
            Y = (a + 508) | 0;
            d[Y >> 0] = 0;
            aJ = dt(f[(a + 4) >> 2] | 0, aG) | 0;
            aK = dB(aJ, aG) | 0;
            aF = dq(aJ) | 0;
            Z = f[(a + 8) >> 2] | 0;
            aB = (a + 28) | 0;
            $ = (f[aB >> 2] | 0) != 0;
            au = aF ? k : l;
            ay = aF ? l : k;
            _ = W(dC(a, aJ, k));
            aa = W(dD(a, aJ, k));
            u = W(dC(a, aK, k));
            av = W(dE(a, aJ, k));
            az = W(dE(a, aK, k));
            D = aF ? h : i;
            aA = aF ? i : h;
            aE = aF ? av : az;
            y = aF ? az : av;
            at = W(c3(a, 2, k));
            x = W(c3(a, 0, k));
            v = W(W(dc((a + 364) | 0, k)) - aE);
            w = W(W(dc((a + 380) | 0, k)) - aE);
            z = W(W(dc((a + 372) | 0, l)) - y);
            A = W(W(dc((a + 388) | 0, l)) - y);
            ab = aF ? v : z;
            ac = aF ? w : A;
            at = W(b - at);
            b = W(at - aE);
            if (bl(b) | 0) aE = b;
            else aE = W(xt(W(xv(b, w)), v));
            ar = W(c - x);
            b = W(ar - y);
            if (bl(b) | 0) as = b;
            else as = W(xt(W(xv(b, A)), z));
            v = aF ? aE : as;
            aq = aF ? as : aE;
            a: do if ((D | 0) == 1) {
                e = 0;
                r = 0;
                while(1){
                    q = bv(a, r) | 0;
                    if (!e) {
                        if (W(dG(q)) > W(0.0) ? W(dH(q)) > W(0.0) : 0) e = q;
                        else e = 0;
                    } else if (dF(q) | 0) {
                        t = 0;
                        break a;
                    }
                    r = (r + 1) | 0;
                    if (r >>> 0 >= aI >>> 0) {
                        t = e;
                        break;
                    }
                }
            } else t = 0;
            while (0)
            B = (t + 500) | 0;
            C = (t + 504) | 0;
            e = 0;
            q = 0;
            b = W(0.0);
            s = 0;
            do {
                r = f[((f[aH >> 2] | 0) + (s << 2)) >> 2] | 0;
                if ((f[(r + 36) >> 2] | 0) == 1) {
                    dI(r);
                    d[(r + 985) >> 0] = 1;
                    d[(r + 984) >> 0] = 0;
                } else {
                    da(r);
                    if (n) dd(r, ds(r, aG) | 0, v, aq, aE);
                    do if ((f[(r + 24) >> 2] | 0) != 1) {
                        if ((r | 0) == (t | 0)) {
                            f[B >> 2] = f[2278];
                            j[C >> 2] = W(0.0);
                            break;
                        } else {
                            dJ(a, r, aE, h, as, aE, as, i, aG, p);
                            break;
                        }
                    } else {
                        if (q | 0) f[(q + 960) >> 2] = r;
                        f[(r + 960) >> 2] = 0;
                        q = r;
                        e = (e | 0) == 0 ? r : e;
                    }
                    while (0)
                    ao = W(j[(r + 504) >> 2]);
                    b = W(b + W(ao + W(c3(r, aJ, aE))));
                }
                s = (s + 1) | 0;
            }while ((s | 0) != (aI | 0))
            K = b > v;
            ap = $ & (((D | 0) == 2) & K) ? 1 : D;
            I = (aA | 0) == 1;
            M = I & (n ^ 1);
            N = (ap | 0) == 1;
            O = (ap | 0) == 2;
            P = (976 + (aJ << 2)) | 0;
            Q = (aA | 2 | 0) == 2;
            V = I & ($ ^ 1);
            R = (1040 + (aK << 2)) | 0;
            S = (1040 + (aJ << 2)) | 0;
            T = (976 + (aK << 2)) | 0;
            U = (aA | 0) != 1;
            K = $ & (((D | 0) != 0) & K);
            J = (a + 976) | 0;
            I = I ^ 1;
            b = v;
            G = 0;
            L = 0;
            ao = W(0.0);
            ad = W(0.0);
            while(1){
                b: do if (G >>> 0 < aI >>> 0) {
                    C = f[aH >> 2] | 0;
                    s = 0;
                    A = W(0.0);
                    z = W(0.0);
                    w = W(0.0);
                    v = W(0.0);
                    r = 0;
                    q = 0;
                    t = G;
                    while(1){
                        B = f[(C + (t << 2)) >> 2] | 0;
                        if ((f[(B + 36) >> 2] | 0) != 1 ? ((f[(B + 940) >> 2] = L), (f[(B + 24) >> 2] | 0) != 1) : 0) {
                            x = W(c3(B, aJ, aE));
                            X = f[P >> 2] | 0;
                            c = W(dc((B + 380 + (X << 3)) | 0, au));
                            y = W(j[(B + 504) >> 2]);
                            c = W(xv(c, y));
                            c = W(xt(W(dc((B + 364 + (X << 3)) | 0, au)), c));
                            if ($ & ((s | 0) != 0) & (W(x + W(z + c)) > b)) {
                                i = s;
                                x = A;
                                D = t;
                                break b;
                            }
                            x = W(x + c);
                            c = W(z + x);
                            x = W(A + x);
                            if (dF(B) | 0) {
                                w = W(w + W(dG(B)));
                                v = W(v - W(y * W(dH(B))));
                            }
                            if (q | 0) f[(q + 960) >> 2] = B;
                            f[(B + 960) >> 2] = 0;
                            s = (s + 1) | 0;
                            q = B;
                            r = (r | 0) == 0 ? B : r;
                        } else {
                            x = A;
                            c = z;
                        }
                        t = (t + 1) | 0;
                        if (t >>> 0 < aI >>> 0) {
                            A = x;
                            z = c;
                        } else {
                            i = s;
                            D = t;
                            break;
                        }
                    }
                } else {
                    i = 0;
                    x = W(0.0);
                    w = W(0.0);
                    v = W(0.0);
                    r = 0;
                    D = G;
                }
                while (0)
                X = (w > W(0.0)) & (w < W(1.0));
                E = X ? W(1.0) : w;
                X = (v > W(0.0)) & (v < W(1.0));
                A = X ? W(1.0) : v;
                do if (!N) {
                    if (!((x < ab) & ((bl(ab) | 0) ^ 1))) {
                        if (!((x > ac) & ((bl(ac) | 0) ^ 1))) {
                            if (!(d[((f[J >> 2] | 0) + 3) >> 0] | 0)) {
                                if (!(E == W(0.0)) ? !(W(dG(a)) == W(0.0)) : 0) {
                                    X = 53;
                                    break;
                                }
                                b = x;
                                X = 53;
                            } else X = 51;
                        } else {
                            b = ac;
                            X = 51;
                        }
                    } else {
                        b = ab;
                        X = 51;
                    }
                } else X = 51;
                while (0)
                if ((X | 0) == 51) {
                    X = 0;
                    if (bl(b) | 0) X = 53;
                    else {
                        F = W(b - x);
                        H = b;
                    }
                }
                if ((X | 0) == 53) {
                    X = 0;
                    if (x < W(0.0)) {
                        F = W(-x);
                        H = b;
                    } else {
                        F = W(0.0);
                        H = b;
                    }
                }
                if (!M ? ((ai = (r | 0) == 0), !ai) : 0) {
                    s = f[P >> 2] | 0;
                    t = F < W(0.0);
                    y = W(F / A);
                    B = F > W(0.0);
                    z = W(F / E);
                    w = W(0.0);
                    x = W(0.0);
                    b = W(0.0);
                    q = r;
                    do {
                        c = W(dc((q + 380 + (s << 3)) | 0, au));
                        v = W(dc((q + 364 + (s << 3)) | 0, au));
                        v = W(xv(c, W(xt(v, W(j[(q + 504) >> 2])))));
                        if (t) {
                            c = W(v * W(dH(q)));
                            if (c != W(-0.0) ? ((aM = W(v - W(y * c))), (aj = W(dK(q, aJ, aM, H, aE))), aM != aj) : 0) {
                                w = W(w - W(aj - v));
                                b = W(b + c);
                            }
                        } else if ((B ? ((ak = W(dG(q))), ak != W(0.0)) : 0) ? ((aM = W(v + W(z * ak))), (al = W(dK(q, aJ, aM, H, aE))), aM != al) : 0) {
                            w = W(w - W(al - v));
                            x = W(x - ak);
                        }
                        q = f[(q + 960) >> 2] | 0;
                    }while ((q | 0) != 0)
                    b = W(A + b);
                    v = W(F + w);
                    if (!ai) {
                        y = W(E + x);
                        t = f[P >> 2] | 0;
                        B = v < W(0.0);
                        C = b == W(0.0);
                        z = W(v / b);
                        s = v > W(0.0);
                        y = W(v / y);
                        b = W(0.0);
                        do {
                            aM = W(dc((r + 380 + (t << 3)) | 0, au));
                            w = W(dc((r + 364 + (t << 3)) | 0, au));
                            w = W(xv(aM, W(xt(w, W(j[(r + 504) >> 2])))));
                            if (B) {
                                aM = W(w * W(dH(r)));
                                v = W(-aM);
                                if (aM != W(-0.0)) {
                                    aM = W(z * v);
                                    v = W(dK(r, aJ, W(w + (C ? v : aM)), H, aE));
                                } else v = w;
                            } else if (s ? ((am = W(dG(r))), am != W(0.0)) : 0) v = W(dK(r, aJ, W(w + W(y * am)), H, aE));
                            else v = w;
                            b = W(b - W(v - w));
                            x = W(c3(r, aJ, aE));
                            c = W(c3(r, aK, aE));
                            v = W(v + x);
                            j[af >> 2] = v;
                            f[ah >> 2] = 1;
                            w = W(j[(r + 396) >> 2]);
                            c: do if (bl(w) | 0) {
                                q = bl(aq) | 0;
                                do if (!q) {
                                    if (K | (db(r, aK, aq) | 0 | I)) break;
                                    if ((dL(a, r) | 0) != 4) break;
                                    if ((f[((dM(r, aK) | 0) + 4) >> 2] | 0) == 3) break;
                                    if ((f[((dN(r, aK) | 0) + 4) >> 2] | 0) == 3) break;
                                    j[ae >> 2] = aq;
                                    f[ag >> 2] = 1;
                                    break c;
                                }
                                while (0)
                                if (db(r, aK, aq) | 0) {
                                    q = f[(r + 992 + (f[T >> 2] << 2)) >> 2] | 0;
                                    aM = W(c + W(dc(q, aq)));
                                    j[ae >> 2] = aM;
                                    q = U & ((f[(q + 4) >> 2] | 0) == 2);
                                    f[ag >> 2] = ((bl(aM) | 0 | q) ^ 1) & 1;
                                    break;
                                } else {
                                    j[ae >> 2] = aq;
                                    f[ag >> 2] = q ? 0 : 2;
                                    break;
                                }
                            } else {
                                aM = W(v - x);
                                E = W(aM / w);
                                aM = W(w * aM);
                                f[ag >> 2] = 1;
                                j[ae >> 2] = W(c + (aF ? E : aM));
                            }
                            while (0)
                            dO(r, aJ, H, aE, ah, af);
                            dO(r, aK, aq, aE, ag, ae);
                            do if (!(db(r, aK, aq) | 0) ? (dL(a, r) | 0) == 4 : 0) {
                                if ((f[((dM(r, aK) | 0) + 4) >> 2] | 0) == 3) {
                                    q = 0;
                                    break;
                                }
                                q = (f[((dN(r, aK) | 0) + 4) >> 2] | 0) != 3;
                            } else q = 0;
                            while (0)
                            aM = W(j[af >> 2]);
                            E = W(j[ae >> 2]);
                            aN = f[ah >> 2] | 0;
                            aO = f[ag >> 2] | 0;
                            c2(r, aF ? aM : E, aF ? E : aM, aG, aF ? aN : aO, aF ? aO : aN, aE, as, n & (q ^ 1), 3488, p) | 0;
                            d[Y >> 0] = d[Y >> 0] | d[(r + 508) >> 0];
                            r = f[(r + 960) >> 2] | 0;
                        }while ((r | 0) != 0)
                    } else b = W(0.0);
                } else b = W(0.0);
                b = W(F + b);
                aO = (b < W(0.0)) & 1;
                d[Y >> 0] = aO | g[Y >> 0];
                if (O & (b > W(0.0))) {
                    q = f[P >> 2] | 0;
                    if ((f[(a + 364 + (q << 3) + 4) >> 2] | 0) != 0 ? ((an = W(dc((a + 364 + (q << 3)) | 0, au))), an >= W(0.0)) : 0) v = W(xt(W(0.0), W(an - W(H - b))));
                    else v = W(0.0);
                } else v = b;
                B = G >>> 0 < D >>> 0;
                if (B) {
                    t = f[aH >> 2] | 0;
                    s = G;
                    q = 0;
                    do {
                        r = f[(t + (s << 2)) >> 2] | 0;
                        if (!(f[(r + 24) >> 2] | 0)) {
                            q = ((((f[((dM(r, aJ) | 0) + 4) >> 2] | 0) == 3) & 1) + q) | 0;
                            q = (q + (((f[((dN(r, aJ) | 0) + 4) >> 2] | 0) == 3) & 1)) | 0;
                        }
                        s = (s + 1) | 0;
                    }while ((s | 0) != (D | 0))
                    if (q) {
                        x = W(0.0);
                        c = W(0.0);
                    } else X = 101;
                } else X = 101;
                d: do if ((X | 0) == 101) {
                    X = 0;
                    switch(Z | 0){
                        case 1:
                            {
                                q = 0;
                                x = W(v * W(0.5));
                                c = W(0.0);
                                break d;
                            }
                        case 2:
                            {
                                q = 0;
                                x = v;
                                c = W(0.0);
                                break d;
                            }
                        case 3:
                            {
                                if (i >>> 0 <= 1) {
                                    q = 0;
                                    x = W(0.0);
                                    c = W(0.0);
                                    break d;
                                }
                                c = W(((i + -1) | 0) >>> 0);
                                q = 0;
                                x = W(0.0);
                                c = W(W(xt(v, W(0.0))) / c);
                                break d;
                            }
                        case 5:
                            {
                                c = W(v / W(((i + 1) | 0) >>> 0));
                                q = 0;
                                x = c;
                                break d;
                            }
                        case 4:
                            {
                                c = W(v / W(i >>> 0));
                                q = 0;
                                x = W(c * W(0.5));
                                break d;
                            }
                        default:
                            {
                                q = 0;
                                x = W(0.0);
                                c = W(0.0);
                                break d;
                            }
                    }
                }
                while (0)
                b = W(_ + x);
                if (B) {
                    w = W(v / W(q | 0));
                    s = f[aH >> 2] | 0;
                    r = G;
                    v = W(0.0);
                    do {
                        q = f[(s + (r << 2)) >> 2] | 0;
                        e: do if ((f[(q + 36) >> 2] | 0) != 1) {
                            switch(f[(q + 24) >> 2] | 0){
                                case 1:
                                    {
                                        if (dP(q, aJ) | 0) {
                                            if (!n) break e;
                                            aM = W(dQ(q, aJ, H));
                                            aM = W(aM + W(du(a, aJ)));
                                            aM = W(aM + W(dn(q, aJ, aE)));
                                            j[(q + 400 + (f[S >> 2] << 2)) >> 2] = aM;
                                            break e;
                                        }
                                        break;
                                    }
                                case 0:
                                    {
                                        aO = (f[((dM(q, aJ) | 0) + 4) >> 2] | 0) == 3;
                                        aM = W(w + b);
                                        b = aO ? aM : b;
                                        if (n) {
                                            aO = (q + 400 + (f[S >> 2] << 2)) | 0;
                                            j[aO >> 2] = W(b + W(j[aO >> 2]));
                                        }
                                        aO = (f[((dN(q, aJ) | 0) + 4) >> 2] | 0) == 3;
                                        aM = W(w + b);
                                        b = aO ? aM : b;
                                        if (M) {
                                            aM = W(c + W(c3(q, aJ, aE)));
                                            v = aq;
                                            b = W(b + W(aM + W(j[(q + 504) >> 2])));
                                            break e;
                                        } else {
                                            b = W(b + W(c + W(dR(q, aJ, aE))));
                                            v = W(xt(v, W(dR(q, aK, aE))));
                                            break e;
                                        }
                                    }
                                default:
                                    {}
                            }
                            if (n) {
                                aM = W(x + W(du(a, aJ)));
                                aO = (q + 400 + (f[S >> 2] << 2)) | 0;
                                j[aO >> 2] = W(aM + W(j[aO >> 2]));
                            }
                        }
                        while (0)
                        r = (r + 1) | 0;
                    }while ((r | 0) != (D | 0))
                } else v = W(0.0);
                c = W(aa + b);
                if (Q) x = W(W(dK(a, aK, W(az + v), ay, k)) - az);
                else x = aq;
                w = W(W(dK(a, aK, W(az + (V ? aq : v)), ay, k)) - az);
                if (B & n) {
                    r = G;
                    do {
                        s = f[((f[aH >> 2] | 0) + (r << 2)) >> 2] | 0;
                        do if ((f[(s + 36) >> 2] | 0) != 1) {
                            if ((f[(s + 24) >> 2] | 0) == 1) {
                                if (dP(s, aK) | 0) {
                                    aM = W(dQ(s, aK, aq));
                                    aM = W(aM + W(du(a, aK)));
                                    aM = W(aM + W(dn(s, aK, aE)));
                                    q = f[R >> 2] | 0;
                                    j[(s + 400 + (q << 2)) >> 2] = aM;
                                    if (!(bl(aM) | 0)) break;
                                } else q = f[R >> 2] | 0;
                                aM = W(du(a, aK));
                                j[(s + 400 + (q << 2)) >> 2] = W(aM + W(dn(s, aK, aE)));
                                break;
                            }
                            q = dL(a, s) | 0;
                            do if ((q | 0) == 4) {
                                if ((f[((dM(s, aK) | 0) + 4) >> 2] | 0) == 3) {
                                    X = 139;
                                    break;
                                }
                                if ((f[((dN(s, aK) | 0) + 4) >> 2] | 0) == 3) {
                                    X = 139;
                                    break;
                                }
                                if (db(s, aK, aq) | 0) {
                                    b = u;
                                    break;
                                }
                                aN = f[(s + 908 + (f[P >> 2] << 2)) >> 2] | 0;
                                f[ae >> 2] = aN;
                                b = W(j[(s + 396) >> 2]);
                                aO = bl(b) | 0;
                                v = ((f[m >> 2] = aN), W(j[m >> 2]));
                                if (aO) b = w;
                                else {
                                    F = W(c3(s, aK, aE));
                                    aM = W(v / b);
                                    b = W(b * v);
                                    b = W(F + (aF ? aM : b));
                                }
                                j[af >> 2] = b;
                                j[ae >> 2] = W(W(c3(s, aJ, aE)) + v);
                                f[ag >> 2] = 1;
                                f[ah >> 2] = 1;
                                dO(s, aJ, H, aE, ag, ae);
                                dO(s, aK, aq, aE, ah, af);
                                b = W(j[ae >> 2]);
                                F = W(j[af >> 2]);
                                aM = aF ? b : F;
                                b = aF ? F : b;
                                aO = ((bl(aM) | 0) ^ 1) & 1;
                                c2(s, aM, b, aG, aO, ((bl(b) | 0) ^ 1) & 1, aE, as, 1, 3493, p) | 0;
                                b = u;
                            } else X = 139;
                            while (0)
                            f: do if ((X | 0) == 139) {
                                X = 0;
                                b = W(x - W(dR(s, aK, aE)));
                                do if ((f[((dM(s, aK) | 0) + 4) >> 2] | 0) == 3) {
                                    if ((f[((dN(s, aK) | 0) + 4) >> 2] | 0) != 3) break;
                                    b = W(u + W(xt(W(0.0), W(b * W(0.5)))));
                                    break f;
                                }
                                while (0)
                                if ((f[((dN(s, aK) | 0) + 4) >> 2] | 0) == 3) {
                                    b = u;
                                    break;
                                }
                                if ((f[((dM(s, aK) | 0) + 4) >> 2] | 0) == 3) {
                                    b = W(u + W(xt(W(0.0), b)));
                                    break;
                                }
                                switch(q | 0){
                                    case 1:
                                        {
                                            b = u;
                                            break f;
                                        }
                                    case 2:
                                        {
                                            b = W(u + W(b * W(0.5)));
                                            break f;
                                        }
                                    default:
                                        {
                                            b = W(u + b);
                                            break f;
                                        }
                                }
                            }
                            while (0)
                            aM = W(ao + b);
                            aO = (s + 400 + (f[R >> 2] << 2)) | 0;
                            j[aO >> 2] = W(aM + W(j[aO >> 2]));
                        }
                        while (0)
                        r = (r + 1) | 0;
                    }while ((r | 0) != (D | 0))
                }
                ao = W(ao + w);
                ad = W(xt(ad, c));
                i = (L + 1) | 0;
                if (D >>> 0 >= aI >>> 0) break;
                else {
                    b = H;
                    G = D;
                    L = i;
                }
            }
            do if (n) {
                q = i >>> 0 > 1;
                if (!q ? !(dS(a) | 0) : 0) break;
                if (!(bl(aq) | 0)) {
                    b = W(aq - ao);
                    g: do switch(f[(a + 12) >> 2] | 0){
                        case 3:
                            {
                                u = W(u + b);
                                z = W(0.0);
                                break;
                            }
                        case 2:
                            {
                                u = W(u + W(b * W(0.5)));
                                z = W(0.0);
                                break;
                            }
                        case 4:
                            {
                                if (aq > ao) z = W(b / W(i >>> 0));
                                else z = W(0.0);
                                break;
                            }
                        case 7:
                            if (aq > ao) {
                                u = W(u + W(b / W((i << 1) >>> 0)));
                                z = W(b / W(i >>> 0));
                                z = q ? z : W(0.0);
                                break g;
                            } else {
                                u = W(u + W(b * W(0.5)));
                                z = W(0.0);
                                break g;
                            }
                        case 6:
                            {
                                z = W(b / W(L >>> 0));
                                z = (aq > ao) & q ? z : W(0.0);
                                break;
                            }
                        default:
                            z = W(0.0);
                    }
                    while (0)
                    if (i | 0) {
                        B = (1040 + (aK << 2)) | 0;
                        C = (976 + (aK << 2)) | 0;
                        t = 0;
                        r = 0;
                        while(1){
                            h: do if (r >>> 0 < aI >>> 0) {
                                v = W(0.0);
                                w = W(0.0);
                                b = W(0.0);
                                s = r;
                                while(1){
                                    q = f[((f[aH >> 2] | 0) + (s << 2)) >> 2] | 0;
                                    do if ((f[(q + 36) >> 2] | 0) != 1 ? (f[(q + 24) >> 2] | 0) == 0 : 0) {
                                        if ((f[(q + 940) >> 2] | 0) != (t | 0)) break h;
                                        if (dT(q, aK) | 0) {
                                            aM = W(j[(q + 908 + (f[C >> 2] << 2)) >> 2]);
                                            b = W(xt(b, W(aM + W(c3(q, aK, aE)))));
                                        }
                                        if ((dL(a, q) | 0) != 5) break;
                                        an = W(dU(q));
                                        an = W(an + W(dn(q, 0, aE)));
                                        aM = W(j[(q + 912) >> 2]);
                                        aM = W(W(aM + W(c3(q, 0, aE))) - an);
                                        an = W(xt(w, an));
                                        aM = W(xt(v, aM));
                                        v = aM;
                                        w = an;
                                        b = W(xt(b, W(an + aM)));
                                    }
                                    while (0)
                                    q = (s + 1) | 0;
                                    if (q >>> 0 < aI >>> 0) s = q;
                                    else {
                                        s = q;
                                        break;
                                    }
                                }
                            } else {
                                w = W(0.0);
                                b = W(0.0);
                                s = r;
                            }
                            while (0)
                            y = W(z + b);
                            c = u;
                            u = W(u + y);
                            if (r >>> 0 < s >>> 0) {
                                x = W(c + w);
                                q = r;
                                do {
                                    r = f[((f[aH >> 2] | 0) + (q << 2)) >> 2] | 0;
                                    i: do if ((f[(r + 36) >> 2] | 0) != 1 ? (f[(r + 24) >> 2] | 0) == 0 : 0) switch(dL(a, r) | 0){
                                        case 1:
                                            {
                                                aM = W(c + W(dn(r, aK, aE)));
                                                j[(r + 400 + (f[B >> 2] << 2)) >> 2] = aM;
                                                break i;
                                            }
                                        case 3:
                                            {
                                                aM = W(W(u - W(dp(r, aK, aE))) - W(j[(r + 908 + (f[C >> 2] << 2)) >> 2]));
                                                j[(r + 400 + (f[B >> 2] << 2)) >> 2] = aM;
                                                break i;
                                            }
                                        case 2:
                                            {
                                                aM = W(c + W(W(y - W(j[(r + 908 + (f[C >> 2] << 2)) >> 2])) * W(0.5)));
                                                j[(r + 400 + (f[B >> 2] << 2)) >> 2] = aM;
                                                break i;
                                            }
                                        case 4:
                                            {
                                                aM = W(c + W(dn(r, aK, aE)));
                                                j[(r + 400 + (f[B >> 2] << 2)) >> 2] = aM;
                                                if (db(r, aK, aq) | 0) break i;
                                                if (aF) {
                                                    v = W(j[(r + 908) >> 2]);
                                                    b = W(v + W(c3(r, aJ, aE)));
                                                    w = y;
                                                } else {
                                                    w = W(j[(r + 912) >> 2]);
                                                    w = W(w + W(c3(r, aK, aE)));
                                                    b = y;
                                                    v = W(j[(r + 908) >> 2]);
                                                }
                                                if (cW(b, v) | 0 ? cW(w, W(j[(r + 912) >> 2])) | 0 : 0) break i;
                                                c2(r, b, w, aG, 1, 1, aE, as, 1, 3501, p) | 0;
                                                break i;
                                            }
                                        case 5:
                                            {
                                                j[(r + 404) >> 2] = W(W(x - W(dU(r))) + W(dQ(r, 0, aq)));
                                                break i;
                                            }
                                        default:
                                            break i;
                                    }
                                    while (0)
                                    q = (q + 1) | 0;
                                }while ((q | 0) != (s | 0))
                            }
                            t = (t + 1) | 0;
                            if ((t | 0) == (i | 0)) break;
                            else r = s;
                        }
                    }
                }
            }
            while (0)
            j[(a + 908) >> 2] = W(dK(a, 2, at, k, k));
            j[(a + 912) >> 2] = W(dK(a, 0, ar, l, k));
            if ((ap | 0) != 0 ? ((aw = f[(a + 32) >> 2] | 0), (ax = (ap | 0) == 2), !(ax & ((aw | 0) != 2))) : 0) {
                if (ax & ((aw | 0) == 2)) {
                    b = W(av + H);
                    b = W(xt(W(xv(b, W(dV(a, aJ, ad, au)))), av));
                    X = 198;
                }
            } else {
                b = W(dK(a, aJ, ad, au, k));
                X = 198;
            }
            if ((X | 0) == 198) j[(a + 908 + (f[(976 + (aJ << 2)) >> 2] << 2)) >> 2] = b;
            if ((aA | 0) != 0 ? ((aC = f[(a + 32) >> 2] | 0), (aD = (aA | 0) == 2), !(aD & ((aC | 0) != 2))) : 0) {
                if (aD & ((aC | 0) == 2)) {
                    b = W(az + aq);
                    b = W(xt(W(xv(b, W(dV(a, aK, W(az + ao), ay)))), az));
                    X = 204;
                }
            } else {
                b = W(dK(a, aK, W(az + ao), ay, k));
                X = 204;
            }
            if ((X | 0) == 204) j[(a + 908 + (f[(976 + (aK << 2)) >> 2] << 2)) >> 2] = b;
            if (n) {
                if ((f[aB >> 2] | 0) == 2) {
                    r = (976 + (aK << 2)) | 0;
                    s = (1040 + (aK << 2)) | 0;
                    q = 0;
                    do {
                        t = bv(a, q) | 0;
                        if (!(f[(t + 24) >> 2] | 0)) {
                            aN = f[r >> 2] | 0;
                            aM = W(j[(a + 908 + (aN << 2)) >> 2]);
                            aO = (t + 400 + (f[s >> 2] << 2)) | 0;
                            aM = W(aM - W(j[aO >> 2]));
                            j[aO >> 2] = W(aM - W(j[(t + 908 + (aN << 2)) >> 2]));
                        }
                        q = (q + 1) | 0;
                    }while ((q | 0) != (aI | 0))
                }
                if (e | 0) {
                    q = aF ? ap : h;
                    do {
                        dW(a, e, aE, q, as, aG, p);
                        e = f[(e + 960) >> 2] | 0;
                    }while ((e | 0) != 0)
                }
                q = (aJ | 2 | 0) == 3;
                r = (aK | 2 | 0) == 3;
                if (q | r) {
                    e = 0;
                    do {
                        s = f[((f[aH >> 2] | 0) + (e << 2)) >> 2] | 0;
                        if ((f[(s + 36) >> 2] | 0) != 1) {
                            if (q) dX(a, s, aJ);
                            if (r) dX(a, s, aK);
                        }
                        e = (e + 1) | 0;
                    }while ((e | 0) != (aI | 0))
                }
            }
        } else dy(a, b, c, h, i, k, l);
        while (0)
        o = aL;
        return;
    }
    function c8(a, b) {
        a = a | 0;
        b = W(b);
        var c = 0;
        bo(a, b >= W(0.0), 3147);
        c = b == W(0.0);
        j[(a + 4) >> 2] = c ? W(0.0) : b;
        return;
    }
    function c9(a, b, c, e) {
        a = a | 0;
        b = W(b);
        c = W(c);
        e = e | 0;
        var g = bb, h = bb, i = 0, k = 0, l = 0;
        f[2278] = (f[2278] | 0) + 1;
        da(a);
        if (!(db(a, 2, b) | 0)) {
            g = W(dc((a + 380) | 0, b));
            if (!(g >= W(0.0))) {
                l = ((bl(b) | 0) ^ 1) & 1;
                g = b;
            } else l = 2;
        } else {
            g = W(dc(f[(a + 992) >> 2] | 0, b));
            l = 1;
            g = W(g + W(c3(a, 2, b)));
        }
        if (!(db(a, 0, c) | 0)) {
            h = W(dc((a + 388) | 0, c));
            if (!(h >= W(0.0))) {
                k = ((bl(c) | 0) ^ 1) & 1;
                h = c;
            } else k = 2;
        } else {
            h = W(dc(f[(a + 996) >> 2] | 0, c));
            k = 1;
            h = W(h + W(c3(a, 0, b)));
        }
        i = (a + 976) | 0;
        if (c2(a, g, h, e, l, k, b, c, 1, 3189, f[i >> 2] | 0) | 0 ? (dd(a, f[(a + 496) >> 2] | 0, b, c, b), de(a, W(j[((f[i >> 2] | 0) + 4) >> 2]), W(0.0), W(0.0)), d[11696] | 0) : 0) cX(a, 7);
        return;
    }
    function da(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        h = (i + 24) | 0;
        g = (i + 16) | 0;
        d = (i + 8) | 0;
        e = i;
        c = 0;
        do {
            b = (a + 380 + (c << 3)) | 0;
            if (!((f[(a + 380 + (c << 3) + 4) >> 2] | 0) != 0 ? ((j = b), (k = f[(j + 4) >> 2] | 0), (l = d), (f[l >> 2] = f[j >> 2]), (f[(l + 4) >> 2] = k), (l = (a + 364 + (c << 3)) | 0), (k = f[(l + 4) >> 2] | 0), (j = e), (f[j >> 2] = f[l >> 2]), (f[(j + 4) >> 2] = k), (f[g >> 2] = f[d >> 2]), (f[(g + 4) >> 2] = f[(d + 4) >> 2]), (f[h >> 2] = f[e >> 2]), (f[(h + 4) >> 2] = f[(e + 4) >> 2]), cV(g, h) | 0) : 0)) b = (a + 348 + (c << 3)) | 0;
            f[(a + 992 + (c << 2)) >> 2] = b;
            c = (c + 1) | 0;
        }while ((c | 0) != 2)
        o = i;
        return;
    }
    function db(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0;
        a = f[(a + 992 + (f[(976 + (b << 2)) >> 2] << 2)) >> 2] | 0;
        switch(f[(a + 4) >> 2] | 0){
            case 0:
            case 3:
                {
                    a = 0;
                    break;
                }
            case 1:
                {
                    if (W(j[a >> 2]) < W(0.0)) a = 0;
                    else d = 5;
                    break;
                }
            case 2:
                {
                    if (W(j[a >> 2]) < W(0.0)) a = 0;
                    else a = (bl(c) | 0) ^ 1;
                    break;
                }
            default:
                d = 5;
        }
        if ((d | 0) == 5) a = 1;
        return a | 0;
    }
    function dc(a, b) {
        a = a | 0;
        b = W(b);
        switch(f[(a + 4) >> 2] | 0){
            case 2:
                {
                    b = W(W(W(j[a >> 2]) * b) / W(100.0));
                    break;
                }
            case 1:
                {
                    b = W(j[a >> 2]);
                    break;
                }
            default:
                b = W(w);
        }
        return W(b);
    }
    function dd(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        d = W(d);
        e = W(e);
        var g = 0, h = bb;
        b = f[(a + 944) >> 2] | 0 ? b : 1;
        g = dt(f[(a + 4) >> 2] | 0, b) | 0;
        b = dB(g, b) | 0;
        c = W(d1(a, g, c));
        d = W(d1(a, b, d));
        h = W(c + W(dn(a, g, e)));
        j[(a + 400 + (f[(1040 + (g << 2)) >> 2] << 2)) >> 2] = h;
        c = W(c + W(dp(a, g, e)));
        j[(a + 400 + (f[(1e3 + (g << 2)) >> 2] << 2)) >> 2] = c;
        c = W(d + W(dn(a, b, e)));
        j[(a + 400 + (f[(1040 + (b << 2)) >> 2] << 2)) >> 2] = c;
        e = W(d + W(dp(a, b, e)));
        j[(a + 400 + (f[(1e3 + (b << 2)) >> 2] << 2)) >> 2] = e;
        return;
    }
    function de(a, b, c, d) {
        a = a | 0;
        b = W(b);
        c = W(c);
        d = W(d);
        var e = 0, g = 0, h = bb, i = bb, k = 0, l = 0, m = bb, n = 0, o = bb, p = bb, q = bb, r = bb;
        if (!(b == W(0.0))) {
            e = (a + 400) | 0;
            r = W(j[e >> 2]);
            g = (a + 404) | 0;
            q = W(j[g >> 2]);
            n = (a + 416) | 0;
            p = W(j[n >> 2]);
            l = (a + 420) | 0;
            h = W(j[l >> 2]);
            o = W(r + c);
            m = W(q + d);
            d = W(o + p);
            i = W(m + h);
            k = (f[(a + 988) >> 2] | 0) == 1;
            j[e >> 2] = W(cZ(r, b, 0, k));
            j[g >> 2] = W(cZ(q, b, 0, k));
            c = W(xx(W(p * b), W(1.0)));
            if (cW(c, W(0.0)) | 0) g = 0;
            else g = (cW(c, W(1.0)) | 0) ^ 1;
            c = W(xx(W(h * b), W(1.0)));
            if (cW(c, W(0.0)) | 0) e = 0;
            else e = (cW(c, W(1.0)) | 0) ^ 1;
            r = W(cZ(d, b, k & g, k & (g ^ 1)));
            j[n >> 2] = W(r - W(cZ(o, b, 0, k)));
            r = W(cZ(i, b, k & e, k & (e ^ 1)));
            j[l >> 2] = W(r - W(cZ(m, b, 0, k)));
            g = ((f[(a + 952) >> 2] | 0) - (f[(a + 948) >> 2] | 0)) >> 2;
            if (g | 0) {
                e = 0;
                do {
                    de(bv(a, e) | 0, b, o, m);
                    e = (e + 1) | 0;
                }while ((e | 0) != (g | 0))
            }
        }
        return;
    }
    function df(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        switch(c | 0){
            case 5:
            case 0:
                {
                    a = w1(f[489] | 0, d, e) | 0;
                    break;
                }
            default:
                a = xz(d, e) | 0;
        }
        return a | 0;
    }
    function dg(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        e = o;
        o = (o + 16) | 0;
        g = e;
        f[g >> 2] = d;
        dh(a, 0, b, c, g);
        o = e;
        return;
    }
    function dh(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        a = a | 0 ? a : 956;
        y4[f[(a + 8) >> 2] & 1](a, b, c, d, e) | 0;
        if ((c | 0) == 5) aW();
        else return;
    }
    function di(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d[(a + b) >> 0] = c & 1;
        return;
    }
    function dj(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        f[a >> 2] = 0;
        f[(a + 4) >> 2] = 0;
        f[(a + 8) >> 2] = 0;
        c = (b + 4) | 0;
        d = ((f[c >> 2] | 0) - (f[b >> 2] | 0)) >> 2;
        if (d | 0) {
            dk(a, d);
            dl(a, f[b >> 2] | 0, f[c >> 2] | 0, d);
        }
        return;
    }
    function dk(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        if ((dm(a) | 0) >>> 0 < b >>> 0) xA(a);
        if (b >>> 0 > 1073741823) aW();
        else {
            c = xH(b << 2) | 0;
            f[(a + 4) >> 2] = c;
            f[a >> 2] = c;
            f[(a + 8) >> 2] = c + (b << 2);
            return;
        }
    }
    function dl(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        d = (a + 4) | 0;
        a = (c - b) | 0;
        if ((a | 0) > 0) {
            xS(f[d >> 2] | 0, b | 0, a | 0) | 0;
            f[d >> 2] = (f[d >> 2] | 0) + ((a >>> 2) << 2);
        }
        return;
    }
    function dm(a) {
        a = a | 0;
        return 1073741823;
    }
    function dn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        if (dq(b) | 0 ? (f[(a + 96) >> 2] | 0) != 0 : 0) a = (a + 92) | 0;
        else a = bm((a + 60) | 0, f[(1040 + (b << 2)) >> 2] | 0, 992) | 0;
        return W(dr(a, c));
    }
    function dp(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        if (dq(b) | 0 ? (f[(a + 104) >> 2] | 0) != 0 : 0) a = (a + 100) | 0;
        else a = bm((a + 60) | 0, f[(1e3 + (b << 2)) >> 2] | 0, 992) | 0;
        return W(dr(a, c));
    }
    function dq(a) {
        a = a | 0;
        return ((a | 1 | 0) == 3) | 0;
    }
    function dr(a, b) {
        a = a | 0;
        b = W(b);
        if ((f[(a + 4) >> 2] | 0) == 3) b = W(0.0);
        else b = W(dc(a, b));
        return W(b);
    }
    function ds(a, b) {
        a = a | 0;
        b = b | 0;
        a = f[a >> 2] | 0;
        return ((a | 0) == 0 ? ((b | 0) > 1 ? b : 1) : a) | 0;
    }
    function dt(a, b) {
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
    function du(a, b) {
        a = a | 0;
        b = b | 0;
        var c = bb;
        if (!((dq(b) | 0 ? (f[(a + 312) >> 2] | 0) != 0 : 0) ? ((c = W(j[(a + 308) >> 2])), c >= W(0.0)) : 0)) c = W(xt(W(j[(bm((a + 276) | 0, f[(1040 + (b << 2)) >> 2] | 0, 992) | 0) >> 2]), W(0.0)));
        return W(c);
    }
    function dv(a, b) {
        a = a | 0;
        b = b | 0;
        var c = bb;
        if (!((dq(b) | 0 ? (f[(a + 320) >> 2] | 0) != 0 : 0) ? ((c = W(j[(a + 316) >> 2])), c >= W(0.0)) : 0)) c = W(xt(W(j[(bm((a + 276) | 0, f[(1e3 + (b << 2)) >> 2] | 0, 992) | 0) >> 2]), W(0.0)));
        return W(c);
    }
    function dw(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = bb;
        if (!((dq(b) | 0 ? (f[(a + 240) >> 2] | 0) != 0 : 0) ? ((d = W(dc((a + 236) | 0, c))), d >= W(0.0)) : 0)) d = W(xt(W(dc(bm((a + 204) | 0, f[(1040 + (b << 2)) >> 2] | 0, 992) | 0, c)), W(0.0)));
        return W(d);
    }
    function dx(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = bb;
        if (!((dq(b) | 0 ? (f[(a + 248) >> 2] | 0) != 0 : 0) ? ((d = W(dc((a + 244) | 0, c))), d >= W(0.0)) : 0)) d = W(xt(W(dc(bm((a + 204) | 0, f[(1e3 + (b << 2)) >> 2] | 0, 992) | 0, c)), W(0.0)));
        return W(d);
    }
    function dy(a, b, c, d, e, g, h) {
        a = a | 0;
        b = W(b);
        c = W(c);
        d = d | 0;
        e = e | 0;
        g = W(g);
        h = W(h);
        var i = bb, k = bb, l = bb, m = bb, n = bb, p = bb, q = 0, r = 0, s = 0;
        s = o;
        o = (o + 16) | 0;
        q = s;
        r = (a + 964) | 0;
        bz(a, (f[r >> 2] | 0) != 0, 3519);
        i = W(dE(a, 2, b));
        k = W(dE(a, 0, b));
        l = W(c3(a, 2, b));
        m = W(c3(a, 0, b));
        if (bl(b) | 0) n = b;
        else n = W(xt(W(0.0), W(W(b - l) - i)));
        if (bl(c) | 0) p = c;
        else p = W(xt(W(0.0), W(W(c - m) - k)));
        if (((d | 0) == 1) & ((e | 0) == 1)) {
            j[(a + 908) >> 2] = W(dK(a, 2, W(b - l), g, g));
            b = W(dK(a, 0, W(c - m), h, g));
        } else {
            y6[f[r >> 2] & 1](q, a, n, d, p, e);
            n = W(i + W(j[q >> 2]));
            p = W(b - l);
            j[(a + 908) >> 2] = W(dK(a, 2, (d | 2 | 0) == 2 ? n : p, g, g));
            p = W(k + W(j[(q + 4) >> 2]));
            b = W(c - m);
            b = W(dK(a, 0, (e | 2 | 0) == 2 ? p : b, h, g));
        }
        j[(a + 912) >> 2] = b;
        o = s;
        return;
    }
    function dz(a, b, c, d, e, f, g) {
        a = a | 0;
        b = W(b);
        c = W(c);
        d = d | 0;
        e = e | 0;
        f = W(f);
        g = W(g);
        var h = bb, i = bb, k = bb, l = bb;
        k = W(dE(a, 2, f));
        h = W(dE(a, 0, f));
        l = W(c3(a, 2, f));
        i = W(c3(a, 0, f));
        b = W(b - l);
        j[(a + 908) >> 2] = W(dK(a, 2, (d | 2 | 0) == 2 ? k : b, f, f));
        c = W(c - i);
        j[(a + 912) >> 2] = W(dK(a, 0, (e | 2 | 0) == 2 ? h : c, g, f));
        return;
    }
    function dA(a, b, c, d, e, f, g) {
        a = a | 0;
        b = W(b);
        c = W(c);
        d = d | 0;
        e = e | 0;
        f = W(f);
        g = W(g);
        var h = 0, i = bb, k = bb;
        h = (d | 0) == 2;
        if ((!((b <= W(0.0)) & h) ? !((c <= W(0.0)) & ((e | 0) == 2)) : 0) ? !(((d | 0) == 1) & ((e | 0) == 1)) : 0) a = 0;
        else {
            i = W(c3(a, 0, f));
            k = W(c3(a, 2, f));
            h = ((b < W(0.0)) & h) | (bl(b) | 0);
            b = W(b - k);
            j[(a + 908) >> 2] = W(dK(a, 2, h ? W(0.0) : b, f, f));
            b = W(c - i);
            h = ((c < W(0.0)) & ((e | 0) == 2)) | (bl(c) | 0);
            j[(a + 912) >> 2] = W(dK(a, 0, h ? W(0.0) : b, g, f));
            a = 1;
        }
        return a | 0;
    }
    function dB(a, b) {
        a = a | 0;
        b = b | 0;
        if (dY(a) | 0) a = dt(2, b) | 0;
        else a = 0;
        return a | 0;
    }
    function dC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        c = W(dw(a, b, c));
        return W(c + W(du(a, b)));
    }
    function dD(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        c = W(dx(a, b, c));
        return W(c + W(dv(a, b)));
    }
    function dE(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = bb;
        d = W(dC(a, b, c));
        return W(d + W(dD(a, b, c)));
    }
    function dF(a) {
        a = a | 0;
        if (!(f[(a + 24) >> 2] | 0)) {
            if (W(dG(a)) != W(0.0)) a = 1;
            else a = W(dH(a)) != W(0.0);
        } else a = 0;
        return a | 0;
    }
    function dG(a) {
        a = a | 0;
        var b = bb;
        if (f[(a + 944) >> 2] | 0) {
            b = W(j[(a + 44) >> 2]);
            if (bl(b) | 0) {
                b = W(j[(a + 40) >> 2]);
                a = (b > W(0.0)) & ((bl(b) | 0) ^ 1);
                return W(a ? b : W(0.0));
            }
        } else b = W(0.0);
        return W(b);
    }
    function dH(a) {
        a = a | 0;
        var b = bb, c = 0, e = bb;
        do if (f[(a + 944) >> 2] | 0) {
            b = W(j[(a + 48) >> 2]);
            if (bl(b) | 0) {
                c = d[((f[(a + 976) >> 2] | 0) + 2) >> 0] | 0;
                if ((c << 24) >> 24 == 0 ? ((e = W(j[(a + 40) >> 2])), (e < W(0.0)) & ((bl(e) | 0) ^ 1)) : 0) {
                    b = W(-e);
                    break;
                }
                b = (c << 24) >> 24 ? W(1.0) : W(0.0);
            }
        } else b = W(0.0);
        while (0)
        return W(b);
    }
    function dI(a) {
        a = a | 0;
        var b = 0, c = 0;
        xP((a + 400) | 0, 0, 540) | 0;
        d[(a + 985) >> 0] = 1;
        bG(a);
        c = bu(a) | 0;
        if (c | 0) {
            b = (a + 948) | 0;
            a = 0;
            do {
                dI(f[((f[b >> 2] | 0) + (a << 2)) >> 2] | 0);
                a = (a + 1) | 0;
            }while ((a | 0) != (c | 0))
        }
        return;
    }
    function dJ(a, b, c, d, e, g, h, i, k, l) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        d = d | 0;
        e = W(e);
        g = W(g);
        h = W(h);
        i = i | 0;
        k = k | 0;
        l = l | 0;
        var m = 0, n = bb, p = 0, q = 0, r = bb, s = bb, t = 0, u = bb, v = 0, x = bb, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
        G = o;
        o = (o + 16) | 0;
        A = (G + 12) | 0;
        B = (G + 8) | 0;
        C = (G + 4) | 0;
        D = G;
        F = dt(f[(a + 4) >> 2] | 0, k) | 0;
        y = dq(F) | 0;
        n = W(dc(dZ(b) | 0, y ? g : h));
        z = db(b, 2, g) | 0;
        E = db(b, 0, h) | 0;
        do if (!(bl(n) | 0) ? !(bl(y ? c : e) | 0) : 0) {
            m = (b + 504) | 0;
            if (!(bl(W(j[m >> 2])) | 0)) {
                if (!(d$(f[(b + 976) >> 2] | 0, 0) | 0)) break;
                if ((f[(b + 500) >> 2] | 0) == (f[2278] | 0)) break;
            }
            j[m >> 2] = W(xt(n, W(dE(b, F, g))));
        } else p = 7;
        while (0)
        do if ((p | 0) == 7) {
            v = y ^ 1;
            if (!(v | (z ^ 1))) {
                h = W(dc(f[(b + 992) >> 2] | 0, g));
                j[(b + 504) >> 2] = W(xt(h, W(dE(b, 2, g))));
                break;
            }
            if (!(y | (E ^ 1))) {
                h = W(dc(f[(b + 996) >> 2] | 0, h));
                j[(b + 504) >> 2] = W(xt(h, W(dE(b, 0, g))));
                break;
            }
            j[A >> 2] = W(w);
            j[B >> 2] = W(w);
            f[C >> 2] = 0;
            f[D >> 2] = 0;
            u = W(c3(b, 2, g));
            x = W(c3(b, 0, g));
            if (z) {
                r = W(u + W(dc(f[(b + 992) >> 2] | 0, g)));
                j[A >> 2] = r;
                f[C >> 2] = 1;
                q = 1;
            } else {
                q = 0;
                r = W(w);
            }
            if (E) {
                n = W(x + W(dc(f[(b + 996) >> 2] | 0, h)));
                j[B >> 2] = n;
                f[D >> 2] = 1;
                m = 1;
            } else {
                m = 0;
                n = W(w);
            }
            p = f[(a + 32) >> 2] | 0;
            if (!(y & ((p | 0) == 2))) {
                if (bl(r) | 0 ? !(bl(c) | 0) : 0) {
                    j[A >> 2] = c;
                    f[C >> 2] = 2;
                    q = 2;
                    r = c;
                }
            } else p = 2;
            if ((!(((p | 0) == 2) & v) ? bl(n) | 0 : 0) ? !(bl(e) | 0) : 0) {
                j[B >> 2] = e;
                f[D >> 2] = 2;
                m = 2;
                n = e;
            }
            s = W(j[(b + 396) >> 2]);
            t = bl(s) | 0;
            do if (!t) {
                if (((q | 0) == 1) & v) {
                    j[B >> 2] = W(W(r - u) / s);
                    f[D >> 2] = 1;
                    m = 1;
                    p = 1;
                    break;
                }
                if (y & ((m | 0) == 1)) {
                    j[A >> 2] = W(s * W(n - x));
                    f[C >> 2] = 1;
                    m = 1;
                    p = 1;
                } else p = q;
            } else p = q;
            while (0)
            H = bl(c) | 0;
            q = (dL(a, b) | 0) != 4;
            if (!(y | z | (((d | 0) != 1) | H) | (q | ((p | 0) == 1))) ? ((j[A >> 2] = c), (f[C >> 2] = 1), !t) : 0) {
                j[B >> 2] = W(W(c - u) / s);
                f[D >> 2] = 1;
                m = 1;
            }
            if (!(E | v | (((i | 0) != 1) | (bl(e) | 0)) | (q | ((m | 0) == 1))) ? ((j[B >> 2] = e), (f[D >> 2] = 1), !t) : 0) {
                j[A >> 2] = W(s * W(e - x));
                f[C >> 2] = 1;
            }
            dO(b, 2, g, g, C, A);
            dO(b, 0, h, g, D, B);
            c = W(j[A >> 2]);
            e = W(j[B >> 2]);
            c2(b, c, e, k, f[C >> 2] | 0, f[D >> 2] | 0, g, h, 0, 3565, l) | 0;
            h = W(j[(b + 908 + (f[(976 + (F << 2)) >> 2] << 2)) >> 2]);
            j[(b + 504) >> 2] = W(xt(h, W(dE(b, F, g))));
        }
        while (0)
        f[(b + 500) >> 2] = f[2278];
        o = G;
        return;
    }
    function dK(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        d = W(d);
        e = W(e);
        d = W(dV(a, b, c, d));
        return W(xt(d, W(dE(a, b, e))));
    }
    function dL(a, b) {
        a = a | 0;
        b = b | 0;
        b = (b + 20) | 0;
        b = f[((f[b >> 2] | 0) == 0 ? (a + 16) | 0 : b) >> 2] | 0;
        if ((b | 0) == 5 ? dY(f[(a + 4) >> 2] | 0) | 0 : 0) b = 1;
        return b | 0;
    }
    function dM(a, b) {
        a = a | 0;
        b = b | 0;
        if (dq(b) | 0 ? (f[(a + 96) >> 2] | 0) != 0 : 0) b = 4;
        else b = f[(1040 + (b << 2)) >> 2] | 0;
        return (a + 60 + (b << 3)) | 0;
    }
    function dN(a, b) {
        a = a | 0;
        b = b | 0;
        if (dq(b) | 0 ? (f[(a + 104) >> 2] | 0) != 0 : 0) b = 5;
        else b = f[(1e3 + (b << 2)) >> 2] | 0;
        return (a + 60 + (b << 3)) | 0;
    }
    function dO(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        d = W(d);
        e = e | 0;
        g = g | 0;
        c = W(dc((a + 380 + (f[(976 + (b << 2)) >> 2] << 3)) | 0, c));
        c = W(c + W(c3(a, b, d)));
        switch(f[e >> 2] | 0){
            case 2:
            case 1:
                {
                    e = bl(c) | 0;
                    d = W(j[g >> 2]);
                    j[g >> 2] = e | (d < c) ? d : c;
                    break;
                }
            case 0:
                {
                    if (!(bl(c) | 0)) {
                        f[e >> 2] = 2;
                        j[g >> 2] = c;
                    }
                    break;
                }
            default:
                {}
        }
        return;
    }
    function dP(a, b) {
        a = a | 0;
        b = b | 0;
        a = (a + 132) | 0;
        if (dq(b) | 0 ? (f[((bm(a, 4, 948) | 0) + 4) >> 2] | 0) != 0 : 0) a = 1;
        else a = (f[((bm(a, f[(1040 + (b << 2)) >> 2] | 0, 948) | 0) + 4) >> 2] | 0) != 0;
        return a | 0;
    }
    function dQ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0, e = 0;
        a = (a + 132) | 0;
        if (dq(b) | 0 ? ((d = bm(a, 4, 948) | 0), (f[(d + 4) >> 2] | 0) != 0) : 0) e = 4;
        else {
            d = bm(a, f[(1040 + (b << 2)) >> 2] | 0, 948) | 0;
            if (!(f[(d + 4) >> 2] | 0)) c = W(0.0);
            else e = 4;
        }
        if ((e | 0) == 4) c = W(dc(d, c));
        return W(c);
    }
    function dR(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = bb;
        d = W(j[(a + 908 + (f[(976 + (b << 2)) >> 2] << 2)) >> 2]);
        d = W(d + W(dn(a, b, c)));
        return W(d + W(dp(a, b, c)));
    }
    function dS(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        a: do if (!(dY(f[(a + 4) >> 2] | 0) | 0)) {
            if ((f[(a + 16) >> 2] | 0) != 5) {
                c = bu(a) | 0;
                if (!c) b = 0;
                else {
                    b = 0;
                    while(1){
                        d = bv(a, b) | 0;
                        if ((f[(d + 24) >> 2] | 0) == 0 ? (f[(d + 20) >> 2] | 0) == 5 : 0) {
                            b = 1;
                            break a;
                        }
                        b = (b + 1) | 0;
                        if (b >>> 0 >= c >>> 0) {
                            b = 0;
                            break;
                        }
                    }
                }
            } else b = 1;
        } else b = 0;
        while (0)
        return b | 0;
    }
    function dT(a, b) {
        a = a | 0;
        b = b | 0;
        var c = bb;
        c = W(j[(a + 908 + (f[(976 + (b << 2)) >> 2] << 2)) >> 2]);
        return ((c >= W(0.0)) & ((bl(c) | 0) ^ 1)) | 0;
    }
    function dU(a) {
        a = a | 0;
        var b = bb, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, k = bb;
        c = f[(a + 968) >> 2] | 0;
        if (!c) {
            g = bu(a) | 0;
            do if (g | 0) {
                c = 0;
                e = 0;
                while(1){
                    d = bv(a, e) | 0;
                    if (f[(d + 940) >> 2] | 0) {
                        h = 8;
                        break;
                    }
                    if ((f[(d + 24) >> 2] | 0) != 1) {
                        i = (dL(a, d) | 0) == 5;
                        if (i) {
                            c = d;
                            break;
                        } else c = (c | 0) == 0 ? d : c;
                    }
                    e = (e + 1) | 0;
                    if (e >>> 0 >= g >>> 0) {
                        h = 8;
                        break;
                    }
                }
                if ((h | 0) == 8) if (!c) break;
                b = W(dU(c));
                return W(b + W(j[(c + 404) >> 2]));
            }
            while (0)
            b = W(j[(a + 912) >> 2]);
        } else {
            k = W(j[(a + 908) >> 2]);
            b = W(j[(a + 912) >> 2]);
            b = W(yR[c & 0](a, k, b));
            bz(a, (bl(b) | 0) ^ 1, 3573);
        }
        return W(b);
    }
    function dV(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        d = W(d);
        var e = bb, f = 0;
        if (!(dY(b) | 0)) {
            if (dq(b) | 0) {
                b = 0;
                f = 3;
            } else {
                d = W(w);
                e = W(w);
            }
        } else {
            b = 1;
            f = 3;
        }
        if ((f | 0) == 3) {
            e = W(dc((a + 364 + (b << 3)) | 0, d));
            d = W(dc((a + 380 + (b << 3)) | 0, d));
        }
        f = (d < c) & ((d >= W(0.0)) & ((bl(d) | 0) ^ 1));
        c = f ? d : c;
        f = (e >= W(0.0)) & ((bl(e) | 0) ^ 1) & (c < e);
        return W(f ? e : c);
    }
    function dW(a, b, c, d, e, g, h) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        d = d | 0;
        e = W(e);
        g = g | 0;
        h = h | 0;
        var i = bb, k = bb, l = 0, m = 0, n = bb, o = bb, p = bb, q = 0, r = 0, s = 0, t = 0, u = bb, v = 0;
        s = dt(f[(a + 4) >> 2] | 0, g) | 0;
        q = dB(s, g) | 0;
        r = dq(s) | 0;
        n = W(c3(b, 2, c));
        o = W(c3(b, 0, c));
        if (!(db(b, 2, c) | 0)) {
            if (dP(b, 2) | 0 ? d_(b, 2) | 0 : 0) {
                i = W(j[(a + 908) >> 2]);
                k = W(du(a, 2));
                k = W(i - W(k + W(dv(a, 2))));
                i = W(dQ(b, 2, c));
                i = W(dK(b, 2, W(k - W(i + W(d0(b, 2, c)))), c, c));
            } else i = W(w);
        } else i = W(n + W(dc(f[(b + 992) >> 2] | 0, c)));
        if (!(db(b, 0, e) | 0)) {
            if (dP(b, 0) | 0 ? d_(b, 0) | 0 : 0) {
                k = W(j[(a + 912) >> 2]);
                u = W(du(a, 0));
                u = W(k - W(u + W(dv(a, 0))));
                k = W(dQ(b, 0, e));
                k = W(dK(b, 0, W(u - W(k + W(d0(b, 0, e)))), e, c));
            } else k = W(w);
        } else k = W(o + W(dc(f[(b + 996) >> 2] | 0, e)));
        l = bl(i) | 0;
        m = bl(k) | 0;
        do if (l ^ m ? ((p = W(j[(b + 396) >> 2])), !(bl(p) | 0)) : 0) if (l) {
            i = W(n + W(W(k - o) * p));
            break;
        } else {
            u = W(o + W(W(i - n) / p));
            k = m ? u : k;
            break;
        }
        while (0)
        m = bl(i) | 0;
        l = bl(k) | 0;
        if (m | l) {
            v = (m ^ 1) & 1;
            d = (c > W(0.0)) & (((d | 0) != 0) & m);
            i = r ? i : d ? c : i;
            c2(b, i, k, g, r ? v : d ? 2 : v, m & (l ^ 1) & 1, i, k, 0, 3623, h) | 0;
            i = W(j[(b + 908) >> 2]);
            i = W(i + W(c3(b, 2, c)));
            k = W(j[(b + 912) >> 2]);
            k = W(k + W(c3(b, 0, c)));
        }
        c2(b, i, k, g, 1, 1, i, k, 1, 3635, h) | 0;
        if (d_(b, s) | 0 ? !(dP(b, s) | 0) : 0) {
            v = f[(976 + (s << 2)) >> 2] | 0;
            u = W(j[(a + 908 + (v << 2)) >> 2]);
            u = W(u - W(j[(b + 908 + (v << 2)) >> 2]));
            u = W(u - W(dv(a, s)));
            u = W(u - W(dp(b, s, c)));
            u = W(u - W(d0(b, s, r ? c : e)));
            j[(b + 400 + (f[(1040 + (s << 2)) >> 2] << 2)) >> 2] = u;
        } else t = 21;
        do if ((t | 0) == 21) {
            if (!(dP(b, s) | 0) ? (f[(a + 8) >> 2] | 0) == 1 : 0) {
                v = f[(976 + (s << 2)) >> 2] | 0;
                u = W(j[(a + 908 + (v << 2)) >> 2]);
                u = W(W(u - W(j[(b + 908 + (v << 2)) >> 2])) * W(0.5));
                j[(b + 400 + (f[(1040 + (s << 2)) >> 2] << 2)) >> 2] = u;
                break;
            }
            if (!(dP(b, s) | 0) ? (f[(a + 8) >> 2] | 0) == 2 : 0) {
                v = f[(976 + (s << 2)) >> 2] | 0;
                u = W(j[(a + 908 + (v << 2)) >> 2]);
                u = W(u - W(j[(b + 908 + (v << 2)) >> 2]));
                j[(b + 400 + (f[(1040 + (s << 2)) >> 2] << 2)) >> 2] = u;
            }
        }
        while (0)
        if (d_(b, q) | 0 ? !(dP(b, q) | 0) : 0) {
            v = f[(976 + (q << 2)) >> 2] | 0;
            u = W(j[(a + 908 + (v << 2)) >> 2]);
            u = W(u - W(j[(b + 908 + (v << 2)) >> 2]));
            u = W(u - W(dv(a, q)));
            u = W(u - W(dp(b, q, c)));
            u = W(u - W(d0(b, q, r ? e : c)));
            j[(b + 400 + (f[(1040 + (q << 2)) >> 2] << 2)) >> 2] = u;
        } else t = 30;
        do if ((t | 0) == 30 ? !(dP(b, q) | 0) : 0) {
            if ((dL(a, b) | 0) == 2) {
                v = f[(976 + (q << 2)) >> 2] | 0;
                u = W(j[(a + 908 + (v << 2)) >> 2]);
                u = W(W(u - W(j[(b + 908 + (v << 2)) >> 2])) * W(0.5));
                j[(b + 400 + (f[(1040 + (q << 2)) >> 2] << 2)) >> 2] = u;
                break;
            }
            v = (dL(a, b) | 0) == 3;
            if (v ^ ((f[(a + 28) >> 2] | 0) == 2)) {
                v = f[(976 + (q << 2)) >> 2] | 0;
                u = W(j[(a + 908 + (v << 2)) >> 2]);
                u = W(u - W(j[(b + 908 + (v << 2)) >> 2]));
                j[(b + 400 + (f[(1040 + (q << 2)) >> 2] << 2)) >> 2] = u;
            }
        }
        while (0)
        return;
    }
    function dX(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = bb, e = 0;
        e = f[(976 + (c << 2)) >> 2] | 0;
        d = W(j[(b + 908 + (e << 2)) >> 2]);
        d = W(W(j[(a + 908 + (e << 2)) >> 2]) - d);
        d = W(d - W(j[(b + 400 + (f[(1040 + (c << 2)) >> 2] << 2)) >> 2]));
        j[(b + 400 + (f[(1e3 + (c << 2)) >> 2] << 2)) >> 2] = d;
        return;
    }
    function dY(a) {
        a = a | 0;
        return ((a | 1 | 0) == 1) | 0;
    }
    function dZ(a) {
        a = a | 0;
        var b = bb;
        switch(f[(a + 56) >> 2] | 0){
            case 0:
            case 3:
                {
                    b = W(j[(a + 40) >> 2]);
                    if ((b > W(0.0)) & ((bl(b) | 0) ^ 1)) a = d[((f[(a + 976) >> 2] | 0) + 2) >> 0] | 0 ? 1056 : 992;
                    else a = 1056;
                    break;
                }
            default:
                a = (a + 52) | 0;
        }
        return a | 0;
    }
    function d$(a, b) {
        a = a | 0;
        b = b | 0;
        return ((d[(a + b) >> 0] | 0) != 0) | 0;
    }
    function d_(a, b) {
        a = a | 0;
        b = b | 0;
        a = (a + 132) | 0;
        if (dq(b) | 0 ? (f[((bm(a, 5, 948) | 0) + 4) >> 2] | 0) != 0 : 0) a = 1;
        else a = (f[((bm(a, f[(1e3 + (b << 2)) >> 2] | 0, 948) | 0) + 4) >> 2] | 0) != 0;
        return a | 0;
    }
    function d0(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        var d = 0, e = 0;
        a = (a + 132) | 0;
        if (dq(b) | 0 ? ((d = bm(a, 5, 948) | 0), (f[(d + 4) >> 2] | 0) != 0) : 0) e = 4;
        else {
            d = bm(a, f[(1e3 + (b << 2)) >> 2] | 0, 948) | 0;
            if (!(f[(d + 4) >> 2] | 0)) c = W(0.0);
            else e = 4;
        }
        if ((e | 0) == 4) c = W(dc(d, c));
        return W(c);
    }
    function d1(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        if (dP(a, b) | 0) c = W(dQ(a, b, c));
        else c = W(-W(d0(a, b, c)));
        return W(c);
    }
    function d2(a) {
        a = W(a);
        return ((j[m >> 2] = a), f[m >> 2] | 0) | 0;
    }
    function d3(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 1073741823) aW();
            else {
                e = xH(b << 2) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 2)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 2);
        return;
    }
    function d4(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 2)) << 2)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function d5(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -4 - b) | 0) >>> 2) << 2);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function d6(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0;
        h = (a + 4) | 0;
        i = f[h >> 2] | 0;
        e = (i - d) | 0;
        g = e >> 2;
        a = (b + (g << 2)) | 0;
        if (a >>> 0 < c >>> 0) {
            d = i;
            do {
                f[d >> 2] = f[a >> 2];
                a = (a + 4) | 0;
                d = ((f[h >> 2] | 0) + 4) | 0;
                f[h >> 2] = d;
            }while (a >>> 0 < c >>> 0)
        }
        if (g | 0) xX((i + ((0 - g) << 2)) | 0, b | 0, e | 0) | 0;
        return;
    }
    function d7(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = (b + 4) | 0;
        j = f[i >> 2] | 0;
        e = f[a >> 2] | 0;
        h = c;
        g = (h - e) | 0;
        d = (j + ((0 - (g >> 2)) << 2)) | 0;
        f[i >> 2] = d;
        if ((g | 0) > 0) xS(d | 0, e | 0, g | 0) | 0;
        e = (a + 4) | 0;
        g = (b + 8) | 0;
        d = ((f[e >> 2] | 0) - h) | 0;
        if ((d | 0) > 0) {
            xS(f[g >> 2] | 0, c | 0, d | 0) | 0;
            f[g >> 2] = (f[g >> 2] | 0) + ((d >>> 2) << 2);
        }
        h = f[a >> 2] | 0;
        f[a >> 2] = f[i >> 2];
        f[i >> 2] = h;
        h = f[e >> 2] | 0;
        f[e >> 2] = f[g >> 2];
        f[g >> 2] = h;
        h = (a + 8) | 0;
        c = (b + 12) | 0;
        a = f[h >> 2] | 0;
        f[h >> 2] = f[c >> 2];
        f[c >> 2] = a;
        f[b >> 2] = f[i >> 2];
        return j | 0;
    }
    function d8(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        h = f[b >> 2] | 0;
        g = f[c >> 2] | 0;
        if ((h | 0) != (g | 0)) {
            e = (a + 8) | 0;
            c = ((((g + -4 - h) | 0) >>> 2) + 1) | 0;
            a = h;
            d = f[e >> 2] | 0;
            do {
                f[d >> 2] = f[a >> 2];
                d = ((f[e >> 2] | 0) + 4) | 0;
                f[e >> 2] = d;
                a = (a + 4) | 0;
            }while ((a | 0) != (g | 0))
            f[b >> 2] = h + (c << 2);
        }
        return;
    }
    function d9() {
        bj();
        return;
    }
    function ea() {
        var a = 0;
        a = xH(4) | 0;
        eb(a);
        return a | 0;
    }
    function eb(a) {
        a = a | 0;
        f[a >> 2] = bB() | 0;
        return;
    }
    function ec(a) {
        a = a | 0;
        if (a | 0) {
            ed(a);
            xJ(a);
        }
        return;
    }
    function ed(a) {
        a = a | 0;
        bD(f[a >> 2] | 0);
        return;
    }
    function ee(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        di(f[a >> 2] | 0, b, c);
        return;
    }
    function ef(a, b) {
        a = a | 0;
        b = W(b);
        c8(f[a >> 2] | 0, b);
        return;
    }
    function eg(a, b) {
        a = a | 0;
        b = b | 0;
        return d$(f[a >> 2] | 0, b) | 0;
    }
    function eh() {
        var a = 0;
        a = xH(8) | 0;
        ei(a, 0);
        return a | 0;
    }
    function ei(a, b) {
        a = a | 0;
        b = b | 0;
        if (!b) b = bp() | 0;
        else b = bn(f[b >> 2] | 0) | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = 0;
        bQ(b, a);
        return;
    }
    function ej(a) {
        a = a | 0;
        var b = 0;
        b = xH(8) | 0;
        ei(b, a);
        return b | 0;
    }
    function ek(a) {
        a = a | 0;
        if (a | 0) {
            el(a);
            xJ(a);
        }
        return;
    }
    function el(a) {
        a = a | 0;
        var b = 0;
        bs(f[a >> 2] | 0);
        b = (a + 4) | 0;
        a = f[b >> 2] | 0;
        f[b >> 2] = 0;
        if (a | 0) {
            em(a);
            xJ(a);
        }
        return;
    }
    function em(a) {
        a = a | 0;
        en(a);
        return;
    }
    function en(a) {
        a = a | 0;
        a = f[a >> 2] | 0;
        if (a | 0) a3(a | 0);
        return;
    }
    function eo(a) {
        a = a | 0;
        return bR(a) | 0;
    }
    function ep(a) {
        a = a | 0;
        var b = 0, c = 0;
        c = (a + 4) | 0;
        b = f[c >> 2] | 0;
        f[c >> 2] = 0;
        if (b | 0) {
            em(b);
            xJ(b);
        }
        by(f[a >> 2] | 0);
        return;
    }
    function eq(a, b) {
        a = a | 0;
        b = b | 0;
        bN(f[a >> 2] | 0, f[b >> 2] | 0);
        return;
    }
    function er(a, b) {
        a = a | 0;
        b = b | 0;
        b0(f[a >> 2] | 0, b);
        return;
    }
    function es(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        ce(f[a >> 2] | 0, b, W(c));
        return;
    }
    function et(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        cf(f[a >> 2] | 0, b, W(c));
        return;
    }
    function eu(a, b) {
        a = a | 0;
        b = b | 0;
        bW(f[a >> 2] | 0, b);
        return;
    }
    function ev(a, b) {
        a = a | 0;
        b = b | 0;
        bY(f[a >> 2] | 0, b);
        return;
    }
    function ew(a, b) {
        a = a | 0;
        b = b | 0;
        b$(f[a >> 2] | 0, b);
        return;
    }
    function ex(a, b) {
        a = a | 0;
        b = b | 0;
        bS(f[a >> 2] | 0, b);
        return;
    }
    function ey(a, b) {
        a = a | 0;
        b = b | 0;
        b2(f[a >> 2] | 0, b);
        return;
    }
    function ez(a, b) {
        a = a | 0;
        b = b | 0;
        bU(f[a >> 2] | 0, b);
        return;
    }
    function eA(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        ch(f[a >> 2] | 0, b, W(c));
        return;
    }
    function eB(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        ci(f[a >> 2] | 0, b, W(c));
        return;
    }
    function eC(a, b) {
        a = a | 0;
        b = b | 0;
        ck(f[a >> 2] | 0, b);
        return;
    }
    function eD(a, b) {
        a = a | 0;
        b = b | 0;
        b4(f[a >> 2] | 0, b);
        return;
    }
    function eE(a, b) {
        a = a | 0;
        b = b | 0;
        b6(f[a >> 2] | 0, b);
        return;
    }
    function eF(a, b) {
        a = a | 0;
        b = +b;
        b8(f[a >> 2] | 0, W(b));
        return;
    }
    function eG(a, b) {
        a = a | 0;
        b = +b;
        cb(f[a >> 2] | 0, W(b));
        return;
    }
    function eH(a, b) {
        a = a | 0;
        b = +b;
        cc(f[a >> 2] | 0, W(b));
        return;
    }
    function eI(a, b) {
        a = a | 0;
        b = +b;
        b9(f[a >> 2] | 0, W(b));
        return;
    }
    function eJ(a, b) {
        a = a | 0;
        b = +b;
        ca(f[a >> 2] | 0, W(b));
        return;
    }
    function eK(a, b) {
        a = a | 0;
        b = +b;
        cq(f[a >> 2] | 0, W(b));
        return;
    }
    function eL(a, b) {
        a = a | 0;
        b = +b;
        cr(f[a >> 2] | 0, W(b));
        return;
    }
    function eM(a) {
        a = a | 0;
        cs(f[a >> 2] | 0);
        return;
    }
    function eN(a, b) {
        a = a | 0;
        b = +b;
        cu(f[a >> 2] | 0, W(b));
        return;
    }
    function eO(a, b) {
        a = a | 0;
        b = +b;
        cv(f[a >> 2] | 0, W(b));
        return;
    }
    function eP(a) {
        a = a | 0;
        cw(f[a >> 2] | 0);
        return;
    }
    function eQ(a, b) {
        a = a | 0;
        b = +b;
        cy(f[a >> 2] | 0, W(b));
        return;
    }
    function eR(a, b) {
        a = a | 0;
        b = +b;
        cz(f[a >> 2] | 0, W(b));
        return;
    }
    function eS(a, b) {
        a = a | 0;
        b = +b;
        cB(f[a >> 2] | 0, W(b));
        return;
    }
    function eT(a, b) {
        a = a | 0;
        b = +b;
        cC(f[a >> 2] | 0, W(b));
        return;
    }
    function eU(a, b) {
        a = a | 0;
        b = +b;
        cE(f[a >> 2] | 0, W(b));
        return;
    }
    function eV(a, b) {
        a = a | 0;
        b = +b;
        cF(f[a >> 2] | 0, W(b));
        return;
    }
    function eW(a, b) {
        a = a | 0;
        b = +b;
        cH(f[a >> 2] | 0, W(b));
        return;
    }
    function eX(a, b) {
        a = a | 0;
        b = +b;
        cI(f[a >> 2] | 0, W(b));
        return;
    }
    function eY(a, b) {
        a = a | 0;
        b = +b;
        cK(f[a >> 2] | 0, W(b));
        return;
    }
    function eZ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        co(f[a >> 2] | 0, b, W(c));
        return;
    }
    function e$(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        cl(f[a >> 2] | 0, b, W(c));
        return;
    }
    function e_(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        cm(f[a >> 2] | 0, b, W(c));
        return;
    }
    function e0(a) {
        a = a | 0;
        return b1(f[a >> 2] | 0) | 0;
    }
    function e1(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        d = o;
        o = (o + 16) | 0;
        e = d;
        cg(e, f[b >> 2] | 0, c);
        e2(a, e);
        o = d;
        return;
    }
    function e2(a, b) {
        a = a | 0;
        b = b | 0;
        e3(a, f[(b + 4) >> 2] | 0, +W(j[b >> 2]));
        return;
    }
    function e3(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        f[a >> 2] = b;
        k[(a + 8) >> 3] = c;
        return;
    }
    function e4(a) {
        a = a | 0;
        return bX(f[a >> 2] | 0) | 0;
    }
    function e5(a) {
        a = a | 0;
        return bZ(f[a >> 2] | 0) | 0;
    }
    function e6(a) {
        a = a | 0;
        return b_(f[a >> 2] | 0) | 0;
    }
    function e7(a) {
        a = a | 0;
        return bT(f[a >> 2] | 0) | 0;
    }
    function e8(a) {
        a = a | 0;
        return b3(f[a >> 2] | 0) | 0;
    }
    function e9(a) {
        a = a | 0;
        return bV(f[a >> 2] | 0) | 0;
    }
    function fa(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        d = o;
        o = (o + 16) | 0;
        e = d;
        cj(e, f[b >> 2] | 0, c);
        e2(a, e);
        o = d;
        return;
    }
    function fb(a) {
        a = a | 0;
        return b5(f[a >> 2] | 0) | 0;
    }
    function fc(a) {
        a = a | 0;
        return b7(f[a >> 2] | 0) | 0;
    }
    function fd(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        cd(d, f[b >> 2] | 0);
        e2(a, d);
        o = c;
        return;
    }
    function fe(a) {
        a = a | 0;
        return +(+W(bO(f[a >> 2] | 0)));
    }
    function ff(a) {
        a = a | 0;
        return +(+W(bP(f[a >> 2] | 0)));
    }
    function fg(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        ct(d, f[b >> 2] | 0);
        e2(a, d);
        o = c;
        return;
    }
    function fh(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        cx(d, f[b >> 2] | 0);
        e2(a, d);
        o = c;
        return;
    }
    function fi(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        cA(d, f[b >> 2] | 0);
        e2(a, d);
        o = c;
        return;
    }
    function fj(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        cD(d, f[b >> 2] | 0);
        e2(a, d);
        o = c;
        return;
    }
    function fk(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        cG(d, f[b >> 2] | 0);
        e2(a, d);
        o = c;
        return;
    }
    function fl(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        cJ(d, f[b >> 2] | 0);
        e2(a, d);
        o = c;
        return;
    }
    function fm(a) {
        a = a | 0;
        return +(+W(cL(f[a >> 2] | 0)));
    }
    function fn(a, b) {
        a = a | 0;
        b = b | 0;
        return +(+W(cp(f[a >> 2] | 0, b)));
    }
    function fo(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        d = o;
        o = (o + 16) | 0;
        e = d;
        cn(e, f[b >> 2] | 0, c);
        e2(a, e);
        o = d;
        return;
    }
    function fp(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        bF(f[a >> 2] | 0, f[b >> 2] | 0, c);
        return;
    }
    function fq(a, b) {
        a = a | 0;
        b = b | 0;
        bx(f[a >> 2] | 0, f[b >> 2] | 0);
        return;
    }
    function fr(a) {
        a = a | 0;
        return bu(f[a >> 2] | 0) | 0;
    }
    function fs(a) {
        a = a | 0;
        a = bK(f[a >> 2] | 0) | 0;
        if (!a) a = 0;
        else a = eo(a) | 0;
        return a | 0;
    }
    function ft(a, b) {
        a = a | 0;
        b = b | 0;
        a = bv(f[a >> 2] | 0, b) | 0;
        if (!a) a = 0;
        else a = eo(a) | 0;
        return a | 0;
    }
    function fu(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        d = xH(4) | 0;
        fv(d, b);
        c = (a + 4) | 0;
        b = f[c >> 2] | 0;
        f[c >> 2] = d;
        if (b | 0) {
            em(b);
            xJ(b);
        }
        bE(f[a >> 2] | 0, 1);
        return;
    }
    function fv(a, b) {
        a = a | 0;
        b = b | 0;
        fP(a, b);
        return;
    }
    function fw(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        d = d | 0;
        e = W(e);
        f = f | 0;
        var g = 0, h = 0;
        g = o;
        o = (o + 16) | 0;
        h = g;
        fx(h, bR(b) | 0, +c, d, +e, f);
        j[a >> 2] = W(+k[h >> 3]);
        j[(a + 4) >> 2] = W(+k[(h + 8) >> 3]);
        o = g;
        return;
    }
    function fx(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = d | 0;
        e = +e;
        g = g | 0;
        var h = 0, i = 0, j = 0, l = 0, m = 0;
        h = o;
        o = (o + 32) | 0;
        m = (h + 8) | 0;
        l = (h + 20) | 0;
        j = h;
        i = (h + 16) | 0;
        k[m >> 3] = c;
        f[l >> 2] = d;
        k[j >> 3] = e;
        f[i >> 2] = g;
        fy(a, f[(b + 4) >> 2] | 0, m, l, j, i);
        o = h;
        return;
    }
    function fy(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        var h = 0, i = 0;
        h = o;
        o = (o + 16) | 0;
        i = h;
        wt(i);
        b = fz(b) | 0;
        fA(a, b, +k[c >> 3], f[d >> 2] | 0, +k[e >> 3], f[g >> 2] | 0);
        wv(i);
        o = h;
        return;
    }
    function fz(a) {
        a = a | 0;
        return f[a >> 2] | 0;
    }
    function fA(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = d | 0;
        e = +e;
        f = f | 0;
        var g = 0;
        g = fC(fB() | 0) | 0;
        c = +fD(c);
        d = fE(d) | 0;
        e = +fD(e);
        fF(a, a5(0, g | 0, b | 0, +c, d | 0, +e, fE(f) | 0) | 0);
        return;
    }
    function fB() {
        var a = 0;
        if (!(d[7608] | 0)) {
            fM(9120);
            a = 7608;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 9120;
    }
    function fC(a) {
        a = a | 0;
        return f[(a + 8) >> 2] | 0;
    }
    function fD(a) {
        a = +a;
        return +(+fL(a));
    }
    function fE(a) {
        a = a | 0;
        return fK(a) | 0;
    }
    function fF(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        e = o;
        o = (o + 32) | 0;
        c = e;
        d = b;
        if (!(d & 1)) {
            f[a >> 2] = f[b >> 2];
            f[(a + 4) >> 2] = f[(b + 4) >> 2];
            f[(a + 8) >> 2] = f[(b + 8) >> 2];
            f[(a + 12) >> 2] = f[(b + 12) >> 2];
        } else {
            fG(c, 0);
            aM(d | 0, c | 0) | 0;
            fH(a, c);
            fI(c);
        }
        o = e;
        return;
    }
    function fG(a, b) {
        a = a | 0;
        b = b | 0;
        fJ(a, b);
        f[(a + 8) >> 2] = 0;
        d[(a + 24) >> 0] = 0;
        return;
    }
    function fH(a, b) {
        a = a | 0;
        b = b | 0;
        b = (b + 8) | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = f[(b + 4) >> 2];
        f[(a + 8) >> 2] = f[(b + 8) >> 2];
        f[(a + 12) >> 2] = f[(b + 12) >> 2];
        return;
    }
    function fI(a) {
        a = a | 0;
        d[(a + 24) >> 0] = 0;
        return;
    }
    function fJ(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = b;
        return;
    }
    function fK(a) {
        a = a | 0;
        return a | 0;
    }
    function fL(a) {
        a = +a;
        return +a;
    }
    function fM(a) {
        a = a | 0;
        fO(a, fN() | 0, 4);
        return;
    }
    function fN() {
        return 1064;
    }
    function fO(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        f[(a + 8) >> 2] = a1(b | 0, (c + 1) | 0) | 0;
        return;
    }
    function fP(a, b) {
        a = a | 0;
        b = b | 0;
        b = f[b >> 2] | 0;
        f[a >> 2] = b;
        aD(b | 0);
        return;
    }
    function fQ(a) {
        a = a | 0;
        var b = 0, c = 0;
        c = (a + 4) | 0;
        b = f[c >> 2] | 0;
        f[c >> 2] = 0;
        if (b | 0) {
            em(b);
            xJ(b);
        }
        bE(f[a >> 2] | 0, 0);
        return;
    }
    function fR(a) {
        a = a | 0;
        bL(f[a >> 2] | 0);
        return;
    }
    function fS(a) {
        a = a | 0;
        return bM(f[a >> 2] | 0) | 0;
    }
    function fT(a, b, c, d) {
        a = a | 0;
        b = +b;
        c = +c;
        d = d | 0;
        c9(f[a >> 2] | 0, W(b), W(c), d);
        return;
    }
    function fU(a) {
        a = a | 0;
        return +(+W(cM(f[a >> 2] | 0)));
    }
    function fV(a) {
        a = a | 0;
        return +(+W(cO(f[a >> 2] | 0)));
    }
    function fW(a) {
        a = a | 0;
        return +(+W(cN(f[a >> 2] | 0)));
    }
    function fX(a) {
        a = a | 0;
        return +(+W(cP(f[a >> 2] | 0)));
    }
    function fY(a) {
        a = a | 0;
        return +(+W(cQ(f[a >> 2] | 0)));
    }
    function fZ(a) {
        a = a | 0;
        return +(+W(cR(f[a >> 2] | 0)));
    }
    function f$(a, b) {
        a = a | 0;
        b = b | 0;
        k[a >> 3] = +W(cM(f[b >> 2] | 0));
        k[(a + 8) >> 3] = +W(cO(f[b >> 2] | 0));
        k[(a + 16) >> 3] = +W(cN(f[b >> 2] | 0));
        k[(a + 24) >> 3] = +W(cP(f[b >> 2] | 0));
        k[(a + 32) >> 3] = +W(cQ(f[b >> 2] | 0));
        k[(a + 40) >> 3] = +W(cR(f[b >> 2] | 0));
        return;
    }
    function f_(a, b) {
        a = a | 0;
        b = b | 0;
        return +(+W(cS(f[a >> 2] | 0, b)));
    }
    function f0(a, b) {
        a = a | 0;
        b = b | 0;
        return +(+W(cT(f[a >> 2] | 0, b)));
    }
    function f1(a, b) {
        a = a | 0;
        b = b | 0;
        return +(+W(cU(f[a >> 2] | 0, b)));
    }
    function f2() {
        return bA() | 0;
    }
    function f3() {
        f4();
        f5();
        f6();
        f7();
        f8();
        f9();
        return;
    }
    function f4() {
        rH(11713, 4938, 1);
        return;
    }
    function f5() {
        q3(10448);
        return;
    }
    function f6() {
        qL(10408);
        return;
    }
    function f7() {
        qa(10324);
        return;
    }
    function f8() {
        on(10096);
        return;
    }
    function f9() {
        ga(9132);
        return;
    }
    function ga(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, $ = 0, _ = 0, aa = 0, ab = 0, ac = 0, ad = 0, ae = 0, af = 0, ag = 0, ah = 0, ai = 0, aj = 0, ak = 0, al = 0, am = 0, an = 0, ao = 0, ap = 0, aq = 0, ar = 0, as = 0, at = 0, au = 0, av = 0, aw = 0, ax = 0, ay = 0, az = 0, aA = 0, aB = 0, aC = 0, aD = 0, aE = 0, aF = 0, aG = 0;
        b = o;
        o = (o + 672) | 0;
        c = (b + 656) | 0;
        aG = (b + 648) | 0;
        aF = (b + 640) | 0;
        aE = (b + 632) | 0;
        aD = (b + 624) | 0;
        aC = (b + 616) | 0;
        aB = (b + 608) | 0;
        aA = (b + 600) | 0;
        az = (b + 592) | 0;
        ay = (b + 584) | 0;
        ax = (b + 576) | 0;
        aw = (b + 568) | 0;
        av = (b + 560) | 0;
        au = (b + 552) | 0;
        at = (b + 544) | 0;
        as = (b + 536) | 0;
        ar = (b + 528) | 0;
        aq = (b + 520) | 0;
        ap = (b + 512) | 0;
        ao = (b + 504) | 0;
        an = (b + 496) | 0;
        am = (b + 488) | 0;
        al = (b + 480) | 0;
        ak = (b + 472) | 0;
        aj = (b + 464) | 0;
        ai = (b + 456) | 0;
        ah = (b + 448) | 0;
        ag = (b + 440) | 0;
        af = (b + 432) | 0;
        ae = (b + 424) | 0;
        ad = (b + 416) | 0;
        ac = (b + 408) | 0;
        ab = (b + 400) | 0;
        aa = (b + 392) | 0;
        _ = (b + 384) | 0;
        $ = (b + 376) | 0;
        Z = (b + 368) | 0;
        Y = (b + 360) | 0;
        X = (b + 352) | 0;
        W = (b + 344) | 0;
        V = (b + 336) | 0;
        U = (b + 328) | 0;
        T = (b + 320) | 0;
        S = (b + 312) | 0;
        R = (b + 304) | 0;
        Q = (b + 296) | 0;
        P = (b + 288) | 0;
        O = (b + 280) | 0;
        N = (b + 272) | 0;
        M = (b + 264) | 0;
        L = (b + 256) | 0;
        K = (b + 248) | 0;
        J = (b + 240) | 0;
        I = (b + 232) | 0;
        H = (b + 224) | 0;
        G = (b + 216) | 0;
        F = (b + 208) | 0;
        E = (b + 200) | 0;
        D = (b + 192) | 0;
        C = (b + 184) | 0;
        B = (b + 176) | 0;
        A = (b + 168) | 0;
        z = (b + 160) | 0;
        y = (b + 152) | 0;
        x = (b + 144) | 0;
        w = (b + 136) | 0;
        v = (b + 128) | 0;
        u = (b + 120) | 0;
        t = (b + 112) | 0;
        s = (b + 104) | 0;
        r = (b + 96) | 0;
        q = (b + 88) | 0;
        p = (b + 80) | 0;
        n = (b + 72) | 0;
        m = (b + 64) | 0;
        l = (b + 56) | 0;
        k = (b + 48) | 0;
        j = (b + 40) | 0;
        i = (b + 32) | 0;
        h = (b + 24) | 0;
        g = (b + 16) | 0;
        e = (b + 8) | 0;
        d = b;
        gb(a, 3646);
        gc(a, 3651, 2) | 0;
        gd(a, 3665, 2) | 0;
        ge(a, 3682, 18) | 0;
        f[aG >> 2] = 19;
        f[(aG + 4) >> 2] = 0;
        f[c >> 2] = f[aG >> 2];
        f[(c + 4) >> 2] = f[(aG + 4) >> 2];
        gf(a, 3690, c) | 0;
        f[aF >> 2] = 1;
        f[(aF + 4) >> 2] = 0;
        f[c >> 2] = f[aF >> 2];
        f[(c + 4) >> 2] = f[(aF + 4) >> 2];
        gg(a, 3696, c) | 0;
        f[aE >> 2] = 2;
        f[(aE + 4) >> 2] = 0;
        f[c >> 2] = f[aE >> 2];
        f[(c + 4) >> 2] = f[(aE + 4) >> 2];
        gh(a, 3706, c) | 0;
        f[aD >> 2] = 1;
        f[(aD + 4) >> 2] = 0;
        f[c >> 2] = f[aD >> 2];
        f[(c + 4) >> 2] = f[(aD + 4) >> 2];
        gi(a, 3722, c) | 0;
        f[aC >> 2] = 2;
        f[(aC + 4) >> 2] = 0;
        f[c >> 2] = f[aC >> 2];
        f[(c + 4) >> 2] = f[(aC + 4) >> 2];
        gi(a, 3734, c) | 0;
        f[aB >> 2] = 3;
        f[(aB + 4) >> 2] = 0;
        f[c >> 2] = f[aB >> 2];
        f[(c + 4) >> 2] = f[(aB + 4) >> 2];
        gh(a, 3753, c) | 0;
        f[aA >> 2] = 4;
        f[(aA + 4) >> 2] = 0;
        f[c >> 2] = f[aA >> 2];
        f[(c + 4) >> 2] = f[(aA + 4) >> 2];
        gh(a, 3769, c) | 0;
        f[az >> 2] = 5;
        f[(az + 4) >> 2] = 0;
        f[c >> 2] = f[az >> 2];
        f[(c + 4) >> 2] = f[(az + 4) >> 2];
        gh(a, 3783, c) | 0;
        f[ay >> 2] = 6;
        f[(ay + 4) >> 2] = 0;
        f[c >> 2] = f[ay >> 2];
        f[(c + 4) >> 2] = f[(ay + 4) >> 2];
        gh(a, 3796, c) | 0;
        f[ax >> 2] = 7;
        f[(ax + 4) >> 2] = 0;
        f[c >> 2] = f[ax >> 2];
        f[(c + 4) >> 2] = f[(ax + 4) >> 2];
        gh(a, 3813, c) | 0;
        f[aw >> 2] = 8;
        f[(aw + 4) >> 2] = 0;
        f[c >> 2] = f[aw >> 2];
        f[(c + 4) >> 2] = f[(aw + 4) >> 2];
        gh(a, 3825, c) | 0;
        f[av >> 2] = 3;
        f[(av + 4) >> 2] = 0;
        f[c >> 2] = f[av >> 2];
        f[(c + 4) >> 2] = f[(av + 4) >> 2];
        gi(a, 3843, c) | 0;
        f[au >> 2] = 4;
        f[(au + 4) >> 2] = 0;
        f[c >> 2] = f[au >> 2];
        f[(c + 4) >> 2] = f[(au + 4) >> 2];
        gi(a, 3853, c) | 0;
        f[at >> 2] = 9;
        f[(at + 4) >> 2] = 0;
        f[c >> 2] = f[at >> 2];
        f[(c + 4) >> 2] = f[(at + 4) >> 2];
        gh(a, 3870, c) | 0;
        f[as >> 2] = 10;
        f[(as + 4) >> 2] = 0;
        f[c >> 2] = f[as >> 2];
        f[(c + 4) >> 2] = f[(as + 4) >> 2];
        gh(a, 3884, c) | 0;
        f[ar >> 2] = 11;
        f[(ar + 4) >> 2] = 0;
        f[c >> 2] = f[ar >> 2];
        f[(c + 4) >> 2] = f[(ar + 4) >> 2];
        gh(a, 3896, c) | 0;
        f[aq >> 2] = 1;
        f[(aq + 4) >> 2] = 0;
        f[c >> 2] = f[aq >> 2];
        f[(c + 4) >> 2] = f[(aq + 4) >> 2];
        gj(a, 3907, c) | 0;
        f[ap >> 2] = 2;
        f[(ap + 4) >> 2] = 0;
        f[c >> 2] = f[ap >> 2];
        f[(c + 4) >> 2] = f[(ap + 4) >> 2];
        gj(a, 3915, c) | 0;
        f[ao >> 2] = 3;
        f[(ao + 4) >> 2] = 0;
        f[c >> 2] = f[ao >> 2];
        f[(c + 4) >> 2] = f[(ao + 4) >> 2];
        gj(a, 3928, c) | 0;
        f[an >> 2] = 4;
        f[(an + 4) >> 2] = 0;
        f[c >> 2] = f[an >> 2];
        f[(c + 4) >> 2] = f[(an + 4) >> 2];
        gj(a, 3948, c) | 0;
        f[am >> 2] = 5;
        f[(am + 4) >> 2] = 0;
        f[c >> 2] = f[am >> 2];
        f[(c + 4) >> 2] = f[(am + 4) >> 2];
        gj(a, 3960, c) | 0;
        f[al >> 2] = 6;
        f[(al + 4) >> 2] = 0;
        f[c >> 2] = f[al >> 2];
        f[(c + 4) >> 2] = f[(al + 4) >> 2];
        gj(a, 3974, c) | 0;
        f[ak >> 2] = 7;
        f[(ak + 4) >> 2] = 0;
        f[c >> 2] = f[ak >> 2];
        f[(c + 4) >> 2] = f[(ak + 4) >> 2];
        gj(a, 3983, c) | 0;
        f[aj >> 2] = 20;
        f[(aj + 4) >> 2] = 0;
        f[c >> 2] = f[aj >> 2];
        f[(c + 4) >> 2] = f[(aj + 4) >> 2];
        gf(a, 3999, c) | 0;
        f[ai >> 2] = 8;
        f[(ai + 4) >> 2] = 0;
        f[c >> 2] = f[ai >> 2];
        f[(c + 4) >> 2] = f[(ai + 4) >> 2];
        gj(a, 4012, c) | 0;
        f[ah >> 2] = 9;
        f[(ah + 4) >> 2] = 0;
        f[c >> 2] = f[ah >> 2];
        f[(c + 4) >> 2] = f[(ah + 4) >> 2];
        gj(a, 4022, c) | 0;
        f[ag >> 2] = 21;
        f[(ag + 4) >> 2] = 0;
        f[c >> 2] = f[ag >> 2];
        f[(c + 4) >> 2] = f[(ag + 4) >> 2];
        gf(a, 4039, c) | 0;
        f[af >> 2] = 10;
        f[(af + 4) >> 2] = 0;
        f[c >> 2] = f[af >> 2];
        f[(c + 4) >> 2] = f[(af + 4) >> 2];
        gj(a, 4053, c) | 0;
        f[ae >> 2] = 11;
        f[(ae + 4) >> 2] = 0;
        f[c >> 2] = f[ae >> 2];
        f[(c + 4) >> 2] = f[(ae + 4) >> 2];
        gj(a, 4065, c) | 0;
        f[ad >> 2] = 12;
        f[(ad + 4) >> 2] = 0;
        f[c >> 2] = f[ad >> 2];
        f[(c + 4) >> 2] = f[(ad + 4) >> 2];
        gj(a, 4084, c) | 0;
        f[ac >> 2] = 13;
        f[(ac + 4) >> 2] = 0;
        f[c >> 2] = f[ac >> 2];
        f[(c + 4) >> 2] = f[(ac + 4) >> 2];
        gj(a, 4097, c) | 0;
        f[ab >> 2] = 14;
        f[(ab + 4) >> 2] = 0;
        f[c >> 2] = f[ab >> 2];
        f[(c + 4) >> 2] = f[(ab + 4) >> 2];
        gj(a, 4117, c) | 0;
        f[aa >> 2] = 15;
        f[(aa + 4) >> 2] = 0;
        f[c >> 2] = f[aa >> 2];
        f[(c + 4) >> 2] = f[(aa + 4) >> 2];
        gj(a, 4129, c) | 0;
        f[_ >> 2] = 16;
        f[(_ + 4) >> 2] = 0;
        f[c >> 2] = f[_ >> 2];
        f[(c + 4) >> 2] = f[(_ + 4) >> 2];
        gj(a, 4148, c) | 0;
        f[$ >> 2] = 17;
        f[($ + 4) >> 2] = 0;
        f[c >> 2] = f[$ >> 2];
        f[(c + 4) >> 2] = f[($ + 4) >> 2];
        gj(a, 4161, c) | 0;
        f[Z >> 2] = 18;
        f[(Z + 4) >> 2] = 0;
        f[c >> 2] = f[Z >> 2];
        f[(c + 4) >> 2] = f[(Z + 4) >> 2];
        gj(a, 4181, c) | 0;
        f[Y >> 2] = 5;
        f[(Y + 4) >> 2] = 0;
        f[c >> 2] = f[Y >> 2];
        f[(c + 4) >> 2] = f[(Y + 4) >> 2];
        gi(a, 4196, c) | 0;
        f[X >> 2] = 6;
        f[(X + 4) >> 2] = 0;
        f[c >> 2] = f[X >> 2];
        f[(c + 4) >> 2] = f[(X + 4) >> 2];
        gi(a, 4206, c) | 0;
        f[W >> 2] = 7;
        f[(W + 4) >> 2] = 0;
        f[c >> 2] = f[W >> 2];
        f[(c + 4) >> 2] = f[(W + 4) >> 2];
        gi(a, 4217, c) | 0;
        f[V >> 2] = 3;
        f[(V + 4) >> 2] = 0;
        f[c >> 2] = f[V >> 2];
        f[(c + 4) >> 2] = f[(V + 4) >> 2];
        gk(a, 4235, c) | 0;
        f[U >> 2] = 1;
        f[(U + 4) >> 2] = 0;
        f[c >> 2] = f[U >> 2];
        f[(c + 4) >> 2] = f[(U + 4) >> 2];
        gl(a, 4251, c) | 0;
        f[T >> 2] = 4;
        f[(T + 4) >> 2] = 0;
        f[c >> 2] = f[T >> 2];
        f[(c + 4) >> 2] = f[(T + 4) >> 2];
        gk(a, 4263, c) | 0;
        f[S >> 2] = 5;
        f[(S + 4) >> 2] = 0;
        f[c >> 2] = f[S >> 2];
        f[(c + 4) >> 2] = f[(S + 4) >> 2];
        gk(a, 4279, c) | 0;
        f[R >> 2] = 6;
        f[(R + 4) >> 2] = 0;
        f[c >> 2] = f[R >> 2];
        f[(c + 4) >> 2] = f[(R + 4) >> 2];
        gk(a, 4293, c) | 0;
        f[Q >> 2] = 7;
        f[(Q + 4) >> 2] = 0;
        f[c >> 2] = f[Q >> 2];
        f[(c + 4) >> 2] = f[(Q + 4) >> 2];
        gk(a, 4306, c) | 0;
        f[P >> 2] = 8;
        f[(P + 4) >> 2] = 0;
        f[c >> 2] = f[P >> 2];
        f[(c + 4) >> 2] = f[(P + 4) >> 2];
        gk(a, 4323, c) | 0;
        f[O >> 2] = 9;
        f[(O + 4) >> 2] = 0;
        f[c >> 2] = f[O >> 2];
        f[(c + 4) >> 2] = f[(O + 4) >> 2];
        gk(a, 4335, c) | 0;
        f[N >> 2] = 2;
        f[(N + 4) >> 2] = 0;
        f[c >> 2] = f[N >> 2];
        f[(c + 4) >> 2] = f[(N + 4) >> 2];
        gl(a, 4353, c) | 0;
        f[M >> 2] = 12;
        f[(M + 4) >> 2] = 0;
        f[c >> 2] = f[M >> 2];
        f[(c + 4) >> 2] = f[(M + 4) >> 2];
        gm(a, 4363, c) | 0;
        f[L >> 2] = 1;
        f[(L + 4) >> 2] = 0;
        f[c >> 2] = f[L >> 2];
        f[(c + 4) >> 2] = f[(L + 4) >> 2];
        gn(a, 4376, c) | 0;
        f[K >> 2] = 2;
        f[(K + 4) >> 2] = 0;
        f[c >> 2] = f[K >> 2];
        f[(c + 4) >> 2] = f[(K + 4) >> 2];
        gn(a, 4388, c) | 0;
        f[J >> 2] = 13;
        f[(J + 4) >> 2] = 0;
        f[c >> 2] = f[J >> 2];
        f[(c + 4) >> 2] = f[(J + 4) >> 2];
        gm(a, 4402, c) | 0;
        f[I >> 2] = 14;
        f[(I + 4) >> 2] = 0;
        f[c >> 2] = f[I >> 2];
        f[(c + 4) >> 2] = f[(I + 4) >> 2];
        gm(a, 4411, c) | 0;
        f[H >> 2] = 15;
        f[(H + 4) >> 2] = 0;
        f[c >> 2] = f[H >> 2];
        f[(c + 4) >> 2] = f[(H + 4) >> 2];
        gm(a, 4421, c) | 0;
        f[G >> 2] = 16;
        f[(G + 4) >> 2] = 0;
        f[c >> 2] = f[G >> 2];
        f[(c + 4) >> 2] = f[(G + 4) >> 2];
        gm(a, 4433, c) | 0;
        f[F >> 2] = 17;
        f[(F + 4) >> 2] = 0;
        f[c >> 2] = f[F >> 2];
        f[(c + 4) >> 2] = f[(F + 4) >> 2];
        gm(a, 4446, c) | 0;
        f[E >> 2] = 18;
        f[(E + 4) >> 2] = 0;
        f[c >> 2] = f[E >> 2];
        f[(c + 4) >> 2] = f[(E + 4) >> 2];
        gm(a, 4458, c) | 0;
        f[D >> 2] = 3;
        f[(D + 4) >> 2] = 0;
        f[c >> 2] = f[D >> 2];
        f[(c + 4) >> 2] = f[(D + 4) >> 2];
        gn(a, 4471, c) | 0;
        f[C >> 2] = 1;
        f[(C + 4) >> 2] = 0;
        f[c >> 2] = f[C >> 2];
        f[(c + 4) >> 2] = f[(C + 4) >> 2];
        go(a, 4486, c) | 0;
        f[B >> 2] = 10;
        f[(B + 4) >> 2] = 0;
        f[c >> 2] = f[B >> 2];
        f[(c + 4) >> 2] = f[(B + 4) >> 2];
        gk(a, 4496, c) | 0;
        f[A >> 2] = 11;
        f[(A + 4) >> 2] = 0;
        f[c >> 2] = f[A >> 2];
        f[(c + 4) >> 2] = f[(A + 4) >> 2];
        gk(a, 4508, c) | 0;
        f[z >> 2] = 3;
        f[(z + 4) >> 2] = 0;
        f[c >> 2] = f[z >> 2];
        f[(c + 4) >> 2] = f[(z + 4) >> 2];
        gl(a, 4519, c) | 0;
        f[y >> 2] = 4;
        f[(y + 4) >> 2] = 0;
        f[c >> 2] = f[y >> 2];
        f[(c + 4) >> 2] = f[(y + 4) >> 2];
        gp(a, 4530, c) | 0;
        f[x >> 2] = 19;
        f[(x + 4) >> 2] = 0;
        f[c >> 2] = f[x >> 2];
        f[(c + 4) >> 2] = f[(x + 4) >> 2];
        gq(a, 4542, c) | 0;
        f[w >> 2] = 12;
        f[(w + 4) >> 2] = 0;
        f[c >> 2] = f[w >> 2];
        f[(c + 4) >> 2] = f[(w + 4) >> 2];
        gr(a, 4554, c) | 0;
        f[v >> 2] = 13;
        f[(v + 4) >> 2] = 0;
        f[c >> 2] = f[v >> 2];
        f[(c + 4) >> 2] = f[(v + 4) >> 2];
        gs(a, 4568, c) | 0;
        f[u >> 2] = 2;
        f[(u + 4) >> 2] = 0;
        f[c >> 2] = f[u >> 2];
        f[(c + 4) >> 2] = f[(u + 4) >> 2];
        gt(a, 4578, c) | 0;
        f[t >> 2] = 20;
        f[(t + 4) >> 2] = 0;
        f[c >> 2] = f[t >> 2];
        f[(c + 4) >> 2] = f[(t + 4) >> 2];
        gu(a, 4587, c) | 0;
        f[s >> 2] = 22;
        f[(s + 4) >> 2] = 0;
        f[c >> 2] = f[s >> 2];
        f[(c + 4) >> 2] = f[(s + 4) >> 2];
        gf(a, 4602, c) | 0;
        f[r >> 2] = 23;
        f[(r + 4) >> 2] = 0;
        f[c >> 2] = f[r >> 2];
        f[(c + 4) >> 2] = f[(r + 4) >> 2];
        gf(a, 4619, c) | 0;
        f[q >> 2] = 14;
        f[(q + 4) >> 2] = 0;
        f[c >> 2] = f[q >> 2];
        f[(c + 4) >> 2] = f[(q + 4) >> 2];
        gv(a, 4629, c) | 0;
        f[p >> 2] = 1;
        f[(p + 4) >> 2] = 0;
        f[c >> 2] = f[p >> 2];
        f[(c + 4) >> 2] = f[(p + 4) >> 2];
        gw(a, 4637, c) | 0;
        f[n >> 2] = 4;
        f[(n + 4) >> 2] = 0;
        f[c >> 2] = f[n >> 2];
        f[(c + 4) >> 2] = f[(n + 4) >> 2];
        gn(a, 4653, c) | 0;
        f[m >> 2] = 5;
        f[(m + 4) >> 2] = 0;
        f[c >> 2] = f[m >> 2];
        f[(c + 4) >> 2] = f[(m + 4) >> 2];
        gn(a, 4669, c) | 0;
        f[l >> 2] = 6;
        f[(l + 4) >> 2] = 0;
        f[c >> 2] = f[l >> 2];
        f[(c + 4) >> 2] = f[(l + 4) >> 2];
        gn(a, 4686, c) | 0;
        f[k >> 2] = 7;
        f[(k + 4) >> 2] = 0;
        f[c >> 2] = f[k >> 2];
        f[(c + 4) >> 2] = f[(k + 4) >> 2];
        gn(a, 4701, c) | 0;
        f[j >> 2] = 8;
        f[(j + 4) >> 2] = 0;
        f[c >> 2] = f[j >> 2];
        f[(c + 4) >> 2] = f[(j + 4) >> 2];
        gn(a, 4719, c) | 0;
        f[i >> 2] = 9;
        f[(i + 4) >> 2] = 0;
        f[c >> 2] = f[i >> 2];
        f[(c + 4) >> 2] = f[(i + 4) >> 2];
        gn(a, 4736, c) | 0;
        f[h >> 2] = 21;
        f[(h + 4) >> 2] = 0;
        f[c >> 2] = f[h >> 2];
        f[(c + 4) >> 2] = f[(h + 4) >> 2];
        gx(a, 4754, c) | 0;
        f[g >> 2] = 2;
        f[(g + 4) >> 2] = 0;
        f[c >> 2] = f[g >> 2];
        f[(c + 4) >> 2] = f[(g + 4) >> 2];
        go(a, 4772, c) | 0;
        f[e >> 2] = 3;
        f[(e + 4) >> 2] = 0;
        f[c >> 2] = f[e >> 2];
        f[(c + 4) >> 2] = f[(e + 4) >> 2];
        go(a, 4790, c) | 0;
        f[d >> 2] = 4;
        f[(d + 4) >> 2] = 0;
        f[c >> 2] = f[d >> 2];
        f[(c + 4) >> 2] = f[(d + 4) >> 2];
        go(a, 4808, c) | 0;
        o = b;
        return;
    }
    function gb(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = oc() | 0;
        f[a >> 2] = c;
        od(c, b);
        r2(f[a >> 2] | 0);
        return;
    }
    function gc(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        nX(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function gd(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        nC(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function ge(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        nl(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function gf(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        m2(a, b, e);
        o = d;
        return a | 0;
    }
    function gg(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        mI(a, b, e);
        o = d;
        return a | 0;
    }
    function gh(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        mp(a, b, e);
        o = d;
        return a | 0;
    }
    function gi(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        l6(a, b, e);
        o = d;
        return a | 0;
    }
    function gj(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        lP(a, b, e);
        o = d;
        return a | 0;
    }
    function gk(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        lw(a, b, e);
        o = d;
        return a | 0;
    }
    function gl(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        ld(a, b, e);
        o = d;
        return a | 0;
    }
    function gm(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        kH(a, b, e);
        o = d;
        return a | 0;
    }
    function gn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        ko(a, b, e);
        o = d;
        return a | 0;
    }
    function go(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        j5(a, b, e);
        o = d;
        return a | 0;
    }
    function gp(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        jO(a, b, e);
        o = d;
        return a | 0;
    }
    function gq(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        js(a, b, e);
        o = d;
        return a | 0;
    }
    function gr(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        i8(a, b, e);
        o = d;
        return a | 0;
    }
    function gs(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        iR(a, b, e);
        o = d;
        return a | 0;
    }
    function gt(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        iu(a, b, e);
        o = d;
        return a | 0;
    }
    function gu(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        h4(a, b, e);
        o = d;
        return a | 0;
    }
    function gv(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        hM(a, b, e);
        o = d;
        return a | 0;
    }
    function gw(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        hn(a, b, e);
        o = d;
        return a | 0;
    }
    function gx(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        gy(a, b, e);
        o = d;
        return a | 0;
    }
    function gy(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        gA(a, c, e, 1);
        o = d;
        return;
    }
    function gz(a) {
        a = a | 0;
        return a | 0;
    }
    function gA(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = gB() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = gC(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, gD(g, d) | 0, d);
        o = e;
        return;
    }
    function gB() {
        var a = 0, b = 0;
        if (!(d[7616] | 0)) {
            gP(9136);
            aK(24, 9136, r | 0) | 0;
            b = 7616;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9136) | 0)) {
            a = 9136;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            gP(9136);
        }
        return 9136;
    }
    function gC(a) {
        a = a | 0;
        return 0;
    }
    function gD(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = gB() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            gJ(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            gK(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function gE(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0;
        h = o;
        o = (o + 32) | 0;
        n = (h + 24) | 0;
        m = (h + 20) | 0;
        j = (h + 16) | 0;
        l = (h + 12) | 0;
        k = (h + 8) | 0;
        i = (h + 4) | 0;
        p = h;
        f[m >> 2] = b;
        f[j >> 2] = c;
        f[l >> 2] = d;
        f[k >> 2] = e;
        f[i >> 2] = g;
        g = (a + 28) | 0;
        f[p >> 2] = f[g >> 2];
        f[n >> 2] = f[p >> 2];
        gF((a + 24) | 0, n, m, l, k, j, i) | 0;
        f[g >> 2] = f[f[g >> 2] >> 2];
        o = h;
        return;
    }
    function gF(a, b, c, d, e, g, h) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        h = h | 0;
        a = gG(b) | 0;
        b = xH(24) | 0;
        gH((b + 4) | 0, f[c >> 2] | 0, f[d >> 2] | 0, f[e >> 2] | 0, f[g >> 2] | 0, f[h >> 2] | 0);
        f[b >> 2] = f[a >> 2];
        f[a >> 2] = b;
        return b | 0;
    }
    function gG(a) {
        a = a | 0;
        return f[a >> 2] | 0;
    }
    function gH(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        f[(a + 8) >> 2] = d;
        f[(a + 12) >> 2] = e;
        f[(a + 16) >> 2] = g;
        return;
    }
    function gI(a, b) {
        a = a | 0;
        b = b | 0;
        return b | a | 0;
    }
    function gJ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function gK(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = gL(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            gM(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            gJ(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            gN(a, i);
            gO(i);
            o = k;
            return;
        }
    }
    function gL(a) {
        a = a | 0;
        return 357913941;
    }
    function gM(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function gN(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function gO(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function gP(a) {
        a = a | 0;
        gT(a);
        return;
    }
    function gQ(a) {
        a = a | 0;
        gS((a + 24) | 0);
        return;
    }
    function gR(a) {
        a = a | 0;
        return f[a >> 2] | 0;
    }
    function gS(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function gT(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 3, b, gV() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function gU() {
        return 9228;
    }
    function gV() {
        return 1140;
    }
    function gW(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0;
        c = o;
        o = (o + 16) | 0;
        d = (c + 8) | 0;
        e = c;
        g = gY(a) | 0;
        a = f[(g + 4) >> 2] | 0;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = a;
        f[d >> 2] = f[e >> 2];
        f[(d + 4) >> 2] = f[(e + 4) >> 2];
        b = gZ(b, d) | 0;
        o = c;
        return b | 0;
    }
    function gX(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        f[(a + 8) >> 2] = d;
        f[(a + 12) >> 2] = e;
        f[(a + 16) >> 2] = g;
        return;
    }
    function gY(a) {
        a = a | 0;
        return ((f[((gB() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function gZ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        e = o;
        o = (o + 48) | 0;
        d = e;
        c = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) c = f[((f[a >> 2] | 0) + c) >> 2] | 0;
        yT[c & 31](d, a);
        d = g$(d) | 0;
        o = e;
        return d | 0;
    }
    function g$(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0;
        e = o;
        o = (o + 32) | 0;
        b = (e + 12) | 0;
        c = e;
        d = g0(g_() | 0) | 0;
        if (!d) a = g5(a) | 0;
        else {
            g1(b, d);
            g2(c, b);
            g3(a, c);
            a = g4(b) | 0;
        }
        o = e;
        return a | 0;
    }
    function g_() {
        var a = 0;
        if (!(d[7632] | 0)) {
            hg(9184);
            aK(25, 9184, r | 0) | 0;
            a = 7632;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 9184;
    }
    function g0(a) {
        a = a | 0;
        return f[(a + 36) >> 2] | 0;
    }
    function g1(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = a;
        f[(a + 8) >> 2] = 0;
        return;
    }
    function g2(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = f[(b + 4) >> 2];
        f[(a + 8) >> 2] = 0;
        return;
    }
    function g3(a, b) {
        a = a | 0;
        b = b | 0;
        ha(b, a, (a + 8) | 0, (a + 16) | 0, (a + 24) | 0, (a + 32) | 0, (a + 40) | 0) | 0;
        return;
    }
    function g4(a) {
        a = a | 0;
        return f[((f[(a + 4) >> 2] | 0) + 8) >> 2] | 0;
    }
    function g5(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        j = o;
        o = (o + 16) | 0;
        c = (j + 4) | 0;
        d = j;
        e = uc(8) | 0;
        g = e;
        h = xH(48) | 0;
        i = h;
        b = (i + 48) | 0;
        do {
            f[i >> 2] = f[a >> 2];
            i = (i + 4) | 0;
            a = (a + 4) | 0;
        }while ((i | 0) < (b | 0))
        b = (g + 4) | 0;
        f[b >> 2] = h;
        i = xH(8) | 0;
        h = f[b >> 2] | 0;
        f[d >> 2] = 0;
        f[c >> 2] = f[d >> 2];
        g6(i, h, c);
        f[e >> 2] = i;
        o = j;
        return g | 0;
    }
    function g6(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        c = xH(16) | 0;
        f[(c + 4) >> 2] = 0;
        f[(c + 8) >> 2] = 0;
        f[c >> 2] = 1092;
        f[(c + 12) >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function g7(a) {
        a = a | 0;
        xB(a);
        xJ(a);
        return;
    }
    function g8(a) {
        a = a | 0;
        a = f[(a + 12) >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function g9(a) {
        a = a | 0;
        xJ(a);
        return;
    }
    function ha(a, b, c, d, e, g, h) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        h = h | 0;
        g = hb(f[a >> 2] | 0, b, c, d, e, g, h) | 0;
        h = (a + 4) | 0;
        f[((f[h >> 2] | 0) + 8) >> 2] = g;
        return f[((f[h >> 2] | 0) + 8) >> 2] | 0;
    }
    function hb(a, b, c, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var h = 0, i = 0;
        h = o;
        o = (o + 16) | 0;
        i = h;
        wt(i);
        a = fz(a) | 0;
        g = hc(a, +k[b >> 3], +k[c >> 3], +k[d >> 3], +k[e >> 3], +k[f >> 3], +k[g >> 3]) | 0;
        wv(i);
        o = h;
        return g | 0;
    }
    function hc(a, b, c, d, e, f, g) {
        a = a | 0;
        b = +b;
        c = +c;
        d = +d;
        e = +e;
        f = +f;
        g = +g;
        var h = 0;
        h = fC(hd() | 0) | 0;
        b = +fD(b);
        c = +fD(c);
        d = +fD(d);
        e = +fD(e);
        f = +fD(f);
        return aB(0, h | 0, a | 0, +b, +c, +d, +e, +f, +(+fD(g))) | 0;
    }
    function hd() {
        var a = 0;
        if (!(d[7624] | 0)) {
            he(9172);
            a = 7624;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 9172;
    }
    function he(a) {
        a = a | 0;
        fO(a, hf() | 0, 6);
        return;
    }
    function hf() {
        return 1112;
    }
    function hg(a) {
        a = a | 0;
        hm(a);
        return;
    }
    function hh(a) {
        a = a | 0;
        hi((a + 24) | 0);
        hj((a + 16) | 0);
        return;
    }
    function hi(a) {
        a = a | 0;
        hl(a);
        return;
    }
    function hj(a) {
        a = a | 0;
        hk(a);
        return;
    }
    function hk(a) {
        a = a | 0;
        var b = 0, c = 0;
        b = f[a >> 2] | 0;
        if (b | 0) do {
            c = b;
            b = f[b >> 2] | 0;
            xJ(c);
        }while ((b | 0) != 0)
        f[a >> 2] = 0;
        return;
    }
    function hl(a) {
        a = a | 0;
        var b = 0, c = 0;
        b = f[a >> 2] | 0;
        if (b | 0) do {
            c = b;
            b = f[b >> 2] | 0;
            xJ(c);
        }while ((b | 0) != 0)
        f[a >> 2] = 0;
        return;
    }
    function hm(a) {
        a = a | 0;
        var b = 0;
        f[(a + 16) >> 2] = 0;
        f[(a + 20) >> 2] = 0;
        b = (a + 24) | 0;
        f[b >> 2] = 0;
        f[(a + 28) >> 2] = b;
        f[(a + 36) >> 2] = 0;
        d[(a + 40) >> 0] = 0;
        d[(a + 41) >> 0] = 0;
        return;
    }
    function hn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        ho(a, c, e, 0);
        o = d;
        return;
    }
    function ho(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = hp() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = hq(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, hr(g, d) | 0, d);
        o = e;
        return;
    }
    function hp() {
        var a = 0, b = 0;
        if (!(d[7640] | 0)) {
            hy(9232);
            aK(26, 9232, r | 0) | 0;
            b = 7640;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9232) | 0)) {
            a = 9232;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            hy(9232);
        }
        return 9232;
    }
    function hq(a) {
        a = a | 0;
        return 0;
    }
    function hr(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = hp() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            hs(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            ht(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function hs(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function ht(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = hu(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            hv(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            hs(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            hw(a, i);
            hx(i);
            o = k;
            return;
        }
    }
    function hu(a) {
        a = a | 0;
        return 357913941;
    }
    function hv(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function hw(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function hx(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function hy(a) {
        a = a | 0;
        hB(a);
        return;
    }
    function hz(a) {
        a = a | 0;
        hA((a + 24) | 0);
        return;
    }
    function hA(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function hB(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 1, b, hC() | 0, 3);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function hC() {
        return 1144;
    }
    function hD(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        e = e | 0;
        var g = 0, h = 0, i = 0, j = 0;
        g = o;
        o = (o + 16) | 0;
        h = (g + 8) | 0;
        i = g;
        j = hE(a) | 0;
        a = f[(j + 4) >> 2] | 0;
        f[i >> 2] = f[j >> 2];
        f[(i + 4) >> 2] = a;
        f[h >> 2] = f[i >> 2];
        f[(h + 4) >> 2] = f[(i + 4) >> 2];
        hF(b, h, c, d, e);
        o = g;
        return;
    }
    function hE(a) {
        a = a | 0;
        return ((f[((hp() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function hF(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        e = e | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0;
        k = o;
        o = (o + 16) | 0;
        h = (k + 2) | 0;
        i = (k + 1) | 0;
        j = k;
        g = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) g = f[((f[a >> 2] | 0) + g) >> 2] | 0;
        hG(h, c);
        c = +hH(h, c);
        hG(i, d);
        d = +hH(i, d);
        hI(j, e);
        j = hJ(j, e) | 0;
        yV[g & 1](a, c, d, j);
        o = k;
        return;
    }
    function hG(a, b) {
        a = a | 0;
        b = +b;
        return;
    }
    function hH(a, b) {
        a = a | 0;
        b = +b;
        return +(+hL(b));
    }
    function hI(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function hJ(a, b) {
        a = a | 0;
        b = b | 0;
        return hK(b) | 0;
    }
    function hK(a) {
        a = a | 0;
        return a | 0;
    }
    function hL(a) {
        a = +a;
        return +a;
    }
    function hM(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        hN(a, c, e, 1);
        o = d;
        return;
    }
    function hN(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = hO() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = hP(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, hQ(g, d) | 0, d);
        o = e;
        return;
    }
    function hO() {
        var a = 0, b = 0;
        if (!(d[7648] | 0)) {
            hX(9268);
            aK(27, 9268, r | 0) | 0;
            b = 7648;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9268) | 0)) {
            a = 9268;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            hX(9268);
        }
        return 9268;
    }
    function hP(a) {
        a = a | 0;
        return 0;
    }
    function hQ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = hO() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            hR(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            hS(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function hR(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function hS(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = hT(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            hU(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            hR(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            hV(a, i);
            hW(i);
            o = k;
            return;
        }
    }
    function hT(a) {
        a = a | 0;
        return 357913941;
    }
    function hU(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function hV(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function hW(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function hX(a) {
        a = a | 0;
        h$(a);
        return;
    }
    function hY(a) {
        a = a | 0;
        hZ((a + 24) | 0);
        return;
    }
    function hZ(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function h$(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 4, b, h_() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function h_() {
        return 1160;
    }
    function h0(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0;
        c = o;
        o = (o + 16) | 0;
        d = (c + 8) | 0;
        e = c;
        g = h1(a) | 0;
        a = f[(g + 4) >> 2] | 0;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = a;
        f[d >> 2] = f[e >> 2];
        f[(d + 4) >> 2] = f[(e + 4) >> 2];
        b = h2(b, d) | 0;
        o = c;
        return b | 0;
    }
    function h1(a) {
        a = a | 0;
        return ((f[((hO() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function h2(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) c = f[((f[a >> 2] | 0) + c) >> 2] | 0;
        return h3(yU[c & 31](a) | 0) | 0;
    }
    function h3(a) {
        a = a | 0;
        return (a & 1) | 0;
    }
    function h4(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        h5(a, c, e, 0);
        o = d;
        return;
    }
    function h5(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = h6() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = h7(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, h8(g, d) | 0, d);
        o = e;
        return;
    }
    function h6() {
        var a = 0, b = 0;
        if (!(d[7656] | 0)) {
            ig(9304);
            aK(28, 9304, r | 0) | 0;
            b = 7656;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9304) | 0)) {
            a = 9304;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            ig(9304);
        }
        return 9304;
    }
    function h7(a) {
        a = a | 0;
        return 0;
    }
    function h8(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = h6() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            h9(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            ia(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function h9(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function ia(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = ib(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            ic(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            h9(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            id(a, i);
            ie(i);
            o = k;
            return;
        }
    }
    function ib(a) {
        a = a | 0;
        return 357913941;
    }
    function ic(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function id(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function ie(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function ig(a) {
        a = a | 0;
        ij(a);
        return;
    }
    function ih(a) {
        a = a | 0;
        ii((a + 24) | 0);
        return;
    }
    function ii(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function ij(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 5, b, ik() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function ik() {
        return 1164;
    }
    function il(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = im(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        io(b, e, c);
        o = d;
        return;
    }
    function im(a) {
        a = a | 0;
        return ((f[((h6() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function io(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0;
        g = o;
        o = (o + 16) | 0;
        e = g;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        ip(e, c);
        c = iq(e, c) | 0;
        yT[d & 31](a, c);
        ir(e);
        o = g;
        return;
    }
    function ip(a, b) {
        a = a | 0;
        b = b | 0;
        is(a, b);
        return;
    }
    function iq(a, b) {
        a = a | 0;
        b = b | 0;
        return a | 0;
    }
    function ir(a) {
        a = a | 0;
        em(a);
        return;
    }
    function is(a, b) {
        a = a | 0;
        b = b | 0;
        it(a, b);
        return;
    }
    function it(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = b;
        return;
    }
    function iu(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        iv(a, c, e, 0);
        o = d;
        return;
    }
    function iv(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = iw() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = ix(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, iy(g, d) | 0, d);
        o = e;
        return;
    }
    function iw() {
        var a = 0, b = 0;
        if (!(d[7664] | 0)) {
            iF(9340);
            aK(29, 9340, r | 0) | 0;
            b = 7664;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9340) | 0)) {
            a = 9340;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            iF(9340);
        }
        return 9340;
    }
    function ix(a) {
        a = a | 0;
        return 0;
    }
    function iy(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = iw() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            iz(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            iA(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function iz(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function iA(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = iB(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            iC(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            iz(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            iD(a, i);
            iE(i);
            o = k;
            return;
        }
    }
    function iB(a) {
        a = a | 0;
        return 357913941;
    }
    function iC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function iD(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function iE(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function iF(a) {
        a = a | 0;
        iI(a);
        return;
    }
    function iG(a) {
        a = a | 0;
        iH((a + 24) | 0);
        return;
    }
    function iH(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function iI(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 4, b, iJ() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function iJ() {
        return 1180;
    }
    function iK(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = iL(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        c = iM(b, e, c) | 0;
        o = d;
        return c | 0;
    }
    function iL(a) {
        a = a | 0;
        return ((f[((iw() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function iM(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0;
        g = o;
        o = (o + 16) | 0;
        e = g;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        iN(e, c);
        e = iO(e, c) | 0;
        e = iP(y_[d & 15](a, e) | 0) | 0;
        o = g;
        return e | 0;
    }
    function iN(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function iO(a, b) {
        a = a | 0;
        b = b | 0;
        return iQ(b) | 0;
    }
    function iP(a) {
        a = a | 0;
        return a | 0;
    }
    function iQ(a) {
        a = a | 0;
        return a | 0;
    }
    function iR(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        iS(a, c, e, 0);
        o = d;
        return;
    }
    function iS(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = iT() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = iU(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, iV(g, d) | 0, d);
        o = e;
        return;
    }
    function iT() {
        var a = 0, b = 0;
        if (!(d[7672] | 0)) {
            i0(9376);
            aK(30, 9376, r | 0) | 0;
            b = 7672;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9376) | 0)) {
            a = 9376;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            i0(9376);
        }
        return 9376;
    }
    function iU(a) {
        a = a | 0;
        return 0;
    }
    function iV(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = iT() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            iW(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            iX(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function iW(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function iX(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = iY(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            iZ(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            iW(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            i$(a, i);
            i_(i);
            o = k;
            return;
        }
    }
    function iY(a) {
        a = a | 0;
        return 357913941;
    }
    function iZ(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function i$(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function i_(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function i0(a) {
        a = a | 0;
        i3(a);
        return;
    }
    function i1(a) {
        a = a | 0;
        i2((a + 24) | 0);
        return;
    }
    function i2(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function i3(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 5, b, i4() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function i4() {
        return 1196;
    }
    function i5(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0;
        c = o;
        o = (o + 16) | 0;
        d = (c + 8) | 0;
        e = c;
        g = i6(a) | 0;
        a = f[(g + 4) >> 2] | 0;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = a;
        f[d >> 2] = f[e >> 2];
        f[(d + 4) >> 2] = f[(e + 4) >> 2];
        b = i7(b, d) | 0;
        o = c;
        return b | 0;
    }
    function i6(a) {
        a = a | 0;
        return ((f[((iT() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function i7(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) c = f[((f[a >> 2] | 0) + c) >> 2] | 0;
        return iP(yU[c & 31](a) | 0) | 0;
    }
    function i8(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        i9(a, c, e, 1);
        o = d;
        return;
    }
    function i9(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = ja() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = jb(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, jc(g, d) | 0, d);
        o = e;
        return;
    }
    function ja() {
        var a = 0, b = 0;
        if (!(d[7680] | 0)) {
            jj(9412);
            aK(31, 9412, r | 0) | 0;
            b = 7680;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9412) | 0)) {
            a = 9412;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            jj(9412);
        }
        return 9412;
    }
    function jb(a) {
        a = a | 0;
        return 0;
    }
    function jc(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = ja() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            jd(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            je(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function jd(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function je(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = jf(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            jg(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            jd(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            jh(a, i);
            ji(i);
            o = k;
            return;
        }
    }
    function jf(a) {
        a = a | 0;
        return 357913941;
    }
    function jg(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function jh(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function ji(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function jj(a) {
        a = a | 0;
        jm(a);
        return;
    }
    function jk(a) {
        a = a | 0;
        jl((a + 24) | 0);
        return;
    }
    function jl(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function jm(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 6, b, jn() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function jn() {
        return 1200;
    }
    function jo(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0;
        c = o;
        o = (o + 16) | 0;
        d = (c + 8) | 0;
        e = c;
        g = jp(a) | 0;
        a = f[(g + 4) >> 2] | 0;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = a;
        f[d >> 2] = f[e >> 2];
        f[(d + 4) >> 2] = f[(e + 4) >> 2];
        b = jq(b, d) | 0;
        o = c;
        return b | 0;
    }
    function jp(a) {
        a = a | 0;
        return ((f[((ja() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function jq(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) c = f[((f[a >> 2] | 0) + c) >> 2] | 0;
        return jr(yU[c & 31](a) | 0) | 0;
    }
    function jr(a) {
        a = a | 0;
        return a | 0;
    }
    function js(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        jt(a, c, e, 0);
        o = d;
        return;
    }
    function jt(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = ju() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = jv(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, jw(g, d) | 0, d);
        o = e;
        return;
    }
    function ju() {
        var a = 0, b = 0;
        if (!(d[7688] | 0)) {
            jD(9448);
            aK(32, 9448, r | 0) | 0;
            b = 7688;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9448) | 0)) {
            a = 9448;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            jD(9448);
        }
        return 9448;
    }
    function jv(a) {
        a = a | 0;
        return 0;
    }
    function jw(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = ju() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            jx(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            jy(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function jx(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function jy(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = jz(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            jA(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            jx(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            jB(a, i);
            jC(i);
            o = k;
            return;
        }
    }
    function jz(a) {
        a = a | 0;
        return 357913941;
    }
    function jA(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function jB(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function jC(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function jD(a) {
        a = a | 0;
        jG(a);
        return;
    }
    function jE(a) {
        a = a | 0;
        jF((a + 24) | 0);
        return;
    }
    function jF(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function jG(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 6, b, jH() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function jH() {
        return 1204;
    }
    function jI(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = jJ(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        jK(b, e, c);
        o = d;
        return;
    }
    function jJ(a) {
        a = a | 0;
        return ((f[((ju() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function jK(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0;
        g = o;
        o = (o + 16) | 0;
        e = g;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        jL(e, c);
        e = jM(e, c) | 0;
        yT[d & 31](a, e);
        o = g;
        return;
    }
    function jL(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function jM(a, b) {
        a = a | 0;
        b = b | 0;
        return jN(b) | 0;
    }
    function jN(a) {
        a = a | 0;
        return a | 0;
    }
    function jO(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        jP(a, c, e, 0);
        o = d;
        return;
    }
    function jP(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = jQ() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = jR(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, jS(g, d) | 0, d);
        o = e;
        return;
    }
    function jQ() {
        var a = 0, b = 0;
        if (!(d[7696] | 0)) {
            jZ(9484);
            aK(33, 9484, r | 0) | 0;
            b = 7696;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9484) | 0)) {
            a = 9484;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            jZ(9484);
        }
        return 9484;
    }
    function jR(a) {
        a = a | 0;
        return 0;
    }
    function jS(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = jQ() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            jT(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            jU(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function jT(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function jU(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = jV(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            jW(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            jT(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            jX(a, i);
            jY(i);
            o = k;
            return;
        }
    }
    function jV(a) {
        a = a | 0;
        return 357913941;
    }
    function jW(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function jX(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function jY(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function jZ(a) {
        a = a | 0;
        j0(a);
        return;
    }
    function j$(a) {
        a = a | 0;
        j_((a + 24) | 0);
        return;
    }
    function j_(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function j0(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 1, b, j1() | 0, 2);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function j1() {
        return 1212;
    }
    function j2(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0;
        e = o;
        o = (o + 16) | 0;
        g = (e + 8) | 0;
        h = e;
        i = j3(a) | 0;
        a = f[(i + 4) >> 2] | 0;
        f[h >> 2] = f[i >> 2];
        f[(h + 4) >> 2] = a;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = f[(h + 4) >> 2];
        j4(b, g, c, d);
        o = e;
        return;
    }
    function j3(a) {
        a = a | 0;
        return ((f[((jQ() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function j4(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0;
        i = o;
        o = (o + 16) | 0;
        g = (i + 1) | 0;
        h = i;
        e = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) e = f[((f[a >> 2] | 0) + e) >> 2] | 0;
        jL(g, c);
        g = jM(g, c) | 0;
        iN(h, d);
        h = iO(h, d) | 0;
        y7[e & 15](a, g, h);
        o = i;
        return;
    }
    function j5(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        j6(a, c, e, 1);
        o = d;
        return;
    }
    function j6(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = j7() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = j8(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, j9(g, d) | 0, d);
        o = e;
        return;
    }
    function j7() {
        var a = 0, b = 0;
        if (!(d[7704] | 0)) {
            kg(9520);
            aK(34, 9520, r | 0) | 0;
            b = 7704;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9520) | 0)) {
            a = 9520;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            kg(9520);
        }
        return 9520;
    }
    function j8(a) {
        a = a | 0;
        return 0;
    }
    function j9(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = j7() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            ka(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            kb(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function ka(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function kb(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = kc(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            kd(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            ka(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            ke(a, i);
            kf(i);
            o = k;
            return;
        }
    }
    function kc(a) {
        a = a | 0;
        return 357913941;
    }
    function kd(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function ke(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function kf(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function kg(a) {
        a = a | 0;
        kj(a);
        return;
    }
    function kh(a) {
        a = a | 0;
        ki((a + 24) | 0);
        return;
    }
    function ki(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function kj(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 1, b, kk() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function kk() {
        return 1224;
    }
    function kl(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0.0, e = 0, g = 0, h = 0, i = 0;
        e = o;
        o = (o + 16) | 0;
        g = (e + 8) | 0;
        h = e;
        i = km(a) | 0;
        a = f[(i + 4) >> 2] | 0;
        f[h >> 2] = f[i >> 2];
        f[(h + 4) >> 2] = a;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = f[(h + 4) >> 2];
        d = +kn(b, g, c);
        o = e;
        return +d;
    }
    function km(a) {
        a = a | 0;
        return ((f[((j7() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function kn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0.0;
        g = o;
        o = (o + 16) | 0;
        e = g;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        hI(e, c);
        e = hJ(e, c) | 0;
        h = +fL(+y2[d & 7](a, e));
        o = g;
        return +h;
    }
    function ko(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        kp(a, c, e, 1);
        o = d;
        return;
    }
    function kp(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = kq() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = kr(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, ks(g, d) | 0, d);
        o = e;
        return;
    }
    function kq() {
        var a = 0, b = 0;
        if (!(d[7712] | 0)) {
            kz(9556);
            aK(35, 9556, r | 0) | 0;
            b = 7712;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9556) | 0)) {
            a = 9556;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            kz(9556);
        }
        return 9556;
    }
    function kr(a) {
        a = a | 0;
        return 0;
    }
    function ks(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = kq() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            kt(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            ku(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function kt(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function ku(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = kv(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            kw(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            kt(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            kx(a, i);
            ky(i);
            o = k;
            return;
        }
    }
    function kv(a) {
        a = a | 0;
        return 357913941;
    }
    function kw(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function kx(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function ky(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function kz(a) {
        a = a | 0;
        kC(a);
        return;
    }
    function kA(a) {
        a = a | 0;
        kB((a + 24) | 0);
        return;
    }
    function kB(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function kC(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 5, b, kD() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function kD() {
        return 1232;
    }
    function kE(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0.0, d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = kF(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        c = +kG(b, e);
        o = d;
        return +c;
    }
    function kF(a) {
        a = a | 0;
        return ((f[((kq() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function kG(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) c = f[((f[a >> 2] | 0) + c) >> 2] | 0;
        return +(+fL(+yZ[c & 15](a)));
    }
    function kH(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        kI(a, c, e, 1);
        o = d;
        return;
    }
    function kI(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = kJ() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = kK(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, kL(g, d) | 0, d);
        o = e;
        return;
    }
    function kJ() {
        var a = 0, b = 0;
        if (!(d[7720] | 0)) {
            kS(9592);
            aK(36, 9592, r | 0) | 0;
            b = 7720;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9592) | 0)) {
            a = 9592;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            kS(9592);
        }
        return 9592;
    }
    function kK(a) {
        a = a | 0;
        return 0;
    }
    function kL(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = kJ() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            kM(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            kN(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function kM(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function kN(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = kO(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            kP(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            kM(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            kQ(a, i);
            kR(i);
            o = k;
            return;
        }
    }
    function kO(a) {
        a = a | 0;
        return 357913941;
    }
    function kP(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function kQ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function kR(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function kS(a) {
        a = a | 0;
        kV(a);
        return;
    }
    function kT(a) {
        a = a | 0;
        kU((a + 24) | 0);
        return;
    }
    function kU(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function kV(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 7, b, kW() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function kW() {
        return 1276;
    }
    function kX(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0;
        c = o;
        o = (o + 16) | 0;
        d = (c + 8) | 0;
        e = c;
        g = kY(a) | 0;
        a = f[(g + 4) >> 2] | 0;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = a;
        f[d >> 2] = f[e >> 2];
        f[(d + 4) >> 2] = f[(e + 4) >> 2];
        b = kZ(b, d) | 0;
        o = c;
        return b | 0;
    }
    function kY(a) {
        a = a | 0;
        return ((f[((kJ() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function kZ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        e = o;
        o = (o + 16) | 0;
        d = e;
        c = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) c = f[((f[a >> 2] | 0) + c) >> 2] | 0;
        yT[c & 31](d, a);
        d = k$(d) | 0;
        o = e;
        return d | 0;
    }
    function k$(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0;
        e = o;
        o = (o + 32) | 0;
        b = (e + 12) | 0;
        c = e;
        d = g0(k_() | 0) | 0;
        if (!d) a = k1(a) | 0;
        else {
            g1(b, d);
            g2(c, b);
            k0(a, c);
            a = g4(b) | 0;
        }
        o = e;
        return a | 0;
    }
    function k_() {
        var a = 0;
        if (!(d[7736] | 0)) {
            lc(9640);
            aK(25, 9640, r | 0) | 0;
            a = 7736;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 9640;
    }
    function k0(a, b) {
        a = a | 0;
        b = b | 0;
        k6(b, a, (a + 8) | 0) | 0;
        return;
    }
    function k1(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0;
        c = o;
        o = (o + 16) | 0;
        e = (c + 4) | 0;
        h = c;
        d = uc(8) | 0;
        b = d;
        i = xH(16) | 0;
        f[i >> 2] = f[a >> 2];
        f[(i + 4) >> 2] = f[(a + 4) >> 2];
        f[(i + 8) >> 2] = f[(a + 8) >> 2];
        f[(i + 12) >> 2] = f[(a + 12) >> 2];
        g = (b + 4) | 0;
        f[g >> 2] = i;
        a = xH(8) | 0;
        g = f[g >> 2] | 0;
        f[h >> 2] = 0;
        f[e >> 2] = f[h >> 2];
        k2(a, g, e);
        f[d >> 2] = a;
        o = c;
        return b | 0;
    }
    function k2(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        c = xH(16) | 0;
        f[(c + 4) >> 2] = 0;
        f[(c + 8) >> 2] = 0;
        f[c >> 2] = 1244;
        f[(c + 12) >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function k3(a) {
        a = a | 0;
        xB(a);
        xJ(a);
        return;
    }
    function k4(a) {
        a = a | 0;
        a = f[(a + 12) >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function k5(a) {
        a = a | 0;
        xJ(a);
        return;
    }
    function k6(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        b = k7(f[a >> 2] | 0, b, c) | 0;
        c = (a + 4) | 0;
        f[((f[c >> 2] | 0) + 8) >> 2] = b;
        return f[((f[c >> 2] | 0) + 8) >> 2] | 0;
    }
    function k7(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        d = o;
        o = (o + 16) | 0;
        e = d;
        wt(e);
        a = fz(a) | 0;
        c = k8(a, f[b >> 2] | 0, +k[c >> 3]) | 0;
        wv(e);
        o = d;
        return c | 0;
    }
    function k8(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        var d = 0;
        d = fC(k9() | 0) | 0;
        b = fE(b) | 0;
        return aC(0, d | 0, a | 0, b | 0, +(+fD(c))) | 0;
    }
    function k9() {
        var a = 0;
        if (!(d[7728] | 0)) {
            la(9628);
            a = 7728;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 9628;
    }
    function la(a) {
        a = a | 0;
        fO(a, lb() | 0, 2);
        return;
    }
    function lb() {
        return 1264;
    }
    function lc(a) {
        a = a | 0;
        hm(a);
        return;
    }
    function ld(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        le(a, c, e, 1);
        o = d;
        return;
    }
    function le(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = lf() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = lg(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, lh(g, d) | 0, d);
        o = e;
        return;
    }
    function lf() {
        var a = 0, b = 0;
        if (!(d[7744] | 0)) {
            lo(9684);
            aK(37, 9684, r | 0) | 0;
            b = 7744;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9684) | 0)) {
            a = 9684;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            lo(9684);
        }
        return 9684;
    }
    function lg(a) {
        a = a | 0;
        return 0;
    }
    function lh(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = lf() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            li(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            lj(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function li(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function lj(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = lk(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            ll(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            li(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            lm(a, i);
            ln(i);
            o = k;
            return;
        }
    }
    function lk(a) {
        a = a | 0;
        return 357913941;
    }
    function ll(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function lm(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function ln(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function lo(a) {
        a = a | 0;
        lr(a);
        return;
    }
    function lp(a) {
        a = a | 0;
        lq((a + 24) | 0);
        return;
    }
    function lq(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function lr(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 5, b, ls() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function ls() {
        return 1280;
    }
    function lt(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = lu(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        c = lv(b, e, c) | 0;
        o = d;
        return c | 0;
    }
    function lu(a) {
        a = a | 0;
        return ((f[((lf() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function lv(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        h = o;
        o = (o + 32) | 0;
        e = h;
        g = (h + 16) | 0;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        hI(g, c);
        g = hJ(g, c) | 0;
        y7[d & 15](e, a, g);
        g = k$(e) | 0;
        o = h;
        return g | 0;
    }
    function lw(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        lx(a, c, e, 1);
        o = d;
        return;
    }
    function lx(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = ly() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = lz(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, lA(g, d) | 0, d);
        o = e;
        return;
    }
    function ly() {
        var a = 0, b = 0;
        if (!(d[7752] | 0)) {
            lH(9720);
            aK(38, 9720, r | 0) | 0;
            b = 7752;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9720) | 0)) {
            a = 9720;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            lH(9720);
        }
        return 9720;
    }
    function lz(a) {
        a = a | 0;
        return 0;
    }
    function lA(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = ly() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            lB(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            lC(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function lB(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function lC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = lD(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            lE(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            lB(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            lF(a, i);
            lG(i);
            o = k;
            return;
        }
    }
    function lD(a) {
        a = a | 0;
        return 357913941;
    }
    function lE(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function lF(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function lG(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function lH(a) {
        a = a | 0;
        lK(a);
        return;
    }
    function lI(a) {
        a = a | 0;
        lJ((a + 24) | 0);
        return;
    }
    function lJ(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function lK(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 8, b, lL() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function lL() {
        return 1288;
    }
    function lM(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0;
        c = o;
        o = (o + 16) | 0;
        d = (c + 8) | 0;
        e = c;
        g = lN(a) | 0;
        a = f[(g + 4) >> 2] | 0;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = a;
        f[d >> 2] = f[e >> 2];
        f[(d + 4) >> 2] = f[(e + 4) >> 2];
        b = lO(b, d) | 0;
        o = c;
        return b | 0;
    }
    function lN(a) {
        a = a | 0;
        return ((f[((ly() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function lO(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) c = f[((f[a >> 2] | 0) + c) >> 2] | 0;
        return fK(yU[c & 31](a) | 0) | 0;
    }
    function lP(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        lQ(a, c, e, 0);
        o = d;
        return;
    }
    function lQ(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = lR() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = lS(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, lT(g, d) | 0, d);
        o = e;
        return;
    }
    function lR() {
        var a = 0, b = 0;
        if (!(d[7760] | 0)) {
            l$(9756);
            aK(39, 9756, r | 0) | 0;
            b = 7760;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9756) | 0)) {
            a = 9756;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            l$(9756);
        }
        return 9756;
    }
    function lS(a) {
        a = a | 0;
        return 0;
    }
    function lT(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = lR() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            lU(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            lV(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function lU(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function lV(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = lW(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            lX(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            lU(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            lY(a, i);
            lZ(i);
            o = k;
            return;
        }
    }
    function lW(a) {
        a = a | 0;
        return 357913941;
    }
    function lX(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function lY(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function lZ(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function l$(a) {
        a = a | 0;
        l1(a);
        return;
    }
    function l_(a) {
        a = a | 0;
        l0((a + 24) | 0);
        return;
    }
    function l0(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function l1(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 8, b, l2() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function l2() {
        return 1292;
    }
    function l3(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = l4(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        l5(b, e, c);
        o = d;
        return;
    }
    function l4(a) {
        a = a | 0;
        return ((f[((lR() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function l5(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        var d = 0, e = 0, g = 0;
        g = o;
        o = (o + 16) | 0;
        e = g;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        hG(e, c);
        c = +hH(e, c);
        yQ[d & 31](a, c);
        o = g;
        return;
    }
    function l6(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        l7(a, c, e, 0);
        o = d;
        return;
    }
    function l7(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = l8() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = l9(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, ma(g, d) | 0, d);
        o = e;
        return;
    }
    function l8() {
        var a = 0, b = 0;
        if (!(d[7768] | 0)) {
            mh(9792);
            aK(40, 9792, r | 0) | 0;
            b = 7768;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9792) | 0)) {
            a = 9792;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            mh(9792);
        }
        return 9792;
    }
    function l9(a) {
        a = a | 0;
        return 0;
    }
    function ma(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = l8() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            mb(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            mc(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function mb(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function mc(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = md(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            me(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            mb(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            mf(a, i);
            mg(i);
            o = k;
            return;
        }
    }
    function md(a) {
        a = a | 0;
        return 357913941;
    }
    function me(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function mf(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function mg(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function mh(a) {
        a = a | 0;
        mk(a);
        return;
    }
    function mi(a) {
        a = a | 0;
        mj((a + 24) | 0);
        return;
    }
    function mj(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function mk(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 1, b, ml() | 0, 2);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function ml() {
        return 1300;
    }
    function mm(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        var e = 0, g = 0, h = 0, i = 0;
        e = o;
        o = (o + 16) | 0;
        g = (e + 8) | 0;
        h = e;
        i = mn(a) | 0;
        a = f[(i + 4) >> 2] | 0;
        f[h >> 2] = f[i >> 2];
        f[(h + 4) >> 2] = a;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = f[(h + 4) >> 2];
        mo(b, g, c, d);
        o = e;
        return;
    }
    function mn(a) {
        a = a | 0;
        return ((f[((l8() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function mo(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        var e = 0, g = 0, h = 0, i = 0;
        i = o;
        o = (o + 16) | 0;
        g = (i + 1) | 0;
        h = i;
        e = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) e = f[((f[a >> 2] | 0) + e) >> 2] | 0;
        hI(g, c);
        g = hJ(g, c) | 0;
        hG(h, d);
        d = +hH(h, d);
        y9[e & 15](a, g, d);
        o = i;
        return;
    }
    function mp(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        mq(a, c, e, 0);
        o = d;
        return;
    }
    function mq(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = mr() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = ms(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, mt(g, d) | 0, d);
        o = e;
        return;
    }
    function mr() {
        var a = 0, b = 0;
        if (!(d[7776] | 0)) {
            mA(9828);
            aK(41, 9828, r | 0) | 0;
            b = 7776;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9828) | 0)) {
            a = 9828;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            mA(9828);
        }
        return 9828;
    }
    function ms(a) {
        a = a | 0;
        return 0;
    }
    function mt(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = mr() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            mu(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            mv(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function mu(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function mv(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = mw(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            mx(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            mu(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            my(a, i);
            mz(i);
            o = k;
            return;
        }
    }
    function mw(a) {
        a = a | 0;
        return 357913941;
    }
    function mx(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function my(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function mz(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function mA(a) {
        a = a | 0;
        mD(a);
        return;
    }
    function mB(a) {
        a = a | 0;
        mC((a + 24) | 0);
        return;
    }
    function mC(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function mD(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 7, b, mE() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function mE() {
        return 1312;
    }
    function mF(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = mG(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        mH(b, e, c);
        o = d;
        return;
    }
    function mG(a) {
        a = a | 0;
        return ((f[((mr() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function mH(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0;
        g = o;
        o = (o + 16) | 0;
        e = g;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        hI(e, c);
        e = hJ(e, c) | 0;
        yT[d & 31](a, e);
        o = g;
        return;
    }
    function mI(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        mJ(a, c, e, 0);
        o = d;
        return;
    }
    function mJ(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = mK() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = mL(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, mM(g, d) | 0, d);
        o = e;
        return;
    }
    function mK() {
        var a = 0, b = 0;
        if (!(d[7784] | 0)) {
            mT(9864);
            aK(42, 9864, r | 0) | 0;
            b = 7784;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9864) | 0)) {
            a = 9864;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            mT(9864);
        }
        return 9864;
    }
    function mL(a) {
        a = a | 0;
        return 0;
    }
    function mM(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = mK() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            mN(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            mO(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function mN(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function mO(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = mP(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            mQ(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            mN(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            mR(a, i);
            mS(i);
            o = k;
            return;
        }
    }
    function mP(a) {
        a = a | 0;
        return 357913941;
    }
    function mQ(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function mR(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function mS(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function mT(a) {
        a = a | 0;
        mW(a);
        return;
    }
    function mU(a) {
        a = a | 0;
        mV((a + 24) | 0);
        return;
    }
    function mV(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function mW(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 8, b, mX() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function mX() {
        return 1320;
    }
    function mY(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = mZ(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        m$(b, e, c);
        o = d;
        return;
    }
    function mZ(a) {
        a = a | 0;
        return ((f[((mK() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function m$(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0;
        g = o;
        o = (o + 16) | 0;
        e = g;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        m_(e, c);
        e = m0(e, c) | 0;
        yT[d & 31](a, e);
        o = g;
        return;
    }
    function m_(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function m0(a, b) {
        a = a | 0;
        b = b | 0;
        return m1(b) | 0;
    }
    function m1(a) {
        a = a | 0;
        return a | 0;
    }
    function m2(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        m3(a, c, e, 0);
        o = d;
        return;
    }
    function m3(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = m4() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = m5(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, m6(g, d) | 0, d);
        o = e;
        return;
    }
    function m4() {
        var a = 0, b = 0;
        if (!(d[7792] | 0)) {
            nd(9900);
            aK(43, 9900, r | 0) | 0;
            b = 7792;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9900) | 0)) {
            a = 9900;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            nd(9900);
        }
        return 9900;
    }
    function m5(a) {
        a = a | 0;
        return 0;
    }
    function m6(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = m4() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            m7(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            m8(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function m7(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function m8(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = m9(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            na(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            m7(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            nb(a, i);
            nc(i);
            o = k;
            return;
        }
    }
    function m9(a) {
        a = a | 0;
        return 357913941;
    }
    function na(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function nb(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function nc(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function nd(a) {
        a = a | 0;
        ng(a);
        return;
    }
    function ne(a) {
        a = a | 0;
        nf((a + 24) | 0);
        return;
    }
    function nf(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function ng(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 22, b, nh() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function nh() {
        return 1344;
    }
    function ni(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0;
        c = o;
        o = (o + 16) | 0;
        d = (c + 8) | 0;
        e = c;
        g = nj(a) | 0;
        a = f[(g + 4) >> 2] | 0;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = a;
        f[d >> 2] = f[e >> 2];
        f[(d + 4) >> 2] = f[(e + 4) >> 2];
        nk(b, d);
        o = c;
        return;
    }
    function nj(a) {
        a = a | 0;
        return ((f[((m4() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function nk(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) c = f[((f[a >> 2] | 0) + c) >> 2] | 0;
        yS[c & 127](a);
        return;
    }
    function nl(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = nm() | 0;
        a = nn(c) | 0;
        gE(g, b, e, a, no(c, d) | 0, d);
        return;
    }
    function nm() {
        var a = 0, b = 0;
        if (!(d[7800] | 0)) {
            nv(9936);
            aK(44, 9936, r | 0) | 0;
            b = 7800;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9936) | 0)) {
            a = 9936;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            nv(9936);
        }
        return 9936;
    }
    function nn(a) {
        a = a | 0;
        return a | 0;
    }
    function no(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = nm() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            np(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            nq(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function np(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function nq(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = nr(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            ns(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            np(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            nt(a, e);
            nu(e);
            o = i;
            return;
        }
    }
    function nr(a) {
        a = a | 0;
        return 536870911;
    }
    function ns(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function nt(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function nu(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function nv(a) {
        a = a | 0;
        ny(a);
        return;
    }
    function nw(a) {
        a = a | 0;
        nx((a + 24) | 0);
        return;
    }
    function nx(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function ny(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 23, b, jH() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function nz(a, b) {
        a = a | 0;
        b = b | 0;
        nB(f[(nA(a) | 0) >> 2] | 0, b);
        return;
    }
    function nA(a) {
        a = a | 0;
        return ((f[((nm() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function nB(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        jL(d, b);
        b = jM(d, b) | 0;
        yS[a & 127](b);
        o = c;
        return;
    }
    function nC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = nD() | 0;
        a = nE(c) | 0;
        gE(g, b, e, a, nF(c, d) | 0, d);
        return;
    }
    function nD() {
        var a = 0, b = 0;
        if (!(d[7808] | 0)) {
            nM(9972);
            aK(45, 9972, r | 0) | 0;
            b = 7808;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(9972) | 0)) {
            a = 9972;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            nM(9972);
        }
        return 9972;
    }
    function nE(a) {
        a = a | 0;
        return a | 0;
    }
    function nF(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = nD() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            nG(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            nH(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function nG(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function nH(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = nI(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            nJ(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            nG(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            nK(a, e);
            nL(e);
            o = i;
            return;
        }
    }
    function nI(a) {
        a = a | 0;
        return 536870911;
    }
    function nJ(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function nK(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function nL(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function nM(a) {
        a = a | 0;
        nP(a);
        return;
    }
    function nN(a) {
        a = a | 0;
        nO((a + 24) | 0);
        return;
    }
    function nO(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function nP(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 9, b, nQ() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function nQ() {
        return 1348;
    }
    function nR(a, b) {
        a = a | 0;
        b = b | 0;
        return nT(f[(nS(a) | 0) >> 2] | 0, b) | 0;
    }
    function nS(a) {
        a = a | 0;
        return ((f[((nD() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function nT(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        nU(d, b);
        b = nV(d, b) | 0;
        b = iP(yU[a & 31](b) | 0) | 0;
        o = c;
        return b | 0;
    }
    function nU(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function nV(a, b) {
        a = a | 0;
        b = b | 0;
        return nW(b) | 0;
    }
    function nW(a) {
        a = a | 0;
        return a | 0;
    }
    function nX(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = nY() | 0;
        a = nZ(c) | 0;
        gE(g, b, e, a, n$(c, d) | 0, d);
        return;
    }
    function nY() {
        var a = 0, b = 0;
        if (!(d[7816] | 0)) {
            n5(10008);
            aK(46, 10008, r | 0) | 0;
            b = 7816;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10008) | 0)) {
            a = 10008;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            n5(10008);
        }
        return 10008;
    }
    function nZ(a) {
        a = a | 0;
        return a | 0;
    }
    function n$(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = nY() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            n_(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            n0(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function n_(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function n0(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = n1(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            n2(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            n_(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            n3(a, e);
            n4(e);
            o = i;
            return;
        }
    }
    function n1(a) {
        a = a | 0;
        return 536870911;
    }
    function n2(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function n3(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function n4(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function n5(a) {
        a = a | 0;
        n8(a);
        return;
    }
    function n6(a) {
        a = a | 0;
        n7((a + 24) | 0);
        return;
    }
    function n7(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function n8(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 15, b, i4() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function n9(a) {
        a = a | 0;
        return ob(f[(oa(a) | 0) >> 2] | 0) | 0;
    }
    function oa(a) {
        a = a | 0;
        return ((f[((nY() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function ob(a) {
        a = a | 0;
        return iP(y3[a & 7]() | 0) | 0;
    }
    function oc() {
        var a = 0;
        if (!(d[7832] | 0)) {
            om(10052);
            aK(25, 10052, r | 0) | 0;
            a = 7832;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10052;
    }
    function od(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = oe() | 0;
        f[(a + 4) >> 2] = of() | 0;
        f[(a + 12) >> 2] = b;
        f[(a + 8) >> 2] = og() | 0;
        f[(a + 32) >> 2] = 2;
        return;
    }
    function oe() {
        return 11709;
    }
    function of() {
        return 1188;
    }
    function og() {
        return ok() | 0;
    }
    function oh(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((oi(d, 896) | 0) == 512) {
            if (c | 0) {
                oj(c);
                xJ(c);
            }
        } else if (b | 0) {
            el(b);
            xJ(b);
        }
        return;
    }
    function oi(a, b) {
        a = a | 0;
        b = b | 0;
        return (b & a) | 0;
    }
    function oj(a) {
        a = a | 0;
        a = f[(a + 4) >> 2] | 0;
        if (a | 0) xF(a);
        return;
    }
    function ok() {
        var a = 0;
        if (!(d[7824] | 0)) {
            f[2511] = ol() | 0;
            f[2512] = 0;
            a = 7824;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10044;
    }
    function ol() {
        return 0;
    }
    function om(a) {
        a = a | 0;
        hm(a);
        return;
    }
    function on(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0;
        b = o;
        o = (o + 32) | 0;
        c = (b + 24) | 0;
        g = (b + 16) | 0;
        e = (b + 8) | 0;
        d = b;
        oo(a, 4827);
        op(a, 4834, 3) | 0;
        oq(a, 3682, 47) | 0;
        f[g >> 2] = 9;
        f[(g + 4) >> 2] = 0;
        f[c >> 2] = f[g >> 2];
        f[(c + 4) >> 2] = f[(g + 4) >> 2];
        or(a, 4841, c) | 0;
        f[e >> 2] = 1;
        f[(e + 4) >> 2] = 0;
        f[c >> 2] = f[e >> 2];
        f[(c + 4) >> 2] = f[(e + 4) >> 2];
        os(a, 4871, c) | 0;
        f[d >> 2] = 10;
        f[(d + 4) >> 2] = 0;
        f[c >> 2] = f[d >> 2];
        f[(c + 4) >> 2] = f[(d + 4) >> 2];
        ot(a, 4891, c) | 0;
        o = b;
        return;
    }
    function oo(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = p2() | 0;
        f[a >> 2] = c;
        p3(c, b);
        r2(f[a >> 2] | 0);
        return;
    }
    function op(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        pL(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function oq(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        pt(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function or(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        o7(a, b, e);
        o = d;
        return a | 0;
    }
    function os(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        oN(a, b, e);
        o = d;
        return a | 0;
    }
    function ot(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = f[(c + 4) >> 2] | 0;
        f[g >> 2] = f[c >> 2];
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        ou(a, b, e);
        o = d;
        return a | 0;
    }
    function ou(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        ov(a, c, e, 1);
        o = d;
        return;
    }
    function ov(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = ow() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = ox(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, oy(g, d) | 0, d);
        o = e;
        return;
    }
    function ow() {
        var a = 0, b = 0;
        if (!(d[7840] | 0)) {
            oF(10100);
            aK(48, 10100, r | 0) | 0;
            b = 7840;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10100) | 0)) {
            a = 10100;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            oF(10100);
        }
        return 10100;
    }
    function ox(a) {
        a = a | 0;
        return 0;
    }
    function oy(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = ow() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            oz(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            oA(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function oz(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function oA(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = oB(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            oC(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            oz(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            oD(a, i);
            oE(i);
            o = k;
            return;
        }
    }
    function oB(a) {
        a = a | 0;
        return 357913941;
    }
    function oC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function oD(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function oE(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function oF(a) {
        a = a | 0;
        oI(a);
        return;
    }
    function oG(a) {
        a = a | 0;
        oH((a + 24) | 0);
        return;
    }
    function oH(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function oI(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 6, b, oJ() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function oJ() {
        return 1364;
    }
    function oK(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = oL(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        c = oM(b, e, c) | 0;
        o = d;
        return c | 0;
    }
    function oL(a) {
        a = a | 0;
        return ((f[((ow() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function oM(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0;
        g = o;
        o = (o + 16) | 0;
        e = g;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        hI(e, c);
        e = hJ(e, c) | 0;
        e = h3(y_[d & 15](a, e) | 0) | 0;
        o = g;
        return e | 0;
    }
    function oN(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        oO(a, c, e, 0);
        o = d;
        return;
    }
    function oO(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = oP() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = oQ(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, oR(g, d) | 0, d);
        o = e;
        return;
    }
    function oP() {
        var a = 0, b = 0;
        if (!(d[7848] | 0)) {
            oY(10136);
            aK(49, 10136, r | 0) | 0;
            b = 7848;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10136) | 0)) {
            a = 10136;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            oY(10136);
        }
        return 10136;
    }
    function oQ(a) {
        a = a | 0;
        return 0;
    }
    function oR(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = oP() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            oS(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            oT(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function oS(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function oT(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = oU(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            oV(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            oS(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            oW(a, i);
            oX(i);
            o = k;
            return;
        }
    }
    function oU(a) {
        a = a | 0;
        return 357913941;
    }
    function oV(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function oW(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function oX(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function oY(a) {
        a = a | 0;
        o_(a);
        return;
    }
    function oZ(a) {
        a = a | 0;
        o$((a + 24) | 0);
        return;
    }
    function o$(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function o_(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 9, b, o0() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function o0() {
        return 1372;
    }
    function o1(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        h = o2(a) | 0;
        a = f[(h + 4) >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = a;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        o3(b, e, c);
        o = d;
        return;
    }
    function o2(a) {
        a = a | 0;
        return ((f[((oP() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function o3(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        var d = 0, e = 0, g = 0, h = bb;
        g = o;
        o = (o + 16) | 0;
        e = g;
        d = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) d = f[((f[a >> 2] | 0) + d) >> 2] | 0;
        o4(e, c);
        h = W(o5(e, c));
        yP[d & 1](a, h);
        o = g;
        return;
    }
    function o4(a, b) {
        a = a | 0;
        b = +b;
        return;
    }
    function o5(a, b) {
        a = a | 0;
        b = +b;
        return W(o6(b));
    }
    function o6(a) {
        a = +a;
        return W(a);
    }
    function o7(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        e = (d + 8) | 0;
        g = d;
        i = f[c >> 2] | 0;
        h = f[(c + 4) >> 2] | 0;
        c = gz(b) | 0;
        f[g >> 2] = i;
        f[(g + 4) >> 2] = h;
        f[e >> 2] = f[g >> 2];
        f[(e + 4) >> 2] = f[(g + 4) >> 2];
        o8(a, c, e, 0);
        o = d;
        return;
    }
    function o8(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        e = o;
        o = (o + 32) | 0;
        g = (e + 16) | 0;
        l = (e + 8) | 0;
        i = e;
        k = f[c >> 2] | 0;
        j = f[(c + 4) >> 2] | 0;
        h = f[a >> 2] | 0;
        a = o9() | 0;
        f[l >> 2] = k;
        f[(l + 4) >> 2] = j;
        f[g >> 2] = f[l >> 2];
        f[(g + 4) >> 2] = f[(l + 4) >> 2];
        c = pa(g) | 0;
        f[i >> 2] = k;
        f[(i + 4) >> 2] = j;
        f[g >> 2] = f[i >> 2];
        f[(g + 4) >> 2] = f[(i + 4) >> 2];
        gE(h, b, a, c, pb(g, d) | 0, d);
        o = e;
        return;
    }
    function o9() {
        var a = 0, b = 0;
        if (!(d[7856] | 0)) {
            pi(10172);
            aK(50, 10172, r | 0) | 0;
            b = 7856;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10172) | 0)) {
            a = 10172;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            pi(10172);
        }
        return 10172;
    }
    function pa(a) {
        a = a | 0;
        return 0;
    }
    function pb(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        l = o;
        o = (o + 32) | 0;
        e = (l + 24) | 0;
        h = (l + 16) | 0;
        i = l;
        j = (l + 8) | 0;
        g = f[a >> 2] | 0;
        d = f[(a + 4) >> 2] | 0;
        f[i >> 2] = g;
        f[(i + 4) >> 2] = d;
        m = o9() | 0;
        k = (m + 24) | 0;
        a = gI(b, 4) | 0;
        f[j >> 2] = a;
        b = (m + 28) | 0;
        c = f[b >> 2] | 0;
        if (c >>> 0 < (f[(m + 32) >> 2] | 0) >>> 0) {
            f[h >> 2] = g;
            f[(h + 4) >> 2] = d;
            f[e >> 2] = f[h >> 2];
            f[(e + 4) >> 2] = f[(h + 4) >> 2];
            pc(c, e, a);
            a = ((f[b >> 2] | 0) + 12) | 0;
            f[b >> 2] = a;
        } else {
            pd(k, i, j);
            a = f[b >> 2] | 0;
        }
        o = l;
        return (((((a - (f[k >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function pc(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = f[(b + 4) >> 2] | 0;
        f[a >> 2] = f[b >> 2];
        f[(a + 4) >> 2] = d;
        f[(a + 8) >> 2] = c;
        return;
    }
    function pd(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0;
        k = o;
        o = (o + 48) | 0;
        d = (k + 32) | 0;
        h = (k + 24) | 0;
        i = k;
        j = (a + 4) | 0;
        e = ((((((f[j >> 2] | 0) - (f[a >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        g = pe(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            l = f[a >> 2] | 0;
            n = ((((f[(a + 8) >> 2] | 0) - l) | 0) / 12) | 0;
            m = n << 1;
            pf(i, n >>> 0 < (g >>> 1) >>> 0 ? (m >>> 0 < e >>> 0 ? e : m) : g, ((((f[j >> 2] | 0) - l) | 0) / 12) | 0, (a + 8) | 0);
            j = (i + 8) | 0;
            g = f[j >> 2] | 0;
            e = f[(b + 4) >> 2] | 0;
            c = f[c >> 2] | 0;
            f[h >> 2] = f[b >> 2];
            f[(h + 4) >> 2] = e;
            f[d >> 2] = f[h >> 2];
            f[(d + 4) >> 2] = f[(h + 4) >> 2];
            pc(g, d, c);
            f[j >> 2] = (f[j >> 2] | 0) + 12;
            pg(a, i);
            ph(i);
            o = k;
            return;
        }
    }
    function pe(a) {
        a = a | 0;
        return 357913941;
    }
    function pf(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 357913941) aW();
            else {
                e = xH((b * 12) | 0) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + ((c * 12) | 0)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + ((b * 12) | 0);
        return;
    }
    function pg(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + (((((e | 0) / -12) | 0) * 12) | 0)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function ph(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + ((~(((((d + -12 - b) | 0) >>> 0) / 12) | 0) * 12) | 0);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function pi(a) {
        a = a | 0;
        pl(a);
        return;
    }
    function pj(a) {
        a = a | 0;
        pk((a + 24) | 0);
        return;
    }
    function pk(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + ((~(((((b + -12 - d) | 0) >>> 0) / 12) | 0) * 12) | 0);
            xJ(c);
        }
        return;
    }
    function pl(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 2, 3, b, pm() | 0, 2);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function pm() {
        return 1380;
    }
    function pn(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0;
        e = o;
        o = (o + 16) | 0;
        g = (e + 8) | 0;
        h = e;
        i = po(a) | 0;
        a = f[(i + 4) >> 2] | 0;
        f[h >> 2] = f[i >> 2];
        f[(h + 4) >> 2] = a;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = f[(h + 4) >> 2];
        pp(b, g, c, d);
        o = e;
        return;
    }
    function po(a) {
        a = a | 0;
        return ((f[((o9() | 0) + 24) >> 2] | 0) + ((a * 12) | 0)) | 0;
    }
    function pp(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0;
        i = o;
        o = (o + 16) | 0;
        g = (i + 1) | 0;
        h = i;
        e = f[b >> 2] | 0;
        b = f[(b + 4) >> 2] | 0;
        a = (a + (b >> 1)) | 0;
        if (b & 1) e = f[((f[a >> 2] | 0) + e) >> 2] | 0;
        hI(g, c);
        g = hJ(g, c) | 0;
        pq(h, d);
        h = pr(h, d) | 0;
        y7[e & 15](a, g, h);
        o = i;
        return;
    }
    function pq(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function pr(a, b) {
        a = a | 0;
        b = b | 0;
        return ps(b) | 0;
    }
    function ps(a) {
        a = a | 0;
        return ((a | 0) != 0) | 0;
    }
    function pt(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = pu() | 0;
        a = pv(c) | 0;
        gE(g, b, e, a, pw(c, d) | 0, d);
        return;
    }
    function pu() {
        var a = 0, b = 0;
        if (!(d[7864] | 0)) {
            pD(10208);
            aK(51, 10208, r | 0) | 0;
            b = 7864;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10208) | 0)) {
            a = 10208;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            pD(10208);
        }
        return 10208;
    }
    function pv(a) {
        a = a | 0;
        return a | 0;
    }
    function pw(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = pu() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            px(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            py(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function px(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function py(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = pz(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            pA(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            px(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            pB(a, e);
            pC(e);
            o = i;
            return;
        }
    }
    function pz(a) {
        a = a | 0;
        return 536870911;
    }
    function pA(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function pB(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function pC(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function pD(a) {
        a = a | 0;
        pG(a);
        return;
    }
    function pE(a) {
        a = a | 0;
        pF((a + 24) | 0);
        return;
    }
    function pF(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function pG(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 24, b, pH() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function pH() {
        return 1392;
    }
    function pI(a, b) {
        a = a | 0;
        b = b | 0;
        pK(f[(pJ(a) | 0) >> 2] | 0, b);
        return;
    }
    function pJ(a) {
        a = a | 0;
        return ((f[((pu() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function pK(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        nU(d, b);
        b = nV(d, b) | 0;
        yS[a & 127](b);
        o = c;
        return;
    }
    function pL(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = pM() | 0;
        a = pN(c) | 0;
        gE(g, b, e, a, pO(c, d) | 0, d);
        return;
    }
    function pM() {
        var a = 0, b = 0;
        if (!(d[7872] | 0)) {
            pV(10244);
            aK(52, 10244, r | 0) | 0;
            b = 7872;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10244) | 0)) {
            a = 10244;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            pV(10244);
        }
        return 10244;
    }
    function pN(a) {
        a = a | 0;
        return a | 0;
    }
    function pO(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = pM() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            pP(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            pQ(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function pP(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function pQ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = pR(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            pS(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            pP(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            pT(a, e);
            pU(e);
            o = i;
            return;
        }
    }
    function pR(a) {
        a = a | 0;
        return 536870911;
    }
    function pS(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function pT(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function pU(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function pV(a) {
        a = a | 0;
        pY(a);
        return;
    }
    function pW(a) {
        a = a | 0;
        pX((a + 24) | 0);
        return;
    }
    function pX(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function pY(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 16, b, pZ() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function pZ() {
        return 1400;
    }
    function p$(a) {
        a = a | 0;
        return p0(f[(p_(a) | 0) >> 2] | 0) | 0;
    }
    function p_(a) {
        a = a | 0;
        return ((f[((pM() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function p0(a) {
        a = a | 0;
        return p1(y3[a & 7]() | 0) | 0;
    }
    function p1(a) {
        a = a | 0;
        return a | 0;
    }
    function p2() {
        var a = 0;
        if (!(d[7880] | 0)) {
            p9(10280);
            aK(25, 10280, r | 0) | 0;
            a = 7880;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10280;
    }
    function p3(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = p4() | 0;
        f[(a + 4) >> 2] = p5() | 0;
        f[(a + 12) >> 2] = b;
        f[(a + 8) >> 2] = p6() | 0;
        f[(a + 32) >> 2] = 4;
        return;
    }
    function p4() {
        return 11711;
    }
    function p5() {
        return 1356;
    }
    function p6() {
        return ok() | 0;
    }
    function p7(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((oi(d, 896) | 0) == 512) {
            if (c | 0) {
                p8(c);
                xJ(c);
            }
        } else if (b | 0) {
            ed(b);
            xJ(b);
        }
        return;
    }
    function p8(a) {
        a = a | 0;
        a = f[(a + 4) >> 2] | 0;
        if (a | 0) xF(a);
        return;
    }
    function p9(a) {
        a = a | 0;
        hm(a);
        return;
    }
    function qa(a) {
        a = a | 0;
        qb(a, 4920);
        qc(a) | 0;
        qd(a) | 0;
        return;
    }
    function qb(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = k_() | 0;
        f[a >> 2] = c;
        qD(c, b);
        r2(f[a >> 2] | 0);
        return;
    }
    function qc(a) {
        a = a | 0;
        var b = 0;
        b = f[a >> 2] | 0;
        qf(b, qr() | 0);
        return a | 0;
    }
    function qd(a) {
        a = a | 0;
        var b = 0;
        b = f[a >> 2] | 0;
        qf(b, qe() | 0);
        return a | 0;
    }
    function qe() {
        var a = 0;
        if (!(d[7888] | 0)) {
            qg(10328);
            aK(53, 10328, r | 0) | 0;
            a = 7888;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        if (!(gR(10328) | 0)) qg(10328);
        return 10328;
    }
    function qf(a, b) {
        a = a | 0;
        b = b | 0;
        gE(a, 0, b, 0, 0, 0);
        return;
    }
    function qg(a) {
        a = a | 0;
        qj(a);
        ql(a, 10);
        return;
    }
    function qh(a) {
        a = a | 0;
        qi((a + 24) | 0);
        return;
    }
    function qi(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function qj(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 5, 1, b, qo() | 0, 2);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function qk(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        qm(a, b, c);
        return;
    }
    function ql(a, b) {
        a = a | 0;
        b = b | 0;
        f[(a + 20) >> 2] = b;
        return;
    }
    function qm(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 16) | 0;
        g = (d + 8) | 0;
        i = (d + 13) | 0;
        e = d;
        h = (d + 12) | 0;
        hI(i, b);
        f[g >> 2] = hJ(i, b) | 0;
        hG(h, c);
        k[e >> 3] = +hH(h, c);
        qn(a, g, e);
        o = d;
        return;
    }
    function qn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        e3((a + 8) | 0, f[b >> 2] | 0, +k[c >> 3]);
        d[(a + 24) >> 0] = 1;
        return;
    }
    function qo() {
        return 1404;
    }
    function qp(a, b) {
        a = a | 0;
        b = +b;
        return qq(a, b) | 0;
    }
    function qq(a, b) {
        a = a | 0;
        b = +b;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        d = o;
        o = (o + 16) | 0;
        g = (d + 4) | 0;
        h = (d + 8) | 0;
        i = d;
        e = uc(8) | 0;
        c = e;
        j = xH(16) | 0;
        hI(g, a);
        a = hJ(g, a) | 0;
        hG(h, b);
        e3(j, a, +hH(h, b));
        h = (c + 4) | 0;
        f[h >> 2] = j;
        a = xH(8) | 0;
        h = f[h >> 2] | 0;
        f[i >> 2] = 0;
        f[g >> 2] = f[i >> 2];
        k2(a, h, g);
        f[e >> 2] = a;
        o = d;
        return c | 0;
    }
    function qr() {
        var a = 0;
        if (!(d[7896] | 0)) {
            qs(10364);
            aK(54, 10364, r | 0) | 0;
            a = 7896;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        if (!(gR(10364) | 0)) qs(10364);
        return 10364;
    }
    function qs(a) {
        a = a | 0;
        qv(a);
        ql(a, 55);
        return;
    }
    function qt(a) {
        a = a | 0;
        qu((a + 24) | 0);
        return;
    }
    function qu(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function qv(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 5, 4, b, qA() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function qw(a) {
        a = a | 0;
        qx(a);
        return;
    }
    function qx(a) {
        a = a | 0;
        qy(a);
        return;
    }
    function qy(a) {
        a = a | 0;
        qz((a + 8) | 0);
        d[(a + 24) >> 0] = 1;
        return;
    }
    function qz(a) {
        a = a | 0;
        f[a >> 2] = 0;
        k[(a + 8) >> 3] = 0.0;
        return;
    }
    function qA() {
        return 1424;
    }
    function qB() {
        return qC() | 0;
    }
    function qC() {
        var a = 0, b = 0, c = 0, d = 0, e = 0, g = 0, h = 0;
        b = o;
        o = (o + 16) | 0;
        e = (b + 4) | 0;
        h = b;
        c = uc(8) | 0;
        a = c;
        d = xH(16) | 0;
        qz(d);
        g = (a + 4) | 0;
        f[g >> 2] = d;
        d = xH(8) | 0;
        g = f[g >> 2] | 0;
        f[h >> 2] = 0;
        f[e >> 2] = f[h >> 2];
        k2(d, g, e);
        f[c >> 2] = d;
        o = b;
        return a | 0;
    }
    function qD(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = qE() | 0;
        f[(a + 4) >> 2] = qF() | 0;
        f[(a + 12) >> 2] = b;
        f[(a + 8) >> 2] = qG() | 0;
        f[(a + 32) >> 2] = 5;
        return;
    }
    function qE() {
        return 11710;
    }
    function qF() {
        return 1416;
    }
    function qG() {
        return qJ() | 0;
    }
    function qH(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((oi(d, 896) | 0) == 512) {
            if (c | 0) {
                qI(c);
                xJ(c);
            }
        } else if (b | 0) xJ(b);
        return;
    }
    function qI(a) {
        a = a | 0;
        a = f[(a + 4) >> 2] | 0;
        if (a | 0) xF(a);
        return;
    }
    function qJ() {
        var a = 0;
        if (!(d[7904] | 0)) {
            f[2600] = qK() | 0;
            f[2601] = 0;
            a = 7904;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10400;
    }
    function qK() {
        return f[357] | 0;
    }
    function qL(a) {
        a = a | 0;
        qM(a, 4926);
        qN(a) | 0;
        return;
    }
    function qM(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = g_() | 0;
        f[a >> 2] = c;
        qZ(c, b);
        r2(f[a >> 2] | 0);
        return;
    }
    function qN(a) {
        a = a | 0;
        var b = 0;
        b = f[a >> 2] | 0;
        qf(b, qO() | 0);
        return a | 0;
    }
    function qO() {
        var a = 0;
        if (!(d[7912] | 0)) {
            qP(10412);
            aK(56, 10412, r | 0) | 0;
            a = 7912;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        if (!(gR(10412) | 0)) qP(10412);
        return 10412;
    }
    function qP(a) {
        a = a | 0;
        qS(a);
        ql(a, 57);
        return;
    }
    function qQ(a) {
        a = a | 0;
        qR((a + 24) | 0);
        return;
    }
    function qR(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function qS(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 5, 5, b, qW() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function qT(a) {
        a = a | 0;
        qU(a);
        return;
    }
    function qU(a) {
        a = a | 0;
        qV(a);
        return;
    }
    function qV(a) {
        a = a | 0;
        var b = 0, c = 0;
        b = (a + 8) | 0;
        c = (b + 48) | 0;
        do {
            f[b >> 2] = 0;
            b = (b + 4) | 0;
        }while ((b | 0) < (c | 0))
        d[(a + 56) >> 0] = 1;
        return;
    }
    function qW() {
        return 1432;
    }
    function qX() {
        return qY() | 0;
    }
    function qY() {
        var a = 0, b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0;
        h = o;
        o = (o + 16) | 0;
        a = (h + 4) | 0;
        b = h;
        c = uc(8) | 0;
        d = c;
        e = xH(48) | 0;
        g = e;
        i = (g + 48) | 0;
        do {
            f[g >> 2] = 0;
            g = (g + 4) | 0;
        }while ((g | 0) < (i | 0))
        g = (d + 4) | 0;
        f[g >> 2] = e;
        i = xH(8) | 0;
        g = f[g >> 2] | 0;
        f[b >> 2] = 0;
        f[a >> 2] = f[b >> 2];
        g6(i, g, a);
        f[c >> 2] = i;
        o = h;
        return d | 0;
    }
    function qZ(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = q$() | 0;
        f[(a + 4) >> 2] = q_() | 0;
        f[(a + 12) >> 2] = b;
        f[(a + 8) >> 2] = q0() | 0;
        f[(a + 32) >> 2] = 6;
        return;
    }
    function q$() {
        return 11704;
    }
    function q_() {
        return 1436;
    }
    function q0() {
        return qJ() | 0;
    }
    function q1(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((oi(d, 896) | 0) == 512) {
            if (c | 0) {
                q2(c);
                xJ(c);
            }
        } else if (b | 0) xJ(b);
        return;
    }
    function q2(a) {
        a = a | 0;
        a = f[(a + 4) >> 2] | 0;
        if (a | 0) xF(a);
        return;
    }
    function q3(a) {
        a = a | 0;
        q4(a, 4933);
        q5(a) | 0;
        q6(a) | 0;
        return;
    }
    function q4(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = rz() | 0;
        f[a >> 2] = c;
        rA(c, b);
        r2(f[a >> 2] | 0);
        return;
    }
    function q5(a) {
        a = a | 0;
        var b = 0;
        b = f[a >> 2] | 0;
        qf(b, rn() | 0);
        return a | 0;
    }
    function q6(a) {
        a = a | 0;
        var b = 0;
        b = f[a >> 2] | 0;
        qf(b, q7() | 0);
        return a | 0;
    }
    function q7() {
        var a = 0;
        if (!(d[7920] | 0)) {
            q8(10452);
            aK(58, 10452, r | 0) | 0;
            a = 7920;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        if (!(gR(10452) | 0)) q8(10452);
        return 10452;
    }
    function q8(a) {
        a = a | 0;
        rb(a);
        ql(a, 1);
        return;
    }
    function q9(a) {
        a = a | 0;
        ra((a + 24) | 0);
        return;
    }
    function ra(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function rb(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 5, 1, b, rg() | 0, 2);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function rc(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        rd(a, b, c);
        return;
    }
    function rd(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        d = o;
        o = (o + 32) | 0;
        f = (d + 8) | 0;
        h = (d + 17) | 0;
        e = d;
        g = (d + 16) | 0;
        hG(h, b);
        k[f >> 3] = +hH(h, b);
        hG(g, c);
        k[e >> 3] = +hH(g, c);
        re(a, f, e);
        o = d;
        return;
    }
    function re(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        rf((a + 8) | 0, +k[b >> 3], +k[c >> 3]);
        d[(a + 24) >> 0] = 1;
        return;
    }
    function rf(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        k[a >> 3] = b;
        k[(a + 8) >> 3] = c;
        return;
    }
    function rg() {
        return 1472;
    }
    function rh(a, b) {
        a = +a;
        b = +b;
        return ri(a, b) | 0;
    }
    function ri(a, b) {
        a = +a;
        b = +b;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        d = o;
        o = (o + 16) | 0;
        h = (d + 4) | 0;
        i = (d + 8) | 0;
        j = d;
        e = uc(8) | 0;
        c = e;
        g = xH(16) | 0;
        hG(h, a);
        a = +hH(h, a);
        hG(i, b);
        rf(g, a, +hH(i, b));
        i = (c + 4) | 0;
        f[i >> 2] = g;
        g = xH(8) | 0;
        i = f[i >> 2] | 0;
        f[j >> 2] = 0;
        f[h >> 2] = f[j >> 2];
        rj(g, i, h);
        f[e >> 2] = g;
        o = d;
        return c | 0;
    }
    function rj(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        c = xH(16) | 0;
        f[(c + 4) >> 2] = 0;
        f[(c + 8) >> 2] = 0;
        f[c >> 2] = 1452;
        f[(c + 12) >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function rk(a) {
        a = a | 0;
        xB(a);
        xJ(a);
        return;
    }
    function rl(a) {
        a = a | 0;
        a = f[(a + 12) >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function rm(a) {
        a = a | 0;
        xJ(a);
        return;
    }
    function rn() {
        var a = 0;
        if (!(d[7928] | 0)) {
            ro(10488);
            aK(59, 10488, r | 0) | 0;
            a = 7928;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        if (!(gR(10488) | 0)) ro(10488);
        return 10488;
    }
    function ro(a) {
        a = a | 0;
        rr(a);
        ql(a, 60);
        return;
    }
    function rp(a) {
        a = a | 0;
        rq((a + 24) | 0);
        return;
    }
    function rq(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function rr(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 5, 6, b, rw() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function rs(a) {
        a = a | 0;
        rt(a);
        return;
    }
    function rt(a) {
        a = a | 0;
        ru(a);
        return;
    }
    function ru(a) {
        a = a | 0;
        rv((a + 8) | 0);
        d[(a + 24) >> 0] = 1;
        return;
    }
    function rv(a) {
        a = a | 0;
        f[a >> 2] = 0;
        f[(a + 4) >> 2] = 0;
        f[(a + 8) >> 2] = 0;
        f[(a + 12) >> 2] = 0;
        return;
    }
    function rw() {
        return 1492;
    }
    function rx() {
        return ry() | 0;
    }
    function ry() {
        var a = 0, b = 0, c = 0, d = 0, e = 0, g = 0, h = 0;
        b = o;
        o = (o + 16) | 0;
        e = (b + 4) | 0;
        h = b;
        c = uc(8) | 0;
        a = c;
        d = xH(16) | 0;
        rv(d);
        g = (a + 4) | 0;
        f[g >> 2] = d;
        d = xH(8) | 0;
        g = f[g >> 2] | 0;
        f[h >> 2] = 0;
        f[e >> 2] = f[h >> 2];
        rj(d, g, e);
        f[c >> 2] = d;
        o = b;
        return a | 0;
    }
    function rz() {
        var a = 0;
        if (!(d[7936] | 0)) {
            rG(10524);
            aK(25, 10524, r | 0) | 0;
            a = 7936;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10524;
    }
    function rA(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = rB() | 0;
        f[(a + 4) >> 2] = rC() | 0;
        f[(a + 12) >> 2] = b;
        f[(a + 8) >> 2] = rD() | 0;
        f[(a + 32) >> 2] = 7;
        return;
    }
    function rB() {
        return 11700;
    }
    function rC() {
        return 1484;
    }
    function rD() {
        return qJ() | 0;
    }
    function rE(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((oi(d, 896) | 0) == 512) {
            if (c | 0) {
                rF(c);
                xJ(c);
            }
        } else if (b | 0) xJ(b);
        return;
    }
    function rF(a) {
        a = a | 0;
        a = f[(a + 4) >> 2] | 0;
        if (a | 0) xF(a);
        return;
    }
    function rG(a) {
        a = a | 0;
        hm(a);
        return;
    }
    function rH(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        a = gz(b) | 0;
        b = rI(c) | 0;
        c = rJ(c, 0) | 0;
        sk(a, b, c, rK() | 0, 0);
        return;
    }
    function rI(a) {
        a = a | 0;
        return a | 0;
    }
    function rJ(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = rK() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            rS(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            rT(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function rK() {
        var a = 0, b = 0;
        if (!(d[7944] | 0)) {
            rL(10568);
            aK(61, 10568, r | 0) | 0;
            b = 7944;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10568) | 0)) {
            a = 10568;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            rL(10568);
        }
        return 10568;
    }
    function rL(a) {
        a = a | 0;
        rO(a);
        return;
    }
    function rM(a) {
        a = a | 0;
        rN((a + 24) | 0);
        return;
    }
    function rN(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function rO(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 17, b, jn() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function rP(a) {
        a = a | 0;
        return rR(f[(rQ(a) | 0) >> 2] | 0) | 0;
    }
    function rQ(a) {
        a = a | 0;
        return ((f[((rK() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function rR(a) {
        a = a | 0;
        return jr(y3[a & 7]() | 0) | 0;
    }
    function rS(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function rT(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = rU(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            rV(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            rS(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            rW(a, e);
            rX(e);
            o = i;
            return;
        }
    }
    function rU(a) {
        a = a | 0;
        return 536870911;
    }
    function rV(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function rW(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function rX(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function rY() {
        rZ();
        return;
    }
    function rZ() {
        r$(10604);
        return;
    }
    function r$(a) {
        a = a | 0;
        r_(a, 4955);
        return;
    }
    function r_(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = r0() | 0;
        f[a >> 2] = c;
        r1(c, b);
        r2(f[a >> 2] | 0);
        return;
    }
    function r0() {
        var a = 0;
        if (!(d[7952] | 0)) {
            sc(10612);
            aK(25, 10612, r | 0) | 0;
            a = 7952;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10612;
    }
    function r1(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = r7() | 0;
        f[(a + 4) >> 2] = r8() | 0;
        f[(a + 12) >> 2] = b;
        f[(a + 8) >> 2] = r9() | 0;
        f[(a + 32) >> 2] = 8;
        return;
    }
    function r2(a) {
        a = a | 0;
        var b = 0, c = 0;
        b = o;
        o = (o + 16) | 0;
        c = b;
        r3() | 0;
        f[c >> 2] = a;
        r4(10608, c);
        o = b;
        return;
    }
    function r3() {
        if (!(d[11714] | 0)) {
            f[2652] = 0;
            aK(62, 10608, r | 0) | 0;
            d[11714] = 1;
        }
        return 10608;
    }
    function r4(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = xH(8) | 0;
        f[(c + 4) >> 2] = f[b >> 2];
        f[c >> 2] = f[a >> 2];
        f[a >> 2] = c;
        return;
    }
    function r5(a) {
        a = a | 0;
        r6(a);
        return;
    }
    function r6(a) {
        a = a | 0;
        var b = 0, c = 0;
        b = f[a >> 2] | 0;
        if (b | 0) do {
            c = b;
            b = f[b >> 2] | 0;
            xJ(c);
        }while ((b | 0) != 0)
        f[a >> 2] = 0;
        return;
    }
    function r7() {
        return 11715;
    }
    function r8() {
        return 1496;
    }
    function r9() {
        return ok() | 0;
    }
    function sa(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((oi(d, 896) | 0) == 512) {
            if (c | 0) {
                sb(c);
                xJ(c);
            }
        } else if (b | 0) xJ(b);
        return;
    }
    function sb(a) {
        a = a | 0;
        a = f[(a + 4) >> 2] | 0;
        if (a | 0) xF(a);
        return;
    }
    function sc(a) {
        a = a | 0;
        hm(a);
        return;
    }
    function sd(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        r3() | 0;
        c = f[2652] | 0;
        a: do if (c | 0) {
            while(1){
                d = f[(c + 4) >> 2] | 0;
                if (d | 0 ? (w_(se(d) | 0, a) | 0) == 0 : 0) break;
                c = f[c >> 2] | 0;
                if (!c) break a;
            }
            sf(d, b);
        }
        while (0)
        return;
    }
    function se(a) {
        a = a | 0;
        return f[(a + 12) >> 2] | 0;
    }
    function sf(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        a = (a + 36) | 0;
        c = f[a >> 2] | 0;
        if (c | 0) {
            em(c);
            xJ(c);
        }
        c = xH(4) | 0;
        fv(c, b);
        f[a >> 2] = c;
        return;
    }
    function sg() {
        if (!(d[11716] | 0)) {
            f[2664] = 0;
            aK(63, 10656, r | 0) | 0;
            d[11716] = 1;
        }
        return 10656;
    }
    function sh() {
        var a = 0;
        if (!(d[11717] | 0)) {
            si();
            f[2665] = 1504;
            d[11717] = 1;
            a = 1504;
        } else a = f[2665] | 0;
        return a | 0;
    }
    function si() {
        if (!(d[11740] | 0)) {
            d[11718] = gI(gI(8, 0) | 0, 0) | 0;
            d[11719] = gI(gI(0, 0) | 0, 0) | 0;
            d[11720] = gI(gI(0, 16) | 0, 0) | 0;
            d[11721] = gI(gI(8, 0) | 0, 0) | 0;
            d[11722] = gI(gI(0, 0) | 0, 0) | 0;
            d[11723] = gI(gI(8, 0) | 0, 0) | 0;
            d[11724] = gI(gI(0, 0) | 0, 0) | 0;
            d[11725] = gI(gI(8, 0) | 0, 0) | 0;
            d[11726] = gI(gI(0, 0) | 0, 0) | 0;
            d[11727] = gI(gI(8, 0) | 0, 0) | 0;
            d[11728] = gI(gI(0, 0) | 0, 0) | 0;
            d[11729] = gI(gI(0, 0) | 0, 32) | 0;
            d[11730] = gI(gI(0, 0) | 0, 32) | 0;
            d[11740] = 1;
        }
        return;
    }
    function sj() {
        return 1572;
    }
    function sk(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        g = o;
        o = (o + 32) | 0;
        l = (g + 16) | 0;
        k = (g + 12) | 0;
        j = (g + 8) | 0;
        i = (g + 4) | 0;
        h = g;
        f[l >> 2] = a;
        f[k >> 2] = b;
        f[j >> 2] = c;
        f[i >> 2] = d;
        f[h >> 2] = e;
        sg() | 0;
        sl(10656, l, k, j, i, h);
        o = g;
        return;
    }
    function sl(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        var h = 0;
        h = xH(24) | 0;
        gH((h + 4) | 0, f[b >> 2] | 0, f[c >> 2] | 0, f[d >> 2] | 0, f[e >> 2] | 0, f[g >> 2] | 0);
        f[h >> 2] = f[a >> 2];
        f[a >> 2] = h;
        return;
    }
    function sm(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0;
        u = o;
        o = (o + 32) | 0;
        q = (u + 20) | 0;
        r = (u + 8) | 0;
        s = (u + 4) | 0;
        t = u;
        b = f[b >> 2] | 0;
        if (b | 0) {
            p = (q + 4) | 0;
            j = (q + 8) | 0;
            k = (r + 4) | 0;
            l = (r + 8) | 0;
            m = (r + 8) | 0;
            n = (q + 8) | 0;
            do {
                h = (b + 4) | 0;
                i = sn(h) | 0;
                if (i | 0) {
                    e = so(i) | 0;
                    f[q >> 2] = 0;
                    f[p >> 2] = 0;
                    f[j >> 2] = 0;
                    d = ((sp(i) | 0) + 1) | 0;
                    sq(q, d);
                    if (d | 0) while(1){
                        d = (d + -1) | 0;
                        wn(r, f[e >> 2] | 0);
                        g = f[p >> 2] | 0;
                        if (g >>> 0 < (f[n >> 2] | 0) >>> 0) {
                            f[g >> 2] = f[r >> 2];
                            f[p >> 2] = (f[p >> 2] | 0) + 4;
                        } else sr(q, r);
                        if (!d) break;
                        else e = (e + 4) | 0;
                    }
                    d = ss(i) | 0;
                    f[r >> 2] = 0;
                    f[k >> 2] = 0;
                    f[l >> 2] = 0;
                    a: do if (f[d >> 2] | 0) {
                        e = 0;
                        g = 0;
                        while(1){
                            if ((e | 0) == (g | 0)) st(r, d);
                            else {
                                f[e >> 2] = f[d >> 2];
                                f[k >> 2] = (f[k >> 2] | 0) + 4;
                            }
                            d = (d + 4) | 0;
                            if (!(f[d >> 2] | 0)) break a;
                            e = f[k >> 2] | 0;
                            g = f[m >> 2] | 0;
                        }
                    }
                    while (0)
                    f[s >> 2] = su(h) | 0;
                    f[t >> 2] = gR(i) | 0;
                    sv(c, a, s, t, q, r);
                    sw(r);
                    sx(q);
                }
                b = f[b >> 2] | 0;
            }while ((b | 0) != 0)
        }
        o = u;
        return;
    }
    function sn(a) {
        a = a | 0;
        return f[(a + 12) >> 2] | 0;
    }
    function so(a) {
        a = a | 0;
        return f[(a + 12) >> 2] | 0;
    }
    function sp(a) {
        a = a | 0;
        return f[(a + 16) >> 2] | 0;
    }
    function sq(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        e = o;
        o = (o + 32) | 0;
        c = e;
        d = f[a >> 2] | 0;
        if ((((f[(a + 8) >> 2] | 0) - d) >> 2) >>> 0 < b >>> 0) {
            s2(c, b, ((f[(a + 4) >> 2] | 0) - d) >> 2, (a + 8) | 0);
            s3(a, c);
            s4(c);
        }
        o = e;
        return;
    }
    function sr(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0;
        h = o;
        o = (o + 32) | 0;
        c = h;
        d = (a + 4) | 0;
        e = ((((f[d >> 2] | 0) - (f[a >> 2] | 0)) >> 2) + 1) | 0;
        g = s$(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            i = f[a >> 2] | 0;
            k = ((f[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 1;
            s2(c, (k >> 2) >>> 0 < (g >>> 1) >>> 0 ? j >>> 0 < e >>> 0 ? e : j : g, ((f[d >> 2] | 0) - i) >> 2, (a + 8) | 0);
            g = (c + 8) | 0;
            f[f[g >> 2] >> 2] = f[b >> 2];
            f[g >> 2] = (f[g >> 2] | 0) + 4;
            s3(a, c);
            s4(c);
            o = h;
            return;
        }
    }
    function ss(a) {
        a = a | 0;
        return f[(a + 8) >> 2] | 0;
    }
    function st(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0;
        h = o;
        o = (o + 32) | 0;
        c = h;
        d = (a + 4) | 0;
        e = ((((f[d >> 2] | 0) - (f[a >> 2] | 0)) >> 2) + 1) | 0;
        g = sX(a) | 0;
        if (g >>> 0 < e >>> 0) xA(a);
        else {
            i = f[a >> 2] | 0;
            k = ((f[(a + 8) >> 2] | 0) - i) | 0;
            j = k >> 1;
            s_(c, (k >> 2) >>> 0 < (g >>> 1) >>> 0 ? j >>> 0 < e >>> 0 ? e : j : g, ((f[d >> 2] | 0) - i) >> 2, (a + 8) | 0);
            g = (c + 8) | 0;
            f[f[g >> 2] >> 2] = f[b >> 2];
            f[g >> 2] = (f[g >> 2] | 0) + 4;
            s0(a, c);
            s1(c);
            o = h;
            return;
        }
    }
    function su(a) {
        a = a | 0;
        return f[a >> 2] | 0;
    }
    function sv(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        sy(a, b, c, d, e, f);
        return;
    }
    function sw(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -4 - d) | 0) >>> 2) << 2);
            xJ(c);
        }
        return;
    }
    function sx(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -4 - d) | 0) >>> 2) << 2);
            xJ(c);
        }
        return;
    }
    function sy(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        h = o;
        o = (o + 48) | 0;
        l = (h + 40) | 0;
        i = (h + 32) | 0;
        m = (h + 24) | 0;
        j = (h + 12) | 0;
        k = h;
        wt(i);
        a = fz(a) | 0;
        f[m >> 2] = f[b >> 2];
        c = f[c >> 2] | 0;
        d = f[d >> 2] | 0;
        sz(j, e);
        sA(k, g);
        f[l >> 2] = f[m >> 2];
        sB(a, l, c, d, j, k);
        sw(k);
        sx(j);
        wv(i);
        o = h;
        return;
    }
    function sz(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        f[a >> 2] = 0;
        f[(a + 4) >> 2] = 0;
        f[(a + 8) >> 2] = 0;
        c = (b + 4) | 0;
        d = ((f[c >> 2] | 0) - (f[b >> 2] | 0)) >> 2;
        if (d | 0) {
            sY(a, d);
            sZ(a, f[b >> 2] | 0, f[c >> 2] | 0, d);
        }
        return;
    }
    function sA(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        f[a >> 2] = 0;
        f[(a + 4) >> 2] = 0;
        f[(a + 8) >> 2] = 0;
        c = (b + 4) | 0;
        d = ((f[c >> 2] | 0) - (f[b >> 2] | 0)) >> 2;
        if (d | 0) {
            sV(a, d);
            sW(a, f[b >> 2] | 0, f[c >> 2] | 0, d);
        }
        return;
    }
    function sB(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0, l = 0, m = 0;
        h = o;
        o = (o + 32) | 0;
        l = (h + 28) | 0;
        m = (h + 24) | 0;
        i = (h + 12) | 0;
        j = h;
        k = fC(sC() | 0) | 0;
        f[m >> 2] = f[b >> 2];
        f[l >> 2] = f[m >> 2];
        b = sD(l) | 0;
        c = sE(c) | 0;
        d = sF(d) | 0;
        f[i >> 2] = f[e >> 2];
        l = (e + 4) | 0;
        f[(i + 4) >> 2] = f[l >> 2];
        m = (e + 8) | 0;
        f[(i + 8) >> 2] = f[m >> 2];
        f[m >> 2] = 0;
        f[l >> 2] = 0;
        f[e >> 2] = 0;
        e = sG(i) | 0;
        f[j >> 2] = f[g >> 2];
        l = (g + 4) | 0;
        f[(j + 4) >> 2] = f[l >> 2];
        m = (g + 8) | 0;
        f[(j + 8) >> 2] = f[m >> 2];
        f[m >> 2] = 0;
        f[l >> 2] = 0;
        f[g >> 2] = 0;
        aE(0, k | 0, a | 0, b | 0, c | 0, d | 0, e | 0, sH(j) | 0) | 0;
        sw(j);
        sx(i);
        o = h;
        return;
    }
    function sC() {
        var a = 0;
        if (!(d[7968] | 0)) {
            sT(10708);
            a = 7968;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10708;
    }
    function sD(a) {
        a = a | 0;
        return sL(a) | 0;
    }
    function sE(a) {
        a = a | 0;
        return sJ(a) | 0;
    }
    function sF(a) {
        a = a | 0;
        return jr(a) | 0;
    }
    function sG(a) {
        a = a | 0;
        return sK(a) | 0;
    }
    function sH(a) {
        a = a | 0;
        return sI(a) | 0;
    }
    function sI(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        d = ((f[(a + 4) >> 2] | 0) - (f[a >> 2] | 0)) | 0;
        c = d >> 2;
        d = uc((d + 4) | 0) | 0;
        f[d >> 2] = c;
        if (c | 0) {
            b = 0;
            do {
                f[(d + 4 + (b << 2)) >> 2] = sJ(f[((f[a >> 2] | 0) + (b << 2)) >> 2] | 0) | 0;
                b = (b + 1) | 0;
            }while ((b | 0) != (c | 0))
        }
        return d | 0;
    }
    function sJ(a) {
        a = a | 0;
        return a | 0;
    }
    function sK(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        d = ((f[(a + 4) >> 2] | 0) - (f[a >> 2] | 0)) | 0;
        c = d >> 2;
        d = uc((d + 4) | 0) | 0;
        f[d >> 2] = c;
        if (c | 0) {
            b = 0;
            do {
                f[(d + 4 + (b << 2)) >> 2] = sL(((f[a >> 2] | 0) + (b << 2)) | 0) | 0;
                b = (b + 1) | 0;
            }while ((b | 0) != (c | 0))
        }
        return d | 0;
    }
    function sL(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0;
        e = o;
        o = (o + 32) | 0;
        b = (e + 12) | 0;
        c = e;
        d = g0(sM() | 0) | 0;
        if (!d) a = sN(a) | 0;
        else {
            g1(b, d);
            g2(c, b);
            wq(a, c);
            a = g4(b) | 0;
        }
        o = e;
        return a | 0;
    }
    function sM() {
        var a = 0;
        if (!(d[7960] | 0)) {
            sS(10664);
            aK(25, 10664, r | 0) | 0;
            a = 7960;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10664;
    }
    function sN(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0;
        c = o;
        o = (o + 16) | 0;
        e = (c + 4) | 0;
        h = c;
        d = uc(8) | 0;
        b = d;
        i = xH(4) | 0;
        f[i >> 2] = f[a >> 2];
        g = (b + 4) | 0;
        f[g >> 2] = i;
        a = xH(8) | 0;
        g = f[g >> 2] | 0;
        f[h >> 2] = 0;
        f[e >> 2] = f[h >> 2];
        sO(a, g, e);
        f[d >> 2] = a;
        o = c;
        return b | 0;
    }
    function sO(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        c = xH(16) | 0;
        f[(c + 4) >> 2] = 0;
        f[(c + 8) >> 2] = 0;
        f[c >> 2] = 1656;
        f[(c + 12) >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function sP(a) {
        a = a | 0;
        xB(a);
        xJ(a);
        return;
    }
    function sQ(a) {
        a = a | 0;
        a = f[(a + 12) >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function sR(a) {
        a = a | 0;
        xJ(a);
        return;
    }
    function sS(a) {
        a = a | 0;
        hm(a);
        return;
    }
    function sT(a) {
        a = a | 0;
        fO(a, sU() | 0, 5);
        return;
    }
    function sU() {
        return 1676;
    }
    function sV(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        if ((sX(a) | 0) >>> 0 < b >>> 0) xA(a);
        if (b >>> 0 > 1073741823) aW();
        else {
            c = xH(b << 2) | 0;
            f[(a + 4) >> 2] = c;
            f[a >> 2] = c;
            f[(a + 8) >> 2] = c + (b << 2);
            return;
        }
    }
    function sW(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        d = (a + 4) | 0;
        a = (c - b) | 0;
        if ((a | 0) > 0) {
            xS(f[d >> 2] | 0, b | 0, a | 0) | 0;
            f[d >> 2] = (f[d >> 2] | 0) + ((a >>> 2) << 2);
        }
        return;
    }
    function sX(a) {
        a = a | 0;
        return 1073741823;
    }
    function sY(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        if ((s$(a) | 0) >>> 0 < b >>> 0) xA(a);
        if (b >>> 0 > 1073741823) aW();
        else {
            c = xH(b << 2) | 0;
            f[(a + 4) >> 2] = c;
            f[a >> 2] = c;
            f[(a + 8) >> 2] = c + (b << 2);
            return;
        }
    }
    function sZ(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        d = (a + 4) | 0;
        a = (c - b) | 0;
        if ((a | 0) > 0) {
            xS(f[d >> 2] | 0, b | 0, a | 0) | 0;
            f[d >> 2] = (f[d >> 2] | 0) + ((a >>> 2) << 2);
        }
        return;
    }
    function s$(a) {
        a = a | 0;
        return 1073741823;
    }
    function s_(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 1073741823) aW();
            else {
                e = xH(b << 2) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 2)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 2);
        return;
    }
    function s0(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 2)) << 2)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function s1(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -4 - b) | 0) >>> 2) << 2);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function s2(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 1073741823) aW();
            else {
                e = xH(b << 2) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 2)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 2);
        return;
    }
    function s3(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 2)) << 2)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function s4(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -4 - b) | 0) >>> 2) << 2);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function s5(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0;
        r = o;
        o = (o + 32) | 0;
        l = (r + 20) | 0;
        m = (r + 12) | 0;
        k = (r + 16) | 0;
        n = (r + 4) | 0;
        p = r;
        q = (r + 8) | 0;
        i = sh() | 0;
        g = f[i >> 2] | 0;
        h = f[g >> 2] | 0;
        if (h | 0) {
            j = f[(i + 8) >> 2] | 0;
            i = f[(i + 4) >> 2] | 0;
            while(1){
                wn(l, h);
                s6(a, l, i, j);
                g = (g + 4) | 0;
                h = f[g >> 2] | 0;
                if (!h) break;
                else {
                    j = (j + 1) | 0;
                    i = (i + 1) | 0;
                }
            }
        }
        g = sj() | 0;
        h = f[g >> 2] | 0;
        if (h | 0) do {
            wn(l, h);
            f[m >> 2] = f[(g + 4) >> 2];
            s7(b, l, m);
            g = (g + 8) | 0;
            h = f[g >> 2] | 0;
        }while ((h | 0) != 0)
        g = f[(r3() | 0) >> 2] | 0;
        if (g | 0) do {
            b = f[(g + 4) >> 2] | 0;
            wn(l, f[(s8(b) | 0) >> 2] | 0);
            f[m >> 2] = se(b) | 0;
            s9(c, l, m);
            g = f[g >> 2] | 0;
        }while ((g | 0) != 0)
        wn(k, 0);
        g = sg() | 0;
        f[l >> 2] = f[k >> 2];
        sm(l, g, e);
        g = f[(r3() | 0) >> 2] | 0;
        if (g | 0) {
            a = (l + 4) | 0;
            b = (l + 8) | 0;
            c = (l + 8) | 0;
            do {
                j = f[(g + 4) >> 2] | 0;
                wn(m, f[(s8(j) | 0) >> 2] | 0);
                tb(n, ta(j) | 0);
                h = f[n >> 2] | 0;
                if (h | 0) {
                    f[l >> 2] = 0;
                    f[a >> 2] = 0;
                    f[b >> 2] = 0;
                    do {
                        wn(p, f[(s8(f[(h + 4) >> 2] | 0) | 0) >> 2] | 0);
                        i = f[a >> 2] | 0;
                        if (i >>> 0 < (f[c >> 2] | 0) >>> 0) {
                            f[i >> 2] = f[p >> 2];
                            f[a >> 2] = (f[a >> 2] | 0) + 4;
                        } else sr(l, p);
                        h = f[h >> 2] | 0;
                    }while ((h | 0) != 0)
                    tc(d, m, l);
                    sx(l);
                }
                f[q >> 2] = f[m >> 2];
                k = td(j) | 0;
                f[l >> 2] = f[q >> 2];
                sm(l, k, e);
                hj(n);
                g = f[g >> 2] | 0;
            }while ((g | 0) != 0)
        }
        o = r;
        return;
    }
    function s6(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        tr(a, b, c, d);
        return;
    }
    function s7(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        tq(a, b, c);
        return;
    }
    function s8(a) {
        a = a | 0;
        return a | 0;
    }
    function s9(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        tl(a, b, c);
        return;
    }
    function ta(a) {
        a = a | 0;
        return (a + 16) | 0;
    }
    function tb(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        g = o;
        o = (o + 16) | 0;
        e = (g + 8) | 0;
        c = g;
        f[a >> 2] = 0;
        d = f[b >> 2] | 0;
        f[e >> 2] = d;
        f[c >> 2] = a;
        c = tj(c) | 0;
        if (d | 0) {
            d = xH(12) | 0;
            h = ((tk(e) | 0) + 4) | 0;
            a = f[(h + 4) >> 2] | 0;
            b = (d + 4) | 0;
            f[b >> 2] = f[h >> 2];
            f[(b + 4) >> 2] = a;
            b = f[f[e >> 2] >> 2] | 0;
            f[e >> 2] = b;
            if (!b) a = d;
            else {
                b = d;
                while(1){
                    a = xH(12) | 0;
                    j = ((tk(e) | 0) + 4) | 0;
                    i = f[(j + 4) >> 2] | 0;
                    h = (a + 4) | 0;
                    f[h >> 2] = f[j >> 2];
                    f[(h + 4) >> 2] = i;
                    f[b >> 2] = a;
                    h = f[f[e >> 2] >> 2] | 0;
                    f[e >> 2] = h;
                    if (!h) break;
                    else b = a;
                }
            }
            f[a >> 2] = f[c >> 2];
            f[c >> 2] = d;
        }
        o = g;
        return;
    }
    function tc(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        te(a, b, c);
        return;
    }
    function td(a) {
        a = a | 0;
        return (a + 24) | 0;
    }
    function te(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 32) | 0;
        h = (d + 24) | 0;
        e = (d + 16) | 0;
        i = (d + 12) | 0;
        g = d;
        wt(e);
        a = fz(a) | 0;
        f[i >> 2] = f[b >> 2];
        sz(g, c);
        f[h >> 2] = f[i >> 2];
        tf(a, h, g);
        sx(g);
        wv(e);
        o = d;
        return;
    }
    function tf(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0;
        d = o;
        o = (o + 32) | 0;
        h = (d + 16) | 0;
        i = (d + 12) | 0;
        e = d;
        g = fC(tg() | 0) | 0;
        f[i >> 2] = f[b >> 2];
        f[h >> 2] = f[i >> 2];
        b = sD(h) | 0;
        f[e >> 2] = f[c >> 2];
        h = (c + 4) | 0;
        f[(e + 4) >> 2] = f[h >> 2];
        i = (c + 8) | 0;
        f[(e + 8) >> 2] = f[i >> 2];
        f[i >> 2] = 0;
        f[h >> 2] = 0;
        f[c >> 2] = 0;
        aA(0, g | 0, a | 0, b | 0, sG(e) | 0) | 0;
        sx(e);
        o = d;
        return;
    }
    function tg() {
        var a = 0;
        if (!(d[7976] | 0)) {
            th(10720);
            a = 7976;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10720;
    }
    function th(a) {
        a = a | 0;
        fO(a, ti() | 0, 2);
        return;
    }
    function ti() {
        return 1732;
    }
    function tj(a) {
        a = a | 0;
        return f[a >> 2] | 0;
    }
    function tk(a) {
        a = a | 0;
        return f[a >> 2] | 0;
    }
    function tl(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 32) | 0;
        g = (d + 16) | 0;
        e = (d + 8) | 0;
        h = d;
        wt(e);
        a = fz(a) | 0;
        f[h >> 2] = f[b >> 2];
        c = f[c >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        tm(a, g, c);
        wv(e);
        o = d;
        return;
    }
    function tm(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 16) | 0;
        g = (d + 4) | 0;
        h = d;
        e = fC(tn() | 0) | 0;
        f[h >> 2] = f[b >> 2];
        f[g >> 2] = f[h >> 2];
        b = sD(g) | 0;
        aA(0, e | 0, a | 0, b | 0, sE(c) | 0) | 0;
        o = d;
        return;
    }
    function tn() {
        var a = 0;
        if (!(d[7984] | 0)) {
            to(10732);
            a = 7984;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10732;
    }
    function to(a) {
        a = a | 0;
        fO(a, tp() | 0, 2);
        return;
    }
    function tp() {
        return 1744;
    }
    function tq(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0;
        d = o;
        o = (o + 32) | 0;
        g = (d + 16) | 0;
        e = (d + 8) | 0;
        h = d;
        wt(e);
        a = fz(a) | 0;
        f[h >> 2] = f[b >> 2];
        c = f[c >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        tm(a, g, c);
        wv(e);
        o = d;
        return;
    }
    function tr(a, b, c, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        e = e | 0;
        var g = 0, h = 0, i = 0, j = 0;
        g = o;
        o = (o + 32) | 0;
        i = (g + 16) | 0;
        h = (g + 8) | 0;
        j = g;
        wt(h);
        a = fz(a) | 0;
        f[j >> 2] = f[b >> 2];
        c = d[c >> 0] | 0;
        e = d[e >> 0] | 0;
        f[i >> 2] = f[j >> 2];
        ts(a, i, c, e);
        wv(h);
        o = g;
        return;
    }
    function ts(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0;
        e = o;
        o = (o + 16) | 0;
        h = (e + 4) | 0;
        i = e;
        g = fC(tt() | 0) | 0;
        f[i >> 2] = f[b >> 2];
        f[h >> 2] = f[i >> 2];
        b = sD(h) | 0;
        c = tu(c) | 0;
        a2(0, g | 0, a | 0, b | 0, c | 0, tu(d) | 0) | 0;
        o = e;
        return;
    }
    function tt() {
        var a = 0;
        if (!(d[7992] | 0)) {
            tw(10744);
            a = 7992;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10744;
    }
    function tu(a) {
        a = a | 0;
        return tv(a) | 0;
    }
    function tv(a) {
        a = a | 0;
        return (a & 255) | 0;
    }
    function tw(a) {
        a = a | 0;
        fO(a, tx() | 0, 3);
        return;
    }
    function tx() {
        return 1756;
    }
    function ty(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0;
        p = o;
        o = (o + 32) | 0;
        j = (p + 8) | 0;
        k = (p + 4) | 0;
        l = (p + 20) | 0;
        m = p;
        it(a, 0);
        e = wp(b) | 0;
        f[j >> 2] = 0;
        n = (j + 4) | 0;
        f[n >> 2] = 0;
        f[(j + 8) >> 2] = 0;
        switch((e << 24) >> 24){
            case 0:
                {
                    d[l >> 0] = 0;
                    tz(k, c, l);
                    tA(a, k) | 0;
                    en(k);
                    break;
                }
            case 8:
                {
                    n = wo(b) | 0;
                    d[l >> 0] = 8;
                    wn(m, f[(n + 4) >> 2] | 0);
                    tB(k, c, l, m, (n + 8) | 0);
                    tA(a, k) | 0;
                    en(k);
                    break;
                }
            case 9:
                {
                    h = wo(b) | 0;
                    b = f[(h + 4) >> 2] | 0;
                    if (b | 0) {
                        i = (j + 8) | 0;
                        g = (h + 12) | 0;
                        while(1){
                            b = (b + -1) | 0;
                            wn(k, f[g >> 2] | 0);
                            e = f[n >> 2] | 0;
                            if (e >>> 0 < (f[i >> 2] | 0) >>> 0) {
                                f[e >> 2] = f[k >> 2];
                                f[n >> 2] = (f[n >> 2] | 0) + 4;
                            } else sr(j, k);
                            if (!b) break;
                            else g = (g + 4) | 0;
                        }
                    }
                    d[l >> 0] = 9;
                    wn(m, f[(h + 8) >> 2] | 0);
                    tC(k, c, l, m, j);
                    tA(a, k) | 0;
                    en(k);
                    break;
                }
            default:
                {
                    n = wo(b) | 0;
                    d[l >> 0] = e;
                    wn(m, f[(n + 4) >> 2] | 0);
                    tD(k, c, l, m);
                    tA(a, k) | 0;
                    en(k);
                }
        }
        sx(j);
        o = p;
        return;
    }
    function tz(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        e = o;
        o = (o + 16) | 0;
        f = e;
        wt(f);
        b = fz(b) | 0;
        tR(a, b, d[c >> 0] | 0);
        wv(f);
        o = e;
        return;
    }
    function tA(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = f[a >> 2] | 0;
        if (c | 0) a3(c | 0);
        f[a >> 2] = f[b >> 2];
        f[b >> 2] = 0;
        return a | 0;
    }
    function tB(a, b, c, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        e = e | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0;
        h = o;
        o = (o + 32) | 0;
        j = (h + 16) | 0;
        i = (h + 8) | 0;
        k = h;
        wt(i);
        b = fz(b) | 0;
        c = d[c >> 0] | 0;
        f[k >> 2] = f[e >> 2];
        g = f[g >> 2] | 0;
        f[j >> 2] = f[k >> 2];
        tN(a, b, c, j, g);
        wv(i);
        o = h;
        return;
    }
    function tC(a, b, c, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        e = e | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0, l = 0;
        h = o;
        o = (o + 32) | 0;
        k = (h + 24) | 0;
        i = (h + 16) | 0;
        l = (h + 12) | 0;
        j = h;
        wt(i);
        b = fz(b) | 0;
        c = d[c >> 0] | 0;
        f[l >> 2] = f[e >> 2];
        sz(j, g);
        f[k >> 2] = f[l >> 2];
        tJ(a, b, c, k, j);
        sx(j);
        wv(i);
        o = h;
        return;
    }
    function tD(a, b, c, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        e = e | 0;
        var g = 0, h = 0, i = 0, j = 0;
        g = o;
        o = (o + 32) | 0;
        i = (g + 16) | 0;
        h = (g + 8) | 0;
        j = g;
        wt(h);
        b = fz(b) | 0;
        c = d[c >> 0] | 0;
        f[j >> 2] = f[e >> 2];
        f[i >> 2] = f[j >> 2];
        tE(a, b, c, i);
        wv(h);
        o = g;
        return;
    }
    function tE(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0, h = 0, i = 0;
        e = o;
        o = (o + 16) | 0;
        g = (e + 4) | 0;
        i = e;
        h = fC(tF() | 0) | 0;
        c = tu(c) | 0;
        f[i >> 2] = f[d >> 2];
        f[g >> 2] = f[i >> 2];
        tG(a, aA(0, h | 0, b | 0, c | 0, sD(g) | 0) | 0);
        o = e;
        return;
    }
    function tF() {
        var a = 0;
        if (!(d[8e3] | 0)) {
            tH(10756);
            a = 8e3;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10756;
    }
    function tG(a, b) {
        a = a | 0;
        b = b | 0;
        it(a, b);
        return;
    }
    function tH(a) {
        a = a | 0;
        fO(a, tI() | 0, 2);
        return;
    }
    function tI() {
        return 1772;
    }
    function tJ(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0;
        g = o;
        o = (o + 32) | 0;
        j = (g + 16) | 0;
        k = (g + 12) | 0;
        h = g;
        i = fC(tK() | 0) | 0;
        c = tu(c) | 0;
        f[k >> 2] = f[d >> 2];
        f[j >> 2] = f[k >> 2];
        d = sD(j) | 0;
        f[h >> 2] = f[e >> 2];
        j = (e + 4) | 0;
        f[(h + 4) >> 2] = f[j >> 2];
        k = (e + 8) | 0;
        f[(h + 8) >> 2] = f[k >> 2];
        f[k >> 2] = 0;
        f[j >> 2] = 0;
        f[e >> 2] = 0;
        tG(a, a2(0, i | 0, b | 0, c | 0, d | 0, sG(h) | 0) | 0);
        sx(h);
        o = g;
        return;
    }
    function tK() {
        var a = 0;
        if (!(d[8008] | 0)) {
            tL(10768);
            a = 8008;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10768;
    }
    function tL(a) {
        a = a | 0;
        fO(a, tM() | 0, 3);
        return;
    }
    function tM() {
        return 1784;
    }
    function tN(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        var g = 0, h = 0, i = 0, j = 0;
        g = o;
        o = (o + 16) | 0;
        i = (g + 4) | 0;
        j = g;
        h = fC(tO() | 0) | 0;
        c = tu(c) | 0;
        f[j >> 2] = f[d >> 2];
        f[i >> 2] = f[j >> 2];
        d = sD(i) | 0;
        tG(a, a2(0, h | 0, b | 0, c | 0, d | 0, sF(e) | 0) | 0);
        o = g;
        return;
    }
    function tO() {
        var a = 0;
        if (!(d[8016] | 0)) {
            tP(10780);
            a = 8016;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10780;
    }
    function tP(a) {
        a = a | 0;
        fO(a, tQ() | 0, 3);
        return;
    }
    function tQ() {
        return 1800;
    }
    function tR(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = fC(tS() | 0) | 0;
        tG(a, a4(0, d | 0, b | 0, tu(c) | 0) | 0);
        return;
    }
    function tS() {
        var a = 0;
        if (!(d[8024] | 0)) {
            tT(10792);
            a = 8024;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 10792;
    }
    function tT(a) {
        a = a | 0;
        fO(a, tU() | 0, 1);
        return;
    }
    function tU() {
        return 1816;
    }
    function tV() {
        tW();
        tX();
        tY();
        return;
    }
    function tW() {
        f[2702] = xI(65536) | 0;
        return;
    }
    function tX() {
        uj(10856);
        return;
    }
    function tY() {
        tZ(10816);
        return;
    }
    function tZ(a) {
        a = a | 0;
        t$(a, 5044);
        t_(a) | 0;
        return;
    }
    function t$(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = sM() | 0;
        f[a >> 2] = c;
        ud(c, b);
        r2(f[a >> 2] | 0);
        return;
    }
    function t_(a) {
        a = a | 0;
        var b = 0;
        b = f[a >> 2] | 0;
        qf(b, t0() | 0);
        return a | 0;
    }
    function t0() {
        var a = 0;
        if (!(d[8032] | 0)) {
            t1(10820);
            aK(64, 10820, r | 0) | 0;
            a = 8032;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        if (!(gR(10820) | 0)) t1(10820);
        return 10820;
    }
    function t1(a) {
        a = a | 0;
        t4(a);
        ql(a, 25);
        return;
    }
    function t2(a) {
        a = a | 0;
        t3((a + 24) | 0);
        return;
    }
    function t3(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function t4(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 5, 18, b, t9() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function t5(a, b) {
        a = a | 0;
        b = b | 0;
        t6(a, b);
        return;
    }
    function t6(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        e = (c + 4) | 0;
        iN(e, b);
        f[d >> 2] = iO(e, b) | 0;
        t7(a, d);
        o = c;
        return;
    }
    function t7(a, b) {
        a = a | 0;
        b = b | 0;
        t8((a + 4) | 0, f[b >> 2] | 0);
        d[(a + 8) >> 0] = 1;
        return;
    }
    function t8(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = b;
        return;
    }
    function t9() {
        return 1824;
    }
    function ua(a) {
        a = a | 0;
        return ub(a) | 0;
    }
    function ub(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0;
        c = o;
        o = (o + 16) | 0;
        e = (c + 4) | 0;
        h = c;
        d = uc(8) | 0;
        b = d;
        i = xH(4) | 0;
        iN(e, a);
        t8(i, iO(e, a) | 0);
        g = (b + 4) | 0;
        f[g >> 2] = i;
        a = xH(8) | 0;
        g = f[g >> 2] | 0;
        f[h >> 2] = 0;
        f[e >> 2] = f[h >> 2];
        sO(a, g, e);
        f[d >> 2] = a;
        o = c;
        return b | 0;
    }
    function uc(a) {
        a = a | 0;
        var b = 0, c = 0;
        a = (a + 7) & -8;
        if (a >>> 0 <= 32768 ? ((b = f[2701] | 0), a >>> 0 <= ((65536 - b) | 0) >>> 0) : 0) {
            c = ((f[2702] | 0) + b) | 0;
            f[2701] = b + a;
            a = c;
        } else {
            a = xI((a + 8) | 0) | 0;
            f[a >> 2] = f[2703];
            f[2703] = a;
            a = (a + 8) | 0;
        }
        return a | 0;
    }
    function ud(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = ue() | 0;
        f[(a + 4) >> 2] = uf() | 0;
        f[(a + 12) >> 2] = b;
        f[(a + 8) >> 2] = ug() | 0;
        f[(a + 32) >> 2] = 9;
        return;
    }
    function ue() {
        return 11744;
    }
    function uf() {
        return 1832;
    }
    function ug() {
        return qJ() | 0;
    }
    function uh(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((oi(d, 896) | 0) == 512) {
            if (c | 0) {
                ui(c);
                xJ(c);
            }
        } else if (b | 0) xJ(b);
        return;
    }
    function ui(a) {
        a = a | 0;
        a = f[(a + 4) >> 2] | 0;
        if (a | 0) xF(a);
        return;
    }
    function uj(a) {
        a = a | 0;
        uk(a, 5052);
        ul(a) | 0;
        um(a, 5058, 26) | 0;
        un(a, 5069, 1) | 0;
        uo(a, 5077, 10) | 0;
        up(a, 5087, 19) | 0;
        ur(a, 5094, 27) | 0;
        return;
    }
    function uk(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = wf() | 0;
        f[a >> 2] = c;
        wg(c, b);
        r2(f[a >> 2] | 0);
        return;
    }
    function ul(a) {
        a = a | 0;
        var b = 0;
        b = f[a >> 2] | 0;
        qf(b, v0() | 0);
        return a | 0;
    }
    function um(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        vH(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function un(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        vp(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function uo(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        u0(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function up(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        uK(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function uq(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        a: while(1){
            c = f[2703] | 0;
            while(1){
                if ((c | 0) == (b | 0)) break a;
                d = f[c >> 2] | 0;
                f[2703] = d;
                if (!c) c = d;
                else break;
            }
            xJ(c);
        }
        f[2701] = a;
        return;
    }
    function ur(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        us(a, gz(b) | 0, c, 0);
        return a | 0;
    }
    function us(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = ut() | 0;
        a = uu(c) | 0;
        gE(g, b, e, a, uv(c, d) | 0, d);
        return;
    }
    function ut() {
        var a = 0, b = 0;
        if (!(d[8040] | 0)) {
            uC(10860);
            aK(65, 10860, r | 0) | 0;
            b = 8040;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10860) | 0)) {
            a = 10860;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            uC(10860);
        }
        return 10860;
    }
    function uu(a) {
        a = a | 0;
        return a | 0;
    }
    function uv(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = ut() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            uw(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            ux(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function uw(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function ux(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = uy(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            uz(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            uw(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            uA(a, e);
            uB(e);
            o = i;
            return;
        }
    }
    function uy(a) {
        a = a | 0;
        return 536870911;
    }
    function uz(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function uA(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function uB(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function uC(a) {
        a = a | 0;
        uF(a);
        return;
    }
    function uD(a) {
        a = a | 0;
        uE((a + 24) | 0);
        return;
    }
    function uE(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function uF(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 11, b, uG() | 0, 2);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function uG() {
        return 1840;
    }
    function uH(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        uJ(f[(uI(a) | 0) >> 2] | 0, b, c);
        return;
    }
    function uI(a) {
        a = a | 0;
        return ((f[((ut() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function uJ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, f = 0;
        d = o;
        o = (o + 16) | 0;
        f = (d + 1) | 0;
        e = d;
        iN(f, b);
        b = iO(f, b) | 0;
        iN(e, c);
        c = iO(e, c) | 0;
        yT[a & 31](b, c);
        o = d;
        return;
    }
    function uK(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = uL() | 0;
        a = uM(c) | 0;
        gE(g, b, e, a, uN(c, d) | 0, d);
        return;
    }
    function uL() {
        var a = 0, b = 0;
        if (!(d[8048] | 0)) {
            uU(10896);
            aK(66, 10896, r | 0) | 0;
            b = 8048;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10896) | 0)) {
            a = 10896;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            uU(10896);
        }
        return 10896;
    }
    function uM(a) {
        a = a | 0;
        return a | 0;
    }
    function uN(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = uL() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            uO(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            uP(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function uO(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function uP(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = uQ(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            uR(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            uO(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            uS(a, e);
            uT(e);
            o = i;
            return;
        }
    }
    function uQ(a) {
        a = a | 0;
        return 536870911;
    }
    function uR(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function uS(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function uT(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function uU(a) {
        a = a | 0;
        uX(a);
        return;
    }
    function uV(a) {
        a = a | 0;
        uW((a + 24) | 0);
        return;
    }
    function uW(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function uX(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 11, b, uY() | 0, 1);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function uY() {
        return 1852;
    }
    function uZ(a, b) {
        a = a | 0;
        b = b | 0;
        return u_(f[(u$(a) | 0) >> 2] | 0, b) | 0;
    }
    function u$(a) {
        a = a | 0;
        return ((f[((uL() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function u_(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        iN(d, b);
        b = iO(d, b) | 0;
        b = jr(yU[a & 31](b) | 0) | 0;
        o = c;
        return b | 0;
    }
    function u0(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = u1() | 0;
        a = u2(c) | 0;
        gE(g, b, e, a, u3(c, d) | 0, d);
        return;
    }
    function u1() {
        var a = 0, b = 0;
        if (!(d[8056] | 0)) {
            va(10932);
            aK(67, 10932, r | 0) | 0;
            b = 8056;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10932) | 0)) {
            a = 10932;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            va(10932);
        }
        return 10932;
    }
    function u2(a) {
        a = a | 0;
        return a | 0;
    }
    function u3(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = u1() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            u4(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            u5(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function u4(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function u5(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = u6(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            u7(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            u4(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            u8(a, e);
            u9(e);
            o = i;
            return;
        }
    }
    function u6(a) {
        a = a | 0;
        return 536870911;
    }
    function u7(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function u8(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function u9(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function va(a) {
        a = a | 0;
        vd(a);
        return;
    }
    function vb(a) {
        a = a | 0;
        vc((a + 24) | 0);
        return;
    }
    function vc(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function vd(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 7, b, ve() | 0, 2);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function ve() {
        return 1860;
    }
    function vf(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        return vh(f[(vg(a) | 0) >> 2] | 0, b, c) | 0;
    }
    function vg(a) {
        a = a | 0;
        return ((f[((u1() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function vh(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        d = o;
        o = (o + 32) | 0;
        h = (d + 12) | 0;
        g = (d + 8) | 0;
        i = d;
        j = (d + 16) | 0;
        e = (d + 4) | 0;
        vi(j, b);
        vj(i, j, b);
        ip(e, c);
        c = iq(e, c) | 0;
        f[h >> 2] = f[i >> 2];
        y7[a & 15](g, h, c);
        c = vk(g) | 0;
        en(g);
        ir(e);
        o = d;
        return c | 0;
    }
    function vi(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function vj(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        vl(a, c);
        return;
    }
    function vk(a) {
        a = a | 0;
        return fz(a) | 0;
    }
    function vl(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        e = o;
        o = (o + 16) | 0;
        c = e;
        d = b;
        if (!(d & 1)) f[a >> 2] = f[b >> 2];
        else {
            vm(c, 0);
            aM(d | 0, c | 0) | 0;
            vn(a, c);
            vo(c);
        }
        o = e;
        return;
    }
    function vm(a, b) {
        a = a | 0;
        b = b | 0;
        fJ(a, b);
        f[(a + 4) >> 2] = 0;
        d[(a + 8) >> 0] = 0;
        return;
    }
    function vn(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = f[(b + 4) >> 2];
        return;
    }
    function vo(a) {
        a = a | 0;
        d[(a + 8) >> 0] = 0;
        return;
    }
    function vp(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = vq() | 0;
        a = vr(c) | 0;
        gE(g, b, e, a, vs(c, d) | 0, d);
        return;
    }
    function vq() {
        var a = 0, b = 0;
        if (!(d[8064] | 0)) {
            vz(10968);
            aK(68, 10968, r | 0) | 0;
            b = 8064;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(10968) | 0)) {
            a = 10968;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            vz(10968);
        }
        return 10968;
    }
    function vr(a) {
        a = a | 0;
        return a | 0;
    }
    function vs(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = vq() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            vt(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            vu(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function vt(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function vu(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = vv(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            vw(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            vt(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            vx(a, e);
            vy(e);
            o = i;
            return;
        }
    }
    function vv(a) {
        a = a | 0;
        return 536870911;
    }
    function vw(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function vx(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function vy(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function vz(a) {
        a = a | 0;
        vC(a);
        return;
    }
    function vA(a) {
        a = a | 0;
        vB((a + 24) | 0);
        return;
    }
    function vB(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function vC(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 1, b, vD() | 0, 5);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function vD() {
        return 1872;
    }
    function vE(a, b, c, d, e, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        g = g | 0;
        vG(f[(vF(a) | 0) >> 2] | 0, b, c, d, e, g);
        return;
    }
    function vF(a) {
        a = a | 0;
        return ((f[((vq() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function vG(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        g = o;
        o = (o + 32) | 0;
        h = (g + 16) | 0;
        i = (g + 12) | 0;
        j = (g + 8) | 0;
        k = (g + 4) | 0;
        l = g;
        ip(h, b);
        b = iq(h, b) | 0;
        ip(i, c);
        c = iq(i, c) | 0;
        ip(j, d);
        d = iq(j, d) | 0;
        ip(k, e);
        e = iq(k, e) | 0;
        ip(l, f);
        f = iq(l, f) | 0;
        yO[a & 1](b, c, d, e, f);
        ir(l);
        ir(k);
        ir(j);
        ir(i);
        ir(h);
        o = g;
        return;
    }
    function vH(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = f[a >> 2] | 0;
        e = vI() | 0;
        a = vJ(c) | 0;
        gE(g, b, e, a, vK(c, d) | 0, d);
        return;
    }
    function vI() {
        var a = 0, b = 0;
        if (!(d[8072] | 0)) {
            vR(11004);
            aK(69, 11004, r | 0) | 0;
            b = 8072;
            f[b >> 2] = 1;
            f[(b + 4) >> 2] = 0;
        }
        if (!(gR(11004) | 0)) {
            a = 11004;
            b = (a + 36) | 0;
            do {
                f[a >> 2] = 0;
                a = (a + 4) | 0;
            }while ((a | 0) < (b | 0))
            vR(11004);
        }
        return 11004;
    }
    function vJ(a) {
        a = a | 0;
        return a | 0;
    }
    function vK(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        i = o;
        o = (o + 16) | 0;
        e = i;
        g = (i + 4) | 0;
        f[e >> 2] = a;
        j = vI() | 0;
        h = (j + 24) | 0;
        b = gI(b, 4) | 0;
        f[g >> 2] = b;
        c = (j + 28) | 0;
        d = f[c >> 2] | 0;
        if (d >>> 0 < (f[(j + 32) >> 2] | 0) >>> 0) {
            vL(d, a, b);
            b = ((f[c >> 2] | 0) + 8) | 0;
            f[c >> 2] = b;
        } else {
            vM(h, e, g);
            b = f[c >> 2] | 0;
        }
        o = i;
        return (((b - (f[h >> 2] | 0)) >> 3) + -1) | 0;
    }
    function vL(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function vM(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0;
        i = o;
        o = (o + 32) | 0;
        e = i;
        g = (a + 4) | 0;
        h = ((((f[g >> 2] | 0) - (f[a >> 2] | 0)) >> 3) + 1) | 0;
        d = vN(a) | 0;
        if (d >>> 0 < h >>> 0) xA(a);
        else {
            j = f[a >> 2] | 0;
            l = ((f[(a + 8) >> 2] | 0) - j) | 0;
            k = l >> 2;
            vO(e, (l >> 3) >>> 0 < (d >>> 1) >>> 0 ? k >>> 0 < h >>> 0 ? h : k : d, ((f[g >> 2] | 0) - j) >> 3, (a + 8) | 0);
            h = (e + 8) | 0;
            vL(f[h >> 2] | 0, f[b >> 2] | 0, f[c >> 2] | 0);
            f[h >> 2] = (f[h >> 2] | 0) + 8;
            vP(a, e);
            vQ(e);
            o = i;
            return;
        }
    }
    function vN(a) {
        a = a | 0;
        return 536870911;
    }
    function vO(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        f[(a + 12) >> 2] = 0;
        f[(a + 16) >> 2] = d;
        do if (b) {
            if (b >>> 0 > 536870911) aW();
            else {
                e = xH(b << 3) | 0;
                break;
            }
        } else e = 0;
        while (0)
        f[a >> 2] = e;
        d = (e + (c << 3)) | 0;
        f[(a + 8) >> 2] = d;
        f[(a + 4) >> 2] = d;
        f[(a + 12) >> 2] = e + (b << 3);
        return;
    }
    function vP(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0, e = 0, g = 0, h = 0;
        d = f[a >> 2] | 0;
        h = (a + 4) | 0;
        g = (b + 4) | 0;
        e = ((f[h >> 2] | 0) - d) | 0;
        c = ((f[g >> 2] | 0) + ((0 - (e >> 3)) << 3)) | 0;
        f[g >> 2] = c;
        if ((e | 0) > 0) {
            xS(c | 0, d | 0, e | 0) | 0;
            d = g;
            c = f[g >> 2] | 0;
        } else d = g;
        g = f[a >> 2] | 0;
        f[a >> 2] = c;
        f[d >> 2] = g;
        g = (b + 8) | 0;
        e = f[h >> 2] | 0;
        f[h >> 2] = f[g >> 2];
        f[g >> 2] = e;
        g = (a + 8) | 0;
        h = (b + 12) | 0;
        a = f[g >> 2] | 0;
        f[g >> 2] = f[h >> 2];
        f[h >> 2] = a;
        f[b >> 2] = f[d >> 2];
        return;
    }
    function vQ(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        b = f[(a + 4) >> 2] | 0;
        c = (a + 8) | 0;
        d = f[c >> 2] | 0;
        if ((d | 0) != (b | 0)) f[c >> 2] = d + (~(((d + -8 - b) | 0) >>> 3) << 3);
        a = f[a >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function vR(a) {
        a = a | 0;
        vU(a);
        return;
    }
    function vS(a) {
        a = a | 0;
        vT((a + 24) | 0);
        return;
    }
    function vT(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function vU(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 1, 12, b, vV() | 0, 2);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function vV() {
        return 1896;
    }
    function vW(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        vY(f[(vX(a) | 0) >> 2] | 0, b, c);
        return;
    }
    function vX(a) {
        a = a | 0;
        return ((f[((vI() | 0) + 24) >> 2] | 0) + (a << 3)) | 0;
    }
    function vY(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, f = 0;
        d = o;
        o = (o + 16) | 0;
        f = (d + 4) | 0;
        e = d;
        vZ(f, b);
        b = v$(f, b) | 0;
        ip(e, c);
        c = iq(e, c) | 0;
        yT[a & 31](b, c);
        ir(e);
        o = d;
        return;
    }
    function vZ(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function v$(a, b) {
        a = a | 0;
        b = b | 0;
        return v_(b) | 0;
    }
    function v_(a) {
        a = a | 0;
        return a | 0;
    }
    function v0() {
        var a = 0;
        if (!(d[8080] | 0)) {
            v1(11040);
            aK(70, 11040, r | 0) | 0;
            a = 8080;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        if (!(gR(11040) | 0)) v1(11040);
        return 11040;
    }
    function v1(a) {
        a = a | 0;
        v4(a);
        ql(a, 71);
        return;
    }
    function v2(a) {
        a = a | 0;
        v3((a + 24) | 0);
        return;
    }
    function v3(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0;
        c = f[a >> 2] | 0;
        d = c;
        if (c | 0) {
            a = (a + 4) | 0;
            b = f[a >> 2] | 0;
            if ((b | 0) != (c | 0)) f[a >> 2] = b + (~(((b + -8 - d) | 0) >>> 3) << 3);
            xJ(c);
        }
        return;
    }
    function v4(a) {
        a = a | 0;
        var b = 0;
        b = gU() | 0;
        gX(a, 5, 7, b, v8() | 0, 0);
        f[(a + 24) >> 2] = 0;
        f[(a + 28) >> 2] = 0;
        f[(a + 32) >> 2] = 0;
        return;
    }
    function v5(a) {
        a = a | 0;
        v6(a);
        return;
    }
    function v6(a) {
        a = a | 0;
        v7(a);
        return;
    }
    function v7(a) {
        a = a | 0;
        d[(a + 8) >> 0] = 1;
        return;
    }
    function v8() {
        return 1936;
    }
    function v9() {
        return wa() | 0;
    }
    function wa() {
        var a = 0, b = 0, c = 0, d = 0, e = 0, g = 0, h = 0;
        b = o;
        o = (o + 16) | 0;
        e = (b + 4) | 0;
        h = b;
        c = uc(8) | 0;
        a = c;
        g = (a + 4) | 0;
        f[g >> 2] = xH(1) | 0;
        d = xH(8) | 0;
        g = f[g >> 2] | 0;
        f[h >> 2] = 0;
        f[e >> 2] = f[h >> 2];
        wb(d, g, e);
        f[c >> 2] = d;
        o = b;
        return a | 0;
    }
    function wb(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        f[a >> 2] = b;
        c = xH(16) | 0;
        f[(c + 4) >> 2] = 0;
        f[(c + 8) >> 2] = 0;
        f[c >> 2] = 1916;
        f[(c + 12) >> 2] = b;
        f[(a + 4) >> 2] = c;
        return;
    }
    function wc(a) {
        a = a | 0;
        xB(a);
        xJ(a);
        return;
    }
    function wd(a) {
        a = a | 0;
        a = f[(a + 12) >> 2] | 0;
        if (a | 0) xJ(a);
        return;
    }
    function we(a) {
        a = a | 0;
        xJ(a);
        return;
    }
    function wf() {
        var a = 0;
        if (!(d[8088] | 0)) {
            wm(11076);
            aK(25, 11076, r | 0) | 0;
            a = 8088;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 11076;
    }
    function wg(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = wh() | 0;
        f[(a + 4) >> 2] = wi() | 0;
        f[(a + 12) >> 2] = b;
        f[(a + 8) >> 2] = wj() | 0;
        f[(a + 32) >> 2] = 10;
        return;
    }
    function wh() {
        return 11745;
    }
    function wi() {
        return 1940;
    }
    function wj() {
        return ok() | 0;
    }
    function wk(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((oi(d, 896) | 0) == 512) {
            if (c | 0) {
                wl(c);
                xJ(c);
            }
        } else if (b | 0) xJ(b);
        return;
    }
    function wl(a) {
        a = a | 0;
        a = f[(a + 4) >> 2] | 0;
        if (a | 0) xF(a);
        return;
    }
    function wm(a) {
        a = a | 0;
        hm(a);
        return;
    }
    function wn(a, b) {
        a = a | 0;
        b = b | 0;
        f[a >> 2] = b;
        return;
    }
    function wo(a) {
        a = a | 0;
        return f[a >> 2] | 0;
    }
    function wp(a) {
        a = a | 0;
        return d[f[a >> 2] >> 0] | 0;
    }
    function wq(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        f[d >> 2] = f[a >> 2];
        wr(b, d) | 0;
        o = c;
        return;
    }
    function wr(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = ws(f[a >> 2] | 0, b) | 0;
        b = (a + 4) | 0;
        f[((f[b >> 2] | 0) + 8) >> 2] = c;
        return f[((f[b >> 2] | 0) + 8) >> 2] | 0;
    }
    function ws(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = o;
        o = (o + 16) | 0;
        d = c;
        wt(d);
        a = fz(a) | 0;
        b = wu(a, f[b >> 2] | 0) | 0;
        wv(d);
        o = c;
        return b | 0;
    }
    function wt(a) {
        a = a | 0;
        f[a >> 2] = f[2701];
        f[(a + 4) >> 2] = f[2703];
        return;
    }
    function wu(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = fC(ww() | 0) | 0;
        return a4(0, c | 0, a | 0, sF(b) | 0) | 0;
    }
    function wv(a) {
        a = a | 0;
        uq(f[a >> 2] | 0, f[(a + 4) >> 2] | 0);
        return;
    }
    function ww() {
        var a = 0;
        if (!(d[8096] | 0)) {
            wx(11120);
            a = 8096;
            f[a >> 2] = 1;
            f[(a + 4) >> 2] = 0;
        }
        return 11120;
    }
    function wx(a) {
        a = a | 0;
        fO(a, wy() | 0, 1);
        return;
    }
    function wy() {
        return 1948;
    }
    function wz() {
        wA();
        return;
    }
    function wA() {
        var a = 0, b = 0, c = 0, e = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0, s = 0, t = 0;
        s = o;
        o = (o + 16) | 0;
        n = (s + 4) | 0;
        p = s;
        aH(65536, 10804, f[2702] | 0, 10812);
        c = sh() | 0;
        b = f[c >> 2] | 0;
        a = f[b >> 2] | 0;
        if (a | 0) {
            e = f[(c + 8) >> 2] | 0;
            c = f[(c + 4) >> 2] | 0;
            while(1){
                aP(a | 0, g[c >> 0] | 0 | 0, d[e >> 0] | 0);
                b = (b + 4) | 0;
                a = f[b >> 2] | 0;
                if (!a) break;
                else {
                    e = (e + 1) | 0;
                    c = (c + 1) | 0;
                }
            }
        }
        a = sj() | 0;
        b = f[a >> 2] | 0;
        if (b | 0) do {
            aQ(b | 0, f[(a + 4) >> 2] | 0);
            a = (a + 8) | 0;
            b = f[a >> 2] | 0;
        }while ((b | 0) != 0)
        aQ(wB() | 0, 5167);
        m = r3() | 0;
        a = f[m >> 2] | 0;
        a: do if (a | 0) {
            do {
                wC(f[(a + 4) >> 2] | 0);
                a = f[a >> 2] | 0;
            }while ((a | 0) != 0)
            a = f[m >> 2] | 0;
            if (a | 0) {
                l = m;
                do {
                    while(1){
                        h = a;
                        a = f[a >> 2] | 0;
                        h = f[(h + 4) >> 2] | 0;
                        if (!(wD(h) | 0)) break;
                        f[p >> 2] = l;
                        f[n >> 2] = f[p >> 2];
                        wE(m, n) | 0;
                        if (!a) break a;
                    }
                    wF(h);
                    l = f[l >> 2] | 0;
                    b = wG(h) | 0;
                    i = aY() | 0;
                    j = o;
                    o = (o + ((((1 * (b << 2)) | 0) + 15) & -16)) | 0;
                    k = o;
                    o = (o + ((((1 * (b << 2)) | 0) + 15) & -16)) | 0;
                    b = f[(ta(h) | 0) >> 2] | 0;
                    if (b | 0) {
                        c = j;
                        e = k;
                        while(1){
                            f[c >> 2] = f[(s8(f[(b + 4) >> 2] | 0) | 0) >> 2];
                            f[e >> 2] = f[(b + 8) >> 2];
                            b = f[b >> 2] | 0;
                            if (!b) break;
                            else {
                                c = (c + 4) | 0;
                                e = (e + 4) | 0;
                            }
                        }
                    }
                    t = s8(h) | 0;
                    b = wH(h) | 0;
                    c = wG(h) | 0;
                    e = wI(h) | 0;
                    aU(t | 0, b | 0, j | 0, k | 0, c | 0, e | 0, se(h) | 0);
                    aJ(i | 0);
                }while ((a | 0) != 0)
            }
        }
        while (0)
        a = f[(sg() | 0) >> 2] | 0;
        if (a | 0) do {
            t = (a + 4) | 0;
            m = sn(t) | 0;
            h = ss(m) | 0;
            i = so(m) | 0;
            j = ((sp(m) | 0) + 1) | 0;
            k = wJ(m) | 0;
            l = wK(t) | 0;
            m = gR(m) | 0;
            n = su(t) | 0;
            p = wL(t) | 0;
            aS(0, h | 0, i | 0, j | 0, k | 0, l | 0, m | 0, n | 0, p | 0, wM(t) | 0);
            a = f[a >> 2] | 0;
        }while ((a | 0) != 0)
        a = f[(r3() | 0) >> 2] | 0;
        b: do if (a | 0) {
            c: while(1){
                b = f[(a + 4) >> 2] | 0;
                if (b | 0 ? ((q = f[(s8(b) | 0) >> 2] | 0), (r = f[(td(b) | 0) >> 2] | 0), r | 0) : 0) {
                    c = r;
                    do {
                        b = (c + 4) | 0;
                        e = sn(b) | 0;
                        d: do if (e | 0) switch(gR(e) | 0){
                            case 0:
                                break c;
                            case 4:
                            case 3:
                            case 2:
                                {
                                    k = ss(e) | 0;
                                    l = so(e) | 0;
                                    m = ((sp(e) | 0) + 1) | 0;
                                    n = wJ(e) | 0;
                                    p = gR(e) | 0;
                                    t = su(b) | 0;
                                    aS(q | 0, k | 0, l | 0, m | 0, n | 0, 0, p | 0, t | 0, wL(b) | 0, wM(b) | 0);
                                    break d;
                                }
                            case 1:
                                {
                                    j = ss(e) | 0;
                                    k = so(e) | 0;
                                    l = ((sp(e) | 0) + 1) | 0;
                                    m = wJ(e) | 0;
                                    n = wK(b) | 0;
                                    p = gR(e) | 0;
                                    t = su(b) | 0;
                                    aS(q | 0, j | 0, k | 0, l | 0, m | 0, n | 0, p | 0, t | 0, wL(b) | 0, wM(b) | 0);
                                    break d;
                                }
                            case 5:
                                {
                                    m = ss(e) | 0;
                                    n = so(e) | 0;
                                    p = ((sp(e) | 0) + 1) | 0;
                                    t = wJ(e) | 0;
                                    aS(q | 0, m | 0, n | 0, p | 0, t | 0, wN(e) | 0, gR(e) | 0, 0, 0, 0);
                                    break d;
                                }
                            default:
                                break d;
                        }
                        while (0)
                        c = f[c >> 2] | 0;
                    }while ((c | 0) != 0)
                }
                a = f[a >> 2] | 0;
                if (!a) break b;
            }
            aW();
        }
        while (0)
        aV();
        o = s;
        return;
    }
    function wB() {
        return 11703;
    }
    function wC(a) {
        a = a | 0;
        d[(a + 40) >> 0] = 0;
        return;
    }
    function wD(a) {
        a = a | 0;
        return ((d[(a + 40) >> 0] | 0) != 0) | 0;
    }
    function wE(a, b) {
        a = a | 0;
        b = b | 0;
        b = wO(b) | 0;
        a = f[b >> 2] | 0;
        f[b >> 2] = f[a >> 2];
        xJ(a);
        return f[b >> 2] | 0;
    }
    function wF(a) {
        a = a | 0;
        d[(a + 40) >> 0] = 1;
        return;
    }
    function wG(a) {
        a = a | 0;
        return f[(a + 20) >> 2] | 0;
    }
    function wH(a) {
        a = a | 0;
        return f[(a + 8) >> 2] | 0;
    }
    function wI(a) {
        a = a | 0;
        return f[(a + 32) >> 2] | 0;
    }
    function wJ(a) {
        a = a | 0;
        return f[(a + 4) >> 2] | 0;
    }
    function wK(a) {
        a = a | 0;
        return f[(a + 4) >> 2] | 0;
    }
    function wL(a) {
        a = a | 0;
        return f[(a + 8) >> 2] | 0;
    }
    function wM(a) {
        a = a | 0;
        return f[(a + 16) >> 2] | 0;
    }
    function wN(a) {
        a = a | 0;
        return f[(a + 20) >> 2] | 0;
    }
    function wO(a) {
        a = a | 0;
        return f[a >> 2] | 0;
    }
    function wP(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0;
        x = o;
        o = (o + 16) | 0;
        n = x;
        do if (a >>> 0 < 245) {
            k = a >>> 0 < 11 ? 16 : (a + 11) & -8;
            a = k >>> 3;
            m = f[2783] | 0;
            c = m >>> a;
            if ((c & 3) | 0) {
                b = (((c & 1) ^ 1) + a) | 0;
                a = (11172 + ((b << 1) << 2)) | 0;
                c = (a + 8) | 0;
                d = f[c >> 2] | 0;
                e = (d + 8) | 0;
                g = f[e >> 2] | 0;
                if ((a | 0) == (g | 0)) f[2783] = m & ~(1 << b);
                else {
                    f[(g + 12) >> 2] = a;
                    f[c >> 2] = g;
                }
                w = b << 3;
                f[(d + 4) >> 2] = w | 3;
                w = (d + w + 4) | 0;
                f[w >> 2] = f[w >> 2] | 1;
                w = e;
                o = x;
                return w | 0;
            }
            l = f[2785] | 0;
            if (k >>> 0 > l >>> 0) {
                if (c | 0) {
                    b = 2 << a;
                    b = (c << a) & (b | (0 - b));
                    b = ((b & (0 - b)) + -1) | 0;
                    h = (b >>> 12) & 16;
                    b = b >>> h;
                    c = (b >>> 5) & 8;
                    b = b >>> c;
                    e = (b >>> 2) & 4;
                    b = b >>> e;
                    a = (b >>> 1) & 2;
                    b = b >>> a;
                    d = (b >>> 1) & 1;
                    d = ((c | h | e | a | d) + (b >>> d)) | 0;
                    b = (11172 + ((d << 1) << 2)) | 0;
                    a = (b + 8) | 0;
                    e = f[a >> 2] | 0;
                    h = (e + 8) | 0;
                    c = f[h >> 2] | 0;
                    if ((b | 0) == (c | 0)) {
                        a = m & ~(1 << d);
                        f[2783] = a;
                    } else {
                        f[(c + 12) >> 2] = b;
                        f[a >> 2] = c;
                        a = m;
                    }
                    g = ((d << 3) - k) | 0;
                    f[(e + 4) >> 2] = k | 3;
                    d = (e + k) | 0;
                    f[(d + 4) >> 2] = g | 1;
                    f[(d + g) >> 2] = g;
                    if (l | 0) {
                        e = f[2788] | 0;
                        b = l >>> 3;
                        c = (11172 + ((b << 1) << 2)) | 0;
                        b = 1 << b;
                        if (!(a & b)) {
                            f[2783] = a | b;
                            b = c;
                            a = (c + 8) | 0;
                        } else {
                            a = (c + 8) | 0;
                            b = f[a >> 2] | 0;
                        }
                        f[a >> 2] = e;
                        f[(b + 12) >> 2] = e;
                        f[(e + 8) >> 2] = b;
                        f[(e + 12) >> 2] = c;
                    }
                    f[2785] = g;
                    f[2788] = d;
                    w = h;
                    o = x;
                    return w | 0;
                }
                i = f[2784] | 0;
                if (i) {
                    c = ((i & (0 - i)) + -1) | 0;
                    h = (c >>> 12) & 16;
                    c = c >>> h;
                    g = (c >>> 5) & 8;
                    c = c >>> g;
                    j = (c >>> 2) & 4;
                    c = c >>> j;
                    d = (c >>> 1) & 2;
                    c = c >>> d;
                    a = (c >>> 1) & 1;
                    a = f[(11436 + (((g | h | j | d | a) + (c >>> a)) << 2)) >> 2] | 0;
                    c = ((f[(a + 4) >> 2] & -8) - k) | 0;
                    d = f[(a + 16 + ((((f[(a + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                    if (!d) {
                        j = a;
                        g = c;
                    } else {
                        do {
                            h = ((f[(d + 4) >> 2] & -8) - k) | 0;
                            j = h >>> 0 < c >>> 0;
                            c = j ? h : c;
                            a = j ? d : a;
                            d = f[(d + 16 + ((((f[(d + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                        }while ((d | 0) != 0)
                        j = a;
                        g = c;
                    }
                    h = (j + k) | 0;
                    if (j >>> 0 < h >>> 0) {
                        e = f[(j + 24) >> 2] | 0;
                        b = f[(j + 12) >> 2] | 0;
                        do if ((b | 0) == (j | 0)) {
                            a = (j + 20) | 0;
                            b = f[a >> 2] | 0;
                            if (!b) {
                                a = (j + 16) | 0;
                                b = f[a >> 2] | 0;
                                if (!b) {
                                    c = 0;
                                    break;
                                }
                            }
                            while(1){
                                c = (b + 20) | 0;
                                d = f[c >> 2] | 0;
                                if (d | 0) {
                                    b = d;
                                    a = c;
                                    continue;
                                }
                                c = (b + 16) | 0;
                                d = f[c >> 2] | 0;
                                if (!d) break;
                                else {
                                    b = d;
                                    a = c;
                                }
                            }
                            f[a >> 2] = 0;
                            c = b;
                        } else {
                            c = f[(j + 8) >> 2] | 0;
                            f[(c + 12) >> 2] = b;
                            f[(b + 8) >> 2] = c;
                            c = b;
                        }
                        while (0)
                        do if (e | 0) {
                            b = f[(j + 28) >> 2] | 0;
                            a = (11436 + (b << 2)) | 0;
                            if ((j | 0) == (f[a >> 2] | 0)) {
                                f[a >> 2] = c;
                                if (!c) {
                                    f[2784] = i & ~(1 << b);
                                    break;
                                }
                            } else {
                                f[(e + 16 + ((((f[(e + 16) >> 2] | 0) != (j | 0)) & 1) << 2)) >> 2] = c;
                                if (!c) break;
                            }
                            f[(c + 24) >> 2] = e;
                            b = f[(j + 16) >> 2] | 0;
                            if (b | 0) {
                                f[(c + 16) >> 2] = b;
                                f[(b + 24) >> 2] = c;
                            }
                            b = f[(j + 20) >> 2] | 0;
                            if (b | 0) {
                                f[(c + 20) >> 2] = b;
                                f[(b + 24) >> 2] = c;
                            }
                        }
                        while (0)
                        if (g >>> 0 < 16) {
                            w = (g + k) | 0;
                            f[(j + 4) >> 2] = w | 3;
                            w = (j + w + 4) | 0;
                            f[w >> 2] = f[w >> 2] | 1;
                        } else {
                            f[(j + 4) >> 2] = k | 3;
                            f[(h + 4) >> 2] = g | 1;
                            f[(h + g) >> 2] = g;
                            if (l | 0) {
                                d = f[2788] | 0;
                                b = l >>> 3;
                                c = (11172 + ((b << 1) << 2)) | 0;
                                b = 1 << b;
                                if (!(m & b)) {
                                    f[2783] = m | b;
                                    b = c;
                                    a = (c + 8) | 0;
                                } else {
                                    a = (c + 8) | 0;
                                    b = f[a >> 2] | 0;
                                }
                                f[a >> 2] = d;
                                f[(b + 12) >> 2] = d;
                                f[(d + 8) >> 2] = b;
                                f[(d + 12) >> 2] = c;
                            }
                            f[2785] = g;
                            f[2788] = h;
                        }
                        w = (j + 8) | 0;
                        o = x;
                        return w | 0;
                    } else m = k;
                } else m = k;
            } else m = k;
        } else if (a >>> 0 <= 4294967231) {
            a = (a + 11) | 0;
            k = a & -8;
            j = f[2784] | 0;
            if (j) {
                d = (0 - k) | 0;
                a = a >>> 8;
                if (a) {
                    if (k >>> 0 > 16777215) i = 31;
                    else {
                        m = (((a + 1048320) | 0) >>> 16) & 8;
                        v = a << m;
                        l = (((v + 520192) | 0) >>> 16) & 4;
                        v = v << l;
                        i = (((v + 245760) | 0) >>> 16) & 2;
                        i = (14 - (l | m | i) + ((v << i) >>> 15)) | 0;
                        i = ((k >>> ((i + 7) | 0)) & 1) | (i << 1);
                    }
                } else i = 0;
                c = f[(11436 + (i << 2)) >> 2] | 0;
                a: do if (!c) {
                    c = 0;
                    a = 0;
                    v = 57;
                } else {
                    a = 0;
                    h = k << ((i | 0) == 31 ? 0 : (25 - (i >>> 1)) | 0);
                    g = 0;
                    while(1){
                        e = ((f[(c + 4) >> 2] & -8) - k) | 0;
                        if (e >>> 0 < d >>> 0) if (!e) {
                            a = c;
                            d = 0;
                            e = c;
                            v = 61;
                            break a;
                        } else {
                            a = c;
                            d = e;
                        }
                        e = f[(c + 20) >> 2] | 0;
                        c = f[(c + 16 + ((h >>> 31) << 2)) >> 2] | 0;
                        g = ((e | 0) == 0) | ((e | 0) == (c | 0)) ? g : e;
                        e = (c | 0) == 0;
                        if (e) {
                            c = g;
                            v = 57;
                            break;
                        } else h = h << ((e ^ 1) & 1);
                    }
                }
                while (0)
                if ((v | 0) == 57) {
                    if (((c | 0) == 0) & ((a | 0) == 0)) {
                        a = 2 << i;
                        a = j & (a | (0 - a));
                        if (!a) {
                            m = k;
                            break;
                        }
                        m = ((a & (0 - a)) + -1) | 0;
                        h = (m >>> 12) & 16;
                        m = m >>> h;
                        g = (m >>> 5) & 8;
                        m = m >>> g;
                        i = (m >>> 2) & 4;
                        m = m >>> i;
                        l = (m >>> 1) & 2;
                        m = m >>> l;
                        c = (m >>> 1) & 1;
                        a = 0;
                        c = f[(11436 + (((g | h | i | l | c) + (m >>> c)) << 2)) >> 2] | 0;
                    }
                    if (!c) {
                        i = a;
                        h = d;
                    } else {
                        e = c;
                        v = 61;
                    }
                }
                if ((v | 0) == 61) while(1){
                    v = 0;
                    c = ((f[(e + 4) >> 2] & -8) - k) | 0;
                    m = c >>> 0 < d >>> 0;
                    c = m ? c : d;
                    a = m ? e : a;
                    e = f[(e + 16 + ((((f[(e + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                    if (!e) {
                        i = a;
                        h = c;
                        break;
                    } else {
                        d = c;
                        v = 61;
                    }
                }
                if ((i | 0) != 0 ? h >>> 0 < (((f[2785] | 0) - k) | 0) >>> 0 : 0) {
                    g = (i + k) | 0;
                    if (i >>> 0 >= g >>> 0) {
                        w = 0;
                        o = x;
                        return w | 0;
                    }
                    e = f[(i + 24) >> 2] | 0;
                    b = f[(i + 12) >> 2] | 0;
                    do if ((b | 0) == (i | 0)) {
                        a = (i + 20) | 0;
                        b = f[a >> 2] | 0;
                        if (!b) {
                            a = (i + 16) | 0;
                            b = f[a >> 2] | 0;
                            if (!b) {
                                b = 0;
                                break;
                            }
                        }
                        while(1){
                            c = (b + 20) | 0;
                            d = f[c >> 2] | 0;
                            if (d | 0) {
                                b = d;
                                a = c;
                                continue;
                            }
                            c = (b + 16) | 0;
                            d = f[c >> 2] | 0;
                            if (!d) break;
                            else {
                                b = d;
                                a = c;
                            }
                        }
                        f[a >> 2] = 0;
                    } else {
                        w = f[(i + 8) >> 2] | 0;
                        f[(w + 12) >> 2] = b;
                        f[(b + 8) >> 2] = w;
                    }
                    while (0)
                    do if (e) {
                        a = f[(i + 28) >> 2] | 0;
                        c = (11436 + (a << 2)) | 0;
                        if ((i | 0) == (f[c >> 2] | 0)) {
                            f[c >> 2] = b;
                            if (!b) {
                                d = j & ~(1 << a);
                                f[2784] = d;
                                break;
                            }
                        } else {
                            f[(e + 16 + ((((f[(e + 16) >> 2] | 0) != (i | 0)) & 1) << 2)) >> 2] = b;
                            if (!b) {
                                d = j;
                                break;
                            }
                        }
                        f[(b + 24) >> 2] = e;
                        a = f[(i + 16) >> 2] | 0;
                        if (a | 0) {
                            f[(b + 16) >> 2] = a;
                            f[(a + 24) >> 2] = b;
                        }
                        a = f[(i + 20) >> 2] | 0;
                        if (a) {
                            f[(b + 20) >> 2] = a;
                            f[(a + 24) >> 2] = b;
                            d = j;
                        } else d = j;
                    } else d = j;
                    while (0)
                    do if (h >>> 0 >= 16) {
                        f[(i + 4) >> 2] = k | 3;
                        f[(g + 4) >> 2] = h | 1;
                        f[(g + h) >> 2] = h;
                        b = h >>> 3;
                        if (h >>> 0 < 256) {
                            c = (11172 + ((b << 1) << 2)) | 0;
                            a = f[2783] | 0;
                            b = 1 << b;
                            if (!(a & b)) {
                                f[2783] = a | b;
                                b = c;
                                a = (c + 8) | 0;
                            } else {
                                a = (c + 8) | 0;
                                b = f[a >> 2] | 0;
                            }
                            f[a >> 2] = g;
                            f[(b + 12) >> 2] = g;
                            f[(g + 8) >> 2] = b;
                            f[(g + 12) >> 2] = c;
                            break;
                        }
                        b = h >>> 8;
                        if (b) {
                            if (h >>> 0 > 16777215) b = 31;
                            else {
                                v = (((b + 1048320) | 0) >>> 16) & 8;
                                w = b << v;
                                u = (((w + 520192) | 0) >>> 16) & 4;
                                w = w << u;
                                b = (((w + 245760) | 0) >>> 16) & 2;
                                b = (14 - (u | v | b) + ((w << b) >>> 15)) | 0;
                                b = ((h >>> ((b + 7) | 0)) & 1) | (b << 1);
                            }
                        } else b = 0;
                        c = (11436 + (b << 2)) | 0;
                        f[(g + 28) >> 2] = b;
                        a = (g + 16) | 0;
                        f[(a + 4) >> 2] = 0;
                        f[a >> 2] = 0;
                        a = 1 << b;
                        if (!(d & a)) {
                            f[2784] = d | a;
                            f[c >> 2] = g;
                            f[(g + 24) >> 2] = c;
                            f[(g + 12) >> 2] = g;
                            f[(g + 8) >> 2] = g;
                            break;
                        }
                        a = h << ((b | 0) == 31 ? 0 : (25 - (b >>> 1)) | 0);
                        c = f[c >> 2] | 0;
                        while(1){
                            if (((f[(c + 4) >> 2] & -8) | 0) == (h | 0)) {
                                v = 97;
                                break;
                            }
                            d = (c + 16 + ((a >>> 31) << 2)) | 0;
                            b = f[d >> 2] | 0;
                            if (!b) {
                                v = 96;
                                break;
                            } else {
                                a = a << 1;
                                c = b;
                            }
                        }
                        if ((v | 0) == 96) {
                            f[d >> 2] = g;
                            f[(g + 24) >> 2] = c;
                            f[(g + 12) >> 2] = g;
                            f[(g + 8) >> 2] = g;
                            break;
                        } else if ((v | 0) == 97) {
                            v = (c + 8) | 0;
                            w = f[v >> 2] | 0;
                            f[(w + 12) >> 2] = g;
                            f[v >> 2] = g;
                            f[(g + 8) >> 2] = w;
                            f[(g + 12) >> 2] = c;
                            f[(g + 24) >> 2] = 0;
                            break;
                        }
                    } else {
                        w = (h + k) | 0;
                        f[(i + 4) >> 2] = w | 3;
                        w = (i + w + 4) | 0;
                        f[w >> 2] = f[w >> 2] | 1;
                    }
                    while (0)
                    w = (i + 8) | 0;
                    o = x;
                    return w | 0;
                } else m = k;
            } else m = k;
        } else m = -1;
        while (0)
        c = f[2785] | 0;
        if (c >>> 0 >= m >>> 0) {
            b = (c - m) | 0;
            a = f[2788] | 0;
            if (b >>> 0 > 15) {
                w = (a + m) | 0;
                f[2788] = w;
                f[2785] = b;
                f[(w + 4) >> 2] = b | 1;
                f[(w + b) >> 2] = b;
                f[(a + 4) >> 2] = m | 3;
            } else {
                f[2785] = 0;
                f[2788] = 0;
                f[(a + 4) >> 2] = c | 3;
                w = (a + c + 4) | 0;
                f[w >> 2] = f[w >> 2] | 1;
            }
            w = (a + 8) | 0;
            o = x;
            return w | 0;
        }
        h = f[2786] | 0;
        if (h >>> 0 > m >>> 0) {
            u = (h - m) | 0;
            f[2786] = u;
            w = f[2789] | 0;
            v = (w + m) | 0;
            f[2789] = v;
            f[(v + 4) >> 2] = u | 1;
            f[(w + 4) >> 2] = m | 3;
            w = (w + 8) | 0;
            o = x;
            return w | 0;
        }
        if (!(f[2901] | 0)) {
            f[2903] = 4096;
            f[2902] = 4096;
            f[2904] = -1;
            f[2905] = -1;
            f[2906] = 0;
            f[2894] = 0;
            a = (n & -16) ^ 1431655768;
            f[n >> 2] = a;
            f[2901] = a;
            a = 4096;
        } else a = f[2903] | 0;
        i = (m + 48) | 0;
        j = (m + 47) | 0;
        g = (a + j) | 0;
        e = (0 - a) | 0;
        k = g & e;
        if (k >>> 0 <= m >>> 0) {
            w = 0;
            o = x;
            return w | 0;
        }
        a = f[2893] | 0;
        if (a | 0 ? ((l = f[2891] | 0), (n = (l + k) | 0), (n >>> 0 <= l >>> 0) | (n >>> 0 > a >>> 0)) : 0) {
            w = 0;
            o = x;
            return w | 0;
        }
        b: do if (!(f[2894] & 4)) {
            c = f[2789] | 0;
            c: do if (c) {
                d = 11580;
                while(1){
                    a = f[d >> 2] | 0;
                    if (a >>> 0 <= c >>> 0 ? ((r = (d + 4) | 0), ((a + (f[r >> 2] | 0)) | 0) >>> 0 > c >>> 0) : 0) break;
                    a = f[(d + 8) >> 2] | 0;
                    if (!a) {
                        v = 118;
                        break c;
                    } else d = a;
                }
                b = (g - h) & e;
                if (b >>> 0 < 2147483647) {
                    a = xW(b | 0) | 0;
                    if ((a | 0) == (((f[d >> 2] | 0) + (f[r >> 2] | 0)) | 0)) {
                        if ((a | 0) != (-1 | 0)) {
                            h = b;
                            g = a;
                            v = 135;
                            break b;
                        }
                    } else {
                        d = a;
                        v = 126;
                    }
                } else b = 0;
            } else v = 118;
            while (0)
            do if ((v | 0) == 118) {
                c = xW(0) | 0;
                if ((c | 0) != (-1 | 0) ? ((b = c), (p = f[2902] | 0), (q = (p + -1) | 0), (b = ((((q & b) | 0) == 0 ? 0 : (((q + b) & (0 - p)) - b) | 0) + k) | 0), (p = f[2891] | 0), (q = (b + p) | 0), (b >>> 0 > m >>> 0) & (b >>> 0 < 2147483647)) : 0) {
                    r = f[2893] | 0;
                    if (r | 0 ? (q >>> 0 <= p >>> 0) | (q >>> 0 > r >>> 0) : 0) {
                        b = 0;
                        break;
                    }
                    a = xW(b | 0) | 0;
                    if ((a | 0) == (c | 0)) {
                        h = b;
                        g = c;
                        v = 135;
                        break b;
                    } else {
                        d = a;
                        v = 126;
                    }
                } else b = 0;
            }
            while (0)
            do if ((v | 0) == 126) {
                c = (0 - b) | 0;
                if (!((i >>> 0 > b >>> 0) & ((b >>> 0 < 2147483647) & ((d | 0) != (-1 | 0))))) if ((d | 0) == (-1 | 0)) {
                    b = 0;
                    break;
                } else {
                    h = b;
                    g = d;
                    v = 135;
                    break b;
                }
                a = f[2903] | 0;
                a = (j - b + a) & (0 - a);
                if (a >>> 0 >= 2147483647) {
                    h = b;
                    g = d;
                    v = 135;
                    break b;
                }
                if ((xW(a | 0) | 0) == (-1 | 0)) {
                    xW(c | 0) | 0;
                    b = 0;
                    break;
                } else {
                    h = (a + b) | 0;
                    g = d;
                    v = 135;
                    break b;
                }
            }
            while (0)
            f[2894] = f[2894] | 4;
            v = 133;
        } else {
            b = 0;
            v = 133;
        }
        while (0)
        if (((v | 0) == 133 ? k >>> 0 < 2147483647 : 0) ? ((u = xW(k | 0) | 0), (r = xW(0) | 0), (s = (r - u) | 0), (t = s >>> 0 > ((m + 40) | 0) >>> 0), !(((u | 0) == (-1 | 0)) | (t ^ 1) | (((u >>> 0 < r >>> 0) & (((u | 0) != (-1 | 0)) & ((r | 0) != (-1 | 0)))) ^ 1))) : 0) {
            h = t ? s : b;
            g = u;
            v = 135;
        }
        if ((v | 0) == 135) {
            b = ((f[2891] | 0) + h) | 0;
            f[2891] = b;
            if (b >>> 0 > (f[2892] | 0) >>> 0) f[2892] = b;
            j = f[2789] | 0;
            do if (j) {
                b = 11580;
                while(1){
                    a = f[b >> 2] | 0;
                    c = (b + 4) | 0;
                    d = f[c >> 2] | 0;
                    if ((g | 0) == ((a + d) | 0)) {
                        v = 145;
                        break;
                    }
                    e = f[(b + 8) >> 2] | 0;
                    if (!e) break;
                    else b = e;
                }
                if (((v | 0) == 145 ? ((f[(b + 12) >> 2] & 8) | 0) == 0 : 0) ? (j >>> 0 < g >>> 0) & (j >>> 0 >= a >>> 0) : 0) {
                    f[c >> 2] = d + h;
                    w = (j + 8) | 0;
                    w = ((w & 7) | 0) == 0 ? 0 : (0 - w) & 7;
                    v = (j + w) | 0;
                    w = ((f[2786] | 0) + (h - w)) | 0;
                    f[2789] = v;
                    f[2786] = w;
                    f[(v + 4) >> 2] = w | 1;
                    f[(v + w + 4) >> 2] = 40;
                    f[2790] = f[2905];
                    break;
                }
                if (g >>> 0 < (f[2787] | 0) >>> 0) f[2787] = g;
                c = (g + h) | 0;
                b = 11580;
                while(1){
                    if ((f[b >> 2] | 0) == (c | 0)) {
                        v = 153;
                        break;
                    }
                    a = f[(b + 8) >> 2] | 0;
                    if (!a) break;
                    else b = a;
                }
                if ((v | 0) == 153 ? ((f[(b + 12) >> 2] & 8) | 0) == 0 : 0) {
                    f[b >> 2] = g;
                    l = (b + 4) | 0;
                    f[l >> 2] = (f[l >> 2] | 0) + h;
                    l = (g + 8) | 0;
                    l = (g + (((l & 7) | 0) == 0 ? 0 : (0 - l) & 7)) | 0;
                    b = (c + 8) | 0;
                    b = (c + (((b & 7) | 0) == 0 ? 0 : (0 - b) & 7)) | 0;
                    k = (l + m) | 0;
                    i = (b - l - m) | 0;
                    f[(l + 4) >> 2] = m | 3;
                    do if ((b | 0) != (j | 0)) {
                        if ((b | 0) == (f[2788] | 0)) {
                            w = ((f[2785] | 0) + i) | 0;
                            f[2785] = w;
                            f[2788] = k;
                            f[(k + 4) >> 2] = w | 1;
                            f[(k + w) >> 2] = w;
                            break;
                        }
                        a = f[(b + 4) >> 2] | 0;
                        if (((a & 3) | 0) == 1) {
                            h = a & -8;
                            d = a >>> 3;
                            d: do if (a >>> 0 < 256) {
                                a = f[(b + 8) >> 2] | 0;
                                c = f[(b + 12) >> 2] | 0;
                                if ((c | 0) == (a | 0)) {
                                    f[2783] = f[2783] & ~(1 << d);
                                    break;
                                } else {
                                    f[(a + 12) >> 2] = c;
                                    f[(c + 8) >> 2] = a;
                                    break;
                                }
                            } else {
                                g = f[(b + 24) >> 2] | 0;
                                a = f[(b + 12) >> 2] | 0;
                                do if ((a | 0) == (b | 0)) {
                                    d = (b + 16) | 0;
                                    c = (d + 4) | 0;
                                    a = f[c >> 2] | 0;
                                    if (!a) {
                                        a = f[d >> 2] | 0;
                                        if (!a) {
                                            a = 0;
                                            break;
                                        } else c = d;
                                    }
                                    while(1){
                                        d = (a + 20) | 0;
                                        e = f[d >> 2] | 0;
                                        if (e | 0) {
                                            a = e;
                                            c = d;
                                            continue;
                                        }
                                        d = (a + 16) | 0;
                                        e = f[d >> 2] | 0;
                                        if (!e) break;
                                        else {
                                            a = e;
                                            c = d;
                                        }
                                    }
                                    f[c >> 2] = 0;
                                } else {
                                    w = f[(b + 8) >> 2] | 0;
                                    f[(w + 12) >> 2] = a;
                                    f[(a + 8) >> 2] = w;
                                }
                                while (0)
                                if (!g) break;
                                c = f[(b + 28) >> 2] | 0;
                                d = (11436 + (c << 2)) | 0;
                                do if ((b | 0) != (f[d >> 2] | 0)) {
                                    f[(g + 16 + ((((f[(g + 16) >> 2] | 0) != (b | 0)) & 1) << 2)) >> 2] = a;
                                    if (!a) break d;
                                } else {
                                    f[d >> 2] = a;
                                    if (a | 0) break;
                                    f[2784] = f[2784] & ~(1 << c);
                                    break d;
                                }
                                while (0)
                                f[(a + 24) >> 2] = g;
                                c = (b + 16) | 0;
                                d = f[c >> 2] | 0;
                                if (d | 0) {
                                    f[(a + 16) >> 2] = d;
                                    f[(d + 24) >> 2] = a;
                                }
                                c = f[(c + 4) >> 2] | 0;
                                if (!c) break;
                                f[(a + 20) >> 2] = c;
                                f[(c + 24) >> 2] = a;
                            }
                            while (0)
                            b = (b + h) | 0;
                            e = (h + i) | 0;
                        } else e = i;
                        b = (b + 4) | 0;
                        f[b >> 2] = f[b >> 2] & -2;
                        f[(k + 4) >> 2] = e | 1;
                        f[(k + e) >> 2] = e;
                        b = e >>> 3;
                        if (e >>> 0 < 256) {
                            c = (11172 + ((b << 1) << 2)) | 0;
                            a = f[2783] | 0;
                            b = 1 << b;
                            if (!(a & b)) {
                                f[2783] = a | b;
                                b = c;
                                a = (c + 8) | 0;
                            } else {
                                a = (c + 8) | 0;
                                b = f[a >> 2] | 0;
                            }
                            f[a >> 2] = k;
                            f[(b + 12) >> 2] = k;
                            f[(k + 8) >> 2] = b;
                            f[(k + 12) >> 2] = c;
                            break;
                        }
                        b = e >>> 8;
                        do if (!b) b = 0;
                        else {
                            if (e >>> 0 > 16777215) {
                                b = 31;
                                break;
                            }
                            v = (((b + 1048320) | 0) >>> 16) & 8;
                            w = b << v;
                            u = (((w + 520192) | 0) >>> 16) & 4;
                            w = w << u;
                            b = (((w + 245760) | 0) >>> 16) & 2;
                            b = (14 - (u | v | b) + ((w << b) >>> 15)) | 0;
                            b = ((e >>> ((b + 7) | 0)) & 1) | (b << 1);
                        }
                        while (0)
                        d = (11436 + (b << 2)) | 0;
                        f[(k + 28) >> 2] = b;
                        a = (k + 16) | 0;
                        f[(a + 4) >> 2] = 0;
                        f[a >> 2] = 0;
                        a = f[2784] | 0;
                        c = 1 << b;
                        if (!(a & c)) {
                            f[2784] = a | c;
                            f[d >> 2] = k;
                            f[(k + 24) >> 2] = d;
                            f[(k + 12) >> 2] = k;
                            f[(k + 8) >> 2] = k;
                            break;
                        }
                        a = e << ((b | 0) == 31 ? 0 : (25 - (b >>> 1)) | 0);
                        c = f[d >> 2] | 0;
                        while(1){
                            if (((f[(c + 4) >> 2] & -8) | 0) == (e | 0)) {
                                v = 194;
                                break;
                            }
                            d = (c + 16 + ((a >>> 31) << 2)) | 0;
                            b = f[d >> 2] | 0;
                            if (!b) {
                                v = 193;
                                break;
                            } else {
                                a = a << 1;
                                c = b;
                            }
                        }
                        if ((v | 0) == 193) {
                            f[d >> 2] = k;
                            f[(k + 24) >> 2] = c;
                            f[(k + 12) >> 2] = k;
                            f[(k + 8) >> 2] = k;
                            break;
                        } else if ((v | 0) == 194) {
                            v = (c + 8) | 0;
                            w = f[v >> 2] | 0;
                            f[(w + 12) >> 2] = k;
                            f[v >> 2] = k;
                            f[(k + 8) >> 2] = w;
                            f[(k + 12) >> 2] = c;
                            f[(k + 24) >> 2] = 0;
                            break;
                        }
                    } else {
                        w = ((f[2786] | 0) + i) | 0;
                        f[2786] = w;
                        f[2789] = k;
                        f[(k + 4) >> 2] = w | 1;
                    }
                    while (0)
                    w = (l + 8) | 0;
                    o = x;
                    return w | 0;
                }
                b = 11580;
                while(1){
                    a = f[b >> 2] | 0;
                    if (a >>> 0 <= j >>> 0 ? ((w = (a + (f[(b + 4) >> 2] | 0)) | 0), w >>> 0 > j >>> 0) : 0) break;
                    b = f[(b + 8) >> 2] | 0;
                }
                e = (w + -47) | 0;
                a = (e + 8) | 0;
                a = (e + (((a & 7) | 0) == 0 ? 0 : (0 - a) & 7)) | 0;
                e = (j + 16) | 0;
                a = a >>> 0 < e >>> 0 ? j : a;
                b = (a + 8) | 0;
                c = (g + 8) | 0;
                c = ((c & 7) | 0) == 0 ? 0 : (0 - c) & 7;
                v = (g + c) | 0;
                c = (h + -40 - c) | 0;
                f[2789] = v;
                f[2786] = c;
                f[(v + 4) >> 2] = c | 1;
                f[(v + c + 4) >> 2] = 40;
                f[2790] = f[2905];
                c = (a + 4) | 0;
                f[c >> 2] = 27;
                f[b >> 2] = f[2895];
                f[(b + 4) >> 2] = f[2896];
                f[(b + 8) >> 2] = f[2897];
                f[(b + 12) >> 2] = f[2898];
                f[2895] = g;
                f[2896] = h;
                f[2898] = 0;
                f[2897] = b;
                b = (a + 24) | 0;
                do {
                    v = b;
                    b = (b + 4) | 0;
                    f[b >> 2] = 7;
                }while (((v + 8) | 0) >>> 0 < w >>> 0)
                if ((a | 0) != (j | 0)) {
                    g = (a - j) | 0;
                    f[c >> 2] = f[c >> 2] & -2;
                    f[(j + 4) >> 2] = g | 1;
                    f[a >> 2] = g;
                    b = g >>> 3;
                    if (g >>> 0 < 256) {
                        c = (11172 + ((b << 1) << 2)) | 0;
                        a = f[2783] | 0;
                        b = 1 << b;
                        if (!(a & b)) {
                            f[2783] = a | b;
                            b = c;
                            a = (c + 8) | 0;
                        } else {
                            a = (c + 8) | 0;
                            b = f[a >> 2] | 0;
                        }
                        f[a >> 2] = j;
                        f[(b + 12) >> 2] = j;
                        f[(j + 8) >> 2] = b;
                        f[(j + 12) >> 2] = c;
                        break;
                    }
                    b = g >>> 8;
                    if (b) {
                        if (g >>> 0 > 16777215) c = 31;
                        else {
                            v = (((b + 1048320) | 0) >>> 16) & 8;
                            w = b << v;
                            u = (((w + 520192) | 0) >>> 16) & 4;
                            w = w << u;
                            c = (((w + 245760) | 0) >>> 16) & 2;
                            c = (14 - (u | v | c) + ((w << c) >>> 15)) | 0;
                            c = ((g >>> ((c + 7) | 0)) & 1) | (c << 1);
                        }
                    } else c = 0;
                    d = (11436 + (c << 2)) | 0;
                    f[(j + 28) >> 2] = c;
                    f[(j + 20) >> 2] = 0;
                    f[e >> 2] = 0;
                    b = f[2784] | 0;
                    a = 1 << c;
                    if (!(b & a)) {
                        f[2784] = b | a;
                        f[d >> 2] = j;
                        f[(j + 24) >> 2] = d;
                        f[(j + 12) >> 2] = j;
                        f[(j + 8) >> 2] = j;
                        break;
                    }
                    a = g << ((c | 0) == 31 ? 0 : (25 - (c >>> 1)) | 0);
                    c = f[d >> 2] | 0;
                    while(1){
                        if (((f[(c + 4) >> 2] & -8) | 0) == (g | 0)) {
                            v = 216;
                            break;
                        }
                        d = (c + 16 + ((a >>> 31) << 2)) | 0;
                        b = f[d >> 2] | 0;
                        if (!b) {
                            v = 215;
                            break;
                        } else {
                            a = a << 1;
                            c = b;
                        }
                    }
                    if ((v | 0) == 215) {
                        f[d >> 2] = j;
                        f[(j + 24) >> 2] = c;
                        f[(j + 12) >> 2] = j;
                        f[(j + 8) >> 2] = j;
                        break;
                    } else if ((v | 0) == 216) {
                        v = (c + 8) | 0;
                        w = f[v >> 2] | 0;
                        f[(w + 12) >> 2] = j;
                        f[v >> 2] = j;
                        f[(j + 8) >> 2] = w;
                        f[(j + 12) >> 2] = c;
                        f[(j + 24) >> 2] = 0;
                        break;
                    }
                }
            } else {
                w = f[2787] | 0;
                if (((w | 0) == 0) | (g >>> 0 < w >>> 0)) f[2787] = g;
                f[2895] = g;
                f[2896] = h;
                f[2898] = 0;
                f[2792] = f[2901];
                f[2791] = -1;
                b = 0;
                do {
                    w = (11172 + ((b << 1) << 2)) | 0;
                    f[(w + 12) >> 2] = w;
                    f[(w + 8) >> 2] = w;
                    b = (b + 1) | 0;
                }while ((b | 0) != 32)
                w = (g + 8) | 0;
                w = ((w & 7) | 0) == 0 ? 0 : (0 - w) & 7;
                v = (g + w) | 0;
                w = (h + -40 - w) | 0;
                f[2789] = v;
                f[2786] = w;
                f[(v + 4) >> 2] = w | 1;
                f[(v + w + 4) >> 2] = 40;
                f[2790] = f[2905];
            }
            while (0)
            b = f[2786] | 0;
            if (b >>> 0 > m >>> 0) {
                u = (b - m) | 0;
                f[2786] = u;
                w = f[2789] | 0;
                v = (w + m) | 0;
                f[2789] = v;
                f[(v + 4) >> 2] = u | 1;
                f[(w + 4) >> 2] = m | 3;
                w = (w + 8) | 0;
                o = x;
                return w | 0;
            }
        }
        f[(wW() | 0) >> 2] = 12;
        w = 0;
        o = x;
        return w | 0;
    }
    function wQ(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, j = 0;
        if (!a) return;
        c = (a + -8) | 0;
        e = f[2787] | 0;
        a = f[(a + -4) >> 2] | 0;
        b = a & -8;
        j = (c + b) | 0;
        do if (!(a & 1)) {
            d = f[c >> 2] | 0;
            if (!(a & 3)) return;
            h = (c + (0 - d)) | 0;
            g = (d + b) | 0;
            if (h >>> 0 < e >>> 0) return;
            if ((h | 0) == (f[2788] | 0)) {
                a = (j + 4) | 0;
                b = f[a >> 2] | 0;
                if (((b & 3) | 0) != 3) {
                    i = h;
                    b = g;
                    break;
                }
                f[2785] = g;
                f[a >> 2] = b & -2;
                f[(h + 4) >> 2] = g | 1;
                f[(h + g) >> 2] = g;
                return;
            }
            c = d >>> 3;
            if (d >>> 0 < 256) {
                a = f[(h + 8) >> 2] | 0;
                b = f[(h + 12) >> 2] | 0;
                if ((b | 0) == (a | 0)) {
                    f[2783] = f[2783] & ~(1 << c);
                    i = h;
                    b = g;
                    break;
                } else {
                    f[(a + 12) >> 2] = b;
                    f[(b + 8) >> 2] = a;
                    i = h;
                    b = g;
                    break;
                }
            }
            e = f[(h + 24) >> 2] | 0;
            a = f[(h + 12) >> 2] | 0;
            do if ((a | 0) == (h | 0)) {
                c = (h + 16) | 0;
                b = (c + 4) | 0;
                a = f[b >> 2] | 0;
                if (!a) {
                    a = f[c >> 2] | 0;
                    if (!a) {
                        a = 0;
                        break;
                    } else b = c;
                }
                while(1){
                    c = (a + 20) | 0;
                    d = f[c >> 2] | 0;
                    if (d | 0) {
                        a = d;
                        b = c;
                        continue;
                    }
                    c = (a + 16) | 0;
                    d = f[c >> 2] | 0;
                    if (!d) break;
                    else {
                        a = d;
                        b = c;
                    }
                }
                f[b >> 2] = 0;
            } else {
                i = f[(h + 8) >> 2] | 0;
                f[(i + 12) >> 2] = a;
                f[(a + 8) >> 2] = i;
            }
            while (0)
            if (e) {
                b = f[(h + 28) >> 2] | 0;
                c = (11436 + (b << 2)) | 0;
                if ((h | 0) == (f[c >> 2] | 0)) {
                    f[c >> 2] = a;
                    if (!a) {
                        f[2784] = f[2784] & ~(1 << b);
                        i = h;
                        b = g;
                        break;
                    }
                } else {
                    f[(e + 16 + ((((f[(e + 16) >> 2] | 0) != (h | 0)) & 1) << 2)) >> 2] = a;
                    if (!a) {
                        i = h;
                        b = g;
                        break;
                    }
                }
                f[(a + 24) >> 2] = e;
                b = (h + 16) | 0;
                c = f[b >> 2] | 0;
                if (c | 0) {
                    f[(a + 16) >> 2] = c;
                    f[(c + 24) >> 2] = a;
                }
                b = f[(b + 4) >> 2] | 0;
                if (b) {
                    f[(a + 20) >> 2] = b;
                    f[(b + 24) >> 2] = a;
                    i = h;
                    b = g;
                } else {
                    i = h;
                    b = g;
                }
            } else {
                i = h;
                b = g;
            }
        } else {
            i = c;
            h = c;
        }
        while (0)
        if (h >>> 0 >= j >>> 0) return;
        a = (j + 4) | 0;
        d = f[a >> 2] | 0;
        if (!(d & 1)) return;
        if (!(d & 2)) {
            a = f[2788] | 0;
            if ((j | 0) == (f[2789] | 0)) {
                j = ((f[2786] | 0) + b) | 0;
                f[2786] = j;
                f[2789] = i;
                f[(i + 4) >> 2] = j | 1;
                if ((i | 0) != (a | 0)) return;
                f[2788] = 0;
                f[2785] = 0;
                return;
            }
            if ((j | 0) == (a | 0)) {
                j = ((f[2785] | 0) + b) | 0;
                f[2785] = j;
                f[2788] = h;
                f[(i + 4) >> 2] = j | 1;
                f[(h + j) >> 2] = j;
                return;
            }
            e = ((d & -8) + b) | 0;
            c = d >>> 3;
            do if (d >>> 0 < 256) {
                b = f[(j + 8) >> 2] | 0;
                a = f[(j + 12) >> 2] | 0;
                if ((a | 0) == (b | 0)) {
                    f[2783] = f[2783] & ~(1 << c);
                    break;
                } else {
                    f[(b + 12) >> 2] = a;
                    f[(a + 8) >> 2] = b;
                    break;
                }
            } else {
                g = f[(j + 24) >> 2] | 0;
                a = f[(j + 12) >> 2] | 0;
                do if ((a | 0) == (j | 0)) {
                    c = (j + 16) | 0;
                    b = (c + 4) | 0;
                    a = f[b >> 2] | 0;
                    if (!a) {
                        a = f[c >> 2] | 0;
                        if (!a) {
                            c = 0;
                            break;
                        } else b = c;
                    }
                    while(1){
                        c = (a + 20) | 0;
                        d = f[c >> 2] | 0;
                        if (d | 0) {
                            a = d;
                            b = c;
                            continue;
                        }
                        c = (a + 16) | 0;
                        d = f[c >> 2] | 0;
                        if (!d) break;
                        else {
                            a = d;
                            b = c;
                        }
                    }
                    f[b >> 2] = 0;
                    c = a;
                } else {
                    c = f[(j + 8) >> 2] | 0;
                    f[(c + 12) >> 2] = a;
                    f[(a + 8) >> 2] = c;
                    c = a;
                }
                while (0)
                if (g | 0) {
                    a = f[(j + 28) >> 2] | 0;
                    b = (11436 + (a << 2)) | 0;
                    if ((j | 0) == (f[b >> 2] | 0)) {
                        f[b >> 2] = c;
                        if (!c) {
                            f[2784] = f[2784] & ~(1 << a);
                            break;
                        }
                    } else {
                        f[(g + 16 + ((((f[(g + 16) >> 2] | 0) != (j | 0)) & 1) << 2)) >> 2] = c;
                        if (!c) break;
                    }
                    f[(c + 24) >> 2] = g;
                    a = (j + 16) | 0;
                    b = f[a >> 2] | 0;
                    if (b | 0) {
                        f[(c + 16) >> 2] = b;
                        f[(b + 24) >> 2] = c;
                    }
                    a = f[(a + 4) >> 2] | 0;
                    if (a | 0) {
                        f[(c + 20) >> 2] = a;
                        f[(a + 24) >> 2] = c;
                    }
                }
            }
            while (0)
            f[(i + 4) >> 2] = e | 1;
            f[(h + e) >> 2] = e;
            if ((i | 0) == (f[2788] | 0)) {
                f[2785] = e;
                return;
            }
        } else {
            f[a >> 2] = d & -2;
            f[(i + 4) >> 2] = b | 1;
            f[(h + b) >> 2] = b;
            e = b;
        }
        a = e >>> 3;
        if (e >>> 0 < 256) {
            c = (11172 + ((a << 1) << 2)) | 0;
            b = f[2783] | 0;
            a = 1 << a;
            if (!(b & a)) {
                f[2783] = b | a;
                a = c;
                b = (c + 8) | 0;
            } else {
                b = (c + 8) | 0;
                a = f[b >> 2] | 0;
            }
            f[b >> 2] = i;
            f[(a + 12) >> 2] = i;
            f[(i + 8) >> 2] = a;
            f[(i + 12) >> 2] = c;
            return;
        }
        a = e >>> 8;
        if (a) {
            if (e >>> 0 > 16777215) a = 31;
            else {
                h = (((a + 1048320) | 0) >>> 16) & 8;
                j = a << h;
                g = (((j + 520192) | 0) >>> 16) & 4;
                j = j << g;
                a = (((j + 245760) | 0) >>> 16) & 2;
                a = (14 - (g | h | a) + ((j << a) >>> 15)) | 0;
                a = ((e >>> ((a + 7) | 0)) & 1) | (a << 1);
            }
        } else a = 0;
        d = (11436 + (a << 2)) | 0;
        f[(i + 28) >> 2] = a;
        f[(i + 20) >> 2] = 0;
        f[(i + 16) >> 2] = 0;
        b = f[2784] | 0;
        c = 1 << a;
        do if (b & c) {
            b = e << ((a | 0) == 31 ? 0 : (25 - (a >>> 1)) | 0);
            c = f[d >> 2] | 0;
            while(1){
                if (((f[(c + 4) >> 2] & -8) | 0) == (e | 0)) {
                    a = 73;
                    break;
                }
                d = (c + 16 + ((b >>> 31) << 2)) | 0;
                a = f[d >> 2] | 0;
                if (!a) {
                    a = 72;
                    break;
                } else {
                    b = b << 1;
                    c = a;
                }
            }
            if ((a | 0) == 72) {
                f[d >> 2] = i;
                f[(i + 24) >> 2] = c;
                f[(i + 12) >> 2] = i;
                f[(i + 8) >> 2] = i;
                break;
            } else if ((a | 0) == 73) {
                h = (c + 8) | 0;
                j = f[h >> 2] | 0;
                f[(j + 12) >> 2] = i;
                f[h >> 2] = i;
                f[(i + 8) >> 2] = j;
                f[(i + 12) >> 2] = c;
                f[(i + 24) >> 2] = 0;
                break;
            }
        } else {
            f[2784] = b | c;
            f[d >> 2] = i;
            f[(i + 24) >> 2] = d;
            f[(i + 12) >> 2] = i;
            f[(i + 8) >> 2] = i;
        }
        while (0)
        j = ((f[2791] | 0) + -1) | 0;
        f[2791] = j;
        if (!j) a = 11588;
        else return;
        while(1){
            a = f[a >> 2] | 0;
            if (!a) break;
            else a = (a + 8) | 0;
        }
        f[2791] = -1;
        return;
    }
    function wR() {
        return 11628;
    }
    function wS(a) {
        a = a | 0;
        var b = 0, c = 0;
        b = o;
        o = (o + 16) | 0;
        c = b;
        f[c >> 2] = wZ(f[(a + 60) >> 2] | 0) | 0;
        a = wV(a6(6, c | 0) | 0) | 0;
        o = b;
        return a | 0;
    }
    function wT(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0;
        m = o;
        o = (o + 48) | 0;
        k = (m + 16) | 0;
        g = m;
        e = (m + 32) | 0;
        i = (a + 28) | 0;
        d = f[i >> 2] | 0;
        f[e >> 2] = d;
        j = (a + 20) | 0;
        d = ((f[j >> 2] | 0) - d) | 0;
        f[(e + 4) >> 2] = d;
        f[(e + 8) >> 2] = b;
        f[(e + 12) >> 2] = c;
        d = (d + c) | 0;
        h = (a + 60) | 0;
        f[g >> 2] = f[h >> 2];
        f[(g + 4) >> 2] = e;
        f[(g + 8) >> 2] = 2;
        g = wV(a9(146, g | 0) | 0) | 0;
        a: do if ((d | 0) != (g | 0)) {
            b = 2;
            while(1){
                if ((g | 0) < 0) break;
                d = (d - g) | 0;
                p = f[(e + 4) >> 2] | 0;
                n = g >>> 0 > p >>> 0;
                e = n ? (e + 8) | 0 : e;
                b = (((n << 31) >> 31) + b) | 0;
                p = (g - (n ? p : 0)) | 0;
                f[e >> 2] = (f[e >> 2] | 0) + p;
                n = (e + 4) | 0;
                f[n >> 2] = (f[n >> 2] | 0) - p;
                f[k >> 2] = f[h >> 2];
                f[(k + 4) >> 2] = e;
                f[(k + 8) >> 2] = b;
                g = wV(a9(146, k | 0) | 0) | 0;
                if ((d | 0) == (g | 0)) {
                    l = 3;
                    break a;
                }
            }
            f[(a + 16) >> 2] = 0;
            f[i >> 2] = 0;
            f[j >> 2] = 0;
            f[a >> 2] = f[a >> 2] | 32;
            if ((b | 0) == 2) c = 0;
            else c = (c - (f[(e + 4) >> 2] | 0)) | 0;
        } else l = 3;
        while (0)
        if ((l | 0) == 3) {
            p = f[(a + 44) >> 2] | 0;
            f[(a + 16) >> 2] = p + (f[(a + 48) >> 2] | 0);
            f[i >> 2] = p;
            f[j >> 2] = p;
        }
        o = m;
        return c | 0;
    }
    function wU(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0;
        e = o;
        o = (o + 32) | 0;
        g = e;
        d = (e + 20) | 0;
        f[g >> 2] = f[(a + 60) >> 2];
        f[(g + 4) >> 2] = 0;
        f[(g + 8) >> 2] = b;
        f[(g + 12) >> 2] = d;
        f[(g + 16) >> 2] = c;
        if ((wV(a8(140, g | 0) | 0) | 0) < 0) {
            f[d >> 2] = -1;
            a = -1;
        } else a = f[d >> 2] | 0;
        o = e;
        return a | 0;
    }
    function wV(a) {
        a = a | 0;
        if (a >>> 0 > 4294963200) {
            f[(wW() | 0) >> 2] = 0 - a;
            a = -1;
        }
        return a | 0;
    }
    function wW() {
        return ((wX() | 0) + 64) | 0;
    }
    function wX() {
        return wY() | 0;
    }
    function wY() {
        return 2084;
    }
    function wZ(a) {
        a = a | 0;
        return a | 0;
    }
    function w$(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, g = 0;
        g = o;
        o = (o + 32) | 0;
        e = g;
        f[(a + 36) >> 2] = 1;
        if (((f[a >> 2] & 64) | 0) == 0 ? ((f[e >> 2] = f[(a + 60) >> 2]), (f[(e + 4) >> 2] = 21523), (f[(e + 8) >> 2] = g + 16), aZ(54, e | 0) | 0) : 0) d[(a + 75) >> 0] = -1;
        e = wT(a, b, c) | 0;
        o = g;
        return e | 0;
    }
    function w_(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, e = 0;
        c = d[a >> 0] | 0;
        e = d[b >> 0] | 0;
        if ((c << 24) >> 24 == 0 ? 1 : (c << 24) >> 24 != (e << 24) >> 24) a = e;
        else {
            do {
                a = (a + 1) | 0;
                b = (b + 1) | 0;
                c = d[a >> 0] | 0;
                e = d[b >> 0] | 0;
            }while (!((c << 24) >> 24 == 0 ? 1 : (c << 24) >> 24 != (e << 24) >> 24))
            a = e;
        }
        return ((c & 255) - (a & 255)) | 0;
    }
    function w0(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, f = 0;
        a: do if (!c) a = 0;
        else {
            while(1){
                e = d[a >> 0] | 0;
                f = d[b >> 0] | 0;
                if ((e << 24) >> 24 != (f << 24) >> 24) break;
                c = (c + -1) | 0;
                if (!c) {
                    a = 0;
                    break a;
                } else {
                    a = (a + 1) | 0;
                    b = (b + 1) | 0;
                }
            }
            a = ((e & 255) - (f & 255)) | 0;
        }
        while (0)
        return a | 0;
    }
    function w1(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0, s = 0;
        s = o;
        o = (o + 224) | 0;
        m = (s + 120) | 0;
        n = (s + 80) | 0;
        q = s;
        r = (s + 136) | 0;
        e = n;
        g = (e + 40) | 0;
        do {
            f[e >> 2] = 0;
            e = (e + 4) | 0;
        }while ((e | 0) < (g | 0))
        f[m >> 2] = f[c >> 2];
        if ((w2(0, b, m, q, n) | 0) < 0) c = -1;
        else {
            if ((f[(a + 76) >> 2] | 0) > -1) p = w3(a) | 0;
            else p = 0;
            c = f[a >> 2] | 0;
            l = c & 32;
            if ((d[(a + 74) >> 0] | 0) < 1) f[a >> 2] = c & -33;
            e = (a + 48) | 0;
            if (!(f[e >> 2] | 0)) {
                g = (a + 44) | 0;
                h = f[g >> 2] | 0;
                f[g >> 2] = r;
                i = (a + 28) | 0;
                f[i >> 2] = r;
                j = (a + 20) | 0;
                f[j >> 2] = r;
                f[e >> 2] = 80;
                k = (a + 16) | 0;
                f[k >> 2] = r + 80;
                c = w2(a, b, m, q, n) | 0;
                if (h) {
                    yX[f[(a + 36) >> 2] & 7](a, 0, 0) | 0;
                    c = (f[j >> 2] | 0) == 0 ? -1 : c;
                    f[g >> 2] = h;
                    f[e >> 2] = 0;
                    f[k >> 2] = 0;
                    f[i >> 2] = 0;
                    f[j >> 2] = 0;
                }
            } else c = w2(a, b, m, q, n) | 0;
            e = f[a >> 2] | 0;
            f[a >> 2] = e | l;
            if (p | 0) w4(a);
            c = ((e & 32) | 0) == 0 ? c : -1;
        }
        o = s;
        return c | 0;
    }
    function w2(a, b, c, g, h) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        g = g | 0;
        h = h | 0;
        var i = 0, j = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, E = 0, F = 0, G = 0, H = 0;
        H = o;
        o = (o + 64) | 0;
        C = (H + 16) | 0;
        E = H;
        A = (H + 24) | 0;
        F = (H + 8) | 0;
        G = (H + 20) | 0;
        f[C >> 2] = b;
        x = (a | 0) != 0;
        y = (A + 40) | 0;
        z = y;
        A = (A + 39) | 0;
        B = (F + 4) | 0;
        j = 0;
        i = 0;
        p = 0;
        a: while(1){
            do if ((i | 0) > -1) if ((j | 0) > ((2147483647 - i) | 0)) {
                f[(wW() | 0) >> 2] = 75;
                i = -1;
                break;
            } else {
                i = (j + i) | 0;
                break;
            }
            while (0)
            j = d[b >> 0] | 0;
            if (!((j << 24) >> 24)) {
                w = 87;
                break;
            } else l = b;
            b: while(1){
                switch((j << 24) >> 24){
                    case 37:
                        {
                            j = l;
                            w = 9;
                            break b;
                        }
                    case 0:
                        {
                            j = l;
                            break b;
                        }
                    default:
                        {}
                }
                v = (l + 1) | 0;
                f[C >> 2] = v;
                j = d[v >> 0] | 0;
                l = v;
            }
            c: do if ((w | 0) == 9) while(1){
                w = 0;
                if ((d[(l + 1) >> 0] | 0) != 37) break c;
                j = (j + 1) | 0;
                l = (l + 2) | 0;
                f[C >> 2] = l;
                if ((d[l >> 0] | 0) == 37) w = 9;
                else break;
            }
            while (0)
            j = (j - b) | 0;
            if (x) w5(a, b, j);
            if (j | 0) {
                b = l;
                continue;
            }
            m = (l + 1) | 0;
            j = ((d[m >> 0] | 0) + -48) | 0;
            if (j >>> 0 < 10) {
                v = (d[(l + 2) >> 0] | 0) == 36;
                u = v ? j : -1;
                p = v ? 1 : p;
                m = v ? (l + 3) | 0 : m;
            } else u = -1;
            f[C >> 2] = m;
            j = d[m >> 0] | 0;
            l = (((j << 24) >> 24) + -32) | 0;
            d: do if (l >>> 0 < 32) {
                n = 0;
                q = j;
                while(1){
                    j = 1 << l;
                    if (!(j & 75913)) {
                        j = q;
                        break d;
                    }
                    n = j | n;
                    m = (m + 1) | 0;
                    f[C >> 2] = m;
                    j = d[m >> 0] | 0;
                    l = (((j << 24) >> 24) + -32) | 0;
                    if (l >>> 0 >= 32) break;
                    else q = j;
                }
            } else n = 0;
            while (0)
            if ((j << 24) >> 24 == 42) {
                l = (m + 1) | 0;
                j = ((d[l >> 0] | 0) + -48) | 0;
                if (j >>> 0 < 10 ? (d[(m + 2) >> 0] | 0) == 36 : 0) {
                    f[(h + (j << 2)) >> 2] = 10;
                    j = f[(g + (((d[l >> 0] | 0) + -48) << 3)) >> 2] | 0;
                    p = 1;
                    m = (m + 3) | 0;
                } else {
                    if (p | 0) {
                        i = -1;
                        break;
                    }
                    if (x) {
                        p = ((f[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                        j = f[p >> 2] | 0;
                        f[c >> 2] = p + 4;
                        p = 0;
                        m = l;
                    } else {
                        j = 0;
                        p = 0;
                        m = l;
                    }
                }
                f[C >> 2] = m;
                v = (j | 0) < 0;
                j = v ? (0 - j) | 0 : j;
                n = v ? n | 8192 : n;
            } else {
                j = w6(C) | 0;
                if ((j | 0) < 0) {
                    i = -1;
                    break;
                }
                m = f[C >> 2] | 0;
            }
            do if ((d[m >> 0] | 0) == 46) {
                if ((d[(m + 1) >> 0] | 0) != 42) {
                    f[C >> 2] = m + 1;
                    l = w6(C) | 0;
                    m = f[C >> 2] | 0;
                    break;
                }
                q = (m + 2) | 0;
                l = ((d[q >> 0] | 0) + -48) | 0;
                if (l >>> 0 < 10 ? (d[(m + 3) >> 0] | 0) == 36 : 0) {
                    f[(h + (l << 2)) >> 2] = 10;
                    l = f[(g + (((d[q >> 0] | 0) + -48) << 3)) >> 2] | 0;
                    m = (m + 4) | 0;
                    f[C >> 2] = m;
                    break;
                }
                if (p | 0) {
                    i = -1;
                    break a;
                }
                if (x) {
                    v = ((f[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    l = f[v >> 2] | 0;
                    f[c >> 2] = v + 4;
                } else l = 0;
                f[C >> 2] = q;
                m = q;
            } else l = -1;
            while (0)
            t = 0;
            while(1){
                if ((((d[m >> 0] | 0) + -65) | 0) >>> 0 > 57) {
                    i = -1;
                    break a;
                }
                v = (m + 1) | 0;
                f[C >> 2] = v;
                q = d[((d[m >> 0] | 0) + -65 + (5178 + ((t * 58) | 0))) >> 0] | 0;
                r = q & 255;
                if (((r + -1) | 0) >>> 0 < 8) {
                    t = r;
                    m = v;
                } else break;
            }
            if (!((q << 24) >> 24)) {
                i = -1;
                break;
            }
            s = (u | 0) > -1;
            do if ((q << 24) >> 24 == 19) {
                if (s) {
                    i = -1;
                    break a;
                } else w = 49;
            } else {
                if (s) {
                    f[(h + (u << 2)) >> 2] = r;
                    s = (g + (u << 3)) | 0;
                    u = f[(s + 4) >> 2] | 0;
                    w = E;
                    f[w >> 2] = f[s >> 2];
                    f[(w + 4) >> 2] = u;
                    w = 49;
                    break;
                }
                if (!x) {
                    i = 0;
                    break a;
                }
                w7(E, r, c);
            }
            while (0)
            if ((w | 0) == 49 ? ((w = 0), !x) : 0) {
                j = 0;
                b = v;
                continue;
            }
            m = d[m >> 0] | 0;
            m = ((t | 0) != 0) & (((m & 15) | 0) == 3) ? m & -33 : m;
            s = n & -65537;
            u = ((n & 8192) | 0) == 0 ? n : s;
            e: do switch(m | 0){
                case 110:
                    switch(((t & 255) << 24) >> 24){
                        case 0:
                            {
                                f[f[E >> 2] >> 2] = i;
                                j = 0;
                                b = v;
                                continue a;
                            }
                        case 1:
                            {
                                f[f[E >> 2] >> 2] = i;
                                j = 0;
                                b = v;
                                continue a;
                            }
                        case 2:
                            {
                                j = f[E >> 2] | 0;
                                f[j >> 2] = i;
                                f[(j + 4) >> 2] = (((i | 0) < 0) << 31) >> 31;
                                j = 0;
                                b = v;
                                continue a;
                            }
                        case 3:
                            {
                                e[f[E >> 2] >> 1] = i;
                                j = 0;
                                b = v;
                                continue a;
                            }
                        case 4:
                            {
                                d[f[E >> 2] >> 0] = i;
                                j = 0;
                                b = v;
                                continue a;
                            }
                        case 6:
                            {
                                f[f[E >> 2] >> 2] = i;
                                j = 0;
                                b = v;
                                continue a;
                            }
                        case 7:
                            {
                                j = f[E >> 2] | 0;
                                f[j >> 2] = i;
                                f[(j + 4) >> 2] = (((i | 0) < 0) << 31) >> 31;
                                j = 0;
                                b = v;
                                continue a;
                            }
                        default:
                            {
                                j = 0;
                                b = v;
                                continue a;
                            }
                    }
                case 112:
                    {
                        m = 120;
                        l = l >>> 0 > 8 ? l : 8;
                        b = u | 8;
                        w = 61;
                        break;
                    }
                case 88:
                case 120:
                    {
                        b = u;
                        w = 61;
                        break;
                    }
                case 111:
                    {
                        m = E;
                        b = f[m >> 2] | 0;
                        m = f[(m + 4) >> 2] | 0;
                        r = w9(b, m, y) | 0;
                        s = (z - r) | 0;
                        n = 0;
                        q = 5642;
                        l = (((u & 8) | 0) == 0) | ((l | 0) > (s | 0)) ? l : (s + 1) | 0;
                        s = u;
                        w = 67;
                        break;
                    }
                case 105:
                case 100:
                    {
                        m = E;
                        b = f[m >> 2] | 0;
                        m = f[(m + 4) >> 2] | 0;
                        if ((m | 0) < 0) {
                            b = xN(0, 0, b | 0, m | 0) | 0;
                            m = D;
                            n = E;
                            f[n >> 2] = b;
                            f[(n + 4) >> 2] = m;
                            n = 1;
                            q = 5642;
                            w = 66;
                            break e;
                        } else {
                            n = (((u & 2049) | 0) != 0) & 1;
                            q = ((u & 2048) | 0) == 0 ? ((u & 1) | 0) == 0 ? 5642 : 5644 : 5643;
                            w = 66;
                            break e;
                        }
                    }
                case 117:
                    {
                        m = E;
                        n = 0;
                        q = 5642;
                        b = f[m >> 2] | 0;
                        m = f[(m + 4) >> 2] | 0;
                        w = 66;
                        break;
                    }
                case 99:
                    {
                        d[A >> 0] = f[E >> 2];
                        b = A;
                        n = 0;
                        q = 5642;
                        r = y;
                        m = 1;
                        l = s;
                        break;
                    }
                case 109:
                    {
                        m = xb(f[(wW() | 0) >> 2] | 0) | 0;
                        w = 71;
                        break;
                    }
                case 115:
                    {
                        m = f[E >> 2] | 0;
                        m = m | 0 ? m : 5652;
                        w = 71;
                        break;
                    }
                case 67:
                    {
                        f[F >> 2] = f[E >> 2];
                        f[B >> 2] = 0;
                        f[E >> 2] = F;
                        r = -1;
                        m = F;
                        w = 75;
                        break;
                    }
                case 83:
                    {
                        b = f[E >> 2] | 0;
                        if (!l) {
                            xd(a, 32, j, 0, u);
                            b = 0;
                            w = 84;
                        } else {
                            r = l;
                            m = b;
                            w = 75;
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
                        j = xf(a, +k[E >> 3], j, l, u, m) | 0;
                        b = v;
                        continue a;
                    }
                default:
                    {
                        n = 0;
                        q = 5642;
                        r = y;
                        m = l;
                        l = u;
                    }
            }
            while (0)
            f: do if ((w | 0) == 61) {
                u = E;
                t = f[u >> 2] | 0;
                u = f[(u + 4) >> 2] | 0;
                r = w8(t, u, y, m & 32) | 0;
                q = (((b & 8) | 0) == 0) | (((t | 0) == 0) & ((u | 0) == 0));
                n = q ? 0 : 2;
                q = q ? 5642 : (5642 + (m >> 4)) | 0;
                s = b;
                b = t;
                m = u;
                w = 67;
            } else if ((w | 0) == 66) {
                r = xa(b, m, y) | 0;
                s = u;
                w = 67;
            } else if ((w | 0) == 71) {
                w = 0;
                u = xc(m, 0, l) | 0;
                t = (u | 0) == 0;
                b = m;
                n = 0;
                q = 5642;
                r = t ? (m + l) | 0 : u;
                m = t ? l : (u - m) | 0;
                l = s;
            } else if ((w | 0) == 75) {
                w = 0;
                q = m;
                b = 0;
                l = 0;
                while(1){
                    n = f[q >> 2] | 0;
                    if (!n) break;
                    l = xe(G, n) | 0;
                    if (((l | 0) < 0) | (l >>> 0 > ((r - b) | 0) >>> 0)) break;
                    b = (l + b) | 0;
                    if (r >>> 0 > b >>> 0) q = (q + 4) | 0;
                    else break;
                }
                if ((l | 0) < 0) {
                    i = -1;
                    break a;
                }
                xd(a, 32, j, b, u);
                if (!b) {
                    b = 0;
                    w = 84;
                } else {
                    n = 0;
                    while(1){
                        l = f[m >> 2] | 0;
                        if (!l) {
                            w = 84;
                            break f;
                        }
                        l = xe(G, l) | 0;
                        n = (l + n) | 0;
                        if ((n | 0) > (b | 0)) {
                            w = 84;
                            break f;
                        }
                        w5(a, G, l);
                        if (n >>> 0 >= b >>> 0) {
                            w = 84;
                            break;
                        } else m = (m + 4) | 0;
                    }
                }
            }
            while (0)
            if ((w | 0) == 67) {
                w = 0;
                m = ((b | 0) != 0) | ((m | 0) != 0);
                u = ((l | 0) != 0) | m;
                m = (((m ^ 1) & 1) + (z - r)) | 0;
                b = u ? r : y;
                r = y;
                m = u ? ((l | 0) > (m | 0) ? l : m) : l;
                l = (l | 0) > -1 ? s & -65537 : s;
            } else if ((w | 0) == 84) {
                w = 0;
                xd(a, 32, j, b, u ^ 8192);
                j = (j | 0) > (b | 0) ? j : b;
                b = v;
                continue;
            }
            t = (r - b) | 0;
            s = (m | 0) < (t | 0) ? t : m;
            u = (s + n) | 0;
            j = (j | 0) < (u | 0) ? u : j;
            xd(a, 32, j, u, l);
            w5(a, q, n);
            xd(a, 48, j, u, l ^ 65536);
            xd(a, 48, s, t, 0);
            w5(a, b, t);
            xd(a, 32, j, u, l ^ 8192);
            b = v;
        }
        g: do if ((w | 0) == 87) if (!a) if (!p) i = 0;
        else {
            i = 1;
            while(1){
                b = f[(h + (i << 2)) >> 2] | 0;
                if (!b) break;
                w7((g + (i << 3)) | 0, b, c);
                i = (i + 1) | 0;
                if ((i | 0) >= 10) {
                    i = 1;
                    break g;
                }
            }
            while(1){
                if (f[(h + (i << 2)) >> 2] | 0) {
                    i = -1;
                    break g;
                }
                i = (i + 1) | 0;
                if ((i | 0) >= 10) {
                    i = 1;
                    break;
                }
            }
        }
        while (0)
        o = H;
        return i | 0;
    }
    function w3(a) {
        a = a | 0;
        return 0;
    }
    function w4(a) {
        a = a | 0;
        return;
    }
    function w5(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if (!(f[a >> 2] & 32)) xr(b, c, a) | 0;
        return;
    }
    function w6(a) {
        a = a | 0;
        var b = 0, c = 0, e = 0;
        c = f[a >> 2] | 0;
        e = ((d[c >> 0] | 0) + -48) | 0;
        if (e >>> 0 < 10) {
            b = 0;
            do {
                b = (e + ((b * 10) | 0)) | 0;
                c = (c + 1) | 0;
                f[a >> 2] = c;
                e = ((d[c >> 0] | 0) + -48) | 0;
            }while (e >>> 0 < 10)
        } else b = 0;
        return b | 0;
    }
    function w7(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, g = 0.0;
        a: do if (b >>> 0 <= 20) do switch(b | 0){
            case 9:
                {
                    d = ((f[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    b = f[d >> 2] | 0;
                    f[c >> 2] = d + 4;
                    f[a >> 2] = b;
                    break a;
                }
            case 10:
                {
                    d = ((f[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    b = f[d >> 2] | 0;
                    f[c >> 2] = d + 4;
                    d = a;
                    f[d >> 2] = b;
                    f[(d + 4) >> 2] = (((b | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 11:
                {
                    d = ((f[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    b = f[d >> 2] | 0;
                    f[c >> 2] = d + 4;
                    d = a;
                    f[d >> 2] = b;
                    f[(d + 4) >> 2] = 0;
                    break a;
                }
            case 12:
                {
                    d = ((f[c >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    b = d;
                    e = f[b >> 2] | 0;
                    b = f[(b + 4) >> 2] | 0;
                    f[c >> 2] = d + 8;
                    d = a;
                    f[d >> 2] = e;
                    f[(d + 4) >> 2] = b;
                    break a;
                }
            case 13:
                {
                    e = ((f[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    d = f[e >> 2] | 0;
                    f[c >> 2] = e + 4;
                    d = ((d & 65535) << 16) >> 16;
                    e = a;
                    f[e >> 2] = d;
                    f[(e + 4) >> 2] = (((d | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 14:
                {
                    e = ((f[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    d = f[e >> 2] | 0;
                    f[c >> 2] = e + 4;
                    e = a;
                    f[e >> 2] = d & 65535;
                    f[(e + 4) >> 2] = 0;
                    break a;
                }
            case 15:
                {
                    e = ((f[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    d = f[e >> 2] | 0;
                    f[c >> 2] = e + 4;
                    d = ((d & 255) << 24) >> 24;
                    e = a;
                    f[e >> 2] = d;
                    f[(e + 4) >> 2] = (((d | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 16:
                {
                    e = ((f[c >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    d = f[e >> 2] | 0;
                    f[c >> 2] = e + 4;
                    e = a;
                    f[e >> 2] = d & 255;
                    f[(e + 4) >> 2] = 0;
                    break a;
                }
            case 17:
                {
                    e = ((f[c >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    g = +k[e >> 3];
                    f[c >> 2] = e + 8;
                    k[a >> 3] = g;
                    break a;
                }
            case 18:
                {
                    e = ((f[c >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    g = +k[e >> 3];
                    f[c >> 2] = e + 8;
                    k[a >> 3] = g;
                    break a;
                }
            default:
                break a;
        }
        while (0)
        while (0)
        return;
    }
    function w8(a, b, c, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        e = e | 0;
        if (!(((a | 0) == 0) & ((b | 0) == 0))) do {
            c = (c + -1) | 0;
            d[c >> 0] = g[(5694 + (a & 15)) >> 0] | 0 | e;
            a = xR(a | 0, b | 0, 4) | 0;
            b = D;
        }while (!(((a | 0) == 0) & ((b | 0) == 0)))
        return c | 0;
    }
    function w9(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if (!(((a | 0) == 0) & ((b | 0) == 0))) do {
            c = (c + -1) | 0;
            d[c >> 0] = (a & 7) | 48;
            a = xR(a | 0, b | 0, 3) | 0;
            b = D;
        }while (!(((a | 0) == 0) & ((b | 0) == 0)))
        return c | 0;
    }
    function xa(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0;
        if ((b >>> 0 > 0) | (((b | 0) == 0) & (a >>> 0 > 4294967295))) {
            while(1){
                e = xY(a | 0, b | 0, 10, 0) | 0;
                c = (c + -1) | 0;
                d[c >> 0] = (e & 255) | 48;
                e = a;
                a = xV(a | 0, b | 0, 10, 0) | 0;
                if (!((b >>> 0 > 9) | (((b | 0) == 9) & (e >>> 0 > 4294967295)))) break;
                else b = D;
            }
            b = a;
        } else b = a;
        if (b) while(1){
            c = (c + -1) | 0;
            d[c >> 0] = (b >>> 0) % 10 | 0 | 48;
            if (b >>> 0 < 10) break;
            else b = ((b >>> 0) / 10) | 0;
        }
        return c | 0;
    }
    function xb(a) {
        a = a | 0;
        return xm(a, f[((xl() | 0) + 188) >> 2] | 0) | 0;
    }
    function xc(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, g = 0, h = 0, i = 0;
        h = b & 255;
        e = (c | 0) != 0;
        a: do if (e & (((a & 3) | 0) != 0)) {
            g = b & 255;
            while(1){
                if ((d[a >> 0] | 0) == (g << 24) >> 24) {
                    i = 6;
                    break a;
                }
                a = (a + 1) | 0;
                c = (c + -1) | 0;
                e = (c | 0) != 0;
                if (!(e & (((a & 3) | 0) != 0))) {
                    i = 5;
                    break;
                }
            }
        } else i = 5;
        while (0)
        if ((i | 0) == 5) if (e) i = 6;
        else c = 0;
        b: do if ((i | 0) == 6) {
            g = b & 255;
            if ((d[a >> 0] | 0) != (g << 24) >> 24) {
                e = S(h, 16843009) | 0;
                c: do if (c >>> 0 > 3) while(1){
                    h = f[a >> 2] ^ e;
                    if ((((h & -2139062144) ^ -2139062144) & (h + -16843009)) | 0) break;
                    a = (a + 4) | 0;
                    c = (c + -4) | 0;
                    if (c >>> 0 <= 3) {
                        i = 11;
                        break c;
                    }
                }
                else i = 11;
                while (0)
                if ((i | 0) == 11) if (!c) {
                    c = 0;
                    break;
                }
                while(1){
                    if ((d[a >> 0] | 0) == (g << 24) >> 24) break b;
                    a = (a + 1) | 0;
                    c = (c + -1) | 0;
                    if (!c) {
                        c = 0;
                        break;
                    }
                }
            }
        }
        while (0)
        return (c | 0 ? a : 0) | 0;
    }
    function xd(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = o;
        o = (o + 256) | 0;
        f = g;
        if (((c | 0) > (d | 0)) & (((e & 73728) | 0) == 0)) {
            e = (c - d) | 0;
            xP(f | 0, b | 0, (e >>> 0 < 256 ? e : 256) | 0) | 0;
            if (e >>> 0 > 255) {
                b = (c - d) | 0;
                do {
                    w5(a, f, 256);
                    e = (e + -256) | 0;
                }while (e >>> 0 > 255)
                e = b & 255;
            }
            w5(a, f, e);
        }
        o = g;
        return;
    }
    function xe(a, b) {
        a = a | 0;
        b = b | 0;
        if (!a) a = 0;
        else a = xj(a, b, 0) | 0;
        return a | 0;
    }
    function xf(a, b, c, e, h, i) {
        a = a | 0;
        b = +b;
        c = c | 0;
        e = e | 0;
        h = h | 0;
        i = i | 0;
        var j = 0, k = 0, l = 0, m = 0, n = 0, p = 0, q = 0, r = 0.0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, E = 0, F = 0, G = 0, H = 0;
        H = o;
        o = (o + 560) | 0;
        l = (H + 8) | 0;
        u = H;
        G = (H + 524) | 0;
        F = G;
        m = (H + 512) | 0;
        f[u >> 2] = 0;
        E = (m + 12) | 0;
        xg(b) | 0;
        if ((D | 0) < 0) {
            b = -b;
            B = 1;
            A = 5659;
        } else {
            B = (((h & 2049) | 0) != 0) & 1;
            A = ((h & 2048) | 0) == 0 ? ((h & 1) | 0) == 0 ? 5660 : 5665 : 5662;
        }
        xg(b) | 0;
        C = D & 2146435072;
        do if ((C >>> 0 < 2146435072) | (((C | 0) == 2146435072) & (0 < 0))) {
            r = +xh(b, u) * 2.0;
            j = r != 0.0;
            if (j) f[u >> 2] = (f[u >> 2] | 0) + -1;
            w = i | 32;
            if ((w | 0) == 97) {
                s = i & 32;
                q = (s | 0) == 0 ? A : (A + 9) | 0;
                p = B | 2;
                j = (12 - e) | 0;
                do if (!((e >>> 0 > 11) | ((j | 0) == 0))) {
                    b = 8.0;
                    do {
                        j = (j + -1) | 0;
                        b = b * 16.0;
                    }while ((j | 0) != 0)
                    if ((d[q >> 0] | 0) == 45) {
                        b = -(b + (-r - b));
                        break;
                    } else {
                        b = r + b - b;
                        break;
                    }
                } else b = r;
                while (0)
                k = f[u >> 2] | 0;
                j = (k | 0) < 0 ? (0 - k) | 0 : k;
                j = xa(j, (((j | 0) < 0) << 31) >> 31, E) | 0;
                if ((j | 0) == (E | 0)) {
                    j = (m + 11) | 0;
                    d[j >> 0] = 48;
                }
                d[(j + -1) >> 0] = ((k >> 31) & 2) + 43;
                n = (j + -2) | 0;
                d[n >> 0] = i + 15;
                m = (e | 0) < 1;
                l = ((h & 8) | 0) == 0;
                j = G;
                do {
                    C = ~~b;
                    k = (j + 1) | 0;
                    d[j >> 0] = g[(5694 + C) >> 0] | s;
                    b = (b - +(C | 0)) * 16.0;
                    if (((k - F) | 0) == 1 ? !(l & (m & (b == 0.0))) : 0) {
                        d[k >> 0] = 46;
                        j = (j + 2) | 0;
                    } else j = k;
                }while (b != 0.0)
                C = (j - F) | 0;
                F = (E - n) | 0;
                E = ((e | 0) != 0) & (((C + -2) | 0) < (e | 0)) ? (e + 2) | 0 : C;
                j = (F + p + E) | 0;
                xd(a, 32, c, j, h);
                w5(a, q, p);
                xd(a, 48, c, j, h ^ 65536);
                w5(a, G, C);
                xd(a, 48, (E - C) | 0, 0, 0);
                w5(a, n, F);
                xd(a, 32, c, j, h ^ 8192);
                break;
            }
            k = (e | 0) < 0 ? 6 : e;
            if (j) {
                j = ((f[u >> 2] | 0) + -28) | 0;
                f[u >> 2] = j;
                b = r * 268435456.0;
            } else {
                b = r;
                j = f[u >> 2] | 0;
            }
            C = (j | 0) < 0 ? l : (l + 288) | 0;
            l = C;
            do {
                y = ~~b >>> 0;
                f[l >> 2] = y;
                l = (l + 4) | 0;
                b = (b - +(y >>> 0)) * 1.0e9;
            }while (b != 0.0)
            if ((j | 0) > 0) {
                m = C;
                p = l;
                while(1){
                    n = (j | 0) < 29 ? j : 29;
                    j = (p + -4) | 0;
                    if (j >>> 0 >= m >>> 0) {
                        l = 0;
                        do {
                            x = xQ(f[j >> 2] | 0, 0, n | 0) | 0;
                            x = xO(x | 0, D | 0, l | 0, 0) | 0;
                            y = D;
                            v = xY(x | 0, y | 0, 1e9, 0) | 0;
                            f[j >> 2] = v;
                            l = xV(x | 0, y | 0, 1e9, 0) | 0;
                            j = (j + -4) | 0;
                        }while (j >>> 0 >= m >>> 0)
                        if (l) {
                            m = (m + -4) | 0;
                            f[m >> 2] = l;
                        }
                    }
                    l = p;
                    while(1){
                        if (l >>> 0 <= m >>> 0) break;
                        j = (l + -4) | 0;
                        if (!(f[j >> 2] | 0)) l = j;
                        else break;
                    }
                    j = ((f[u >> 2] | 0) - n) | 0;
                    f[u >> 2] = j;
                    if ((j | 0) > 0) p = l;
                    else break;
                }
            } else m = C;
            if ((j | 0) < 0) {
                e = (((((k + 25) | 0) / 9) | 0) + 1) | 0;
                t = (w | 0) == 102;
                do {
                    s = (0 - j) | 0;
                    s = (s | 0) < 9 ? s : 9;
                    if (m >>> 0 < l >>> 0) {
                        n = ((1 << s) + -1) | 0;
                        p = 1e9 >>> s;
                        q = 0;
                        j = m;
                        do {
                            y = f[j >> 2] | 0;
                            f[j >> 2] = (y >>> s) + q;
                            q = S(y & n, p) | 0;
                            j = (j + 4) | 0;
                        }while (j >>> 0 < l >>> 0)
                        j = (f[m >> 2] | 0) == 0 ? (m + 4) | 0 : m;
                        if (!q) {
                            m = j;
                            j = l;
                        } else {
                            f[l >> 2] = q;
                            m = j;
                            j = (l + 4) | 0;
                        }
                    } else {
                        m = (f[m >> 2] | 0) == 0 ? (m + 4) | 0 : m;
                        j = l;
                    }
                    l = t ? C : m;
                    l = (((j - l) >> 2) | 0) > (e | 0) ? (l + (e << 2)) | 0 : j;
                    j = ((f[u >> 2] | 0) + s) | 0;
                    f[u >> 2] = j;
                }while ((j | 0) < 0)
                j = m;
                e = l;
            } else {
                j = m;
                e = l;
            }
            y = C;
            if (j >>> 0 < e >>> 0) {
                l = (((y - j) >> 2) * 9) | 0;
                n = f[j >> 2] | 0;
                if (n >>> 0 >= 10) {
                    m = 10;
                    do {
                        m = (m * 10) | 0;
                        l = (l + 1) | 0;
                    }while (n >>> 0 >= m >>> 0)
                }
            } else l = 0;
            t = (w | 0) == 103;
            v = (k | 0) != 0;
            m = (k - ((w | 0) != 102 ? l : 0) + (((v & t) << 31) >> 31)) | 0;
            if ((m | 0) < ((((((e - y) >> 2) * 9) | 0) + -9) | 0)) {
                m = (m + 9216) | 0;
                s = (C + 4 + (((((m | 0) / 9) | 0) + -1024) << 2)) | 0;
                m = (((m | 0) % 9 | 0) + 1) | 0;
                if ((m | 0) < 9) {
                    n = 10;
                    do {
                        n = (n * 10) | 0;
                        m = (m + 1) | 0;
                    }while ((m | 0) != 9)
                } else n = 10;
                p = f[s >> 2] | 0;
                q = (p >>> 0) % (n >>> 0) | 0;
                m = ((s + 4) | 0) == (e | 0);
                if (!(m & ((q | 0) == 0))) {
                    r = (((((p >>> 0) / (n >>> 0)) | 0) & 1) | 0) == 0 ? 9007199254740992.0 : 9007199254740994.0;
                    x = ((n | 0) / 2) | 0;
                    b = q >>> 0 < x >>> 0 ? 0.5 : m & ((q | 0) == (x | 0)) ? 1.0 : 1.5;
                    if (B) {
                        x = (d[A >> 0] | 0) == 45;
                        b = x ? -b : b;
                        r = x ? -r : r;
                    }
                    m = (p - q) | 0;
                    f[s >> 2] = m;
                    if (r + b != r) {
                        x = (m + n) | 0;
                        f[s >> 2] = x;
                        if (x >>> 0 > 999999999) {
                            l = s;
                            while(1){
                                m = (l + -4) | 0;
                                f[l >> 2] = 0;
                                if (m >>> 0 < j >>> 0) {
                                    j = (j + -4) | 0;
                                    f[j >> 2] = 0;
                                }
                                x = ((f[m >> 2] | 0) + 1) | 0;
                                f[m >> 2] = x;
                                if (x >>> 0 > 999999999) l = m;
                                else break;
                            }
                        } else m = s;
                        l = (((y - j) >> 2) * 9) | 0;
                        p = f[j >> 2] | 0;
                        if (p >>> 0 >= 10) {
                            n = 10;
                            do {
                                n = (n * 10) | 0;
                                l = (l + 1) | 0;
                            }while (p >>> 0 >= n >>> 0)
                        }
                    } else m = s;
                } else m = s;
                m = (m + 4) | 0;
                m = e >>> 0 > m >>> 0 ? m : e;
                x = j;
            } else {
                m = e;
                x = j;
            }
            w = m;
            while(1){
                if (w >>> 0 <= x >>> 0) {
                    u = 0;
                    break;
                }
                j = (w + -4) | 0;
                if (!(f[j >> 2] | 0)) w = j;
                else {
                    u = 1;
                    break;
                }
            }
            e = (0 - l) | 0;
            do if (t) {
                j = (((v ^ 1) & 1) + k) | 0;
                if (((j | 0) > (l | 0)) & ((l | 0) > -5)) {
                    n = (i + -1) | 0;
                    k = (j + -1 - l) | 0;
                } else {
                    n = (i + -2) | 0;
                    k = (j + -1) | 0;
                }
                j = h & 8;
                if (!j) {
                    if (u ? ((z = f[(w + -4) >> 2] | 0), (z | 0) != 0) : 0) {
                        if (!((z >>> 0) % 10 | 0)) {
                            m = 0;
                            j = 10;
                            do {
                                j = (j * 10) | 0;
                                m = (m + 1) | 0;
                            }while (!((z >>> 0) % (j >>> 0) | 0 | 0))
                        } else m = 0;
                    } else m = 9;
                    j = (((((w - y) >> 2) * 9) | 0) + -9) | 0;
                    if ((n | 32 | 0) == 102) {
                        s = (j - m) | 0;
                        s = (s | 0) > 0 ? s : 0;
                        k = (k | 0) < (s | 0) ? k : s;
                        s = 0;
                        break;
                    } else {
                        s = (j + l - m) | 0;
                        s = (s | 0) > 0 ? s : 0;
                        k = (k | 0) < (s | 0) ? k : s;
                        s = 0;
                        break;
                    }
                } else s = j;
            } else {
                n = i;
                s = h & 8;
            }
            while (0)
            t = k | s;
            p = ((t | 0) != 0) & 1;
            q = (n | 32 | 0) == 102;
            if (q) {
                v = 0;
                j = (l | 0) > 0 ? l : 0;
            } else {
                j = (l | 0) < 0 ? e : l;
                j = xa(j, (((j | 0) < 0) << 31) >> 31, E) | 0;
                m = E;
                if (((m - j) | 0) < 2) do {
                    j = (j + -1) | 0;
                    d[j >> 0] = 48;
                }while (((m - j) | 0) < 2)
                d[(j + -1) >> 0] = ((l >> 31) & 2) + 43;
                j = (j + -2) | 0;
                d[j >> 0] = n;
                v = j;
                j = (m - j) | 0;
            }
            j = (B + 1 + k + p + j) | 0;
            xd(a, 32, c, j, h);
            w5(a, A, B);
            xd(a, 48, c, j, h ^ 65536);
            if (q) {
                n = x >>> 0 > C >>> 0 ? C : x;
                s = (G + 9) | 0;
                p = s;
                q = (G + 8) | 0;
                m = n;
                do {
                    l = xa(f[m >> 2] | 0, 0, s) | 0;
                    if ((m | 0) == (n | 0)) {
                        if ((l | 0) == (s | 0)) {
                            d[q >> 0] = 48;
                            l = q;
                        }
                    } else if (l >>> 0 > G >>> 0) {
                        xP(G | 0, 48, (l - F) | 0) | 0;
                        do l = (l + -1) | 0;
                        while (l >>> 0 > G >>> 0)
                    }
                    w5(a, l, (p - l) | 0);
                    m = (m + 4) | 0;
                }while (m >>> 0 <= C >>> 0)
                if (t | 0) w5(a, 5710, 1);
                if ((m >>> 0 < w >>> 0) & ((k | 0) > 0)) while(1){
                    l = xa(f[m >> 2] | 0, 0, s) | 0;
                    if (l >>> 0 > G >>> 0) {
                        xP(G | 0, 48, (l - F) | 0) | 0;
                        do l = (l + -1) | 0;
                        while (l >>> 0 > G >>> 0)
                    }
                    w5(a, l, (k | 0) < 9 ? k : 9);
                    m = (m + 4) | 0;
                    l = (k + -9) | 0;
                    if (!((m >>> 0 < w >>> 0) & ((k | 0) > 9))) {
                        k = l;
                        break;
                    } else k = l;
                }
                xd(a, 48, (k + 9) | 0, 9, 0);
            } else {
                t = u ? w : (x + 4) | 0;
                if ((k | 0) > -1) {
                    u = (G + 9) | 0;
                    s = (s | 0) == 0;
                    e = u;
                    p = (0 - F) | 0;
                    q = (G + 8) | 0;
                    n = x;
                    do {
                        l = xa(f[n >> 2] | 0, 0, u) | 0;
                        if ((l | 0) == (u | 0)) {
                            d[q >> 0] = 48;
                            l = q;
                        }
                        do if ((n | 0) == (x | 0)) {
                            m = (l + 1) | 0;
                            w5(a, l, 1);
                            if (s & ((k | 0) < 1)) {
                                l = m;
                                break;
                            }
                            w5(a, 5710, 1);
                            l = m;
                        } else {
                            if (l >>> 0 <= G >>> 0) break;
                            xP(G | 0, 48, (l + p) | 0) | 0;
                            do l = (l + -1) | 0;
                            while (l >>> 0 > G >>> 0)
                        }
                        while (0)
                        F = (e - l) | 0;
                        w5(a, l, (k | 0) > (F | 0) ? F : k);
                        k = (k - F) | 0;
                        n = (n + 4) | 0;
                    }while ((n >>> 0 < t >>> 0) & ((k | 0) > -1))
                }
                xd(a, 48, (k + 18) | 0, 18, 0);
                w5(a, v, (E - v) | 0);
            }
            xd(a, 32, c, j, h ^ 8192);
        } else {
            G = ((i & 32) | 0) != 0;
            j = (B + 3) | 0;
            xd(a, 32, c, j, h & -65537);
            w5(a, A, B);
            w5(a, (b != b) | (0.0 != 0.0) ? G ? 5686 : 5690 : G ? 5678 : 5682, 3);
            xd(a, 32, c, j, h ^ 8192);
        }
        while (0)
        o = H;
        return ((j | 0) < (c | 0) ? c : j) | 0;
    }
    function xg(a) {
        a = +a;
        var b = 0;
        k[m >> 3] = a;
        b = f[m >> 2] | 0;
        D = f[(m + 4) >> 2] | 0;
        return b | 0;
    }
    function xh(a, b) {
        a = +a;
        b = b | 0;
        return +(+xi(a, b));
    }
    function xi(a, b) {
        a = +a;
        b = b | 0;
        var c = 0, d = 0, e = 0;
        k[m >> 3] = a;
        c = f[m >> 2] | 0;
        d = f[(m + 4) >> 2] | 0;
        e = xR(c | 0, d | 0, 52) | 0;
        switch(e & 2047){
            case 0:
                {
                    if (a != 0.0) {
                        a = +xi(a * 18446744073709551616.0, b);
                        c = ((f[b >> 2] | 0) + -64) | 0;
                    } else c = 0;
                    f[b >> 2] = c;
                    break;
                }
            case 2047:
                break;
            default:
                {
                    f[b >> 2] = (e & 2047) + -1022;
                    f[m >> 2] = c;
                    f[(m + 4) >> 2] = (d & -2146435073) | 1071644672;
                    a = +k[m >> 3];
                }
        }
        return +a;
    }
    function xj(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        do if (a) {
            if (b >>> 0 < 128) {
                d[a >> 0] = b;
                a = 1;
                break;
            }
            if (!(f[f[((xk() | 0) + 188) >> 2] >> 2] | 0)) if (((b & -128) | 0) == 57216) {
                d[a >> 0] = b;
                a = 1;
                break;
            } else {
                f[(wW() | 0) >> 2] = 84;
                a = -1;
                break;
            }
            if (b >>> 0 < 2048) {
                d[a >> 0] = (b >>> 6) | 192;
                d[(a + 1) >> 0] = (b & 63) | 128;
                a = 2;
                break;
            }
            if ((b >>> 0 < 55296) | (((b & -8192) | 0) == 57344)) {
                d[a >> 0] = (b >>> 12) | 224;
                d[(a + 1) >> 0] = ((b >>> 6) & 63) | 128;
                d[(a + 2) >> 0] = (b & 63) | 128;
                a = 3;
                break;
            }
            if (((b + -65536) | 0) >>> 0 < 1048576) {
                d[a >> 0] = (b >>> 18) | 240;
                d[(a + 1) >> 0] = ((b >>> 12) & 63) | 128;
                d[(a + 2) >> 0] = ((b >>> 6) & 63) | 128;
                d[(a + 3) >> 0] = (b & 63) | 128;
                a = 4;
                break;
            } else {
                f[(wW() | 0) >> 2] = 84;
                a = -1;
                break;
            }
        } else a = 1;
        while (0)
        return a | 0;
    }
    function xk() {
        return wY() | 0;
    }
    function xl() {
        return wY() | 0;
    }
    function xm(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, e = 0;
        e = 0;
        while(1){
            if ((g[(5712 + e) >> 0] | 0) == (a | 0)) {
                a = 2;
                break;
            }
            c = (e + 1) | 0;
            if ((c | 0) == 87) {
                c = 5800;
                e = 87;
                a = 5;
                break;
            } else e = c;
        }
        if ((a | 0) == 2) if (!e) c = 5800;
        else {
            c = 5800;
            a = 5;
        }
        if ((a | 0) == 5) while(1){
            do {
                a = c;
                c = (c + 1) | 0;
            }while ((d[a >> 0] | 0) != 0)
            e = (e + -1) | 0;
            if (!e) break;
            else a = 5;
        }
        return xn(c, f[(b + 20) >> 2] | 0) | 0;
    }
    function xn(a, b) {
        a = a | 0;
        b = b | 0;
        return xo(a, b) | 0;
    }
    function xo(a, b) {
        a = a | 0;
        b = b | 0;
        if (!b) b = 0;
        else b = xp(f[b >> 2] | 0, f[(b + 4) >> 2] | 0, a) | 0;
        return (b | 0 ? b : a) | 0;
    }
    function xp(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
        o = ((f[a >> 2] | 0) + 1794895138) | 0;
        h = xq(f[(a + 8) >> 2] | 0, o) | 0;
        e = xq(f[(a + 12) >> 2] | 0, o) | 0;
        g = xq(f[(a + 16) >> 2] | 0, o) | 0;
        a: do if ((h >>> 0 < (b >>> 2) >>> 0 ? ((n = (b - (h << 2)) | 0), (e >>> 0 < n >>> 0) & (g >>> 0 < n >>> 0)) : 0) ? (((g | e) & 3) | 0) == 0 : 0) {
            n = e >>> 2;
            m = g >>> 2;
            l = 0;
            while(1){
                j = h >>> 1;
                k = (l + j) | 0;
                i = k << 1;
                g = (i + n) | 0;
                e = xq(f[(a + (g << 2)) >> 2] | 0, o) | 0;
                g = xq(f[(a + ((g + 1) << 2)) >> 2] | 0, o) | 0;
                if (!((g >>> 0 < b >>> 0) & (e >>> 0 < ((b - g) | 0) >>> 0))) {
                    e = 0;
                    break a;
                }
                if (d[(a + (g + e)) >> 0] | 0) {
                    e = 0;
                    break a;
                }
                e = w_(c, (a + g) | 0) | 0;
                if (!e) break;
                e = (e | 0) < 0;
                if ((h | 0) == 1) {
                    e = 0;
                    break a;
                } else {
                    l = e ? l : k;
                    h = e ? j : (h - j) | 0;
                }
            }
            e = (i + m) | 0;
            g = xq(f[(a + (e << 2)) >> 2] | 0, o) | 0;
            e = xq(f[(a + ((e + 1) << 2)) >> 2] | 0, o) | 0;
            if ((e >>> 0 < b >>> 0) & (g >>> 0 < ((b - e) | 0) >>> 0)) e = (d[(a + (e + g)) >> 0] | 0) == 0 ? (a + e) | 0 : 0;
            else e = 0;
        } else e = 0;
        while (0)
        return e | 0;
    }
    function xq(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = xZ(a | 0) | 0;
        return ((b | 0) == 0 ? a : c) | 0;
    }
    function xr(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, g = 0, h = 0, i = 0, j = 0;
        e = (c + 16) | 0;
        g = f[e >> 2] | 0;
        if (!g) {
            if (!(xs(c) | 0)) {
                g = f[e >> 2] | 0;
                h = 5;
            } else e = 0;
        } else h = 5;
        a: do if ((h | 0) == 5) {
            j = (c + 20) | 0;
            i = f[j >> 2] | 0;
            e = i;
            if (((g - i) | 0) >>> 0 < b >>> 0) {
                e = yX[f[(c + 36) >> 2] & 7](c, a, b) | 0;
                break;
            }
            b: do if ((d[(c + 75) >> 0] | 0) > -1) {
                i = b;
                while(1){
                    if (!i) {
                        h = 0;
                        g = a;
                        break b;
                    }
                    g = (i + -1) | 0;
                    if ((d[(a + g) >> 0] | 0) == 10) break;
                    else i = g;
                }
                e = yX[f[(c + 36) >> 2] & 7](c, a, i) | 0;
                if (e >>> 0 < i >>> 0) break a;
                h = i;
                g = (a + i) | 0;
                b = (b - i) | 0;
                e = f[j >> 2] | 0;
            } else {
                h = 0;
                g = a;
            }
            while (0)
            xS(e | 0, g | 0, b | 0) | 0;
            f[j >> 2] = (f[j >> 2] | 0) + b;
            e = (h + b) | 0;
        }
        while (0)
        return e | 0;
    }
    function xs(a) {
        a = a | 0;
        var b = 0, c = 0;
        b = (a + 74) | 0;
        c = d[b >> 0] | 0;
        d[b >> 0] = (c + 255) | c;
        b = f[a >> 2] | 0;
        if (!(b & 8)) {
            f[(a + 8) >> 2] = 0;
            f[(a + 4) >> 2] = 0;
            c = f[(a + 44) >> 2] | 0;
            f[(a + 28) >> 2] = c;
            f[(a + 20) >> 2] = c;
            f[(a + 16) >> 2] = c + (f[(a + 48) >> 2] | 0);
            a = 0;
        } else {
            f[a >> 2] = b | 32;
            a = -1;
        }
        return a | 0;
    }
    function xt(a, b) {
        a = W(a);
        b = W(b);
        var c = 0, d = 0;
        c = xu(a) | 0;
        do if ((c & 2147483647) >>> 0 <= 2139095040) {
            d = xu(b) | 0;
            if ((d & 2147483647) >>> 0 <= 2139095040) if (((d ^ c) | 0) < 0) {
                a = (c | 0) < 0 ? b : a;
                break;
            } else {
                a = a < b ? b : a;
                break;
            }
        } else a = b;
        while (0)
        return W(a);
    }
    function xu(a) {
        a = W(a);
        return ((j[m >> 2] = a), f[m >> 2] | 0) | 0;
    }
    function xv(a, b) {
        a = W(a);
        b = W(b);
        var c = 0, d = 0;
        c = xw(a) | 0;
        do if ((c & 2147483647) >>> 0 <= 2139095040) {
            d = xw(b) | 0;
            if ((d & 2147483647) >>> 0 <= 2139095040) if (((d ^ c) | 0) < 0) {
                a = (c | 0) < 0 ? a : b;
                break;
            } else {
                a = a < b ? a : b;
                break;
            }
        } else a = b;
        while (0)
        return W(a);
    }
    function xw(a) {
        a = W(a);
        return ((j[m >> 2] = a), f[m >> 2] | 0) | 0;
    }
    function xx(a, b) {
        a = W(a);
        b = W(b);
        var c = 0, d = 0, e = 0, g = 0, h = 0, i = 0, k = 0, l = 0;
        g = ((j[m >> 2] = a), f[m >> 2] | 0);
        i = ((j[m >> 2] = b), f[m >> 2] | 0);
        c = (g >>> 23) & 255;
        h = (i >>> 23) & 255;
        k = g & -2147483648;
        e = i << 1;
        a: do if ((e | 0) != 0 ? !(((c | 0) == 255) | (((xy(b) | 0) & 2147483647) >>> 0 > 2139095040)) : 0) {
            d = g << 1;
            if (d >>> 0 <= e >>> 0) {
                b = W(a * W(0.0));
                return W((d | 0) == (e | 0) ? b : a);
            }
            if (!c) {
                c = g << 9;
                if ((c | 0) > -1) {
                    d = c;
                    c = 0;
                    do {
                        c = (c + -1) | 0;
                        d = d << 1;
                    }while ((d | 0) > -1)
                } else c = 0;
                d = g << (1 - c);
            } else d = (g & 8388607) | 8388608;
            if (!h) {
                g = i << 9;
                if ((g | 0) > -1) {
                    e = 0;
                    do {
                        e = (e + -1) | 0;
                        g = g << 1;
                    }while ((g | 0) > -1)
                } else e = 0;
                h = e;
                i = i << (1 - e);
            } else i = (i & 8388607) | 8388608;
            e = (d - i) | 0;
            g = (e | 0) > -1;
            b: do if ((c | 0) > (h | 0)) {
                while(1){
                    if (g) if (!e) break;
                    else d = e;
                    d = d << 1;
                    c = (c + -1) | 0;
                    e = (d - i) | 0;
                    g = (e | 0) > -1;
                    if ((c | 0) <= (h | 0)) break b;
                }
                b = W(a * W(0.0));
                break a;
            }
            while (0)
            if (g) if (!e) {
                b = W(a * W(0.0));
                break;
            } else d = e;
            if (d >>> 0 < 8388608) do {
                d = d << 1;
                c = (c + -1) | 0;
            }while (d >>> 0 < 8388608)
            if ((c | 0) > 0) c = (d + -8388608) | (c << 23);
            else c = d >>> ((1 - c) | 0);
            b = ((f[m >> 2] = c | k), W(j[m >> 2]));
        } else l = 3;
        while (0)
        if ((l | 0) == 3) {
            b = W(a * b);
            b = W(b / b);
        }
        return W(b);
    }
    function xy(a) {
        a = W(a);
        return ((j[m >> 2] = a), f[m >> 2] | 0) | 0;
    }
    function xz(a, b) {
        a = a | 0;
        b = b | 0;
        return w1(f[582] | 0, a, b) | 0;
    }
    function xA(a) {
        a = a | 0;
        aW();
    }
    function xB(a) {
        a = a | 0;
        return;
    }
    function xC(a, b) {
        a = a | 0;
        b = b | 0;
        return 0;
    }
    function xD(a) {
        a = a | 0;
        if ((xE((a + 4) | 0) | 0) == -1) {
            yS[f[((f[a >> 2] | 0) + 8) >> 2] & 127](a);
            a = 1;
        } else a = 0;
        return a | 0;
    }
    function xE(a) {
        a = a | 0;
        var b = 0;
        b = f[a >> 2] | 0;
        f[a >> 2] = b + -1;
        return (b + -1) | 0;
    }
    function xF(a) {
        a = a | 0;
        if (xD(a) | 0) xG(a);
        return;
    }
    function xG(a) {
        a = a | 0;
        var b = 0;
        b = (a + 8) | 0;
        if (!((f[b >> 2] | 0) != 0 ? (xE(b) | 0) != -1 : 0)) yS[f[((f[a >> 2] | 0) + 16) >> 2] & 127](a);
        return;
    }
    function xH(a) {
        a = a | 0;
        var b = 0;
        b = (a | 0) == 0 ? 1 : a;
        while(1){
            a = wP(b) | 0;
            if (a | 0) break;
            a = xL() | 0;
            if (!a) {
                a = 0;
                break;
            }
            y8[a & 0]();
        }
        return a | 0;
    }
    function xI(a) {
        a = a | 0;
        return xH(a) | 0;
    }
    function xJ(a) {
        a = a | 0;
        wQ(a);
        return;
    }
    function xK(a) {
        a = a | 0;
        if ((d[(a + 11) >> 0] | 0) < 0) xJ(f[a >> 2] | 0);
        return;
    }
    function xL() {
        var a = 0;
        a = f[2923] | 0;
        f[2923] = a + 0;
        return a | 0;
    }
    function xM() {}
    function xN(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        d = (b - d - ((c >>> 0 > a >>> 0) | 0)) >>> 0;
        return ((D = d), ((a - c) >>> 0) | 0) | 0;
    }
    function xO(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        c = (a + c) >>> 0;
        return ((D = (b + d + ((c >>> 0 < a >>> 0) | 0)) >>> 0), c | 0) | 0;
    }
    function xP(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, g = 0, h = 0, i = 0;
        h = (a + c) | 0;
        b = b & 255;
        if ((c | 0) >= 67) {
            while(a & 3){
                d[a >> 0] = b;
                a = (a + 1) | 0;
            }
            e = (h & -4) | 0;
            g = (e - 64) | 0;
            i = b | (b << 8) | (b << 16) | (b << 24);
            while((a | 0) <= (g | 0)){
                f[a >> 2] = i;
                f[(a + 4) >> 2] = i;
                f[(a + 8) >> 2] = i;
                f[(a + 12) >> 2] = i;
                f[(a + 16) >> 2] = i;
                f[(a + 20) >> 2] = i;
                f[(a + 24) >> 2] = i;
                f[(a + 28) >> 2] = i;
                f[(a + 32) >> 2] = i;
                f[(a + 36) >> 2] = i;
                f[(a + 40) >> 2] = i;
                f[(a + 44) >> 2] = i;
                f[(a + 48) >> 2] = i;
                f[(a + 52) >> 2] = i;
                f[(a + 56) >> 2] = i;
                f[(a + 60) >> 2] = i;
                a = (a + 64) | 0;
            }
            while((a | 0) < (e | 0)){
                f[a >> 2] = i;
                a = (a + 4) | 0;
            }
        }
        while((a | 0) < (h | 0)){
            d[a >> 0] = b;
            a = (a + 1) | 0;
        }
        return (h - c) | 0;
    }
    function xQ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if ((c | 0) < 32) {
            D = (b << c) | ((a & (((1 << c) - 1) << (32 - c))) >>> (32 - c));
            return a << c;
        }
        D = a << (c - 32);
        return 0;
    }
    function xR(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if ((c | 0) < 32) {
            D = b >>> c;
            return (a >>> c) | ((b & ((1 << c) - 1)) << (32 - c));
        }
        D = 0;
        return (b >>> (c - 32)) | 0;
    }
    function xS(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0, g = 0, h = 0;
        if ((c | 0) >= 8192) return aR(a | 0, b | 0, c | 0) | 0;
        h = a | 0;
        g = (a + c) | 0;
        if ((a & 3) == (b & 3)) {
            while(a & 3){
                if (!c) return h | 0;
                d[a >> 0] = d[b >> 0] | 0;
                a = (a + 1) | 0;
                b = (b + 1) | 0;
                c = (c - 1) | 0;
            }
            c = (g & -4) | 0;
            e = (c - 64) | 0;
            while((a | 0) <= (e | 0)){
                f[a >> 2] = f[b >> 2];
                f[(a + 4) >> 2] = f[(b + 4) >> 2];
                f[(a + 8) >> 2] = f[(b + 8) >> 2];
                f[(a + 12) >> 2] = f[(b + 12) >> 2];
                f[(a + 16) >> 2] = f[(b + 16) >> 2];
                f[(a + 20) >> 2] = f[(b + 20) >> 2];
                f[(a + 24) >> 2] = f[(b + 24) >> 2];
                f[(a + 28) >> 2] = f[(b + 28) >> 2];
                f[(a + 32) >> 2] = f[(b + 32) >> 2];
                f[(a + 36) >> 2] = f[(b + 36) >> 2];
                f[(a + 40) >> 2] = f[(b + 40) >> 2];
                f[(a + 44) >> 2] = f[(b + 44) >> 2];
                f[(a + 48) >> 2] = f[(b + 48) >> 2];
                f[(a + 52) >> 2] = f[(b + 52) >> 2];
                f[(a + 56) >> 2] = f[(b + 56) >> 2];
                f[(a + 60) >> 2] = f[(b + 60) >> 2];
                a = (a + 64) | 0;
                b = (b + 64) | 0;
            }
            while((a | 0) < (c | 0)){
                f[a >> 2] = f[b >> 2];
                a = (a + 4) | 0;
                b = (b + 4) | 0;
            }
        } else {
            c = (g - 4) | 0;
            while((a | 0) < (c | 0)){
                d[a >> 0] = d[b >> 0] | 0;
                d[(a + 1) >> 0] = d[(b + 1) >> 0] | 0;
                d[(a + 2) >> 0] = d[(b + 2) >> 0] | 0;
                d[(a + 3) >> 0] = d[(b + 3) >> 0] | 0;
                a = (a + 4) | 0;
                b = (b + 4) | 0;
            }
        }
        while((a | 0) < (g | 0)){
            d[a >> 0] = d[b >> 0] | 0;
            a = (a + 1) | 0;
            b = (b + 1) | 0;
        }
        return h | 0;
    }
    function xT(a) {
        a = a | 0;
        var b = 0;
        b = d[(q + (a & 255)) >> 0] | 0;
        if ((b | 0) < 8) return b | 0;
        b = d[(q + ((a >> 8) & 255)) >> 0] | 0;
        if ((b | 0) < 8) return (b + 8) | 0;
        b = d[(q + ((a >> 16) & 255)) >> 0] | 0;
        if ((b | 0) < 8) return (b + 16) | 0;
        return ((d[(q + (a >>> 24)) >> 0] | 0) + 24) | 0;
    }
    function xU(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
        l = a;
        j = b;
        k = j;
        h = c;
        n = d;
        i = n;
        if (!k) {
            g = (e | 0) != 0;
            if (!i) {
                if (g) {
                    f[e >> 2] = (l >>> 0) % (h >>> 0);
                    f[(e + 4) >> 2] = 0;
                }
                n = 0;
                e = ((l >>> 0) / (h >>> 0)) >>> 0;
                return ((D = n), e) | 0;
            } else {
                if (!g) {
                    n = 0;
                    e = 0;
                    return ((D = n), e) | 0;
                }
                f[e >> 2] = a | 0;
                f[(e + 4) >> 2] = b & 0;
                n = 0;
                e = 0;
                return ((D = n), e) | 0;
            }
        }
        g = (i | 0) == 0;
        do if (h) {
            if (!g) {
                g = ((V(i | 0) | 0) - (V(k | 0) | 0)) | 0;
                if (g >>> 0 <= 31) {
                    m = (g + 1) | 0;
                    i = (31 - g) | 0;
                    b = (g - 31) >> 31;
                    h = m;
                    a = ((l >>> (m >>> 0)) & b) | (k << i);
                    b = (k >>> (m >>> 0)) & b;
                    g = 0;
                    i = l << i;
                    break;
                }
                if (!e) {
                    n = 0;
                    e = 0;
                    return ((D = n), e) | 0;
                }
                f[e >> 2] = a | 0;
                f[(e + 4) >> 2] = j | (b & 0);
                n = 0;
                e = 0;
                return ((D = n), e) | 0;
            }
            g = (h - 1) | 0;
            if ((g & h) | 0) {
                i = ((V(h | 0) | 0) + 33 - (V(k | 0) | 0)) | 0;
                p = (64 - i) | 0;
                m = (32 - i) | 0;
                j = m >> 31;
                o = (i - 32) | 0;
                b = o >> 31;
                h = i;
                a = (((m - 1) >> 31) & (k >>> (o >>> 0))) | (((k << m) | (l >>> (i >>> 0))) & b);
                b = b & (k >>> (i >>> 0));
                g = (l << p) & j;
                i = (((k << p) | (l >>> (o >>> 0))) & j) | ((l << m) & ((i - 33) >> 31));
                break;
            }
            if (e | 0) {
                f[e >> 2] = g & l;
                f[(e + 4) >> 2] = 0;
            }
            if ((h | 0) == 1) {
                o = j | (b & 0);
                p = a | 0 | 0;
                return ((D = o), p) | 0;
            } else {
                p = xT(h | 0) | 0;
                o = (k >>> (p >>> 0)) | 0;
                p = (k << (32 - p)) | (l >>> (p >>> 0)) | 0;
                return ((D = o), p) | 0;
            }
        } else {
            if (g) {
                if (e | 0) {
                    f[e >> 2] = (k >>> 0) % (h >>> 0);
                    f[(e + 4) >> 2] = 0;
                }
                o = 0;
                p = ((k >>> 0) / (h >>> 0)) >>> 0;
                return ((D = o), p) | 0;
            }
            if (!l) {
                if (e | 0) {
                    f[e >> 2] = 0;
                    f[(e + 4) >> 2] = (k >>> 0) % (i >>> 0);
                }
                o = 0;
                p = ((k >>> 0) / (i >>> 0)) >>> 0;
                return ((D = o), p) | 0;
            }
            g = (i - 1) | 0;
            if (!(g & i)) {
                if (e | 0) {
                    f[e >> 2] = a | 0;
                    f[(e + 4) >> 2] = (g & k) | (b & 0);
                }
                o = 0;
                p = k >>> ((xT(i | 0) | 0) >>> 0);
                return ((D = o), p) | 0;
            }
            g = ((V(i | 0) | 0) - (V(k | 0) | 0)) | 0;
            if (g >>> 0 <= 30) {
                b = (g + 1) | 0;
                i = (31 - g) | 0;
                h = b;
                a = (k << i) | (l >>> (b >>> 0));
                b = k >>> (b >>> 0);
                g = 0;
                i = l << i;
                break;
            }
            if (!e) {
                o = 0;
                p = 0;
                return ((D = o), p) | 0;
            }
            f[e >> 2] = a | 0;
            f[(e + 4) >> 2] = j | (b & 0);
            o = 0;
            p = 0;
            return ((D = o), p) | 0;
        }
        while (0)
        if (!h) {
            k = i;
            j = 0;
            i = 0;
        } else {
            m = c | 0 | 0;
            l = n | (d & 0);
            k = xO(m | 0, l | 0, -1, -1) | 0;
            c = D;
            j = i;
            i = 0;
            do {
                d = j;
                j = (g >>> 31) | (j << 1);
                g = i | (g << 1);
                d = (a << 1) | (d >>> 31) | 0;
                n = (a >>> 31) | (b << 1) | 0;
                xN(k | 0, c | 0, d | 0, n | 0) | 0;
                p = D;
                o = (p >> 31) | (((p | 0) < 0 ? -1 : 0) << 1);
                i = o & 1;
                a = xN(d | 0, n | 0, (o & m) | 0, (((((p | 0) < 0 ? -1 : 0) >> 31) | (((p | 0) < 0 ? -1 : 0) << 1)) & l) | 0) | 0;
                b = D;
                h = (h - 1) | 0;
            }while ((h | 0) != 0)
            k = j;
            j = 0;
        }
        h = 0;
        if (e | 0) {
            f[e >> 2] = a;
            f[(e + 4) >> 2] = b;
        }
        o = ((g | 0) >>> 31) | ((k | h) << 1) | (((h << 1) | (g >>> 31)) & 0) | j;
        p = (((g << 1) | (0 >>> 31)) & -2) | i;
        return ((D = o), p) | 0;
    }
    function xV(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        return xU(a, b, c, d, 0) | 0;
    }
    function xW(a) {
        a = a | 0;
        var b = 0, c = 0;
        c = ((a + 15) & -16) | 0;
        b = f[l >> 2] | 0;
        a = (b + c) | 0;
        if ((((c | 0) > 0) & ((a | 0) < (b | 0))) | ((a | 0) < 0)) {
            _() | 0;
            aT(12);
            return -1;
        }
        f[l >> 2] = a;
        if ((a | 0) > ($() | 0) ? (Z() | 0) == 0 : 0) {
            f[l >> 2] = b;
            aT(12);
            return -1;
        }
        return b | 0;
    }
    function xX(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var e = 0;
        if (((b | 0) < (a | 0)) & ((a | 0) < ((b + c) | 0))) {
            e = a;
            b = (b + c) | 0;
            a = (a + c) | 0;
            while((c | 0) > 0){
                a = (a - 1) | 0;
                b = (b - 1) | 0;
                c = (c - 1) | 0;
                d[a >> 0] = d[b >> 0] | 0;
            }
            a = e;
        } else xS(a, b, c) | 0;
        return a | 0;
    }
    function xY(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, g = 0;
        g = o;
        o = (o + 16) | 0;
        e = g | 0;
        xU(a, b, c, d, e) | 0;
        o = g;
        return ((D = f[(e + 4) >> 2] | 0), f[e >> 2] | 0) | 0;
    }
    function xZ(a) {
        a = a | 0;
        return (((a & 255) << 24) | (((a >> 8) & 255) << 16) | (((a >> 16) & 255) << 8) | (a >>> 24) | 0);
    }
    function x$(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        yO[a & 1](b | 0, c | 0, d | 0, e | 0, f | 0);
    }
    function x_(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        yP[a & 1](b | 0, W(c));
    }
    function x0(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        yQ[a & 31](b | 0, +c);
    }
    function x1(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        d = W(d);
        return W(yR[a & 0](b | 0, W(c), W(d)));
    }
    function x2(a, b) {
        a = a | 0;
        b = b | 0;
        yS[a & 127](b | 0);
    }
    function x3(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        yT[a & 31](b | 0, c | 0);
    }
    function x4(a, b) {
        a = a | 0;
        b = b | 0;
        return yU[a & 31](b | 0) | 0;
    }
    function x5(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        e = e | 0;
        yV[a & 1](b | 0, +c, +d, e | 0);
    }
    function x6(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        yW[a & 1](b | 0, +c, +d);
    }
    function x7(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        return yX[a & 7](b | 0, c | 0, d | 0) | 0;
    }
    function x8(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        return +yY[a & 1](b | 0, c | 0, d | 0);
    }
    function x9(a, b) {
        a = a | 0;
        b = b | 0;
        return +yZ[a & 15](b | 0);
    }
    function ya(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        return y$[a & 1](b | 0, +c) | 0;
    }
    function yb(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        return y_[a & 15](b | 0, c | 0) | 0;
    }
    function yc(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        e = +e;
        f = f | 0;
        y0[a & 1](b | 0, c | 0, +d, +e, f | 0);
    }
    function yd(a, b, c, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        y1[a & 1](b | 0, c | 0, d | 0, e | 0, f | 0, g | 0);
    }
    function ye(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        return +y2[a & 7](b | 0, c | 0);
    }
    function yf(a) {
        a = a | 0;
        return y3[a & 7]() | 0;
    }
    function yg(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        return y4[a & 1](b | 0, c | 0, d | 0, e | 0, f | 0) | 0;
    }
    function yh(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = +e;
        y5[a & 1](b | 0, c | 0, d | 0, +e);
    }
    function yi(a, b, c, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = W(d);
        e = e | 0;
        f = W(f);
        g = g | 0;
        y6[a & 1](b | 0, c | 0, W(d), e | 0, W(f), g | 0);
    }
    function yj(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        y7[a & 15](b | 0, c | 0, d | 0);
    }
    function yk(a) {
        a = a | 0;
        y8[a & 0]();
    }
    function yl(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        y9[a & 15](b | 0, c | 0, +d);
    }
    function ym(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        return za[a & 1](+b, +c) | 0;
    }
    function yn(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        zb[a & 15](b | 0, c | 0, d | 0, e | 0);
    }
    function yo(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        X(0);
    }
    function yp(a, b) {
        a = a | 0;
        b = W(b);
        X(1);
    }
    function yq(a, b) {
        a = a | 0;
        b = +b;
        X(2);
    }
    function yr(a, b, c) {
        a = a | 0;
        b = W(b);
        c = W(c);
        X(3);
        return bb;
    }
    function ys(a) {
        a = a | 0;
        X(4);
    }
    function yt(a, b) {
        a = a | 0;
        b = b | 0;
        X(5);
    }
    function yu(a) {
        a = a | 0;
        X(6);
        return 0;
    }
    function yv(a, b, c, d) {
        a = a | 0;
        b = +b;
        c = +c;
        d = d | 0;
        X(7);
    }
    function yw(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        X(8);
    }
    function yx(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        X(9);
        return 0;
    }
    function yy(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        X(10);
        return 0.0;
    }
    function yz(a) {
        a = a | 0;
        X(11);
        return 0.0;
    }
    function yA(a, b) {
        a = a | 0;
        b = +b;
        X(12);
        return 0;
    }
    function yB(a, b) {
        a = a | 0;
        b = b | 0;
        X(13);
        return 0;
    }
    function yC(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        e = e | 0;
        X(14);
    }
    function yD(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        X(15);
    }
    function yE(a, b) {
        a = a | 0;
        b = b | 0;
        X(16);
        return 0.0;
    }
    function yF() {
        X(17);
        return 0;
    }
    function yG(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        X(18);
        return 0;
    }
    function yH(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        X(19);
    }
    function yI(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = W(c);
        d = d | 0;
        e = W(e);
        f = f | 0;
        X(20);
    }
    function yJ(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        X(21);
    }
    function yK() {
        X(22);
    }
    function yL(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        X(23);
    }
    function yM(a, b) {
        a = +a;
        b = +b;
        X(24);
        return 0;
    }
    function yN(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        X(25);
    }
    var yO = [
        yo,
        s5
    ];
    var yP = [
        yp,
        ef
    ];
    var yQ = [
        yq,
        eF,
        eG,
        eH,
        eI,
        eJ,
        eK,
        eL,
        eN,
        eO,
        eQ,
        eR,
        eS,
        eT,
        eU,
        eV,
        eW,
        eX,
        eY,
        yq,
        yq,
        yq,
        yq,
        yq,
        yq,
        yq,
        yq,
        yq,
        yq,
        yq,
        yq,
        yq, 
    ];
    var yR = [
        yr
    ];
    var yS = [
        ys,
        xB,
        g7,
        g8,
        g9,
        k3,
        k4,
        k5,
        rk,
        rl,
        rm,
        sP,
        sQ,
        sR,
        wc,
        wd,
        we,
        bk,
        ek,
        ep,
        eM,
        eP,
        fQ,
        fR,
        gQ,
        hh,
        hz,
        hY,
        ih,
        iG,
        i1,
        jk,
        jE,
        j$,
        kh,
        kA,
        kT,
        lp,
        lI,
        l_,
        mi,
        mB,
        mU,
        ne,
        nw,
        nN,
        n6,
        ec,
        oG,
        oZ,
        pj,
        pE,
        pW,
        qh,
        qt,
        qw,
        qQ,
        qT,
        q9,
        rp,
        rs,
        rM,
        r5,
        hi,
        t2,
        uD,
        uV,
        vb,
        vA,
        vS,
        v2,
        v5,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys,
        ys, 
    ];
    var yT = [
        yt,
        eq,
        er,
        eu,
        ev,
        ew,
        ex,
        ey,
        ez,
        eC,
        eD,
        eE,
        fd,
        fg,
        fh,
        fi,
        fj,
        fk,
        fl,
        fq,
        fu,
        f$,
        ni,
        nz,
        pI,
        t5,
        sd,
        uq,
        yt,
        yt,
        yt,
        yt, 
    ];
    var yU = [
        yu,
        wS,
        ej,
        e0,
        e4,
        e5,
        e6,
        e7,
        e8,
        e9,
        fb,
        fc,
        fr,
        fs,
        fS,
        n9,
        p$,
        rP,
        ua,
        uc,
        yu,
        yu,
        yu,
        yu,
        yu,
        yu,
        yu,
        yu,
        yu,
        yu,
        yu,
        yu, 
    ];
    var yV = [
        yv,
        fT
    ];
    var yW = [
        yw,
        rc
    ];
    var yX = [
        yx,
        wT,
        wU,
        w$,
        iK,
        lt,
        oK,
        vf
    ];
    var yY = [
        yy,
        kl
    ];
    var yZ = [
        yz,
        fe,
        ff,
        fm,
        fU,
        fV,
        fW,
        fX,
        fY,
        fZ,
        yz,
        yz,
        yz,
        yz,
        yz,
        yz
    ];
    var y$ = [
        yA,
        qp
    ];
    var y_ = [
        yB,
        xC,
        ft,
        gW,
        h0,
        i5,
        jo,
        kX,
        lM,
        nR,
        eg,
        uZ,
        yB,
        yB,
        yB,
        yB
    ];
    var y0 = [
        yC,
        hD
    ];
    var y1 = [
        yD,
        vE
    ];
    var y2 = [
        yE,
        fn,
        f_,
        f0,
        f1,
        kE,
        yE,
        yE
    ];
    var y3 = [
        yF,
        f2,
        eh,
        ea,
        qB,
        qX,
        rx,
        v9
    ];
    var y4 = [
        yG,
        df
    ];
    var y5 = [
        yH,
        mm
    ];
    var y6 = [
        yI,
        fw
    ];
    var y7 = [
        yJ,
        e1,
        fa,
        fo,
        fp,
        il,
        jI,
        mF,
        mY,
        ee,
        ty,
        uH,
        vW,
        yJ,
        yJ,
        yJ
    ];
    var y8 = [
        yK
    ];
    var y9 = [
        yL,
        es,
        et,
        eA,
        eB,
        eZ,
        e$,
        e_,
        l3,
        o1,
        qk,
        yL,
        yL,
        yL,
        yL,
        yL
    ];
    var za = [
        yM,
        rh
    ];
    var zb = [
        yN,
        j2,
        oh,
        pn,
        p7,
        qH,
        q1,
        rE,
        sa,
        uh,
        wk,
        yN,
        yN,
        yN,
        yN,
        yN
    ];
    return {
        _llvm_bswap_i32: xZ,
        dynCall_idd: ym,
        dynCall_i: yf,
        _i64Subtract: xN,
        ___udivdi3: xV,
        dynCall_vif: x_,
        setThrew: bg,
        dynCall_viii: yj,
        _bitshift64Lshr: xR,
        _bitshift64Shl: xQ,
        dynCall_vi: x2,
        dynCall_viiddi: yc,
        dynCall_diii: x8,
        dynCall_iii: yb,
        _memset: xP,
        _sbrk: xW,
        _memcpy: xS,
        __GLOBAL__sub_I_Yoga_cpp: d9,
        dynCall_vii: x3,
        ___uremdi3: xY,
        dynCall_vid: x0,
        stackAlloc: bc,
        _nbind_init: wz,
        getTempRet0: bi,
        dynCall_di: x9,
        dynCall_iid: ya,
        setTempRet0: bh,
        _i64Add: xO,
        dynCall_fiff: x1,
        dynCall_iiii: x7,
        _emscripten_get_global_libc: wR,
        dynCall_viid: yl,
        dynCall_viiid: yh,
        dynCall_viififi: yi,
        dynCall_ii: x4,
        __GLOBAL__sub_I_Binding_cc: tV,
        dynCall_viiii: yn,
        dynCall_iiiiii: yg,
        stackSave: bd,
        dynCall_viiiii: x$,
        __GLOBAL__sub_I_nbind_cc: f3,
        dynCall_vidd: x6,
        _free: wQ,
        runPostSets: xM,
        dynCall_viiiiii: yd,
        establishStackSpace: bf,
        _memmove: xX,
        stackRestore: be,
        _malloc: wP,
        __GLOBAL__sub_I_common_cc: rY,
        dynCall_viddi: x5,
        dynCall_dii: ye,
        dynCall_v: yk
    };
}
