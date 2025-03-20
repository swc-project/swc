export function foo(global, env, buffer) {
    "use asm";
    var a = new global.Int8Array(buffer);
    var b = new global.Int16Array(buffer);
    var c = new global.Int32Array(buffer);
    var d = new global.Uint8Array(buffer);
    var e = new global.Uint16Array(buffer);
    var f = new global.Uint32Array(buffer);
    var g = new global.Float32Array(buffer);
    var h = new global.Float64Array(buffer);
    var i = env.DYNAMICTOP_PTR | 0;
    var j = env.tempDoublePtr | 0;
    var k = env.ABORT | 0;
    var l = env.STACKTOP | 0;
    var m = env.STACK_MAX | 0;
    var n = env.cttz_i8 | 0;
    var o = env.___dso_handle | 0;
    var p = 0;
    var q = 0;
    var r = 0;
    var s = 0;
    var t = global.NaN, u = global.Infinity;
    var v = 0, w = 0, x = 0, y = 0, z = 0.0;
    var A = 0;
    var B = global.Math.floor;
    var C = global.Math.abs;
    var D = global.Math.sqrt;
    var E = global.Math.pow;
    var F = global.Math.cos;
    var G = global.Math.sin;
    var H = global.Math.tan;
    var I = global.Math.acos;
    var J = global.Math.asin;
    var K = global.Math.atan;
    var L = global.Math.atan2;
    var M = global.Math.exp;
    var N = global.Math.log;
    var O = global.Math.ceil;
    var P = global.Math.imul;
    var Q = global.Math.min;
    var R = global.Math.max;
    var S = global.Math.clz32;
    var T = global.Math.fround;
    var U = env.abort;
    var V = env.assert;
    var W = env.enlargeMemory;
    var X = env.getTotalMemory;
    var Y = env.abortOnCannotGrowMemory;
    var Z = env.invoke_viiiii;
    var _ = env.invoke_vif;
    var $ = env.invoke_vid;
    var aa = env.invoke_fiff;
    var ba = env.invoke_vi;
    var ca = env.invoke_vii;
    var da = env.invoke_ii;
    var ea = env.invoke_viddi;
    var fa = env.invoke_vidd;
    var ga = env.invoke_iiii;
    var ha = env.invoke_diii;
    var ia = env.invoke_di;
    var ja = env.invoke_iid;
    var ka = env.invoke_iii;
    var la = env.invoke_viiddi;
    var ma = env.invoke_viiiiii;
    var na = env.invoke_dii;
    var oa = env.invoke_i;
    var pa = env.invoke_iiiiii;
    var qa = env.invoke_viiid;
    var ra = env.invoke_viififi;
    var sa = env.invoke_viii;
    var ta = env.invoke_v;
    var ua = env.invoke_viid;
    var va = env.invoke_idd;
    var wa = env.invoke_viiii;
    var xa = env._emscripten_asm_const_iiiii;
    var ya = env._emscripten_asm_const_iiidddddd;
    var za = env._emscripten_asm_const_iiiid;
    var Aa = env.__nbind_reference_external;
    var Ba = env._emscripten_asm_const_iiiiiiii;
    var Ca = env._removeAccessorPrefix;
    var Da = env._typeModule;
    var Ea = env.__nbind_register_pool;
    var Fa = env.__decorate;
    var Ga = env._llvm_stackrestore;
    var Ha = env.___cxa_atexit;
    var Ia = env.__extends;
    var Ja = env.__nbind_get_value_object;
    var Ka = env.__ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj;
    var La = env._emscripten_set_main_loop_timing;
    var Ma = env.__nbind_register_primitive;
    var Na = env.__nbind_register_type;
    var Oa = env._emscripten_memcpy_big;
    var Pa = env.__nbind_register_function;
    var Qa = env.___setErrNo;
    var Ra = env.__nbind_register_class;
    var Sa = env.__nbind_finish;
    var Ta = env._abort;
    var Ua = env._nbind_value;
    var Va = env._llvm_stacksave;
    var Wa = env.___syscall54;
    var Xa = env._defineHidden;
    var Ya = env._emscripten_set_main_loop;
    var Za = env._emscripten_get_now;
    var _a = env.__nbind_register_callback_signature;
    var $a = env._emscripten_asm_const_iiiiii;
    var ab = env.__nbind_free_external;
    var bb = env._emscripten_asm_const_iiii;
    var cb = env._emscripten_asm_const_iiididi;
    var db = env.___syscall6;
    var eb = env._atexit;
    var fb = env.___syscall140;
    var gb = env.___syscall146;
    var hb = T(0);
    const ib = T(0);
    // EMSCRIPTEN_START_FUNCS
    function Jb(a) {
        a = a | 0;
        var b = 0;
        b = l;
        l = l + a | 0;
        l = l + 15 & -16;
        return b | 0;
    }
    function Kb() {
        return l | 0;
    }
    function Lb(a) {
        a = a | 0;
        l = a;
    }
    function Mb(a, b) {
        a = a | 0;
        b = b | 0;
        l = a;
        m = b;
    }
    function Nb(a, b) {
        a = a | 0;
        b = b | 0;
        if (!p) {
            p = a;
            q = b;
        }
    }
    function Ob(a) {
        a = a | 0;
        A = a;
    }
    function Pb() {
        return A | 0;
    }
    function Qb() {
        var b = 0, d = 0;
        BC(8104, 8, 400);
        BC(8504, 408, 540);
        b = 9044;
        d = b + 44 | 0;
        do {
            c[b >> 2] = 0;
            b = b + 4 | 0;
        }while ((b | 0) < (d | 0))
        a[9088] = 0;
        a[9089] = 1;
        c[2273] = 0;
        c[2274] = 948;
        c[2275] = 948;
        Ha(17, 8104, o | 0);
        return;
    }
    function Rb(a) {
        a = a | 0;
        oc(a + 948 | 0);
        return;
    }
    function Sb(a) {
        a = T(a);
        return ((af(a) | 0) & 2147483647) >>> 0 > 2139095040 | 0;
    }
    function Tb(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        a: do if (!(c[a + (b << 3) + 4 >> 2] | 0)) {
            if ((b | 2) == 3 ? c[a + 60 >> 2] | 0 : 0) {
                a = a + 56 | 0;
                break;
            }
            switch(b | 0){
                case 0:
                case 2:
                case 4:
                case 5:
                    if (c[a + 52 >> 2] | 0) {
                        a = a + 48 | 0;
                        break a;
                    }
                    break;
                default:
            }
            if (!(c[a + 68 >> 2] | 0)) {
                a = (b | 1) == 5 ? 948 : d;
                break;
            } else {
                a = a + 64 | 0;
                break;
            }
        } else a = a + (b << 3) | 0;
        while (0)
        return a | 0;
    }
    function Ub(b) {
        b = b | 0;
        var d = 0;
        d = oB(1e3) | 0;
        Vb(b, (d | 0) != 0, 2456);
        c[2276] = (c[2276] | 0) + 1;
        BC(d | 0, 8104, 1e3);
        if (a[b + 2 >> 0] | 0) {
            c[d + 4 >> 2] = 2;
            c[d + 12 >> 2] = 4;
        }
        c[d + 976 >> 2] = b;
        return d | 0;
    }
    function Vb(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0;
        f = l;
        l = l + 16 | 0;
        e = f;
        if (!b) {
            c[e >> 2] = d;
            fe(a, 5, 3197, e);
        }
        l = f;
        return;
    }
    function Wb() {
        return Ub(956) | 0;
    }
    function Xb(a) {
        a = a | 0;
        var b = 0;
        b = qC(1e3) | 0;
        Yb(b, a);
        Vb(c[a + 976 >> 2] | 0, 1, 2456);
        c[2276] = (c[2276] | 0) + 1;
        c[b + 944 >> 2] = 0;
        return b | 0;
    }
    function Yb(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        BC(a | 0, b | 0, 948);
        ie(a + 948 | 0, b + 948 | 0);
        d = a + 960 | 0;
        a = b + 960 | 0;
        b = d + 40 | 0;
        do {
            c[d >> 2] = c[a >> 2];
            d = d + 4 | 0;
            a = a + 4 | 0;
        }while ((d | 0) < (b | 0))
        return;
    }
    function Zb(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0;
        b = a + 944 | 0;
        d = c[b >> 2] | 0;
        if (d | 0) {
            _b(d + 948 | 0, a);
            c[b >> 2] = 0;
        }
        d = $b(a) | 0;
        if (d | 0) {
            b = 0;
            do {
                c[(ac(a, b) | 0) + 944 >> 2] = 0;
                b = b + 1 | 0;
            }while ((b | 0) != (d | 0))
        }
        d = a + 948 | 0;
        e = c[d >> 2] | 0;
        f = a + 952 | 0;
        b = c[f >> 2] | 0;
        if ((b | 0) != (e | 0)) c[f >> 2] = b + (~((b + -4 - e | 0) >>> 2) << 2);
        bc(d);
        pB(a);
        c[2276] = (c[2276] | 0) + -1;
        return;
    }
    function _b(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0;
        e = c[a >> 2] | 0;
        i = a + 4 | 0;
        d = c[i >> 2] | 0;
        g = d;
        a: do if ((e | 0) == (d | 0)) {
            f = e;
            h = 4;
        } else {
            a = e;
            while(true){
                if ((c[a >> 2] | 0) == (b | 0)) {
                    f = a;
                    h = 4;
                    break a;
                }
                a = a + 4 | 0;
                if ((a | 0) == (d | 0)) {
                    a = 0;
                    break;
                }
            }
        }
        while (0)
        if ((h | 0) == 4) {
            if ((f | 0) != (d | 0)) {
                e = f + 4 | 0;
                a = g - e | 0;
                b = a >> 2;
                if (b) {
                    GC(f | 0, e | 0, a | 0);
                    d = c[i >> 2] | 0;
                }
                a = f + (b << 2) | 0;
                if ((d | 0) == (a | 0)) a = 1;
                else {
                    c[i >> 2] = d + (~((d + -4 - a | 0) >>> 2) << 2);
                    a = 1;
                }
            } else a = 0;
        }
        return a | 0;
    }
    function $b(a) {
        a = a | 0;
        return (c[a + 952 >> 2] | 0) - (c[a + 948 >> 2] | 0) >> 2 | 0;
    }
    function ac(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = c[a + 948 >> 2] | 0;
        if ((c[a + 952 >> 2] | 0) - d >> 2 >>> 0 > b >>> 0) a = c[d + (b << 2) >> 2] | 0;
        else a = 0;
        return a | 0;
    }
    function bc(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0;
        e = l;
        l = l + 32 | 0;
        b = e;
        f = c[a >> 2] | 0;
        d = (c[a + 4 >> 2] | 0) - f | 0;
        if (((c[a + 8 >> 2] | 0) - f | 0) >>> 0 > d >>> 0) {
            f = d >> 2;
            bf(b, f, f, a + 8 | 0);
            cf(a, b);
            df(b);
        }
        l = e;
        return;
    }
    function cc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0;
        k = $b(a) | 0;
        do if (k | 0) {
            if ((c[(ac(a, 0) | 0) + 944 >> 2] | 0) == (a | 0)) {
                if (!(_b(a + 948 | 0, b) | 0)) break;
                BC(b + 400 | 0, 8504, 540);
                c[b + 944 >> 2] = 0;
                nc(a);
                break;
            }
            h = c[(c[a + 976 >> 2] | 0) + 12 >> 2] | 0;
            i = a + 948 | 0;
            j = (h | 0) == 0;
            d = 0;
            g = 0;
            do {
                e = c[(c[i >> 2] | 0) + (g << 2) >> 2] | 0;
                if ((e | 0) == (b | 0)) nc(a);
                else {
                    f = Xb(e) | 0;
                    c[(c[i >> 2] | 0) + (d << 2) >> 2] = f;
                    c[f + 944 >> 2] = a;
                    if (!j) Ib[h & 15](e, f, a, d);
                    d = d + 1 | 0;
                }
                g = g + 1 | 0;
            }while ((g | 0) != (k | 0))
            if (d >>> 0 < k >>> 0) {
                j = a + 948 | 0;
                i = a + 952 | 0;
                h = d;
                d = c[i >> 2] | 0;
                do {
                    g = (c[j >> 2] | 0) + (h << 2) | 0;
                    e = g + 4 | 0;
                    f = d - e | 0;
                    b = f >> 2;
                    if (!b) f = d;
                    else {
                        GC(g | 0, e | 0, f | 0);
                        d = c[i >> 2] | 0;
                        f = d;
                    }
                    e = g + (b << 2) | 0;
                    if ((f | 0) != (e | 0)) {
                        d = f + (~((f + -4 - e | 0) >>> 2) << 2) | 0;
                        c[i >> 2] = d;
                    }
                    h = h + 1 | 0;
                }while ((h | 0) != (k | 0))
            }
        }
        while (0)
        return;
    }
    function dc(b) {
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0;
        ec(b, ($b(b) | 0) == 0, 2491);
        ec(b, (c[b + 944 >> 2] | 0) == 0, 2545);
        d = b + 948 | 0;
        e = c[d >> 2] | 0;
        f = b + 952 | 0;
        g = c[f >> 2] | 0;
        if ((g | 0) != (e | 0)) c[f >> 2] = g + (~((g + -4 - e | 0) >>> 2) << 2);
        bc(d);
        d = b + 976 | 0;
        e = c[d >> 2] | 0;
        BC(b | 0, 8104, 1e3);
        if (a[e + 2 >> 0] | 0) {
            c[b + 4 >> 2] = 2;
            c[b + 12 >> 2] = 4;
        }
        c[d >> 2] = e;
        return;
    }
    function ec(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0;
        f = l;
        l = l + 16 | 0;
        e = f;
        if (!b) {
            c[e >> 2] = d;
            Vd(a, 5, 3197, e);
        }
        l = f;
        return;
    }
    function fc() {
        return c[2276] | 0;
    }
    function gc() {
        var a = 0;
        a = oB(20) | 0;
        hc((a | 0) != 0, 2592);
        c[2277] = (c[2277] | 0) + 1;
        c[a >> 2] = c[239];
        c[a + 4 >> 2] = c[240];
        c[a + 8 >> 2] = c[241];
        c[a + 12 >> 2] = c[242];
        c[a + 16 >> 2] = c[243];
        return a | 0;
    }
    function hc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        e = l;
        l = l + 16 | 0;
        d = e;
        if (!a) {
            c[d >> 2] = b;
            Vd(0, 5, 3197, d);
        }
        l = e;
        return;
    }
    function ic(a) {
        a = a | 0;
        pB(a);
        c[2277] = (c[2277] | 0) + -1;
        return;
    }
    function jc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        if (!b) {
            d = 0;
            b = 0;
        } else {
            ec(a, ($b(a) | 0) == 0, 2629);
            d = 1;
        }
        c[a + 964 >> 2] = b;
        c[a + 988 >> 2] = d;
        return;
    }
    function kc(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        g = e + 8 | 0;
        f = e + 4 | 0;
        h = e;
        c[f >> 2] = b;
        ec(a, (c[b + 944 >> 2] | 0) == 0, 2709);
        ec(a, (c[a + 964 >> 2] | 0) == 0, 2763);
        lc(a);
        b = a + 948 | 0;
        c[h >> 2] = (c[b >> 2] | 0) + (d << 2);
        c[g >> 2] = c[h >> 2];
        mc(b, g, f);
        c[(c[f >> 2] | 0) + 944 >> 2] = a;
        nc(a);
        l = e;
        return;
    }
    function lc(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0;
        d = $b(a) | 0;
        if (d | 0 ? (c[(ac(a, 0) | 0) + 944 >> 2] | 0) != (a | 0) : 0) {
            e = c[(c[a + 976 >> 2] | 0) + 12 >> 2] | 0;
            f = a + 948 | 0;
            g = (e | 0) == 0;
            b = 0;
            do {
                h = c[(c[f >> 2] | 0) + (b << 2) >> 2] | 0;
                i = Xb(h) | 0;
                c[(c[f >> 2] | 0) + (b << 2) >> 2] = i;
                c[i + 944 >> 2] = a;
                if (!g) Ib[e & 15](h, i, a, b);
                b = b + 1 | 0;
            }while ((b | 0) != (d | 0))
        }
        return;
    }
    function mc(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0;
        s = l;
        l = l + 64 | 0;
        n = s + 52 | 0;
        i = s + 48 | 0;
        o = s + 28 | 0;
        p = s + 24 | 0;
        q = s + 20 | 0;
        r = s;
        e = c[a >> 2] | 0;
        g = e;
        b = e + ((c[b >> 2] | 0) - g >> 2 << 2) | 0;
        e = a + 4 | 0;
        f = c[e >> 2] | 0;
        h = a + 8 | 0;
        do if (f >>> 0 < (c[h >> 2] | 0) >>> 0) {
            if ((b | 0) == (f | 0)) {
                c[b >> 2] = c[d >> 2];
                c[e >> 2] = (c[e >> 2] | 0) + 4;
                break;
            }
            ef(a, b, f, b + 4 | 0);
            if (b >>> 0 <= d >>> 0) d = (c[e >> 2] | 0) >>> 0 > d >>> 0 ? d + 4 | 0 : d;
            c[b >> 2] = c[d >> 2];
        } else {
            e = (f - g >> 2) + 1 | 0;
            f = le(a) | 0;
            if (f >>> 0 < e >>> 0) jC(a);
            m = c[a >> 2] | 0;
            k = (c[h >> 2] | 0) - m | 0;
            g = k >> 1;
            bf(r, k >> 2 >>> 0 < f >>> 1 >>> 0 ? g >>> 0 < e >>> 0 ? e : g : f, b - m >> 2, a + 8 | 0);
            m = r + 8 | 0;
            e = c[m >> 2] | 0;
            g = r + 12 | 0;
            k = c[g >> 2] | 0;
            h = k;
            j = e;
            do if ((e | 0) == (k | 0)) {
                k = r + 4 | 0;
                e = c[k >> 2] | 0;
                t = c[r >> 2] | 0;
                f = t;
                if (e >>> 0 <= t >>> 0) {
                    e = h - f >> 1;
                    e = (e | 0) == 0 ? 1 : e;
                    bf(o, e, e >>> 2, c[r + 16 >> 2] | 0);
                    c[p >> 2] = c[k >> 2];
                    c[q >> 2] = c[m >> 2];
                    c[i >> 2] = c[p >> 2];
                    c[n >> 2] = c[q >> 2];
                    gf(o, i, n);
                    e = c[r >> 2] | 0;
                    c[r >> 2] = c[o >> 2];
                    c[o >> 2] = e;
                    e = o + 4 | 0;
                    t = c[k >> 2] | 0;
                    c[k >> 2] = c[e >> 2];
                    c[e >> 2] = t;
                    e = o + 8 | 0;
                    t = c[m >> 2] | 0;
                    c[m >> 2] = c[e >> 2];
                    c[e >> 2] = t;
                    e = o + 12 | 0;
                    t = c[g >> 2] | 0;
                    c[g >> 2] = c[e >> 2];
                    c[e >> 2] = t;
                    df(o);
                    e = c[m >> 2] | 0;
                    break;
                }
                g = e;
                h = ((g - f >> 2) + 1 | 0) / -2 | 0;
                i = e + (h << 2) | 0;
                f = j - g | 0;
                g = f >> 2;
                if (g) {
                    GC(i | 0, e | 0, f | 0);
                    e = c[k >> 2] | 0;
                }
                t = i + (g << 2) | 0;
                c[m >> 2] = t;
                c[k >> 2] = e + (h << 2);
                e = t;
            }
            while (0)
            c[e >> 2] = c[d >> 2];
            c[m >> 2] = (c[m >> 2] | 0) + 4;
            b = ff(a, r, b) | 0;
            df(r);
        }
        while (0)
        l = s;
        return b | 0;
    }
    function nc(b) {
        b = b | 0;
        var d = 0;
        do {
            d = b + 984 | 0;
            if (a[d >> 0] | 0) break;
            a[d >> 0] = 1;
            g[b + 504 >> 2] = T(t);
            b = c[b + 944 >> 2] | 0;
        }while ((b | 0) != 0)
        return;
    }
    function oc(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -4 - e | 0) >>> 2) << 2);
            sC(d);
        }
        return;
    }
    function pc(a) {
        a = a | 0;
        return c[a + 944 >> 2] | 0;
    }
    function qc(a) {
        a = a | 0;
        ec(a, (c[a + 964 >> 2] | 0) != 0, 2832);
        nc(a);
        return;
    }
    function rc(b) {
        b = b | 0;
        return (a[b + 984 >> 0] | 0) != 0 | 0;
    }
    function sc(a, b) {
        a = a | 0;
        b = b | 0;
        if (BB(a, b, 400) | 0) {
            BC(a | 0, b | 0, 400);
            nc(a);
        }
        return;
    }
    function tc(a) {
        a = a | 0;
        var b = ib;
        b = T(g[a + 44 >> 2]);
        a = Sb(b) | 0;
        return T(a ? T(0.0) : b);
    }
    function uc(b) {
        b = b | 0;
        var d = ib;
        d = T(g[b + 48 >> 2]);
        if (Sb(d) | 0) d = a[(c[b + 976 >> 2] | 0) + 2 >> 0] | 0 ? T(1.0) : T(0.0);
        return T(d);
    }
    function vc(a, b) {
        a = a | 0;
        b = b | 0;
        c[a + 980 >> 2] = b;
        return;
    }
    function wc(a) {
        a = a | 0;
        return c[a + 980 >> 2] | 0;
    }
    function xc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 4 | 0;
        if ((c[d >> 2] | 0) != (b | 0)) {
            c[d >> 2] = b;
            nc(a);
        }
        return;
    }
    function yc(a) {
        a = a | 0;
        return c[a + 4 >> 2] | 0;
    }
    function zc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 8 | 0;
        if ((c[d >> 2] | 0) != (b | 0)) {
            c[d >> 2] = b;
            nc(a);
        }
        return;
    }
    function Ac(a) {
        a = a | 0;
        return c[a + 8 >> 2] | 0;
    }
    function Bc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 12 | 0;
        if ((c[d >> 2] | 0) != (b | 0)) {
            c[d >> 2] = b;
            nc(a);
        }
        return;
    }
    function Cc(a) {
        a = a | 0;
        return c[a + 12 >> 2] | 0;
    }
    function Dc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 16 | 0;
        if ((c[d >> 2] | 0) != (b | 0)) {
            c[d >> 2] = b;
            nc(a);
        }
        return;
    }
    function Ec(a) {
        a = a | 0;
        return c[a + 16 >> 2] | 0;
    }
    function Fc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 20 | 0;
        if ((c[d >> 2] | 0) != (b | 0)) {
            c[d >> 2] = b;
            nc(a);
        }
        return;
    }
    function Gc(a) {
        a = a | 0;
        return c[a + 20 >> 2] | 0;
    }
    function Hc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 24 | 0;
        if ((c[d >> 2] | 0) != (b | 0)) {
            c[d >> 2] = b;
            nc(a);
        }
        return;
    }
    function Ic(a) {
        a = a | 0;
        return c[a + 24 >> 2] | 0;
    }
    function Jc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 28 | 0;
        if ((c[d >> 2] | 0) != (b | 0)) {
            c[d >> 2] = b;
            nc(a);
        }
        return;
    }
    function Kc(a) {
        a = a | 0;
        return c[a + 28 >> 2] | 0;
    }
    function Lc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 32 | 0;
        if ((c[d >> 2] | 0) != (b | 0)) {
            c[d >> 2] = b;
            nc(a);
        }
        return;
    }
    function Mc(a) {
        a = a | 0;
        return c[a + 32 >> 2] | 0;
    }
    function Nc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 36 | 0;
        if ((c[d >> 2] | 0) != (b | 0)) {
            c[d >> 2] = b;
            nc(a);
        }
        return;
    }
    function Oc(a) {
        a = a | 0;
        return c[a + 36 >> 2] | 0;
    }
    function Pc(a, b) {
        a = a | 0;
        b = T(b);
        var c = 0;
        c = a + 40 | 0;
        if (T(g[c >> 2]) != b) {
            g[c >> 2] = b;
            nc(a);
        }
        return;
    }
    function Qc(a, b) {
        a = a | 0;
        b = T(b);
        var c = 0;
        c = a + 44 | 0;
        if (T(g[c >> 2]) != b) {
            g[c >> 2] = b;
            nc(a);
        }
        return;
    }
    function Rc(a, b) {
        a = a | 0;
        b = T(b);
        var c = 0;
        c = a + 48 | 0;
        if (T(g[c >> 2]) != b) {
            g[c >> 2] = b;
            nc(a);
        }
        return;
    }
    function Sc(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = (h ^ 1) & 1;
        e = a + 52 | 0;
        f = a + 56 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function Tc(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0;
        e = a + 52 | 0;
        d = a + 56 | 0;
        if (!(!(T(g[e >> 2]) != b) ? (c[d >> 2] | 0) == 2 : 0)) {
            g[e >> 2] = b;
            e = Sb(b) | 0;
            c[d >> 2] = e ? 3 : 2;
            nc(a);
        }
        return;
    }
    function Uc(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        e = b + 52 | 0;
        d = c[e + 4 >> 2] | 0;
        b = a;
        c[b >> 2] = c[e >> 2];
        c[b + 4 >> 2] = d;
        return;
    }
    function Vc(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0, f = 0, h = 0;
        h = Sb(d) | 0;
        e = (h ^ 1) & 1;
        f = a + 132 + (b << 3) | 0;
        b = a + 132 + (b << 3) + 4 | 0;
        if (!(h | T(g[f >> 2]) == d ? (c[b >> 2] | 0) == (e | 0) : 0)) {
            g[f >> 2] = d;
            c[b >> 2] = e;
            nc(a);
        }
        return;
    }
    function Wc(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0, f = 0, h = 0;
        h = Sb(d) | 0;
        e = h ? 0 : 2;
        f = a + 132 + (b << 3) | 0;
        b = a + 132 + (b << 3) + 4 | 0;
        if (!(h | T(g[f >> 2]) == d ? (c[b >> 2] | 0) == (e | 0) : 0)) {
            g[f >> 2] = d;
            c[b >> 2] = e;
            nc(a);
        }
        return;
    }
    function Xc(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = b + 132 + (d << 3) | 0;
        b = c[e + 4 >> 2] | 0;
        d = a;
        c[d >> 2] = c[e >> 2];
        c[d + 4 >> 2] = b;
        return;
    }
    function Yc(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0, f = 0, h = 0;
        h = Sb(d) | 0;
        e = (h ^ 1) & 1;
        f = a + 60 + (b << 3) | 0;
        b = a + 60 + (b << 3) + 4 | 0;
        if (!(h | T(g[f >> 2]) == d ? (c[b >> 2] | 0) == (e | 0) : 0)) {
            g[f >> 2] = d;
            c[b >> 2] = e;
            nc(a);
        }
        return;
    }
    function Zc(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0, f = 0, h = 0;
        h = Sb(d) | 0;
        e = h ? 0 : 2;
        f = a + 60 + (b << 3) | 0;
        b = a + 60 + (b << 3) + 4 | 0;
        if (!(h | T(g[f >> 2]) == d ? (c[b >> 2] | 0) == (e | 0) : 0)) {
            g[f >> 2] = d;
            c[b >> 2] = e;
            nc(a);
        }
        return;
    }
    function _c(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = b + 60 + (d << 3) | 0;
        b = c[e + 4 >> 2] | 0;
        d = a;
        c[d >> 2] = c[e >> 2];
        c[d + 4 >> 2] = b;
        return;
    }
    function $c(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = a + 60 + (b << 3) + 4 | 0;
        if ((c[d >> 2] | 0) != 3) {
            g[a + 60 + (b << 3) >> 2] = T(t);
            c[d >> 2] = 3;
            nc(a);
        }
        return;
    }
    function ad(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0, f = 0, h = 0;
        h = Sb(d) | 0;
        e = (h ^ 1) & 1;
        f = a + 204 + (b << 3) | 0;
        b = a + 204 + (b << 3) + 4 | 0;
        if (!(h | T(g[f >> 2]) == d ? (c[b >> 2] | 0) == (e | 0) : 0)) {
            g[f >> 2] = d;
            c[b >> 2] = e;
            nc(a);
        }
        return;
    }
    function bd(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0, f = 0, h = 0;
        h = Sb(d) | 0;
        e = h ? 0 : 2;
        f = a + 204 + (b << 3) | 0;
        b = a + 204 + (b << 3) + 4 | 0;
        if (!(h | T(g[f >> 2]) == d ? (c[b >> 2] | 0) == (e | 0) : 0)) {
            g[f >> 2] = d;
            c[b >> 2] = e;
            nc(a);
        }
        return;
    }
    function cd(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = b + 204 + (d << 3) | 0;
        b = c[e + 4 >> 2] | 0;
        d = a;
        c[d >> 2] = c[e >> 2];
        c[d + 4 >> 2] = b;
        return;
    }
    function dd(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0, f = 0, h = 0;
        h = Sb(d) | 0;
        e = (h ^ 1) & 1;
        f = a + 276 + (b << 3) | 0;
        b = a + 276 + (b << 3) + 4 | 0;
        if (!(h | T(g[f >> 2]) == d ? (c[b >> 2] | 0) == (e | 0) : 0)) {
            g[f >> 2] = d;
            c[b >> 2] = e;
            nc(a);
        }
        return;
    }
    function ed(a, b) {
        a = a | 0;
        b = b | 0;
        return T(g[a + 276 + (b << 3) >> 2]);
    }
    function fd(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = (h ^ 1) & 1;
        e = a + 348 | 0;
        f = a + 352 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function gd(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0;
        e = a + 348 | 0;
        d = a + 352 | 0;
        if (!(!(T(g[e >> 2]) != b) ? (c[d >> 2] | 0) == 2 : 0)) {
            g[e >> 2] = b;
            e = Sb(b) | 0;
            c[d >> 2] = e ? 3 : 2;
            nc(a);
        }
        return;
    }
    function hd(a) {
        a = a | 0;
        var b = 0;
        b = a + 352 | 0;
        if ((c[b >> 2] | 0) != 3) {
            g[a + 348 >> 2] = T(t);
            c[b >> 2] = 3;
            nc(a);
        }
        return;
    }
    function id(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        e = b + 348 | 0;
        d = c[e + 4 >> 2] | 0;
        b = a;
        c[b >> 2] = c[e >> 2];
        c[b + 4 >> 2] = d;
        return;
    }
    function jd(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = (h ^ 1) & 1;
        e = a + 356 | 0;
        f = a + 360 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function kd(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0;
        e = a + 356 | 0;
        d = a + 360 | 0;
        if (!(!(T(g[e >> 2]) != b) ? (c[d >> 2] | 0) == 2 : 0)) {
            g[e >> 2] = b;
            e = Sb(b) | 0;
            c[d >> 2] = e ? 3 : 2;
            nc(a);
        }
        return;
    }
    function ld(a) {
        a = a | 0;
        var b = 0;
        b = a + 360 | 0;
        if ((c[b >> 2] | 0) != 3) {
            g[a + 356 >> 2] = T(t);
            c[b >> 2] = 3;
            nc(a);
        }
        return;
    }
    function md(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        e = b + 356 | 0;
        d = c[e + 4 >> 2] | 0;
        b = a;
        c[b >> 2] = c[e >> 2];
        c[b + 4 >> 2] = d;
        return;
    }
    function nd(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = (h ^ 1) & 1;
        e = a + 364 | 0;
        f = a + 368 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function od(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = h ? 0 : 2;
        e = a + 364 | 0;
        f = a + 368 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function pd(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        e = b + 364 | 0;
        d = c[e + 4 >> 2] | 0;
        b = a;
        c[b >> 2] = c[e >> 2];
        c[b + 4 >> 2] = d;
        return;
    }
    function qd(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = (h ^ 1) & 1;
        e = a + 372 | 0;
        f = a + 376 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function rd(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = h ? 0 : 2;
        e = a + 372 | 0;
        f = a + 376 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function sd(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        e = b + 372 | 0;
        d = c[e + 4 >> 2] | 0;
        b = a;
        c[b >> 2] = c[e >> 2];
        c[b + 4 >> 2] = d;
        return;
    }
    function td(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = (h ^ 1) & 1;
        e = a + 380 | 0;
        f = a + 384 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function ud(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = h ? 0 : 2;
        e = a + 380 | 0;
        f = a + 384 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function vd(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        e = b + 380 | 0;
        d = c[e + 4 >> 2] | 0;
        b = a;
        c[b >> 2] = c[e >> 2];
        c[b + 4 >> 2] = d;
        return;
    }
    function wd(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = (h ^ 1) & 1;
        e = a + 388 | 0;
        f = a + 392 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function xd(a, b) {
        a = a | 0;
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0;
        h = Sb(b) | 0;
        d = h ? 0 : 2;
        e = a + 388 | 0;
        f = a + 392 | 0;
        if (!(h | T(g[e >> 2]) == b ? (c[f >> 2] | 0) == (d | 0) : 0)) {
            g[e >> 2] = b;
            c[f >> 2] = d;
            nc(a);
        }
        return;
    }
    function yd(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        e = b + 388 | 0;
        d = c[e + 4 >> 2] | 0;
        b = a;
        c[b >> 2] = c[e >> 2];
        c[b + 4 >> 2] = d;
        return;
    }
    function zd(a, b) {
        a = a | 0;
        b = T(b);
        var c = 0;
        c = a + 396 | 0;
        if (T(g[c >> 2]) != b) {
            g[c >> 2] = b;
            nc(a);
        }
        return;
    }
    function Ad(a) {
        a = a | 0;
        return T(g[a + 396 >> 2]);
    }
    function Bd(a) {
        a = a | 0;
        return T(g[a + 400 >> 2]);
    }
    function Cd(a) {
        a = a | 0;
        return T(g[a + 404 >> 2]);
    }
    function Dd(a) {
        a = a | 0;
        return T(g[a + 408 >> 2]);
    }
    function Ed(a) {
        a = a | 0;
        return T(g[a + 412 >> 2]);
    }
    function Fd(a) {
        a = a | 0;
        return T(g[a + 416 >> 2]);
    }
    function Gd(a) {
        a = a | 0;
        return T(g[a + 420 >> 2]);
    }
    function Hd(a, b) {
        a = a | 0;
        b = b | 0;
        ec(a, (b | 0) < 6, 2918);
        switch(b | 0){
            case 0:
                b = (c[a + 496 >> 2] | 0) == 2 ? 5 : 4;
                break;
            case 2:
                b = (c[a + 496 >> 2] | 0) == 2 ? 4 : 5;
                break;
            default:
        }
        return T(g[a + 424 + (b << 2) >> 2]);
    }
    function Id(a, b) {
        a = a | 0;
        b = b | 0;
        ec(a, (b | 0) < 6, 2918);
        switch(b | 0){
            case 0:
                b = (c[a + 496 >> 2] | 0) == 2 ? 5 : 4;
                break;
            case 2:
                b = (c[a + 496 >> 2] | 0) == 2 ? 4 : 5;
                break;
            default:
        }
        return T(g[a + 448 + (b << 2) >> 2]);
    }
    function Jd(a, b) {
        a = a | 0;
        b = b | 0;
        ec(a, (b | 0) < 6, 2918);
        switch(b | 0){
            case 0:
                b = (c[a + 496 >> 2] | 0) == 2 ? 5 : 4;
                break;
            case 2:
                b = (c[a + 496 >> 2] | 0) == 2 ? 4 : 5;
                break;
            default:
        }
        return T(g[a + 472 + (b << 2) >> 2]);
    }
    function Kd(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = ib;
        d = c[a + 4 >> 2] | 0;
        if ((d | 0) == (c[b + 4 >> 2] | 0)) {
            if (!d) a = 1;
            else {
                e = T(g[a >> 2]);
                a = T(C(T(e - T(g[b >> 2])))) < T(0.0000999999974);
            }
        } else a = 0;
        return a | 0;
    }
    function Ld(a, b) {
        a = T(a);
        b = T(b);
        var c = 0;
        if (Sb(a) | 0) c = Sb(b) | 0;
        else c = T(C(T(a - b))) < T(0.0000999999974);
        return c | 0;
    }
    function Md(a, b) {
        a = a | 0;
        b = b | 0;
        Nd(a, b);
        return;
    }
    function Nd(b, d) {
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 4 | 0;
        c[f >> 2] = 0;
        c[f + 4 >> 2] = 0;
        c[f + 8 >> 2] = 0;
        Ka(f | 0, b | 0, d | 0, 0);
        Vd(b, 3, (a[f + 11 >> 0] | 0) < 0 ? c[f >> 2] | 0 : f, e);
        tC(f);
        l = e;
        return;
    }
    function Od(a, b, c, d) {
        a = T(a);
        b = T(b);
        c = c | 0;
        d = d | 0;
        var e = ib;
        a = T(a * b);
        e = T(gC(a, T(1.0)));
        do if (!(Ld(e, T(0.0)) | 0)) {
            a = T(a - e);
            if (Ld(e, T(1.0)) | 0) {
                a = T(a + T(1.0));
                break;
            }
            if (c) {
                a = T(a + T(1.0));
                break;
            }
            if (!d) {
                if (e > T(0.5)) e = T(1.0);
                else {
                    d = Ld(e, T(0.5)) | 0;
                    e = d ? T(1.0) : T(0.0);
                }
                a = T(a + e);
            }
        } else a = T(a - e);
        while (0)
        return T(a / b);
    }
    function Pd(a, b, c, d, e, f, h, i, j, k, l, m, n) {
        a = a | 0;
        b = T(b);
        c = c | 0;
        d = T(d);
        e = e | 0;
        f = T(f);
        h = h | 0;
        i = T(i);
        j = T(j);
        k = T(k);
        l = T(l);
        m = T(m);
        n = n | 0;
        var o = 0, p = ib, q = ib, r = ib, s = ib, t = ib, u = ib;
        if (j < T(0.0) | k < T(0.0)) n = 0;
        else {
            if ((n | 0) != 0 ? (p = T(g[n + 4 >> 2]), p != T(0.0)) : 0) {
                r = T(Od(b, p, 0, 0));
                s = T(Od(d, p, 0, 0));
                q = T(Od(f, p, 0, 0));
                p = T(Od(i, p, 0, 0));
            } else {
                q = f;
                r = b;
                p = i;
                s = d;
            }
            if ((e | 0) == (a | 0)) o = Ld(q, r) | 0;
            else o = 0;
            if ((h | 0) == (c | 0)) n = Ld(p, s) | 0;
            else n = 0;
            if ((!o ? (t = T(b - l), !(Qd(a, t, j) | 0)) : 0) ? !(Rd(a, t, e, j) | 0) : 0) o = Sd(a, t, e, f, j) | 0;
            else o = 1;
            if ((!n ? (u = T(d - m), !(Qd(c, u, k) | 0)) : 0) ? !(Rd(c, u, h, k) | 0) : 0) n = Sd(c, u, h, i, k) | 0;
            else n = 1;
            n = o & n;
        }
        return n | 0;
    }
    function Qd(a, b, c) {
        a = a | 0;
        b = T(b);
        c = T(c);
        if ((a | 0) == 1) a = Ld(b, c) | 0;
        else a = 0;
        return a | 0;
    }
    function Rd(a, b, c, d) {
        a = a | 0;
        b = T(b);
        c = c | 0;
        d = T(d);
        if ((a | 0) == 2 & (c | 0) == 0) {
            if (!(b >= d)) a = Ld(b, d) | 0;
            else a = 1;
        } else a = 0;
        return a | 0;
    }
    function Sd(a, b, c, d, e) {
        a = a | 0;
        b = T(b);
        c = c | 0;
        d = T(d);
        e = T(e);
        if ((a | 0) == 2 & (c | 0) == 2 & d > b) {
            if (!(e <= b)) a = Ld(b, e) | 0;
            else a = 1;
        } else a = 0;
        return a | 0;
    }
    function Td(b, d, e, f, i, j, k, m, n, o, p) {
        b = b | 0;
        d = T(d);
        e = T(e);
        f = f | 0;
        i = i | 0;
        j = j | 0;
        k = T(k);
        m = T(m);
        n = n | 0;
        o = o | 0;
        p = p | 0;
        var q = 0, r = 0, s = 0, t = 0, u = ib, v = ib, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = ib, I = ib, J = ib, K = 0.0, L = 0.0;
        G = l;
        l = l + 160 | 0;
        D = G + 152 | 0;
        C = G + 120 | 0;
        B = G + 104 | 0;
        y = G + 72 | 0;
        t = G + 56 | 0;
        A = G + 8 | 0;
        x = G;
        z = (c[2279] | 0) + 1 | 0;
        c[2279] = z;
        E = b + 984 | 0;
        if ((a[E >> 0] | 0) != 0 ? (c[b + 512 >> 2] | 0) != (c[2278] | 0) : 0) w = 4;
        else if ((c[b + 516 >> 2] | 0) == (f | 0)) F = 0;
        else w = 4;
        if ((w | 0) == 4) {
            c[b + 520 >> 2] = 0;
            c[b + 924 >> 2] = -1;
            c[b + 928 >> 2] = -1;
            g[b + 932 >> 2] = T(-1);
            g[b + 936 >> 2] = T(-1);
            F = 1;
        }
        a: do if (!(c[b + 964 >> 2] | 0)) {
            if (n) {
                q = b + 916 | 0;
                if (!(Ld(T(g[q >> 2]), d) | 0)) {
                    w = 21;
                    break;
                }
                if (!(Ld(T(g[b + 920 >> 2]), e) | 0)) {
                    w = 21;
                    break;
                }
                if ((c[b + 924 >> 2] | 0) != (i | 0)) {
                    w = 21;
                    break;
                }
                q = (c[b + 928 >> 2] | 0) == (j | 0) ? q : 0;
                w = 22;
                break;
            }
            s = c[b + 520 >> 2] | 0;
            if (!s) w = 21;
            else {
                r = 0;
                while(true){
                    q = b + 524 + (r * 24 | 0) | 0;
                    if (((Ld(T(g[q >> 2]), d) | 0 ? Ld(T(g[b + 524 + (r * 24 | 0) + 4 >> 2]), e) | 0 : 0) ? (c[b + 524 + (r * 24 | 0) + 8 >> 2] | 0) == (i | 0) : 0) ? (c[b + 524 + (r * 24 | 0) + 12 >> 2] | 0) == (j | 0) : 0) {
                        w = 22;
                        break a;
                    }
                    r = r + 1 | 0;
                    if (r >>> 0 >= s >>> 0) {
                        w = 21;
                        break;
                    }
                }
            }
        } else {
            u = T(Ud(b, 2, k));
            v = T(Ud(b, 0, k));
            q = b + 916 | 0;
            J = T(g[q >> 2]);
            I = T(g[b + 920 >> 2]);
            H = T(g[b + 932 >> 2]);
            if (!(Pd(i, d, j, e, c[b + 924 >> 2] | 0, J, c[b + 928 >> 2] | 0, I, H, T(g[b + 936 >> 2]), u, v, p) | 0)) {
                s = c[b + 520 >> 2] | 0;
                if (!s) w = 21;
                else {
                    r = 0;
                    while(true){
                        q = b + 524 + (r * 24 | 0) | 0;
                        H = T(g[q >> 2]);
                        I = T(g[b + 524 + (r * 24 | 0) + 4 >> 2]);
                        J = T(g[b + 524 + (r * 24 | 0) + 16 >> 2]);
                        if (Pd(i, d, j, e, c[b + 524 + (r * 24 | 0) + 8 >> 2] | 0, H, c[b + 524 + (r * 24 | 0) + 12 >> 2] | 0, I, J, T(g[b + 524 + (r * 24 | 0) + 20 >> 2]), u, v, p) | 0) {
                            w = 22;
                            break a;
                        }
                        r = r + 1 | 0;
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
            if (!(a[11697] | 0)) {
                q = 0;
                w = 31;
            } else {
                q = 0;
                w = 28;
            }
        } else if ((w | 0) == 22) {
            r = (a[11697] | 0) != 0;
            if (!((q | 0) != 0 & (F ^ 1))) {
                if (r) {
                    w = 28;
                    break;
                } else {
                    w = 31;
                    break;
                }
            }
            t = q + 16 | 0;
            c[b + 908 >> 2] = c[t >> 2];
            s = q + 20 | 0;
            c[b + 912 >> 2] = c[s >> 2];
            if (!((a[11698] | 0) == 0 | r ^ 1)) {
                c[x >> 2] = Wd(z) | 0;
                c[x + 4 >> 2] = z;
                Vd(b, 4, 2972, x);
                r = c[b + 972 >> 2] | 0;
                if (r | 0) nb[r & 127](b);
                i = Xd(i, n) | 0;
                j = Xd(j, n) | 0;
                L = +T(g[t >> 2]);
                K = +T(g[s >> 2]);
                c[A >> 2] = i;
                c[A + 4 >> 2] = j;
                h[A + 8 >> 3] = +d;
                h[A + 16 >> 3] = +e;
                h[A + 24 >> 3] = L;
                h[A + 32 >> 3] = K;
                c[A + 40 >> 2] = o;
                Vd(b, 4, 2989, A);
            }
        }
        while (0)
        if ((w | 0) == 28) {
            r = Wd(z) | 0;
            c[t >> 2] = r;
            c[t + 4 >> 2] = z;
            c[t + 8 >> 2] = F ? 3047 : 11699;
            Vd(b, 4, 3038, t);
            r = c[b + 972 >> 2] | 0;
            if (r | 0) nb[r & 127](b);
            A = Xd(i, n) | 0;
            w = Xd(j, n) | 0;
            c[y >> 2] = A;
            c[y + 4 >> 2] = w;
            h[y + 8 >> 3] = +d;
            h[y + 16 >> 3] = +e;
            c[y + 24 >> 2] = o;
            Vd(b, 4, 3049, y);
            w = 31;
        }
        if ((w | 0) == 31) {
            Yd(b, d, e, f, i, j, k, m, n, p);
            if (a[11697] | 0) {
                r = c[2279] | 0;
                A = Wd(r) | 0;
                c[B >> 2] = A;
                c[B + 4 >> 2] = r;
                c[B + 8 >> 2] = F ? 3047 : 11699;
                Vd(b, 4, 3083, B);
                r = c[b + 972 >> 2] | 0;
                if (r | 0) nb[r & 127](b);
                A = Xd(i, n) | 0;
                B = Xd(j, n) | 0;
                K = +T(g[b + 908 >> 2]);
                L = +T(g[b + 912 >> 2]);
                c[C >> 2] = A;
                c[C + 4 >> 2] = B;
                h[C + 8 >> 3] = K;
                h[C + 16 >> 3] = L;
                c[C + 24 >> 2] = o;
                Vd(b, 4, 3092, C);
            }
            c[b + 516 >> 2] = f;
            if (!q) {
                r = b + 520 | 0;
                q = c[r >> 2] | 0;
                if ((q | 0) == 16) {
                    if (a[11697] | 0) Vd(b, 4, 3124, D);
                    c[r >> 2] = 0;
                    q = 0;
                }
                if (n) q = b + 916 | 0;
                else {
                    c[r >> 2] = q + 1;
                    q = b + 524 + (q * 24 | 0) | 0;
                }
                g[q >> 2] = d;
                g[q + 4 >> 2] = e;
                c[q + 8 >> 2] = i;
                c[q + 12 >> 2] = j;
                c[q + 16 >> 2] = c[b + 908 >> 2];
                c[q + 20 >> 2] = c[b + 912 >> 2];
                q = 0;
            }
        }
        if (n) {
            c[b + 416 >> 2] = c[b + 908 >> 2];
            c[b + 420 >> 2] = c[b + 912 >> 2];
            a[b + 985 >> 0] = 1;
            a[E >> 0] = 0;
        }
        c[2279] = (c[2279] | 0) + -1;
        c[b + 512 >> 2] = c[2278];
        l = G;
        return F | (q | 0) == 0 | 0;
    }
    function Ud(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        var d = ib;
        d = T(me(a, b, c));
        return T(d + T(ne(a, b, c)));
    }
    function Vd(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = l;
        l = l + 16 | 0;
        f = g;
        c[f >> 2] = e;
        if (!a) e = 0;
        else e = c[a + 976 >> 2] | 0;
        ge(e, a, b, d, f);
        l = g;
        return;
    }
    function Wd(a) {
        a = a | 0;
        return (a >>> 0 > 60 ? 3201 : 3201 + (60 - a) | 0) | 0;
    }
    function Xd(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0;
        f = l;
        l = l + 32 | 0;
        d = f + 12 | 0;
        e = f;
        c[d >> 2] = c[254];
        c[d + 4 >> 2] = c[255];
        c[d + 8 >> 2] = c[256];
        c[e >> 2] = c[257];
        c[e + 4 >> 2] = c[258];
        c[e + 8 >> 2] = c[259];
        if ((a | 0) > 2) a = 11699;
        else a = c[(b ? e : d) + (a << 2) >> 2] | 0;
        l = f;
        return a | 0;
    }
    function Yd(b, e, f, h, i, k, m, n, o, p) {
        b = b | 0;
        e = T(e);
        f = T(f);
        h = h | 0;
        i = i | 0;
        k = k | 0;
        m = T(m);
        n = T(n);
        o = o | 0;
        p = p | 0;
        var q = 0, r = 0, s = 0, t = 0, u = ib, v = ib, w = ib, x = ib, y = ib, z = ib, A = ib, B = 0, C = 0, D = 0, E = ib, F = ib, G = 0, H = ib, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, _ = 0, $ = ib, aa = ib, ba = ib, ca = ib, da = ib, ea = 0, fa = 0, ga = 0, ha = 0, ia = 0, ja = ib, ka = ib, la = ib, ma = ib, na = ib, oa = ib, pa = 0, qa = ib, ra = ib, sa = ib, ta = ib, ua = ib, va = ib, wa = 0, xa = 0, ya = ib, za = ib, Aa = 0, Ba = 0, Ca = 0, Da = 0, Ea = ib, Fa = 0, Ga = 0, Ha = 0, Ia = 0, Ja = 0, Ka = 0, La = 0, Ma = ib, Na = 0, Oa = 0;
        La = l;
        l = l + 16 | 0;
        ea = La + 12 | 0;
        fa = La + 8 | 0;
        ga = La + 4 | 0;
        ha = La;
        ec(b, (i | 0) == 0 | (Sb(e) | 0) ^ 1, 3326);
        ec(b, (k | 0) == 0 | (Sb(f) | 0) ^ 1, 3406);
        Ga = qe(b, h) | 0;
        c[b + 496 >> 2] = Ga;
        Ja = re(2, Ga) | 0;
        Ka = re(0, Ga) | 0;
        g[b + 440 >> 2] = T(me(b, Ja, m));
        g[b + 444 >> 2] = T(ne(b, Ja, m));
        g[b + 428 >> 2] = T(me(b, Ka, m));
        g[b + 436 >> 2] = T(ne(b, Ka, m));
        g[b + 464 >> 2] = T(se(b, Ja));
        g[b + 468 >> 2] = T(te(b, Ja));
        g[b + 452 >> 2] = T(se(b, Ka));
        g[b + 460 >> 2] = T(te(b, Ka));
        g[b + 488 >> 2] = T(ue(b, Ja, m));
        g[b + 492 >> 2] = T(ve(b, Ja, m));
        g[b + 476 >> 2] = T(ue(b, Ka, m));
        g[b + 484 >> 2] = T(ve(b, Ka, m));
        do if (!(c[b + 964 >> 2] | 0)) {
            Ha = b + 948 | 0;
            Ia = (c[b + 952 >> 2] | 0) - (c[Ha >> 2] | 0) >> 2;
            if (!Ia) {
                xe(b, e, f, i, k, m, n);
                break;
            }
            if (!o ? ye(b, e, f, i, k, m, n) | 0 : 0) break;
            lc(b);
            Y = b + 508 | 0;
            a[Y >> 0] = 0;
            Ja = re(c[b + 4 >> 2] | 0, Ga) | 0;
            Ka = ze(Ja, Ga) | 0;
            Fa = oe(Ja) | 0;
            Z = c[b + 8 >> 2] | 0;
            Ba = b + 28 | 0;
            _ = (c[Ba >> 2] | 0) != 0;
            ua = Fa ? m : n;
            ya = Fa ? n : m;
            $ = T(Ae(b, Ja, m));
            aa = T(Be(b, Ja, m));
            u = T(Ae(b, Ka, m));
            va = T(Ce(b, Ja, m));
            za = T(Ce(b, Ka, m));
            D = Fa ? i : k;
            Aa = Fa ? k : i;
            Ea = Fa ? va : za;
            y = Fa ? za : va;
            ta = T(Ud(b, 2, m));
            x = T(Ud(b, 0, m));
            v = T(T(be(b + 364 | 0, m)) - Ea);
            w = T(T(be(b + 380 | 0, m)) - Ea);
            z = T(T(be(b + 372 | 0, n)) - y);
            A = T(T(be(b + 388 | 0, n)) - y);
            ba = Fa ? v : z;
            ca = Fa ? w : A;
            ta = T(e - ta);
            e = T(ta - Ea);
            if (Sb(e) | 0) Ea = e;
            else Ea = T(cC(T(eC(e, w)), v));
            ra = T(f - x);
            e = T(ra - y);
            if (Sb(e) | 0) sa = e;
            else sa = T(cC(T(eC(e, A)), z));
            v = Fa ? Ea : sa;
            qa = Fa ? sa : Ea;
            a: do if ((D | 0) == 1) {
                h = 0;
                r = 0;
                while(true){
                    q = ac(b, r) | 0;
                    if (!h) {
                        if (T(Ee(q)) > T(0.0) ? T(Fe(q)) > T(0.0) : 0) h = q;
                        else h = 0;
                    } else if (De(q) | 0) {
                        t = 0;
                        break a;
                    }
                    r = r + 1 | 0;
                    if (r >>> 0 >= Ia >>> 0) {
                        t = h;
                        break;
                    }
                }
            } else t = 0;
            while (0)
            B = t + 500 | 0;
            C = t + 504 | 0;
            h = 0;
            q = 0;
            e = T(0.0);
            s = 0;
            do {
                r = c[(c[Ha >> 2] | 0) + (s << 2) >> 2] | 0;
                if ((c[r + 36 >> 2] | 0) == 1) {
                    Ge(r);
                    a[r + 985 >> 0] = 1;
                    a[r + 984 >> 0] = 0;
                } else {
                    $d(r);
                    if (o) ce(r, qe(r, Ga) | 0, v, qa, Ea);
                    do if ((c[r + 24 >> 2] | 0) != 1) {
                        if ((r | 0) == (t | 0)) {
                            c[B >> 2] = c[2278];
                            g[C >> 2] = T(0.0);
                            break;
                        } else {
                            He(b, r, Ea, i, sa, Ea, sa, k, Ga, p);
                            break;
                        }
                    } else {
                        if (q | 0) c[q + 960 >> 2] = r;
                        c[r + 960 >> 2] = 0;
                        q = r;
                        h = (h | 0) == 0 ? r : h;
                    }
                    while (0)
                    oa = T(g[r + 504 >> 2]);
                    e = T(e + T(oa + T(Ud(r, Ja, Ea))));
                }
                s = s + 1 | 0;
            }while ((s | 0) != (Ia | 0))
            K = e > v;
            pa = _ & ((D | 0) == 2 & K) ? 1 : D;
            I = (Aa | 0) == 1;
            M = I & (o ^ 1);
            N = (pa | 0) == 1;
            O = (pa | 0) == 2;
            P = 976 + (Ja << 2) | 0;
            Q = (Aa | 2) == 2;
            W = I & (_ ^ 1);
            R = 1040 + (Ka << 2) | 0;
            S = 1040 + (Ja << 2) | 0;
            U = 976 + (Ka << 2) | 0;
            V = (Aa | 0) != 1;
            K = _ & ((D | 0) != 0 & K);
            J = b + 976 | 0;
            I = I ^ 1;
            e = v;
            G = 0;
            L = 0;
            oa = T(0.0);
            da = T(0.0);
            while(true){
                b: do if (G >>> 0 < Ia >>> 0) {
                    C = c[Ha >> 2] | 0;
                    s = 0;
                    A = T(0.0);
                    z = T(0.0);
                    w = T(0.0);
                    v = T(0.0);
                    r = 0;
                    q = 0;
                    t = G;
                    while(true){
                        B = c[C + (t << 2) >> 2] | 0;
                        if ((c[B + 36 >> 2] | 0) != 1 ? (c[B + 940 >> 2] = L, (c[B + 24 >> 2] | 0) != 1) : 0) {
                            x = T(Ud(B, Ja, Ea));
                            X = c[P >> 2] | 0;
                            f = T(be(B + 380 + (X << 3) | 0, ua));
                            y = T(g[B + 504 >> 2]);
                            f = T(eC(f, y));
                            f = T(cC(T(be(B + 364 + (X << 3) | 0, ua)), f));
                            if (_ & (s | 0) != 0 & T(x + T(z + f)) > e) {
                                k = s;
                                x = A;
                                D = t;
                                break b;
                            }
                            x = T(x + f);
                            f = T(z + x);
                            x = T(A + x);
                            if (De(B) | 0) {
                                w = T(w + T(Ee(B)));
                                v = T(v - T(y * T(Fe(B))));
                            }
                            if (q | 0) c[q + 960 >> 2] = B;
                            c[B + 960 >> 2] = 0;
                            s = s + 1 | 0;
                            q = B;
                            r = (r | 0) == 0 ? B : r;
                        } else {
                            x = A;
                            f = z;
                        }
                        t = t + 1 | 0;
                        if (t >>> 0 < Ia >>> 0) {
                            A = x;
                            z = f;
                        } else {
                            k = s;
                            D = t;
                            break;
                        }
                    }
                } else {
                    k = 0;
                    x = T(0.0);
                    w = T(0.0);
                    v = T(0.0);
                    r = 0;
                    D = G;
                }
                while (0)
                X = w > T(0.0) & w < T(1.0);
                E = X ? T(1.0) : w;
                X = v > T(0.0) & v < T(1.0);
                A = X ? T(1.0) : v;
                do if (!N) {
                    if (!(x < ba & ((Sb(ba) | 0) ^ 1))) {
                        if (!(x > ca & ((Sb(ca) | 0) ^ 1))) {
                            if (!(a[(c[J >> 2] | 0) + 3 >> 0] | 0)) {
                                if (!(E == T(0.0)) ? !(T(Ee(b)) == T(0.0)) : 0) {
                                    X = 53;
                                    break;
                                }
                                e = x;
                                X = 53;
                            } else X = 51;
                        } else {
                            e = ca;
                            X = 51;
                        }
                    } else {
                        e = ba;
                        X = 51;
                    }
                } else X = 51;
                while (0)
                if ((X | 0) == 51) {
                    X = 0;
                    if (Sb(e) | 0) X = 53;
                    else {
                        F = T(e - x);
                        H = e;
                    }
                }
                if ((X | 0) == 53) {
                    X = 0;
                    if (x < T(0.0)) {
                        F = T(-x);
                        H = e;
                    } else {
                        F = T(0.0);
                        H = e;
                    }
                }
                if (!M ? (ia = (r | 0) == 0, !ia) : 0) {
                    s = c[P >> 2] | 0;
                    t = F < T(0.0);
                    y = T(F / A);
                    B = F > T(0.0);
                    z = T(F / E);
                    w = T(0.0);
                    x = T(0.0);
                    e = T(0.0);
                    q = r;
                    do {
                        f = T(be(q + 380 + (s << 3) | 0, ua));
                        v = T(be(q + 364 + (s << 3) | 0, ua));
                        v = T(eC(f, T(cC(v, T(g[q + 504 >> 2])))));
                        if (t) {
                            f = T(v * T(Fe(q)));
                            if (f != T(-0) ? (Ma = T(v - T(y * f)), ja = T(Ie(q, Ja, Ma, H, Ea)), Ma != ja) : 0) {
                                w = T(w - T(ja - v));
                                e = T(e + f);
                            }
                        } else if ((B ? (ka = T(Ee(q)), ka != T(0.0)) : 0) ? (Ma = T(v + T(z * ka)), la = T(Ie(q, Ja, Ma, H, Ea)), Ma != la) : 0) {
                            w = T(w - T(la - v));
                            x = T(x - ka);
                        }
                        q = c[q + 960 >> 2] | 0;
                    }while ((q | 0) != 0)
                    e = T(A + e);
                    v = T(F + w);
                    if (!ia) {
                        y = T(E + x);
                        t = c[P >> 2] | 0;
                        B = v < T(0.0);
                        C = e == T(0.0);
                        z = T(v / e);
                        s = v > T(0.0);
                        y = T(v / y);
                        e = T(0.0);
                        do {
                            Ma = T(be(r + 380 + (t << 3) | 0, ua));
                            w = T(be(r + 364 + (t << 3) | 0, ua));
                            w = T(eC(Ma, T(cC(w, T(g[r + 504 >> 2])))));
                            if (B) {
                                Ma = T(w * T(Fe(r)));
                                v = T(-Ma);
                                if (Ma != T(-0)) {
                                    Ma = T(z * v);
                                    v = T(Ie(r, Ja, T(w + (C ? v : Ma)), H, Ea));
                                } else v = w;
                            } else if (s ? (ma = T(Ee(r)), ma != T(0.0)) : 0) v = T(Ie(r, Ja, T(w + T(y * ma)), H, Ea));
                            else v = w;
                            e = T(e - T(v - w));
                            x = T(Ud(r, Ja, Ea));
                            f = T(Ud(r, Ka, Ea));
                            v = T(v + x);
                            g[fa >> 2] = v;
                            c[ha >> 2] = 1;
                            w = T(g[r + 396 >> 2]);
                            c: do if (Sb(w) | 0) {
                                q = Sb(qa) | 0;
                                do if (!q) {
                                    if (K | (ae(r, Ka, qa) | 0 | I)) break;
                                    if ((Je(b, r) | 0) != 4) break;
                                    if ((c[(Ke(r, Ka) | 0) + 4 >> 2] | 0) == 3) break;
                                    if ((c[(Le(r, Ka) | 0) + 4 >> 2] | 0) == 3) break;
                                    g[ea >> 2] = qa;
                                    c[ga >> 2] = 1;
                                    break c;
                                }
                                while (0)
                                if (ae(r, Ka, qa) | 0) {
                                    q = c[r + 992 + (c[U >> 2] << 2) >> 2] | 0;
                                    Ma = T(f + T(be(q, qa)));
                                    g[ea >> 2] = Ma;
                                    q = V & (c[q + 4 >> 2] | 0) == 2;
                                    c[ga >> 2] = ((Sb(Ma) | 0 | q) ^ 1) & 1;
                                    break;
                                } else {
                                    g[ea >> 2] = qa;
                                    c[ga >> 2] = q ? 0 : 2;
                                    break;
                                }
                            } else {
                                Ma = T(v - x);
                                E = T(Ma / w);
                                Ma = T(w * Ma);
                                c[ga >> 2] = 1;
                                g[ea >> 2] = T(f + (Fa ? E : Ma));
                            }
                            while (0)
                            Me(r, Ja, H, Ea, ha, fa);
                            Me(r, Ka, qa, Ea, ga, ea);
                            do if (!(ae(r, Ka, qa) | 0) ? (Je(b, r) | 0) == 4 : 0) {
                                if ((c[(Ke(r, Ka) | 0) + 4 >> 2] | 0) == 3) {
                                    q = 0;
                                    break;
                                }
                                q = (c[(Le(r, Ka) | 0) + 4 >> 2] | 0) != 3;
                            } else q = 0;
                            while (0)
                            Ma = T(g[fa >> 2]);
                            E = T(g[ea >> 2]);
                            Na = c[ha >> 2] | 0;
                            Oa = c[ga >> 2] | 0;
                            Td(r, Fa ? Ma : E, Fa ? E : Ma, Ga, Fa ? Na : Oa, Fa ? Oa : Na, Ea, sa, o & (q ^ 1), 3488, p);
                            a[Y >> 0] = a[Y >> 0] | a[r + 508 >> 0];
                            r = c[r + 960 >> 2] | 0;
                        }while ((r | 0) != 0)
                    } else e = T(0.0);
                } else e = T(0.0);
                e = T(F + e);
                Oa = e < T(0.0) & 1;
                a[Y >> 0] = Oa | d[Y >> 0];
                if (O & e > T(0.0)) {
                    q = c[P >> 2] | 0;
                    if ((c[b + 364 + (q << 3) + 4 >> 2] | 0) != 0 ? (na = T(be(b + 364 + (q << 3) | 0, ua)), na >= T(0.0)) : 0) v = T(cC(T(0.0), T(na - T(H - e))));
                    else v = T(0.0);
                } else v = e;
                B = G >>> 0 < D >>> 0;
                if (B) {
                    t = c[Ha >> 2] | 0;
                    s = G;
                    q = 0;
                    do {
                        r = c[t + (s << 2) >> 2] | 0;
                        if (!(c[r + 24 >> 2] | 0)) {
                            q = ((c[(Ke(r, Ja) | 0) + 4 >> 2] | 0) == 3 & 1) + q | 0;
                            q = q + ((c[(Le(r, Ja) | 0) + 4 >> 2] | 0) == 3 & 1) | 0;
                        }
                        s = s + 1 | 0;
                    }while ((s | 0) != (D | 0))
                    if (q) {
                        x = T(0.0);
                        f = T(0.0);
                    } else X = 101;
                } else X = 101;
                d: if ((X | 0) == 101) {
                    X = 0;
                    switch(Z | 0){
                        case 1:
                            q = 0;
                            x = T(v * T(0.5));
                            f = T(0.0);
                            break d;
                        case 2:
                            q = 0;
                            x = v;
                            f = T(0.0);
                            break d;
                        case 3:
                            if (k >>> 0 <= 1) {
                                q = 0;
                                x = T(0.0);
                                f = T(0.0);
                                break d;
                            }
                            f = T((k + -1 | 0) >>> 0);
                            q = 0;
                            x = T(0.0);
                            f = T(T(cC(v, T(0.0))) / f);
                            break d;
                        case 5:
                            f = T(v / T((k + 1 | 0) >>> 0));
                            q = 0;
                            x = f;
                            break d;
                        case 4:
                            f = T(v / T(k >>> 0));
                            q = 0;
                            x = T(f * T(0.5));
                            break d;
                        default:
                            q = 0;
                            x = T(0.0);
                            f = T(0.0);
                            break d;
                    }
                }
                e = T($ + x);
                if (B) {
                    w = T(v / T(q | 0));
                    s = c[Ha >> 2] | 0;
                    r = G;
                    v = T(0.0);
                    do {
                        q = c[s + (r << 2) >> 2] | 0;
                        e: do if ((c[q + 36 >> 2] | 0) != 1) {
                            switch(c[q + 24 >> 2] | 0){
                                case 1:
                                    if (Ne(q, Ja) | 0) {
                                        if (!o) break e;
                                        Ma = T(Oe(q, Ja, H));
                                        Ma = T(Ma + T(se(b, Ja)));
                                        Ma = T(Ma + T(me(q, Ja, Ea)));
                                        g[q + 400 + (c[S >> 2] << 2) >> 2] = Ma;
                                        break e;
                                    }
                                    break;
                                case 0:
                                    Oa = (c[(Ke(q, Ja) | 0) + 4 >> 2] | 0) == 3;
                                    Ma = T(w + e);
                                    e = Oa ? Ma : e;
                                    if (o) {
                                        Oa = q + 400 + (c[S >> 2] << 2) | 0;
                                        g[Oa >> 2] = T(e + T(g[Oa >> 2]));
                                    }
                                    Oa = (c[(Le(q, Ja) | 0) + 4 >> 2] | 0) == 3;
                                    Ma = T(w + e);
                                    e = Oa ? Ma : e;
                                    if (M) {
                                        Ma = T(f + T(Ud(q, Ja, Ea)));
                                        v = qa;
                                        e = T(e + T(Ma + T(g[q + 504 >> 2])));
                                        break e;
                                    } else {
                                        e = T(e + T(f + T(Pe(q, Ja, Ea))));
                                        v = T(cC(v, T(Pe(q, Ka, Ea))));
                                        break e;
                                    }
                                default:
                            }
                            if (o) {
                                Ma = T(x + T(se(b, Ja)));
                                Oa = q + 400 + (c[S >> 2] << 2) | 0;
                                g[Oa >> 2] = T(Ma + T(g[Oa >> 2]));
                            }
                        }
                        while (0)
                        r = r + 1 | 0;
                    }while ((r | 0) != (D | 0))
                } else v = T(0.0);
                f = T(aa + e);
                if (Q) x = T(T(Ie(b, Ka, T(za + v), ya, m)) - za);
                else x = qa;
                w = T(T(Ie(b, Ka, T(za + (W ? qa : v)), ya, m)) - za);
                if (B & o) {
                    r = G;
                    do {
                        s = c[(c[Ha >> 2] | 0) + (r << 2) >> 2] | 0;
                        do if ((c[s + 36 >> 2] | 0) != 1) {
                            if ((c[s + 24 >> 2] | 0) == 1) {
                                if (Ne(s, Ka) | 0) {
                                    Ma = T(Oe(s, Ka, qa));
                                    Ma = T(Ma + T(se(b, Ka)));
                                    Ma = T(Ma + T(me(s, Ka, Ea)));
                                    q = c[R >> 2] | 0;
                                    g[s + 400 + (q << 2) >> 2] = Ma;
                                    if (!(Sb(Ma) | 0)) break;
                                } else q = c[R >> 2] | 0;
                                Ma = T(se(b, Ka));
                                g[s + 400 + (q << 2) >> 2] = T(Ma + T(me(s, Ka, Ea)));
                                break;
                            }
                            q = Je(b, s) | 0;
                            do if ((q | 0) == 4) {
                                if ((c[(Ke(s, Ka) | 0) + 4 >> 2] | 0) == 3) {
                                    X = 139;
                                    break;
                                }
                                if ((c[(Le(s, Ka) | 0) + 4 >> 2] | 0) == 3) {
                                    X = 139;
                                    break;
                                }
                                if (ae(s, Ka, qa) | 0) {
                                    e = u;
                                    break;
                                }
                                Na = c[s + 908 + (c[P >> 2] << 2) >> 2] | 0;
                                c[ea >> 2] = Na;
                                e = T(g[s + 396 >> 2]);
                                Oa = Sb(e) | 0;
                                v = (c[j >> 2] = Na, T(g[j >> 2]));
                                if (Oa) e = w;
                                else {
                                    F = T(Ud(s, Ka, Ea));
                                    Ma = T(v / e);
                                    e = T(e * v);
                                    e = T(F + (Fa ? Ma : e));
                                }
                                g[fa >> 2] = e;
                                g[ea >> 2] = T(T(Ud(s, Ja, Ea)) + v);
                                c[ga >> 2] = 1;
                                c[ha >> 2] = 1;
                                Me(s, Ja, H, Ea, ga, ea);
                                Me(s, Ka, qa, Ea, ha, fa);
                                e = T(g[ea >> 2]);
                                F = T(g[fa >> 2]);
                                Ma = Fa ? e : F;
                                e = Fa ? F : e;
                                Oa = ((Sb(Ma) | 0) ^ 1) & 1;
                                Td(s, Ma, e, Ga, Oa, ((Sb(e) | 0) ^ 1) & 1, Ea, sa, 1, 3493, p);
                                e = u;
                            } else X = 139;
                            while (0)
                            f: do if ((X | 0) == 139) {
                                X = 0;
                                e = T(x - T(Pe(s, Ka, Ea)));
                                do if ((c[(Ke(s, Ka) | 0) + 4 >> 2] | 0) == 3) {
                                    if ((c[(Le(s, Ka) | 0) + 4 >> 2] | 0) != 3) break;
                                    e = T(u + T(cC(T(0.0), T(e * T(0.5)))));
                                    break f;
                                }
                                while (0)
                                if ((c[(Le(s, Ka) | 0) + 4 >> 2] | 0) == 3) {
                                    e = u;
                                    break;
                                }
                                if ((c[(Ke(s, Ka) | 0) + 4 >> 2] | 0) == 3) {
                                    e = T(u + T(cC(T(0.0), e)));
                                    break;
                                }
                                switch(q | 0){
                                    case 1:
                                        e = u;
                                        break f;
                                    case 2:
                                        e = T(u + T(e * T(0.5)));
                                        break f;
                                    default:
                                        e = T(u + e);
                                        break f;
                                }
                            }
                            while (0)
                            Ma = T(oa + e);
                            Oa = s + 400 + (c[R >> 2] << 2) | 0;
                            g[Oa >> 2] = T(Ma + T(g[Oa >> 2]));
                        }
                        while (0)
                        r = r + 1 | 0;
                    }while ((r | 0) != (D | 0))
                }
                oa = T(oa + w);
                da = T(cC(da, f));
                k = L + 1 | 0;
                if (D >>> 0 >= Ia >>> 0) break;
                else {
                    e = H;
                    G = D;
                    L = k;
                }
            }
            do if (o) {
                q = k >>> 0 > 1;
                if (!q ? !(Qe(b) | 0) : 0) break;
                if (!(Sb(qa) | 0)) {
                    e = T(qa - oa);
                    g: do switch(c[b + 12 >> 2] | 0){
                        case 3:
                            u = T(u + e);
                            z = T(0.0);
                            break;
                        case 2:
                            u = T(u + T(e * T(0.5)));
                            z = T(0.0);
                            break;
                        case 4:
                            if (qa > oa) z = T(e / T(k >>> 0));
                            else z = T(0.0);
                            break;
                        case 7:
                            if (qa > oa) {
                                u = T(u + T(e / T(k << 1 >>> 0)));
                                z = T(e / T(k >>> 0));
                                z = q ? z : T(0.0);
                                break g;
                            } else {
                                u = T(u + T(e * T(0.5)));
                                z = T(0.0);
                                break g;
                            }
                        case 6:
                            z = T(e / T(L >>> 0));
                            z = qa > oa & q ? z : T(0.0);
                            break;
                        default:
                            z = T(0.0);
                    }
                    while (0)
                    if (k | 0) {
                        B = 1040 + (Ka << 2) | 0;
                        C = 976 + (Ka << 2) | 0;
                        t = 0;
                        r = 0;
                        while(true){
                            h: do if (r >>> 0 < Ia >>> 0) {
                                v = T(0.0);
                                w = T(0.0);
                                e = T(0.0);
                                s = r;
                                while(true){
                                    q = c[(c[Ha >> 2] | 0) + (s << 2) >> 2] | 0;
                                    do if ((c[q + 36 >> 2] | 0) != 1 ? (c[q + 24 >> 2] | 0) == 0 : 0) {
                                        if ((c[q + 940 >> 2] | 0) != (t | 0)) break h;
                                        if (Re(q, Ka) | 0) {
                                            Ma = T(g[q + 908 + (c[C >> 2] << 2) >> 2]);
                                            e = T(cC(e, T(Ma + T(Ud(q, Ka, Ea)))));
                                        }
                                        if ((Je(b, q) | 0) != 5) break;
                                        na = T(Se(q));
                                        na = T(na + T(me(q, 0, Ea)));
                                        Ma = T(g[q + 912 >> 2]);
                                        Ma = T(T(Ma + T(Ud(q, 0, Ea))) - na);
                                        na = T(cC(w, na));
                                        Ma = T(cC(v, Ma));
                                        v = Ma;
                                        w = na;
                                        e = T(cC(e, T(na + Ma)));
                                    }
                                    while (0)
                                    q = s + 1 | 0;
                                    if (q >>> 0 < Ia >>> 0) s = q;
                                    else {
                                        s = q;
                                        break;
                                    }
                                }
                            } else {
                                w = T(0.0);
                                e = T(0.0);
                                s = r;
                            }
                            while (0)
                            y = T(z + e);
                            f = u;
                            u = T(u + y);
                            if (r >>> 0 < s >>> 0) {
                                x = T(f + w);
                                q = r;
                                do {
                                    r = c[(c[Ha >> 2] | 0) + (q << 2) >> 2] | 0;
                                    i: if ((c[r + 36 >> 2] | 0) != 1 ? (c[r + 24 >> 2] | 0) == 0 : 0) switch(Je(b, r) | 0){
                                        case 1:
                                            Ma = T(f + T(me(r, Ka, Ea)));
                                            g[r + 400 + (c[B >> 2] << 2) >> 2] = Ma;
                                            break i;
                                        case 3:
                                            Ma = T(T(u - T(ne(r, Ka, Ea))) - T(g[r + 908 + (c[C >> 2] << 2) >> 2]));
                                            g[r + 400 + (c[B >> 2] << 2) >> 2] = Ma;
                                            break i;
                                        case 2:
                                            Ma = T(f + T(T(y - T(g[r + 908 + (c[C >> 2] << 2) >> 2])) * T(0.5)));
                                            g[r + 400 + (c[B >> 2] << 2) >> 2] = Ma;
                                            break i;
                                        case 4:
                                            Ma = T(f + T(me(r, Ka, Ea)));
                                            g[r + 400 + (c[B >> 2] << 2) >> 2] = Ma;
                                            if (ae(r, Ka, qa) | 0) break i;
                                            if (Fa) {
                                                v = T(g[r + 908 >> 2]);
                                                e = T(v + T(Ud(r, Ja, Ea)));
                                                w = y;
                                            } else {
                                                w = T(g[r + 912 >> 2]);
                                                w = T(w + T(Ud(r, Ka, Ea)));
                                                e = y;
                                                v = T(g[r + 908 >> 2]);
                                            }
                                            if (Ld(e, v) | 0 ? Ld(w, T(g[r + 912 >> 2])) | 0 : 0) break i;
                                            Td(r, e, w, Ga, 1, 1, Ea, sa, 1, 3501, p);
                                            break i;
                                        case 5:
                                            g[r + 404 >> 2] = T(T(x - T(Se(r))) + T(Oe(r, 0, qa)));
                                            break i;
                                        default:
                                            break i;
                                    }
                                    q = q + 1 | 0;
                                }while ((q | 0) != (s | 0))
                            }
                            t = t + 1 | 0;
                            if ((t | 0) == (k | 0)) break;
                            else r = s;
                        }
                    }
                }
            }
            while (0)
            g[b + 908 >> 2] = T(Ie(b, 2, ta, m, m));
            g[b + 912 >> 2] = T(Ie(b, 0, ra, n, m));
            if ((pa | 0) != 0 ? (wa = c[b + 32 >> 2] | 0, xa = (pa | 0) == 2, !(xa & (wa | 0) != 2)) : 0) {
                if (xa & (wa | 0) == 2) {
                    e = T(va + H);
                    e = T(cC(T(eC(e, T(Te(b, Ja, da, ua)))), va));
                    X = 198;
                }
            } else {
                e = T(Ie(b, Ja, da, ua, m));
                X = 198;
            }
            if ((X | 0) == 198) g[b + 908 + (c[976 + (Ja << 2) >> 2] << 2) >> 2] = e;
            if ((Aa | 0) != 0 ? (Ca = c[b + 32 >> 2] | 0, Da = (Aa | 0) == 2, !(Da & (Ca | 0) != 2)) : 0) {
                if (Da & (Ca | 0) == 2) {
                    e = T(za + qa);
                    e = T(cC(T(eC(e, T(Te(b, Ka, T(za + oa), ya)))), za));
                    X = 204;
                }
            } else {
                e = T(Ie(b, Ka, T(za + oa), ya, m));
                X = 204;
            }
            if ((X | 0) == 204) g[b + 908 + (c[976 + (Ka << 2) >> 2] << 2) >> 2] = e;
            if (o) {
                if ((c[Ba >> 2] | 0) == 2) {
                    r = 976 + (Ka << 2) | 0;
                    s = 1040 + (Ka << 2) | 0;
                    q = 0;
                    do {
                        t = ac(b, q) | 0;
                        if (!(c[t + 24 >> 2] | 0)) {
                            Na = c[r >> 2] | 0;
                            Ma = T(g[b + 908 + (Na << 2) >> 2]);
                            Oa = t + 400 + (c[s >> 2] << 2) | 0;
                            Ma = T(Ma - T(g[Oa >> 2]));
                            g[Oa >> 2] = T(Ma - T(g[t + 908 + (Na << 2) >> 2]));
                        }
                        q = q + 1 | 0;
                    }while ((q | 0) != (Ia | 0))
                }
                if (h | 0) {
                    q = Fa ? pa : i;
                    do {
                        Ue(b, h, Ea, q, sa, Ga, p);
                        h = c[h + 960 >> 2] | 0;
                    }while ((h | 0) != 0)
                }
                q = (Ja | 2) == 3;
                r = (Ka | 2) == 3;
                if (q | r) {
                    h = 0;
                    do {
                        s = c[(c[Ha >> 2] | 0) + (h << 2) >> 2] | 0;
                        if ((c[s + 36 >> 2] | 0) != 1) {
                            if (q) Ve(b, s, Ja);
                            if (r) Ve(b, s, Ka);
                        }
                        h = h + 1 | 0;
                    }while ((h | 0) != (Ia | 0))
                }
            }
        } else we(b, e, f, i, k, m, n);
        while (0)
        l = La;
        return;
    }
    function Zd(a, b) {
        a = a | 0;
        b = T(b);
        var c = 0;
        Vb(a, b >= T(0.0), 3147);
        c = b == T(0.0);
        g[a + 4 >> 2] = c ? T(0.0) : b;
        return;
    }
    function _d(b, d, e, f) {
        b = b | 0;
        d = T(d);
        e = T(e);
        f = f | 0;
        var h = ib, i = ib, j = 0, k = 0, l = 0;
        c[2278] = (c[2278] | 0) + 1;
        $d(b);
        if (!(ae(b, 2, d) | 0)) {
            h = T(be(b + 380 | 0, d));
            if (!(h >= T(0.0))) {
                l = ((Sb(d) | 0) ^ 1) & 1;
                h = d;
            } else l = 2;
        } else {
            h = T(be(c[b + 992 >> 2] | 0, d));
            l = 1;
            h = T(h + T(Ud(b, 2, d)));
        }
        if (!(ae(b, 0, e) | 0)) {
            i = T(be(b + 388 | 0, e));
            if (!(i >= T(0.0))) {
                k = ((Sb(e) | 0) ^ 1) & 1;
                i = e;
            } else k = 2;
        } else {
            i = T(be(c[b + 996 >> 2] | 0, e));
            k = 1;
            i = T(i + T(Ud(b, 0, d)));
        }
        j = b + 976 | 0;
        if (Td(b, h, i, f, l, k, d, e, 1, 3189, c[j >> 2] | 0) | 0 ? (ce(b, c[b + 496 >> 2] | 0, d, e, d), de(b, T(g[(c[j >> 2] | 0) + 4 >> 2]), T(0.0), T(0.0)), a[11696] | 0) : 0) Md(b, 7);
        return;
    }
    function $d(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        h = i + 24 | 0;
        g = i + 16 | 0;
        e = i + 8 | 0;
        f = i;
        d = 0;
        do {
            b = a + 380 + (d << 3) | 0;
            if (!((c[a + 380 + (d << 3) + 4 >> 2] | 0) != 0 ? (j = b, k = c[j + 4 >> 2] | 0, m = e, c[m >> 2] = c[j >> 2], c[m + 4 >> 2] = k, m = a + 364 + (d << 3) | 0, k = c[m + 4 >> 2] | 0, j = f, c[j >> 2] = c[m >> 2], c[j + 4 >> 2] = k, c[g >> 2] = c[e >> 2], c[g + 4 >> 2] = c[e + 4 >> 2], c[h >> 2] = c[f >> 2], c[h + 4 >> 2] = c[f + 4 >> 2], Kd(g, h) | 0) : 0)) b = a + 348 + (d << 3) | 0;
            c[a + 992 + (d << 2) >> 2] = b;
            d = d + 1 | 0;
        }while ((d | 0) != 2)
        l = i;
        return;
    }
    function ae(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0;
        a = c[a + 992 + (c[976 + (b << 2) >> 2] << 2) >> 2] | 0;
        switch(c[a + 4 >> 2] | 0){
            case 0:
            case 3:
                a = 0;
                break;
            case 1:
                if (T(g[a >> 2]) < T(0.0)) a = 0;
                else e = 5;
                break;
            case 2:
                if (T(g[a >> 2]) < T(0.0)) a = 0;
                else a = (Sb(d) | 0) ^ 1;
                break;
            default:
                e = 5;
        }
        if ((e | 0) == 5) a = 1;
        return a | 0;
    }
    function be(a, b) {
        a = a | 0;
        b = T(b);
        switch(c[a + 4 >> 2] | 0){
            case 2:
                b = T(T(T(g[a >> 2]) * b) / T(100.0));
                break;
            case 1:
                b = T(g[a >> 2]);
                break;
            default:
                b = T(t);
        }
        return T(b);
    }
    function ce(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        e = T(e);
        f = T(f);
        var h = 0, i = ib;
        b = c[a + 944 >> 2] | 0 ? b : 1;
        h = re(c[a + 4 >> 2] | 0, b) | 0;
        b = ze(h, b) | 0;
        d = T($e(a, h, d));
        e = T($e(a, b, e));
        i = T(d + T(me(a, h, f)));
        g[a + 400 + (c[1040 + (h << 2) >> 2] << 2) >> 2] = i;
        d = T(d + T(ne(a, h, f)));
        g[a + 400 + (c[1e3 + (h << 2) >> 2] << 2) >> 2] = d;
        d = T(e + T(me(a, b, f)));
        g[a + 400 + (c[1040 + (b << 2) >> 2] << 2) >> 2] = d;
        f = T(e + T(ne(a, b, f)));
        g[a + 400 + (c[1e3 + (b << 2) >> 2] << 2) >> 2] = f;
        return;
    }
    function de(a, b, d, e) {
        a = a | 0;
        b = T(b);
        d = T(d);
        e = T(e);
        var f = 0, h = 0, i = ib, j = ib, k = 0, l = 0, m = ib, n = 0, o = ib, p = ib, q = ib, r = ib;
        if (!(b == T(0.0))) {
            f = a + 400 | 0;
            r = T(g[f >> 2]);
            h = a + 404 | 0;
            q = T(g[h >> 2]);
            n = a + 416 | 0;
            p = T(g[n >> 2]);
            l = a + 420 | 0;
            i = T(g[l >> 2]);
            o = T(r + d);
            m = T(q + e);
            e = T(o + p);
            j = T(m + i);
            k = (c[a + 988 >> 2] | 0) == 1;
            g[f >> 2] = T(Od(r, b, 0, k));
            g[h >> 2] = T(Od(q, b, 0, k));
            d = T(gC(T(p * b), T(1.0)));
            if (Ld(d, T(0.0)) | 0) h = 0;
            else h = (Ld(d, T(1.0)) | 0) ^ 1;
            d = T(gC(T(i * b), T(1.0)));
            if (Ld(d, T(0.0)) | 0) f = 0;
            else f = (Ld(d, T(1.0)) | 0) ^ 1;
            r = T(Od(e, b, k & h, k & (h ^ 1)));
            g[n >> 2] = T(r - T(Od(o, b, 0, k)));
            r = T(Od(j, b, k & f, k & (f ^ 1)));
            g[l >> 2] = T(r - T(Od(m, b, 0, k)));
            h = (c[a + 952 >> 2] | 0) - (c[a + 948 >> 2] | 0) >> 2;
            if (h | 0) {
                f = 0;
                do {
                    de(ac(a, f) | 0, b, o, m);
                    f = f + 1 | 0;
                }while ((f | 0) != (h | 0))
            }
        }
        return;
    }
    function ee(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        switch(d | 0){
            case 5:
            case 0:
                a = CB(c[489] | 0, e, f) | 0;
                break;
            default:
                a = iC(e, f) | 0;
        }
        return a | 0;
    }
    function fe(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        f = l;
        l = l + 16 | 0;
        g = f;
        c[g >> 2] = e;
        ge(a, 0, b, d, g);
        l = f;
        return;
    }
    function ge(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        a = a | 0 ? a : 956;
        Bb[c[a + 8 >> 2] & 1](a, b, d, e, f);
        if ((d | 0) == 5) Ta();
        else return;
    }
    function he(b, c, d) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        a[b + c >> 0] = d & 1;
        return;
    }
    function ie(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        c[a >> 2] = 0;
        c[a + 4 >> 2] = 0;
        c[a + 8 >> 2] = 0;
        d = b + 4 | 0;
        e = (c[d >> 2] | 0) - (c[b >> 2] | 0) >> 2;
        if (e | 0) {
            je(a, e);
            ke(a, c[b >> 2] | 0, c[d >> 2] | 0, e);
        }
        return;
    }
    function je(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        if ((le(a) | 0) >>> 0 < b >>> 0) jC(a);
        if (b >>> 0 > 1073741823) Ta();
        else {
            d = qC(b << 2) | 0;
            c[a + 4 >> 2] = d;
            c[a >> 2] = d;
            c[a + 8 >> 2] = d + (b << 2);
            return;
        }
    }
    function ke(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        e = a + 4 | 0;
        a = d - b | 0;
        if ((a | 0) > 0) {
            BC(c[e >> 2] | 0, b | 0, a | 0);
            c[e >> 2] = (c[e >> 2] | 0) + (a >>> 2 << 2);
        }
        return;
    }
    function le(a) {
        a = a | 0;
        return 1073741823;
    }
    function me(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        if (oe(b) | 0 ? (c[a + 96 >> 2] | 0) != 0 : 0) a = a + 92 | 0;
        else a = Tb(a + 60 | 0, c[1040 + (b << 2) >> 2] | 0, 992) | 0;
        return T(pe(a, d));
    }
    function ne(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        if (oe(b) | 0 ? (c[a + 104 >> 2] | 0) != 0 : 0) a = a + 100 | 0;
        else a = Tb(a + 60 | 0, c[1e3 + (b << 2) >> 2] | 0, 992) | 0;
        return T(pe(a, d));
    }
    function oe(a) {
        a = a | 0;
        return (a | 1) == 3 | 0;
    }
    function pe(a, b) {
        a = a | 0;
        b = T(b);
        if ((c[a + 4 >> 2] | 0) == 3) b = T(0.0);
        else b = T(be(a, b));
        return T(b);
    }
    function qe(a, b) {
        a = a | 0;
        b = b | 0;
        a = c[a >> 2] | 0;
        return ((a | 0) == 0 ? (b | 0) > 1 ? b : 1 : a) | 0;
    }
    function re(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        a: do if ((b | 0) == 2) {
            switch(a | 0){
                case 2:
                    a = 3;
                    break a;
                case 3:
                    break;
                default:
                    c = 4;
                    break a;
            }
            a = 2;
        } else c = 4;
        while (0)
        return a | 0;
    }
    function se(a, b) {
        a = a | 0;
        b = b | 0;
        var d = ib;
        if (!((oe(b) | 0 ? (c[a + 312 >> 2] | 0) != 0 : 0) ? (d = T(g[a + 308 >> 2]), d >= T(0.0)) : 0)) d = T(cC(T(g[(Tb(a + 276 | 0, c[1040 + (b << 2) >> 2] | 0, 992) | 0) >> 2]), T(0.0)));
        return T(d);
    }
    function te(a, b) {
        a = a | 0;
        b = b | 0;
        var d = ib;
        if (!((oe(b) | 0 ? (c[a + 320 >> 2] | 0) != 0 : 0) ? (d = T(g[a + 316 >> 2]), d >= T(0.0)) : 0)) d = T(cC(T(g[(Tb(a + 276 | 0, c[1e3 + (b << 2) >> 2] | 0, 992) | 0) >> 2]), T(0.0)));
        return T(d);
    }
    function ue(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = ib;
        if (!((oe(b) | 0 ? (c[a + 240 >> 2] | 0) != 0 : 0) ? (e = T(be(a + 236 | 0, d)), e >= T(0.0)) : 0)) e = T(cC(T(be(Tb(a + 204 | 0, c[1040 + (b << 2) >> 2] | 0, 992) | 0, d)), T(0.0)));
        return T(e);
    }
    function ve(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = ib;
        if (!((oe(b) | 0 ? (c[a + 248 >> 2] | 0) != 0 : 0) ? (e = T(be(a + 244 | 0, d)), e >= T(0.0)) : 0)) e = T(cC(T(be(Tb(a + 204 | 0, c[1e3 + (b << 2) >> 2] | 0, 992) | 0, d)), T(0.0)));
        return T(e);
    }
    function we(a, b, d, e, f, h, i) {
        a = a | 0;
        b = T(b);
        d = T(d);
        e = e | 0;
        f = f | 0;
        h = T(h);
        i = T(i);
        var j = ib, k = ib, m = ib, n = ib, o = ib, p = ib, q = 0, r = 0, s = 0;
        s = l;
        l = l + 16 | 0;
        q = s;
        r = a + 964 | 0;
        ec(a, (c[r >> 2] | 0) != 0, 3519);
        j = T(Ce(a, 2, b));
        k = T(Ce(a, 0, b));
        m = T(Ud(a, 2, b));
        n = T(Ud(a, 0, b));
        if (Sb(b) | 0) o = b;
        else o = T(cC(T(0.0), T(T(b - m) - j)));
        if (Sb(d) | 0) p = d;
        else p = T(cC(T(0.0), T(T(d - n) - k)));
        if ((e | 0) == 1 & (f | 0) == 1) {
            g[a + 908 >> 2] = T(Ie(a, 2, T(b - m), h, h));
            b = T(Ie(a, 0, T(d - n), i, h));
        } else {
            Db[c[r >> 2] & 1](q, a, o, e, p, f);
            o = T(j + T(g[q >> 2]));
            p = T(b - m);
            g[a + 908 >> 2] = T(Ie(a, 2, (e | 2) == 2 ? o : p, h, h));
            p = T(k + T(g[q + 4 >> 2]));
            b = T(d - n);
            b = T(Ie(a, 0, (f | 2) == 2 ? p : b, i, h));
        }
        g[a + 912 >> 2] = b;
        l = s;
        return;
    }
    function xe(a, b, c, d, e, f, h) {
        a = a | 0;
        b = T(b);
        c = T(c);
        d = d | 0;
        e = e | 0;
        f = T(f);
        h = T(h);
        var i = ib, j = ib, k = ib, l = ib;
        k = T(Ce(a, 2, f));
        i = T(Ce(a, 0, f));
        l = T(Ud(a, 2, f));
        j = T(Ud(a, 0, f));
        b = T(b - l);
        g[a + 908 >> 2] = T(Ie(a, 2, (d | 2) == 2 ? k : b, f, f));
        c = T(c - j);
        g[a + 912 >> 2] = T(Ie(a, 0, (e | 2) == 2 ? i : c, h, f));
        return;
    }
    function ye(a, b, c, d, e, f, h) {
        a = a | 0;
        b = T(b);
        c = T(c);
        d = d | 0;
        e = e | 0;
        f = T(f);
        h = T(h);
        var i = 0, j = ib, k = ib;
        i = (d | 0) == 2;
        if ((!(b <= T(0.0) & i) ? !(c <= T(0.0) & (e | 0) == 2) : 0) ? !((d | 0) == 1 & (e | 0) == 1) : 0) a = 0;
        else {
            j = T(Ud(a, 0, f));
            k = T(Ud(a, 2, f));
            i = b < T(0.0) & i | (Sb(b) | 0);
            b = T(b - k);
            g[a + 908 >> 2] = T(Ie(a, 2, i ? T(0.0) : b, f, f));
            b = T(c - j);
            i = c < T(0.0) & (e | 0) == 2 | (Sb(c) | 0);
            g[a + 912 >> 2] = T(Ie(a, 0, i ? T(0.0) : b, h, f));
            a = 1;
        }
        return a | 0;
    }
    function ze(a, b) {
        a = a | 0;
        b = b | 0;
        if (We(a) | 0) a = re(2, b) | 0;
        else a = 0;
        return a | 0;
    }
    function Ae(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        c = T(ue(a, b, c));
        return T(c + T(se(a, b)));
    }
    function Be(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        c = T(ve(a, b, c));
        return T(c + T(te(a, b)));
    }
    function Ce(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        var d = ib;
        d = T(Ae(a, b, c));
        return T(d + T(Be(a, b, c)));
    }
    function De(a) {
        a = a | 0;
        if (!(c[a + 24 >> 2] | 0)) {
            if (T(Ee(a)) != T(0.0)) a = 1;
            else a = T(Fe(a)) != T(0.0);
        } else a = 0;
        return a | 0;
    }
    function Ee(a) {
        a = a | 0;
        var b = ib;
        if (c[a + 944 >> 2] | 0) {
            b = T(g[a + 44 >> 2]);
            if (Sb(b) | 0) {
                b = T(g[a + 40 >> 2]);
                a = b > T(0.0) & ((Sb(b) | 0) ^ 1);
                return T(a ? b : T(0.0));
            }
        } else b = T(0.0);
        return T(b);
    }
    function Fe(b) {
        b = b | 0;
        var d = ib, e = 0, f = ib;
        do if (c[b + 944 >> 2] | 0) {
            d = T(g[b + 48 >> 2]);
            if (Sb(d) | 0) {
                e = a[(c[b + 976 >> 2] | 0) + 2 >> 0] | 0;
                if (e << 24 >> 24 == 0 ? (f = T(g[b + 40 >> 2]), f < T(0.0) & ((Sb(f) | 0) ^ 1)) : 0) {
                    d = T(-f);
                    break;
                }
                d = e << 24 >> 24 ? T(1.0) : T(0.0);
            }
        } else d = T(0.0);
        while (0)
        return T(d);
    }
    function Ge(b) {
        b = b | 0;
        var d = 0, e = 0;
        yC(b + 400 | 0, 0, 540);
        a[b + 985 >> 0] = 1;
        lc(b);
        e = $b(b) | 0;
        if (e | 0) {
            d = b + 948 | 0;
            b = 0;
            do {
                Ge(c[(c[d >> 2] | 0) + (b << 2) >> 2] | 0);
                b = b + 1 | 0;
            }while ((b | 0) != (e | 0))
        }
        return;
    }
    function He(a, b, d, e, f, h, i, j, k, m) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        e = e | 0;
        f = T(f);
        h = T(h);
        i = T(i);
        j = j | 0;
        k = k | 0;
        m = m | 0;
        var n = 0, o = ib, p = 0, q = 0, r = ib, s = ib, u = 0, v = ib, w = 0, x = ib, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
        G = l;
        l = l + 16 | 0;
        A = G + 12 | 0;
        B = G + 8 | 0;
        C = G + 4 | 0;
        D = G;
        F = re(c[a + 4 >> 2] | 0, k) | 0;
        y = oe(F) | 0;
        o = T(be(Xe(b) | 0, y ? h : i));
        z = ae(b, 2, h) | 0;
        E = ae(b, 0, i) | 0;
        do if (!(Sb(o) | 0) ? !(Sb(y ? d : f) | 0) : 0) {
            n = b + 504 | 0;
            if (!(Sb(T(g[n >> 2])) | 0)) {
                if (!(Ye(c[b + 976 >> 2] | 0, 0) | 0)) break;
                if ((c[b + 500 >> 2] | 0) == (c[2278] | 0)) break;
            }
            g[n >> 2] = T(cC(o, T(Ce(b, F, h))));
        } else p = 7;
        while (0)
        do if ((p | 0) == 7) {
            w = y ^ 1;
            if (!(w | z ^ 1)) {
                i = T(be(c[b + 992 >> 2] | 0, h));
                g[b + 504 >> 2] = T(cC(i, T(Ce(b, 2, h))));
                break;
            }
            if (!(y | E ^ 1)) {
                i = T(be(c[b + 996 >> 2] | 0, i));
                g[b + 504 >> 2] = T(cC(i, T(Ce(b, 0, h))));
                break;
            }
            g[A >> 2] = T(t);
            g[B >> 2] = T(t);
            c[C >> 2] = 0;
            c[D >> 2] = 0;
            v = T(Ud(b, 2, h));
            x = T(Ud(b, 0, h));
            if (z) {
                r = T(v + T(be(c[b + 992 >> 2] | 0, h)));
                g[A >> 2] = r;
                c[C >> 2] = 1;
                q = 1;
            } else {
                q = 0;
                r = T(t);
            }
            if (E) {
                o = T(x + T(be(c[b + 996 >> 2] | 0, i)));
                g[B >> 2] = o;
                c[D >> 2] = 1;
                n = 1;
            } else {
                n = 0;
                o = T(t);
            }
            p = c[a + 32 >> 2] | 0;
            if (!(y & (p | 0) == 2)) {
                if (Sb(r) | 0 ? !(Sb(d) | 0) : 0) {
                    g[A >> 2] = d;
                    c[C >> 2] = 2;
                    q = 2;
                    r = d;
                }
            } else p = 2;
            if ((!((p | 0) == 2 & w) ? Sb(o) | 0 : 0) ? !(Sb(f) | 0) : 0) {
                g[B >> 2] = f;
                c[D >> 2] = 2;
                n = 2;
                o = f;
            }
            s = T(g[b + 396 >> 2]);
            u = Sb(s) | 0;
            do if (!u) {
                if ((q | 0) == 1 & w) {
                    g[B >> 2] = T(T(r - v) / s);
                    c[D >> 2] = 1;
                    n = 1;
                    p = 1;
                    break;
                }
                if (y & (n | 0) == 1) {
                    g[A >> 2] = T(s * T(o - x));
                    c[C >> 2] = 1;
                    n = 1;
                    p = 1;
                } else p = q;
            } else p = q;
            while (0)
            H = Sb(d) | 0;
            q = (Je(a, b) | 0) != 4;
            if (!(y | z | ((e | 0) != 1 | H) | (q | (p | 0) == 1)) ? (g[A >> 2] = d, c[C >> 2] = 1, !u) : 0) {
                g[B >> 2] = T(T(d - v) / s);
                c[D >> 2] = 1;
                n = 1;
            }
            if (!(E | w | ((j | 0) != 1 | (Sb(f) | 0)) | (q | (n | 0) == 1)) ? (g[B >> 2] = f, c[D >> 2] = 1, !u) : 0) {
                g[A >> 2] = T(s * T(f - x));
                c[C >> 2] = 1;
            }
            Me(b, 2, h, h, C, A);
            Me(b, 0, i, h, D, B);
            d = T(g[A >> 2]);
            f = T(g[B >> 2]);
            Td(b, d, f, k, c[C >> 2] | 0, c[D >> 2] | 0, h, i, 0, 3565, m);
            i = T(g[b + 908 + (c[976 + (F << 2) >> 2] << 2) >> 2]);
            g[b + 504 >> 2] = T(cC(i, T(Ce(b, F, h))));
        }
        while (0)
        c[b + 500 >> 2] = c[2278];
        l = G;
        return;
    }
    function Ie(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        d = T(d);
        e = T(e);
        d = T(Te(a, b, c, d));
        return T(cC(d, T(Ce(a, b, e))));
    }
    function Je(a, b) {
        a = a | 0;
        b = b | 0;
        b = b + 20 | 0;
        b = c[((c[b >> 2] | 0) == 0 ? a + 16 | 0 : b) >> 2] | 0;
        if ((b | 0) == 5 ? We(c[a + 4 >> 2] | 0) | 0 : 0) b = 1;
        return b | 0;
    }
    function Ke(a, b) {
        a = a | 0;
        b = b | 0;
        if (oe(b) | 0 ? (c[a + 96 >> 2] | 0) != 0 : 0) b = 4;
        else b = c[1040 + (b << 2) >> 2] | 0;
        return a + 60 + (b << 3) | 0;
    }
    function Le(a, b) {
        a = a | 0;
        b = b | 0;
        if (oe(b) | 0 ? (c[a + 104 >> 2] | 0) != 0 : 0) b = 5;
        else b = c[1e3 + (b << 2) >> 2] | 0;
        return a + 60 + (b << 3) | 0;
    }
    function Me(a, b, d, e, f, h) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        e = T(e);
        f = f | 0;
        h = h | 0;
        d = T(be(a + 380 + (c[976 + (b << 2) >> 2] << 3) | 0, d));
        d = T(d + T(Ud(a, b, e)));
        switch(c[f >> 2] | 0){
            case 2:
            case 1:
                f = Sb(d) | 0;
                e = T(g[h >> 2]);
                g[h >> 2] = f | e < d ? e : d;
                break;
            case 0:
                if (!(Sb(d) | 0)) {
                    c[f >> 2] = 2;
                    g[h >> 2] = d;
                }
                break;
            default:
        }
        return;
    }
    function Ne(a, b) {
        a = a | 0;
        b = b | 0;
        a = a + 132 | 0;
        if (oe(b) | 0 ? (c[(Tb(a, 4, 948) | 0) + 4 >> 2] | 0) != 0 : 0) a = 1;
        else a = (c[(Tb(a, c[1040 + (b << 2) >> 2] | 0, 948) | 0) + 4 >> 2] | 0) != 0;
        return a | 0;
    }
    function Oe(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0, f = 0;
        a = a + 132 | 0;
        if (oe(b) | 0 ? (e = Tb(a, 4, 948) | 0, (c[e + 4 >> 2] | 0) != 0) : 0) f = 4;
        else {
            e = Tb(a, c[1040 + (b << 2) >> 2] | 0, 948) | 0;
            if (!(c[e + 4 >> 2] | 0)) d = T(0.0);
            else f = 4;
        }
        if ((f | 0) == 4) d = T(be(e, d));
        return T(d);
    }
    function Pe(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = ib;
        e = T(g[a + 908 + (c[976 + (b << 2) >> 2] << 2) >> 2]);
        e = T(e + T(me(a, b, d)));
        return T(e + T(ne(a, b, d)));
    }
    function Qe(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        a: do if (!(We(c[a + 4 >> 2] | 0) | 0)) {
            if ((c[a + 16 >> 2] | 0) != 5) {
                d = $b(a) | 0;
                if (!d) b = 0;
                else {
                    b = 0;
                    while(true){
                        e = ac(a, b) | 0;
                        if ((c[e + 24 >> 2] | 0) == 0 ? (c[e + 20 >> 2] | 0) == 5 : 0) {
                            b = 1;
                            break a;
                        }
                        b = b + 1 | 0;
                        if (b >>> 0 >= d >>> 0) {
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
    function Re(a, b) {
        a = a | 0;
        b = b | 0;
        var d = ib;
        d = T(g[a + 908 + (c[976 + (b << 2) >> 2] << 2) >> 2]);
        return d >= T(0.0) & ((Sb(d) | 0) ^ 1) | 0;
    }
    function Se(a) {
        a = a | 0;
        var b = ib, d = 0, e = 0, f = 0, h = 0, i = 0, j = 0, k = ib;
        d = c[a + 968 >> 2] | 0;
        if (!d) {
            h = $b(a) | 0;
            do if (h | 0) {
                d = 0;
                f = 0;
                while(true){
                    e = ac(a, f) | 0;
                    if (c[e + 940 >> 2] | 0) {
                        i = 8;
                        break;
                    }
                    if ((c[e + 24 >> 2] | 0) != 1) {
                        j = (Je(a, e) | 0) == 5;
                        if (j) {
                            d = e;
                            break;
                        } else d = (d | 0) == 0 ? e : d;
                    }
                    f = f + 1 | 0;
                    if (f >>> 0 >= h >>> 0) {
                        i = 8;
                        break;
                    }
                }
                if ((i | 0) == 8) {
                    if (!d) break;
                }
                b = T(Se(d));
                return T(b + T(g[d + 404 >> 2]));
            }
            while (0)
            b = T(g[a + 912 >> 2]);
        } else {
            k = T(g[a + 908 >> 2]);
            b = T(g[a + 912 >> 2]);
            b = T(mb[d & 0](a, k, b));
            ec(a, (Sb(b) | 0) ^ 1, 3573);
        }
        return T(b);
    }
    function Te(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        d = T(d);
        var e = ib, f = 0;
        if (!(We(b) | 0)) {
            if (oe(b) | 0) {
                b = 0;
                f = 3;
            } else {
                d = T(t);
                e = T(t);
            }
        } else {
            b = 1;
            f = 3;
        }
        if ((f | 0) == 3) {
            e = T(be(a + 364 + (b << 3) | 0, d));
            d = T(be(a + 380 + (b << 3) | 0, d));
        }
        f = d < c & (d >= T(0.0) & ((Sb(d) | 0) ^ 1));
        c = f ? d : c;
        f = e >= T(0.0) & ((Sb(e) | 0) ^ 1) & c < e;
        return T(f ? e : c);
    }
    function Ue(a, b, d, e, f, h, i) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        e = e | 0;
        f = T(f);
        h = h | 0;
        i = i | 0;
        var j = ib, k = ib, l = 0, m = 0, n = ib, o = ib, p = ib, q = 0, r = 0, s = 0, u = 0, v = ib, w = 0;
        s = re(c[a + 4 >> 2] | 0, h) | 0;
        q = ze(s, h) | 0;
        r = oe(s) | 0;
        n = T(Ud(b, 2, d));
        o = T(Ud(b, 0, d));
        if (!(ae(b, 2, d) | 0)) {
            if (Ne(b, 2) | 0 ? Ze(b, 2) | 0 : 0) {
                j = T(g[a + 908 >> 2]);
                k = T(se(a, 2));
                k = T(j - T(k + T(te(a, 2))));
                j = T(Oe(b, 2, d));
                j = T(Ie(b, 2, T(k - T(j + T(_e(b, 2, d)))), d, d));
            } else j = T(t);
        } else j = T(n + T(be(c[b + 992 >> 2] | 0, d)));
        if (!(ae(b, 0, f) | 0)) {
            if (Ne(b, 0) | 0 ? Ze(b, 0) | 0 : 0) {
                k = T(g[a + 912 >> 2]);
                v = T(se(a, 0));
                v = T(k - T(v + T(te(a, 0))));
                k = T(Oe(b, 0, f));
                k = T(Ie(b, 0, T(v - T(k + T(_e(b, 0, f)))), f, d));
            } else k = T(t);
        } else k = T(o + T(be(c[b + 996 >> 2] | 0, f)));
        l = Sb(j) | 0;
        m = Sb(k) | 0;
        do if (l ^ m ? (p = T(g[b + 396 >> 2]), !(Sb(p) | 0)) : 0) {
            if (l) {
                j = T(n + T(T(k - o) * p));
                break;
            } else {
                v = T(o + T(T(j - n) / p));
                k = m ? v : k;
                break;
            }
        }
        while (0)
        m = Sb(j) | 0;
        l = Sb(k) | 0;
        if (m | l) {
            w = (m ^ 1) & 1;
            e = d > T(0.0) & ((e | 0) != 0 & m);
            j = r ? j : e ? d : j;
            Td(b, j, k, h, r ? w : e ? 2 : w, m & (l ^ 1) & 1, j, k, 0, 3623, i);
            j = T(g[b + 908 >> 2]);
            j = T(j + T(Ud(b, 2, d)));
            k = T(g[b + 912 >> 2]);
            k = T(k + T(Ud(b, 0, d)));
        }
        Td(b, j, k, h, 1, 1, j, k, 1, 3635, i);
        if (Ze(b, s) | 0 ? !(Ne(b, s) | 0) : 0) {
            w = c[976 + (s << 2) >> 2] | 0;
            v = T(g[a + 908 + (w << 2) >> 2]);
            v = T(v - T(g[b + 908 + (w << 2) >> 2]));
            v = T(v - T(te(a, s)));
            v = T(v - T(ne(b, s, d)));
            v = T(v - T(_e(b, s, r ? d : f)));
            g[b + 400 + (c[1040 + (s << 2) >> 2] << 2) >> 2] = v;
        } else u = 21;
        do if ((u | 0) == 21) {
            if (!(Ne(b, s) | 0) ? (c[a + 8 >> 2] | 0) == 1 : 0) {
                w = c[976 + (s << 2) >> 2] | 0;
                v = T(g[a + 908 + (w << 2) >> 2]);
                v = T(T(v - T(g[b + 908 + (w << 2) >> 2])) * T(0.5));
                g[b + 400 + (c[1040 + (s << 2) >> 2] << 2) >> 2] = v;
                break;
            }
            if (!(Ne(b, s) | 0) ? (c[a + 8 >> 2] | 0) == 2 : 0) {
                w = c[976 + (s << 2) >> 2] | 0;
                v = T(g[a + 908 + (w << 2) >> 2]);
                v = T(v - T(g[b + 908 + (w << 2) >> 2]));
                g[b + 400 + (c[1040 + (s << 2) >> 2] << 2) >> 2] = v;
            }
        }
        while (0)
        if (Ze(b, q) | 0 ? !(Ne(b, q) | 0) : 0) {
            w = c[976 + (q << 2) >> 2] | 0;
            v = T(g[a + 908 + (w << 2) >> 2]);
            v = T(v - T(g[b + 908 + (w << 2) >> 2]));
            v = T(v - T(te(a, q)));
            v = T(v - T(ne(b, q, d)));
            v = T(v - T(_e(b, q, r ? f : d)));
            g[b + 400 + (c[1040 + (q << 2) >> 2] << 2) >> 2] = v;
        } else u = 30;
        do if ((u | 0) == 30 ? !(Ne(b, q) | 0) : 0) {
            if ((Je(a, b) | 0) == 2) {
                w = c[976 + (q << 2) >> 2] | 0;
                v = T(g[a + 908 + (w << 2) >> 2]);
                v = T(T(v - T(g[b + 908 + (w << 2) >> 2])) * T(0.5));
                g[b + 400 + (c[1040 + (q << 2) >> 2] << 2) >> 2] = v;
                break;
            }
            w = (Je(a, b) | 0) == 3;
            if (w ^ (c[a + 28 >> 2] | 0) == 2) {
                w = c[976 + (q << 2) >> 2] | 0;
                v = T(g[a + 908 + (w << 2) >> 2]);
                v = T(v - T(g[b + 908 + (w << 2) >> 2]));
                g[b + 400 + (c[1040 + (q << 2) >> 2] << 2) >> 2] = v;
            }
        }
        while (0)
        return;
    }
    function Ve(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = ib, f = 0;
        f = c[976 + (d << 2) >> 2] | 0;
        e = T(g[b + 908 + (f << 2) >> 2]);
        e = T(T(g[a + 908 + (f << 2) >> 2]) - e);
        e = T(e - T(g[b + 400 + (c[1040 + (d << 2) >> 2] << 2) >> 2]));
        g[b + 400 + (c[1e3 + (d << 2) >> 2] << 2) >> 2] = e;
        return;
    }
    function We(a) {
        a = a | 0;
        return (a | 1) == 1 | 0;
    }
    function Xe(b) {
        b = b | 0;
        var d = ib;
        switch(c[b + 56 >> 2] | 0){
            case 0:
            case 3:
                d = T(g[b + 40 >> 2]);
                if (d > T(0.0) & ((Sb(d) | 0) ^ 1)) b = a[(c[b + 976 >> 2] | 0) + 2 >> 0] | 0 ? 1056 : 992;
                else b = 1056;
                break;
            default:
                b = b + 52 | 0;
        }
        return b | 0;
    }
    function Ye(b, c) {
        b = b | 0;
        c = c | 0;
        return (a[b + c >> 0] | 0) != 0 | 0;
    }
    function Ze(a, b) {
        a = a | 0;
        b = b | 0;
        a = a + 132 | 0;
        if (oe(b) | 0 ? (c[(Tb(a, 5, 948) | 0) + 4 >> 2] | 0) != 0 : 0) a = 1;
        else a = (c[(Tb(a, c[1e3 + (b << 2) >> 2] | 0, 948) | 0) + 4 >> 2] | 0) != 0;
        return a | 0;
    }
    function _e(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = T(d);
        var e = 0, f = 0;
        a = a + 132 | 0;
        if (oe(b) | 0 ? (e = Tb(a, 5, 948) | 0, (c[e + 4 >> 2] | 0) != 0) : 0) f = 4;
        else {
            e = Tb(a, c[1e3 + (b << 2) >> 2] | 0, 948) | 0;
            if (!(c[e + 4 >> 2] | 0)) d = T(0.0);
            else f = 4;
        }
        if ((f | 0) == 4) d = T(be(e, d));
        return T(d);
    }
    function $e(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        if (Ne(a, b) | 0) c = T(Oe(a, b, c));
        else c = T(-T(_e(a, b, c)));
        return T(c);
    }
    function af(a) {
        a = T(a);
        return (g[j >> 2] = a, c[j >> 2] | 0) | 0;
    }
    function bf(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 1073741823) Ta();
            else {
                f = qC(b << 2) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 2) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 2);
        return;
    }
    function cf(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 2) << 2) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function df(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -4 - b | 0) >>> 2) << 2);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function ef(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0;
        h = a + 4 | 0;
        i = c[h >> 2] | 0;
        f = i - e | 0;
        g = f >> 2;
        a = b + (g << 2) | 0;
        if (a >>> 0 < d >>> 0) {
            e = i;
            do {
                c[e >> 2] = c[a >> 2];
                a = a + 4 | 0;
                e = (c[h >> 2] | 0) + 4 | 0;
                c[h >> 2] = e;
            }while (a >>> 0 < d >>> 0)
        }
        if (g | 0) GC(i + (0 - g << 2) | 0, b | 0, f | 0);
        return;
    }
    function ff(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = b + 4 | 0;
        j = c[i >> 2] | 0;
        f = c[a >> 2] | 0;
        h = d;
        g = h - f | 0;
        e = j + (0 - (g >> 2) << 2) | 0;
        c[i >> 2] = e;
        if ((g | 0) > 0) BC(e | 0, f | 0, g | 0);
        f = a + 4 | 0;
        g = b + 8 | 0;
        e = (c[f >> 2] | 0) - h | 0;
        if ((e | 0) > 0) {
            BC(c[g >> 2] | 0, d | 0, e | 0);
            c[g >> 2] = (c[g >> 2] | 0) + (e >>> 2 << 2);
        }
        h = c[a >> 2] | 0;
        c[a >> 2] = c[i >> 2];
        c[i >> 2] = h;
        h = c[f >> 2] | 0;
        c[f >> 2] = c[g >> 2];
        c[g >> 2] = h;
        h = a + 8 | 0;
        d = b + 12 | 0;
        a = c[h >> 2] | 0;
        c[h >> 2] = c[d >> 2];
        c[d >> 2] = a;
        c[b >> 2] = c[i >> 2];
        return j | 0;
    }
    function gf(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        h = c[b >> 2] | 0;
        g = c[d >> 2] | 0;
        if ((h | 0) != (g | 0)) {
            f = a + 8 | 0;
            d = ((g + -4 - h | 0) >>> 2) + 1 | 0;
            a = h;
            e = c[f >> 2] | 0;
            do {
                c[e >> 2] = c[a >> 2];
                e = (c[f >> 2] | 0) + 4 | 0;
                c[f >> 2] = e;
                a = a + 4 | 0;
            }while ((a | 0) != (g | 0))
            c[b >> 2] = h + (d << 2);
        }
        return;
    }
    function hf() {
        Qb();
        return;
    }
    function jf() {
        var a = 0;
        a = qC(4) | 0;
        kf(a);
        return a | 0;
    }
    function kf(a) {
        a = a | 0;
        c[a >> 2] = gc() | 0;
        return;
    }
    function lf(a) {
        a = a | 0;
        if (a | 0) {
            mf(a);
            sC(a);
        }
        return;
    }
    function mf(a) {
        a = a | 0;
        ic(c[a >> 2] | 0);
        return;
    }
    function nf(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        he(c[a >> 2] | 0, b, d);
        return;
    }
    function of(a, b) {
        a = a | 0;
        b = T(b);
        Zd(c[a >> 2] | 0, b);
        return;
    }
    function pf(a, b) {
        a = a | 0;
        b = b | 0;
        return Ye(c[a >> 2] | 0, b) | 0;
    }
    function qf() {
        var a = 0;
        a = qC(8) | 0;
        rf(a, 0);
        return a | 0;
    }
    function rf(a, b) {
        a = a | 0;
        b = b | 0;
        if (!b) b = Wb() | 0;
        else b = Ub(c[b >> 2] | 0) | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = 0;
        vc(b, a);
        return;
    }
    function sf(a) {
        a = a | 0;
        var b = 0;
        b = qC(8) | 0;
        rf(b, a);
        return b | 0;
    }
    function tf(a) {
        a = a | 0;
        if (a | 0) {
            uf(a);
            sC(a);
        }
        return;
    }
    function uf(a) {
        a = a | 0;
        var b = 0;
        Zb(c[a >> 2] | 0);
        b = a + 4 | 0;
        a = c[b >> 2] | 0;
        c[b >> 2] = 0;
        if (a | 0) {
            vf(a);
            sC(a);
        }
        return;
    }
    function vf(a) {
        a = a | 0;
        wf(a);
        return;
    }
    function wf(a) {
        a = a | 0;
        a = c[a >> 2] | 0;
        if (a | 0) ab(a | 0);
        return;
    }
    function xf(a) {
        a = a | 0;
        return wc(a) | 0;
    }
    function yf(a) {
        a = a | 0;
        var b = 0, d = 0;
        d = a + 4 | 0;
        b = c[d >> 2] | 0;
        c[d >> 2] = 0;
        if (b | 0) {
            vf(b);
            sC(b);
        }
        dc(c[a >> 2] | 0);
        return;
    }
    function zf(a, b) {
        a = a | 0;
        b = b | 0;
        sc(c[a >> 2] | 0, c[b >> 2] | 0);
        return;
    }
    function Af(a, b) {
        a = a | 0;
        b = b | 0;
        Hc(c[a >> 2] | 0, b);
        return;
    }
    function Bf(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        Vc(c[a >> 2] | 0, b, T(d));
        return;
    }
    function Cf(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        Wc(c[a >> 2] | 0, b, T(d));
        return;
    }
    function Df(a, b) {
        a = a | 0;
        b = b | 0;
        Bc(c[a >> 2] | 0, b);
        return;
    }
    function Ef(a, b) {
        a = a | 0;
        b = b | 0;
        Dc(c[a >> 2] | 0, b);
        return;
    }
    function Ff(a, b) {
        a = a | 0;
        b = b | 0;
        Fc(c[a >> 2] | 0, b);
        return;
    }
    function Gf(a, b) {
        a = a | 0;
        b = b | 0;
        xc(c[a >> 2] | 0, b);
        return;
    }
    function Hf(a, b) {
        a = a | 0;
        b = b | 0;
        Jc(c[a >> 2] | 0, b);
        return;
    }
    function If(a, b) {
        a = a | 0;
        b = b | 0;
        zc(c[a >> 2] | 0, b);
        return;
    }
    function Jf(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        Yc(c[a >> 2] | 0, b, T(d));
        return;
    }
    function Kf(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        Zc(c[a >> 2] | 0, b, T(d));
        return;
    }
    function Lf(a, b) {
        a = a | 0;
        b = b | 0;
        $c(c[a >> 2] | 0, b);
        return;
    }
    function Mf(a, b) {
        a = a | 0;
        b = b | 0;
        Lc(c[a >> 2] | 0, b);
        return;
    }
    function Nf(a, b) {
        a = a | 0;
        b = b | 0;
        Nc(c[a >> 2] | 0, b);
        return;
    }
    function Of(a, b) {
        a = a | 0;
        b = +b;
        Pc(c[a >> 2] | 0, T(b));
        return;
    }
    function Pf(a, b) {
        a = a | 0;
        b = +b;
        Sc(c[a >> 2] | 0, T(b));
        return;
    }
    function Qf(a, b) {
        a = a | 0;
        b = +b;
        Tc(c[a >> 2] | 0, T(b));
        return;
    }
    function Rf(a, b) {
        a = a | 0;
        b = +b;
        Qc(c[a >> 2] | 0, T(b));
        return;
    }
    function Sf(a, b) {
        a = a | 0;
        b = +b;
        Rc(c[a >> 2] | 0, T(b));
        return;
    }
    function Tf(a, b) {
        a = a | 0;
        b = +b;
        fd(c[a >> 2] | 0, T(b));
        return;
    }
    function Uf(a, b) {
        a = a | 0;
        b = +b;
        gd(c[a >> 2] | 0, T(b));
        return;
    }
    function Vf(a) {
        a = a | 0;
        hd(c[a >> 2] | 0);
        return;
    }
    function Wf(a, b) {
        a = a | 0;
        b = +b;
        jd(c[a >> 2] | 0, T(b));
        return;
    }
    function Xf(a, b) {
        a = a | 0;
        b = +b;
        kd(c[a >> 2] | 0, T(b));
        return;
    }
    function Yf(a) {
        a = a | 0;
        ld(c[a >> 2] | 0);
        return;
    }
    function Zf(a, b) {
        a = a | 0;
        b = +b;
        nd(c[a >> 2] | 0, T(b));
        return;
    }
    function _f(a, b) {
        a = a | 0;
        b = +b;
        od(c[a >> 2] | 0, T(b));
        return;
    }
    function $f(a, b) {
        a = a | 0;
        b = +b;
        qd(c[a >> 2] | 0, T(b));
        return;
    }
    function ag(a, b) {
        a = a | 0;
        b = +b;
        rd(c[a >> 2] | 0, T(b));
        return;
    }
    function bg(a, b) {
        a = a | 0;
        b = +b;
        td(c[a >> 2] | 0, T(b));
        return;
    }
    function cg(a, b) {
        a = a | 0;
        b = +b;
        ud(c[a >> 2] | 0, T(b));
        return;
    }
    function dg(a, b) {
        a = a | 0;
        b = +b;
        wd(c[a >> 2] | 0, T(b));
        return;
    }
    function eg(a, b) {
        a = a | 0;
        b = +b;
        xd(c[a >> 2] | 0, T(b));
        return;
    }
    function fg(a, b) {
        a = a | 0;
        b = +b;
        zd(c[a >> 2] | 0, T(b));
        return;
    }
    function gg(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        dd(c[a >> 2] | 0, b, T(d));
        return;
    }
    function hg(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        ad(c[a >> 2] | 0, b, T(d));
        return;
    }
    function ig(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        bd(c[a >> 2] | 0, b, T(d));
        return;
    }
    function jg(a) {
        a = a | 0;
        return Ic(c[a >> 2] | 0) | 0;
    }
    function kg(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0;
        e = l;
        l = l + 16 | 0;
        f = e;
        Xc(f, c[b >> 2] | 0, d);
        lg(a, f);
        l = e;
        return;
    }
    function lg(a, b) {
        a = a | 0;
        b = b | 0;
        mg(a, c[b + 4 >> 2] | 0, +T(g[b >> 2]));
        return;
    }
    function mg(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        c[a >> 2] = b;
        h[a + 8 >> 3] = d;
        return;
    }
    function ng(a) {
        a = a | 0;
        return Cc(c[a >> 2] | 0) | 0;
    }
    function og(a) {
        a = a | 0;
        return Ec(c[a >> 2] | 0) | 0;
    }
    function pg(a) {
        a = a | 0;
        return Gc(c[a >> 2] | 0) | 0;
    }
    function qg(a) {
        a = a | 0;
        return yc(c[a >> 2] | 0) | 0;
    }
    function rg(a) {
        a = a | 0;
        return Kc(c[a >> 2] | 0) | 0;
    }
    function sg(a) {
        a = a | 0;
        return Ac(c[a >> 2] | 0) | 0;
    }
    function tg(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0;
        e = l;
        l = l + 16 | 0;
        f = e;
        _c(f, c[b >> 2] | 0, d);
        lg(a, f);
        l = e;
        return;
    }
    function ug(a) {
        a = a | 0;
        return Mc(c[a >> 2] | 0) | 0;
    }
    function vg(a) {
        a = a | 0;
        return Oc(c[a >> 2] | 0) | 0;
    }
    function wg(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        Uc(e, c[b >> 2] | 0);
        lg(a, e);
        l = d;
        return;
    }
    function xg(a) {
        a = a | 0;
        return + +T(tc(c[a >> 2] | 0));
    }
    function yg(a) {
        a = a | 0;
        return + +T(uc(c[a >> 2] | 0));
    }
    function zg(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        id(e, c[b >> 2] | 0);
        lg(a, e);
        l = d;
        return;
    }
    function Ag(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        md(e, c[b >> 2] | 0);
        lg(a, e);
        l = d;
        return;
    }
    function Bg(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        pd(e, c[b >> 2] | 0);
        lg(a, e);
        l = d;
        return;
    }
    function Cg(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        sd(e, c[b >> 2] | 0);
        lg(a, e);
        l = d;
        return;
    }
    function Dg(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        vd(e, c[b >> 2] | 0);
        lg(a, e);
        l = d;
        return;
    }
    function Eg(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        yd(e, c[b >> 2] | 0);
        lg(a, e);
        l = d;
        return;
    }
    function Fg(a) {
        a = a | 0;
        return + +T(Ad(c[a >> 2] | 0));
    }
    function Gg(a, b) {
        a = a | 0;
        b = b | 0;
        return + +T(ed(c[a >> 2] | 0, b));
    }
    function Hg(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0;
        e = l;
        l = l + 16 | 0;
        f = e;
        cd(f, c[b >> 2] | 0, d);
        lg(a, f);
        l = e;
        return;
    }
    function Ig(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        kc(c[a >> 2] | 0, c[b >> 2] | 0, d);
        return;
    }
    function Jg(a, b) {
        a = a | 0;
        b = b | 0;
        cc(c[a >> 2] | 0, c[b >> 2] | 0);
        return;
    }
    function Kg(a) {
        a = a | 0;
        return $b(c[a >> 2] | 0) | 0;
    }
    function Lg(a) {
        a = a | 0;
        a = pc(c[a >> 2] | 0) | 0;
        if (!a) a = 0;
        else a = xf(a) | 0;
        return a | 0;
    }
    function Mg(a, b) {
        a = a | 0;
        b = b | 0;
        a = ac(c[a >> 2] | 0, b) | 0;
        if (!a) a = 0;
        else a = xf(a) | 0;
        return a | 0;
    }
    function Ng(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        e = qC(4) | 0;
        Og(e, b);
        d = a + 4 | 0;
        b = c[d >> 2] | 0;
        c[d >> 2] = e;
        if (b | 0) {
            vf(b);
            sC(b);
        }
        jc(c[a >> 2] | 0, 1);
        return;
    }
    function Og(a, b) {
        a = a | 0;
        b = b | 0;
        gh(a, b);
        return;
    }
    function Pg(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        d = d | 0;
        e = T(e);
        f = f | 0;
        var i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        j = i;
        Qg(j, wc(b) | 0, +c, d, +e, f);
        g[a >> 2] = T(+h[j >> 3]);
        g[a + 4 >> 2] = T(+h[j + 8 >> 3]);
        l = i;
        return;
    }
    function Qg(a, b, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        d = +d;
        e = e | 0;
        f = +f;
        g = g | 0;
        var i = 0, j = 0, k = 0, m = 0, n = 0;
        i = l;
        l = l + 32 | 0;
        n = i + 8 | 0;
        m = i + 20 | 0;
        k = i;
        j = i + 16 | 0;
        h[n >> 3] = d;
        c[m >> 2] = e;
        h[k >> 3] = f;
        c[j >> 2] = g;
        Rg(a, c[b + 4 >> 2] | 0, n, m, k, j);
        l = i;
        return;
    }
    function Rg(a, b, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        j = i;
        UA(j);
        b = Sg(b) | 0;
        Tg(a, b, +h[d >> 3], c[e >> 2] | 0, +h[f >> 3], c[g >> 2] | 0);
        WA(j);
        l = i;
        return;
    }
    function Sg(a) {
        a = a | 0;
        return c[a >> 2] | 0;
    }
    function Tg(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = d | 0;
        e = +e;
        f = f | 0;
        var g = 0;
        g = Vg(Ug() | 0) | 0;
        c = +Wg(c);
        d = Xg(d) | 0;
        e = +Wg(e);
        Yg(a, cb(0, g | 0, b | 0, +c, d | 0, +e, Xg(f) | 0) | 0);
        return;
    }
    function Ug() {
        var b = 0;
        if (!(a[7608] | 0)) {
            dh(9120);
            b = 7608;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 9120;
    }
    function Vg(a) {
        a = a | 0;
        return c[a + 8 >> 2] | 0;
    }
    function Wg(a) {
        a = +a;
        return + +ch(a);
    }
    function Xg(a) {
        a = a | 0;
        return bh(a) | 0;
    }
    function Yg(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0;
        f = l;
        l = l + 32 | 0;
        d = f;
        e = b;
        if (!(e & 1)) {
            c[a >> 2] = c[b >> 2];
            c[a + 4 >> 2] = c[b + 4 >> 2];
            c[a + 8 >> 2] = c[b + 8 >> 2];
            c[a + 12 >> 2] = c[b + 12 >> 2];
        } else {
            Zg(d, 0);
            Ja(e | 0, d | 0);
            _g(a, d);
            $g(d);
        }
        l = f;
        return;
    }
    function Zg(b, d) {
        b = b | 0;
        d = d | 0;
        ah(b, d);
        c[b + 8 >> 2] = 0;
        a[b + 24 >> 0] = 0;
        return;
    }
    function _g(a, b) {
        a = a | 0;
        b = b | 0;
        b = b + 8 | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = c[b + 4 >> 2];
        c[a + 8 >> 2] = c[b + 8 >> 2];
        c[a + 12 >> 2] = c[b + 12 >> 2];
        return;
    }
    function $g(b) {
        b = b | 0;
        a[b + 24 >> 0] = 0;
        return;
    }
    function ah(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = b;
        return;
    }
    function bh(a) {
        a = a | 0;
        return a | 0;
    }
    function ch(a) {
        a = +a;
        return +a;
    }
    function dh(a) {
        a = a | 0;
        fh(a, eh() | 0, 4);
        return;
    }
    function eh() {
        return 1064;
    }
    function fh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        c[a + 8 >> 2] = _a(b | 0, d + 1 | 0) | 0;
        return;
    }
    function gh(a, b) {
        a = a | 0;
        b = b | 0;
        b = c[b >> 2] | 0;
        c[a >> 2] = b;
        Aa(b | 0);
        return;
    }
    function hh(a) {
        a = a | 0;
        var b = 0, d = 0;
        d = a + 4 | 0;
        b = c[d >> 2] | 0;
        c[d >> 2] = 0;
        if (b | 0) {
            vf(b);
            sC(b);
        }
        jc(c[a >> 2] | 0, 0);
        return;
    }
    function ih(a) {
        a = a | 0;
        qc(c[a >> 2] | 0);
        return;
    }
    function jh(a) {
        a = a | 0;
        return rc(c[a >> 2] | 0) | 0;
    }
    function kh(a, b, d, e) {
        a = a | 0;
        b = +b;
        d = +d;
        e = e | 0;
        _d(c[a >> 2] | 0, T(b), T(d), e);
        return;
    }
    function lh(a) {
        a = a | 0;
        return + +T(Bd(c[a >> 2] | 0));
    }
    function mh(a) {
        a = a | 0;
        return + +T(Dd(c[a >> 2] | 0));
    }
    function nh(a) {
        a = a | 0;
        return + +T(Cd(c[a >> 2] | 0));
    }
    function oh(a) {
        a = a | 0;
        return + +T(Ed(c[a >> 2] | 0));
    }
    function ph(a) {
        a = a | 0;
        return + +T(Fd(c[a >> 2] | 0));
    }
    function qh(a) {
        a = a | 0;
        return + +T(Gd(c[a >> 2] | 0));
    }
    function rh(a, b) {
        a = a | 0;
        b = b | 0;
        h[a >> 3] = +T(Bd(c[b >> 2] | 0));
        h[a + 8 >> 3] = +T(Dd(c[b >> 2] | 0));
        h[a + 16 >> 3] = +T(Cd(c[b >> 2] | 0));
        h[a + 24 >> 3] = +T(Ed(c[b >> 2] | 0));
        h[a + 32 >> 3] = +T(Fd(c[b >> 2] | 0));
        h[a + 40 >> 3] = +T(Gd(c[b >> 2] | 0));
        return;
    }
    function sh(a, b) {
        a = a | 0;
        b = b | 0;
        return + +T(Hd(c[a >> 2] | 0, b));
    }
    function th(a, b) {
        a = a | 0;
        b = b | 0;
        return + +T(Id(c[a >> 2] | 0, b));
    }
    function uh(a, b) {
        a = a | 0;
        b = b | 0;
        return + +T(Jd(c[a >> 2] | 0, b));
    }
    function vh() {
        return fc() | 0;
    }
    function wh() {
        xh();
        yh();
        zh();
        Ah();
        Bh();
        Ch();
        return;
    }
    function xh() {
        kv(11713, 4938, 1);
        return;
    }
    function yh() {
        yu(10448);
        return;
    }
    function zh() {
        eu(10408);
        return;
    }
    function Ah() {
        vt(10324);
        return;
    }
    function Bh() {
        or(10096);
        return;
    }
    function Ch() {
        Dh(9132);
        return;
    }
    function Dh(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, _ = 0, $ = 0, aa = 0, ba = 0, ca = 0, da = 0, ea = 0, fa = 0, ga = 0, ha = 0, ia = 0, ja = 0, ka = 0, la = 0, ma = 0, na = 0, oa = 0, pa = 0, qa = 0, ra = 0, sa = 0, ta = 0, ua = 0, va = 0, wa = 0, xa = 0, ya = 0, za = 0, Aa = 0, Ba = 0, Ca = 0, Da = 0, Ea = 0, Fa = 0, Ga = 0;
        b = l;
        l = l + 672 | 0;
        d = b + 656 | 0;
        Ga = b + 648 | 0;
        Fa = b + 640 | 0;
        Ea = b + 632 | 0;
        Da = b + 624 | 0;
        Ca = b + 616 | 0;
        Ba = b + 608 | 0;
        Aa = b + 600 | 0;
        za = b + 592 | 0;
        ya = b + 584 | 0;
        xa = b + 576 | 0;
        wa = b + 568 | 0;
        va = b + 560 | 0;
        ua = b + 552 | 0;
        ta = b + 544 | 0;
        sa = b + 536 | 0;
        ra = b + 528 | 0;
        qa = b + 520 | 0;
        pa = b + 512 | 0;
        oa = b + 504 | 0;
        na = b + 496 | 0;
        ma = b + 488 | 0;
        la = b + 480 | 0;
        ka = b + 472 | 0;
        ja = b + 464 | 0;
        ia = b + 456 | 0;
        ha = b + 448 | 0;
        ga = b + 440 | 0;
        fa = b + 432 | 0;
        ea = b + 424 | 0;
        da = b + 416 | 0;
        ca = b + 408 | 0;
        ba = b + 400 | 0;
        aa = b + 392 | 0;
        $ = b + 384 | 0;
        _ = b + 376 | 0;
        Z = b + 368 | 0;
        Y = b + 360 | 0;
        X = b + 352 | 0;
        W = b + 344 | 0;
        V = b + 336 | 0;
        U = b + 328 | 0;
        T = b + 320 | 0;
        S = b + 312 | 0;
        R = b + 304 | 0;
        Q = b + 296 | 0;
        P = b + 288 | 0;
        O = b + 280 | 0;
        N = b + 272 | 0;
        M = b + 264 | 0;
        L = b + 256 | 0;
        K = b + 248 | 0;
        J = b + 240 | 0;
        I = b + 232 | 0;
        H = b + 224 | 0;
        G = b + 216 | 0;
        F = b + 208 | 0;
        E = b + 200 | 0;
        D = b + 192 | 0;
        C = b + 184 | 0;
        B = b + 176 | 0;
        A = b + 168 | 0;
        z = b + 160 | 0;
        y = b + 152 | 0;
        x = b + 144 | 0;
        w = b + 136 | 0;
        v = b + 128 | 0;
        u = b + 120 | 0;
        t = b + 112 | 0;
        s = b + 104 | 0;
        r = b + 96 | 0;
        q = b + 88 | 0;
        p = b + 80 | 0;
        o = b + 72 | 0;
        n = b + 64 | 0;
        m = b + 56 | 0;
        k = b + 48 | 0;
        j = b + 40 | 0;
        i = b + 32 | 0;
        h = b + 24 | 0;
        g = b + 16 | 0;
        f = b + 8 | 0;
        e = b;
        Eh(a, 3646);
        Fh(a, 3651, 2);
        Gh(a, 3665, 2);
        Hh(a, 3682, 18);
        c[Ga >> 2] = 19;
        c[Ga + 4 >> 2] = 0;
        c[d >> 2] = c[Ga >> 2];
        c[d + 4 >> 2] = c[Ga + 4 >> 2];
        Ih(a, 3690, d);
        c[Fa >> 2] = 1;
        c[Fa + 4 >> 2] = 0;
        c[d >> 2] = c[Fa >> 2];
        c[d + 4 >> 2] = c[Fa + 4 >> 2];
        Jh(a, 3696, d);
        c[Ea >> 2] = 2;
        c[Ea + 4 >> 2] = 0;
        c[d >> 2] = c[Ea >> 2];
        c[d + 4 >> 2] = c[Ea + 4 >> 2];
        Kh(a, 3706, d);
        c[Da >> 2] = 1;
        c[Da + 4 >> 2] = 0;
        c[d >> 2] = c[Da >> 2];
        c[d + 4 >> 2] = c[Da + 4 >> 2];
        Lh(a, 3722, d);
        c[Ca >> 2] = 2;
        c[Ca + 4 >> 2] = 0;
        c[d >> 2] = c[Ca >> 2];
        c[d + 4 >> 2] = c[Ca + 4 >> 2];
        Lh(a, 3734, d);
        c[Ba >> 2] = 3;
        c[Ba + 4 >> 2] = 0;
        c[d >> 2] = c[Ba >> 2];
        c[d + 4 >> 2] = c[Ba + 4 >> 2];
        Kh(a, 3753, d);
        c[Aa >> 2] = 4;
        c[Aa + 4 >> 2] = 0;
        c[d >> 2] = c[Aa >> 2];
        c[d + 4 >> 2] = c[Aa + 4 >> 2];
        Kh(a, 3769, d);
        c[za >> 2] = 5;
        c[za + 4 >> 2] = 0;
        c[d >> 2] = c[za >> 2];
        c[d + 4 >> 2] = c[za + 4 >> 2];
        Kh(a, 3783, d);
        c[ya >> 2] = 6;
        c[ya + 4 >> 2] = 0;
        c[d >> 2] = c[ya >> 2];
        c[d + 4 >> 2] = c[ya + 4 >> 2];
        Kh(a, 3796, d);
        c[xa >> 2] = 7;
        c[xa + 4 >> 2] = 0;
        c[d >> 2] = c[xa >> 2];
        c[d + 4 >> 2] = c[xa + 4 >> 2];
        Kh(a, 3813, d);
        c[wa >> 2] = 8;
        c[wa + 4 >> 2] = 0;
        c[d >> 2] = c[wa >> 2];
        c[d + 4 >> 2] = c[wa + 4 >> 2];
        Kh(a, 3825, d);
        c[va >> 2] = 3;
        c[va + 4 >> 2] = 0;
        c[d >> 2] = c[va >> 2];
        c[d + 4 >> 2] = c[va + 4 >> 2];
        Lh(a, 3843, d);
        c[ua >> 2] = 4;
        c[ua + 4 >> 2] = 0;
        c[d >> 2] = c[ua >> 2];
        c[d + 4 >> 2] = c[ua + 4 >> 2];
        Lh(a, 3853, d);
        c[ta >> 2] = 9;
        c[ta + 4 >> 2] = 0;
        c[d >> 2] = c[ta >> 2];
        c[d + 4 >> 2] = c[ta + 4 >> 2];
        Kh(a, 3870, d);
        c[sa >> 2] = 10;
        c[sa + 4 >> 2] = 0;
        c[d >> 2] = c[sa >> 2];
        c[d + 4 >> 2] = c[sa + 4 >> 2];
        Kh(a, 3884, d);
        c[ra >> 2] = 11;
        c[ra + 4 >> 2] = 0;
        c[d >> 2] = c[ra >> 2];
        c[d + 4 >> 2] = c[ra + 4 >> 2];
        Kh(a, 3896, d);
        c[qa >> 2] = 1;
        c[qa + 4 >> 2] = 0;
        c[d >> 2] = c[qa >> 2];
        c[d + 4 >> 2] = c[qa + 4 >> 2];
        Mh(a, 3907, d);
        c[pa >> 2] = 2;
        c[pa + 4 >> 2] = 0;
        c[d >> 2] = c[pa >> 2];
        c[d + 4 >> 2] = c[pa + 4 >> 2];
        Mh(a, 3915, d);
        c[oa >> 2] = 3;
        c[oa + 4 >> 2] = 0;
        c[d >> 2] = c[oa >> 2];
        c[d + 4 >> 2] = c[oa + 4 >> 2];
        Mh(a, 3928, d);
        c[na >> 2] = 4;
        c[na + 4 >> 2] = 0;
        c[d >> 2] = c[na >> 2];
        c[d + 4 >> 2] = c[na + 4 >> 2];
        Mh(a, 3948, d);
        c[ma >> 2] = 5;
        c[ma + 4 >> 2] = 0;
        c[d >> 2] = c[ma >> 2];
        c[d + 4 >> 2] = c[ma + 4 >> 2];
        Mh(a, 3960, d);
        c[la >> 2] = 6;
        c[la + 4 >> 2] = 0;
        c[d >> 2] = c[la >> 2];
        c[d + 4 >> 2] = c[la + 4 >> 2];
        Mh(a, 3974, d);
        c[ka >> 2] = 7;
        c[ka + 4 >> 2] = 0;
        c[d >> 2] = c[ka >> 2];
        c[d + 4 >> 2] = c[ka + 4 >> 2];
        Mh(a, 3983, d);
        c[ja >> 2] = 20;
        c[ja + 4 >> 2] = 0;
        c[d >> 2] = c[ja >> 2];
        c[d + 4 >> 2] = c[ja + 4 >> 2];
        Ih(a, 3999, d);
        c[ia >> 2] = 8;
        c[ia + 4 >> 2] = 0;
        c[d >> 2] = c[ia >> 2];
        c[d + 4 >> 2] = c[ia + 4 >> 2];
        Mh(a, 4012, d);
        c[ha >> 2] = 9;
        c[ha + 4 >> 2] = 0;
        c[d >> 2] = c[ha >> 2];
        c[d + 4 >> 2] = c[ha + 4 >> 2];
        Mh(a, 4022, d);
        c[ga >> 2] = 21;
        c[ga + 4 >> 2] = 0;
        c[d >> 2] = c[ga >> 2];
        c[d + 4 >> 2] = c[ga + 4 >> 2];
        Ih(a, 4039, d);
        c[fa >> 2] = 10;
        c[fa + 4 >> 2] = 0;
        c[d >> 2] = c[fa >> 2];
        c[d + 4 >> 2] = c[fa + 4 >> 2];
        Mh(a, 4053, d);
        c[ea >> 2] = 11;
        c[ea + 4 >> 2] = 0;
        c[d >> 2] = c[ea >> 2];
        c[d + 4 >> 2] = c[ea + 4 >> 2];
        Mh(a, 4065, d);
        c[da >> 2] = 12;
        c[da + 4 >> 2] = 0;
        c[d >> 2] = c[da >> 2];
        c[d + 4 >> 2] = c[da + 4 >> 2];
        Mh(a, 4084, d);
        c[ca >> 2] = 13;
        c[ca + 4 >> 2] = 0;
        c[d >> 2] = c[ca >> 2];
        c[d + 4 >> 2] = c[ca + 4 >> 2];
        Mh(a, 4097, d);
        c[ba >> 2] = 14;
        c[ba + 4 >> 2] = 0;
        c[d >> 2] = c[ba >> 2];
        c[d + 4 >> 2] = c[ba + 4 >> 2];
        Mh(a, 4117, d);
        c[aa >> 2] = 15;
        c[aa + 4 >> 2] = 0;
        c[d >> 2] = c[aa >> 2];
        c[d + 4 >> 2] = c[aa + 4 >> 2];
        Mh(a, 4129, d);
        c[$ >> 2] = 16;
        c[$ + 4 >> 2] = 0;
        c[d >> 2] = c[$ >> 2];
        c[d + 4 >> 2] = c[$ + 4 >> 2];
        Mh(a, 4148, d);
        c[_ >> 2] = 17;
        c[_ + 4 >> 2] = 0;
        c[d >> 2] = c[_ >> 2];
        c[d + 4 >> 2] = c[_ + 4 >> 2];
        Mh(a, 4161, d);
        c[Z >> 2] = 18;
        c[Z + 4 >> 2] = 0;
        c[d >> 2] = c[Z >> 2];
        c[d + 4 >> 2] = c[Z + 4 >> 2];
        Mh(a, 4181, d);
        c[Y >> 2] = 5;
        c[Y + 4 >> 2] = 0;
        c[d >> 2] = c[Y >> 2];
        c[d + 4 >> 2] = c[Y + 4 >> 2];
        Lh(a, 4196, d);
        c[X >> 2] = 6;
        c[X + 4 >> 2] = 0;
        c[d >> 2] = c[X >> 2];
        c[d + 4 >> 2] = c[X + 4 >> 2];
        Lh(a, 4206, d);
        c[W >> 2] = 7;
        c[W + 4 >> 2] = 0;
        c[d >> 2] = c[W >> 2];
        c[d + 4 >> 2] = c[W + 4 >> 2];
        Lh(a, 4217, d);
        c[V >> 2] = 3;
        c[V + 4 >> 2] = 0;
        c[d >> 2] = c[V >> 2];
        c[d + 4 >> 2] = c[V + 4 >> 2];
        Nh(a, 4235, d);
        c[U >> 2] = 1;
        c[U + 4 >> 2] = 0;
        c[d >> 2] = c[U >> 2];
        c[d + 4 >> 2] = c[U + 4 >> 2];
        Oh(a, 4251, d);
        c[T >> 2] = 4;
        c[T + 4 >> 2] = 0;
        c[d >> 2] = c[T >> 2];
        c[d + 4 >> 2] = c[T + 4 >> 2];
        Nh(a, 4263, d);
        c[S >> 2] = 5;
        c[S + 4 >> 2] = 0;
        c[d >> 2] = c[S >> 2];
        c[d + 4 >> 2] = c[S + 4 >> 2];
        Nh(a, 4279, d);
        c[R >> 2] = 6;
        c[R + 4 >> 2] = 0;
        c[d >> 2] = c[R >> 2];
        c[d + 4 >> 2] = c[R + 4 >> 2];
        Nh(a, 4293, d);
        c[Q >> 2] = 7;
        c[Q + 4 >> 2] = 0;
        c[d >> 2] = c[Q >> 2];
        c[d + 4 >> 2] = c[Q + 4 >> 2];
        Nh(a, 4306, d);
        c[P >> 2] = 8;
        c[P + 4 >> 2] = 0;
        c[d >> 2] = c[P >> 2];
        c[d + 4 >> 2] = c[P + 4 >> 2];
        Nh(a, 4323, d);
        c[O >> 2] = 9;
        c[O + 4 >> 2] = 0;
        c[d >> 2] = c[O >> 2];
        c[d + 4 >> 2] = c[O + 4 >> 2];
        Nh(a, 4335, d);
        c[N >> 2] = 2;
        c[N + 4 >> 2] = 0;
        c[d >> 2] = c[N >> 2];
        c[d + 4 >> 2] = c[N + 4 >> 2];
        Oh(a, 4353, d);
        c[M >> 2] = 12;
        c[M + 4 >> 2] = 0;
        c[d >> 2] = c[M >> 2];
        c[d + 4 >> 2] = c[M + 4 >> 2];
        Ph(a, 4363, d);
        c[L >> 2] = 1;
        c[L + 4 >> 2] = 0;
        c[d >> 2] = c[L >> 2];
        c[d + 4 >> 2] = c[L + 4 >> 2];
        Qh(a, 4376, d);
        c[K >> 2] = 2;
        c[K + 4 >> 2] = 0;
        c[d >> 2] = c[K >> 2];
        c[d + 4 >> 2] = c[K + 4 >> 2];
        Qh(a, 4388, d);
        c[J >> 2] = 13;
        c[J + 4 >> 2] = 0;
        c[d >> 2] = c[J >> 2];
        c[d + 4 >> 2] = c[J + 4 >> 2];
        Ph(a, 4402, d);
        c[I >> 2] = 14;
        c[I + 4 >> 2] = 0;
        c[d >> 2] = c[I >> 2];
        c[d + 4 >> 2] = c[I + 4 >> 2];
        Ph(a, 4411, d);
        c[H >> 2] = 15;
        c[H + 4 >> 2] = 0;
        c[d >> 2] = c[H >> 2];
        c[d + 4 >> 2] = c[H + 4 >> 2];
        Ph(a, 4421, d);
        c[G >> 2] = 16;
        c[G + 4 >> 2] = 0;
        c[d >> 2] = c[G >> 2];
        c[d + 4 >> 2] = c[G + 4 >> 2];
        Ph(a, 4433, d);
        c[F >> 2] = 17;
        c[F + 4 >> 2] = 0;
        c[d >> 2] = c[F >> 2];
        c[d + 4 >> 2] = c[F + 4 >> 2];
        Ph(a, 4446, d);
        c[E >> 2] = 18;
        c[E + 4 >> 2] = 0;
        c[d >> 2] = c[E >> 2];
        c[d + 4 >> 2] = c[E + 4 >> 2];
        Ph(a, 4458, d);
        c[D >> 2] = 3;
        c[D + 4 >> 2] = 0;
        c[d >> 2] = c[D >> 2];
        c[d + 4 >> 2] = c[D + 4 >> 2];
        Qh(a, 4471, d);
        c[C >> 2] = 1;
        c[C + 4 >> 2] = 0;
        c[d >> 2] = c[C >> 2];
        c[d + 4 >> 2] = c[C + 4 >> 2];
        Rh(a, 4486, d);
        c[B >> 2] = 10;
        c[B + 4 >> 2] = 0;
        c[d >> 2] = c[B >> 2];
        c[d + 4 >> 2] = c[B + 4 >> 2];
        Nh(a, 4496, d);
        c[A >> 2] = 11;
        c[A + 4 >> 2] = 0;
        c[d >> 2] = c[A >> 2];
        c[d + 4 >> 2] = c[A + 4 >> 2];
        Nh(a, 4508, d);
        c[z >> 2] = 3;
        c[z + 4 >> 2] = 0;
        c[d >> 2] = c[z >> 2];
        c[d + 4 >> 2] = c[z + 4 >> 2];
        Oh(a, 4519, d);
        c[y >> 2] = 4;
        c[y + 4 >> 2] = 0;
        c[d >> 2] = c[y >> 2];
        c[d + 4 >> 2] = c[y + 4 >> 2];
        Sh(a, 4530, d);
        c[x >> 2] = 19;
        c[x + 4 >> 2] = 0;
        c[d >> 2] = c[x >> 2];
        c[d + 4 >> 2] = c[x + 4 >> 2];
        Th(a, 4542, d);
        c[w >> 2] = 12;
        c[w + 4 >> 2] = 0;
        c[d >> 2] = c[w >> 2];
        c[d + 4 >> 2] = c[w + 4 >> 2];
        Uh(a, 4554, d);
        c[v >> 2] = 13;
        c[v + 4 >> 2] = 0;
        c[d >> 2] = c[v >> 2];
        c[d + 4 >> 2] = c[v + 4 >> 2];
        Vh(a, 4568, d);
        c[u >> 2] = 2;
        c[u + 4 >> 2] = 0;
        c[d >> 2] = c[u >> 2];
        c[d + 4 >> 2] = c[u + 4 >> 2];
        Wh(a, 4578, d);
        c[t >> 2] = 20;
        c[t + 4 >> 2] = 0;
        c[d >> 2] = c[t >> 2];
        c[d + 4 >> 2] = c[t + 4 >> 2];
        Xh(a, 4587, d);
        c[s >> 2] = 22;
        c[s + 4 >> 2] = 0;
        c[d >> 2] = c[s >> 2];
        c[d + 4 >> 2] = c[s + 4 >> 2];
        Ih(a, 4602, d);
        c[r >> 2] = 23;
        c[r + 4 >> 2] = 0;
        c[d >> 2] = c[r >> 2];
        c[d + 4 >> 2] = c[r + 4 >> 2];
        Ih(a, 4619, d);
        c[q >> 2] = 14;
        c[q + 4 >> 2] = 0;
        c[d >> 2] = c[q >> 2];
        c[d + 4 >> 2] = c[q + 4 >> 2];
        Yh(a, 4629, d);
        c[p >> 2] = 1;
        c[p + 4 >> 2] = 0;
        c[d >> 2] = c[p >> 2];
        c[d + 4 >> 2] = c[p + 4 >> 2];
        Zh(a, 4637, d);
        c[o >> 2] = 4;
        c[o + 4 >> 2] = 0;
        c[d >> 2] = c[o >> 2];
        c[d + 4 >> 2] = c[o + 4 >> 2];
        Qh(a, 4653, d);
        c[n >> 2] = 5;
        c[n + 4 >> 2] = 0;
        c[d >> 2] = c[n >> 2];
        c[d + 4 >> 2] = c[n + 4 >> 2];
        Qh(a, 4669, d);
        c[m >> 2] = 6;
        c[m + 4 >> 2] = 0;
        c[d >> 2] = c[m >> 2];
        c[d + 4 >> 2] = c[m + 4 >> 2];
        Qh(a, 4686, d);
        c[k >> 2] = 7;
        c[k + 4 >> 2] = 0;
        c[d >> 2] = c[k >> 2];
        c[d + 4 >> 2] = c[k + 4 >> 2];
        Qh(a, 4701, d);
        c[j >> 2] = 8;
        c[j + 4 >> 2] = 0;
        c[d >> 2] = c[j >> 2];
        c[d + 4 >> 2] = c[j + 4 >> 2];
        Qh(a, 4719, d);
        c[i >> 2] = 9;
        c[i + 4 >> 2] = 0;
        c[d >> 2] = c[i >> 2];
        c[d + 4 >> 2] = c[i + 4 >> 2];
        Qh(a, 4736, d);
        c[h >> 2] = 21;
        c[h + 4 >> 2] = 0;
        c[d >> 2] = c[h >> 2];
        c[d + 4 >> 2] = c[h + 4 >> 2];
        _h(a, 4754, d);
        c[g >> 2] = 2;
        c[g + 4 >> 2] = 0;
        c[d >> 2] = c[g >> 2];
        c[d + 4 >> 2] = c[g + 4 >> 2];
        Rh(a, 4772, d);
        c[f >> 2] = 3;
        c[f + 4 >> 2] = 0;
        c[d >> 2] = c[f >> 2];
        c[d + 4 >> 2] = c[f + 4 >> 2];
        Rh(a, 4790, d);
        c[e >> 2] = 4;
        c[e + 4 >> 2] = 0;
        c[d >> 2] = c[e >> 2];
        c[d + 4 >> 2] = c[e + 4 >> 2];
        Rh(a, 4808, d);
        l = b;
        return;
    }
    function Eh(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = dr() | 0;
        c[a >> 2] = d;
        er(d, b);
        Hv(c[a >> 2] | 0);
        return;
    }
    function Fh(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        Oq(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function Gh(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        tq(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function Hh(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        cq(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function Ih(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Lp(a, b, f);
        l = e;
        return a | 0;
    }
    function Jh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        pp(a, b, f);
        l = e;
        return a | 0;
    }
    function Kh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Yo(a, b, f);
        l = e;
        return a | 0;
    }
    function Lh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Fo(a, b, f);
        l = e;
        return a | 0;
    }
    function Mh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        mo(a, b, f);
        l = e;
        return a | 0;
    }
    function Nh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Un(a, b, f);
        l = e;
        return a | 0;
    }
    function Oh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Bn(a, b, f);
        l = e;
        return a | 0;
    }
    function Ph(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Um(a, b, f);
        l = e;
        return a | 0;
    }
    function Qh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Bm(a, b, f);
        l = e;
        return a | 0;
    }
    function Rh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        im(a, b, f);
        l = e;
        return a | 0;
    }
    function Sh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Rl(a, b, f);
        l = e;
        return a | 0;
    }
    function Th(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        vl(a, b, f);
        l = e;
        return a | 0;
    }
    function Uh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        bl(a, b, f);
        l = e;
        return a | 0;
    }
    function Vh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Kk(a, b, f);
        l = e;
        return a | 0;
    }
    function Wh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        nk(a, b, f);
        l = e;
        return a | 0;
    }
    function Xh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Rj(a, b, f);
        l = e;
        return a | 0;
    }
    function Yh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        xj(a, b, f);
        l = e;
        return a | 0;
    }
    function Zh(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        _i(a, b, f);
        l = e;
        return a | 0;
    }
    function _h(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        $h(a, b, f);
        l = e;
        return a | 0;
    }
    function $h(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        bi(a, d, f, 1);
        l = e;
        return;
    }
    function ai(a) {
        a = a | 0;
        return a | 0;
    }
    function bi(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = ci() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = di(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, ei(g, e) | 0, e);
        l = f;
        return;
    }
    function ci() {
        var b = 0, d = 0;
        if (!(a[7616] | 0)) {
            qi(9136);
            Ha(24, 9136, o | 0);
            d = 7616;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9136) | 0)) {
            b = 9136;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            qi(9136);
        }
        return 9136;
    }
    function di(a) {
        a = a | 0;
        return 0;
    }
    function ei(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = ci() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            ki(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            li(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function fi(a, b, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0;
        h = l;
        l = l + 32 | 0;
        o = h + 24 | 0;
        n = h + 20 | 0;
        j = h + 16 | 0;
        m = h + 12 | 0;
        k = h + 8 | 0;
        i = h + 4 | 0;
        p = h;
        c[n >> 2] = b;
        c[j >> 2] = d;
        c[m >> 2] = e;
        c[k >> 2] = f;
        c[i >> 2] = g;
        g = a + 28 | 0;
        c[p >> 2] = c[g >> 2];
        c[o >> 2] = c[p >> 2];
        gi(a + 24 | 0, o, n, m, k, j, i);
        c[g >> 2] = c[c[g >> 2] >> 2];
        l = h;
        return;
    }
    function gi(a, b, d, e, f, g, h) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        h = h | 0;
        a = hi(b) | 0;
        b = qC(24) | 0;
        ii(b + 4 | 0, c[d >> 2] | 0, c[e >> 2] | 0, c[f >> 2] | 0, c[g >> 2] | 0, c[h >> 2] | 0);
        c[b >> 2] = c[a >> 2];
        c[a >> 2] = b;
        return b | 0;
    }
    function hi(a) {
        a = a | 0;
        return c[a >> 2] | 0;
    }
    function ii(a, b, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        c[a + 8 >> 2] = e;
        c[a + 12 >> 2] = f;
        c[a + 16 >> 2] = g;
        return;
    }
    function ji(a, b) {
        a = a | 0;
        b = b | 0;
        return b | a | 0;
    }
    function ki(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function li(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = mi(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            ni(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            ki(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            oi(a, i);
            pi(i);
            l = k;
            return;
        }
    }
    function mi(a) {
        a = a | 0;
        return 357913941;
    }
    function ni(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function oi(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function pi(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function qi(a) {
        a = a | 0;
        ui(a);
        return;
    }
    function ri(a) {
        a = a | 0;
        ti(a + 24 | 0);
        return;
    }
    function si(a) {
        a = a | 0;
        return c[a >> 2] | 0;
    }
    function ti(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function ui(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 3, b, wi() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function vi() {
        return 9228;
    }
    function wi() {
        return 1140;
    }
    function xi(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0;
        d = l;
        l = l + 16 | 0;
        e = d + 8 | 0;
        f = d;
        g = zi(a) | 0;
        a = c[g + 4 >> 2] | 0;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = a;
        c[e >> 2] = c[f >> 2];
        c[e + 4 >> 2] = c[f + 4 >> 2];
        b = Ai(b, e) | 0;
        l = d;
        return b | 0;
    }
    function yi(a, b, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        c[a + 8 >> 2] = e;
        c[a + 12 >> 2] = f;
        c[a + 16 >> 2] = g;
        return;
    }
    function zi(a) {
        a = a | 0;
        return (c[(ci() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Ai(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0;
        f = l;
        l = l + 48 | 0;
        e = f;
        d = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) d = c[(c[a >> 2] | 0) + d >> 2] | 0;
        ob[d & 31](e, a);
        e = Bi(e) | 0;
        l = f;
        return e | 0;
    }
    function Bi(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0;
        e = l;
        l = l + 32 | 0;
        b = e + 12 | 0;
        c = e;
        d = Di(Ci() | 0) | 0;
        if (!d) a = Ii(a) | 0;
        else {
            Ei(b, d);
            Fi(c, b);
            Gi(a, c);
            a = Hi(b) | 0;
        }
        l = e;
        return a | 0;
    }
    function Ci() {
        var b = 0;
        if (!(a[7632] | 0)) {
            Ti(9184);
            Ha(25, 9184, o | 0);
            b = 7632;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 9184;
    }
    function Di(a) {
        a = a | 0;
        return c[a + 36 >> 2] | 0;
    }
    function Ei(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = a;
        c[a + 8 >> 2] = 0;
        return;
    }
    function Fi(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = c[b + 4 >> 2];
        c[a + 8 >> 2] = 0;
        return;
    }
    function Gi(a, b) {
        a = a | 0;
        b = b | 0;
        Ni(b, a, a + 8 | 0, a + 16 | 0, a + 24 | 0, a + 32 | 0, a + 40 | 0);
        return;
    }
    function Hi(a) {
        a = a | 0;
        return c[(c[a + 4 >> 2] | 0) + 8 >> 2] | 0;
    }
    function Ii(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        j = l;
        l = l + 16 | 0;
        d = j + 4 | 0;
        e = j;
        f = jy(8) | 0;
        g = f;
        h = qC(48) | 0;
        i = h;
        b = i + 48 | 0;
        do {
            c[i >> 2] = c[a >> 2];
            i = i + 4 | 0;
            a = a + 4 | 0;
        }while ((i | 0) < (b | 0))
        b = g + 4 | 0;
        c[b >> 2] = h;
        i = qC(8) | 0;
        h = c[b >> 2] | 0;
        c[e >> 2] = 0;
        c[d >> 2] = c[e >> 2];
        Ji(i, h, d);
        c[f >> 2] = i;
        l = j;
        return g | 0;
    }
    function Ji(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        d = qC(16) | 0;
        c[d + 4 >> 2] = 0;
        c[d + 8 >> 2] = 0;
        c[d >> 2] = 1092;
        c[d + 12 >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function Ki(a) {
        a = a | 0;
        kC(a);
        sC(a);
        return;
    }
    function Li(a) {
        a = a | 0;
        a = c[a + 12 >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Mi(a) {
        a = a | 0;
        sC(a);
        return;
    }
    function Ni(a, b, d, e, f, g, h) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        h = h | 0;
        g = Oi(c[a >> 2] | 0, b, d, e, f, g, h) | 0;
        h = a + 4 | 0;
        c[(c[h >> 2] | 0) + 8 >> 2] = g;
        return c[(c[h >> 2] | 0) + 8 >> 2] | 0;
    }
    function Oi(a, b, c, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        j = i;
        UA(j);
        a = Sg(a) | 0;
        g = Pi(a, +h[b >> 3], +h[c >> 3], +h[d >> 3], +h[e >> 3], +h[f >> 3], +h[g >> 3]) | 0;
        WA(j);
        l = i;
        return g | 0;
    }
    function Pi(a, b, c, d, e, f, g) {
        a = a | 0;
        b = +b;
        c = +c;
        d = +d;
        e = +e;
        f = +f;
        g = +g;
        var h = 0;
        h = Vg(Qi() | 0) | 0;
        b = +Wg(b);
        c = +Wg(c);
        d = +Wg(d);
        e = +Wg(e);
        f = +Wg(f);
        return ya(0, h | 0, a | 0, +b, +c, +d, +e, +f, + +Wg(g)) | 0;
    }
    function Qi() {
        var b = 0;
        if (!(a[7624] | 0)) {
            Ri(9172);
            b = 7624;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 9172;
    }
    function Ri(a) {
        a = a | 0;
        fh(a, Si() | 0, 6);
        return;
    }
    function Si() {
        return 1112;
    }
    function Ti(a) {
        a = a | 0;
        Zi(a);
        return;
    }
    function Ui(a) {
        a = a | 0;
        Vi(a + 24 | 0);
        Wi(a + 16 | 0);
        return;
    }
    function Vi(a) {
        a = a | 0;
        Yi(a);
        return;
    }
    function Wi(a) {
        a = a | 0;
        Xi(a);
        return;
    }
    function Xi(a) {
        a = a | 0;
        var b = 0, d = 0;
        b = c[a >> 2] | 0;
        if (b | 0) do {
            d = b;
            b = c[b >> 2] | 0;
            sC(d);
        }while ((b | 0) != 0)
        c[a >> 2] = 0;
        return;
    }
    function Yi(a) {
        a = a | 0;
        var b = 0, d = 0;
        b = c[a >> 2] | 0;
        if (b | 0) do {
            d = b;
            b = c[b >> 2] | 0;
            sC(d);
        }while ((b | 0) != 0)
        c[a >> 2] = 0;
        return;
    }
    function Zi(b) {
        b = b | 0;
        var d = 0;
        c[b + 16 >> 2] = 0;
        c[b + 20 >> 2] = 0;
        d = b + 24 | 0;
        c[d >> 2] = 0;
        c[b + 28 >> 2] = d;
        c[b + 36 >> 2] = 0;
        a[b + 40 >> 0] = 0;
        a[b + 41 >> 0] = 0;
        return;
    }
    function _i(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        $i(a, d, f, 0);
        l = e;
        return;
    }
    function $i(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = aj() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = bj(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, cj(g, e) | 0, e);
        l = f;
        return;
    }
    function aj() {
        var b = 0, d = 0;
        if (!(a[7640] | 0)) {
            jj(9232);
            Ha(26, 9232, o | 0);
            d = 7640;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9232) | 0)) {
            b = 9232;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            jj(9232);
        }
        return 9232;
    }
    function bj(a) {
        a = a | 0;
        return 0;
    }
    function cj(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = aj() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            dj(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            ej(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function dj(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function ej(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = fj(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            gj(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            dj(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            hj(a, i);
            ij(i);
            l = k;
            return;
        }
    }
    function fj(a) {
        a = a | 0;
        return 357913941;
    }
    function gj(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function hj(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function ij(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function jj(a) {
        a = a | 0;
        mj(a);
        return;
    }
    function kj(a) {
        a = a | 0;
        lj(a + 24 | 0);
        return;
    }
    function lj(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function mj(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 1, b, nj() | 0, 3);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function nj() {
        return 1144;
    }
    function oj(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = +d;
        e = +e;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0;
        g = l;
        l = l + 16 | 0;
        h = g + 8 | 0;
        i = g;
        j = pj(a) | 0;
        a = c[j + 4 >> 2] | 0;
        c[i >> 2] = c[j >> 2];
        c[i + 4 >> 2] = a;
        c[h >> 2] = c[i >> 2];
        c[h + 4 >> 2] = c[i + 4 >> 2];
        qj(b, h, d, e, f);
        l = g;
        return;
    }
    function pj(a) {
        a = a | 0;
        return (c[(aj() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function qj(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = +d;
        e = +e;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0;
        k = l;
        l = l + 16 | 0;
        h = k + 2 | 0;
        i = k + 1 | 0;
        j = k;
        g = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) g = c[(c[a >> 2] | 0) + g >> 2] | 0;
        rj(h, d);
        d = +sj(h, d);
        rj(i, e);
        e = +sj(i, e);
        tj(j, f);
        j = uj(j, f) | 0;
        qb[g & 1](a, d, e, j);
        l = k;
        return;
    }
    function rj(a, b) {
        a = a | 0;
        b = +b;
        return;
    }
    function sj(a, b) {
        a = a | 0;
        b = +b;
        return + +wj(b);
    }
    function tj(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function uj(a, b) {
        a = a | 0;
        b = b | 0;
        return vj(b) | 0;
    }
    function vj(a) {
        a = a | 0;
        return a | 0;
    }
    function wj(a) {
        a = +a;
        return +a;
    }
    function xj(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        yj(a, d, f, 1);
        l = e;
        return;
    }
    function yj(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = zj() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Aj(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Bj(g, e) | 0, e);
        l = f;
        return;
    }
    function zj() {
        var b = 0, d = 0;
        if (!(a[7648] | 0)) {
            Ij(9268);
            Ha(27, 9268, o | 0);
            d = 7648;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9268) | 0)) {
            b = 9268;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Ij(9268);
        }
        return 9268;
    }
    function Aj(a) {
        a = a | 0;
        return 0;
    }
    function Bj(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = zj() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Cj(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Dj(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Cj(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Dj(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Ej(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Fj(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Cj(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            Gj(a, i);
            Hj(i);
            l = k;
            return;
        }
    }
    function Ej(a) {
        a = a | 0;
        return 357913941;
    }
    function Fj(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function Gj(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Hj(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Ij(a) {
        a = a | 0;
        Lj(a);
        return;
    }
    function Jj(a) {
        a = a | 0;
        Kj(a + 24 | 0);
        return;
    }
    function Kj(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Lj(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 4, b, Mj() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Mj() {
        return 1160;
    }
    function Nj(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0;
        d = l;
        l = l + 16 | 0;
        e = d + 8 | 0;
        f = d;
        g = Oj(a) | 0;
        a = c[g + 4 >> 2] | 0;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = a;
        c[e >> 2] = c[f >> 2];
        c[e + 4 >> 2] = c[f + 4 >> 2];
        b = Pj(b, e) | 0;
        l = d;
        return b | 0;
    }
    function Oj(a) {
        a = a | 0;
        return (c[(zj() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Pj(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) d = c[(c[a >> 2] | 0) + d >> 2] | 0;
        return Qj(pb[d & 31](a) | 0) | 0;
    }
    function Qj(a) {
        a = a | 0;
        return a & 1 | 0;
    }
    function Rj(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Sj(a, d, f, 0);
        l = e;
        return;
    }
    function Sj(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Tj() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Uj(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Vj(g, e) | 0, e);
        l = f;
        return;
    }
    function Tj() {
        var b = 0, d = 0;
        if (!(a[7656] | 0)) {
            ak(9304);
            Ha(28, 9304, o | 0);
            d = 7656;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9304) | 0)) {
            b = 9304;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            ak(9304);
        }
        return 9304;
    }
    function Uj(a) {
        a = a | 0;
        return 0;
    }
    function Vj(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Tj() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Wj(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Xj(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Wj(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Xj(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Yj(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Zj(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Wj(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            _j(a, i);
            $j(i);
            l = k;
            return;
        }
    }
    function Yj(a) {
        a = a | 0;
        return 357913941;
    }
    function Zj(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function _j(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function $j(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function ak(a) {
        a = a | 0;
        dk(a);
        return;
    }
    function bk(a) {
        a = a | 0;
        ck(a + 24 | 0);
        return;
    }
    function ck(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function dk(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 5, b, ek() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function ek() {
        return 1164;
    }
    function fk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = gk(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        hk(b, f, d);
        l = e;
        return;
    }
    function gk(a) {
        a = a | 0;
        return (c[(Tj() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function hk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0;
        g = l;
        l = l + 16 | 0;
        f = g;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        ik(f, d);
        d = jk(f, d) | 0;
        ob[e & 31](a, d);
        kk(f);
        l = g;
        return;
    }
    function ik(a, b) {
        a = a | 0;
        b = b | 0;
        lk(a, b);
        return;
    }
    function jk(a, b) {
        a = a | 0;
        b = b | 0;
        return a | 0;
    }
    function kk(a) {
        a = a | 0;
        vf(a);
        return;
    }
    function lk(a, b) {
        a = a | 0;
        b = b | 0;
        mk(a, b);
        return;
    }
    function mk(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = b;
        return;
    }
    function nk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        ok(a, d, f, 0);
        l = e;
        return;
    }
    function ok(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = pk() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = qk(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, rk(g, e) | 0, e);
        l = f;
        return;
    }
    function pk() {
        var b = 0, d = 0;
        if (!(a[7664] | 0)) {
            yk(9340);
            Ha(29, 9340, o | 0);
            d = 7664;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9340) | 0)) {
            b = 9340;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            yk(9340);
        }
        return 9340;
    }
    function qk(a) {
        a = a | 0;
        return 0;
    }
    function rk(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = pk() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            sk(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            tk(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function sk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function tk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = uk(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            vk(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            sk(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            wk(a, i);
            xk(i);
            l = k;
            return;
        }
    }
    function uk(a) {
        a = a | 0;
        return 357913941;
    }
    function vk(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function wk(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function xk(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function yk(a) {
        a = a | 0;
        Bk(a);
        return;
    }
    function zk(a) {
        a = a | 0;
        Ak(a + 24 | 0);
        return;
    }
    function Ak(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Bk(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 4, b, Ck() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Ck() {
        return 1180;
    }
    function Dk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = Ek(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        d = Fk(b, f, d) | 0;
        l = e;
        return d | 0;
    }
    function Ek(a) {
        a = a | 0;
        return (c[(pk() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Fk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0;
        g = l;
        l = l + 16 | 0;
        f = g;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        Gk(f, d);
        f = Hk(f, d) | 0;
        f = Ik(wb[e & 15](a, f) | 0) | 0;
        l = g;
        return f | 0;
    }
    function Gk(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function Hk(a, b) {
        a = a | 0;
        b = b | 0;
        return Jk(b) | 0;
    }
    function Ik(a) {
        a = a | 0;
        return a | 0;
    }
    function Jk(a) {
        a = a | 0;
        return a | 0;
    }
    function Kk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Lk(a, d, f, 0);
        l = e;
        return;
    }
    function Lk(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Mk() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Nk(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Ok(g, e) | 0, e);
        l = f;
        return;
    }
    function Mk() {
        var b = 0, d = 0;
        if (!(a[7672] | 0)) {
            Vk(9376);
            Ha(30, 9376, o | 0);
            d = 7672;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9376) | 0)) {
            b = 9376;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Vk(9376);
        }
        return 9376;
    }
    function Nk(a) {
        a = a | 0;
        return 0;
    }
    function Ok(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Mk() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Pk(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Qk(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Pk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Qk(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Rk(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Sk(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Pk(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            Tk(a, i);
            Uk(i);
            l = k;
            return;
        }
    }
    function Rk(a) {
        a = a | 0;
        return 357913941;
    }
    function Sk(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function Tk(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Uk(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Vk(a) {
        a = a | 0;
        Yk(a);
        return;
    }
    function Wk(a) {
        a = a | 0;
        Xk(a + 24 | 0);
        return;
    }
    function Xk(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Yk(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 5, b, Zk() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Zk() {
        return 1196;
    }
    function _k(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0;
        d = l;
        l = l + 16 | 0;
        e = d + 8 | 0;
        f = d;
        g = $k(a) | 0;
        a = c[g + 4 >> 2] | 0;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = a;
        c[e >> 2] = c[f >> 2];
        c[e + 4 >> 2] = c[f + 4 >> 2];
        b = al(b, e) | 0;
        l = d;
        return b | 0;
    }
    function $k(a) {
        a = a | 0;
        return (c[(Mk() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function al(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) d = c[(c[a >> 2] | 0) + d >> 2] | 0;
        return Ik(pb[d & 31](a) | 0) | 0;
    }
    function bl(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        cl(a, d, f, 1);
        l = e;
        return;
    }
    function cl(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = dl() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = el(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, fl(g, e) | 0, e);
        l = f;
        return;
    }
    function dl() {
        var b = 0, d = 0;
        if (!(a[7680] | 0)) {
            ml(9412);
            Ha(31, 9412, o | 0);
            d = 7680;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9412) | 0)) {
            b = 9412;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            ml(9412);
        }
        return 9412;
    }
    function el(a) {
        a = a | 0;
        return 0;
    }
    function fl(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = dl() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            gl(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            hl(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function gl(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function hl(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = il(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            jl(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            gl(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            kl(a, i);
            ll(i);
            l = k;
            return;
        }
    }
    function il(a) {
        a = a | 0;
        return 357913941;
    }
    function jl(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function kl(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function ll(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function ml(a) {
        a = a | 0;
        pl(a);
        return;
    }
    function nl(a) {
        a = a | 0;
        ol(a + 24 | 0);
        return;
    }
    function ol(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function pl(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 6, b, ql() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function ql() {
        return 1200;
    }
    function rl(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0;
        d = l;
        l = l + 16 | 0;
        e = d + 8 | 0;
        f = d;
        g = sl(a) | 0;
        a = c[g + 4 >> 2] | 0;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = a;
        c[e >> 2] = c[f >> 2];
        c[e + 4 >> 2] = c[f + 4 >> 2];
        b = tl(b, e) | 0;
        l = d;
        return b | 0;
    }
    function sl(a) {
        a = a | 0;
        return (c[(dl() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function tl(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) d = c[(c[a >> 2] | 0) + d >> 2] | 0;
        return ul(pb[d & 31](a) | 0) | 0;
    }
    function ul(a) {
        a = a | 0;
        return a | 0;
    }
    function vl(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        wl(a, d, f, 0);
        l = e;
        return;
    }
    function wl(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = xl() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = yl(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, zl(g, e) | 0, e);
        l = f;
        return;
    }
    function xl() {
        var b = 0, d = 0;
        if (!(a[7688] | 0)) {
            Gl(9448);
            Ha(32, 9448, o | 0);
            d = 7688;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9448) | 0)) {
            b = 9448;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Gl(9448);
        }
        return 9448;
    }
    function yl(a) {
        a = a | 0;
        return 0;
    }
    function zl(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = xl() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Al(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Bl(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Al(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Bl(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Cl(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Dl(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Al(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            El(a, i);
            Fl(i);
            l = k;
            return;
        }
    }
    function Cl(a) {
        a = a | 0;
        return 357913941;
    }
    function Dl(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function El(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Fl(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Gl(a) {
        a = a | 0;
        Jl(a);
        return;
    }
    function Hl(a) {
        a = a | 0;
        Il(a + 24 | 0);
        return;
    }
    function Il(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Jl(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 6, b, Kl() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Kl() {
        return 1204;
    }
    function Ll(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = Ml(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Nl(b, f, d);
        l = e;
        return;
    }
    function Ml(a) {
        a = a | 0;
        return (c[(xl() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Nl(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0;
        g = l;
        l = l + 16 | 0;
        f = g;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        Ol(f, d);
        f = Pl(f, d) | 0;
        ob[e & 31](a, f);
        l = g;
        return;
    }
    function Ol(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function Pl(a, b) {
        a = a | 0;
        b = b | 0;
        return Ql(b) | 0;
    }
    function Ql(a) {
        a = a | 0;
        return a | 0;
    }
    function Rl(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Sl(a, d, f, 0);
        l = e;
        return;
    }
    function Sl(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Tl() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Ul(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Vl(g, e) | 0, e);
        l = f;
        return;
    }
    function Tl() {
        var b = 0, d = 0;
        if (!(a[7696] | 0)) {
            am(9484);
            Ha(33, 9484, o | 0);
            d = 7696;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9484) | 0)) {
            b = 9484;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            am(9484);
        }
        return 9484;
    }
    function Ul(a) {
        a = a | 0;
        return 0;
    }
    function Vl(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Tl() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Wl(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Xl(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Wl(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Xl(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Yl(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Zl(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Wl(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            _l(a, i);
            $l(i);
            l = k;
            return;
        }
    }
    function Yl(a) {
        a = a | 0;
        return 357913941;
    }
    function Zl(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function _l(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function $l(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function am(a) {
        a = a | 0;
        dm(a);
        return;
    }
    function bm(a) {
        a = a | 0;
        cm(a + 24 | 0);
        return;
    }
    function cm(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function dm(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 1, b, em() | 0, 2);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function em() {
        return 1212;
    }
    function fm(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0;
        f = l;
        l = l + 16 | 0;
        g = f + 8 | 0;
        h = f;
        i = gm(a) | 0;
        a = c[i + 4 >> 2] | 0;
        c[h >> 2] = c[i >> 2];
        c[h + 4 >> 2] = a;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = c[h + 4 >> 2];
        hm(b, g, d, e);
        l = f;
        return;
    }
    function gm(a) {
        a = a | 0;
        return (c[(Tl() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function hm(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0;
        i = l;
        l = l + 16 | 0;
        g = i + 1 | 0;
        h = i;
        f = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) f = c[(c[a >> 2] | 0) + f >> 2] | 0;
        Ol(g, d);
        g = Pl(g, d) | 0;
        Gk(h, e);
        h = Hk(h, e) | 0;
        Eb[f & 15](a, g, h);
        l = i;
        return;
    }
    function im(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        jm(a, d, f, 1);
        l = e;
        return;
    }
    function jm(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = km() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = lm(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, mm(g, e) | 0, e);
        l = f;
        return;
    }
    function km() {
        var b = 0, d = 0;
        if (!(a[7704] | 0)) {
            tm(9520);
            Ha(34, 9520, o | 0);
            d = 7704;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9520) | 0)) {
            b = 9520;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            tm(9520);
        }
        return 9520;
    }
    function lm(a) {
        a = a | 0;
        return 0;
    }
    function mm(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = km() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            nm(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            om(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function nm(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function om(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = pm(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            qm(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            nm(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            rm(a, i);
            sm(i);
            l = k;
            return;
        }
    }
    function pm(a) {
        a = a | 0;
        return 357913941;
    }
    function qm(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function rm(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function sm(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function tm(a) {
        a = a | 0;
        wm(a);
        return;
    }
    function um(a) {
        a = a | 0;
        vm(a + 24 | 0);
        return;
    }
    function vm(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function wm(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 1, b, xm() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function xm() {
        return 1224;
    }
    function ym(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0.0, f = 0, g = 0, h = 0, i = 0;
        f = l;
        l = l + 16 | 0;
        g = f + 8 | 0;
        h = f;
        i = zm(a) | 0;
        a = c[i + 4 >> 2] | 0;
        c[h >> 2] = c[i >> 2];
        c[h + 4 >> 2] = a;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = c[h + 4 >> 2];
        e = +Am(b, g, d);
        l = f;
        return +e;
    }
    function zm(a) {
        a = a | 0;
        return (c[(km() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Am(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0.0;
        g = l;
        l = l + 16 | 0;
        f = g;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        tj(f, d);
        f = uj(f, d) | 0;
        h = +ch(+zb[e & 7](a, f));
        l = g;
        return +h;
    }
    function Bm(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Cm(a, d, f, 1);
        l = e;
        return;
    }
    function Cm(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Dm() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Em(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Fm(g, e) | 0, e);
        l = f;
        return;
    }
    function Dm() {
        var b = 0, d = 0;
        if (!(a[7712] | 0)) {
            Mm(9556);
            Ha(35, 9556, o | 0);
            d = 7712;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9556) | 0)) {
            b = 9556;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Mm(9556);
        }
        return 9556;
    }
    function Em(a) {
        a = a | 0;
        return 0;
    }
    function Fm(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Dm() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Gm(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Hm(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Gm(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Hm(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Im(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Jm(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Gm(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            Km(a, i);
            Lm(i);
            l = k;
            return;
        }
    }
    function Im(a) {
        a = a | 0;
        return 357913941;
    }
    function Jm(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function Km(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Lm(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Mm(a) {
        a = a | 0;
        Pm(a);
        return;
    }
    function Nm(a) {
        a = a | 0;
        Om(a + 24 | 0);
        return;
    }
    function Om(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Pm(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 5, b, Qm() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Qm() {
        return 1232;
    }
    function Rm(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0.0, e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = Sm(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        d = +Tm(b, f);
        l = e;
        return +d;
    }
    function Sm(a) {
        a = a | 0;
        return (c[(Dm() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Tm(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) d = c[(c[a >> 2] | 0) + d >> 2] | 0;
        return + +ch(+ub[d & 15](a));
    }
    function Um(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Vm(a, d, f, 1);
        l = e;
        return;
    }
    function Vm(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Wm() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Xm(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Ym(g, e) | 0, e);
        l = f;
        return;
    }
    function Wm() {
        var b = 0, d = 0;
        if (!(a[7720] | 0)) {
            dn(9592);
            Ha(36, 9592, o | 0);
            d = 7720;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9592) | 0)) {
            b = 9592;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            dn(9592);
        }
        return 9592;
    }
    function Xm(a) {
        a = a | 0;
        return 0;
    }
    function Ym(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Wm() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Zm(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            _m(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Zm(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function _m(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = $m(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            an(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Zm(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            bn(a, i);
            cn(i);
            l = k;
            return;
        }
    }
    function $m(a) {
        a = a | 0;
        return 357913941;
    }
    function an(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function bn(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function cn(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function dn(a) {
        a = a | 0;
        gn(a);
        return;
    }
    function en(a) {
        a = a | 0;
        fn(a + 24 | 0);
        return;
    }
    function fn(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function gn(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 7, b, hn() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function hn() {
        return 1276;
    }
    function jn(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0;
        d = l;
        l = l + 16 | 0;
        e = d + 8 | 0;
        f = d;
        g = kn(a) | 0;
        a = c[g + 4 >> 2] | 0;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = a;
        c[e >> 2] = c[f >> 2];
        c[e + 4 >> 2] = c[f + 4 >> 2];
        b = ln(b, e) | 0;
        l = d;
        return b | 0;
    }
    function kn(a) {
        a = a | 0;
        return (c[(Wm() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function ln(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0;
        f = l;
        l = l + 16 | 0;
        e = f;
        d = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) d = c[(c[a >> 2] | 0) + d >> 2] | 0;
        ob[d & 31](e, a);
        e = mn(e) | 0;
        l = f;
        return e | 0;
    }
    function mn(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0;
        e = l;
        l = l + 32 | 0;
        b = e + 12 | 0;
        c = e;
        d = Di(nn() | 0) | 0;
        if (!d) a = pn(a) | 0;
        else {
            Ei(b, d);
            Fi(c, b);
            on(a, c);
            a = Hi(b) | 0;
        }
        l = e;
        return a | 0;
    }
    function nn() {
        var b = 0;
        if (!(a[7736] | 0)) {
            An(9640);
            Ha(25, 9640, o | 0);
            b = 7736;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 9640;
    }
    function on(a, b) {
        a = a | 0;
        b = b | 0;
        un(b, a, a + 8 | 0);
        return;
    }
    function pn(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0;
        d = l;
        l = l + 16 | 0;
        f = d + 4 | 0;
        h = d;
        e = jy(8) | 0;
        b = e;
        i = qC(16) | 0;
        c[i >> 2] = c[a >> 2];
        c[i + 4 >> 2] = c[a + 4 >> 2];
        c[i + 8 >> 2] = c[a + 8 >> 2];
        c[i + 12 >> 2] = c[a + 12 >> 2];
        g = b + 4 | 0;
        c[g >> 2] = i;
        a = qC(8) | 0;
        g = c[g >> 2] | 0;
        c[h >> 2] = 0;
        c[f >> 2] = c[h >> 2];
        qn(a, g, f);
        c[e >> 2] = a;
        l = d;
        return b | 0;
    }
    function qn(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        d = qC(16) | 0;
        c[d + 4 >> 2] = 0;
        c[d + 8 >> 2] = 0;
        c[d >> 2] = 1244;
        c[d + 12 >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function rn(a) {
        a = a | 0;
        kC(a);
        sC(a);
        return;
    }
    function sn(a) {
        a = a | 0;
        a = c[a + 12 >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function tn(a) {
        a = a | 0;
        sC(a);
        return;
    }
    function un(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        b = vn(c[a >> 2] | 0, b, d) | 0;
        d = a + 4 | 0;
        c[(c[d >> 2] | 0) + 8 >> 2] = b;
        return c[(c[d >> 2] | 0) + 8 >> 2] | 0;
    }
    function vn(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0;
        e = l;
        l = l + 16 | 0;
        f = e;
        UA(f);
        a = Sg(a) | 0;
        d = wn(a, c[b >> 2] | 0, +h[d >> 3]) | 0;
        WA(f);
        l = e;
        return d | 0;
    }
    function wn(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        var d = 0;
        d = Vg(xn() | 0) | 0;
        b = Xg(b) | 0;
        return za(0, d | 0, a | 0, b | 0, + +Wg(c)) | 0;
    }
    function xn() {
        var b = 0;
        if (!(a[7728] | 0)) {
            yn(9628);
            b = 7728;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 9628;
    }
    function yn(a) {
        a = a | 0;
        fh(a, zn() | 0, 2);
        return;
    }
    function zn() {
        return 1264;
    }
    function An(a) {
        a = a | 0;
        Zi(a);
        return;
    }
    function Bn(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Cn(a, d, f, 1);
        l = e;
        return;
    }
    function Cn(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Dn() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = En(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Fn(g, e) | 0, e);
        l = f;
        return;
    }
    function Dn() {
        var b = 0, d = 0;
        if (!(a[7744] | 0)) {
            Mn(9684);
            Ha(37, 9684, o | 0);
            d = 7744;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9684) | 0)) {
            b = 9684;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Mn(9684);
        }
        return 9684;
    }
    function En(a) {
        a = a | 0;
        return 0;
    }
    function Fn(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Dn() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Gn(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Hn(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Gn(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Hn(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = In(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Jn(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Gn(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            Kn(a, i);
            Ln(i);
            l = k;
            return;
        }
    }
    function In(a) {
        a = a | 0;
        return 357913941;
    }
    function Jn(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function Kn(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Ln(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Mn(a) {
        a = a | 0;
        Pn(a);
        return;
    }
    function Nn(a) {
        a = a | 0;
        On(a + 24 | 0);
        return;
    }
    function On(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Pn(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 5, b, Qn() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Qn() {
        return 1280;
    }
    function Rn(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = Sn(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        d = Tn(b, f, d) | 0;
        l = e;
        return d | 0;
    }
    function Sn(a) {
        a = a | 0;
        return (c[(Dn() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Tn(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        h = l;
        l = l + 32 | 0;
        f = h;
        g = h + 16 | 0;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        tj(g, d);
        g = uj(g, d) | 0;
        Eb[e & 15](f, a, g);
        g = mn(f) | 0;
        l = h;
        return g | 0;
    }
    function Un(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Vn(a, d, f, 1);
        l = e;
        return;
    }
    function Vn(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Wn() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Xn(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Yn(g, e) | 0, e);
        l = f;
        return;
    }
    function Wn() {
        var b = 0, d = 0;
        if (!(a[7752] | 0)) {
            eo(9720);
            Ha(38, 9720, o | 0);
            d = 7752;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9720) | 0)) {
            b = 9720;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            eo(9720);
        }
        return 9720;
    }
    function Xn(a) {
        a = a | 0;
        return 0;
    }
    function Yn(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Wn() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Zn(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            _n(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Zn(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function _n(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = $n(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            ao(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Zn(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            bo(a, i);
            co(i);
            l = k;
            return;
        }
    }
    function $n(a) {
        a = a | 0;
        return 357913941;
    }
    function ao(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function bo(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function co(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function eo(a) {
        a = a | 0;
        ho(a);
        return;
    }
    function fo(a) {
        a = a | 0;
        go(a + 24 | 0);
        return;
    }
    function go(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function ho(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 8, b, io() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function io() {
        return 1288;
    }
    function jo(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0;
        d = l;
        l = l + 16 | 0;
        e = d + 8 | 0;
        f = d;
        g = ko(a) | 0;
        a = c[g + 4 >> 2] | 0;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = a;
        c[e >> 2] = c[f >> 2];
        c[e + 4 >> 2] = c[f + 4 >> 2];
        b = lo(b, e) | 0;
        l = d;
        return b | 0;
    }
    function ko(a) {
        a = a | 0;
        return (c[(Wn() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function lo(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) d = c[(c[a >> 2] | 0) + d >> 2] | 0;
        return bh(pb[d & 31](a) | 0) | 0;
    }
    function mo(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        no(a, d, f, 0);
        l = e;
        return;
    }
    function no(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = oo() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = po(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, qo(g, e) | 0, e);
        l = f;
        return;
    }
    function oo() {
        var b = 0, d = 0;
        if (!(a[7760] | 0)) {
            xo(9756);
            Ha(39, 9756, o | 0);
            d = 7760;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9756) | 0)) {
            b = 9756;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            xo(9756);
        }
        return 9756;
    }
    function po(a) {
        a = a | 0;
        return 0;
    }
    function qo(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = oo() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            ro(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            so(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function ro(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function so(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = to(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            uo(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            ro(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            vo(a, i);
            wo(i);
            l = k;
            return;
        }
    }
    function to(a) {
        a = a | 0;
        return 357913941;
    }
    function uo(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function vo(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function wo(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function xo(a) {
        a = a | 0;
        Ao(a);
        return;
    }
    function yo(a) {
        a = a | 0;
        zo(a + 24 | 0);
        return;
    }
    function zo(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Ao(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 8, b, Bo() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Bo() {
        return 1292;
    }
    function Co(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = Do(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Eo(b, f, d);
        l = e;
        return;
    }
    function Do(a) {
        a = a | 0;
        return (c[(oo() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Eo(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        var e = 0, f = 0, g = 0;
        g = l;
        l = l + 16 | 0;
        f = g;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        rj(f, d);
        d = +sj(f, d);
        lb[e & 31](a, d);
        l = g;
        return;
    }
    function Fo(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Go(a, d, f, 0);
        l = e;
        return;
    }
    function Go(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Ho() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Io(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Jo(g, e) | 0, e);
        l = f;
        return;
    }
    function Ho() {
        var b = 0, d = 0;
        if (!(a[7768] | 0)) {
            Qo(9792);
            Ha(40, 9792, o | 0);
            d = 7768;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9792) | 0)) {
            b = 9792;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Qo(9792);
        }
        return 9792;
    }
    function Io(a) {
        a = a | 0;
        return 0;
    }
    function Jo(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Ho() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Ko(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Lo(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Ko(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Lo(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Mo(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            No(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Ko(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            Oo(a, i);
            Po(i);
            l = k;
            return;
        }
    }
    function Mo(a) {
        a = a | 0;
        return 357913941;
    }
    function No(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function Oo(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Po(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Qo(a) {
        a = a | 0;
        To(a);
        return;
    }
    function Ro(a) {
        a = a | 0;
        So(a + 24 | 0);
        return;
    }
    function So(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function To(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 1, b, Uo() | 0, 2);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Uo() {
        return 1300;
    }
    function Vo(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = +e;
        var f = 0, g = 0, h = 0, i = 0;
        f = l;
        l = l + 16 | 0;
        g = f + 8 | 0;
        h = f;
        i = Wo(a) | 0;
        a = c[i + 4 >> 2] | 0;
        c[h >> 2] = c[i >> 2];
        c[h + 4 >> 2] = a;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = c[h + 4 >> 2];
        Xo(b, g, d, e);
        l = f;
        return;
    }
    function Wo(a) {
        a = a | 0;
        return (c[(Ho() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Xo(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = +e;
        var f = 0, g = 0, h = 0, i = 0;
        i = l;
        l = l + 16 | 0;
        g = i + 1 | 0;
        h = i;
        f = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) f = c[(c[a >> 2] | 0) + f >> 2] | 0;
        tj(g, d);
        g = uj(g, d) | 0;
        rj(h, e);
        e = +sj(h, e);
        Gb[f & 15](a, g, e);
        l = i;
        return;
    }
    function Yo(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Zo(a, d, f, 0);
        l = e;
        return;
    }
    function Zo(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = _o() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = $o(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, ap(g, e) | 0, e);
        l = f;
        return;
    }
    function _o() {
        var b = 0, d = 0;
        if (!(a[7776] | 0)) {
            hp(9828);
            Ha(41, 9828, o | 0);
            d = 7776;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9828) | 0)) {
            b = 9828;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            hp(9828);
        }
        return 9828;
    }
    function $o(a) {
        a = a | 0;
        return 0;
    }
    function ap(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = _o() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            bp(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            cp(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function bp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function cp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = dp(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            ep(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            bp(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            fp(a, i);
            gp(i);
            l = k;
            return;
        }
    }
    function dp(a) {
        a = a | 0;
        return 357913941;
    }
    function ep(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function fp(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function gp(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function hp(a) {
        a = a | 0;
        kp(a);
        return;
    }
    function ip(a) {
        a = a | 0;
        jp(a + 24 | 0);
        return;
    }
    function jp(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function kp(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 7, b, lp() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function lp() {
        return 1312;
    }
    function mp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = np(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        op(b, f, d);
        l = e;
        return;
    }
    function np(a) {
        a = a | 0;
        return (c[(_o() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function op(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0;
        g = l;
        l = l + 16 | 0;
        f = g;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        tj(f, d);
        f = uj(f, d) | 0;
        ob[e & 31](a, f);
        l = g;
        return;
    }
    function pp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        qp(a, d, f, 0);
        l = e;
        return;
    }
    function qp(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = rp() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = sp(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, tp(g, e) | 0, e);
        l = f;
        return;
    }
    function rp() {
        var b = 0, d = 0;
        if (!(a[7784] | 0)) {
            Ap(9864);
            Ha(42, 9864, o | 0);
            d = 7784;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9864) | 0)) {
            b = 9864;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Ap(9864);
        }
        return 9864;
    }
    function sp(a) {
        a = a | 0;
        return 0;
    }
    function tp(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = rp() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            up(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            vp(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function up(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function vp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = wp(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            xp(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            up(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            yp(a, i);
            zp(i);
            l = k;
            return;
        }
    }
    function wp(a) {
        a = a | 0;
        return 357913941;
    }
    function xp(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function yp(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function zp(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Ap(a) {
        a = a | 0;
        Dp(a);
        return;
    }
    function Bp(a) {
        a = a | 0;
        Cp(a + 24 | 0);
        return;
    }
    function Cp(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Dp(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 8, b, Ep() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Ep() {
        return 1320;
    }
    function Fp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = Gp(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Hp(b, f, d);
        l = e;
        return;
    }
    function Gp(a) {
        a = a | 0;
        return (c[(rp() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Hp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0;
        g = l;
        l = l + 16 | 0;
        f = g;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        Ip(f, d);
        f = Jp(f, d) | 0;
        ob[e & 31](a, f);
        l = g;
        return;
    }
    function Ip(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function Jp(a, b) {
        a = a | 0;
        b = b | 0;
        return Kp(b) | 0;
    }
    function Kp(a) {
        a = a | 0;
        return a | 0;
    }
    function Lp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Mp(a, d, f, 0);
        l = e;
        return;
    }
    function Mp(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Np() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Op(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Pp(g, e) | 0, e);
        l = f;
        return;
    }
    function Np() {
        var b = 0, d = 0;
        if (!(a[7792] | 0)) {
            Wp(9900);
            Ha(43, 9900, o | 0);
            d = 7792;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9900) | 0)) {
            b = 9900;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Wp(9900);
        }
        return 9900;
    }
    function Op(a) {
        a = a | 0;
        return 0;
    }
    function Pp(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Np() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Qp(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Rp(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Qp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Rp(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Sp(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Tp(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Qp(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            Up(a, i);
            Vp(i);
            l = k;
            return;
        }
    }
    function Sp(a) {
        a = a | 0;
        return 357913941;
    }
    function Tp(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function Up(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Vp(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Wp(a) {
        a = a | 0;
        Zp(a);
        return;
    }
    function Xp(a) {
        a = a | 0;
        Yp(a + 24 | 0);
        return;
    }
    function Yp(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Zp(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 22, b, _p() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function _p() {
        return 1344;
    }
    function $p(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0;
        d = l;
        l = l + 16 | 0;
        e = d + 8 | 0;
        f = d;
        g = aq(a) | 0;
        a = c[g + 4 >> 2] | 0;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = a;
        c[e >> 2] = c[f >> 2];
        c[e + 4 >> 2] = c[f + 4 >> 2];
        bq(b, e);
        l = d;
        return;
    }
    function aq(a) {
        a = a | 0;
        return (c[(Np() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function bq(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) d = c[(c[a >> 2] | 0) + d >> 2] | 0;
        nb[d & 127](a);
        return;
    }
    function cq(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = dq() | 0;
        a = eq(d) | 0;
        fi(g, b, f, a, fq(d, e) | 0, e);
        return;
    }
    function dq() {
        var b = 0, d = 0;
        if (!(a[7800] | 0)) {
            mq(9936);
            Ha(44, 9936, o | 0);
            d = 7800;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9936) | 0)) {
            b = 9936;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            mq(9936);
        }
        return 9936;
    }
    function eq(a) {
        a = a | 0;
        return a | 0;
    }
    function fq(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = dq() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            gq(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            hq(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function gq(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function hq(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = iq(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            jq(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            gq(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            kq(a, f);
            lq(f);
            l = i;
            return;
        }
    }
    function iq(a) {
        a = a | 0;
        return 536870911;
    }
    function jq(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function kq(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function lq(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function mq(a) {
        a = a | 0;
        pq(a);
        return;
    }
    function nq(a) {
        a = a | 0;
        oq(a + 24 | 0);
        return;
    }
    function oq(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function pq(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 23, b, Kl() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function qq(a, b) {
        a = a | 0;
        b = b | 0;
        sq(c[(rq(a) | 0) >> 2] | 0, b);
        return;
    }
    function rq(a) {
        a = a | 0;
        return (c[(dq() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function sq(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = l;
        l = l + 16 | 0;
        d = c;
        Ol(d, b);
        b = Pl(d, b) | 0;
        nb[a & 127](b);
        l = c;
        return;
    }
    function tq(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = uq() | 0;
        a = vq(d) | 0;
        fi(g, b, f, a, wq(d, e) | 0, e);
        return;
    }
    function uq() {
        var b = 0, d = 0;
        if (!(a[7808] | 0)) {
            Dq(9972);
            Ha(45, 9972, o | 0);
            d = 7808;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(9972) | 0)) {
            b = 9972;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Dq(9972);
        }
        return 9972;
    }
    function vq(a) {
        a = a | 0;
        return a | 0;
    }
    function wq(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = uq() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            xq(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            yq(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function xq(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function yq(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = zq(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            Aq(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            xq(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            Bq(a, f);
            Cq(f);
            l = i;
            return;
        }
    }
    function zq(a) {
        a = a | 0;
        return 536870911;
    }
    function Aq(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function Bq(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Cq(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Dq(a) {
        a = a | 0;
        Gq(a);
        return;
    }
    function Eq(a) {
        a = a | 0;
        Fq(a + 24 | 0);
        return;
    }
    function Fq(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function Gq(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 9, b, Hq() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Hq() {
        return 1348;
    }
    function Iq(a, b) {
        a = a | 0;
        b = b | 0;
        return Kq(c[(Jq(a) | 0) >> 2] | 0, b) | 0;
    }
    function Jq(a) {
        a = a | 0;
        return (c[(uq() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function Kq(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = l;
        l = l + 16 | 0;
        d = c;
        Lq(d, b);
        b = Mq(d, b) | 0;
        b = Ik(pb[a & 31](b) | 0) | 0;
        l = c;
        return b | 0;
    }
    function Lq(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function Mq(a, b) {
        a = a | 0;
        b = b | 0;
        return Nq(b) | 0;
    }
    function Nq(a) {
        a = a | 0;
        return a | 0;
    }
    function Oq(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = Pq() | 0;
        a = Qq(d) | 0;
        fi(g, b, f, a, Rq(d, e) | 0, e);
        return;
    }
    function Pq() {
        var b = 0, d = 0;
        if (!(a[7816] | 0)) {
            Yq(10008);
            Ha(46, 10008, o | 0);
            d = 7816;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10008) | 0)) {
            b = 10008;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Yq(10008);
        }
        return 10008;
    }
    function Qq(a) {
        a = a | 0;
        return a | 0;
    }
    function Rq(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = Pq() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            Sq(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            Tq(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function Sq(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function Tq(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = Uq(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            Vq(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            Sq(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            Wq(a, f);
            Xq(f);
            l = i;
            return;
        }
    }
    function Uq(a) {
        a = a | 0;
        return 536870911;
    }
    function Vq(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function Wq(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Xq(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Yq(a) {
        a = a | 0;
        $q(a);
        return;
    }
    function Zq(a) {
        a = a | 0;
        _q(a + 24 | 0);
        return;
    }
    function _q(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function $q(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 15, b, Zk() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function ar(a) {
        a = a | 0;
        return cr(c[(br(a) | 0) >> 2] | 0) | 0;
    }
    function br(a) {
        a = a | 0;
        return (c[(Pq() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function cr(a) {
        a = a | 0;
        return Ik(Ab[a & 7]() | 0) | 0;
    }
    function dr() {
        var b = 0;
        if (!(a[7832] | 0)) {
            nr(10052);
            Ha(25, 10052, o | 0);
            b = 7832;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10052;
    }
    function er(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = fr() | 0;
        c[a + 4 >> 2] = gr() | 0;
        c[a + 12 >> 2] = b;
        c[a + 8 >> 2] = hr() | 0;
        c[a + 32 >> 2] = 2;
        return;
    }
    function fr() {
        return 11709;
    }
    function gr() {
        return 1188;
    }
    function hr() {
        return lr() | 0;
    }
    function ir(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((jr(d, 896) | 0) == 512) {
            if (c | 0) {
                kr(c);
                sC(c);
            }
        } else if (b | 0) {
            uf(b);
            sC(b);
        }
        return;
    }
    function jr(a, b) {
        a = a | 0;
        b = b | 0;
        return b & a | 0;
    }
    function kr(a) {
        a = a | 0;
        a = c[a + 4 >> 2] | 0;
        if (a | 0) oC(a);
        return;
    }
    function lr() {
        var b = 0;
        if (!(a[7824] | 0)) {
            c[2511] = mr() | 0;
            c[2512] = 0;
            b = 7824;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10044;
    }
    function mr() {
        return 0;
    }
    function nr(a) {
        a = a | 0;
        Zi(a);
        return;
    }
    function or(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0;
        b = l;
        l = l + 32 | 0;
        d = b + 24 | 0;
        g = b + 16 | 0;
        f = b + 8 | 0;
        e = b;
        pr(a, 4827);
        qr(a, 4834, 3);
        rr(a, 3682, 47);
        c[g >> 2] = 9;
        c[g + 4 >> 2] = 0;
        c[d >> 2] = c[g >> 2];
        c[d + 4 >> 2] = c[g + 4 >> 2];
        sr(a, 4841, d);
        c[f >> 2] = 1;
        c[f + 4 >> 2] = 0;
        c[d >> 2] = c[f >> 2];
        c[d + 4 >> 2] = c[f + 4 >> 2];
        tr(a, 4871, d);
        c[e >> 2] = 10;
        c[e + 4 >> 2] = 0;
        c[d >> 2] = c[e >> 2];
        c[d + 4 >> 2] = c[e + 4 >> 2];
        ur(a, 4891, d);
        l = b;
        return;
    }
    function pr(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = nt() | 0;
        c[a >> 2] = d;
        ot(d, b);
        Hv(c[a >> 2] | 0);
        return;
    }
    function qr(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        Ws(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function rr(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        Es(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function sr(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        is(a, b, f);
        l = e;
        return a | 0;
    }
    function tr(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Or(a, b, f);
        l = e;
        return a | 0;
    }
    function ur(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = c[d + 4 >> 2] | 0;
        c[g >> 2] = c[d >> 2];
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        vr(a, b, f);
        l = e;
        return a | 0;
    }
    function vr(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        wr(a, d, f, 1);
        l = e;
        return;
    }
    function wr(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = xr() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = yr(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, zr(g, e) | 0, e);
        l = f;
        return;
    }
    function xr() {
        var b = 0, d = 0;
        if (!(a[7840] | 0)) {
            Gr(10100);
            Ha(48, 10100, o | 0);
            d = 7840;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10100) | 0)) {
            b = 10100;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Gr(10100);
        }
        return 10100;
    }
    function yr(a) {
        a = a | 0;
        return 0;
    }
    function zr(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = xr() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Ar(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Br(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Ar(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Br(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Cr(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Dr(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Ar(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            Er(a, i);
            Fr(i);
            l = k;
            return;
        }
    }
    function Cr(a) {
        a = a | 0;
        return 357913941;
    }
    function Dr(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function Er(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Fr(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Gr(a) {
        a = a | 0;
        Jr(a);
        return;
    }
    function Hr(a) {
        a = a | 0;
        Ir(a + 24 | 0);
        return;
    }
    function Ir(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function Jr(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 6, b, Kr() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Kr() {
        return 1364;
    }
    function Lr(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = Mr(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        d = Nr(b, f, d) | 0;
        l = e;
        return d | 0;
    }
    function Mr(a) {
        a = a | 0;
        return (c[(xr() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function Nr(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0;
        g = l;
        l = l + 16 | 0;
        f = g;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        tj(f, d);
        f = uj(f, d) | 0;
        f = Qj(wb[e & 15](a, f) | 0) | 0;
        l = g;
        return f | 0;
    }
    function Or(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        Pr(a, d, f, 0);
        l = e;
        return;
    }
    function Pr(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = Qr() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = Rr(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, Sr(g, e) | 0, e);
        l = f;
        return;
    }
    function Qr() {
        var b = 0, d = 0;
        if (!(a[7848] | 0)) {
            Zr(10136);
            Ha(49, 10136, o | 0);
            d = 7848;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10136) | 0)) {
            b = 10136;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Zr(10136);
        }
        return 10136;
    }
    function Rr(a) {
        a = a | 0;
        return 0;
    }
    function Sr(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = Qr() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            Tr(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            Ur(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function Tr(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function Ur(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = Vr(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            Wr(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            Tr(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            Xr(a, i);
            Yr(i);
            l = k;
            return;
        }
    }
    function Vr(a) {
        a = a | 0;
        return 357913941;
    }
    function Wr(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function Xr(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Yr(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Zr(a) {
        a = a | 0;
        as(a);
        return;
    }
    function _r(a) {
        a = a | 0;
        $r(a + 24 | 0);
        return;
    }
    function $r(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function as(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 9, b, bs() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function bs() {
        return 1372;
    }
    function cs(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        h = ds(a) | 0;
        a = c[h + 4 >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = a;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        es(b, f, d);
        l = e;
        return;
    }
    function ds(a) {
        a = a | 0;
        return (c[(Qr() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function es(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        var e = 0, f = 0, g = 0, h = ib;
        g = l;
        l = l + 16 | 0;
        f = g;
        e = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) e = c[(c[a >> 2] | 0) + e >> 2] | 0;
        fs(f, d);
        h = T(gs(f, d));
        kb[e & 1](a, h);
        l = g;
        return;
    }
    function fs(a, b) {
        a = a | 0;
        b = +b;
        return;
    }
    function gs(a, b) {
        a = a | 0;
        b = +b;
        return T(hs(b));
    }
    function hs(a) {
        a = +a;
        return T(a);
    }
    function is(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 16 | 0;
        f = e + 8 | 0;
        g = e;
        i = c[d >> 2] | 0;
        h = c[d + 4 >> 2] | 0;
        d = ai(b) | 0;
        c[g >> 2] = i;
        c[g + 4 >> 2] = h;
        c[f >> 2] = c[g >> 2];
        c[f + 4 >> 2] = c[g + 4 >> 2];
        js(a, d, f, 0);
        l = e;
        return;
    }
    function js(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        f = l;
        l = l + 32 | 0;
        g = f + 16 | 0;
        m = f + 8 | 0;
        i = f;
        k = c[d >> 2] | 0;
        j = c[d + 4 >> 2] | 0;
        h = c[a >> 2] | 0;
        a = ks() | 0;
        c[m >> 2] = k;
        c[m + 4 >> 2] = j;
        c[g >> 2] = c[m >> 2];
        c[g + 4 >> 2] = c[m + 4 >> 2];
        d = ls(g) | 0;
        c[i >> 2] = k;
        c[i + 4 >> 2] = j;
        c[g >> 2] = c[i >> 2];
        c[g + 4 >> 2] = c[i + 4 >> 2];
        fi(h, b, a, d, ms(g, e) | 0, e);
        l = f;
        return;
    }
    function ks() {
        var b = 0, d = 0;
        if (!(a[7856] | 0)) {
            ts(10172);
            Ha(50, 10172, o | 0);
            d = 7856;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10172) | 0)) {
            b = 10172;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            ts(10172);
        }
        return 10172;
    }
    function ls(a) {
        a = a | 0;
        return 0;
    }
    function ms(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        m = l;
        l = l + 32 | 0;
        f = m + 24 | 0;
        h = m + 16 | 0;
        i = m;
        j = m + 8 | 0;
        g = c[a >> 2] | 0;
        e = c[a + 4 >> 2] | 0;
        c[i >> 2] = g;
        c[i + 4 >> 2] = e;
        n = ks() | 0;
        k = n + 24 | 0;
        a = ji(b, 4) | 0;
        c[j >> 2] = a;
        b = n + 28 | 0;
        d = c[b >> 2] | 0;
        if (d >>> 0 < (c[n + 32 >> 2] | 0) >>> 0) {
            c[h >> 2] = g;
            c[h + 4 >> 2] = e;
            c[f >> 2] = c[h >> 2];
            c[f + 4 >> 2] = c[h + 4 >> 2];
            ns(d, f, a);
            a = (c[b >> 2] | 0) + 12 | 0;
            c[b >> 2] = a;
        } else {
            os(k, i, j);
            a = c[b >> 2] | 0;
        }
        l = m;
        return ((a - (c[k >> 2] | 0) | 0) / 12 | 0) + -1 | 0;
    }
    function ns(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0;
        e = c[b + 4 >> 2] | 0;
        c[a >> 2] = c[b >> 2];
        c[a + 4 >> 2] = e;
        c[a + 8 >> 2] = d;
        return;
    }
    function os(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0;
        k = l;
        l = l + 48 | 0;
        e = k + 32 | 0;
        h = k + 24 | 0;
        i = k;
        j = a + 4 | 0;
        f = (((c[j >> 2] | 0) - (c[a >> 2] | 0) | 0) / 12 | 0) + 1 | 0;
        g = ps(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            m = c[a >> 2] | 0;
            o = ((c[a + 8 >> 2] | 0) - m | 0) / 12 | 0;
            n = o << 1;
            qs(i, o >>> 0 < g >>> 1 >>> 0 ? n >>> 0 < f >>> 0 ? f : n : g, ((c[j >> 2] | 0) - m | 0) / 12 | 0, a + 8 | 0);
            j = i + 8 | 0;
            g = c[j >> 2] | 0;
            f = c[b + 4 >> 2] | 0;
            d = c[d >> 2] | 0;
            c[h >> 2] = c[b >> 2];
            c[h + 4 >> 2] = f;
            c[e >> 2] = c[h >> 2];
            c[e + 4 >> 2] = c[h + 4 >> 2];
            ns(g, e, d);
            c[j >> 2] = (c[j >> 2] | 0) + 12;
            rs(a, i);
            ss(i);
            l = k;
            return;
        }
    }
    function ps(a) {
        a = a | 0;
        return 357913941;
    }
    function qs(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 357913941) Ta();
            else {
                f = qC(b * 12 | 0) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d * 12 | 0) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b * 12 | 0);
        return;
    }
    function rs(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (((f | 0) / -12 | 0) * 12 | 0) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function ss(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~(((e + -12 - b | 0) >>> 0) / 12 | 0) * 12 | 0);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function ts(a) {
        a = a | 0;
        ws(a);
        return;
    }
    function us(a) {
        a = a | 0;
        vs(a + 24 | 0);
        return;
    }
    function vs(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~(((b + -12 - e | 0) >>> 0) / 12 | 0) * 12 | 0);
            sC(d);
        }
        return;
    }
    function ws(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 2, 3, b, xs() | 0, 2);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function xs() {
        return 1380;
    }
    function ys(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0;
        f = l;
        l = l + 16 | 0;
        g = f + 8 | 0;
        h = f;
        i = zs(a) | 0;
        a = c[i + 4 >> 2] | 0;
        c[h >> 2] = c[i >> 2];
        c[h + 4 >> 2] = a;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = c[h + 4 >> 2];
        As(b, g, d, e);
        l = f;
        return;
    }
    function zs(a) {
        a = a | 0;
        return (c[(ks() | 0) + 24 >> 2] | 0) + (a * 12 | 0) | 0;
    }
    function As(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0;
        i = l;
        l = l + 16 | 0;
        g = i + 1 | 0;
        h = i;
        f = c[b >> 2] | 0;
        b = c[b + 4 >> 2] | 0;
        a = a + (b >> 1) | 0;
        if (b & 1) f = c[(c[a >> 2] | 0) + f >> 2] | 0;
        tj(g, d);
        g = uj(g, d) | 0;
        Bs(h, e);
        h = Cs(h, e) | 0;
        Eb[f & 15](a, g, h);
        l = i;
        return;
    }
    function Bs(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function Cs(a, b) {
        a = a | 0;
        b = b | 0;
        return Ds(b) | 0;
    }
    function Ds(a) {
        a = a | 0;
        return (a | 0) != 0 | 0;
    }
    function Es(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = Fs() | 0;
        a = Gs(d) | 0;
        fi(g, b, f, a, Hs(d, e) | 0, e);
        return;
    }
    function Fs() {
        var b = 0, d = 0;
        if (!(a[7864] | 0)) {
            Os(10208);
            Ha(51, 10208, o | 0);
            d = 7864;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10208) | 0)) {
            b = 10208;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Os(10208);
        }
        return 10208;
    }
    function Gs(a) {
        a = a | 0;
        return a | 0;
    }
    function Hs(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = Fs() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            Is(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            Js(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function Is(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function Js(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = Ks(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            Ls(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            Is(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            Ms(a, f);
            Ns(f);
            l = i;
            return;
        }
    }
    function Ks(a) {
        a = a | 0;
        return 536870911;
    }
    function Ls(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function Ms(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Ns(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Os(a) {
        a = a | 0;
        Rs(a);
        return;
    }
    function Ps(a) {
        a = a | 0;
        Qs(a + 24 | 0);
        return;
    }
    function Qs(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function Rs(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 24, b, Ss() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Ss() {
        return 1392;
    }
    function Ts(a, b) {
        a = a | 0;
        b = b | 0;
        Vs(c[(Us(a) | 0) >> 2] | 0, b);
        return;
    }
    function Us(a) {
        a = a | 0;
        return (c[(Fs() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function Vs(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = l;
        l = l + 16 | 0;
        d = c;
        Lq(d, b);
        b = Mq(d, b) | 0;
        nb[a & 127](b);
        l = c;
        return;
    }
    function Ws(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = Xs() | 0;
        a = Ys(d) | 0;
        fi(g, b, f, a, Zs(d, e) | 0, e);
        return;
    }
    function Xs() {
        var b = 0, d = 0;
        if (!(a[7872] | 0)) {
            et(10244);
            Ha(52, 10244, o | 0);
            d = 7872;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10244) | 0)) {
            b = 10244;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            et(10244);
        }
        return 10244;
    }
    function Ys(a) {
        a = a | 0;
        return a | 0;
    }
    function Zs(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = Xs() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            _s(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            $s(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function _s(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function $s(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = at(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            bt(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            _s(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            ct(a, f);
            dt(f);
            l = i;
            return;
        }
    }
    function at(a) {
        a = a | 0;
        return 536870911;
    }
    function bt(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function ct(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function dt(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function et(a) {
        a = a | 0;
        ht(a);
        return;
    }
    function ft(a) {
        a = a | 0;
        gt(a + 24 | 0);
        return;
    }
    function gt(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function ht(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 16, b, it() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function it() {
        return 1400;
    }
    function jt(a) {
        a = a | 0;
        return lt(c[(kt(a) | 0) >> 2] | 0) | 0;
    }
    function kt(a) {
        a = a | 0;
        return (c[(Xs() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function lt(a) {
        a = a | 0;
        return mt(Ab[a & 7]() | 0) | 0;
    }
    function mt(a) {
        a = a | 0;
        return a | 0;
    }
    function nt() {
        var b = 0;
        if (!(a[7880] | 0)) {
            ut(10280);
            Ha(25, 10280, o | 0);
            b = 7880;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10280;
    }
    function ot(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = pt() | 0;
        c[a + 4 >> 2] = qt() | 0;
        c[a + 12 >> 2] = b;
        c[a + 8 >> 2] = rt() | 0;
        c[a + 32 >> 2] = 4;
        return;
    }
    function pt() {
        return 11711;
    }
    function qt() {
        return 1356;
    }
    function rt() {
        return lr() | 0;
    }
    function st(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((jr(d, 896) | 0) == 512) {
            if (c | 0) {
                tt(c);
                sC(c);
            }
        } else if (b | 0) {
            mf(b);
            sC(b);
        }
        return;
    }
    function tt(a) {
        a = a | 0;
        a = c[a + 4 >> 2] | 0;
        if (a | 0) oC(a);
        return;
    }
    function ut(a) {
        a = a | 0;
        Zi(a);
        return;
    }
    function vt(a) {
        a = a | 0;
        wt(a, 4920);
        xt(a);
        yt(a);
        return;
    }
    function wt(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = nn() | 0;
        c[a >> 2] = d;
        Yt(d, b);
        Hv(c[a >> 2] | 0);
        return;
    }
    function xt(a) {
        a = a | 0;
        var b = 0;
        b = c[a >> 2] | 0;
        At(b, Mt() | 0);
        return a | 0;
    }
    function yt(a) {
        a = a | 0;
        var b = 0;
        b = c[a >> 2] | 0;
        At(b, zt() | 0);
        return a | 0;
    }
    function zt() {
        var b = 0;
        if (!(a[7888] | 0)) {
            Bt(10328);
            Ha(53, 10328, o | 0);
            b = 7888;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        if (!(si(10328) | 0)) Bt(10328);
        return 10328;
    }
    function At(a, b) {
        a = a | 0;
        b = b | 0;
        fi(a, 0, b, 0, 0, 0);
        return;
    }
    function Bt(a) {
        a = a | 0;
        Et(a);
        Gt(a, 10);
        return;
    }
    function Ct(a) {
        a = a | 0;
        Dt(a + 24 | 0);
        return;
    }
    function Dt(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function Et(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 5, 1, b, Jt() | 0, 2);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Ft(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        Ht(a, b, c);
        return;
    }
    function Gt(a, b) {
        a = a | 0;
        b = b | 0;
        c[a + 20 >> 2] = b;
        return;
    }
    function Ht(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = +d;
        var e = 0, f = 0, g = 0, i = 0, j = 0;
        e = l;
        l = l + 16 | 0;
        g = e + 8 | 0;
        j = e + 13 | 0;
        f = e;
        i = e + 12 | 0;
        tj(j, b);
        c[g >> 2] = uj(j, b) | 0;
        rj(i, d);
        h[f >> 3] = +sj(i, d);
        It(a, g, f);
        l = e;
        return;
    }
    function It(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        mg(b + 8 | 0, c[d >> 2] | 0, +h[e >> 3]);
        a[b + 24 >> 0] = 1;
        return;
    }
    function Jt() {
        return 1404;
    }
    function Kt(a, b) {
        a = a | 0;
        b = +b;
        return Lt(a, b) | 0;
    }
    function Lt(a, b) {
        a = a | 0;
        b = +b;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        e = l;
        l = l + 16 | 0;
        g = e + 4 | 0;
        h = e + 8 | 0;
        i = e;
        f = jy(8) | 0;
        d = f;
        j = qC(16) | 0;
        tj(g, a);
        a = uj(g, a) | 0;
        rj(h, b);
        mg(j, a, +sj(h, b));
        h = d + 4 | 0;
        c[h >> 2] = j;
        a = qC(8) | 0;
        h = c[h >> 2] | 0;
        c[i >> 2] = 0;
        c[g >> 2] = c[i >> 2];
        qn(a, h, g);
        c[f >> 2] = a;
        l = e;
        return d | 0;
    }
    function Mt() {
        var b = 0;
        if (!(a[7896] | 0)) {
            Nt(10364);
            Ha(54, 10364, o | 0);
            b = 7896;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        if (!(si(10364) | 0)) Nt(10364);
        return 10364;
    }
    function Nt(a) {
        a = a | 0;
        Qt(a);
        Gt(a, 55);
        return;
    }
    function Ot(a) {
        a = a | 0;
        Pt(a + 24 | 0);
        return;
    }
    function Pt(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function Qt(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 5, 4, b, Vt() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Rt(a) {
        a = a | 0;
        St(a);
        return;
    }
    function St(a) {
        a = a | 0;
        Tt(a);
        return;
    }
    function Tt(b) {
        b = b | 0;
        Ut(b + 8 | 0);
        a[b + 24 >> 0] = 1;
        return;
    }
    function Ut(a) {
        a = a | 0;
        c[a >> 2] = 0;
        h[a + 8 >> 3] = 0.0;
        return;
    }
    function Vt() {
        return 1424;
    }
    function Wt() {
        return Xt() | 0;
    }
    function Xt() {
        var a = 0, b = 0, d = 0, e = 0, f = 0, g = 0, h = 0;
        b = l;
        l = l + 16 | 0;
        f = b + 4 | 0;
        h = b;
        d = jy(8) | 0;
        a = d;
        e = qC(16) | 0;
        Ut(e);
        g = a + 4 | 0;
        c[g >> 2] = e;
        e = qC(8) | 0;
        g = c[g >> 2] | 0;
        c[h >> 2] = 0;
        c[f >> 2] = c[h >> 2];
        qn(e, g, f);
        c[d >> 2] = e;
        l = b;
        return a | 0;
    }
    function Yt(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = Zt() | 0;
        c[a + 4 >> 2] = _t() | 0;
        c[a + 12 >> 2] = b;
        c[a + 8 >> 2] = $t() | 0;
        c[a + 32 >> 2] = 5;
        return;
    }
    function Zt() {
        return 11710;
    }
    function _t() {
        return 1416;
    }
    function $t() {
        return cu() | 0;
    }
    function au(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((jr(d, 896) | 0) == 512) {
            if (c | 0) {
                bu(c);
                sC(c);
            }
        } else if (b | 0) sC(b);
        return;
    }
    function bu(a) {
        a = a | 0;
        a = c[a + 4 >> 2] | 0;
        if (a | 0) oC(a);
        return;
    }
    function cu() {
        var b = 0;
        if (!(a[7904] | 0)) {
            c[2600] = du() | 0;
            c[2601] = 0;
            b = 7904;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10400;
    }
    function du() {
        return c[357] | 0;
    }
    function eu(a) {
        a = a | 0;
        fu(a, 4926);
        gu(a);
        return;
    }
    function fu(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = Ci() | 0;
        c[a >> 2] = d;
        su(d, b);
        Hv(c[a >> 2] | 0);
        return;
    }
    function gu(a) {
        a = a | 0;
        var b = 0;
        b = c[a >> 2] | 0;
        At(b, hu() | 0);
        return a | 0;
    }
    function hu() {
        var b = 0;
        if (!(a[7912] | 0)) {
            iu(10412);
            Ha(56, 10412, o | 0);
            b = 7912;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        if (!(si(10412) | 0)) iu(10412);
        return 10412;
    }
    function iu(a) {
        a = a | 0;
        lu(a);
        Gt(a, 57);
        return;
    }
    function ju(a) {
        a = a | 0;
        ku(a + 24 | 0);
        return;
    }
    function ku(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function lu(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 5, 5, b, pu() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function mu(a) {
        a = a | 0;
        nu(a);
        return;
    }
    function nu(a) {
        a = a | 0;
        ou(a);
        return;
    }
    function ou(b) {
        b = b | 0;
        var d = 0, e = 0;
        d = b + 8 | 0;
        e = d + 48 | 0;
        do {
            c[d >> 2] = 0;
            d = d + 4 | 0;
        }while ((d | 0) < (e | 0))
        a[b + 56 >> 0] = 1;
        return;
    }
    function pu() {
        return 1432;
    }
    function qu() {
        return ru() | 0;
    }
    function ru() {
        var a = 0, b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0;
        h = l;
        l = l + 16 | 0;
        a = h + 4 | 0;
        b = h;
        d = jy(8) | 0;
        e = d;
        f = qC(48) | 0;
        g = f;
        i = g + 48 | 0;
        do {
            c[g >> 2] = 0;
            g = g + 4 | 0;
        }while ((g | 0) < (i | 0))
        g = e + 4 | 0;
        c[g >> 2] = f;
        i = qC(8) | 0;
        g = c[g >> 2] | 0;
        c[b >> 2] = 0;
        c[a >> 2] = c[b >> 2];
        Ji(i, g, a);
        c[d >> 2] = i;
        l = h;
        return e | 0;
    }
    function su(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = tu() | 0;
        c[a + 4 >> 2] = uu() | 0;
        c[a + 12 >> 2] = b;
        c[a + 8 >> 2] = vu() | 0;
        c[a + 32 >> 2] = 6;
        return;
    }
    function tu() {
        return 11704;
    }
    function uu() {
        return 1436;
    }
    function vu() {
        return cu() | 0;
    }
    function wu(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((jr(d, 896) | 0) == 512) {
            if (c | 0) {
                xu(c);
                sC(c);
            }
        } else if (b | 0) sC(b);
        return;
    }
    function xu(a) {
        a = a | 0;
        a = c[a + 4 >> 2] | 0;
        if (a | 0) oC(a);
        return;
    }
    function yu(a) {
        a = a | 0;
        zu(a, 4933);
        Au(a);
        Bu(a);
        return;
    }
    function zu(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = cv() | 0;
        c[a >> 2] = d;
        dv(d, b);
        Hv(c[a >> 2] | 0);
        return;
    }
    function Au(a) {
        a = a | 0;
        var b = 0;
        b = c[a >> 2] | 0;
        At(b, Su() | 0);
        return a | 0;
    }
    function Bu(a) {
        a = a | 0;
        var b = 0;
        b = c[a >> 2] | 0;
        At(b, Cu() | 0);
        return a | 0;
    }
    function Cu() {
        var b = 0;
        if (!(a[7920] | 0)) {
            Du(10452);
            Ha(58, 10452, o | 0);
            b = 7920;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        if (!(si(10452) | 0)) Du(10452);
        return 10452;
    }
    function Du(a) {
        a = a | 0;
        Gu(a);
        Gt(a, 1);
        return;
    }
    function Eu(a) {
        a = a | 0;
        Fu(a + 24 | 0);
        return;
    }
    function Fu(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function Gu(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 5, 1, b, Lu() | 0, 2);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Hu(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        Iu(a, b, c);
        return;
    }
    function Iu(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        var d = 0, e = 0, f = 0, g = 0, i = 0;
        d = l;
        l = l + 32 | 0;
        f = d + 8 | 0;
        i = d + 17 | 0;
        e = d;
        g = d + 16 | 0;
        rj(i, b);
        h[f >> 3] = +sj(i, b);
        rj(g, c);
        h[e >> 3] = +sj(g, c);
        Ju(a, f, e);
        l = d;
        return;
    }
    function Ju(b, c, d) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        Ku(b + 8 | 0, +h[c >> 3], +h[d >> 3]);
        a[b + 24 >> 0] = 1;
        return;
    }
    function Ku(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        h[a >> 3] = b;
        h[a + 8 >> 3] = c;
        return;
    }
    function Lu() {
        return 1472;
    }
    function Mu(a, b) {
        a = +a;
        b = +b;
        return Nu(a, b) | 0;
    }
    function Nu(a, b) {
        a = +a;
        b = +b;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        e = l;
        l = l + 16 | 0;
        h = e + 4 | 0;
        i = e + 8 | 0;
        j = e;
        f = jy(8) | 0;
        d = f;
        g = qC(16) | 0;
        rj(h, a);
        a = +sj(h, a);
        rj(i, b);
        Ku(g, a, +sj(i, b));
        i = d + 4 | 0;
        c[i >> 2] = g;
        g = qC(8) | 0;
        i = c[i >> 2] | 0;
        c[j >> 2] = 0;
        c[h >> 2] = c[j >> 2];
        Ou(g, i, h);
        c[f >> 2] = g;
        l = e;
        return d | 0;
    }
    function Ou(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        d = qC(16) | 0;
        c[d + 4 >> 2] = 0;
        c[d + 8 >> 2] = 0;
        c[d >> 2] = 1452;
        c[d + 12 >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function Pu(a) {
        a = a | 0;
        kC(a);
        sC(a);
        return;
    }
    function Qu(a) {
        a = a | 0;
        a = c[a + 12 >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Ru(a) {
        a = a | 0;
        sC(a);
        return;
    }
    function Su() {
        var b = 0;
        if (!(a[7928] | 0)) {
            Tu(10488);
            Ha(59, 10488, o | 0);
            b = 7928;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        if (!(si(10488) | 0)) Tu(10488);
        return 10488;
    }
    function Tu(a) {
        a = a | 0;
        Wu(a);
        Gt(a, 60);
        return;
    }
    function Uu(a) {
        a = a | 0;
        Vu(a + 24 | 0);
        return;
    }
    function Vu(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function Wu(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 5, 6, b, $u() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Xu(a) {
        a = a | 0;
        Yu(a);
        return;
    }
    function Yu(a) {
        a = a | 0;
        Zu(a);
        return;
    }
    function Zu(b) {
        b = b | 0;
        _u(b + 8 | 0);
        a[b + 24 >> 0] = 1;
        return;
    }
    function _u(a) {
        a = a | 0;
        c[a >> 2] = 0;
        c[a + 4 >> 2] = 0;
        c[a + 8 >> 2] = 0;
        c[a + 12 >> 2] = 0;
        return;
    }
    function $u() {
        return 1492;
    }
    function av() {
        return bv() | 0;
    }
    function bv() {
        var a = 0, b = 0, d = 0, e = 0, f = 0, g = 0, h = 0;
        b = l;
        l = l + 16 | 0;
        f = b + 4 | 0;
        h = b;
        d = jy(8) | 0;
        a = d;
        e = qC(16) | 0;
        _u(e);
        g = a + 4 | 0;
        c[g >> 2] = e;
        e = qC(8) | 0;
        g = c[g >> 2] | 0;
        c[h >> 2] = 0;
        c[f >> 2] = c[h >> 2];
        Ou(e, g, f);
        c[d >> 2] = e;
        l = b;
        return a | 0;
    }
    function cv() {
        var b = 0;
        if (!(a[7936] | 0)) {
            jv(10524);
            Ha(25, 10524, o | 0);
            b = 7936;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10524;
    }
    function dv(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = ev() | 0;
        c[a + 4 >> 2] = fv() | 0;
        c[a + 12 >> 2] = b;
        c[a + 8 >> 2] = gv() | 0;
        c[a + 32 >> 2] = 7;
        return;
    }
    function ev() {
        return 11700;
    }
    function fv() {
        return 1484;
    }
    function gv() {
        return cu() | 0;
    }
    function hv(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((jr(d, 896) | 0) == 512) {
            if (c | 0) {
                iv(c);
                sC(c);
            }
        } else if (b | 0) sC(b);
        return;
    }
    function iv(a) {
        a = a | 0;
        a = c[a + 4 >> 2] | 0;
        if (a | 0) oC(a);
        return;
    }
    function jv(a) {
        a = a | 0;
        Zi(a);
        return;
    }
    function kv(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        a = ai(b) | 0;
        b = lv(c) | 0;
        c = mv(c, 0) | 0;
        Zv(a, b, c, nv() | 0, 0);
        return;
    }
    function lv(a) {
        a = a | 0;
        return a | 0;
    }
    function mv(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = nv() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            vv(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            wv(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function nv() {
        var b = 0, d = 0;
        if (!(a[7944] | 0)) {
            ov(10568);
            Ha(61, 10568, o | 0);
            d = 7944;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10568) | 0)) {
            b = 10568;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            ov(10568);
        }
        return 10568;
    }
    function ov(a) {
        a = a | 0;
        rv(a);
        return;
    }
    function pv(a) {
        a = a | 0;
        qv(a + 24 | 0);
        return;
    }
    function qv(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function rv(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 17, b, ql() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function sv(a) {
        a = a | 0;
        return uv(c[(tv(a) | 0) >> 2] | 0) | 0;
    }
    function tv(a) {
        a = a | 0;
        return (c[(nv() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function uv(a) {
        a = a | 0;
        return ul(Ab[a & 7]() | 0) | 0;
    }
    function vv(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function wv(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = xv(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            yv(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            vv(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            zv(a, f);
            Av(f);
            l = i;
            return;
        }
    }
    function xv(a) {
        a = a | 0;
        return 536870911;
    }
    function yv(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function zv(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Av(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Bv() {
        Cv();
        return;
    }
    function Cv() {
        Dv(10604);
        return;
    }
    function Dv(a) {
        a = a | 0;
        Ev(a, 4955);
        return;
    }
    function Ev(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = Fv() | 0;
        c[a >> 2] = d;
        Gv(d, b);
        Hv(c[a >> 2] | 0);
        return;
    }
    function Fv() {
        var b = 0;
        if (!(a[7952] | 0)) {
            Rv(10612);
            Ha(25, 10612, o | 0);
            b = 7952;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10612;
    }
    function Gv(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = Mv() | 0;
        c[a + 4 >> 2] = Nv() | 0;
        c[a + 12 >> 2] = b;
        c[a + 8 >> 2] = Ov() | 0;
        c[a + 32 >> 2] = 8;
        return;
    }
    function Hv(a) {
        a = a | 0;
        var b = 0, d = 0;
        b = l;
        l = l + 16 | 0;
        d = b;
        Iv();
        c[d >> 2] = a;
        Jv(10608, d);
        l = b;
        return;
    }
    function Iv() {
        if (!(a[11714] | 0)) {
            c[2652] = 0;
            Ha(62, 10608, o | 0);
            a[11714] = 1;
        }
        return 10608;
    }
    function Jv(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = qC(8) | 0;
        c[d + 4 >> 2] = c[b >> 2];
        c[d >> 2] = c[a >> 2];
        c[a >> 2] = d;
        return;
    }
    function Kv(a) {
        a = a | 0;
        Lv(a);
        return;
    }
    function Lv(a) {
        a = a | 0;
        var b = 0, d = 0;
        b = c[a >> 2] | 0;
        if (b | 0) do {
            d = b;
            b = c[b >> 2] | 0;
            sC(d);
        }while ((b | 0) != 0)
        c[a >> 2] = 0;
        return;
    }
    function Mv() {
        return 11715;
    }
    function Nv() {
        return 1496;
    }
    function Ov() {
        return lr() | 0;
    }
    function Pv(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((jr(d, 896) | 0) == 512) {
            if (c | 0) {
                Qv(c);
                sC(c);
            }
        } else if (b | 0) sC(b);
        return;
    }
    function Qv(a) {
        a = a | 0;
        a = c[a + 4 >> 2] | 0;
        if (a | 0) oC(a);
        return;
    }
    function Rv(a) {
        a = a | 0;
        Zi(a);
        return;
    }
    function Sv(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        Iv();
        d = c[2652] | 0;
        a: do if (d | 0) {
            while(true){
                e = c[d + 4 >> 2] | 0;
                if (e | 0 ? (AB(Tv(e) | 0, a) | 0) == 0 : 0) break;
                d = c[d >> 2] | 0;
                if (!d) break a;
            }
            Uv(e, b);
        }
        while (0)
        return;
    }
    function Tv(a) {
        a = a | 0;
        return c[a + 12 >> 2] | 0;
    }
    function Uv(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        a = a + 36 | 0;
        d = c[a >> 2] | 0;
        if (d | 0) {
            vf(d);
            sC(d);
        }
        d = qC(4) | 0;
        Og(d, b);
        c[a >> 2] = d;
        return;
    }
    function Vv() {
        if (!(a[11716] | 0)) {
            c[2664] = 0;
            Ha(63, 10656, o | 0);
            a[11716] = 1;
        }
        return 10656;
    }
    function Wv() {
        var b = 0;
        if (!(a[11717] | 0)) {
            Xv();
            c[2665] = 1504;
            a[11717] = 1;
            b = 1504;
        } else b = c[2665] | 0;
        return b | 0;
    }
    function Xv() {
        if (!(a[11740] | 0)) {
            a[11718] = ji(ji(8, 0) | 0, 0) | 0;
            a[11719] = ji(ji(0, 0) | 0, 0) | 0;
            a[11720] = ji(ji(0, 16) | 0, 0) | 0;
            a[11721] = ji(ji(8, 0) | 0, 0) | 0;
            a[11722] = ji(ji(0, 0) | 0, 0) | 0;
            a[11723] = ji(ji(8, 0) | 0, 0) | 0;
            a[11724] = ji(ji(0, 0) | 0, 0) | 0;
            a[11725] = ji(ji(8, 0) | 0, 0) | 0;
            a[11726] = ji(ji(0, 0) | 0, 0) | 0;
            a[11727] = ji(ji(8, 0) | 0, 0) | 0;
            a[11728] = ji(ji(0, 0) | 0, 0) | 0;
            a[11729] = ji(ji(0, 0) | 0, 32) | 0;
            a[11730] = ji(ji(0, 0) | 0, 32) | 0;
            a[11740] = 1;
        }
        return;
    }
    function Yv() {
        return 1572;
    }
    function Zv(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        g = l;
        l = l + 32 | 0;
        m = g + 16 | 0;
        k = g + 12 | 0;
        j = g + 8 | 0;
        i = g + 4 | 0;
        h = g;
        c[m >> 2] = a;
        c[k >> 2] = b;
        c[j >> 2] = d;
        c[i >> 2] = e;
        c[h >> 2] = f;
        Vv();
        _v(10656, m, k, j, i, h);
        l = g;
        return;
    }
    function _v(a, b, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var h = 0;
        h = qC(24) | 0;
        ii(h + 4 | 0, c[b >> 2] | 0, c[d >> 2] | 0, c[e >> 2] | 0, c[f >> 2] | 0, c[g >> 2] | 0);
        c[h >> 2] = c[a >> 2];
        c[a >> 2] = h;
        return;
    }
    function $v(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0;
        u = l;
        l = l + 32 | 0;
        q = u + 20 | 0;
        r = u + 8 | 0;
        s = u + 4 | 0;
        t = u;
        b = c[b >> 2] | 0;
        if (b | 0) {
            p = q + 4 | 0;
            j = q + 8 | 0;
            k = r + 4 | 0;
            m = r + 8 | 0;
            n = r + 8 | 0;
            o = q + 8 | 0;
            do {
                h = b + 4 | 0;
                i = aw(h) | 0;
                if (i | 0) {
                    f = bw(i) | 0;
                    c[q >> 2] = 0;
                    c[p >> 2] = 0;
                    c[j >> 2] = 0;
                    e = (cw(i) | 0) + 1 | 0;
                    dw(q, e);
                    if (e | 0) while(true){
                        e = e + -1 | 0;
                        OA(r, c[f >> 2] | 0);
                        g = c[p >> 2] | 0;
                        if (g >>> 0 < (c[o >> 2] | 0) >>> 0) {
                            c[g >> 2] = c[r >> 2];
                            c[p >> 2] = (c[p >> 2] | 0) + 4;
                        } else ew(q, r);
                        if (!e) break;
                        else f = f + 4 | 0;
                    }
                    e = fw(i) | 0;
                    c[r >> 2] = 0;
                    c[k >> 2] = 0;
                    c[m >> 2] = 0;
                    a: if (c[e >> 2] | 0) {
                        f = 0;
                        g = 0;
                        while(true){
                            if ((f | 0) == (g | 0)) gw(r, e);
                            else {
                                c[f >> 2] = c[e >> 2];
                                c[k >> 2] = (c[k >> 2] | 0) + 4;
                            }
                            e = e + 4 | 0;
                            if (!(c[e >> 2] | 0)) break a;
                            f = c[k >> 2] | 0;
                            g = c[n >> 2] | 0;
                        }
                    }
                    c[s >> 2] = hw(h) | 0;
                    c[t >> 2] = si(i) | 0;
                    iw(d, a, s, t, q, r);
                    jw(r);
                    kw(q);
                }
                b = c[b >> 2] | 0;
            }while ((b | 0) != 0)
        }
        l = u;
        return;
    }
    function aw(a) {
        a = a | 0;
        return c[a + 12 >> 2] | 0;
    }
    function bw(a) {
        a = a | 0;
        return c[a + 12 >> 2] | 0;
    }
    function cw(a) {
        a = a | 0;
        return c[a + 16 >> 2] | 0;
    }
    function dw(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0;
        f = l;
        l = l + 32 | 0;
        d = f;
        e = c[a >> 2] | 0;
        if ((c[a + 8 >> 2] | 0) - e >> 2 >>> 0 < b >>> 0) {
            Rw(d, b, (c[a + 4 >> 2] | 0) - e >> 2, a + 8 | 0);
            Sw(a, d);
            Tw(d);
        }
        l = f;
        return;
    }
    function ew(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0;
        h = l;
        l = l + 32 | 0;
        d = h;
        e = a + 4 | 0;
        f = ((c[e >> 2] | 0) - (c[a >> 2] | 0) >> 2) + 1 | 0;
        g = Nw(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            i = c[a >> 2] | 0;
            k = (c[a + 8 >> 2] | 0) - i | 0;
            j = k >> 1;
            Rw(d, k >> 2 >>> 0 < g >>> 1 >>> 0 ? j >>> 0 < f >>> 0 ? f : j : g, (c[e >> 2] | 0) - i >> 2, a + 8 | 0);
            g = d + 8 | 0;
            c[c[g >> 2] >> 2] = c[b >> 2];
            c[g >> 2] = (c[g >> 2] | 0) + 4;
            Sw(a, d);
            Tw(d);
            l = h;
            return;
        }
    }
    function fw(a) {
        a = a | 0;
        return c[a + 8 >> 2] | 0;
    }
    function gw(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0;
        h = l;
        l = l + 32 | 0;
        d = h;
        e = a + 4 | 0;
        f = ((c[e >> 2] | 0) - (c[a >> 2] | 0) >> 2) + 1 | 0;
        g = Kw(a) | 0;
        if (g >>> 0 < f >>> 0) jC(a);
        else {
            i = c[a >> 2] | 0;
            k = (c[a + 8 >> 2] | 0) - i | 0;
            j = k >> 1;
            Ow(d, k >> 2 >>> 0 < g >>> 1 >>> 0 ? j >>> 0 < f >>> 0 ? f : j : g, (c[e >> 2] | 0) - i >> 2, a + 8 | 0);
            g = d + 8 | 0;
            c[c[g >> 2] >> 2] = c[b >> 2];
            c[g >> 2] = (c[g >> 2] | 0) + 4;
            Pw(a, d);
            Qw(d);
            l = h;
            return;
        }
    }
    function hw(a) {
        a = a | 0;
        return c[a >> 2] | 0;
    }
    function iw(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        lw(a, b, c, d, e, f);
        return;
    }
    function jw(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -4 - e | 0) >>> 2) << 2);
            sC(d);
        }
        return;
    }
    function kw(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -4 - e | 0) >>> 2) << 2);
            sC(d);
        }
        return;
    }
    function lw(a, b, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        h = l;
        l = l + 48 | 0;
        m = h + 40 | 0;
        i = h + 32 | 0;
        n = h + 24 | 0;
        j = h + 12 | 0;
        k = h;
        UA(i);
        a = Sg(a) | 0;
        c[n >> 2] = c[b >> 2];
        d = c[d >> 2] | 0;
        e = c[e >> 2] | 0;
        mw(j, f);
        nw(k, g);
        c[m >> 2] = c[n >> 2];
        ow(a, m, d, e, j, k);
        jw(k);
        kw(j);
        WA(i);
        l = h;
        return;
    }
    function mw(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        c[a >> 2] = 0;
        c[a + 4 >> 2] = 0;
        c[a + 8 >> 2] = 0;
        d = b + 4 | 0;
        e = (c[d >> 2] | 0) - (c[b >> 2] | 0) >> 2;
        if (e | 0) {
            Lw(a, e);
            Mw(a, c[b >> 2] | 0, c[d >> 2] | 0, e);
        }
        return;
    }
    function nw(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        c[a >> 2] = 0;
        c[a + 4 >> 2] = 0;
        c[a + 8 >> 2] = 0;
        d = b + 4 | 0;
        e = (c[d >> 2] | 0) - (c[b >> 2] | 0) >> 2;
        if (e | 0) {
            Iw(a, e);
            Jw(a, c[b >> 2] | 0, c[d >> 2] | 0, e);
        }
        return;
    }
    function ow(a, b, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0, m = 0, n = 0;
        h = l;
        l = l + 32 | 0;
        m = h + 28 | 0;
        n = h + 24 | 0;
        i = h + 12 | 0;
        j = h;
        k = Vg(pw() | 0) | 0;
        c[n >> 2] = c[b >> 2];
        c[m >> 2] = c[n >> 2];
        b = qw(m) | 0;
        d = rw(d) | 0;
        e = sw(e) | 0;
        c[i >> 2] = c[f >> 2];
        m = f + 4 | 0;
        c[i + 4 >> 2] = c[m >> 2];
        n = f + 8 | 0;
        c[i + 8 >> 2] = c[n >> 2];
        c[n >> 2] = 0;
        c[m >> 2] = 0;
        c[f >> 2] = 0;
        f = tw(i) | 0;
        c[j >> 2] = c[g >> 2];
        m = g + 4 | 0;
        c[j + 4 >> 2] = c[m >> 2];
        n = g + 8 | 0;
        c[j + 8 >> 2] = c[n >> 2];
        c[n >> 2] = 0;
        c[m >> 2] = 0;
        c[g >> 2] = 0;
        Ba(0, k | 0, a | 0, b | 0, d | 0, e | 0, f | 0, uw(j) | 0);
        jw(j);
        kw(i);
        l = h;
        return;
    }
    function pw() {
        var b = 0;
        if (!(a[7968] | 0)) {
            Gw(10708);
            b = 7968;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10708;
    }
    function qw(a) {
        a = a | 0;
        return yw(a) | 0;
    }
    function rw(a) {
        a = a | 0;
        return ww(a) | 0;
    }
    function sw(a) {
        a = a | 0;
        return ul(a) | 0;
    }
    function tw(a) {
        a = a | 0;
        return xw(a) | 0;
    }
    function uw(a) {
        a = a | 0;
        return vw(a) | 0;
    }
    function vw(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        e = (c[a + 4 >> 2] | 0) - (c[a >> 2] | 0) | 0;
        d = e >> 2;
        e = jy(e + 4 | 0) | 0;
        c[e >> 2] = d;
        if (d | 0) {
            b = 0;
            do {
                c[e + 4 + (b << 2) >> 2] = ww(c[(c[a >> 2] | 0) + (b << 2) >> 2] | 0) | 0;
                b = b + 1 | 0;
            }while ((b | 0) != (d | 0))
        }
        return e | 0;
    }
    function ww(a) {
        a = a | 0;
        return a | 0;
    }
    function xw(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        e = (c[a + 4 >> 2] | 0) - (c[a >> 2] | 0) | 0;
        d = e >> 2;
        e = jy(e + 4 | 0) | 0;
        c[e >> 2] = d;
        if (d | 0) {
            b = 0;
            do {
                c[e + 4 + (b << 2) >> 2] = yw((c[a >> 2] | 0) + (b << 2) | 0) | 0;
                b = b + 1 | 0;
            }while ((b | 0) != (d | 0))
        }
        return e | 0;
    }
    function yw(a) {
        a = a | 0;
        var b = 0, c = 0, d = 0, e = 0;
        e = l;
        l = l + 32 | 0;
        b = e + 12 | 0;
        c = e;
        d = Di(zw() | 0) | 0;
        if (!d) a = Aw(a) | 0;
        else {
            Ei(b, d);
            Fi(c, b);
            RA(a, c);
            a = Hi(b) | 0;
        }
        l = e;
        return a | 0;
    }
    function zw() {
        var b = 0;
        if (!(a[7960] | 0)) {
            Fw(10664);
            Ha(25, 10664, o | 0);
            b = 7960;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10664;
    }
    function Aw(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0;
        d = l;
        l = l + 16 | 0;
        f = d + 4 | 0;
        h = d;
        e = jy(8) | 0;
        b = e;
        i = qC(4) | 0;
        c[i >> 2] = c[a >> 2];
        g = b + 4 | 0;
        c[g >> 2] = i;
        a = qC(8) | 0;
        g = c[g >> 2] | 0;
        c[h >> 2] = 0;
        c[f >> 2] = c[h >> 2];
        Bw(a, g, f);
        c[e >> 2] = a;
        l = d;
        return b | 0;
    }
    function Bw(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        d = qC(16) | 0;
        c[d + 4 >> 2] = 0;
        c[d + 8 >> 2] = 0;
        c[d >> 2] = 1656;
        c[d + 12 >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function Cw(a) {
        a = a | 0;
        kC(a);
        sC(a);
        return;
    }
    function Dw(a) {
        a = a | 0;
        a = c[a + 12 >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Ew(a) {
        a = a | 0;
        sC(a);
        return;
    }
    function Fw(a) {
        a = a | 0;
        Zi(a);
        return;
    }
    function Gw(a) {
        a = a | 0;
        fh(a, Hw() | 0, 5);
        return;
    }
    function Hw() {
        return 1676;
    }
    function Iw(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        if ((Kw(a) | 0) >>> 0 < b >>> 0) jC(a);
        if (b >>> 0 > 1073741823) Ta();
        else {
            d = qC(b << 2) | 0;
            c[a + 4 >> 2] = d;
            c[a >> 2] = d;
            c[a + 8 >> 2] = d + (b << 2);
            return;
        }
    }
    function Jw(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        e = a + 4 | 0;
        a = d - b | 0;
        if ((a | 0) > 0) {
            BC(c[e >> 2] | 0, b | 0, a | 0);
            c[e >> 2] = (c[e >> 2] | 0) + (a >>> 2 << 2);
        }
        return;
    }
    function Kw(a) {
        a = a | 0;
        return 1073741823;
    }
    function Lw(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        if ((Nw(a) | 0) >>> 0 < b >>> 0) jC(a);
        if (b >>> 0 > 1073741823) Ta();
        else {
            d = qC(b << 2) | 0;
            c[a + 4 >> 2] = d;
            c[a >> 2] = d;
            c[a + 8 >> 2] = d + (b << 2);
            return;
        }
    }
    function Mw(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        e = a + 4 | 0;
        a = d - b | 0;
        if ((a | 0) > 0) {
            BC(c[e >> 2] | 0, b | 0, a | 0);
            c[e >> 2] = (c[e >> 2] | 0) + (a >>> 2 << 2);
        }
        return;
    }
    function Nw(a) {
        a = a | 0;
        return 1073741823;
    }
    function Ow(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 1073741823) Ta();
            else {
                f = qC(b << 2) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 2) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 2);
        return;
    }
    function Pw(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 2) << 2) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Qw(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -4 - b | 0) >>> 2) << 2);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Rw(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 1073741823) Ta();
            else {
                f = qC(b << 2) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 2) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 2);
        return;
    }
    function Sw(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 2) << 2) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Tw(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -4 - b | 0) >>> 2) << 2);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Uw(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0;
        r = l;
        l = l + 32 | 0;
        m = r + 20 | 0;
        n = r + 12 | 0;
        k = r + 16 | 0;
        o = r + 4 | 0;
        p = r;
        q = r + 8 | 0;
        i = Wv() | 0;
        g = c[i >> 2] | 0;
        h = c[g >> 2] | 0;
        if (h | 0) {
            j = c[i + 8 >> 2] | 0;
            i = c[i + 4 >> 2] | 0;
            while(true){
                OA(m, h);
                Vw(a, m, i, j);
                g = g + 4 | 0;
                h = c[g >> 2] | 0;
                if (!h) break;
                else {
                    j = j + 1 | 0;
                    i = i + 1 | 0;
                }
            }
        }
        g = Yv() | 0;
        h = c[g >> 2] | 0;
        if (h | 0) do {
            OA(m, h);
            c[n >> 2] = c[g + 4 >> 2];
            Ww(b, m, n);
            g = g + 8 | 0;
            h = c[g >> 2] | 0;
        }while ((h | 0) != 0)
        g = c[(Iv() | 0) >> 2] | 0;
        if (g | 0) do {
            b = c[g + 4 >> 2] | 0;
            OA(m, c[(Xw(b) | 0) >> 2] | 0);
            c[n >> 2] = Tv(b) | 0;
            Yw(d, m, n);
            g = c[g >> 2] | 0;
        }while ((g | 0) != 0)
        OA(k, 0);
        g = Vv() | 0;
        c[m >> 2] = c[k >> 2];
        $v(m, g, f);
        g = c[(Iv() | 0) >> 2] | 0;
        if (g | 0) {
            a = m + 4 | 0;
            b = m + 8 | 0;
            d = m + 8 | 0;
            do {
                j = c[g + 4 >> 2] | 0;
                OA(n, c[(Xw(j) | 0) >> 2] | 0);
                _w(o, Zw(j) | 0);
                h = c[o >> 2] | 0;
                if (h | 0) {
                    c[m >> 2] = 0;
                    c[a >> 2] = 0;
                    c[b >> 2] = 0;
                    do {
                        OA(p, c[(Xw(c[h + 4 >> 2] | 0) | 0) >> 2] | 0);
                        i = c[a >> 2] | 0;
                        if (i >>> 0 < (c[d >> 2] | 0) >>> 0) {
                            c[i >> 2] = c[p >> 2];
                            c[a >> 2] = (c[a >> 2] | 0) + 4;
                        } else ew(m, p);
                        h = c[h >> 2] | 0;
                    }while ((h | 0) != 0)
                    $w(e, n, m);
                    kw(m);
                }
                c[q >> 2] = c[n >> 2];
                k = ax(j) | 0;
                c[m >> 2] = c[q >> 2];
                $v(m, k, f);
                Wi(o);
                g = c[g >> 2] | 0;
            }while ((g | 0) != 0)
        }
        l = r;
        return;
    }
    function Vw(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        ox(a, b, c, d);
        return;
    }
    function Ww(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        nx(a, b, c);
        return;
    }
    function Xw(a) {
        a = a | 0;
        return a | 0;
    }
    function Yw(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        ix(a, b, c);
        return;
    }
    function Zw(a) {
        a = a | 0;
        return a + 16 | 0;
    }
    function _w(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        g = l;
        l = l + 16 | 0;
        f = g + 8 | 0;
        d = g;
        c[a >> 2] = 0;
        e = c[b >> 2] | 0;
        c[f >> 2] = e;
        c[d >> 2] = a;
        d = gx(d) | 0;
        if (e | 0) {
            e = qC(12) | 0;
            h = (hx(f) | 0) + 4 | 0;
            a = c[h + 4 >> 2] | 0;
            b = e + 4 | 0;
            c[b >> 2] = c[h >> 2];
            c[b + 4 >> 2] = a;
            b = c[c[f >> 2] >> 2] | 0;
            c[f >> 2] = b;
            if (!b) a = e;
            else {
                b = e;
                while(true){
                    a = qC(12) | 0;
                    j = (hx(f) | 0) + 4 | 0;
                    i = c[j + 4 >> 2] | 0;
                    h = a + 4 | 0;
                    c[h >> 2] = c[j >> 2];
                    c[h + 4 >> 2] = i;
                    c[b >> 2] = a;
                    h = c[c[f >> 2] >> 2] | 0;
                    c[f >> 2] = h;
                    if (!h) break;
                    else b = a;
                }
            }
            c[a >> 2] = c[d >> 2];
            c[d >> 2] = e;
        }
        l = g;
        return;
    }
    function $w(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        bx(a, b, c);
        return;
    }
    function ax(a) {
        a = a | 0;
        return a + 24 | 0;
    }
    function bx(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 32 | 0;
        h = e + 24 | 0;
        f = e + 16 | 0;
        i = e + 12 | 0;
        g = e;
        UA(f);
        a = Sg(a) | 0;
        c[i >> 2] = c[b >> 2];
        mw(g, d);
        c[h >> 2] = c[i >> 2];
        cx(a, h, g);
        kw(g);
        WA(f);
        l = e;
        return;
    }
    function cx(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0;
        e = l;
        l = l + 32 | 0;
        h = e + 16 | 0;
        i = e + 12 | 0;
        f = e;
        g = Vg(dx() | 0) | 0;
        c[i >> 2] = c[b >> 2];
        c[h >> 2] = c[i >> 2];
        b = qw(h) | 0;
        c[f >> 2] = c[d >> 2];
        h = d + 4 | 0;
        c[f + 4 >> 2] = c[h >> 2];
        i = d + 8 | 0;
        c[f + 8 >> 2] = c[i >> 2];
        c[i >> 2] = 0;
        c[h >> 2] = 0;
        c[d >> 2] = 0;
        xa(0, g | 0, a | 0, b | 0, tw(f) | 0);
        kw(f);
        l = e;
        return;
    }
    function dx() {
        var b = 0;
        if (!(a[7976] | 0)) {
            ex(10720);
            b = 7976;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10720;
    }
    function ex(a) {
        a = a | 0;
        fh(a, fx() | 0, 2);
        return;
    }
    function fx() {
        return 1732;
    }
    function gx(a) {
        a = a | 0;
        return c[a >> 2] | 0;
    }
    function hx(a) {
        a = a | 0;
        return c[a >> 2] | 0;
    }
    function ix(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 32 | 0;
        g = e + 16 | 0;
        f = e + 8 | 0;
        h = e;
        UA(f);
        a = Sg(a) | 0;
        c[h >> 2] = c[b >> 2];
        d = c[d >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        jx(a, g, d);
        WA(f);
        l = e;
        return;
    }
    function jx(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 16 | 0;
        g = e + 4 | 0;
        h = e;
        f = Vg(kx() | 0) | 0;
        c[h >> 2] = c[b >> 2];
        c[g >> 2] = c[h >> 2];
        b = qw(g) | 0;
        xa(0, f | 0, a | 0, b | 0, rw(d) | 0);
        l = e;
        return;
    }
    function kx() {
        var b = 0;
        if (!(a[7984] | 0)) {
            lx(10732);
            b = 7984;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10732;
    }
    function lx(a) {
        a = a | 0;
        fh(a, mx() | 0, 2);
        return;
    }
    function mx() {
        return 1744;
    }
    function nx(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0;
        e = l;
        l = l + 32 | 0;
        g = e + 16 | 0;
        f = e + 8 | 0;
        h = e;
        UA(f);
        a = Sg(a) | 0;
        c[h >> 2] = c[b >> 2];
        d = c[d >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        jx(a, g, d);
        WA(f);
        l = e;
        return;
    }
    function ox(b, d, e, f) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0;
        g = l;
        l = l + 32 | 0;
        i = g + 16 | 0;
        h = g + 8 | 0;
        j = g;
        UA(h);
        b = Sg(b) | 0;
        c[j >> 2] = c[d >> 2];
        e = a[e >> 0] | 0;
        f = a[f >> 0] | 0;
        c[i >> 2] = c[j >> 2];
        px(b, i, e, f);
        WA(h);
        l = g;
        return;
    }
    function px(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0;
        f = l;
        l = l + 16 | 0;
        h = f + 4 | 0;
        i = f;
        g = Vg(qx() | 0) | 0;
        c[i >> 2] = c[b >> 2];
        c[h >> 2] = c[i >> 2];
        b = qw(h) | 0;
        d = rx(d) | 0;
        $a(0, g | 0, a | 0, b | 0, d | 0, rx(e) | 0);
        l = f;
        return;
    }
    function qx() {
        var b = 0;
        if (!(a[7992] | 0)) {
            tx(10744);
            b = 7992;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10744;
    }
    function rx(a) {
        a = a | 0;
        return sx(a) | 0;
    }
    function sx(a) {
        a = a | 0;
        return a & 255 | 0;
    }
    function tx(a) {
        a = a | 0;
        fh(a, ux() | 0, 3);
        return;
    }
    function ux() {
        return 1756;
    }
    function vx(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0;
        p = l;
        l = l + 32 | 0;
        j = p + 8 | 0;
        k = p + 4 | 0;
        m = p + 20 | 0;
        n = p;
        mk(b, 0);
        f = QA(d) | 0;
        c[j >> 2] = 0;
        o = j + 4 | 0;
        c[o >> 2] = 0;
        c[j + 8 >> 2] = 0;
        switch(f << 24 >> 24){
            case 0:
                a[m >> 0] = 0;
                wx(k, e, m);
                xx(b, k);
                wf(k);
                break;
            case 8:
                o = PA(d) | 0;
                a[m >> 0] = 8;
                OA(n, c[o + 4 >> 2] | 0);
                yx(k, e, m, n, o + 8 | 0);
                xx(b, k);
                wf(k);
                break;
            case 9:
                h = PA(d) | 0;
                d = c[h + 4 >> 2] | 0;
                if (d | 0) {
                    i = j + 8 | 0;
                    g = h + 12 | 0;
                    while(true){
                        d = d + -1 | 0;
                        OA(k, c[g >> 2] | 0);
                        f = c[o >> 2] | 0;
                        if (f >>> 0 < (c[i >> 2] | 0) >>> 0) {
                            c[f >> 2] = c[k >> 2];
                            c[o >> 2] = (c[o >> 2] | 0) + 4;
                        } else ew(j, k);
                        if (!d) break;
                        else g = g + 4 | 0;
                    }
                }
                a[m >> 0] = 9;
                OA(n, c[h + 8 >> 2] | 0);
                zx(k, e, m, n, j);
                xx(b, k);
                wf(k);
                break;
            default:
                o = PA(d) | 0;
                a[m >> 0] = f;
                OA(n, c[o + 4 >> 2] | 0);
                Ax(k, e, m, n);
                xx(b, k);
                wf(k);
        }
        kw(j);
        l = p;
        return;
    }
    function wx(b, c, d) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, f = 0;
        e = l;
        l = l + 16 | 0;
        f = e;
        UA(f);
        c = Sg(c) | 0;
        Ox(b, c, a[d >> 0] | 0);
        WA(f);
        l = e;
        return;
    }
    function xx(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = c[a >> 2] | 0;
        if (d | 0) ab(d | 0);
        c[a >> 2] = c[b >> 2];
        c[b >> 2] = 0;
        return a | 0;
    }
    function yx(b, d, e, f, g) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0;
        h = l;
        l = l + 32 | 0;
        j = h + 16 | 0;
        i = h + 8 | 0;
        k = h;
        UA(i);
        d = Sg(d) | 0;
        e = a[e >> 0] | 0;
        c[k >> 2] = c[f >> 2];
        g = c[g >> 2] | 0;
        c[j >> 2] = c[k >> 2];
        Kx(b, d, e, j, g);
        WA(i);
        l = h;
        return;
    }
    function zx(b, d, e, f, g) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        var h = 0, i = 0, j = 0, k = 0, m = 0;
        h = l;
        l = l + 32 | 0;
        k = h + 24 | 0;
        i = h + 16 | 0;
        m = h + 12 | 0;
        j = h;
        UA(i);
        d = Sg(d) | 0;
        e = a[e >> 0] | 0;
        c[m >> 2] = c[f >> 2];
        mw(j, g);
        c[k >> 2] = c[m >> 2];
        Gx(b, d, e, k, j);
        kw(j);
        WA(i);
        l = h;
        return;
    }
    function Ax(b, d, e, f) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0;
        g = l;
        l = l + 32 | 0;
        i = g + 16 | 0;
        h = g + 8 | 0;
        j = g;
        UA(h);
        d = Sg(d) | 0;
        e = a[e >> 0] | 0;
        c[j >> 2] = c[f >> 2];
        c[i >> 2] = c[j >> 2];
        Bx(b, d, e, i);
        WA(h);
        l = g;
        return;
    }
    function Bx(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0;
        f = l;
        l = l + 16 | 0;
        g = f + 4 | 0;
        i = f;
        h = Vg(Cx() | 0) | 0;
        d = rx(d) | 0;
        c[i >> 2] = c[e >> 2];
        c[g >> 2] = c[i >> 2];
        Dx(a, xa(0, h | 0, b | 0, d | 0, qw(g) | 0) | 0);
        l = f;
        return;
    }
    function Cx() {
        var b = 0;
        if (!(a[8e3] | 0)) {
            Ex(10756);
            b = 8e3;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10756;
    }
    function Dx(a, b) {
        a = a | 0;
        b = b | 0;
        mk(a, b);
        return;
    }
    function Ex(a) {
        a = a | 0;
        fh(a, Fx() | 0, 2);
        return;
    }
    function Fx() {
        return 1772;
    }
    function Gx(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0;
        g = l;
        l = l + 32 | 0;
        j = g + 16 | 0;
        k = g + 12 | 0;
        h = g;
        i = Vg(Hx() | 0) | 0;
        d = rx(d) | 0;
        c[k >> 2] = c[e >> 2];
        c[j >> 2] = c[k >> 2];
        e = qw(j) | 0;
        c[h >> 2] = c[f >> 2];
        j = f + 4 | 0;
        c[h + 4 >> 2] = c[j >> 2];
        k = f + 8 | 0;
        c[h + 8 >> 2] = c[k >> 2];
        c[k >> 2] = 0;
        c[j >> 2] = 0;
        c[f >> 2] = 0;
        Dx(a, $a(0, i | 0, b | 0, d | 0, e | 0, tw(h) | 0) | 0);
        kw(h);
        l = g;
        return;
    }
    function Hx() {
        var b = 0;
        if (!(a[8008] | 0)) {
            Ix(10768);
            b = 8008;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10768;
    }
    function Ix(a) {
        a = a | 0;
        fh(a, Jx() | 0, 3);
        return;
    }
    function Jx() {
        return 1784;
    }
    function Kx(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0;
        g = l;
        l = l + 16 | 0;
        i = g + 4 | 0;
        j = g;
        h = Vg(Lx() | 0) | 0;
        d = rx(d) | 0;
        c[j >> 2] = c[e >> 2];
        c[i >> 2] = c[j >> 2];
        e = qw(i) | 0;
        Dx(a, $a(0, h | 0, b | 0, d | 0, e | 0, sw(f) | 0) | 0);
        l = g;
        return;
    }
    function Lx() {
        var b = 0;
        if (!(a[8016] | 0)) {
            Mx(10780);
            b = 8016;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10780;
    }
    function Mx(a) {
        a = a | 0;
        fh(a, Nx() | 0, 3);
        return;
    }
    function Nx() {
        return 1800;
    }
    function Ox(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0;
        d = Vg(Px() | 0) | 0;
        Dx(a, bb(0, d | 0, b | 0, rx(c) | 0) | 0);
        return;
    }
    function Px() {
        var b = 0;
        if (!(a[8024] | 0)) {
            Qx(10792);
            b = 8024;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 10792;
    }
    function Qx(a) {
        a = a | 0;
        fh(a, Rx() | 0, 1);
        return;
    }
    function Rx() {
        return 1816;
    }
    function Sx() {
        Tx();
        Ux();
        Vx();
        return;
    }
    function Tx() {
        c[2702] = rC(65536) | 0;
        return;
    }
    function Ux() {
        qy(10856);
        return;
    }
    function Vx() {
        Wx(10816);
        return;
    }
    function Wx(a) {
        a = a | 0;
        Xx(a, 5044);
        Yx(a);
        return;
    }
    function Xx(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = zw() | 0;
        c[a >> 2] = d;
        ky(d, b);
        Hv(c[a >> 2] | 0);
        return;
    }
    function Yx(a) {
        a = a | 0;
        var b = 0;
        b = c[a >> 2] | 0;
        At(b, Zx() | 0);
        return a | 0;
    }
    function Zx() {
        var b = 0;
        if (!(a[8032] | 0)) {
            _x(10820);
            Ha(64, 10820, o | 0);
            b = 8032;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        if (!(si(10820) | 0)) _x(10820);
        return 10820;
    }
    function _x(a) {
        a = a | 0;
        by(a);
        Gt(a, 25);
        return;
    }
    function $x(a) {
        a = a | 0;
        ay(a + 24 | 0);
        return;
    }
    function ay(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function by(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 5, 18, b, gy() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function cy(a, b) {
        a = a | 0;
        b = b | 0;
        dy(a, b);
        return;
    }
    function dy(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        f = d + 4 | 0;
        Gk(f, b);
        c[e >> 2] = Hk(f, b) | 0;
        ey(a, e);
        l = d;
        return;
    }
    function ey(b, d) {
        b = b | 0;
        d = d | 0;
        fy(b + 4 | 0, c[d >> 2] | 0);
        a[b + 8 >> 0] = 1;
        return;
    }
    function fy(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = b;
        return;
    }
    function gy() {
        return 1824;
    }
    function hy(a) {
        a = a | 0;
        return iy(a) | 0;
    }
    function iy(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0;
        d = l;
        l = l + 16 | 0;
        f = d + 4 | 0;
        h = d;
        e = jy(8) | 0;
        b = e;
        i = qC(4) | 0;
        Gk(f, a);
        fy(i, Hk(f, a) | 0);
        g = b + 4 | 0;
        c[g >> 2] = i;
        a = qC(8) | 0;
        g = c[g >> 2] | 0;
        c[h >> 2] = 0;
        c[f >> 2] = c[h >> 2];
        Bw(a, g, f);
        c[e >> 2] = a;
        l = d;
        return b | 0;
    }
    function jy(a) {
        a = a | 0;
        var b = 0, d = 0;
        a = a + 7 & -8;
        if (a >>> 0 <= 32768 ? (b = c[2701] | 0, a >>> 0 <= (65536 - b | 0) >>> 0) : 0) {
            d = (c[2702] | 0) + b | 0;
            c[2701] = b + a;
            a = d;
        } else {
            a = rC(a + 8 | 0) | 0;
            c[a >> 2] = c[2703];
            c[2703] = a;
            a = a + 8 | 0;
        }
        return a | 0;
    }
    function ky(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = ly() | 0;
        c[a + 4 >> 2] = my() | 0;
        c[a + 12 >> 2] = b;
        c[a + 8 >> 2] = ny() | 0;
        c[a + 32 >> 2] = 9;
        return;
    }
    function ly() {
        return 11744;
    }
    function my() {
        return 1832;
    }
    function ny() {
        return cu() | 0;
    }
    function oy(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((jr(d, 896) | 0) == 512) {
            if (c | 0) {
                py(c);
                sC(c);
            }
        } else if (b | 0) sC(b);
        return;
    }
    function py(a) {
        a = a | 0;
        a = c[a + 4 >> 2] | 0;
        if (a | 0) oC(a);
        return;
    }
    function qy(a) {
        a = a | 0;
        ry(a, 5052);
        sy(a);
        ty(a, 5058, 26);
        uy(a, 5069, 1);
        vy(a, 5077, 10);
        wy(a, 5087, 19);
        yy(a, 5094, 27);
        return;
    }
    function ry(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = GA() | 0;
        c[a >> 2] = d;
        HA(d, b);
        Hv(c[a >> 2] | 0);
        return;
    }
    function sy(a) {
        a = a | 0;
        var b = 0;
        b = c[a >> 2] | 0;
        At(b, rA() | 0);
        return a | 0;
    }
    function ty(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        Yz(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function uy(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        Gz(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function vy(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        hz(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function wy(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        Ry(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function xy(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        a: while(true){
            d = c[2703] | 0;
            while(true){
                if ((d | 0) == (b | 0)) break a;
                e = c[d >> 2] | 0;
                c[2703] = e;
                if (!d) d = e;
                else break;
            }
            sC(d);
        }
        c[2701] = a;
        return;
    }
    function yy(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        zy(a, ai(b) | 0, c, 0);
        return a | 0;
    }
    function zy(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = Ay() | 0;
        a = By(d) | 0;
        fi(g, b, f, a, Cy(d, e) | 0, e);
        return;
    }
    function Ay() {
        var b = 0, d = 0;
        if (!(a[8040] | 0)) {
            Jy(10860);
            Ha(65, 10860, o | 0);
            d = 8040;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10860) | 0)) {
            b = 10860;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Jy(10860);
        }
        return 10860;
    }
    function By(a) {
        a = a | 0;
        return a | 0;
    }
    function Cy(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = Ay() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            Dy(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            Ey(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function Dy(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function Ey(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = Fy(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            Gy(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            Dy(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            Hy(a, f);
            Iy(f);
            l = i;
            return;
        }
    }
    function Fy(a) {
        a = a | 0;
        return 536870911;
    }
    function Gy(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function Hy(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Iy(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Jy(a) {
        a = a | 0;
        My(a);
        return;
    }
    function Ky(a) {
        a = a | 0;
        Ly(a + 24 | 0);
        return;
    }
    function Ly(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function My(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 11, b, Ny() | 0, 2);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Ny() {
        return 1840;
    }
    function Oy(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        Qy(c[(Py(a) | 0) >> 2] | 0, b, d);
        return;
    }
    function Py(a) {
        a = a | 0;
        return (c[(Ay() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function Qy(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, f = 0;
        d = l;
        l = l + 16 | 0;
        f = d + 1 | 0;
        e = d;
        Gk(f, b);
        b = Hk(f, b) | 0;
        Gk(e, c);
        c = Hk(e, c) | 0;
        ob[a & 31](b, c);
        l = d;
        return;
    }
    function Ry(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = Sy() | 0;
        a = Ty(d) | 0;
        fi(g, b, f, a, Uy(d, e) | 0, e);
        return;
    }
    function Sy() {
        var b = 0, d = 0;
        if (!(a[8048] | 0)) {
            $y(10896);
            Ha(66, 10896, o | 0);
            d = 8048;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10896) | 0)) {
            b = 10896;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            $y(10896);
        }
        return 10896;
    }
    function Ty(a) {
        a = a | 0;
        return a | 0;
    }
    function Uy(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = Sy() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            Vy(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            Wy(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function Vy(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function Wy(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = Xy(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            Yy(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            Vy(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            Zy(a, f);
            _y(f);
            l = i;
            return;
        }
    }
    function Xy(a) {
        a = a | 0;
        return 536870911;
    }
    function Yy(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function Zy(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function _y(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function $y(a) {
        a = a | 0;
        cz(a);
        return;
    }
    function az(a) {
        a = a | 0;
        bz(a + 24 | 0);
        return;
    }
    function bz(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function cz(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 11, b, dz() | 0, 1);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function dz() {
        return 1852;
    }
    function ez(a, b) {
        a = a | 0;
        b = b | 0;
        return gz(c[(fz(a) | 0) >> 2] | 0, b) | 0;
    }
    function fz(a) {
        a = a | 0;
        return (c[(Sy() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function gz(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0, d = 0;
        c = l;
        l = l + 16 | 0;
        d = c;
        Gk(d, b);
        b = Hk(d, b) | 0;
        b = ul(pb[a & 31](b) | 0) | 0;
        l = c;
        return b | 0;
    }
    function hz(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = iz() | 0;
        a = jz(d) | 0;
        fi(g, b, f, a, kz(d, e) | 0, e);
        return;
    }
    function iz() {
        var b = 0, d = 0;
        if (!(a[8056] | 0)) {
            rz(10932);
            Ha(67, 10932, o | 0);
            d = 8056;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10932) | 0)) {
            b = 10932;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            rz(10932);
        }
        return 10932;
    }
    function jz(a) {
        a = a | 0;
        return a | 0;
    }
    function kz(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = iz() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            lz(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            mz(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function lz(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function mz(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = nz(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            oz(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            lz(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            pz(a, f);
            qz(f);
            l = i;
            return;
        }
    }
    function nz(a) {
        a = a | 0;
        return 536870911;
    }
    function oz(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function pz(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function qz(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function rz(a) {
        a = a | 0;
        uz(a);
        return;
    }
    function sz(a) {
        a = a | 0;
        tz(a + 24 | 0);
        return;
    }
    function tz(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function uz(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 7, b, vz() | 0, 2);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function vz() {
        return 1860;
    }
    function wz(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        return yz(c[(xz(a) | 0) >> 2] | 0, b, d) | 0;
    }
    function xz(a) {
        a = a | 0;
        return (c[(iz() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function yz(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        e = l;
        l = l + 32 | 0;
        h = e + 12 | 0;
        g = e + 8 | 0;
        i = e;
        j = e + 16 | 0;
        f = e + 4 | 0;
        zz(j, b);
        Az(i, j, b);
        ik(f, d);
        d = jk(f, d) | 0;
        c[h >> 2] = c[i >> 2];
        Eb[a & 15](g, h, d);
        d = Bz(g) | 0;
        wf(g);
        kk(f);
        l = e;
        return d | 0;
    }
    function zz(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function Az(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        Cz(a, c);
        return;
    }
    function Bz(a) {
        a = a | 0;
        return Sg(a) | 0;
    }
    function Cz(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0;
        f = l;
        l = l + 16 | 0;
        d = f;
        e = b;
        if (!(e & 1)) c[a >> 2] = c[b >> 2];
        else {
            Dz(d, 0);
            Ja(e | 0, d | 0);
            Ez(a, d);
            Fz(d);
        }
        l = f;
        return;
    }
    function Dz(b, d) {
        b = b | 0;
        d = d | 0;
        ah(b, d);
        c[b + 4 >> 2] = 0;
        a[b + 8 >> 0] = 0;
        return;
    }
    function Ez(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = c[b + 4 >> 2];
        return;
    }
    function Fz(b) {
        b = b | 0;
        a[b + 8 >> 0] = 0;
        return;
    }
    function Gz(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = Hz() | 0;
        a = Iz(d) | 0;
        fi(g, b, f, a, Jz(d, e) | 0, e);
        return;
    }
    function Hz() {
        var b = 0, d = 0;
        if (!(a[8064] | 0)) {
            Qz(10968);
            Ha(68, 10968, o | 0);
            d = 8064;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(10968) | 0)) {
            b = 10968;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            Qz(10968);
        }
        return 10968;
    }
    function Iz(a) {
        a = a | 0;
        return a | 0;
    }
    function Jz(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = Hz() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            Kz(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            Lz(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function Kz(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function Lz(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = Mz(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            Nz(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            Kz(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            Oz(a, f);
            Pz(f);
            l = i;
            return;
        }
    }
    function Mz(a) {
        a = a | 0;
        return 536870911;
    }
    function Nz(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function Oz(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function Pz(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function Qz(a) {
        a = a | 0;
        Tz(a);
        return;
    }
    function Rz(a) {
        a = a | 0;
        Sz(a + 24 | 0);
        return;
    }
    function Sz(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function Tz(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 1, b, Uz() | 0, 5);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function Uz() {
        return 1872;
    }
    function Vz(a, b, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        Xz(c[(Wz(a) | 0) >> 2] | 0, b, d, e, f, g);
        return;
    }
    function Wz(a) {
        a = a | 0;
        return (c[(Hz() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function Xz(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        g = l;
        l = l + 32 | 0;
        h = g + 16 | 0;
        i = g + 12 | 0;
        j = g + 8 | 0;
        k = g + 4 | 0;
        m = g;
        ik(h, b);
        b = jk(h, b) | 0;
        ik(i, c);
        c = jk(i, c) | 0;
        ik(j, d);
        d = jk(j, d) | 0;
        ik(k, e);
        e = jk(k, e) | 0;
        ik(m, f);
        f = jk(m, f) | 0;
        jb[a & 1](b, c, d, e, f);
        kk(m);
        kk(k);
        kk(j);
        kk(i);
        kk(h);
        l = g;
        return;
    }
    function Yz(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = c[a >> 2] | 0;
        f = Zz() | 0;
        a = _z(d) | 0;
        fi(g, b, f, a, $z(d, e) | 0, e);
        return;
    }
    function Zz() {
        var b = 0, d = 0;
        if (!(a[8072] | 0)) {
            gA(11004);
            Ha(69, 11004, o | 0);
            d = 8072;
            c[d >> 2] = 1;
            c[d + 4 >> 2] = 0;
        }
        if (!(si(11004) | 0)) {
            b = 11004;
            d = b + 36 | 0;
            do {
                c[b >> 2] = 0;
                b = b + 4 | 0;
            }while ((b | 0) < (d | 0))
            gA(11004);
        }
        return 11004;
    }
    function _z(a) {
        a = a | 0;
        return a | 0;
    }
    function $z(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        i = l;
        l = l + 16 | 0;
        f = i;
        g = i + 4 | 0;
        c[f >> 2] = a;
        j = Zz() | 0;
        h = j + 24 | 0;
        b = ji(b, 4) | 0;
        c[g >> 2] = b;
        d = j + 28 | 0;
        e = c[d >> 2] | 0;
        if (e >>> 0 < (c[j + 32 >> 2] | 0) >>> 0) {
            aA(e, a, b);
            b = (c[d >> 2] | 0) + 8 | 0;
            c[d >> 2] = b;
        } else {
            bA(h, f, g);
            b = c[d >> 2] | 0;
        }
        l = i;
        return (b - (c[h >> 2] | 0) >> 3) + -1 | 0;
    }
    function aA(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function bA(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0;
        i = l;
        l = l + 32 | 0;
        f = i;
        g = a + 4 | 0;
        h = ((c[g >> 2] | 0) - (c[a >> 2] | 0) >> 3) + 1 | 0;
        e = cA(a) | 0;
        if (e >>> 0 < h >>> 0) jC(a);
        else {
            j = c[a >> 2] | 0;
            m = (c[a + 8 >> 2] | 0) - j | 0;
            k = m >> 2;
            dA(f, m >> 3 >>> 0 < e >>> 1 >>> 0 ? k >>> 0 < h >>> 0 ? h : k : e, (c[g >> 2] | 0) - j >> 3, a + 8 | 0);
            h = f + 8 | 0;
            aA(c[h >> 2] | 0, c[b >> 2] | 0, c[d >> 2] | 0);
            c[h >> 2] = (c[h >> 2] | 0) + 8;
            eA(a, f);
            fA(f);
            l = i;
            return;
        }
    }
    function cA(a) {
        a = a | 0;
        return 536870911;
    }
    function dA(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0;
        c[a + 12 >> 2] = 0;
        c[a + 16 >> 2] = e;
        do if (b) {
            if (b >>> 0 > 536870911) Ta();
            else {
                f = qC(b << 3) | 0;
                break;
            }
        } else f = 0;
        while (0)
        c[a >> 2] = f;
        e = f + (d << 3) | 0;
        c[a + 8 >> 2] = e;
        c[a + 4 >> 2] = e;
        c[a + 12 >> 2] = f + (b << 3);
        return;
    }
    function eA(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0, f = 0, g = 0, h = 0;
        e = c[a >> 2] | 0;
        h = a + 4 | 0;
        g = b + 4 | 0;
        f = (c[h >> 2] | 0) - e | 0;
        d = (c[g >> 2] | 0) + (0 - (f >> 3) << 3) | 0;
        c[g >> 2] = d;
        if ((f | 0) > 0) {
            BC(d | 0, e | 0, f | 0);
            e = g;
            d = c[g >> 2] | 0;
        } else e = g;
        g = c[a >> 2] | 0;
        c[a >> 2] = d;
        c[e >> 2] = g;
        g = b + 8 | 0;
        f = c[h >> 2] | 0;
        c[h >> 2] = c[g >> 2];
        c[g >> 2] = f;
        g = a + 8 | 0;
        h = b + 12 | 0;
        a = c[g >> 2] | 0;
        c[g >> 2] = c[h >> 2];
        c[h >> 2] = a;
        c[b >> 2] = c[e >> 2];
        return;
    }
    function fA(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        b = c[a + 4 >> 2] | 0;
        d = a + 8 | 0;
        e = c[d >> 2] | 0;
        if ((e | 0) != (b | 0)) c[d >> 2] = e + (~((e + -8 - b | 0) >>> 3) << 3);
        a = c[a >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function gA(a) {
        a = a | 0;
        jA(a);
        return;
    }
    function hA(a) {
        a = a | 0;
        iA(a + 24 | 0);
        return;
    }
    function iA(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function jA(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 1, 12, b, kA() | 0, 2);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function kA() {
        return 1896;
    }
    function lA(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        nA(c[(mA(a) | 0) >> 2] | 0, b, d);
        return;
    }
    function mA(a) {
        a = a | 0;
        return (c[(Zz() | 0) + 24 >> 2] | 0) + (a << 3) | 0;
    }
    function nA(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0, f = 0;
        d = l;
        l = l + 16 | 0;
        f = d + 4 | 0;
        e = d;
        oA(f, b);
        b = pA(f, b) | 0;
        ik(e, c);
        c = jk(e, c) | 0;
        ob[a & 31](b, c);
        kk(e);
        l = d;
        return;
    }
    function oA(a, b) {
        a = a | 0;
        b = b | 0;
        return;
    }
    function pA(a, b) {
        a = a | 0;
        b = b | 0;
        return qA(b) | 0;
    }
    function qA(a) {
        a = a | 0;
        return a | 0;
    }
    function rA() {
        var b = 0;
        if (!(a[8080] | 0)) {
            sA(11040);
            Ha(70, 11040, o | 0);
            b = 8080;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        if (!(si(11040) | 0)) sA(11040);
        return 11040;
    }
    function sA(a) {
        a = a | 0;
        vA(a);
        Gt(a, 71);
        return;
    }
    function tA(a) {
        a = a | 0;
        uA(a + 24 | 0);
        return;
    }
    function uA(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0;
        d = c[a >> 2] | 0;
        e = d;
        if (d | 0) {
            a = a + 4 | 0;
            b = c[a >> 2] | 0;
            if ((b | 0) != (d | 0)) c[a >> 2] = b + (~((b + -8 - e | 0) >>> 3) << 3);
            sC(d);
        }
        return;
    }
    function vA(a) {
        a = a | 0;
        var b = 0;
        b = vi() | 0;
        yi(a, 5, 7, b, zA() | 0, 0);
        c[a + 24 >> 2] = 0;
        c[a + 28 >> 2] = 0;
        c[a + 32 >> 2] = 0;
        return;
    }
    function wA(a) {
        a = a | 0;
        xA(a);
        return;
    }
    function xA(a) {
        a = a | 0;
        yA(a);
        return;
    }
    function yA(b) {
        b = b | 0;
        a[b + 8 >> 0] = 1;
        return;
    }
    function zA() {
        return 1936;
    }
    function AA() {
        return BA() | 0;
    }
    function BA() {
        var a = 0, b = 0, d = 0, e = 0, f = 0, g = 0, h = 0;
        b = l;
        l = l + 16 | 0;
        f = b + 4 | 0;
        h = b;
        d = jy(8) | 0;
        a = d;
        g = a + 4 | 0;
        c[g >> 2] = qC(1) | 0;
        e = qC(8) | 0;
        g = c[g >> 2] | 0;
        c[h >> 2] = 0;
        c[f >> 2] = c[h >> 2];
        CA(e, g, f);
        c[d >> 2] = e;
        l = b;
        return a | 0;
    }
    function CA(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        c[a >> 2] = b;
        d = qC(16) | 0;
        c[d + 4 >> 2] = 0;
        c[d + 8 >> 2] = 0;
        c[d >> 2] = 1916;
        c[d + 12 >> 2] = b;
        c[a + 4 >> 2] = d;
        return;
    }
    function DA(a) {
        a = a | 0;
        kC(a);
        sC(a);
        return;
    }
    function EA(a) {
        a = a | 0;
        a = c[a + 12 >> 2] | 0;
        if (a | 0) sC(a);
        return;
    }
    function FA(a) {
        a = a | 0;
        sC(a);
        return;
    }
    function GA() {
        var b = 0;
        if (!(a[8088] | 0)) {
            NA(11076);
            Ha(25, 11076, o | 0);
            b = 8088;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 11076;
    }
    function HA(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = IA() | 0;
        c[a + 4 >> 2] = JA() | 0;
        c[a + 12 >> 2] = b;
        c[a + 8 >> 2] = KA() | 0;
        c[a + 32 >> 2] = 10;
        return;
    }
    function IA() {
        return 11745;
    }
    function JA() {
        return 1940;
    }
    function KA() {
        return lr() | 0;
    }
    function LA(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if ((jr(d, 896) | 0) == 512) {
            if (c | 0) {
                MA(c);
                sC(c);
            }
        } else if (b | 0) sC(b);
        return;
    }
    function MA(a) {
        a = a | 0;
        a = c[a + 4 >> 2] | 0;
        if (a | 0) oC(a);
        return;
    }
    function NA(a) {
        a = a | 0;
        Zi(a);
        return;
    }
    function OA(a, b) {
        a = a | 0;
        b = b | 0;
        c[a >> 2] = b;
        return;
    }
    function PA(a) {
        a = a | 0;
        return c[a >> 2] | 0;
    }
    function QA(b) {
        b = b | 0;
        return a[c[b >> 2] >> 0] | 0;
    }
    function RA(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        c[e >> 2] = c[a >> 2];
        SA(b, e);
        l = d;
        return;
    }
    function SA(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0;
        d = TA(c[a >> 2] | 0, b) | 0;
        b = a + 4 | 0;
        c[(c[b >> 2] | 0) + 8 >> 2] = d;
        return c[(c[b >> 2] | 0) + 8 >> 2] | 0;
    }
    function TA(a, b) {
        a = a | 0;
        b = b | 0;
        var d = 0, e = 0;
        d = l;
        l = l + 16 | 0;
        e = d;
        UA(e);
        a = Sg(a) | 0;
        b = VA(a, c[b >> 2] | 0) | 0;
        WA(e);
        l = d;
        return b | 0;
    }
    function UA(a) {
        a = a | 0;
        c[a >> 2] = c[2701];
        c[a + 4 >> 2] = c[2703];
        return;
    }
    function VA(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = Vg(XA() | 0) | 0;
        return bb(0, c | 0, a | 0, sw(b) | 0) | 0;
    }
    function WA(a) {
        a = a | 0;
        xy(c[a >> 2] | 0, c[a + 4 >> 2] | 0);
        return;
    }
    function XA() {
        var b = 0;
        if (!(a[8096] | 0)) {
            YA(11120);
            b = 8096;
            c[b >> 2] = 1;
            c[b + 4 >> 2] = 0;
        }
        return 11120;
    }
    function YA(a) {
        a = a | 0;
        fh(a, ZA() | 0, 1);
        return;
    }
    function ZA() {
        return 1948;
    }
    function _A() {
        $A();
        return;
    }
    function $A() {
        var b = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0;
        s = l;
        l = l + 16 | 0;
        o = s + 4 | 0;
        p = s;
        Ea(65536, 10804, c[2702] | 0, 10812);
        f = Wv() | 0;
        e = c[f >> 2] | 0;
        b = c[e >> 2] | 0;
        if (b | 0) {
            g = c[f + 8 >> 2] | 0;
            f = c[f + 4 >> 2] | 0;
            while(true){
                Ma(b | 0, d[f >> 0] | 0, a[g >> 0] | 0);
                e = e + 4 | 0;
                b = c[e >> 2] | 0;
                if (!b) break;
                else {
                    g = g + 1 | 0;
                    f = f + 1 | 0;
                }
            }
        }
        b = Yv() | 0;
        e = c[b >> 2] | 0;
        if (e | 0) do {
            Na(e | 0, c[b + 4 >> 2] | 0);
            b = b + 8 | 0;
            e = c[b >> 2] | 0;
        }while ((e | 0) != 0)
        Na(aB() | 0, 5167);
        n = Iv() | 0;
        b = c[n >> 2] | 0;
        a: do if (b | 0) {
            do {
                bB(c[b + 4 >> 2] | 0);
                b = c[b >> 2] | 0;
            }while ((b | 0) != 0)
            b = c[n >> 2] | 0;
            if (b | 0) {
                m = n;
                do {
                    while(true){
                        h = b;
                        b = c[b >> 2] | 0;
                        h = c[h + 4 >> 2] | 0;
                        if (!(cB(h) | 0)) break;
                        c[p >> 2] = m;
                        c[o >> 2] = c[p >> 2];
                        dB(n, o);
                        if (!b) break a;
                    }
                    eB(h);
                    m = c[m >> 2] | 0;
                    e = fB(h) | 0;
                    i = Va() | 0;
                    j = l;
                    l = l + ((1 * (e << 2) | 0) + 15 & -16) | 0;
                    k = l;
                    l = l + ((1 * (e << 2) | 0) + 15 & -16) | 0;
                    e = c[(Zw(h) | 0) >> 2] | 0;
                    if (e | 0) {
                        f = j;
                        g = k;
                        while(true){
                            c[f >> 2] = c[(Xw(c[e + 4 >> 2] | 0) | 0) >> 2];
                            c[g >> 2] = c[e + 8 >> 2];
                            e = c[e >> 2] | 0;
                            if (!e) break;
                            else {
                                f = f + 4 | 0;
                                g = g + 4 | 0;
                            }
                        }
                    }
                    t = Xw(h) | 0;
                    e = gB(h) | 0;
                    f = fB(h) | 0;
                    g = hB(h) | 0;
                    Ra(t | 0, e | 0, j | 0, k | 0, f | 0, g | 0, Tv(h) | 0);
                    Ga(i | 0);
                }while ((b | 0) != 0)
            }
        }
        while (0)
        b = c[(Vv() | 0) >> 2] | 0;
        if (b | 0) do {
            t = b + 4 | 0;
            n = aw(t) | 0;
            h = fw(n) | 0;
            i = bw(n) | 0;
            j = (cw(n) | 0) + 1 | 0;
            k = iB(n) | 0;
            m = jB(t) | 0;
            n = si(n) | 0;
            o = hw(t) | 0;
            p = kB(t) | 0;
            Pa(0, h | 0, i | 0, j | 0, k | 0, m | 0, n | 0, o | 0, p | 0, lB(t) | 0);
            b = c[b >> 2] | 0;
        }while ((b | 0) != 0)
        b = c[(Iv() | 0) >> 2] | 0;
        b: if (b | 0) {
            c: while(true){
                e = c[b + 4 >> 2] | 0;
                if (e | 0 ? (q = c[(Xw(e) | 0) >> 2] | 0, r = c[(ax(e) | 0) >> 2] | 0, r | 0) : 0) {
                    f = r;
                    do {
                        e = f + 4 | 0;
                        g = aw(e) | 0;
                        d: if (g | 0) switch(si(g) | 0){
                            case 0:
                                break c;
                            case 4:
                            case 3:
                            case 2:
                                k = fw(g) | 0;
                                m = bw(g) | 0;
                                n = (cw(g) | 0) + 1 | 0;
                                o = iB(g) | 0;
                                p = si(g) | 0;
                                t = hw(e) | 0;
                                Pa(q | 0, k | 0, m | 0, n | 0, o | 0, 0, p | 0, t | 0, kB(e) | 0, lB(e) | 0);
                                break d;
                            case 1:
                                j = fw(g) | 0;
                                k = bw(g) | 0;
                                m = (cw(g) | 0) + 1 | 0;
                                n = iB(g) | 0;
                                o = jB(e) | 0;
                                p = si(g) | 0;
                                t = hw(e) | 0;
                                Pa(q | 0, j | 0, k | 0, m | 0, n | 0, o | 0, p | 0, t | 0, kB(e) | 0, lB(e) | 0);
                                break d;
                            case 5:
                                n = fw(g) | 0;
                                o = bw(g) | 0;
                                p = (cw(g) | 0) + 1 | 0;
                                t = iB(g) | 0;
                                Pa(q | 0, n | 0, o | 0, p | 0, t | 0, mB(g) | 0, si(g) | 0, 0, 0, 0);
                                break d;
                            default:
                                break d;
                        }
                        f = c[f >> 2] | 0;
                    }while ((f | 0) != 0)
                }
                b = c[b >> 2] | 0;
                if (!b) break b;
            }
            Ta();
        }
        Sa();
        l = s;
        return;
    }
    function aB() {
        return 11703;
    }
    function bB(b) {
        b = b | 0;
        a[b + 40 >> 0] = 0;
        return;
    }
    function cB(b) {
        b = b | 0;
        return (a[b + 40 >> 0] | 0) != 0 | 0;
    }
    function dB(a, b) {
        a = a | 0;
        b = b | 0;
        b = nB(b) | 0;
        a = c[b >> 2] | 0;
        c[b >> 2] = c[a >> 2];
        sC(a);
        return c[b >> 2] | 0;
    }
    function eB(b) {
        b = b | 0;
        a[b + 40 >> 0] = 1;
        return;
    }
    function fB(a) {
        a = a | 0;
        return c[a + 20 >> 2] | 0;
    }
    function gB(a) {
        a = a | 0;
        return c[a + 8 >> 2] | 0;
    }
    function hB(a) {
        a = a | 0;
        return c[a + 32 >> 2] | 0;
    }
    function iB(a) {
        a = a | 0;
        return c[a + 4 >> 2] | 0;
    }
    function jB(a) {
        a = a | 0;
        return c[a + 4 >> 2] | 0;
    }
    function kB(a) {
        a = a | 0;
        return c[a + 8 >> 2] | 0;
    }
    function lB(a) {
        a = a | 0;
        return c[a + 16 >> 2] | 0;
    }
    function mB(a) {
        a = a | 0;
        return c[a + 20 >> 2] | 0;
    }
    function nB(a) {
        a = a | 0;
        return c[a >> 2] | 0;
    }
    function oB(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0;
        x = l;
        l = l + 16 | 0;
        o = x;
        do if (a >>> 0 < 245) {
            k = a >>> 0 < 11 ? 16 : a + 11 & -8;
            a = k >>> 3;
            n = c[2783] | 0;
            d = n >>> a;
            if (d & 3 | 0) {
                b = (d & 1 ^ 1) + a | 0;
                a = 11172 + (b << 1 << 2) | 0;
                d = a + 8 | 0;
                e = c[d >> 2] | 0;
                f = e + 8 | 0;
                g = c[f >> 2] | 0;
                if ((a | 0) == (g | 0)) c[2783] = n & ~(1 << b);
                else {
                    c[g + 12 >> 2] = a;
                    c[d >> 2] = g;
                }
                w = b << 3;
                c[e + 4 >> 2] = w | 3;
                w = e + w + 4 | 0;
                c[w >> 2] = c[w >> 2] | 1;
                w = f;
                l = x;
                return w | 0;
            }
            m = c[2785] | 0;
            if (k >>> 0 > m >>> 0) {
                if (d | 0) {
                    b = 2 << a;
                    b = d << a & (b | 0 - b);
                    b = (b & 0 - b) + -1 | 0;
                    h = b >>> 12 & 16;
                    b = b >>> h;
                    d = b >>> 5 & 8;
                    b = b >>> d;
                    f = b >>> 2 & 4;
                    b = b >>> f;
                    a = b >>> 1 & 2;
                    b = b >>> a;
                    e = b >>> 1 & 1;
                    e = (d | h | f | a | e) + (b >>> e) | 0;
                    b = 11172 + (e << 1 << 2) | 0;
                    a = b + 8 | 0;
                    f = c[a >> 2] | 0;
                    h = f + 8 | 0;
                    d = c[h >> 2] | 0;
                    if ((b | 0) == (d | 0)) {
                        a = n & ~(1 << e);
                        c[2783] = a;
                    } else {
                        c[d + 12 >> 2] = b;
                        c[a >> 2] = d;
                        a = n;
                    }
                    g = (e << 3) - k | 0;
                    c[f + 4 >> 2] = k | 3;
                    e = f + k | 0;
                    c[e + 4 >> 2] = g | 1;
                    c[e + g >> 2] = g;
                    if (m | 0) {
                        f = c[2788] | 0;
                        b = m >>> 3;
                        d = 11172 + (b << 1 << 2) | 0;
                        b = 1 << b;
                        if (!(a & b)) {
                            c[2783] = a | b;
                            b = d;
                            a = d + 8 | 0;
                        } else {
                            a = d + 8 | 0;
                            b = c[a >> 2] | 0;
                        }
                        c[a >> 2] = f;
                        c[b + 12 >> 2] = f;
                        c[f + 8 >> 2] = b;
                        c[f + 12 >> 2] = d;
                    }
                    c[2785] = g;
                    c[2788] = e;
                    w = h;
                    l = x;
                    return w | 0;
                }
                i = c[2784] | 0;
                if (i) {
                    d = (i & 0 - i) + -1 | 0;
                    h = d >>> 12 & 16;
                    d = d >>> h;
                    g = d >>> 5 & 8;
                    d = d >>> g;
                    j = d >>> 2 & 4;
                    d = d >>> j;
                    e = d >>> 1 & 2;
                    d = d >>> e;
                    a = d >>> 1 & 1;
                    a = c[11436 + ((g | h | j | e | a) + (d >>> a) << 2) >> 2] | 0;
                    d = (c[a + 4 >> 2] & -8) - k | 0;
                    e = c[a + 16 + (((c[a + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0;
                    if (!e) {
                        j = a;
                        g = d;
                    } else {
                        do {
                            h = (c[e + 4 >> 2] & -8) - k | 0;
                            j = h >>> 0 < d >>> 0;
                            d = j ? h : d;
                            a = j ? e : a;
                            e = c[e + 16 + (((c[e + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0;
                        }while ((e | 0) != 0)
                        j = a;
                        g = d;
                    }
                    h = j + k | 0;
                    if (j >>> 0 < h >>> 0) {
                        f = c[j + 24 >> 2] | 0;
                        b = c[j + 12 >> 2] | 0;
                        do if ((b | 0) == (j | 0)) {
                            a = j + 20 | 0;
                            b = c[a >> 2] | 0;
                            if (!b) {
                                a = j + 16 | 0;
                                b = c[a >> 2] | 0;
                                if (!b) {
                                    d = 0;
                                    break;
                                }
                            }
                            while(true){
                                d = b + 20 | 0;
                                e = c[d >> 2] | 0;
                                if (e | 0) {
                                    b = e;
                                    a = d;
                                    continue;
                                }
                                d = b + 16 | 0;
                                e = c[d >> 2] | 0;
                                if (!e) break;
                                else {
                                    b = e;
                                    a = d;
                                }
                            }
                            c[a >> 2] = 0;
                            d = b;
                        } else {
                            d = c[j + 8 >> 2] | 0;
                            c[d + 12 >> 2] = b;
                            c[b + 8 >> 2] = d;
                            d = b;
                        }
                        while (0)
                        do if (f | 0) {
                            b = c[j + 28 >> 2] | 0;
                            a = 11436 + (b << 2) | 0;
                            if ((j | 0) == (c[a >> 2] | 0)) {
                                c[a >> 2] = d;
                                if (!d) {
                                    c[2784] = i & ~(1 << b);
                                    break;
                                }
                            } else {
                                c[f + 16 + (((c[f + 16 >> 2] | 0) != (j | 0) & 1) << 2) >> 2] = d;
                                if (!d) break;
                            }
                            c[d + 24 >> 2] = f;
                            b = c[j + 16 >> 2] | 0;
                            if (b | 0) {
                                c[d + 16 >> 2] = b;
                                c[b + 24 >> 2] = d;
                            }
                            b = c[j + 20 >> 2] | 0;
                            if (b | 0) {
                                c[d + 20 >> 2] = b;
                                c[b + 24 >> 2] = d;
                            }
                        }
                        while (0)
                        if (g >>> 0 < 16) {
                            w = g + k | 0;
                            c[j + 4 >> 2] = w | 3;
                            w = j + w + 4 | 0;
                            c[w >> 2] = c[w >> 2] | 1;
                        } else {
                            c[j + 4 >> 2] = k | 3;
                            c[h + 4 >> 2] = g | 1;
                            c[h + g >> 2] = g;
                            if (m | 0) {
                                e = c[2788] | 0;
                                b = m >>> 3;
                                d = 11172 + (b << 1 << 2) | 0;
                                b = 1 << b;
                                if (!(n & b)) {
                                    c[2783] = n | b;
                                    b = d;
                                    a = d + 8 | 0;
                                } else {
                                    a = d + 8 | 0;
                                    b = c[a >> 2] | 0;
                                }
                                c[a >> 2] = e;
                                c[b + 12 >> 2] = e;
                                c[e + 8 >> 2] = b;
                                c[e + 12 >> 2] = d;
                            }
                            c[2785] = g;
                            c[2788] = h;
                        }
                        w = j + 8 | 0;
                        l = x;
                        return w | 0;
                    } else n = k;
                } else n = k;
            } else n = k;
        } else if (a >>> 0 <= 4294967231) {
            a = a + 11 | 0;
            k = a & -8;
            j = c[2784] | 0;
            if (j) {
                e = 0 - k | 0;
                a = a >>> 8;
                if (a) {
                    if (k >>> 0 > 16777215) i = 31;
                    else {
                        n = (a + 1048320 | 0) >>> 16 & 8;
                        v = a << n;
                        m = (v + 520192 | 0) >>> 16 & 4;
                        v = v << m;
                        i = (v + 245760 | 0) >>> 16 & 2;
                        i = 14 - (m | n | i) + (v << i >>> 15) | 0;
                        i = k >>> (i + 7 | 0) & 1 | i << 1;
                    }
                } else i = 0;
                d = c[11436 + (i << 2) >> 2] | 0;
                a: do if (!d) {
                    d = 0;
                    a = 0;
                    v = 57;
                } else {
                    a = 0;
                    h = k << ((i | 0) == 31 ? 0 : 25 - (i >>> 1) | 0);
                    g = 0;
                    while(true){
                        f = (c[d + 4 >> 2] & -8) - k | 0;
                        if (f >>> 0 < e >>> 0) {
                            if (!f) {
                                a = d;
                                e = 0;
                                f = d;
                                v = 61;
                                break a;
                            } else {
                                a = d;
                                e = f;
                            }
                        }
                        f = c[d + 20 >> 2] | 0;
                        d = c[d + 16 + (h >>> 31 << 2) >> 2] | 0;
                        g = (f | 0) == 0 | (f | 0) == (d | 0) ? g : f;
                        f = (d | 0) == 0;
                        if (f) {
                            d = g;
                            v = 57;
                            break;
                        } else h = h << ((f ^ 1) & 1);
                    }
                }
                while (0)
                if ((v | 0) == 57) {
                    if ((d | 0) == 0 & (a | 0) == 0) {
                        a = 2 << i;
                        a = j & (a | 0 - a);
                        if (!a) {
                            n = k;
                            break;
                        }
                        n = (a & 0 - a) + -1 | 0;
                        h = n >>> 12 & 16;
                        n = n >>> h;
                        g = n >>> 5 & 8;
                        n = n >>> g;
                        i = n >>> 2 & 4;
                        n = n >>> i;
                        m = n >>> 1 & 2;
                        n = n >>> m;
                        d = n >>> 1 & 1;
                        a = 0;
                        d = c[11436 + ((g | h | i | m | d) + (n >>> d) << 2) >> 2] | 0;
                    }
                    if (!d) {
                        i = a;
                        h = e;
                    } else {
                        f = d;
                        v = 61;
                    }
                }
                if ((v | 0) == 61) while(true){
                    v = 0;
                    d = (c[f + 4 >> 2] & -8) - k | 0;
                    n = d >>> 0 < e >>> 0;
                    d = n ? d : e;
                    a = n ? f : a;
                    f = c[f + 16 + (((c[f + 16 >> 2] | 0) == 0 & 1) << 2) >> 2] | 0;
                    if (!f) {
                        i = a;
                        h = d;
                        break;
                    } else {
                        e = d;
                        v = 61;
                    }
                }
                if ((i | 0) != 0 ? h >>> 0 < ((c[2785] | 0) - k | 0) >>> 0 : 0) {
                    g = i + k | 0;
                    if (i >>> 0 >= g >>> 0) {
                        w = 0;
                        l = x;
                        return w | 0;
                    }
                    f = c[i + 24 >> 2] | 0;
                    b = c[i + 12 >> 2] | 0;
                    do if ((b | 0) == (i | 0)) {
                        a = i + 20 | 0;
                        b = c[a >> 2] | 0;
                        if (!b) {
                            a = i + 16 | 0;
                            b = c[a >> 2] | 0;
                            if (!b) {
                                b = 0;
                                break;
                            }
                        }
                        while(true){
                            d = b + 20 | 0;
                            e = c[d >> 2] | 0;
                            if (e | 0) {
                                b = e;
                                a = d;
                                continue;
                            }
                            d = b + 16 | 0;
                            e = c[d >> 2] | 0;
                            if (!e) break;
                            else {
                                b = e;
                                a = d;
                            }
                        }
                        c[a >> 2] = 0;
                    } else {
                        w = c[i + 8 >> 2] | 0;
                        c[w + 12 >> 2] = b;
                        c[b + 8 >> 2] = w;
                    }
                    while (0)
                    do if (f) {
                        a = c[i + 28 >> 2] | 0;
                        d = 11436 + (a << 2) | 0;
                        if ((i | 0) == (c[d >> 2] | 0)) {
                            c[d >> 2] = b;
                            if (!b) {
                                e = j & ~(1 << a);
                                c[2784] = e;
                                break;
                            }
                        } else {
                            c[f + 16 + (((c[f + 16 >> 2] | 0) != (i | 0) & 1) << 2) >> 2] = b;
                            if (!b) {
                                e = j;
                                break;
                            }
                        }
                        c[b + 24 >> 2] = f;
                        a = c[i + 16 >> 2] | 0;
                        if (a | 0) {
                            c[b + 16 >> 2] = a;
                            c[a + 24 >> 2] = b;
                        }
                        a = c[i + 20 >> 2] | 0;
                        if (a) {
                            c[b + 20 >> 2] = a;
                            c[a + 24 >> 2] = b;
                            e = j;
                        } else e = j;
                    } else e = j;
                    while (0)
                    do if (h >>> 0 >= 16) {
                        c[i + 4 >> 2] = k | 3;
                        c[g + 4 >> 2] = h | 1;
                        c[g + h >> 2] = h;
                        b = h >>> 3;
                        if (h >>> 0 < 256) {
                            d = 11172 + (b << 1 << 2) | 0;
                            a = c[2783] | 0;
                            b = 1 << b;
                            if (!(a & b)) {
                                c[2783] = a | b;
                                b = d;
                                a = d + 8 | 0;
                            } else {
                                a = d + 8 | 0;
                                b = c[a >> 2] | 0;
                            }
                            c[a >> 2] = g;
                            c[b + 12 >> 2] = g;
                            c[g + 8 >> 2] = b;
                            c[g + 12 >> 2] = d;
                            break;
                        }
                        b = h >>> 8;
                        if (b) {
                            if (h >>> 0 > 16777215) b = 31;
                            else {
                                v = (b + 1048320 | 0) >>> 16 & 8;
                                w = b << v;
                                u = (w + 520192 | 0) >>> 16 & 4;
                                w = w << u;
                                b = (w + 245760 | 0) >>> 16 & 2;
                                b = 14 - (u | v | b) + (w << b >>> 15) | 0;
                                b = h >>> (b + 7 | 0) & 1 | b << 1;
                            }
                        } else b = 0;
                        d = 11436 + (b << 2) | 0;
                        c[g + 28 >> 2] = b;
                        a = g + 16 | 0;
                        c[a + 4 >> 2] = 0;
                        c[a >> 2] = 0;
                        a = 1 << b;
                        if (!(e & a)) {
                            c[2784] = e | a;
                            c[d >> 2] = g;
                            c[g + 24 >> 2] = d;
                            c[g + 12 >> 2] = g;
                            c[g + 8 >> 2] = g;
                            break;
                        }
                        a = h << ((b | 0) == 31 ? 0 : 25 - (b >>> 1) | 0);
                        d = c[d >> 2] | 0;
                        while(true){
                            if ((c[d + 4 >> 2] & -8 | 0) == (h | 0)) {
                                v = 97;
                                break;
                            }
                            e = d + 16 + (a >>> 31 << 2) | 0;
                            b = c[e >> 2] | 0;
                            if (!b) {
                                v = 96;
                                break;
                            } else {
                                a = a << 1;
                                d = b;
                            }
                        }
                        if ((v | 0) == 96) {
                            c[e >> 2] = g;
                            c[g + 24 >> 2] = d;
                            c[g + 12 >> 2] = g;
                            c[g + 8 >> 2] = g;
                            break;
                        } else if ((v | 0) == 97) {
                            v = d + 8 | 0;
                            w = c[v >> 2] | 0;
                            c[w + 12 >> 2] = g;
                            c[v >> 2] = g;
                            c[g + 8 >> 2] = w;
                            c[g + 12 >> 2] = d;
                            c[g + 24 >> 2] = 0;
                            break;
                        }
                    } else {
                        w = h + k | 0;
                        c[i + 4 >> 2] = w | 3;
                        w = i + w + 4 | 0;
                        c[w >> 2] = c[w >> 2] | 1;
                    }
                    while (0)
                    w = i + 8 | 0;
                    l = x;
                    return w | 0;
                } else n = k;
            } else n = k;
        } else n = -1;
        while (0)
        d = c[2785] | 0;
        if (d >>> 0 >= n >>> 0) {
            b = d - n | 0;
            a = c[2788] | 0;
            if (b >>> 0 > 15) {
                w = a + n | 0;
                c[2788] = w;
                c[2785] = b;
                c[w + 4 >> 2] = b | 1;
                c[w + b >> 2] = b;
                c[a + 4 >> 2] = n | 3;
            } else {
                c[2785] = 0;
                c[2788] = 0;
                c[a + 4 >> 2] = d | 3;
                w = a + d + 4 | 0;
                c[w >> 2] = c[w >> 2] | 1;
            }
            w = a + 8 | 0;
            l = x;
            return w | 0;
        }
        h = c[2786] | 0;
        if (h >>> 0 > n >>> 0) {
            u = h - n | 0;
            c[2786] = u;
            w = c[2789] | 0;
            v = w + n | 0;
            c[2789] = v;
            c[v + 4 >> 2] = u | 1;
            c[w + 4 >> 2] = n | 3;
            w = w + 8 | 0;
            l = x;
            return w | 0;
        }
        if (!(c[2901] | 0)) {
            c[2903] = 4096;
            c[2902] = 4096;
            c[2904] = -1;
            c[2905] = -1;
            c[2906] = 0;
            c[2894] = 0;
            a = o & -16 ^ 1431655768;
            c[o >> 2] = a;
            c[2901] = a;
            a = 4096;
        } else a = c[2903] | 0;
        i = n + 48 | 0;
        j = n + 47 | 0;
        g = a + j | 0;
        f = 0 - a | 0;
        k = g & f;
        if (k >>> 0 <= n >>> 0) {
            w = 0;
            l = x;
            return w | 0;
        }
        a = c[2893] | 0;
        if (a | 0 ? (m = c[2891] | 0, o = m + k | 0, o >>> 0 <= m >>> 0 | o >>> 0 > a >>> 0) : 0) {
            w = 0;
            l = x;
            return w | 0;
        }
        b: do if (!(c[2894] & 4)) {
            d = c[2789] | 0;
            c: do if (d) {
                e = 11580;
                while(true){
                    a = c[e >> 2] | 0;
                    if (a >>> 0 <= d >>> 0 ? (r = e + 4 | 0, (a + (c[r >> 2] | 0) | 0) >>> 0 > d >>> 0) : 0) break;
                    a = c[e + 8 >> 2] | 0;
                    if (!a) {
                        v = 118;
                        break c;
                    } else e = a;
                }
                b = g - h & f;
                if (b >>> 0 < 2147483647) {
                    a = FC(b | 0) | 0;
                    if ((a | 0) == ((c[e >> 2] | 0) + (c[r >> 2] | 0) | 0)) {
                        if ((a | 0) != -1) {
                            h = b;
                            g = a;
                            v = 135;
                            break b;
                        }
                    } else {
                        e = a;
                        v = 126;
                    }
                } else b = 0;
            } else v = 118;
            while (0)
            do if ((v | 0) == 118) {
                d = FC(0) | 0;
                if ((d | 0) != -1 ? (b = d, p = c[2902] | 0, q = p + -1 | 0, b = ((q & b | 0) == 0 ? 0 : (q + b & 0 - p) - b | 0) + k | 0, p = c[2891] | 0, q = b + p | 0, b >>> 0 > n >>> 0 & b >>> 0 < 2147483647) : 0) {
                    r = c[2893] | 0;
                    if (r | 0 ? q >>> 0 <= p >>> 0 | q >>> 0 > r >>> 0 : 0) {
                        b = 0;
                        break;
                    }
                    a = FC(b | 0) | 0;
                    if ((a | 0) == (d | 0)) {
                        h = b;
                        g = d;
                        v = 135;
                        break b;
                    } else {
                        e = a;
                        v = 126;
                    }
                } else b = 0;
            }
            while (0)
            do if ((v | 0) == 126) {
                d = 0 - b | 0;
                if (!(i >>> 0 > b >>> 0 & (b >>> 0 < 2147483647 & (e | 0) != -1))) {
                    if ((e | 0) == -1) {
                        b = 0;
                        break;
                    } else {
                        h = b;
                        g = e;
                        v = 135;
                        break b;
                    }
                }
                a = c[2903] | 0;
                a = j - b + a & 0 - a;
                if (a >>> 0 >= 2147483647) {
                    h = b;
                    g = e;
                    v = 135;
                    break b;
                }
                if ((FC(a | 0) | 0) == -1) {
                    FC(d | 0);
                    b = 0;
                    break;
                } else {
                    h = a + b | 0;
                    g = e;
                    v = 135;
                    break b;
                }
            }
            while (0)
            c[2894] = c[2894] | 4;
            v = 133;
        } else {
            b = 0;
            v = 133;
        }
        while (0)
        if (((v | 0) == 133 ? k >>> 0 < 2147483647 : 0) ? (u = FC(k | 0) | 0, r = FC(0) | 0, s = r - u | 0, t = s >>> 0 > (n + 40 | 0) >>> 0, !((u | 0) == -1 | t ^ 1 | u >>> 0 < r >>> 0 & ((u | 0) != -1 & (r | 0) != -1) ^ 1)) : 0) {
            h = t ? s : b;
            g = u;
            v = 135;
        }
        if ((v | 0) == 135) {
            b = (c[2891] | 0) + h | 0;
            c[2891] = b;
            if (b >>> 0 > (c[2892] | 0) >>> 0) c[2892] = b;
            j = c[2789] | 0;
            do if (j) {
                b = 11580;
                while(true){
                    a = c[b >> 2] | 0;
                    d = b + 4 | 0;
                    e = c[d >> 2] | 0;
                    if ((g | 0) == (a + e | 0)) {
                        v = 145;
                        break;
                    }
                    f = c[b + 8 >> 2] | 0;
                    if (!f) break;
                    else b = f;
                }
                if (((v | 0) == 145 ? (c[b + 12 >> 2] & 8 | 0) == 0 : 0) ? j >>> 0 < g >>> 0 & j >>> 0 >= a >>> 0 : 0) {
                    c[d >> 2] = e + h;
                    w = j + 8 | 0;
                    w = (w & 7 | 0) == 0 ? 0 : 0 - w & 7;
                    v = j + w | 0;
                    w = (c[2786] | 0) + (h - w) | 0;
                    c[2789] = v;
                    c[2786] = w;
                    c[v + 4 >> 2] = w | 1;
                    c[v + w + 4 >> 2] = 40;
                    c[2790] = c[2905];
                    break;
                }
                if (g >>> 0 < (c[2787] | 0) >>> 0) c[2787] = g;
                d = g + h | 0;
                b = 11580;
                while(true){
                    if ((c[b >> 2] | 0) == (d | 0)) {
                        v = 153;
                        break;
                    }
                    a = c[b + 8 >> 2] | 0;
                    if (!a) break;
                    else b = a;
                }
                if ((v | 0) == 153 ? (c[b + 12 >> 2] & 8 | 0) == 0 : 0) {
                    c[b >> 2] = g;
                    m = b + 4 | 0;
                    c[m >> 2] = (c[m >> 2] | 0) + h;
                    m = g + 8 | 0;
                    m = g + ((m & 7 | 0) == 0 ? 0 : 0 - m & 7) | 0;
                    b = d + 8 | 0;
                    b = d + ((b & 7 | 0) == 0 ? 0 : 0 - b & 7) | 0;
                    k = m + n | 0;
                    i = b - m - n | 0;
                    c[m + 4 >> 2] = n | 3;
                    do if ((b | 0) != (j | 0)) {
                        if ((b | 0) == (c[2788] | 0)) {
                            w = (c[2785] | 0) + i | 0;
                            c[2785] = w;
                            c[2788] = k;
                            c[k + 4 >> 2] = w | 1;
                            c[k + w >> 2] = w;
                            break;
                        }
                        a = c[b + 4 >> 2] | 0;
                        if ((a & 3 | 0) == 1) {
                            h = a & -8;
                            e = a >>> 3;
                            d: do if (a >>> 0 < 256) {
                                a = c[b + 8 >> 2] | 0;
                                d = c[b + 12 >> 2] | 0;
                                if ((d | 0) == (a | 0)) {
                                    c[2783] = c[2783] & ~(1 << e);
                                    break;
                                } else {
                                    c[a + 12 >> 2] = d;
                                    c[d + 8 >> 2] = a;
                                    break;
                                }
                            } else {
                                g = c[b + 24 >> 2] | 0;
                                a = c[b + 12 >> 2] | 0;
                                do if ((a | 0) == (b | 0)) {
                                    e = b + 16 | 0;
                                    d = e + 4 | 0;
                                    a = c[d >> 2] | 0;
                                    if (!a) {
                                        a = c[e >> 2] | 0;
                                        if (!a) {
                                            a = 0;
                                            break;
                                        } else d = e;
                                    }
                                    while(true){
                                        e = a + 20 | 0;
                                        f = c[e >> 2] | 0;
                                        if (f | 0) {
                                            a = f;
                                            d = e;
                                            continue;
                                        }
                                        e = a + 16 | 0;
                                        f = c[e >> 2] | 0;
                                        if (!f) break;
                                        else {
                                            a = f;
                                            d = e;
                                        }
                                    }
                                    c[d >> 2] = 0;
                                } else {
                                    w = c[b + 8 >> 2] | 0;
                                    c[w + 12 >> 2] = a;
                                    c[a + 8 >> 2] = w;
                                }
                                while (0)
                                if (!g) break;
                                d = c[b + 28 >> 2] | 0;
                                e = 11436 + (d << 2) | 0;
                                do if ((b | 0) != (c[e >> 2] | 0)) {
                                    c[g + 16 + (((c[g + 16 >> 2] | 0) != (b | 0) & 1) << 2) >> 2] = a;
                                    if (!a) break d;
                                } else {
                                    c[e >> 2] = a;
                                    if (a | 0) break;
                                    c[2784] = c[2784] & ~(1 << d);
                                    break d;
                                }
                                while (0)
                                c[a + 24 >> 2] = g;
                                d = b + 16 | 0;
                                e = c[d >> 2] | 0;
                                if (e | 0) {
                                    c[a + 16 >> 2] = e;
                                    c[e + 24 >> 2] = a;
                                }
                                d = c[d + 4 >> 2] | 0;
                                if (!d) break;
                                c[a + 20 >> 2] = d;
                                c[d + 24 >> 2] = a;
                            }
                            while (0)
                            b = b + h | 0;
                            f = h + i | 0;
                        } else f = i;
                        b = b + 4 | 0;
                        c[b >> 2] = c[b >> 2] & -2;
                        c[k + 4 >> 2] = f | 1;
                        c[k + f >> 2] = f;
                        b = f >>> 3;
                        if (f >>> 0 < 256) {
                            d = 11172 + (b << 1 << 2) | 0;
                            a = c[2783] | 0;
                            b = 1 << b;
                            if (!(a & b)) {
                                c[2783] = a | b;
                                b = d;
                                a = d + 8 | 0;
                            } else {
                                a = d + 8 | 0;
                                b = c[a >> 2] | 0;
                            }
                            c[a >> 2] = k;
                            c[b + 12 >> 2] = k;
                            c[k + 8 >> 2] = b;
                            c[k + 12 >> 2] = d;
                            break;
                        }
                        b = f >>> 8;
                        do if (!b) b = 0;
                        else {
                            if (f >>> 0 > 16777215) {
                                b = 31;
                                break;
                            }
                            v = (b + 1048320 | 0) >>> 16 & 8;
                            w = b << v;
                            u = (w + 520192 | 0) >>> 16 & 4;
                            w = w << u;
                            b = (w + 245760 | 0) >>> 16 & 2;
                            b = 14 - (u | v | b) + (w << b >>> 15) | 0;
                            b = f >>> (b + 7 | 0) & 1 | b << 1;
                        }
                        while (0)
                        e = 11436 + (b << 2) | 0;
                        c[k + 28 >> 2] = b;
                        a = k + 16 | 0;
                        c[a + 4 >> 2] = 0;
                        c[a >> 2] = 0;
                        a = c[2784] | 0;
                        d = 1 << b;
                        if (!(a & d)) {
                            c[2784] = a | d;
                            c[e >> 2] = k;
                            c[k + 24 >> 2] = e;
                            c[k + 12 >> 2] = k;
                            c[k + 8 >> 2] = k;
                            break;
                        }
                        a = f << ((b | 0) == 31 ? 0 : 25 - (b >>> 1) | 0);
                        d = c[e >> 2] | 0;
                        while(true){
                            if ((c[d + 4 >> 2] & -8 | 0) == (f | 0)) {
                                v = 194;
                                break;
                            }
                            e = d + 16 + (a >>> 31 << 2) | 0;
                            b = c[e >> 2] | 0;
                            if (!b) {
                                v = 193;
                                break;
                            } else {
                                a = a << 1;
                                d = b;
                            }
                        }
                        if ((v | 0) == 193) {
                            c[e >> 2] = k;
                            c[k + 24 >> 2] = d;
                            c[k + 12 >> 2] = k;
                            c[k + 8 >> 2] = k;
                            break;
                        } else if ((v | 0) == 194) {
                            v = d + 8 | 0;
                            w = c[v >> 2] | 0;
                            c[w + 12 >> 2] = k;
                            c[v >> 2] = k;
                            c[k + 8 >> 2] = w;
                            c[k + 12 >> 2] = d;
                            c[k + 24 >> 2] = 0;
                            break;
                        }
                    } else {
                        w = (c[2786] | 0) + i | 0;
                        c[2786] = w;
                        c[2789] = k;
                        c[k + 4 >> 2] = w | 1;
                    }
                    while (0)
                    w = m + 8 | 0;
                    l = x;
                    return w | 0;
                }
                b = 11580;
                while(true){
                    a = c[b >> 2] | 0;
                    if (a >>> 0 <= j >>> 0 ? (w = a + (c[b + 4 >> 2] | 0) | 0, w >>> 0 > j >>> 0) : 0) break;
                    b = c[b + 8 >> 2] | 0;
                }
                f = w + -47 | 0;
                a = f + 8 | 0;
                a = f + ((a & 7 | 0) == 0 ? 0 : 0 - a & 7) | 0;
                f = j + 16 | 0;
                a = a >>> 0 < f >>> 0 ? j : a;
                b = a + 8 | 0;
                d = g + 8 | 0;
                d = (d & 7 | 0) == 0 ? 0 : 0 - d & 7;
                v = g + d | 0;
                d = h + -40 - d | 0;
                c[2789] = v;
                c[2786] = d;
                c[v + 4 >> 2] = d | 1;
                c[v + d + 4 >> 2] = 40;
                c[2790] = c[2905];
                d = a + 4 | 0;
                c[d >> 2] = 27;
                c[b >> 2] = c[2895];
                c[b + 4 >> 2] = c[2896];
                c[b + 8 >> 2] = c[2897];
                c[b + 12 >> 2] = c[2898];
                c[2895] = g;
                c[2896] = h;
                c[2898] = 0;
                c[2897] = b;
                b = a + 24 | 0;
                do {
                    v = b;
                    b = b + 4 | 0;
                    c[b >> 2] = 7;
                }while ((v + 8 | 0) >>> 0 < w >>> 0)
                if ((a | 0) != (j | 0)) {
                    g = a - j | 0;
                    c[d >> 2] = c[d >> 2] & -2;
                    c[j + 4 >> 2] = g | 1;
                    c[a >> 2] = g;
                    b = g >>> 3;
                    if (g >>> 0 < 256) {
                        d = 11172 + (b << 1 << 2) | 0;
                        a = c[2783] | 0;
                        b = 1 << b;
                        if (!(a & b)) {
                            c[2783] = a | b;
                            b = d;
                            a = d + 8 | 0;
                        } else {
                            a = d + 8 | 0;
                            b = c[a >> 2] | 0;
                        }
                        c[a >> 2] = j;
                        c[b + 12 >> 2] = j;
                        c[j + 8 >> 2] = b;
                        c[j + 12 >> 2] = d;
                        break;
                    }
                    b = g >>> 8;
                    if (b) {
                        if (g >>> 0 > 16777215) d = 31;
                        else {
                            v = (b + 1048320 | 0) >>> 16 & 8;
                            w = b << v;
                            u = (w + 520192 | 0) >>> 16 & 4;
                            w = w << u;
                            d = (w + 245760 | 0) >>> 16 & 2;
                            d = 14 - (u | v | d) + (w << d >>> 15) | 0;
                            d = g >>> (d + 7 | 0) & 1 | d << 1;
                        }
                    } else d = 0;
                    e = 11436 + (d << 2) | 0;
                    c[j + 28 >> 2] = d;
                    c[j + 20 >> 2] = 0;
                    c[f >> 2] = 0;
                    b = c[2784] | 0;
                    a = 1 << d;
                    if (!(b & a)) {
                        c[2784] = b | a;
                        c[e >> 2] = j;
                        c[j + 24 >> 2] = e;
                        c[j + 12 >> 2] = j;
                        c[j + 8 >> 2] = j;
                        break;
                    }
                    a = g << ((d | 0) == 31 ? 0 : 25 - (d >>> 1) | 0);
                    d = c[e >> 2] | 0;
                    while(true){
                        if ((c[d + 4 >> 2] & -8 | 0) == (g | 0)) {
                            v = 216;
                            break;
                        }
                        e = d + 16 + (a >>> 31 << 2) | 0;
                        b = c[e >> 2] | 0;
                        if (!b) {
                            v = 215;
                            break;
                        } else {
                            a = a << 1;
                            d = b;
                        }
                    }
                    if ((v | 0) == 215) {
                        c[e >> 2] = j;
                        c[j + 24 >> 2] = d;
                        c[j + 12 >> 2] = j;
                        c[j + 8 >> 2] = j;
                        break;
                    } else if ((v | 0) == 216) {
                        v = d + 8 | 0;
                        w = c[v >> 2] | 0;
                        c[w + 12 >> 2] = j;
                        c[v >> 2] = j;
                        c[j + 8 >> 2] = w;
                        c[j + 12 >> 2] = d;
                        c[j + 24 >> 2] = 0;
                        break;
                    }
                }
            } else {
                w = c[2787] | 0;
                if ((w | 0) == 0 | g >>> 0 < w >>> 0) c[2787] = g;
                c[2895] = g;
                c[2896] = h;
                c[2898] = 0;
                c[2792] = c[2901];
                c[2791] = -1;
                b = 0;
                do {
                    w = 11172 + (b << 1 << 2) | 0;
                    c[w + 12 >> 2] = w;
                    c[w + 8 >> 2] = w;
                    b = b + 1 | 0;
                }while ((b | 0) != 32)
                w = g + 8 | 0;
                w = (w & 7 | 0) == 0 ? 0 : 0 - w & 7;
                v = g + w | 0;
                w = h + -40 - w | 0;
                c[2789] = v;
                c[2786] = w;
                c[v + 4 >> 2] = w | 1;
                c[v + w + 4 >> 2] = 40;
                c[2790] = c[2905];
            }
            while (0)
            b = c[2786] | 0;
            if (b >>> 0 > n >>> 0) {
                u = b - n | 0;
                c[2786] = u;
                w = c[2789] | 0;
                v = w + n | 0;
                c[2789] = v;
                c[v + 4 >> 2] = u | 1;
                c[w + 4 >> 2] = n | 3;
                w = w + 8 | 0;
                l = x;
                return w | 0;
            }
        }
        c[(vB() | 0) >> 2] = 12;
        w = 0;
        l = x;
        return w | 0;
    }
    function pB(a) {
        a = a | 0;
        var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, i = 0, j = 0;
        if (!a) return;
        d = a + -8 | 0;
        f = c[2787] | 0;
        a = c[a + -4 >> 2] | 0;
        b = a & -8;
        j = d + b | 0;
        do if (!(a & 1)) {
            e = c[d >> 2] | 0;
            if (!(a & 3)) return;
            h = d + (0 - e) | 0;
            g = e + b | 0;
            if (h >>> 0 < f >>> 0) return;
            if ((h | 0) == (c[2788] | 0)) {
                a = j + 4 | 0;
                b = c[a >> 2] | 0;
                if ((b & 3 | 0) != 3) {
                    i = h;
                    b = g;
                    break;
                }
                c[2785] = g;
                c[a >> 2] = b & -2;
                c[h + 4 >> 2] = g | 1;
                c[h + g >> 2] = g;
                return;
            }
            d = e >>> 3;
            if (e >>> 0 < 256) {
                a = c[h + 8 >> 2] | 0;
                b = c[h + 12 >> 2] | 0;
                if ((b | 0) == (a | 0)) {
                    c[2783] = c[2783] & ~(1 << d);
                    i = h;
                    b = g;
                    break;
                } else {
                    c[a + 12 >> 2] = b;
                    c[b + 8 >> 2] = a;
                    i = h;
                    b = g;
                    break;
                }
            }
            f = c[h + 24 >> 2] | 0;
            a = c[h + 12 >> 2] | 0;
            do if ((a | 0) == (h | 0)) {
                d = h + 16 | 0;
                b = d + 4 | 0;
                a = c[b >> 2] | 0;
                if (!a) {
                    a = c[d >> 2] | 0;
                    if (!a) {
                        a = 0;
                        break;
                    } else b = d;
                }
                while(true){
                    d = a + 20 | 0;
                    e = c[d >> 2] | 0;
                    if (e | 0) {
                        a = e;
                        b = d;
                        continue;
                    }
                    d = a + 16 | 0;
                    e = c[d >> 2] | 0;
                    if (!e) break;
                    else {
                        a = e;
                        b = d;
                    }
                }
                c[b >> 2] = 0;
            } else {
                i = c[h + 8 >> 2] | 0;
                c[i + 12 >> 2] = a;
                c[a + 8 >> 2] = i;
            }
            while (0)
            if (f) {
                b = c[h + 28 >> 2] | 0;
                d = 11436 + (b << 2) | 0;
                if ((h | 0) == (c[d >> 2] | 0)) {
                    c[d >> 2] = a;
                    if (!a) {
                        c[2784] = c[2784] & ~(1 << b);
                        i = h;
                        b = g;
                        break;
                    }
                } else {
                    c[f + 16 + (((c[f + 16 >> 2] | 0) != (h | 0) & 1) << 2) >> 2] = a;
                    if (!a) {
                        i = h;
                        b = g;
                        break;
                    }
                }
                c[a + 24 >> 2] = f;
                b = h + 16 | 0;
                d = c[b >> 2] | 0;
                if (d | 0) {
                    c[a + 16 >> 2] = d;
                    c[d + 24 >> 2] = a;
                }
                b = c[b + 4 >> 2] | 0;
                if (b) {
                    c[a + 20 >> 2] = b;
                    c[b + 24 >> 2] = a;
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
            i = d;
            h = d;
        }
        while (0)
        if (h >>> 0 >= j >>> 0) return;
        a = j + 4 | 0;
        e = c[a >> 2] | 0;
        if (!(e & 1)) return;
        if (!(e & 2)) {
            a = c[2788] | 0;
            if ((j | 0) == (c[2789] | 0)) {
                j = (c[2786] | 0) + b | 0;
                c[2786] = j;
                c[2789] = i;
                c[i + 4 >> 2] = j | 1;
                if ((i | 0) != (a | 0)) return;
                c[2788] = 0;
                c[2785] = 0;
                return;
            }
            if ((j | 0) == (a | 0)) {
                j = (c[2785] | 0) + b | 0;
                c[2785] = j;
                c[2788] = h;
                c[i + 4 >> 2] = j | 1;
                c[h + j >> 2] = j;
                return;
            }
            f = (e & -8) + b | 0;
            d = e >>> 3;
            do if (e >>> 0 < 256) {
                b = c[j + 8 >> 2] | 0;
                a = c[j + 12 >> 2] | 0;
                if ((a | 0) == (b | 0)) {
                    c[2783] = c[2783] & ~(1 << d);
                    break;
                } else {
                    c[b + 12 >> 2] = a;
                    c[a + 8 >> 2] = b;
                    break;
                }
            } else {
                g = c[j + 24 >> 2] | 0;
                a = c[j + 12 >> 2] | 0;
                do if ((a | 0) == (j | 0)) {
                    d = j + 16 | 0;
                    b = d + 4 | 0;
                    a = c[b >> 2] | 0;
                    if (!a) {
                        a = c[d >> 2] | 0;
                        if (!a) {
                            d = 0;
                            break;
                        } else b = d;
                    }
                    while(true){
                        d = a + 20 | 0;
                        e = c[d >> 2] | 0;
                        if (e | 0) {
                            a = e;
                            b = d;
                            continue;
                        }
                        d = a + 16 | 0;
                        e = c[d >> 2] | 0;
                        if (!e) break;
                        else {
                            a = e;
                            b = d;
                        }
                    }
                    c[b >> 2] = 0;
                    d = a;
                } else {
                    d = c[j + 8 >> 2] | 0;
                    c[d + 12 >> 2] = a;
                    c[a + 8 >> 2] = d;
                    d = a;
                }
                while (0)
                if (g | 0) {
                    a = c[j + 28 >> 2] | 0;
                    b = 11436 + (a << 2) | 0;
                    if ((j | 0) == (c[b >> 2] | 0)) {
                        c[b >> 2] = d;
                        if (!d) {
                            c[2784] = c[2784] & ~(1 << a);
                            break;
                        }
                    } else {
                        c[g + 16 + (((c[g + 16 >> 2] | 0) != (j | 0) & 1) << 2) >> 2] = d;
                        if (!d) break;
                    }
                    c[d + 24 >> 2] = g;
                    a = j + 16 | 0;
                    b = c[a >> 2] | 0;
                    if (b | 0) {
                        c[d + 16 >> 2] = b;
                        c[b + 24 >> 2] = d;
                    }
                    a = c[a + 4 >> 2] | 0;
                    if (a | 0) {
                        c[d + 20 >> 2] = a;
                        c[a + 24 >> 2] = d;
                    }
                }
            }
            while (0)
            c[i + 4 >> 2] = f | 1;
            c[h + f >> 2] = f;
            if ((i | 0) == (c[2788] | 0)) {
                c[2785] = f;
                return;
            }
        } else {
            c[a >> 2] = e & -2;
            c[i + 4 >> 2] = b | 1;
            c[h + b >> 2] = b;
            f = b;
        }
        a = f >>> 3;
        if (f >>> 0 < 256) {
            d = 11172 + (a << 1 << 2) | 0;
            b = c[2783] | 0;
            a = 1 << a;
            if (!(b & a)) {
                c[2783] = b | a;
                a = d;
                b = d + 8 | 0;
            } else {
                b = d + 8 | 0;
                a = c[b >> 2] | 0;
            }
            c[b >> 2] = i;
            c[a + 12 >> 2] = i;
            c[i + 8 >> 2] = a;
            c[i + 12 >> 2] = d;
            return;
        }
        a = f >>> 8;
        if (a) {
            if (f >>> 0 > 16777215) a = 31;
            else {
                h = (a + 1048320 | 0) >>> 16 & 8;
                j = a << h;
                g = (j + 520192 | 0) >>> 16 & 4;
                j = j << g;
                a = (j + 245760 | 0) >>> 16 & 2;
                a = 14 - (g | h | a) + (j << a >>> 15) | 0;
                a = f >>> (a + 7 | 0) & 1 | a << 1;
            }
        } else a = 0;
        e = 11436 + (a << 2) | 0;
        c[i + 28 >> 2] = a;
        c[i + 20 >> 2] = 0;
        c[i + 16 >> 2] = 0;
        b = c[2784] | 0;
        d = 1 << a;
        do if (b & d) {
            b = f << ((a | 0) == 31 ? 0 : 25 - (a >>> 1) | 0);
            d = c[e >> 2] | 0;
            while(true){
                if ((c[d + 4 >> 2] & -8 | 0) == (f | 0)) {
                    a = 73;
                    break;
                }
                e = d + 16 + (b >>> 31 << 2) | 0;
                a = c[e >> 2] | 0;
                if (!a) {
                    a = 72;
                    break;
                } else {
                    b = b << 1;
                    d = a;
                }
            }
            if ((a | 0) == 72) {
                c[e >> 2] = i;
                c[i + 24 >> 2] = d;
                c[i + 12 >> 2] = i;
                c[i + 8 >> 2] = i;
                break;
            } else if ((a | 0) == 73) {
                h = d + 8 | 0;
                j = c[h >> 2] | 0;
                c[j + 12 >> 2] = i;
                c[h >> 2] = i;
                c[i + 8 >> 2] = j;
                c[i + 12 >> 2] = d;
                c[i + 24 >> 2] = 0;
                break;
            }
        } else {
            c[2784] = b | d;
            c[e >> 2] = i;
            c[i + 24 >> 2] = e;
            c[i + 12 >> 2] = i;
            c[i + 8 >> 2] = i;
        }
        while (0)
        j = (c[2791] | 0) + -1 | 0;
        c[2791] = j;
        if (!j) a = 11588;
        else return;
        while(true){
            a = c[a >> 2] | 0;
            if (!a) break;
            else a = a + 8 | 0;
        }
        c[2791] = -1;
        return;
    }
    function qB() {
        return 11628;
    }
    function rB(a) {
        a = a | 0;
        var b = 0, d = 0;
        b = l;
        l = l + 16 | 0;
        d = b;
        c[d >> 2] = yB(c[a + 60 >> 2] | 0) | 0;
        a = uB(db(6, d | 0) | 0) | 0;
        l = b;
        return a | 0;
    }
    function sB(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0;
        n = l;
        l = l + 48 | 0;
        k = n + 16 | 0;
        g = n;
        f = n + 32 | 0;
        i = a + 28 | 0;
        e = c[i >> 2] | 0;
        c[f >> 2] = e;
        j = a + 20 | 0;
        e = (c[j >> 2] | 0) - e | 0;
        c[f + 4 >> 2] = e;
        c[f + 8 >> 2] = b;
        c[f + 12 >> 2] = d;
        e = e + d | 0;
        h = a + 60 | 0;
        c[g >> 2] = c[h >> 2];
        c[g + 4 >> 2] = f;
        c[g + 8 >> 2] = 2;
        g = uB(gb(146, g | 0) | 0) | 0;
        a: do if ((e | 0) != (g | 0)) {
            b = 2;
            while(true){
                if ((g | 0) < 0) break;
                e = e - g | 0;
                p = c[f + 4 >> 2] | 0;
                o = g >>> 0 > p >>> 0;
                f = o ? f + 8 | 0 : f;
                b = (o << 31 >> 31) + b | 0;
                p = g - (o ? p : 0) | 0;
                c[f >> 2] = (c[f >> 2] | 0) + p;
                o = f + 4 | 0;
                c[o >> 2] = (c[o >> 2] | 0) - p;
                c[k >> 2] = c[h >> 2];
                c[k + 4 >> 2] = f;
                c[k + 8 >> 2] = b;
                g = uB(gb(146, k | 0) | 0) | 0;
                if ((e | 0) == (g | 0)) {
                    m = 3;
                    break a;
                }
            }
            c[a + 16 >> 2] = 0;
            c[i >> 2] = 0;
            c[j >> 2] = 0;
            c[a >> 2] = c[a >> 2] | 32;
            if ((b | 0) == 2) d = 0;
            else d = d - (c[f + 4 >> 2] | 0) | 0;
        } else m = 3;
        while (0)
        if ((m | 0) == 3) {
            p = c[a + 44 >> 2] | 0;
            c[a + 16 >> 2] = p + (c[a + 48 >> 2] | 0);
            c[i >> 2] = p;
            c[j >> 2] = p;
        }
        l = n;
        return d | 0;
    }
    function tB(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0;
        f = l;
        l = l + 32 | 0;
        g = f;
        e = f + 20 | 0;
        c[g >> 2] = c[a + 60 >> 2];
        c[g + 4 >> 2] = 0;
        c[g + 8 >> 2] = b;
        c[g + 12 >> 2] = e;
        c[g + 16 >> 2] = d;
        if ((uB(fb(140, g | 0) | 0) | 0) < 0) {
            c[e >> 2] = -1;
            a = -1;
        } else a = c[e >> 2] | 0;
        l = f;
        return a | 0;
    }
    function uB(a) {
        a = a | 0;
        if (a >>> 0 > 4294963200) {
            c[(vB() | 0) >> 2] = 0 - a;
            a = -1;
        }
        return a | 0;
    }
    function vB() {
        return (wB() | 0) + 64 | 0;
    }
    function wB() {
        return xB() | 0;
    }
    function xB() {
        return 2084;
    }
    function yB(a) {
        a = a | 0;
        return a | 0;
    }
    function zB(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = l;
        l = l + 32 | 0;
        f = g;
        c[b + 36 >> 2] = 1;
        if ((c[b >> 2] & 64 | 0) == 0 ? (c[f >> 2] = c[b + 60 >> 2], c[f + 4 >> 2] = 21523, c[f + 8 >> 2] = g + 16, Wa(54, f | 0) | 0) : 0) a[b + 75 >> 0] = -1;
        f = sB(b, d, e) | 0;
        l = g;
        return f | 0;
    }
    function AB(b, c) {
        b = b | 0;
        c = c | 0;
        var d = 0, e = 0;
        d = a[b >> 0] | 0;
        e = a[c >> 0] | 0;
        if (d << 24 >> 24 == 0 ? 1 : d << 24 >> 24 != e << 24 >> 24) b = e;
        else {
            do {
                b = b + 1 | 0;
                c = c + 1 | 0;
                d = a[b >> 0] | 0;
                e = a[c >> 0] | 0;
            }while (!(d << 24 >> 24 == 0 ? 1 : d << 24 >> 24 != e << 24 >> 24))
            b = e;
        }
        return (d & 255) - (b & 255) | 0;
    }
    function BB(b, c, d) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0, f = 0;
        a: do if (!d) b = 0;
        else {
            while(true){
                e = a[b >> 0] | 0;
                f = a[c >> 0] | 0;
                if (e << 24 >> 24 != f << 24 >> 24) break;
                d = d + -1 | 0;
                if (!d) {
                    b = 0;
                    break a;
                } else {
                    b = b + 1 | 0;
                    c = c + 1 | 0;
                }
            }
            b = (e & 255) - (f & 255) | 0;
        }
        while (0)
        return b | 0;
    }
    function CB(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0;
        s = l;
        l = l + 224 | 0;
        n = s + 120 | 0;
        o = s + 80 | 0;
        q = s;
        r = s + 136 | 0;
        f = o;
        g = f + 40 | 0;
        do {
            c[f >> 2] = 0;
            f = f + 4 | 0;
        }while ((f | 0) < (g | 0))
        c[n >> 2] = c[e >> 2];
        if ((DB(0, d, n, q, o) | 0) < 0) e = -1;
        else {
            if ((c[b + 76 >> 2] | 0) > -1) p = EB(b) | 0;
            else p = 0;
            e = c[b >> 2] | 0;
            m = e & 32;
            if ((a[b + 74 >> 0] | 0) < 1) c[b >> 2] = e & -33;
            f = b + 48 | 0;
            if (!(c[f >> 2] | 0)) {
                g = b + 44 | 0;
                h = c[g >> 2] | 0;
                c[g >> 2] = r;
                i = b + 28 | 0;
                c[i >> 2] = r;
                j = b + 20 | 0;
                c[j >> 2] = r;
                c[f >> 2] = 80;
                k = b + 16 | 0;
                c[k >> 2] = r + 80;
                e = DB(b, d, n, q, o) | 0;
                if (h) {
                    sb[c[b + 36 >> 2] & 7](b, 0, 0);
                    e = (c[j >> 2] | 0) == 0 ? -1 : e;
                    c[g >> 2] = h;
                    c[f >> 2] = 0;
                    c[k >> 2] = 0;
                    c[i >> 2] = 0;
                    c[j >> 2] = 0;
                }
            } else e = DB(b, d, n, q, o) | 0;
            f = c[b >> 2] | 0;
            c[b >> 2] = f | m;
            if (p | 0) FB(b);
            e = (f & 32 | 0) == 0 ? e : -1;
        }
        l = s;
        return e | 0;
    }
    function DB(d, e, f, g, i) {
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        i = i | 0;
        var j = 0, k = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
        H = l;
        l = l + 64 | 0;
        D = H + 16 | 0;
        E = H;
        B = H + 24 | 0;
        F = H + 8 | 0;
        G = H + 20 | 0;
        c[D >> 2] = e;
        x = (d | 0) != 0;
        y = B + 40 | 0;
        z = y;
        B = B + 39 | 0;
        C = F + 4 | 0;
        k = 0;
        j = 0;
        p = 0;
        a: while(true){
            do if ((j | 0) > -1) {
                if ((k | 0) > (2147483647 - j | 0)) {
                    c[(vB() | 0) >> 2] = 75;
                    j = -1;
                    break;
                } else {
                    j = k + j | 0;
                    break;
                }
            }
            while (0)
            k = a[e >> 0] | 0;
            if (!(k << 24 >> 24)) {
                w = 87;
                break;
            } else m = e;
            b: while(true){
                switch(k << 24 >> 24){
                    case 37:
                        k = m;
                        w = 9;
                        break b;
                    case 0:
                        k = m;
                        break b;
                    default:
                }
                v = m + 1 | 0;
                c[D >> 2] = v;
                k = a[v >> 0] | 0;
                m = v;
            }
            c: do if ((w | 0) == 9) while(true){
                w = 0;
                if ((a[m + 1 >> 0] | 0) != 37) break c;
                k = k + 1 | 0;
                m = m + 2 | 0;
                c[D >> 2] = m;
                if ((a[m >> 0] | 0) == 37) w = 9;
                else break;
            }
            while (0)
            k = k - e | 0;
            if (x) GB(d, e, k);
            if (k | 0) {
                e = m;
                continue;
            }
            n = m + 1 | 0;
            k = (a[n >> 0] | 0) + -48 | 0;
            if (k >>> 0 < 10) {
                v = (a[m + 2 >> 0] | 0) == 36;
                u = v ? k : -1;
                p = v ? 1 : p;
                n = v ? m + 3 | 0 : n;
            } else u = -1;
            c[D >> 2] = n;
            k = a[n >> 0] | 0;
            m = (k << 24 >> 24) + -32 | 0;
            d: do if (m >>> 0 < 32) {
                o = 0;
                q = k;
                while(true){
                    k = 1 << m;
                    if (!(k & 75913)) {
                        k = q;
                        break d;
                    }
                    o = k | o;
                    n = n + 1 | 0;
                    c[D >> 2] = n;
                    k = a[n >> 0] | 0;
                    m = (k << 24 >> 24) + -32 | 0;
                    if (m >>> 0 >= 32) break;
                    else q = k;
                }
            } else o = 0;
            while (0)
            if (k << 24 >> 24 == 42) {
                m = n + 1 | 0;
                k = (a[m >> 0] | 0) + -48 | 0;
                if (k >>> 0 < 10 ? (a[n + 2 >> 0] | 0) == 36 : 0) {
                    c[i + (k << 2) >> 2] = 10;
                    k = c[g + ((a[m >> 0] | 0) + -48 << 3) >> 2] | 0;
                    p = 1;
                    n = n + 3 | 0;
                } else {
                    if (p | 0) {
                        j = -1;
                        break;
                    }
                    if (x) {
                        p = (c[f >> 2] | 0) + 3 & -4;
                        k = c[p >> 2] | 0;
                        c[f >> 2] = p + 4;
                        p = 0;
                        n = m;
                    } else {
                        k = 0;
                        p = 0;
                        n = m;
                    }
                }
                c[D >> 2] = n;
                v = (k | 0) < 0;
                k = v ? 0 - k | 0 : k;
                o = v ? o | 8192 : o;
            } else {
                k = HB(D) | 0;
                if ((k | 0) < 0) {
                    j = -1;
                    break;
                }
                n = c[D >> 2] | 0;
            }
            do if ((a[n >> 0] | 0) == 46) {
                if ((a[n + 1 >> 0] | 0) != 42) {
                    c[D >> 2] = n + 1;
                    m = HB(D) | 0;
                    n = c[D >> 2] | 0;
                    break;
                }
                q = n + 2 | 0;
                m = (a[q >> 0] | 0) + -48 | 0;
                if (m >>> 0 < 10 ? (a[n + 3 >> 0] | 0) == 36 : 0) {
                    c[i + (m << 2) >> 2] = 10;
                    m = c[g + ((a[q >> 0] | 0) + -48 << 3) >> 2] | 0;
                    n = n + 4 | 0;
                    c[D >> 2] = n;
                    break;
                }
                if (p | 0) {
                    j = -1;
                    break a;
                }
                if (x) {
                    v = (c[f >> 2] | 0) + 3 & -4;
                    m = c[v >> 2] | 0;
                    c[f >> 2] = v + 4;
                } else m = 0;
                c[D >> 2] = q;
                n = q;
            } else m = -1;
            while (0)
            t = 0;
            while(true){
                if (((a[n >> 0] | 0) + -65 | 0) >>> 0 > 57) {
                    j = -1;
                    break a;
                }
                v = n + 1 | 0;
                c[D >> 2] = v;
                q = a[(a[n >> 0] | 0) + -65 + (5178 + (t * 58 | 0)) >> 0] | 0;
                r = q & 255;
                if ((r + -1 | 0) >>> 0 < 8) {
                    t = r;
                    n = v;
                } else break;
            }
            if (!(q << 24 >> 24)) {
                j = -1;
                break;
            }
            s = (u | 0) > -1;
            do if (q << 24 >> 24 == 19) {
                if (s) {
                    j = -1;
                    break a;
                } else w = 49;
            } else {
                if (s) {
                    c[i + (u << 2) >> 2] = r;
                    s = g + (u << 3) | 0;
                    u = c[s + 4 >> 2] | 0;
                    w = E;
                    c[w >> 2] = c[s >> 2];
                    c[w + 4 >> 2] = u;
                    w = 49;
                    break;
                }
                if (!x) {
                    j = 0;
                    break a;
                }
                IB(E, r, f);
            }
            while (0)
            if ((w | 0) == 49 ? (w = 0, !x) : 0) {
                k = 0;
                e = v;
                continue;
            }
            n = a[n >> 0] | 0;
            n = (t | 0) != 0 & (n & 15 | 0) == 3 ? n & -33 : n;
            s = o & -65537;
            u = (o & 8192 | 0) == 0 ? o : s;
            e: do switch(n | 0){
                case 110:
                    switch((t & 255) << 24 >> 24){
                        case 0:
                            c[c[E >> 2] >> 2] = j;
                            k = 0;
                            e = v;
                            continue a;
                        case 1:
                            c[c[E >> 2] >> 2] = j;
                            k = 0;
                            e = v;
                            continue a;
                        case 2:
                            k = c[E >> 2] | 0;
                            c[k >> 2] = j;
                            c[k + 4 >> 2] = ((j | 0) < 0) << 31 >> 31;
                            k = 0;
                            e = v;
                            continue a;
                        case 3:
                            b[c[E >> 2] >> 1] = j;
                            k = 0;
                            e = v;
                            continue a;
                        case 4:
                            a[c[E >> 2] >> 0] = j;
                            k = 0;
                            e = v;
                            continue a;
                        case 6:
                            c[c[E >> 2] >> 2] = j;
                            k = 0;
                            e = v;
                            continue a;
                        case 7:
                            k = c[E >> 2] | 0;
                            c[k >> 2] = j;
                            c[k + 4 >> 2] = ((j | 0) < 0) << 31 >> 31;
                            k = 0;
                            e = v;
                            continue a;
                        default:
                            k = 0;
                            e = v;
                            continue a;
                    }
                case 112:
                    n = 120;
                    m = m >>> 0 > 8 ? m : 8;
                    e = u | 8;
                    w = 61;
                    break;
                case 88:
                case 120:
                    e = u;
                    w = 61;
                    break;
                case 111:
                    n = E;
                    e = c[n >> 2] | 0;
                    n = c[n + 4 >> 2] | 0;
                    r = KB(e, n, y) | 0;
                    s = z - r | 0;
                    o = 0;
                    q = 5642;
                    m = (u & 8 | 0) == 0 | (m | 0) > (s | 0) ? m : s + 1 | 0;
                    s = u;
                    w = 67;
                    break;
                case 105:
                case 100:
                    n = E;
                    e = c[n >> 2] | 0;
                    n = c[n + 4 >> 2] | 0;
                    if ((n | 0) < 0) {
                        e = wC(0, 0, e | 0, n | 0) | 0;
                        n = A;
                        o = E;
                        c[o >> 2] = e;
                        c[o + 4 >> 2] = n;
                        o = 1;
                        q = 5642;
                        w = 66;
                        break e;
                    } else {
                        o = (u & 2049 | 0) != 0 & 1;
                        q = (u & 2048 | 0) == 0 ? (u & 1 | 0) == 0 ? 5642 : 5644 : 5643;
                        w = 66;
                        break e;
                    }
                case 117:
                    n = E;
                    o = 0;
                    q = 5642;
                    e = c[n >> 2] | 0;
                    n = c[n + 4 >> 2] | 0;
                    w = 66;
                    break;
                case 99:
                    a[B >> 0] = c[E >> 2];
                    e = B;
                    o = 0;
                    q = 5642;
                    r = y;
                    n = 1;
                    m = s;
                    break;
                case 109:
                    n = MB(c[(vB() | 0) >> 2] | 0) | 0;
                    w = 71;
                    break;
                case 115:
                    n = c[E >> 2] | 0;
                    n = n | 0 ? n : 5652;
                    w = 71;
                    break;
                case 67:
                    c[F >> 2] = c[E >> 2];
                    c[C >> 2] = 0;
                    c[E >> 2] = F;
                    r = -1;
                    n = F;
                    w = 75;
                    break;
                case 83:
                    e = c[E >> 2] | 0;
                    if (!m) {
                        OB(d, 32, k, 0, u);
                        e = 0;
                        w = 84;
                    } else {
                        r = m;
                        n = e;
                        w = 75;
                    }
                    break;
                case 65:
                case 71:
                case 70:
                case 69:
                case 97:
                case 103:
                case 102:
                case 101:
                    k = QB(d, +h[E >> 3], k, m, u, n) | 0;
                    e = v;
                    continue a;
                default:
                    o = 0;
                    q = 5642;
                    r = y;
                    n = m;
                    m = u;
            }
            while (0)
            f: do if ((w | 0) == 61) {
                u = E;
                t = c[u >> 2] | 0;
                u = c[u + 4 >> 2] | 0;
                r = JB(t, u, y, n & 32) | 0;
                q = (e & 8 | 0) == 0 | (t | 0) == 0 & (u | 0) == 0;
                o = q ? 0 : 2;
                q = q ? 5642 : 5642 + (n >> 4) | 0;
                s = e;
                e = t;
                n = u;
                w = 67;
            } else if ((w | 0) == 66) {
                r = LB(e, n, y) | 0;
                s = u;
                w = 67;
            } else if ((w | 0) == 71) {
                w = 0;
                u = NB(n, 0, m) | 0;
                t = (u | 0) == 0;
                e = n;
                o = 0;
                q = 5642;
                r = t ? n + m | 0 : u;
                n = t ? m : u - n | 0;
                m = s;
            } else if ((w | 0) == 75) {
                w = 0;
                q = n;
                e = 0;
                m = 0;
                while(true){
                    o = c[q >> 2] | 0;
                    if (!o) break;
                    m = PB(G, o) | 0;
                    if ((m | 0) < 0 | m >>> 0 > (r - e | 0) >>> 0) break;
                    e = m + e | 0;
                    if (r >>> 0 > e >>> 0) q = q + 4 | 0;
                    else break;
                }
                if ((m | 0) < 0) {
                    j = -1;
                    break a;
                }
                OB(d, 32, k, e, u);
                if (!e) {
                    e = 0;
                    w = 84;
                } else {
                    o = 0;
                    while(true){
                        m = c[n >> 2] | 0;
                        if (!m) {
                            w = 84;
                            break f;
                        }
                        m = PB(G, m) | 0;
                        o = m + o | 0;
                        if ((o | 0) > (e | 0)) {
                            w = 84;
                            break f;
                        }
                        GB(d, G, m);
                        if (o >>> 0 >= e >>> 0) {
                            w = 84;
                            break;
                        } else n = n + 4 | 0;
                    }
                }
            }
            while (0)
            if ((w | 0) == 67) {
                w = 0;
                n = (e | 0) != 0 | (n | 0) != 0;
                u = (m | 0) != 0 | n;
                n = ((n ^ 1) & 1) + (z - r) | 0;
                e = u ? r : y;
                r = y;
                n = u ? (m | 0) > (n | 0) ? m : n : m;
                m = (m | 0) > -1 ? s & -65537 : s;
            } else if ((w | 0) == 84) {
                w = 0;
                OB(d, 32, k, e, u ^ 8192);
                k = (k | 0) > (e | 0) ? k : e;
                e = v;
                continue;
            }
            t = r - e | 0;
            s = (n | 0) < (t | 0) ? t : n;
            u = s + o | 0;
            k = (k | 0) < (u | 0) ? u : k;
            OB(d, 32, k, u, m);
            GB(d, q, o);
            OB(d, 48, k, u, m ^ 65536);
            OB(d, 48, s, t, 0);
            GB(d, e, t);
            OB(d, 32, k, u, m ^ 8192);
            e = v;
        }
        g: do if ((w | 0) == 87) {
            if (!d) {
                if (!p) j = 0;
                else {
                    j = 1;
                    while(true){
                        e = c[i + (j << 2) >> 2] | 0;
                        if (!e) break;
                        IB(g + (j << 3) | 0, e, f);
                        j = j + 1 | 0;
                        if ((j | 0) >= 10) {
                            j = 1;
                            break g;
                        }
                    }
                    while(true){
                        if (c[i + (j << 2) >> 2] | 0) {
                            j = -1;
                            break g;
                        }
                        j = j + 1 | 0;
                        if ((j | 0) >= 10) {
                            j = 1;
                            break;
                        }
                    }
                }
            }
        }
        while (0)
        l = H;
        return j | 0;
    }
    function EB(a) {
        a = a | 0;
        return 0;
    }
    function FB(a) {
        a = a | 0;
        return;
    }
    function GB(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        if (!(c[a >> 2] & 32)) aC(b, d, a);
        return;
    }
    function HB(b) {
        b = b | 0;
        var d = 0, e = 0, f = 0;
        e = c[b >> 2] | 0;
        f = (a[e >> 0] | 0) + -48 | 0;
        if (f >>> 0 < 10) {
            d = 0;
            do {
                d = f + (d * 10 | 0) | 0;
                e = e + 1 | 0;
                c[b >> 2] = e;
                f = (a[e >> 0] | 0) + -48 | 0;
            }while (f >>> 0 < 10)
        } else d = 0;
        return d | 0;
    }
    function IB(a, b, d) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        var e = 0, f = 0, g = 0.0;
        a: if (b >>> 0 <= 20) switch(b | 0){
            case 9:
                e = (c[d >> 2] | 0) + 3 & -4;
                b = c[e >> 2] | 0;
                c[d >> 2] = e + 4;
                c[a >> 2] = b;
                break a;
            case 10:
                e = (c[d >> 2] | 0) + 3 & -4;
                b = c[e >> 2] | 0;
                c[d >> 2] = e + 4;
                e = a;
                c[e >> 2] = b;
                c[e + 4 >> 2] = ((b | 0) < 0) << 31 >> 31;
                break a;
            case 11:
                e = (c[d >> 2] | 0) + 3 & -4;
                b = c[e >> 2] | 0;
                c[d >> 2] = e + 4;
                e = a;
                c[e >> 2] = b;
                c[e + 4 >> 2] = 0;
                break a;
            case 12:
                e = (c[d >> 2] | 0) + 7 & -8;
                b = e;
                f = c[b >> 2] | 0;
                b = c[b + 4 >> 2] | 0;
                c[d >> 2] = e + 8;
                e = a;
                c[e >> 2] = f;
                c[e + 4 >> 2] = b;
                break a;
            case 13:
                f = (c[d >> 2] | 0) + 3 & -4;
                e = c[f >> 2] | 0;
                c[d >> 2] = f + 4;
                e = (e & 65535) << 16 >> 16;
                f = a;
                c[f >> 2] = e;
                c[f + 4 >> 2] = ((e | 0) < 0) << 31 >> 31;
                break a;
            case 14:
                f = (c[d >> 2] | 0) + 3 & -4;
                e = c[f >> 2] | 0;
                c[d >> 2] = f + 4;
                f = a;
                c[f >> 2] = e & 65535;
                c[f + 4 >> 2] = 0;
                break a;
            case 15:
                f = (c[d >> 2] | 0) + 3 & -4;
                e = c[f >> 2] | 0;
                c[d >> 2] = f + 4;
                e = (e & 255) << 24 >> 24;
                f = a;
                c[f >> 2] = e;
                c[f + 4 >> 2] = ((e | 0) < 0) << 31 >> 31;
                break a;
            case 16:
                f = (c[d >> 2] | 0) + 3 & -4;
                e = c[f >> 2] | 0;
                c[d >> 2] = f + 4;
                f = a;
                c[f >> 2] = e & 255;
                c[f + 4 >> 2] = 0;
                break a;
            case 17:
                f = (c[d >> 2] | 0) + 7 & -8;
                g = +h[f >> 3];
                c[d >> 2] = f + 8;
                h[a >> 3] = g;
                break a;
            case 18:
                f = (c[d >> 2] | 0) + 7 & -8;
                g = +h[f >> 3];
                c[d >> 2] = f + 8;
                h[a >> 3] = g;
                break a;
            default:
                break a;
        }
        return;
    }
    function JB(b, c, e, f) {
        b = b | 0;
        c = c | 0;
        e = e | 0;
        f = f | 0;
        if (!((b | 0) == 0 & (c | 0) == 0)) do {
            e = e + -1 | 0;
            a[e >> 0] = d[5694 + (b & 15) >> 0] | 0 | f;
            b = AC(b | 0, c | 0, 4) | 0;
            c = A;
        }while (!((b | 0) == 0 & (c | 0) == 0))
        return e | 0;
    }
    function KB(b, c, d) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        if (!((b | 0) == 0 & (c | 0) == 0)) do {
            d = d + -1 | 0;
            a[d >> 0] = b & 7 | 48;
            b = AC(b | 0, c | 0, 3) | 0;
            c = A;
        }while (!((b | 0) == 0 & (c | 0) == 0))
        return d | 0;
    }
    function LB(b, c, d) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        if (c >>> 0 > 0 | (c | 0) == 0 & b >>> 0 > 4294967295) {
            while(true){
                e = HC(b | 0, c | 0, 10, 0) | 0;
                d = d + -1 | 0;
                a[d >> 0] = e & 255 | 48;
                e = b;
                b = EC(b | 0, c | 0, 10, 0) | 0;
                if (!(c >>> 0 > 9 | (c | 0) == 9 & e >>> 0 > 4294967295)) break;
                else c = A;
            }
            c = b;
        } else c = b;
        if (c) while(true){
            d = d + -1 | 0;
            a[d >> 0] = (c >>> 0) % 10 | 48;
            if (c >>> 0 < 10) break;
            else c = (c >>> 0) / 10 | 0;
        }
        return d | 0;
    }
    function MB(a) {
        a = a | 0;
        return XB(a, c[(WB() | 0) + 188 >> 2] | 0) | 0;
    }
    function NB(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0;
        h = d & 255;
        f = (e | 0) != 0;
        a: do if (f & (b & 3 | 0) != 0) {
            g = d & 255;
            while(true){
                if ((a[b >> 0] | 0) == g << 24 >> 24) {
                    i = 6;
                    break a;
                }
                b = b + 1 | 0;
                e = e + -1 | 0;
                f = (e | 0) != 0;
                if (!(f & (b & 3 | 0) != 0)) {
                    i = 5;
                    break;
                }
            }
        } else i = 5;
        while (0)
        if ((i | 0) == 5) {
            if (f) i = 6;
            else e = 0;
        }
        b: do if ((i | 0) == 6) {
            g = d & 255;
            if ((a[b >> 0] | 0) != g << 24 >> 24) {
                f = P(h, 16843009) | 0;
                c: do if (e >>> 0 > 3) while(true){
                    h = c[b >> 2] ^ f;
                    if ((h & -2139062144 ^ -2139062144) & h + -16843009 | 0) break;
                    b = b + 4 | 0;
                    e = e + -4 | 0;
                    if (e >>> 0 <= 3) {
                        i = 11;
                        break c;
                    }
                }
                else i = 11;
                while (0)
                if ((i | 0) == 11) {
                    if (!e) {
                        e = 0;
                        break;
                    }
                }
                while(true){
                    if ((a[b >> 0] | 0) == g << 24 >> 24) break b;
                    b = b + 1 | 0;
                    e = e + -1 | 0;
                    if (!e) {
                        e = 0;
                        break;
                    }
                }
            }
        }
        while (0)
        return (e | 0 ? b : 0) | 0;
    }
    function OB(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = l;
        l = l + 256 | 0;
        f = g;
        if ((c | 0) > (d | 0) & (e & 73728 | 0) == 0) {
            e = c - d | 0;
            yC(f | 0, b | 0, (e >>> 0 < 256 ? e : 256) | 0);
            if (e >>> 0 > 255) {
                b = c - d | 0;
                do {
                    GB(a, f, 256);
                    e = e + -256 | 0;
                }while (e >>> 0 > 255)
                e = b & 255;
            }
            GB(a, f, e);
        }
        l = g;
        return;
    }
    function PB(a, b) {
        a = a | 0;
        b = b | 0;
        if (!a) a = 0;
        else a = UB(a, b, 0) | 0;
        return a | 0;
    }
    function QB(b, e, f, g, h, i) {
        b = b | 0;
        e = +e;
        f = f | 0;
        g = g | 0;
        h = h | 0;
        i = i | 0;
        var j = 0, k = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0.0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
        H = l;
        l = l + 560 | 0;
        m = H + 8 | 0;
        u = H;
        G = H + 524 | 0;
        F = G;
        n = H + 512 | 0;
        c[u >> 2] = 0;
        E = n + 12 | 0;
        RB(e);
        if ((A | 0) < 0) {
            e = -e;
            C = 1;
            B = 5659;
        } else {
            C = (h & 2049 | 0) != 0 & 1;
            B = (h & 2048 | 0) == 0 ? (h & 1 | 0) == 0 ? 5660 : 5665 : 5662;
        }
        RB(e);
        D = A & 2146435072;
        do if (D >>> 0 < 2146435072 | (D | 0) == 2146435072 & false) {
            r = +SB(e, u) * 2.0;
            j = r != 0.0;
            if (j) c[u >> 2] = (c[u >> 2] | 0) + -1;
            w = i | 32;
            if ((w | 0) == 97) {
                s = i & 32;
                q = (s | 0) == 0 ? B : B + 9 | 0;
                p = C | 2;
                j = 12 - g | 0;
                do if (!(g >>> 0 > 11 | (j | 0) == 0)) {
                    e = 8.0;
                    do {
                        j = j + -1 | 0;
                        e = e * 16.0;
                    }while ((j | 0) != 0)
                    if ((a[q >> 0] | 0) == 45) {
                        e = -(e + (-r - e));
                        break;
                    } else {
                        e = r + e - e;
                        break;
                    }
                } else e = r;
                while (0)
                k = c[u >> 2] | 0;
                j = (k | 0) < 0 ? 0 - k | 0 : k;
                j = LB(j, ((j | 0) < 0) << 31 >> 31, E) | 0;
                if ((j | 0) == (E | 0)) {
                    j = n + 11 | 0;
                    a[j >> 0] = 48;
                }
                a[j + -1 >> 0] = (k >> 31 & 2) + 43;
                o = j + -2 | 0;
                a[o >> 0] = i + 15;
                n = (g | 0) < 1;
                m = (h & 8 | 0) == 0;
                j = G;
                do {
                    D = ~~e;
                    k = j + 1 | 0;
                    a[j >> 0] = d[5694 + D >> 0] | s;
                    e = (e - +(D | 0)) * 16.0;
                    if ((k - F | 0) == 1 ? !(m & (n & e == 0.0)) : 0) {
                        a[k >> 0] = 46;
                        j = j + 2 | 0;
                    } else j = k;
                }while (e != 0.0)
                D = j - F | 0;
                F = E - o | 0;
                E = (g | 0) != 0 & (D + -2 | 0) < (g | 0) ? g + 2 | 0 : D;
                j = F + p + E | 0;
                OB(b, 32, f, j, h);
                GB(b, q, p);
                OB(b, 48, f, j, h ^ 65536);
                GB(b, G, D);
                OB(b, 48, E - D | 0, 0, 0);
                GB(b, o, F);
                OB(b, 32, f, j, h ^ 8192);
                break;
            }
            k = (g | 0) < 0 ? 6 : g;
            if (j) {
                j = (c[u >> 2] | 0) + -28 | 0;
                c[u >> 2] = j;
                e = r * 268435456.0;
            } else {
                e = r;
                j = c[u >> 2] | 0;
            }
            D = (j | 0) < 0 ? m : m + 288 | 0;
            m = D;
            do {
                y = ~~e >>> 0;
                c[m >> 2] = y;
                m = m + 4 | 0;
                e = (e - +(y >>> 0)) * 1.0e9;
            }while (e != 0.0)
            if ((j | 0) > 0) {
                n = D;
                p = m;
                while(true){
                    o = (j | 0) < 29 ? j : 29;
                    j = p + -4 | 0;
                    if (j >>> 0 >= n >>> 0) {
                        m = 0;
                        do {
                            x = zC(c[j >> 2] | 0, 0, o | 0) | 0;
                            x = xC(x | 0, A | 0, m | 0, 0) | 0;
                            y = A;
                            v = HC(x | 0, y | 0, 1e9, 0) | 0;
                            c[j >> 2] = v;
                            m = EC(x | 0, y | 0, 1e9, 0) | 0;
                            j = j + -4 | 0;
                        }while (j >>> 0 >= n >>> 0)
                        if (m) {
                            n = n + -4 | 0;
                            c[n >> 2] = m;
                        }
                    }
                    m = p;
                    while(true){
                        if (m >>> 0 <= n >>> 0) break;
                        j = m + -4 | 0;
                        if (!(c[j >> 2] | 0)) m = j;
                        else break;
                    }
                    j = (c[u >> 2] | 0) - o | 0;
                    c[u >> 2] = j;
                    if ((j | 0) > 0) p = m;
                    else break;
                }
            } else n = D;
            if ((j | 0) < 0) {
                g = ((k + 25 | 0) / 9 | 0) + 1 | 0;
                t = (w | 0) == 102;
                do {
                    s = 0 - j | 0;
                    s = (s | 0) < 9 ? s : 9;
                    if (n >>> 0 < m >>> 0) {
                        o = (1 << s) + -1 | 0;
                        p = 1e9 >>> s;
                        q = 0;
                        j = n;
                        do {
                            y = c[j >> 2] | 0;
                            c[j >> 2] = (y >>> s) + q;
                            q = P(y & o, p) | 0;
                            j = j + 4 | 0;
                        }while (j >>> 0 < m >>> 0)
                        j = (c[n >> 2] | 0) == 0 ? n + 4 | 0 : n;
                        if (!q) {
                            n = j;
                            j = m;
                        } else {
                            c[m >> 2] = q;
                            n = j;
                            j = m + 4 | 0;
                        }
                    } else {
                        n = (c[n >> 2] | 0) == 0 ? n + 4 | 0 : n;
                        j = m;
                    }
                    m = t ? D : n;
                    m = (j - m >> 2 | 0) > (g | 0) ? m + (g << 2) | 0 : j;
                    j = (c[u >> 2] | 0) + s | 0;
                    c[u >> 2] = j;
                }while ((j | 0) < 0)
                j = n;
                g = m;
            } else {
                j = n;
                g = m;
            }
            y = D;
            if (j >>> 0 < g >>> 0) {
                m = (y - j >> 2) * 9 | 0;
                o = c[j >> 2] | 0;
                if (o >>> 0 >= 10) {
                    n = 10;
                    do {
                        n = n * 10 | 0;
                        m = m + 1 | 0;
                    }while (o >>> 0 >= n >>> 0)
                }
            } else m = 0;
            t = (w | 0) == 103;
            v = (k | 0) != 0;
            n = k - ((w | 0) != 102 ? m : 0) + ((v & t) << 31 >> 31) | 0;
            if ((n | 0) < (((g - y >> 2) * 9 | 0) + -9 | 0)) {
                n = n + 9216 | 0;
                s = D + 4 + (((n | 0) / 9 | 0) + -1024 << 2) | 0;
                n = ((n | 0) % 9 | 0) + 1 | 0;
                if ((n | 0) < 9) {
                    o = 10;
                    do {
                        o = o * 10 | 0;
                        n = n + 1 | 0;
                    }while ((n | 0) != 9)
                } else o = 10;
                p = c[s >> 2] | 0;
                q = (p >>> 0) % (o >>> 0) | 0;
                n = (s + 4 | 0) == (g | 0);
                if (!(n & (q | 0) == 0)) {
                    r = (((p >>> 0) / (o >>> 0) | 0) & 1 | 0) == 0 ? 9007199254740992.0 : 9007199254740994.0;
                    x = (o | 0) / 2 | 0;
                    e = q >>> 0 < x >>> 0 ? 0.5 : n & (q | 0) == (x | 0) ? 1.0 : 1.5;
                    if (C) {
                        x = (a[B >> 0] | 0) == 45;
                        e = x ? -e : e;
                        r = x ? -r : r;
                    }
                    n = p - q | 0;
                    c[s >> 2] = n;
                    if (r + e != r) {
                        x = n + o | 0;
                        c[s >> 2] = x;
                        if (x >>> 0 > 999999999) {
                            m = s;
                            while(true){
                                n = m + -4 | 0;
                                c[m >> 2] = 0;
                                if (n >>> 0 < j >>> 0) {
                                    j = j + -4 | 0;
                                    c[j >> 2] = 0;
                                }
                                x = (c[n >> 2] | 0) + 1 | 0;
                                c[n >> 2] = x;
                                if (x >>> 0 > 999999999) m = n;
                                else break;
                            }
                        } else n = s;
                        m = (y - j >> 2) * 9 | 0;
                        p = c[j >> 2] | 0;
                        if (p >>> 0 >= 10) {
                            o = 10;
                            do {
                                o = o * 10 | 0;
                                m = m + 1 | 0;
                            }while (p >>> 0 >= o >>> 0)
                        }
                    } else n = s;
                } else n = s;
                n = n + 4 | 0;
                n = g >>> 0 > n >>> 0 ? n : g;
                x = j;
            } else {
                n = g;
                x = j;
            }
            w = n;
            while(true){
                if (w >>> 0 <= x >>> 0) {
                    u = 0;
                    break;
                }
                j = w + -4 | 0;
                if (!(c[j >> 2] | 0)) w = j;
                else {
                    u = 1;
                    break;
                }
            }
            g = 0 - m | 0;
            do if (t) {
                j = ((v ^ 1) & 1) + k | 0;
                if ((j | 0) > (m | 0) & (m | 0) > -5) {
                    o = i + -1 | 0;
                    k = j + -1 - m | 0;
                } else {
                    o = i + -2 | 0;
                    k = j + -1 | 0;
                }
                j = h & 8;
                if (!j) {
                    if (u ? (z = c[w + -4 >> 2] | 0, (z | 0) != 0) : 0) {
                        if (!((z >>> 0) % 10 | 0)) {
                            n = 0;
                            j = 10;
                            do {
                                j = j * 10 | 0;
                                n = n + 1 | 0;
                            }while (!((z >>> 0) % (j >>> 0) | 0))
                        } else n = 0;
                    } else n = 9;
                    j = ((w - y >> 2) * 9 | 0) + -9 | 0;
                    if ((o | 32) == 102) {
                        s = j - n | 0;
                        s = (s | 0) > 0 ? s : 0;
                        k = (k | 0) < (s | 0) ? k : s;
                        s = 0;
                        break;
                    } else {
                        s = j + m - n | 0;
                        s = (s | 0) > 0 ? s : 0;
                        k = (k | 0) < (s | 0) ? k : s;
                        s = 0;
                        break;
                    }
                } else s = j;
            } else {
                o = i;
                s = h & 8;
            }
            while (0)
            t = k | s;
            p = (t | 0) != 0 & 1;
            q = (o | 32) == 102;
            if (q) {
                v = 0;
                j = (m | 0) > 0 ? m : 0;
            } else {
                j = (m | 0) < 0 ? g : m;
                j = LB(j, ((j | 0) < 0) << 31 >> 31, E) | 0;
                n = E;
                if ((n - j | 0) < 2) do {
                    j = j + -1 | 0;
                    a[j >> 0] = 48;
                }while ((n - j | 0) < 2)
                a[j + -1 >> 0] = (m >> 31 & 2) + 43;
                j = j + -2 | 0;
                a[j >> 0] = o;
                v = j;
                j = n - j | 0;
            }
            j = C + 1 + k + p + j | 0;
            OB(b, 32, f, j, h);
            GB(b, B, C);
            OB(b, 48, f, j, h ^ 65536);
            if (q) {
                o = x >>> 0 > D >>> 0 ? D : x;
                s = G + 9 | 0;
                p = s;
                q = G + 8 | 0;
                n = o;
                do {
                    m = LB(c[n >> 2] | 0, 0, s) | 0;
                    if ((n | 0) == (o | 0)) {
                        if ((m | 0) == (s | 0)) {
                            a[q >> 0] = 48;
                            m = q;
                        }
                    } else if (m >>> 0 > G >>> 0) {
                        yC(G | 0, 48, m - F | 0);
                        do m = m + -1 | 0;
                        while (m >>> 0 > G >>> 0)
                    }
                    GB(b, m, p - m | 0);
                    n = n + 4 | 0;
                }while (n >>> 0 <= D >>> 0)
                if (t | 0) GB(b, 5710, 1);
                if (n >>> 0 < w >>> 0 & (k | 0) > 0) while(true){
                    m = LB(c[n >> 2] | 0, 0, s) | 0;
                    if (m >>> 0 > G >>> 0) {
                        yC(G | 0, 48, m - F | 0);
                        do m = m + -1 | 0;
                        while (m >>> 0 > G >>> 0)
                    }
                    GB(b, m, (k | 0) < 9 ? k : 9);
                    n = n + 4 | 0;
                    m = k + -9 | 0;
                    if (!(n >>> 0 < w >>> 0 & (k | 0) > 9)) {
                        k = m;
                        break;
                    } else k = m;
                }
                OB(b, 48, k + 9 | 0, 9, 0);
            } else {
                t = u ? w : x + 4 | 0;
                if ((k | 0) > -1) {
                    u = G + 9 | 0;
                    s = (s | 0) == 0;
                    g = u;
                    p = 0 - F | 0;
                    q = G + 8 | 0;
                    o = x;
                    do {
                        m = LB(c[o >> 2] | 0, 0, u) | 0;
                        if ((m | 0) == (u | 0)) {
                            a[q >> 0] = 48;
                            m = q;
                        }
                        do if ((o | 0) == (x | 0)) {
                            n = m + 1 | 0;
                            GB(b, m, 1);
                            if (s & (k | 0) < 1) {
                                m = n;
                                break;
                            }
                            GB(b, 5710, 1);
                            m = n;
                        } else {
                            if (m >>> 0 <= G >>> 0) break;
                            yC(G | 0, 48, m + p | 0);
                            do m = m + -1 | 0;
                            while (m >>> 0 > G >>> 0)
                        }
                        while (0)
                        F = g - m | 0;
                        GB(b, m, (k | 0) > (F | 0) ? F : k);
                        k = k - F | 0;
                        o = o + 4 | 0;
                    }while (o >>> 0 < t >>> 0 & (k | 0) > -1)
                }
                OB(b, 48, k + 18 | 0, 18, 0);
                GB(b, v, E - v | 0);
            }
            OB(b, 32, f, j, h ^ 8192);
        } else {
            G = (i & 32 | 0) != 0;
            j = C + 3 | 0;
            OB(b, 32, f, j, h & -65537);
            GB(b, B, C);
            GB(b, e != e | false ? G ? 5686 : 5690 : G ? 5678 : 5682, 3);
            OB(b, 32, f, j, h ^ 8192);
        }
        while (0)
        l = H;
        return ((j | 0) < (f | 0) ? f : j) | 0;
    }
    function RB(a) {
        a = +a;
        var b = 0;
        h[j >> 3] = a;
        b = c[j >> 2] | 0;
        A = c[j + 4 >> 2] | 0;
        return b | 0;
    }
    function SB(a, b) {
        a = +a;
        b = b | 0;
        return + +TB(a, b);
    }
    function TB(a, b) {
        a = +a;
        b = b | 0;
        var d = 0, e = 0, f = 0;
        h[j >> 3] = a;
        d = c[j >> 2] | 0;
        e = c[j + 4 >> 2] | 0;
        f = AC(d | 0, e | 0, 52) | 0;
        switch(f & 2047){
            case 0:
                if (a != 0.0) {
                    a = +TB(a * 18446744073709551616.0, b);
                    d = (c[b >> 2] | 0) + -64 | 0;
                } else d = 0;
                c[b >> 2] = d;
                break;
            case 2047:
                break;
            default:
                c[b >> 2] = (f & 2047) + -1022;
                c[j >> 2] = d;
                c[j + 4 >> 2] = e & -2146435073 | 1071644672;
                a = +h[j >> 3];
        }
        return +a;
    }
    function UB(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        do if (b) {
            if (d >>> 0 < 128) {
                a[b >> 0] = d;
                b = 1;
                break;
            }
            if (!(c[c[(VB() | 0) + 188 >> 2] >> 2] | 0)) {
                if ((d & -128 | 0) == 57216) {
                    a[b >> 0] = d;
                    b = 1;
                    break;
                } else {
                    c[(vB() | 0) >> 2] = 84;
                    b = -1;
                    break;
                }
            }
            if (d >>> 0 < 2048) {
                a[b >> 0] = d >>> 6 | 192;
                a[b + 1 >> 0] = d & 63 | 128;
                b = 2;
                break;
            }
            if (d >>> 0 < 55296 | (d & -8192 | 0) == 57344) {
                a[b >> 0] = d >>> 12 | 224;
                a[b + 1 >> 0] = d >>> 6 & 63 | 128;
                a[b + 2 >> 0] = d & 63 | 128;
                b = 3;
                break;
            }
            if ((d + -65536 | 0) >>> 0 < 1048576) {
                a[b >> 0] = d >>> 18 | 240;
                a[b + 1 >> 0] = d >>> 12 & 63 | 128;
                a[b + 2 >> 0] = d >>> 6 & 63 | 128;
                a[b + 3 >> 0] = d & 63 | 128;
                b = 4;
                break;
            } else {
                c[(vB() | 0) >> 2] = 84;
                b = -1;
                break;
            }
        } else b = 1;
        while (0)
        return b | 0;
    }
    function VB() {
        return xB() | 0;
    }
    function WB() {
        return xB() | 0;
    }
    function XB(b, e) {
        b = b | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = 0;
        while(true){
            if ((d[5712 + g >> 0] | 0) == (b | 0)) {
                b = 2;
                break;
            }
            f = g + 1 | 0;
            if ((f | 0) == 87) {
                f = 5800;
                g = 87;
                b = 5;
                break;
            } else g = f;
        }
        if ((b | 0) == 2) {
            if (!g) f = 5800;
            else {
                f = 5800;
                b = 5;
            }
        }
        if ((b | 0) == 5) while(true){
            do {
                b = f;
                f = f + 1 | 0;
            }while ((a[b >> 0] | 0) != 0)
            g = g + -1 | 0;
            if (!g) break;
            else b = 5;
        }
        return YB(f, c[e + 20 >> 2] | 0) | 0;
    }
    function YB(a, b) {
        a = a | 0;
        b = b | 0;
        return ZB(a, b) | 0;
    }
    function ZB(a, b) {
        a = a | 0;
        b = b | 0;
        if (!b) b = 0;
        else b = _B(c[b >> 2] | 0, c[b + 4 >> 2] | 0, a) | 0;
        return (b | 0 ? b : a) | 0;
    }
    function _B(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0;
        o = (c[b >> 2] | 0) + 1794895138 | 0;
        h = $B(c[b + 8 >> 2] | 0, o) | 0;
        f = $B(c[b + 12 >> 2] | 0, o) | 0;
        g = $B(c[b + 16 >> 2] | 0, o) | 0;
        a: do if ((h >>> 0 < d >>> 2 >>> 0 ? (n = d - (h << 2) | 0, f >>> 0 < n >>> 0 & g >>> 0 < n >>> 0) : 0) ? ((g | f) & 3 | 0) == 0 : 0) {
            n = f >>> 2;
            m = g >>> 2;
            l = 0;
            while(true){
                j = h >>> 1;
                k = l + j | 0;
                i = k << 1;
                g = i + n | 0;
                f = $B(c[b + (g << 2) >> 2] | 0, o) | 0;
                g = $B(c[b + (g + 1 << 2) >> 2] | 0, o) | 0;
                if (!(g >>> 0 < d >>> 0 & f >>> 0 < (d - g | 0) >>> 0)) {
                    f = 0;
                    break a;
                }
                if (a[b + (g + f) >> 0] | 0) {
                    f = 0;
                    break a;
                }
                f = AB(e, b + g | 0) | 0;
                if (!f) break;
                f = (f | 0) < 0;
                if ((h | 0) == 1) {
                    f = 0;
                    break a;
                } else {
                    l = f ? l : k;
                    h = f ? j : h - j | 0;
                }
            }
            f = i + m | 0;
            g = $B(c[b + (f << 2) >> 2] | 0, o) | 0;
            f = $B(c[b + (f + 1 << 2) >> 2] | 0, o) | 0;
            if (f >>> 0 < d >>> 0 & g >>> 0 < (d - f | 0) >>> 0) f = (a[b + (f + g) >> 0] | 0) == 0 ? b + f | 0 : 0;
            else f = 0;
        } else f = 0;
        while (0)
        return f | 0;
    }
    function $B(a, b) {
        a = a | 0;
        b = b | 0;
        var c = 0;
        c = IC(a | 0) | 0;
        return ((b | 0) == 0 ? a : c) | 0;
    }
    function aC(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0, j = 0;
        f = e + 16 | 0;
        g = c[f >> 2] | 0;
        if (!g) {
            if (!(bC(e) | 0)) {
                g = c[f >> 2] | 0;
                h = 5;
            } else f = 0;
        } else h = 5;
        a: do if ((h | 0) == 5) {
            j = e + 20 | 0;
            i = c[j >> 2] | 0;
            f = i;
            if ((g - i | 0) >>> 0 < d >>> 0) {
                f = sb[c[e + 36 >> 2] & 7](e, b, d) | 0;
                break;
            }
            b: do if ((a[e + 75 >> 0] | 0) > -1) {
                i = d;
                while(true){
                    if (!i) {
                        h = 0;
                        g = b;
                        break b;
                    }
                    g = i + -1 | 0;
                    if ((a[b + g >> 0] | 0) == 10) break;
                    else i = g;
                }
                f = sb[c[e + 36 >> 2] & 7](e, b, i) | 0;
                if (f >>> 0 < i >>> 0) break a;
                h = i;
                g = b + i | 0;
                d = d - i | 0;
                f = c[j >> 2] | 0;
            } else {
                h = 0;
                g = b;
            }
            while (0)
            BC(f | 0, g | 0, d | 0);
            c[j >> 2] = (c[j >> 2] | 0) + d;
            f = h + d | 0;
        }
        while (0)
        return f | 0;
    }
    function bC(b) {
        b = b | 0;
        var d = 0, e = 0;
        d = b + 74 | 0;
        e = a[d >> 0] | 0;
        a[d >> 0] = e + 255 | e;
        d = c[b >> 2] | 0;
        if (!(d & 8)) {
            c[b + 8 >> 2] = 0;
            c[b + 4 >> 2] = 0;
            e = c[b + 44 >> 2] | 0;
            c[b + 28 >> 2] = e;
            c[b + 20 >> 2] = e;
            c[b + 16 >> 2] = e + (c[b + 48 >> 2] | 0);
            b = 0;
        } else {
            c[b >> 2] = d | 32;
            b = -1;
        }
        return b | 0;
    }
    function cC(a, b) {
        a = T(a);
        b = T(b);
        var c = 0, d = 0;
        c = dC(a) | 0;
        do if ((c & 2147483647) >>> 0 <= 2139095040) {
            d = dC(b) | 0;
            if ((d & 2147483647) >>> 0 <= 2139095040) {
                if ((d ^ c | 0) < 0) {
                    a = (c | 0) < 0 ? b : a;
                    break;
                } else {
                    a = a < b ? b : a;
                    break;
                }
            }
        } else a = b;
        while (0)
        return T(a);
    }
    function dC(a) {
        a = T(a);
        return (g[j >> 2] = a, c[j >> 2] | 0) | 0;
    }
    function eC(a, b) {
        a = T(a);
        b = T(b);
        var c = 0, d = 0;
        c = fC(a) | 0;
        do if ((c & 2147483647) >>> 0 <= 2139095040) {
            d = fC(b) | 0;
            if ((d & 2147483647) >>> 0 <= 2139095040) {
                if ((d ^ c | 0) < 0) {
                    a = (c | 0) < 0 ? a : b;
                    break;
                } else {
                    a = a < b ? a : b;
                    break;
                }
            }
        } else a = b;
        while (0)
        return T(a);
    }
    function fC(a) {
        a = T(a);
        return (g[j >> 2] = a, c[j >> 2] | 0) | 0;
    }
    function gC(a, b) {
        a = T(a);
        b = T(b);
        var d = 0, e = 0, f = 0, h = 0, i = 0, k = 0, l = 0, m = 0;
        h = (g[j >> 2] = a, c[j >> 2] | 0);
        k = (g[j >> 2] = b, c[j >> 2] | 0);
        d = h >>> 23 & 255;
        i = k >>> 23 & 255;
        l = h & -2147483648;
        f = k << 1;
        a: do if ((f | 0) != 0 ? !((d | 0) == 255 | ((hC(b) | 0) & 2147483647) >>> 0 > 2139095040) : 0) {
            e = h << 1;
            if (e >>> 0 <= f >>> 0) {
                b = T(a * T(0.0));
                return T((e | 0) == (f | 0) ? b : a);
            }
            if (!d) {
                d = h << 9;
                if ((d | 0) > -1) {
                    e = d;
                    d = 0;
                    do {
                        d = d + -1 | 0;
                        e = e << 1;
                    }while ((e | 0) > -1)
                } else d = 0;
                e = h << 1 - d;
            } else e = h & 8388607 | 8388608;
            if (!i) {
                h = k << 9;
                if ((h | 0) > -1) {
                    f = 0;
                    do {
                        f = f + -1 | 0;
                        h = h << 1;
                    }while ((h | 0) > -1)
                } else f = 0;
                i = f;
                k = k << 1 - f;
            } else k = k & 8388607 | 8388608;
            f = e - k | 0;
            h = (f | 0) > -1;
            b: do if ((d | 0) > (i | 0)) {
                while(true){
                    if (h) {
                        if (!f) break;
                        else e = f;
                    }
                    e = e << 1;
                    d = d + -1 | 0;
                    f = e - k | 0;
                    h = (f | 0) > -1;
                    if ((d | 0) <= (i | 0)) break b;
                }
                b = T(a * T(0.0));
                break a;
            }
            while (0)
            if (h) {
                if (!f) {
                    b = T(a * T(0.0));
                    break;
                } else e = f;
            }
            if (e >>> 0 < 8388608) do {
                e = e << 1;
                d = d + -1 | 0;
            }while (e >>> 0 < 8388608)
            if ((d | 0) > 0) d = e + -8388608 | d << 23;
            else d = e >>> (1 - d | 0);
            b = (c[j >> 2] = d | l, T(g[j >> 2]));
        } else m = 3;
        while (0)
        if ((m | 0) == 3) {
            b = T(a * b);
            b = T(b / b);
        }
        return T(b);
    }
    function hC(a) {
        a = T(a);
        return (g[j >> 2] = a, c[j >> 2] | 0) | 0;
    }
    function iC(a, b) {
        a = a | 0;
        b = b | 0;
        return CB(c[582] | 0, a, b) | 0;
    }
    function jC(a) {
        a = a | 0;
        Ta();
    }
    function kC(a) {
        a = a | 0;
        return;
    }
    function lC(a, b) {
        a = a | 0;
        b = b | 0;
        return 0;
    }
    function mC(a) {
        a = a | 0;
        if ((nC(a + 4 | 0) | 0) == -1) {
            nb[c[(c[a >> 2] | 0) + 8 >> 2] & 127](a);
            a = 1;
        } else a = 0;
        return a | 0;
    }
    function nC(a) {
        a = a | 0;
        var b = 0;
        b = c[a >> 2] | 0;
        c[a >> 2] = b + -1;
        return b + -1 | 0;
    }
    function oC(a) {
        a = a | 0;
        if (mC(a) | 0) pC(a);
        return;
    }
    function pC(a) {
        a = a | 0;
        var b = 0;
        b = a + 8 | 0;
        if (!((c[b >> 2] | 0) != 0 ? (nC(b) | 0) != -1 : 0)) nb[c[(c[a >> 2] | 0) + 16 >> 2] & 127](a);
        return;
    }
    function qC(a) {
        a = a | 0;
        var b = 0;
        b = (a | 0) == 0 ? 1 : a;
        while(true){
            a = oB(b) | 0;
            if (a | 0) break;
            a = uC() | 0;
            if (!a) {
                a = 0;
                break;
            }
            Fb[a & 0]();
        }
        return a | 0;
    }
    function rC(a) {
        a = a | 0;
        return qC(a) | 0;
    }
    function sC(a) {
        a = a | 0;
        pB(a);
        return;
    }
    function tC(b) {
        b = b | 0;
        if ((a[b + 11 >> 0] | 0) < 0) sC(c[b >> 2] | 0);
        return;
    }
    function uC() {
        var a = 0;
        a = c[2923] | 0;
        c[2923] = a + 0;
        return a | 0;
    }
    function vC() {}
    function wC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        d = b - d - (c >>> 0 > a >>> 0 | 0) >>> 0;
        return (A = d, a - c >>> 0 | 0) | 0;
    }
    function xC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        c = a + c >>> 0;
        return (A = b + d + (c >>> 0 < a >>> 0 | 0) >>> 0, c | 0) | 0;
    }
    function yC(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0, i = 0;
        h = b + e | 0;
        d = d & 255;
        if ((e | 0) >= 67) {
            while(b & 3){
                a[b >> 0] = d;
                b = b + 1 | 0;
            }
            f = h & -4 | 0;
            g = f - 64 | 0;
            i = d | d << 8 | d << 16 | d << 24;
            while((b | 0) <= (g | 0)){
                c[b >> 2] = i;
                c[b + 4 >> 2] = i;
                c[b + 8 >> 2] = i;
                c[b + 12 >> 2] = i;
                c[b + 16 >> 2] = i;
                c[b + 20 >> 2] = i;
                c[b + 24 >> 2] = i;
                c[b + 28 >> 2] = i;
                c[b + 32 >> 2] = i;
                c[b + 36 >> 2] = i;
                c[b + 40 >> 2] = i;
                c[b + 44 >> 2] = i;
                c[b + 48 >> 2] = i;
                c[b + 52 >> 2] = i;
                c[b + 56 >> 2] = i;
                c[b + 60 >> 2] = i;
                b = b + 64 | 0;
            }
            while((b | 0) < (f | 0)){
                c[b >> 2] = i;
                b = b + 4 | 0;
            }
        }
        while((b | 0) < (h | 0)){
            a[b >> 0] = d;
            b = b + 1 | 0;
        }
        return h - e | 0;
    }
    function zC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if ((c | 0) < 32) {
            A = b << c | (a & (1 << c) - 1 << 32 - c) >>> 32 - c;
            return a << c;
        }
        A = a << c - 32;
        return 0;
    }
    function AC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        if ((c | 0) < 32) {
            A = b >>> c;
            return a >>> c | (b & (1 << c) - 1) << 32 - c;
        }
        A = 0;
        return b >>> c - 32 | 0;
    }
    function BC(b, d, e) {
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0, h = 0;
        if ((e | 0) >= 8192) return Oa(b | 0, d | 0, e | 0) | 0;
        h = b | 0;
        g = b + e | 0;
        if ((b & 3) == (d & 3)) {
            while(b & 3){
                if (!e) return h | 0;
                a[b >> 0] = a[d >> 0] | 0;
                b = b + 1 | 0;
                d = d + 1 | 0;
                e = e - 1 | 0;
            }
            e = g & -4 | 0;
            f = e - 64 | 0;
            while((b | 0) <= (f | 0)){
                c[b >> 2] = c[d >> 2];
                c[b + 4 >> 2] = c[d + 4 >> 2];
                c[b + 8 >> 2] = c[d + 8 >> 2];
                c[b + 12 >> 2] = c[d + 12 >> 2];
                c[b + 16 >> 2] = c[d + 16 >> 2];
                c[b + 20 >> 2] = c[d + 20 >> 2];
                c[b + 24 >> 2] = c[d + 24 >> 2];
                c[b + 28 >> 2] = c[d + 28 >> 2];
                c[b + 32 >> 2] = c[d + 32 >> 2];
                c[b + 36 >> 2] = c[d + 36 >> 2];
                c[b + 40 >> 2] = c[d + 40 >> 2];
                c[b + 44 >> 2] = c[d + 44 >> 2];
                c[b + 48 >> 2] = c[d + 48 >> 2];
                c[b + 52 >> 2] = c[d + 52 >> 2];
                c[b + 56 >> 2] = c[d + 56 >> 2];
                c[b + 60 >> 2] = c[d + 60 >> 2];
                b = b + 64 | 0;
                d = d + 64 | 0;
            }
            while((b | 0) < (e | 0)){
                c[b >> 2] = c[d >> 2];
                b = b + 4 | 0;
                d = d + 4 | 0;
            }
        } else {
            e = g - 4 | 0;
            while((b | 0) < (e | 0)){
                a[b >> 0] = a[d >> 0] | 0;
                a[b + 1 >> 0] = a[d + 1 >> 0] | 0;
                a[b + 2 >> 0] = a[d + 2 >> 0] | 0;
                a[b + 3 >> 0] = a[d + 3 >> 0] | 0;
                b = b + 4 | 0;
                d = d + 4 | 0;
            }
        }
        while((b | 0) < (g | 0)){
            a[b >> 0] = a[d >> 0] | 0;
            b = b + 1 | 0;
            d = d + 1 | 0;
        }
        return h | 0;
    }
    function CC(b) {
        b = b | 0;
        var c = 0;
        c = a[n + (b & 255) >> 0] | 0;
        if ((c | 0) < 8) return c | 0;
        c = a[n + (b >> 8 & 255) >> 0] | 0;
        if ((c | 0) < 8) return c + 8 | 0;
        c = a[n + (b >> 16 & 255) >> 0] | 0;
        if ((c | 0) < 8) return c + 16 | 0;
        return (a[n + (b >>> 24) >> 0] | 0) + 24 | 0;
    }
    function DC(a, b, d, e, f) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        var g = 0, h = 0, i = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
        l = a;
        j = b;
        k = j;
        h = d;
        n = e;
        i = n;
        if (!k) {
            g = (f | 0) != 0;
            if (!i) {
                if (g) {
                    c[f >> 2] = (l >>> 0) % (h >>> 0);
                    c[f + 4 >> 2] = 0;
                }
                n = 0;
                f = (l >>> 0) / (h >>> 0) >>> 0;
                return (A = n, f) | 0;
            } else {
                if (!g) {
                    n = 0;
                    f = 0;
                    return (A = n, f) | 0;
                }
                c[f >> 2] = a | 0;
                c[f + 4 >> 2] = b & 0;
                n = 0;
                f = 0;
                return (A = n, f) | 0;
            }
        }
        g = (i | 0) == 0;
        do if (h) {
            if (!g) {
                g = (S(i | 0) | 0) - (S(k | 0) | 0) | 0;
                if (g >>> 0 <= 31) {
                    m = g + 1 | 0;
                    i = 31 - g | 0;
                    b = g - 31 >> 31;
                    h = m;
                    a = l >>> (m >>> 0) & b | k << i;
                    b = k >>> (m >>> 0) & b;
                    g = 0;
                    i = l << i;
                    break;
                }
                if (!f) {
                    n = 0;
                    f = 0;
                    return (A = n, f) | 0;
                }
                c[f >> 2] = a | 0;
                c[f + 4 >> 2] = j | b & 0;
                n = 0;
                f = 0;
                return (A = n, f) | 0;
            }
            g = h - 1 | 0;
            if (g & h | 0) {
                i = (S(h | 0) | 0) + 33 - (S(k | 0) | 0) | 0;
                p = 64 - i | 0;
                m = 32 - i | 0;
                j = m >> 31;
                o = i - 32 | 0;
                b = o >> 31;
                h = i;
                a = m - 1 >> 31 & k >>> (o >>> 0) | (k << m | l >>> (i >>> 0)) & b;
                b = b & k >>> (i >>> 0);
                g = l << p & j;
                i = (k << p | l >>> (o >>> 0)) & j | l << m & i - 33 >> 31;
                break;
            }
            if (f | 0) {
                c[f >> 2] = g & l;
                c[f + 4 >> 2] = 0;
            }
            if ((h | 0) == 1) {
                o = j | b & 0;
                p = a | 0;
                return (A = o, p) | 0;
            } else {
                p = CC(h | 0) | 0;
                o = k >>> (p >>> 0) | 0;
                p = k << 32 - p | l >>> (p >>> 0) | 0;
                return (A = o, p) | 0;
            }
        } else {
            if (g) {
                if (f | 0) {
                    c[f >> 2] = (k >>> 0) % (h >>> 0);
                    c[f + 4 >> 2] = 0;
                }
                o = 0;
                p = (k >>> 0) / (h >>> 0) >>> 0;
                return (A = o, p) | 0;
            }
            if (!l) {
                if (f | 0) {
                    c[f >> 2] = 0;
                    c[f + 4 >> 2] = (k >>> 0) % (i >>> 0);
                }
                o = 0;
                p = (k >>> 0) / (i >>> 0) >>> 0;
                return (A = o, p) | 0;
            }
            g = i - 1 | 0;
            if (!(g & i)) {
                if (f | 0) {
                    c[f >> 2] = a | 0;
                    c[f + 4 >> 2] = g & k | b & 0;
                }
                o = 0;
                p = k >>> ((CC(i | 0) | 0) >>> 0);
                return (A = o, p) | 0;
            }
            g = (S(i | 0) | 0) - (S(k | 0) | 0) | 0;
            if (g >>> 0 <= 30) {
                b = g + 1 | 0;
                i = 31 - g | 0;
                h = b;
                a = k << i | l >>> (b >>> 0);
                b = k >>> (b >>> 0);
                g = 0;
                i = l << i;
                break;
            }
            if (!f) {
                o = 0;
                p = 0;
                return (A = o, p) | 0;
            }
            c[f >> 2] = a | 0;
            c[f + 4 >> 2] = j | b & 0;
            o = 0;
            p = 0;
            return (A = o, p) | 0;
        }
        while (0)
        if (!h) {
            k = i;
            j = 0;
            i = 0;
        } else {
            m = d | 0;
            l = n | e & 0;
            k = xC(m | 0, l | 0, -1, -1) | 0;
            d = A;
            j = i;
            i = 0;
            do {
                e = j;
                j = g >>> 31 | j << 1;
                g = i | g << 1;
                e = a << 1 | e >>> 31 | 0;
                n = a >>> 31 | b << 1 | 0;
                wC(k | 0, d | 0, e | 0, n | 0);
                p = A;
                o = p >> 31 | ((p | 0) < 0 ? -1 : 0) << 1;
                i = o & 1;
                a = wC(e | 0, n | 0, o & m | 0, (((p | 0) < 0 ? -1 : 0) >> 31 | ((p | 0) < 0 ? -1 : 0) << 1) & l | 0) | 0;
                b = A;
                h = h - 1 | 0;
            }while ((h | 0) != 0)
            k = j;
            j = 0;
        }
        h = 0;
        if (f | 0) {
            c[f >> 2] = a;
            c[f + 4 >> 2] = b;
        }
        o = (g | 0) >>> 31 | (k | h) << 1 | (h << 1 | g >>> 31) & 0 | j;
        p = (g << 1 | 0) & -2 | i;
        return (A = o, p) | 0;
    }
    function EC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        return DC(a, b, c, d, 0) | 0;
    }
    function FC(a) {
        a = a | 0;
        var b = 0, d = 0;
        d = a + 15 & -16 | 0;
        b = c[i >> 2] | 0;
        a = b + d | 0;
        if ((d | 0) > 0 & (a | 0) < (b | 0) | (a | 0) < 0) {
            Y();
            Qa(12);
            return -1;
        }
        c[i >> 2] = a;
        if ((a | 0) > (X() | 0) ? (W() | 0) == 0 : 0) {
            c[i >> 2] = b;
            Qa(12);
            return -1;
        }
        return b | 0;
    }
    function GC(b, c, d) {
        b = b | 0;
        c = c | 0;
        d = d | 0;
        var e = 0;
        if ((c | 0) < (b | 0) & (b | 0) < (c + d | 0)) {
            e = b;
            c = c + d | 0;
            b = b + d | 0;
            while((d | 0) > 0){
                b = b - 1 | 0;
                c = c - 1 | 0;
                d = d - 1 | 0;
                a[b >> 0] = a[c >> 0] | 0;
            }
            b = e;
        } else BC(b, c, d);
        return b | 0;
    }
    function HC(a, b, d, e) {
        a = a | 0;
        b = b | 0;
        d = d | 0;
        e = e | 0;
        var f = 0, g = 0;
        g = l;
        l = l + 16 | 0;
        f = g | 0;
        DC(a, b, d, e, f);
        l = g;
        return (A = c[f + 4 >> 2] | 0, c[f >> 2] | 0) | 0;
    }
    function IC(a) {
        a = a | 0;
        return (a & 255) << 24 | (a >> 8 & 255) << 16 | (a >> 16 & 255) << 8 | a >>> 24 | 0;
    }
    function JC(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        jb[a & 1](b | 0, c | 0, d | 0, e | 0, f | 0);
    }
    function KC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        kb[a & 1](b | 0, T(c));
    }
    function LC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        lb[a & 31](b | 0, +c);
    }
    function MC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        d = T(d);
        return T(mb[a & 0](b | 0, T(c), T(d)));
    }
    function NC(a, b) {
        a = a | 0;
        b = b | 0;
        nb[a & 127](b | 0);
    }
    function OC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        ob[a & 31](b | 0, c | 0);
    }
    function PC(a, b) {
        a = a | 0;
        b = b | 0;
        return pb[a & 31](b | 0) | 0;
    }
    function QC(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        e = e | 0;
        qb[a & 1](b | 0, +c, +d, e | 0);
    }
    function RC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        rb[a & 1](b | 0, +c, +d);
    }
    function SC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        return sb[a & 7](b | 0, c | 0, d | 0) | 0;
    }
    function TC(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        return +tb[a & 1](b | 0, c | 0, d | 0);
    }
    function UC(a, b) {
        a = a | 0;
        b = b | 0;
        return +ub[a & 15](b | 0);
    }
    function VC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        return vb[a & 1](b | 0, +c) | 0;
    }
    function WC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        return wb[a & 15](b | 0, c | 0) | 0;
    }
    function XC(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        e = +e;
        f = f | 0;
        xb[a & 1](b | 0, c | 0, +d, +e, f | 0);
    }
    function YC(a, b, c, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        g = g | 0;
        yb[a & 1](b | 0, c | 0, d | 0, e | 0, f | 0, g | 0);
    }
    function ZC(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        return +zb[a & 7](b | 0, c | 0);
    }
    function _C(a) {
        a = a | 0;
        return Ab[a & 7]() | 0;
    }
    function $C(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        return Bb[a & 1](b | 0, c | 0, d | 0, e | 0, f | 0) | 0;
    }
    function aD(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = +e;
        Cb[a & 1](b | 0, c | 0, d | 0, +e);
    }
    function bD(a, b, c, d, e, f, g) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = T(d);
        e = e | 0;
        f = T(f);
        g = g | 0;
        Db[a & 1](b | 0, c | 0, T(d), e | 0, T(f), g | 0);
    }
    function cD(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        Eb[a & 15](b | 0, c | 0, d | 0);
    }
    function dD(a) {
        a = a | 0;
        Fb[a & 0]();
    }
    function eD(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        Gb[a & 15](b | 0, c | 0, +d);
    }
    function fD(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        return Hb[a & 1](+b, +c) | 0;
    }
    function gD(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        Ib[a & 15](b | 0, c | 0, d | 0, e | 0);
    }
    function hD(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        U(0);
    }
    function iD(a, b) {
        a = a | 0;
        b = T(b);
        U(1);
    }
    function jD(a, b) {
        a = a | 0;
        b = +b;
        U(2);
    }
    function kD(a, b, c) {
        a = a | 0;
        b = T(b);
        c = T(c);
        U(3);
        return ib;
    }
    function lD(a) {
        a = a | 0;
        U(4);
    }
    function mD(a, b) {
        a = a | 0;
        b = b | 0;
        U(5);
    }
    function nD(a) {
        a = a | 0;
        U(6);
        return 0;
    }
    function oD(a, b, c, d) {
        a = a | 0;
        b = +b;
        c = +c;
        d = d | 0;
        U(7);
    }
    function pD(a, b, c) {
        a = a | 0;
        b = +b;
        c = +c;
        U(8);
    }
    function qD(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        U(9);
        return 0;
    }
    function rD(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        U(10);
        return 0.0;
    }
    function sD(a) {
        a = a | 0;
        U(11);
        return 0.0;
    }
    function tD(a, b) {
        a = a | 0;
        b = +b;
        U(12);
        return 0;
    }
    function uD(a, b) {
        a = a | 0;
        b = b | 0;
        U(13);
        return 0;
    }
    function vD(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = +c;
        d = +d;
        e = e | 0;
        U(14);
    }
    function wD(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        f = f | 0;
        U(15);
    }
    function xD(a, b) {
        a = a | 0;
        b = b | 0;
        U(16);
        return 0.0;
    }
    function yD() {
        U(17);
        return 0;
    }
    function zD(a, b, c, d, e) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        e = e | 0;
        U(18);
        return 0;
    }
    function AD(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = +d;
        U(19);
    }
    function BD(a, b, c, d, e, f) {
        a = a | 0;
        b = b | 0;
        c = T(c);
        d = d | 0;
        e = T(e);
        f = f | 0;
        U(20);
    }
    function CD(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        U(21);
    }
    function DD() {
        U(22);
    }
    function ED(a, b, c) {
        a = a | 0;
        b = b | 0;
        c = +c;
        U(23);
    }
    function FD(a, b) {
        a = +a;
        b = +b;
        U(24);
        return 0;
    }
    function GD(a, b, c, d) {
        a = a | 0;
        b = b | 0;
        c = c | 0;
        d = d | 0;
        U(25);
    }
    // EMSCRIPTEN_END_FUNCS
    var jb = [
        hD,
        Uw
    ];
    var kb = [
        iD,
        of
    ];
    var lb = [
        jD,
        Of,
        Pf,
        Qf,
        Rf,
        Sf,
        Tf,
        Uf,
        Wf,
        Xf,
        Zf,
        _f,
        $f,
        ag,
        bg,
        cg,
        dg,
        eg,
        fg,
        jD,
        jD,
        jD,
        jD,
        jD,
        jD,
        jD,
        jD,
        jD,
        jD,
        jD,
        jD,
        jD
    ];
    var mb = [
        kD
    ];
    var nb = [
        lD,
        kC,
        Ki,
        Li,
        Mi,
        rn,
        sn,
        tn,
        Pu,
        Qu,
        Ru,
        Cw,
        Dw,
        Ew,
        DA,
        EA,
        FA,
        Rb,
        tf,
        yf,
        Vf,
        Yf,
        hh,
        ih,
        ri,
        Ui,
        kj,
        Jj,
        bk,
        zk,
        Wk,
        nl,
        Hl,
        bm,
        um,
        Nm,
        en,
        Nn,
        fo,
        yo,
        Ro,
        ip,
        Bp,
        Xp,
        nq,
        Eq,
        Zq,
        lf,
        Hr,
        _r,
        us,
        Ps,
        ft,
        Ct,
        Ot,
        Rt,
        ju,
        mu,
        Eu,
        Uu,
        Xu,
        pv,
        Kv,
        Vi,
        $x,
        Ky,
        az,
        sz,
        Rz,
        hA,
        tA,
        wA,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD,
        lD
    ];
    var ob = [
        mD,
        zf,
        Af,
        Df,
        Ef,
        Ff,
        Gf,
        Hf,
        If,
        Lf,
        Mf,
        Nf,
        wg,
        zg,
        Ag,
        Bg,
        Cg,
        Dg,
        Eg,
        Jg,
        Ng,
        rh,
        $p,
        qq,
        Ts,
        cy,
        Sv,
        xy,
        mD,
        mD,
        mD,
        mD
    ];
    var pb = [
        nD,
        rB,
        sf,
        jg,
        ng,
        og,
        pg,
        qg,
        rg,
        sg,
        ug,
        vg,
        Kg,
        Lg,
        jh,
        ar,
        jt,
        sv,
        hy,
        jy,
        nD,
        nD,
        nD,
        nD,
        nD,
        nD,
        nD,
        nD,
        nD,
        nD,
        nD,
        nD
    ];
    var qb = [
        oD,
        kh
    ];
    var rb = [
        pD,
        Hu
    ];
    var sb = [
        qD,
        sB,
        tB,
        zB,
        Dk,
        Rn,
        Lr,
        wz
    ];
    var tb = [
        rD,
        ym
    ];
    var ub = [
        sD,
        xg,
        yg,
        Fg,
        lh,
        mh,
        nh,
        oh,
        ph,
        qh,
        sD,
        sD,
        sD,
        sD,
        sD,
        sD
    ];
    var vb = [
        tD,
        Kt
    ];
    var wb = [
        uD,
        lC,
        Mg,
        xi,
        Nj,
        _k,
        rl,
        jn,
        jo,
        Iq,
        pf,
        ez,
        uD,
        uD,
        uD,
        uD
    ];
    var xb = [
        vD,
        oj
    ];
    var yb = [
        wD,
        Vz
    ];
    var zb = [
        xD,
        Gg,
        sh,
        th,
        uh,
        Rm,
        xD,
        xD
    ];
    var Ab = [
        yD,
        vh,
        qf,
        jf,
        Wt,
        qu,
        av,
        AA
    ];
    var Bb = [
        zD,
        ee
    ];
    var Cb = [
        AD,
        Vo
    ];
    var Db = [
        BD,
        Pg
    ];
    var Eb = [
        CD,
        kg,
        tg,
        Hg,
        Ig,
        fk,
        Ll,
        mp,
        Fp,
        nf,
        vx,
        Oy,
        lA,
        CD,
        CD,
        CD
    ];
    var Fb = [
        DD
    ];
    var Gb = [
        ED,
        Bf,
        Cf,
        Jf,
        Kf,
        gg,
        hg,
        ig,
        Co,
        cs,
        Ft,
        ED,
        ED,
        ED,
        ED,
        ED
    ];
    var Hb = [
        FD,
        Mu
    ];
    var Ib = [
        GD,
        fm,
        ir,
        ys,
        st,
        au,
        wu,
        hv,
        Pv,
        oy,
        LA,
        GD,
        GD,
        GD,
        GD,
        GD
    ];
    return {
        _llvm_bswap_i32: IC,
        dynCall_idd: fD,
        dynCall_i: _C,
        _i64Subtract: wC,
        ___udivdi3: EC,
        dynCall_vif: KC,
        setThrew: Nb,
        dynCall_viii: cD,
        _bitshift64Lshr: AC,
        _bitshift64Shl: zC,
        dynCall_vi: NC,
        dynCall_viiddi: XC,
        dynCall_diii: TC,
        dynCall_iii: WC,
        _memset: yC,
        _sbrk: FC,
        _memcpy: BC,
        __GLOBAL__sub_I_Yoga_cpp: hf,
        dynCall_vii: OC,
        ___uremdi3: HC,
        dynCall_vid: LC,
        stackAlloc: Jb,
        _nbind_init: _A,
        getTempRet0: Pb,
        dynCall_di: UC,
        dynCall_iid: VC,
        setTempRet0: Ob,
        _i64Add: xC,
        dynCall_fiff: MC,
        dynCall_iiii: SC,
        _emscripten_get_global_libc: qB,
        dynCall_viid: eD,
        dynCall_viiid: aD,
        dynCall_viififi: bD,
        dynCall_ii: PC,
        __GLOBAL__sub_I_Binding_cc: Sx,
        dynCall_viiii: gD,
        dynCall_iiiiii: $C,
        stackSave: Kb,
        dynCall_viiiii: JC,
        __GLOBAL__sub_I_nbind_cc: wh,
        dynCall_vidd: RC,
        _free: pB,
        runPostSets: vC,
        dynCall_viiiiii: YC,
        establishStackSpace: Mb,
        _memmove: GC,
        stackRestore: Lb,
        _malloc: oB,
        __GLOBAL__sub_I_common_cc: Bv,
        dynCall_viddi: QC,
        dynCall_dii: ZC,
        dynCall_v: dD
    };
}
