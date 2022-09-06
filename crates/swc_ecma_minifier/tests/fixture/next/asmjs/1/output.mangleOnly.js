export function foo(n, r, e) {
    "use asm";
    var i = new n.Int8Array(e);
    var t = new n.Int16Array(e);
    var u = new n.Int32Array(e);
    var f = new n.Uint8Array(e);
    var o = new n.Uint16Array(e);
    var c = new n.Uint32Array(e);
    var a = new n.Float32Array(e);
    var l = new n.Float64Array(e);
    var v = r.DYNAMICTOP_PTR | 0;
    var s = r.tempDoublePtr | 0;
    var b = r.ABORT | 0;
    var k = r.STACKTOP | 0;
    var h = r.STACK_MAX | 0;
    var d = r.cttz_i8 | 0;
    var w = r.___dso_handle | 0;
    var $ = 0;
    var m = 0;
    var y = 0;
    var p = 0;
    var C = n.NaN, M = n.Infinity;
    var g = 0, A = 0, I = 0, S = 0, T = 0.0;
    var x = 0;
    var N = n.Math.floor;
    var L = n.Math.abs;
    var O = n.Math.sqrt;
    var P = n.Math.pow;
    var E = n.Math.cos;
    var G = n.Math.sin;
    var B = n.Math.tan;
    var R = n.Math.acos;
    var Y = n.Math.asin;
    var U = n.Math.atan;
    var j = n.Math.atan2;
    var z = n.Math.exp;
    var D = n.Math.log;
    var F = n.Math.ceil;
    var K = n.Math.imul;
    var q = n.Math.min;
    var H = n.Math.max;
    var X = n.Math.clz32;
    var Z = n.Math.fround;
    var J = r.abort;
    var Q = r.assert;
    var V = r.enlargeMemory;
    var W = r.getTotalMemory;
    var _ = r.abortOnCannotGrowMemory;
    var nn = r.invoke_viiiii;
    var nr = r.invoke_vif;
    var ne = r.invoke_vid;
    var ni = r.invoke_fiff;
    var nt = r.invoke_vi;
    var nu = r.invoke_vii;
    var nf = r.invoke_ii;
    var no = r.invoke_viddi;
    var nc = r.invoke_vidd;
    var na = r.invoke_iiii;
    var nl = r.invoke_diii;
    var nv = r.invoke_di;
    var ns = r.invoke_iid;
    var nb = r.invoke_iii;
    var nk = r.invoke_viiddi;
    var nh = r.invoke_viiiiii;
    var nd = r.invoke_dii;
    var nw = r.invoke_i;
    var n$ = r.invoke_iiiiii;
    var nm = r.invoke_viiid;
    var ny = r.invoke_viififi;
    var np = r.invoke_viii;
    var nC = r.invoke_v;
    var nM = r.invoke_viid;
    var ng = r.invoke_idd;
    var nA = r.invoke_viiii;
    var nI = r._emscripten_asm_const_iiiii;
    var nS = r._emscripten_asm_const_iiidddddd;
    var nT = r._emscripten_asm_const_iiiid;
    var nx = r.__nbind_reference_external;
    var nN = r._emscripten_asm_const_iiiiiiii;
    var nL = r._removeAccessorPrefix;
    var nO = r._typeModule;
    var nP = r.__nbind_register_pool;
    var nE = r.__decorate;
    var nG = r._llvm_stackrestore;
    var nB = r.___cxa_atexit;
    var nR = r.__extends;
    var nY = r.__nbind_get_value_object;
    var nU = r.__ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj;
    var nj = r._emscripten_set_main_loop_timing;
    var nz = r.__nbind_register_primitive;
    var nD = r.__nbind_register_type;
    var nF = r._emscripten_memcpy_big;
    var nK = r.__nbind_register_function;
    var nq = r.___setErrNo;
    var nH = r.__nbind_register_class;
    var nX = r.__nbind_finish;
    var nZ = r._abort;
    var nJ = r._nbind_value;
    var nQ = r._llvm_stacksave;
    var nV = r.___syscall54;
    var nW = r._defineHidden;
    var n_ = r._emscripten_set_main_loop;
    var n0 = r._emscripten_get_now;
    var n2 = r.__nbind_register_callback_signature;
    var n1 = r._emscripten_asm_const_iiiiii;
    var n4 = r.__nbind_free_external;
    var n8 = r._emscripten_asm_const_iiii;
    var n3 = r._emscripten_asm_const_iiididi;
    var n6 = r.___syscall6;
    var n9 = r._atexit;
    var n7 = r.___syscall140;
    var n5 = r.___syscall146;
    var rn = Z(0);
    const rr = Z(0);
    function re(n) {
        n = n | 0;
        var r = 0;
        r = k;
        k = (k + n) | 0;
        k = (k + 15) & -16;
        return r | 0;
    }
    function ri() {
        return k | 0;
    }
    function rt(n) {
        n = n | 0;
        k = n;
    }
    function ru(n, r) {
        n = n | 0;
        r = r | 0;
        k = n;
        h = r;
    }
    function rf(n, r) {
        n = n | 0;
        r = r | 0;
        if (!$) {
            $ = n;
            m = r;
        }
    }
    function ro(n) {
        n = n | 0;
        x = n;
    }
    function rc() {
        return x | 0;
    }
    function ra() {
        var n = 0, r = 0;
        MK(8104, 8, 400) | 0;
        MK(8504, 408, 540) | 0;
        n = 9044;
        r = (n + 44) | 0;
        do {
            u[n >> 2] = 0;
            n = (n + 4) | 0;
        }while ((n | 0) < (r | 0))
        i[9088] = 0;
        i[9089] = 1;
        u[2273] = 0;
        u[2274] = 948;
        u[2275] = 948;
        nB(17, 8104, w | 0) | 0;
        return;
    }
    function rl(n) {
        n = n | 0;
        rG((n + 948) | 0);
        return;
    }
    function rv(n) {
        n = Z(n);
        return (((i4(n) | 0) & 2147483647) >>> 0 > 2139095040) | 0;
    }
    function rs(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        a: do if (!(u[(n + (r << 3) + 4) >> 2] | 0)) {
            if ((r | 2 | 0) == 3 ? u[(n + 60) >> 2] | 0 : 0) {
                n = (n + 56) | 0;
                break;
            }
            switch(r | 0){
                case 0:
                case 2:
                case 4:
                case 5:
                    {
                        if (u[(n + 52) >> 2] | 0) {
                            n = (n + 48) | 0;
                            break a;
                        }
                        break;
                    }
                default:
                    {}
            }
            if (!(u[(n + 68) >> 2] | 0)) {
                n = (r | 1 | 0) == 5 ? 948 : e;
                break;
            } else {
                n = (n + 64) | 0;
                break;
            }
        } else n = (n + (r << 3)) | 0;
        while (0)
        return n | 0;
    }
    function rb(n) {
        n = n | 0;
        var r = 0;
        r = Cz(1e3) | 0;
        rk(n, (r | 0) != 0, 2456);
        u[2276] = (u[2276] | 0) + 1;
        MK(r | 0, 8104, 1e3) | 0;
        if (i[(n + 2) >> 0] | 0) {
            u[(r + 4) >> 2] = 2;
            u[(r + 12) >> 2] = 4;
        }
        u[(r + 976) >> 2] = n;
        return r | 0;
    }
    function rk(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = k;
        k = (k + 16) | 0;
        i = t;
        if (!r) {
            u[i >> 2] = e;
            ic(n, 5, 3197, i);
        }
        k = t;
        return;
    }
    function rh() {
        return rb(956) | 0;
    }
    function rd(n) {
        n = n | 0;
        var r = 0;
        r = MP(1e3) | 0;
        rw(r, n);
        rk(u[(n + 976) >> 2] | 0, 1, 2456);
        u[2276] = (u[2276] | 0) + 1;
        u[(r + 944) >> 2] = 0;
        return r | 0;
    }
    function rw(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        MK(n | 0, r | 0, 948) | 0;
        iv((n + 948) | 0, (r + 948) | 0);
        e = (n + 960) | 0;
        n = (r + 960) | 0;
        r = (e + 40) | 0;
        do {
            u[e >> 2] = u[n >> 2];
            e = (e + 4) | 0;
            n = (n + 4) | 0;
        }while ((e | 0) < (r | 0))
        return;
    }
    function r$(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        r = (n + 944) | 0;
        e = u[r >> 2] | 0;
        if (e | 0) {
            rm((e + 948) | 0, n) | 0;
            u[r >> 2] = 0;
        }
        e = ry(n) | 0;
        if (e | 0) {
            r = 0;
            do {
                u[((rp(n, r) | 0) + 944) >> 2] = 0;
                r = (r + 1) | 0;
            }while ((r | 0) != (e | 0))
        }
        e = (n + 948) | 0;
        i = u[e >> 2] | 0;
        t = (n + 952) | 0;
        r = u[t >> 2] | 0;
        if ((r | 0) != (i | 0)) u[t >> 2] = r + (~(((r + -4 - i) | 0) >>> 2) << 2);
        rC(e);
        CD(n);
        u[2276] = (u[2276] | 0) + -1;
        return;
    }
    function rm(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0;
        i = u[n >> 2] | 0;
        c = (n + 4) | 0;
        e = u[c >> 2] | 0;
        f = e;
        a: do if ((i | 0) == (e | 0)) {
            t = i;
            o = 4;
        } else {
            n = i;
            while(1){
                if ((u[n >> 2] | 0) == (r | 0)) {
                    t = n;
                    o = 4;
                    break a;
                }
                n = (n + 4) | 0;
                if ((n | 0) == (e | 0)) {
                    n = 0;
                    break;
                }
            }
        }
        while (0)
        if ((o | 0) == 4) if ((t | 0) != (e | 0)) {
            i = (t + 4) | 0;
            n = (f - i) | 0;
            r = n >> 2;
            if (r) {
                MJ(t | 0, i | 0, n | 0) | 0;
                e = u[c >> 2] | 0;
            }
            n = (t + (r << 2)) | 0;
            if ((e | 0) == (n | 0)) n = 1;
            else {
                u[c >> 2] = e + (~(((e + -4 - n) | 0) >>> 2) << 2);
                n = 1;
            }
        } else n = 0;
        return n | 0;
    }
    function ry(n) {
        n = n | 0;
        return (((u[(n + 952) >> 2] | 0) - (u[(n + 948) >> 2] | 0)) >> 2) | 0;
    }
    function rp(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = u[(n + 948) >> 2] | 0;
        if ((((u[(n + 952) >> 2] | 0) - e) >> 2) >>> 0 > r >>> 0) n = u[(e + (r << 2)) >> 2] | 0;
        else n = 0;
        return n | 0;
    }
    function rC(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        i = k;
        k = (k + 32) | 0;
        r = i;
        t = u[n >> 2] | 0;
        e = ((u[(n + 4) >> 2] | 0) - t) | 0;
        if ((((u[(n + 8) >> 2] | 0) - t) | 0) >>> 0 > e >>> 0) {
            t = e >> 2;
            i8(r, t, t, (n + 8) | 0);
            i3(n, r);
            i6(r);
        }
        k = i;
        return;
    }
    function rM(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        l = ry(n) | 0;
        do if (l | 0) {
            if ((u[((rp(n, 0) | 0) + 944) >> 2] | 0) == (n | 0)) {
                if (!(rm((n + 948) | 0, r) | 0)) break;
                MK((r + 400) | 0, 8504, 540) | 0;
                u[(r + 944) >> 2] = 0;
                rE(n);
                break;
            }
            o = u[((u[(n + 976) >> 2] | 0) + 12) >> 2] | 0;
            c = (n + 948) | 0;
            a = (o | 0) == 0;
            e = 0;
            f = 0;
            do {
                i = u[((u[c >> 2] | 0) + (f << 2)) >> 2] | 0;
                if ((i | 0) == (r | 0)) rE(n);
                else {
                    t = rd(i) | 0;
                    u[((u[c >> 2] | 0) + (e << 2)) >> 2] = t;
                    u[(t + 944) >> 2] = n;
                    if (!a) Ar[o & 15](i, t, n, e);
                    e = (e + 1) | 0;
                }
                f = (f + 1) | 0;
            }while ((f | 0) != (l | 0))
            if (e >>> 0 < l >>> 0) {
                a = (n + 948) | 0;
                c = (n + 952) | 0;
                o = e;
                e = u[c >> 2] | 0;
                do {
                    f = ((u[a >> 2] | 0) + (o << 2)) | 0;
                    i = (f + 4) | 0;
                    t = (e - i) | 0;
                    r = t >> 2;
                    if (!r) t = e;
                    else {
                        MJ(f | 0, i | 0, t | 0) | 0;
                        e = u[c >> 2] | 0;
                        t = e;
                    }
                    i = (f + (r << 2)) | 0;
                    if ((t | 0) != (i | 0)) {
                        e = (t + (~(((t + -4 - i) | 0) >>> 2) << 2)) | 0;
                        u[c >> 2] = e;
                    }
                    o = (o + 1) | 0;
                }while ((o | 0) != (l | 0))
            }
        }
        while (0)
        return;
    }
    function rg(n) {
        n = n | 0;
        var r = 0, e = 0, t = 0, f = 0;
        rA(n, (ry(n) | 0) == 0, 2491);
        rA(n, (u[(n + 944) >> 2] | 0) == 0, 2545);
        r = (n + 948) | 0;
        e = u[r >> 2] | 0;
        t = (n + 952) | 0;
        f = u[t >> 2] | 0;
        if ((f | 0) != (e | 0)) u[t >> 2] = f + (~(((f + -4 - e) | 0) >>> 2) << 2);
        rC(r);
        r = (n + 976) | 0;
        e = u[r >> 2] | 0;
        MK(n | 0, 8104, 1e3) | 0;
        if (i[(e + 2) >> 0] | 0) {
            u[(n + 4) >> 2] = 2;
            u[(n + 12) >> 2] = 4;
        }
        u[r >> 2] = e;
        return;
    }
    function rA(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = k;
        k = (k + 16) | 0;
        i = t;
        if (!r) {
            u[i >> 2] = e;
            e8(n, 5, 3197, i);
        }
        k = t;
        return;
    }
    function rI() {
        return u[2276] | 0;
    }
    function rS() {
        var n = 0;
        n = Cz(20) | 0;
        rT((n | 0) != 0, 2592);
        u[2277] = (u[2277] | 0) + 1;
        u[n >> 2] = u[239];
        u[(n + 4) >> 2] = u[240];
        u[(n + 8) >> 2] = u[241];
        u[(n + 12) >> 2] = u[242];
        u[(n + 16) >> 2] = u[243];
        return n | 0;
    }
    function rT(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = k;
        k = (k + 16) | 0;
        e = i;
        if (!n) {
            u[e >> 2] = r;
            e8(0, 5, 3197, e);
        }
        k = i;
        return;
    }
    function rx(n) {
        n = n | 0;
        CD(n);
        u[2277] = (u[2277] | 0) + -1;
        return;
    }
    function rN(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        if (!r) {
            e = 0;
            r = 0;
        } else {
            rA(n, (ry(n) | 0) == 0, 2629);
            e = 1;
        }
        u[(n + 964) >> 2] = r;
        u[(n + 988) >> 2] = e;
        return;
    }
    function rL(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        f = (i + 8) | 0;
        t = (i + 4) | 0;
        o = i;
        u[t >> 2] = r;
        rA(n, (u[(r + 944) >> 2] | 0) == 0, 2709);
        rA(n, (u[(n + 964) >> 2] | 0) == 0, 2763);
        rO(n);
        r = (n + 948) | 0;
        u[o >> 2] = (u[r >> 2] | 0) + (e << 2);
        u[f >> 2] = u[o >> 2];
        rP(r, f, t) | 0;
        u[((u[t >> 2] | 0) + 944) >> 2] = n;
        rE(n);
        k = i;
        return;
    }
    function rO(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0;
        e = ry(n) | 0;
        if (e | 0 ? (u[((rp(n, 0) | 0) + 944) >> 2] | 0) != (n | 0) : 0) {
            i = u[((u[(n + 976) >> 2] | 0) + 12) >> 2] | 0;
            t = (n + 948) | 0;
            f = (i | 0) == 0;
            r = 0;
            do {
                o = u[((u[t >> 2] | 0) + (r << 2)) >> 2] | 0;
                c = rd(o) | 0;
                u[((u[t >> 2] | 0) + (r << 2)) >> 2] = c;
                u[(c + 944) >> 2] = n;
                if (!f) Ar[i & 15](o, c, n, r);
                r = (r + 1) | 0;
            }while ((r | 0) != (e | 0))
        }
        return;
    }
    function rP(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0, d = 0, w = 0, $ = 0, m = 0;
        $ = k;
        k = (k + 64) | 0;
        s = ($ + 52) | 0;
        c = ($ + 48) | 0;
        b = ($ + 28) | 0;
        h = ($ + 24) | 0;
        d = ($ + 20) | 0;
        w = $;
        i = u[n >> 2] | 0;
        f = i;
        r = (i + ((((u[r >> 2] | 0) - f) >> 2) << 2)) | 0;
        i = (n + 4) | 0;
        t = u[i >> 2] | 0;
        o = (n + 8) | 0;
        do if (t >>> 0 < (u[o >> 2] | 0) >>> 0) {
            if ((r | 0) == (t | 0)) {
                u[r >> 2] = u[e >> 2];
                u[i >> 2] = (u[i >> 2] | 0) + 4;
                break;
            }
            i9(n, r, t, (r + 4) | 0);
            if (r >>> 0 <= e >>> 0) e = (u[i >> 2] | 0) >>> 0 > e >>> 0 ? (e + 4) | 0 : e;
            u[r >> 2] = u[e >> 2];
        } else {
            i = (((t - f) >> 2) + 1) | 0;
            t = ik(n) | 0;
            if (t >>> 0 < i >>> 0) MI(n);
            v = u[n >> 2] | 0;
            l = ((u[o >> 2] | 0) - v) | 0;
            f = l >> 1;
            i8(w, (l >> 2) >>> 0 < (t >>> 1) >>> 0 ? f >>> 0 < i >>> 0 ? i : f : t, (r - v) >> 2, (n + 8) | 0);
            v = (w + 8) | 0;
            i = u[v >> 2] | 0;
            f = (w + 12) | 0;
            l = u[f >> 2] | 0;
            o = l;
            a = i;
            do if ((i | 0) == (l | 0)) {
                l = (w + 4) | 0;
                i = u[l >> 2] | 0;
                m = u[w >> 2] | 0;
                t = m;
                if (i >>> 0 <= m >>> 0) {
                    i = (o - t) >> 1;
                    i = (i | 0) == 0 ? 1 : i;
                    i8(b, i, i >>> 2, u[(w + 16) >> 2] | 0);
                    u[h >> 2] = u[l >> 2];
                    u[d >> 2] = u[v >> 2];
                    u[c >> 2] = u[h >> 2];
                    u[s >> 2] = u[d >> 2];
                    i5(b, c, s);
                    i = u[w >> 2] | 0;
                    u[w >> 2] = u[b >> 2];
                    u[b >> 2] = i;
                    i = (b + 4) | 0;
                    m = u[l >> 2] | 0;
                    u[l >> 2] = u[i >> 2];
                    u[i >> 2] = m;
                    i = (b + 8) | 0;
                    m = u[v >> 2] | 0;
                    u[v >> 2] = u[i >> 2];
                    u[i >> 2] = m;
                    i = (b + 12) | 0;
                    m = u[f >> 2] | 0;
                    u[f >> 2] = u[i >> 2];
                    u[i >> 2] = m;
                    i6(b);
                    i = u[v >> 2] | 0;
                    break;
                }
                f = i;
                o = (((((f - t) >> 2) + 1) | 0) / -2) | 0;
                c = (i + (o << 2)) | 0;
                t = (a - f) | 0;
                f = t >> 2;
                if (f) {
                    MJ(c | 0, i | 0, t | 0) | 0;
                    i = u[l >> 2] | 0;
                }
                m = (c + (f << 2)) | 0;
                u[v >> 2] = m;
                u[l >> 2] = i + (o << 2);
                i = m;
            }
            while (0)
            u[i >> 2] = u[e >> 2];
            u[v >> 2] = (u[v >> 2] | 0) + 4;
            r = i7(n, w, r) | 0;
            i6(w);
        }
        while (0)
        k = $;
        return r | 0;
    }
    function rE(n) {
        n = n | 0;
        var r = 0;
        do {
            r = (n + 984) | 0;
            if (i[r >> 0] | 0) break;
            i[r >> 0] = 1;
            a[(n + 504) >> 2] = Z(C);
            n = u[(n + 944) >> 2] | 0;
        }while ((n | 0) != 0)
        return;
    }
    function rG(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -4 - i) | 0) >>> 2) << 2);
            MG(e);
        }
        return;
    }
    function rB(n) {
        n = n | 0;
        return u[(n + 944) >> 2] | 0;
    }
    function rR(n) {
        n = n | 0;
        rA(n, (u[(n + 964) >> 2] | 0) != 0, 2832);
        rE(n);
        return;
    }
    function rY(n) {
        n = n | 0;
        return ((i[(n + 984) >> 0] | 0) != 0) | 0;
    }
    function rU(n, r) {
        n = n | 0;
        r = r | 0;
        if (C0(n, r, 400) | 0) {
            MK(n | 0, r | 0, 400) | 0;
            rE(n);
        }
        return;
    }
    function rj(n) {
        n = n | 0;
        var r = rr;
        r = Z(a[(n + 44) >> 2]);
        n = rv(r) | 0;
        return Z(n ? Z(0.0) : r);
    }
    function rz(n) {
        n = n | 0;
        var r = rr;
        r = Z(a[(n + 48) >> 2]);
        if (rv(r) | 0) r = i[((u[(n + 976) >> 2] | 0) + 2) >> 0] | 0 ? Z(1.0) : Z(0.0);
        return Z(r);
    }
    function rD(n, r) {
        n = n | 0;
        r = r | 0;
        u[(n + 980) >> 2] = r;
        return;
    }
    function rF(n) {
        n = n | 0;
        return u[(n + 980) >> 2] | 0;
    }
    function rK(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 4) | 0;
        if ((u[e >> 2] | 0) != (r | 0)) {
            u[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function rq(n) {
        n = n | 0;
        return u[(n + 4) >> 2] | 0;
    }
    function rH(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 8) | 0;
        if ((u[e >> 2] | 0) != (r | 0)) {
            u[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function rX(n) {
        n = n | 0;
        return u[(n + 8) >> 2] | 0;
    }
    function rZ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 12) | 0;
        if ((u[e >> 2] | 0) != (r | 0)) {
            u[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function rJ(n) {
        n = n | 0;
        return u[(n + 12) >> 2] | 0;
    }
    function rQ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 16) | 0;
        if ((u[e >> 2] | 0) != (r | 0)) {
            u[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function rV(n) {
        n = n | 0;
        return u[(n + 16) >> 2] | 0;
    }
    function rW(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 20) | 0;
        if ((u[e >> 2] | 0) != (r | 0)) {
            u[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function r_(n) {
        n = n | 0;
        return u[(n + 20) >> 2] | 0;
    }
    function r0(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 24) | 0;
        if ((u[e >> 2] | 0) != (r | 0)) {
            u[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function r2(n) {
        n = n | 0;
        return u[(n + 24) >> 2] | 0;
    }
    function r1(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 28) | 0;
        if ((u[e >> 2] | 0) != (r | 0)) {
            u[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function r4(n) {
        n = n | 0;
        return u[(n + 28) >> 2] | 0;
    }
    function r8(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 32) | 0;
        if ((u[e >> 2] | 0) != (r | 0)) {
            u[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function r3(n) {
        n = n | 0;
        return u[(n + 32) >> 2] | 0;
    }
    function r6(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 36) | 0;
        if ((u[e >> 2] | 0) != (r | 0)) {
            u[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function r9(n) {
        n = n | 0;
        return u[(n + 36) >> 2] | 0;
    }
    function r7(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0;
        e = (n + 40) | 0;
        if (Z(a[e >> 2]) != r) {
            a[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function r5(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0;
        e = (n + 44) | 0;
        if (Z(a[e >> 2]) != r) {
            a[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function en(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0;
        e = (n + 48) | 0;
        if (Z(a[e >> 2]) != r) {
            a[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function er(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = (f ^ 1) & 1;
        i = (n + 52) | 0;
        t = (n + 56) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function ee(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0;
        i = (n + 52) | 0;
        e = (n + 56) | 0;
        if (!(!(Z(a[i >> 2]) != r) ? (u[e >> 2] | 0) == 2 : 0)) {
            a[i >> 2] = r;
            i = rv(r) | 0;
            u[e >> 2] = i ? 3 : 2;
            rE(n);
        }
        return;
    }
    function ei(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = (r + 52) | 0;
        e = u[(i + 4) >> 2] | 0;
        r = n;
        u[r >> 2] = u[i >> 2];
        u[(r + 4) >> 2] = e;
        return;
    }
    function et(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0, t = 0, f = 0;
        f = rv(e) | 0;
        i = (f ^ 1) & 1;
        t = (n + 132 + (r << 3)) | 0;
        r = (n + 132 + (r << 3) + 4) | 0;
        if (!(f | (Z(a[t >> 2]) == e) ? (u[r >> 2] | 0) == (i | 0) : 0)) {
            a[t >> 2] = e;
            u[r >> 2] = i;
            rE(n);
        }
        return;
    }
    function eu(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0, t = 0, f = 0;
        f = rv(e) | 0;
        i = f ? 0 : 2;
        t = (n + 132 + (r << 3)) | 0;
        r = (n + 132 + (r << 3) + 4) | 0;
        if (!(f | (Z(a[t >> 2]) == e) ? (u[r >> 2] | 0) == (i | 0) : 0)) {
            a[t >> 2] = e;
            u[r >> 2] = i;
            rE(n);
        }
        return;
    }
    function ef(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = (r + 132 + (e << 3)) | 0;
        r = u[(i + 4) >> 2] | 0;
        e = n;
        u[e >> 2] = u[i >> 2];
        u[(e + 4) >> 2] = r;
        return;
    }
    function eo(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0, t = 0, f = 0;
        f = rv(e) | 0;
        i = (f ^ 1) & 1;
        t = (n + 60 + (r << 3)) | 0;
        r = (n + 60 + (r << 3) + 4) | 0;
        if (!(f | (Z(a[t >> 2]) == e) ? (u[r >> 2] | 0) == (i | 0) : 0)) {
            a[t >> 2] = e;
            u[r >> 2] = i;
            rE(n);
        }
        return;
    }
    function ec(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0, t = 0, f = 0;
        f = rv(e) | 0;
        i = f ? 0 : 2;
        t = (n + 60 + (r << 3)) | 0;
        r = (n + 60 + (r << 3) + 4) | 0;
        if (!(f | (Z(a[t >> 2]) == e) ? (u[r >> 2] | 0) == (i | 0) : 0)) {
            a[t >> 2] = e;
            u[r >> 2] = i;
            rE(n);
        }
        return;
    }
    function ea(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = (r + 60 + (e << 3)) | 0;
        r = u[(i + 4) >> 2] | 0;
        e = n;
        u[e >> 2] = u[i >> 2];
        u[(e + 4) >> 2] = r;
        return;
    }
    function el(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 60 + (r << 3) + 4) | 0;
        if ((u[e >> 2] | 0) != 3) {
            a[(n + 60 + (r << 3)) >> 2] = Z(C);
            u[e >> 2] = 3;
            rE(n);
        }
        return;
    }
    function ev(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0, t = 0, f = 0;
        f = rv(e) | 0;
        i = (f ^ 1) & 1;
        t = (n + 204 + (r << 3)) | 0;
        r = (n + 204 + (r << 3) + 4) | 0;
        if (!(f | (Z(a[t >> 2]) == e) ? (u[r >> 2] | 0) == (i | 0) : 0)) {
            a[t >> 2] = e;
            u[r >> 2] = i;
            rE(n);
        }
        return;
    }
    function es(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0, t = 0, f = 0;
        f = rv(e) | 0;
        i = f ? 0 : 2;
        t = (n + 204 + (r << 3)) | 0;
        r = (n + 204 + (r << 3) + 4) | 0;
        if (!(f | (Z(a[t >> 2]) == e) ? (u[r >> 2] | 0) == (i | 0) : 0)) {
            a[t >> 2] = e;
            u[r >> 2] = i;
            rE(n);
        }
        return;
    }
    function eb(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = (r + 204 + (e << 3)) | 0;
        r = u[(i + 4) >> 2] | 0;
        e = n;
        u[e >> 2] = u[i >> 2];
        u[(e + 4) >> 2] = r;
        return;
    }
    function ek(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0, t = 0, f = 0;
        f = rv(e) | 0;
        i = (f ^ 1) & 1;
        t = (n + 276 + (r << 3)) | 0;
        r = (n + 276 + (r << 3) + 4) | 0;
        if (!(f | (Z(a[t >> 2]) == e) ? (u[r >> 2] | 0) == (i | 0) : 0)) {
            a[t >> 2] = e;
            u[r >> 2] = i;
            rE(n);
        }
        return;
    }
    function eh(n, r) {
        n = n | 0;
        r = r | 0;
        return Z(a[(n + 276 + (r << 3)) >> 2]);
    }
    function ed(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = (f ^ 1) & 1;
        i = (n + 348) | 0;
        t = (n + 352) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function ew(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0;
        i = (n + 348) | 0;
        e = (n + 352) | 0;
        if (!(!(Z(a[i >> 2]) != r) ? (u[e >> 2] | 0) == 2 : 0)) {
            a[i >> 2] = r;
            i = rv(r) | 0;
            u[e >> 2] = i ? 3 : 2;
            rE(n);
        }
        return;
    }
    function e$(n) {
        n = n | 0;
        var r = 0;
        r = (n + 352) | 0;
        if ((u[r >> 2] | 0) != 3) {
            a[(n + 348) >> 2] = Z(C);
            u[r >> 2] = 3;
            rE(n);
        }
        return;
    }
    function em(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = (r + 348) | 0;
        e = u[(i + 4) >> 2] | 0;
        r = n;
        u[r >> 2] = u[i >> 2];
        u[(r + 4) >> 2] = e;
        return;
    }
    function ey(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = (f ^ 1) & 1;
        i = (n + 356) | 0;
        t = (n + 360) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function ep(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0;
        i = (n + 356) | 0;
        e = (n + 360) | 0;
        if (!(!(Z(a[i >> 2]) != r) ? (u[e >> 2] | 0) == 2 : 0)) {
            a[i >> 2] = r;
            i = rv(r) | 0;
            u[e >> 2] = i ? 3 : 2;
            rE(n);
        }
        return;
    }
    function eC(n) {
        n = n | 0;
        var r = 0;
        r = (n + 360) | 0;
        if ((u[r >> 2] | 0) != 3) {
            a[(n + 356) >> 2] = Z(C);
            u[r >> 2] = 3;
            rE(n);
        }
        return;
    }
    function eM(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = (r + 356) | 0;
        e = u[(i + 4) >> 2] | 0;
        r = n;
        u[r >> 2] = u[i >> 2];
        u[(r + 4) >> 2] = e;
        return;
    }
    function eg(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = (f ^ 1) & 1;
        i = (n + 364) | 0;
        t = (n + 368) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function eA(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = f ? 0 : 2;
        i = (n + 364) | 0;
        t = (n + 368) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function eI(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = (r + 364) | 0;
        e = u[(i + 4) >> 2] | 0;
        r = n;
        u[r >> 2] = u[i >> 2];
        u[(r + 4) >> 2] = e;
        return;
    }
    function eS(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = (f ^ 1) & 1;
        i = (n + 372) | 0;
        t = (n + 376) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function eT(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = f ? 0 : 2;
        i = (n + 372) | 0;
        t = (n + 376) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function ex(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = (r + 372) | 0;
        e = u[(i + 4) >> 2] | 0;
        r = n;
        u[r >> 2] = u[i >> 2];
        u[(r + 4) >> 2] = e;
        return;
    }
    function eN(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = (f ^ 1) & 1;
        i = (n + 380) | 0;
        t = (n + 384) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function eL(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = f ? 0 : 2;
        i = (n + 380) | 0;
        t = (n + 384) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function eO(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = (r + 380) | 0;
        e = u[(i + 4) >> 2] | 0;
        r = n;
        u[r >> 2] = u[i >> 2];
        u[(r + 4) >> 2] = e;
        return;
    }
    function eP(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = (f ^ 1) & 1;
        i = (n + 388) | 0;
        t = (n + 392) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function eE(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0;
        f = rv(r) | 0;
        e = f ? 0 : 2;
        i = (n + 388) | 0;
        t = (n + 392) | 0;
        if (!(f | (Z(a[i >> 2]) == r) ? (u[t >> 2] | 0) == (e | 0) : 0)) {
            a[i >> 2] = r;
            u[t >> 2] = e;
            rE(n);
        }
        return;
    }
    function eG(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = (r + 388) | 0;
        e = u[(i + 4) >> 2] | 0;
        r = n;
        u[r >> 2] = u[i >> 2];
        u[(r + 4) >> 2] = e;
        return;
    }
    function eB(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0;
        e = (n + 396) | 0;
        if (Z(a[e >> 2]) != r) {
            a[e >> 2] = r;
            rE(n);
        }
        return;
    }
    function eR(n) {
        n = n | 0;
        return Z(a[(n + 396) >> 2]);
    }
    function eY(n) {
        n = n | 0;
        return Z(a[(n + 400) >> 2]);
    }
    function eU(n) {
        n = n | 0;
        return Z(a[(n + 404) >> 2]);
    }
    function ej(n) {
        n = n | 0;
        return Z(a[(n + 408) >> 2]);
    }
    function ez(n) {
        n = n | 0;
        return Z(a[(n + 412) >> 2]);
    }
    function eD(n) {
        n = n | 0;
        return Z(a[(n + 416) >> 2]);
    }
    function eF(n) {
        n = n | 0;
        return Z(a[(n + 420) >> 2]);
    }
    function eK(n, r) {
        n = n | 0;
        r = r | 0;
        rA(n, (r | 0) < 6, 2918);
        switch(r | 0){
            case 0:
                {
                    r = (u[(n + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    r = (u[(n + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return Z(a[(n + 424 + (r << 2)) >> 2]);
    }
    function eq(n, r) {
        n = n | 0;
        r = r | 0;
        rA(n, (r | 0) < 6, 2918);
        switch(r | 0){
            case 0:
                {
                    r = (u[(n + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    r = (u[(n + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return Z(a[(n + 448 + (r << 2)) >> 2]);
    }
    function eH(n, r) {
        n = n | 0;
        r = r | 0;
        rA(n, (r | 0) < 6, 2918);
        switch(r | 0){
            case 0:
                {
                    r = (u[(n + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    r = (u[(n + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return Z(a[(n + 472 + (r << 2)) >> 2]);
    }
    function eX(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = rr;
        e = u[(n + 4) >> 2] | 0;
        if ((e | 0) == (u[(r + 4) >> 2] | 0)) {
            if (!e) n = 1;
            else {
                i = Z(a[n >> 2]);
                n = Z(L(Z(i - Z(a[r >> 2])))) < Z(0.0000999999974);
            }
        } else n = 0;
        return n | 0;
    }
    function eZ(n, r) {
        n = Z(n);
        r = Z(r);
        var e = 0;
        if (rv(n) | 0) e = rv(r) | 0;
        else e = Z(L(Z(n - r))) < Z(0.0000999999974);
        return e | 0;
    }
    function eJ(n, r) {
        n = n | 0;
        r = r | 0;
        eQ(n, r);
        return;
    }
    function eQ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, t = 0;
        e = k;
        k = (k + 16) | 0;
        t = (e + 4) | 0;
        u[t >> 2] = 0;
        u[(t + 4) >> 2] = 0;
        u[(t + 8) >> 2] = 0;
        nU(t | 0, n | 0, r | 0, 0);
        e8(n, 3, (i[(t + 11) >> 0] | 0) < 0 ? u[t >> 2] | 0 : t, e);
        MB(t);
        k = e;
        return;
    }
    function eV(n, r, e, i) {
        n = Z(n);
        r = Z(r);
        e = e | 0;
        i = i | 0;
        var t = rr;
        n = Z(n * r);
        t = Z(MM(n, Z(1.0)));
        do if (!(eZ(t, Z(0.0)) | 0)) {
            n = Z(n - t);
            if (eZ(t, Z(1.0)) | 0) {
                n = Z(n + Z(1.0));
                break;
            }
            if (e) {
                n = Z(n + Z(1.0));
                break;
            }
            if (!i) {
                if (t > Z(0.5)) t = Z(1.0);
                else {
                    i = eZ(t, Z(0.5)) | 0;
                    t = i ? Z(1.0) : Z(0.0);
                }
                n = Z(n + t);
            }
        } else n = Z(n - t);
        while (0)
        return Z(n / r);
    }
    function eW(n, r, e, i, t, u, f, o, c, l, v, s, b) {
        n = n | 0;
        r = Z(r);
        e = e | 0;
        i = Z(i);
        t = t | 0;
        u = Z(u);
        f = f | 0;
        o = Z(o);
        c = Z(c);
        l = Z(l);
        v = Z(v);
        s = Z(s);
        b = b | 0;
        var k = 0, h = rr, d = rr, w = rr, $ = rr, m = rr, y = rr;
        if ((c < Z(0.0)) | (l < Z(0.0))) b = 0;
        else {
            if ((b | 0) != 0 ? ((h = Z(a[(b + 4) >> 2])), h != Z(0.0)) : 0) {
                w = Z(eV(r, h, 0, 0));
                $ = Z(eV(i, h, 0, 0));
                d = Z(eV(u, h, 0, 0));
                h = Z(eV(o, h, 0, 0));
            } else {
                d = u;
                w = r;
                h = o;
                $ = i;
            }
            if ((t | 0) == (n | 0)) k = eZ(d, w) | 0;
            else k = 0;
            if ((f | 0) == (e | 0)) b = eZ(h, $) | 0;
            else b = 0;
            if ((!k ? ((m = Z(r - v)), !(e_(n, m, c) | 0)) : 0) ? !(e0(n, m, t, c) | 0) : 0) k = e2(n, m, t, u, c) | 0;
            else k = 1;
            if ((!b ? ((y = Z(i - s)), !(e_(e, y, l) | 0)) : 0) ? !(e0(e, y, f, l) | 0) : 0) b = e2(e, y, f, o, l) | 0;
            else b = 1;
            b = k & b;
        }
        return b | 0;
    }
    function e_(n, r, e) {
        n = n | 0;
        r = Z(r);
        e = Z(e);
        if ((n | 0) == 1) n = eZ(r, e) | 0;
        else n = 0;
        return n | 0;
    }
    function e0(n, r, e, i) {
        n = n | 0;
        r = Z(r);
        e = e | 0;
        i = Z(i);
        if (((n | 0) == 2) & ((e | 0) == 0)) {
            if (!(r >= i)) n = eZ(r, i) | 0;
            else n = 1;
        } else n = 0;
        return n | 0;
    }
    function e2(n, r, e, i, t) {
        n = n | 0;
        r = Z(r);
        e = e | 0;
        i = Z(i);
        t = Z(t);
        if (((n | 0) == 2) & ((e | 0) == 2) & (i > r)) {
            if (!(t <= r)) n = eZ(r, t) | 0;
            else n = 1;
        } else n = 0;
        return n | 0;
    }
    function e1(n, r, e, t, f, o, c, v, s, b, h) {
        n = n | 0;
        r = Z(r);
        e = Z(e);
        t = t | 0;
        f = f | 0;
        o = o | 0;
        c = Z(c);
        v = Z(v);
        s = s | 0;
        b = b | 0;
        h = h | 0;
        var d = 0, w = 0, $ = 0, m = 0, y = rr, p = rr, C = 0, M = 0, g = 0, A = 0, I = 0, S = 0, T = 0, x = 0, N = 0, L = 0, O = 0, P = rr, E = rr, G = rr, B = 0.0, R = 0.0;
        O = k;
        k = (k + 160) | 0;
        x = (O + 152) | 0;
        T = (O + 120) | 0;
        S = (O + 104) | 0;
        g = (O + 72) | 0;
        m = (O + 56) | 0;
        I = (O + 8) | 0;
        M = O;
        A = ((u[2279] | 0) + 1) | 0;
        u[2279] = A;
        N = (n + 984) | 0;
        if ((i[N >> 0] | 0) != 0 ? (u[(n + 512) >> 2] | 0) != (u[2278] | 0) : 0) C = 4;
        else if ((u[(n + 516) >> 2] | 0) == (t | 0)) L = 0;
        else C = 4;
        if ((C | 0) == 4) {
            u[(n + 520) >> 2] = 0;
            u[(n + 924) >> 2] = -1;
            u[(n + 928) >> 2] = -1;
            a[(n + 932) >> 2] = Z(-1.0);
            a[(n + 936) >> 2] = Z(-1.0);
            L = 1;
        }
        a: do if (!(u[(n + 964) >> 2] | 0)) {
            if (s) {
                d = (n + 916) | 0;
                if (!(eZ(Z(a[d >> 2]), r) | 0)) {
                    C = 21;
                    break;
                }
                if (!(eZ(Z(a[(n + 920) >> 2]), e) | 0)) {
                    C = 21;
                    break;
                }
                if ((u[(n + 924) >> 2] | 0) != (f | 0)) {
                    C = 21;
                    break;
                }
                d = (u[(n + 928) >> 2] | 0) == (o | 0) ? d : 0;
                C = 22;
                break;
            }
            $ = u[(n + 520) >> 2] | 0;
            if (!$) C = 21;
            else {
                w = 0;
                while(1){
                    d = (n + 524 + ((w * 24) | 0)) | 0;
                    if (((eZ(Z(a[d >> 2]), r) | 0 ? eZ(Z(a[(n + 524 + ((w * 24) | 0) + 4) >> 2]), e) | 0 : 0) ? (u[(n + 524 + ((w * 24) | 0) + 8) >> 2] | 0) == (f | 0) : 0) ? (u[(n + 524 + ((w * 24) | 0) + 12) >> 2] | 0) == (o | 0) : 0) {
                        C = 22;
                        break a;
                    }
                    w = (w + 1) | 0;
                    if (w >>> 0 >= $ >>> 0) {
                        C = 21;
                        break;
                    }
                }
            }
        } else {
            y = Z(e4(n, 2, c));
            p = Z(e4(n, 0, c));
            d = (n + 916) | 0;
            G = Z(a[d >> 2]);
            E = Z(a[(n + 920) >> 2]);
            P = Z(a[(n + 932) >> 2]);
            if (!(eW(f, r, o, e, u[(n + 924) >> 2] | 0, G, u[(n + 928) >> 2] | 0, E, P, Z(a[(n + 936) >> 2]), y, p, h) | 0)) {
                $ = u[(n + 520) >> 2] | 0;
                if (!$) C = 21;
                else {
                    w = 0;
                    while(1){
                        d = (n + 524 + ((w * 24) | 0)) | 0;
                        P = Z(a[d >> 2]);
                        E = Z(a[(n + 524 + ((w * 24) | 0) + 4) >> 2]);
                        G = Z(a[(n + 524 + ((w * 24) | 0) + 16) >> 2]);
                        if (eW(f, r, o, e, u[(n + 524 + ((w * 24) | 0) + 8) >> 2] | 0, P, u[(n + 524 + ((w * 24) | 0) + 12) >> 2] | 0, E, G, Z(a[(n + 524 + ((w * 24) | 0) + 20) >> 2]), y, p, h) | 0) {
                            C = 22;
                            break a;
                        }
                        w = (w + 1) | 0;
                        if (w >>> 0 >= $ >>> 0) {
                            C = 21;
                            break;
                        }
                    }
                }
            } else C = 22;
        }
        while (0)
        do if ((C | 0) == 21) {
            if (!(i[11697] | 0)) {
                d = 0;
                C = 31;
            } else {
                d = 0;
                C = 28;
            }
        } else if ((C | 0) == 22) {
            w = (i[11697] | 0) != 0;
            if (!(((d | 0) != 0) & (L ^ 1))) if (w) {
                C = 28;
                break;
            } else {
                C = 31;
                break;
            }
            m = (d + 16) | 0;
            u[(n + 908) >> 2] = u[m >> 2];
            $ = (d + 20) | 0;
            u[(n + 912) >> 2] = u[$ >> 2];
            if (!(((i[11698] | 0) == 0) | (w ^ 1))) {
                u[M >> 2] = e3(A) | 0;
                u[(M + 4) >> 2] = A;
                e8(n, 4, 2972, M);
                w = u[(n + 972) >> 2] | 0;
                if (w | 0) gK[w & 127](n);
                f = e6(f, s) | 0;
                o = e6(o, s) | 0;
                R = +Z(a[m >> 2]);
                B = +Z(a[$ >> 2]);
                u[I >> 2] = f;
                u[(I + 4) >> 2] = o;
                l[(I + 8) >> 3] = +r;
                l[(I + 16) >> 3] = +e;
                l[(I + 24) >> 3] = R;
                l[(I + 32) >> 3] = B;
                u[(I + 40) >> 2] = b;
                e8(n, 4, 2989, I);
            }
        }
        while (0)
        if ((C | 0) == 28) {
            w = e3(A) | 0;
            u[m >> 2] = w;
            u[(m + 4) >> 2] = A;
            u[(m + 8) >> 2] = L ? 3047 : 11699;
            e8(n, 4, 3038, m);
            w = u[(n + 972) >> 2] | 0;
            if (w | 0) gK[w & 127](n);
            I = e6(f, s) | 0;
            C = e6(o, s) | 0;
            u[g >> 2] = I;
            u[(g + 4) >> 2] = C;
            l[(g + 8) >> 3] = +r;
            l[(g + 16) >> 3] = +e;
            u[(g + 24) >> 2] = b;
            e8(n, 4, 3049, g);
            C = 31;
        }
        if ((C | 0) == 31) {
            e9(n, r, e, t, f, o, c, v, s, h);
            if (i[11697] | 0) {
                w = u[2279] | 0;
                I = e3(w) | 0;
                u[S >> 2] = I;
                u[(S + 4) >> 2] = w;
                u[(S + 8) >> 2] = L ? 3047 : 11699;
                e8(n, 4, 3083, S);
                w = u[(n + 972) >> 2] | 0;
                if (w | 0) gK[w & 127](n);
                I = e6(f, s) | 0;
                S = e6(o, s) | 0;
                B = +Z(a[(n + 908) >> 2]);
                R = +Z(a[(n + 912) >> 2]);
                u[T >> 2] = I;
                u[(T + 4) >> 2] = S;
                l[(T + 8) >> 3] = B;
                l[(T + 16) >> 3] = R;
                u[(T + 24) >> 2] = b;
                e8(n, 4, 3092, T);
            }
            u[(n + 516) >> 2] = t;
            if (!d) {
                w = (n + 520) | 0;
                d = u[w >> 2] | 0;
                if ((d | 0) == 16) {
                    if (i[11697] | 0) e8(n, 4, 3124, x);
                    u[w >> 2] = 0;
                    d = 0;
                }
                if (s) d = (n + 916) | 0;
                else {
                    u[w >> 2] = d + 1;
                    d = (n + 524 + ((d * 24) | 0)) | 0;
                }
                a[d >> 2] = r;
                a[(d + 4) >> 2] = e;
                u[(d + 8) >> 2] = f;
                u[(d + 12) >> 2] = o;
                u[(d + 16) >> 2] = u[(n + 908) >> 2];
                u[(d + 20) >> 2] = u[(n + 912) >> 2];
                d = 0;
            }
        }
        if (s) {
            u[(n + 416) >> 2] = u[(n + 908) >> 2];
            u[(n + 420) >> 2] = u[(n + 912) >> 2];
            i[(n + 985) >> 0] = 1;
            i[N >> 0] = 0;
        }
        u[2279] = (u[2279] | 0) + -1;
        u[(n + 512) >> 2] = u[2278];
        k = O;
        return L | ((d | 0) == 0) | 0;
    }
    function e4(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = rr;
        i = Z(ih(n, r, e));
        return Z(i + Z(id(n, r, e)));
    }
    function e8(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = k;
        k = (k + 16) | 0;
        t = f;
        u[t >> 2] = i;
        if (!n) i = 0;
        else i = u[(n + 976) >> 2] | 0;
        ia(i, n, r, e, t);
        k = f;
        return;
    }
    function e3(n) {
        n = n | 0;
        return (n >>> 0 > 60 ? 3201 : (3201 + (60 - n)) | 0) | 0;
    }
    function e6(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = k;
        k = (k + 32) | 0;
        e = (t + 12) | 0;
        i = t;
        u[e >> 2] = u[254];
        u[(e + 4) >> 2] = u[255];
        u[(e + 8) >> 2] = u[256];
        u[i >> 2] = u[257];
        u[(i + 4) >> 2] = u[258];
        u[(i + 8) >> 2] = u[259];
        if ((n | 0) > 2) n = 11699;
        else n = u[((r ? i : e) + (n << 2)) >> 2] | 0;
        k = t;
        return n | 0;
    }
    function e9(n, r, e, t, o, c, l, v, b, h) {
        n = n | 0;
        r = Z(r);
        e = Z(e);
        t = t | 0;
        o = o | 0;
        c = c | 0;
        l = Z(l);
        v = Z(v);
        b = b | 0;
        h = h | 0;
        var d = 0, w = 0, $ = 0, m = 0, y = rr, p = rr, C = rr, M = rr, g = rr, A = rr, I = rr, S = 0, T = 0, x = 0, N = rr, L = rr, O = 0, P = rr, E = 0, G = 0, B = 0, R = 0, Y = 0, U = 0, j = 0, z = 0, D = 0, F = 0, K = 0, q = 0, H = 0, X = 0, J = 0, Q = 0, V = 0, W = 0, _ = rr, nn = rr, nr = rr, ne = rr, ni = rr, nt = 0, nu = 0, nf = 0, no = 0, nc = 0, na = rr, nl = rr, nv = rr, ns = rr, nb = rr, nk = rr, nh = 0, nd = rr, nw = rr, n$ = rr, nm = rr, ny = rr, np = rr, nC = 0, nM = 0, ng = rr, nA = rr, nI = 0, nS = 0, nT = 0, nx = 0, nN = rr, nL = 0, nO = 0, nP = 0, nE = 0, nG = 0, nB = 0, nR = 0, nY = rr, nU = 0, nj = 0;
        nR = k;
        k = (k + 16) | 0;
        nt = (nR + 12) | 0;
        nu = (nR + 8) | 0;
        nf = (nR + 4) | 0;
        no = nR;
        rA(n, ((o | 0) == 0) | ((rv(r) | 0) ^ 1), 3326);
        rA(n, ((c | 0) == 0) | ((rv(e) | 0) ^ 1), 3406);
        nO = im(n, t) | 0;
        u[(n + 496) >> 2] = nO;
        nG = iy(2, nO) | 0;
        nB = iy(0, nO) | 0;
        a[(n + 440) >> 2] = Z(ih(n, nG, l));
        a[(n + 444) >> 2] = Z(id(n, nG, l));
        a[(n + 428) >> 2] = Z(ih(n, nB, l));
        a[(n + 436) >> 2] = Z(id(n, nB, l));
        a[(n + 464) >> 2] = Z(ip(n, nG));
        a[(n + 468) >> 2] = Z(iC(n, nG));
        a[(n + 452) >> 2] = Z(ip(n, nB));
        a[(n + 460) >> 2] = Z(iC(n, nB));
        a[(n + 488) >> 2] = Z(iM(n, nG, l));
        a[(n + 492) >> 2] = Z(ig(n, nG, l));
        a[(n + 476) >> 2] = Z(iM(n, nB, l));
        a[(n + 484) >> 2] = Z(ig(n, nB, l));
        do if (!(u[(n + 964) >> 2] | 0)) {
            nP = (n + 948) | 0;
            nE = ((u[(n + 952) >> 2] | 0) - (u[nP >> 2] | 0)) >> 2;
            if (!nE) {
                iI(n, r, e, o, c, l, v);
                break;
            }
            if (!b ? iS(n, r, e, o, c, l, v) | 0 : 0) break;
            rO(n);
            Q = (n + 508) | 0;
            i[Q >> 0] = 0;
            nG = iy(u[(n + 4) >> 2] | 0, nO) | 0;
            nB = iT(nG, nO) | 0;
            nL = iw(nG) | 0;
            V = u[(n + 8) >> 2] | 0;
            nS = (n + 28) | 0;
            W = (u[nS >> 2] | 0) != 0;
            ny = nL ? l : v;
            ng = nL ? v : l;
            _ = Z(ix(n, nG, l));
            nn = Z(iN(n, nG, l));
            y = Z(ix(n, nB, l));
            np = Z(iL(n, nG, l));
            nA = Z(iL(n, nB, l));
            x = nL ? o : c;
            nI = nL ? c : o;
            nN = nL ? np : nA;
            g = nL ? nA : np;
            nm = Z(e4(n, 2, l));
            M = Z(e4(n, 0, l));
            p = Z(Z(ii((n + 364) | 0, l)) - nN);
            C = Z(Z(ii((n + 380) | 0, l)) - nN);
            A = Z(Z(ii((n + 372) | 0, v)) - g);
            I = Z(Z(ii((n + 388) | 0, v)) - g);
            nr = nL ? p : A;
            ne = nL ? C : I;
            nm = Z(r - nm);
            r = Z(nm - nN);
            if (rv(r) | 0) nN = r;
            else nN = Z(Mm(Z(Mp(r, C)), p));
            nw = Z(e - M);
            r = Z(nw - g);
            if (rv(r) | 0) n$ = r;
            else n$ = Z(Mm(Z(Mp(r, I)), A));
            p = nL ? nN : n$;
            nd = nL ? n$ : nN;
            a: do if ((x | 0) == 1) {
                t = 0;
                w = 0;
                while(1){
                    d = rp(n, w) | 0;
                    if (!t) {
                        if (Z(iP(d)) > Z(0.0) ? Z(iE(d)) > Z(0.0) : 0) t = d;
                        else t = 0;
                    } else if (iO(d) | 0) {
                        m = 0;
                        break a;
                    }
                    w = (w + 1) | 0;
                    if (w >>> 0 >= nE >>> 0) {
                        m = t;
                        break;
                    }
                }
            } else m = 0;
            while (0)
            S = (m + 500) | 0;
            T = (m + 504) | 0;
            t = 0;
            d = 0;
            r = Z(0.0);
            $ = 0;
            do {
                w = u[((u[nP >> 2] | 0) + ($ << 2)) >> 2] | 0;
                if ((u[(w + 36) >> 2] | 0) == 1) {
                    iG(w);
                    i[(w + 985) >> 0] = 1;
                    i[(w + 984) >> 0] = 0;
                } else {
                    ir(w);
                    if (b) it(w, im(w, nO) | 0, p, nd, nN);
                    do if ((u[(w + 24) >> 2] | 0) != 1) {
                        if ((w | 0) == (m | 0)) {
                            u[S >> 2] = u[2278];
                            a[T >> 2] = Z(0.0);
                            break;
                        } else {
                            iB(n, w, nN, o, n$, nN, n$, c, nO, h);
                            break;
                        }
                    } else {
                        if (d | 0) u[(d + 960) >> 2] = w;
                        u[(w + 960) >> 2] = 0;
                        d = w;
                        t = (t | 0) == 0 ? w : t;
                    }
                    while (0)
                    nk = Z(a[(w + 504) >> 2]);
                    r = Z(r + Z(nk + Z(e4(w, nG, nN))));
                }
                $ = ($ + 1) | 0;
            }while (($ | 0) != (nE | 0))
            B = r > p;
            nh = W & (((x | 0) == 2) & B) ? 1 : x;
            E = (nI | 0) == 1;
            Y = E & (b ^ 1);
            U = (nh | 0) == 1;
            j = (nh | 0) == 2;
            z = (976 + (nG << 2)) | 0;
            D = (nI | 2 | 0) == 2;
            X = E & (W ^ 1);
            F = (1040 + (nB << 2)) | 0;
            K = (1040 + (nG << 2)) | 0;
            q = (976 + (nB << 2)) | 0;
            H = (nI | 0) != 1;
            B = W & (((x | 0) != 0) & B);
            G = (n + 976) | 0;
            E = E ^ 1;
            r = p;
            O = 0;
            R = 0;
            nk = Z(0.0);
            ni = Z(0.0);
            while(1){
                b: do if (O >>> 0 < nE >>> 0) {
                    T = u[nP >> 2] | 0;
                    $ = 0;
                    I = Z(0.0);
                    A = Z(0.0);
                    C = Z(0.0);
                    p = Z(0.0);
                    w = 0;
                    d = 0;
                    m = O;
                    while(1){
                        S = u[(T + (m << 2)) >> 2] | 0;
                        if ((u[(S + 36) >> 2] | 0) != 1 ? ((u[(S + 940) >> 2] = R), (u[(S + 24) >> 2] | 0) != 1) : 0) {
                            M = Z(e4(S, nG, nN));
                            J = u[z >> 2] | 0;
                            e = Z(ii((S + 380 + (J << 3)) | 0, ny));
                            g = Z(a[(S + 504) >> 2]);
                            e = Z(Mp(e, g));
                            e = Z(Mm(Z(ii((S + 364 + (J << 3)) | 0, ny)), e));
                            if (W & (($ | 0) != 0) & (Z(M + Z(A + e)) > r)) {
                                c = $;
                                M = I;
                                x = m;
                                break b;
                            }
                            M = Z(M + e);
                            e = Z(A + M);
                            M = Z(I + M);
                            if (iO(S) | 0) {
                                C = Z(C + Z(iP(S)));
                                p = Z(p - Z(g * Z(iE(S))));
                            }
                            if (d | 0) u[(d + 960) >> 2] = S;
                            u[(S + 960) >> 2] = 0;
                            $ = ($ + 1) | 0;
                            d = S;
                            w = (w | 0) == 0 ? S : w;
                        } else {
                            M = I;
                            e = A;
                        }
                        m = (m + 1) | 0;
                        if (m >>> 0 < nE >>> 0) {
                            I = M;
                            A = e;
                        } else {
                            c = $;
                            x = m;
                            break;
                        }
                    }
                } else {
                    c = 0;
                    M = Z(0.0);
                    C = Z(0.0);
                    p = Z(0.0);
                    w = 0;
                    x = O;
                }
                while (0)
                J = (C > Z(0.0)) & (C < Z(1.0));
                N = J ? Z(1.0) : C;
                J = (p > Z(0.0)) & (p < Z(1.0));
                I = J ? Z(1.0) : p;
                do if (!U) {
                    if (!((M < nr) & ((rv(nr) | 0) ^ 1))) {
                        if (!((M > ne) & ((rv(ne) | 0) ^ 1))) {
                            if (!(i[((u[G >> 2] | 0) + 3) >> 0] | 0)) {
                                if (!(N == Z(0.0)) ? !(Z(iP(n)) == Z(0.0)) : 0) {
                                    J = 53;
                                    break;
                                }
                                r = M;
                                J = 53;
                            } else J = 51;
                        } else {
                            r = ne;
                            J = 51;
                        }
                    } else {
                        r = nr;
                        J = 51;
                    }
                } else J = 51;
                while (0)
                if ((J | 0) == 51) {
                    J = 0;
                    if (rv(r) | 0) J = 53;
                    else {
                        L = Z(r - M);
                        P = r;
                    }
                }
                if ((J | 0) == 53) {
                    J = 0;
                    if (M < Z(0.0)) {
                        L = Z(-M);
                        P = r;
                    } else {
                        L = Z(0.0);
                        P = r;
                    }
                }
                if (!Y ? ((nc = (w | 0) == 0), !nc) : 0) {
                    $ = u[z >> 2] | 0;
                    m = L < Z(0.0);
                    g = Z(L / I);
                    S = L > Z(0.0);
                    A = Z(L / N);
                    C = Z(0.0);
                    M = Z(0.0);
                    r = Z(0.0);
                    d = w;
                    do {
                        e = Z(ii((d + 380 + ($ << 3)) | 0, ny));
                        p = Z(ii((d + 364 + ($ << 3)) | 0, ny));
                        p = Z(Mp(e, Z(Mm(p, Z(a[(d + 504) >> 2])))));
                        if (m) {
                            e = Z(p * Z(iE(d)));
                            if (e != Z(-0.0) ? ((nY = Z(p - Z(g * e))), (na = Z(iR(d, nG, nY, P, nN))), nY != na) : 0) {
                                C = Z(C - Z(na - p));
                                r = Z(r + e);
                            }
                        } else if ((S ? ((nl = Z(iP(d))), nl != Z(0.0)) : 0) ? ((nY = Z(p + Z(A * nl))), (nv = Z(iR(d, nG, nY, P, nN))), nY != nv) : 0) {
                            C = Z(C - Z(nv - p));
                            M = Z(M - nl);
                        }
                        d = u[(d + 960) >> 2] | 0;
                    }while ((d | 0) != 0)
                    r = Z(I + r);
                    p = Z(L + C);
                    if (!nc) {
                        g = Z(N + M);
                        m = u[z >> 2] | 0;
                        S = p < Z(0.0);
                        T = r == Z(0.0);
                        A = Z(p / r);
                        $ = p > Z(0.0);
                        g = Z(p / g);
                        r = Z(0.0);
                        do {
                            nY = Z(ii((w + 380 + (m << 3)) | 0, ny));
                            C = Z(ii((w + 364 + (m << 3)) | 0, ny));
                            C = Z(Mp(nY, Z(Mm(C, Z(a[(w + 504) >> 2])))));
                            if (S) {
                                nY = Z(C * Z(iE(w)));
                                p = Z(-nY);
                                if (nY != Z(-0.0)) {
                                    nY = Z(A * p);
                                    p = Z(iR(w, nG, Z(C + (T ? p : nY)), P, nN));
                                } else p = C;
                            } else if ($ ? ((ns = Z(iP(w))), ns != Z(0.0)) : 0) p = Z(iR(w, nG, Z(C + Z(g * ns)), P, nN));
                            else p = C;
                            r = Z(r - Z(p - C));
                            M = Z(e4(w, nG, nN));
                            e = Z(e4(w, nB, nN));
                            p = Z(p + M);
                            a[nu >> 2] = p;
                            u[no >> 2] = 1;
                            C = Z(a[(w + 396) >> 2]);
                            c: do if (rv(C) | 0) {
                                d = rv(nd) | 0;
                                do if (!d) {
                                    if (B | (ie(w, nB, nd) | 0 | E)) break;
                                    if ((iY(n, w) | 0) != 4) break;
                                    if ((u[((iU(w, nB) | 0) + 4) >> 2] | 0) == 3) break;
                                    if ((u[((ij(w, nB) | 0) + 4) >> 2] | 0) == 3) break;
                                    a[nt >> 2] = nd;
                                    u[nf >> 2] = 1;
                                    break c;
                                }
                                while (0)
                                if (ie(w, nB, nd) | 0) {
                                    d = u[(w + 992 + (u[q >> 2] << 2)) >> 2] | 0;
                                    nY = Z(e + Z(ii(d, nd)));
                                    a[nt >> 2] = nY;
                                    d = H & ((u[(d + 4) >> 2] | 0) == 2);
                                    u[nf >> 2] = ((rv(nY) | 0 | d) ^ 1) & 1;
                                    break;
                                } else {
                                    a[nt >> 2] = nd;
                                    u[nf >> 2] = d ? 0 : 2;
                                    break;
                                }
                            } else {
                                nY = Z(p - M);
                                N = Z(nY / C);
                                nY = Z(C * nY);
                                u[nf >> 2] = 1;
                                a[nt >> 2] = Z(e + (nL ? N : nY));
                            }
                            while (0)
                            iz(w, nG, P, nN, no, nu);
                            iz(w, nB, nd, nN, nf, nt);
                            do if (!(ie(w, nB, nd) | 0) ? (iY(n, w) | 0) == 4 : 0) {
                                if ((u[((iU(w, nB) | 0) + 4) >> 2] | 0) == 3) {
                                    d = 0;
                                    break;
                                }
                                d = (u[((ij(w, nB) | 0) + 4) >> 2] | 0) != 3;
                            } else d = 0;
                            while (0)
                            nY = Z(a[nu >> 2]);
                            N = Z(a[nt >> 2]);
                            nU = u[no >> 2] | 0;
                            nj = u[nf >> 2] | 0;
                            e1(w, nL ? nY : N, nL ? N : nY, nO, nL ? nU : nj, nL ? nj : nU, nN, n$, b & (d ^ 1), 3488, h) | 0;
                            i[Q >> 0] = i[Q >> 0] | i[(w + 508) >> 0];
                            w = u[(w + 960) >> 2] | 0;
                        }while ((w | 0) != 0)
                    } else r = Z(0.0);
                } else r = Z(0.0);
                r = Z(L + r);
                nj = (r < Z(0.0)) & 1;
                i[Q >> 0] = nj | f[Q >> 0];
                if (j & (r > Z(0.0))) {
                    d = u[z >> 2] | 0;
                    if ((u[(n + 364 + (d << 3) + 4) >> 2] | 0) != 0 ? ((nb = Z(ii((n + 364 + (d << 3)) | 0, ny))), nb >= Z(0.0)) : 0) p = Z(Mm(Z(0.0), Z(nb - Z(P - r))));
                    else p = Z(0.0);
                } else p = r;
                S = O >>> 0 < x >>> 0;
                if (S) {
                    m = u[nP >> 2] | 0;
                    $ = O;
                    d = 0;
                    do {
                        w = u[(m + ($ << 2)) >> 2] | 0;
                        if (!(u[(w + 24) >> 2] | 0)) {
                            d = ((((u[((iU(w, nG) | 0) + 4) >> 2] | 0) == 3) & 1) + d) | 0;
                            d = (d + (((u[((ij(w, nG) | 0) + 4) >> 2] | 0) == 3) & 1)) | 0;
                        }
                        $ = ($ + 1) | 0;
                    }while (($ | 0) != (x | 0))
                    if (d) {
                        M = Z(0.0);
                        e = Z(0.0);
                    } else J = 101;
                } else J = 101;
                d: do if ((J | 0) == 101) {
                    J = 0;
                    switch(V | 0){
                        case 1:
                            {
                                d = 0;
                                M = Z(p * Z(0.5));
                                e = Z(0.0);
                                break d;
                            }
                        case 2:
                            {
                                d = 0;
                                M = p;
                                e = Z(0.0);
                                break d;
                            }
                        case 3:
                            {
                                if (c >>> 0 <= 1) {
                                    d = 0;
                                    M = Z(0.0);
                                    e = Z(0.0);
                                    break d;
                                }
                                e = Z(((c + -1) | 0) >>> 0);
                                d = 0;
                                M = Z(0.0);
                                e = Z(Z(Mm(p, Z(0.0))) / e);
                                break d;
                            }
                        case 5:
                            {
                                e = Z(p / Z(((c + 1) | 0) >>> 0));
                                d = 0;
                                M = e;
                                break d;
                            }
                        case 4:
                            {
                                e = Z(p / Z(c >>> 0));
                                d = 0;
                                M = Z(e * Z(0.5));
                                break d;
                            }
                        default:
                            {
                                d = 0;
                                M = Z(0.0);
                                e = Z(0.0);
                                break d;
                            }
                    }
                }
                while (0)
                r = Z(_ + M);
                if (S) {
                    C = Z(p / Z(d | 0));
                    $ = u[nP >> 2] | 0;
                    w = O;
                    p = Z(0.0);
                    do {
                        d = u[($ + (w << 2)) >> 2] | 0;
                        e: do if ((u[(d + 36) >> 2] | 0) != 1) {
                            switch(u[(d + 24) >> 2] | 0){
                                case 1:
                                    {
                                        if (iD(d, nG) | 0) {
                                            if (!b) break e;
                                            nY = Z(iF(d, nG, P));
                                            nY = Z(nY + Z(ip(n, nG)));
                                            nY = Z(nY + Z(ih(d, nG, nN)));
                                            a[(d + 400 + (u[K >> 2] << 2)) >> 2] = nY;
                                            break e;
                                        }
                                        break;
                                    }
                                case 0:
                                    {
                                        nj = (u[((iU(d, nG) | 0) + 4) >> 2] | 0) == 3;
                                        nY = Z(C + r);
                                        r = nj ? nY : r;
                                        if (b) {
                                            nj = (d + 400 + (u[K >> 2] << 2)) | 0;
                                            a[nj >> 2] = Z(r + Z(a[nj >> 2]));
                                        }
                                        nj = (u[((ij(d, nG) | 0) + 4) >> 2] | 0) == 3;
                                        nY = Z(C + r);
                                        r = nj ? nY : r;
                                        if (Y) {
                                            nY = Z(e + Z(e4(d, nG, nN)));
                                            p = nd;
                                            r = Z(r + Z(nY + Z(a[(d + 504) >> 2])));
                                            break e;
                                        } else {
                                            r = Z(r + Z(e + Z(iK(d, nG, nN))));
                                            p = Z(Mm(p, Z(iK(d, nB, nN))));
                                            break e;
                                        }
                                    }
                                default:
                                    {}
                            }
                            if (b) {
                                nY = Z(M + Z(ip(n, nG)));
                                nj = (d + 400 + (u[K >> 2] << 2)) | 0;
                                a[nj >> 2] = Z(nY + Z(a[nj >> 2]));
                            }
                        }
                        while (0)
                        w = (w + 1) | 0;
                    }while ((w | 0) != (x | 0))
                } else p = Z(0.0);
                e = Z(nn + r);
                if (D) M = Z(Z(iR(n, nB, Z(nA + p), ng, l)) - nA);
                else M = nd;
                C = Z(Z(iR(n, nB, Z(nA + (X ? nd : p)), ng, l)) - nA);
                if (S & b) {
                    w = O;
                    do {
                        $ = u[((u[nP >> 2] | 0) + (w << 2)) >> 2] | 0;
                        do if ((u[($ + 36) >> 2] | 0) != 1) {
                            if ((u[($ + 24) >> 2] | 0) == 1) {
                                if (iD($, nB) | 0) {
                                    nY = Z(iF($, nB, nd));
                                    nY = Z(nY + Z(ip(n, nB)));
                                    nY = Z(nY + Z(ih($, nB, nN)));
                                    d = u[F >> 2] | 0;
                                    a[($ + 400 + (d << 2)) >> 2] = nY;
                                    if (!(rv(nY) | 0)) break;
                                } else d = u[F >> 2] | 0;
                                nY = Z(ip(n, nB));
                                a[($ + 400 + (d << 2)) >> 2] = Z(nY + Z(ih($, nB, nN)));
                                break;
                            }
                            d = iY(n, $) | 0;
                            do if ((d | 0) == 4) {
                                if ((u[((iU($, nB) | 0) + 4) >> 2] | 0) == 3) {
                                    J = 139;
                                    break;
                                }
                                if ((u[((ij($, nB) | 0) + 4) >> 2] | 0) == 3) {
                                    J = 139;
                                    break;
                                }
                                if (ie($, nB, nd) | 0) {
                                    r = y;
                                    break;
                                }
                                nU = u[($ + 908 + (u[z >> 2] << 2)) >> 2] | 0;
                                u[nt >> 2] = nU;
                                r = Z(a[($ + 396) >> 2]);
                                nj = rv(r) | 0;
                                p = ((u[s >> 2] = nU), Z(a[s >> 2]));
                                if (nj) r = C;
                                else {
                                    L = Z(e4($, nB, nN));
                                    nY = Z(p / r);
                                    r = Z(r * p);
                                    r = Z(L + (nL ? nY : r));
                                }
                                a[nu >> 2] = r;
                                a[nt >> 2] = Z(Z(e4($, nG, nN)) + p);
                                u[nf >> 2] = 1;
                                u[no >> 2] = 1;
                                iz($, nG, P, nN, nf, nt);
                                iz($, nB, nd, nN, no, nu);
                                r = Z(a[nt >> 2]);
                                L = Z(a[nu >> 2]);
                                nY = nL ? r : L;
                                r = nL ? L : r;
                                nj = ((rv(nY) | 0) ^ 1) & 1;
                                e1($, nY, r, nO, nj, ((rv(r) | 0) ^ 1) & 1, nN, n$, 1, 3493, h) | 0;
                                r = y;
                            } else J = 139;
                            while (0)
                            f: do if ((J | 0) == 139) {
                                J = 0;
                                r = Z(M - Z(iK($, nB, nN)));
                                do if ((u[((iU($, nB) | 0) + 4) >> 2] | 0) == 3) {
                                    if ((u[((ij($, nB) | 0) + 4) >> 2] | 0) != 3) break;
                                    r = Z(y + Z(Mm(Z(0.0), Z(r * Z(0.5)))));
                                    break f;
                                }
                                while (0)
                                if ((u[((ij($, nB) | 0) + 4) >> 2] | 0) == 3) {
                                    r = y;
                                    break;
                                }
                                if ((u[((iU($, nB) | 0) + 4) >> 2] | 0) == 3) {
                                    r = Z(y + Z(Mm(Z(0.0), r)));
                                    break;
                                }
                                switch(d | 0){
                                    case 1:
                                        {
                                            r = y;
                                            break f;
                                        }
                                    case 2:
                                        {
                                            r = Z(y + Z(r * Z(0.5)));
                                            break f;
                                        }
                                    default:
                                        {
                                            r = Z(y + r);
                                            break f;
                                        }
                                }
                            }
                            while (0)
                            nY = Z(nk + r);
                            nj = ($ + 400 + (u[F >> 2] << 2)) | 0;
                            a[nj >> 2] = Z(nY + Z(a[nj >> 2]));
                        }
                        while (0)
                        w = (w + 1) | 0;
                    }while ((w | 0) != (x | 0))
                }
                nk = Z(nk + C);
                ni = Z(Mm(ni, e));
                c = (R + 1) | 0;
                if (x >>> 0 >= nE >>> 0) break;
                else {
                    r = P;
                    O = x;
                    R = c;
                }
            }
            do if (b) {
                d = c >>> 0 > 1;
                if (!d ? !(iq(n) | 0) : 0) break;
                if (!(rv(nd) | 0)) {
                    r = Z(nd - nk);
                    g: do switch(u[(n + 12) >> 2] | 0){
                        case 3:
                            {
                                y = Z(y + r);
                                A = Z(0.0);
                                break;
                            }
                        case 2:
                            {
                                y = Z(y + Z(r * Z(0.5)));
                                A = Z(0.0);
                                break;
                            }
                        case 4:
                            {
                                if (nd > nk) A = Z(r / Z(c >>> 0));
                                else A = Z(0.0);
                                break;
                            }
                        case 7:
                            if (nd > nk) {
                                y = Z(y + Z(r / Z((c << 1) >>> 0)));
                                A = Z(r / Z(c >>> 0));
                                A = d ? A : Z(0.0);
                                break g;
                            } else {
                                y = Z(y + Z(r * Z(0.5)));
                                A = Z(0.0);
                                break g;
                            }
                        case 6:
                            {
                                A = Z(r / Z(R >>> 0));
                                A = (nd > nk) & d ? A : Z(0.0);
                                break;
                            }
                        default:
                            A = Z(0.0);
                    }
                    while (0)
                    if (c | 0) {
                        S = (1040 + (nB << 2)) | 0;
                        T = (976 + (nB << 2)) | 0;
                        m = 0;
                        w = 0;
                        while(1){
                            h: do if (w >>> 0 < nE >>> 0) {
                                p = Z(0.0);
                                C = Z(0.0);
                                r = Z(0.0);
                                $ = w;
                                while(1){
                                    d = u[((u[nP >> 2] | 0) + ($ << 2)) >> 2] | 0;
                                    do if ((u[(d + 36) >> 2] | 0) != 1 ? (u[(d + 24) >> 2] | 0) == 0 : 0) {
                                        if ((u[(d + 940) >> 2] | 0) != (m | 0)) break h;
                                        if (iH(d, nB) | 0) {
                                            nY = Z(a[(d + 908 + (u[T >> 2] << 2)) >> 2]);
                                            r = Z(Mm(r, Z(nY + Z(e4(d, nB, nN)))));
                                        }
                                        if ((iY(n, d) | 0) != 5) break;
                                        nb = Z(iX(d));
                                        nb = Z(nb + Z(ih(d, 0, nN)));
                                        nY = Z(a[(d + 912) >> 2]);
                                        nY = Z(Z(nY + Z(e4(d, 0, nN))) - nb);
                                        nb = Z(Mm(C, nb));
                                        nY = Z(Mm(p, nY));
                                        p = nY;
                                        C = nb;
                                        r = Z(Mm(r, Z(nb + nY)));
                                    }
                                    while (0)
                                    d = ($ + 1) | 0;
                                    if (d >>> 0 < nE >>> 0) $ = d;
                                    else {
                                        $ = d;
                                        break;
                                    }
                                }
                            } else {
                                C = Z(0.0);
                                r = Z(0.0);
                                $ = w;
                            }
                            while (0)
                            g = Z(A + r);
                            e = y;
                            y = Z(y + g);
                            if (w >>> 0 < $ >>> 0) {
                                M = Z(e + C);
                                d = w;
                                do {
                                    w = u[((u[nP >> 2] | 0) + (d << 2)) >> 2] | 0;
                                    i: do if ((u[(w + 36) >> 2] | 0) != 1 ? (u[(w + 24) >> 2] | 0) == 0 : 0) switch(iY(n, w) | 0){
                                        case 1:
                                            {
                                                nY = Z(e + Z(ih(w, nB, nN)));
                                                a[(w + 400 + (u[S >> 2] << 2)) >> 2] = nY;
                                                break i;
                                            }
                                        case 3:
                                            {
                                                nY = Z(Z(y - Z(id(w, nB, nN))) - Z(a[(w + 908 + (u[T >> 2] << 2)) >> 2]));
                                                a[(w + 400 + (u[S >> 2] << 2)) >> 2] = nY;
                                                break i;
                                            }
                                        case 2:
                                            {
                                                nY = Z(e + Z(Z(g - Z(a[(w + 908 + (u[T >> 2] << 2)) >> 2])) * Z(0.5)));
                                                a[(w + 400 + (u[S >> 2] << 2)) >> 2] = nY;
                                                break i;
                                            }
                                        case 4:
                                            {
                                                nY = Z(e + Z(ih(w, nB, nN)));
                                                a[(w + 400 + (u[S >> 2] << 2)) >> 2] = nY;
                                                if (ie(w, nB, nd) | 0) break i;
                                                if (nL) {
                                                    p = Z(a[(w + 908) >> 2]);
                                                    r = Z(p + Z(e4(w, nG, nN)));
                                                    C = g;
                                                } else {
                                                    C = Z(a[(w + 912) >> 2]);
                                                    C = Z(C + Z(e4(w, nB, nN)));
                                                    r = g;
                                                    p = Z(a[(w + 908) >> 2]);
                                                }
                                                if (eZ(r, p) | 0 ? eZ(C, Z(a[(w + 912) >> 2])) | 0 : 0) break i;
                                                e1(w, r, C, nO, 1, 1, nN, n$, 1, 3501, h) | 0;
                                                break i;
                                            }
                                        case 5:
                                            {
                                                a[(w + 404) >> 2] = Z(Z(M - Z(iX(w))) + Z(iF(w, 0, nd)));
                                                break i;
                                            }
                                        default:
                                            break i;
                                    }
                                    while (0)
                                    d = (d + 1) | 0;
                                }while ((d | 0) != ($ | 0))
                            }
                            m = (m + 1) | 0;
                            if ((m | 0) == (c | 0)) break;
                            else w = $;
                        }
                    }
                }
            }
            while (0)
            a[(n + 908) >> 2] = Z(iR(n, 2, nm, l, l));
            a[(n + 912) >> 2] = Z(iR(n, 0, nw, v, l));
            if ((nh | 0) != 0 ? ((nC = u[(n + 32) >> 2] | 0), (nM = (nh | 0) == 2), !(nM & ((nC | 0) != 2))) : 0) {
                if (nM & ((nC | 0) == 2)) {
                    r = Z(np + P);
                    r = Z(Mm(Z(Mp(r, Z(iZ(n, nG, ni, ny)))), np));
                    J = 198;
                }
            } else {
                r = Z(iR(n, nG, ni, ny, l));
                J = 198;
            }
            if ((J | 0) == 198) a[(n + 908 + (u[(976 + (nG << 2)) >> 2] << 2)) >> 2] = r;
            if ((nI | 0) != 0 ? ((nT = u[(n + 32) >> 2] | 0), (nx = (nI | 0) == 2), !(nx & ((nT | 0) != 2))) : 0) {
                if (nx & ((nT | 0) == 2)) {
                    r = Z(nA + nd);
                    r = Z(Mm(Z(Mp(r, Z(iZ(n, nB, Z(nA + nk), ng)))), nA));
                    J = 204;
                }
            } else {
                r = Z(iR(n, nB, Z(nA + nk), ng, l));
                J = 204;
            }
            if ((J | 0) == 204) a[(n + 908 + (u[(976 + (nB << 2)) >> 2] << 2)) >> 2] = r;
            if (b) {
                if ((u[nS >> 2] | 0) == 2) {
                    w = (976 + (nB << 2)) | 0;
                    $ = (1040 + (nB << 2)) | 0;
                    d = 0;
                    do {
                        m = rp(n, d) | 0;
                        if (!(u[(m + 24) >> 2] | 0)) {
                            nU = u[w >> 2] | 0;
                            nY = Z(a[(n + 908 + (nU << 2)) >> 2]);
                            nj = (m + 400 + (u[$ >> 2] << 2)) | 0;
                            nY = Z(nY - Z(a[nj >> 2]));
                            a[nj >> 2] = Z(nY - Z(a[(m + 908 + (nU << 2)) >> 2]));
                        }
                        d = (d + 1) | 0;
                    }while ((d | 0) != (nE | 0))
                }
                if (t | 0) {
                    d = nL ? nh : o;
                    do {
                        iJ(n, t, nN, d, n$, nO, h);
                        t = u[(t + 960) >> 2] | 0;
                    }while ((t | 0) != 0)
                }
                d = (nG | 2 | 0) == 3;
                w = (nB | 2 | 0) == 3;
                if (d | w) {
                    t = 0;
                    do {
                        $ = u[((u[nP >> 2] | 0) + (t << 2)) >> 2] | 0;
                        if ((u[($ + 36) >> 2] | 0) != 1) {
                            if (d) iQ(n, $, nG);
                            if (w) iQ(n, $, nB);
                        }
                        t = (t + 1) | 0;
                    }while ((t | 0) != (nE | 0))
                }
            }
        } else iA(n, r, e, o, c, l, v);
        while (0)
        k = nR;
        return;
    }
    function e7(n, r) {
        n = n | 0;
        r = Z(r);
        var e = 0;
        rk(n, r >= Z(0.0), 3147);
        e = r == Z(0.0);
        a[(n + 4) >> 2] = e ? Z(0.0) : r;
        return;
    }
    function e5(n, r, e, t) {
        n = n | 0;
        r = Z(r);
        e = Z(e);
        t = t | 0;
        var f = rr, o = rr, c = 0, l = 0, v = 0;
        u[2278] = (u[2278] | 0) + 1;
        ir(n);
        if (!(ie(n, 2, r) | 0)) {
            f = Z(ii((n + 380) | 0, r));
            if (!(f >= Z(0.0))) {
                v = ((rv(r) | 0) ^ 1) & 1;
                f = r;
            } else v = 2;
        } else {
            f = Z(ii(u[(n + 992) >> 2] | 0, r));
            v = 1;
            f = Z(f + Z(e4(n, 2, r)));
        }
        if (!(ie(n, 0, e) | 0)) {
            o = Z(ii((n + 388) | 0, e));
            if (!(o >= Z(0.0))) {
                l = ((rv(e) | 0) ^ 1) & 1;
                o = e;
            } else l = 2;
        } else {
            o = Z(ii(u[(n + 996) >> 2] | 0, e));
            l = 1;
            o = Z(o + Z(e4(n, 0, r)));
        }
        c = (n + 976) | 0;
        if (e1(n, f, o, t, v, l, r, e, 1, 3189, u[c >> 2] | 0) | 0 ? (it(n, u[(n + 496) >> 2] | 0, r, e, r), iu(n, Z(a[((u[c >> 2] | 0) + 4) >> 2]), Z(0.0), Z(0.0)), i[11696] | 0) : 0) eJ(n, 7);
        return;
    }
    function ir(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        o = (c + 24) | 0;
        f = (c + 16) | 0;
        i = (c + 8) | 0;
        t = c;
        e = 0;
        do {
            r = (n + 380 + (e << 3)) | 0;
            if (!((u[(n + 380 + (e << 3) + 4) >> 2] | 0) != 0 ? ((a = r), (l = u[(a + 4) >> 2] | 0), (v = i), (u[v >> 2] = u[a >> 2]), (u[(v + 4) >> 2] = l), (v = (n + 364 + (e << 3)) | 0), (l = u[(v + 4) >> 2] | 0), (a = t), (u[a >> 2] = u[v >> 2]), (u[(a + 4) >> 2] = l), (u[f >> 2] = u[i >> 2]), (u[(f + 4) >> 2] = u[(i + 4) >> 2]), (u[o >> 2] = u[t >> 2]), (u[(o + 4) >> 2] = u[(t + 4) >> 2]), eX(f, o) | 0) : 0)) r = (n + 348 + (e << 3)) | 0;
            u[(n + 992 + (e << 2)) >> 2] = r;
            e = (e + 1) | 0;
        }while ((e | 0) != 2)
        k = c;
        return;
    }
    function ie(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0;
        n = u[(n + 992 + (u[(976 + (r << 2)) >> 2] << 2)) >> 2] | 0;
        switch(u[(n + 4) >> 2] | 0){
            case 0:
            case 3:
                {
                    n = 0;
                    break;
                }
            case 1:
                {
                    if (Z(a[n >> 2]) < Z(0.0)) n = 0;
                    else i = 5;
                    break;
                }
            case 2:
                {
                    if (Z(a[n >> 2]) < Z(0.0)) n = 0;
                    else n = (rv(e) | 0) ^ 1;
                    break;
                }
            default:
                i = 5;
        }
        if ((i | 0) == 5) n = 1;
        return n | 0;
    }
    function ii(n, r) {
        n = n | 0;
        r = Z(r);
        switch(u[(n + 4) >> 2] | 0){
            case 2:
                {
                    r = Z(Z(Z(a[n >> 2]) * r) / Z(100.0));
                    break;
                }
            case 1:
                {
                    r = Z(a[n >> 2]);
                    break;
                }
            default:
                r = Z(C);
        }
        return Z(r);
    }
    function it(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        i = Z(i);
        t = Z(t);
        var f = 0, o = rr;
        r = u[(n + 944) >> 2] | 0 ? r : 1;
        f = iy(u[(n + 4) >> 2] | 0, r) | 0;
        r = iT(f, r) | 0;
        e = Z(i1(n, f, e));
        i = Z(i1(n, r, i));
        o = Z(e + Z(ih(n, f, t)));
        a[(n + 400 + (u[(1040 + (f << 2)) >> 2] << 2)) >> 2] = o;
        e = Z(e + Z(id(n, f, t)));
        a[(n + 400 + (u[(1e3 + (f << 2)) >> 2] << 2)) >> 2] = e;
        e = Z(i + Z(ih(n, r, t)));
        a[(n + 400 + (u[(1040 + (r << 2)) >> 2] << 2)) >> 2] = e;
        t = Z(i + Z(id(n, r, t)));
        a[(n + 400 + (u[(1e3 + (r << 2)) >> 2] << 2)) >> 2] = t;
        return;
    }
    function iu(n, r, e, i) {
        n = n | 0;
        r = Z(r);
        e = Z(e);
        i = Z(i);
        var t = 0, f = 0, o = rr, c = rr, l = 0, v = 0, s = rr, b = 0, k = rr, h = rr, d = rr, w = rr;
        if (!(r == Z(0.0))) {
            t = (n + 400) | 0;
            w = Z(a[t >> 2]);
            f = (n + 404) | 0;
            d = Z(a[f >> 2]);
            b = (n + 416) | 0;
            h = Z(a[b >> 2]);
            v = (n + 420) | 0;
            o = Z(a[v >> 2]);
            k = Z(w + e);
            s = Z(d + i);
            i = Z(k + h);
            c = Z(s + o);
            l = (u[(n + 988) >> 2] | 0) == 1;
            a[t >> 2] = Z(eV(w, r, 0, l));
            a[f >> 2] = Z(eV(d, r, 0, l));
            e = Z(MM(Z(h * r), Z(1.0)));
            if (eZ(e, Z(0.0)) | 0) f = 0;
            else f = (eZ(e, Z(1.0)) | 0) ^ 1;
            e = Z(MM(Z(o * r), Z(1.0)));
            if (eZ(e, Z(0.0)) | 0) t = 0;
            else t = (eZ(e, Z(1.0)) | 0) ^ 1;
            w = Z(eV(i, r, l & f, l & (f ^ 1)));
            a[b >> 2] = Z(w - Z(eV(k, r, 0, l)));
            w = Z(eV(c, r, l & t, l & (t ^ 1)));
            a[v >> 2] = Z(w - Z(eV(s, r, 0, l)));
            f = ((u[(n + 952) >> 2] | 0) - (u[(n + 948) >> 2] | 0)) >> 2;
            if (f | 0) {
                t = 0;
                do {
                    iu(rp(n, t) | 0, r, k, s);
                    t = (t + 1) | 0;
                }while ((t | 0) != (f | 0))
            }
        }
        return;
    }
    function io(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        switch(e | 0){
            case 5:
            case 0:
                {
                    n = C2(u[489] | 0, i, t) | 0;
                    break;
                }
            default:
                n = MA(i, t) | 0;
        }
        return n | 0;
    }
    function ic(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        t = k;
        k = (k + 16) | 0;
        f = t;
        u[f >> 2] = i;
        ia(n, 0, r, e, f);
        k = t;
        return;
    }
    function ia(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        n = n | 0 ? n : 956;
        g8[u[(n + 8) >> 2] & 1](n, r, e, i, t) | 0;
        if ((e | 0) == 5) nZ();
        else return;
    }
    function il(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i[(n + r) >> 0] = e & 1;
        return;
    }
    function iv(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        u[n >> 2] = 0;
        u[(n + 4) >> 2] = 0;
        u[(n + 8) >> 2] = 0;
        e = (r + 4) | 0;
        i = ((u[e >> 2] | 0) - (u[r >> 2] | 0)) >> 2;
        if (i | 0) {
            is(n, i);
            ib(n, u[r >> 2] | 0, u[e >> 2] | 0, i);
        }
        return;
    }
    function is(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        if ((ik(n) | 0) >>> 0 < r >>> 0) MI(n);
        if (r >>> 0 > 1073741823) nZ();
        else {
            e = MP(r << 2) | 0;
            u[(n + 4) >> 2] = e;
            u[n >> 2] = e;
            u[(n + 8) >> 2] = e + (r << 2);
            return;
        }
    }
    function ib(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        i = (n + 4) | 0;
        n = (e - r) | 0;
        if ((n | 0) > 0) {
            MK(u[i >> 2] | 0, r | 0, n | 0) | 0;
            u[i >> 2] = (u[i >> 2] | 0) + ((n >>> 2) << 2);
        }
        return;
    }
    function ik(n) {
        n = n | 0;
        return 1073741823;
    }
    function ih(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        if (iw(r) | 0 ? (u[(n + 96) >> 2] | 0) != 0 : 0) n = (n + 92) | 0;
        else n = rs((n + 60) | 0, u[(1040 + (r << 2)) >> 2] | 0, 992) | 0;
        return Z(i$(n, e));
    }
    function id(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        if (iw(r) | 0 ? (u[(n + 104) >> 2] | 0) != 0 : 0) n = (n + 100) | 0;
        else n = rs((n + 60) | 0, u[(1e3 + (r << 2)) >> 2] | 0, 992) | 0;
        return Z(i$(n, e));
    }
    function iw(n) {
        n = n | 0;
        return ((n | 1 | 0) == 3) | 0;
    }
    function i$(n, r) {
        n = n | 0;
        r = Z(r);
        if ((u[(n + 4) >> 2] | 0) == 3) r = Z(0.0);
        else r = Z(ii(n, r));
        return Z(r);
    }
    function im(n, r) {
        n = n | 0;
        r = r | 0;
        n = u[n >> 2] | 0;
        return ((n | 0) == 0 ? ((r | 0) > 1 ? r : 1) : n) | 0;
    }
    function iy(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        a: do if ((r | 0) == 2) {
            switch(n | 0){
                case 2:
                    {
                        n = 3;
                        break a;
                    }
                case 3:
                    break;
                default:
                    {
                        e = 4;
                        break a;
                    }
            }
            n = 2;
        } else e = 4;
        while (0)
        return n | 0;
    }
    function ip(n, r) {
        n = n | 0;
        r = r | 0;
        var e = rr;
        if (!((iw(r) | 0 ? (u[(n + 312) >> 2] | 0) != 0 : 0) ? ((e = Z(a[(n + 308) >> 2])), e >= Z(0.0)) : 0)) e = Z(Mm(Z(a[(rs((n + 276) | 0, u[(1040 + (r << 2)) >> 2] | 0, 992) | 0) >> 2]), Z(0.0)));
        return Z(e);
    }
    function iC(n, r) {
        n = n | 0;
        r = r | 0;
        var e = rr;
        if (!((iw(r) | 0 ? (u[(n + 320) >> 2] | 0) != 0 : 0) ? ((e = Z(a[(n + 316) >> 2])), e >= Z(0.0)) : 0)) e = Z(Mm(Z(a[(rs((n + 276) | 0, u[(1e3 + (r << 2)) >> 2] | 0, 992) | 0) >> 2]), Z(0.0)));
        return Z(e);
    }
    function iM(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = rr;
        if (!((iw(r) | 0 ? (u[(n + 240) >> 2] | 0) != 0 : 0) ? ((i = Z(ii((n + 236) | 0, e))), i >= Z(0.0)) : 0)) i = Z(Mm(Z(ii(rs((n + 204) | 0, u[(1040 + (r << 2)) >> 2] | 0, 992) | 0, e)), Z(0.0)));
        return Z(i);
    }
    function ig(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = rr;
        if (!((iw(r) | 0 ? (u[(n + 248) >> 2] | 0) != 0 : 0) ? ((i = Z(ii((n + 244) | 0, e))), i >= Z(0.0)) : 0)) i = Z(Mm(Z(ii(rs((n + 204) | 0, u[(1e3 + (r << 2)) >> 2] | 0, 992) | 0, e)), Z(0.0)));
        return Z(i);
    }
    function iA(n, r, e, i, t, f, o) {
        n = n | 0;
        r = Z(r);
        e = Z(e);
        i = i | 0;
        t = t | 0;
        f = Z(f);
        o = Z(o);
        var c = rr, l = rr, v = rr, s = rr, b = rr, h = rr, d = 0, w = 0, $ = 0;
        $ = k;
        k = (k + 16) | 0;
        d = $;
        w = (n + 964) | 0;
        rA(n, (u[w >> 2] | 0) != 0, 3519);
        c = Z(iL(n, 2, r));
        l = Z(iL(n, 0, r));
        v = Z(e4(n, 2, r));
        s = Z(e4(n, 0, r));
        if (rv(r) | 0) b = r;
        else b = Z(Mm(Z(0.0), Z(Z(r - v) - c)));
        if (rv(e) | 0) h = e;
        else h = Z(Mm(Z(0.0), Z(Z(e - s) - l)));
        if (((i | 0) == 1) & ((t | 0) == 1)) {
            a[(n + 908) >> 2] = Z(iR(n, 2, Z(r - v), f, f));
            r = Z(iR(n, 0, Z(e - s), o, f));
        } else {
            g6[u[w >> 2] & 1](d, n, b, i, h, t);
            b = Z(c + Z(a[d >> 2]));
            h = Z(r - v);
            a[(n + 908) >> 2] = Z(iR(n, 2, (i | 2 | 0) == 2 ? b : h, f, f));
            h = Z(l + Z(a[(d + 4) >> 2]));
            r = Z(e - s);
            r = Z(iR(n, 0, (t | 2 | 0) == 2 ? h : r, o, f));
        }
        a[(n + 912) >> 2] = r;
        k = $;
        return;
    }
    function iI(n, r, e, i, t, u, f) {
        n = n | 0;
        r = Z(r);
        e = Z(e);
        i = i | 0;
        t = t | 0;
        u = Z(u);
        f = Z(f);
        var o = rr, c = rr, l = rr, v = rr;
        l = Z(iL(n, 2, u));
        o = Z(iL(n, 0, u));
        v = Z(e4(n, 2, u));
        c = Z(e4(n, 0, u));
        r = Z(r - v);
        a[(n + 908) >> 2] = Z(iR(n, 2, (i | 2 | 0) == 2 ? l : r, u, u));
        e = Z(e - c);
        a[(n + 912) >> 2] = Z(iR(n, 0, (t | 2 | 0) == 2 ? o : e, f, u));
        return;
    }
    function iS(n, r, e, i, t, u, f) {
        n = n | 0;
        r = Z(r);
        e = Z(e);
        i = i | 0;
        t = t | 0;
        u = Z(u);
        f = Z(f);
        var o = 0, c = rr, l = rr;
        o = (i | 0) == 2;
        if ((!((r <= Z(0.0)) & o) ? !((e <= Z(0.0)) & ((t | 0) == 2)) : 0) ? !(((i | 0) == 1) & ((t | 0) == 1)) : 0) n = 0;
        else {
            c = Z(e4(n, 0, u));
            l = Z(e4(n, 2, u));
            o = ((r < Z(0.0)) & o) | (rv(r) | 0);
            r = Z(r - l);
            a[(n + 908) >> 2] = Z(iR(n, 2, o ? Z(0.0) : r, u, u));
            r = Z(e - c);
            o = ((e < Z(0.0)) & ((t | 0) == 2)) | (rv(e) | 0);
            a[(n + 912) >> 2] = Z(iR(n, 0, o ? Z(0.0) : r, f, u));
            n = 1;
        }
        return n | 0;
    }
    function iT(n, r) {
        n = n | 0;
        r = r | 0;
        if (iV(n) | 0) n = iy(2, r) | 0;
        else n = 0;
        return n | 0;
    }
    function ix(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        e = Z(iM(n, r, e));
        return Z(e + Z(ip(n, r)));
    }
    function iN(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        e = Z(ig(n, r, e));
        return Z(e + Z(iC(n, r)));
    }
    function iL(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = rr;
        i = Z(ix(n, r, e));
        return Z(i + Z(iN(n, r, e)));
    }
    function iO(n) {
        n = n | 0;
        if (!(u[(n + 24) >> 2] | 0)) {
            if (Z(iP(n)) != Z(0.0)) n = 1;
            else n = Z(iE(n)) != Z(0.0);
        } else n = 0;
        return n | 0;
    }
    function iP(n) {
        n = n | 0;
        var r = rr;
        if (u[(n + 944) >> 2] | 0) {
            r = Z(a[(n + 44) >> 2]);
            if (rv(r) | 0) {
                r = Z(a[(n + 40) >> 2]);
                n = (r > Z(0.0)) & ((rv(r) | 0) ^ 1);
                return Z(n ? r : Z(0.0));
            }
        } else r = Z(0.0);
        return Z(r);
    }
    function iE(n) {
        n = n | 0;
        var r = rr, e = 0, t = rr;
        do if (u[(n + 944) >> 2] | 0) {
            r = Z(a[(n + 48) >> 2]);
            if (rv(r) | 0) {
                e = i[((u[(n + 976) >> 2] | 0) + 2) >> 0] | 0;
                if ((e << 24) >> 24 == 0 ? ((t = Z(a[(n + 40) >> 2])), (t < Z(0.0)) & ((rv(t) | 0) ^ 1)) : 0) {
                    r = Z(-t);
                    break;
                }
                r = (e << 24) >> 24 ? Z(1.0) : Z(0.0);
            }
        } else r = Z(0.0);
        while (0)
        return Z(r);
    }
    function iG(n) {
        n = n | 0;
        var r = 0, e = 0;
        Mz((n + 400) | 0, 0, 540) | 0;
        i[(n + 985) >> 0] = 1;
        rO(n);
        e = ry(n) | 0;
        if (e | 0) {
            r = (n + 948) | 0;
            n = 0;
            do {
                iG(u[((u[r >> 2] | 0) + (n << 2)) >> 2] | 0);
                n = (n + 1) | 0;
            }while ((n | 0) != (e | 0))
        }
        return;
    }
    function iB(n, r, e, i, t, f, o, c, l, v) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        i = i | 0;
        t = Z(t);
        f = Z(f);
        o = Z(o);
        c = c | 0;
        l = l | 0;
        v = v | 0;
        var s = 0, b = rr, h = 0, d = 0, w = rr, $ = rr, m = 0, y = rr, p = 0, M = rr, g = 0, A = 0, I = 0, S = 0, T = 0, x = 0, N = 0, L = 0, O = 0, P = 0;
        O = k;
        k = (k + 16) | 0;
        I = (O + 12) | 0;
        S = (O + 8) | 0;
        T = (O + 4) | 0;
        x = O;
        L = iy(u[(n + 4) >> 2] | 0, l) | 0;
        g = iw(L) | 0;
        b = Z(ii(iW(r) | 0, g ? f : o));
        A = ie(r, 2, f) | 0;
        N = ie(r, 0, o) | 0;
        do if (!(rv(b) | 0) ? !(rv(g ? e : t) | 0) : 0) {
            s = (r + 504) | 0;
            if (!(rv(Z(a[s >> 2])) | 0)) {
                if (!(i_(u[(r + 976) >> 2] | 0, 0) | 0)) break;
                if ((u[(r + 500) >> 2] | 0) == (u[2278] | 0)) break;
            }
            a[s >> 2] = Z(Mm(b, Z(iL(r, L, f))));
        } else h = 7;
        while (0)
        do if ((h | 0) == 7) {
            p = g ^ 1;
            if (!(p | (A ^ 1))) {
                o = Z(ii(u[(r + 992) >> 2] | 0, f));
                a[(r + 504) >> 2] = Z(Mm(o, Z(iL(r, 2, f))));
                break;
            }
            if (!(g | (N ^ 1))) {
                o = Z(ii(u[(r + 996) >> 2] | 0, o));
                a[(r + 504) >> 2] = Z(Mm(o, Z(iL(r, 0, f))));
                break;
            }
            a[I >> 2] = Z(C);
            a[S >> 2] = Z(C);
            u[T >> 2] = 0;
            u[x >> 2] = 0;
            y = Z(e4(r, 2, f));
            M = Z(e4(r, 0, f));
            if (A) {
                w = Z(y + Z(ii(u[(r + 992) >> 2] | 0, f)));
                a[I >> 2] = w;
                u[T >> 2] = 1;
                d = 1;
            } else {
                d = 0;
                w = Z(C);
            }
            if (N) {
                b = Z(M + Z(ii(u[(r + 996) >> 2] | 0, o)));
                a[S >> 2] = b;
                u[x >> 2] = 1;
                s = 1;
            } else {
                s = 0;
                b = Z(C);
            }
            h = u[(n + 32) >> 2] | 0;
            if (!(g & ((h | 0) == 2))) {
                if (rv(w) | 0 ? !(rv(e) | 0) : 0) {
                    a[I >> 2] = e;
                    u[T >> 2] = 2;
                    d = 2;
                    w = e;
                }
            } else h = 2;
            if ((!(((h | 0) == 2) & p) ? rv(b) | 0 : 0) ? !(rv(t) | 0) : 0) {
                a[S >> 2] = t;
                u[x >> 2] = 2;
                s = 2;
                b = t;
            }
            $ = Z(a[(r + 396) >> 2]);
            m = rv($) | 0;
            do if (!m) {
                if (((d | 0) == 1) & p) {
                    a[S >> 2] = Z(Z(w - y) / $);
                    u[x >> 2] = 1;
                    s = 1;
                    h = 1;
                    break;
                }
                if (g & ((s | 0) == 1)) {
                    a[I >> 2] = Z($ * Z(b - M));
                    u[T >> 2] = 1;
                    s = 1;
                    h = 1;
                } else h = d;
            } else h = d;
            while (0)
            P = rv(e) | 0;
            d = (iY(n, r) | 0) != 4;
            if (!(g | A | (((i | 0) != 1) | P) | (d | ((h | 0) == 1))) ? ((a[I >> 2] = e), (u[T >> 2] = 1), !m) : 0) {
                a[S >> 2] = Z(Z(e - y) / $);
                u[x >> 2] = 1;
                s = 1;
            }
            if (!(N | p | (((c | 0) != 1) | (rv(t) | 0)) | (d | ((s | 0) == 1))) ? ((a[S >> 2] = t), (u[x >> 2] = 1), !m) : 0) {
                a[I >> 2] = Z($ * Z(t - M));
                u[T >> 2] = 1;
            }
            iz(r, 2, f, f, T, I);
            iz(r, 0, o, f, x, S);
            e = Z(a[I >> 2]);
            t = Z(a[S >> 2]);
            e1(r, e, t, l, u[T >> 2] | 0, u[x >> 2] | 0, f, o, 0, 3565, v) | 0;
            o = Z(a[(r + 908 + (u[(976 + (L << 2)) >> 2] << 2)) >> 2]);
            a[(r + 504) >> 2] = Z(Mm(o, Z(iL(r, L, f))));
        }
        while (0)
        u[(r + 500) >> 2] = u[2278];
        k = O;
        return;
    }
    function iR(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        i = Z(i);
        t = Z(t);
        i = Z(iZ(n, r, e, i));
        return Z(Mm(i, Z(iL(n, r, t))));
    }
    function iY(n, r) {
        n = n | 0;
        r = r | 0;
        r = (r + 20) | 0;
        r = u[((u[r >> 2] | 0) == 0 ? (n + 16) | 0 : r) >> 2] | 0;
        if ((r | 0) == 5 ? iV(u[(n + 4) >> 2] | 0) | 0 : 0) r = 1;
        return r | 0;
    }
    function iU(n, r) {
        n = n | 0;
        r = r | 0;
        if (iw(r) | 0 ? (u[(n + 96) >> 2] | 0) != 0 : 0) r = 4;
        else r = u[(1040 + (r << 2)) >> 2] | 0;
        return (n + 60 + (r << 3)) | 0;
    }
    function ij(n, r) {
        n = n | 0;
        r = r | 0;
        if (iw(r) | 0 ? (u[(n + 104) >> 2] | 0) != 0 : 0) r = 5;
        else r = u[(1e3 + (r << 2)) >> 2] | 0;
        return (n + 60 + (r << 3)) | 0;
    }
    function iz(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        i = Z(i);
        t = t | 0;
        f = f | 0;
        e = Z(ii((n + 380 + (u[(976 + (r << 2)) >> 2] << 3)) | 0, e));
        e = Z(e + Z(e4(n, r, i)));
        switch(u[t >> 2] | 0){
            case 2:
            case 1:
                {
                    t = rv(e) | 0;
                    i = Z(a[f >> 2]);
                    a[f >> 2] = t | (i < e) ? i : e;
                    break;
                }
            case 0:
                {
                    if (!(rv(e) | 0)) {
                        u[t >> 2] = 2;
                        a[f >> 2] = e;
                    }
                    break;
                }
            default:
                {}
        }
        return;
    }
    function iD(n, r) {
        n = n | 0;
        r = r | 0;
        n = (n + 132) | 0;
        if (iw(r) | 0 ? (u[((rs(n, 4, 948) | 0) + 4) >> 2] | 0) != 0 : 0) n = 1;
        else n = (u[((rs(n, u[(1040 + (r << 2)) >> 2] | 0, 948) | 0) + 4) >> 2] | 0) != 0;
        return n | 0;
    }
    function iF(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0, t = 0;
        n = (n + 132) | 0;
        if (iw(r) | 0 ? ((i = rs(n, 4, 948) | 0), (u[(i + 4) >> 2] | 0) != 0) : 0) t = 4;
        else {
            i = rs(n, u[(1040 + (r << 2)) >> 2] | 0, 948) | 0;
            if (!(u[(i + 4) >> 2] | 0)) e = Z(0.0);
            else t = 4;
        }
        if ((t | 0) == 4) e = Z(ii(i, e));
        return Z(e);
    }
    function iK(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = rr;
        i = Z(a[(n + 908 + (u[(976 + (r << 2)) >> 2] << 2)) >> 2]);
        i = Z(i + Z(ih(n, r, e)));
        return Z(i + Z(id(n, r, e)));
    }
    function iq(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        a: do if (!(iV(u[(n + 4) >> 2] | 0) | 0)) {
            if ((u[(n + 16) >> 2] | 0) != 5) {
                e = ry(n) | 0;
                if (!e) r = 0;
                else {
                    r = 0;
                    while(1){
                        i = rp(n, r) | 0;
                        if ((u[(i + 24) >> 2] | 0) == 0 ? (u[(i + 20) >> 2] | 0) == 5 : 0) {
                            r = 1;
                            break a;
                        }
                        r = (r + 1) | 0;
                        if (r >>> 0 >= e >>> 0) {
                            r = 0;
                            break;
                        }
                    }
                }
            } else r = 1;
        } else r = 0;
        while (0)
        return r | 0;
    }
    function iH(n, r) {
        n = n | 0;
        r = r | 0;
        var e = rr;
        e = Z(a[(n + 908 + (u[(976 + (r << 2)) >> 2] << 2)) >> 2]);
        return ((e >= Z(0.0)) & ((rv(e) | 0) ^ 1)) | 0;
    }
    function iX(n) {
        n = n | 0;
        var r = rr, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, l = rr;
        e = u[(n + 968) >> 2] | 0;
        if (!e) {
            f = ry(n) | 0;
            do if (f | 0) {
                e = 0;
                t = 0;
                while(1){
                    i = rp(n, t) | 0;
                    if (u[(i + 940) >> 2] | 0) {
                        o = 8;
                        break;
                    }
                    if ((u[(i + 24) >> 2] | 0) != 1) {
                        c = (iY(n, i) | 0) == 5;
                        if (c) {
                            e = i;
                            break;
                        } else e = (e | 0) == 0 ? i : e;
                    }
                    t = (t + 1) | 0;
                    if (t >>> 0 >= f >>> 0) {
                        o = 8;
                        break;
                    }
                }
                if ((o | 0) == 8) if (!e) break;
                r = Z(iX(e));
                return Z(r + Z(a[(e + 404) >> 2]));
            }
            while (0)
            r = Z(a[(n + 912) >> 2]);
        } else {
            l = Z(a[(n + 908) >> 2]);
            r = Z(a[(n + 912) >> 2]);
            r = Z(gF[e & 0](n, l, r));
            rA(n, (rv(r) | 0) ^ 1, 3573);
        }
        return Z(r);
    }
    function iZ(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        i = Z(i);
        var t = rr, u = 0;
        if (!(iV(r) | 0)) {
            if (iw(r) | 0) {
                r = 0;
                u = 3;
            } else {
                i = Z(C);
                t = Z(C);
            }
        } else {
            r = 1;
            u = 3;
        }
        if ((u | 0) == 3) {
            t = Z(ii((n + 364 + (r << 3)) | 0, i));
            i = Z(ii((n + 380 + (r << 3)) | 0, i));
        }
        u = (i < e) & ((i >= Z(0.0)) & ((rv(i) | 0) ^ 1));
        e = u ? i : e;
        u = (t >= Z(0.0)) & ((rv(t) | 0) ^ 1) & (e < t);
        return Z(u ? t : e);
    }
    function iJ(n, r, e, i, t, f, o) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        i = i | 0;
        t = Z(t);
        f = f | 0;
        o = o | 0;
        var c = rr, l = rr, v = 0, s = 0, b = rr, k = rr, h = rr, d = 0, w = 0, $ = 0, m = 0, y = rr, p = 0;
        $ = iy(u[(n + 4) >> 2] | 0, f) | 0;
        d = iT($, f) | 0;
        w = iw($) | 0;
        b = Z(e4(r, 2, e));
        k = Z(e4(r, 0, e));
        if (!(ie(r, 2, e) | 0)) {
            if (iD(r, 2) | 0 ? i0(r, 2) | 0 : 0) {
                c = Z(a[(n + 908) >> 2]);
                l = Z(ip(n, 2));
                l = Z(c - Z(l + Z(iC(n, 2))));
                c = Z(iF(r, 2, e));
                c = Z(iR(r, 2, Z(l - Z(c + Z(i2(r, 2, e)))), e, e));
            } else c = Z(C);
        } else c = Z(b + Z(ii(u[(r + 992) >> 2] | 0, e)));
        if (!(ie(r, 0, t) | 0)) {
            if (iD(r, 0) | 0 ? i0(r, 0) | 0 : 0) {
                l = Z(a[(n + 912) >> 2]);
                y = Z(ip(n, 0));
                y = Z(l - Z(y + Z(iC(n, 0))));
                l = Z(iF(r, 0, t));
                l = Z(iR(r, 0, Z(y - Z(l + Z(i2(r, 0, t)))), t, e));
            } else l = Z(C);
        } else l = Z(k + Z(ii(u[(r + 996) >> 2] | 0, t)));
        v = rv(c) | 0;
        s = rv(l) | 0;
        do if (v ^ s ? ((h = Z(a[(r + 396) >> 2])), !(rv(h) | 0)) : 0) if (v) {
            c = Z(b + Z(Z(l - k) * h));
            break;
        } else {
            y = Z(k + Z(Z(c - b) / h));
            l = s ? y : l;
            break;
        }
        while (0)
        s = rv(c) | 0;
        v = rv(l) | 0;
        if (s | v) {
            p = (s ^ 1) & 1;
            i = (e > Z(0.0)) & (((i | 0) != 0) & s);
            c = w ? c : i ? e : c;
            e1(r, c, l, f, w ? p : i ? 2 : p, s & (v ^ 1) & 1, c, l, 0, 3623, o) | 0;
            c = Z(a[(r + 908) >> 2]);
            c = Z(c + Z(e4(r, 2, e)));
            l = Z(a[(r + 912) >> 2]);
            l = Z(l + Z(e4(r, 0, e)));
        }
        e1(r, c, l, f, 1, 1, c, l, 1, 3635, o) | 0;
        if (i0(r, $) | 0 ? !(iD(r, $) | 0) : 0) {
            p = u[(976 + ($ << 2)) >> 2] | 0;
            y = Z(a[(n + 908 + (p << 2)) >> 2]);
            y = Z(y - Z(a[(r + 908 + (p << 2)) >> 2]));
            y = Z(y - Z(iC(n, $)));
            y = Z(y - Z(id(r, $, e)));
            y = Z(y - Z(i2(r, $, w ? e : t)));
            a[(r + 400 + (u[(1040 + ($ << 2)) >> 2] << 2)) >> 2] = y;
        } else m = 21;
        do if ((m | 0) == 21) {
            if (!(iD(r, $) | 0) ? (u[(n + 8) >> 2] | 0) == 1 : 0) {
                p = u[(976 + ($ << 2)) >> 2] | 0;
                y = Z(a[(n + 908 + (p << 2)) >> 2]);
                y = Z(Z(y - Z(a[(r + 908 + (p << 2)) >> 2])) * Z(0.5));
                a[(r + 400 + (u[(1040 + ($ << 2)) >> 2] << 2)) >> 2] = y;
                break;
            }
            if (!(iD(r, $) | 0) ? (u[(n + 8) >> 2] | 0) == 2 : 0) {
                p = u[(976 + ($ << 2)) >> 2] | 0;
                y = Z(a[(n + 908 + (p << 2)) >> 2]);
                y = Z(y - Z(a[(r + 908 + (p << 2)) >> 2]));
                a[(r + 400 + (u[(1040 + ($ << 2)) >> 2] << 2)) >> 2] = y;
            }
        }
        while (0)
        if (i0(r, d) | 0 ? !(iD(r, d) | 0) : 0) {
            p = u[(976 + (d << 2)) >> 2] | 0;
            y = Z(a[(n + 908 + (p << 2)) >> 2]);
            y = Z(y - Z(a[(r + 908 + (p << 2)) >> 2]));
            y = Z(y - Z(iC(n, d)));
            y = Z(y - Z(id(r, d, e)));
            y = Z(y - Z(i2(r, d, w ? t : e)));
            a[(r + 400 + (u[(1040 + (d << 2)) >> 2] << 2)) >> 2] = y;
        } else m = 30;
        do if ((m | 0) == 30 ? !(iD(r, d) | 0) : 0) {
            if ((iY(n, r) | 0) == 2) {
                p = u[(976 + (d << 2)) >> 2] | 0;
                y = Z(a[(n + 908 + (p << 2)) >> 2]);
                y = Z(Z(y - Z(a[(r + 908 + (p << 2)) >> 2])) * Z(0.5));
                a[(r + 400 + (u[(1040 + (d << 2)) >> 2] << 2)) >> 2] = y;
                break;
            }
            p = (iY(n, r) | 0) == 3;
            if (p ^ ((u[(n + 28) >> 2] | 0) == 2)) {
                p = u[(976 + (d << 2)) >> 2] | 0;
                y = Z(a[(n + 908 + (p << 2)) >> 2]);
                y = Z(y - Z(a[(r + 908 + (p << 2)) >> 2]));
                a[(r + 400 + (u[(1040 + (d << 2)) >> 2] << 2)) >> 2] = y;
            }
        }
        while (0)
        return;
    }
    function iQ(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = rr, t = 0;
        t = u[(976 + (e << 2)) >> 2] | 0;
        i = Z(a[(r + 908 + (t << 2)) >> 2]);
        i = Z(Z(a[(n + 908 + (t << 2)) >> 2]) - i);
        i = Z(i - Z(a[(r + 400 + (u[(1040 + (e << 2)) >> 2] << 2)) >> 2]));
        a[(r + 400 + (u[(1e3 + (e << 2)) >> 2] << 2)) >> 2] = i;
        return;
    }
    function iV(n) {
        n = n | 0;
        return ((n | 1 | 0) == 1) | 0;
    }
    function iW(n) {
        n = n | 0;
        var r = rr;
        switch(u[(n + 56) >> 2] | 0){
            case 0:
            case 3:
                {
                    r = Z(a[(n + 40) >> 2]);
                    if ((r > Z(0.0)) & ((rv(r) | 0) ^ 1)) n = i[((u[(n + 976) >> 2] | 0) + 2) >> 0] | 0 ? 1056 : 992;
                    else n = 1056;
                    break;
                }
            default:
                n = (n + 52) | 0;
        }
        return n | 0;
    }
    function i_(n, r) {
        n = n | 0;
        r = r | 0;
        return ((i[(n + r) >> 0] | 0) != 0) | 0;
    }
    function i0(n, r) {
        n = n | 0;
        r = r | 0;
        n = (n + 132) | 0;
        if (iw(r) | 0 ? (u[((rs(n, 5, 948) | 0) + 4) >> 2] | 0) != 0 : 0) n = 1;
        else n = (u[((rs(n, u[(1e3 + (r << 2)) >> 2] | 0, 948) | 0) + 4) >> 2] | 0) != 0;
        return n | 0;
    }
    function i2(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        var i = 0, t = 0;
        n = (n + 132) | 0;
        if (iw(r) | 0 ? ((i = rs(n, 5, 948) | 0), (u[(i + 4) >> 2] | 0) != 0) : 0) t = 4;
        else {
            i = rs(n, u[(1e3 + (r << 2)) >> 2] | 0, 948) | 0;
            if (!(u[(i + 4) >> 2] | 0)) e = Z(0.0);
            else t = 4;
        }
        if ((t | 0) == 4) e = Z(ii(i, e));
        return Z(e);
    }
    function i1(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        if (iD(n, r) | 0) e = Z(iF(n, r, e));
        else e = Z(-Z(i2(n, r, e)));
        return Z(e);
    }
    function i4(n) {
        n = Z(n);
        return ((a[s >> 2] = n), u[s >> 2] | 0) | 0;
    }
    function i8(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 1073741823) nZ();
            else {
                t = MP(r << 2) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 2)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 2);
        return;
    }
    function i3(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 2)) << 2)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function i6(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -4 - r) | 0) >>> 2) << 2);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function i9(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0;
        o = (n + 4) | 0;
        c = u[o >> 2] | 0;
        t = (c - i) | 0;
        f = t >> 2;
        n = (r + (f << 2)) | 0;
        if (n >>> 0 < e >>> 0) {
            i = c;
            do {
                u[i >> 2] = u[n >> 2];
                n = (n + 4) | 0;
                i = ((u[o >> 2] | 0) + 4) | 0;
                u[o >> 2] = i;
            }while (n >>> 0 < e >>> 0)
        }
        if (f | 0) MJ((c + ((0 - f) << 2)) | 0, r | 0, t | 0) | 0;
        return;
    }
    function i7(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = (r + 4) | 0;
        a = u[c >> 2] | 0;
        t = u[n >> 2] | 0;
        o = e;
        f = (o - t) | 0;
        i = (a + ((0 - (f >> 2)) << 2)) | 0;
        u[c >> 2] = i;
        if ((f | 0) > 0) MK(i | 0, t | 0, f | 0) | 0;
        t = (n + 4) | 0;
        f = (r + 8) | 0;
        i = ((u[t >> 2] | 0) - o) | 0;
        if ((i | 0) > 0) {
            MK(u[f >> 2] | 0, e | 0, i | 0) | 0;
            u[f >> 2] = (u[f >> 2] | 0) + ((i >>> 2) << 2);
        }
        o = u[n >> 2] | 0;
        u[n >> 2] = u[c >> 2];
        u[c >> 2] = o;
        o = u[t >> 2] | 0;
        u[t >> 2] = u[f >> 2];
        u[f >> 2] = o;
        o = (n + 8) | 0;
        e = (r + 12) | 0;
        n = u[o >> 2] | 0;
        u[o >> 2] = u[e >> 2];
        u[e >> 2] = n;
        u[r >> 2] = u[c >> 2];
        return a | 0;
    }
    function i5(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        o = u[r >> 2] | 0;
        f = u[e >> 2] | 0;
        if ((o | 0) != (f | 0)) {
            t = (n + 8) | 0;
            e = ((((f + -4 - o) | 0) >>> 2) + 1) | 0;
            n = o;
            i = u[t >> 2] | 0;
            do {
                u[i >> 2] = u[n >> 2];
                i = ((u[t >> 2] | 0) + 4) | 0;
                u[t >> 2] = i;
                n = (n + 4) | 0;
            }while ((n | 0) != (f | 0))
            u[r >> 2] = o + (e << 2);
        }
        return;
    }
    function tn() {
        ra();
        return;
    }
    function tr() {
        var n = 0;
        n = MP(4) | 0;
        te(n);
        return n | 0;
    }
    function te(n) {
        n = n | 0;
        u[n >> 2] = rS() | 0;
        return;
    }
    function ti(n) {
        n = n | 0;
        if (n | 0) {
            tt(n);
            MG(n);
        }
        return;
    }
    function tt(n) {
        n = n | 0;
        rx(u[n >> 2] | 0);
        return;
    }
    function tu(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        il(u[n >> 2] | 0, r, e);
        return;
    }
    function tf(n, r) {
        n = n | 0;
        r = Z(r);
        e7(u[n >> 2] | 0, r);
        return;
    }
    function to(n, r) {
        n = n | 0;
        r = r | 0;
        return i_(u[n >> 2] | 0, r) | 0;
    }
    function tc() {
        var n = 0;
        n = MP(8) | 0;
        ta(n, 0);
        return n | 0;
    }
    function ta(n, r) {
        n = n | 0;
        r = r | 0;
        if (!r) r = rh() | 0;
        else r = rb(u[r >> 2] | 0) | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = 0;
        rD(r, n);
        return;
    }
    function tl(n) {
        n = n | 0;
        var r = 0;
        r = MP(8) | 0;
        ta(r, n);
        return r | 0;
    }
    function tv(n) {
        n = n | 0;
        if (n | 0) {
            ts(n);
            MG(n);
        }
        return;
    }
    function ts(n) {
        n = n | 0;
        var r = 0;
        r$(u[n >> 2] | 0);
        r = (n + 4) | 0;
        n = u[r >> 2] | 0;
        u[r >> 2] = 0;
        if (n | 0) {
            tb(n);
            MG(n);
        }
        return;
    }
    function tb(n) {
        n = n | 0;
        tk(n);
        return;
    }
    function tk(n) {
        n = n | 0;
        n = u[n >> 2] | 0;
        if (n | 0) n4(n | 0);
        return;
    }
    function th(n) {
        n = n | 0;
        return rF(n) | 0;
    }
    function td(n) {
        n = n | 0;
        var r = 0, e = 0;
        e = (n + 4) | 0;
        r = u[e >> 2] | 0;
        u[e >> 2] = 0;
        if (r | 0) {
            tb(r);
            MG(r);
        }
        rg(u[n >> 2] | 0);
        return;
    }
    function tw(n, r) {
        n = n | 0;
        r = r | 0;
        rU(u[n >> 2] | 0, u[r >> 2] | 0);
        return;
    }
    function t$(n, r) {
        n = n | 0;
        r = r | 0;
        r0(u[n >> 2] | 0, r);
        return;
    }
    function tm(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        et(u[n >> 2] | 0, r, Z(e));
        return;
    }
    function ty(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        eu(u[n >> 2] | 0, r, Z(e));
        return;
    }
    function tp(n, r) {
        n = n | 0;
        r = r | 0;
        rZ(u[n >> 2] | 0, r);
        return;
    }
    function tC(n, r) {
        n = n | 0;
        r = r | 0;
        rQ(u[n >> 2] | 0, r);
        return;
    }
    function tM(n, r) {
        n = n | 0;
        r = r | 0;
        rW(u[n >> 2] | 0, r);
        return;
    }
    function tg(n, r) {
        n = n | 0;
        r = r | 0;
        rK(u[n >> 2] | 0, r);
        return;
    }
    function tA(n, r) {
        n = n | 0;
        r = r | 0;
        r1(u[n >> 2] | 0, r);
        return;
    }
    function tI(n, r) {
        n = n | 0;
        r = r | 0;
        rH(u[n >> 2] | 0, r);
        return;
    }
    function tS(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        eo(u[n >> 2] | 0, r, Z(e));
        return;
    }
    function tT(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        ec(u[n >> 2] | 0, r, Z(e));
        return;
    }
    function tx(n, r) {
        n = n | 0;
        r = r | 0;
        el(u[n >> 2] | 0, r);
        return;
    }
    function tN(n, r) {
        n = n | 0;
        r = r | 0;
        r8(u[n >> 2] | 0, r);
        return;
    }
    function tL(n, r) {
        n = n | 0;
        r = r | 0;
        r6(u[n >> 2] | 0, r);
        return;
    }
    function tO(n, r) {
        n = n | 0;
        r = +r;
        r7(u[n >> 2] | 0, Z(r));
        return;
    }
    function tP(n, r) {
        n = n | 0;
        r = +r;
        er(u[n >> 2] | 0, Z(r));
        return;
    }
    function tE(n, r) {
        n = n | 0;
        r = +r;
        ee(u[n >> 2] | 0, Z(r));
        return;
    }
    function tG(n, r) {
        n = n | 0;
        r = +r;
        r5(u[n >> 2] | 0, Z(r));
        return;
    }
    function tB(n, r) {
        n = n | 0;
        r = +r;
        en(u[n >> 2] | 0, Z(r));
        return;
    }
    function tR(n, r) {
        n = n | 0;
        r = +r;
        ed(u[n >> 2] | 0, Z(r));
        return;
    }
    function tY(n, r) {
        n = n | 0;
        r = +r;
        ew(u[n >> 2] | 0, Z(r));
        return;
    }
    function tU(n) {
        n = n | 0;
        e$(u[n >> 2] | 0);
        return;
    }
    function tj(n, r) {
        n = n | 0;
        r = +r;
        ey(u[n >> 2] | 0, Z(r));
        return;
    }
    function tz(n, r) {
        n = n | 0;
        r = +r;
        ep(u[n >> 2] | 0, Z(r));
        return;
    }
    function tD(n) {
        n = n | 0;
        eC(u[n >> 2] | 0);
        return;
    }
    function tF(n, r) {
        n = n | 0;
        r = +r;
        eg(u[n >> 2] | 0, Z(r));
        return;
    }
    function tK(n, r) {
        n = n | 0;
        r = +r;
        eA(u[n >> 2] | 0, Z(r));
        return;
    }
    function tq(n, r) {
        n = n | 0;
        r = +r;
        eS(u[n >> 2] | 0, Z(r));
        return;
    }
    function tH(n, r) {
        n = n | 0;
        r = +r;
        eT(u[n >> 2] | 0, Z(r));
        return;
    }
    function tX(n, r) {
        n = n | 0;
        r = +r;
        eN(u[n >> 2] | 0, Z(r));
        return;
    }
    function tZ(n, r) {
        n = n | 0;
        r = +r;
        eL(u[n >> 2] | 0, Z(r));
        return;
    }
    function tJ(n, r) {
        n = n | 0;
        r = +r;
        eP(u[n >> 2] | 0, Z(r));
        return;
    }
    function tQ(n, r) {
        n = n | 0;
        r = +r;
        eE(u[n >> 2] | 0, Z(r));
        return;
    }
    function tV(n, r) {
        n = n | 0;
        r = +r;
        eB(u[n >> 2] | 0, Z(r));
        return;
    }
    function tW(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        ek(u[n >> 2] | 0, r, Z(e));
        return;
    }
    function t_(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        ev(u[n >> 2] | 0, r, Z(e));
        return;
    }
    function t0(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        es(u[n >> 2] | 0, r, Z(e));
        return;
    }
    function t2(n) {
        n = n | 0;
        return r2(u[n >> 2] | 0) | 0;
    }
    function t1(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        i = k;
        k = (k + 16) | 0;
        t = i;
        ef(t, u[r >> 2] | 0, e);
        t4(n, t);
        k = i;
        return;
    }
    function t4(n, r) {
        n = n | 0;
        r = r | 0;
        t8(n, u[(r + 4) >> 2] | 0, +Z(a[r >> 2]));
        return;
    }
    function t8(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        u[n >> 2] = r;
        l[(n + 8) >> 3] = e;
        return;
    }
    function t3(n) {
        n = n | 0;
        return rJ(u[n >> 2] | 0) | 0;
    }
    function t6(n) {
        n = n | 0;
        return rV(u[n >> 2] | 0) | 0;
    }
    function t9(n) {
        n = n | 0;
        return r_(u[n >> 2] | 0) | 0;
    }
    function t7(n) {
        n = n | 0;
        return rq(u[n >> 2] | 0) | 0;
    }
    function t5(n) {
        n = n | 0;
        return r4(u[n >> 2] | 0) | 0;
    }
    function un(n) {
        n = n | 0;
        return rX(u[n >> 2] | 0) | 0;
    }
    function ur(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        i = k;
        k = (k + 16) | 0;
        t = i;
        ea(t, u[r >> 2] | 0, e);
        t4(n, t);
        k = i;
        return;
    }
    function ue(n) {
        n = n | 0;
        return r3(u[n >> 2] | 0) | 0;
    }
    function ui(n) {
        n = n | 0;
        return r9(u[n >> 2] | 0) | 0;
    }
    function ut(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        ei(i, u[r >> 2] | 0);
        t4(n, i);
        k = e;
        return;
    }
    function uu(n) {
        n = n | 0;
        return +(+Z(rj(u[n >> 2] | 0)));
    }
    function uf(n) {
        n = n | 0;
        return +(+Z(rz(u[n >> 2] | 0)));
    }
    function uo(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        em(i, u[r >> 2] | 0);
        t4(n, i);
        k = e;
        return;
    }
    function uc(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        eM(i, u[r >> 2] | 0);
        t4(n, i);
        k = e;
        return;
    }
    function ua(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        eI(i, u[r >> 2] | 0);
        t4(n, i);
        k = e;
        return;
    }
    function ul(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        ex(i, u[r >> 2] | 0);
        t4(n, i);
        k = e;
        return;
    }
    function uv(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        eO(i, u[r >> 2] | 0);
        t4(n, i);
        k = e;
        return;
    }
    function us(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        eG(i, u[r >> 2] | 0);
        t4(n, i);
        k = e;
        return;
    }
    function ub(n) {
        n = n | 0;
        return +(+Z(eR(u[n >> 2] | 0)));
    }
    function uk(n, r) {
        n = n | 0;
        r = r | 0;
        return +(+Z(eh(u[n >> 2] | 0, r)));
    }
    function uh(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        i = k;
        k = (k + 16) | 0;
        t = i;
        eb(t, u[r >> 2] | 0, e);
        t4(n, t);
        k = i;
        return;
    }
    function ud(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        rL(u[n >> 2] | 0, u[r >> 2] | 0, e);
        return;
    }
    function uw(n, r) {
        n = n | 0;
        r = r | 0;
        rM(u[n >> 2] | 0, u[r >> 2] | 0);
        return;
    }
    function u$(n) {
        n = n | 0;
        return ry(u[n >> 2] | 0) | 0;
    }
    function um(n) {
        n = n | 0;
        n = rB(u[n >> 2] | 0) | 0;
        if (!n) n = 0;
        else n = th(n) | 0;
        return n | 0;
    }
    function uy(n, r) {
        n = n | 0;
        r = r | 0;
        n = rp(u[n >> 2] | 0, r) | 0;
        if (!n) n = 0;
        else n = th(n) | 0;
        return n | 0;
    }
    function up(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = MP(4) | 0;
        uC(i, r);
        e = (n + 4) | 0;
        r = u[e >> 2] | 0;
        u[e >> 2] = i;
        if (r | 0) {
            tb(r);
            MG(r);
        }
        rN(u[n >> 2] | 0, 1);
        return;
    }
    function uC(n, r) {
        n = n | 0;
        r = r | 0;
        uD(n, r);
        return;
    }
    function uM(n, r, e, i, t, u) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        i = i | 0;
        t = Z(t);
        u = u | 0;
        var f = 0, o = 0;
        f = k;
        k = (k + 16) | 0;
        o = f;
        ug(o, rF(r) | 0, +e, i, +t, u);
        a[n >> 2] = Z(+l[o >> 3]);
        a[(n + 4) >> 2] = Z(+l[(o + 8) >> 3]);
        k = f;
        return;
    }
    function ug(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = +e;
        i = i | 0;
        t = +t;
        f = f | 0;
        var o = 0, c = 0, a = 0, v = 0, s = 0;
        o = k;
        k = (k + 32) | 0;
        s = (o + 8) | 0;
        v = (o + 20) | 0;
        a = o;
        c = (o + 16) | 0;
        l[s >> 3] = e;
        u[v >> 2] = i;
        l[a >> 3] = t;
        u[c >> 2] = f;
        uA(n, u[(r + 4) >> 2] | 0, s, v, a, c);
        k = o;
        return;
    }
    function uA(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        var o = 0, c = 0;
        o = k;
        k = (k + 16) | 0;
        c = o;
        Cm(c);
        r = uI(r) | 0;
        uS(n, r, +l[e >> 3], u[i >> 2] | 0, +l[t >> 3], u[f >> 2] | 0);
        Cp(c);
        k = o;
        return;
    }
    function uI(n) {
        n = n | 0;
        return u[n >> 2] | 0;
    }
    function uS(n, r, e, i, t, u) {
        n = n | 0;
        r = r | 0;
        e = +e;
        i = i | 0;
        t = +t;
        u = u | 0;
        var f = 0;
        f = ux(uT() | 0) | 0;
        e = +uN(e);
        i = uL(i) | 0;
        t = +uN(t);
        uO(n, n3(0, f | 0, r | 0, +e, i | 0, +t, uL(u) | 0) | 0);
        return;
    }
    function uT() {
        var n = 0;
        if (!(i[7608] | 0)) {
            uU(9120);
            n = 7608;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 9120;
    }
    function ux(n) {
        n = n | 0;
        return u[(n + 8) >> 2] | 0;
    }
    function uN(n) {
        n = +n;
        return +(+uY(n));
    }
    function uL(n) {
        n = n | 0;
        return uR(n) | 0;
    }
    function uO(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = k;
        k = (k + 32) | 0;
        e = t;
        i = r;
        if (!(i & 1)) {
            u[n >> 2] = u[r >> 2];
            u[(n + 4) >> 2] = u[(r + 4) >> 2];
            u[(n + 8) >> 2] = u[(r + 8) >> 2];
            u[(n + 12) >> 2] = u[(r + 12) >> 2];
        } else {
            uP(e, 0);
            nY(i | 0, e | 0) | 0;
            uE(n, e);
            uG(e);
        }
        k = t;
        return;
    }
    function uP(n, r) {
        n = n | 0;
        r = r | 0;
        uB(n, r);
        u[(n + 8) >> 2] = 0;
        i[(n + 24) >> 0] = 0;
        return;
    }
    function uE(n, r) {
        n = n | 0;
        r = r | 0;
        r = (r + 8) | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = u[(r + 4) >> 2];
        u[(n + 8) >> 2] = u[(r + 8) >> 2];
        u[(n + 12) >> 2] = u[(r + 12) >> 2];
        return;
    }
    function uG(n) {
        n = n | 0;
        i[(n + 24) >> 0] = 0;
        return;
    }
    function uB(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = r;
        return;
    }
    function uR(n) {
        n = n | 0;
        return n | 0;
    }
    function uY(n) {
        n = +n;
        return +n;
    }
    function uU(n) {
        n = n | 0;
        uz(n, uj() | 0, 4);
        return;
    }
    function uj() {
        return 1064;
    }
    function uz(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        u[(n + 8) >> 2] = n2(r | 0, (e + 1) | 0) | 0;
        return;
    }
    function uD(n, r) {
        n = n | 0;
        r = r | 0;
        r = u[r >> 2] | 0;
        u[n >> 2] = r;
        nx(r | 0);
        return;
    }
    function uF(n) {
        n = n | 0;
        var r = 0, e = 0;
        e = (n + 4) | 0;
        r = u[e >> 2] | 0;
        u[e >> 2] = 0;
        if (r | 0) {
            tb(r);
            MG(r);
        }
        rN(u[n >> 2] | 0, 0);
        return;
    }
    function uK(n) {
        n = n | 0;
        rR(u[n >> 2] | 0);
        return;
    }
    function uq(n) {
        n = n | 0;
        return rY(u[n >> 2] | 0) | 0;
    }
    function uH(n, r, e, i) {
        n = n | 0;
        r = +r;
        e = +e;
        i = i | 0;
        e5(u[n >> 2] | 0, Z(r), Z(e), i);
        return;
    }
    function uX(n) {
        n = n | 0;
        return +(+Z(eY(u[n >> 2] | 0)));
    }
    function uZ(n) {
        n = n | 0;
        return +(+Z(ej(u[n >> 2] | 0)));
    }
    function uJ(n) {
        n = n | 0;
        return +(+Z(eU(u[n >> 2] | 0)));
    }
    function uQ(n) {
        n = n | 0;
        return +(+Z(ez(u[n >> 2] | 0)));
    }
    function uV(n) {
        n = n | 0;
        return +(+Z(eD(u[n >> 2] | 0)));
    }
    function uW(n) {
        n = n | 0;
        return +(+Z(eF(u[n >> 2] | 0)));
    }
    function u_(n, r) {
        n = n | 0;
        r = r | 0;
        l[n >> 3] = +Z(eY(u[r >> 2] | 0));
        l[(n + 8) >> 3] = +Z(ej(u[r >> 2] | 0));
        l[(n + 16) >> 3] = +Z(eU(u[r >> 2] | 0));
        l[(n + 24) >> 3] = +Z(ez(u[r >> 2] | 0));
        l[(n + 32) >> 3] = +Z(eD(u[r >> 2] | 0));
        l[(n + 40) >> 3] = +Z(eF(u[r >> 2] | 0));
        return;
    }
    function u0(n, r) {
        n = n | 0;
        r = r | 0;
        return +(+Z(eK(u[n >> 2] | 0, r)));
    }
    function u2(n, r) {
        n = n | 0;
        r = r | 0;
        return +(+Z(eq(u[n >> 2] | 0, r)));
    }
    function u1(n, r) {
        n = n | 0;
        r = r | 0;
        return +(+Z(eH(u[n >> 2] | 0, r)));
    }
    function u4() {
        return rI() | 0;
    }
    function u8() {
        u3();
        u6();
        u9();
        u7();
        u5();
        fn();
        return;
    }
    function u3() {
        wP(11713, 4938, 1);
        return;
    }
    function u6() {
        d4(10448);
        return;
    }
    function u9() {
        dR(10408);
        return;
    }
    function u7() {
        h5(10324);
        return;
    }
    function u5() {
        ks(10096);
        return;
    }
    function fn() {
        fr(9132);
        return;
    }
    function fr(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0, d = 0, w = 0, $ = 0, m = 0, y = 0, p = 0, C = 0, M = 0, g = 0, A = 0, I = 0, S = 0, T = 0, x = 0, N = 0, L = 0, O = 0, P = 0, E = 0, G = 0, B = 0, R = 0, Y = 0, U = 0, j = 0, z = 0, D = 0, F = 0, K = 0, q = 0, H = 0, X = 0, Z = 0, J = 0, Q = 0, V = 0, W = 0, _ = 0, nn = 0, nr = 0, ne = 0, ni = 0, nt = 0, nu = 0, nf = 0, no = 0, nc = 0, na = 0, nl = 0, nv = 0, ns = 0, nb = 0, nk = 0, nh = 0, nd = 0, nw = 0, n$ = 0, nm = 0, ny = 0, np = 0, nC = 0, nM = 0, ng = 0, nA = 0, nI = 0, nS = 0, nT = 0, nx = 0, nN = 0, nL = 0, nO = 0;
        r = k;
        k = (k + 672) | 0;
        e = (r + 656) | 0;
        nO = (r + 648) | 0;
        nL = (r + 640) | 0;
        nN = (r + 632) | 0;
        nx = (r + 624) | 0;
        nT = (r + 616) | 0;
        nS = (r + 608) | 0;
        nI = (r + 600) | 0;
        nA = (r + 592) | 0;
        ng = (r + 584) | 0;
        nM = (r + 576) | 0;
        nC = (r + 568) | 0;
        np = (r + 560) | 0;
        ny = (r + 552) | 0;
        nm = (r + 544) | 0;
        n$ = (r + 536) | 0;
        nw = (r + 528) | 0;
        nd = (r + 520) | 0;
        nh = (r + 512) | 0;
        nk = (r + 504) | 0;
        nb = (r + 496) | 0;
        ns = (r + 488) | 0;
        nv = (r + 480) | 0;
        nl = (r + 472) | 0;
        na = (r + 464) | 0;
        nc = (r + 456) | 0;
        no = (r + 448) | 0;
        nf = (r + 440) | 0;
        nu = (r + 432) | 0;
        nt = (r + 424) | 0;
        ni = (r + 416) | 0;
        ne = (r + 408) | 0;
        nr = (r + 400) | 0;
        nn = (r + 392) | 0;
        _ = (r + 384) | 0;
        W = (r + 376) | 0;
        V = (r + 368) | 0;
        Q = (r + 360) | 0;
        J = (r + 352) | 0;
        Z = (r + 344) | 0;
        X = (r + 336) | 0;
        H = (r + 328) | 0;
        q = (r + 320) | 0;
        K = (r + 312) | 0;
        F = (r + 304) | 0;
        D = (r + 296) | 0;
        z = (r + 288) | 0;
        j = (r + 280) | 0;
        U = (r + 272) | 0;
        Y = (r + 264) | 0;
        R = (r + 256) | 0;
        B = (r + 248) | 0;
        G = (r + 240) | 0;
        E = (r + 232) | 0;
        P = (r + 224) | 0;
        O = (r + 216) | 0;
        L = (r + 208) | 0;
        N = (r + 200) | 0;
        x = (r + 192) | 0;
        T = (r + 184) | 0;
        S = (r + 176) | 0;
        I = (r + 168) | 0;
        A = (r + 160) | 0;
        g = (r + 152) | 0;
        M = (r + 144) | 0;
        C = (r + 136) | 0;
        p = (r + 128) | 0;
        y = (r + 120) | 0;
        m = (r + 112) | 0;
        $ = (r + 104) | 0;
        w = (r + 96) | 0;
        d = (r + 88) | 0;
        h = (r + 80) | 0;
        b = (r + 72) | 0;
        s = (r + 64) | 0;
        v = (r + 56) | 0;
        l = (r + 48) | 0;
        a = (r + 40) | 0;
        c = (r + 32) | 0;
        o = (r + 24) | 0;
        f = (r + 16) | 0;
        t = (r + 8) | 0;
        i = r;
        fe(n, 3646);
        fi(n, 3651, 2) | 0;
        ft(n, 3665, 2) | 0;
        fu(n, 3682, 18) | 0;
        u[nO >> 2] = 19;
        u[(nO + 4) >> 2] = 0;
        u[e >> 2] = u[nO >> 2];
        u[(e + 4) >> 2] = u[(nO + 4) >> 2];
        ff(n, 3690, e) | 0;
        u[nL >> 2] = 1;
        u[(nL + 4) >> 2] = 0;
        u[e >> 2] = u[nL >> 2];
        u[(e + 4) >> 2] = u[(nL + 4) >> 2];
        fo(n, 3696, e) | 0;
        u[nN >> 2] = 2;
        u[(nN + 4) >> 2] = 0;
        u[e >> 2] = u[nN >> 2];
        u[(e + 4) >> 2] = u[(nN + 4) >> 2];
        fc(n, 3706, e) | 0;
        u[nx >> 2] = 1;
        u[(nx + 4) >> 2] = 0;
        u[e >> 2] = u[nx >> 2];
        u[(e + 4) >> 2] = u[(nx + 4) >> 2];
        fa(n, 3722, e) | 0;
        u[nT >> 2] = 2;
        u[(nT + 4) >> 2] = 0;
        u[e >> 2] = u[nT >> 2];
        u[(e + 4) >> 2] = u[(nT + 4) >> 2];
        fa(n, 3734, e) | 0;
        u[nS >> 2] = 3;
        u[(nS + 4) >> 2] = 0;
        u[e >> 2] = u[nS >> 2];
        u[(e + 4) >> 2] = u[(nS + 4) >> 2];
        fc(n, 3753, e) | 0;
        u[nI >> 2] = 4;
        u[(nI + 4) >> 2] = 0;
        u[e >> 2] = u[nI >> 2];
        u[(e + 4) >> 2] = u[(nI + 4) >> 2];
        fc(n, 3769, e) | 0;
        u[nA >> 2] = 5;
        u[(nA + 4) >> 2] = 0;
        u[e >> 2] = u[nA >> 2];
        u[(e + 4) >> 2] = u[(nA + 4) >> 2];
        fc(n, 3783, e) | 0;
        u[ng >> 2] = 6;
        u[(ng + 4) >> 2] = 0;
        u[e >> 2] = u[ng >> 2];
        u[(e + 4) >> 2] = u[(ng + 4) >> 2];
        fc(n, 3796, e) | 0;
        u[nM >> 2] = 7;
        u[(nM + 4) >> 2] = 0;
        u[e >> 2] = u[nM >> 2];
        u[(e + 4) >> 2] = u[(nM + 4) >> 2];
        fc(n, 3813, e) | 0;
        u[nC >> 2] = 8;
        u[(nC + 4) >> 2] = 0;
        u[e >> 2] = u[nC >> 2];
        u[(e + 4) >> 2] = u[(nC + 4) >> 2];
        fc(n, 3825, e) | 0;
        u[np >> 2] = 3;
        u[(np + 4) >> 2] = 0;
        u[e >> 2] = u[np >> 2];
        u[(e + 4) >> 2] = u[(np + 4) >> 2];
        fa(n, 3843, e) | 0;
        u[ny >> 2] = 4;
        u[(ny + 4) >> 2] = 0;
        u[e >> 2] = u[ny >> 2];
        u[(e + 4) >> 2] = u[(ny + 4) >> 2];
        fa(n, 3853, e) | 0;
        u[nm >> 2] = 9;
        u[(nm + 4) >> 2] = 0;
        u[e >> 2] = u[nm >> 2];
        u[(e + 4) >> 2] = u[(nm + 4) >> 2];
        fc(n, 3870, e) | 0;
        u[n$ >> 2] = 10;
        u[(n$ + 4) >> 2] = 0;
        u[e >> 2] = u[n$ >> 2];
        u[(e + 4) >> 2] = u[(n$ + 4) >> 2];
        fc(n, 3884, e) | 0;
        u[nw >> 2] = 11;
        u[(nw + 4) >> 2] = 0;
        u[e >> 2] = u[nw >> 2];
        u[(e + 4) >> 2] = u[(nw + 4) >> 2];
        fc(n, 3896, e) | 0;
        u[nd >> 2] = 1;
        u[(nd + 4) >> 2] = 0;
        u[e >> 2] = u[nd >> 2];
        u[(e + 4) >> 2] = u[(nd + 4) >> 2];
        fl(n, 3907, e) | 0;
        u[nh >> 2] = 2;
        u[(nh + 4) >> 2] = 0;
        u[e >> 2] = u[nh >> 2];
        u[(e + 4) >> 2] = u[(nh + 4) >> 2];
        fl(n, 3915, e) | 0;
        u[nk >> 2] = 3;
        u[(nk + 4) >> 2] = 0;
        u[e >> 2] = u[nk >> 2];
        u[(e + 4) >> 2] = u[(nk + 4) >> 2];
        fl(n, 3928, e) | 0;
        u[nb >> 2] = 4;
        u[(nb + 4) >> 2] = 0;
        u[e >> 2] = u[nb >> 2];
        u[(e + 4) >> 2] = u[(nb + 4) >> 2];
        fl(n, 3948, e) | 0;
        u[ns >> 2] = 5;
        u[(ns + 4) >> 2] = 0;
        u[e >> 2] = u[ns >> 2];
        u[(e + 4) >> 2] = u[(ns + 4) >> 2];
        fl(n, 3960, e) | 0;
        u[nv >> 2] = 6;
        u[(nv + 4) >> 2] = 0;
        u[e >> 2] = u[nv >> 2];
        u[(e + 4) >> 2] = u[(nv + 4) >> 2];
        fl(n, 3974, e) | 0;
        u[nl >> 2] = 7;
        u[(nl + 4) >> 2] = 0;
        u[e >> 2] = u[nl >> 2];
        u[(e + 4) >> 2] = u[(nl + 4) >> 2];
        fl(n, 3983, e) | 0;
        u[na >> 2] = 20;
        u[(na + 4) >> 2] = 0;
        u[e >> 2] = u[na >> 2];
        u[(e + 4) >> 2] = u[(na + 4) >> 2];
        ff(n, 3999, e) | 0;
        u[nc >> 2] = 8;
        u[(nc + 4) >> 2] = 0;
        u[e >> 2] = u[nc >> 2];
        u[(e + 4) >> 2] = u[(nc + 4) >> 2];
        fl(n, 4012, e) | 0;
        u[no >> 2] = 9;
        u[(no + 4) >> 2] = 0;
        u[e >> 2] = u[no >> 2];
        u[(e + 4) >> 2] = u[(no + 4) >> 2];
        fl(n, 4022, e) | 0;
        u[nf >> 2] = 21;
        u[(nf + 4) >> 2] = 0;
        u[e >> 2] = u[nf >> 2];
        u[(e + 4) >> 2] = u[(nf + 4) >> 2];
        ff(n, 4039, e) | 0;
        u[nu >> 2] = 10;
        u[(nu + 4) >> 2] = 0;
        u[e >> 2] = u[nu >> 2];
        u[(e + 4) >> 2] = u[(nu + 4) >> 2];
        fl(n, 4053, e) | 0;
        u[nt >> 2] = 11;
        u[(nt + 4) >> 2] = 0;
        u[e >> 2] = u[nt >> 2];
        u[(e + 4) >> 2] = u[(nt + 4) >> 2];
        fl(n, 4065, e) | 0;
        u[ni >> 2] = 12;
        u[(ni + 4) >> 2] = 0;
        u[e >> 2] = u[ni >> 2];
        u[(e + 4) >> 2] = u[(ni + 4) >> 2];
        fl(n, 4084, e) | 0;
        u[ne >> 2] = 13;
        u[(ne + 4) >> 2] = 0;
        u[e >> 2] = u[ne >> 2];
        u[(e + 4) >> 2] = u[(ne + 4) >> 2];
        fl(n, 4097, e) | 0;
        u[nr >> 2] = 14;
        u[(nr + 4) >> 2] = 0;
        u[e >> 2] = u[nr >> 2];
        u[(e + 4) >> 2] = u[(nr + 4) >> 2];
        fl(n, 4117, e) | 0;
        u[nn >> 2] = 15;
        u[(nn + 4) >> 2] = 0;
        u[e >> 2] = u[nn >> 2];
        u[(e + 4) >> 2] = u[(nn + 4) >> 2];
        fl(n, 4129, e) | 0;
        u[_ >> 2] = 16;
        u[(_ + 4) >> 2] = 0;
        u[e >> 2] = u[_ >> 2];
        u[(e + 4) >> 2] = u[(_ + 4) >> 2];
        fl(n, 4148, e) | 0;
        u[W >> 2] = 17;
        u[(W + 4) >> 2] = 0;
        u[e >> 2] = u[W >> 2];
        u[(e + 4) >> 2] = u[(W + 4) >> 2];
        fl(n, 4161, e) | 0;
        u[V >> 2] = 18;
        u[(V + 4) >> 2] = 0;
        u[e >> 2] = u[V >> 2];
        u[(e + 4) >> 2] = u[(V + 4) >> 2];
        fl(n, 4181, e) | 0;
        u[Q >> 2] = 5;
        u[(Q + 4) >> 2] = 0;
        u[e >> 2] = u[Q >> 2];
        u[(e + 4) >> 2] = u[(Q + 4) >> 2];
        fa(n, 4196, e) | 0;
        u[J >> 2] = 6;
        u[(J + 4) >> 2] = 0;
        u[e >> 2] = u[J >> 2];
        u[(e + 4) >> 2] = u[(J + 4) >> 2];
        fa(n, 4206, e) | 0;
        u[Z >> 2] = 7;
        u[(Z + 4) >> 2] = 0;
        u[e >> 2] = u[Z >> 2];
        u[(e + 4) >> 2] = u[(Z + 4) >> 2];
        fa(n, 4217, e) | 0;
        u[X >> 2] = 3;
        u[(X + 4) >> 2] = 0;
        u[e >> 2] = u[X >> 2];
        u[(e + 4) >> 2] = u[(X + 4) >> 2];
        fv(n, 4235, e) | 0;
        u[H >> 2] = 1;
        u[(H + 4) >> 2] = 0;
        u[e >> 2] = u[H >> 2];
        u[(e + 4) >> 2] = u[(H + 4) >> 2];
        fs(n, 4251, e) | 0;
        u[q >> 2] = 4;
        u[(q + 4) >> 2] = 0;
        u[e >> 2] = u[q >> 2];
        u[(e + 4) >> 2] = u[(q + 4) >> 2];
        fv(n, 4263, e) | 0;
        u[K >> 2] = 5;
        u[(K + 4) >> 2] = 0;
        u[e >> 2] = u[K >> 2];
        u[(e + 4) >> 2] = u[(K + 4) >> 2];
        fv(n, 4279, e) | 0;
        u[F >> 2] = 6;
        u[(F + 4) >> 2] = 0;
        u[e >> 2] = u[F >> 2];
        u[(e + 4) >> 2] = u[(F + 4) >> 2];
        fv(n, 4293, e) | 0;
        u[D >> 2] = 7;
        u[(D + 4) >> 2] = 0;
        u[e >> 2] = u[D >> 2];
        u[(e + 4) >> 2] = u[(D + 4) >> 2];
        fv(n, 4306, e) | 0;
        u[z >> 2] = 8;
        u[(z + 4) >> 2] = 0;
        u[e >> 2] = u[z >> 2];
        u[(e + 4) >> 2] = u[(z + 4) >> 2];
        fv(n, 4323, e) | 0;
        u[j >> 2] = 9;
        u[(j + 4) >> 2] = 0;
        u[e >> 2] = u[j >> 2];
        u[(e + 4) >> 2] = u[(j + 4) >> 2];
        fv(n, 4335, e) | 0;
        u[U >> 2] = 2;
        u[(U + 4) >> 2] = 0;
        u[e >> 2] = u[U >> 2];
        u[(e + 4) >> 2] = u[(U + 4) >> 2];
        fs(n, 4353, e) | 0;
        u[Y >> 2] = 12;
        u[(Y + 4) >> 2] = 0;
        u[e >> 2] = u[Y >> 2];
        u[(e + 4) >> 2] = u[(Y + 4) >> 2];
        fb(n, 4363, e) | 0;
        u[R >> 2] = 1;
        u[(R + 4) >> 2] = 0;
        u[e >> 2] = u[R >> 2];
        u[(e + 4) >> 2] = u[(R + 4) >> 2];
        fk(n, 4376, e) | 0;
        u[B >> 2] = 2;
        u[(B + 4) >> 2] = 0;
        u[e >> 2] = u[B >> 2];
        u[(e + 4) >> 2] = u[(B + 4) >> 2];
        fk(n, 4388, e) | 0;
        u[G >> 2] = 13;
        u[(G + 4) >> 2] = 0;
        u[e >> 2] = u[G >> 2];
        u[(e + 4) >> 2] = u[(G + 4) >> 2];
        fb(n, 4402, e) | 0;
        u[E >> 2] = 14;
        u[(E + 4) >> 2] = 0;
        u[e >> 2] = u[E >> 2];
        u[(e + 4) >> 2] = u[(E + 4) >> 2];
        fb(n, 4411, e) | 0;
        u[P >> 2] = 15;
        u[(P + 4) >> 2] = 0;
        u[e >> 2] = u[P >> 2];
        u[(e + 4) >> 2] = u[(P + 4) >> 2];
        fb(n, 4421, e) | 0;
        u[O >> 2] = 16;
        u[(O + 4) >> 2] = 0;
        u[e >> 2] = u[O >> 2];
        u[(e + 4) >> 2] = u[(O + 4) >> 2];
        fb(n, 4433, e) | 0;
        u[L >> 2] = 17;
        u[(L + 4) >> 2] = 0;
        u[e >> 2] = u[L >> 2];
        u[(e + 4) >> 2] = u[(L + 4) >> 2];
        fb(n, 4446, e) | 0;
        u[N >> 2] = 18;
        u[(N + 4) >> 2] = 0;
        u[e >> 2] = u[N >> 2];
        u[(e + 4) >> 2] = u[(N + 4) >> 2];
        fb(n, 4458, e) | 0;
        u[x >> 2] = 3;
        u[(x + 4) >> 2] = 0;
        u[e >> 2] = u[x >> 2];
        u[(e + 4) >> 2] = u[(x + 4) >> 2];
        fk(n, 4471, e) | 0;
        u[T >> 2] = 1;
        u[(T + 4) >> 2] = 0;
        u[e >> 2] = u[T >> 2];
        u[(e + 4) >> 2] = u[(T + 4) >> 2];
        fh(n, 4486, e) | 0;
        u[S >> 2] = 10;
        u[(S + 4) >> 2] = 0;
        u[e >> 2] = u[S >> 2];
        u[(e + 4) >> 2] = u[(S + 4) >> 2];
        fv(n, 4496, e) | 0;
        u[I >> 2] = 11;
        u[(I + 4) >> 2] = 0;
        u[e >> 2] = u[I >> 2];
        u[(e + 4) >> 2] = u[(I + 4) >> 2];
        fv(n, 4508, e) | 0;
        u[A >> 2] = 3;
        u[(A + 4) >> 2] = 0;
        u[e >> 2] = u[A >> 2];
        u[(e + 4) >> 2] = u[(A + 4) >> 2];
        fs(n, 4519, e) | 0;
        u[g >> 2] = 4;
        u[(g + 4) >> 2] = 0;
        u[e >> 2] = u[g >> 2];
        u[(e + 4) >> 2] = u[(g + 4) >> 2];
        fd(n, 4530, e) | 0;
        u[M >> 2] = 19;
        u[(M + 4) >> 2] = 0;
        u[e >> 2] = u[M >> 2];
        u[(e + 4) >> 2] = u[(M + 4) >> 2];
        fw(n, 4542, e) | 0;
        u[C >> 2] = 12;
        u[(C + 4) >> 2] = 0;
        u[e >> 2] = u[C >> 2];
        u[(e + 4) >> 2] = u[(C + 4) >> 2];
        f$(n, 4554, e) | 0;
        u[p >> 2] = 13;
        u[(p + 4) >> 2] = 0;
        u[e >> 2] = u[p >> 2];
        u[(e + 4) >> 2] = u[(p + 4) >> 2];
        fm(n, 4568, e) | 0;
        u[y >> 2] = 2;
        u[(y + 4) >> 2] = 0;
        u[e >> 2] = u[y >> 2];
        u[(e + 4) >> 2] = u[(y + 4) >> 2];
        fy(n, 4578, e) | 0;
        u[m >> 2] = 20;
        u[(m + 4) >> 2] = 0;
        u[e >> 2] = u[m >> 2];
        u[(e + 4) >> 2] = u[(m + 4) >> 2];
        fp(n, 4587, e) | 0;
        u[$ >> 2] = 22;
        u[($ + 4) >> 2] = 0;
        u[e >> 2] = u[$ >> 2];
        u[(e + 4) >> 2] = u[($ + 4) >> 2];
        ff(n, 4602, e) | 0;
        u[w >> 2] = 23;
        u[(w + 4) >> 2] = 0;
        u[e >> 2] = u[w >> 2];
        u[(e + 4) >> 2] = u[(w + 4) >> 2];
        ff(n, 4619, e) | 0;
        u[d >> 2] = 14;
        u[(d + 4) >> 2] = 0;
        u[e >> 2] = u[d >> 2];
        u[(e + 4) >> 2] = u[(d + 4) >> 2];
        fC(n, 4629, e) | 0;
        u[h >> 2] = 1;
        u[(h + 4) >> 2] = 0;
        u[e >> 2] = u[h >> 2];
        u[(e + 4) >> 2] = u[(h + 4) >> 2];
        fM(n, 4637, e) | 0;
        u[b >> 2] = 4;
        u[(b + 4) >> 2] = 0;
        u[e >> 2] = u[b >> 2];
        u[(e + 4) >> 2] = u[(b + 4) >> 2];
        fk(n, 4653, e) | 0;
        u[s >> 2] = 5;
        u[(s + 4) >> 2] = 0;
        u[e >> 2] = u[s >> 2];
        u[(e + 4) >> 2] = u[(s + 4) >> 2];
        fk(n, 4669, e) | 0;
        u[v >> 2] = 6;
        u[(v + 4) >> 2] = 0;
        u[e >> 2] = u[v >> 2];
        u[(e + 4) >> 2] = u[(v + 4) >> 2];
        fk(n, 4686, e) | 0;
        u[l >> 2] = 7;
        u[(l + 4) >> 2] = 0;
        u[e >> 2] = u[l >> 2];
        u[(e + 4) >> 2] = u[(l + 4) >> 2];
        fk(n, 4701, e) | 0;
        u[a >> 2] = 8;
        u[(a + 4) >> 2] = 0;
        u[e >> 2] = u[a >> 2];
        u[(e + 4) >> 2] = u[(a + 4) >> 2];
        fk(n, 4719, e) | 0;
        u[c >> 2] = 9;
        u[(c + 4) >> 2] = 0;
        u[e >> 2] = u[c >> 2];
        u[(e + 4) >> 2] = u[(c + 4) >> 2];
        fk(n, 4736, e) | 0;
        u[o >> 2] = 21;
        u[(o + 4) >> 2] = 0;
        u[e >> 2] = u[o >> 2];
        u[(e + 4) >> 2] = u[(o + 4) >> 2];
        fg(n, 4754, e) | 0;
        u[f >> 2] = 2;
        u[(f + 4) >> 2] = 0;
        u[e >> 2] = u[f >> 2];
        u[(e + 4) >> 2] = u[(f + 4) >> 2];
        fh(n, 4772, e) | 0;
        u[t >> 2] = 3;
        u[(t + 4) >> 2] = 0;
        u[e >> 2] = u[t >> 2];
        u[(e + 4) >> 2] = u[(t + 4) >> 2];
        fh(n, 4790, e) | 0;
        u[i >> 2] = 4;
        u[(i + 4) >> 2] = 0;
        u[e >> 2] = u[i >> 2];
        u[(e + 4) >> 2] = u[(i + 4) >> 2];
        fh(n, 4808, e) | 0;
        k = r;
        return;
    }
    function fe(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = kr() | 0;
        u[n >> 2] = e;
        ke(e, r);
        w1(u[n >> 2] | 0);
        return;
    }
    function fi(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        bZ(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function ft(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        bS(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function fu(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        bl(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function ff(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        s2(n, r, t);
        k = i;
        return n | 0;
    }
    function fo(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        sP(n, r, t);
        k = i;
        return n | 0;
    }
    function fc(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        sk(n, r, t);
        k = i;
        return n | 0;
    }
    function fa(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        v3(n, r, t);
        k = i;
        return n | 0;
    }
    function fl(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        vj(n, r, t);
        k = i;
        return n | 0;
    }
    function fv(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        vp(n, r, t);
        k = i;
        return n | 0;
    }
    function fs(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        ve(n, r, t);
        k = i;
        return n | 0;
    }
    function fb(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        lO(n, r, t);
        k = i;
        return n | 0;
    }
    function fk(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        lb(n, r, t);
        k = i;
        return n | 0;
    }
    function fh(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        a8(n, r, t);
        k = i;
        return n | 0;
    }
    function fd(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        aU(n, r, t);
        k = i;
        return n | 0;
    }
    function fw(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        aw(n, r, t);
        k = i;
        return n | 0;
    }
    function f$(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        c9(n, r, t);
        k = i;
        return n | 0;
    }
    function fm(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        cD(n, r, t);
        k = i;
        return n | 0;
    }
    function fy(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        cm(n, r, t);
        k = i;
        return n | 0;
    }
    function fp(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        o3(n, r, t);
        k = i;
        return n | 0;
    }
    function fC(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        oU(n, r, t);
        k = i;
        return n | 0;
    }
    function fM(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        ok(n, r, t);
        k = i;
        return n | 0;
    }
    function fg(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        fA(n, r, t);
        k = i;
        return n | 0;
    }
    function fA(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        fS(n, e, t, 1);
        k = i;
        return;
    }
    function fI(n) {
        n = n | 0;
        return n | 0;
    }
    function fS(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = fT() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = fx(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, fN(f, i) | 0, i);
        k = t;
        return;
    }
    function fT() {
        var n = 0, r = 0;
        if (!(i[7616] | 0)) {
            fD(9136);
            nB(24, 9136, w | 0) | 0;
            r = 7616;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9136) | 0)) {
            n = 9136;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            fD(9136);
        }
        return 9136;
    }
    function fx(n) {
        n = n | 0;
        return 0;
    }
    function fN(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = fT() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            fB(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            fR(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function fL(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        var o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0;
        o = k;
        k = (k + 32) | 0;
        b = (o + 24) | 0;
        s = (o + 20) | 0;
        a = (o + 16) | 0;
        v = (o + 12) | 0;
        l = (o + 8) | 0;
        c = (o + 4) | 0;
        h = o;
        u[s >> 2] = r;
        u[a >> 2] = e;
        u[v >> 2] = i;
        u[l >> 2] = t;
        u[c >> 2] = f;
        f = (n + 28) | 0;
        u[h >> 2] = u[f >> 2];
        u[b >> 2] = u[h >> 2];
        fO((n + 24) | 0, b, s, v, l, a, c) | 0;
        u[f >> 2] = u[u[f >> 2] >> 2];
        k = o;
        return;
    }
    function fO(n, r, e, i, t, f, o) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        o = o | 0;
        n = fP(r) | 0;
        r = MP(24) | 0;
        fE((r + 4) | 0, u[e >> 2] | 0, u[i >> 2] | 0, u[t >> 2] | 0, u[f >> 2] | 0, u[o >> 2] | 0);
        u[r >> 2] = u[n >> 2];
        u[n >> 2] = r;
        return r | 0;
    }
    function fP(n) {
        n = n | 0;
        return u[n >> 2] | 0;
    }
    function fE(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        u[(n + 8) >> 2] = i;
        u[(n + 12) >> 2] = t;
        u[(n + 16) >> 2] = f;
        return;
    }
    function fG(n, r) {
        n = n | 0;
        r = r | 0;
        return r | n | 0;
    }
    function fB(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function fR(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = fY(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            fU(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            fB(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            fj(n, c);
            fz(c);
            k = l;
            return;
        }
    }
    function fY(n) {
        n = n | 0;
        return 357913941;
    }
    function fU(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function fj(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function fz(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function fD(n) {
        n = n | 0;
        fH(n);
        return;
    }
    function fF(n) {
        n = n | 0;
        fq((n + 24) | 0);
        return;
    }
    function fK(n) {
        n = n | 0;
        return u[n >> 2] | 0;
    }
    function fq(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function fH(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 3, r, fZ() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function fX() {
        return 9228;
    }
    function fZ() {
        return 1140;
    }
    function fJ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0;
        e = k;
        k = (k + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = fV(n) | 0;
        n = u[(f + 4) >> 2] | 0;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = n;
        u[i >> 2] = u[t >> 2];
        u[(i + 4) >> 2] = u[(t + 4) >> 2];
        r = fW(r, i) | 0;
        k = e;
        return r | 0;
    }
    function fQ(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        u[(n + 8) >> 2] = i;
        u[(n + 12) >> 2] = t;
        u[(n + 16) >> 2] = f;
        return;
    }
    function fV(n) {
        n = n | 0;
        return ((u[((fT() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function fW(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = k;
        k = (k + 48) | 0;
        i = t;
        e = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) e = u[((u[n >> 2] | 0) + e) >> 2] | 0;
        gq[e & 31](i, n);
        i = f_(i) | 0;
        k = t;
        return i | 0;
    }
    function f_(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        t = k;
        k = (k + 32) | 0;
        r = (t + 12) | 0;
        e = t;
        i = f2(f0() | 0) | 0;
        if (!i) n = f6(n) | 0;
        else {
            f1(r, i);
            f4(e, r);
            f8(n, e);
            n = f3(r) | 0;
        }
        k = t;
        return n | 0;
    }
    function f0() {
        var n = 0;
        if (!(i[7632] | 0)) {
            oo(9184);
            nB(25, 9184, w | 0) | 0;
            n = 7632;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 9184;
    }
    function f2(n) {
        n = n | 0;
        return u[(n + 36) >> 2] | 0;
    }
    function f1(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = n;
        u[(n + 8) >> 2] = 0;
        return;
    }
    function f4(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = u[(r + 4) >> 2];
        u[(n + 8) >> 2] = 0;
        return;
    }
    function f8(n, r) {
        n = n | 0;
        r = r | 0;
        or(r, n, (n + 8) | 0, (n + 16) | 0, (n + 24) | 0, (n + 32) | 0, (n + 40) | 0) | 0;
        return;
    }
    function f3(n) {
        n = n | 0;
        return u[((u[(n + 4) >> 2] | 0) + 8) >> 2] | 0;
    }
    function f6(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        a = k;
        k = (k + 16) | 0;
        e = (a + 4) | 0;
        i = a;
        t = ye(8) | 0;
        f = t;
        o = MP(48) | 0;
        c = o;
        r = (c + 48) | 0;
        do {
            u[c >> 2] = u[n >> 2];
            c = (c + 4) | 0;
            n = (n + 4) | 0;
        }while ((c | 0) < (r | 0))
        r = (f + 4) | 0;
        u[r >> 2] = o;
        c = MP(8) | 0;
        o = u[r >> 2] | 0;
        u[i >> 2] = 0;
        u[e >> 2] = u[i >> 2];
        f9(c, o, e);
        u[t >> 2] = c;
        k = a;
        return f | 0;
    }
    function f9(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        e = MP(16) | 0;
        u[(e + 4) >> 2] = 0;
        u[(e + 8) >> 2] = 0;
        u[e >> 2] = 1092;
        u[(e + 12) >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function f7(n) {
        n = n | 0;
        MS(n);
        MG(n);
        return;
    }
    function f5(n) {
        n = n | 0;
        n = u[(n + 12) >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function on(n) {
        n = n | 0;
        MG(n);
        return;
    }
    function or(n, r, e, i, t, f, o) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        o = o | 0;
        f = oe(u[n >> 2] | 0, r, e, i, t, f, o) | 0;
        o = (n + 4) | 0;
        u[((u[o >> 2] | 0) + 8) >> 2] = f;
        return u[((u[o >> 2] | 0) + 8) >> 2] | 0;
    }
    function oe(n, r, e, i, t, u, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        u = u | 0;
        f = f | 0;
        var o = 0, c = 0;
        o = k;
        k = (k + 16) | 0;
        c = o;
        Cm(c);
        n = uI(n) | 0;
        f = oi(n, +l[r >> 3], +l[e >> 3], +l[i >> 3], +l[t >> 3], +l[u >> 3], +l[f >> 3]) | 0;
        Cp(c);
        k = o;
        return f | 0;
    }
    function oi(n, r, e, i, t, u, f) {
        n = n | 0;
        r = +r;
        e = +e;
        i = +i;
        t = +t;
        u = +u;
        f = +f;
        var o = 0;
        o = ux(ot() | 0) | 0;
        r = +uN(r);
        e = +uN(e);
        i = +uN(i);
        t = +uN(t);
        u = +uN(u);
        return nS(0, o | 0, n | 0, +r, +e, +i, +t, +u, +(+uN(f))) | 0;
    }
    function ot() {
        var n = 0;
        if (!(i[7624] | 0)) {
            ou(9172);
            n = 7624;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 9172;
    }
    function ou(n) {
        n = n | 0;
        uz(n, of() | 0, 6);
        return;
    }
    function of() {
        return 1112;
    }
    function oo(n) {
        n = n | 0;
        ob(n);
        return;
    }
    function oc(n) {
        n = n | 0;
        oa((n + 24) | 0);
        ol((n + 16) | 0);
        return;
    }
    function oa(n) {
        n = n | 0;
        os(n);
        return;
    }
    function ol(n) {
        n = n | 0;
        ov(n);
        return;
    }
    function ov(n) {
        n = n | 0;
        var r = 0, e = 0;
        r = u[n >> 2] | 0;
        if (r | 0) do {
            e = r;
            r = u[r >> 2] | 0;
            MG(e);
        }while ((r | 0) != 0)
        u[n >> 2] = 0;
        return;
    }
    function os(n) {
        n = n | 0;
        var r = 0, e = 0;
        r = u[n >> 2] | 0;
        if (r | 0) do {
            e = r;
            r = u[r >> 2] | 0;
            MG(e);
        }while ((r | 0) != 0)
        u[n >> 2] = 0;
        return;
    }
    function ob(n) {
        n = n | 0;
        var r = 0;
        u[(n + 16) >> 2] = 0;
        u[(n + 20) >> 2] = 0;
        r = (n + 24) | 0;
        u[r >> 2] = 0;
        u[(n + 28) >> 2] = r;
        u[(n + 36) >> 2] = 0;
        i[(n + 40) >> 0] = 0;
        i[(n + 41) >> 0] = 0;
        return;
    }
    function ok(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        oh(n, e, t, 0);
        k = i;
        return;
    }
    function oh(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = od() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = ow(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, o$(f, i) | 0, i);
        k = t;
        return;
    }
    function od() {
        var n = 0, r = 0;
        if (!(i[7640] | 0)) {
            oA(9232);
            nB(26, 9232, w | 0) | 0;
            r = 7640;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9232) | 0)) {
            n = 9232;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            oA(9232);
        }
        return 9232;
    }
    function ow(n) {
        n = n | 0;
        return 0;
    }
    function o$(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = od() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            om(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            oy(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function om(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function oy(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = op(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            oC(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            om(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            oM(n, c);
            og(c);
            k = l;
            return;
        }
    }
    function op(n) {
        n = n | 0;
        return 357913941;
    }
    function oC(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function oM(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function og(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function oA(n) {
        n = n | 0;
        oT(n);
        return;
    }
    function oI(n) {
        n = n | 0;
        oS((n + 24) | 0);
        return;
    }
    function oS(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function oT(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 1, r, ox() | 0, 3);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function ox() {
        return 1144;
    }
    function oN(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = +e;
        i = +i;
        t = t | 0;
        var f = 0, o = 0, c = 0, a = 0;
        f = k;
        k = (k + 16) | 0;
        o = (f + 8) | 0;
        c = f;
        a = oL(n) | 0;
        n = u[(a + 4) >> 2] | 0;
        u[c >> 2] = u[a >> 2];
        u[(c + 4) >> 2] = n;
        u[o >> 2] = u[c >> 2];
        u[(o + 4) >> 2] = u[(c + 4) >> 2];
        oO(r, o, e, i, t);
        k = f;
        return;
    }
    function oL(n) {
        n = n | 0;
        return ((u[((od() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function oO(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = +e;
        i = +i;
        t = t | 0;
        var f = 0, o = 0, c = 0, a = 0, l = 0;
        l = k;
        k = (k + 16) | 0;
        o = (l + 2) | 0;
        c = (l + 1) | 0;
        a = l;
        f = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) f = u[((u[n >> 2] | 0) + f) >> 2] | 0;
        oP(o, e);
        e = +oE(o, e);
        oP(c, i);
        i = +oE(c, i);
        oG(a, t);
        a = oB(a, t) | 0;
        gX[f & 1](n, e, i, a);
        k = l;
        return;
    }
    function oP(n, r) {
        n = n | 0;
        r = +r;
        return;
    }
    function oE(n, r) {
        n = n | 0;
        r = +r;
        return +(+oY(r));
    }
    function oG(n, r) {
        n = n | 0;
        r = r | 0;
        return;
    }
    function oB(n, r) {
        n = n | 0;
        r = r | 0;
        return oR(r) | 0;
    }
    function oR(n) {
        n = n | 0;
        return n | 0;
    }
    function oY(n) {
        n = +n;
        return +n;
    }
    function oU(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        oj(n, e, t, 1);
        k = i;
        return;
    }
    function oj(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = oz() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = oD(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, oF(f, i) | 0, i);
        k = t;
        return;
    }
    function oz() {
        var n = 0, r = 0;
        if (!(i[7648] | 0)) {
            oQ(9268);
            nB(27, 9268, w | 0) | 0;
            r = 7648;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9268) | 0)) {
            n = 9268;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            oQ(9268);
        }
        return 9268;
    }
    function oD(n) {
        n = n | 0;
        return 0;
    }
    function oF(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = oz() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            oK(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            oq(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function oK(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function oq(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = oH(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            oX(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            oK(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            oZ(n, c);
            oJ(c);
            k = l;
            return;
        }
    }
    function oH(n) {
        n = n | 0;
        return 357913941;
    }
    function oX(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function oZ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function oJ(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function oQ(n) {
        n = n | 0;
        o_(n);
        return;
    }
    function oV(n) {
        n = n | 0;
        oW((n + 24) | 0);
        return;
    }
    function oW(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function o_(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 4, r, o0() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function o0() {
        return 1160;
    }
    function o2(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0;
        e = k;
        k = (k + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = o1(n) | 0;
        n = u[(f + 4) >> 2] | 0;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = n;
        u[i >> 2] = u[t >> 2];
        u[(i + 4) >> 2] = u[(t + 4) >> 2];
        r = o4(r, i) | 0;
        k = e;
        return r | 0;
    }
    function o1(n) {
        n = n | 0;
        return ((u[((oz() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function o4(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) e = u[((u[n >> 2] | 0) + e) >> 2] | 0;
        return o8(gH[e & 31](n) | 0) | 0;
    }
    function o8(n) {
        n = n | 0;
        return (n & 1) | 0;
    }
    function o3(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        o6(n, e, t, 0);
        k = i;
        return;
    }
    function o6(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = o9() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = o7(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, o5(f, i) | 0, i);
        k = t;
        return;
    }
    function o9() {
        var n = 0, r = 0;
        if (!(i[7656] | 0)) {
            cf(9304);
            nB(28, 9304, w | 0) | 0;
            r = 7656;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9304) | 0)) {
            n = 9304;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            cf(9304);
        }
        return 9304;
    }
    function o7(n) {
        n = n | 0;
        return 0;
    }
    function o5(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = o9() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            cn(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            cr(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function cn(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function cr(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = ce(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            ci(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            cn(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            ct(n, c);
            cu(c);
            k = l;
            return;
        }
    }
    function ce(n) {
        n = n | 0;
        return 357913941;
    }
    function ci(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function ct(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function cu(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function cf(n) {
        n = n | 0;
        ca(n);
        return;
    }
    function co(n) {
        n = n | 0;
        cc((n + 24) | 0);
        return;
    }
    function cc(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function ca(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 5, r, cl() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function cl() {
        return 1164;
    }
    function cv(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = cs(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        cb(r, t, e);
        k = i;
        return;
    }
    function cs(n) {
        n = n | 0;
        return ((u[((o9() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function cb(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0;
        f = k;
        k = (k + 16) | 0;
        t = f;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        ck(t, e);
        e = ch(t, e) | 0;
        gq[i & 31](n, e);
        cd(t);
        k = f;
        return;
    }
    function ck(n, r) {
        n = n | 0;
        r = r | 0;
        cw(n, r);
        return;
    }
    function ch(n, r) {
        n = n | 0;
        r = r | 0;
        return n | 0;
    }
    function cd(n) {
        n = n | 0;
        tb(n);
        return;
    }
    function cw(n, r) {
        n = n | 0;
        r = r | 0;
        c$(n, r);
        return;
    }
    function c$(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = r;
        return;
    }
    function cm(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        cy(n, e, t, 0);
        k = i;
        return;
    }
    function cy(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = cp() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = cC(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, cM(f, i) | 0, i);
        k = t;
        return;
    }
    function cp() {
        var n = 0, r = 0;
        if (!(i[7664] | 0)) {
            cN(9340);
            nB(29, 9340, w | 0) | 0;
            r = 7664;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9340) | 0)) {
            n = 9340;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            cN(9340);
        }
        return 9340;
    }
    function cC(n) {
        n = n | 0;
        return 0;
    }
    function cM(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = cp() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            cg(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            cA(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function cg(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function cA(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = cI(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            cS(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            cg(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            cT(n, c);
            cx(c);
            k = l;
            return;
        }
    }
    function cI(n) {
        n = n | 0;
        return 357913941;
    }
    function cS(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function cT(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function cx(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function cN(n) {
        n = n | 0;
        cP(n);
        return;
    }
    function cL(n) {
        n = n | 0;
        cO((n + 24) | 0);
        return;
    }
    function cO(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function cP(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 4, r, cE() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function cE() {
        return 1180;
    }
    function cG(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = cB(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        e = cR(r, t, e) | 0;
        k = i;
        return e | 0;
    }
    function cB(n) {
        n = n | 0;
        return ((u[((cp() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function cR(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0;
        f = k;
        k = (k + 16) | 0;
        t = f;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        cY(t, e);
        t = cU(t, e) | 0;
        t = cj(g_[i & 15](n, t) | 0) | 0;
        k = f;
        return t | 0;
    }
    function cY(n, r) {
        n = n | 0;
        r = r | 0;
        return;
    }
    function cU(n, r) {
        n = n | 0;
        r = r | 0;
        return cz(r) | 0;
    }
    function cj(n) {
        n = n | 0;
        return n | 0;
    }
    function cz(n) {
        n = n | 0;
        return n | 0;
    }
    function cD(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        cF(n, e, t, 0);
        k = i;
        return;
    }
    function cF(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = cK() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = cq(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, cH(f, i) | 0, i);
        k = t;
        return;
    }
    function cK() {
        var n = 0, r = 0;
        if (!(i[7672] | 0)) {
            c_(9376);
            nB(30, 9376, w | 0) | 0;
            r = 7672;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9376) | 0)) {
            n = 9376;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            c_(9376);
        }
        return 9376;
    }
    function cq(n) {
        n = n | 0;
        return 0;
    }
    function cH(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = cK() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            cX(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            cZ(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function cX(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function cZ(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = cJ(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            cQ(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            cX(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            cV(n, c);
            cW(c);
            k = l;
            return;
        }
    }
    function cJ(n) {
        n = n | 0;
        return 357913941;
    }
    function cQ(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function cV(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function cW(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function c_(n) {
        n = n | 0;
        c1(n);
        return;
    }
    function c0(n) {
        n = n | 0;
        c2((n + 24) | 0);
        return;
    }
    function c2(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function c1(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 5, r, c4() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function c4() {
        return 1196;
    }
    function c8(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0;
        e = k;
        k = (k + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = c3(n) | 0;
        n = u[(f + 4) >> 2] | 0;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = n;
        u[i >> 2] = u[t >> 2];
        u[(i + 4) >> 2] = u[(t + 4) >> 2];
        r = c6(r, i) | 0;
        k = e;
        return r | 0;
    }
    function c3(n) {
        n = n | 0;
        return ((u[((cK() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function c6(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) e = u[((u[n >> 2] | 0) + e) >> 2] | 0;
        return cj(gH[e & 31](n) | 0) | 0;
    }
    function c9(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        c7(n, e, t, 1);
        k = i;
        return;
    }
    function c7(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = c5() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = an(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, ar(f, i) | 0, i);
        k = t;
        return;
    }
    function c5() {
        var n = 0, r = 0;
        if (!(i[7680] | 0)) {
            ac(9412);
            nB(31, 9412, w | 0) | 0;
            r = 7680;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9412) | 0)) {
            n = 9412;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            ac(9412);
        }
        return 9412;
    }
    function an(n) {
        n = n | 0;
        return 0;
    }
    function ar(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = c5() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            ae(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            ai(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function ae(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function ai(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = at(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            au(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            ae(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            af(n, c);
            ao(c);
            k = l;
            return;
        }
    }
    function at(n) {
        n = n | 0;
        return 357913941;
    }
    function au(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function af(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function ao(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function ac(n) {
        n = n | 0;
        av(n);
        return;
    }
    function aa(n) {
        n = n | 0;
        al((n + 24) | 0);
        return;
    }
    function al(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function av(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 6, r, as() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function as() {
        return 1200;
    }
    function ab(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0;
        e = k;
        k = (k + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = ak(n) | 0;
        n = u[(f + 4) >> 2] | 0;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = n;
        u[i >> 2] = u[t >> 2];
        u[(i + 4) >> 2] = u[(t + 4) >> 2];
        r = ah(r, i) | 0;
        k = e;
        return r | 0;
    }
    function ak(n) {
        n = n | 0;
        return ((u[((c5() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function ah(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) e = u[((u[n >> 2] | 0) + e) >> 2] | 0;
        return ad(gH[e & 31](n) | 0) | 0;
    }
    function ad(n) {
        n = n | 0;
        return n | 0;
    }
    function aw(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        a$(n, e, t, 0);
        k = i;
        return;
    }
    function a$(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = am() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = ay(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, ap(f, i) | 0, i);
        k = t;
        return;
    }
    function am() {
        var n = 0, r = 0;
        if (!(i[7688] | 0)) {
            aT(9448);
            nB(32, 9448, w | 0) | 0;
            r = 7688;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9448) | 0)) {
            n = 9448;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            aT(9448);
        }
        return 9448;
    }
    function ay(n) {
        n = n | 0;
        return 0;
    }
    function ap(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = am() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            aC(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            aM(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function aC(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function aM(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = ag(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            aA(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            aC(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            aI(n, c);
            aS(c);
            k = l;
            return;
        }
    }
    function ag(n) {
        n = n | 0;
        return 357913941;
    }
    function aA(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function aI(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function aS(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function aT(n) {
        n = n | 0;
        aL(n);
        return;
    }
    function ax(n) {
        n = n | 0;
        aN((n + 24) | 0);
        return;
    }
    function aN(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function aL(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 6, r, aO() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function aO() {
        return 1204;
    }
    function aP(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = aE(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        aG(r, t, e);
        k = i;
        return;
    }
    function aE(n) {
        n = n | 0;
        return ((u[((am() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function aG(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0;
        f = k;
        k = (k + 16) | 0;
        t = f;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        aB(t, e);
        t = aR(t, e) | 0;
        gq[i & 31](n, t);
        k = f;
        return;
    }
    function aB(n, r) {
        n = n | 0;
        r = r | 0;
        return;
    }
    function aR(n, r) {
        n = n | 0;
        r = r | 0;
        return aY(r) | 0;
    }
    function aY(n) {
        n = n | 0;
        return n | 0;
    }
    function aU(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        aj(n, e, t, 0);
        k = i;
        return;
    }
    function aj(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = az() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = aD(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, aF(f, i) | 0, i);
        k = t;
        return;
    }
    function az() {
        var n = 0, r = 0;
        if (!(i[7696] | 0)) {
            aQ(9484);
            nB(33, 9484, w | 0) | 0;
            r = 7696;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9484) | 0)) {
            n = 9484;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            aQ(9484);
        }
        return 9484;
    }
    function aD(n) {
        n = n | 0;
        return 0;
    }
    function aF(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = az() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            aK(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            aq(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function aK(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function aq(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = aH(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            aX(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            aK(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            aZ(n, c);
            aJ(c);
            k = l;
            return;
        }
    }
    function aH(n) {
        n = n | 0;
        return 357913941;
    }
    function aX(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function aZ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function aJ(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function aQ(n) {
        n = n | 0;
        a_(n);
        return;
    }
    function aV(n) {
        n = n | 0;
        aW((n + 24) | 0);
        return;
    }
    function aW(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function a_(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 1, r, a0() | 0, 2);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function a0() {
        return 1212;
    }
    function a2(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0;
        t = k;
        k = (k + 16) | 0;
        f = (t + 8) | 0;
        o = t;
        c = a1(n) | 0;
        n = u[(c + 4) >> 2] | 0;
        u[o >> 2] = u[c >> 2];
        u[(o + 4) >> 2] = n;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = u[(o + 4) >> 2];
        a4(r, f, e, i);
        k = t;
        return;
    }
    function a1(n) {
        n = n | 0;
        return ((u[((az() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function a4(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0;
        c = k;
        k = (k + 16) | 0;
        f = (c + 1) | 0;
        o = c;
        t = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) t = u[((u[n >> 2] | 0) + t) >> 2] | 0;
        aB(f, e);
        f = aR(f, e) | 0;
        cY(o, i);
        o = cU(o, i) | 0;
        g9[t & 15](n, f, o);
        k = c;
        return;
    }
    function a8(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        a3(n, e, t, 1);
        k = i;
        return;
    }
    function a3(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = a6() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = a9(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, a7(f, i) | 0, i);
        k = t;
        return;
    }
    function a6() {
        var n = 0, r = 0;
        if (!(i[7704] | 0)) {
            lu(9520);
            nB(34, 9520, w | 0) | 0;
            r = 7704;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9520) | 0)) {
            n = 9520;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            lu(9520);
        }
        return 9520;
    }
    function a9(n) {
        n = n | 0;
        return 0;
    }
    function a7(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = a6() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            a5(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            ln(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function a5(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function ln(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = lr(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            le(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            a5(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            li(n, c);
            lt(c);
            k = l;
            return;
        }
    }
    function lr(n) {
        n = n | 0;
        return 357913941;
    }
    function le(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function li(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function lt(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function lu(n) {
        n = n | 0;
        lc(n);
        return;
    }
    function lf(n) {
        n = n | 0;
        lo((n + 24) | 0);
        return;
    }
    function lo(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function lc(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 1, r, la() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function la() {
        return 1224;
    }
    function ll(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0.0, t = 0, f = 0, o = 0, c = 0;
        t = k;
        k = (k + 16) | 0;
        f = (t + 8) | 0;
        o = t;
        c = lv(n) | 0;
        n = u[(c + 4) >> 2] | 0;
        u[o >> 2] = u[c >> 2];
        u[(o + 4) >> 2] = n;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = u[(o + 4) >> 2];
        i = +ls(r, f, e);
        k = t;
        return +i;
    }
    function lv(n) {
        n = n | 0;
        return ((u[((a6() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function ls(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0.0;
        f = k;
        k = (k + 16) | 0;
        t = f;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        oG(t, e);
        t = oB(t, e) | 0;
        o = +uY(+g1[i & 7](n, t));
        k = f;
        return +o;
    }
    function lb(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        lk(n, e, t, 1);
        k = i;
        return;
    }
    function lk(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = lh() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = ld(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, lw(f, i) | 0, i);
        k = t;
        return;
    }
    function lh() {
        var n = 0, r = 0;
        if (!(i[7712] | 0)) {
            lg(9556);
            nB(35, 9556, w | 0) | 0;
            r = 7712;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9556) | 0)) {
            n = 9556;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            lg(9556);
        }
        return 9556;
    }
    function ld(n) {
        n = n | 0;
        return 0;
    }
    function lw(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = lh() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            l$(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            lm(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function l$(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function lm(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = ly(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            lp(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            l$(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            lC(n, c);
            lM(c);
            k = l;
            return;
        }
    }
    function ly(n) {
        n = n | 0;
        return 357913941;
    }
    function lp(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function lC(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function lM(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function lg(n) {
        n = n | 0;
        lS(n);
        return;
    }
    function lA(n) {
        n = n | 0;
        lI((n + 24) | 0);
        return;
    }
    function lI(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function lS(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 5, r, lT() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function lT() {
        return 1232;
    }
    function lx(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0.0, i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = lN(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        e = +lL(r, t);
        k = i;
        return +e;
    }
    function lN(n) {
        n = n | 0;
        return ((u[((lh() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function lL(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) e = u[((u[n >> 2] | 0) + e) >> 2] | 0;
        return +(+uY(+gV[e & 15](n)));
    }
    function lO(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        lP(n, e, t, 1);
        k = i;
        return;
    }
    function lP(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = lE() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = lG(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, lB(f, i) | 0, i);
        k = t;
        return;
    }
    function lE() {
        var n = 0, r = 0;
        if (!(i[7720] | 0)) {
            lF(9592);
            nB(36, 9592, w | 0) | 0;
            r = 7720;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9592) | 0)) {
            n = 9592;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            lF(9592);
        }
        return 9592;
    }
    function lG(n) {
        n = n | 0;
        return 0;
    }
    function lB(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = lE() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            lR(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            lY(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function lR(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function lY(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = lU(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            lj(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            lR(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            lz(n, c);
            lD(c);
            k = l;
            return;
        }
    }
    function lU(n) {
        n = n | 0;
        return 357913941;
    }
    function lj(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function lz(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function lD(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function lF(n) {
        n = n | 0;
        lH(n);
        return;
    }
    function lK(n) {
        n = n | 0;
        lq((n + 24) | 0);
        return;
    }
    function lq(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function lH(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 7, r, lX() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function lX() {
        return 1276;
    }
    function lZ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0;
        e = k;
        k = (k + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = lJ(n) | 0;
        n = u[(f + 4) >> 2] | 0;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = n;
        u[i >> 2] = u[t >> 2];
        u[(i + 4) >> 2] = u[(t + 4) >> 2];
        r = lQ(r, i) | 0;
        k = e;
        return r | 0;
    }
    function lJ(n) {
        n = n | 0;
        return ((u[((lE() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function lQ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = k;
        k = (k + 16) | 0;
        i = t;
        e = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) e = u[((u[n >> 2] | 0) + e) >> 2] | 0;
        gq[e & 31](i, n);
        i = lV(i) | 0;
        k = t;
        return i | 0;
    }
    function lV(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        t = k;
        k = (k + 32) | 0;
        r = (t + 12) | 0;
        e = t;
        i = f2(lW() | 0) | 0;
        if (!i) n = l0(n) | 0;
        else {
            f1(r, i);
            f4(e, r);
            l_(n, e);
            n = f3(r) | 0;
        }
        k = t;
        return n | 0;
    }
    function lW() {
        var n = 0;
        if (!(i[7736] | 0)) {
            vr(9640);
            nB(25, 9640, w | 0) | 0;
            n = 7736;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 9640;
    }
    function l_(n, r) {
        n = n | 0;
        r = r | 0;
        l3(r, n, (n + 8) | 0) | 0;
        return;
    }
    function l0(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0;
        e = k;
        k = (k + 16) | 0;
        t = (e + 4) | 0;
        o = e;
        i = ye(8) | 0;
        r = i;
        c = MP(16) | 0;
        u[c >> 2] = u[n >> 2];
        u[(c + 4) >> 2] = u[(n + 4) >> 2];
        u[(c + 8) >> 2] = u[(n + 8) >> 2];
        u[(c + 12) >> 2] = u[(n + 12) >> 2];
        f = (r + 4) | 0;
        u[f >> 2] = c;
        n = MP(8) | 0;
        f = u[f >> 2] | 0;
        u[o >> 2] = 0;
        u[t >> 2] = u[o >> 2];
        l2(n, f, t);
        u[i >> 2] = n;
        k = e;
        return r | 0;
    }
    function l2(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        e = MP(16) | 0;
        u[(e + 4) >> 2] = 0;
        u[(e + 8) >> 2] = 0;
        u[e >> 2] = 1244;
        u[(e + 12) >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function l1(n) {
        n = n | 0;
        MS(n);
        MG(n);
        return;
    }
    function l4(n) {
        n = n | 0;
        n = u[(n + 12) >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function l8(n) {
        n = n | 0;
        MG(n);
        return;
    }
    function l3(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        r = l6(u[n >> 2] | 0, r, e) | 0;
        e = (n + 4) | 0;
        u[((u[e >> 2] | 0) + 8) >> 2] = r;
        return u[((u[e >> 2] | 0) + 8) >> 2] | 0;
    }
    function l6(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        i = k;
        k = (k + 16) | 0;
        t = i;
        Cm(t);
        n = uI(n) | 0;
        e = l9(n, u[r >> 2] | 0, +l[e >> 3]) | 0;
        Cp(t);
        k = i;
        return e | 0;
    }
    function l9(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        var i = 0;
        i = ux(l7() | 0) | 0;
        r = uL(r) | 0;
        return nT(0, i | 0, n | 0, r | 0, +(+uN(e))) | 0;
    }
    function l7() {
        var n = 0;
        if (!(i[7728] | 0)) {
            l5(9628);
            n = 7728;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 9628;
    }
    function l5(n) {
        n = n | 0;
        uz(n, vn() | 0, 2);
        return;
    }
    function vn() {
        return 1264;
    }
    function vr(n) {
        n = n | 0;
        ob(n);
        return;
    }
    function ve(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        vi(n, e, t, 1);
        k = i;
        return;
    }
    function vi(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = vt() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = vu(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, vf(f, i) | 0, i);
        k = t;
        return;
    }
    function vt() {
        var n = 0, r = 0;
        if (!(i[7744] | 0)) {
            vb(9684);
            nB(37, 9684, w | 0) | 0;
            r = 7744;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9684) | 0)) {
            n = 9684;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            vb(9684);
        }
        return 9684;
    }
    function vu(n) {
        n = n | 0;
        return 0;
    }
    function vf(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = vt() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            vo(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            vc(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function vo(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function vc(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = va(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            vl(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            vo(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            vv(n, c);
            vs(c);
            k = l;
            return;
        }
    }
    function va(n) {
        n = n | 0;
        return 357913941;
    }
    function vl(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function vv(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function vs(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function vb(n) {
        n = n | 0;
        vd(n);
        return;
    }
    function vk(n) {
        n = n | 0;
        vh((n + 24) | 0);
        return;
    }
    function vh(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function vd(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 5, r, vw() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function vw() {
        return 1280;
    }
    function v$(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = vm(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        e = vy(r, t, e) | 0;
        k = i;
        return e | 0;
    }
    function vm(n) {
        n = n | 0;
        return ((u[((vt() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function vy(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        o = k;
        k = (k + 32) | 0;
        t = o;
        f = (o + 16) | 0;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        oG(f, e);
        f = oB(f, e) | 0;
        g9[i & 15](t, n, f);
        f = lV(t) | 0;
        k = o;
        return f | 0;
    }
    function vp(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        vC(n, e, t, 1);
        k = i;
        return;
    }
    function vC(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = vM() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = vg(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, vA(f, i) | 0, i);
        k = t;
        return;
    }
    function vM() {
        var n = 0, r = 0;
        if (!(i[7752] | 0)) {
            vO(9720);
            nB(38, 9720, w | 0) | 0;
            r = 7752;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9720) | 0)) {
            n = 9720;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            vO(9720);
        }
        return 9720;
    }
    function vg(n) {
        n = n | 0;
        return 0;
    }
    function vA(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = vM() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            vI(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            vS(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function vI(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function vS(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = vT(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            vx(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            vI(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            vN(n, c);
            vL(c);
            k = l;
            return;
        }
    }
    function vT(n) {
        n = n | 0;
        return 357913941;
    }
    function vx(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function vN(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function vL(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function vO(n) {
        n = n | 0;
        vG(n);
        return;
    }
    function vP(n) {
        n = n | 0;
        vE((n + 24) | 0);
        return;
    }
    function vE(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function vG(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 8, r, vB() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function vB() {
        return 1288;
    }
    function vR(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0;
        e = k;
        k = (k + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = vY(n) | 0;
        n = u[(f + 4) >> 2] | 0;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = n;
        u[i >> 2] = u[t >> 2];
        u[(i + 4) >> 2] = u[(t + 4) >> 2];
        r = vU(r, i) | 0;
        k = e;
        return r | 0;
    }
    function vY(n) {
        n = n | 0;
        return ((u[((vM() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function vU(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) e = u[((u[n >> 2] | 0) + e) >> 2] | 0;
        return uR(gH[e & 31](n) | 0) | 0;
    }
    function vj(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        vz(n, e, t, 0);
        k = i;
        return;
    }
    function vz(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = vD() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = vF(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, vK(f, i) | 0, i);
        k = t;
        return;
    }
    function vD() {
        var n = 0, r = 0;
        if (!(i[7760] | 0)) {
            vV(9756);
            nB(39, 9756, w | 0) | 0;
            r = 7760;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9756) | 0)) {
            n = 9756;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            vV(9756);
        }
        return 9756;
    }
    function vF(n) {
        n = n | 0;
        return 0;
    }
    function vK(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = vD() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            vq(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            vH(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function vq(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function vH(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = vX(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            vZ(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            vq(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            vJ(n, c);
            vQ(c);
            k = l;
            return;
        }
    }
    function vX(n) {
        n = n | 0;
        return 357913941;
    }
    function vZ(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function vJ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function vQ(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function vV(n) {
        n = n | 0;
        v0(n);
        return;
    }
    function vW(n) {
        n = n | 0;
        v_((n + 24) | 0);
        return;
    }
    function v_(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function v0(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 8, r, v2() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function v2() {
        return 1292;
    }
    function v1(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = v4(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        v8(r, t, e);
        k = i;
        return;
    }
    function v4(n) {
        n = n | 0;
        return ((u[((vD() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function v8(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        var i = 0, t = 0, f = 0;
        f = k;
        k = (k + 16) | 0;
        t = f;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        oP(t, e);
        e = +oE(t, e);
        gD[i & 31](n, e);
        k = f;
        return;
    }
    function v3(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        v6(n, e, t, 0);
        k = i;
        return;
    }
    function v6(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = v9() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = v7(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, v5(f, i) | 0, i);
        k = t;
        return;
    }
    function v9() {
        var n = 0, r = 0;
        if (!(i[7768] | 0)) {
            sf(9792);
            nB(40, 9792, w | 0) | 0;
            r = 7768;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9792) | 0)) {
            n = 9792;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            sf(9792);
        }
        return 9792;
    }
    function v7(n) {
        n = n | 0;
        return 0;
    }
    function v5(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = v9() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            sn(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            sr(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function sn(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function sr(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = se(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            si(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            sn(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            st(n, c);
            su(c);
            k = l;
            return;
        }
    }
    function se(n) {
        n = n | 0;
        return 357913941;
    }
    function si(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function st(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function su(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function sf(n) {
        n = n | 0;
        sa(n);
        return;
    }
    function so(n) {
        n = n | 0;
        sc((n + 24) | 0);
        return;
    }
    function sc(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function sa(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 1, r, sl() | 0, 2);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function sl() {
        return 1300;
    }
    function sv(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = +i;
        var t = 0, f = 0, o = 0, c = 0;
        t = k;
        k = (k + 16) | 0;
        f = (t + 8) | 0;
        o = t;
        c = ss(n) | 0;
        n = u[(c + 4) >> 2] | 0;
        u[o >> 2] = u[c >> 2];
        u[(o + 4) >> 2] = n;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = u[(o + 4) >> 2];
        sb(r, f, e, i);
        k = t;
        return;
    }
    function ss(n) {
        n = n | 0;
        return ((u[((v9() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function sb(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = +i;
        var t = 0, f = 0, o = 0, c = 0;
        c = k;
        k = (k + 16) | 0;
        f = (c + 1) | 0;
        o = c;
        t = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) t = u[((u[n >> 2] | 0) + t) >> 2] | 0;
        oG(f, e);
        f = oB(f, e) | 0;
        oP(o, i);
        i = +oE(o, i);
        g5[t & 15](n, f, i);
        k = c;
        return;
    }
    function sk(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        sh(n, e, t, 0);
        k = i;
        return;
    }
    function sh(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = sd() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = sw(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, s$(f, i) | 0, i);
        k = t;
        return;
    }
    function sd() {
        var n = 0, r = 0;
        if (!(i[7776] | 0)) {
            sA(9828);
            nB(41, 9828, w | 0) | 0;
            r = 7776;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9828) | 0)) {
            n = 9828;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            sA(9828);
        }
        return 9828;
    }
    function sw(n) {
        n = n | 0;
        return 0;
    }
    function s$(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = sd() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            sm(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            sy(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function sm(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function sy(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = sp(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            sC(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            sm(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            sM(n, c);
            sg(c);
            k = l;
            return;
        }
    }
    function sp(n) {
        n = n | 0;
        return 357913941;
    }
    function sC(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function sM(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function sg(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function sA(n) {
        n = n | 0;
        sT(n);
        return;
    }
    function sI(n) {
        n = n | 0;
        sS((n + 24) | 0);
        return;
    }
    function sS(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function sT(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 7, r, sx() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function sx() {
        return 1312;
    }
    function sN(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = sL(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        sO(r, t, e);
        k = i;
        return;
    }
    function sL(n) {
        n = n | 0;
        return ((u[((sd() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function sO(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0;
        f = k;
        k = (k + 16) | 0;
        t = f;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        oG(t, e);
        t = oB(t, e) | 0;
        gq[i & 31](n, t);
        k = f;
        return;
    }
    function sP(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        sE(n, e, t, 0);
        k = i;
        return;
    }
    function sE(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = sG() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = sB(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, sR(f, i) | 0, i);
        k = t;
        return;
    }
    function sG() {
        var n = 0, r = 0;
        if (!(i[7784] | 0)) {
            sK(9864);
            nB(42, 9864, w | 0) | 0;
            r = 7784;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9864) | 0)) {
            n = 9864;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            sK(9864);
        }
        return 9864;
    }
    function sB(n) {
        n = n | 0;
        return 0;
    }
    function sR(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = sG() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            sY(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            sU(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function sY(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function sU(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = sj(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            sz(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            sY(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            sD(n, c);
            sF(c);
            k = l;
            return;
        }
    }
    function sj(n) {
        n = n | 0;
        return 357913941;
    }
    function sz(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function sD(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function sF(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function sK(n) {
        n = n | 0;
        sX(n);
        return;
    }
    function sq(n) {
        n = n | 0;
        sH((n + 24) | 0);
        return;
    }
    function sH(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function sX(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 8, r, sZ() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function sZ() {
        return 1320;
    }
    function sJ(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = sQ(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        sV(r, t, e);
        k = i;
        return;
    }
    function sQ(n) {
        n = n | 0;
        return ((u[((sG() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function sV(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0;
        f = k;
        k = (k + 16) | 0;
        t = f;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        sW(t, e);
        t = s_(t, e) | 0;
        gq[i & 31](n, t);
        k = f;
        return;
    }
    function sW(n, r) {
        n = n | 0;
        r = r | 0;
        return;
    }
    function s_(n, r) {
        n = n | 0;
        r = r | 0;
        return s0(r) | 0;
    }
    function s0(n) {
        n = n | 0;
        return n | 0;
    }
    function s2(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        s1(n, e, t, 0);
        k = i;
        return;
    }
    function s1(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = s4() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = s8(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, s3(f, i) | 0, i);
        k = t;
        return;
    }
    function s4() {
        var n = 0, r = 0;
        if (!(i[7792] | 0)) {
            be(9900);
            nB(43, 9900, w | 0) | 0;
            r = 7792;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9900) | 0)) {
            n = 9900;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            be(9900);
        }
        return 9900;
    }
    function s8(n) {
        n = n | 0;
        return 0;
    }
    function s3(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = s4() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            s6(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            s9(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function s6(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function s9(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = s7(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            s5(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            s6(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            bn(n, c);
            br(c);
            k = l;
            return;
        }
    }
    function s7(n) {
        n = n | 0;
        return 357913941;
    }
    function s5(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function bn(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function br(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function be(n) {
        n = n | 0;
        bu(n);
        return;
    }
    function bi(n) {
        n = n | 0;
        bt((n + 24) | 0);
        return;
    }
    function bt(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function bu(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 22, r, bf() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function bf() {
        return 1344;
    }
    function bo(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0;
        e = k;
        k = (k + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = bc(n) | 0;
        n = u[(f + 4) >> 2] | 0;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = n;
        u[i >> 2] = u[t >> 2];
        u[(i + 4) >> 2] = u[(t + 4) >> 2];
        ba(r, i);
        k = e;
        return;
    }
    function bc(n) {
        n = n | 0;
        return ((u[((s4() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function ba(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) e = u[((u[n >> 2] | 0) + e) >> 2] | 0;
        gK[e & 127](n);
        return;
    }
    function bl(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = bv() | 0;
        n = bs(e) | 0;
        fL(f, r, t, n, bb(e, i) | 0, i);
        return;
    }
    function bv() {
        var n = 0, r = 0;
        if (!(i[7800] | 0)) {
            by(9936);
            nB(44, 9936, w | 0) | 0;
            r = 7800;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9936) | 0)) {
            n = 9936;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            by(9936);
        }
        return 9936;
    }
    function bs(n) {
        n = n | 0;
        return n | 0;
    }
    function bb(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = bv() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            bk(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            bh(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function bk(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function bh(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = bd(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            bw(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            bk(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            b$(n, t);
            bm(t);
            k = c;
            return;
        }
    }
    function bd(n) {
        n = n | 0;
        return 536870911;
    }
    function bw(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function b$(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function bm(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function by(n) {
        n = n | 0;
        bM(n);
        return;
    }
    function bp(n) {
        n = n | 0;
        bC((n + 24) | 0);
        return;
    }
    function bC(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function bM(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 23, r, aO() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function bg(n, r) {
        n = n | 0;
        r = r | 0;
        bI(u[(bA(n) | 0) >> 2] | 0, r);
        return;
    }
    function bA(n) {
        n = n | 0;
        return ((u[((bv() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function bI(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        aB(i, r);
        r = aR(i, r) | 0;
        gK[n & 127](r);
        k = e;
        return;
    }
    function bS(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = bT() | 0;
        n = bx(e) | 0;
        fL(f, r, t, n, bN(e, i) | 0, i);
        return;
    }
    function bT() {
        var n = 0, r = 0;
        if (!(i[7808] | 0)) {
            bR(9972);
            nB(45, 9972, w | 0) | 0;
            r = 7808;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(9972) | 0)) {
            n = 9972;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            bR(9972);
        }
        return 9972;
    }
    function bx(n) {
        n = n | 0;
        return n | 0;
    }
    function bN(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = bT() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            bL(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            bO(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function bL(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function bO(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = bP(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            bE(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            bL(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            bG(n, t);
            bB(t);
            k = c;
            return;
        }
    }
    function bP(n) {
        n = n | 0;
        return 536870911;
    }
    function bE(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function bG(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function bB(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function bR(n) {
        n = n | 0;
        bj(n);
        return;
    }
    function bY(n) {
        n = n | 0;
        bU((n + 24) | 0);
        return;
    }
    function bU(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function bj(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 9, r, bz() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function bz() {
        return 1348;
    }
    function bD(n, r) {
        n = n | 0;
        r = r | 0;
        return bK(u[(bF(n) | 0) >> 2] | 0, r) | 0;
    }
    function bF(n) {
        n = n | 0;
        return ((u[((bT() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function bK(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        bq(i, r);
        r = bH(i, r) | 0;
        r = cj(gH[n & 31](r) | 0) | 0;
        k = e;
        return r | 0;
    }
    function bq(n, r) {
        n = n | 0;
        r = r | 0;
        return;
    }
    function bH(n, r) {
        n = n | 0;
        r = r | 0;
        return bX(r) | 0;
    }
    function bX(n) {
        n = n | 0;
        return n | 0;
    }
    function bZ(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = bJ() | 0;
        n = bQ(e) | 0;
        fL(f, r, t, n, bV(e, i) | 0, i);
        return;
    }
    function bJ() {
        var n = 0, r = 0;
        if (!(i[7816] | 0)) {
            b8(10008);
            nB(46, 10008, w | 0) | 0;
            r = 7816;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10008) | 0)) {
            n = 10008;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            b8(10008);
        }
        return 10008;
    }
    function bQ(n) {
        n = n | 0;
        return n | 0;
    }
    function bV(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = bJ() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            bW(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            b_(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function bW(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function b_(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = b0(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            b2(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            bW(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            b1(n, t);
            b4(t);
            k = c;
            return;
        }
    }
    function b0(n) {
        n = n | 0;
        return 536870911;
    }
    function b2(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function b1(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function b4(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function b8(n) {
        n = n | 0;
        b9(n);
        return;
    }
    function b3(n) {
        n = n | 0;
        b6((n + 24) | 0);
        return;
    }
    function b6(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function b9(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 15, r, c4() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function b7(n) {
        n = n | 0;
        return kn(u[(b5(n) | 0) >> 2] | 0) | 0;
    }
    function b5(n) {
        n = n | 0;
        return ((u[((bJ() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function kn(n) {
        n = n | 0;
        return cj(g4[n & 7]() | 0) | 0;
    }
    function kr() {
        var n = 0;
        if (!(i[7832] | 0)) {
            kv(10052);
            nB(25, 10052, w | 0) | 0;
            n = 7832;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10052;
    }
    function ke(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = ki() | 0;
        u[(n + 4) >> 2] = kt() | 0;
        u[(n + 12) >> 2] = r;
        u[(n + 8) >> 2] = ku() | 0;
        u[(n + 32) >> 2] = 2;
        return;
    }
    function ki() {
        return 11709;
    }
    function kt() {
        return 1188;
    }
    function ku() {
        return ka() | 0;
    }
    function kf(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        if ((ko(i, 896) | 0) == 512) {
            if (e | 0) {
                kc(e);
                MG(e);
            }
        } else if (r | 0) {
            ts(r);
            MG(r);
        }
        return;
    }
    function ko(n, r) {
        n = n | 0;
        r = r | 0;
        return (r & n) | 0;
    }
    function kc(n) {
        n = n | 0;
        n = u[(n + 4) >> 2] | 0;
        if (n | 0) ML(n);
        return;
    }
    function ka() {
        var n = 0;
        if (!(i[7824] | 0)) {
            u[2511] = kl() | 0;
            u[2512] = 0;
            n = 7824;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10044;
    }
    function kl() {
        return 0;
    }
    function kv(n) {
        n = n | 0;
        ob(n);
        return;
    }
    function ks(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0;
        r = k;
        k = (k + 32) | 0;
        e = (r + 24) | 0;
        f = (r + 16) | 0;
        t = (r + 8) | 0;
        i = r;
        kb(n, 4827);
        kk(n, 4834, 3) | 0;
        kh(n, 3682, 47) | 0;
        u[f >> 2] = 9;
        u[(f + 4) >> 2] = 0;
        u[e >> 2] = u[f >> 2];
        u[(e + 4) >> 2] = u[(f + 4) >> 2];
        kd(n, 4841, e) | 0;
        u[t >> 2] = 1;
        u[(t + 4) >> 2] = 0;
        u[e >> 2] = u[t >> 2];
        u[(e + 4) >> 2] = u[(t + 4) >> 2];
        kw(n, 4871, e) | 0;
        u[i >> 2] = 10;
        u[(i + 4) >> 2] = 0;
        u[e >> 2] = u[i >> 2];
        u[(e + 4) >> 2] = u[(i + 4) >> 2];
        k$(n, 4891, e) | 0;
        k = r;
        return;
    }
    function kb(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = h2() | 0;
        u[n >> 2] = e;
        h1(e, r);
        w1(u[n >> 2] | 0);
        return;
    }
    function kk(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        hB(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function kh(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        h$(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function kd(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        k6(n, r, t);
        k = i;
        return n | 0;
    }
    function kw(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        kY(n, r, t);
        k = i;
        return n | 0;
    }
    function k$(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = u[(e + 4) >> 2] | 0;
        u[f >> 2] = u[e >> 2];
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        km(n, r, t);
        k = i;
        return n | 0;
    }
    function km(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        ky(n, e, t, 1);
        k = i;
        return;
    }
    function ky(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = kp() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = kC(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, kM(f, i) | 0, i);
        k = t;
        return;
    }
    function kp() {
        var n = 0, r = 0;
        if (!(i[7840] | 0)) {
            kN(10100);
            nB(48, 10100, w | 0) | 0;
            r = 7840;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10100) | 0)) {
            n = 10100;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            kN(10100);
        }
        return 10100;
    }
    function kC(n) {
        n = n | 0;
        return 0;
    }
    function kM(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = kp() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            kg(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            kA(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function kg(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function kA(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = kI(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            kS(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            kg(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            kT(n, c);
            kx(c);
            k = l;
            return;
        }
    }
    function kI(n) {
        n = n | 0;
        return 357913941;
    }
    function kS(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function kT(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function kx(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function kN(n) {
        n = n | 0;
        kP(n);
        return;
    }
    function kL(n) {
        n = n | 0;
        kO((n + 24) | 0);
        return;
    }
    function kO(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function kP(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 6, r, kE() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function kE() {
        return 1364;
    }
    function kG(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = kB(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        e = kR(r, t, e) | 0;
        k = i;
        return e | 0;
    }
    function kB(n) {
        n = n | 0;
        return ((u[((kp() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function kR(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0;
        f = k;
        k = (k + 16) | 0;
        t = f;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        oG(t, e);
        t = oB(t, e) | 0;
        t = o8(g_[i & 15](n, t) | 0) | 0;
        k = f;
        return t | 0;
    }
    function kY(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        kU(n, e, t, 0);
        k = i;
        return;
    }
    function kU(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = kj() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = kz(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, kD(f, i) | 0, i);
        k = t;
        return;
    }
    function kj() {
        var n = 0, r = 0;
        if (!(i[7848] | 0)) {
            kJ(10136);
            nB(49, 10136, w | 0) | 0;
            r = 7848;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10136) | 0)) {
            n = 10136;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            kJ(10136);
        }
        return 10136;
    }
    function kz(n) {
        n = n | 0;
        return 0;
    }
    function kD(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = kj() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            kF(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            kK(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function kF(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function kK(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = kq(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            kH(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            kF(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            kX(n, c);
            kZ(c);
            k = l;
            return;
        }
    }
    function kq(n) {
        n = n | 0;
        return 357913941;
    }
    function kH(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function kX(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function kZ(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function kJ(n) {
        n = n | 0;
        kW(n);
        return;
    }
    function kQ(n) {
        n = n | 0;
        kV((n + 24) | 0);
        return;
    }
    function kV(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function kW(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 9, r, k_() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function k_() {
        return 1372;
    }
    function k0(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        o = k2(n) | 0;
        n = u[(o + 4) >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = n;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        k1(r, t, e);
        k = i;
        return;
    }
    function k2(n) {
        n = n | 0;
        return ((u[((kj() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function k1(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        var i = 0, t = 0, f = 0, o = rr;
        f = k;
        k = (k + 16) | 0;
        t = f;
        i = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) i = u[((u[n >> 2] | 0) + i) >> 2] | 0;
        k4(t, e);
        o = Z(k8(t, e));
        gz[i & 1](n, o);
        k = f;
        return;
    }
    function k4(n, r) {
        n = n | 0;
        r = +r;
        return;
    }
    function k8(n, r) {
        n = n | 0;
        r = +r;
        return Z(k3(r));
    }
    function k3(n) {
        n = +n;
        return Z(n);
    }
    function k6(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        t = (i + 8) | 0;
        f = i;
        c = u[e >> 2] | 0;
        o = u[(e + 4) >> 2] | 0;
        e = fI(r) | 0;
        u[f >> 2] = c;
        u[(f + 4) >> 2] = o;
        u[t >> 2] = u[f >> 2];
        u[(t + 4) >> 2] = u[(f + 4) >> 2];
        k9(n, e, t, 0);
        k = i;
        return;
    }
    function k9(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        t = k;
        k = (k + 32) | 0;
        f = (t + 16) | 0;
        v = (t + 8) | 0;
        c = t;
        l = u[e >> 2] | 0;
        a = u[(e + 4) >> 2] | 0;
        o = u[n >> 2] | 0;
        n = k7() | 0;
        u[v >> 2] = l;
        u[(v + 4) >> 2] = a;
        u[f >> 2] = u[v >> 2];
        u[(f + 4) >> 2] = u[(v + 4) >> 2];
        e = k5(f) | 0;
        u[c >> 2] = l;
        u[(c + 4) >> 2] = a;
        u[f >> 2] = u[c >> 2];
        u[(f + 4) >> 2] = u[(c + 4) >> 2];
        fL(o, r, n, e, hn(f, i) | 0, i);
        k = t;
        return;
    }
    function k7() {
        var n = 0, r = 0;
        if (!(i[7856] | 0)) {
            ho(10172);
            nB(50, 10172, w | 0) | 0;
            r = 7856;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10172) | 0)) {
            n = 10172;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            ho(10172);
        }
        return 10172;
    }
    function k5(n) {
        n = n | 0;
        return 0;
    }
    function hn(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        v = k;
        k = (k + 32) | 0;
        t = (v + 24) | 0;
        o = (v + 16) | 0;
        c = v;
        a = (v + 8) | 0;
        f = u[n >> 2] | 0;
        i = u[(n + 4) >> 2] | 0;
        u[c >> 2] = f;
        u[(c + 4) >> 2] = i;
        s = k7() | 0;
        l = (s + 24) | 0;
        n = fG(r, 4) | 0;
        u[a >> 2] = n;
        r = (s + 28) | 0;
        e = u[r >> 2] | 0;
        if (e >>> 0 < (u[(s + 32) >> 2] | 0) >>> 0) {
            u[o >> 2] = f;
            u[(o + 4) >> 2] = i;
            u[t >> 2] = u[o >> 2];
            u[(t + 4) >> 2] = u[(o + 4) >> 2];
            hr(e, t, n);
            n = ((u[r >> 2] | 0) + 12) | 0;
            u[r >> 2] = n;
        } else {
            he(l, c, a);
            n = u[r >> 2] | 0;
        }
        k = v;
        return (((((n - (u[l >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function hr(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = u[(r + 4) >> 2] | 0;
        u[n >> 2] = u[r >> 2];
        u[(n + 4) >> 2] = i;
        u[(n + 8) >> 2] = e;
        return;
    }
    function he(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        l = k;
        k = (k + 48) | 0;
        i = (l + 32) | 0;
        o = (l + 24) | 0;
        c = l;
        a = (n + 4) | 0;
        t = ((((((u[a >> 2] | 0) - (u[n >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        f = hi(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            v = u[n >> 2] | 0;
            b = ((((u[(n + 8) >> 2] | 0) - v) | 0) / 12) | 0;
            s = b << 1;
            ht(c, b >>> 0 < (f >>> 1) >>> 0 ? (s >>> 0 < t >>> 0 ? t : s) : f, ((((u[a >> 2] | 0) - v) | 0) / 12) | 0, (n + 8) | 0);
            a = (c + 8) | 0;
            f = u[a >> 2] | 0;
            t = u[(r + 4) >> 2] | 0;
            e = u[e >> 2] | 0;
            u[o >> 2] = u[r >> 2];
            u[(o + 4) >> 2] = t;
            u[i >> 2] = u[o >> 2];
            u[(i + 4) >> 2] = u[(o + 4) >> 2];
            hr(f, i, e);
            u[a >> 2] = (u[a >> 2] | 0) + 12;
            hu(n, c);
            hf(c);
            k = l;
            return;
        }
    }
    function hi(n) {
        n = n | 0;
        return 357913941;
    }
    function ht(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 357913941) nZ();
            else {
                t = MP((r * 12) | 0) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + ((e * 12) | 0)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + ((r * 12) | 0);
        return;
    }
    function hu(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + (((((t | 0) / -12) | 0) * 12) | 0)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function hf(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + ((~(((((i + -12 - r) | 0) >>> 0) / 12) | 0) * 12) | 0);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function ho(n) {
        n = n | 0;
        hl(n);
        return;
    }
    function hc(n) {
        n = n | 0;
        ha((n + 24) | 0);
        return;
    }
    function ha(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + ((~(((((r + -12 - i) | 0) >>> 0) / 12) | 0) * 12) | 0);
            MG(e);
        }
        return;
    }
    function hl(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 2, 3, r, hv() | 0, 2);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function hv() {
        return 1380;
    }
    function hs(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0;
        t = k;
        k = (k + 16) | 0;
        f = (t + 8) | 0;
        o = t;
        c = hb(n) | 0;
        n = u[(c + 4) >> 2] | 0;
        u[o >> 2] = u[c >> 2];
        u[(o + 4) >> 2] = n;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = u[(o + 4) >> 2];
        hk(r, f, e, i);
        k = t;
        return;
    }
    function hb(n) {
        n = n | 0;
        return ((u[((k7() | 0) + 24) >> 2] | 0) + ((n * 12) | 0)) | 0;
    }
    function hk(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0;
        c = k;
        k = (k + 16) | 0;
        f = (c + 1) | 0;
        o = c;
        t = u[r >> 2] | 0;
        r = u[(r + 4) >> 2] | 0;
        n = (n + (r >> 1)) | 0;
        if (r & 1) t = u[((u[n >> 2] | 0) + t) >> 2] | 0;
        oG(f, e);
        f = oB(f, e) | 0;
        hh(o, i);
        o = hd(o, i) | 0;
        g9[t & 15](n, f, o);
        k = c;
        return;
    }
    function hh(n, r) {
        n = n | 0;
        r = r | 0;
        return;
    }
    function hd(n, r) {
        n = n | 0;
        r = r | 0;
        return hw(r) | 0;
    }
    function hw(n) {
        n = n | 0;
        return ((n | 0) != 0) | 0;
    }
    function h$(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = hm() | 0;
        n = hy(e) | 0;
        fL(f, r, t, n, hp(e, i) | 0, i);
        return;
    }
    function hm() {
        var n = 0, r = 0;
        if (!(i[7864] | 0)) {
            hT(10208);
            nB(51, 10208, w | 0) | 0;
            r = 7864;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10208) | 0)) {
            n = 10208;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            hT(10208);
        }
        return 10208;
    }
    function hy(n) {
        n = n | 0;
        return n | 0;
    }
    function hp(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = hm() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            hC(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            hM(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function hC(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function hM(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = hg(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            hA(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            hC(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            hI(n, t);
            hS(t);
            k = c;
            return;
        }
    }
    function hg(n) {
        n = n | 0;
        return 536870911;
    }
    function hA(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function hI(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function hS(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function hT(n) {
        n = n | 0;
        hL(n);
        return;
    }
    function hx(n) {
        n = n | 0;
        hN((n + 24) | 0);
        return;
    }
    function hN(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function hL(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 24, r, hO() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function hO() {
        return 1392;
    }
    function hP(n, r) {
        n = n | 0;
        r = r | 0;
        hG(u[(hE(n) | 0) >> 2] | 0, r);
        return;
    }
    function hE(n) {
        n = n | 0;
        return ((u[((hm() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function hG(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        bq(i, r);
        r = bH(i, r) | 0;
        gK[n & 127](r);
        k = e;
        return;
    }
    function hB(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = hR() | 0;
        n = hY(e) | 0;
        fL(f, r, t, n, hU(e, i) | 0, i);
        return;
    }
    function hR() {
        var n = 0, r = 0;
        if (!(i[7872] | 0)) {
            hH(10244);
            nB(52, 10244, w | 0) | 0;
            r = 7872;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10244) | 0)) {
            n = 10244;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            hH(10244);
        }
        return 10244;
    }
    function hY(n) {
        n = n | 0;
        return n | 0;
    }
    function hU(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = hR() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            hj(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            hz(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function hj(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function hz(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = hD(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            hF(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            hj(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            hK(n, t);
            hq(t);
            k = c;
            return;
        }
    }
    function hD(n) {
        n = n | 0;
        return 536870911;
    }
    function hF(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function hK(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function hq(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function hH(n) {
        n = n | 0;
        hJ(n);
        return;
    }
    function hX(n) {
        n = n | 0;
        hZ((n + 24) | 0);
        return;
    }
    function hZ(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function hJ(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 16, r, hQ() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function hQ() {
        return 1400;
    }
    function hV(n) {
        n = n | 0;
        return h_(u[(hW(n) | 0) >> 2] | 0) | 0;
    }
    function hW(n) {
        n = n | 0;
        return ((u[((hR() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function h_(n) {
        n = n | 0;
        return h0(g4[n & 7]() | 0) | 0;
    }
    function h0(n) {
        n = n | 0;
        return n | 0;
    }
    function h2() {
        var n = 0;
        if (!(i[7880] | 0)) {
            h7(10280);
            nB(25, 10280, w | 0) | 0;
            n = 7880;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10280;
    }
    function h1(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = h4() | 0;
        u[(n + 4) >> 2] = h8() | 0;
        u[(n + 12) >> 2] = r;
        u[(n + 8) >> 2] = h3() | 0;
        u[(n + 32) >> 2] = 4;
        return;
    }
    function h4() {
        return 11711;
    }
    function h8() {
        return 1356;
    }
    function h3() {
        return ka() | 0;
    }
    function h6(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        if ((ko(i, 896) | 0) == 512) {
            if (e | 0) {
                h9(e);
                MG(e);
            }
        } else if (r | 0) {
            tt(r);
            MG(r);
        }
        return;
    }
    function h9(n) {
        n = n | 0;
        n = u[(n + 4) >> 2] | 0;
        if (n | 0) ML(n);
        return;
    }
    function h7(n) {
        n = n | 0;
        ob(n);
        return;
    }
    function h5(n) {
        n = n | 0;
        dn(n, 4920);
        dr(n) | 0;
        de(n) | 0;
        return;
    }
    function dn(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = lW() | 0;
        u[n >> 2] = e;
        dx(e, r);
        w1(u[n >> 2] | 0);
        return;
    }
    function dr(n) {
        n = n | 0;
        var r = 0;
        r = u[n >> 2] | 0;
        dt(r, dw() | 0);
        return n | 0;
    }
    function de(n) {
        n = n | 0;
        var r = 0;
        r = u[n >> 2] | 0;
        dt(r, di() | 0);
        return n | 0;
    }
    function di() {
        var n = 0;
        if (!(i[7888] | 0)) {
            du(10328);
            nB(53, 10328, w | 0) | 0;
            n = 7888;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        if (!(fK(10328) | 0)) du(10328);
        return 10328;
    }
    function dt(n, r) {
        n = n | 0;
        r = r | 0;
        fL(n, 0, r, 0, 0, 0);
        return;
    }
    function du(n) {
        n = n | 0;
        da(n);
        dv(n, 10);
        return;
    }
    function df(n) {
        n = n | 0;
        dc((n + 24) | 0);
        return;
    }
    function dc(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function da(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 5, 1, r, dk() | 0, 2);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function dl(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        ds(n, r, e);
        return;
    }
    function dv(n, r) {
        n = n | 0;
        r = r | 0;
        u[(n + 20) >> 2] = r;
        return;
    }
    function ds(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 16) | 0;
        f = (i + 8) | 0;
        c = (i + 13) | 0;
        t = i;
        o = (i + 12) | 0;
        oG(c, r);
        u[f >> 2] = oB(c, r) | 0;
        oP(o, e);
        l[t >> 3] = +oE(o, e);
        db(n, f, t);
        k = i;
        return;
    }
    function db(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        t8((n + 8) | 0, u[r >> 2] | 0, +l[e >> 3]);
        i[(n + 24) >> 0] = 1;
        return;
    }
    function dk() {
        return 1404;
    }
    function dh(n, r) {
        n = n | 0;
        r = +r;
        return dd(n, r) | 0;
    }
    function dd(n, r) {
        n = n | 0;
        r = +r;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        i = k;
        k = (k + 16) | 0;
        f = (i + 4) | 0;
        o = (i + 8) | 0;
        c = i;
        t = ye(8) | 0;
        e = t;
        a = MP(16) | 0;
        oG(f, n);
        n = oB(f, n) | 0;
        oP(o, r);
        t8(a, n, +oE(o, r));
        o = (e + 4) | 0;
        u[o >> 2] = a;
        n = MP(8) | 0;
        o = u[o >> 2] | 0;
        u[c >> 2] = 0;
        u[f >> 2] = u[c >> 2];
        l2(n, o, f);
        u[t >> 2] = n;
        k = i;
        return e | 0;
    }
    function dw() {
        var n = 0;
        if (!(i[7896] | 0)) {
            d$(10364);
            nB(54, 10364, w | 0) | 0;
            n = 7896;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        if (!(fK(10364) | 0)) d$(10364);
        return 10364;
    }
    function d$(n) {
        n = n | 0;
        dp(n);
        dv(n, 55);
        return;
    }
    function dm(n) {
        n = n | 0;
        dy((n + 24) | 0);
        return;
    }
    function dy(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function dp(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 5, 4, r, dI() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function dC(n) {
        n = n | 0;
        dM(n);
        return;
    }
    function dM(n) {
        n = n | 0;
        dg(n);
        return;
    }
    function dg(n) {
        n = n | 0;
        dA((n + 8) | 0);
        i[(n + 24) >> 0] = 1;
        return;
    }
    function dA(n) {
        n = n | 0;
        u[n >> 2] = 0;
        l[(n + 8) >> 3] = 0.0;
        return;
    }
    function dI() {
        return 1424;
    }
    function dS() {
        return dT() | 0;
    }
    function dT() {
        var n = 0, r = 0, e = 0, i = 0, t = 0, f = 0, o = 0;
        r = k;
        k = (k + 16) | 0;
        t = (r + 4) | 0;
        o = r;
        e = ye(8) | 0;
        n = e;
        i = MP(16) | 0;
        dA(i);
        f = (n + 4) | 0;
        u[f >> 2] = i;
        i = MP(8) | 0;
        f = u[f >> 2] | 0;
        u[o >> 2] = 0;
        u[t >> 2] = u[o >> 2];
        l2(i, f, t);
        u[e >> 2] = i;
        k = r;
        return n | 0;
    }
    function dx(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = dN() | 0;
        u[(n + 4) >> 2] = dL() | 0;
        u[(n + 12) >> 2] = r;
        u[(n + 8) >> 2] = dO() | 0;
        u[(n + 32) >> 2] = 5;
        return;
    }
    function dN() {
        return 11710;
    }
    function dL() {
        return 1416;
    }
    function dO() {
        return dG() | 0;
    }
    function dP(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        if ((ko(i, 896) | 0) == 512) {
            if (e | 0) {
                dE(e);
                MG(e);
            }
        } else if (r | 0) MG(r);
        return;
    }
    function dE(n) {
        n = n | 0;
        n = u[(n + 4) >> 2] | 0;
        if (n | 0) ML(n);
        return;
    }
    function dG() {
        var n = 0;
        if (!(i[7904] | 0)) {
            u[2600] = dB() | 0;
            u[2601] = 0;
            n = 7904;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10400;
    }
    function dB() {
        return u[357] | 0;
    }
    function dR(n) {
        n = n | 0;
        dY(n, 4926);
        dU(n) | 0;
        return;
    }
    function dY(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = f0() | 0;
        u[n >> 2] = e;
        dV(e, r);
        w1(u[n >> 2] | 0);
        return;
    }
    function dU(n) {
        n = n | 0;
        var r = 0;
        r = u[n >> 2] | 0;
        dt(r, dj() | 0);
        return n | 0;
    }
    function dj() {
        var n = 0;
        if (!(i[7912] | 0)) {
            dz(10412);
            nB(56, 10412, w | 0) | 0;
            n = 7912;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        if (!(fK(10412) | 0)) dz(10412);
        return 10412;
    }
    function dz(n) {
        n = n | 0;
        dK(n);
        dv(n, 57);
        return;
    }
    function dD(n) {
        n = n | 0;
        dF((n + 24) | 0);
        return;
    }
    function dF(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function dK(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 5, 5, r, dZ() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function dq(n) {
        n = n | 0;
        dH(n);
        return;
    }
    function dH(n) {
        n = n | 0;
        dX(n);
        return;
    }
    function dX(n) {
        n = n | 0;
        var r = 0, e = 0;
        r = (n + 8) | 0;
        e = (r + 48) | 0;
        do {
            u[r >> 2] = 0;
            r = (r + 4) | 0;
        }while ((r | 0) < (e | 0))
        i[(n + 56) >> 0] = 1;
        return;
    }
    function dZ() {
        return 1432;
    }
    function dJ() {
        return dQ() | 0;
    }
    function dQ() {
        var n = 0, r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0;
        o = k;
        k = (k + 16) | 0;
        n = (o + 4) | 0;
        r = o;
        e = ye(8) | 0;
        i = e;
        t = MP(48) | 0;
        f = t;
        c = (f + 48) | 0;
        do {
            u[f >> 2] = 0;
            f = (f + 4) | 0;
        }while ((f | 0) < (c | 0))
        f = (i + 4) | 0;
        u[f >> 2] = t;
        c = MP(8) | 0;
        f = u[f >> 2] | 0;
        u[r >> 2] = 0;
        u[n >> 2] = u[r >> 2];
        f9(c, f, n);
        u[e >> 2] = c;
        k = o;
        return i | 0;
    }
    function dV(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = dW() | 0;
        u[(n + 4) >> 2] = d_() | 0;
        u[(n + 12) >> 2] = r;
        u[(n + 8) >> 2] = d0() | 0;
        u[(n + 32) >> 2] = 6;
        return;
    }
    function dW() {
        return 11704;
    }
    function d_() {
        return 1436;
    }
    function d0() {
        return dG() | 0;
    }
    function d2(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        if ((ko(i, 896) | 0) == 512) {
            if (e | 0) {
                d1(e);
                MG(e);
            }
        } else if (r | 0) MG(r);
        return;
    }
    function d1(n) {
        n = n | 0;
        n = u[(n + 4) >> 2] | 0;
        if (n | 0) ML(n);
        return;
    }
    function d4(n) {
        n = n | 0;
        d8(n, 4933);
        d3(n) | 0;
        d6(n) | 0;
        return;
    }
    function d8(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = wA() | 0;
        u[n >> 2] = e;
        wI(e, r);
        w1(u[n >> 2] | 0);
        return;
    }
    function d3(n) {
        n = n | 0;
        var r = 0;
        r = u[n >> 2] | 0;
        dt(r, wb() | 0);
        return n | 0;
    }
    function d6(n) {
        n = n | 0;
        var r = 0;
        r = u[n >> 2] | 0;
        dt(r, d9() | 0);
        return n | 0;
    }
    function d9() {
        var n = 0;
        if (!(i[7920] | 0)) {
            d7(10452);
            nB(58, 10452, w | 0) | 0;
            n = 7920;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        if (!(fK(10452) | 0)) d7(10452);
        return 10452;
    }
    function d7(n) {
        n = n | 0;
        wr(n);
        dv(n, 1);
        return;
    }
    function d5(n) {
        n = n | 0;
        wn((n + 24) | 0);
        return;
    }
    function wn(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function wr(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 5, 1, r, wf() | 0, 2);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function we(n, r, e) {
        n = n | 0;
        r = +r;
        e = +e;
        wi(n, r, e);
        return;
    }
    function wi(n, r, e) {
        n = n | 0;
        r = +r;
        e = +e;
        var i = 0, t = 0, u = 0, f = 0, o = 0;
        i = k;
        k = (k + 32) | 0;
        u = (i + 8) | 0;
        o = (i + 17) | 0;
        t = i;
        f = (i + 16) | 0;
        oP(o, r);
        l[u >> 3] = +oE(o, r);
        oP(f, e);
        l[t >> 3] = +oE(f, e);
        wt(n, u, t);
        k = i;
        return;
    }
    function wt(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        wu((n + 8) | 0, +l[r >> 3], +l[e >> 3]);
        i[(n + 24) >> 0] = 1;
        return;
    }
    function wu(n, r, e) {
        n = n | 0;
        r = +r;
        e = +e;
        l[n >> 3] = r;
        l[(n + 8) >> 3] = e;
        return;
    }
    function wf() {
        return 1472;
    }
    function wo(n, r) {
        n = +n;
        r = +r;
        return wc(n, r) | 0;
    }
    function wc(n, r) {
        n = +n;
        r = +r;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        i = k;
        k = (k + 16) | 0;
        o = (i + 4) | 0;
        c = (i + 8) | 0;
        a = i;
        t = ye(8) | 0;
        e = t;
        f = MP(16) | 0;
        oP(o, n);
        n = +oE(o, n);
        oP(c, r);
        wu(f, n, +oE(c, r));
        c = (e + 4) | 0;
        u[c >> 2] = f;
        f = MP(8) | 0;
        c = u[c >> 2] | 0;
        u[a >> 2] = 0;
        u[o >> 2] = u[a >> 2];
        wa(f, c, o);
        u[t >> 2] = f;
        k = i;
        return e | 0;
    }
    function wa(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        e = MP(16) | 0;
        u[(e + 4) >> 2] = 0;
        u[(e + 8) >> 2] = 0;
        u[e >> 2] = 1452;
        u[(e + 12) >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function wl(n) {
        n = n | 0;
        MS(n);
        MG(n);
        return;
    }
    function wv(n) {
        n = n | 0;
        n = u[(n + 12) >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function ws(n) {
        n = n | 0;
        MG(n);
        return;
    }
    function wb() {
        var n = 0;
        if (!(i[7928] | 0)) {
            wk(10488);
            nB(59, 10488, w | 0) | 0;
            n = 7928;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        if (!(fK(10488) | 0)) wk(10488);
        return 10488;
    }
    function wk(n) {
        n = n | 0;
        ww(n);
        dv(n, 60);
        return;
    }
    function wh(n) {
        n = n | 0;
        wd((n + 24) | 0);
        return;
    }
    function wd(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function ww(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 5, 6, r, wC() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function w$(n) {
        n = n | 0;
        wm(n);
        return;
    }
    function wm(n) {
        n = n | 0;
        wy(n);
        return;
    }
    function wy(n) {
        n = n | 0;
        wp((n + 8) | 0);
        i[(n + 24) >> 0] = 1;
        return;
    }
    function wp(n) {
        n = n | 0;
        u[n >> 2] = 0;
        u[(n + 4) >> 2] = 0;
        u[(n + 8) >> 2] = 0;
        u[(n + 12) >> 2] = 0;
        return;
    }
    function wC() {
        return 1492;
    }
    function wM() {
        return wg() | 0;
    }
    function wg() {
        var n = 0, r = 0, e = 0, i = 0, t = 0, f = 0, o = 0;
        r = k;
        k = (k + 16) | 0;
        t = (r + 4) | 0;
        o = r;
        e = ye(8) | 0;
        n = e;
        i = MP(16) | 0;
        wp(i);
        f = (n + 4) | 0;
        u[f >> 2] = i;
        i = MP(8) | 0;
        f = u[f >> 2] | 0;
        u[o >> 2] = 0;
        u[t >> 2] = u[o >> 2];
        wa(i, f, t);
        u[e >> 2] = i;
        k = r;
        return n | 0;
    }
    function wA() {
        var n = 0;
        if (!(i[7936] | 0)) {
            wO(10524);
            nB(25, 10524, w | 0) | 0;
            n = 7936;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10524;
    }
    function wI(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = wS() | 0;
        u[(n + 4) >> 2] = wT() | 0;
        u[(n + 12) >> 2] = r;
        u[(n + 8) >> 2] = wx() | 0;
        u[(n + 32) >> 2] = 7;
        return;
    }
    function wS() {
        return 11700;
    }
    function wT() {
        return 1484;
    }
    function wx() {
        return dG() | 0;
    }
    function wN(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        if ((ko(i, 896) | 0) == 512) {
            if (e | 0) {
                wL(e);
                MG(e);
            }
        } else if (r | 0) MG(r);
        return;
    }
    function wL(n) {
        n = n | 0;
        n = u[(n + 4) >> 2] | 0;
        if (n | 0) ML(n);
        return;
    }
    function wO(n) {
        n = n | 0;
        ob(n);
        return;
    }
    function wP(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        n = fI(r) | 0;
        r = wE(e) | 0;
        e = wG(e, 0) | 0;
        $l(n, r, e, wB() | 0, 0);
        return;
    }
    function wE(n) {
        n = n | 0;
        return n | 0;
    }
    function wG(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = wB() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            wK(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            wq(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function wB() {
        var n = 0, r = 0;
        if (!(i[7944] | 0)) {
            wR(10568);
            nB(61, 10568, w | 0) | 0;
            r = 7944;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10568) | 0)) {
            n = 10568;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            wR(10568);
        }
        return 10568;
    }
    function wR(n) {
        n = n | 0;
        wj(n);
        return;
    }
    function wY(n) {
        n = n | 0;
        wU((n + 24) | 0);
        return;
    }
    function wU(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function wj(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 17, r, as() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function wz(n) {
        n = n | 0;
        return wF(u[(wD(n) | 0) >> 2] | 0) | 0;
    }
    function wD(n) {
        n = n | 0;
        return ((u[((wB() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function wF(n) {
        n = n | 0;
        return ad(g4[n & 7]() | 0) | 0;
    }
    function wK(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function wq(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = wH(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            wX(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            wK(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            wZ(n, t);
            wJ(t);
            k = c;
            return;
        }
    }
    function wH(n) {
        n = n | 0;
        return 536870911;
    }
    function wX(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function wZ(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function wJ(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function wQ() {
        wV();
        return;
    }
    function wV() {
        wW(10604);
        return;
    }
    function wW(n) {
        n = n | 0;
        w_(n, 4955);
        return;
    }
    function w_(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = w0() | 0;
        u[n >> 2] = e;
        w2(e, r);
        w1(u[n >> 2] | 0);
        return;
    }
    function w0() {
        var n = 0;
        if (!(i[7952] | 0)) {
            $e(10612);
            nB(25, 10612, w | 0) | 0;
            n = 7952;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10612;
    }
    function w2(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = w9() | 0;
        u[(n + 4) >> 2] = w7() | 0;
        u[(n + 12) >> 2] = r;
        u[(n + 8) >> 2] = w5() | 0;
        u[(n + 32) >> 2] = 8;
        return;
    }
    function w1(n) {
        n = n | 0;
        var r = 0, e = 0;
        r = k;
        k = (k + 16) | 0;
        e = r;
        w4() | 0;
        u[e >> 2] = n;
        w8(10608, e);
        k = r;
        return;
    }
    function w4() {
        if (!(i[11714] | 0)) {
            u[2652] = 0;
            nB(62, 10608, w | 0) | 0;
            i[11714] = 1;
        }
        return 10608;
    }
    function w8(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = MP(8) | 0;
        u[(e + 4) >> 2] = u[r >> 2];
        u[e >> 2] = u[n >> 2];
        u[n >> 2] = e;
        return;
    }
    function w3(n) {
        n = n | 0;
        w6(n);
        return;
    }
    function w6(n) {
        n = n | 0;
        var r = 0, e = 0;
        r = u[n >> 2] | 0;
        if (r | 0) do {
            e = r;
            r = u[r >> 2] | 0;
            MG(e);
        }while ((r | 0) != 0)
        u[n >> 2] = 0;
        return;
    }
    function w9() {
        return 11715;
    }
    function w7() {
        return 1496;
    }
    function w5() {
        return ka() | 0;
    }
    function $n(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        if ((ko(i, 896) | 0) == 512) {
            if (e | 0) {
                $r(e);
                MG(e);
            }
        } else if (r | 0) MG(r);
        return;
    }
    function $r(n) {
        n = n | 0;
        n = u[(n + 4) >> 2] | 0;
        if (n | 0) ML(n);
        return;
    }
    function $e(n) {
        n = n | 0;
        ob(n);
        return;
    }
    function $i(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        w4() | 0;
        e = u[2652] | 0;
        a: do if (e | 0) {
            while(1){
                i = u[(e + 4) >> 2] | 0;
                if (i | 0 ? (C_($t(i) | 0, n) | 0) == 0 : 0) break;
                e = u[e >> 2] | 0;
                if (!e) break a;
            }
            $u(i, r);
        }
        while (0)
        return;
    }
    function $t(n) {
        n = n | 0;
        return u[(n + 12) >> 2] | 0;
    }
    function $u(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        n = (n + 36) | 0;
        e = u[n >> 2] | 0;
        if (e | 0) {
            tb(e);
            MG(e);
        }
        e = MP(4) | 0;
        uC(e, r);
        u[n >> 2] = e;
        return;
    }
    function $f() {
        if (!(i[11716] | 0)) {
            u[2664] = 0;
            nB(63, 10656, w | 0) | 0;
            i[11716] = 1;
        }
        return 10656;
    }
    function $o() {
        var n = 0;
        if (!(i[11717] | 0)) {
            $c();
            u[2665] = 1504;
            i[11717] = 1;
            n = 1504;
        } else n = u[2665] | 0;
        return n | 0;
    }
    function $c() {
        if (!(i[11740] | 0)) {
            i[11718] = fG(fG(8, 0) | 0, 0) | 0;
            i[11719] = fG(fG(0, 0) | 0, 0) | 0;
            i[11720] = fG(fG(0, 16) | 0, 0) | 0;
            i[11721] = fG(fG(8, 0) | 0, 0) | 0;
            i[11722] = fG(fG(0, 0) | 0, 0) | 0;
            i[11723] = fG(fG(8, 0) | 0, 0) | 0;
            i[11724] = fG(fG(0, 0) | 0, 0) | 0;
            i[11725] = fG(fG(8, 0) | 0, 0) | 0;
            i[11726] = fG(fG(0, 0) | 0, 0) | 0;
            i[11727] = fG(fG(8, 0) | 0, 0) | 0;
            i[11728] = fG(fG(0, 0) | 0, 0) | 0;
            i[11729] = fG(fG(0, 0) | 0, 32) | 0;
            i[11730] = fG(fG(0, 0) | 0, 32) | 0;
            i[11740] = 1;
        }
        return;
    }
    function $a() {
        return 1572;
    }
    function $l(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        f = k;
        k = (k + 32) | 0;
        v = (f + 16) | 0;
        l = (f + 12) | 0;
        a = (f + 8) | 0;
        c = (f + 4) | 0;
        o = f;
        u[v >> 2] = n;
        u[l >> 2] = r;
        u[a >> 2] = e;
        u[c >> 2] = i;
        u[o >> 2] = t;
        $f() | 0;
        $v(10656, v, l, a, c, o);
        k = f;
        return;
    }
    function $v(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        var o = 0;
        o = MP(24) | 0;
        fE((o + 4) | 0, u[r >> 2] | 0, u[e >> 2] | 0, u[i >> 2] | 0, u[t >> 2] | 0, u[f >> 2] | 0);
        u[o >> 2] = u[n >> 2];
        u[n >> 2] = o;
        return;
    }
    function $s(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0, d = 0, w = 0, $ = 0, m = 0, y = 0;
        y = k;
        k = (k + 32) | 0;
        d = (y + 20) | 0;
        w = (y + 8) | 0;
        $ = (y + 4) | 0;
        m = y;
        r = u[r >> 2] | 0;
        if (r | 0) {
            h = (d + 4) | 0;
            a = (d + 8) | 0;
            l = (w + 4) | 0;
            v = (w + 8) | 0;
            s = (w + 8) | 0;
            b = (d + 8) | 0;
            do {
                o = (r + 4) | 0;
                c = $b(o) | 0;
                if (c | 0) {
                    t = $k(c) | 0;
                    u[d >> 2] = 0;
                    u[h >> 2] = 0;
                    u[a >> 2] = 0;
                    i = (($h(c) | 0) + 1) | 0;
                    $d(d, i);
                    if (i | 0) while(1){
                        i = (i + -1) | 0;
                        Cb(w, u[t >> 2] | 0);
                        f = u[h >> 2] | 0;
                        if (f >>> 0 < (u[b >> 2] | 0) >>> 0) {
                            u[f >> 2] = u[w >> 2];
                            u[h >> 2] = (u[h >> 2] | 0) + 4;
                        } else $w(d, w);
                        if (!i) break;
                        else t = (t + 4) | 0;
                    }
                    i = $$(c) | 0;
                    u[w >> 2] = 0;
                    u[l >> 2] = 0;
                    u[v >> 2] = 0;
                    a: do if (u[i >> 2] | 0) {
                        t = 0;
                        f = 0;
                        while(1){
                            if ((t | 0) == (f | 0)) $m(w, i);
                            else {
                                u[t >> 2] = u[i >> 2];
                                u[l >> 2] = (u[l >> 2] | 0) + 4;
                            }
                            i = (i + 4) | 0;
                            if (!(u[i >> 2] | 0)) break a;
                            t = u[l >> 2] | 0;
                            f = u[s >> 2] | 0;
                        }
                    }
                    while (0)
                    u[$ >> 2] = $y(o) | 0;
                    u[m >> 2] = fK(c) | 0;
                    $p(e, n, $, m, d, w);
                    $C(w);
                    $M(d);
                }
                r = u[r >> 2] | 0;
            }while ((r | 0) != 0)
        }
        k = y;
        return;
    }
    function $b(n) {
        n = n | 0;
        return u[(n + 12) >> 2] | 0;
    }
    function $k(n) {
        n = n | 0;
        return u[(n + 12) >> 2] | 0;
    }
    function $h(n) {
        n = n | 0;
        return u[(n + 16) >> 2] | 0;
    }
    function $d(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = k;
        k = (k + 32) | 0;
        e = t;
        i = u[n >> 2] | 0;
        if ((((u[(n + 8) >> 2] | 0) - i) >> 2) >>> 0 < r >>> 0) {
            $1(e, r, ((u[(n + 4) >> 2] | 0) - i) >> 2, (n + 8) | 0);
            $4(n, e);
            $8(e);
        }
        k = t;
        return;
    }
    function $w(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        o = k;
        k = (k + 32) | 0;
        e = o;
        i = (n + 4) | 0;
        t = ((((u[i >> 2] | 0) - (u[n >> 2] | 0)) >> 2) + 1) | 0;
        f = $W(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            c = u[n >> 2] | 0;
            l = ((u[(n + 8) >> 2] | 0) - c) | 0;
            a = l >> 1;
            $1(e, (l >> 2) >>> 0 < (f >>> 1) >>> 0 ? a >>> 0 < t >>> 0 ? t : a : f, ((u[i >> 2] | 0) - c) >> 2, (n + 8) | 0);
            f = (e + 8) | 0;
            u[u[f >> 2] >> 2] = u[r >> 2];
            u[f >> 2] = (u[f >> 2] | 0) + 4;
            $4(n, e);
            $8(e);
            k = o;
            return;
        }
    }
    function $$(n) {
        n = n | 0;
        return u[(n + 8) >> 2] | 0;
    }
    function $m(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        o = k;
        k = (k + 32) | 0;
        e = o;
        i = (n + 4) | 0;
        t = ((((u[i >> 2] | 0) - (u[n >> 2] | 0)) >> 2) + 1) | 0;
        f = $J(n) | 0;
        if (f >>> 0 < t >>> 0) MI(n);
        else {
            c = u[n >> 2] | 0;
            l = ((u[(n + 8) >> 2] | 0) - c) | 0;
            a = l >> 1;
            $_(e, (l >> 2) >>> 0 < (f >>> 1) >>> 0 ? a >>> 0 < t >>> 0 ? t : a : f, ((u[i >> 2] | 0) - c) >> 2, (n + 8) | 0);
            f = (e + 8) | 0;
            u[u[f >> 2] >> 2] = u[r >> 2];
            u[f >> 2] = (u[f >> 2] | 0) + 4;
            $0(n, e);
            $2(e);
            k = o;
            return;
        }
    }
    function $y(n) {
        n = n | 0;
        return u[n >> 2] | 0;
    }
    function $p(n, r, e, i, t, u) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        u = u | 0;
        $g(n, r, e, i, t, u);
        return;
    }
    function $C(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -4 - i) | 0) >>> 2) << 2);
            MG(e);
        }
        return;
    }
    function $M(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -4 - i) | 0) >>> 2) << 2);
            MG(e);
        }
        return;
    }
    function $g(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        var o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        o = k;
        k = (k + 48) | 0;
        v = (o + 40) | 0;
        c = (o + 32) | 0;
        s = (o + 24) | 0;
        a = (o + 12) | 0;
        l = o;
        Cm(c);
        n = uI(n) | 0;
        u[s >> 2] = u[r >> 2];
        e = u[e >> 2] | 0;
        i = u[i >> 2] | 0;
        $A(a, t);
        $I(l, f);
        u[v >> 2] = u[s >> 2];
        $S(n, v, e, i, a, l);
        $C(l);
        $M(a);
        Cp(c);
        k = o;
        return;
    }
    function $A(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        u[n >> 2] = 0;
        u[(n + 4) >> 2] = 0;
        u[(n + 8) >> 2] = 0;
        e = (r + 4) | 0;
        i = ((u[e >> 2] | 0) - (u[r >> 2] | 0)) >> 2;
        if (i | 0) {
            $Q(n, i);
            $V(n, u[r >> 2] | 0, u[e >> 2] | 0, i);
        }
        return;
    }
    function $I(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        u[n >> 2] = 0;
        u[(n + 4) >> 2] = 0;
        u[(n + 8) >> 2] = 0;
        e = (r + 4) | 0;
        i = ((u[e >> 2] | 0) - (u[r >> 2] | 0)) >> 2;
        if (i | 0) {
            $X(n, i);
            $Z(n, u[r >> 2] | 0, u[e >> 2] | 0, i);
        }
        return;
    }
    function $S(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        var o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        o = k;
        k = (k + 32) | 0;
        v = (o + 28) | 0;
        s = (o + 24) | 0;
        c = (o + 12) | 0;
        a = o;
        l = ux($T() | 0) | 0;
        u[s >> 2] = u[r >> 2];
        u[v >> 2] = u[s >> 2];
        r = $x(v) | 0;
        e = $N(e) | 0;
        i = $L(i) | 0;
        u[c >> 2] = u[t >> 2];
        v = (t + 4) | 0;
        u[(c + 4) >> 2] = u[v >> 2];
        s = (t + 8) | 0;
        u[(c + 8) >> 2] = u[s >> 2];
        u[s >> 2] = 0;
        u[v >> 2] = 0;
        u[t >> 2] = 0;
        t = $O(c) | 0;
        u[a >> 2] = u[f >> 2];
        v = (f + 4) | 0;
        u[(a + 4) >> 2] = u[v >> 2];
        s = (f + 8) | 0;
        u[(a + 8) >> 2] = u[s >> 2];
        u[s >> 2] = 0;
        u[v >> 2] = 0;
        u[f >> 2] = 0;
        nN(0, l | 0, n | 0, r | 0, e | 0, i | 0, t | 0, $P(a) | 0) | 0;
        $C(a);
        $M(c);
        k = o;
        return;
    }
    function $T() {
        var n = 0;
        if (!(i[7968] | 0)) {
            $q(10708);
            n = 7968;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10708;
    }
    function $x(n) {
        n = n | 0;
        return $R(n) | 0;
    }
    function $N(n) {
        n = n | 0;
        return $G(n) | 0;
    }
    function $L(n) {
        n = n | 0;
        return ad(n) | 0;
    }
    function $O(n) {
        n = n | 0;
        return $B(n) | 0;
    }
    function $P(n) {
        n = n | 0;
        return $E(n) | 0;
    }
    function $E(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        i = ((u[(n + 4) >> 2] | 0) - (u[n >> 2] | 0)) | 0;
        e = i >> 2;
        i = ye((i + 4) | 0) | 0;
        u[i >> 2] = e;
        if (e | 0) {
            r = 0;
            do {
                u[(i + 4 + (r << 2)) >> 2] = $G(u[((u[n >> 2] | 0) + (r << 2)) >> 2] | 0) | 0;
                r = (r + 1) | 0;
            }while ((r | 0) != (e | 0))
        }
        return i | 0;
    }
    function $G(n) {
        n = n | 0;
        return n | 0;
    }
    function $B(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        i = ((u[(n + 4) >> 2] | 0) - (u[n >> 2] | 0)) | 0;
        e = i >> 2;
        i = ye((i + 4) | 0) | 0;
        u[i >> 2] = e;
        if (e | 0) {
            r = 0;
            do {
                u[(i + 4 + (r << 2)) >> 2] = $R(((u[n >> 2] | 0) + (r << 2)) | 0) | 0;
                r = (r + 1) | 0;
            }while ((r | 0) != (e | 0))
        }
        return i | 0;
    }
    function $R(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        t = k;
        k = (k + 32) | 0;
        r = (t + 12) | 0;
        e = t;
        i = f2($Y() | 0) | 0;
        if (!i) n = $U(n) | 0;
        else {
            f1(r, i);
            f4(e, r);
            Cd(n, e);
            n = f3(r) | 0;
        }
        k = t;
        return n | 0;
    }
    function $Y() {
        var n = 0;
        if (!(i[7960] | 0)) {
            $K(10664);
            nB(25, 10664, w | 0) | 0;
            n = 7960;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10664;
    }
    function $U(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0;
        e = k;
        k = (k + 16) | 0;
        t = (e + 4) | 0;
        o = e;
        i = ye(8) | 0;
        r = i;
        c = MP(4) | 0;
        u[c >> 2] = u[n >> 2];
        f = (r + 4) | 0;
        u[f >> 2] = c;
        n = MP(8) | 0;
        f = u[f >> 2] | 0;
        u[o >> 2] = 0;
        u[t >> 2] = u[o >> 2];
        $j(n, f, t);
        u[i >> 2] = n;
        k = e;
        return r | 0;
    }
    function $j(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        e = MP(16) | 0;
        u[(e + 4) >> 2] = 0;
        u[(e + 8) >> 2] = 0;
        u[e >> 2] = 1656;
        u[(e + 12) >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function $z(n) {
        n = n | 0;
        MS(n);
        MG(n);
        return;
    }
    function $D(n) {
        n = n | 0;
        n = u[(n + 12) >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function $F(n) {
        n = n | 0;
        MG(n);
        return;
    }
    function $K(n) {
        n = n | 0;
        ob(n);
        return;
    }
    function $q(n) {
        n = n | 0;
        uz(n, $H() | 0, 5);
        return;
    }
    function $H() {
        return 1676;
    }
    function $X(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        if (($J(n) | 0) >>> 0 < r >>> 0) MI(n);
        if (r >>> 0 > 1073741823) nZ();
        else {
            e = MP(r << 2) | 0;
            u[(n + 4) >> 2] = e;
            u[n >> 2] = e;
            u[(n + 8) >> 2] = e + (r << 2);
            return;
        }
    }
    function $Z(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        i = (n + 4) | 0;
        n = (e - r) | 0;
        if ((n | 0) > 0) {
            MK(u[i >> 2] | 0, r | 0, n | 0) | 0;
            u[i >> 2] = (u[i >> 2] | 0) + ((n >>> 2) << 2);
        }
        return;
    }
    function $J(n) {
        n = n | 0;
        return 1073741823;
    }
    function $Q(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        if (($W(n) | 0) >>> 0 < r >>> 0) MI(n);
        if (r >>> 0 > 1073741823) nZ();
        else {
            e = MP(r << 2) | 0;
            u[(n + 4) >> 2] = e;
            u[n >> 2] = e;
            u[(n + 8) >> 2] = e + (r << 2);
            return;
        }
    }
    function $V(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        i = (n + 4) | 0;
        n = (e - r) | 0;
        if ((n | 0) > 0) {
            MK(u[i >> 2] | 0, r | 0, n | 0) | 0;
            u[i >> 2] = (u[i >> 2] | 0) + ((n >>> 2) << 2);
        }
        return;
    }
    function $W(n) {
        n = n | 0;
        return 1073741823;
    }
    function $_(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 1073741823) nZ();
            else {
                t = MP(r << 2) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 2)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 2);
        return;
    }
    function $0(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 2)) << 2)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function $2(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -4 - r) | 0) >>> 2) << 2);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function $1(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 1073741823) nZ();
            else {
                t = MP(r << 2) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 2)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 2);
        return;
    }
    function $4(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 2)) << 2)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function $8(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -4 - r) | 0) >>> 2) << 2);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function $3(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0, d = 0, w = 0;
        w = k;
        k = (k + 32) | 0;
        v = (w + 20) | 0;
        s = (w + 12) | 0;
        l = (w + 16) | 0;
        b = (w + 4) | 0;
        h = w;
        d = (w + 8) | 0;
        c = $o() | 0;
        f = u[c >> 2] | 0;
        o = u[f >> 2] | 0;
        if (o | 0) {
            a = u[(c + 8) >> 2] | 0;
            c = u[(c + 4) >> 2] | 0;
            while(1){
                Cb(v, o);
                $6(n, v, c, a);
                f = (f + 4) | 0;
                o = u[f >> 2] | 0;
                if (!o) break;
                else {
                    a = (a + 1) | 0;
                    c = (c + 1) | 0;
                }
            }
        }
        f = $a() | 0;
        o = u[f >> 2] | 0;
        if (o | 0) do {
            Cb(v, o);
            u[s >> 2] = u[(f + 4) >> 2];
            $9(r, v, s);
            f = (f + 8) | 0;
            o = u[f >> 2] | 0;
        }while ((o | 0) != 0)
        f = u[(w4() | 0) >> 2] | 0;
        if (f | 0) do {
            r = u[(f + 4) >> 2] | 0;
            Cb(v, u[($7(r) | 0) >> 2] | 0);
            u[s >> 2] = $t(r) | 0;
            $5(e, v, s);
            f = u[f >> 2] | 0;
        }while ((f | 0) != 0)
        Cb(l, 0);
        f = $f() | 0;
        u[v >> 2] = u[l >> 2];
        $s(v, f, t);
        f = u[(w4() | 0) >> 2] | 0;
        if (f | 0) {
            n = (v + 4) | 0;
            r = (v + 8) | 0;
            e = (v + 8) | 0;
            do {
                a = u[(f + 4) >> 2] | 0;
                Cb(s, u[($7(a) | 0) >> 2] | 0);
                mr(b, mn(a) | 0);
                o = u[b >> 2] | 0;
                if (o | 0) {
                    u[v >> 2] = 0;
                    u[n >> 2] = 0;
                    u[r >> 2] = 0;
                    do {
                        Cb(h, u[($7(u[(o + 4) >> 2] | 0) | 0) >> 2] | 0);
                        c = u[n >> 2] | 0;
                        if (c >>> 0 < (u[e >> 2] | 0) >>> 0) {
                            u[c >> 2] = u[h >> 2];
                            u[n >> 2] = (u[n >> 2] | 0) + 4;
                        } else $w(v, h);
                        o = u[o >> 2] | 0;
                    }while ((o | 0) != 0)
                    me(i, s, v);
                    $M(v);
                }
                u[d >> 2] = u[s >> 2];
                l = mi(a) | 0;
                u[v >> 2] = u[d >> 2];
                $s(v, l, t);
                ol(b);
                f = u[f >> 2] | 0;
            }while ((f | 0) != 0)
        }
        k = w;
        return;
    }
    function $6(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        mw(n, r, e, i);
        return;
    }
    function $9(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        md(n, r, e);
        return;
    }
    function $7(n) {
        n = n | 0;
        return n | 0;
    }
    function $5(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        mv(n, r, e);
        return;
    }
    function mn(n) {
        n = n | 0;
        return (n + 16) | 0;
    }
    function mr(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        f = k;
        k = (k + 16) | 0;
        t = (f + 8) | 0;
        e = f;
        u[n >> 2] = 0;
        i = u[r >> 2] | 0;
        u[t >> 2] = i;
        u[e >> 2] = n;
        e = ma(e) | 0;
        if (i | 0) {
            i = MP(12) | 0;
            o = ((ml(t) | 0) + 4) | 0;
            n = u[(o + 4) >> 2] | 0;
            r = (i + 4) | 0;
            u[r >> 2] = u[o >> 2];
            u[(r + 4) >> 2] = n;
            r = u[u[t >> 2] >> 2] | 0;
            u[t >> 2] = r;
            if (!r) n = i;
            else {
                r = i;
                while(1){
                    n = MP(12) | 0;
                    a = ((ml(t) | 0) + 4) | 0;
                    c = u[(a + 4) >> 2] | 0;
                    o = (n + 4) | 0;
                    u[o >> 2] = u[a >> 2];
                    u[(o + 4) >> 2] = c;
                    u[r >> 2] = n;
                    o = u[u[t >> 2] >> 2] | 0;
                    u[t >> 2] = o;
                    if (!o) break;
                    else r = n;
                }
            }
            u[n >> 2] = u[e >> 2];
            u[e >> 2] = i;
        }
        k = f;
        return;
    }
    function me(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        mt(n, r, e);
        return;
    }
    function mi(n) {
        n = n | 0;
        return (n + 24) | 0;
    }
    function mt(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 32) | 0;
        o = (i + 24) | 0;
        t = (i + 16) | 0;
        c = (i + 12) | 0;
        f = i;
        Cm(t);
        n = uI(n) | 0;
        u[c >> 2] = u[r >> 2];
        $A(f, e);
        u[o >> 2] = u[c >> 2];
        mu(n, o, f);
        $M(f);
        Cp(t);
        k = i;
        return;
    }
    function mu(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0;
        i = k;
        k = (k + 32) | 0;
        o = (i + 16) | 0;
        c = (i + 12) | 0;
        t = i;
        f = ux(mf() | 0) | 0;
        u[c >> 2] = u[r >> 2];
        u[o >> 2] = u[c >> 2];
        r = $x(o) | 0;
        u[t >> 2] = u[e >> 2];
        o = (e + 4) | 0;
        u[(t + 4) >> 2] = u[o >> 2];
        c = (e + 8) | 0;
        u[(t + 8) >> 2] = u[c >> 2];
        u[c >> 2] = 0;
        u[o >> 2] = 0;
        u[e >> 2] = 0;
        nI(0, f | 0, n | 0, r | 0, $O(t) | 0) | 0;
        $M(t);
        k = i;
        return;
    }
    function mf() {
        var n = 0;
        if (!(i[7976] | 0)) {
            mo(10720);
            n = 7976;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10720;
    }
    function mo(n) {
        n = n | 0;
        uz(n, mc() | 0, 2);
        return;
    }
    function mc() {
        return 1732;
    }
    function ma(n) {
        n = n | 0;
        return u[n >> 2] | 0;
    }
    function ml(n) {
        n = n | 0;
        return u[n >> 2] | 0;
    }
    function mv(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 32) | 0;
        f = (i + 16) | 0;
        t = (i + 8) | 0;
        o = i;
        Cm(t);
        n = uI(n) | 0;
        u[o >> 2] = u[r >> 2];
        e = u[e >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        ms(n, f, e);
        Cp(t);
        k = i;
        return;
    }
    function ms(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 16) | 0;
        f = (i + 4) | 0;
        o = i;
        t = ux(mb() | 0) | 0;
        u[o >> 2] = u[r >> 2];
        u[f >> 2] = u[o >> 2];
        r = $x(f) | 0;
        nI(0, t | 0, n | 0, r | 0, $N(e) | 0) | 0;
        k = i;
        return;
    }
    function mb() {
        var n = 0;
        if (!(i[7984] | 0)) {
            mk(10732);
            n = 7984;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10732;
    }
    function mk(n) {
        n = n | 0;
        uz(n, mh() | 0, 2);
        return;
    }
    function mh() {
        return 1744;
    }
    function md(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0;
        i = k;
        k = (k + 32) | 0;
        f = (i + 16) | 0;
        t = (i + 8) | 0;
        o = i;
        Cm(t);
        n = uI(n) | 0;
        u[o >> 2] = u[r >> 2];
        e = u[e >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        ms(n, f, e);
        Cp(t);
        k = i;
        return;
    }
    function mw(n, r, e, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        t = t | 0;
        var f = 0, o = 0, c = 0, a = 0;
        f = k;
        k = (k + 32) | 0;
        c = (f + 16) | 0;
        o = (f + 8) | 0;
        a = f;
        Cm(o);
        n = uI(n) | 0;
        u[a >> 2] = u[r >> 2];
        e = i[e >> 0] | 0;
        t = i[t >> 0] | 0;
        u[c >> 2] = u[a >> 2];
        m$(n, c, e, t);
        Cp(o);
        k = f;
        return;
    }
    function m$(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0;
        t = k;
        k = (k + 16) | 0;
        o = (t + 4) | 0;
        c = t;
        f = ux(mm() | 0) | 0;
        u[c >> 2] = u[r >> 2];
        u[o >> 2] = u[c >> 2];
        r = $x(o) | 0;
        e = my(e) | 0;
        n1(0, f | 0, n | 0, r | 0, e | 0, my(i) | 0) | 0;
        k = t;
        return;
    }
    function mm() {
        var n = 0;
        if (!(i[7992] | 0)) {
            mC(10744);
            n = 7992;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10744;
    }
    function my(n) {
        n = n | 0;
        return mp(n) | 0;
    }
    function mp(n) {
        n = n | 0;
        return (n & 255) | 0;
    }
    function mC(n) {
        n = n | 0;
        uz(n, mM() | 0, 3);
        return;
    }
    function mM() {
        return 1756;
    }
    function mg(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0;
        h = k;
        k = (k + 32) | 0;
        a = (h + 8) | 0;
        l = (h + 4) | 0;
        v = (h + 20) | 0;
        s = h;
        c$(n, 0);
        t = Ch(r) | 0;
        u[a >> 2] = 0;
        b = (a + 4) | 0;
        u[b >> 2] = 0;
        u[(a + 8) >> 2] = 0;
        switch((t << 24) >> 24){
            case 0:
                {
                    i[v >> 0] = 0;
                    mA(l, e, v);
                    mI(n, l) | 0;
                    tk(l);
                    break;
                }
            case 8:
                {
                    b = Ck(r) | 0;
                    i[v >> 0] = 8;
                    Cb(s, u[(b + 4) >> 2] | 0);
                    mS(l, e, v, s, (b + 8) | 0);
                    mI(n, l) | 0;
                    tk(l);
                    break;
                }
            case 9:
                {
                    o = Ck(r) | 0;
                    r = u[(o + 4) >> 2] | 0;
                    if (r | 0) {
                        c = (a + 8) | 0;
                        f = (o + 12) | 0;
                        while(1){
                            r = (r + -1) | 0;
                            Cb(l, u[f >> 2] | 0);
                            t = u[b >> 2] | 0;
                            if (t >>> 0 < (u[c >> 2] | 0) >>> 0) {
                                u[t >> 2] = u[l >> 2];
                                u[b >> 2] = (u[b >> 2] | 0) + 4;
                            } else $w(a, l);
                            if (!r) break;
                            else f = (f + 4) | 0;
                        }
                    }
                    i[v >> 0] = 9;
                    Cb(s, u[(o + 8) >> 2] | 0);
                    mT(l, e, v, s, a);
                    mI(n, l) | 0;
                    tk(l);
                    break;
                }
            default:
                {
                    b = Ck(r) | 0;
                    i[v >> 0] = t;
                    Cb(s, u[(b + 4) >> 2] | 0);
                    mx(l, e, v, s);
                    mI(n, l) | 0;
                    tk(l);
                }
        }
        $M(a);
        k = h;
        return;
    }
    function mA(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, u = 0;
        t = k;
        k = (k + 16) | 0;
        u = t;
        Cm(u);
        r = uI(r) | 0;
        mF(n, r, i[e >> 0] | 0);
        Cp(u);
        k = t;
        return;
    }
    function mI(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = u[n >> 2] | 0;
        if (e | 0) n4(e | 0);
        u[n >> 2] = u[r >> 2];
        u[r >> 2] = 0;
        return n | 0;
    }
    function mS(n, r, e, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        t = t | 0;
        f = f | 0;
        var o = 0, c = 0, a = 0, l = 0;
        o = k;
        k = (k + 32) | 0;
        a = (o + 16) | 0;
        c = (o + 8) | 0;
        l = o;
        Cm(c);
        r = uI(r) | 0;
        e = i[e >> 0] | 0;
        u[l >> 2] = u[t >> 2];
        f = u[f >> 2] | 0;
        u[a >> 2] = u[l >> 2];
        mU(n, r, e, a, f);
        Cp(c);
        k = o;
        return;
    }
    function mT(n, r, e, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        t = t | 0;
        f = f | 0;
        var o = 0, c = 0, a = 0, l = 0, v = 0;
        o = k;
        k = (k + 32) | 0;
        l = (o + 24) | 0;
        c = (o + 16) | 0;
        v = (o + 12) | 0;
        a = o;
        Cm(c);
        r = uI(r) | 0;
        e = i[e >> 0] | 0;
        u[v >> 2] = u[t >> 2];
        $A(a, f);
        u[l >> 2] = u[v >> 2];
        mG(n, r, e, l, a);
        $M(a);
        Cp(c);
        k = o;
        return;
    }
    function mx(n, r, e, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        t = t | 0;
        var f = 0, o = 0, c = 0, a = 0;
        f = k;
        k = (k + 32) | 0;
        c = (f + 16) | 0;
        o = (f + 8) | 0;
        a = f;
        Cm(o);
        r = uI(r) | 0;
        e = i[e >> 0] | 0;
        u[a >> 2] = u[t >> 2];
        u[c >> 2] = u[a >> 2];
        mN(n, r, e, c);
        Cp(o);
        k = f;
        return;
    }
    function mN(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0, o = 0, c = 0;
        t = k;
        k = (k + 16) | 0;
        f = (t + 4) | 0;
        c = t;
        o = ux(mL() | 0) | 0;
        e = my(e) | 0;
        u[c >> 2] = u[i >> 2];
        u[f >> 2] = u[c >> 2];
        mO(n, nI(0, o | 0, r | 0, e | 0, $x(f) | 0) | 0);
        k = t;
        return;
    }
    function mL() {
        var n = 0;
        if (!(i[8e3] | 0)) {
            mP(10756);
            n = 8e3;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10756;
    }
    function mO(n, r) {
        n = n | 0;
        r = r | 0;
        c$(n, r);
        return;
    }
    function mP(n) {
        n = n | 0;
        uz(n, mE() | 0, 2);
        return;
    }
    function mE() {
        return 1772;
    }
    function mG(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var f = 0, o = 0, c = 0, a = 0, l = 0;
        f = k;
        k = (k + 32) | 0;
        a = (f + 16) | 0;
        l = (f + 12) | 0;
        o = f;
        c = ux(mB() | 0) | 0;
        e = my(e) | 0;
        u[l >> 2] = u[i >> 2];
        u[a >> 2] = u[l >> 2];
        i = $x(a) | 0;
        u[o >> 2] = u[t >> 2];
        a = (t + 4) | 0;
        u[(o + 4) >> 2] = u[a >> 2];
        l = (t + 8) | 0;
        u[(o + 8) >> 2] = u[l >> 2];
        u[l >> 2] = 0;
        u[a >> 2] = 0;
        u[t >> 2] = 0;
        mO(n, n1(0, c | 0, r | 0, e | 0, i | 0, $O(o) | 0) | 0);
        $M(o);
        k = f;
        return;
    }
    function mB() {
        var n = 0;
        if (!(i[8008] | 0)) {
            mR(10768);
            n = 8008;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10768;
    }
    function mR(n) {
        n = n | 0;
        uz(n, mY() | 0, 3);
        return;
    }
    function mY() {
        return 1784;
    }
    function mU(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var f = 0, o = 0, c = 0, a = 0;
        f = k;
        k = (k + 16) | 0;
        c = (f + 4) | 0;
        a = f;
        o = ux(mj() | 0) | 0;
        e = my(e) | 0;
        u[a >> 2] = u[i >> 2];
        u[c >> 2] = u[a >> 2];
        i = $x(c) | 0;
        mO(n, n1(0, o | 0, r | 0, e | 0, i | 0, $L(t) | 0) | 0);
        k = f;
        return;
    }
    function mj() {
        var n = 0;
        if (!(i[8016] | 0)) {
            mz(10780);
            n = 8016;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10780;
    }
    function mz(n) {
        n = n | 0;
        uz(n, mD() | 0, 3);
        return;
    }
    function mD() {
        return 1800;
    }
    function mF(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        i = ux(mK() | 0) | 0;
        mO(n, n8(0, i | 0, r | 0, my(e) | 0) | 0);
        return;
    }
    function mK() {
        var n = 0;
        if (!(i[8024] | 0)) {
            mq(10792);
            n = 8024;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 10792;
    }
    function mq(n) {
        n = n | 0;
        uz(n, mH() | 0, 1);
        return;
    }
    function mH() {
        return 1816;
    }
    function mX() {
        mZ();
        mJ();
        mQ();
        return;
    }
    function mZ() {
        u[2702] = ME(65536) | 0;
        return;
    }
    function mJ() {
        ya(10856);
        return;
    }
    function mQ() {
        mV(10816);
        return;
    }
    function mV(n) {
        n = n | 0;
        mW(n, 5044);
        m_(n) | 0;
        return;
    }
    function mW(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = $Y() | 0;
        u[n >> 2] = e;
        yi(e, r);
        w1(u[n >> 2] | 0);
        return;
    }
    function m_(n) {
        n = n | 0;
        var r = 0;
        r = u[n >> 2] | 0;
        dt(r, m0() | 0);
        return n | 0;
    }
    function m0() {
        var n = 0;
        if (!(i[8032] | 0)) {
            m2(10820);
            nB(64, 10820, w | 0) | 0;
            n = 8032;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        if (!(fK(10820) | 0)) m2(10820);
        return 10820;
    }
    function m2(n) {
        n = n | 0;
        m8(n);
        dv(n, 25);
        return;
    }
    function m1(n) {
        n = n | 0;
        m4((n + 24) | 0);
        return;
    }
    function m4(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function m8(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 5, 18, r, m5() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function m3(n, r) {
        n = n | 0;
        r = r | 0;
        m6(n, r);
        return;
    }
    function m6(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        t = (e + 4) | 0;
        cY(t, r);
        u[i >> 2] = cU(t, r) | 0;
        m9(n, i);
        k = e;
        return;
    }
    function m9(n, r) {
        n = n | 0;
        r = r | 0;
        m7((n + 4) | 0, u[r >> 2] | 0);
        i[(n + 8) >> 0] = 1;
        return;
    }
    function m7(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = r;
        return;
    }
    function m5() {
        return 1824;
    }
    function yn(n) {
        n = n | 0;
        return yr(n) | 0;
    }
    function yr(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0;
        e = k;
        k = (k + 16) | 0;
        t = (e + 4) | 0;
        o = e;
        i = ye(8) | 0;
        r = i;
        c = MP(4) | 0;
        cY(t, n);
        m7(c, cU(t, n) | 0);
        f = (r + 4) | 0;
        u[f >> 2] = c;
        n = MP(8) | 0;
        f = u[f >> 2] | 0;
        u[o >> 2] = 0;
        u[t >> 2] = u[o >> 2];
        $j(n, f, t);
        u[i >> 2] = n;
        k = e;
        return r | 0;
    }
    function ye(n) {
        n = n | 0;
        var r = 0, e = 0;
        n = (n + 7) & -8;
        if (n >>> 0 <= 32768 ? ((r = u[2701] | 0), n >>> 0 <= ((65536 - r) | 0) >>> 0) : 0) {
            e = ((u[2702] | 0) + r) | 0;
            u[2701] = r + n;
            n = e;
        } else {
            n = ME((n + 8) | 0) | 0;
            u[n >> 2] = u[2703];
            u[2703] = n;
            n = (n + 8) | 0;
        }
        return n | 0;
    }
    function yi(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = yt() | 0;
        u[(n + 4) >> 2] = yu() | 0;
        u[(n + 12) >> 2] = r;
        u[(n + 8) >> 2] = yf() | 0;
        u[(n + 32) >> 2] = 9;
        return;
    }
    function yt() {
        return 11744;
    }
    function yu() {
        return 1832;
    }
    function yf() {
        return dG() | 0;
    }
    function yo(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        if ((ko(i, 896) | 0) == 512) {
            if (e | 0) {
                yc(e);
                MG(e);
            }
        } else if (r | 0) MG(r);
        return;
    }
    function yc(n) {
        n = n | 0;
        n = u[(n + 4) >> 2] | 0;
        if (n | 0) ML(n);
        return;
    }
    function ya(n) {
        n = n | 0;
        yl(n, 5052);
        yv(n) | 0;
        ys(n, 5058, 26) | 0;
        yb(n, 5069, 1) | 0;
        yk(n, 5077, 10) | 0;
        yh(n, 5087, 19) | 0;
        yw(n, 5094, 27) | 0;
        return;
    }
    function yl(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = Cu() | 0;
        u[n >> 2] = e;
        Cf(e, r);
        w1(u[n >> 2] | 0);
        return;
    }
    function yv(n) {
        n = n | 0;
        var r = 0;
        r = u[n >> 2] | 0;
        dt(r, p0() | 0);
        return n | 0;
    }
    function ys(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        pP(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function yb(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        ph(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function yk(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        y0(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function yh(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        yB(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function yd(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        a: while(1){
            e = u[2703] | 0;
            while(1){
                if ((e | 0) == (r | 0)) break a;
                i = u[e >> 2] | 0;
                u[2703] = i;
                if (!e) e = i;
                else break;
            }
            MG(e);
        }
        u[2701] = n;
        return;
    }
    function yw(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        y$(n, fI(r) | 0, e, 0);
        return n | 0;
    }
    function y$(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = ym() | 0;
        n = yy(e) | 0;
        fL(f, r, t, n, yp(e, i) | 0, i);
        return;
    }
    function ym() {
        var n = 0, r = 0;
        if (!(i[8040] | 0)) {
            yT(10860);
            nB(65, 10860, w | 0) | 0;
            r = 8040;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10860) | 0)) {
            n = 10860;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            yT(10860);
        }
        return 10860;
    }
    function yy(n) {
        n = n | 0;
        return n | 0;
    }
    function yp(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = ym() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            yC(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            yM(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function yC(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function yM(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = yg(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            yA(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            yC(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            yI(n, t);
            yS(t);
            k = c;
            return;
        }
    }
    function yg(n) {
        n = n | 0;
        return 536870911;
    }
    function yA(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function yI(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function yS(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function yT(n) {
        n = n | 0;
        yL(n);
        return;
    }
    function yx(n) {
        n = n | 0;
        yN((n + 24) | 0);
        return;
    }
    function yN(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function yL(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 11, r, yO() | 0, 2);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function yO() {
        return 1840;
    }
    function yP(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        yG(u[(yE(n) | 0) >> 2] | 0, r, e);
        return;
    }
    function yE(n) {
        n = n | 0;
        return ((u[((ym() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function yG(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0;
        i = k;
        k = (k + 16) | 0;
        u = (i + 1) | 0;
        t = i;
        cY(u, r);
        r = cU(u, r) | 0;
        cY(t, e);
        e = cU(t, e) | 0;
        gq[n & 31](r, e);
        k = i;
        return;
    }
    function yB(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = yR() | 0;
        n = yY(e) | 0;
        fL(f, r, t, n, yU(e, i) | 0, i);
        return;
    }
    function yR() {
        var n = 0, r = 0;
        if (!(i[8048] | 0)) {
            yH(10896);
            nB(66, 10896, w | 0) | 0;
            r = 8048;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10896) | 0)) {
            n = 10896;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            yH(10896);
        }
        return 10896;
    }
    function yY(n) {
        n = n | 0;
        return n | 0;
    }
    function yU(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = yR() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            yj(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            yz(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function yj(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function yz(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = yD(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            yF(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            yj(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            yK(n, t);
            yq(t);
            k = c;
            return;
        }
    }
    function yD(n) {
        n = n | 0;
        return 536870911;
    }
    function yF(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function yK(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function yq(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function yH(n) {
        n = n | 0;
        yJ(n);
        return;
    }
    function yX(n) {
        n = n | 0;
        yZ((n + 24) | 0);
        return;
    }
    function yZ(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function yJ(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 11, r, yQ() | 0, 1);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function yQ() {
        return 1852;
    }
    function yV(n, r) {
        n = n | 0;
        r = r | 0;
        return y_(u[(yW(n) | 0) >> 2] | 0, r) | 0;
    }
    function yW(n) {
        n = n | 0;
        return ((u[((yR() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function y_(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        cY(i, r);
        r = cU(i, r) | 0;
        r = ad(gH[n & 31](r) | 0) | 0;
        k = e;
        return r | 0;
    }
    function y0(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = y2() | 0;
        n = y1(e) | 0;
        fL(f, r, t, n, y4(e, i) | 0, i);
        return;
    }
    function y2() {
        var n = 0, r = 0;
        if (!(i[8056] | 0)) {
            pn(10932);
            nB(67, 10932, w | 0) | 0;
            r = 8056;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10932) | 0)) {
            n = 10932;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            pn(10932);
        }
        return 10932;
    }
    function y1(n) {
        n = n | 0;
        return n | 0;
    }
    function y4(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = y2() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            y8(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            y3(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function y8(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function y3(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = y6(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            y9(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            y8(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            y7(n, t);
            y5(t);
            k = c;
            return;
        }
    }
    function y6(n) {
        n = n | 0;
        return 536870911;
    }
    function y9(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function y7(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function y5(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function pn(n) {
        n = n | 0;
        pi(n);
        return;
    }
    function pr(n) {
        n = n | 0;
        pe((n + 24) | 0);
        return;
    }
    function pe(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function pi(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 7, r, pt() | 0, 2);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function pt() {
        return 1860;
    }
    function pu(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        return po(u[(pf(n) | 0) >> 2] | 0, r, e) | 0;
    }
    function pf(n) {
        n = n | 0;
        return ((u[((y2() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function po(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        i = k;
        k = (k + 32) | 0;
        o = (i + 12) | 0;
        f = (i + 8) | 0;
        c = i;
        a = (i + 16) | 0;
        t = (i + 4) | 0;
        pc(a, r);
        pa(c, a, r);
        ck(t, e);
        e = ch(t, e) | 0;
        u[o >> 2] = u[c >> 2];
        g9[n & 15](f, o, e);
        e = pl(f) | 0;
        tk(f);
        cd(t);
        k = i;
        return e | 0;
    }
    function pc(n, r) {
        n = n | 0;
        r = r | 0;
        return;
    }
    function pa(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        pv(n, e);
        return;
    }
    function pl(n) {
        n = n | 0;
        return uI(n) | 0;
    }
    function pv(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = k;
        k = (k + 16) | 0;
        e = t;
        i = r;
        if (!(i & 1)) u[n >> 2] = u[r >> 2];
        else {
            ps(e, 0);
            nY(i | 0, e | 0) | 0;
            pb(n, e);
            pk(e);
        }
        k = t;
        return;
    }
    function ps(n, r) {
        n = n | 0;
        r = r | 0;
        uB(n, r);
        u[(n + 4) >> 2] = 0;
        i[(n + 8) >> 0] = 0;
        return;
    }
    function pb(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = u[(r + 4) >> 2];
        return;
    }
    function pk(n) {
        n = n | 0;
        i[(n + 8) >> 0] = 0;
        return;
    }
    function ph(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = pd() | 0;
        n = pw(e) | 0;
        fL(f, r, t, n, p$(e, i) | 0, i);
        return;
    }
    function pd() {
        var n = 0, r = 0;
        if (!(i[8064] | 0)) {
            pA(10968);
            nB(68, 10968, w | 0) | 0;
            r = 8064;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(10968) | 0)) {
            n = 10968;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            pA(10968);
        }
        return 10968;
    }
    function pw(n) {
        n = n | 0;
        return n | 0;
    }
    function p$(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = pd() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            pm(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            py(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function pm(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function py(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = pp(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            pC(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            pm(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            pM(n, t);
            pg(t);
            k = c;
            return;
        }
    }
    function pp(n) {
        n = n | 0;
        return 536870911;
    }
    function pC(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function pM(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function pg(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function pA(n) {
        n = n | 0;
        pT(n);
        return;
    }
    function pI(n) {
        n = n | 0;
        pS((n + 24) | 0);
        return;
    }
    function pS(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function pT(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 1, r, px() | 0, 5);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function px() {
        return 1872;
    }
    function pN(n, r, e, i, t, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        f = f | 0;
        pO(u[(pL(n) | 0) >> 2] | 0, r, e, i, t, f);
        return;
    }
    function pL(n) {
        n = n | 0;
        return ((u[((pd() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function pO(n, r, e, i, t, u) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        u = u | 0;
        var f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        f = k;
        k = (k + 32) | 0;
        o = (f + 16) | 0;
        c = (f + 12) | 0;
        a = (f + 8) | 0;
        l = (f + 4) | 0;
        v = f;
        ck(o, r);
        r = ch(o, r) | 0;
        ck(c, e);
        e = ch(c, e) | 0;
        ck(a, i);
        i = ch(a, i) | 0;
        ck(l, t);
        t = ch(l, t) | 0;
        ck(v, u);
        u = ch(v, u) | 0;
        gj[n & 1](r, e, i, t, u);
        cd(v);
        cd(l);
        cd(a);
        cd(c);
        cd(o);
        k = f;
        return;
    }
    function pP(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = u[n >> 2] | 0;
        t = pE() | 0;
        n = pG(e) | 0;
        fL(f, r, t, n, pB(e, i) | 0, i);
        return;
    }
    function pE() {
        var n = 0, r = 0;
        if (!(i[8072] | 0)) {
            pF(11004);
            nB(69, 11004, w | 0) | 0;
            r = 8072;
            u[r >> 2] = 1;
            u[(r + 4) >> 2] = 0;
        }
        if (!(fK(11004) | 0)) {
            n = 11004;
            r = (n + 36) | 0;
            do {
                u[n >> 2] = 0;
                n = (n + 4) | 0;
            }while ((n | 0) < (r | 0))
            pF(11004);
        }
        return 11004;
    }
    function pG(n) {
        n = n | 0;
        return n | 0;
    }
    function pB(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        c = k;
        k = (k + 16) | 0;
        t = c;
        f = (c + 4) | 0;
        u[t >> 2] = n;
        a = pE() | 0;
        o = (a + 24) | 0;
        r = fG(r, 4) | 0;
        u[f >> 2] = r;
        e = (a + 28) | 0;
        i = u[e >> 2] | 0;
        if (i >>> 0 < (u[(a + 32) >> 2] | 0) >>> 0) {
            pR(i, n, r);
            r = ((u[e >> 2] | 0) + 8) | 0;
            u[e >> 2] = r;
        } else {
            pY(o, t, f);
            r = u[e >> 2] | 0;
        }
        k = c;
        return (((r - (u[o >> 2] | 0)) >> 3) + -1) | 0;
    }
    function pR(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function pY(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = k;
        k = (k + 32) | 0;
        t = c;
        f = (n + 4) | 0;
        o = ((((u[f >> 2] | 0) - (u[n >> 2] | 0)) >> 3) + 1) | 0;
        i = pU(n) | 0;
        if (i >>> 0 < o >>> 0) MI(n);
        else {
            a = u[n >> 2] | 0;
            v = ((u[(n + 8) >> 2] | 0) - a) | 0;
            l = v >> 2;
            pj(t, (v >> 3) >>> 0 < (i >>> 1) >>> 0 ? l >>> 0 < o >>> 0 ? o : l : i, ((u[f >> 2] | 0) - a) >> 3, (n + 8) | 0);
            o = (t + 8) | 0;
            pR(u[o >> 2] | 0, u[r >> 2] | 0, u[e >> 2] | 0);
            u[o >> 2] = (u[o >> 2] | 0) + 8;
            pz(n, t);
            pD(t);
            k = c;
            return;
        }
    }
    function pU(n) {
        n = n | 0;
        return 536870911;
    }
    function pj(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0;
        u[(n + 12) >> 2] = 0;
        u[(n + 16) >> 2] = i;
        do if (r) {
            if (r >>> 0 > 536870911) nZ();
            else {
                t = MP(r << 3) | 0;
                break;
            }
        } else t = 0;
        while (0)
        u[n >> 2] = t;
        i = (t + (e << 3)) | 0;
        u[(n + 8) >> 2] = i;
        u[(n + 4) >> 2] = i;
        u[(n + 12) >> 2] = t + (r << 3);
        return;
    }
    function pz(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, f = 0, o = 0;
        i = u[n >> 2] | 0;
        o = (n + 4) | 0;
        f = (r + 4) | 0;
        t = ((u[o >> 2] | 0) - i) | 0;
        e = ((u[f >> 2] | 0) + ((0 - (t >> 3)) << 3)) | 0;
        u[f >> 2] = e;
        if ((t | 0) > 0) {
            MK(e | 0, i | 0, t | 0) | 0;
            i = f;
            e = u[f >> 2] | 0;
        } else i = f;
        f = u[n >> 2] | 0;
        u[n >> 2] = e;
        u[i >> 2] = f;
        f = (r + 8) | 0;
        t = u[o >> 2] | 0;
        u[o >> 2] = u[f >> 2];
        u[f >> 2] = t;
        f = (n + 8) | 0;
        o = (r + 12) | 0;
        n = u[f >> 2] | 0;
        u[f >> 2] = u[o >> 2];
        u[o >> 2] = n;
        u[r >> 2] = u[i >> 2];
        return;
    }
    function pD(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = u[(n + 4) >> 2] | 0;
        e = (n + 8) | 0;
        i = u[e >> 2] | 0;
        if ((i | 0) != (r | 0)) u[e >> 2] = i + (~(((i + -8 - r) | 0) >>> 3) << 3);
        n = u[n >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function pF(n) {
        n = n | 0;
        pH(n);
        return;
    }
    function pK(n) {
        n = n | 0;
        pq((n + 24) | 0);
        return;
    }
    function pq(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function pH(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 1, 12, r, pX() | 0, 2);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function pX() {
        return 1896;
    }
    function pZ(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        pQ(u[(pJ(n) | 0) >> 2] | 0, r, e);
        return;
    }
    function pJ(n) {
        n = n | 0;
        return ((u[((pE() | 0) + 24) >> 2] | 0) + (n << 3)) | 0;
    }
    function pQ(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0;
        i = k;
        k = (k + 16) | 0;
        u = (i + 4) | 0;
        t = i;
        pV(u, r);
        r = pW(u, r) | 0;
        ck(t, e);
        e = ch(t, e) | 0;
        gq[n & 31](r, e);
        cd(t);
        k = i;
        return;
    }
    function pV(n, r) {
        n = n | 0;
        r = r | 0;
        return;
    }
    function pW(n, r) {
        n = n | 0;
        r = r | 0;
        return p_(r) | 0;
    }
    function p_(n) {
        n = n | 0;
        return n | 0;
    }
    function p0() {
        var n = 0;
        if (!(i[8080] | 0)) {
            p2(11040);
            nB(70, 11040, w | 0) | 0;
            n = 8080;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        if (!(fK(11040) | 0)) p2(11040);
        return 11040;
    }
    function p2(n) {
        n = n | 0;
        p8(n);
        dv(n, 71);
        return;
    }
    function p1(n) {
        n = n | 0;
        p4((n + 24) | 0);
        return;
    }
    function p4(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0;
        e = u[n >> 2] | 0;
        i = e;
        if (e | 0) {
            n = (n + 4) | 0;
            r = u[n >> 2] | 0;
            if ((r | 0) != (e | 0)) u[n >> 2] = r + (~(((r + -8 - i) | 0) >>> 3) << 3);
            MG(e);
        }
        return;
    }
    function p8(n) {
        n = n | 0;
        var r = 0;
        r = fX() | 0;
        fQ(n, 5, 7, r, p7() | 0, 0);
        u[(n + 24) >> 2] = 0;
        u[(n + 28) >> 2] = 0;
        u[(n + 32) >> 2] = 0;
        return;
    }
    function p3(n) {
        n = n | 0;
        p6(n);
        return;
    }
    function p6(n) {
        n = n | 0;
        p9(n);
        return;
    }
    function p9(n) {
        n = n | 0;
        i[(n + 8) >> 0] = 1;
        return;
    }
    function p7() {
        return 1936;
    }
    function p5() {
        return Cn() | 0;
    }
    function Cn() {
        var n = 0, r = 0, e = 0, i = 0, t = 0, f = 0, o = 0;
        r = k;
        k = (k + 16) | 0;
        t = (r + 4) | 0;
        o = r;
        e = ye(8) | 0;
        n = e;
        f = (n + 4) | 0;
        u[f >> 2] = MP(1) | 0;
        i = MP(8) | 0;
        f = u[f >> 2] | 0;
        u[o >> 2] = 0;
        u[t >> 2] = u[o >> 2];
        Cr(i, f, t);
        u[e >> 2] = i;
        k = r;
        return n | 0;
    }
    function Cr(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        u[n >> 2] = r;
        e = MP(16) | 0;
        u[(e + 4) >> 2] = 0;
        u[(e + 8) >> 2] = 0;
        u[e >> 2] = 1916;
        u[(e + 12) >> 2] = r;
        u[(n + 4) >> 2] = e;
        return;
    }
    function Ce(n) {
        n = n | 0;
        MS(n);
        MG(n);
        return;
    }
    function Ci(n) {
        n = n | 0;
        n = u[(n + 12) >> 2] | 0;
        if (n | 0) MG(n);
        return;
    }
    function Ct(n) {
        n = n | 0;
        MG(n);
        return;
    }
    function Cu() {
        var n = 0;
        if (!(i[8088] | 0)) {
            Cs(11076);
            nB(25, 11076, w | 0) | 0;
            n = 8088;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 11076;
    }
    function Cf(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = Co() | 0;
        u[(n + 4) >> 2] = Cc() | 0;
        u[(n + 12) >> 2] = r;
        u[(n + 8) >> 2] = Ca() | 0;
        u[(n + 32) >> 2] = 10;
        return;
    }
    function Co() {
        return 11745;
    }
    function Cc() {
        return 1940;
    }
    function Ca() {
        return ka() | 0;
    }
    function Cl(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        if ((ko(i, 896) | 0) == 512) {
            if (e | 0) {
                Cv(e);
                MG(e);
            }
        } else if (r | 0) MG(r);
        return;
    }
    function Cv(n) {
        n = n | 0;
        n = u[(n + 4) >> 2] | 0;
        if (n | 0) ML(n);
        return;
    }
    function Cs(n) {
        n = n | 0;
        ob(n);
        return;
    }
    function Cb(n, r) {
        n = n | 0;
        r = r | 0;
        u[n >> 2] = r;
        return;
    }
    function Ck(n) {
        n = n | 0;
        return u[n >> 2] | 0;
    }
    function Ch(n) {
        n = n | 0;
        return i[u[n >> 2] >> 0] | 0;
    }
    function Cd(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        u[i >> 2] = u[n >> 2];
        Cw(r, i) | 0;
        k = e;
        return;
    }
    function Cw(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = C$(u[n >> 2] | 0, r) | 0;
        r = (n + 4) | 0;
        u[((u[r >> 2] | 0) + 8) >> 2] = e;
        return u[((u[r >> 2] | 0) + 8) >> 2] | 0;
    }
    function C$(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = k;
        k = (k + 16) | 0;
        i = e;
        Cm(i);
        n = uI(n) | 0;
        r = Cy(n, u[r >> 2] | 0) | 0;
        Cp(i);
        k = e;
        return r | 0;
    }
    function Cm(n) {
        n = n | 0;
        u[n >> 2] = u[2701];
        u[(n + 4) >> 2] = u[2703];
        return;
    }
    function Cy(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = ux(CC() | 0) | 0;
        return n8(0, e | 0, n | 0, $L(r) | 0) | 0;
    }
    function Cp(n) {
        n = n | 0;
        yd(u[n >> 2] | 0, u[(n + 4) >> 2] | 0);
        return;
    }
    function CC() {
        var n = 0;
        if (!(i[8096] | 0)) {
            CM(11120);
            n = 8096;
            u[n >> 2] = 1;
            u[(n + 4) >> 2] = 0;
        }
        return 11120;
    }
    function CM(n) {
        n = n | 0;
        uz(n, Cg() | 0, 1);
        return;
    }
    function Cg() {
        return 1948;
    }
    function CA() {
        CI();
        return;
    }
    function CI() {
        var n = 0, r = 0, e = 0, t = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0, d = 0, w = 0, $ = 0, m = 0;
        $ = k;
        k = (k + 16) | 0;
        b = ($ + 4) | 0;
        h = $;
        nP(65536, 10804, u[2702] | 0, 10812);
        e = $o() | 0;
        r = u[e >> 2] | 0;
        n = u[r >> 2] | 0;
        if (n | 0) {
            t = u[(e + 8) >> 2] | 0;
            e = u[(e + 4) >> 2] | 0;
            while(1){
                nz(n | 0, f[e >> 0] | 0 | 0, i[t >> 0] | 0);
                r = (r + 4) | 0;
                n = u[r >> 2] | 0;
                if (!n) break;
                else {
                    t = (t + 1) | 0;
                    e = (e + 1) | 0;
                }
            }
        }
        n = $a() | 0;
        r = u[n >> 2] | 0;
        if (r | 0) do {
            nD(r | 0, u[(n + 4) >> 2] | 0);
            n = (n + 8) | 0;
            r = u[n >> 2] | 0;
        }while ((r | 0) != 0)
        nD(CS() | 0, 5167);
        s = w4() | 0;
        n = u[s >> 2] | 0;
        a: do if (n | 0) {
            do {
                CT(u[(n + 4) >> 2] | 0);
                n = u[n >> 2] | 0;
            }while ((n | 0) != 0)
            n = u[s >> 2] | 0;
            if (n | 0) {
                v = s;
                do {
                    while(1){
                        o = n;
                        n = u[n >> 2] | 0;
                        o = u[(o + 4) >> 2] | 0;
                        if (!(Cx(o) | 0)) break;
                        u[h >> 2] = v;
                        u[b >> 2] = u[h >> 2];
                        CN(s, b) | 0;
                        if (!n) break a;
                    }
                    CL(o);
                    v = u[v >> 2] | 0;
                    r = CO(o) | 0;
                    c = nQ() | 0;
                    a = k;
                    k = (k + ((((1 * (r << 2)) | 0) + 15) & -16)) | 0;
                    l = k;
                    k = (k + ((((1 * (r << 2)) | 0) + 15) & -16)) | 0;
                    r = u[(mn(o) | 0) >> 2] | 0;
                    if (r | 0) {
                        e = a;
                        t = l;
                        while(1){
                            u[e >> 2] = u[($7(u[(r + 4) >> 2] | 0) | 0) >> 2];
                            u[t >> 2] = u[(r + 8) >> 2];
                            r = u[r >> 2] | 0;
                            if (!r) break;
                            else {
                                e = (e + 4) | 0;
                                t = (t + 4) | 0;
                            }
                        }
                    }
                    m = $7(o) | 0;
                    r = CP(o) | 0;
                    e = CO(o) | 0;
                    t = CE(o) | 0;
                    nH(m | 0, r | 0, a | 0, l | 0, e | 0, t | 0, $t(o) | 0);
                    nG(c | 0);
                }while ((n | 0) != 0)
            }
        }
        while (0)
        n = u[($f() | 0) >> 2] | 0;
        if (n | 0) do {
            m = (n + 4) | 0;
            s = $b(m) | 0;
            o = $$(s) | 0;
            c = $k(s) | 0;
            a = (($h(s) | 0) + 1) | 0;
            l = CG(s) | 0;
            v = CB(m) | 0;
            s = fK(s) | 0;
            b = $y(m) | 0;
            h = CR(m) | 0;
            nK(0, o | 0, c | 0, a | 0, l | 0, v | 0, s | 0, b | 0, h | 0, CY(m) | 0);
            n = u[n >> 2] | 0;
        }while ((n | 0) != 0)
        n = u[(w4() | 0) >> 2] | 0;
        b: do if (n | 0) {
            c: while(1){
                r = u[(n + 4) >> 2] | 0;
                if (r | 0 ? ((d = u[($7(r) | 0) >> 2] | 0), (w = u[(mi(r) | 0) >> 2] | 0), w | 0) : 0) {
                    e = w;
                    do {
                        r = (e + 4) | 0;
                        t = $b(r) | 0;
                        d: do if (t | 0) switch(fK(t) | 0){
                            case 0:
                                break c;
                            case 4:
                            case 3:
                            case 2:
                                {
                                    l = $$(t) | 0;
                                    v = $k(t) | 0;
                                    s = (($h(t) | 0) + 1) | 0;
                                    b = CG(t) | 0;
                                    h = fK(t) | 0;
                                    m = $y(r) | 0;
                                    nK(d | 0, l | 0, v | 0, s | 0, b | 0, 0, h | 0, m | 0, CR(r) | 0, CY(r) | 0);
                                    break d;
                                }
                            case 1:
                                {
                                    a = $$(t) | 0;
                                    l = $k(t) | 0;
                                    v = (($h(t) | 0) + 1) | 0;
                                    s = CG(t) | 0;
                                    b = CB(r) | 0;
                                    h = fK(t) | 0;
                                    m = $y(r) | 0;
                                    nK(d | 0, a | 0, l | 0, v | 0, s | 0, b | 0, h | 0, m | 0, CR(r) | 0, CY(r) | 0);
                                    break d;
                                }
                            case 5:
                                {
                                    s = $$(t) | 0;
                                    b = $k(t) | 0;
                                    h = (($h(t) | 0) + 1) | 0;
                                    m = CG(t) | 0;
                                    nK(d | 0, s | 0, b | 0, h | 0, m | 0, CU(t) | 0, fK(t) | 0, 0, 0, 0);
                                    break d;
                                }
                            default:
                                break d;
                        }
                        while (0)
                        e = u[e >> 2] | 0;
                    }while ((e | 0) != 0)
                }
                n = u[n >> 2] | 0;
                if (!n) break b;
            }
            nZ();
        }
        while (0)
        nX();
        k = $;
        return;
    }
    function CS() {
        return 11703;
    }
    function CT(n) {
        n = n | 0;
        i[(n + 40) >> 0] = 0;
        return;
    }
    function Cx(n) {
        n = n | 0;
        return ((i[(n + 40) >> 0] | 0) != 0) | 0;
    }
    function CN(n, r) {
        n = n | 0;
        r = r | 0;
        r = Cj(r) | 0;
        n = u[r >> 2] | 0;
        u[r >> 2] = u[n >> 2];
        MG(n);
        return u[r >> 2] | 0;
    }
    function CL(n) {
        n = n | 0;
        i[(n + 40) >> 0] = 1;
        return;
    }
    function CO(n) {
        n = n | 0;
        return u[(n + 20) >> 2] | 0;
    }
    function CP(n) {
        n = n | 0;
        return u[(n + 8) >> 2] | 0;
    }
    function CE(n) {
        n = n | 0;
        return u[(n + 32) >> 2] | 0;
    }
    function CG(n) {
        n = n | 0;
        return u[(n + 4) >> 2] | 0;
    }
    function CB(n) {
        n = n | 0;
        return u[(n + 4) >> 2] | 0;
    }
    function CR(n) {
        n = n | 0;
        return u[(n + 8) >> 2] | 0;
    }
    function CY(n) {
        n = n | 0;
        return u[(n + 16) >> 2] | 0;
    }
    function CU(n) {
        n = n | 0;
        return u[(n + 20) >> 2] | 0;
    }
    function Cj(n) {
        n = n | 0;
        return u[n >> 2] | 0;
    }
    function Cz(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0, d = 0, w = 0, $ = 0, m = 0, y = 0, p = 0, C = 0, M = 0;
        M = k;
        k = (k + 16) | 0;
        b = M;
        do if (n >>> 0 < 245) {
            l = n >>> 0 < 11 ? 16 : (n + 11) & -8;
            n = l >>> 3;
            s = u[2783] | 0;
            e = s >>> n;
            if ((e & 3) | 0) {
                r = (((e & 1) ^ 1) + n) | 0;
                n = (11172 + ((r << 1) << 2)) | 0;
                e = (n + 8) | 0;
                i = u[e >> 2] | 0;
                t = (i + 8) | 0;
                f = u[t >> 2] | 0;
                if ((n | 0) == (f | 0)) u[2783] = s & ~(1 << r);
                else {
                    u[(f + 12) >> 2] = n;
                    u[e >> 2] = f;
                }
                C = r << 3;
                u[(i + 4) >> 2] = C | 3;
                C = (i + C + 4) | 0;
                u[C >> 2] = u[C >> 2] | 1;
                C = t;
                k = M;
                return C | 0;
            }
            v = u[2785] | 0;
            if (l >>> 0 > v >>> 0) {
                if (e | 0) {
                    r = 2 << n;
                    r = (e << n) & (r | (0 - r));
                    r = ((r & (0 - r)) + -1) | 0;
                    o = (r >>> 12) & 16;
                    r = r >>> o;
                    e = (r >>> 5) & 8;
                    r = r >>> e;
                    t = (r >>> 2) & 4;
                    r = r >>> t;
                    n = (r >>> 1) & 2;
                    r = r >>> n;
                    i = (r >>> 1) & 1;
                    i = ((e | o | t | n | i) + (r >>> i)) | 0;
                    r = (11172 + ((i << 1) << 2)) | 0;
                    n = (r + 8) | 0;
                    t = u[n >> 2] | 0;
                    o = (t + 8) | 0;
                    e = u[o >> 2] | 0;
                    if ((r | 0) == (e | 0)) {
                        n = s & ~(1 << i);
                        u[2783] = n;
                    } else {
                        u[(e + 12) >> 2] = r;
                        u[n >> 2] = e;
                        n = s;
                    }
                    f = ((i << 3) - l) | 0;
                    u[(t + 4) >> 2] = l | 3;
                    i = (t + l) | 0;
                    u[(i + 4) >> 2] = f | 1;
                    u[(i + f) >> 2] = f;
                    if (v | 0) {
                        t = u[2788] | 0;
                        r = v >>> 3;
                        e = (11172 + ((r << 1) << 2)) | 0;
                        r = 1 << r;
                        if (!(n & r)) {
                            u[2783] = n | r;
                            r = e;
                            n = (e + 8) | 0;
                        } else {
                            n = (e + 8) | 0;
                            r = u[n >> 2] | 0;
                        }
                        u[n >> 2] = t;
                        u[(r + 12) >> 2] = t;
                        u[(t + 8) >> 2] = r;
                        u[(t + 12) >> 2] = e;
                    }
                    u[2785] = f;
                    u[2788] = i;
                    C = o;
                    k = M;
                    return C | 0;
                }
                c = u[2784] | 0;
                if (c) {
                    e = ((c & (0 - c)) + -1) | 0;
                    o = (e >>> 12) & 16;
                    e = e >>> o;
                    f = (e >>> 5) & 8;
                    e = e >>> f;
                    a = (e >>> 2) & 4;
                    e = e >>> a;
                    i = (e >>> 1) & 2;
                    e = e >>> i;
                    n = (e >>> 1) & 1;
                    n = u[(11436 + (((f | o | a | i | n) + (e >>> n)) << 2)) >> 2] | 0;
                    e = ((u[(n + 4) >> 2] & -8) - l) | 0;
                    i = u[(n + 16 + ((((u[(n + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                    if (!i) {
                        a = n;
                        f = e;
                    } else {
                        do {
                            o = ((u[(i + 4) >> 2] & -8) - l) | 0;
                            a = o >>> 0 < e >>> 0;
                            e = a ? o : e;
                            n = a ? i : n;
                            i = u[(i + 16 + ((((u[(i + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                        }while ((i | 0) != 0)
                        a = n;
                        f = e;
                    }
                    o = (a + l) | 0;
                    if (a >>> 0 < o >>> 0) {
                        t = u[(a + 24) >> 2] | 0;
                        r = u[(a + 12) >> 2] | 0;
                        do if ((r | 0) == (a | 0)) {
                            n = (a + 20) | 0;
                            r = u[n >> 2] | 0;
                            if (!r) {
                                n = (a + 16) | 0;
                                r = u[n >> 2] | 0;
                                if (!r) {
                                    e = 0;
                                    break;
                                }
                            }
                            while(1){
                                e = (r + 20) | 0;
                                i = u[e >> 2] | 0;
                                if (i | 0) {
                                    r = i;
                                    n = e;
                                    continue;
                                }
                                e = (r + 16) | 0;
                                i = u[e >> 2] | 0;
                                if (!i) break;
                                else {
                                    r = i;
                                    n = e;
                                }
                            }
                            u[n >> 2] = 0;
                            e = r;
                        } else {
                            e = u[(a + 8) >> 2] | 0;
                            u[(e + 12) >> 2] = r;
                            u[(r + 8) >> 2] = e;
                            e = r;
                        }
                        while (0)
                        do if (t | 0) {
                            r = u[(a + 28) >> 2] | 0;
                            n = (11436 + (r << 2)) | 0;
                            if ((a | 0) == (u[n >> 2] | 0)) {
                                u[n >> 2] = e;
                                if (!e) {
                                    u[2784] = c & ~(1 << r);
                                    break;
                                }
                            } else {
                                u[(t + 16 + ((((u[(t + 16) >> 2] | 0) != (a | 0)) & 1) << 2)) >> 2] = e;
                                if (!e) break;
                            }
                            u[(e + 24) >> 2] = t;
                            r = u[(a + 16) >> 2] | 0;
                            if (r | 0) {
                                u[(e + 16) >> 2] = r;
                                u[(r + 24) >> 2] = e;
                            }
                            r = u[(a + 20) >> 2] | 0;
                            if (r | 0) {
                                u[(e + 20) >> 2] = r;
                                u[(r + 24) >> 2] = e;
                            }
                        }
                        while (0)
                        if (f >>> 0 < 16) {
                            C = (f + l) | 0;
                            u[(a + 4) >> 2] = C | 3;
                            C = (a + C + 4) | 0;
                            u[C >> 2] = u[C >> 2] | 1;
                        } else {
                            u[(a + 4) >> 2] = l | 3;
                            u[(o + 4) >> 2] = f | 1;
                            u[(o + f) >> 2] = f;
                            if (v | 0) {
                                i = u[2788] | 0;
                                r = v >>> 3;
                                e = (11172 + ((r << 1) << 2)) | 0;
                                r = 1 << r;
                                if (!(s & r)) {
                                    u[2783] = s | r;
                                    r = e;
                                    n = (e + 8) | 0;
                                } else {
                                    n = (e + 8) | 0;
                                    r = u[n >> 2] | 0;
                                }
                                u[n >> 2] = i;
                                u[(r + 12) >> 2] = i;
                                u[(i + 8) >> 2] = r;
                                u[(i + 12) >> 2] = e;
                            }
                            u[2785] = f;
                            u[2788] = o;
                        }
                        C = (a + 8) | 0;
                        k = M;
                        return C | 0;
                    } else s = l;
                } else s = l;
            } else s = l;
        } else if (n >>> 0 <= 4294967231) {
            n = (n + 11) | 0;
            l = n & -8;
            a = u[2784] | 0;
            if (a) {
                i = (0 - l) | 0;
                n = n >>> 8;
                if (n) {
                    if (l >>> 0 > 16777215) c = 31;
                    else {
                        s = (((n + 1048320) | 0) >>> 16) & 8;
                        p = n << s;
                        v = (((p + 520192) | 0) >>> 16) & 4;
                        p = p << v;
                        c = (((p + 245760) | 0) >>> 16) & 2;
                        c = (14 - (v | s | c) + ((p << c) >>> 15)) | 0;
                        c = ((l >>> ((c + 7) | 0)) & 1) | (c << 1);
                    }
                } else c = 0;
                e = u[(11436 + (c << 2)) >> 2] | 0;
                a: do if (!e) {
                    e = 0;
                    n = 0;
                    p = 57;
                } else {
                    n = 0;
                    o = l << ((c | 0) == 31 ? 0 : (25 - (c >>> 1)) | 0);
                    f = 0;
                    while(1){
                        t = ((u[(e + 4) >> 2] & -8) - l) | 0;
                        if (t >>> 0 < i >>> 0) if (!t) {
                            n = e;
                            i = 0;
                            t = e;
                            p = 61;
                            break a;
                        } else {
                            n = e;
                            i = t;
                        }
                        t = u[(e + 20) >> 2] | 0;
                        e = u[(e + 16 + ((o >>> 31) << 2)) >> 2] | 0;
                        f = ((t | 0) == 0) | ((t | 0) == (e | 0)) ? f : t;
                        t = (e | 0) == 0;
                        if (t) {
                            e = f;
                            p = 57;
                            break;
                        } else o = o << ((t ^ 1) & 1);
                    }
                }
                while (0)
                if ((p | 0) == 57) {
                    if (((e | 0) == 0) & ((n | 0) == 0)) {
                        n = 2 << c;
                        n = a & (n | (0 - n));
                        if (!n) {
                            s = l;
                            break;
                        }
                        s = ((n & (0 - n)) + -1) | 0;
                        o = (s >>> 12) & 16;
                        s = s >>> o;
                        f = (s >>> 5) & 8;
                        s = s >>> f;
                        c = (s >>> 2) & 4;
                        s = s >>> c;
                        v = (s >>> 1) & 2;
                        s = s >>> v;
                        e = (s >>> 1) & 1;
                        n = 0;
                        e = u[(11436 + (((f | o | c | v | e) + (s >>> e)) << 2)) >> 2] | 0;
                    }
                    if (!e) {
                        c = n;
                        o = i;
                    } else {
                        t = e;
                        p = 61;
                    }
                }
                if ((p | 0) == 61) while(1){
                    p = 0;
                    e = ((u[(t + 4) >> 2] & -8) - l) | 0;
                    s = e >>> 0 < i >>> 0;
                    e = s ? e : i;
                    n = s ? t : n;
                    t = u[(t + 16 + ((((u[(t + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                    if (!t) {
                        c = n;
                        o = e;
                        break;
                    } else {
                        i = e;
                        p = 61;
                    }
                }
                if ((c | 0) != 0 ? o >>> 0 < (((u[2785] | 0) - l) | 0) >>> 0 : 0) {
                    f = (c + l) | 0;
                    if (c >>> 0 >= f >>> 0) {
                        C = 0;
                        k = M;
                        return C | 0;
                    }
                    t = u[(c + 24) >> 2] | 0;
                    r = u[(c + 12) >> 2] | 0;
                    do if ((r | 0) == (c | 0)) {
                        n = (c + 20) | 0;
                        r = u[n >> 2] | 0;
                        if (!r) {
                            n = (c + 16) | 0;
                            r = u[n >> 2] | 0;
                            if (!r) {
                                r = 0;
                                break;
                            }
                        }
                        while(1){
                            e = (r + 20) | 0;
                            i = u[e >> 2] | 0;
                            if (i | 0) {
                                r = i;
                                n = e;
                                continue;
                            }
                            e = (r + 16) | 0;
                            i = u[e >> 2] | 0;
                            if (!i) break;
                            else {
                                r = i;
                                n = e;
                            }
                        }
                        u[n >> 2] = 0;
                    } else {
                        C = u[(c + 8) >> 2] | 0;
                        u[(C + 12) >> 2] = r;
                        u[(r + 8) >> 2] = C;
                    }
                    while (0)
                    do if (t) {
                        n = u[(c + 28) >> 2] | 0;
                        e = (11436 + (n << 2)) | 0;
                        if ((c | 0) == (u[e >> 2] | 0)) {
                            u[e >> 2] = r;
                            if (!r) {
                                i = a & ~(1 << n);
                                u[2784] = i;
                                break;
                            }
                        } else {
                            u[(t + 16 + ((((u[(t + 16) >> 2] | 0) != (c | 0)) & 1) << 2)) >> 2] = r;
                            if (!r) {
                                i = a;
                                break;
                            }
                        }
                        u[(r + 24) >> 2] = t;
                        n = u[(c + 16) >> 2] | 0;
                        if (n | 0) {
                            u[(r + 16) >> 2] = n;
                            u[(n + 24) >> 2] = r;
                        }
                        n = u[(c + 20) >> 2] | 0;
                        if (n) {
                            u[(r + 20) >> 2] = n;
                            u[(n + 24) >> 2] = r;
                            i = a;
                        } else i = a;
                    } else i = a;
                    while (0)
                    do if (o >>> 0 >= 16) {
                        u[(c + 4) >> 2] = l | 3;
                        u[(f + 4) >> 2] = o | 1;
                        u[(f + o) >> 2] = o;
                        r = o >>> 3;
                        if (o >>> 0 < 256) {
                            e = (11172 + ((r << 1) << 2)) | 0;
                            n = u[2783] | 0;
                            r = 1 << r;
                            if (!(n & r)) {
                                u[2783] = n | r;
                                r = e;
                                n = (e + 8) | 0;
                            } else {
                                n = (e + 8) | 0;
                                r = u[n >> 2] | 0;
                            }
                            u[n >> 2] = f;
                            u[(r + 12) >> 2] = f;
                            u[(f + 8) >> 2] = r;
                            u[(f + 12) >> 2] = e;
                            break;
                        }
                        r = o >>> 8;
                        if (r) {
                            if (o >>> 0 > 16777215) r = 31;
                            else {
                                p = (((r + 1048320) | 0) >>> 16) & 8;
                                C = r << p;
                                y = (((C + 520192) | 0) >>> 16) & 4;
                                C = C << y;
                                r = (((C + 245760) | 0) >>> 16) & 2;
                                r = (14 - (y | p | r) + ((C << r) >>> 15)) | 0;
                                r = ((o >>> ((r + 7) | 0)) & 1) | (r << 1);
                            }
                        } else r = 0;
                        e = (11436 + (r << 2)) | 0;
                        u[(f + 28) >> 2] = r;
                        n = (f + 16) | 0;
                        u[(n + 4) >> 2] = 0;
                        u[n >> 2] = 0;
                        n = 1 << r;
                        if (!(i & n)) {
                            u[2784] = i | n;
                            u[e >> 2] = f;
                            u[(f + 24) >> 2] = e;
                            u[(f + 12) >> 2] = f;
                            u[(f + 8) >> 2] = f;
                            break;
                        }
                        n = o << ((r | 0) == 31 ? 0 : (25 - (r >>> 1)) | 0);
                        e = u[e >> 2] | 0;
                        while(1){
                            if (((u[(e + 4) >> 2] & -8) | 0) == (o | 0)) {
                                p = 97;
                                break;
                            }
                            i = (e + 16 + ((n >>> 31) << 2)) | 0;
                            r = u[i >> 2] | 0;
                            if (!r) {
                                p = 96;
                                break;
                            } else {
                                n = n << 1;
                                e = r;
                            }
                        }
                        if ((p | 0) == 96) {
                            u[i >> 2] = f;
                            u[(f + 24) >> 2] = e;
                            u[(f + 12) >> 2] = f;
                            u[(f + 8) >> 2] = f;
                            break;
                        } else if ((p | 0) == 97) {
                            p = (e + 8) | 0;
                            C = u[p >> 2] | 0;
                            u[(C + 12) >> 2] = f;
                            u[p >> 2] = f;
                            u[(f + 8) >> 2] = C;
                            u[(f + 12) >> 2] = e;
                            u[(f + 24) >> 2] = 0;
                            break;
                        }
                    } else {
                        C = (o + l) | 0;
                        u[(c + 4) >> 2] = C | 3;
                        C = (c + C + 4) | 0;
                        u[C >> 2] = u[C >> 2] | 1;
                    }
                    while (0)
                    C = (c + 8) | 0;
                    k = M;
                    return C | 0;
                } else s = l;
            } else s = l;
        } else s = -1;
        while (0)
        e = u[2785] | 0;
        if (e >>> 0 >= s >>> 0) {
            r = (e - s) | 0;
            n = u[2788] | 0;
            if (r >>> 0 > 15) {
                C = (n + s) | 0;
                u[2788] = C;
                u[2785] = r;
                u[(C + 4) >> 2] = r | 1;
                u[(C + r) >> 2] = r;
                u[(n + 4) >> 2] = s | 3;
            } else {
                u[2785] = 0;
                u[2788] = 0;
                u[(n + 4) >> 2] = e | 3;
                C = (n + e + 4) | 0;
                u[C >> 2] = u[C >> 2] | 1;
            }
            C = (n + 8) | 0;
            k = M;
            return C | 0;
        }
        o = u[2786] | 0;
        if (o >>> 0 > s >>> 0) {
            y = (o - s) | 0;
            u[2786] = y;
            C = u[2789] | 0;
            p = (C + s) | 0;
            u[2789] = p;
            u[(p + 4) >> 2] = y | 1;
            u[(C + 4) >> 2] = s | 3;
            C = (C + 8) | 0;
            k = M;
            return C | 0;
        }
        if (!(u[2901] | 0)) {
            u[2903] = 4096;
            u[2902] = 4096;
            u[2904] = -1;
            u[2905] = -1;
            u[2906] = 0;
            u[2894] = 0;
            n = (b & -16) ^ 1431655768;
            u[b >> 2] = n;
            u[2901] = n;
            n = 4096;
        } else n = u[2903] | 0;
        c = (s + 48) | 0;
        a = (s + 47) | 0;
        f = (n + a) | 0;
        t = (0 - n) | 0;
        l = f & t;
        if (l >>> 0 <= s >>> 0) {
            C = 0;
            k = M;
            return C | 0;
        }
        n = u[2893] | 0;
        if (n | 0 ? ((v = u[2891] | 0), (b = (v + l) | 0), (b >>> 0 <= v >>> 0) | (b >>> 0 > n >>> 0)) : 0) {
            C = 0;
            k = M;
            return C | 0;
        }
        b: do if (!(u[2894] & 4)) {
            e = u[2789] | 0;
            c: do if (e) {
                i = 11580;
                while(1){
                    n = u[i >> 2] | 0;
                    if (n >>> 0 <= e >>> 0 ? ((w = (i + 4) | 0), ((n + (u[w >> 2] | 0)) | 0) >>> 0 > e >>> 0) : 0) break;
                    n = u[(i + 8) >> 2] | 0;
                    if (!n) {
                        p = 118;
                        break c;
                    } else i = n;
                }
                r = (f - o) & t;
                if (r >>> 0 < 2147483647) {
                    n = MZ(r | 0) | 0;
                    if ((n | 0) == (((u[i >> 2] | 0) + (u[w >> 2] | 0)) | 0)) {
                        if ((n | 0) != (-1 | 0)) {
                            o = r;
                            f = n;
                            p = 135;
                            break b;
                        }
                    } else {
                        i = n;
                        p = 126;
                    }
                } else r = 0;
            } else p = 118;
            while (0)
            do if ((p | 0) == 118) {
                e = MZ(0) | 0;
                if ((e | 0) != (-1 | 0) ? ((r = e), (h = u[2902] | 0), (d = (h + -1) | 0), (r = ((((d & r) | 0) == 0 ? 0 : (((d + r) & (0 - h)) - r) | 0) + l) | 0), (h = u[2891] | 0), (d = (r + h) | 0), (r >>> 0 > s >>> 0) & (r >>> 0 < 2147483647)) : 0) {
                    w = u[2893] | 0;
                    if (w | 0 ? (d >>> 0 <= h >>> 0) | (d >>> 0 > w >>> 0) : 0) {
                        r = 0;
                        break;
                    }
                    n = MZ(r | 0) | 0;
                    if ((n | 0) == (e | 0)) {
                        o = r;
                        f = e;
                        p = 135;
                        break b;
                    } else {
                        i = n;
                        p = 126;
                    }
                } else r = 0;
            }
            while (0)
            do if ((p | 0) == 126) {
                e = (0 - r) | 0;
                if (!((c >>> 0 > r >>> 0) & ((r >>> 0 < 2147483647) & ((i | 0) != (-1 | 0))))) if ((i | 0) == (-1 | 0)) {
                    r = 0;
                    break;
                } else {
                    o = r;
                    f = i;
                    p = 135;
                    break b;
                }
                n = u[2903] | 0;
                n = (a - r + n) & (0 - n);
                if (n >>> 0 >= 2147483647) {
                    o = r;
                    f = i;
                    p = 135;
                    break b;
                }
                if ((MZ(n | 0) | 0) == (-1 | 0)) {
                    MZ(e | 0) | 0;
                    r = 0;
                    break;
                } else {
                    o = (n + r) | 0;
                    f = i;
                    p = 135;
                    break b;
                }
            }
            while (0)
            u[2894] = u[2894] | 4;
            p = 133;
        } else {
            r = 0;
            p = 133;
        }
        while (0)
        if (((p | 0) == 133 ? l >>> 0 < 2147483647 : 0) ? ((y = MZ(l | 0) | 0), (w = MZ(0) | 0), ($ = (w - y) | 0), (m = $ >>> 0 > ((s + 40) | 0) >>> 0), !(((y | 0) == (-1 | 0)) | (m ^ 1) | (((y >>> 0 < w >>> 0) & (((y | 0) != (-1 | 0)) & ((w | 0) != (-1 | 0)))) ^ 1))) : 0) {
            o = m ? $ : r;
            f = y;
            p = 135;
        }
        if ((p | 0) == 135) {
            r = ((u[2891] | 0) + o) | 0;
            u[2891] = r;
            if (r >>> 0 > (u[2892] | 0) >>> 0) u[2892] = r;
            a = u[2789] | 0;
            do if (a) {
                r = 11580;
                while(1){
                    n = u[r >> 2] | 0;
                    e = (r + 4) | 0;
                    i = u[e >> 2] | 0;
                    if ((f | 0) == ((n + i) | 0)) {
                        p = 145;
                        break;
                    }
                    t = u[(r + 8) >> 2] | 0;
                    if (!t) break;
                    else r = t;
                }
                if (((p | 0) == 145 ? ((u[(r + 12) >> 2] & 8) | 0) == 0 : 0) ? (a >>> 0 < f >>> 0) & (a >>> 0 >= n >>> 0) : 0) {
                    u[e >> 2] = i + o;
                    C = (a + 8) | 0;
                    C = ((C & 7) | 0) == 0 ? 0 : (0 - C) & 7;
                    p = (a + C) | 0;
                    C = ((u[2786] | 0) + (o - C)) | 0;
                    u[2789] = p;
                    u[2786] = C;
                    u[(p + 4) >> 2] = C | 1;
                    u[(p + C + 4) >> 2] = 40;
                    u[2790] = u[2905];
                    break;
                }
                if (f >>> 0 < (u[2787] | 0) >>> 0) u[2787] = f;
                e = (f + o) | 0;
                r = 11580;
                while(1){
                    if ((u[r >> 2] | 0) == (e | 0)) {
                        p = 153;
                        break;
                    }
                    n = u[(r + 8) >> 2] | 0;
                    if (!n) break;
                    else r = n;
                }
                if ((p | 0) == 153 ? ((u[(r + 12) >> 2] & 8) | 0) == 0 : 0) {
                    u[r >> 2] = f;
                    v = (r + 4) | 0;
                    u[v >> 2] = (u[v >> 2] | 0) + o;
                    v = (f + 8) | 0;
                    v = (f + (((v & 7) | 0) == 0 ? 0 : (0 - v) & 7)) | 0;
                    r = (e + 8) | 0;
                    r = (e + (((r & 7) | 0) == 0 ? 0 : (0 - r) & 7)) | 0;
                    l = (v + s) | 0;
                    c = (r - v - s) | 0;
                    u[(v + 4) >> 2] = s | 3;
                    do if ((r | 0) != (a | 0)) {
                        if ((r | 0) == (u[2788] | 0)) {
                            C = ((u[2785] | 0) + c) | 0;
                            u[2785] = C;
                            u[2788] = l;
                            u[(l + 4) >> 2] = C | 1;
                            u[(l + C) >> 2] = C;
                            break;
                        }
                        n = u[(r + 4) >> 2] | 0;
                        if (((n & 3) | 0) == 1) {
                            o = n & -8;
                            i = n >>> 3;
                            d: do if (n >>> 0 < 256) {
                                n = u[(r + 8) >> 2] | 0;
                                e = u[(r + 12) >> 2] | 0;
                                if ((e | 0) == (n | 0)) {
                                    u[2783] = u[2783] & ~(1 << i);
                                    break;
                                } else {
                                    u[(n + 12) >> 2] = e;
                                    u[(e + 8) >> 2] = n;
                                    break;
                                }
                            } else {
                                f = u[(r + 24) >> 2] | 0;
                                n = u[(r + 12) >> 2] | 0;
                                do if ((n | 0) == (r | 0)) {
                                    i = (r + 16) | 0;
                                    e = (i + 4) | 0;
                                    n = u[e >> 2] | 0;
                                    if (!n) {
                                        n = u[i >> 2] | 0;
                                        if (!n) {
                                            n = 0;
                                            break;
                                        } else e = i;
                                    }
                                    while(1){
                                        i = (n + 20) | 0;
                                        t = u[i >> 2] | 0;
                                        if (t | 0) {
                                            n = t;
                                            e = i;
                                            continue;
                                        }
                                        i = (n + 16) | 0;
                                        t = u[i >> 2] | 0;
                                        if (!t) break;
                                        else {
                                            n = t;
                                            e = i;
                                        }
                                    }
                                    u[e >> 2] = 0;
                                } else {
                                    C = u[(r + 8) >> 2] | 0;
                                    u[(C + 12) >> 2] = n;
                                    u[(n + 8) >> 2] = C;
                                }
                                while (0)
                                if (!f) break;
                                e = u[(r + 28) >> 2] | 0;
                                i = (11436 + (e << 2)) | 0;
                                do if ((r | 0) != (u[i >> 2] | 0)) {
                                    u[(f + 16 + ((((u[(f + 16) >> 2] | 0) != (r | 0)) & 1) << 2)) >> 2] = n;
                                    if (!n) break d;
                                } else {
                                    u[i >> 2] = n;
                                    if (n | 0) break;
                                    u[2784] = u[2784] & ~(1 << e);
                                    break d;
                                }
                                while (0)
                                u[(n + 24) >> 2] = f;
                                e = (r + 16) | 0;
                                i = u[e >> 2] | 0;
                                if (i | 0) {
                                    u[(n + 16) >> 2] = i;
                                    u[(i + 24) >> 2] = n;
                                }
                                e = u[(e + 4) >> 2] | 0;
                                if (!e) break;
                                u[(n + 20) >> 2] = e;
                                u[(e + 24) >> 2] = n;
                            }
                            while (0)
                            r = (r + o) | 0;
                            t = (o + c) | 0;
                        } else t = c;
                        r = (r + 4) | 0;
                        u[r >> 2] = u[r >> 2] & -2;
                        u[(l + 4) >> 2] = t | 1;
                        u[(l + t) >> 2] = t;
                        r = t >>> 3;
                        if (t >>> 0 < 256) {
                            e = (11172 + ((r << 1) << 2)) | 0;
                            n = u[2783] | 0;
                            r = 1 << r;
                            if (!(n & r)) {
                                u[2783] = n | r;
                                r = e;
                                n = (e + 8) | 0;
                            } else {
                                n = (e + 8) | 0;
                                r = u[n >> 2] | 0;
                            }
                            u[n >> 2] = l;
                            u[(r + 12) >> 2] = l;
                            u[(l + 8) >> 2] = r;
                            u[(l + 12) >> 2] = e;
                            break;
                        }
                        r = t >>> 8;
                        do if (!r) r = 0;
                        else {
                            if (t >>> 0 > 16777215) {
                                r = 31;
                                break;
                            }
                            p = (((r + 1048320) | 0) >>> 16) & 8;
                            C = r << p;
                            y = (((C + 520192) | 0) >>> 16) & 4;
                            C = C << y;
                            r = (((C + 245760) | 0) >>> 16) & 2;
                            r = (14 - (y | p | r) + ((C << r) >>> 15)) | 0;
                            r = ((t >>> ((r + 7) | 0)) & 1) | (r << 1);
                        }
                        while (0)
                        i = (11436 + (r << 2)) | 0;
                        u[(l + 28) >> 2] = r;
                        n = (l + 16) | 0;
                        u[(n + 4) >> 2] = 0;
                        u[n >> 2] = 0;
                        n = u[2784] | 0;
                        e = 1 << r;
                        if (!(n & e)) {
                            u[2784] = n | e;
                            u[i >> 2] = l;
                            u[(l + 24) >> 2] = i;
                            u[(l + 12) >> 2] = l;
                            u[(l + 8) >> 2] = l;
                            break;
                        }
                        n = t << ((r | 0) == 31 ? 0 : (25 - (r >>> 1)) | 0);
                        e = u[i >> 2] | 0;
                        while(1){
                            if (((u[(e + 4) >> 2] & -8) | 0) == (t | 0)) {
                                p = 194;
                                break;
                            }
                            i = (e + 16 + ((n >>> 31) << 2)) | 0;
                            r = u[i >> 2] | 0;
                            if (!r) {
                                p = 193;
                                break;
                            } else {
                                n = n << 1;
                                e = r;
                            }
                        }
                        if ((p | 0) == 193) {
                            u[i >> 2] = l;
                            u[(l + 24) >> 2] = e;
                            u[(l + 12) >> 2] = l;
                            u[(l + 8) >> 2] = l;
                            break;
                        } else if ((p | 0) == 194) {
                            p = (e + 8) | 0;
                            C = u[p >> 2] | 0;
                            u[(C + 12) >> 2] = l;
                            u[p >> 2] = l;
                            u[(l + 8) >> 2] = C;
                            u[(l + 12) >> 2] = e;
                            u[(l + 24) >> 2] = 0;
                            break;
                        }
                    } else {
                        C = ((u[2786] | 0) + c) | 0;
                        u[2786] = C;
                        u[2789] = l;
                        u[(l + 4) >> 2] = C | 1;
                    }
                    while (0)
                    C = (v + 8) | 0;
                    k = M;
                    return C | 0;
                }
                r = 11580;
                while(1){
                    n = u[r >> 2] | 0;
                    if (n >>> 0 <= a >>> 0 ? ((C = (n + (u[(r + 4) >> 2] | 0)) | 0), C >>> 0 > a >>> 0) : 0) break;
                    r = u[(r + 8) >> 2] | 0;
                }
                t = (C + -47) | 0;
                n = (t + 8) | 0;
                n = (t + (((n & 7) | 0) == 0 ? 0 : (0 - n) & 7)) | 0;
                t = (a + 16) | 0;
                n = n >>> 0 < t >>> 0 ? a : n;
                r = (n + 8) | 0;
                e = (f + 8) | 0;
                e = ((e & 7) | 0) == 0 ? 0 : (0 - e) & 7;
                p = (f + e) | 0;
                e = (o + -40 - e) | 0;
                u[2789] = p;
                u[2786] = e;
                u[(p + 4) >> 2] = e | 1;
                u[(p + e + 4) >> 2] = 40;
                u[2790] = u[2905];
                e = (n + 4) | 0;
                u[e >> 2] = 27;
                u[r >> 2] = u[2895];
                u[(r + 4) >> 2] = u[2896];
                u[(r + 8) >> 2] = u[2897];
                u[(r + 12) >> 2] = u[2898];
                u[2895] = f;
                u[2896] = o;
                u[2898] = 0;
                u[2897] = r;
                r = (n + 24) | 0;
                do {
                    p = r;
                    r = (r + 4) | 0;
                    u[r >> 2] = 7;
                }while (((p + 8) | 0) >>> 0 < C >>> 0)
                if ((n | 0) != (a | 0)) {
                    f = (n - a) | 0;
                    u[e >> 2] = u[e >> 2] & -2;
                    u[(a + 4) >> 2] = f | 1;
                    u[n >> 2] = f;
                    r = f >>> 3;
                    if (f >>> 0 < 256) {
                        e = (11172 + ((r << 1) << 2)) | 0;
                        n = u[2783] | 0;
                        r = 1 << r;
                        if (!(n & r)) {
                            u[2783] = n | r;
                            r = e;
                            n = (e + 8) | 0;
                        } else {
                            n = (e + 8) | 0;
                            r = u[n >> 2] | 0;
                        }
                        u[n >> 2] = a;
                        u[(r + 12) >> 2] = a;
                        u[(a + 8) >> 2] = r;
                        u[(a + 12) >> 2] = e;
                        break;
                    }
                    r = f >>> 8;
                    if (r) {
                        if (f >>> 0 > 16777215) e = 31;
                        else {
                            p = (((r + 1048320) | 0) >>> 16) & 8;
                            C = r << p;
                            y = (((C + 520192) | 0) >>> 16) & 4;
                            C = C << y;
                            e = (((C + 245760) | 0) >>> 16) & 2;
                            e = (14 - (y | p | e) + ((C << e) >>> 15)) | 0;
                            e = ((f >>> ((e + 7) | 0)) & 1) | (e << 1);
                        }
                    } else e = 0;
                    i = (11436 + (e << 2)) | 0;
                    u[(a + 28) >> 2] = e;
                    u[(a + 20) >> 2] = 0;
                    u[t >> 2] = 0;
                    r = u[2784] | 0;
                    n = 1 << e;
                    if (!(r & n)) {
                        u[2784] = r | n;
                        u[i >> 2] = a;
                        u[(a + 24) >> 2] = i;
                        u[(a + 12) >> 2] = a;
                        u[(a + 8) >> 2] = a;
                        break;
                    }
                    n = f << ((e | 0) == 31 ? 0 : (25 - (e >>> 1)) | 0);
                    e = u[i >> 2] | 0;
                    while(1){
                        if (((u[(e + 4) >> 2] & -8) | 0) == (f | 0)) {
                            p = 216;
                            break;
                        }
                        i = (e + 16 + ((n >>> 31) << 2)) | 0;
                        r = u[i >> 2] | 0;
                        if (!r) {
                            p = 215;
                            break;
                        } else {
                            n = n << 1;
                            e = r;
                        }
                    }
                    if ((p | 0) == 215) {
                        u[i >> 2] = a;
                        u[(a + 24) >> 2] = e;
                        u[(a + 12) >> 2] = a;
                        u[(a + 8) >> 2] = a;
                        break;
                    } else if ((p | 0) == 216) {
                        p = (e + 8) | 0;
                        C = u[p >> 2] | 0;
                        u[(C + 12) >> 2] = a;
                        u[p >> 2] = a;
                        u[(a + 8) >> 2] = C;
                        u[(a + 12) >> 2] = e;
                        u[(a + 24) >> 2] = 0;
                        break;
                    }
                }
            } else {
                C = u[2787] | 0;
                if (((C | 0) == 0) | (f >>> 0 < C >>> 0)) u[2787] = f;
                u[2895] = f;
                u[2896] = o;
                u[2898] = 0;
                u[2792] = u[2901];
                u[2791] = -1;
                r = 0;
                do {
                    C = (11172 + ((r << 1) << 2)) | 0;
                    u[(C + 12) >> 2] = C;
                    u[(C + 8) >> 2] = C;
                    r = (r + 1) | 0;
                }while ((r | 0) != 32)
                C = (f + 8) | 0;
                C = ((C & 7) | 0) == 0 ? 0 : (0 - C) & 7;
                p = (f + C) | 0;
                C = (o + -40 - C) | 0;
                u[2789] = p;
                u[2786] = C;
                u[(p + 4) >> 2] = C | 1;
                u[(p + C + 4) >> 2] = 40;
                u[2790] = u[2905];
            }
            while (0)
            r = u[2786] | 0;
            if (r >>> 0 > s >>> 0) {
                y = (r - s) | 0;
                u[2786] = y;
                C = u[2789] | 0;
                p = (C + s) | 0;
                u[2789] = p;
                u[(p + 4) >> 2] = y | 1;
                u[(C + 4) >> 2] = s | 3;
                C = (C + 8) | 0;
                k = M;
                return C | 0;
            }
        }
        u[(CZ() | 0) >> 2] = 12;
        C = 0;
        k = M;
        return C | 0;
    }
    function CD(n) {
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, a = 0;
        if (!n) return;
        e = (n + -8) | 0;
        t = u[2787] | 0;
        n = u[(n + -4) >> 2] | 0;
        r = n & -8;
        a = (e + r) | 0;
        do if (!(n & 1)) {
            i = u[e >> 2] | 0;
            if (!(n & 3)) return;
            o = (e + (0 - i)) | 0;
            f = (i + r) | 0;
            if (o >>> 0 < t >>> 0) return;
            if ((o | 0) == (u[2788] | 0)) {
                n = (a + 4) | 0;
                r = u[n >> 2] | 0;
                if (((r & 3) | 0) != 3) {
                    c = o;
                    r = f;
                    break;
                }
                u[2785] = f;
                u[n >> 2] = r & -2;
                u[(o + 4) >> 2] = f | 1;
                u[(o + f) >> 2] = f;
                return;
            }
            e = i >>> 3;
            if (i >>> 0 < 256) {
                n = u[(o + 8) >> 2] | 0;
                r = u[(o + 12) >> 2] | 0;
                if ((r | 0) == (n | 0)) {
                    u[2783] = u[2783] & ~(1 << e);
                    c = o;
                    r = f;
                    break;
                } else {
                    u[(n + 12) >> 2] = r;
                    u[(r + 8) >> 2] = n;
                    c = o;
                    r = f;
                    break;
                }
            }
            t = u[(o + 24) >> 2] | 0;
            n = u[(o + 12) >> 2] | 0;
            do if ((n | 0) == (o | 0)) {
                e = (o + 16) | 0;
                r = (e + 4) | 0;
                n = u[r >> 2] | 0;
                if (!n) {
                    n = u[e >> 2] | 0;
                    if (!n) {
                        n = 0;
                        break;
                    } else r = e;
                }
                while(1){
                    e = (n + 20) | 0;
                    i = u[e >> 2] | 0;
                    if (i | 0) {
                        n = i;
                        r = e;
                        continue;
                    }
                    e = (n + 16) | 0;
                    i = u[e >> 2] | 0;
                    if (!i) break;
                    else {
                        n = i;
                        r = e;
                    }
                }
                u[r >> 2] = 0;
            } else {
                c = u[(o + 8) >> 2] | 0;
                u[(c + 12) >> 2] = n;
                u[(n + 8) >> 2] = c;
            }
            while (0)
            if (t) {
                r = u[(o + 28) >> 2] | 0;
                e = (11436 + (r << 2)) | 0;
                if ((o | 0) == (u[e >> 2] | 0)) {
                    u[e >> 2] = n;
                    if (!n) {
                        u[2784] = u[2784] & ~(1 << r);
                        c = o;
                        r = f;
                        break;
                    }
                } else {
                    u[(t + 16 + ((((u[(t + 16) >> 2] | 0) != (o | 0)) & 1) << 2)) >> 2] = n;
                    if (!n) {
                        c = o;
                        r = f;
                        break;
                    }
                }
                u[(n + 24) >> 2] = t;
                r = (o + 16) | 0;
                e = u[r >> 2] | 0;
                if (e | 0) {
                    u[(n + 16) >> 2] = e;
                    u[(e + 24) >> 2] = n;
                }
                r = u[(r + 4) >> 2] | 0;
                if (r) {
                    u[(n + 20) >> 2] = r;
                    u[(r + 24) >> 2] = n;
                    c = o;
                    r = f;
                } else {
                    c = o;
                    r = f;
                }
            } else {
                c = o;
                r = f;
            }
        } else {
            c = e;
            o = e;
        }
        while (0)
        if (o >>> 0 >= a >>> 0) return;
        n = (a + 4) | 0;
        i = u[n >> 2] | 0;
        if (!(i & 1)) return;
        if (!(i & 2)) {
            n = u[2788] | 0;
            if ((a | 0) == (u[2789] | 0)) {
                a = ((u[2786] | 0) + r) | 0;
                u[2786] = a;
                u[2789] = c;
                u[(c + 4) >> 2] = a | 1;
                if ((c | 0) != (n | 0)) return;
                u[2788] = 0;
                u[2785] = 0;
                return;
            }
            if ((a | 0) == (n | 0)) {
                a = ((u[2785] | 0) + r) | 0;
                u[2785] = a;
                u[2788] = o;
                u[(c + 4) >> 2] = a | 1;
                u[(o + a) >> 2] = a;
                return;
            }
            t = ((i & -8) + r) | 0;
            e = i >>> 3;
            do if (i >>> 0 < 256) {
                r = u[(a + 8) >> 2] | 0;
                n = u[(a + 12) >> 2] | 0;
                if ((n | 0) == (r | 0)) {
                    u[2783] = u[2783] & ~(1 << e);
                    break;
                } else {
                    u[(r + 12) >> 2] = n;
                    u[(n + 8) >> 2] = r;
                    break;
                }
            } else {
                f = u[(a + 24) >> 2] | 0;
                n = u[(a + 12) >> 2] | 0;
                do if ((n | 0) == (a | 0)) {
                    e = (a + 16) | 0;
                    r = (e + 4) | 0;
                    n = u[r >> 2] | 0;
                    if (!n) {
                        n = u[e >> 2] | 0;
                        if (!n) {
                            e = 0;
                            break;
                        } else r = e;
                    }
                    while(1){
                        e = (n + 20) | 0;
                        i = u[e >> 2] | 0;
                        if (i | 0) {
                            n = i;
                            r = e;
                            continue;
                        }
                        e = (n + 16) | 0;
                        i = u[e >> 2] | 0;
                        if (!i) break;
                        else {
                            n = i;
                            r = e;
                        }
                    }
                    u[r >> 2] = 0;
                    e = n;
                } else {
                    e = u[(a + 8) >> 2] | 0;
                    u[(e + 12) >> 2] = n;
                    u[(n + 8) >> 2] = e;
                    e = n;
                }
                while (0)
                if (f | 0) {
                    n = u[(a + 28) >> 2] | 0;
                    r = (11436 + (n << 2)) | 0;
                    if ((a | 0) == (u[r >> 2] | 0)) {
                        u[r >> 2] = e;
                        if (!e) {
                            u[2784] = u[2784] & ~(1 << n);
                            break;
                        }
                    } else {
                        u[(f + 16 + ((((u[(f + 16) >> 2] | 0) != (a | 0)) & 1) << 2)) >> 2] = e;
                        if (!e) break;
                    }
                    u[(e + 24) >> 2] = f;
                    n = (a + 16) | 0;
                    r = u[n >> 2] | 0;
                    if (r | 0) {
                        u[(e + 16) >> 2] = r;
                        u[(r + 24) >> 2] = e;
                    }
                    n = u[(n + 4) >> 2] | 0;
                    if (n | 0) {
                        u[(e + 20) >> 2] = n;
                        u[(n + 24) >> 2] = e;
                    }
                }
            }
            while (0)
            u[(c + 4) >> 2] = t | 1;
            u[(o + t) >> 2] = t;
            if ((c | 0) == (u[2788] | 0)) {
                u[2785] = t;
                return;
            }
        } else {
            u[n >> 2] = i & -2;
            u[(c + 4) >> 2] = r | 1;
            u[(o + r) >> 2] = r;
            t = r;
        }
        n = t >>> 3;
        if (t >>> 0 < 256) {
            e = (11172 + ((n << 1) << 2)) | 0;
            r = u[2783] | 0;
            n = 1 << n;
            if (!(r & n)) {
                u[2783] = r | n;
                n = e;
                r = (e + 8) | 0;
            } else {
                r = (e + 8) | 0;
                n = u[r >> 2] | 0;
            }
            u[r >> 2] = c;
            u[(n + 12) >> 2] = c;
            u[(c + 8) >> 2] = n;
            u[(c + 12) >> 2] = e;
            return;
        }
        n = t >>> 8;
        if (n) {
            if (t >>> 0 > 16777215) n = 31;
            else {
                o = (((n + 1048320) | 0) >>> 16) & 8;
                a = n << o;
                f = (((a + 520192) | 0) >>> 16) & 4;
                a = a << f;
                n = (((a + 245760) | 0) >>> 16) & 2;
                n = (14 - (f | o | n) + ((a << n) >>> 15)) | 0;
                n = ((t >>> ((n + 7) | 0)) & 1) | (n << 1);
            }
        } else n = 0;
        i = (11436 + (n << 2)) | 0;
        u[(c + 28) >> 2] = n;
        u[(c + 20) >> 2] = 0;
        u[(c + 16) >> 2] = 0;
        r = u[2784] | 0;
        e = 1 << n;
        do if (r & e) {
            r = t << ((n | 0) == 31 ? 0 : (25 - (n >>> 1)) | 0);
            e = u[i >> 2] | 0;
            while(1){
                if (((u[(e + 4) >> 2] & -8) | 0) == (t | 0)) {
                    n = 73;
                    break;
                }
                i = (e + 16 + ((r >>> 31) << 2)) | 0;
                n = u[i >> 2] | 0;
                if (!n) {
                    n = 72;
                    break;
                } else {
                    r = r << 1;
                    e = n;
                }
            }
            if ((n | 0) == 72) {
                u[i >> 2] = c;
                u[(c + 24) >> 2] = e;
                u[(c + 12) >> 2] = c;
                u[(c + 8) >> 2] = c;
                break;
            } else if ((n | 0) == 73) {
                o = (e + 8) | 0;
                a = u[o >> 2] | 0;
                u[(a + 12) >> 2] = c;
                u[o >> 2] = c;
                u[(c + 8) >> 2] = a;
                u[(c + 12) >> 2] = e;
                u[(c + 24) >> 2] = 0;
                break;
            }
        } else {
            u[2784] = r | e;
            u[i >> 2] = c;
            u[(c + 24) >> 2] = i;
            u[(c + 12) >> 2] = c;
            u[(c + 8) >> 2] = c;
        }
        while (0)
        a = ((u[2791] | 0) + -1) | 0;
        u[2791] = a;
        if (!a) n = 11588;
        else return;
        while(1){
            n = u[n >> 2] | 0;
            if (!n) break;
            else n = (n + 8) | 0;
        }
        u[2791] = -1;
        return;
    }
    function CF() {
        return 11628;
    }
    function CK(n) {
        n = n | 0;
        var r = 0, e = 0;
        r = k;
        k = (k + 16) | 0;
        e = r;
        u[e >> 2] = CV(u[(n + 60) >> 2] | 0) | 0;
        n = CX(n6(6, e | 0) | 0) | 0;
        k = r;
        return n | 0;
    }
    function Cq(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0;
        s = k;
        k = (k + 48) | 0;
        l = (s + 16) | 0;
        f = s;
        t = (s + 32) | 0;
        c = (n + 28) | 0;
        i = u[c >> 2] | 0;
        u[t >> 2] = i;
        a = (n + 20) | 0;
        i = ((u[a >> 2] | 0) - i) | 0;
        u[(t + 4) >> 2] = i;
        u[(t + 8) >> 2] = r;
        u[(t + 12) >> 2] = e;
        i = (i + e) | 0;
        o = (n + 60) | 0;
        u[f >> 2] = u[o >> 2];
        u[(f + 4) >> 2] = t;
        u[(f + 8) >> 2] = 2;
        f = CX(n5(146, f | 0) | 0) | 0;
        a: do if ((i | 0) != (f | 0)) {
            r = 2;
            while(1){
                if ((f | 0) < 0) break;
                i = (i - f) | 0;
                h = u[(t + 4) >> 2] | 0;
                b = f >>> 0 > h >>> 0;
                t = b ? (t + 8) | 0 : t;
                r = (((b << 31) >> 31) + r) | 0;
                h = (f - (b ? h : 0)) | 0;
                u[t >> 2] = (u[t >> 2] | 0) + h;
                b = (t + 4) | 0;
                u[b >> 2] = (u[b >> 2] | 0) - h;
                u[l >> 2] = u[o >> 2];
                u[(l + 4) >> 2] = t;
                u[(l + 8) >> 2] = r;
                f = CX(n5(146, l | 0) | 0) | 0;
                if ((i | 0) == (f | 0)) {
                    v = 3;
                    break a;
                }
            }
            u[(n + 16) >> 2] = 0;
            u[c >> 2] = 0;
            u[a >> 2] = 0;
            u[n >> 2] = u[n >> 2] | 32;
            if ((r | 0) == 2) e = 0;
            else e = (e - (u[(t + 4) >> 2] | 0)) | 0;
        } else v = 3;
        while (0)
        if ((v | 0) == 3) {
            h = u[(n + 44) >> 2] | 0;
            u[(n + 16) >> 2] = h + (u[(n + 48) >> 2] | 0);
            u[c >> 2] = h;
            u[a >> 2] = h;
        }
        k = s;
        return e | 0;
    }
    function CH(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0;
        t = k;
        k = (k + 32) | 0;
        f = t;
        i = (t + 20) | 0;
        u[f >> 2] = u[(n + 60) >> 2];
        u[(f + 4) >> 2] = 0;
        u[(f + 8) >> 2] = r;
        u[(f + 12) >> 2] = i;
        u[(f + 16) >> 2] = e;
        if ((CX(n7(140, f | 0) | 0) | 0) < 0) {
            u[i >> 2] = -1;
            n = -1;
        } else n = u[i >> 2] | 0;
        k = t;
        return n | 0;
    }
    function CX(n) {
        n = n | 0;
        if (n >>> 0 > 4294963200) {
            u[(CZ() | 0) >> 2] = 0 - n;
            n = -1;
        }
        return n | 0;
    }
    function CZ() {
        return ((CJ() | 0) + 64) | 0;
    }
    function CJ() {
        return CQ() | 0;
    }
    function CQ() {
        return 2084;
    }
    function CV(n) {
        n = n | 0;
        return n | 0;
    }
    function CW(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, f = 0;
        f = k;
        k = (k + 32) | 0;
        t = f;
        u[(n + 36) >> 2] = 1;
        if (((u[n >> 2] & 64) | 0) == 0 ? ((u[t >> 2] = u[(n + 60) >> 2]), (u[(t + 4) >> 2] = 21523), (u[(t + 8) >> 2] = f + 16), nV(54, t | 0) | 0) : 0) i[(n + 75) >> 0] = -1;
        t = Cq(n, r, e) | 0;
        k = f;
        return t | 0;
    }
    function C_(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, t = 0;
        e = i[n >> 0] | 0;
        t = i[r >> 0] | 0;
        if ((e << 24) >> 24 == 0 ? 1 : (e << 24) >> 24 != (t << 24) >> 24) n = t;
        else {
            do {
                n = (n + 1) | 0;
                r = (r + 1) | 0;
                e = i[n >> 0] | 0;
                t = i[r >> 0] | 0;
            }while (!((e << 24) >> 24 == 0 ? 1 : (e << 24) >> 24 != (t << 24) >> 24))
            n = t;
        }
        return ((e & 255) - (n & 255)) | 0;
    }
    function C0(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, u = 0;
        a: do if (!e) n = 0;
        else {
            while(1){
                t = i[n >> 0] | 0;
                u = i[r >> 0] | 0;
                if ((t << 24) >> 24 != (u << 24) >> 24) break;
                e = (e + -1) | 0;
                if (!e) {
                    n = 0;
                    break a;
                } else {
                    n = (n + 1) | 0;
                    r = (r + 1) | 0;
                }
            }
            n = ((t & 255) - (u & 255)) | 0;
        }
        while (0)
        return n | 0;
    }
    function C2(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, h = 0, d = 0, w = 0, $ = 0;
        $ = k;
        k = (k + 224) | 0;
        s = ($ + 120) | 0;
        b = ($ + 80) | 0;
        d = $;
        w = ($ + 136) | 0;
        t = b;
        f = (t + 40) | 0;
        do {
            u[t >> 2] = 0;
            t = (t + 4) | 0;
        }while ((t | 0) < (f | 0))
        u[s >> 2] = u[e >> 2];
        if ((C1(0, r, s, d, b) | 0) < 0) e = -1;
        else {
            if ((u[(n + 76) >> 2] | 0) > -1) h = C4(n) | 0;
            else h = 0;
            e = u[n >> 2] | 0;
            v = e & 32;
            if ((i[(n + 74) >> 0] | 0) < 1) u[n >> 2] = e & -33;
            t = (n + 48) | 0;
            if (!(u[t >> 2] | 0)) {
                f = (n + 44) | 0;
                o = u[f >> 2] | 0;
                u[f >> 2] = w;
                c = (n + 28) | 0;
                u[c >> 2] = w;
                a = (n + 20) | 0;
                u[a >> 2] = w;
                u[t >> 2] = 80;
                l = (n + 16) | 0;
                u[l >> 2] = w + 80;
                e = C1(n, r, s, d, b) | 0;
                if (o) {
                    gJ[u[(n + 36) >> 2] & 7](n, 0, 0) | 0;
                    e = (u[a >> 2] | 0) == 0 ? -1 : e;
                    u[f >> 2] = o;
                    u[t >> 2] = 0;
                    u[l >> 2] = 0;
                    u[c >> 2] = 0;
                    u[a >> 2] = 0;
                }
            } else e = C1(n, r, s, d, b) | 0;
            t = u[n >> 2] | 0;
            u[n >> 2] = t | v;
            if (h | 0) C8(n);
            e = ((t & 32) | 0) == 0 ? e : -1;
        }
        k = $;
        return e | 0;
    }
    function C1(n, r, e, f, o) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        f = f | 0;
        o = o | 0;
        var c = 0, a = 0, v = 0, s = 0, b = 0, h = 0, d = 0, w = 0, $ = 0, m = 0, y = 0, p = 0, C = 0, M = 0, g = 0, A = 0, I = 0, S = 0, T = 0, N = 0, L = 0, O = 0, P = 0;
        P = k;
        k = (k + 64) | 0;
        T = (P + 16) | 0;
        N = P;
        I = (P + 24) | 0;
        L = (P + 8) | 0;
        O = (P + 20) | 0;
        u[T >> 2] = r;
        M = (n | 0) != 0;
        g = (I + 40) | 0;
        A = g;
        I = (I + 39) | 0;
        S = (L + 4) | 0;
        a = 0;
        c = 0;
        h = 0;
        a: while(1){
            do if ((c | 0) > -1) if ((a | 0) > ((2147483647 - c) | 0)) {
                u[(CZ() | 0) >> 2] = 75;
                c = -1;
                break;
            } else {
                c = (a + c) | 0;
                break;
            }
            while (0)
            a = i[r >> 0] | 0;
            if (!((a << 24) >> 24)) {
                C = 87;
                break;
            } else v = r;
            b: while(1){
                switch((a << 24) >> 24){
                    case 37:
                        {
                            a = v;
                            C = 9;
                            break b;
                        }
                    case 0:
                        {
                            a = v;
                            break b;
                        }
                    default:
                        {}
                }
                p = (v + 1) | 0;
                u[T >> 2] = p;
                a = i[p >> 0] | 0;
                v = p;
            }
            c: do if ((C | 0) == 9) while(1){
                C = 0;
                if ((i[(v + 1) >> 0] | 0) != 37) break c;
                a = (a + 1) | 0;
                v = (v + 2) | 0;
                u[T >> 2] = v;
                if ((i[v >> 0] | 0) == 37) C = 9;
                else break;
            }
            while (0)
            a = (a - r) | 0;
            if (M) C3(n, r, a);
            if (a | 0) {
                r = v;
                continue;
            }
            s = (v + 1) | 0;
            a = ((i[s >> 0] | 0) + -48) | 0;
            if (a >>> 0 < 10) {
                p = (i[(v + 2) >> 0] | 0) == 36;
                y = p ? a : -1;
                h = p ? 1 : h;
                s = p ? (v + 3) | 0 : s;
            } else y = -1;
            u[T >> 2] = s;
            a = i[s >> 0] | 0;
            v = (((a << 24) >> 24) + -32) | 0;
            d: do if (v >>> 0 < 32) {
                b = 0;
                d = a;
                while(1){
                    a = 1 << v;
                    if (!(a & 75913)) {
                        a = d;
                        break d;
                    }
                    b = a | b;
                    s = (s + 1) | 0;
                    u[T >> 2] = s;
                    a = i[s >> 0] | 0;
                    v = (((a << 24) >> 24) + -32) | 0;
                    if (v >>> 0 >= 32) break;
                    else d = a;
                }
            } else b = 0;
            while (0)
            if ((a << 24) >> 24 == 42) {
                v = (s + 1) | 0;
                a = ((i[v >> 0] | 0) + -48) | 0;
                if (a >>> 0 < 10 ? (i[(s + 2) >> 0] | 0) == 36 : 0) {
                    u[(o + (a << 2)) >> 2] = 10;
                    a = u[(f + (((i[v >> 0] | 0) + -48) << 3)) >> 2] | 0;
                    h = 1;
                    s = (s + 3) | 0;
                } else {
                    if (h | 0) {
                        c = -1;
                        break;
                    }
                    if (M) {
                        h = ((u[e >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                        a = u[h >> 2] | 0;
                        u[e >> 2] = h + 4;
                        h = 0;
                        s = v;
                    } else {
                        a = 0;
                        h = 0;
                        s = v;
                    }
                }
                u[T >> 2] = s;
                p = (a | 0) < 0;
                a = p ? (0 - a) | 0 : a;
                b = p ? b | 8192 : b;
            } else {
                a = C6(T) | 0;
                if ((a | 0) < 0) {
                    c = -1;
                    break;
                }
                s = u[T >> 2] | 0;
            }
            do if ((i[s >> 0] | 0) == 46) {
                if ((i[(s + 1) >> 0] | 0) != 42) {
                    u[T >> 2] = s + 1;
                    v = C6(T) | 0;
                    s = u[T >> 2] | 0;
                    break;
                }
                d = (s + 2) | 0;
                v = ((i[d >> 0] | 0) + -48) | 0;
                if (v >>> 0 < 10 ? (i[(s + 3) >> 0] | 0) == 36 : 0) {
                    u[(o + (v << 2)) >> 2] = 10;
                    v = u[(f + (((i[d >> 0] | 0) + -48) << 3)) >> 2] | 0;
                    s = (s + 4) | 0;
                    u[T >> 2] = s;
                    break;
                }
                if (h | 0) {
                    c = -1;
                    break a;
                }
                if (M) {
                    p = ((u[e >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    v = u[p >> 2] | 0;
                    u[e >> 2] = p + 4;
                } else v = 0;
                u[T >> 2] = d;
                s = d;
            } else v = -1;
            while (0)
            m = 0;
            while(1){
                if ((((i[s >> 0] | 0) + -65) | 0) >>> 0 > 57) {
                    c = -1;
                    break a;
                }
                p = (s + 1) | 0;
                u[T >> 2] = p;
                d = i[((i[s >> 0] | 0) + -65 + (5178 + ((m * 58) | 0))) >> 0] | 0;
                w = d & 255;
                if (((w + -1) | 0) >>> 0 < 8) {
                    m = w;
                    s = p;
                } else break;
            }
            if (!((d << 24) >> 24)) {
                c = -1;
                break;
            }
            $ = (y | 0) > -1;
            do if ((d << 24) >> 24 == 19) {
                if ($) {
                    c = -1;
                    break a;
                } else C = 49;
            } else {
                if ($) {
                    u[(o + (y << 2)) >> 2] = w;
                    $ = (f + (y << 3)) | 0;
                    y = u[($ + 4) >> 2] | 0;
                    C = N;
                    u[C >> 2] = u[$ >> 2];
                    u[(C + 4) >> 2] = y;
                    C = 49;
                    break;
                }
                if (!M) {
                    c = 0;
                    break a;
                }
                C9(N, w, e);
            }
            while (0)
            if ((C | 0) == 49 ? ((C = 0), !M) : 0) {
                a = 0;
                r = p;
                continue;
            }
            s = i[s >> 0] | 0;
            s = ((m | 0) != 0) & (((s & 15) | 0) == 3) ? s & -33 : s;
            $ = b & -65537;
            y = ((b & 8192) | 0) == 0 ? b : $;
            e: do switch(s | 0){
                case 110:
                    switch(((m & 255) << 24) >> 24){
                        case 0:
                            {
                                u[u[N >> 2] >> 2] = c;
                                a = 0;
                                r = p;
                                continue a;
                            }
                        case 1:
                            {
                                u[u[N >> 2] >> 2] = c;
                                a = 0;
                                r = p;
                                continue a;
                            }
                        case 2:
                            {
                                a = u[N >> 2] | 0;
                                u[a >> 2] = c;
                                u[(a + 4) >> 2] = (((c | 0) < 0) << 31) >> 31;
                                a = 0;
                                r = p;
                                continue a;
                            }
                        case 3:
                            {
                                t[u[N >> 2] >> 1] = c;
                                a = 0;
                                r = p;
                                continue a;
                            }
                        case 4:
                            {
                                i[u[N >> 2] >> 0] = c;
                                a = 0;
                                r = p;
                                continue a;
                            }
                        case 6:
                            {
                                u[u[N >> 2] >> 2] = c;
                                a = 0;
                                r = p;
                                continue a;
                            }
                        case 7:
                            {
                                a = u[N >> 2] | 0;
                                u[a >> 2] = c;
                                u[(a + 4) >> 2] = (((c | 0) < 0) << 31) >> 31;
                                a = 0;
                                r = p;
                                continue a;
                            }
                        default:
                            {
                                a = 0;
                                r = p;
                                continue a;
                            }
                    }
                case 112:
                    {
                        s = 120;
                        v = v >>> 0 > 8 ? v : 8;
                        r = y | 8;
                        C = 61;
                        break;
                    }
                case 88:
                case 120:
                    {
                        r = y;
                        C = 61;
                        break;
                    }
                case 111:
                    {
                        s = N;
                        r = u[s >> 2] | 0;
                        s = u[(s + 4) >> 2] | 0;
                        w = C5(r, s, g) | 0;
                        $ = (A - w) | 0;
                        b = 0;
                        d = 5642;
                        v = (((y & 8) | 0) == 0) | ((v | 0) > ($ | 0)) ? v : ($ + 1) | 0;
                        $ = y;
                        C = 67;
                        break;
                    }
                case 105:
                case 100:
                    {
                        s = N;
                        r = u[s >> 2] | 0;
                        s = u[(s + 4) >> 2] | 0;
                        if ((s | 0) < 0) {
                            r = MU(0, 0, r | 0, s | 0) | 0;
                            s = x;
                            b = N;
                            u[b >> 2] = r;
                            u[(b + 4) >> 2] = s;
                            b = 1;
                            d = 5642;
                            C = 66;
                            break e;
                        } else {
                            b = (((y & 2049) | 0) != 0) & 1;
                            d = ((y & 2048) | 0) == 0 ? ((y & 1) | 0) == 0 ? 5642 : 5644 : 5643;
                            C = 66;
                            break e;
                        }
                    }
                case 117:
                    {
                        s = N;
                        b = 0;
                        d = 5642;
                        r = u[s >> 2] | 0;
                        s = u[(s + 4) >> 2] | 0;
                        C = 66;
                        break;
                    }
                case 99:
                    {
                        i[I >> 0] = u[N >> 2];
                        r = I;
                        b = 0;
                        d = 5642;
                        w = g;
                        s = 1;
                        v = $;
                        break;
                    }
                case 109:
                    {
                        s = Mr(u[(CZ() | 0) >> 2] | 0) | 0;
                        C = 71;
                        break;
                    }
                case 115:
                    {
                        s = u[N >> 2] | 0;
                        s = s | 0 ? s : 5652;
                        C = 71;
                        break;
                    }
                case 67:
                    {
                        u[L >> 2] = u[N >> 2];
                        u[S >> 2] = 0;
                        u[N >> 2] = L;
                        w = -1;
                        s = L;
                        C = 75;
                        break;
                    }
                case 83:
                    {
                        r = u[N >> 2] | 0;
                        if (!v) {
                            Mi(n, 32, a, 0, y);
                            r = 0;
                            C = 84;
                        } else {
                            w = v;
                            s = r;
                            C = 75;
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
                        a = Mu(n, +l[N >> 3], a, v, y, s) | 0;
                        r = p;
                        continue a;
                    }
                default:
                    {
                        b = 0;
                        d = 5642;
                        w = g;
                        s = v;
                        v = y;
                    }
            }
            while (0)
            f: do if ((C | 0) == 61) {
                y = N;
                m = u[y >> 2] | 0;
                y = u[(y + 4) >> 2] | 0;
                w = C7(m, y, g, s & 32) | 0;
                d = (((r & 8) | 0) == 0) | (((m | 0) == 0) & ((y | 0) == 0));
                b = d ? 0 : 2;
                d = d ? 5642 : (5642 + (s >> 4)) | 0;
                $ = r;
                r = m;
                s = y;
                C = 67;
            } else if ((C | 0) == 66) {
                w = Mn(r, s, g) | 0;
                $ = y;
                C = 67;
            } else if ((C | 0) == 71) {
                C = 0;
                y = Me(s, 0, v) | 0;
                m = (y | 0) == 0;
                r = s;
                b = 0;
                d = 5642;
                w = m ? (s + v) | 0 : y;
                s = m ? v : (y - s) | 0;
                v = $;
            } else if ((C | 0) == 75) {
                C = 0;
                d = s;
                r = 0;
                v = 0;
                while(1){
                    b = u[d >> 2] | 0;
                    if (!b) break;
                    v = Mt(O, b) | 0;
                    if (((v | 0) < 0) | (v >>> 0 > ((w - r) | 0) >>> 0)) break;
                    r = (v + r) | 0;
                    if (w >>> 0 > r >>> 0) d = (d + 4) | 0;
                    else break;
                }
                if ((v | 0) < 0) {
                    c = -1;
                    break a;
                }
                Mi(n, 32, a, r, y);
                if (!r) {
                    r = 0;
                    C = 84;
                } else {
                    b = 0;
                    while(1){
                        v = u[s >> 2] | 0;
                        if (!v) {
                            C = 84;
                            break f;
                        }
                        v = Mt(O, v) | 0;
                        b = (v + b) | 0;
                        if ((b | 0) > (r | 0)) {
                            C = 84;
                            break f;
                        }
                        C3(n, O, v);
                        if (b >>> 0 >= r >>> 0) {
                            C = 84;
                            break;
                        } else s = (s + 4) | 0;
                    }
                }
            }
            while (0)
            if ((C | 0) == 67) {
                C = 0;
                s = ((r | 0) != 0) | ((s | 0) != 0);
                y = ((v | 0) != 0) | s;
                s = (((s ^ 1) & 1) + (A - w)) | 0;
                r = y ? w : g;
                w = g;
                s = y ? ((v | 0) > (s | 0) ? v : s) : v;
                v = (v | 0) > -1 ? $ & -65537 : $;
            } else if ((C | 0) == 84) {
                C = 0;
                Mi(n, 32, a, r, y ^ 8192);
                a = (a | 0) > (r | 0) ? a : r;
                r = p;
                continue;
            }
            m = (w - r) | 0;
            $ = (s | 0) < (m | 0) ? m : s;
            y = ($ + b) | 0;
            a = (a | 0) < (y | 0) ? y : a;
            Mi(n, 32, a, y, v);
            C3(n, d, b);
            Mi(n, 48, a, y, v ^ 65536);
            Mi(n, 48, $, m, 0);
            C3(n, r, m);
            Mi(n, 32, a, y, v ^ 8192);
            r = p;
        }
        g: do if ((C | 0) == 87) if (!n) if (!h) c = 0;
        else {
            c = 1;
            while(1){
                r = u[(o + (c << 2)) >> 2] | 0;
                if (!r) break;
                C9((f + (c << 3)) | 0, r, e);
                c = (c + 1) | 0;
                if ((c | 0) >= 10) {
                    c = 1;
                    break g;
                }
            }
            while(1){
                if (u[(o + (c << 2)) >> 2] | 0) {
                    c = -1;
                    break g;
                }
                c = (c + 1) | 0;
                if ((c | 0) >= 10) {
                    c = 1;
                    break;
                }
            }
        }
        while (0)
        k = P;
        return c | 0;
    }
    function C4(n) {
        n = n | 0;
        return 0;
    }
    function C8(n) {
        n = n | 0;
        return;
    }
    function C3(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if (!(u[n >> 2] & 32)) Mw(r, e, n) | 0;
        return;
    }
    function C6(n) {
        n = n | 0;
        var r = 0, e = 0, t = 0;
        e = u[n >> 2] | 0;
        t = ((i[e >> 0] | 0) + -48) | 0;
        if (t >>> 0 < 10) {
            r = 0;
            do {
                r = (t + ((r * 10) | 0)) | 0;
                e = (e + 1) | 0;
                u[n >> 2] = e;
                t = ((i[e >> 0] | 0) + -48) | 0;
            }while (t >>> 0 < 10)
        } else r = 0;
        return r | 0;
    }
    function C9(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, f = 0.0;
        a: do if (r >>> 0 <= 20) do switch(r | 0){
            case 9:
                {
                    i = ((u[e >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    r = u[i >> 2] | 0;
                    u[e >> 2] = i + 4;
                    u[n >> 2] = r;
                    break a;
                }
            case 10:
                {
                    i = ((u[e >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    r = u[i >> 2] | 0;
                    u[e >> 2] = i + 4;
                    i = n;
                    u[i >> 2] = r;
                    u[(i + 4) >> 2] = (((r | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 11:
                {
                    i = ((u[e >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    r = u[i >> 2] | 0;
                    u[e >> 2] = i + 4;
                    i = n;
                    u[i >> 2] = r;
                    u[(i + 4) >> 2] = 0;
                    break a;
                }
            case 12:
                {
                    i = ((u[e >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    r = i;
                    t = u[r >> 2] | 0;
                    r = u[(r + 4) >> 2] | 0;
                    u[e >> 2] = i + 8;
                    i = n;
                    u[i >> 2] = t;
                    u[(i + 4) >> 2] = r;
                    break a;
                }
            case 13:
                {
                    t = ((u[e >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    i = u[t >> 2] | 0;
                    u[e >> 2] = t + 4;
                    i = ((i & 65535) << 16) >> 16;
                    t = n;
                    u[t >> 2] = i;
                    u[(t + 4) >> 2] = (((i | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 14:
                {
                    t = ((u[e >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    i = u[t >> 2] | 0;
                    u[e >> 2] = t + 4;
                    t = n;
                    u[t >> 2] = i & 65535;
                    u[(t + 4) >> 2] = 0;
                    break a;
                }
            case 15:
                {
                    t = ((u[e >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    i = u[t >> 2] | 0;
                    u[e >> 2] = t + 4;
                    i = ((i & 255) << 24) >> 24;
                    t = n;
                    u[t >> 2] = i;
                    u[(t + 4) >> 2] = (((i | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 16:
                {
                    t = ((u[e >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    i = u[t >> 2] | 0;
                    u[e >> 2] = t + 4;
                    t = n;
                    u[t >> 2] = i & 255;
                    u[(t + 4) >> 2] = 0;
                    break a;
                }
            case 17:
                {
                    t = ((u[e >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    f = +l[t >> 3];
                    u[e >> 2] = t + 8;
                    l[n >> 3] = f;
                    break a;
                }
            case 18:
                {
                    t = ((u[e >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    f = +l[t >> 3];
                    u[e >> 2] = t + 8;
                    l[n >> 3] = f;
                    break a;
                }
            default:
                break a;
        }
        while (0)
        while (0)
        return;
    }
    function C7(n, r, e, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        t = t | 0;
        if (!(((n | 0) == 0) & ((r | 0) == 0))) do {
            e = (e + -1) | 0;
            i[e >> 0] = f[(5694 + (n & 15)) >> 0] | 0 | t;
            n = MF(n | 0, r | 0, 4) | 0;
            r = x;
        }while (!(((n | 0) == 0) & ((r | 0) == 0)))
        return e | 0;
    }
    function C5(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if (!(((n | 0) == 0) & ((r | 0) == 0))) do {
            e = (e + -1) | 0;
            i[e >> 0] = (n & 7) | 48;
            n = MF(n | 0, r | 0, 3) | 0;
            r = x;
        }while (!(((n | 0) == 0) & ((r | 0) == 0)))
        return e | 0;
    }
    function Mn(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0;
        if ((r >>> 0 > 0) | (((r | 0) == 0) & (n >>> 0 > 4294967295))) {
            while(1){
                t = MQ(n | 0, r | 0, 10, 0) | 0;
                e = (e + -1) | 0;
                i[e >> 0] = (t & 255) | 48;
                t = n;
                n = MX(n | 0, r | 0, 10, 0) | 0;
                if (!((r >>> 0 > 9) | (((r | 0) == 9) & (t >>> 0 > 4294967295)))) break;
                else r = x;
            }
            r = n;
        } else r = n;
        if (r) while(1){
            e = (e + -1) | 0;
            i[e >> 0] = (r >>> 0) % 10 | 0 | 48;
            if (r >>> 0 < 10) break;
            else r = ((r >>> 0) / 10) | 0;
        }
        return e | 0;
    }
    function Mr(n) {
        n = n | 0;
        return Ms(n, u[((Mv() | 0) + 188) >> 2] | 0) | 0;
    }
    function Me(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, f = 0, o = 0, c = 0;
        o = r & 255;
        t = (e | 0) != 0;
        a: do if (t & (((n & 3) | 0) != 0)) {
            f = r & 255;
            while(1){
                if ((i[n >> 0] | 0) == (f << 24) >> 24) {
                    c = 6;
                    break a;
                }
                n = (n + 1) | 0;
                e = (e + -1) | 0;
                t = (e | 0) != 0;
                if (!(t & (((n & 3) | 0) != 0))) {
                    c = 5;
                    break;
                }
            }
        } else c = 5;
        while (0)
        if ((c | 0) == 5) if (t) c = 6;
        else e = 0;
        b: do if ((c | 0) == 6) {
            f = r & 255;
            if ((i[n >> 0] | 0) != (f << 24) >> 24) {
                t = K(o, 16843009) | 0;
                c: do if (e >>> 0 > 3) while(1){
                    o = u[n >> 2] ^ t;
                    if ((((o & -2139062144) ^ -2139062144) & (o + -16843009)) | 0) break;
                    n = (n + 4) | 0;
                    e = (e + -4) | 0;
                    if (e >>> 0 <= 3) {
                        c = 11;
                        break c;
                    }
                }
                else c = 11;
                while (0)
                if ((c | 0) == 11) if (!e) {
                    e = 0;
                    break;
                }
                while(1){
                    if ((i[n >> 0] | 0) == (f << 24) >> 24) break b;
                    n = (n + 1) | 0;
                    e = (e + -1) | 0;
                    if (!e) {
                        e = 0;
                        break;
                    }
                }
            }
        }
        while (0)
        return (e | 0 ? n : 0) | 0;
    }
    function Mi(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var u = 0, f = 0;
        f = k;
        k = (k + 256) | 0;
        u = f;
        if (((e | 0) > (i | 0)) & (((t & 73728) | 0) == 0)) {
            t = (e - i) | 0;
            Mz(u | 0, r | 0, (t >>> 0 < 256 ? t : 256) | 0) | 0;
            if (t >>> 0 > 255) {
                r = (e - i) | 0;
                do {
                    C3(n, u, 256);
                    t = (t + -256) | 0;
                }while (t >>> 0 > 255)
                t = r & 255;
            }
            C3(n, u, t);
        }
        k = f;
        return;
    }
    function Mt(n, r) {
        n = n | 0;
        r = r | 0;
        if (!n) n = 0;
        else n = Ma(n, r, 0) | 0;
        return n | 0;
    }
    function Mu(n, r, e, t, o, c) {
        n = n | 0;
        r = +r;
        e = e | 0;
        t = t | 0;
        o = o | 0;
        c = c | 0;
        var a = 0, l = 0, v = 0, s = 0, b = 0, h = 0, d = 0, w = 0.0, $ = 0, m = 0, y = 0, p = 0, C = 0, M = 0, g = 0, A = 0, I = 0, S = 0, T = 0, N = 0, L = 0, O = 0, P = 0;
        P = k;
        k = (k + 560) | 0;
        v = (P + 8) | 0;
        y = P;
        O = (P + 524) | 0;
        L = O;
        s = (P + 512) | 0;
        u[y >> 2] = 0;
        N = (s + 12) | 0;
        Mf(r) | 0;
        if ((x | 0) < 0) {
            r = -r;
            S = 1;
            I = 5659;
        } else {
            S = (((o & 2049) | 0) != 0) & 1;
            I = ((o & 2048) | 0) == 0 ? ((o & 1) | 0) == 0 ? 5660 : 5665 : 5662;
        }
        Mf(r) | 0;
        T = x & 2146435072;
        do if ((T >>> 0 < 2146435072) | (((T | 0) == 2146435072) & (0 < 0))) {
            w = +Mo(r, y) * 2.0;
            a = w != 0.0;
            if (a) u[y >> 2] = (u[y >> 2] | 0) + -1;
            C = c | 32;
            if ((C | 0) == 97) {
                $ = c & 32;
                d = ($ | 0) == 0 ? I : (I + 9) | 0;
                h = S | 2;
                a = (12 - t) | 0;
                do if (!((t >>> 0 > 11) | ((a | 0) == 0))) {
                    r = 8.0;
                    do {
                        a = (a + -1) | 0;
                        r = r * 16.0;
                    }while ((a | 0) != 0)
                    if ((i[d >> 0] | 0) == 45) {
                        r = -(r + (-w - r));
                        break;
                    } else {
                        r = w + r - r;
                        break;
                    }
                } else r = w;
                while (0)
                l = u[y >> 2] | 0;
                a = (l | 0) < 0 ? (0 - l) | 0 : l;
                a = Mn(a, (((a | 0) < 0) << 31) >> 31, N) | 0;
                if ((a | 0) == (N | 0)) {
                    a = (s + 11) | 0;
                    i[a >> 0] = 48;
                }
                i[(a + -1) >> 0] = ((l >> 31) & 2) + 43;
                b = (a + -2) | 0;
                i[b >> 0] = c + 15;
                s = (t | 0) < 1;
                v = ((o & 8) | 0) == 0;
                a = O;
                do {
                    T = ~~r;
                    l = (a + 1) | 0;
                    i[a >> 0] = f[(5694 + T) >> 0] | $;
                    r = (r - +(T | 0)) * 16.0;
                    if (((l - L) | 0) == 1 ? !(v & (s & (r == 0.0))) : 0) {
                        i[l >> 0] = 46;
                        a = (a + 2) | 0;
                    } else a = l;
                }while (r != 0.0)
                T = (a - L) | 0;
                L = (N - b) | 0;
                N = ((t | 0) != 0) & (((T + -2) | 0) < (t | 0)) ? (t + 2) | 0 : T;
                a = (L + h + N) | 0;
                Mi(n, 32, e, a, o);
                C3(n, d, h);
                Mi(n, 48, e, a, o ^ 65536);
                C3(n, O, T);
                Mi(n, 48, (N - T) | 0, 0, 0);
                C3(n, b, L);
                Mi(n, 32, e, a, o ^ 8192);
                break;
            }
            l = (t | 0) < 0 ? 6 : t;
            if (a) {
                a = ((u[y >> 2] | 0) + -28) | 0;
                u[y >> 2] = a;
                r = w * 268435456.0;
            } else {
                r = w;
                a = u[y >> 2] | 0;
            }
            T = (a | 0) < 0 ? v : (v + 288) | 0;
            v = T;
            do {
                g = ~~r >>> 0;
                u[v >> 2] = g;
                v = (v + 4) | 0;
                r = (r - +(g >>> 0)) * 1.0e9;
            }while (r != 0.0)
            if ((a | 0) > 0) {
                s = T;
                h = v;
                while(1){
                    b = (a | 0) < 29 ? a : 29;
                    a = (h + -4) | 0;
                    if (a >>> 0 >= s >>> 0) {
                        v = 0;
                        do {
                            M = MD(u[a >> 2] | 0, 0, b | 0) | 0;
                            M = Mj(M | 0, x | 0, v | 0, 0) | 0;
                            g = x;
                            p = MQ(M | 0, g | 0, 1e9, 0) | 0;
                            u[a >> 2] = p;
                            v = MX(M | 0, g | 0, 1e9, 0) | 0;
                            a = (a + -4) | 0;
                        }while (a >>> 0 >= s >>> 0)
                        if (v) {
                            s = (s + -4) | 0;
                            u[s >> 2] = v;
                        }
                    }
                    v = h;
                    while(1){
                        if (v >>> 0 <= s >>> 0) break;
                        a = (v + -4) | 0;
                        if (!(u[a >> 2] | 0)) v = a;
                        else break;
                    }
                    a = ((u[y >> 2] | 0) - b) | 0;
                    u[y >> 2] = a;
                    if ((a | 0) > 0) h = v;
                    else break;
                }
            } else s = T;
            if ((a | 0) < 0) {
                t = (((((l + 25) | 0) / 9) | 0) + 1) | 0;
                m = (C | 0) == 102;
                do {
                    $ = (0 - a) | 0;
                    $ = ($ | 0) < 9 ? $ : 9;
                    if (s >>> 0 < v >>> 0) {
                        b = ((1 << $) + -1) | 0;
                        h = 1e9 >>> $;
                        d = 0;
                        a = s;
                        do {
                            g = u[a >> 2] | 0;
                            u[a >> 2] = (g >>> $) + d;
                            d = K(g & b, h) | 0;
                            a = (a + 4) | 0;
                        }while (a >>> 0 < v >>> 0)
                        a = (u[s >> 2] | 0) == 0 ? (s + 4) | 0 : s;
                        if (!d) {
                            s = a;
                            a = v;
                        } else {
                            u[v >> 2] = d;
                            s = a;
                            a = (v + 4) | 0;
                        }
                    } else {
                        s = (u[s >> 2] | 0) == 0 ? (s + 4) | 0 : s;
                        a = v;
                    }
                    v = m ? T : s;
                    v = (((a - v) >> 2) | 0) > (t | 0) ? (v + (t << 2)) | 0 : a;
                    a = ((u[y >> 2] | 0) + $) | 0;
                    u[y >> 2] = a;
                }while ((a | 0) < 0)
                a = s;
                t = v;
            } else {
                a = s;
                t = v;
            }
            g = T;
            if (a >>> 0 < t >>> 0) {
                v = (((g - a) >> 2) * 9) | 0;
                b = u[a >> 2] | 0;
                if (b >>> 0 >= 10) {
                    s = 10;
                    do {
                        s = (s * 10) | 0;
                        v = (v + 1) | 0;
                    }while (b >>> 0 >= s >>> 0)
                }
            } else v = 0;
            m = (C | 0) == 103;
            p = (l | 0) != 0;
            s = (l - ((C | 0) != 102 ? v : 0) + (((p & m) << 31) >> 31)) | 0;
            if ((s | 0) < ((((((t - g) >> 2) * 9) | 0) + -9) | 0)) {
                s = (s + 9216) | 0;
                $ = (T + 4 + (((((s | 0) / 9) | 0) + -1024) << 2)) | 0;
                s = (((s | 0) % 9 | 0) + 1) | 0;
                if ((s | 0) < 9) {
                    b = 10;
                    do {
                        b = (b * 10) | 0;
                        s = (s + 1) | 0;
                    }while ((s | 0) != 9)
                } else b = 10;
                h = u[$ >> 2] | 0;
                d = (h >>> 0) % (b >>> 0) | 0;
                s = (($ + 4) | 0) == (t | 0);
                if (!(s & ((d | 0) == 0))) {
                    w = (((((h >>> 0) / (b >>> 0)) | 0) & 1) | 0) == 0 ? 9007199254740992.0 : 9007199254740994.0;
                    M = ((b | 0) / 2) | 0;
                    r = d >>> 0 < M >>> 0 ? 0.5 : s & ((d | 0) == (M | 0)) ? 1.0 : 1.5;
                    if (S) {
                        M = (i[I >> 0] | 0) == 45;
                        r = M ? -r : r;
                        w = M ? -w : w;
                    }
                    s = (h - d) | 0;
                    u[$ >> 2] = s;
                    if (w + r != w) {
                        M = (s + b) | 0;
                        u[$ >> 2] = M;
                        if (M >>> 0 > 999999999) {
                            v = $;
                            while(1){
                                s = (v + -4) | 0;
                                u[v >> 2] = 0;
                                if (s >>> 0 < a >>> 0) {
                                    a = (a + -4) | 0;
                                    u[a >> 2] = 0;
                                }
                                M = ((u[s >> 2] | 0) + 1) | 0;
                                u[s >> 2] = M;
                                if (M >>> 0 > 999999999) v = s;
                                else break;
                            }
                        } else s = $;
                        v = (((g - a) >> 2) * 9) | 0;
                        h = u[a >> 2] | 0;
                        if (h >>> 0 >= 10) {
                            b = 10;
                            do {
                                b = (b * 10) | 0;
                                v = (v + 1) | 0;
                            }while (h >>> 0 >= b >>> 0)
                        }
                    } else s = $;
                } else s = $;
                s = (s + 4) | 0;
                s = t >>> 0 > s >>> 0 ? s : t;
                M = a;
            } else {
                s = t;
                M = a;
            }
            C = s;
            while(1){
                if (C >>> 0 <= M >>> 0) {
                    y = 0;
                    break;
                }
                a = (C + -4) | 0;
                if (!(u[a >> 2] | 0)) C = a;
                else {
                    y = 1;
                    break;
                }
            }
            t = (0 - v) | 0;
            do if (m) {
                a = (((p ^ 1) & 1) + l) | 0;
                if (((a | 0) > (v | 0)) & ((v | 0) > -5)) {
                    b = (c + -1) | 0;
                    l = (a + -1 - v) | 0;
                } else {
                    b = (c + -2) | 0;
                    l = (a + -1) | 0;
                }
                a = o & 8;
                if (!a) {
                    if (y ? ((A = u[(C + -4) >> 2] | 0), (A | 0) != 0) : 0) {
                        if (!((A >>> 0) % 10 | 0)) {
                            s = 0;
                            a = 10;
                            do {
                                a = (a * 10) | 0;
                                s = (s + 1) | 0;
                            }while (!((A >>> 0) % (a >>> 0) | 0 | 0))
                        } else s = 0;
                    } else s = 9;
                    a = (((((C - g) >> 2) * 9) | 0) + -9) | 0;
                    if ((b | 32 | 0) == 102) {
                        $ = (a - s) | 0;
                        $ = ($ | 0) > 0 ? $ : 0;
                        l = (l | 0) < ($ | 0) ? l : $;
                        $ = 0;
                        break;
                    } else {
                        $ = (a + v - s) | 0;
                        $ = ($ | 0) > 0 ? $ : 0;
                        l = (l | 0) < ($ | 0) ? l : $;
                        $ = 0;
                        break;
                    }
                } else $ = a;
            } else {
                b = c;
                $ = o & 8;
            }
            while (0)
            m = l | $;
            h = ((m | 0) != 0) & 1;
            d = (b | 32 | 0) == 102;
            if (d) {
                p = 0;
                a = (v | 0) > 0 ? v : 0;
            } else {
                a = (v | 0) < 0 ? t : v;
                a = Mn(a, (((a | 0) < 0) << 31) >> 31, N) | 0;
                s = N;
                if (((s - a) | 0) < 2) do {
                    a = (a + -1) | 0;
                    i[a >> 0] = 48;
                }while (((s - a) | 0) < 2)
                i[(a + -1) >> 0] = ((v >> 31) & 2) + 43;
                a = (a + -2) | 0;
                i[a >> 0] = b;
                p = a;
                a = (s - a) | 0;
            }
            a = (S + 1 + l + h + a) | 0;
            Mi(n, 32, e, a, o);
            C3(n, I, S);
            Mi(n, 48, e, a, o ^ 65536);
            if (d) {
                b = M >>> 0 > T >>> 0 ? T : M;
                $ = (O + 9) | 0;
                h = $;
                d = (O + 8) | 0;
                s = b;
                do {
                    v = Mn(u[s >> 2] | 0, 0, $) | 0;
                    if ((s | 0) == (b | 0)) {
                        if ((v | 0) == ($ | 0)) {
                            i[d >> 0] = 48;
                            v = d;
                        }
                    } else if (v >>> 0 > O >>> 0) {
                        Mz(O | 0, 48, (v - L) | 0) | 0;
                        do v = (v + -1) | 0;
                        while (v >>> 0 > O >>> 0)
                    }
                    C3(n, v, (h - v) | 0);
                    s = (s + 4) | 0;
                }while (s >>> 0 <= T >>> 0)
                if (m | 0) C3(n, 5710, 1);
                if ((s >>> 0 < C >>> 0) & ((l | 0) > 0)) while(1){
                    v = Mn(u[s >> 2] | 0, 0, $) | 0;
                    if (v >>> 0 > O >>> 0) {
                        Mz(O | 0, 48, (v - L) | 0) | 0;
                        do v = (v + -1) | 0;
                        while (v >>> 0 > O >>> 0)
                    }
                    C3(n, v, (l | 0) < 9 ? l : 9);
                    s = (s + 4) | 0;
                    v = (l + -9) | 0;
                    if (!((s >>> 0 < C >>> 0) & ((l | 0) > 9))) {
                        l = v;
                        break;
                    } else l = v;
                }
                Mi(n, 48, (l + 9) | 0, 9, 0);
            } else {
                m = y ? C : (M + 4) | 0;
                if ((l | 0) > -1) {
                    y = (O + 9) | 0;
                    $ = ($ | 0) == 0;
                    t = y;
                    h = (0 - L) | 0;
                    d = (O + 8) | 0;
                    b = M;
                    do {
                        v = Mn(u[b >> 2] | 0, 0, y) | 0;
                        if ((v | 0) == (y | 0)) {
                            i[d >> 0] = 48;
                            v = d;
                        }
                        do if ((b | 0) == (M | 0)) {
                            s = (v + 1) | 0;
                            C3(n, v, 1);
                            if ($ & ((l | 0) < 1)) {
                                v = s;
                                break;
                            }
                            C3(n, 5710, 1);
                            v = s;
                        } else {
                            if (v >>> 0 <= O >>> 0) break;
                            Mz(O | 0, 48, (v + h) | 0) | 0;
                            do v = (v + -1) | 0;
                            while (v >>> 0 > O >>> 0)
                        }
                        while (0)
                        L = (t - v) | 0;
                        C3(n, v, (l | 0) > (L | 0) ? L : l);
                        l = (l - L) | 0;
                        b = (b + 4) | 0;
                    }while ((b >>> 0 < m >>> 0) & ((l | 0) > -1))
                }
                Mi(n, 48, (l + 18) | 0, 18, 0);
                C3(n, p, (N - p) | 0);
            }
            Mi(n, 32, e, a, o ^ 8192);
        } else {
            O = ((c & 32) | 0) != 0;
            a = (S + 3) | 0;
            Mi(n, 32, e, a, o & -65537);
            C3(n, I, S);
            C3(n, (r != r) | (0.0 != 0.0) ? O ? 5686 : 5690 : O ? 5678 : 5682, 3);
            Mi(n, 32, e, a, o ^ 8192);
        }
        while (0)
        k = P;
        return ((a | 0) < (e | 0) ? e : a) | 0;
    }
    function Mf(n) {
        n = +n;
        var r = 0;
        l[s >> 3] = n;
        r = u[s >> 2] | 0;
        x = u[(s + 4) >> 2] | 0;
        return r | 0;
    }
    function Mo(n, r) {
        n = +n;
        r = r | 0;
        return +(+Mc(n, r));
    }
    function Mc(n, r) {
        n = +n;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        l[s >> 3] = n;
        e = u[s >> 2] | 0;
        i = u[(s + 4) >> 2] | 0;
        t = MF(e | 0, i | 0, 52) | 0;
        switch(t & 2047){
            case 0:
                {
                    if (n != 0.0) {
                        n = +Mc(n * 18446744073709551616.0, r);
                        e = ((u[r >> 2] | 0) + -64) | 0;
                    } else e = 0;
                    u[r >> 2] = e;
                    break;
                }
            case 2047:
                break;
            default:
                {
                    u[r >> 2] = (t & 2047) + -1022;
                    u[s >> 2] = e;
                    u[(s + 4) >> 2] = (i & -2146435073) | 1071644672;
                    n = +l[s >> 3];
                }
        }
        return +n;
    }
    function Ma(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        do if (n) {
            if (r >>> 0 < 128) {
                i[n >> 0] = r;
                n = 1;
                break;
            }
            if (!(u[u[((Ml() | 0) + 188) >> 2] >> 2] | 0)) if (((r & -128) | 0) == 57216) {
                i[n >> 0] = r;
                n = 1;
                break;
            } else {
                u[(CZ() | 0) >> 2] = 84;
                n = -1;
                break;
            }
            if (r >>> 0 < 2048) {
                i[n >> 0] = (r >>> 6) | 192;
                i[(n + 1) >> 0] = (r & 63) | 128;
                n = 2;
                break;
            }
            if ((r >>> 0 < 55296) | (((r & -8192) | 0) == 57344)) {
                i[n >> 0] = (r >>> 12) | 224;
                i[(n + 1) >> 0] = ((r >>> 6) & 63) | 128;
                i[(n + 2) >> 0] = (r & 63) | 128;
                n = 3;
                break;
            }
            if (((r + -65536) | 0) >>> 0 < 1048576) {
                i[n >> 0] = (r >>> 18) | 240;
                i[(n + 1) >> 0] = ((r >>> 12) & 63) | 128;
                i[(n + 2) >> 0] = ((r >>> 6) & 63) | 128;
                i[(n + 3) >> 0] = (r & 63) | 128;
                n = 4;
                break;
            } else {
                u[(CZ() | 0) >> 2] = 84;
                n = -1;
                break;
            }
        } else n = 1;
        while (0)
        return n | 0;
    }
    function Ml() {
        return CQ() | 0;
    }
    function Mv() {
        return CQ() | 0;
    }
    function Ms(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0, t = 0;
        t = 0;
        while(1){
            if ((f[(5712 + t) >> 0] | 0) == (n | 0)) {
                n = 2;
                break;
            }
            e = (t + 1) | 0;
            if ((e | 0) == 87) {
                e = 5800;
                t = 87;
                n = 5;
                break;
            } else t = e;
        }
        if ((n | 0) == 2) if (!t) e = 5800;
        else {
            e = 5800;
            n = 5;
        }
        if ((n | 0) == 5) while(1){
            do {
                n = e;
                e = (e + 1) | 0;
            }while ((i[n >> 0] | 0) != 0)
            t = (t + -1) | 0;
            if (!t) break;
            else n = 5;
        }
        return Mb(e, u[(r + 20) >> 2] | 0) | 0;
    }
    function Mb(n, r) {
        n = n | 0;
        r = r | 0;
        return Mk(n, r) | 0;
    }
    function Mk(n, r) {
        n = n | 0;
        r = r | 0;
        if (!r) r = 0;
        else r = Mh(u[r >> 2] | 0, u[(r + 4) >> 2] | 0, n) | 0;
        return (r | 0 ? r : n) | 0;
    }
    function Mh(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, k = 0;
        k = ((u[n >> 2] | 0) + 1794895138) | 0;
        o = Md(u[(n + 8) >> 2] | 0, k) | 0;
        t = Md(u[(n + 12) >> 2] | 0, k) | 0;
        f = Md(u[(n + 16) >> 2] | 0, k) | 0;
        a: do if ((o >>> 0 < (r >>> 2) >>> 0 ? ((b = (r - (o << 2)) | 0), (t >>> 0 < b >>> 0) & (f >>> 0 < b >>> 0)) : 0) ? (((f | t) & 3) | 0) == 0 : 0) {
            b = t >>> 2;
            s = f >>> 2;
            v = 0;
            while(1){
                a = o >>> 1;
                l = (v + a) | 0;
                c = l << 1;
                f = (c + b) | 0;
                t = Md(u[(n + (f << 2)) >> 2] | 0, k) | 0;
                f = Md(u[(n + ((f + 1) << 2)) >> 2] | 0, k) | 0;
                if (!((f >>> 0 < r >>> 0) & (t >>> 0 < ((r - f) | 0) >>> 0))) {
                    t = 0;
                    break a;
                }
                if (i[(n + (f + t)) >> 0] | 0) {
                    t = 0;
                    break a;
                }
                t = C_(e, (n + f) | 0) | 0;
                if (!t) break;
                t = (t | 0) < 0;
                if ((o | 0) == 1) {
                    t = 0;
                    break a;
                } else {
                    v = t ? v : l;
                    o = t ? a : (o - a) | 0;
                }
            }
            t = (c + s) | 0;
            f = Md(u[(n + (t << 2)) >> 2] | 0, k) | 0;
            t = Md(u[(n + ((t + 1) << 2)) >> 2] | 0, k) | 0;
            if ((t >>> 0 < r >>> 0) & (f >>> 0 < ((r - t) | 0) >>> 0)) t = (i[(n + (t + f)) >> 0] | 0) == 0 ? (n + t) | 0 : 0;
            else t = 0;
        } else t = 0;
        while (0)
        return t | 0;
    }
    function Md(n, r) {
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = MV(n | 0) | 0;
        return ((r | 0) == 0 ? n : e) | 0;
    }
    function Mw(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, f = 0, o = 0, c = 0, a = 0;
        t = (e + 16) | 0;
        f = u[t >> 2] | 0;
        if (!f) {
            if (!(M$(e) | 0)) {
                f = u[t >> 2] | 0;
                o = 5;
            } else t = 0;
        } else o = 5;
        a: do if ((o | 0) == 5) {
            a = (e + 20) | 0;
            c = u[a >> 2] | 0;
            t = c;
            if (((f - c) | 0) >>> 0 < r >>> 0) {
                t = gJ[u[(e + 36) >> 2] & 7](e, n, r) | 0;
                break;
            }
            b: do if ((i[(e + 75) >> 0] | 0) > -1) {
                c = r;
                while(1){
                    if (!c) {
                        o = 0;
                        f = n;
                        break b;
                    }
                    f = (c + -1) | 0;
                    if ((i[(n + f) >> 0] | 0) == 10) break;
                    else c = f;
                }
                t = gJ[u[(e + 36) >> 2] & 7](e, n, c) | 0;
                if (t >>> 0 < c >>> 0) break a;
                o = c;
                f = (n + c) | 0;
                r = (r - c) | 0;
                t = u[a >> 2] | 0;
            } else {
                o = 0;
                f = n;
            }
            while (0)
            MK(t | 0, f | 0, r | 0) | 0;
            u[a >> 2] = (u[a >> 2] | 0) + r;
            t = (o + r) | 0;
        }
        while (0)
        return t | 0;
    }
    function M$(n) {
        n = n | 0;
        var r = 0, e = 0;
        r = (n + 74) | 0;
        e = i[r >> 0] | 0;
        i[r >> 0] = (e + 255) | e;
        r = u[n >> 2] | 0;
        if (!(r & 8)) {
            u[(n + 8) >> 2] = 0;
            u[(n + 4) >> 2] = 0;
            e = u[(n + 44) >> 2] | 0;
            u[(n + 28) >> 2] = e;
            u[(n + 20) >> 2] = e;
            u[(n + 16) >> 2] = e + (u[(n + 48) >> 2] | 0);
            n = 0;
        } else {
            u[n >> 2] = r | 32;
            n = -1;
        }
        return n | 0;
    }
    function Mm(n, r) {
        n = Z(n);
        r = Z(r);
        var e = 0, i = 0;
        e = My(n) | 0;
        do if ((e & 2147483647) >>> 0 <= 2139095040) {
            i = My(r) | 0;
            if ((i & 2147483647) >>> 0 <= 2139095040) if (((i ^ e) | 0) < 0) {
                n = (e | 0) < 0 ? r : n;
                break;
            } else {
                n = n < r ? r : n;
                break;
            }
        } else n = r;
        while (0)
        return Z(n);
    }
    function My(n) {
        n = Z(n);
        return ((a[s >> 2] = n), u[s >> 2] | 0) | 0;
    }
    function Mp(n, r) {
        n = Z(n);
        r = Z(r);
        var e = 0, i = 0;
        e = MC(n) | 0;
        do if ((e & 2147483647) >>> 0 <= 2139095040) {
            i = MC(r) | 0;
            if ((i & 2147483647) >>> 0 <= 2139095040) if (((i ^ e) | 0) < 0) {
                n = (e | 0) < 0 ? n : r;
                break;
            } else {
                n = n < r ? n : r;
                break;
            }
        } else n = r;
        while (0)
        return Z(n);
    }
    function MC(n) {
        n = Z(n);
        return ((a[s >> 2] = n), u[s >> 2] | 0) | 0;
    }
    function MM(n, r) {
        n = Z(n);
        r = Z(r);
        var e = 0, i = 0, t = 0, f = 0, o = 0, c = 0, l = 0, v = 0;
        f = ((a[s >> 2] = n), u[s >> 2] | 0);
        c = ((a[s >> 2] = r), u[s >> 2] | 0);
        e = (f >>> 23) & 255;
        o = (c >>> 23) & 255;
        l = f & -2147483648;
        t = c << 1;
        a: do if ((t | 0) != 0 ? !(((e | 0) == 255) | (((Mg(r) | 0) & 2147483647) >>> 0 > 2139095040)) : 0) {
            i = f << 1;
            if (i >>> 0 <= t >>> 0) {
                r = Z(n * Z(0.0));
                return Z((i | 0) == (t | 0) ? r : n);
            }
            if (!e) {
                e = f << 9;
                if ((e | 0) > -1) {
                    i = e;
                    e = 0;
                    do {
                        e = (e + -1) | 0;
                        i = i << 1;
                    }while ((i | 0) > -1)
                } else e = 0;
                i = f << (1 - e);
            } else i = (f & 8388607) | 8388608;
            if (!o) {
                f = c << 9;
                if ((f | 0) > -1) {
                    t = 0;
                    do {
                        t = (t + -1) | 0;
                        f = f << 1;
                    }while ((f | 0) > -1)
                } else t = 0;
                o = t;
                c = c << (1 - t);
            } else c = (c & 8388607) | 8388608;
            t = (i - c) | 0;
            f = (t | 0) > -1;
            b: do if ((e | 0) > (o | 0)) {
                while(1){
                    if (f) if (!t) break;
                    else i = t;
                    i = i << 1;
                    e = (e + -1) | 0;
                    t = (i - c) | 0;
                    f = (t | 0) > -1;
                    if ((e | 0) <= (o | 0)) break b;
                }
                r = Z(n * Z(0.0));
                break a;
            }
            while (0)
            if (f) if (!t) {
                r = Z(n * Z(0.0));
                break;
            } else i = t;
            if (i >>> 0 < 8388608) do {
                i = i << 1;
                e = (e + -1) | 0;
            }while (i >>> 0 < 8388608)
            if ((e | 0) > 0) e = (i + -8388608) | (e << 23);
            else e = i >>> ((1 - e) | 0);
            r = ((u[s >> 2] = e | l), Z(a[s >> 2]));
        } else v = 3;
        while (0)
        if ((v | 0) == 3) {
            r = Z(n * r);
            r = Z(r / r);
        }
        return Z(r);
    }
    function Mg(n) {
        n = Z(n);
        return ((a[s >> 2] = n), u[s >> 2] | 0) | 0;
    }
    function MA(n, r) {
        n = n | 0;
        r = r | 0;
        return C2(u[582] | 0, n, r) | 0;
    }
    function MI(n) {
        n = n | 0;
        nZ();
    }
    function MS(n) {
        n = n | 0;
        return;
    }
    function MT(n, r) {
        n = n | 0;
        r = r | 0;
        return 0;
    }
    function Mx(n) {
        n = n | 0;
        if ((MN((n + 4) | 0) | 0) == -1) {
            gK[u[((u[n >> 2] | 0) + 8) >> 2] & 127](n);
            n = 1;
        } else n = 0;
        return n | 0;
    }
    function MN(n) {
        n = n | 0;
        var r = 0;
        r = u[n >> 2] | 0;
        u[n >> 2] = r + -1;
        return (r + -1) | 0;
    }
    function ML(n) {
        n = n | 0;
        if (Mx(n) | 0) MO(n);
        return;
    }
    function MO(n) {
        n = n | 0;
        var r = 0;
        r = (n + 8) | 0;
        if (!((u[r >> 2] | 0) != 0 ? (MN(r) | 0) != -1 : 0)) gK[u[((u[n >> 2] | 0) + 16) >> 2] & 127](n);
        return;
    }
    function MP(n) {
        n = n | 0;
        var r = 0;
        r = (n | 0) == 0 ? 1 : n;
        while(1){
            n = Cz(r) | 0;
            if (n | 0) break;
            n = MR() | 0;
            if (!n) {
                n = 0;
                break;
            }
            g7[n & 0]();
        }
        return n | 0;
    }
    function ME(n) {
        n = n | 0;
        return MP(n) | 0;
    }
    function MG(n) {
        n = n | 0;
        CD(n);
        return;
    }
    function MB(n) {
        n = n | 0;
        if ((i[(n + 11) >> 0] | 0) < 0) MG(u[n >> 2] | 0);
        return;
    }
    function MR() {
        var n = 0;
        n = u[2923] | 0;
        u[2923] = n + 0;
        return n | 0;
    }
    function MY() {}
    function MU(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        i = (r - i - ((e >>> 0 > n >>> 0) | 0)) >>> 0;
        return ((x = i), ((n - e) >>> 0) | 0) | 0;
    }
    function Mj(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        e = (n + e) >>> 0;
        return ((x = (r + i + ((e >>> 0 < n >>> 0) | 0)) >>> 0), e | 0) | 0;
    }
    function Mz(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, f = 0, o = 0, c = 0;
        o = (n + e) | 0;
        r = r & 255;
        if ((e | 0) >= 67) {
            while(n & 3){
                i[n >> 0] = r;
                n = (n + 1) | 0;
            }
            t = (o & -4) | 0;
            f = (t - 64) | 0;
            c = r | (r << 8) | (r << 16) | (r << 24);
            while((n | 0) <= (f | 0)){
                u[n >> 2] = c;
                u[(n + 4) >> 2] = c;
                u[(n + 8) >> 2] = c;
                u[(n + 12) >> 2] = c;
                u[(n + 16) >> 2] = c;
                u[(n + 20) >> 2] = c;
                u[(n + 24) >> 2] = c;
                u[(n + 28) >> 2] = c;
                u[(n + 32) >> 2] = c;
                u[(n + 36) >> 2] = c;
                u[(n + 40) >> 2] = c;
                u[(n + 44) >> 2] = c;
                u[(n + 48) >> 2] = c;
                u[(n + 52) >> 2] = c;
                u[(n + 56) >> 2] = c;
                u[(n + 60) >> 2] = c;
                n = (n + 64) | 0;
            }
            while((n | 0) < (t | 0)){
                u[n >> 2] = c;
                n = (n + 4) | 0;
            }
        }
        while((n | 0) < (o | 0)){
            i[n >> 0] = r;
            n = (n + 1) | 0;
        }
        return (o - e) | 0;
    }
    function MD(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((e | 0) < 32) {
            x = (r << e) | ((n & (((1 << e) - 1) << (32 - e))) >>> (32 - e));
            return n << e;
        }
        x = n << (e - 32);
        return 0;
    }
    function MF(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((e | 0) < 32) {
            x = r >>> e;
            return (n >>> e) | ((r & ((1 << e) - 1)) << (32 - e));
        }
        x = 0;
        return (r >>> (e - 32)) | 0;
    }
    function MK(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0, f = 0, o = 0;
        if ((e | 0) >= 8192) return nF(n | 0, r | 0, e | 0) | 0;
        o = n | 0;
        f = (n + e) | 0;
        if ((n & 3) == (r & 3)) {
            while(n & 3){
                if (!e) return o | 0;
                i[n >> 0] = i[r >> 0] | 0;
                n = (n + 1) | 0;
                r = (r + 1) | 0;
                e = (e - 1) | 0;
            }
            e = (f & -4) | 0;
            t = (e - 64) | 0;
            while((n | 0) <= (t | 0)){
                u[n >> 2] = u[r >> 2];
                u[(n + 4) >> 2] = u[(r + 4) >> 2];
                u[(n + 8) >> 2] = u[(r + 8) >> 2];
                u[(n + 12) >> 2] = u[(r + 12) >> 2];
                u[(n + 16) >> 2] = u[(r + 16) >> 2];
                u[(n + 20) >> 2] = u[(r + 20) >> 2];
                u[(n + 24) >> 2] = u[(r + 24) >> 2];
                u[(n + 28) >> 2] = u[(r + 28) >> 2];
                u[(n + 32) >> 2] = u[(r + 32) >> 2];
                u[(n + 36) >> 2] = u[(r + 36) >> 2];
                u[(n + 40) >> 2] = u[(r + 40) >> 2];
                u[(n + 44) >> 2] = u[(r + 44) >> 2];
                u[(n + 48) >> 2] = u[(r + 48) >> 2];
                u[(n + 52) >> 2] = u[(r + 52) >> 2];
                u[(n + 56) >> 2] = u[(r + 56) >> 2];
                u[(n + 60) >> 2] = u[(r + 60) >> 2];
                n = (n + 64) | 0;
                r = (r + 64) | 0;
            }
            while((n | 0) < (e | 0)){
                u[n >> 2] = u[r >> 2];
                n = (n + 4) | 0;
                r = (r + 4) | 0;
            }
        } else {
            e = (f - 4) | 0;
            while((n | 0) < (e | 0)){
                i[n >> 0] = i[r >> 0] | 0;
                i[(n + 1) >> 0] = i[(r + 1) >> 0] | 0;
                i[(n + 2) >> 0] = i[(r + 2) >> 0] | 0;
                i[(n + 3) >> 0] = i[(r + 3) >> 0] | 0;
                n = (n + 4) | 0;
                r = (r + 4) | 0;
            }
        }
        while((n | 0) < (f | 0)){
            i[n >> 0] = i[r >> 0] | 0;
            n = (n + 1) | 0;
            r = (r + 1) | 0;
        }
        return o | 0;
    }
    function Mq(n) {
        n = n | 0;
        var r = 0;
        r = i[(d + (n & 255)) >> 0] | 0;
        if ((r | 0) < 8) return r | 0;
        r = i[(d + ((n >> 8) & 255)) >> 0] | 0;
        if ((r | 0) < 8) return (r + 8) | 0;
        r = i[(d + ((n >> 16) & 255)) >> 0] | 0;
        if ((r | 0) < 8) return (r + 16) | 0;
        return ((i[(d + (n >>> 24)) >> 0] | 0) + 24) | 0;
    }
    function MH(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0, k = 0, h = 0;
        v = n;
        a = r;
        l = a;
        o = e;
        b = i;
        c = b;
        if (!l) {
            f = (t | 0) != 0;
            if (!c) {
                if (f) {
                    u[t >> 2] = (v >>> 0) % (o >>> 0);
                    u[(t + 4) >> 2] = 0;
                }
                b = 0;
                t = ((v >>> 0) / (o >>> 0)) >>> 0;
                return ((x = b), t) | 0;
            } else {
                if (!f) {
                    b = 0;
                    t = 0;
                    return ((x = b), t) | 0;
                }
                u[t >> 2] = n | 0;
                u[(t + 4) >> 2] = r & 0;
                b = 0;
                t = 0;
                return ((x = b), t) | 0;
            }
        }
        f = (c | 0) == 0;
        do if (o) {
            if (!f) {
                f = ((X(c | 0) | 0) - (X(l | 0) | 0)) | 0;
                if (f >>> 0 <= 31) {
                    s = (f + 1) | 0;
                    c = (31 - f) | 0;
                    r = (f - 31) >> 31;
                    o = s;
                    n = ((v >>> (s >>> 0)) & r) | (l << c);
                    r = (l >>> (s >>> 0)) & r;
                    f = 0;
                    c = v << c;
                    break;
                }
                if (!t) {
                    b = 0;
                    t = 0;
                    return ((x = b), t) | 0;
                }
                u[t >> 2] = n | 0;
                u[(t + 4) >> 2] = a | (r & 0);
                b = 0;
                t = 0;
                return ((x = b), t) | 0;
            }
            f = (o - 1) | 0;
            if ((f & o) | 0) {
                c = ((X(o | 0) | 0) + 33 - (X(l | 0) | 0)) | 0;
                h = (64 - c) | 0;
                s = (32 - c) | 0;
                a = s >> 31;
                k = (c - 32) | 0;
                r = k >> 31;
                o = c;
                n = (((s - 1) >> 31) & (l >>> (k >>> 0))) | (((l << s) | (v >>> (c >>> 0))) & r);
                r = r & (l >>> (c >>> 0));
                f = (v << h) & a;
                c = (((l << h) | (v >>> (k >>> 0))) & a) | ((v << s) & ((c - 33) >> 31));
                break;
            }
            if (t | 0) {
                u[t >> 2] = f & v;
                u[(t + 4) >> 2] = 0;
            }
            if ((o | 0) == 1) {
                k = a | (r & 0);
                h = n | 0 | 0;
                return ((x = k), h) | 0;
            } else {
                h = Mq(o | 0) | 0;
                k = (l >>> (h >>> 0)) | 0;
                h = (l << (32 - h)) | (v >>> (h >>> 0)) | 0;
                return ((x = k), h) | 0;
            }
        } else {
            if (f) {
                if (t | 0) {
                    u[t >> 2] = (l >>> 0) % (o >>> 0);
                    u[(t + 4) >> 2] = 0;
                }
                k = 0;
                h = ((l >>> 0) / (o >>> 0)) >>> 0;
                return ((x = k), h) | 0;
            }
            if (!v) {
                if (t | 0) {
                    u[t >> 2] = 0;
                    u[(t + 4) >> 2] = (l >>> 0) % (c >>> 0);
                }
                k = 0;
                h = ((l >>> 0) / (c >>> 0)) >>> 0;
                return ((x = k), h) | 0;
            }
            f = (c - 1) | 0;
            if (!(f & c)) {
                if (t | 0) {
                    u[t >> 2] = n | 0;
                    u[(t + 4) >> 2] = (f & l) | (r & 0);
                }
                k = 0;
                h = l >>> ((Mq(c | 0) | 0) >>> 0);
                return ((x = k), h) | 0;
            }
            f = ((X(c | 0) | 0) - (X(l | 0) | 0)) | 0;
            if (f >>> 0 <= 30) {
                r = (f + 1) | 0;
                c = (31 - f) | 0;
                o = r;
                n = (l << c) | (v >>> (r >>> 0));
                r = l >>> (r >>> 0);
                f = 0;
                c = v << c;
                break;
            }
            if (!t) {
                k = 0;
                h = 0;
                return ((x = k), h) | 0;
            }
            u[t >> 2] = n | 0;
            u[(t + 4) >> 2] = a | (r & 0);
            k = 0;
            h = 0;
            return ((x = k), h) | 0;
        }
        while (0)
        if (!o) {
            l = c;
            a = 0;
            c = 0;
        } else {
            s = e | 0 | 0;
            v = b | (i & 0);
            l = Mj(s | 0, v | 0, -1, -1) | 0;
            e = x;
            a = c;
            c = 0;
            do {
                i = a;
                a = (f >>> 31) | (a << 1);
                f = c | (f << 1);
                i = (n << 1) | (i >>> 31) | 0;
                b = (n >>> 31) | (r << 1) | 0;
                MU(l | 0, e | 0, i | 0, b | 0) | 0;
                h = x;
                k = (h >> 31) | (((h | 0) < 0 ? -1 : 0) << 1);
                c = k & 1;
                n = MU(i | 0, b | 0, (k & s) | 0, (((((h | 0) < 0 ? -1 : 0) >> 31) | (((h | 0) < 0 ? -1 : 0) << 1)) & v) | 0) | 0;
                r = x;
                o = (o - 1) | 0;
            }while ((o | 0) != 0)
            l = a;
            a = 0;
        }
        o = 0;
        if (t | 0) {
            u[t >> 2] = n;
            u[(t + 4) >> 2] = r;
        }
        k = ((f | 0) >>> 31) | ((l | o) << 1) | (((o << 1) | (f >>> 31)) & 0) | a;
        h = (((f << 1) | (0 >>> 31)) & -2) | c;
        return ((x = k), h) | 0;
    }
    function MX(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        return MH(n, r, e, i, 0) | 0;
    }
    function MZ(n) {
        n = n | 0;
        var r = 0, e = 0;
        e = ((n + 15) & -16) | 0;
        r = u[v >> 2] | 0;
        n = (r + e) | 0;
        if ((((e | 0) > 0) & ((n | 0) < (r | 0))) | ((n | 0) < 0)) {
            _() | 0;
            nq(12);
            return -1;
        }
        u[v >> 2] = n;
        if ((n | 0) > (W() | 0) ? (V() | 0) == 0 : 0) {
            u[v >> 2] = r;
            nq(12);
            return -1;
        }
        return r | 0;
    }
    function MJ(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var t = 0;
        if (((r | 0) < (n | 0)) & ((n | 0) < ((r + e) | 0))) {
            t = n;
            r = (r + e) | 0;
            n = (n + e) | 0;
            while((e | 0) > 0){
                n = (n - 1) | 0;
                r = (r - 1) | 0;
                e = (e - 1) | 0;
                i[n >> 0] = i[r >> 0] | 0;
            }
            n = t;
        } else MK(n, r, e) | 0;
        return n | 0;
    }
    function MQ(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, f = 0;
        f = k;
        k = (k + 16) | 0;
        t = f | 0;
        MH(n, r, e, i, t) | 0;
        k = f;
        return ((x = u[(t + 4) >> 2] | 0), u[t >> 2] | 0) | 0;
    }
    function MV(n) {
        n = n | 0;
        return (((n & 255) << 24) | (((n >> 8) & 255) << 16) | (((n >> 16) & 255) << 8) | (n >>> 24) | 0);
    }
    function MW(n, r, e, i, t, u) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        u = u | 0;
        gj[n & 1](r | 0, e | 0, i | 0, t | 0, u | 0);
    }
    function M_(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        gz[n & 1](r | 0, Z(e));
    }
    function M0(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        gD[n & 31](r | 0, +e);
    }
    function M2(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        i = Z(i);
        return Z(gF[n & 0](r | 0, Z(e), Z(i)));
    }
    function M1(n, r) {
        n = n | 0;
        r = r | 0;
        gK[n & 127](r | 0);
    }
    function M4(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        gq[n & 31](r | 0, e | 0);
    }
    function M8(n, r) {
        n = n | 0;
        r = r | 0;
        return gH[n & 31](r | 0) | 0;
    }
    function M3(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = +e;
        i = +i;
        t = t | 0;
        gX[n & 1](r | 0, +e, +i, t | 0);
    }
    function M6(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = +e;
        i = +i;
        gZ[n & 1](r | 0, +e, +i);
    }
    function M9(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        return gJ[n & 7](r | 0, e | 0, i | 0) | 0;
    }
    function M7(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        return +gQ[n & 1](r | 0, e | 0, i | 0);
    }
    function M5(n, r) {
        n = n | 0;
        r = r | 0;
        return +gV[n & 15](r | 0);
    }
    function gn(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        return gW[n & 1](r | 0, +e) | 0;
    }
    function gr(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        return g_[n & 15](r | 0, e | 0) | 0;
    }
    function ge(n, r, e, i, t, u) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = +i;
        t = +t;
        u = u | 0;
        g0[n & 1](r | 0, e | 0, +i, +t, u | 0);
    }
    function gi(n, r, e, i, t, u, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        u = u | 0;
        f = f | 0;
        g2[n & 1](r | 0, e | 0, i | 0, t | 0, u | 0, f | 0);
    }
    function gt(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        return +g1[n & 7](r | 0, e | 0);
    }
    function gu(n) {
        n = n | 0;
        return g4[n & 7]() | 0;
    }
    function gf(n, r, e, i, t, u) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        u = u | 0;
        return g8[n & 1](r | 0, e | 0, i | 0, t | 0, u | 0) | 0;
    }
    function go(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = +t;
        g3[n & 1](r | 0, e | 0, i | 0, +t);
    }
    function gc(n, r, e, i, t, u, f) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = Z(i);
        t = t | 0;
        u = Z(u);
        f = f | 0;
        g6[n & 1](r | 0, e | 0, Z(i), t | 0, Z(u), f | 0);
    }
    function ga(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        g9[n & 15](r | 0, e | 0, i | 0);
    }
    function gl(n) {
        n = n | 0;
        g7[n & 0]();
    }
    function gv(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = +i;
        g5[n & 15](r | 0, e | 0, +i);
    }
    function gs(n, r, e) {
        n = n | 0;
        r = +r;
        e = +e;
        return An[n & 1](+r, +e) | 0;
    }
    function gb(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        Ar[n & 15](r | 0, e | 0, i | 0, t | 0);
    }
    function gk(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        J(0);
    }
    function gh(n, r) {
        n = n | 0;
        r = Z(r);
        J(1);
    }
    function gd(n, r) {
        n = n | 0;
        r = +r;
        J(2);
    }
    function gw(n, r, e) {
        n = n | 0;
        r = Z(r);
        e = Z(e);
        J(3);
        return rr;
    }
    function g$(n) {
        n = n | 0;
        J(4);
    }
    function gm(n, r) {
        n = n | 0;
        r = r | 0;
        J(5);
    }
    function gy(n) {
        n = n | 0;
        J(6);
        return 0;
    }
    function gp(n, r, e, i) {
        n = n | 0;
        r = +r;
        e = +e;
        i = i | 0;
        J(7);
    }
    function gC(n, r, e) {
        n = n | 0;
        r = +r;
        e = +e;
        J(8);
    }
    function gM(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        J(9);
        return 0;
    }
    function gg(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        J(10);
        return 0.0;
    }
    function gA(n) {
        n = n | 0;
        J(11);
        return 0.0;
    }
    function gI(n, r) {
        n = n | 0;
        r = +r;
        J(12);
        return 0;
    }
    function gS(n, r) {
        n = n | 0;
        r = r | 0;
        J(13);
        return 0;
    }
    function gT(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = +e;
        i = +i;
        t = t | 0;
        J(14);
    }
    function gx(n, r, e, i, t, u) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        u = u | 0;
        J(15);
    }
    function gN(n, r) {
        n = n | 0;
        r = r | 0;
        J(16);
        return 0.0;
    }
    function gL() {
        J(17);
        return 0;
    }
    function gO(n, r, e, i, t) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        J(18);
        return 0;
    }
    function gP(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = +i;
        J(19);
    }
    function gE(n, r, e, i, t, u) {
        n = n | 0;
        r = r | 0;
        e = Z(e);
        i = i | 0;
        t = Z(t);
        u = u | 0;
        J(20);
    }
    function gG(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        J(21);
    }
    function gB() {
        J(22);
    }
    function gR(n, r, e) {
        n = n | 0;
        r = r | 0;
        e = +e;
        J(23);
    }
    function gY(n, r) {
        n = +n;
        r = +r;
        J(24);
        return 0;
    }
    function gU(n, r, e, i) {
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        J(25);
    }
    var gj = [
        gk,
        $3
    ];
    var gz = [
        gh,
        tf
    ];
    var gD = [
        gd,
        tO,
        tP,
        tE,
        tG,
        tB,
        tR,
        tY,
        tj,
        tz,
        tF,
        tK,
        tq,
        tH,
        tX,
        tZ,
        tJ,
        tQ,
        tV,
        gd,
        gd,
        gd,
        gd,
        gd,
        gd,
        gd,
        gd,
        gd,
        gd,
        gd,
        gd,
        gd, 
    ];
    var gF = [
        gw
    ];
    var gK = [
        g$,
        MS,
        f7,
        f5,
        on,
        l1,
        l4,
        l8,
        wl,
        wv,
        ws,
        $z,
        $D,
        $F,
        Ce,
        Ci,
        Ct,
        rl,
        tv,
        td,
        tU,
        tD,
        uF,
        uK,
        fF,
        oc,
        oI,
        oV,
        co,
        cL,
        c0,
        aa,
        ax,
        aV,
        lf,
        lA,
        lK,
        vk,
        vP,
        vW,
        so,
        sI,
        sq,
        bi,
        bp,
        bY,
        b3,
        ti,
        kL,
        kQ,
        hc,
        hx,
        hX,
        df,
        dm,
        dC,
        dD,
        dq,
        d5,
        wh,
        w$,
        wY,
        w3,
        oa,
        m1,
        yx,
        yX,
        pr,
        pI,
        pK,
        p1,
        p3,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$,
        g$, 
    ];
    var gq = [
        gm,
        tw,
        t$,
        tp,
        tC,
        tM,
        tg,
        tA,
        tI,
        tx,
        tN,
        tL,
        ut,
        uo,
        uc,
        ua,
        ul,
        uv,
        us,
        uw,
        up,
        u_,
        bo,
        bg,
        hP,
        m3,
        $i,
        yd,
        gm,
        gm,
        gm,
        gm, 
    ];
    var gH = [
        gy,
        CK,
        tl,
        t2,
        t3,
        t6,
        t9,
        t7,
        t5,
        un,
        ue,
        ui,
        u$,
        um,
        uq,
        b7,
        hV,
        wz,
        yn,
        ye,
        gy,
        gy,
        gy,
        gy,
        gy,
        gy,
        gy,
        gy,
        gy,
        gy,
        gy,
        gy, 
    ];
    var gX = [
        gp,
        uH
    ];
    var gZ = [
        gC,
        we
    ];
    var gJ = [
        gM,
        Cq,
        CH,
        CW,
        cG,
        v$,
        kG,
        pu
    ];
    var gQ = [
        gg,
        ll
    ];
    var gV = [
        gA,
        uu,
        uf,
        ub,
        uX,
        uZ,
        uJ,
        uQ,
        uV,
        uW,
        gA,
        gA,
        gA,
        gA,
        gA,
        gA
    ];
    var gW = [
        gI,
        dh
    ];
    var g_ = [
        gS,
        MT,
        uy,
        fJ,
        o2,
        c8,
        ab,
        lZ,
        vR,
        bD,
        to,
        yV,
        gS,
        gS,
        gS,
        gS
    ];
    var g0 = [
        gT,
        oN
    ];
    var g2 = [
        gx,
        pN
    ];
    var g1 = [
        gN,
        uk,
        u0,
        u2,
        u1,
        lx,
        gN,
        gN
    ];
    var g4 = [
        gL,
        u4,
        tc,
        tr,
        dS,
        dJ,
        wM,
        p5
    ];
    var g8 = [
        gO,
        io
    ];
    var g3 = [
        gP,
        sv
    ];
    var g6 = [
        gE,
        uM
    ];
    var g9 = [
        gG,
        t1,
        ur,
        uh,
        ud,
        cv,
        aP,
        sN,
        sJ,
        tu,
        mg,
        yP,
        pZ,
        gG,
        gG,
        gG
    ];
    var g7 = [
        gB
    ];
    var g5 = [
        gR,
        tm,
        ty,
        tS,
        tT,
        tW,
        t_,
        t0,
        v1,
        k0,
        dl,
        gR,
        gR,
        gR,
        gR,
        gR
    ];
    var An = [
        gY,
        wo
    ];
    var Ar = [
        gU,
        a2,
        kf,
        hs,
        h6,
        dP,
        d2,
        wN,
        $n,
        yo,
        Cl,
        gU,
        gU,
        gU,
        gU,
        gU
    ];
    return {
        _llvm_bswap_i32: MV,
        dynCall_idd: gs,
        dynCall_i: gu,
        _i64Subtract: MU,
        ___udivdi3: MX,
        dynCall_vif: M_,
        setThrew: rf,
        dynCall_viii: ga,
        _bitshift64Lshr: MF,
        _bitshift64Shl: MD,
        dynCall_vi: M1,
        dynCall_viiddi: ge,
        dynCall_diii: M7,
        dynCall_iii: gr,
        _memset: Mz,
        _sbrk: MZ,
        _memcpy: MK,
        __GLOBAL__sub_I_Yoga_cpp: tn,
        dynCall_vii: M4,
        ___uremdi3: MQ,
        dynCall_vid: M0,
        stackAlloc: re,
        _nbind_init: CA,
        getTempRet0: rc,
        dynCall_di: M5,
        dynCall_iid: gn,
        setTempRet0: ro,
        _i64Add: Mj,
        dynCall_fiff: M2,
        dynCall_iiii: M9,
        _emscripten_get_global_libc: CF,
        dynCall_viid: gv,
        dynCall_viiid: go,
        dynCall_viififi: gc,
        dynCall_ii: M8,
        __GLOBAL__sub_I_Binding_cc: mX,
        dynCall_viiii: gb,
        dynCall_iiiiii: gf,
        stackSave: ri,
        dynCall_viiiii: MW,
        __GLOBAL__sub_I_nbind_cc: u8,
        dynCall_vidd: M6,
        _free: CD,
        runPostSets: MY,
        dynCall_viiiiii: gi,
        establishStackSpace: ru,
        _memmove: MJ,
        stackRestore: rt,
        _malloc: Cz,
        __GLOBAL__sub_I_common_cc: wQ,
        dynCall_viddi: M3,
        dynCall_dii: gt,
        dynCall_v: gl
    };
}
