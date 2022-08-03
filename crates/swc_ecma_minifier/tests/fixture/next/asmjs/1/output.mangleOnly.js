export function foo($, n, r) {
    "use asm";
    var e = new $.Int8Array(r);
    var i = new $.Int16Array(r);
    var _ = new $.Int32Array(r);
    var t = new $.Uint8Array(r);
    var u = new $.Uint16Array(r);
    var f = new $.Uint32Array(r);
    var o = new $.Float32Array(r);
    var c = new $.Float64Array(r);
    var a = n.DYNAMICTOP_PTR | 0;
    var l = n.tempDoublePtr | 0;
    var v = n.ABORT | 0;
    var s = n.STACKTOP | 0;
    var b = n.STACK_MAX | 0;
    var k = n.cttz_i8 | 0;
    var h = n.___dso_handle | 0;
    var d = 0;
    var w = 0;
    var m = 0;
    var y = 0;
    var p = $.NaN, C = $.Infinity;
    var M = 0, g = 0, A = 0, I = 0, S = 0.0;
    var T = 0;
    var x = $.Math.floor;
    var N = $.Math.abs;
    var L = $.Math.sqrt;
    var O = $.Math.pow;
    var P = $.Math.cos;
    var E = $.Math.sin;
    var G = $.Math.tan;
    var B = $.Math.acos;
    var R = $.Math.asin;
    var Y = $.Math.atan;
    var U = $.Math.atan2;
    var j = $.Math.exp;
    var z = $.Math.log;
    var D = $.Math.ceil;
    var F = $.Math.imul;
    var K = $.Math.min;
    var q = $.Math.max;
    var H = $.Math.clz32;
    var X = $.Math.fround;
    var Z = n.abort;
    var J = n.assert;
    var Q = n.enlargeMemory;
    var V = n.getTotalMemory;
    var W = n.abortOnCannotGrowMemory;
    var $$ = n.invoke_viiiii;
    var $0 = n.invoke_vif;
    var $n = n.invoke_vid;
    var $r = n.invoke_fiff;
    var $e = n.invoke_vi;
    var $i = n.invoke_vii;
    var $_ = n.invoke_ii;
    var $t = n.invoke_viddi;
    var $2 = n.invoke_vidd;
    var $u = n.invoke_iiii;
    var $f = n.invoke_diii;
    var $o = n.invoke_di;
    var $c = n.invoke_iid;
    var $6 = n.invoke_iii;
    var $a = n.invoke_viiddi;
    var $1 = n.invoke_viiiiii;
    var $4 = n.invoke_dii;
    var $l = n.invoke_i;
    var $v = n.invoke_iiiiii;
    var $7 = n.invoke_viiid;
    var $5 = n.invoke_viififi;
    var $s = n.invoke_viii;
    var $3 = n.invoke_v;
    var $b = n.invoke_viid;
    var $k = n.invoke_idd;
    var $h = n.invoke_viiii;
    var $d = n._emscripten_asm_const_iiiii;
    var $w = n._emscripten_asm_const_iiidddddd;
    var $8 = n._emscripten_asm_const_iiiid;
    var $m = n.__nbind_reference_external;
    var $y = n._emscripten_asm_const_iiiiiiii;
    var $p = n._removeAccessorPrefix;
    var $C = n._typeModule;
    var $M = n.__nbind_register_pool;
    var $g = n.__decorate;
    var $A = n._llvm_stackrestore;
    var $I = n.___cxa_atexit;
    var $S = n.__extends;
    var $T = n.__nbind_get_value_object;
    var $x = n.__ZN8facebook4yoga14YGNodeToStringEPNSt3__212basic_stringIcNS1_11char_traitsIcEENS1_9allocatorIcEEEEP6YGNode14YGPrintOptionsj;
    var $N = n._emscripten_set_main_loop_timing;
    var $L = n.__nbind_register_primitive;
    var $O = n.__nbind_register_type;
    var $P = n._emscripten_memcpy_big;
    var $E = n.__nbind_register_function;
    var $G = n.___setErrNo;
    var $B = n.__nbind_register_class;
    var $R = n.__nbind_finish;
    var $Y = n._abort;
    var $U = n._nbind_value;
    var $j = n._llvm_stacksave;
    var $z = n.___syscall54;
    var $D = n._defineHidden;
    var $F = n._emscripten_set_main_loop;
    var $K = n._emscripten_get_now;
    var $q = n.__nbind_register_callback_signature;
    var $H = n._emscripten_asm_const_iiiiii;
    var $X = n.__nbind_free_external;
    var $Z = n._emscripten_asm_const_iiii;
    var $J = n._emscripten_asm_const_iiididi;
    var $Q = n.___syscall6;
    var $V = n._atexit;
    var $W = n.___syscall140;
    var $9 = n.___syscall146;
    var n$ = X(0);
    const n0 = X(0);
    function nn($) {
        $ = $ | 0;
        var n = 0;
        n = s;
        s = (s + $) | 0;
        s = (s + 15) & -16;
        return n | 0;
    }
    function nr() {
        return s | 0;
    }
    function ne($) {
        $ = $ | 0;
        s = $;
    }
    function ni($, n) {
        $ = $ | 0;
        n = n | 0;
        s = $;
        b = n;
    }
    function n_($, n) {
        $ = $ | 0;
        n = n | 0;
        if (!d) {
            d = $;
            w = n;
        }
    }
    function nt($) {
        $ = $ | 0;
        T = $;
    }
    function n2() {
        return T | 0;
    }
    function nu() {
        var $ = 0, n = 0;
        CE(8104, 8, 400) | 0;
        CE(8504, 408, 540) | 0;
        $ = 9044;
        n = ($ + 44) | 0;
        do {
            _[$ >> 2] = 0;
            $ = ($ + 4) | 0;
        }while (($ | 0) < (n | 0))
        e[9088] = 0;
        e[9089] = 1;
        _[2273] = 0;
        _[2274] = 948;
        _[2275] = 948;
        $I(17, 8104, h | 0) | 0;
        return;
    }
    function nf($) {
        $ = $ | 0;
        nA(($ + 948) | 0);
        return;
    }
    function no($) {
        $ = X($);
        return (((eq($) | 0) & 2147483647) >>> 0 > 2139095040) | 0;
    }
    function nc($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        a: do if (!(_[($ + (n << 3) + 4) >> 2] | 0)) {
            if ((n | 2 | 0) == 3 ? _[($ + 60) >> 2] | 0 : 0) {
                $ = ($ + 56) | 0;
                break;
            }
            switch(n | 0){
                case 0:
                case 2:
                case 4:
                case 5:
                    {
                        if (_[($ + 52) >> 2] | 0) {
                            $ = ($ + 48) | 0;
                            break a;
                        }
                        break;
                    }
                default:
                    {}
            }
            if (!(_[($ + 68) >> 2] | 0)) {
                $ = (n | 1 | 0) == 5 ? 948 : r;
                break;
            } else {
                $ = ($ + 64) | 0;
                break;
            }
        } else $ = ($ + (n << 3)) | 0;
        while (0)
        return $ | 0;
    }
    function n6($) {
        $ = $ | 0;
        var n = 0;
        n = pL(1e3) | 0;
        na($, (n | 0) != 0, 2456);
        _[2276] = (_[2276] | 0) + 1;
        CE(n | 0, 8104, 1e3) | 0;
        if (e[($ + 2) >> 0] | 0) {
            _[(n + 4) >> 2] = 2;
            _[(n + 12) >> 2] = 4;
        }
        _[(n + 976) >> 2] = $;
        return n | 0;
    }
    function na($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = s;
        s = (s + 16) | 0;
        e = i;
        if (!n) {
            _[e >> 2] = r;
            e_($, 5, 3197, e);
        }
        s = i;
        return;
    }
    function n1() {
        return n6(956) | 0;
    }
    function n4($) {
        $ = $ | 0;
        var n = 0;
        n = CM(1e3) | 0;
        nl(n, $);
        na(_[($ + 976) >> 2] | 0, 1, 2456);
        _[2276] = (_[2276] | 0) + 1;
        _[(n + 944) >> 2] = 0;
        return n | 0;
    }
    function nl($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        CE($ | 0, n | 0, 948) | 0;
        eu(($ + 948) | 0, (n + 948) | 0);
        r = ($ + 960) | 0;
        $ = (n + 960) | 0;
        n = (r + 40) | 0;
        do {
            _[r >> 2] = _[$ >> 2];
            r = (r + 4) | 0;
            $ = ($ + 4) | 0;
        }while ((r | 0) < (n | 0))
        return;
    }
    function nv($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0;
        n = ($ + 944) | 0;
        r = _[n >> 2] | 0;
        if (r | 0) {
            n7((r + 948) | 0, $) | 0;
            _[n >> 2] = 0;
        }
        r = n5($) | 0;
        if (r | 0) {
            n = 0;
            do {
                _[((ns($, n) | 0) + 944) >> 2] = 0;
                n = (n + 1) | 0;
            }while ((n | 0) != (r | 0))
        }
        r = ($ + 948) | 0;
        e = _[r >> 2] | 0;
        i = ($ + 952) | 0;
        n = _[i >> 2] | 0;
        if ((n | 0) != (e | 0)) _[i >> 2] = n + (~(((n + -4 - e) | 0) >>> 2) << 2);
        n3(r);
        pO($);
        _[2276] = (_[2276] | 0) + -1;
        return;
    }
    function n7($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0;
        e = _[$ >> 2] | 0;
        f = ($ + 4) | 0;
        r = _[f >> 2] | 0;
        t = r;
        a: do if ((e | 0) == (r | 0)) {
            i = e;
            u = 4;
        } else {
            $ = e;
            while(1){
                if ((_[$ >> 2] | 0) == (n | 0)) {
                    i = $;
                    u = 4;
                    break a;
                }
                $ = ($ + 4) | 0;
                if (($ | 0) == (r | 0)) {
                    $ = 0;
                    break;
                }
            }
        }
        while (0)
        if ((u | 0) == 4) if ((i | 0) != (r | 0)) {
            e = (i + 4) | 0;
            $ = (t - e) | 0;
            n = $ >> 2;
            if (n) {
                CU(i | 0, e | 0, $ | 0) | 0;
                r = _[f >> 2] | 0;
            }
            $ = (i + (n << 2)) | 0;
            if ((r | 0) == ($ | 0)) $ = 1;
            else {
                _[f >> 2] = r + (~(((r + -4 - $) | 0) >>> 2) << 2);
                $ = 1;
            }
        } else $ = 0;
        return $ | 0;
    }
    function n5($) {
        $ = $ | 0;
        return (((_[($ + 952) >> 2] | 0) - (_[($ + 948) >> 2] | 0)) >> 2) | 0;
    }
    function ns($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = _[($ + 948) >> 2] | 0;
        if ((((_[($ + 952) >> 2] | 0) - r) >> 2) >>> 0 > n >>> 0) $ = _[(r + (n << 2)) >> 2] | 0;
        else $ = 0;
        return $ | 0;
    }
    function n3($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0;
        e = s;
        s = (s + 32) | 0;
        n = e;
        i = _[$ >> 2] | 0;
        r = ((_[($ + 4) >> 2] | 0) - i) | 0;
        if ((((_[($ + 8) >> 2] | 0) - i) | 0) >>> 0 > r >>> 0) {
            i = r >> 2;
            eH(n, i, i, ($ + 8) | 0);
            eX($, n);
            eZ(n);
        }
        s = e;
        return;
    }
    function nb($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0;
        c = n5($) | 0;
        do if (c | 0) {
            if ((_[((ns($, 0) | 0) + 944) >> 2] | 0) == ($ | 0)) {
                if (!(n7(($ + 948) | 0, n) | 0)) break;
                CE((n + 400) | 0, 8504, 540) | 0;
                _[(n + 944) >> 2] = 0;
                ng($);
                break;
            }
            u = _[((_[($ + 976) >> 2] | 0) + 12) >> 2] | 0;
            f = ($ + 948) | 0;
            o = (u | 0) == 0;
            r = 0;
            t = 0;
            do {
                e = _[((_[f >> 2] | 0) + (t << 2)) >> 2] | 0;
                if ((e | 0) == (n | 0)) ng($);
                else {
                    i = n4(e) | 0;
                    _[((_[f >> 2] | 0) + (r << 2)) >> 2] = i;
                    _[(i + 944) >> 2] = $;
                    if (!o) g0[u & 15](e, i, $, r);
                    r = (r + 1) | 0;
                }
                t = (t + 1) | 0;
            }while ((t | 0) != (c | 0))
            if (r >>> 0 < c >>> 0) {
                o = ($ + 948) | 0;
                f = ($ + 952) | 0;
                u = r;
                r = _[f >> 2] | 0;
                do {
                    t = ((_[o >> 2] | 0) + (u << 2)) | 0;
                    e = (t + 4) | 0;
                    i = (r - e) | 0;
                    n = i >> 2;
                    if (!n) i = r;
                    else {
                        CU(t | 0, e | 0, i | 0) | 0;
                        r = _[f >> 2] | 0;
                        i = r;
                    }
                    e = (t + (n << 2)) | 0;
                    if ((i | 0) != (e | 0)) {
                        r = (i + (~(((i + -4 - e) | 0) >>> 2) << 2)) | 0;
                        _[f >> 2] = r;
                    }
                    u = (u + 1) | 0;
                }while ((u | 0) != (c | 0))
            }
        }
        while (0)
        return;
    }
    function nk($) {
        $ = $ | 0;
        var n = 0, r = 0, i = 0, t = 0;
        nh($, (n5($) | 0) == 0, 2491);
        nh($, (_[($ + 944) >> 2] | 0) == 0, 2545);
        n = ($ + 948) | 0;
        r = _[n >> 2] | 0;
        i = ($ + 952) | 0;
        t = _[i >> 2] | 0;
        if ((t | 0) != (r | 0)) _[i >> 2] = t + (~(((t + -4 - r) | 0) >>> 2) << 2);
        n3(n);
        n = ($ + 976) | 0;
        r = _[n >> 2] | 0;
        CE($ | 0, 8104, 1e3) | 0;
        if (e[(r + 2) >> 0] | 0) {
            _[($ + 4) >> 2] = 2;
            _[($ + 12) >> 2] = 4;
        }
        _[n >> 2] = r;
        return;
    }
    function nh($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        i = s;
        s = (s + 16) | 0;
        e = i;
        if (!n) {
            _[e >> 2] = r;
            rZ($, 5, 3197, e);
        }
        s = i;
        return;
    }
    function nd() {
        return _[2276] | 0;
    }
    function nw() {
        var $ = 0;
        $ = pL(20) | 0;
        n8(($ | 0) != 0, 2592);
        _[2277] = (_[2277] | 0) + 1;
        _[$ >> 2] = _[239];
        _[($ + 4) >> 2] = _[240];
        _[($ + 8) >> 2] = _[241];
        _[($ + 12) >> 2] = _[242];
        _[($ + 16) >> 2] = _[243];
        return $ | 0;
    }
    function n8($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        e = s;
        s = (s + 16) | 0;
        r = e;
        if (!$) {
            _[r >> 2] = n;
            rZ(0, 5, 3197, r);
        }
        s = e;
        return;
    }
    function nm($) {
        $ = $ | 0;
        pO($);
        _[2277] = (_[2277] | 0) + -1;
        return;
    }
    function ny($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        if (!n) {
            r = 0;
            n = 0;
        } else {
            nh($, (n5($) | 0) == 0, 2629);
            r = 1;
        }
        _[($ + 964) >> 2] = n;
        _[($ + 988) >> 2] = r;
        return;
    }
    function np($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        t = (e + 8) | 0;
        i = (e + 4) | 0;
        u = e;
        _[i >> 2] = n;
        nh($, (_[(n + 944) >> 2] | 0) == 0, 2709);
        nh($, (_[($ + 964) >> 2] | 0) == 0, 2763);
        nC($);
        n = ($ + 948) | 0;
        _[u >> 2] = (_[n >> 2] | 0) + (r << 2);
        _[t >> 2] = _[u >> 2];
        nM(n, t, i) | 0;
        _[((_[i >> 2] | 0) + 944) >> 2] = $;
        ng($);
        s = e;
        return;
    }
    function nC($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0;
        r = n5($) | 0;
        if (r | 0 ? (_[((ns($, 0) | 0) + 944) >> 2] | 0) != ($ | 0) : 0) {
            e = _[((_[($ + 976) >> 2] | 0) + 12) >> 2] | 0;
            i = ($ + 948) | 0;
            t = (e | 0) == 0;
            n = 0;
            do {
                u = _[((_[i >> 2] | 0) + (n << 2)) >> 2] | 0;
                f = n4(u) | 0;
                _[((_[i >> 2] | 0) + (n << 2)) >> 2] = f;
                _[(f + 944) >> 2] = $;
                if (!t) g0[e & 15](u, f, $, n);
                n = (n + 1) | 0;
            }while ((n | 0) != (r | 0))
        }
        return;
    }
    function nM($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0, k = 0, h = 0, d = 0, w = 0;
        d = s;
        s = (s + 64) | 0;
        l = (d + 52) | 0;
        f = (d + 48) | 0;
        v = (d + 28) | 0;
        b = (d + 24) | 0;
        k = (d + 20) | 0;
        h = d;
        e = _[$ >> 2] | 0;
        t = e;
        n = (e + ((((_[n >> 2] | 0) - t) >> 2) << 2)) | 0;
        e = ($ + 4) | 0;
        i = _[e >> 2] | 0;
        u = ($ + 8) | 0;
        do if (i >>> 0 < (_[u >> 2] | 0) >>> 0) {
            if ((n | 0) == (i | 0)) {
                _[n >> 2] = _[r >> 2];
                _[e >> 2] = (_[e >> 2] | 0) + 4;
                break;
            }
            eJ($, n, i, (n + 4) | 0);
            if (n >>> 0 <= r >>> 0) r = (_[e >> 2] | 0) >>> 0 > r >>> 0 ? (r + 4) | 0 : r;
            _[n >> 2] = _[r >> 2];
        } else {
            e = (((i - t) >> 2) + 1) | 0;
            i = ec($) | 0;
            if (i >>> 0 < e >>> 0) Cd($);
            a = _[$ >> 2] | 0;
            c = ((_[u >> 2] | 0) - a) | 0;
            t = c >> 1;
            eH(h, (c >> 2) >>> 0 < (i >>> 1) >>> 0 ? t >>> 0 < e >>> 0 ? e : t : i, (n - a) >> 2, ($ + 8) | 0);
            a = (h + 8) | 0;
            e = _[a >> 2] | 0;
            t = (h + 12) | 0;
            c = _[t >> 2] | 0;
            u = c;
            o = e;
            do if ((e | 0) == (c | 0)) {
                c = (h + 4) | 0;
                e = _[c >> 2] | 0;
                w = _[h >> 2] | 0;
                i = w;
                if (e >>> 0 <= w >>> 0) {
                    e = (u - i) >> 1;
                    e = (e | 0) == 0 ? 1 : e;
                    eH(v, e, e >>> 2, _[(h + 16) >> 2] | 0);
                    _[b >> 2] = _[c >> 2];
                    _[k >> 2] = _[a >> 2];
                    _[f >> 2] = _[b >> 2];
                    _[l >> 2] = _[k >> 2];
                    eV(v, f, l);
                    e = _[h >> 2] | 0;
                    _[h >> 2] = _[v >> 2];
                    _[v >> 2] = e;
                    e = (v + 4) | 0;
                    w = _[c >> 2] | 0;
                    _[c >> 2] = _[e >> 2];
                    _[e >> 2] = w;
                    e = (v + 8) | 0;
                    w = _[a >> 2] | 0;
                    _[a >> 2] = _[e >> 2];
                    _[e >> 2] = w;
                    e = (v + 12) | 0;
                    w = _[t >> 2] | 0;
                    _[t >> 2] = _[e >> 2];
                    _[e >> 2] = w;
                    eZ(v);
                    e = _[a >> 2] | 0;
                    break;
                }
                t = e;
                u = (((((t - i) >> 2) + 1) | 0) / -2) | 0;
                f = (e + (u << 2)) | 0;
                i = (o - t) | 0;
                t = i >> 2;
                if (t) {
                    CU(f | 0, e | 0, i | 0) | 0;
                    e = _[c >> 2] | 0;
                }
                w = (f + (t << 2)) | 0;
                _[a >> 2] = w;
                _[c >> 2] = e + (u << 2);
                e = w;
            }
            while (0)
            _[e >> 2] = _[r >> 2];
            _[a >> 2] = (_[a >> 2] | 0) + 4;
            n = eQ($, h, n) | 0;
            eZ(h);
        }
        while (0)
        s = d;
        return n | 0;
    }
    function ng($) {
        $ = $ | 0;
        var n = 0;
        do {
            n = ($ + 984) | 0;
            if (e[n >> 0] | 0) break;
            e[n >> 0] = 1;
            o[($ + 504) >> 2] = X(p);
            $ = _[($ + 944) >> 2] | 0;
        }while (($ | 0) != 0)
        return;
    }
    function nA($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -4 - e) | 0) >>> 2) << 2);
            CA(r);
        }
        return;
    }
    function nI($) {
        $ = $ | 0;
        return _[($ + 944) >> 2] | 0;
    }
    function nS($) {
        $ = $ | 0;
        nh($, (_[($ + 964) >> 2] | 0) != 0, 2832);
        ng($);
        return;
    }
    function nT($) {
        $ = $ | 0;
        return ((e[($ + 984) >> 0] | 0) != 0) | 0;
    }
    function nx($, n) {
        $ = $ | 0;
        n = n | 0;
        if (pK($, n, 400) | 0) {
            CE($ | 0, n | 0, 400) | 0;
            ng($);
        }
        return;
    }
    function nN($) {
        $ = $ | 0;
        var n = n0;
        n = X(o[($ + 44) >> 2]);
        $ = no(n) | 0;
        return X($ ? X(0.0) : n);
    }
    function nL($) {
        $ = $ | 0;
        var n = n0;
        n = X(o[($ + 48) >> 2]);
        if (no(n) | 0) n = e[((_[($ + 976) >> 2] | 0) + 2) >> 0] | 0 ? X(1.0) : X(0.0);
        return X(n);
    }
    function nO($, n) {
        $ = $ | 0;
        n = n | 0;
        _[($ + 980) >> 2] = n;
        return;
    }
    function nP($) {
        $ = $ | 0;
        return _[($ + 980) >> 2] | 0;
    }
    function nE($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 4) | 0;
        if ((_[r >> 2] | 0) != (n | 0)) {
            _[r >> 2] = n;
            ng($);
        }
        return;
    }
    function nG($) {
        $ = $ | 0;
        return _[($ + 4) >> 2] | 0;
    }
    function nB($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 8) | 0;
        if ((_[r >> 2] | 0) != (n | 0)) {
            _[r >> 2] = n;
            ng($);
        }
        return;
    }
    function nR($) {
        $ = $ | 0;
        return _[($ + 8) >> 2] | 0;
    }
    function nY($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 12) | 0;
        if ((_[r >> 2] | 0) != (n | 0)) {
            _[r >> 2] = n;
            ng($);
        }
        return;
    }
    function nU($) {
        $ = $ | 0;
        return _[($ + 12) >> 2] | 0;
    }
    function nj($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 16) | 0;
        if ((_[r >> 2] | 0) != (n | 0)) {
            _[r >> 2] = n;
            ng($);
        }
        return;
    }
    function nz($) {
        $ = $ | 0;
        return _[($ + 16) >> 2] | 0;
    }
    function nD($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 20) | 0;
        if ((_[r >> 2] | 0) != (n | 0)) {
            _[r >> 2] = n;
            ng($);
        }
        return;
    }
    function nF($) {
        $ = $ | 0;
        return _[($ + 20) >> 2] | 0;
    }
    function nK($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 24) | 0;
        if ((_[r >> 2] | 0) != (n | 0)) {
            _[r >> 2] = n;
            ng($);
        }
        return;
    }
    function nq($) {
        $ = $ | 0;
        return _[($ + 24) >> 2] | 0;
    }
    function nH($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 28) | 0;
        if ((_[r >> 2] | 0) != (n | 0)) {
            _[r >> 2] = n;
            ng($);
        }
        return;
    }
    function nX($) {
        $ = $ | 0;
        return _[($ + 28) >> 2] | 0;
    }
    function nZ($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 32) | 0;
        if ((_[r >> 2] | 0) != (n | 0)) {
            _[r >> 2] = n;
            ng($);
        }
        return;
    }
    function nJ($) {
        $ = $ | 0;
        return _[($ + 32) >> 2] | 0;
    }
    function nQ($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 36) | 0;
        if ((_[r >> 2] | 0) != (n | 0)) {
            _[r >> 2] = n;
            ng($);
        }
        return;
    }
    function nV($) {
        $ = $ | 0;
        return _[($ + 36) >> 2] | 0;
    }
    function nW($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0;
        r = ($ + 40) | 0;
        if (X(o[r >> 2]) != n) {
            o[r >> 2] = n;
            ng($);
        }
        return;
    }
    function n9($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0;
        r = ($ + 44) | 0;
        if (X(o[r >> 2]) != n) {
            o[r >> 2] = n;
            ng($);
        }
        return;
    }
    function r$($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0;
        r = ($ + 48) | 0;
        if (X(o[r >> 2]) != n) {
            o[r >> 2] = n;
            ng($);
        }
        return;
    }
    function r0($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = (t ^ 1) & 1;
        e = ($ + 52) | 0;
        i = ($ + 56) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rn($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0;
        e = ($ + 52) | 0;
        r = ($ + 56) | 0;
        if (!(!(X(o[e >> 2]) != n) ? (_[r >> 2] | 0) == 2 : 0)) {
            o[e >> 2] = n;
            e = no(n) | 0;
            _[r >> 2] = e ? 3 : 2;
            ng($);
        }
        return;
    }
    function rr($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        e = (n + 52) | 0;
        r = _[(e + 4) >> 2] | 0;
        n = $;
        _[n >> 2] = _[e >> 2];
        _[(n + 4) >> 2] = r;
        return;
    }
    function re($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0, i = 0, t = 0;
        t = no(r) | 0;
        e = (t ^ 1) & 1;
        i = ($ + 132 + (n << 3)) | 0;
        n = ($ + 132 + (n << 3) + 4) | 0;
        if (!(t | (X(o[i >> 2]) == r) ? (_[n >> 2] | 0) == (e | 0) : 0)) {
            o[i >> 2] = r;
            _[n >> 2] = e;
            ng($);
        }
        return;
    }
    function ri($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0, i = 0, t = 0;
        t = no(r) | 0;
        e = t ? 0 : 2;
        i = ($ + 132 + (n << 3)) | 0;
        n = ($ + 132 + (n << 3) + 4) | 0;
        if (!(t | (X(o[i >> 2]) == r) ? (_[n >> 2] | 0) == (e | 0) : 0)) {
            o[i >> 2] = r;
            _[n >> 2] = e;
            ng($);
        }
        return;
    }
    function r_($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 132 + (r << 3)) | 0;
        n = _[(e + 4) >> 2] | 0;
        r = $;
        _[r >> 2] = _[e >> 2];
        _[(r + 4) >> 2] = n;
        return;
    }
    function rt($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0, i = 0, t = 0;
        t = no(r) | 0;
        e = (t ^ 1) & 1;
        i = ($ + 60 + (n << 3)) | 0;
        n = ($ + 60 + (n << 3) + 4) | 0;
        if (!(t | (X(o[i >> 2]) == r) ? (_[n >> 2] | 0) == (e | 0) : 0)) {
            o[i >> 2] = r;
            _[n >> 2] = e;
            ng($);
        }
        return;
    }
    function r2($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0, i = 0, t = 0;
        t = no(r) | 0;
        e = t ? 0 : 2;
        i = ($ + 60 + (n << 3)) | 0;
        n = ($ + 60 + (n << 3) + 4) | 0;
        if (!(t | (X(o[i >> 2]) == r) ? (_[n >> 2] | 0) == (e | 0) : 0)) {
            o[i >> 2] = r;
            _[n >> 2] = e;
            ng($);
        }
        return;
    }
    function ru($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 60 + (r << 3)) | 0;
        n = _[(e + 4) >> 2] | 0;
        r = $;
        _[r >> 2] = _[e >> 2];
        _[(r + 4) >> 2] = n;
        return;
    }
    function rf($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = ($ + 60 + (n << 3) + 4) | 0;
        if ((_[r >> 2] | 0) != 3) {
            o[($ + 60 + (n << 3)) >> 2] = X(p);
            _[r >> 2] = 3;
            ng($);
        }
        return;
    }
    function ro($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0, i = 0, t = 0;
        t = no(r) | 0;
        e = (t ^ 1) & 1;
        i = ($ + 204 + (n << 3)) | 0;
        n = ($ + 204 + (n << 3) + 4) | 0;
        if (!(t | (X(o[i >> 2]) == r) ? (_[n >> 2] | 0) == (e | 0) : 0)) {
            o[i >> 2] = r;
            _[n >> 2] = e;
            ng($);
        }
        return;
    }
    function rc($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0, i = 0, t = 0;
        t = no(r) | 0;
        e = t ? 0 : 2;
        i = ($ + 204 + (n << 3)) | 0;
        n = ($ + 204 + (n << 3) + 4) | 0;
        if (!(t | (X(o[i >> 2]) == r) ? (_[n >> 2] | 0) == (e | 0) : 0)) {
            o[i >> 2] = r;
            _[n >> 2] = e;
            ng($);
        }
        return;
    }
    function r6($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = (n + 204 + (r << 3)) | 0;
        n = _[(e + 4) >> 2] | 0;
        r = $;
        _[r >> 2] = _[e >> 2];
        _[(r + 4) >> 2] = n;
        return;
    }
    function ra($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0, i = 0, t = 0;
        t = no(r) | 0;
        e = (t ^ 1) & 1;
        i = ($ + 276 + (n << 3)) | 0;
        n = ($ + 276 + (n << 3) + 4) | 0;
        if (!(t | (X(o[i >> 2]) == r) ? (_[n >> 2] | 0) == (e | 0) : 0)) {
            o[i >> 2] = r;
            _[n >> 2] = e;
            ng($);
        }
        return;
    }
    function r1($, n) {
        $ = $ | 0;
        n = n | 0;
        return X(o[($ + 276 + (n << 3)) >> 2]);
    }
    function r4($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = (t ^ 1) & 1;
        e = ($ + 348) | 0;
        i = ($ + 352) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rl($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0;
        e = ($ + 348) | 0;
        r = ($ + 352) | 0;
        if (!(!(X(o[e >> 2]) != n) ? (_[r >> 2] | 0) == 2 : 0)) {
            o[e >> 2] = n;
            e = no(n) | 0;
            _[r >> 2] = e ? 3 : 2;
            ng($);
        }
        return;
    }
    function rv($) {
        $ = $ | 0;
        var n = 0;
        n = ($ + 352) | 0;
        if ((_[n >> 2] | 0) != 3) {
            o[($ + 348) >> 2] = X(p);
            _[n >> 2] = 3;
            ng($);
        }
        return;
    }
    function r7($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        e = (n + 348) | 0;
        r = _[(e + 4) >> 2] | 0;
        n = $;
        _[n >> 2] = _[e >> 2];
        _[(n + 4) >> 2] = r;
        return;
    }
    function r5($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = (t ^ 1) & 1;
        e = ($ + 356) | 0;
        i = ($ + 360) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rs($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0;
        e = ($ + 356) | 0;
        r = ($ + 360) | 0;
        if (!(!(X(o[e >> 2]) != n) ? (_[r >> 2] | 0) == 2 : 0)) {
            o[e >> 2] = n;
            e = no(n) | 0;
            _[r >> 2] = e ? 3 : 2;
            ng($);
        }
        return;
    }
    function r3($) {
        $ = $ | 0;
        var n = 0;
        n = ($ + 360) | 0;
        if ((_[n >> 2] | 0) != 3) {
            o[($ + 356) >> 2] = X(p);
            _[n >> 2] = 3;
            ng($);
        }
        return;
    }
    function rb($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        e = (n + 356) | 0;
        r = _[(e + 4) >> 2] | 0;
        n = $;
        _[n >> 2] = _[e >> 2];
        _[(n + 4) >> 2] = r;
        return;
    }
    function rk($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = (t ^ 1) & 1;
        e = ($ + 364) | 0;
        i = ($ + 368) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rh($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = t ? 0 : 2;
        e = ($ + 364) | 0;
        i = ($ + 368) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rd($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        e = (n + 364) | 0;
        r = _[(e + 4) >> 2] | 0;
        n = $;
        _[n >> 2] = _[e >> 2];
        _[(n + 4) >> 2] = r;
        return;
    }
    function rw($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = (t ^ 1) & 1;
        e = ($ + 372) | 0;
        i = ($ + 376) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function r8($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = t ? 0 : 2;
        e = ($ + 372) | 0;
        i = ($ + 376) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rm($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        e = (n + 372) | 0;
        r = _[(e + 4) >> 2] | 0;
        n = $;
        _[n >> 2] = _[e >> 2];
        _[(n + 4) >> 2] = r;
        return;
    }
    function ry($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = (t ^ 1) & 1;
        e = ($ + 380) | 0;
        i = ($ + 384) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rp($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = t ? 0 : 2;
        e = ($ + 380) | 0;
        i = ($ + 384) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rC($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        e = (n + 380) | 0;
        r = _[(e + 4) >> 2] | 0;
        n = $;
        _[n >> 2] = _[e >> 2];
        _[(n + 4) >> 2] = r;
        return;
    }
    function rM($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = (t ^ 1) & 1;
        e = ($ + 388) | 0;
        i = ($ + 392) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rg($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0;
        t = no(n) | 0;
        r = t ? 0 : 2;
        e = ($ + 388) | 0;
        i = ($ + 392) | 0;
        if (!(t | (X(o[e >> 2]) == n) ? (_[i >> 2] | 0) == (r | 0) : 0)) {
            o[e >> 2] = n;
            _[i >> 2] = r;
            ng($);
        }
        return;
    }
    function rA($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        e = (n + 388) | 0;
        r = _[(e + 4) >> 2] | 0;
        n = $;
        _[n >> 2] = _[e >> 2];
        _[(n + 4) >> 2] = r;
        return;
    }
    function rI($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0;
        r = ($ + 396) | 0;
        if (X(o[r >> 2]) != n) {
            o[r >> 2] = n;
            ng($);
        }
        return;
    }
    function rS($) {
        $ = $ | 0;
        return X(o[($ + 396) >> 2]);
    }
    function rT($) {
        $ = $ | 0;
        return X(o[($ + 400) >> 2]);
    }
    function rx($) {
        $ = $ | 0;
        return X(o[($ + 404) >> 2]);
    }
    function rN($) {
        $ = $ | 0;
        return X(o[($ + 408) >> 2]);
    }
    function rL($) {
        $ = $ | 0;
        return X(o[($ + 412) >> 2]);
    }
    function rO($) {
        $ = $ | 0;
        return X(o[($ + 416) >> 2]);
    }
    function rP($) {
        $ = $ | 0;
        return X(o[($ + 420) >> 2]);
    }
    function rE($, n) {
        $ = $ | 0;
        n = n | 0;
        nh($, (n | 0) < 6, 2918);
        switch(n | 0){
            case 0:
                {
                    n = (_[($ + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    n = (_[($ + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return X(o[($ + 424 + (n << 2)) >> 2]);
    }
    function rG($, n) {
        $ = $ | 0;
        n = n | 0;
        nh($, (n | 0) < 6, 2918);
        switch(n | 0){
            case 0:
                {
                    n = (_[($ + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    n = (_[($ + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return X(o[($ + 448 + (n << 2)) >> 2]);
    }
    function rB($, n) {
        $ = $ | 0;
        n = n | 0;
        nh($, (n | 0) < 6, 2918);
        switch(n | 0){
            case 0:
                {
                    n = (_[($ + 496) >> 2] | 0) == 2 ? 5 : 4;
                    break;
                }
            case 2:
                {
                    n = (_[($ + 496) >> 2] | 0) == 2 ? 4 : 5;
                    break;
                }
            default:
                {}
        }
        return X(o[($ + 472 + (n << 2)) >> 2]);
    }
    function rR($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = n0;
        r = _[($ + 4) >> 2] | 0;
        if ((r | 0) == (_[(n + 4) >> 2] | 0)) {
            if (!r) $ = 1;
            else {
                e = X(o[$ >> 2]);
                $ = X(N(X(e - X(o[n >> 2])))) < X(0.0000999999974);
            }
        } else $ = 0;
        return $ | 0;
    }
    function rY($, n) {
        $ = X($);
        n = X(n);
        var r = 0;
        if (no($) | 0) r = no(n) | 0;
        else r = X(N(X($ - n))) < X(0.0000999999974);
        return r | 0;
    }
    function rU($, n) {
        $ = $ | 0;
        n = n | 0;
        rj($, n);
        return;
    }
    function rj($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, i = 0;
        r = s;
        s = (s + 16) | 0;
        i = (r + 4) | 0;
        _[i >> 2] = 0;
        _[(i + 4) >> 2] = 0;
        _[(i + 8) >> 2] = 0;
        $x(i | 0, $ | 0, n | 0, 0);
        rZ($, 3, (e[(i + 11) >> 0] | 0) < 0 ? _[i >> 2] | 0 : i, r);
        CI(i);
        s = r;
        return;
    }
    function rz($, n, r, e) {
        $ = X($);
        n = X(n);
        r = r | 0;
        e = e | 0;
        var i = n0;
        $ = X($ * n);
        i = X(Cb($, X(1.0)));
        do if (!(rY(i, X(0.0)) | 0)) {
            $ = X($ - i);
            if (rY(i, X(1.0)) | 0) {
                $ = X($ + X(1.0));
                break;
            }
            if (r) {
                $ = X($ + X(1.0));
                break;
            }
            if (!e) {
                if (i > X(0.5)) i = X(1.0);
                else {
                    e = rY(i, X(0.5)) | 0;
                    i = e ? X(1.0) : X(0.0);
                }
                $ = X($ + i);
            }
        } else $ = X($ - i);
        while (0)
        return X($ / n);
    }
    function rD($, n, r, e, i, _, t, u, f, c, a, l, v) {
        $ = $ | 0;
        n = X(n);
        r = r | 0;
        e = X(e);
        i = i | 0;
        _ = X(_);
        t = t | 0;
        u = X(u);
        f = X(f);
        c = X(c);
        a = X(a);
        l = X(l);
        v = v | 0;
        var s = 0, b = n0, k = n0, h = n0, d = n0, w = n0, m = n0;
        if ((f < X(0.0)) | (c < X(0.0))) v = 0;
        else {
            if ((v | 0) != 0 ? ((b = X(o[(v + 4) >> 2])), b != X(0.0)) : 0) {
                h = X(rz(n, b, 0, 0));
                d = X(rz(e, b, 0, 0));
                k = X(rz(_, b, 0, 0));
                b = X(rz(u, b, 0, 0));
            } else {
                k = _;
                h = n;
                b = u;
                d = e;
            }
            if ((i | 0) == ($ | 0)) s = rY(k, h) | 0;
            else s = 0;
            if ((t | 0) == (r | 0)) v = rY(b, d) | 0;
            else v = 0;
            if ((!s ? ((w = X(n - a)), !(rF($, w, f) | 0)) : 0) ? !(rK($, w, i, f) | 0) : 0) s = rq($, w, i, _, f) | 0;
            else s = 1;
            if ((!v ? ((m = X(e - l)), !(rF(r, m, c) | 0)) : 0) ? !(rK(r, m, t, c) | 0) : 0) v = rq(r, m, t, u, c) | 0;
            else v = 1;
            v = s & v;
        }
        return v | 0;
    }
    function rF($, n, r) {
        $ = $ | 0;
        n = X(n);
        r = X(r);
        if (($ | 0) == 1) $ = rY(n, r) | 0;
        else $ = 0;
        return $ | 0;
    }
    function rK($, n, r, e) {
        $ = $ | 0;
        n = X(n);
        r = r | 0;
        e = X(e);
        if ((($ | 0) == 2) & ((r | 0) == 0)) {
            if (!(n >= e)) $ = rY(n, e) | 0;
            else $ = 1;
        } else $ = 0;
        return $ | 0;
    }
    function rq($, n, r, e, i) {
        $ = $ | 0;
        n = X(n);
        r = r | 0;
        e = X(e);
        i = X(i);
        if ((($ | 0) == 2) & ((r | 0) == 2) & (e > n)) {
            if (!(i <= n)) $ = rY(n, i) | 0;
            else $ = 1;
        } else $ = 0;
        return $ | 0;
    }
    function rH($, n, r, i, t, u, f, a, l, v, b) {
        $ = $ | 0;
        n = X(n);
        r = X(r);
        i = i | 0;
        t = t | 0;
        u = u | 0;
        f = X(f);
        a = X(a);
        l = l | 0;
        v = v | 0;
        b = b | 0;
        var k = 0, h = 0, d = 0, w = 0, m = n0, y = n0, p = 0, C = 0, M = 0, g = 0, A = 0, I = 0, S = 0, T = 0, x = 0, N = 0, L = 0, O = n0, P = n0, E = n0, G = 0.0, B = 0.0;
        L = s;
        s = (s + 160) | 0;
        T = (L + 152) | 0;
        S = (L + 120) | 0;
        I = (L + 104) | 0;
        M = (L + 72) | 0;
        w = (L + 56) | 0;
        A = (L + 8) | 0;
        C = L;
        g = ((_[2279] | 0) + 1) | 0;
        _[2279] = g;
        x = ($ + 984) | 0;
        if ((e[x >> 0] | 0) != 0 ? (_[($ + 512) >> 2] | 0) != (_[2278] | 0) : 0) p = 4;
        else if ((_[($ + 516) >> 2] | 0) == (i | 0)) N = 0;
        else p = 4;
        if ((p | 0) == 4) {
            _[($ + 520) >> 2] = 0;
            _[($ + 924) >> 2] = -1;
            _[($ + 928) >> 2] = -1;
            o[($ + 932) >> 2] = X(-1.0);
            o[($ + 936) >> 2] = X(-1.0);
            N = 1;
        }
        a: do if (!(_[($ + 964) >> 2] | 0)) {
            if (l) {
                k = ($ + 916) | 0;
                if (!(rY(X(o[k >> 2]), n) | 0)) {
                    p = 21;
                    break;
                }
                if (!(rY(X(o[($ + 920) >> 2]), r) | 0)) {
                    p = 21;
                    break;
                }
                if ((_[($ + 924) >> 2] | 0) != (t | 0)) {
                    p = 21;
                    break;
                }
                k = (_[($ + 928) >> 2] | 0) == (u | 0) ? k : 0;
                p = 22;
                break;
            }
            d = _[($ + 520) >> 2] | 0;
            if (!d) p = 21;
            else {
                h = 0;
                while(1){
                    k = ($ + 524 + ((h * 24) | 0)) | 0;
                    if (((rY(X(o[k >> 2]), n) | 0 ? rY(X(o[($ + 524 + ((h * 24) | 0) + 4) >> 2]), r) | 0 : 0) ? (_[($ + 524 + ((h * 24) | 0) + 8) >> 2] | 0) == (t | 0) : 0) ? (_[($ + 524 + ((h * 24) | 0) + 12) >> 2] | 0) == (u | 0) : 0) {
                        p = 22;
                        break a;
                    }
                    h = (h + 1) | 0;
                    if (h >>> 0 >= d >>> 0) {
                        p = 21;
                        break;
                    }
                }
            }
        } else {
            m = X(rX($, 2, f));
            y = X(rX($, 0, f));
            k = ($ + 916) | 0;
            E = X(o[k >> 2]);
            P = X(o[($ + 920) >> 2]);
            O = X(o[($ + 932) >> 2]);
            if (!(rD(t, n, u, r, _[($ + 924) >> 2] | 0, E, _[($ + 928) >> 2] | 0, P, O, X(o[($ + 936) >> 2]), m, y, b) | 0)) {
                d = _[($ + 520) >> 2] | 0;
                if (!d) p = 21;
                else {
                    h = 0;
                    while(1){
                        k = ($ + 524 + ((h * 24) | 0)) | 0;
                        O = X(o[k >> 2]);
                        P = X(o[($ + 524 + ((h * 24) | 0) + 4) >> 2]);
                        E = X(o[($ + 524 + ((h * 24) | 0) + 16) >> 2]);
                        if (rD(t, n, u, r, _[($ + 524 + ((h * 24) | 0) + 8) >> 2] | 0, O, _[($ + 524 + ((h * 24) | 0) + 12) >> 2] | 0, P, E, X(o[($ + 524 + ((h * 24) | 0) + 20) >> 2]), m, y, b) | 0) {
                            p = 22;
                            break a;
                        }
                        h = (h + 1) | 0;
                        if (h >>> 0 >= d >>> 0) {
                            p = 21;
                            break;
                        }
                    }
                }
            } else p = 22;
        }
        while (0)
        do if ((p | 0) == 21) {
            if (!(e[11697] | 0)) {
                k = 0;
                p = 31;
            } else {
                k = 0;
                p = 28;
            }
        } else if ((p | 0) == 22) {
            h = (e[11697] | 0) != 0;
            if (!(((k | 0) != 0) & (N ^ 1))) if (h) {
                p = 28;
                break;
            } else {
                p = 31;
                break;
            }
            w = (k + 16) | 0;
            _[($ + 908) >> 2] = _[w >> 2];
            d = (k + 20) | 0;
            _[($ + 912) >> 2] = _[d >> 2];
            if (!(((e[11698] | 0) == 0) | (h ^ 1))) {
                _[C >> 2] = rJ(g) | 0;
                _[(C + 4) >> 2] = g;
                rZ($, 4, 2972, C);
                h = _[($ + 972) >> 2] | 0;
                if (h | 0) ME[h & 127]($);
                t = rQ(t, l) | 0;
                u = rQ(u, l) | 0;
                B = +X(o[w >> 2]);
                G = +X(o[d >> 2]);
                _[A >> 2] = t;
                _[(A + 4) >> 2] = u;
                c[(A + 8) >> 3] = +n;
                c[(A + 16) >> 3] = +r;
                c[(A + 24) >> 3] = B;
                c[(A + 32) >> 3] = G;
                _[(A + 40) >> 2] = v;
                rZ($, 4, 2989, A);
            }
        }
        while (0)
        if ((p | 0) == 28) {
            h = rJ(g) | 0;
            _[w >> 2] = h;
            _[(w + 4) >> 2] = g;
            _[(w + 8) >> 2] = N ? 3047 : 11699;
            rZ($, 4, 3038, w);
            h = _[($ + 972) >> 2] | 0;
            if (h | 0) ME[h & 127]($);
            A = rQ(t, l) | 0;
            p = rQ(u, l) | 0;
            _[M >> 2] = A;
            _[(M + 4) >> 2] = p;
            c[(M + 8) >> 3] = +n;
            c[(M + 16) >> 3] = +r;
            _[(M + 24) >> 2] = v;
            rZ($, 4, 3049, M);
            p = 31;
        }
        if ((p | 0) == 31) {
            rV($, n, r, i, t, u, f, a, l, b);
            if (e[11697] | 0) {
                h = _[2279] | 0;
                A = rJ(h) | 0;
                _[I >> 2] = A;
                _[(I + 4) >> 2] = h;
                _[(I + 8) >> 2] = N ? 3047 : 11699;
                rZ($, 4, 3083, I);
                h = _[($ + 972) >> 2] | 0;
                if (h | 0) ME[h & 127]($);
                A = rQ(t, l) | 0;
                I = rQ(u, l) | 0;
                G = +X(o[($ + 908) >> 2]);
                B = +X(o[($ + 912) >> 2]);
                _[S >> 2] = A;
                _[(S + 4) >> 2] = I;
                c[(S + 8) >> 3] = G;
                c[(S + 16) >> 3] = B;
                _[(S + 24) >> 2] = v;
                rZ($, 4, 3092, S);
            }
            _[($ + 516) >> 2] = i;
            if (!k) {
                h = ($ + 520) | 0;
                k = _[h >> 2] | 0;
                if ((k | 0) == 16) {
                    if (e[11697] | 0) rZ($, 4, 3124, T);
                    _[h >> 2] = 0;
                    k = 0;
                }
                if (l) k = ($ + 916) | 0;
                else {
                    _[h >> 2] = k + 1;
                    k = ($ + 524 + ((k * 24) | 0)) | 0;
                }
                o[k >> 2] = n;
                o[(k + 4) >> 2] = r;
                _[(k + 8) >> 2] = t;
                _[(k + 12) >> 2] = u;
                _[(k + 16) >> 2] = _[($ + 908) >> 2];
                _[(k + 20) >> 2] = _[($ + 912) >> 2];
                k = 0;
            }
        }
        if (l) {
            _[($ + 416) >> 2] = _[($ + 908) >> 2];
            _[($ + 420) >> 2] = _[($ + 912) >> 2];
            e[($ + 985) >> 0] = 1;
            e[x >> 0] = 0;
        }
        _[2279] = (_[2279] | 0) + -1;
        _[($ + 512) >> 2] = _[2278];
        s = L;
        return N | ((k | 0) == 0) | 0;
    }
    function rX($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = n0;
        e = X(e6($, n, r));
        return X(e + X(ea($, n, r)));
    }
    function rZ($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        _[i >> 2] = e;
        if (!$) e = 0;
        else e = _[($ + 976) >> 2] | 0;
        et(e, $, n, r, i);
        s = t;
        return;
    }
    function rJ($) {
        $ = $ | 0;
        return ($ >>> 0 > 60 ? 3201 : (3201 + (60 - $)) | 0) | 0;
    }
    function rQ($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0;
        i = s;
        s = (s + 32) | 0;
        r = (i + 12) | 0;
        e = i;
        _[r >> 2] = _[254];
        _[(r + 4) >> 2] = _[255];
        _[(r + 8) >> 2] = _[256];
        _[e >> 2] = _[257];
        _[(e + 4) >> 2] = _[258];
        _[(e + 8) >> 2] = _[259];
        if (($ | 0) > 2) $ = 11699;
        else $ = _[((n ? e : r) + ($ << 2)) >> 2] | 0;
        s = i;
        return $ | 0;
    }
    function rV($, n, r, i, u, f, c, a, v, b) {
        $ = $ | 0;
        n = X(n);
        r = X(r);
        i = i | 0;
        u = u | 0;
        f = f | 0;
        c = X(c);
        a = X(a);
        v = v | 0;
        b = b | 0;
        var k = 0, h = 0, d = 0, w = 0, m = n0, y = n0, p = n0, C = n0, M = n0, g = n0, A = n0, I = 0, S = 0, T = 0, x = n0, N = n0, L = 0, O = n0, P = 0, E = 0, G = 0, B = 0, R = 0, Y = 0, U = 0, j = 0, z = 0, D = 0, F = 0, K = 0, q = 0, H = 0, Z = 0, J = 0, Q = 0, V = 0, W = n0, $$ = n0, $0 = n0, $n = n0, $r = n0, $e = 0, $i = 0, $_ = 0, $t = 0, $2 = 0, $u = n0, $f = n0, $o = n0, $c = n0, $6 = n0, $a = n0, $1 = 0, $4 = n0, $l = n0, $v = n0, $7 = n0, $5 = n0, $s = n0, $3 = 0, $b = 0, $k = n0, $h = n0, $d = 0, $w = 0, $8 = 0, $m = 0, $y = n0, $p = 0, $C = 0, $M = 0, $g = 0, $A = 0, $I = 0, $S = 0, $T = n0, $x = 0, $N = 0;
        $S = s;
        s = (s + 16) | 0;
        $e = ($S + 12) | 0;
        $i = ($S + 8) | 0;
        $_ = ($S + 4) | 0;
        $t = $S;
        nh($, ((u | 0) == 0) | ((no(n) | 0) ^ 1), 3326);
        nh($, ((f | 0) == 0) | ((no(r) | 0) ^ 1), 3406);
        $C = el($, i) | 0;
        _[($ + 496) >> 2] = $C;
        $A = ev(2, $C) | 0;
        $I = ev(0, $C) | 0;
        o[($ + 440) >> 2] = X(e6($, $A, c));
        o[($ + 444) >> 2] = X(ea($, $A, c));
        o[($ + 428) >> 2] = X(e6($, $I, c));
        o[($ + 436) >> 2] = X(ea($, $I, c));
        o[($ + 464) >> 2] = X(e7($, $A));
        o[($ + 468) >> 2] = X(e5($, $A));
        o[($ + 452) >> 2] = X(e7($, $I));
        o[($ + 460) >> 2] = X(e5($, $I));
        o[($ + 488) >> 2] = X(es($, $A, c));
        o[($ + 492) >> 2] = X(e3($, $A, c));
        o[($ + 476) >> 2] = X(es($, $I, c));
        o[($ + 484) >> 2] = X(e3($, $I, c));
        do if (!(_[($ + 964) >> 2] | 0)) {
            $M = ($ + 948) | 0;
            $g = ((_[($ + 952) >> 2] | 0) - (_[$M >> 2] | 0)) >> 2;
            if (!$g) {
                ek($, n, r, u, f, c, a);
                break;
            }
            if (!v ? eh($, n, r, u, f, c, a) | 0 : 0) break;
            nC($);
            J = ($ + 508) | 0;
            e[J >> 0] = 0;
            $A = ev(_[($ + 4) >> 2] | 0, $C) | 0;
            $I = ed($A, $C) | 0;
            $p = e1($A) | 0;
            Q = _[($ + 8) >> 2] | 0;
            $w = ($ + 28) | 0;
            V = (_[$w >> 2] | 0) != 0;
            $5 = $p ? c : a;
            $k = $p ? a : c;
            W = X(ew($, $A, c));
            $$ = X(e8($, $A, c));
            m = X(ew($, $I, c));
            $s = X(em($, $A, c));
            $h = X(em($, $I, c));
            T = $p ? u : f;
            $d = $p ? f : u;
            $y = $p ? $s : $h;
            M = $p ? $h : $s;
            $7 = X(rX($, 2, c));
            C = X(rX($, 0, c));
            y = X(X(en(($ + 364) | 0, c)) - $y);
            p = X(X(en(($ + 380) | 0, c)) - $y);
            g = X(X(en(($ + 372) | 0, a)) - M);
            A = X(X(en(($ + 388) | 0, a)) - M);
            $0 = $p ? y : g;
            $n = $p ? p : A;
            $7 = X(n - $7);
            n = X($7 - $y);
            if (no(n) | 0) $y = n;
            else $y = X(C7(X(Cs(n, p)), y));
            $l = X(r - C);
            n = X($l - M);
            if (no(n) | 0) $v = n;
            else $v = X(C7(X(Cs(n, A)), g));
            y = $p ? $y : $v;
            $4 = $p ? $v : $y;
            a: do if ((T | 0) == 1) {
                i = 0;
                h = 0;
                while(1){
                    k = ns($, h) | 0;
                    if (!i) {
                        if (X(ep(k)) > X(0.0) ? X(eC(k)) > X(0.0) : 0) i = k;
                        else i = 0;
                    } else if (ey(k) | 0) {
                        w = 0;
                        break a;
                    }
                    h = (h + 1) | 0;
                    if (h >>> 0 >= $g >>> 0) {
                        w = i;
                        break;
                    }
                }
            } else w = 0;
            while (0)
            I = (w + 500) | 0;
            S = (w + 504) | 0;
            i = 0;
            k = 0;
            n = X(0.0);
            d = 0;
            do {
                h = _[((_[$M >> 2] | 0) + (d << 2)) >> 2] | 0;
                if ((_[(h + 36) >> 2] | 0) == 1) {
                    eM(h);
                    e[(h + 985) >> 0] = 1;
                    e[(h + 984) >> 0] = 0;
                } else {
                    e$(h);
                    if (v) er(h, el(h, $C) | 0, y, $4, $y);
                    do if ((_[(h + 24) >> 2] | 0) != 1) {
                        if ((h | 0) == (w | 0)) {
                            _[I >> 2] = _[2278];
                            o[S >> 2] = X(0.0);
                            break;
                        } else {
                            eg($, h, $y, u, $v, $y, $v, f, $C, b);
                            break;
                        }
                    } else {
                        if (k | 0) _[(k + 960) >> 2] = h;
                        _[(h + 960) >> 2] = 0;
                        k = h;
                        i = (i | 0) == 0 ? h : i;
                    }
                    while (0)
                    $a = X(o[(h + 504) >> 2]);
                    n = X(n + X($a + X(rX(h, $A, $y))));
                }
                d = (d + 1) | 0;
            }while ((d | 0) != ($g | 0))
            G = n > y;
            $1 = V & (((T | 0) == 2) & G) ? 1 : T;
            P = ($d | 0) == 1;
            R = P & (v ^ 1);
            Y = ($1 | 0) == 1;
            U = ($1 | 0) == 2;
            j = (976 + ($A << 2)) | 0;
            z = ($d | 2 | 0) == 2;
            H = P & (V ^ 1);
            D = (1040 + ($I << 2)) | 0;
            F = (1040 + ($A << 2)) | 0;
            K = (976 + ($I << 2)) | 0;
            q = ($d | 0) != 1;
            G = V & (((T | 0) != 0) & G);
            E = ($ + 976) | 0;
            P = P ^ 1;
            n = y;
            L = 0;
            B = 0;
            $a = X(0.0);
            $r = X(0.0);
            while(1){
                b: do if (L >>> 0 < $g >>> 0) {
                    S = _[$M >> 2] | 0;
                    d = 0;
                    A = X(0.0);
                    g = X(0.0);
                    p = X(0.0);
                    y = X(0.0);
                    h = 0;
                    k = 0;
                    w = L;
                    while(1){
                        I = _[(S + (w << 2)) >> 2] | 0;
                        if ((_[(I + 36) >> 2] | 0) != 1 ? ((_[(I + 940) >> 2] = B), (_[(I + 24) >> 2] | 0) != 1) : 0) {
                            C = X(rX(I, $A, $y));
                            Z = _[j >> 2] | 0;
                            r = X(en((I + 380 + (Z << 3)) | 0, $5));
                            M = X(o[(I + 504) >> 2]);
                            r = X(Cs(r, M));
                            r = X(C7(X(en((I + 364 + (Z << 3)) | 0, $5)), r));
                            if (V & ((d | 0) != 0) & (X(C + X(g + r)) > n)) {
                                f = d;
                                C = A;
                                T = w;
                                break b;
                            }
                            C = X(C + r);
                            r = X(g + C);
                            C = X(A + C);
                            if (ey(I) | 0) {
                                p = X(p + X(ep(I)));
                                y = X(y - X(M * X(eC(I))));
                            }
                            if (k | 0) _[(k + 960) >> 2] = I;
                            _[(I + 960) >> 2] = 0;
                            d = (d + 1) | 0;
                            k = I;
                            h = (h | 0) == 0 ? I : h;
                        } else {
                            C = A;
                            r = g;
                        }
                        w = (w + 1) | 0;
                        if (w >>> 0 < $g >>> 0) {
                            A = C;
                            g = r;
                        } else {
                            f = d;
                            T = w;
                            break;
                        }
                    }
                } else {
                    f = 0;
                    C = X(0.0);
                    p = X(0.0);
                    y = X(0.0);
                    h = 0;
                    T = L;
                }
                while (0)
                Z = (p > X(0.0)) & (p < X(1.0));
                x = Z ? X(1.0) : p;
                Z = (y > X(0.0)) & (y < X(1.0));
                A = Z ? X(1.0) : y;
                do if (!Y) {
                    if (!((C < $0) & ((no($0) | 0) ^ 1))) {
                        if (!((C > $n) & ((no($n) | 0) ^ 1))) {
                            if (!(e[((_[E >> 2] | 0) + 3) >> 0] | 0)) {
                                if (!(x == X(0.0)) ? !(X(ep($)) == X(0.0)) : 0) {
                                    Z = 53;
                                    break;
                                }
                                n = C;
                                Z = 53;
                            } else Z = 51;
                        } else {
                            n = $n;
                            Z = 51;
                        }
                    } else {
                        n = $0;
                        Z = 51;
                    }
                } else Z = 51;
                while (0)
                if ((Z | 0) == 51) {
                    Z = 0;
                    if (no(n) | 0) Z = 53;
                    else {
                        N = X(n - C);
                        O = n;
                    }
                }
                if ((Z | 0) == 53) {
                    Z = 0;
                    if (C < X(0.0)) {
                        N = X(-C);
                        O = n;
                    } else {
                        N = X(0.0);
                        O = n;
                    }
                }
                if (!R ? (($2 = (h | 0) == 0), !$2) : 0) {
                    d = _[j >> 2] | 0;
                    w = N < X(0.0);
                    M = X(N / A);
                    I = N > X(0.0);
                    g = X(N / x);
                    p = X(0.0);
                    C = X(0.0);
                    n = X(0.0);
                    k = h;
                    do {
                        r = X(en((k + 380 + (d << 3)) | 0, $5));
                        y = X(en((k + 364 + (d << 3)) | 0, $5));
                        y = X(Cs(r, X(C7(y, X(o[(k + 504) >> 2])))));
                        if (w) {
                            r = X(y * X(eC(k)));
                            if (r != X(-0.0) ? (($T = X(y - X(M * r))), ($u = X(eA(k, $A, $T, O, $y))), $T != $u) : 0) {
                                p = X(p - X($u - y));
                                n = X(n + r);
                            }
                        } else if ((I ? (($f = X(ep(k))), $f != X(0.0)) : 0) ? (($T = X(y + X(g * $f))), ($o = X(eA(k, $A, $T, O, $y))), $T != $o) : 0) {
                            p = X(p - X($o - y));
                            C = X(C - $f);
                        }
                        k = _[(k + 960) >> 2] | 0;
                    }while ((k | 0) != 0)
                    n = X(A + n);
                    y = X(N + p);
                    if (!$2) {
                        M = X(x + C);
                        w = _[j >> 2] | 0;
                        I = y < X(0.0);
                        S = n == X(0.0);
                        g = X(y / n);
                        d = y > X(0.0);
                        M = X(y / M);
                        n = X(0.0);
                        do {
                            $T = X(en((h + 380 + (w << 3)) | 0, $5));
                            p = X(en((h + 364 + (w << 3)) | 0, $5));
                            p = X(Cs($T, X(C7(p, X(o[(h + 504) >> 2])))));
                            if (I) {
                                $T = X(p * X(eC(h)));
                                y = X(-$T);
                                if ($T != X(-0.0)) {
                                    $T = X(g * y);
                                    y = X(eA(h, $A, X(p + (S ? y : $T)), O, $y));
                                } else y = p;
                            } else if (d ? (($c = X(ep(h))), $c != X(0.0)) : 0) y = X(eA(h, $A, X(p + X(M * $c)), O, $y));
                            else y = p;
                            n = X(n - X(y - p));
                            C = X(rX(h, $A, $y));
                            r = X(rX(h, $I, $y));
                            y = X(y + C);
                            o[$i >> 2] = y;
                            _[$t >> 2] = 1;
                            p = X(o[(h + 396) >> 2]);
                            c: do if (no(p) | 0) {
                                k = no($4) | 0;
                                do if (!k) {
                                    if (G | (e0(h, $I, $4) | 0 | P)) break;
                                    if ((eI($, h) | 0) != 4) break;
                                    if ((_[((eS(h, $I) | 0) + 4) >> 2] | 0) == 3) break;
                                    if ((_[((eT(h, $I) | 0) + 4) >> 2] | 0) == 3) break;
                                    o[$e >> 2] = $4;
                                    _[$_ >> 2] = 1;
                                    break c;
                                }
                                while (0)
                                if (e0(h, $I, $4) | 0) {
                                    k = _[(h + 992 + (_[K >> 2] << 2)) >> 2] | 0;
                                    $T = X(r + X(en(k, $4)));
                                    o[$e >> 2] = $T;
                                    k = q & ((_[(k + 4) >> 2] | 0) == 2);
                                    _[$_ >> 2] = ((no($T) | 0 | k) ^ 1) & 1;
                                    break;
                                } else {
                                    o[$e >> 2] = $4;
                                    _[$_ >> 2] = k ? 0 : 2;
                                    break;
                                }
                            } else {
                                $T = X(y - C);
                                x = X($T / p);
                                $T = X(p * $T);
                                _[$_ >> 2] = 1;
                                o[$e >> 2] = X(r + ($p ? x : $T));
                            }
                            while (0)
                            ex(h, $A, O, $y, $t, $i);
                            ex(h, $I, $4, $y, $_, $e);
                            do if (!(e0(h, $I, $4) | 0) ? (eI($, h) | 0) == 4 : 0) {
                                if ((_[((eS(h, $I) | 0) + 4) >> 2] | 0) == 3) {
                                    k = 0;
                                    break;
                                }
                                k = (_[((eT(h, $I) | 0) + 4) >> 2] | 0) != 3;
                            } else k = 0;
                            while (0)
                            $T = X(o[$i >> 2]);
                            x = X(o[$e >> 2]);
                            $x = _[$t >> 2] | 0;
                            $N = _[$_ >> 2] | 0;
                            rH(h, $p ? $T : x, $p ? x : $T, $C, $p ? $x : $N, $p ? $N : $x, $y, $v, v & (k ^ 1), 3488, b) | 0;
                            e[J >> 0] = e[J >> 0] | e[(h + 508) >> 0];
                            h = _[(h + 960) >> 2] | 0;
                        }while ((h | 0) != 0)
                    } else n = X(0.0);
                } else n = X(0.0);
                n = X(N + n);
                $N = (n < X(0.0)) & 1;
                e[J >> 0] = $N | t[J >> 0];
                if (U & (n > X(0.0))) {
                    k = _[j >> 2] | 0;
                    if ((_[($ + 364 + (k << 3) + 4) >> 2] | 0) != 0 ? (($6 = X(en(($ + 364 + (k << 3)) | 0, $5))), $6 >= X(0.0)) : 0) y = X(C7(X(0.0), X($6 - X(O - n))));
                    else y = X(0.0);
                } else y = n;
                I = L >>> 0 < T >>> 0;
                if (I) {
                    w = _[$M >> 2] | 0;
                    d = L;
                    k = 0;
                    do {
                        h = _[(w + (d << 2)) >> 2] | 0;
                        if (!(_[(h + 24) >> 2] | 0)) {
                            k = ((((_[((eS(h, $A) | 0) + 4) >> 2] | 0) == 3) & 1) + k) | 0;
                            k = (k + (((_[((eT(h, $A) | 0) + 4) >> 2] | 0) == 3) & 1)) | 0;
                        }
                        d = (d + 1) | 0;
                    }while ((d | 0) != (T | 0))
                    if (k) {
                        C = X(0.0);
                        r = X(0.0);
                    } else Z = 101;
                } else Z = 101;
                d: do if ((Z | 0) == 101) {
                    Z = 0;
                    switch(Q | 0){
                        case 1:
                            {
                                k = 0;
                                C = X(y * X(0.5));
                                r = X(0.0);
                                break d;
                            }
                        case 2:
                            {
                                k = 0;
                                C = y;
                                r = X(0.0);
                                break d;
                            }
                        case 3:
                            {
                                if (f >>> 0 <= 1) {
                                    k = 0;
                                    C = X(0.0);
                                    r = X(0.0);
                                    break d;
                                }
                                r = X(((f + -1) | 0) >>> 0);
                                k = 0;
                                C = X(0.0);
                                r = X(X(C7(y, X(0.0))) / r);
                                break d;
                            }
                        case 5:
                            {
                                r = X(y / X(((f + 1) | 0) >>> 0));
                                k = 0;
                                C = r;
                                break d;
                            }
                        case 4:
                            {
                                r = X(y / X(f >>> 0));
                                k = 0;
                                C = X(r * X(0.5));
                                break d;
                            }
                        default:
                            {
                                k = 0;
                                C = X(0.0);
                                r = X(0.0);
                                break d;
                            }
                    }
                }
                while (0)
                n = X(W + C);
                if (I) {
                    p = X(y / X(k | 0));
                    d = _[$M >> 2] | 0;
                    h = L;
                    y = X(0.0);
                    do {
                        k = _[(d + (h << 2)) >> 2] | 0;
                        e: do if ((_[(k + 36) >> 2] | 0) != 1) {
                            switch(_[(k + 24) >> 2] | 0){
                                case 1:
                                    {
                                        if (eN(k, $A) | 0) {
                                            if (!v) break e;
                                            $T = X(eL(k, $A, O));
                                            $T = X($T + X(e7($, $A)));
                                            $T = X($T + X(e6(k, $A, $y)));
                                            o[(k + 400 + (_[F >> 2] << 2)) >> 2] = $T;
                                            break e;
                                        }
                                        break;
                                    }
                                case 0:
                                    {
                                        $N = (_[((eS(k, $A) | 0) + 4) >> 2] | 0) == 3;
                                        $T = X(p + n);
                                        n = $N ? $T : n;
                                        if (v) {
                                            $N = (k + 400 + (_[F >> 2] << 2)) | 0;
                                            o[$N >> 2] = X(n + X(o[$N >> 2]));
                                        }
                                        $N = (_[((eT(k, $A) | 0) + 4) >> 2] | 0) == 3;
                                        $T = X(p + n);
                                        n = $N ? $T : n;
                                        if (R) {
                                            $T = X(r + X(rX(k, $A, $y)));
                                            y = $4;
                                            n = X(n + X($T + X(o[(k + 504) >> 2])));
                                            break e;
                                        } else {
                                            n = X(n + X(r + X(eO(k, $A, $y))));
                                            y = X(C7(y, X(eO(k, $I, $y))));
                                            break e;
                                        }
                                    }
                                default:
                                    {}
                            }
                            if (v) {
                                $T = X(C + X(e7($, $A)));
                                $N = (k + 400 + (_[F >> 2] << 2)) | 0;
                                o[$N >> 2] = X($T + X(o[$N >> 2]));
                            }
                        }
                        while (0)
                        h = (h + 1) | 0;
                    }while ((h | 0) != (T | 0))
                } else y = X(0.0);
                r = X($$ + n);
                if (z) C = X(X(eA($, $I, X($h + y), $k, c)) - $h);
                else C = $4;
                p = X(X(eA($, $I, X($h + (H ? $4 : y)), $k, c)) - $h);
                if (I & v) {
                    h = L;
                    do {
                        d = _[((_[$M >> 2] | 0) + (h << 2)) >> 2] | 0;
                        do if ((_[(d + 36) >> 2] | 0) != 1) {
                            if ((_[(d + 24) >> 2] | 0) == 1) {
                                if (eN(d, $I) | 0) {
                                    $T = X(eL(d, $I, $4));
                                    $T = X($T + X(e7($, $I)));
                                    $T = X($T + X(e6(d, $I, $y)));
                                    k = _[D >> 2] | 0;
                                    o[(d + 400 + (k << 2)) >> 2] = $T;
                                    if (!(no($T) | 0)) break;
                                } else k = _[D >> 2] | 0;
                                $T = X(e7($, $I));
                                o[(d + 400 + (k << 2)) >> 2] = X($T + X(e6(d, $I, $y)));
                                break;
                            }
                            k = eI($, d) | 0;
                            do if ((k | 0) == 4) {
                                if ((_[((eS(d, $I) | 0) + 4) >> 2] | 0) == 3) {
                                    Z = 139;
                                    break;
                                }
                                if ((_[((eT(d, $I) | 0) + 4) >> 2] | 0) == 3) {
                                    Z = 139;
                                    break;
                                }
                                if (e0(d, $I, $4) | 0) {
                                    n = m;
                                    break;
                                }
                                $x = _[(d + 908 + (_[j >> 2] << 2)) >> 2] | 0;
                                _[$e >> 2] = $x;
                                n = X(o[(d + 396) >> 2]);
                                $N = no(n) | 0;
                                y = ((_[l >> 2] = $x), X(o[l >> 2]));
                                if ($N) n = p;
                                else {
                                    N = X(rX(d, $I, $y));
                                    $T = X(y / n);
                                    n = X(n * y);
                                    n = X(N + ($p ? $T : n));
                                }
                                o[$i >> 2] = n;
                                o[$e >> 2] = X(X(rX(d, $A, $y)) + y);
                                _[$_ >> 2] = 1;
                                _[$t >> 2] = 1;
                                ex(d, $A, O, $y, $_, $e);
                                ex(d, $I, $4, $y, $t, $i);
                                n = X(o[$e >> 2]);
                                N = X(o[$i >> 2]);
                                $T = $p ? n : N;
                                n = $p ? N : n;
                                $N = ((no($T) | 0) ^ 1) & 1;
                                rH(d, $T, n, $C, $N, ((no(n) | 0) ^ 1) & 1, $y, $v, 1, 3493, b) | 0;
                                n = m;
                            } else Z = 139;
                            while (0)
                            f: do if ((Z | 0) == 139) {
                                Z = 0;
                                n = X(C - X(eO(d, $I, $y)));
                                do if ((_[((eS(d, $I) | 0) + 4) >> 2] | 0) == 3) {
                                    if ((_[((eT(d, $I) | 0) + 4) >> 2] | 0) != 3) break;
                                    n = X(m + X(C7(X(0.0), X(n * X(0.5)))));
                                    break f;
                                }
                                while (0)
                                if ((_[((eT(d, $I) | 0) + 4) >> 2] | 0) == 3) {
                                    n = m;
                                    break;
                                }
                                if ((_[((eS(d, $I) | 0) + 4) >> 2] | 0) == 3) {
                                    n = X(m + X(C7(X(0.0), n)));
                                    break;
                                }
                                switch(k | 0){
                                    case 1:
                                        {
                                            n = m;
                                            break f;
                                        }
                                    case 2:
                                        {
                                            n = X(m + X(n * X(0.5)));
                                            break f;
                                        }
                                    default:
                                        {
                                            n = X(m + n);
                                            break f;
                                        }
                                }
                            }
                            while (0)
                            $T = X($a + n);
                            $N = (d + 400 + (_[D >> 2] << 2)) | 0;
                            o[$N >> 2] = X($T + X(o[$N >> 2]));
                        }
                        while (0)
                        h = (h + 1) | 0;
                    }while ((h | 0) != (T | 0))
                }
                $a = X($a + p);
                $r = X(C7($r, r));
                f = (B + 1) | 0;
                if (T >>> 0 >= $g >>> 0) break;
                else {
                    n = O;
                    L = T;
                    B = f;
                }
            }
            do if (v) {
                k = f >>> 0 > 1;
                if (!k ? !(eP($) | 0) : 0) break;
                if (!(no($4) | 0)) {
                    n = X($4 - $a);
                    g: do switch(_[($ + 12) >> 2] | 0){
                        case 3:
                            {
                                m = X(m + n);
                                g = X(0.0);
                                break;
                            }
                        case 2:
                            {
                                m = X(m + X(n * X(0.5)));
                                g = X(0.0);
                                break;
                            }
                        case 4:
                            {
                                if ($4 > $a) g = X(n / X(f >>> 0));
                                else g = X(0.0);
                                break;
                            }
                        case 7:
                            if ($4 > $a) {
                                m = X(m + X(n / X((f << 1) >>> 0)));
                                g = X(n / X(f >>> 0));
                                g = k ? g : X(0.0);
                                break g;
                            } else {
                                m = X(m + X(n * X(0.5)));
                                g = X(0.0);
                                break g;
                            }
                        case 6:
                            {
                                g = X(n / X(B >>> 0));
                                g = ($4 > $a) & k ? g : X(0.0);
                                break;
                            }
                        default:
                            g = X(0.0);
                    }
                    while (0)
                    if (f | 0) {
                        I = (1040 + ($I << 2)) | 0;
                        S = (976 + ($I << 2)) | 0;
                        w = 0;
                        h = 0;
                        while(1){
                            h: do if (h >>> 0 < $g >>> 0) {
                                y = X(0.0);
                                p = X(0.0);
                                n = X(0.0);
                                d = h;
                                while(1){
                                    k = _[((_[$M >> 2] | 0) + (d << 2)) >> 2] | 0;
                                    do if ((_[(k + 36) >> 2] | 0) != 1 ? (_[(k + 24) >> 2] | 0) == 0 : 0) {
                                        if ((_[(k + 940) >> 2] | 0) != (w | 0)) break h;
                                        if (eE(k, $I) | 0) {
                                            $T = X(o[(k + 908 + (_[S >> 2] << 2)) >> 2]);
                                            n = X(C7(n, X($T + X(rX(k, $I, $y)))));
                                        }
                                        if ((eI($, k) | 0) != 5) break;
                                        $6 = X(eG(k));
                                        $6 = X($6 + X(e6(k, 0, $y)));
                                        $T = X(o[(k + 912) >> 2]);
                                        $T = X(X($T + X(rX(k, 0, $y))) - $6);
                                        $6 = X(C7(p, $6));
                                        $T = X(C7(y, $T));
                                        y = $T;
                                        p = $6;
                                        n = X(C7(n, X($6 + $T)));
                                    }
                                    while (0)
                                    k = (d + 1) | 0;
                                    if (k >>> 0 < $g >>> 0) d = k;
                                    else {
                                        d = k;
                                        break;
                                    }
                                }
                            } else {
                                p = X(0.0);
                                n = X(0.0);
                                d = h;
                            }
                            while (0)
                            M = X(g + n);
                            r = m;
                            m = X(m + M);
                            if (h >>> 0 < d >>> 0) {
                                C = X(r + p);
                                k = h;
                                do {
                                    h = _[((_[$M >> 2] | 0) + (k << 2)) >> 2] | 0;
                                    i: do if ((_[(h + 36) >> 2] | 0) != 1 ? (_[(h + 24) >> 2] | 0) == 0 : 0) switch(eI($, h) | 0){
                                        case 1:
                                            {
                                                $T = X(r + X(e6(h, $I, $y)));
                                                o[(h + 400 + (_[I >> 2] << 2)) >> 2] = $T;
                                                break i;
                                            }
                                        case 3:
                                            {
                                                $T = X(X(m - X(ea(h, $I, $y))) - X(o[(h + 908 + (_[S >> 2] << 2)) >> 2]));
                                                o[(h + 400 + (_[I >> 2] << 2)) >> 2] = $T;
                                                break i;
                                            }
                                        case 2:
                                            {
                                                $T = X(r + X(X(M - X(o[(h + 908 + (_[S >> 2] << 2)) >> 2])) * X(0.5)));
                                                o[(h + 400 + (_[I >> 2] << 2)) >> 2] = $T;
                                                break i;
                                            }
                                        case 4:
                                            {
                                                $T = X(r + X(e6(h, $I, $y)));
                                                o[(h + 400 + (_[I >> 2] << 2)) >> 2] = $T;
                                                if (e0(h, $I, $4) | 0) break i;
                                                if ($p) {
                                                    y = X(o[(h + 908) >> 2]);
                                                    n = X(y + X(rX(h, $A, $y)));
                                                    p = M;
                                                } else {
                                                    p = X(o[(h + 912) >> 2]);
                                                    p = X(p + X(rX(h, $I, $y)));
                                                    n = M;
                                                    y = X(o[(h + 908) >> 2]);
                                                }
                                                if (rY(n, y) | 0 ? rY(p, X(o[(h + 912) >> 2])) | 0 : 0) break i;
                                                rH(h, n, p, $C, 1, 1, $y, $v, 1, 3501, b) | 0;
                                                break i;
                                            }
                                        case 5:
                                            {
                                                o[(h + 404) >> 2] = X(X(C - X(eG(h))) + X(eL(h, 0, $4)));
                                                break i;
                                            }
                                        default:
                                            break i;
                                    }
                                    while (0)
                                    k = (k + 1) | 0;
                                }while ((k | 0) != (d | 0))
                            }
                            w = (w + 1) | 0;
                            if ((w | 0) == (f | 0)) break;
                            else h = d;
                        }
                    }
                }
            }
            while (0)
            o[($ + 908) >> 2] = X(eA($, 2, $7, c, c));
            o[($ + 912) >> 2] = X(eA($, 0, $l, a, c));
            if (($1 | 0) != 0 ? (($3 = _[($ + 32) >> 2] | 0), ($b = ($1 | 0) == 2), !($b & (($3 | 0) != 2))) : 0) {
                if ($b & (($3 | 0) == 2)) {
                    n = X($s + O);
                    n = X(C7(X(Cs(n, X(eB($, $A, $r, $5)))), $s));
                    Z = 198;
                }
            } else {
                n = X(eA($, $A, $r, $5, c));
                Z = 198;
            }
            if ((Z | 0) == 198) o[($ + 908 + (_[(976 + ($A << 2)) >> 2] << 2)) >> 2] = n;
            if (($d | 0) != 0 ? (($8 = _[($ + 32) >> 2] | 0), ($m = ($d | 0) == 2), !($m & (($8 | 0) != 2))) : 0) {
                if ($m & (($8 | 0) == 2)) {
                    n = X($h + $4);
                    n = X(C7(X(Cs(n, X(eB($, $I, X($h + $a), $k)))), $h));
                    Z = 204;
                }
            } else {
                n = X(eA($, $I, X($h + $a), $k, c));
                Z = 204;
            }
            if ((Z | 0) == 204) o[($ + 908 + (_[(976 + ($I << 2)) >> 2] << 2)) >> 2] = n;
            if (v) {
                if ((_[$w >> 2] | 0) == 2) {
                    h = (976 + ($I << 2)) | 0;
                    d = (1040 + ($I << 2)) | 0;
                    k = 0;
                    do {
                        w = ns($, k) | 0;
                        if (!(_[(w + 24) >> 2] | 0)) {
                            $x = _[h >> 2] | 0;
                            $T = X(o[($ + 908 + ($x << 2)) >> 2]);
                            $N = (w + 400 + (_[d >> 2] << 2)) | 0;
                            $T = X($T - X(o[$N >> 2]));
                            o[$N >> 2] = X($T - X(o[(w + 908 + ($x << 2)) >> 2]));
                        }
                        k = (k + 1) | 0;
                    }while ((k | 0) != ($g | 0))
                }
                if (i | 0) {
                    k = $p ? $1 : u;
                    do {
                        eR($, i, $y, k, $v, $C, b);
                        i = _[(i + 960) >> 2] | 0;
                    }while ((i | 0) != 0)
                }
                k = ($A | 2 | 0) == 3;
                h = ($I | 2 | 0) == 3;
                if (k | h) {
                    i = 0;
                    do {
                        d = _[((_[$M >> 2] | 0) + (i << 2)) >> 2] | 0;
                        if ((_[(d + 36) >> 2] | 0) != 1) {
                            if (k) eY($, d, $A);
                            if (h) eY($, d, $I);
                        }
                        i = (i + 1) | 0;
                    }while ((i | 0) != ($g | 0))
                }
            }
        } else eb($, n, r, u, f, c, a);
        while (0)
        s = $S;
        return;
    }
    function rW($, n) {
        $ = $ | 0;
        n = X(n);
        var r = 0;
        na($, n >= X(0.0), 3147);
        r = n == X(0.0);
        o[($ + 4) >> 2] = r ? X(0.0) : n;
        return;
    }
    function r9($, n, r, i) {
        $ = $ | 0;
        n = X(n);
        r = X(r);
        i = i | 0;
        var t = n0, u = n0, f = 0, c = 0, a = 0;
        _[2278] = (_[2278] | 0) + 1;
        e$($);
        if (!(e0($, 2, n) | 0)) {
            t = X(en(($ + 380) | 0, n));
            if (!(t >= X(0.0))) {
                a = ((no(n) | 0) ^ 1) & 1;
                t = n;
            } else a = 2;
        } else {
            t = X(en(_[($ + 992) >> 2] | 0, n));
            a = 1;
            t = X(t + X(rX($, 2, n)));
        }
        if (!(e0($, 0, r) | 0)) {
            u = X(en(($ + 388) | 0, r));
            if (!(u >= X(0.0))) {
                c = ((no(r) | 0) ^ 1) & 1;
                u = r;
            } else c = 2;
        } else {
            u = X(en(_[($ + 996) >> 2] | 0, r));
            c = 1;
            u = X(u + X(rX($, 0, n)));
        }
        f = ($ + 976) | 0;
        if (rH($, t, u, i, a, c, n, r, 1, 3189, _[f >> 2] | 0) | 0 ? (er($, _[($ + 496) >> 2] | 0, n, r, n), ee($, X(o[((_[f >> 2] | 0) + 4) >> 2]), X(0.0), X(0.0)), e[11696] | 0) : 0) rU($, 7);
        return;
    }
    function e$($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        u = (f + 24) | 0;
        t = (f + 16) | 0;
        e = (f + 8) | 0;
        i = f;
        r = 0;
        do {
            n = ($ + 380 + (r << 3)) | 0;
            if (!((_[($ + 380 + (r << 3) + 4) >> 2] | 0) != 0 ? ((o = n), (c = _[(o + 4) >> 2] | 0), (a = e), (_[a >> 2] = _[o >> 2]), (_[(a + 4) >> 2] = c), (a = ($ + 364 + (r << 3)) | 0), (c = _[(a + 4) >> 2] | 0), (o = i), (_[o >> 2] = _[a >> 2]), (_[(o + 4) >> 2] = c), (_[t >> 2] = _[e >> 2]), (_[(t + 4) >> 2] = _[(e + 4) >> 2]), (_[u >> 2] = _[i >> 2]), (_[(u + 4) >> 2] = _[(i + 4) >> 2]), rR(t, u) | 0) : 0)) n = ($ + 348 + (r << 3)) | 0;
            _[($ + 992 + (r << 2)) >> 2] = n;
            r = (r + 1) | 0;
        }while ((r | 0) != 2)
        s = f;
        return;
    }
    function e0($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0;
        $ = _[($ + 992 + (_[(976 + (n << 2)) >> 2] << 2)) >> 2] | 0;
        switch(_[($ + 4) >> 2] | 0){
            case 0:
            case 3:
                {
                    $ = 0;
                    break;
                }
            case 1:
                {
                    if (X(o[$ >> 2]) < X(0.0)) $ = 0;
                    else e = 5;
                    break;
                }
            case 2:
                {
                    if (X(o[$ >> 2]) < X(0.0)) $ = 0;
                    else $ = (no(r) | 0) ^ 1;
                    break;
                }
            default:
                e = 5;
        }
        if ((e | 0) == 5) $ = 1;
        return $ | 0;
    }
    function en($, n) {
        $ = $ | 0;
        n = X(n);
        switch(_[($ + 4) >> 2] | 0){
            case 2:
                {
                    n = X(X(X(o[$ >> 2]) * n) / X(100.0));
                    break;
                }
            case 1:
                {
                    n = X(o[$ >> 2]);
                    break;
                }
            default:
                n = X(p);
        }
        return X(n);
    }
    function er($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        e = X(e);
        i = X(i);
        var t = 0, u = n0;
        n = _[($ + 944) >> 2] | 0 ? n : 1;
        t = ev(_[($ + 4) >> 2] | 0, n) | 0;
        n = ed(t, n) | 0;
        r = X(eK($, t, r));
        e = X(eK($, n, e));
        u = X(r + X(e6($, t, i)));
        o[($ + 400 + (_[(1040 + (t << 2)) >> 2] << 2)) >> 2] = u;
        r = X(r + X(ea($, t, i)));
        o[($ + 400 + (_[(1e3 + (t << 2)) >> 2] << 2)) >> 2] = r;
        r = X(e + X(e6($, n, i)));
        o[($ + 400 + (_[(1040 + (n << 2)) >> 2] << 2)) >> 2] = r;
        i = X(e + X(ea($, n, i)));
        o[($ + 400 + (_[(1e3 + (n << 2)) >> 2] << 2)) >> 2] = i;
        return;
    }
    function ee($, n, r, e) {
        $ = $ | 0;
        n = X(n);
        r = X(r);
        e = X(e);
        var i = 0, t = 0, u = n0, f = n0, c = 0, a = 0, l = n0, v = 0, s = n0, b = n0, k = n0, h = n0;
        if (!(n == X(0.0))) {
            i = ($ + 400) | 0;
            h = X(o[i >> 2]);
            t = ($ + 404) | 0;
            k = X(o[t >> 2]);
            v = ($ + 416) | 0;
            b = X(o[v >> 2]);
            a = ($ + 420) | 0;
            u = X(o[a >> 2]);
            s = X(h + r);
            l = X(k + e);
            e = X(s + b);
            f = X(l + u);
            c = (_[($ + 988) >> 2] | 0) == 1;
            o[i >> 2] = X(rz(h, n, 0, c));
            o[t >> 2] = X(rz(k, n, 0, c));
            r = X(Cb(X(b * n), X(1.0)));
            if (rY(r, X(0.0)) | 0) t = 0;
            else t = (rY(r, X(1.0)) | 0) ^ 1;
            r = X(Cb(X(u * n), X(1.0)));
            if (rY(r, X(0.0)) | 0) i = 0;
            else i = (rY(r, X(1.0)) | 0) ^ 1;
            h = X(rz(e, n, c & t, c & (t ^ 1)));
            o[v >> 2] = X(h - X(rz(s, n, 0, c)));
            h = X(rz(f, n, c & i, c & (i ^ 1)));
            o[a >> 2] = X(h - X(rz(l, n, 0, c)));
            t = ((_[($ + 952) >> 2] | 0) - (_[($ + 948) >> 2] | 0)) >> 2;
            if (t | 0) {
                i = 0;
                do {
                    ee(ns($, i) | 0, n, s, l);
                    i = (i + 1) | 0;
                }while ((i | 0) != (t | 0))
            }
        }
        return;
    }
    function ei($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        switch(r | 0){
            case 5:
            case 0:
                {
                    $ = pq(_[489] | 0, e, i) | 0;
                    break;
                }
            default:
                $ = Ch(e, i) | 0;
        }
        return $ | 0;
    }
    function e_($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        i = s;
        s = (s + 16) | 0;
        t = i;
        _[t >> 2] = e;
        et($, 0, n, r, t);
        s = i;
        return;
    }
    function et($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        $ = $ | 0 ? $ : 956;
        MZ[_[($ + 8) >> 2] & 1]($, n, r, e, i) | 0;
        if ((r | 0) == 5) $Y();
        else return;
    }
    function e2($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e[($ + n) >> 0] = r & 1;
        return;
    }
    function eu($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        _[$ >> 2] = 0;
        _[($ + 4) >> 2] = 0;
        _[($ + 8) >> 2] = 0;
        r = (n + 4) | 0;
        e = ((_[r >> 2] | 0) - (_[n >> 2] | 0)) >> 2;
        if (e | 0) {
            ef($, e);
            eo($, _[n >> 2] | 0, _[r >> 2] | 0, e);
        }
        return;
    }
    function ef($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        if ((ec($) | 0) >>> 0 < n >>> 0) Cd($);
        if (n >>> 0 > 1073741823) $Y();
        else {
            r = CM(n << 2) | 0;
            _[($ + 4) >> 2] = r;
            _[$ >> 2] = r;
            _[($ + 8) >> 2] = r + (n << 2);
            return;
        }
    }
    function eo($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        e = ($ + 4) | 0;
        $ = (r - n) | 0;
        if (($ | 0) > 0) {
            CE(_[e >> 2] | 0, n | 0, $ | 0) | 0;
            _[e >> 2] = (_[e >> 2] | 0) + (($ >>> 2) << 2);
        }
        return;
    }
    function ec($) {
        $ = $ | 0;
        return 1073741823;
    }
    function e6($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        if (e1(n) | 0 ? (_[($ + 96) >> 2] | 0) != 0 : 0) $ = ($ + 92) | 0;
        else $ = nc(($ + 60) | 0, _[(1040 + (n << 2)) >> 2] | 0, 992) | 0;
        return X(e4($, r));
    }
    function ea($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        if (e1(n) | 0 ? (_[($ + 104) >> 2] | 0) != 0 : 0) $ = ($ + 100) | 0;
        else $ = nc(($ + 60) | 0, _[(1e3 + (n << 2)) >> 2] | 0, 992) | 0;
        return X(e4($, r));
    }
    function e1($) {
        $ = $ | 0;
        return (($ | 1 | 0) == 3) | 0;
    }
    function e4($, n) {
        $ = $ | 0;
        n = X(n);
        if ((_[($ + 4) >> 2] | 0) == 3) n = X(0.0);
        else n = X(en($, n));
        return X(n);
    }
    function el($, n) {
        $ = $ | 0;
        n = n | 0;
        $ = _[$ >> 2] | 0;
        return (($ | 0) == 0 ? ((n | 0) > 1 ? n : 1) : $) | 0;
    }
    function ev($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        a: do if ((n | 0) == 2) {
            switch($ | 0){
                case 2:
                    {
                        $ = 3;
                        break a;
                    }
                case 3:
                    break;
                default:
                    {
                        r = 4;
                        break a;
                    }
            }
            $ = 2;
        } else r = 4;
        while (0)
        return $ | 0;
    }
    function e7($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = n0;
        if (!((e1(n) | 0 ? (_[($ + 312) >> 2] | 0) != 0 : 0) ? ((r = X(o[($ + 308) >> 2])), r >= X(0.0)) : 0)) r = X(C7(X(o[(nc(($ + 276) | 0, _[(1040 + (n << 2)) >> 2] | 0, 992) | 0) >> 2]), X(0.0)));
        return X(r);
    }
    function e5($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = n0;
        if (!((e1(n) | 0 ? (_[($ + 320) >> 2] | 0) != 0 : 0) ? ((r = X(o[($ + 316) >> 2])), r >= X(0.0)) : 0)) r = X(C7(X(o[(nc(($ + 276) | 0, _[(1e3 + (n << 2)) >> 2] | 0, 992) | 0) >> 2]), X(0.0)));
        return X(r);
    }
    function es($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = n0;
        if (!((e1(n) | 0 ? (_[($ + 240) >> 2] | 0) != 0 : 0) ? ((e = X(en(($ + 236) | 0, r))), e >= X(0.0)) : 0)) e = X(C7(X(en(nc(($ + 204) | 0, _[(1040 + (n << 2)) >> 2] | 0, 992) | 0, r)), X(0.0)));
        return X(e);
    }
    function e3($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = n0;
        if (!((e1(n) | 0 ? (_[($ + 248) >> 2] | 0) != 0 : 0) ? ((e = X(en(($ + 244) | 0, r))), e >= X(0.0)) : 0)) e = X(C7(X(en(nc(($ + 204) | 0, _[(1e3 + (n << 2)) >> 2] | 0, 992) | 0, r)), X(0.0)));
        return X(e);
    }
    function eb($, n, r, e, i, t, u) {
        $ = $ | 0;
        n = X(n);
        r = X(r);
        e = e | 0;
        i = i | 0;
        t = X(t);
        u = X(u);
        var f = n0, c = n0, a = n0, l = n0, v = n0, b = n0, k = 0, h = 0, d = 0;
        d = s;
        s = (s + 16) | 0;
        k = d;
        h = ($ + 964) | 0;
        nh($, (_[h >> 2] | 0) != 0, 3519);
        f = X(em($, 2, n));
        c = X(em($, 0, n));
        a = X(rX($, 2, n));
        l = X(rX($, 0, n));
        if (no(n) | 0) v = n;
        else v = X(C7(X(0.0), X(X(n - a) - f)));
        if (no(r) | 0) b = r;
        else b = X(C7(X(0.0), X(X(r - l) - c)));
        if (((e | 0) == 1) & ((i | 0) == 1)) {
            o[($ + 908) >> 2] = X(eA($, 2, X(n - a), t, t));
            n = X(eA($, 0, X(r - l), u, t));
        } else {
            MQ[_[h >> 2] & 1](k, $, v, e, b, i);
            v = X(f + X(o[k >> 2]));
            b = X(n - a);
            o[($ + 908) >> 2] = X(eA($, 2, (e | 2 | 0) == 2 ? v : b, t, t));
            b = X(c + X(o[(k + 4) >> 2]));
            n = X(r - l);
            n = X(eA($, 0, (i | 2 | 0) == 2 ? b : n, u, t));
        }
        o[($ + 912) >> 2] = n;
        s = d;
        return;
    }
    function ek($, n, r, e, i, _, t) {
        $ = $ | 0;
        n = X(n);
        r = X(r);
        e = e | 0;
        i = i | 0;
        _ = X(_);
        t = X(t);
        var u = n0, f = n0, c = n0, a = n0;
        c = X(em($, 2, _));
        u = X(em($, 0, _));
        a = X(rX($, 2, _));
        f = X(rX($, 0, _));
        n = X(n - a);
        o[($ + 908) >> 2] = X(eA($, 2, (e | 2 | 0) == 2 ? c : n, _, _));
        r = X(r - f);
        o[($ + 912) >> 2] = X(eA($, 0, (i | 2 | 0) == 2 ? u : r, t, _));
        return;
    }
    function eh($, n, r, e, i, _, t) {
        $ = $ | 0;
        n = X(n);
        r = X(r);
        e = e | 0;
        i = i | 0;
        _ = X(_);
        t = X(t);
        var u = 0, f = n0, c = n0;
        u = (e | 0) == 2;
        if ((!((n <= X(0.0)) & u) ? !((r <= X(0.0)) & ((i | 0) == 2)) : 0) ? !(((e | 0) == 1) & ((i | 0) == 1)) : 0) $ = 0;
        else {
            f = X(rX($, 0, _));
            c = X(rX($, 2, _));
            u = ((n < X(0.0)) & u) | (no(n) | 0);
            n = X(n - c);
            o[($ + 908) >> 2] = X(eA($, 2, u ? X(0.0) : n, _, _));
            n = X(r - f);
            u = ((r < X(0.0)) & ((i | 0) == 2)) | (no(r) | 0);
            o[($ + 912) >> 2] = X(eA($, 0, u ? X(0.0) : n, t, _));
            $ = 1;
        }
        return $ | 0;
    }
    function ed($, n) {
        $ = $ | 0;
        n = n | 0;
        if (eU($) | 0) $ = ev(2, n) | 0;
        else $ = 0;
        return $ | 0;
    }
    function ew($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        r = X(es($, n, r));
        return X(r + X(e7($, n)));
    }
    function e8($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        r = X(e3($, n, r));
        return X(r + X(e5($, n)));
    }
    function em($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = n0;
        e = X(ew($, n, r));
        return X(e + X(e8($, n, r)));
    }
    function ey($) {
        $ = $ | 0;
        if (!(_[($ + 24) >> 2] | 0)) {
            if (X(ep($)) != X(0.0)) $ = 1;
            else $ = X(eC($)) != X(0.0);
        } else $ = 0;
        return $ | 0;
    }
    function ep($) {
        $ = $ | 0;
        var n = n0;
        if (_[($ + 944) >> 2] | 0) {
            n = X(o[($ + 44) >> 2]);
            if (no(n) | 0) {
                n = X(o[($ + 40) >> 2]);
                $ = (n > X(0.0)) & ((no(n) | 0) ^ 1);
                return X($ ? n : X(0.0));
            }
        } else n = X(0.0);
        return X(n);
    }
    function eC($) {
        $ = $ | 0;
        var n = n0, r = 0, i = n0;
        do if (_[($ + 944) >> 2] | 0) {
            n = X(o[($ + 48) >> 2]);
            if (no(n) | 0) {
                r = e[((_[($ + 976) >> 2] | 0) + 2) >> 0] | 0;
                if ((r << 24) >> 24 == 0 ? ((i = X(o[($ + 40) >> 2])), (i < X(0.0)) & ((no(i) | 0) ^ 1)) : 0) {
                    n = X(-i);
                    break;
                }
                n = (r << 24) >> 24 ? X(1.0) : X(0.0);
            }
        } else n = X(0.0);
        while (0)
        return X(n);
    }
    function eM($) {
        $ = $ | 0;
        var n = 0, r = 0;
        CL(($ + 400) | 0, 0, 540) | 0;
        e[($ + 985) >> 0] = 1;
        nC($);
        r = n5($) | 0;
        if (r | 0) {
            n = ($ + 948) | 0;
            $ = 0;
            do {
                eM(_[((_[n >> 2] | 0) + ($ << 2)) >> 2] | 0);
                $ = ($ + 1) | 0;
            }while (($ | 0) != (r | 0))
        }
        return;
    }
    function eg($, n, r, e, i, t, u, f, c, a) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        e = e | 0;
        i = X(i);
        t = X(t);
        u = X(u);
        f = f | 0;
        c = c | 0;
        a = a | 0;
        var l = 0, v = n0, b = 0, k = 0, h = n0, d = n0, w = 0, m = n0, y = 0, C = n0, M = 0, g = 0, A = 0, I = 0, S = 0, T = 0, x = 0, N = 0, L = 0, O = 0;
        L = s;
        s = (s + 16) | 0;
        A = (L + 12) | 0;
        I = (L + 8) | 0;
        S = (L + 4) | 0;
        T = L;
        N = ev(_[($ + 4) >> 2] | 0, c) | 0;
        M = e1(N) | 0;
        v = X(en(ej(n) | 0, M ? t : u));
        g = e0(n, 2, t) | 0;
        x = e0(n, 0, u) | 0;
        do if (!(no(v) | 0) ? !(no(M ? r : i) | 0) : 0) {
            l = (n + 504) | 0;
            if (!(no(X(o[l >> 2])) | 0)) {
                if (!(ez(_[(n + 976) >> 2] | 0, 0) | 0)) break;
                if ((_[(n + 500) >> 2] | 0) == (_[2278] | 0)) break;
            }
            o[l >> 2] = X(C7(v, X(em(n, N, t))));
        } else b = 7;
        while (0)
        do if ((b | 0) == 7) {
            y = M ^ 1;
            if (!(y | (g ^ 1))) {
                u = X(en(_[(n + 992) >> 2] | 0, t));
                o[(n + 504) >> 2] = X(C7(u, X(em(n, 2, t))));
                break;
            }
            if (!(M | (x ^ 1))) {
                u = X(en(_[(n + 996) >> 2] | 0, u));
                o[(n + 504) >> 2] = X(C7(u, X(em(n, 0, t))));
                break;
            }
            o[A >> 2] = X(p);
            o[I >> 2] = X(p);
            _[S >> 2] = 0;
            _[T >> 2] = 0;
            m = X(rX(n, 2, t));
            C = X(rX(n, 0, t));
            if (g) {
                h = X(m + X(en(_[(n + 992) >> 2] | 0, t)));
                o[A >> 2] = h;
                _[S >> 2] = 1;
                k = 1;
            } else {
                k = 0;
                h = X(p);
            }
            if (x) {
                v = X(C + X(en(_[(n + 996) >> 2] | 0, u)));
                o[I >> 2] = v;
                _[T >> 2] = 1;
                l = 1;
            } else {
                l = 0;
                v = X(p);
            }
            b = _[($ + 32) >> 2] | 0;
            if (!(M & ((b | 0) == 2))) {
                if (no(h) | 0 ? !(no(r) | 0) : 0) {
                    o[A >> 2] = r;
                    _[S >> 2] = 2;
                    k = 2;
                    h = r;
                }
            } else b = 2;
            if ((!(((b | 0) == 2) & y) ? no(v) | 0 : 0) ? !(no(i) | 0) : 0) {
                o[I >> 2] = i;
                _[T >> 2] = 2;
                l = 2;
                v = i;
            }
            d = X(o[(n + 396) >> 2]);
            w = no(d) | 0;
            do if (!w) {
                if (((k | 0) == 1) & y) {
                    o[I >> 2] = X(X(h - m) / d);
                    _[T >> 2] = 1;
                    l = 1;
                    b = 1;
                    break;
                }
                if (M & ((l | 0) == 1)) {
                    o[A >> 2] = X(d * X(v - C));
                    _[S >> 2] = 1;
                    l = 1;
                    b = 1;
                } else b = k;
            } else b = k;
            while (0)
            O = no(r) | 0;
            k = (eI($, n) | 0) != 4;
            if (!(M | g | (((e | 0) != 1) | O) | (k | ((b | 0) == 1))) ? ((o[A >> 2] = r), (_[S >> 2] = 1), !w) : 0) {
                o[I >> 2] = X(X(r - m) / d);
                _[T >> 2] = 1;
                l = 1;
            }
            if (!(x | y | (((f | 0) != 1) | (no(i) | 0)) | (k | ((l | 0) == 1))) ? ((o[I >> 2] = i), (_[T >> 2] = 1), !w) : 0) {
                o[A >> 2] = X(d * X(i - C));
                _[S >> 2] = 1;
            }
            ex(n, 2, t, t, S, A);
            ex(n, 0, u, t, T, I);
            r = X(o[A >> 2]);
            i = X(o[I >> 2]);
            rH(n, r, i, c, _[S >> 2] | 0, _[T >> 2] | 0, t, u, 0, 3565, a) | 0;
            u = X(o[(n + 908 + (_[(976 + (N << 2)) >> 2] << 2)) >> 2]);
            o[(n + 504) >> 2] = X(C7(u, X(em(n, N, t))));
        }
        while (0)
        _[(n + 500) >> 2] = _[2278];
        s = L;
        return;
    }
    function eA($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        e = X(e);
        i = X(i);
        e = X(eB($, n, r, e));
        return X(C7(e, X(em($, n, i))));
    }
    function eI($, n) {
        $ = $ | 0;
        n = n | 0;
        n = (n + 20) | 0;
        n = _[((_[n >> 2] | 0) == 0 ? ($ + 16) | 0 : n) >> 2] | 0;
        if ((n | 0) == 5 ? eU(_[($ + 4) >> 2] | 0) | 0 : 0) n = 1;
        return n | 0;
    }
    function eS($, n) {
        $ = $ | 0;
        n = n | 0;
        if (e1(n) | 0 ? (_[($ + 96) >> 2] | 0) != 0 : 0) n = 4;
        else n = _[(1040 + (n << 2)) >> 2] | 0;
        return ($ + 60 + (n << 3)) | 0;
    }
    function eT($, n) {
        $ = $ | 0;
        n = n | 0;
        if (e1(n) | 0 ? (_[($ + 104) >> 2] | 0) != 0 : 0) n = 5;
        else n = _[(1e3 + (n << 2)) >> 2] | 0;
        return ($ + 60 + (n << 3)) | 0;
    }
    function ex($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        e = X(e);
        i = i | 0;
        t = t | 0;
        r = X(en(($ + 380 + (_[(976 + (n << 2)) >> 2] << 3)) | 0, r));
        r = X(r + X(rX($, n, e)));
        switch(_[i >> 2] | 0){
            case 2:
            case 1:
                {
                    i = no(r) | 0;
                    e = X(o[t >> 2]);
                    o[t >> 2] = i | (e < r) ? e : r;
                    break;
                }
            case 0:
                {
                    if (!(no(r) | 0)) {
                        _[i >> 2] = 2;
                        o[t >> 2] = r;
                    }
                    break;
                }
            default:
                {}
        }
        return;
    }
    function eN($, n) {
        $ = $ | 0;
        n = n | 0;
        $ = ($ + 132) | 0;
        if (e1(n) | 0 ? (_[((nc($, 4, 948) | 0) + 4) >> 2] | 0) != 0 : 0) $ = 1;
        else $ = (_[((nc($, _[(1040 + (n << 2)) >> 2] | 0, 948) | 0) + 4) >> 2] | 0) != 0;
        return $ | 0;
    }
    function eL($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0, i = 0;
        $ = ($ + 132) | 0;
        if (e1(n) | 0 ? ((e = nc($, 4, 948) | 0), (_[(e + 4) >> 2] | 0) != 0) : 0) i = 4;
        else {
            e = nc($, _[(1040 + (n << 2)) >> 2] | 0, 948) | 0;
            if (!(_[(e + 4) >> 2] | 0)) r = X(0.0);
            else i = 4;
        }
        if ((i | 0) == 4) r = X(en(e, r));
        return X(r);
    }
    function eO($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = n0;
        e = X(o[($ + 908 + (_[(976 + (n << 2)) >> 2] << 2)) >> 2]);
        e = X(e + X(e6($, n, r)));
        return X(e + X(ea($, n, r)));
    }
    function eP($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        a: do if (!(eU(_[($ + 4) >> 2] | 0) | 0)) {
            if ((_[($ + 16) >> 2] | 0) != 5) {
                r = n5($) | 0;
                if (!r) n = 0;
                else {
                    n = 0;
                    while(1){
                        e = ns($, n) | 0;
                        if ((_[(e + 24) >> 2] | 0) == 0 ? (_[(e + 20) >> 2] | 0) == 5 : 0) {
                            n = 1;
                            break a;
                        }
                        n = (n + 1) | 0;
                        if (n >>> 0 >= r >>> 0) {
                            n = 0;
                            break;
                        }
                    }
                }
            } else n = 1;
        } else n = 0;
        while (0)
        return n | 0;
    }
    function eE($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = n0;
        r = X(o[($ + 908 + (_[(976 + (n << 2)) >> 2] << 2)) >> 2]);
        return ((r >= X(0.0)) & ((no(r) | 0) ^ 1)) | 0;
    }
    function eG($) {
        $ = $ | 0;
        var n = n0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, c = n0;
        r = _[($ + 968) >> 2] | 0;
        if (!r) {
            t = n5($) | 0;
            do if (t | 0) {
                r = 0;
                i = 0;
                while(1){
                    e = ns($, i) | 0;
                    if (_[(e + 940) >> 2] | 0) {
                        u = 8;
                        break;
                    }
                    if ((_[(e + 24) >> 2] | 0) != 1) {
                        f = (eI($, e) | 0) == 5;
                        if (f) {
                            r = e;
                            break;
                        } else r = (r | 0) == 0 ? e : r;
                    }
                    i = (i + 1) | 0;
                    if (i >>> 0 >= t >>> 0) {
                        u = 8;
                        break;
                    }
                }
                if ((u | 0) == 8) if (!r) break;
                n = X(eG(r));
                return X(n + X(o[(r + 404) >> 2]));
            }
            while (0)
            n = X(o[($ + 912) >> 2]);
        } else {
            c = X(o[($ + 908) >> 2]);
            n = X(o[($ + 912) >> 2]);
            n = X(MP[r & 0]($, c, n));
            nh($, (no(n) | 0) ^ 1, 3573);
        }
        return X(n);
    }
    function eB($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        e = X(e);
        var i = n0, _ = 0;
        if (!(eU(n) | 0)) {
            if (e1(n) | 0) {
                n = 0;
                _ = 3;
            } else {
                e = X(p);
                i = X(p);
            }
        } else {
            n = 1;
            _ = 3;
        }
        if ((_ | 0) == 3) {
            i = X(en(($ + 364 + (n << 3)) | 0, e));
            e = X(en(($ + 380 + (n << 3)) | 0, e));
        }
        _ = (e < r) & ((e >= X(0.0)) & ((no(e) | 0) ^ 1));
        r = _ ? e : r;
        _ = (i >= X(0.0)) & ((no(i) | 0) ^ 1) & (r < i);
        return X(_ ? i : r);
    }
    function eR($, n, r, e, i, t, u) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        e = e | 0;
        i = X(i);
        t = t | 0;
        u = u | 0;
        var f = n0, c = n0, a = 0, l = 0, v = n0, s = n0, b = n0, k = 0, h = 0, d = 0, w = 0, m = n0, y = 0;
        d = ev(_[($ + 4) >> 2] | 0, t) | 0;
        k = ed(d, t) | 0;
        h = e1(d) | 0;
        v = X(rX(n, 2, r));
        s = X(rX(n, 0, r));
        if (!(e0(n, 2, r) | 0)) {
            if (eN(n, 2) | 0 ? eD(n, 2) | 0 : 0) {
                f = X(o[($ + 908) >> 2]);
                c = X(e7($, 2));
                c = X(f - X(c + X(e5($, 2))));
                f = X(eL(n, 2, r));
                f = X(eA(n, 2, X(c - X(f + X(eF(n, 2, r)))), r, r));
            } else f = X(p);
        } else f = X(v + X(en(_[(n + 992) >> 2] | 0, r)));
        if (!(e0(n, 0, i) | 0)) {
            if (eN(n, 0) | 0 ? eD(n, 0) | 0 : 0) {
                c = X(o[($ + 912) >> 2]);
                m = X(e7($, 0));
                m = X(c - X(m + X(e5($, 0))));
                c = X(eL(n, 0, i));
                c = X(eA(n, 0, X(m - X(c + X(eF(n, 0, i)))), i, r));
            } else c = X(p);
        } else c = X(s + X(en(_[(n + 996) >> 2] | 0, i)));
        a = no(f) | 0;
        l = no(c) | 0;
        do if (a ^ l ? ((b = X(o[(n + 396) >> 2])), !(no(b) | 0)) : 0) if (a) {
            f = X(v + X(X(c - s) * b));
            break;
        } else {
            m = X(s + X(X(f - v) / b));
            c = l ? m : c;
            break;
        }
        while (0)
        l = no(f) | 0;
        a = no(c) | 0;
        if (l | a) {
            y = (l ^ 1) & 1;
            e = (r > X(0.0)) & (((e | 0) != 0) & l);
            f = h ? f : e ? r : f;
            rH(n, f, c, t, h ? y : e ? 2 : y, l & (a ^ 1) & 1, f, c, 0, 3623, u) | 0;
            f = X(o[(n + 908) >> 2]);
            f = X(f + X(rX(n, 2, r)));
            c = X(o[(n + 912) >> 2]);
            c = X(c + X(rX(n, 0, r)));
        }
        rH(n, f, c, t, 1, 1, f, c, 1, 3635, u) | 0;
        if (eD(n, d) | 0 ? !(eN(n, d) | 0) : 0) {
            y = _[(976 + (d << 2)) >> 2] | 0;
            m = X(o[($ + 908 + (y << 2)) >> 2]);
            m = X(m - X(o[(n + 908 + (y << 2)) >> 2]));
            m = X(m - X(e5($, d)));
            m = X(m - X(ea(n, d, r)));
            m = X(m - X(eF(n, d, h ? r : i)));
            o[(n + 400 + (_[(1040 + (d << 2)) >> 2] << 2)) >> 2] = m;
        } else w = 21;
        do if ((w | 0) == 21) {
            if (!(eN(n, d) | 0) ? (_[($ + 8) >> 2] | 0) == 1 : 0) {
                y = _[(976 + (d << 2)) >> 2] | 0;
                m = X(o[($ + 908 + (y << 2)) >> 2]);
                m = X(X(m - X(o[(n + 908 + (y << 2)) >> 2])) * X(0.5));
                o[(n + 400 + (_[(1040 + (d << 2)) >> 2] << 2)) >> 2] = m;
                break;
            }
            if (!(eN(n, d) | 0) ? (_[($ + 8) >> 2] | 0) == 2 : 0) {
                y = _[(976 + (d << 2)) >> 2] | 0;
                m = X(o[($ + 908 + (y << 2)) >> 2]);
                m = X(m - X(o[(n + 908 + (y << 2)) >> 2]));
                o[(n + 400 + (_[(1040 + (d << 2)) >> 2] << 2)) >> 2] = m;
            }
        }
        while (0)
        if (eD(n, k) | 0 ? !(eN(n, k) | 0) : 0) {
            y = _[(976 + (k << 2)) >> 2] | 0;
            m = X(o[($ + 908 + (y << 2)) >> 2]);
            m = X(m - X(o[(n + 908 + (y << 2)) >> 2]));
            m = X(m - X(e5($, k)));
            m = X(m - X(ea(n, k, r)));
            m = X(m - X(eF(n, k, h ? i : r)));
            o[(n + 400 + (_[(1040 + (k << 2)) >> 2] << 2)) >> 2] = m;
        } else w = 30;
        do if ((w | 0) == 30 ? !(eN(n, k) | 0) : 0) {
            if ((eI($, n) | 0) == 2) {
                y = _[(976 + (k << 2)) >> 2] | 0;
                m = X(o[($ + 908 + (y << 2)) >> 2]);
                m = X(X(m - X(o[(n + 908 + (y << 2)) >> 2])) * X(0.5));
                o[(n + 400 + (_[(1040 + (k << 2)) >> 2] << 2)) >> 2] = m;
                break;
            }
            y = (eI($, n) | 0) == 3;
            if (y ^ ((_[($ + 28) >> 2] | 0) == 2)) {
                y = _[(976 + (k << 2)) >> 2] | 0;
                m = X(o[($ + 908 + (y << 2)) >> 2]);
                m = X(m - X(o[(n + 908 + (y << 2)) >> 2]));
                o[(n + 400 + (_[(1040 + (k << 2)) >> 2] << 2)) >> 2] = m;
            }
        }
        while (0)
        return;
    }
    function eY($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = n0, i = 0;
        i = _[(976 + (r << 2)) >> 2] | 0;
        e = X(o[(n + 908 + (i << 2)) >> 2]);
        e = X(X(o[($ + 908 + (i << 2)) >> 2]) - e);
        e = X(e - X(o[(n + 400 + (_[(1040 + (r << 2)) >> 2] << 2)) >> 2]));
        o[(n + 400 + (_[(1e3 + (r << 2)) >> 2] << 2)) >> 2] = e;
        return;
    }
    function eU($) {
        $ = $ | 0;
        return (($ | 1 | 0) == 1) | 0;
    }
    function ej($) {
        $ = $ | 0;
        var n = n0;
        switch(_[($ + 56) >> 2] | 0){
            case 0:
            case 3:
                {
                    n = X(o[($ + 40) >> 2]);
                    if ((n > X(0.0)) & ((no(n) | 0) ^ 1)) $ = e[((_[($ + 976) >> 2] | 0) + 2) >> 0] | 0 ? 1056 : 992;
                    else $ = 1056;
                    break;
                }
            default:
                $ = ($ + 52) | 0;
        }
        return $ | 0;
    }
    function ez($, n) {
        $ = $ | 0;
        n = n | 0;
        return ((e[($ + n) >> 0] | 0) != 0) | 0;
    }
    function eD($, n) {
        $ = $ | 0;
        n = n | 0;
        $ = ($ + 132) | 0;
        if (e1(n) | 0 ? (_[((nc($, 5, 948) | 0) + 4) >> 2] | 0) != 0 : 0) $ = 1;
        else $ = (_[((nc($, _[(1e3 + (n << 2)) >> 2] | 0, 948) | 0) + 4) >> 2] | 0) != 0;
        return $ | 0;
    }
    function eF($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        var e = 0, i = 0;
        $ = ($ + 132) | 0;
        if (e1(n) | 0 ? ((e = nc($, 5, 948) | 0), (_[(e + 4) >> 2] | 0) != 0) : 0) i = 4;
        else {
            e = nc($, _[(1e3 + (n << 2)) >> 2] | 0, 948) | 0;
            if (!(_[(e + 4) >> 2] | 0)) r = X(0.0);
            else i = 4;
        }
        if ((i | 0) == 4) r = X(en(e, r));
        return X(r);
    }
    function eK($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        if (eN($, n) | 0) r = X(eL($, n, r));
        else r = X(-X(eF($, n, r)));
        return X(r);
    }
    function eq($) {
        $ = X($);
        return ((o[l >> 2] = $), _[l >> 2] | 0) | 0;
    }
    function eH($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 1073741823) $Y();
            else {
                i = CM(n << 2) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 2)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 2);
        return;
    }
    function eX($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 2)) << 2)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function eZ($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -4 - n) | 0) >>> 2) << 2);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function eJ($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0;
        u = ($ + 4) | 0;
        f = _[u >> 2] | 0;
        i = (f - e) | 0;
        t = i >> 2;
        $ = (n + (t << 2)) | 0;
        if ($ >>> 0 < r >>> 0) {
            e = f;
            do {
                _[e >> 2] = _[$ >> 2];
                $ = ($ + 4) | 0;
                e = ((_[u >> 2] | 0) + 4) | 0;
                _[u >> 2] = e;
            }while ($ >>> 0 < r >>> 0)
        }
        if (t | 0) CU((f + ((0 - t) << 2)) | 0, n | 0, i | 0) | 0;
        return;
    }
    function eQ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = (n + 4) | 0;
        o = _[f >> 2] | 0;
        i = _[$ >> 2] | 0;
        u = r;
        t = (u - i) | 0;
        e = (o + ((0 - (t >> 2)) << 2)) | 0;
        _[f >> 2] = e;
        if ((t | 0) > 0) CE(e | 0, i | 0, t | 0) | 0;
        i = ($ + 4) | 0;
        t = (n + 8) | 0;
        e = ((_[i >> 2] | 0) - u) | 0;
        if ((e | 0) > 0) {
            CE(_[t >> 2] | 0, r | 0, e | 0) | 0;
            _[t >> 2] = (_[t >> 2] | 0) + ((e >>> 2) << 2);
        }
        u = _[$ >> 2] | 0;
        _[$ >> 2] = _[f >> 2];
        _[f >> 2] = u;
        u = _[i >> 2] | 0;
        _[i >> 2] = _[t >> 2];
        _[t >> 2] = u;
        u = ($ + 8) | 0;
        r = (n + 12) | 0;
        $ = _[u >> 2] | 0;
        _[u >> 2] = _[r >> 2];
        _[r >> 2] = $;
        _[n >> 2] = _[f >> 2];
        return o | 0;
    }
    function eV($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        u = _[n >> 2] | 0;
        t = _[r >> 2] | 0;
        if ((u | 0) != (t | 0)) {
            i = ($ + 8) | 0;
            r = ((((t + -4 - u) | 0) >>> 2) + 1) | 0;
            $ = u;
            e = _[i >> 2] | 0;
            do {
                _[e >> 2] = _[$ >> 2];
                e = ((_[i >> 2] | 0) + 4) | 0;
                _[i >> 2] = e;
                $ = ($ + 4) | 0;
            }while (($ | 0) != (t | 0))
            _[n >> 2] = u + (r << 2);
        }
        return;
    }
    function eW() {
        nu();
        return;
    }
    function e9() {
        var $ = 0;
        $ = CM(4) | 0;
        i$($);
        return $ | 0;
    }
    function i$($) {
        $ = $ | 0;
        _[$ >> 2] = nw() | 0;
        return;
    }
    function i0($) {
        $ = $ | 0;
        if ($ | 0) {
            ir($);
            CA($);
        }
        return;
    }
    function ir($) {
        $ = $ | 0;
        nm(_[$ >> 2] | 0);
        return;
    }
    function ie($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e2(_[$ >> 2] | 0, n, r);
        return;
    }
    function ii($, n) {
        $ = $ | 0;
        n = X(n);
        rW(_[$ >> 2] | 0, n);
        return;
    }
    function i_($, n) {
        $ = $ | 0;
        n = n | 0;
        return ez(_[$ >> 2] | 0, n) | 0;
    }
    function it() {
        var $ = 0;
        $ = CM(8) | 0;
        i2($, 0);
        return $ | 0;
    }
    function i2($, n) {
        $ = $ | 0;
        n = n | 0;
        if (!n) n = n1() | 0;
        else n = n6(_[n >> 2] | 0) | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = 0;
        nO(n, $);
        return;
    }
    function iu($) {
        $ = $ | 0;
        var n = 0;
        n = CM(8) | 0;
        i2(n, $);
        return n | 0;
    }
    function io($) {
        $ = $ | 0;
        if ($ | 0) {
            ic($);
            CA($);
        }
        return;
    }
    function ic($) {
        $ = $ | 0;
        var n = 0;
        nv(_[$ >> 2] | 0);
        n = ($ + 4) | 0;
        $ = _[n >> 2] | 0;
        _[n >> 2] = 0;
        if ($ | 0) {
            i6($);
            CA($);
        }
        return;
    }
    function i6($) {
        $ = $ | 0;
        ia($);
        return;
    }
    function ia($) {
        $ = $ | 0;
        $ = _[$ >> 2] | 0;
        if ($ | 0) $X($ | 0);
        return;
    }
    function i1($) {
        $ = $ | 0;
        return nP($) | 0;
    }
    function i4($) {
        $ = $ | 0;
        var n = 0, r = 0;
        r = ($ + 4) | 0;
        n = _[r >> 2] | 0;
        _[r >> 2] = 0;
        if (n | 0) {
            i6(n);
            CA(n);
        }
        nk(_[$ >> 2] | 0);
        return;
    }
    function il($, n) {
        $ = $ | 0;
        n = n | 0;
        nx(_[$ >> 2] | 0, _[n >> 2] | 0);
        return;
    }
    function iv($, n) {
        $ = $ | 0;
        n = n | 0;
        nK(_[$ >> 2] | 0, n);
        return;
    }
    function i7($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        re(_[$ >> 2] | 0, n, X(r));
        return;
    }
    function i5($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        ri(_[$ >> 2] | 0, n, X(r));
        return;
    }
    function is($, n) {
        $ = $ | 0;
        n = n | 0;
        nY(_[$ >> 2] | 0, n);
        return;
    }
    function i3($, n) {
        $ = $ | 0;
        n = n | 0;
        nj(_[$ >> 2] | 0, n);
        return;
    }
    function ib($, n) {
        $ = $ | 0;
        n = n | 0;
        nD(_[$ >> 2] | 0, n);
        return;
    }
    function ik($, n) {
        $ = $ | 0;
        n = n | 0;
        nE(_[$ >> 2] | 0, n);
        return;
    }
    function ih($, n) {
        $ = $ | 0;
        n = n | 0;
        nH(_[$ >> 2] | 0, n);
        return;
    }
    function id($, n) {
        $ = $ | 0;
        n = n | 0;
        nB(_[$ >> 2] | 0, n);
        return;
    }
    function iw($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        rt(_[$ >> 2] | 0, n, X(r));
        return;
    }
    function i8($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        r2(_[$ >> 2] | 0, n, X(r));
        return;
    }
    function im($, n) {
        $ = $ | 0;
        n = n | 0;
        rf(_[$ >> 2] | 0, n);
        return;
    }
    function iy($, n) {
        $ = $ | 0;
        n = n | 0;
        nZ(_[$ >> 2] | 0, n);
        return;
    }
    function ip($, n) {
        $ = $ | 0;
        n = n | 0;
        nQ(_[$ >> 2] | 0, n);
        return;
    }
    function iC($, n) {
        $ = $ | 0;
        n = +n;
        nW(_[$ >> 2] | 0, X(n));
        return;
    }
    function iM($, n) {
        $ = $ | 0;
        n = +n;
        r0(_[$ >> 2] | 0, X(n));
        return;
    }
    function ig($, n) {
        $ = $ | 0;
        n = +n;
        rn(_[$ >> 2] | 0, X(n));
        return;
    }
    function iA($, n) {
        $ = $ | 0;
        n = +n;
        n9(_[$ >> 2] | 0, X(n));
        return;
    }
    function iI($, n) {
        $ = $ | 0;
        n = +n;
        r$(_[$ >> 2] | 0, X(n));
        return;
    }
    function iS($, n) {
        $ = $ | 0;
        n = +n;
        r4(_[$ >> 2] | 0, X(n));
        return;
    }
    function iT($, n) {
        $ = $ | 0;
        n = +n;
        rl(_[$ >> 2] | 0, X(n));
        return;
    }
    function ix($) {
        $ = $ | 0;
        rv(_[$ >> 2] | 0);
        return;
    }
    function iN($, n) {
        $ = $ | 0;
        n = +n;
        r5(_[$ >> 2] | 0, X(n));
        return;
    }
    function iL($, n) {
        $ = $ | 0;
        n = +n;
        rs(_[$ >> 2] | 0, X(n));
        return;
    }
    function iO($) {
        $ = $ | 0;
        r3(_[$ >> 2] | 0);
        return;
    }
    function iP($, n) {
        $ = $ | 0;
        n = +n;
        rk(_[$ >> 2] | 0, X(n));
        return;
    }
    function iE($, n) {
        $ = $ | 0;
        n = +n;
        rh(_[$ >> 2] | 0, X(n));
        return;
    }
    function iG($, n) {
        $ = $ | 0;
        n = +n;
        rw(_[$ >> 2] | 0, X(n));
        return;
    }
    function iB($, n) {
        $ = $ | 0;
        n = +n;
        r8(_[$ >> 2] | 0, X(n));
        return;
    }
    function iR($, n) {
        $ = $ | 0;
        n = +n;
        ry(_[$ >> 2] | 0, X(n));
        return;
    }
    function iY($, n) {
        $ = $ | 0;
        n = +n;
        rp(_[$ >> 2] | 0, X(n));
        return;
    }
    function iU($, n) {
        $ = $ | 0;
        n = +n;
        rM(_[$ >> 2] | 0, X(n));
        return;
    }
    function ij($, n) {
        $ = $ | 0;
        n = +n;
        rg(_[$ >> 2] | 0, X(n));
        return;
    }
    function iz($, n) {
        $ = $ | 0;
        n = +n;
        rI(_[$ >> 2] | 0, X(n));
        return;
    }
    function iD($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        ra(_[$ >> 2] | 0, n, X(r));
        return;
    }
    function iF($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        ro(_[$ >> 2] | 0, n, X(r));
        return;
    }
    function iK($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        rc(_[$ >> 2] | 0, n, X(r));
        return;
    }
    function iq($) {
        $ = $ | 0;
        return nq(_[$ >> 2] | 0) | 0;
    }
    function iH($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = s;
        s = (s + 16) | 0;
        i = e;
        r_(i, _[n >> 2] | 0, r);
        iX($, i);
        s = e;
        return;
    }
    function iX($, n) {
        $ = $ | 0;
        n = n | 0;
        iZ($, _[(n + 4) >> 2] | 0, +X(o[n >> 2]));
        return;
    }
    function iZ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        _[$ >> 2] = n;
        c[($ + 8) >> 3] = r;
        return;
    }
    function iJ($) {
        $ = $ | 0;
        return nU(_[$ >> 2] | 0) | 0;
    }
    function iQ($) {
        $ = $ | 0;
        return nz(_[$ >> 2] | 0) | 0;
    }
    function iV($) {
        $ = $ | 0;
        return nF(_[$ >> 2] | 0) | 0;
    }
    function iW($) {
        $ = $ | 0;
        return nG(_[$ >> 2] | 0) | 0;
    }
    function i9($) {
        $ = $ | 0;
        return nX(_[$ >> 2] | 0) | 0;
    }
    function _$($) {
        $ = $ | 0;
        return nR(_[$ >> 2] | 0) | 0;
    }
    function _0($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = s;
        s = (s + 16) | 0;
        i = e;
        ru(i, _[n >> 2] | 0, r);
        iX($, i);
        s = e;
        return;
    }
    function _n($) {
        $ = $ | 0;
        return nJ(_[$ >> 2] | 0) | 0;
    }
    function _r($) {
        $ = $ | 0;
        return nV(_[$ >> 2] | 0) | 0;
    }
    function _e($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        rr(e, _[n >> 2] | 0);
        iX($, e);
        s = r;
        return;
    }
    function _i($) {
        $ = $ | 0;
        return +(+X(nN(_[$ >> 2] | 0)));
    }
    function __($) {
        $ = $ | 0;
        return +(+X(nL(_[$ >> 2] | 0)));
    }
    function _t($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        r7(e, _[n >> 2] | 0);
        iX($, e);
        s = r;
        return;
    }
    function _2($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        rb(e, _[n >> 2] | 0);
        iX($, e);
        s = r;
        return;
    }
    function _u($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        rd(e, _[n >> 2] | 0);
        iX($, e);
        s = r;
        return;
    }
    function _f($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        rm(e, _[n >> 2] | 0);
        iX($, e);
        s = r;
        return;
    }
    function _o($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        rC(e, _[n >> 2] | 0);
        iX($, e);
        s = r;
        return;
    }
    function _c($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        rA(e, _[n >> 2] | 0);
        iX($, e);
        s = r;
        return;
    }
    function _6($) {
        $ = $ | 0;
        return +(+X(rS(_[$ >> 2] | 0)));
    }
    function _a($, n) {
        $ = $ | 0;
        n = n | 0;
        return +(+X(r1(_[$ >> 2] | 0, n)));
    }
    function _1($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = s;
        s = (s + 16) | 0;
        i = e;
        r6(i, _[n >> 2] | 0, r);
        iX($, i);
        s = e;
        return;
    }
    function _4($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        np(_[$ >> 2] | 0, _[n >> 2] | 0, r);
        return;
    }
    function _l($, n) {
        $ = $ | 0;
        n = n | 0;
        nb(_[$ >> 2] | 0, _[n >> 2] | 0);
        return;
    }
    function _v($) {
        $ = $ | 0;
        return n5(_[$ >> 2] | 0) | 0;
    }
    function _7($) {
        $ = $ | 0;
        $ = nI(_[$ >> 2] | 0) | 0;
        if (!$) $ = 0;
        else $ = i1($) | 0;
        return $ | 0;
    }
    function _5($, n) {
        $ = $ | 0;
        n = n | 0;
        $ = ns(_[$ >> 2] | 0, n) | 0;
        if (!$) $ = 0;
        else $ = i1($) | 0;
        return $ | 0;
    }
    function _s($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        e = CM(4) | 0;
        _3(e, n);
        r = ($ + 4) | 0;
        n = _[r >> 2] | 0;
        _[r >> 2] = e;
        if (n | 0) {
            i6(n);
            CA(n);
        }
        ny(_[$ >> 2] | 0, 1);
        return;
    }
    function _3($, n) {
        $ = $ | 0;
        n = n | 0;
        _O($, n);
        return;
    }
    function _b($, n, r, e, i, _) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        e = e | 0;
        i = X(i);
        _ = _ | 0;
        var t = 0, u = 0;
        t = s;
        s = (s + 16) | 0;
        u = t;
        _k(u, nP(n) | 0, +r, e, +i, _);
        o[$ >> 2] = X(+c[u >> 3]);
        o[($ + 4) >> 2] = X(+c[(u + 8) >> 3]);
        s = t;
        return;
    }
    function _k($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        e = e | 0;
        i = +i;
        t = t | 0;
        var u = 0, f = 0, o = 0, a = 0, l = 0;
        u = s;
        s = (s + 32) | 0;
        l = (u + 8) | 0;
        a = (u + 20) | 0;
        o = u;
        f = (u + 16) | 0;
        c[l >> 3] = r;
        _[a >> 2] = e;
        c[o >> 3] = i;
        _[f >> 2] = t;
        _h($, _[(n + 4) >> 2] | 0, l, a, o, f);
        s = u;
        return;
    }
    function _h($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var u = 0, f = 0;
        u = s;
        s = (s + 16) | 0;
        f = u;
        p7(f);
        n = _d(n) | 0;
        _w($, n, +c[r >> 3], _[e >> 2] | 0, +c[i >> 3], _[t >> 2] | 0);
        ps(f);
        s = u;
        return;
    }
    function _d($) {
        $ = $ | 0;
        return _[$ >> 2] | 0;
    }
    function _w($, n, r, e, i, _) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        e = e | 0;
        i = +i;
        _ = _ | 0;
        var t = 0;
        t = _m(_8() | 0) | 0;
        r = +_y(r);
        e = _p(e) | 0;
        i = +_y(i);
        _C($, $J(0, t | 0, n | 0, +r, e | 0, +i, _p(_) | 0) | 0);
        return;
    }
    function _8() {
        var $ = 0;
        if (!(e[7608] | 0)) {
            _x(9120);
            $ = 7608;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 9120;
    }
    function _m($) {
        $ = $ | 0;
        return _[($ + 8) >> 2] | 0;
    }
    function _y($) {
        $ = +$;
        return +(+_T($));
    }
    function _p($) {
        $ = $ | 0;
        return _S($) | 0;
    }
    function _C($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0;
        i = s;
        s = (s + 32) | 0;
        r = i;
        e = n;
        if (!(e & 1)) {
            _[$ >> 2] = _[n >> 2];
            _[($ + 4) >> 2] = _[(n + 4) >> 2];
            _[($ + 8) >> 2] = _[(n + 8) >> 2];
            _[($ + 12) >> 2] = _[(n + 12) >> 2];
        } else {
            _M(r, 0);
            $T(e | 0, r | 0) | 0;
            _g($, r);
            _A(r);
        }
        s = i;
        return;
    }
    function _M($, n) {
        $ = $ | 0;
        n = n | 0;
        _I($, n);
        _[($ + 8) >> 2] = 0;
        e[($ + 24) >> 0] = 0;
        return;
    }
    function _g($, n) {
        $ = $ | 0;
        n = n | 0;
        n = (n + 8) | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = _[(n + 4) >> 2];
        _[($ + 8) >> 2] = _[(n + 8) >> 2];
        _[($ + 12) >> 2] = _[(n + 12) >> 2];
        return;
    }
    function _A($) {
        $ = $ | 0;
        e[($ + 24) >> 0] = 0;
        return;
    }
    function _I($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = n;
        return;
    }
    function _S($) {
        $ = $ | 0;
        return $ | 0;
    }
    function _T($) {
        $ = +$;
        return +$;
    }
    function _x($) {
        $ = $ | 0;
        _L($, _N() | 0, 4);
        return;
    }
    function _N() {
        return 1064;
    }
    function _L($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        _[($ + 8) >> 2] = $q(n | 0, (r + 1) | 0) | 0;
        return;
    }
    function _O($, n) {
        $ = $ | 0;
        n = n | 0;
        n = _[n >> 2] | 0;
        _[$ >> 2] = n;
        $m(n | 0);
        return;
    }
    function _P($) {
        $ = $ | 0;
        var n = 0, r = 0;
        r = ($ + 4) | 0;
        n = _[r >> 2] | 0;
        _[r >> 2] = 0;
        if (n | 0) {
            i6(n);
            CA(n);
        }
        ny(_[$ >> 2] | 0, 0);
        return;
    }
    function _E($) {
        $ = $ | 0;
        nS(_[$ >> 2] | 0);
        return;
    }
    function _G($) {
        $ = $ | 0;
        return nT(_[$ >> 2] | 0) | 0;
    }
    function _B($, n, r, e) {
        $ = $ | 0;
        n = +n;
        r = +r;
        e = e | 0;
        r9(_[$ >> 2] | 0, X(n), X(r), e);
        return;
    }
    function _R($) {
        $ = $ | 0;
        return +(+X(rT(_[$ >> 2] | 0)));
    }
    function _Y($) {
        $ = $ | 0;
        return +(+X(rN(_[$ >> 2] | 0)));
    }
    function _U($) {
        $ = $ | 0;
        return +(+X(rx(_[$ >> 2] | 0)));
    }
    function _j($) {
        $ = $ | 0;
        return +(+X(rL(_[$ >> 2] | 0)));
    }
    function _z($) {
        $ = $ | 0;
        return +(+X(rO(_[$ >> 2] | 0)));
    }
    function _D($) {
        $ = $ | 0;
        return +(+X(rP(_[$ >> 2] | 0)));
    }
    function _F($, n) {
        $ = $ | 0;
        n = n | 0;
        c[$ >> 3] = +X(rT(_[n >> 2] | 0));
        c[($ + 8) >> 3] = +X(rN(_[n >> 2] | 0));
        c[($ + 16) >> 3] = +X(rx(_[n >> 2] | 0));
        c[($ + 24) >> 3] = +X(rL(_[n >> 2] | 0));
        c[($ + 32) >> 3] = +X(rO(_[n >> 2] | 0));
        c[($ + 40) >> 3] = +X(rP(_[n >> 2] | 0));
        return;
    }
    function _K($, n) {
        $ = $ | 0;
        n = n | 0;
        return +(+X(rE(_[$ >> 2] | 0, n)));
    }
    function _q($, n) {
        $ = $ | 0;
        n = n | 0;
        return +(+X(rG(_[$ >> 2] | 0, n)));
    }
    function _H($, n) {
        $ = $ | 0;
        n = n | 0;
        return +(+X(rB(_[$ >> 2] | 0, n)));
    }
    function _X() {
        return nd() | 0;
    }
    function _Z() {
        _J();
        _Q();
        _V();
        _W();
        _9();
        t$();
        return;
    }
    function _J() {
        hC(11713, 4938, 1);
        return;
    }
    function _Q() {
        kH(10448);
        return;
    }
    function _V() {
        kI(10408);
        return;
    }
    function _W() {
        b9(10324);
        return;
    }
    function _9() {
        sc(10096);
        return;
    }
    function t$() {
        t0(9132);
        return;
    }
    function t0($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0, k = 0, h = 0, d = 0, w = 0, m = 0, y = 0, p = 0, C = 0, M = 0, g = 0, A = 0, I = 0, S = 0, T = 0, x = 0, N = 0, L = 0, O = 0, P = 0, E = 0, G = 0, B = 0, R = 0, Y = 0, U = 0, j = 0, z = 0, D = 0, F = 0, K = 0, q = 0, H = 0, X = 0, Z = 0, J = 0, Q = 0, V = 0, W = 0, $$ = 0, $0 = 0, $n = 0, $r = 0, $e = 0, $i = 0, $_ = 0, $t = 0, $2 = 0, $u = 0, $f = 0, $o = 0, $c = 0, $6 = 0, $a = 0, $1 = 0, $4 = 0, $l = 0, $v = 0, $7 = 0, $5 = 0, $s = 0, $3 = 0, $b = 0, $k = 0, $h = 0, $d = 0, $w = 0, $8 = 0, $m = 0, $y = 0, $p = 0, $C = 0;
        n = s;
        s = (s + 672) | 0;
        r = (n + 656) | 0;
        $C = (n + 648) | 0;
        $p = (n + 640) | 0;
        $y = (n + 632) | 0;
        $m = (n + 624) | 0;
        $8 = (n + 616) | 0;
        $w = (n + 608) | 0;
        $d = (n + 600) | 0;
        $h = (n + 592) | 0;
        $k = (n + 584) | 0;
        $b = (n + 576) | 0;
        $3 = (n + 568) | 0;
        $s = (n + 560) | 0;
        $5 = (n + 552) | 0;
        $7 = (n + 544) | 0;
        $v = (n + 536) | 0;
        $l = (n + 528) | 0;
        $4 = (n + 520) | 0;
        $1 = (n + 512) | 0;
        $a = (n + 504) | 0;
        $6 = (n + 496) | 0;
        $c = (n + 488) | 0;
        $o = (n + 480) | 0;
        $f = (n + 472) | 0;
        $u = (n + 464) | 0;
        $2 = (n + 456) | 0;
        $t = (n + 448) | 0;
        $_ = (n + 440) | 0;
        $i = (n + 432) | 0;
        $e = (n + 424) | 0;
        $r = (n + 416) | 0;
        $n = (n + 408) | 0;
        $0 = (n + 400) | 0;
        $$ = (n + 392) | 0;
        W = (n + 384) | 0;
        V = (n + 376) | 0;
        Q = (n + 368) | 0;
        J = (n + 360) | 0;
        Z = (n + 352) | 0;
        X = (n + 344) | 0;
        H = (n + 336) | 0;
        q = (n + 328) | 0;
        K = (n + 320) | 0;
        F = (n + 312) | 0;
        D = (n + 304) | 0;
        z = (n + 296) | 0;
        j = (n + 288) | 0;
        U = (n + 280) | 0;
        Y = (n + 272) | 0;
        R = (n + 264) | 0;
        B = (n + 256) | 0;
        G = (n + 248) | 0;
        E = (n + 240) | 0;
        P = (n + 232) | 0;
        O = (n + 224) | 0;
        L = (n + 216) | 0;
        N = (n + 208) | 0;
        x = (n + 200) | 0;
        T = (n + 192) | 0;
        S = (n + 184) | 0;
        I = (n + 176) | 0;
        A = (n + 168) | 0;
        g = (n + 160) | 0;
        M = (n + 152) | 0;
        C = (n + 144) | 0;
        p = (n + 136) | 0;
        y = (n + 128) | 0;
        m = (n + 120) | 0;
        w = (n + 112) | 0;
        d = (n + 104) | 0;
        h = (n + 96) | 0;
        k = (n + 88) | 0;
        b = (n + 80) | 0;
        v = (n + 72) | 0;
        l = (n + 64) | 0;
        a = (n + 56) | 0;
        c = (n + 48) | 0;
        o = (n + 40) | 0;
        f = (n + 32) | 0;
        u = (n + 24) | 0;
        t = (n + 16) | 0;
        i = (n + 8) | 0;
        e = n;
        tn($, 3646);
        tr($, 3651, 2) | 0;
        te($, 3665, 2) | 0;
        ti($, 3682, 18) | 0;
        _[$C >> 2] = 19;
        _[($C + 4) >> 2] = 0;
        _[r >> 2] = _[$C >> 2];
        _[(r + 4) >> 2] = _[($C + 4) >> 2];
        t_($, 3690, r) | 0;
        _[$p >> 2] = 1;
        _[($p + 4) >> 2] = 0;
        _[r >> 2] = _[$p >> 2];
        _[(r + 4) >> 2] = _[($p + 4) >> 2];
        tt($, 3696, r) | 0;
        _[$y >> 2] = 2;
        _[($y + 4) >> 2] = 0;
        _[r >> 2] = _[$y >> 2];
        _[(r + 4) >> 2] = _[($y + 4) >> 2];
        t2($, 3706, r) | 0;
        _[$m >> 2] = 1;
        _[($m + 4) >> 2] = 0;
        _[r >> 2] = _[$m >> 2];
        _[(r + 4) >> 2] = _[($m + 4) >> 2];
        tu($, 3722, r) | 0;
        _[$8 >> 2] = 2;
        _[($8 + 4) >> 2] = 0;
        _[r >> 2] = _[$8 >> 2];
        _[(r + 4) >> 2] = _[($8 + 4) >> 2];
        tu($, 3734, r) | 0;
        _[$w >> 2] = 3;
        _[($w + 4) >> 2] = 0;
        _[r >> 2] = _[$w >> 2];
        _[(r + 4) >> 2] = _[($w + 4) >> 2];
        t2($, 3753, r) | 0;
        _[$d >> 2] = 4;
        _[($d + 4) >> 2] = 0;
        _[r >> 2] = _[$d >> 2];
        _[(r + 4) >> 2] = _[($d + 4) >> 2];
        t2($, 3769, r) | 0;
        _[$h >> 2] = 5;
        _[($h + 4) >> 2] = 0;
        _[r >> 2] = _[$h >> 2];
        _[(r + 4) >> 2] = _[($h + 4) >> 2];
        t2($, 3783, r) | 0;
        _[$k >> 2] = 6;
        _[($k + 4) >> 2] = 0;
        _[r >> 2] = _[$k >> 2];
        _[(r + 4) >> 2] = _[($k + 4) >> 2];
        t2($, 3796, r) | 0;
        _[$b >> 2] = 7;
        _[($b + 4) >> 2] = 0;
        _[r >> 2] = _[$b >> 2];
        _[(r + 4) >> 2] = _[($b + 4) >> 2];
        t2($, 3813, r) | 0;
        _[$3 >> 2] = 8;
        _[($3 + 4) >> 2] = 0;
        _[r >> 2] = _[$3 >> 2];
        _[(r + 4) >> 2] = _[($3 + 4) >> 2];
        t2($, 3825, r) | 0;
        _[$s >> 2] = 3;
        _[($s + 4) >> 2] = 0;
        _[r >> 2] = _[$s >> 2];
        _[(r + 4) >> 2] = _[($s + 4) >> 2];
        tu($, 3843, r) | 0;
        _[$5 >> 2] = 4;
        _[($5 + 4) >> 2] = 0;
        _[r >> 2] = _[$5 >> 2];
        _[(r + 4) >> 2] = _[($5 + 4) >> 2];
        tu($, 3853, r) | 0;
        _[$7 >> 2] = 9;
        _[($7 + 4) >> 2] = 0;
        _[r >> 2] = _[$7 >> 2];
        _[(r + 4) >> 2] = _[($7 + 4) >> 2];
        t2($, 3870, r) | 0;
        _[$v >> 2] = 10;
        _[($v + 4) >> 2] = 0;
        _[r >> 2] = _[$v >> 2];
        _[(r + 4) >> 2] = _[($v + 4) >> 2];
        t2($, 3884, r) | 0;
        _[$l >> 2] = 11;
        _[($l + 4) >> 2] = 0;
        _[r >> 2] = _[$l >> 2];
        _[(r + 4) >> 2] = _[($l + 4) >> 2];
        t2($, 3896, r) | 0;
        _[$4 >> 2] = 1;
        _[($4 + 4) >> 2] = 0;
        _[r >> 2] = _[$4 >> 2];
        _[(r + 4) >> 2] = _[($4 + 4) >> 2];
        tf($, 3907, r) | 0;
        _[$1 >> 2] = 2;
        _[($1 + 4) >> 2] = 0;
        _[r >> 2] = _[$1 >> 2];
        _[(r + 4) >> 2] = _[($1 + 4) >> 2];
        tf($, 3915, r) | 0;
        _[$a >> 2] = 3;
        _[($a + 4) >> 2] = 0;
        _[r >> 2] = _[$a >> 2];
        _[(r + 4) >> 2] = _[($a + 4) >> 2];
        tf($, 3928, r) | 0;
        _[$6 >> 2] = 4;
        _[($6 + 4) >> 2] = 0;
        _[r >> 2] = _[$6 >> 2];
        _[(r + 4) >> 2] = _[($6 + 4) >> 2];
        tf($, 3948, r) | 0;
        _[$c >> 2] = 5;
        _[($c + 4) >> 2] = 0;
        _[r >> 2] = _[$c >> 2];
        _[(r + 4) >> 2] = _[($c + 4) >> 2];
        tf($, 3960, r) | 0;
        _[$o >> 2] = 6;
        _[($o + 4) >> 2] = 0;
        _[r >> 2] = _[$o >> 2];
        _[(r + 4) >> 2] = _[($o + 4) >> 2];
        tf($, 3974, r) | 0;
        _[$f >> 2] = 7;
        _[($f + 4) >> 2] = 0;
        _[r >> 2] = _[$f >> 2];
        _[(r + 4) >> 2] = _[($f + 4) >> 2];
        tf($, 3983, r) | 0;
        _[$u >> 2] = 20;
        _[($u + 4) >> 2] = 0;
        _[r >> 2] = _[$u >> 2];
        _[(r + 4) >> 2] = _[($u + 4) >> 2];
        t_($, 3999, r) | 0;
        _[$2 >> 2] = 8;
        _[($2 + 4) >> 2] = 0;
        _[r >> 2] = _[$2 >> 2];
        _[(r + 4) >> 2] = _[($2 + 4) >> 2];
        tf($, 4012, r) | 0;
        _[$t >> 2] = 9;
        _[($t + 4) >> 2] = 0;
        _[r >> 2] = _[$t >> 2];
        _[(r + 4) >> 2] = _[($t + 4) >> 2];
        tf($, 4022, r) | 0;
        _[$_ >> 2] = 21;
        _[($_ + 4) >> 2] = 0;
        _[r >> 2] = _[$_ >> 2];
        _[(r + 4) >> 2] = _[($_ + 4) >> 2];
        t_($, 4039, r) | 0;
        _[$i >> 2] = 10;
        _[($i + 4) >> 2] = 0;
        _[r >> 2] = _[$i >> 2];
        _[(r + 4) >> 2] = _[($i + 4) >> 2];
        tf($, 4053, r) | 0;
        _[$e >> 2] = 11;
        _[($e + 4) >> 2] = 0;
        _[r >> 2] = _[$e >> 2];
        _[(r + 4) >> 2] = _[($e + 4) >> 2];
        tf($, 4065, r) | 0;
        _[$r >> 2] = 12;
        _[($r + 4) >> 2] = 0;
        _[r >> 2] = _[$r >> 2];
        _[(r + 4) >> 2] = _[($r + 4) >> 2];
        tf($, 4084, r) | 0;
        _[$n >> 2] = 13;
        _[($n + 4) >> 2] = 0;
        _[r >> 2] = _[$n >> 2];
        _[(r + 4) >> 2] = _[($n + 4) >> 2];
        tf($, 4097, r) | 0;
        _[$0 >> 2] = 14;
        _[($0 + 4) >> 2] = 0;
        _[r >> 2] = _[$0 >> 2];
        _[(r + 4) >> 2] = _[($0 + 4) >> 2];
        tf($, 4117, r) | 0;
        _[$$ >> 2] = 15;
        _[($$ + 4) >> 2] = 0;
        _[r >> 2] = _[$$ >> 2];
        _[(r + 4) >> 2] = _[($$ + 4) >> 2];
        tf($, 4129, r) | 0;
        _[W >> 2] = 16;
        _[(W + 4) >> 2] = 0;
        _[r >> 2] = _[W >> 2];
        _[(r + 4) >> 2] = _[(W + 4) >> 2];
        tf($, 4148, r) | 0;
        _[V >> 2] = 17;
        _[(V + 4) >> 2] = 0;
        _[r >> 2] = _[V >> 2];
        _[(r + 4) >> 2] = _[(V + 4) >> 2];
        tf($, 4161, r) | 0;
        _[Q >> 2] = 18;
        _[(Q + 4) >> 2] = 0;
        _[r >> 2] = _[Q >> 2];
        _[(r + 4) >> 2] = _[(Q + 4) >> 2];
        tf($, 4181, r) | 0;
        _[J >> 2] = 5;
        _[(J + 4) >> 2] = 0;
        _[r >> 2] = _[J >> 2];
        _[(r + 4) >> 2] = _[(J + 4) >> 2];
        tu($, 4196, r) | 0;
        _[Z >> 2] = 6;
        _[(Z + 4) >> 2] = 0;
        _[r >> 2] = _[Z >> 2];
        _[(r + 4) >> 2] = _[(Z + 4) >> 2];
        tu($, 4206, r) | 0;
        _[X >> 2] = 7;
        _[(X + 4) >> 2] = 0;
        _[r >> 2] = _[X >> 2];
        _[(r + 4) >> 2] = _[(X + 4) >> 2];
        tu($, 4217, r) | 0;
        _[H >> 2] = 3;
        _[(H + 4) >> 2] = 0;
        _[r >> 2] = _[H >> 2];
        _[(r + 4) >> 2] = _[(H + 4) >> 2];
        to($, 4235, r) | 0;
        _[q >> 2] = 1;
        _[(q + 4) >> 2] = 0;
        _[r >> 2] = _[q >> 2];
        _[(r + 4) >> 2] = _[(q + 4) >> 2];
        tc($, 4251, r) | 0;
        _[K >> 2] = 4;
        _[(K + 4) >> 2] = 0;
        _[r >> 2] = _[K >> 2];
        _[(r + 4) >> 2] = _[(K + 4) >> 2];
        to($, 4263, r) | 0;
        _[F >> 2] = 5;
        _[(F + 4) >> 2] = 0;
        _[r >> 2] = _[F >> 2];
        _[(r + 4) >> 2] = _[(F + 4) >> 2];
        to($, 4279, r) | 0;
        _[D >> 2] = 6;
        _[(D + 4) >> 2] = 0;
        _[r >> 2] = _[D >> 2];
        _[(r + 4) >> 2] = _[(D + 4) >> 2];
        to($, 4293, r) | 0;
        _[z >> 2] = 7;
        _[(z + 4) >> 2] = 0;
        _[r >> 2] = _[z >> 2];
        _[(r + 4) >> 2] = _[(z + 4) >> 2];
        to($, 4306, r) | 0;
        _[j >> 2] = 8;
        _[(j + 4) >> 2] = 0;
        _[r >> 2] = _[j >> 2];
        _[(r + 4) >> 2] = _[(j + 4) >> 2];
        to($, 4323, r) | 0;
        _[U >> 2] = 9;
        _[(U + 4) >> 2] = 0;
        _[r >> 2] = _[U >> 2];
        _[(r + 4) >> 2] = _[(U + 4) >> 2];
        to($, 4335, r) | 0;
        _[Y >> 2] = 2;
        _[(Y + 4) >> 2] = 0;
        _[r >> 2] = _[Y >> 2];
        _[(r + 4) >> 2] = _[(Y + 4) >> 2];
        tc($, 4353, r) | 0;
        _[R >> 2] = 12;
        _[(R + 4) >> 2] = 0;
        _[r >> 2] = _[R >> 2];
        _[(r + 4) >> 2] = _[(R + 4) >> 2];
        t6($, 4363, r) | 0;
        _[B >> 2] = 1;
        _[(B + 4) >> 2] = 0;
        _[r >> 2] = _[B >> 2];
        _[(r + 4) >> 2] = _[(B + 4) >> 2];
        ta($, 4376, r) | 0;
        _[G >> 2] = 2;
        _[(G + 4) >> 2] = 0;
        _[r >> 2] = _[G >> 2];
        _[(r + 4) >> 2] = _[(G + 4) >> 2];
        ta($, 4388, r) | 0;
        _[E >> 2] = 13;
        _[(E + 4) >> 2] = 0;
        _[r >> 2] = _[E >> 2];
        _[(r + 4) >> 2] = _[(E + 4) >> 2];
        t6($, 4402, r) | 0;
        _[P >> 2] = 14;
        _[(P + 4) >> 2] = 0;
        _[r >> 2] = _[P >> 2];
        _[(r + 4) >> 2] = _[(P + 4) >> 2];
        t6($, 4411, r) | 0;
        _[O >> 2] = 15;
        _[(O + 4) >> 2] = 0;
        _[r >> 2] = _[O >> 2];
        _[(r + 4) >> 2] = _[(O + 4) >> 2];
        t6($, 4421, r) | 0;
        _[L >> 2] = 16;
        _[(L + 4) >> 2] = 0;
        _[r >> 2] = _[L >> 2];
        _[(r + 4) >> 2] = _[(L + 4) >> 2];
        t6($, 4433, r) | 0;
        _[N >> 2] = 17;
        _[(N + 4) >> 2] = 0;
        _[r >> 2] = _[N >> 2];
        _[(r + 4) >> 2] = _[(N + 4) >> 2];
        t6($, 4446, r) | 0;
        _[x >> 2] = 18;
        _[(x + 4) >> 2] = 0;
        _[r >> 2] = _[x >> 2];
        _[(r + 4) >> 2] = _[(x + 4) >> 2];
        t6($, 4458, r) | 0;
        _[T >> 2] = 3;
        _[(T + 4) >> 2] = 0;
        _[r >> 2] = _[T >> 2];
        _[(r + 4) >> 2] = _[(T + 4) >> 2];
        ta($, 4471, r) | 0;
        _[S >> 2] = 1;
        _[(S + 4) >> 2] = 0;
        _[r >> 2] = _[S >> 2];
        _[(r + 4) >> 2] = _[(S + 4) >> 2];
        t1($, 4486, r) | 0;
        _[I >> 2] = 10;
        _[(I + 4) >> 2] = 0;
        _[r >> 2] = _[I >> 2];
        _[(r + 4) >> 2] = _[(I + 4) >> 2];
        to($, 4496, r) | 0;
        _[A >> 2] = 11;
        _[(A + 4) >> 2] = 0;
        _[r >> 2] = _[A >> 2];
        _[(r + 4) >> 2] = _[(A + 4) >> 2];
        to($, 4508, r) | 0;
        _[g >> 2] = 3;
        _[(g + 4) >> 2] = 0;
        _[r >> 2] = _[g >> 2];
        _[(r + 4) >> 2] = _[(g + 4) >> 2];
        tc($, 4519, r) | 0;
        _[M >> 2] = 4;
        _[(M + 4) >> 2] = 0;
        _[r >> 2] = _[M >> 2];
        _[(r + 4) >> 2] = _[(M + 4) >> 2];
        t4($, 4530, r) | 0;
        _[C >> 2] = 19;
        _[(C + 4) >> 2] = 0;
        _[r >> 2] = _[C >> 2];
        _[(r + 4) >> 2] = _[(C + 4) >> 2];
        tl($, 4542, r) | 0;
        _[p >> 2] = 12;
        _[(p + 4) >> 2] = 0;
        _[r >> 2] = _[p >> 2];
        _[(r + 4) >> 2] = _[(p + 4) >> 2];
        tv($, 4554, r) | 0;
        _[y >> 2] = 13;
        _[(y + 4) >> 2] = 0;
        _[r >> 2] = _[y >> 2];
        _[(r + 4) >> 2] = _[(y + 4) >> 2];
        t7($, 4568, r) | 0;
        _[m >> 2] = 2;
        _[(m + 4) >> 2] = 0;
        _[r >> 2] = _[m >> 2];
        _[(r + 4) >> 2] = _[(m + 4) >> 2];
        t5($, 4578, r) | 0;
        _[w >> 2] = 20;
        _[(w + 4) >> 2] = 0;
        _[r >> 2] = _[w >> 2];
        _[(r + 4) >> 2] = _[(w + 4) >> 2];
        ts($, 4587, r) | 0;
        _[d >> 2] = 22;
        _[(d + 4) >> 2] = 0;
        _[r >> 2] = _[d >> 2];
        _[(r + 4) >> 2] = _[(d + 4) >> 2];
        t_($, 4602, r) | 0;
        _[h >> 2] = 23;
        _[(h + 4) >> 2] = 0;
        _[r >> 2] = _[h >> 2];
        _[(r + 4) >> 2] = _[(h + 4) >> 2];
        t_($, 4619, r) | 0;
        _[k >> 2] = 14;
        _[(k + 4) >> 2] = 0;
        _[r >> 2] = _[k >> 2];
        _[(r + 4) >> 2] = _[(k + 4) >> 2];
        t3($, 4629, r) | 0;
        _[b >> 2] = 1;
        _[(b + 4) >> 2] = 0;
        _[r >> 2] = _[b >> 2];
        _[(r + 4) >> 2] = _[(b + 4) >> 2];
        tb($, 4637, r) | 0;
        _[v >> 2] = 4;
        _[(v + 4) >> 2] = 0;
        _[r >> 2] = _[v >> 2];
        _[(r + 4) >> 2] = _[(v + 4) >> 2];
        ta($, 4653, r) | 0;
        _[l >> 2] = 5;
        _[(l + 4) >> 2] = 0;
        _[r >> 2] = _[l >> 2];
        _[(r + 4) >> 2] = _[(l + 4) >> 2];
        ta($, 4669, r) | 0;
        _[a >> 2] = 6;
        _[(a + 4) >> 2] = 0;
        _[r >> 2] = _[a >> 2];
        _[(r + 4) >> 2] = _[(a + 4) >> 2];
        ta($, 4686, r) | 0;
        _[c >> 2] = 7;
        _[(c + 4) >> 2] = 0;
        _[r >> 2] = _[c >> 2];
        _[(r + 4) >> 2] = _[(c + 4) >> 2];
        ta($, 4701, r) | 0;
        _[o >> 2] = 8;
        _[(o + 4) >> 2] = 0;
        _[r >> 2] = _[o >> 2];
        _[(r + 4) >> 2] = _[(o + 4) >> 2];
        ta($, 4719, r) | 0;
        _[f >> 2] = 9;
        _[(f + 4) >> 2] = 0;
        _[r >> 2] = _[f >> 2];
        _[(r + 4) >> 2] = _[(f + 4) >> 2];
        ta($, 4736, r) | 0;
        _[u >> 2] = 21;
        _[(u + 4) >> 2] = 0;
        _[r >> 2] = _[u >> 2];
        _[(r + 4) >> 2] = _[(u + 4) >> 2];
        tk($, 4754, r) | 0;
        _[t >> 2] = 2;
        _[(t + 4) >> 2] = 0;
        _[r >> 2] = _[t >> 2];
        _[(r + 4) >> 2] = _[(t + 4) >> 2];
        t1($, 4772, r) | 0;
        _[i >> 2] = 3;
        _[(i + 4) >> 2] = 0;
        _[r >> 2] = _[i >> 2];
        _[(r + 4) >> 2] = _[(i + 4) >> 2];
        t1($, 4790, r) | 0;
        _[e >> 2] = 4;
        _[(e + 4) >> 2] = 0;
        _[r >> 2] = _[e >> 2];
        _[(r + 4) >> 2] = _[(e + 4) >> 2];
        t1($, 4808, r) | 0;
        s = n;
        return;
    }
    function tn($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = s0() | 0;
        _[$ >> 2] = r;
        sn(r, n);
        hq(_[$ >> 2] | 0);
        return;
    }
    function tr($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        vY($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function te($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        vw($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function ti($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        vf($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function t_($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        lq($, n, i);
        s = e;
        return $ | 0;
    }
    function tt($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        lM($, n, i);
        s = e;
        return $ | 0;
    }
    function t2($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        la($, n, i);
        s = e;
        return $ | 0;
    }
    function tu($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        aJ($, n, i);
        s = e;
        return $ | 0;
    }
    function tf($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        aN($, n, i);
        s = e;
        return $ | 0;
    }
    function to($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        as($, n, i);
        s = e;
        return $ | 0;
    }
    function tc($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        an($, n, i);
        s = e;
        return $ | 0;
    }
    function t6($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        cC($, n, i);
        s = e;
        return $ | 0;
    }
    function ta($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        c6($, n, i);
        s = e;
        return $ | 0;
    }
    function t1($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        oZ($, n, i);
        s = e;
        return $ | 0;
    }
    function t4($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        ox($, n, i);
        s = e;
        return $ | 0;
    }
    function tl($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        ol($, n, i);
        s = e;
        return $ | 0;
    }
    function tv($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        fV($, n, i);
        s = e;
        return $ | 0;
    }
    function t7($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        fO($, n, i);
        s = e;
        return $ | 0;
    }
    function t5($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        f7($, n, i);
        s = e;
        return $ | 0;
    }
    function ts($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        uJ($, n, i);
        s = e;
        return $ | 0;
    }
    function t3($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        ux($, n, i);
        s = e;
        return $ | 0;
    }
    function tb($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        ua($, n, i);
        s = e;
        return $ | 0;
    }
    function tk($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        th($, n, i);
        s = e;
        return $ | 0;
    }
    function th($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        tw($, r, i, 1);
        s = e;
        return;
    }
    function td($) {
        $ = $ | 0;
        return $ | 0;
    }
    function tw($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = t8() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = tm(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, ty(t, e) | 0, e);
        s = i;
        return;
    }
    function t8() {
        var $ = 0, n = 0;
        if (!(e[7616] | 0)) {
            tO(9136);
            $I(24, 9136, h | 0) | 0;
            n = 7616;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9136) | 0)) {
            $ = 9136;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            tO(9136);
        }
        return 9136;
    }
    function tm($) {
        $ = $ | 0;
        return 0;
    }
    function ty($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = t8() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            tI(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            tS(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function tp($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0;
        u = s;
        s = (s + 32) | 0;
        v = (u + 24) | 0;
        l = (u + 20) | 0;
        o = (u + 16) | 0;
        a = (u + 12) | 0;
        c = (u + 8) | 0;
        f = (u + 4) | 0;
        b = u;
        _[l >> 2] = n;
        _[o >> 2] = r;
        _[a >> 2] = e;
        _[c >> 2] = i;
        _[f >> 2] = t;
        t = ($ + 28) | 0;
        _[b >> 2] = _[t >> 2];
        _[v >> 2] = _[b >> 2];
        tC(($ + 24) | 0, v, l, a, c, o, f) | 0;
        _[t >> 2] = _[_[t >> 2] >> 2];
        s = u;
        return;
    }
    function tC($, n, r, e, i, t, u) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        u = u | 0;
        $ = tM(n) | 0;
        n = CM(24) | 0;
        tg((n + 4) | 0, _[r >> 2] | 0, _[e >> 2] | 0, _[i >> 2] | 0, _[t >> 2] | 0, _[u >> 2] | 0);
        _[n >> 2] = _[$ >> 2];
        _[$ >> 2] = n;
        return n | 0;
    }
    function tM($) {
        $ = $ | 0;
        return _[$ >> 2] | 0;
    }
    function tg($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        _[($ + 8) >> 2] = e;
        _[($ + 12) >> 2] = i;
        _[($ + 16) >> 2] = t;
        return;
    }
    function tA($, n) {
        $ = $ | 0;
        n = n | 0;
        return n | $ | 0;
    }
    function tI($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function tS($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = tT($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            tx(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            tI(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            tN($, f);
            tL(f);
            s = c;
            return;
        }
    }
    function tT($) {
        $ = $ | 0;
        return 357913941;
    }
    function tx($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function tN($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function tL($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function tO($) {
        $ = $ | 0;
        tB($);
        return;
    }
    function tP($) {
        $ = $ | 0;
        tG(($ + 24) | 0);
        return;
    }
    function tE($) {
        $ = $ | 0;
        return _[$ >> 2] | 0;
    }
    function tG($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function tB($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 3, n, tY() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function tR() {
        return 9228;
    }
    function tY() {
        return 1140;
    }
    function tU($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        r = s;
        s = (s + 16) | 0;
        e = (r + 8) | 0;
        i = r;
        t = tz($) | 0;
        $ = _[(t + 4) >> 2] | 0;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = $;
        _[e >> 2] = _[i >> 2];
        _[(e + 4) >> 2] = _[(i + 4) >> 2];
        n = tD(n, e) | 0;
        s = r;
        return n | 0;
    }
    function tj($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        _[($ + 8) >> 2] = e;
        _[($ + 12) >> 2] = i;
        _[($ + 16) >> 2] = t;
        return;
    }
    function tz($) {
        $ = $ | 0;
        return ((_[((t8() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function tD($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0;
        i = s;
        s = (s + 48) | 0;
        e = i;
        r = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) r = _[((_[$ >> 2] | 0) + r) >> 2] | 0;
        MG[r & 31](e, $);
        e = tF(e) | 0;
        s = i;
        return e | 0;
    }
    function tF($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0;
        i = s;
        s = (s + 32) | 0;
        n = (i + 12) | 0;
        r = i;
        e = tq(tK() | 0) | 0;
        if (!e) $ = tQ($) | 0;
        else {
            tH(n, e);
            tX(r, n);
            tZ($, r);
            $ = tJ(n) | 0;
        }
        s = i;
        return $ | 0;
    }
    function tK() {
        var $ = 0;
        if (!(e[7632] | 0)) {
            ut(9184);
            $I(25, 9184, h | 0) | 0;
            $ = 7632;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 9184;
    }
    function tq($) {
        $ = $ | 0;
        return _[($ + 36) >> 2] | 0;
    }
    function tH($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = $;
        _[($ + 8) >> 2] = 0;
        return;
    }
    function tX($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = _[(n + 4) >> 2];
        _[($ + 8) >> 2] = 0;
        return;
    }
    function tZ($, n) {
        $ = $ | 0;
        n = n | 0;
        u0(n, $, ($ + 8) | 0, ($ + 16) | 0, ($ + 24) | 0, ($ + 32) | 0, ($ + 40) | 0) | 0;
        return;
    }
    function tJ($) {
        $ = $ | 0;
        return _[((_[($ + 4) >> 2] | 0) + 8) >> 2] | 0;
    }
    function tQ($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        o = s;
        s = (s + 16) | 0;
        r = (o + 4) | 0;
        e = o;
        i = mn(8) | 0;
        t = i;
        u = CM(48) | 0;
        f = u;
        n = (f + 48) | 0;
        do {
            _[f >> 2] = _[$ >> 2];
            f = (f + 4) | 0;
            $ = ($ + 4) | 0;
        }while ((f | 0) < (n | 0))
        n = (t + 4) | 0;
        _[n >> 2] = u;
        f = CM(8) | 0;
        u = _[n >> 2] | 0;
        _[e >> 2] = 0;
        _[r >> 2] = _[e >> 2];
        tV(f, u, r);
        _[i >> 2] = f;
        s = o;
        return t | 0;
    }
    function tV($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        r = CM(16) | 0;
        _[(r + 4) >> 2] = 0;
        _[(r + 8) >> 2] = 0;
        _[r >> 2] = 1092;
        _[(r + 12) >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function tW($) {
        $ = $ | 0;
        Cw($);
        CA($);
        return;
    }
    function t9($) {
        $ = $ | 0;
        $ = _[($ + 12) >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function u$($) {
        $ = $ | 0;
        CA($);
        return;
    }
    function u0($, n, r, e, i, t, u) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        u = u | 0;
        t = un(_[$ >> 2] | 0, n, r, e, i, t, u) | 0;
        u = ($ + 4) | 0;
        _[((_[u >> 2] | 0) + 8) >> 2] = t;
        return _[((_[u >> 2] | 0) + 8) >> 2] | 0;
    }
    function un($, n, r, e, i, _, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        _ = _ | 0;
        t = t | 0;
        var u = 0, f = 0;
        u = s;
        s = (s + 16) | 0;
        f = u;
        p7(f);
        $ = _d($) | 0;
        t = ur($, +c[n >> 3], +c[r >> 3], +c[e >> 3], +c[i >> 3], +c[_ >> 3], +c[t >> 3]) | 0;
        ps(f);
        s = u;
        return t | 0;
    }
    function ur($, n, r, e, i, _, t) {
        $ = $ | 0;
        n = +n;
        r = +r;
        e = +e;
        i = +i;
        _ = +_;
        t = +t;
        var u = 0;
        u = _m(ue() | 0) | 0;
        n = +_y(n);
        r = +_y(r);
        e = +_y(e);
        i = +_y(i);
        _ = +_y(_);
        return $w(0, u | 0, $ | 0, +n, +r, +e, +i, +_, +(+_y(t))) | 0;
    }
    function ue() {
        var $ = 0;
        if (!(e[7624] | 0)) {
            ui(9172);
            $ = 7624;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 9172;
    }
    function ui($) {
        $ = $ | 0;
        _L($, u_() | 0, 6);
        return;
    }
    function u_() {
        return 1112;
    }
    function ut($) {
        $ = $ | 0;
        u6($);
        return;
    }
    function u2($) {
        $ = $ | 0;
        uu(($ + 24) | 0);
        uf(($ + 16) | 0);
        return;
    }
    function uu($) {
        $ = $ | 0;
        uc($);
        return;
    }
    function uf($) {
        $ = $ | 0;
        uo($);
        return;
    }
    function uo($) {
        $ = $ | 0;
        var n = 0, r = 0;
        n = _[$ >> 2] | 0;
        if (n | 0) do {
            r = n;
            n = _[n >> 2] | 0;
            CA(r);
        }while ((n | 0) != 0)
        _[$ >> 2] = 0;
        return;
    }
    function uc($) {
        $ = $ | 0;
        var n = 0, r = 0;
        n = _[$ >> 2] | 0;
        if (n | 0) do {
            r = n;
            n = _[n >> 2] | 0;
            CA(r);
        }while ((n | 0) != 0)
        _[$ >> 2] = 0;
        return;
    }
    function u6($) {
        $ = $ | 0;
        var n = 0;
        _[($ + 16) >> 2] = 0;
        _[($ + 20) >> 2] = 0;
        n = ($ + 24) | 0;
        _[n >> 2] = 0;
        _[($ + 28) >> 2] = n;
        _[($ + 36) >> 2] = 0;
        e[($ + 40) >> 0] = 0;
        e[($ + 41) >> 0] = 0;
        return;
    }
    function ua($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        u1($, r, i, 0);
        s = e;
        return;
    }
    function u1($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = u4() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = ul(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, uv(t, e) | 0, e);
        s = i;
        return;
    }
    function u4() {
        var $ = 0, n = 0;
        if (!(e[7640] | 0)) {
            uh(9232);
            $I(26, 9232, h | 0) | 0;
            n = 7640;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9232) | 0)) {
            $ = 9232;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            uh(9232);
        }
        return 9232;
    }
    function ul($) {
        $ = $ | 0;
        return 0;
    }
    function uv($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = u4() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            u7(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            u5(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function u7($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function u5($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = us($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            u3(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            u7(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            ub($, f);
            uk(f);
            s = c;
            return;
        }
    }
    function us($) {
        $ = $ | 0;
        return 357913941;
    }
    function u3($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function ub($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function uk($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function uh($) {
        $ = $ | 0;
        u8($);
        return;
    }
    function ud($) {
        $ = $ | 0;
        uw(($ + 24) | 0);
        return;
    }
    function uw($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function u8($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 1, n, um() | 0, 3);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function um() {
        return 1144;
    }
    function uy($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        e = +e;
        i = i | 0;
        var t = 0, u = 0, f = 0, o = 0;
        t = s;
        s = (s + 16) | 0;
        u = (t + 8) | 0;
        f = t;
        o = up($) | 0;
        $ = _[(o + 4) >> 2] | 0;
        _[f >> 2] = _[o >> 2];
        _[(f + 4) >> 2] = $;
        _[u >> 2] = _[f >> 2];
        _[(u + 4) >> 2] = _[(f + 4) >> 2];
        uC(n, u, r, e, i);
        s = t;
        return;
    }
    function up($) {
        $ = $ | 0;
        return ((_[((u4() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function uC($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        e = +e;
        i = i | 0;
        var t = 0, u = 0, f = 0, o = 0, c = 0;
        c = s;
        s = (s + 16) | 0;
        u = (c + 2) | 0;
        f = (c + 1) | 0;
        o = c;
        t = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) t = _[((_[$ >> 2] | 0) + t) >> 2] | 0;
        uM(u, r);
        r = +ug(u, r);
        uM(f, e);
        e = +ug(f, e);
        uA(o, i);
        o = uI(o, i) | 0;
        MR[t & 1]($, r, e, o);
        s = c;
        return;
    }
    function uM($, n) {
        $ = $ | 0;
        n = +n;
        return;
    }
    function ug($, n) {
        $ = $ | 0;
        n = +n;
        return +(+uT(n));
    }
    function uA($, n) {
        $ = $ | 0;
        n = n | 0;
        return;
    }
    function uI($, n) {
        $ = $ | 0;
        n = n | 0;
        return uS(n) | 0;
    }
    function uS($) {
        $ = $ | 0;
        return $ | 0;
    }
    function uT($) {
        $ = +$;
        return +$;
    }
    function ux($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        uN($, r, i, 1);
        s = e;
        return;
    }
    function uN($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = uL() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = uO(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, uP(t, e) | 0, e);
        s = i;
        return;
    }
    function uL() {
        var $ = 0, n = 0;
        if (!(e[7648] | 0)) {
            uj(9268);
            $I(27, 9268, h | 0) | 0;
            n = 7648;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9268) | 0)) {
            $ = 9268;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            uj(9268);
        }
        return 9268;
    }
    function uO($) {
        $ = $ | 0;
        return 0;
    }
    function uP($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = uL() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            uE(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            uG(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function uE($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function uG($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = uB($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            uR(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            uE(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            uY($, f);
            uU(f);
            s = c;
            return;
        }
    }
    function uB($) {
        $ = $ | 0;
        return 357913941;
    }
    function uR($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function uY($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function uU($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function uj($) {
        $ = $ | 0;
        uF($);
        return;
    }
    function uz($) {
        $ = $ | 0;
        uD(($ + 24) | 0);
        return;
    }
    function uD($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function uF($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 4, n, uK() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function uK() {
        return 1160;
    }
    function uq($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        r = s;
        s = (s + 16) | 0;
        e = (r + 8) | 0;
        i = r;
        t = uH($) | 0;
        $ = _[(t + 4) >> 2] | 0;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = $;
        _[e >> 2] = _[i >> 2];
        _[(e + 4) >> 2] = _[(i + 4) >> 2];
        n = uX(n, e) | 0;
        s = r;
        return n | 0;
    }
    function uH($) {
        $ = $ | 0;
        return ((_[((uL() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function uX($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) r = _[((_[$ >> 2] | 0) + r) >> 2] | 0;
        return uZ(MB[r & 31]($) | 0) | 0;
    }
    function uZ($) {
        $ = $ | 0;
        return ($ & 1) | 0;
    }
    function uJ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        uQ($, r, i, 0);
        s = e;
        return;
    }
    function uQ($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = uV() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = uW(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, u9(t, e) | 0, e);
        s = i;
        return;
    }
    function uV() {
        var $ = 0, n = 0;
        if (!(e[7656] | 0)) {
            f_(9304);
            $I(28, 9304, h | 0) | 0;
            n = 7656;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9304) | 0)) {
            $ = 9304;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            f_(9304);
        }
        return 9304;
    }
    function uW($) {
        $ = $ | 0;
        return 0;
    }
    function u9($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = uV() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            f$(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            f0(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function f$($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function f0($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = fn($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            fr(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            f$(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            fe($, f);
            fi(f);
            s = c;
            return;
        }
    }
    function fn($) {
        $ = $ | 0;
        return 357913941;
    }
    function fr($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function fe($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function fi($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function f_($) {
        $ = $ | 0;
        fu($);
        return;
    }
    function ft($) {
        $ = $ | 0;
        f2(($ + 24) | 0);
        return;
    }
    function f2($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function fu($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 5, n, ff() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function ff() {
        return 1164;
    }
    function fo($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = fc($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        f6(n, i, r);
        s = e;
        return;
    }
    function fc($) {
        $ = $ | 0;
        return ((_[((uV() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function f6($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        fa(i, r);
        r = f1(i, r) | 0;
        MG[e & 31]($, r);
        f4(i);
        s = t;
        return;
    }
    function fa($, n) {
        $ = $ | 0;
        n = n | 0;
        fl($, n);
        return;
    }
    function f1($, n) {
        $ = $ | 0;
        n = n | 0;
        return $ | 0;
    }
    function f4($) {
        $ = $ | 0;
        i6($);
        return;
    }
    function fl($, n) {
        $ = $ | 0;
        n = n | 0;
        fv($, n);
        return;
    }
    function fv($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = n;
        return;
    }
    function f7($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        f5($, r, i, 0);
        s = e;
        return;
    }
    function f5($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = fs() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = f3(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, fb(t, e) | 0, e);
        s = i;
        return;
    }
    function fs() {
        var $ = 0, n = 0;
        if (!(e[7664] | 0)) {
            fy(9340);
            $I(29, 9340, h | 0) | 0;
            n = 7664;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9340) | 0)) {
            $ = 9340;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            fy(9340);
        }
        return 9340;
    }
    function f3($) {
        $ = $ | 0;
        return 0;
    }
    function fb($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = fs() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            fk(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            fh(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function fk($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function fh($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = fd($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            fw(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            fk(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            f8($, f);
            fm(f);
            s = c;
            return;
        }
    }
    function fd($) {
        $ = $ | 0;
        return 357913941;
    }
    function fw($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function f8($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function fm($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function fy($) {
        $ = $ | 0;
        fM($);
        return;
    }
    function fp($) {
        $ = $ | 0;
        fC(($ + 24) | 0);
        return;
    }
    function fC($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function fM($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 4, n, fg() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function fg() {
        return 1180;
    }
    function fA($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = fI($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        r = fS(n, i, r) | 0;
        s = e;
        return r | 0;
    }
    function fI($) {
        $ = $ | 0;
        return ((_[((fs() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function fS($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        fT(i, r);
        i = fx(i, r) | 0;
        i = fN(MF[e & 15]($, i) | 0) | 0;
        s = t;
        return i | 0;
    }
    function fT($, n) {
        $ = $ | 0;
        n = n | 0;
        return;
    }
    function fx($, n) {
        $ = $ | 0;
        n = n | 0;
        return fL(n) | 0;
    }
    function fN($) {
        $ = $ | 0;
        return $ | 0;
    }
    function fL($) {
        $ = $ | 0;
        return $ | 0;
    }
    function fO($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        fP($, r, i, 0);
        s = e;
        return;
    }
    function fP($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = fE() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = fG(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, fB(t, e) | 0, e);
        s = i;
        return;
    }
    function fE() {
        var $ = 0, n = 0;
        if (!(e[7672] | 0)) {
            fF(9376);
            $I(30, 9376, h | 0) | 0;
            n = 7672;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9376) | 0)) {
            $ = 9376;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            fF(9376);
        }
        return 9376;
    }
    function fG($) {
        $ = $ | 0;
        return 0;
    }
    function fB($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = fE() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            fR(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            fY(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function fR($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function fY($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = fU($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            fj(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            fR(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            fz($, f);
            fD(f);
            s = c;
            return;
        }
    }
    function fU($) {
        $ = $ | 0;
        return 357913941;
    }
    function fj($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function fz($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function fD($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function fF($) {
        $ = $ | 0;
        fH($);
        return;
    }
    function fK($) {
        $ = $ | 0;
        fq(($ + 24) | 0);
        return;
    }
    function fq($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function fH($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 5, n, fX() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function fX() {
        return 1196;
    }
    function fZ($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        r = s;
        s = (s + 16) | 0;
        e = (r + 8) | 0;
        i = r;
        t = fJ($) | 0;
        $ = _[(t + 4) >> 2] | 0;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = $;
        _[e >> 2] = _[i >> 2];
        _[(e + 4) >> 2] = _[(i + 4) >> 2];
        n = fQ(n, e) | 0;
        s = r;
        return n | 0;
    }
    function fJ($) {
        $ = $ | 0;
        return ((_[((fE() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function fQ($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) r = _[((_[$ >> 2] | 0) + r) >> 2] | 0;
        return fN(MB[r & 31]($) | 0) | 0;
    }
    function fV($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        fW($, r, i, 1);
        s = e;
        return;
    }
    function fW($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = f9() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = o$(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, o0(t, e) | 0, e);
        s = i;
        return;
    }
    function f9() {
        var $ = 0, n = 0;
        if (!(e[7680] | 0)) {
            o2(9412);
            $I(31, 9412, h | 0) | 0;
            n = 7680;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9412) | 0)) {
            $ = 9412;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            o2(9412);
        }
        return 9412;
    }
    function o$($) {
        $ = $ | 0;
        return 0;
    }
    function o0($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = f9() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            on(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            or(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function on($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function or($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = oe($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            oi(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            on(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            o_($, f);
            ot(f);
            s = c;
            return;
        }
    }
    function oe($) {
        $ = $ | 0;
        return 357913941;
    }
    function oi($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function o_($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function ot($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function o2($) {
        $ = $ | 0;
        oo($);
        return;
    }
    function ou($) {
        $ = $ | 0;
        of(($ + 24) | 0);
        return;
    }
    function of($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function oo($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 6, n, oc() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function oc() {
        return 1200;
    }
    function o6($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        r = s;
        s = (s + 16) | 0;
        e = (r + 8) | 0;
        i = r;
        t = oa($) | 0;
        $ = _[(t + 4) >> 2] | 0;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = $;
        _[e >> 2] = _[i >> 2];
        _[(e + 4) >> 2] = _[(i + 4) >> 2];
        n = o1(n, e) | 0;
        s = r;
        return n | 0;
    }
    function oa($) {
        $ = $ | 0;
        return ((_[((f9() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function o1($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) r = _[((_[$ >> 2] | 0) + r) >> 2] | 0;
        return o4(MB[r & 31]($) | 0) | 0;
    }
    function o4($) {
        $ = $ | 0;
        return $ | 0;
    }
    function ol($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        ov($, r, i, 0);
        s = e;
        return;
    }
    function ov($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = o7() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = o5(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, os(t, e) | 0, e);
        s = i;
        return;
    }
    function o7() {
        var $ = 0, n = 0;
        if (!(e[7688] | 0)) {
            o8(9448);
            $I(32, 9448, h | 0) | 0;
            n = 7688;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9448) | 0)) {
            $ = 9448;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            o8(9448);
        }
        return 9448;
    }
    function o5($) {
        $ = $ | 0;
        return 0;
    }
    function os($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = o7() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            o3(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            ob(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function o3($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function ob($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = ok($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            oh(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            o3(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            od($, f);
            ow(f);
            s = c;
            return;
        }
    }
    function ok($) {
        $ = $ | 0;
        return 357913941;
    }
    function oh($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function od($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function ow($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function o8($) {
        $ = $ | 0;
        op($);
        return;
    }
    function om($) {
        $ = $ | 0;
        oy(($ + 24) | 0);
        return;
    }
    function oy($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function op($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 6, n, oC() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function oC() {
        return 1204;
    }
    function oM($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = og($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        oA(n, i, r);
        s = e;
        return;
    }
    function og($) {
        $ = $ | 0;
        return ((_[((o7() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function oA($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        oI(i, r);
        i = oS(i, r) | 0;
        MG[e & 31]($, i);
        s = t;
        return;
    }
    function oI($, n) {
        $ = $ | 0;
        n = n | 0;
        return;
    }
    function oS($, n) {
        $ = $ | 0;
        n = n | 0;
        return oT(n) | 0;
    }
    function oT($) {
        $ = $ | 0;
        return $ | 0;
    }
    function ox($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        oN($, r, i, 0);
        s = e;
        return;
    }
    function oN($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = oL() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = oO(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, oP(t, e) | 0, e);
        s = i;
        return;
    }
    function oL() {
        var $ = 0, n = 0;
        if (!(e[7696] | 0)) {
            oj(9484);
            $I(33, 9484, h | 0) | 0;
            n = 7696;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9484) | 0)) {
            $ = 9484;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            oj(9484);
        }
        return 9484;
    }
    function oO($) {
        $ = $ | 0;
        return 0;
    }
    function oP($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = oL() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            oE(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            oG(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function oE($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function oG($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = oB($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            oR(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            oE(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            oY($, f);
            oU(f);
            s = c;
            return;
        }
    }
    function oB($) {
        $ = $ | 0;
        return 357913941;
    }
    function oR($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function oY($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function oU($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function oj($) {
        $ = $ | 0;
        oF($);
        return;
    }
    function oz($) {
        $ = $ | 0;
        oD(($ + 24) | 0);
        return;
    }
    function oD($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function oF($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 1, n, oK() | 0, 2);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function oK() {
        return 1212;
    }
    function oq($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0;
        i = s;
        s = (s + 16) | 0;
        t = (i + 8) | 0;
        u = i;
        f = oH($) | 0;
        $ = _[(f + 4) >> 2] | 0;
        _[u >> 2] = _[f >> 2];
        _[(u + 4) >> 2] = $;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = _[(u + 4) >> 2];
        oX(n, t, r, e);
        s = i;
        return;
    }
    function oH($) {
        $ = $ | 0;
        return ((_[((oL() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function oX($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0;
        f = s;
        s = (s + 16) | 0;
        t = (f + 1) | 0;
        u = f;
        i = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) i = _[((_[$ >> 2] | 0) + i) >> 2] | 0;
        oI(t, r);
        t = oS(t, r) | 0;
        fT(u, e);
        u = fx(u, e) | 0;
        MV[i & 15]($, t, u);
        s = f;
        return;
    }
    function oZ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        oJ($, r, i, 1);
        s = e;
        return;
    }
    function oJ($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = oQ() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = oV(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, oW(t, e) | 0, e);
        s = i;
        return;
    }
    function oQ() {
        var $ = 0, n = 0;
        if (!(e[7704] | 0)) {
            ci(9520);
            $I(34, 9520, h | 0) | 0;
            n = 7704;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9520) | 0)) {
            $ = 9520;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            ci(9520);
        }
        return 9520;
    }
    function oV($) {
        $ = $ | 0;
        return 0;
    }
    function oW($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = oQ() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            o9(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            c$(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function o9($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function c$($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = c0($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            cn(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            o9(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            cr($, f);
            ce(f);
            s = c;
            return;
        }
    }
    function c0($) {
        $ = $ | 0;
        return 357913941;
    }
    function cn($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function cr($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function ce($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function ci($) {
        $ = $ | 0;
        c2($);
        return;
    }
    function c_($) {
        $ = $ | 0;
        ct(($ + 24) | 0);
        return;
    }
    function ct($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function c2($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 1, n, cu() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function cu() {
        return 1224;
    }
    function cf($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0.0, i = 0, t = 0, u = 0, f = 0;
        i = s;
        s = (s + 16) | 0;
        t = (i + 8) | 0;
        u = i;
        f = co($) | 0;
        $ = _[(f + 4) >> 2] | 0;
        _[u >> 2] = _[f >> 2];
        _[(u + 4) >> 2] = $;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = _[(u + 4) >> 2];
        e = +cc(n, t, r);
        s = i;
        return +e;
    }
    function co($) {
        $ = $ | 0;
        return ((_[((oQ() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function cc($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0.0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        uA(i, r);
        i = uI(i, r) | 0;
        u = +_T(+MH[e & 7]($, i));
        s = t;
        return +u;
    }
    function c6($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        ca($, r, i, 1);
        s = e;
        return;
    }
    function ca($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = c1() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = c4(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, cl(t, e) | 0, e);
        s = i;
        return;
    }
    function c1() {
        var $ = 0, n = 0;
        if (!(e[7712] | 0)) {
            ck(9556);
            $I(35, 9556, h | 0) | 0;
            n = 7712;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9556) | 0)) {
            $ = 9556;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            ck(9556);
        }
        return 9556;
    }
    function c4($) {
        $ = $ | 0;
        return 0;
    }
    function cl($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = c1() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            cv(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            c7(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function cv($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function c7($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = c5($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            cs(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            cv(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            c3($, f);
            cb(f);
            s = c;
            return;
        }
    }
    function c5($) {
        $ = $ | 0;
        return 357913941;
    }
    function cs($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function c3($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function cb($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function ck($) {
        $ = $ | 0;
        cw($);
        return;
    }
    function ch($) {
        $ = $ | 0;
        cd(($ + 24) | 0);
        return;
    }
    function cd($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function cw($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 5, n, c8() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function c8() {
        return 1232;
    }
    function cm($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0.0, e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = cy($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        r = +cp(n, i);
        s = e;
        return +r;
    }
    function cy($) {
        $ = $ | 0;
        return ((_[((c1() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function cp($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) r = _[((_[$ >> 2] | 0) + r) >> 2] | 0;
        return +(+_T(+Mz[r & 15]($)));
    }
    function cC($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        cM($, r, i, 1);
        s = e;
        return;
    }
    function cM($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = cg() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = cA(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, cI(t, e) | 0, e);
        s = i;
        return;
    }
    function cg() {
        var $ = 0, n = 0;
        if (!(e[7720] | 0)) {
            cP(9592);
            $I(36, 9592, h | 0) | 0;
            n = 7720;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9592) | 0)) {
            $ = 9592;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            cP(9592);
        }
        return 9592;
    }
    function cA($) {
        $ = $ | 0;
        return 0;
    }
    function cI($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = cg() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            cS(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            cT(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function cS($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function cT($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = cx($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            cN(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            cS(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            cL($, f);
            cO(f);
            s = c;
            return;
        }
    }
    function cx($) {
        $ = $ | 0;
        return 357913941;
    }
    function cN($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function cL($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function cO($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function cP($) {
        $ = $ | 0;
        cB($);
        return;
    }
    function cE($) {
        $ = $ | 0;
        cG(($ + 24) | 0);
        return;
    }
    function cG($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function cB($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 7, n, cR() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function cR() {
        return 1276;
    }
    function cY($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        r = s;
        s = (s + 16) | 0;
        e = (r + 8) | 0;
        i = r;
        t = cU($) | 0;
        $ = _[(t + 4) >> 2] | 0;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = $;
        _[e >> 2] = _[i >> 2];
        _[(e + 4) >> 2] = _[(i + 4) >> 2];
        n = cj(n, e) | 0;
        s = r;
        return n | 0;
    }
    function cU($) {
        $ = $ | 0;
        return ((_[((cg() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function cj($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0;
        i = s;
        s = (s + 16) | 0;
        e = i;
        r = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) r = _[((_[$ >> 2] | 0) + r) >> 2] | 0;
        MG[r & 31](e, $);
        e = cz(e) | 0;
        s = i;
        return e | 0;
    }
    function cz($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0;
        i = s;
        s = (s + 32) | 0;
        n = (i + 12) | 0;
        r = i;
        e = tq(cD() | 0) | 0;
        if (!e) $ = cK($) | 0;
        else {
            tH(n, e);
            tX(r, n);
            cF($, r);
            $ = tJ(n) | 0;
        }
        s = i;
        return $ | 0;
    }
    function cD() {
        var $ = 0;
        if (!(e[7736] | 0)) {
            a0(9640);
            $I(25, 9640, h | 0) | 0;
            $ = 7736;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 9640;
    }
    function cF($, n) {
        $ = $ | 0;
        n = n | 0;
        cJ(n, $, ($ + 8) | 0) | 0;
        return;
    }
    function cK($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0;
        r = s;
        s = (s + 16) | 0;
        i = (r + 4) | 0;
        u = r;
        e = mn(8) | 0;
        n = e;
        f = CM(16) | 0;
        _[f >> 2] = _[$ >> 2];
        _[(f + 4) >> 2] = _[($ + 4) >> 2];
        _[(f + 8) >> 2] = _[($ + 8) >> 2];
        _[(f + 12) >> 2] = _[($ + 12) >> 2];
        t = (n + 4) | 0;
        _[t >> 2] = f;
        $ = CM(8) | 0;
        t = _[t >> 2] | 0;
        _[u >> 2] = 0;
        _[i >> 2] = _[u >> 2];
        cq($, t, i);
        _[e >> 2] = $;
        s = r;
        return n | 0;
    }
    function cq($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        r = CM(16) | 0;
        _[(r + 4) >> 2] = 0;
        _[(r + 8) >> 2] = 0;
        _[r >> 2] = 1244;
        _[(r + 12) >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function cH($) {
        $ = $ | 0;
        Cw($);
        CA($);
        return;
    }
    function cX($) {
        $ = $ | 0;
        $ = _[($ + 12) >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function cZ($) {
        $ = $ | 0;
        CA($);
        return;
    }
    function cJ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        n = cQ(_[$ >> 2] | 0, n, r) | 0;
        r = ($ + 4) | 0;
        _[((_[r >> 2] | 0) + 8) >> 2] = n;
        return _[((_[r >> 2] | 0) + 8) >> 2] | 0;
    }
    function cQ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0;
        e = s;
        s = (s + 16) | 0;
        i = e;
        p7(i);
        $ = _d($) | 0;
        r = cV($, _[n >> 2] | 0, +c[r >> 3]) | 0;
        ps(i);
        s = e;
        return r | 0;
    }
    function cV($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        var e = 0;
        e = _m(cW() | 0) | 0;
        n = _p(n) | 0;
        return $8(0, e | 0, $ | 0, n | 0, +(+_y(r))) | 0;
    }
    function cW() {
        var $ = 0;
        if (!(e[7728] | 0)) {
            c9(9628);
            $ = 7728;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 9628;
    }
    function c9($) {
        $ = $ | 0;
        _L($, a$() | 0, 2);
        return;
    }
    function a$() {
        return 1264;
    }
    function a0($) {
        $ = $ | 0;
        u6($);
        return;
    }
    function an($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        ar($, r, i, 1);
        s = e;
        return;
    }
    function ar($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = ae() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = ai(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, a_(t, e) | 0, e);
        s = i;
        return;
    }
    function ae() {
        var $ = 0, n = 0;
        if (!(e[7744] | 0)) {
            a6(9684);
            $I(37, 9684, h | 0) | 0;
            n = 7744;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9684) | 0)) {
            $ = 9684;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            a6(9684);
        }
        return 9684;
    }
    function ai($) {
        $ = $ | 0;
        return 0;
    }
    function a_($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = ae() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            at(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            a2(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function at($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function a2($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = au($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            af(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            at(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            ao($, f);
            ac(f);
            s = c;
            return;
        }
    }
    function au($) {
        $ = $ | 0;
        return 357913941;
    }
    function af($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function ao($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function ac($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function a6($) {
        $ = $ | 0;
        a4($);
        return;
    }
    function aa($) {
        $ = $ | 0;
        a1(($ + 24) | 0);
        return;
    }
    function a1($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function a4($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 5, n, al() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function al() {
        return 1280;
    }
    function av($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = a7($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        r = a5(n, i, r) | 0;
        s = e;
        return r | 0;
    }
    function a7($) {
        $ = $ | 0;
        return ((_[((ae() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function a5($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        u = s;
        s = (s + 32) | 0;
        i = u;
        t = (u + 16) | 0;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        uA(t, r);
        t = uI(t, r) | 0;
        MV[e & 15](i, $, t);
        t = cz(i) | 0;
        s = u;
        return t | 0;
    }
    function as($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        a3($, r, i, 1);
        s = e;
        return;
    }
    function a3($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = ab() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = ak(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, ah(t, e) | 0, e);
        s = i;
        return;
    }
    function ab() {
        var $ = 0, n = 0;
        if (!(e[7752] | 0)) {
            aC(9720);
            $I(38, 9720, h | 0) | 0;
            n = 7752;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9720) | 0)) {
            $ = 9720;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            aC(9720);
        }
        return 9720;
    }
    function ak($) {
        $ = $ | 0;
        return 0;
    }
    function ah($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = ab() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            ad(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            aw(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function ad($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function aw($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = a8($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            am(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            ad(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            ay($, f);
            ap(f);
            s = c;
            return;
        }
    }
    function a8($) {
        $ = $ | 0;
        return 357913941;
    }
    function am($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function ay($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function ap($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function aC($) {
        $ = $ | 0;
        aA($);
        return;
    }
    function aM($) {
        $ = $ | 0;
        ag(($ + 24) | 0);
        return;
    }
    function ag($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function aA($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 8, n, aI() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function aI() {
        return 1288;
    }
    function aS($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        r = s;
        s = (s + 16) | 0;
        e = (r + 8) | 0;
        i = r;
        t = aT($) | 0;
        $ = _[(t + 4) >> 2] | 0;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = $;
        _[e >> 2] = _[i >> 2];
        _[(e + 4) >> 2] = _[(i + 4) >> 2];
        n = ax(n, e) | 0;
        s = r;
        return n | 0;
    }
    function aT($) {
        $ = $ | 0;
        return ((_[((ab() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function ax($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) r = _[((_[$ >> 2] | 0) + r) >> 2] | 0;
        return _S(MB[r & 31]($) | 0) | 0;
    }
    function aN($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        aL($, r, i, 0);
        s = e;
        return;
    }
    function aL($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = aO() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = aP(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, aE(t, e) | 0, e);
        s = i;
        return;
    }
    function aO() {
        var $ = 0, n = 0;
        if (!(e[7760] | 0)) {
            az(9756);
            $I(39, 9756, h | 0) | 0;
            n = 7760;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9756) | 0)) {
            $ = 9756;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            az(9756);
        }
        return 9756;
    }
    function aP($) {
        $ = $ | 0;
        return 0;
    }
    function aE($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = aO() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            aG(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            aB(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function aG($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function aB($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = aR($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            aY(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            aG(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            aU($, f);
            aj(f);
            s = c;
            return;
        }
    }
    function aR($) {
        $ = $ | 0;
        return 357913941;
    }
    function aY($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function aU($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function aj($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function az($) {
        $ = $ | 0;
        aK($);
        return;
    }
    function aD($) {
        $ = $ | 0;
        aF(($ + 24) | 0);
        return;
    }
    function aF($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function aK($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 8, n, aq() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function aq() {
        return 1292;
    }
    function aH($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = aX($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        aZ(n, i, r);
        s = e;
        return;
    }
    function aX($) {
        $ = $ | 0;
        return ((_[((aO() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function aZ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        var e = 0, i = 0, t = 0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        uM(i, r);
        r = +ug(i, r);
        MO[e & 31]($, r);
        s = t;
        return;
    }
    function aJ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        aQ($, r, i, 0);
        s = e;
        return;
    }
    function aQ($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = aV() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = aW(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, a9(t, e) | 0, e);
        s = i;
        return;
    }
    function aV() {
        var $ = 0, n = 0;
        if (!(e[7768] | 0)) {
            l_(9792);
            $I(40, 9792, h | 0) | 0;
            n = 7768;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9792) | 0)) {
            $ = 9792;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            l_(9792);
        }
        return 9792;
    }
    function aW($) {
        $ = $ | 0;
        return 0;
    }
    function a9($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = aV() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            l$(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            l0(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function l$($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function l0($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = ln($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            lr(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            l$(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            le($, f);
            li(f);
            s = c;
            return;
        }
    }
    function ln($) {
        $ = $ | 0;
        return 357913941;
    }
    function lr($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function le($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function li($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function l_($) {
        $ = $ | 0;
        lu($);
        return;
    }
    function lt($) {
        $ = $ | 0;
        l2(($ + 24) | 0);
        return;
    }
    function l2($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function lu($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 1, n, lf() | 0, 2);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function lf() {
        return 1300;
    }
    function lo($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = +e;
        var i = 0, t = 0, u = 0, f = 0;
        i = s;
        s = (s + 16) | 0;
        t = (i + 8) | 0;
        u = i;
        f = lc($) | 0;
        $ = _[(f + 4) >> 2] | 0;
        _[u >> 2] = _[f >> 2];
        _[(u + 4) >> 2] = $;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = _[(u + 4) >> 2];
        l6(n, t, r, e);
        s = i;
        return;
    }
    function lc($) {
        $ = $ | 0;
        return ((_[((aV() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function l6($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = +e;
        var i = 0, t = 0, u = 0, f = 0;
        f = s;
        s = (s + 16) | 0;
        t = (f + 1) | 0;
        u = f;
        i = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) i = _[((_[$ >> 2] | 0) + i) >> 2] | 0;
        uA(t, r);
        t = uI(t, r) | 0;
        uM(u, e);
        e = +ug(u, e);
        M9[i & 15]($, t, e);
        s = f;
        return;
    }
    function la($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        l1($, r, i, 0);
        s = e;
        return;
    }
    function l1($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = l4() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = ll(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, lv(t, e) | 0, e);
        s = i;
        return;
    }
    function l4() {
        var $ = 0, n = 0;
        if (!(e[7776] | 0)) {
            lh(9828);
            $I(41, 9828, h | 0) | 0;
            n = 7776;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9828) | 0)) {
            $ = 9828;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            lh(9828);
        }
        return 9828;
    }
    function ll($) {
        $ = $ | 0;
        return 0;
    }
    function lv($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = l4() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            l7(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            l5(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function l7($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function l5($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = ls($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            l3(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            l7(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            lb($, f);
            lk(f);
            s = c;
            return;
        }
    }
    function ls($) {
        $ = $ | 0;
        return 357913941;
    }
    function l3($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function lb($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function lk($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function lh($) {
        $ = $ | 0;
        l8($);
        return;
    }
    function ld($) {
        $ = $ | 0;
        lw(($ + 24) | 0);
        return;
    }
    function lw($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function l8($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 7, n, lm() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function lm() {
        return 1312;
    }
    function ly($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = lp($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        lC(n, i, r);
        s = e;
        return;
    }
    function lp($) {
        $ = $ | 0;
        return ((_[((l4() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function lC($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        uA(i, r);
        i = uI(i, r) | 0;
        MG[e & 31]($, i);
        s = t;
        return;
    }
    function lM($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        lg($, r, i, 0);
        s = e;
        return;
    }
    function lg($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = lA() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = lI(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, lS(t, e) | 0, e);
        s = i;
        return;
    }
    function lA() {
        var $ = 0, n = 0;
        if (!(e[7784] | 0)) {
            lE(9864);
            $I(42, 9864, h | 0) | 0;
            n = 7784;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9864) | 0)) {
            $ = 9864;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            lE(9864);
        }
        return 9864;
    }
    function lI($) {
        $ = $ | 0;
        return 0;
    }
    function lS($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = lA() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            lT(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            lx(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function lT($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function lx($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = lN($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            lL(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            lT(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            lO($, f);
            lP(f);
            s = c;
            return;
        }
    }
    function lN($) {
        $ = $ | 0;
        return 357913941;
    }
    function lL($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function lO($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function lP($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function lE($) {
        $ = $ | 0;
        lR($);
        return;
    }
    function lG($) {
        $ = $ | 0;
        lB(($ + 24) | 0);
        return;
    }
    function lB($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function lR($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 8, n, lY() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function lY() {
        return 1320;
    }
    function lU($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = lj($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        lz(n, i, r);
        s = e;
        return;
    }
    function lj($) {
        $ = $ | 0;
        return ((_[((lA() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function lz($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        lD(i, r);
        i = lF(i, r) | 0;
        MG[e & 31]($, i);
        s = t;
        return;
    }
    function lD($, n) {
        $ = $ | 0;
        n = n | 0;
        return;
    }
    function lF($, n) {
        $ = $ | 0;
        n = n | 0;
        return lK(n) | 0;
    }
    function lK($) {
        $ = $ | 0;
        return $ | 0;
    }
    function lq($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        lH($, r, i, 0);
        s = e;
        return;
    }
    function lH($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = lX() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = lZ(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, lJ(t, e) | 0, e);
        s = i;
        return;
    }
    function lX() {
        var $ = 0, n = 0;
        if (!(e[7792] | 0)) {
            vn(9900);
            $I(43, 9900, h | 0) | 0;
            n = 7792;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9900) | 0)) {
            $ = 9900;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            vn(9900);
        }
        return 9900;
    }
    function lZ($) {
        $ = $ | 0;
        return 0;
    }
    function lJ($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = lX() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            lQ(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            lV(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function lQ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function lV($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = lW($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            l9(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            lQ(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            v$($, f);
            v0(f);
            s = c;
            return;
        }
    }
    function lW($) {
        $ = $ | 0;
        return 357913941;
    }
    function l9($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function v$($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function v0($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function vn($) {
        $ = $ | 0;
        vi($);
        return;
    }
    function vr($) {
        $ = $ | 0;
        ve(($ + 24) | 0);
        return;
    }
    function ve($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function vi($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 22, n, v_() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function v_() {
        return 1344;
    }
    function vt($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0;
        r = s;
        s = (s + 16) | 0;
        e = (r + 8) | 0;
        i = r;
        t = v2($) | 0;
        $ = _[(t + 4) >> 2] | 0;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = $;
        _[e >> 2] = _[i >> 2];
        _[(e + 4) >> 2] = _[(i + 4) >> 2];
        vu(n, e);
        s = r;
        return;
    }
    function v2($) {
        $ = $ | 0;
        return ((_[((lX() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function vu($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) r = _[((_[$ >> 2] | 0) + r) >> 2] | 0;
        ME[r & 127]($);
        return;
    }
    function vf($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = vo() | 0;
        $ = vc(r) | 0;
        tp(t, n, i, $, v6(r, e) | 0, e);
        return;
    }
    function vo() {
        var $ = 0, n = 0;
        if (!(e[7800] | 0)) {
            v5(9936);
            $I(44, 9936, h | 0) | 0;
            n = 7800;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9936) | 0)) {
            $ = 9936;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            v5(9936);
        }
        return 9936;
    }
    function vc($) {
        $ = $ | 0;
        return $ | 0;
    }
    function v6($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = vo() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            va(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            v1(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function va($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function v1($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = v4($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            vl(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            va(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            vv($, i);
            v7(i);
            s = f;
            return;
        }
    }
    function v4($) {
        $ = $ | 0;
        return 536870911;
    }
    function vl($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function vv($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function v7($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function v5($) {
        $ = $ | 0;
        vb($);
        return;
    }
    function vs($) {
        $ = $ | 0;
        v3(($ + 24) | 0);
        return;
    }
    function v3($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function vb($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 23, n, oC() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function vk($, n) {
        $ = $ | 0;
        n = n | 0;
        vd(_[(vh($) | 0) >> 2] | 0, n);
        return;
    }
    function vh($) {
        $ = $ | 0;
        return ((_[((vo() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function vd($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        oI(e, n);
        n = oS(e, n) | 0;
        ME[$ & 127](n);
        s = r;
        return;
    }
    function vw($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = v8() | 0;
        $ = vm(r) | 0;
        tp(t, n, i, $, vy(r, e) | 0, e);
        return;
    }
    function v8() {
        var $ = 0, n = 0;
        if (!(e[7808] | 0)) {
            vS(9972);
            $I(45, 9972, h | 0) | 0;
            n = 7808;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(9972) | 0)) {
            $ = 9972;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            vS(9972);
        }
        return 9972;
    }
    function vm($) {
        $ = $ | 0;
        return $ | 0;
    }
    function vy($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = v8() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            vp(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            vC(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function vp($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function vC($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = vM($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            vg(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            vp(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            vA($, i);
            vI(i);
            s = f;
            return;
        }
    }
    function vM($) {
        $ = $ | 0;
        return 536870911;
    }
    function vg($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function vA($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function vI($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function vS($) {
        $ = $ | 0;
        vN($);
        return;
    }
    function vT($) {
        $ = $ | 0;
        vx(($ + 24) | 0);
        return;
    }
    function vx($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function vN($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 9, n, vL() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function vL() {
        return 1348;
    }
    function vO($, n) {
        $ = $ | 0;
        n = n | 0;
        return vE(_[(vP($) | 0) >> 2] | 0, n) | 0;
    }
    function vP($) {
        $ = $ | 0;
        return ((_[((v8() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function vE($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        vG(e, n);
        n = vB(e, n) | 0;
        n = fN(MB[$ & 31](n) | 0) | 0;
        s = r;
        return n | 0;
    }
    function vG($, n) {
        $ = $ | 0;
        n = n | 0;
        return;
    }
    function vB($, n) {
        $ = $ | 0;
        n = n | 0;
        return vR(n) | 0;
    }
    function vR($) {
        $ = $ | 0;
        return $ | 0;
    }
    function vY($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = vU() | 0;
        $ = vj(r) | 0;
        tp(t, n, i, $, vz(r, e) | 0, e);
        return;
    }
    function vU() {
        var $ = 0, n = 0;
        if (!(e[7816] | 0)) {
            vZ(10008);
            $I(46, 10008, h | 0) | 0;
            n = 7816;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10008) | 0)) {
            $ = 10008;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            vZ(10008);
        }
        return 10008;
    }
    function vj($) {
        $ = $ | 0;
        return $ | 0;
    }
    function vz($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = vU() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            vD(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            vF(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function vD($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function vF($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = vK($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            vq(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            vD(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            vH($, i);
            vX(i);
            s = f;
            return;
        }
    }
    function vK($) {
        $ = $ | 0;
        return 536870911;
    }
    function vq($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function vH($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function vX($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function vZ($) {
        $ = $ | 0;
        vV($);
        return;
    }
    function vJ($) {
        $ = $ | 0;
        vQ(($ + 24) | 0);
        return;
    }
    function vQ($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function vV($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 15, n, fX() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function vW($) {
        $ = $ | 0;
        return s$(_[(v9($) | 0) >> 2] | 0) | 0;
    }
    function v9($) {
        $ = $ | 0;
        return ((_[((vU() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function s$($) {
        $ = $ | 0;
        return fN(MX[$ & 7]() | 0) | 0;
    }
    function s0() {
        var $ = 0;
        if (!(e[7832] | 0)) {
            so(10052);
            $I(25, 10052, h | 0) | 0;
            $ = 7832;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10052;
    }
    function sn($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = sr() | 0;
        _[($ + 4) >> 2] = se() | 0;
        _[($ + 12) >> 2] = n;
        _[($ + 8) >> 2] = si() | 0;
        _[($ + 32) >> 2] = 2;
        return;
    }
    function sr() {
        return 11709;
    }
    function se() {
        return 1188;
    }
    function si() {
        return su() | 0;
    }
    function s_($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((st(e, 896) | 0) == 512) {
            if (r | 0) {
                s2(r);
                CA(r);
            }
        } else if (n | 0) {
            ic(n);
            CA(n);
        }
        return;
    }
    function st($, n) {
        $ = $ | 0;
        n = n | 0;
        return (n & $) | 0;
    }
    function s2($) {
        $ = $ | 0;
        $ = _[($ + 4) >> 2] | 0;
        if ($ | 0) Cp($);
        return;
    }
    function su() {
        var $ = 0;
        if (!(e[7824] | 0)) {
            _[2511] = sf() | 0;
            _[2512] = 0;
            $ = 7824;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10044;
    }
    function sf() {
        return 0;
    }
    function so($) {
        $ = $ | 0;
        u6($);
        return;
    }
    function sc($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0;
        n = s;
        s = (s + 32) | 0;
        r = (n + 24) | 0;
        t = (n + 16) | 0;
        i = (n + 8) | 0;
        e = n;
        s6($, 4827);
        sa($, 4834, 3) | 0;
        s1($, 3682, 47) | 0;
        _[t >> 2] = 9;
        _[(t + 4) >> 2] = 0;
        _[r >> 2] = _[t >> 2];
        _[(r + 4) >> 2] = _[(t + 4) >> 2];
        s4($, 4841, r) | 0;
        _[i >> 2] = 1;
        _[(i + 4) >> 2] = 0;
        _[r >> 2] = _[i >> 2];
        _[(r + 4) >> 2] = _[(i + 4) >> 2];
        sl($, 4871, r) | 0;
        _[e >> 2] = 10;
        _[(e + 4) >> 2] = 0;
        _[r >> 2] = _[e >> 2];
        _[(r + 4) >> 2] = _[(e + 4) >> 2];
        sv($, 4891, r) | 0;
        s = n;
        return;
    }
    function s6($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = bq() | 0;
        _[$ >> 2] = r;
        bH(r, n);
        hq(_[$ >> 2] | 0);
        return;
    }
    function sa($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        bI($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function s1($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        bv($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function s4($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        sQ($, n, i);
        s = e;
        return $ | 0;
    }
    function sl($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        sT($, n, i);
        s = e;
        return $ | 0;
    }
    function sv($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = _[(r + 4) >> 2] | 0;
        _[t >> 2] = _[r >> 2];
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        s7($, n, i);
        s = e;
        return $ | 0;
    }
    function s7($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        s5($, r, i, 1);
        s = e;
        return;
    }
    function s5($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = ss() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = s3(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, sb(t, e) | 0, e);
        s = i;
        return;
    }
    function ss() {
        var $ = 0, n = 0;
        if (!(e[7840] | 0)) {
            sy(10100);
            $I(48, 10100, h | 0) | 0;
            n = 7840;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10100) | 0)) {
            $ = 10100;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            sy(10100);
        }
        return 10100;
    }
    function s3($) {
        $ = $ | 0;
        return 0;
    }
    function sb($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = ss() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            sk(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            sh(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function sk($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function sh($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = sd($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            sw(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            sk(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            s8($, f);
            sm(f);
            s = c;
            return;
        }
    }
    function sd($) {
        $ = $ | 0;
        return 357913941;
    }
    function sw($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function s8($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function sm($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function sy($) {
        $ = $ | 0;
        sM($);
        return;
    }
    function sp($) {
        $ = $ | 0;
        sC(($ + 24) | 0);
        return;
    }
    function sC($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function sM($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 6, n, sg() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function sg() {
        return 1364;
    }
    function sA($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = sI($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        r = sS(n, i, r) | 0;
        s = e;
        return r | 0;
    }
    function sI($) {
        $ = $ | 0;
        return ((_[((ss() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function sS($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        uA(i, r);
        i = uI(i, r) | 0;
        i = uZ(MF[e & 15]($, i) | 0) | 0;
        s = t;
        return i | 0;
    }
    function sT($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        sx($, r, i, 0);
        s = e;
        return;
    }
    function sx($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = sN() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = sL(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, sO(t, e) | 0, e);
        s = i;
        return;
    }
    function sN() {
        var $ = 0, n = 0;
        if (!(e[7848] | 0)) {
            sU(10136);
            $I(49, 10136, h | 0) | 0;
            n = 7848;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10136) | 0)) {
            $ = 10136;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            sU(10136);
        }
        return 10136;
    }
    function sL($) {
        $ = $ | 0;
        return 0;
    }
    function sO($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = sN() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            sP(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            sE(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function sP($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function sE($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = sG($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            sB(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            sP(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            sR($, f);
            sY(f);
            s = c;
            return;
        }
    }
    function sG($) {
        $ = $ | 0;
        return 357913941;
    }
    function sB($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function sR($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function sY($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function sU($) {
        $ = $ | 0;
        sD($);
        return;
    }
    function sj($) {
        $ = $ | 0;
        sz(($ + 24) | 0);
        return;
    }
    function sz($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function sD($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 9, n, sF() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function sF() {
        return 1372;
    }
    function sK($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        u = sq($) | 0;
        $ = _[(u + 4) >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = $;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        sH(n, i, r);
        s = e;
        return;
    }
    function sq($) {
        $ = $ | 0;
        return ((_[((sN() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function sH($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        var e = 0, i = 0, t = 0, u = n0;
        t = s;
        s = (s + 16) | 0;
        i = t;
        e = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) e = _[((_[$ >> 2] | 0) + e) >> 2] | 0;
        sX(i, r);
        u = X(sZ(i, r));
        ML[e & 1]($, u);
        s = t;
        return;
    }
    function sX($, n) {
        $ = $ | 0;
        n = +n;
        return;
    }
    function sZ($, n) {
        $ = $ | 0;
        n = +n;
        return X(sJ(n));
    }
    function sJ($) {
        $ = +$;
        return X($);
    }
    function sQ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        i = (e + 8) | 0;
        t = e;
        f = _[r >> 2] | 0;
        u = _[(r + 4) >> 2] | 0;
        r = td(n) | 0;
        _[t >> 2] = f;
        _[(t + 4) >> 2] = u;
        _[i >> 2] = _[t >> 2];
        _[(i + 4) >> 2] = _[(t + 4) >> 2];
        sV($, r, i, 0);
        s = e;
        return;
    }
    function sV($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        i = s;
        s = (s + 32) | 0;
        t = (i + 16) | 0;
        a = (i + 8) | 0;
        f = i;
        c = _[r >> 2] | 0;
        o = _[(r + 4) >> 2] | 0;
        u = _[$ >> 2] | 0;
        $ = sW() | 0;
        _[a >> 2] = c;
        _[(a + 4) >> 2] = o;
        _[t >> 2] = _[a >> 2];
        _[(t + 4) >> 2] = _[(a + 4) >> 2];
        r = s9(t) | 0;
        _[f >> 2] = c;
        _[(f + 4) >> 2] = o;
        _[t >> 2] = _[f >> 2];
        _[(t + 4) >> 2] = _[(f + 4) >> 2];
        tp(u, n, $, r, b$(t, e) | 0, e);
        s = i;
        return;
    }
    function sW() {
        var $ = 0, n = 0;
        if (!(e[7856] | 0)) {
            bt(10172);
            $I(50, 10172, h | 0) | 0;
            n = 7856;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10172) | 0)) {
            $ = 10172;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            bt(10172);
        }
        return 10172;
    }
    function s9($) {
        $ = $ | 0;
        return 0;
    }
    function b$($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        a = s;
        s = (s + 32) | 0;
        i = (a + 24) | 0;
        u = (a + 16) | 0;
        f = a;
        o = (a + 8) | 0;
        t = _[$ >> 2] | 0;
        e = _[($ + 4) >> 2] | 0;
        _[f >> 2] = t;
        _[(f + 4) >> 2] = e;
        l = sW() | 0;
        c = (l + 24) | 0;
        $ = tA(n, 4) | 0;
        _[o >> 2] = $;
        n = (l + 28) | 0;
        r = _[n >> 2] | 0;
        if (r >>> 0 < (_[(l + 32) >> 2] | 0) >>> 0) {
            _[u >> 2] = t;
            _[(u + 4) >> 2] = e;
            _[i >> 2] = _[u >> 2];
            _[(i + 4) >> 2] = _[(u + 4) >> 2];
            b0(r, i, $);
            $ = ((_[n >> 2] | 0) + 12) | 0;
            _[n >> 2] = $;
        } else {
            bn(c, f, o);
            $ = _[n >> 2] | 0;
        }
        s = a;
        return ((((($ - (_[c >> 2] | 0)) | 0) / 12) | 0) + -1) | 0;
    }
    function b0($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _[(n + 4) >> 2] | 0;
        _[$ >> 2] = _[n >> 2];
        _[($ + 4) >> 2] = e;
        _[($ + 8) >> 2] = r;
        return;
    }
    function bn($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0;
        c = s;
        s = (s + 48) | 0;
        e = (c + 32) | 0;
        u = (c + 24) | 0;
        f = c;
        o = ($ + 4) | 0;
        i = ((((((_[o >> 2] | 0) - (_[$ >> 2] | 0)) | 0) / 12) | 0) + 1) | 0;
        t = br($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            a = _[$ >> 2] | 0;
            v = ((((_[($ + 8) >> 2] | 0) - a) | 0) / 12) | 0;
            l = v << 1;
            be(f, v >>> 0 < (t >>> 1) >>> 0 ? (l >>> 0 < i >>> 0 ? i : l) : t, ((((_[o >> 2] | 0) - a) | 0) / 12) | 0, ($ + 8) | 0);
            o = (f + 8) | 0;
            t = _[o >> 2] | 0;
            i = _[(n + 4) >> 2] | 0;
            r = _[r >> 2] | 0;
            _[u >> 2] = _[n >> 2];
            _[(u + 4) >> 2] = i;
            _[e >> 2] = _[u >> 2];
            _[(e + 4) >> 2] = _[(u + 4) >> 2];
            b0(t, e, r);
            _[o >> 2] = (_[o >> 2] | 0) + 12;
            bi($, f);
            b_(f);
            s = c;
            return;
        }
    }
    function br($) {
        $ = $ | 0;
        return 357913941;
    }
    function be($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 357913941) $Y();
            else {
                i = CM((n * 12) | 0) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + ((r * 12) | 0)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + ((n * 12) | 0);
        return;
    }
    function bi($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + (((((i | 0) / -12) | 0) * 12) | 0)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function b_($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + ((~(((((e + -12 - n) | 0) >>> 0) / 12) | 0) * 12) | 0);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function bt($) {
        $ = $ | 0;
        bf($);
        return;
    }
    function b2($) {
        $ = $ | 0;
        bu(($ + 24) | 0);
        return;
    }
    function bu($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + ((~(((((n + -12 - e) | 0) >>> 0) / 12) | 0) * 12) | 0);
            CA(r);
        }
        return;
    }
    function bf($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 2, 3, n, bo() | 0, 2);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function bo() {
        return 1380;
    }
    function bc($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0;
        i = s;
        s = (s + 16) | 0;
        t = (i + 8) | 0;
        u = i;
        f = b6($) | 0;
        $ = _[(f + 4) >> 2] | 0;
        _[u >> 2] = _[f >> 2];
        _[(u + 4) >> 2] = $;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = _[(u + 4) >> 2];
        ba(n, t, r, e);
        s = i;
        return;
    }
    function b6($) {
        $ = $ | 0;
        return ((_[((sW() | 0) + 24) >> 2] | 0) + (($ * 12) | 0)) | 0;
    }
    function ba($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0;
        f = s;
        s = (s + 16) | 0;
        t = (f + 1) | 0;
        u = f;
        i = _[n >> 2] | 0;
        n = _[(n + 4) >> 2] | 0;
        $ = ($ + (n >> 1)) | 0;
        if (n & 1) i = _[((_[$ >> 2] | 0) + i) >> 2] | 0;
        uA(t, r);
        t = uI(t, r) | 0;
        b1(u, e);
        u = b4(u, e) | 0;
        MV[i & 15]($, t, u);
        s = f;
        return;
    }
    function b1($, n) {
        $ = $ | 0;
        n = n | 0;
        return;
    }
    function b4($, n) {
        $ = $ | 0;
        n = n | 0;
        return bl(n) | 0;
    }
    function bl($) {
        $ = $ | 0;
        return (($ | 0) != 0) | 0;
    }
    function bv($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = b7() | 0;
        $ = b5(r) | 0;
        tp(t, n, i, $, bs(r, e) | 0, e);
        return;
    }
    function b7() {
        var $ = 0, n = 0;
        if (!(e[7864] | 0)) {
            b8(10208);
            $I(51, 10208, h | 0) | 0;
            n = 7864;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10208) | 0)) {
            $ = 10208;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            b8(10208);
        }
        return 10208;
    }
    function b5($) {
        $ = $ | 0;
        return $ | 0;
    }
    function bs($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = b7() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            b3(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            bb(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function b3($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function bb($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = bk($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            bh(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            b3(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            bd($, i);
            bw(i);
            s = f;
            return;
        }
    }
    function bk($) {
        $ = $ | 0;
        return 536870911;
    }
    function bh($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function bd($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function bw($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function b8($) {
        $ = $ | 0;
        bp($);
        return;
    }
    function bm($) {
        $ = $ | 0;
        by(($ + 24) | 0);
        return;
    }
    function by($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function bp($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 24, n, bC() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function bC() {
        return 1392;
    }
    function bM($, n) {
        $ = $ | 0;
        n = n | 0;
        bA(_[(bg($) | 0) >> 2] | 0, n);
        return;
    }
    function bg($) {
        $ = $ | 0;
        return ((_[((b7() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function bA($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        vG(e, n);
        n = vB(e, n) | 0;
        ME[$ & 127](n);
        s = r;
        return;
    }
    function bI($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = bS() | 0;
        $ = bT(r) | 0;
        tp(t, n, i, $, bx(r, e) | 0, e);
        return;
    }
    function bS() {
        var $ = 0, n = 0;
        if (!(e[7872] | 0)) {
            bB(10244);
            $I(52, 10244, h | 0) | 0;
            n = 7872;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10244) | 0)) {
            $ = 10244;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            bB(10244);
        }
        return 10244;
    }
    function bT($) {
        $ = $ | 0;
        return $ | 0;
    }
    function bx($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = bS() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            bN(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            bL(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function bN($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function bL($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = bO($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            bP(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            bN(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            bE($, i);
            bG(i);
            s = f;
            return;
        }
    }
    function bO($) {
        $ = $ | 0;
        return 536870911;
    }
    function bP($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function bE($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function bG($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function bB($) {
        $ = $ | 0;
        bU($);
        return;
    }
    function bR($) {
        $ = $ | 0;
        bY(($ + 24) | 0);
        return;
    }
    function bY($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function bU($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 16, n, bj() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function bj() {
        return 1400;
    }
    function bz($) {
        $ = $ | 0;
        return bF(_[(bD($) | 0) >> 2] | 0) | 0;
    }
    function bD($) {
        $ = $ | 0;
        return ((_[((bS() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function bF($) {
        $ = $ | 0;
        return bK(MX[$ & 7]() | 0) | 0;
    }
    function bK($) {
        $ = $ | 0;
        return $ | 0;
    }
    function bq() {
        var $ = 0;
        if (!(e[7880] | 0)) {
            bW(10280);
            $I(25, 10280, h | 0) | 0;
            $ = 7880;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10280;
    }
    function bH($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = bX() | 0;
        _[($ + 4) >> 2] = bZ() | 0;
        _[($ + 12) >> 2] = n;
        _[($ + 8) >> 2] = bJ() | 0;
        _[($ + 32) >> 2] = 4;
        return;
    }
    function bX() {
        return 11711;
    }
    function bZ() {
        return 1356;
    }
    function bJ() {
        return su() | 0;
    }
    function bQ($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((st(e, 896) | 0) == 512) {
            if (r | 0) {
                bV(r);
                CA(r);
            }
        } else if (n | 0) {
            ir(n);
            CA(n);
        }
        return;
    }
    function bV($) {
        $ = $ | 0;
        $ = _[($ + 4) >> 2] | 0;
        if ($ | 0) Cp($);
        return;
    }
    function bW($) {
        $ = $ | 0;
        u6($);
        return;
    }
    function b9($) {
        $ = $ | 0;
        k$($, 4920);
        k0($) | 0;
        kn($) | 0;
        return;
    }
    function k$($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = cD() | 0;
        _[$ >> 2] = r;
        k8(r, n);
        hq(_[$ >> 2] | 0);
        return;
    }
    function k0($) {
        $ = $ | 0;
        var n = 0;
        n = _[$ >> 2] | 0;
        ke(n, k4() | 0);
        return $ | 0;
    }
    function kn($) {
        $ = $ | 0;
        var n = 0;
        n = _[$ >> 2] | 0;
        ke(n, kr() | 0);
        return $ | 0;
    }
    function kr() {
        var $ = 0;
        if (!(e[7888] | 0)) {
            ki(10328);
            $I(53, 10328, h | 0) | 0;
            $ = 7888;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        if (!(tE(10328) | 0)) ki(10328);
        return 10328;
    }
    function ke($, n) {
        $ = $ | 0;
        n = n | 0;
        tp($, 0, n, 0, 0, 0);
        return;
    }
    function ki($) {
        $ = $ | 0;
        k2($);
        kf($, 10);
        return;
    }
    function k_($) {
        $ = $ | 0;
        kt(($ + 24) | 0);
        return;
    }
    function kt($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function k2($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 5, 1, n, k6() | 0, 2);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function ku($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        ko($, n, r);
        return;
    }
    function kf($, n) {
        $ = $ | 0;
        n = n | 0;
        _[($ + 20) >> 2] = n;
        return;
    }
    function ko($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 16) | 0;
        t = (e + 8) | 0;
        f = (e + 13) | 0;
        i = e;
        u = (e + 12) | 0;
        uA(f, n);
        _[t >> 2] = uI(f, n) | 0;
        uM(u, r);
        c[i >> 3] = +ug(u, r);
        kc($, t, i);
        s = e;
        return;
    }
    function kc($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        iZ(($ + 8) | 0, _[n >> 2] | 0, +c[r >> 3]);
        e[($ + 24) >> 0] = 1;
        return;
    }
    function k6() {
        return 1404;
    }
    function ka($, n) {
        $ = $ | 0;
        n = +n;
        return k1($, n) | 0;
    }
    function k1($, n) {
        $ = $ | 0;
        n = +n;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        e = s;
        s = (s + 16) | 0;
        t = (e + 4) | 0;
        u = (e + 8) | 0;
        f = e;
        i = mn(8) | 0;
        r = i;
        o = CM(16) | 0;
        uA(t, $);
        $ = uI(t, $) | 0;
        uM(u, n);
        iZ(o, $, +ug(u, n));
        u = (r + 4) | 0;
        _[u >> 2] = o;
        $ = CM(8) | 0;
        u = _[u >> 2] | 0;
        _[f >> 2] = 0;
        _[t >> 2] = _[f >> 2];
        cq($, u, t);
        _[i >> 2] = $;
        s = e;
        return r | 0;
    }
    function k4() {
        var $ = 0;
        if (!(e[7896] | 0)) {
            kl(10364);
            $I(54, 10364, h | 0) | 0;
            $ = 7896;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        if (!(tE(10364) | 0)) kl(10364);
        return 10364;
    }
    function kl($) {
        $ = $ | 0;
        k5($);
        kf($, 55);
        return;
    }
    function kv($) {
        $ = $ | 0;
        k7(($ + 24) | 0);
        return;
    }
    function k7($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function k5($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 5, 4, n, kh() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function ks($) {
        $ = $ | 0;
        k3($);
        return;
    }
    function k3($) {
        $ = $ | 0;
        kb($);
        return;
    }
    function kb($) {
        $ = $ | 0;
        kk(($ + 8) | 0);
        e[($ + 24) >> 0] = 1;
        return;
    }
    function kk($) {
        $ = $ | 0;
        _[$ >> 2] = 0;
        c[($ + 8) >> 3] = 0.0;
        return;
    }
    function kh() {
        return 1424;
    }
    function kd() {
        return kw() | 0;
    }
    function kw() {
        var $ = 0, n = 0, r = 0, e = 0, i = 0, t = 0, u = 0;
        n = s;
        s = (s + 16) | 0;
        i = (n + 4) | 0;
        u = n;
        r = mn(8) | 0;
        $ = r;
        e = CM(16) | 0;
        kk(e);
        t = ($ + 4) | 0;
        _[t >> 2] = e;
        e = CM(8) | 0;
        t = _[t >> 2] | 0;
        _[u >> 2] = 0;
        _[i >> 2] = _[u >> 2];
        cq(e, t, i);
        _[r >> 2] = e;
        s = n;
        return $ | 0;
    }
    function k8($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = km() | 0;
        _[($ + 4) >> 2] = ky() | 0;
        _[($ + 12) >> 2] = n;
        _[($ + 8) >> 2] = kp() | 0;
        _[($ + 32) >> 2] = 5;
        return;
    }
    function km() {
        return 11710;
    }
    function ky() {
        return 1416;
    }
    function kp() {
        return kg() | 0;
    }
    function kC($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((st(e, 896) | 0) == 512) {
            if (r | 0) {
                kM(r);
                CA(r);
            }
        } else if (n | 0) CA(n);
        return;
    }
    function kM($) {
        $ = $ | 0;
        $ = _[($ + 4) >> 2] | 0;
        if ($ | 0) Cp($);
        return;
    }
    function kg() {
        var $ = 0;
        if (!(e[7904] | 0)) {
            _[2600] = kA() | 0;
            _[2601] = 0;
            $ = 7904;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10400;
    }
    function kA() {
        return _[357] | 0;
    }
    function kI($) {
        $ = $ | 0;
        kS($, 4926);
        kT($) | 0;
        return;
    }
    function kS($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = tK() | 0;
        _[$ >> 2] = r;
        kj(r, n);
        hq(_[$ >> 2] | 0);
        return;
    }
    function kT($) {
        $ = $ | 0;
        var n = 0;
        n = _[$ >> 2] | 0;
        ke(n, kx() | 0);
        return $ | 0;
    }
    function kx() {
        var $ = 0;
        if (!(e[7912] | 0)) {
            kN(10412);
            $I(56, 10412, h | 0) | 0;
            $ = 7912;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        if (!(tE(10412) | 0)) kN(10412);
        return 10412;
    }
    function kN($) {
        $ = $ | 0;
        kP($);
        kf($, 57);
        return;
    }
    function kL($) {
        $ = $ | 0;
        kO(($ + 24) | 0);
        return;
    }
    function kO($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function kP($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 5, 5, n, kR() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function kE($) {
        $ = $ | 0;
        kG($);
        return;
    }
    function kG($) {
        $ = $ | 0;
        kB($);
        return;
    }
    function kB($) {
        $ = $ | 0;
        var n = 0, r = 0;
        n = ($ + 8) | 0;
        r = (n + 48) | 0;
        do {
            _[n >> 2] = 0;
            n = (n + 4) | 0;
        }while ((n | 0) < (r | 0))
        e[($ + 56) >> 0] = 1;
        return;
    }
    function kR() {
        return 1432;
    }
    function kY() {
        return kU() | 0;
    }
    function kU() {
        var $ = 0, n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0;
        u = s;
        s = (s + 16) | 0;
        $ = (u + 4) | 0;
        n = u;
        r = mn(8) | 0;
        e = r;
        i = CM(48) | 0;
        t = i;
        f = (t + 48) | 0;
        do {
            _[t >> 2] = 0;
            t = (t + 4) | 0;
        }while ((t | 0) < (f | 0))
        t = (e + 4) | 0;
        _[t >> 2] = i;
        f = CM(8) | 0;
        t = _[t >> 2] | 0;
        _[n >> 2] = 0;
        _[$ >> 2] = _[n >> 2];
        tV(f, t, $);
        _[r >> 2] = f;
        s = u;
        return e | 0;
    }
    function kj($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = kz() | 0;
        _[($ + 4) >> 2] = kD() | 0;
        _[($ + 12) >> 2] = n;
        _[($ + 8) >> 2] = kF() | 0;
        _[($ + 32) >> 2] = 6;
        return;
    }
    function kz() {
        return 11704;
    }
    function kD() {
        return 1436;
    }
    function kF() {
        return kg() | 0;
    }
    function kK($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((st(e, 896) | 0) == 512) {
            if (r | 0) {
                kq(r);
                CA(r);
            }
        } else if (n | 0) CA(n);
        return;
    }
    function kq($) {
        $ = $ | 0;
        $ = _[($ + 4) >> 2] | 0;
        if ($ | 0) Cp($);
        return;
    }
    function kH($) {
        $ = $ | 0;
        kX($, 4933);
        kZ($) | 0;
        kJ($) | 0;
        return;
    }
    function kX($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = hk() | 0;
        _[$ >> 2] = r;
        hh(r, n);
        hq(_[$ >> 2] | 0);
        return;
    }
    function kZ($) {
        $ = $ | 0;
        var n = 0;
        n = _[$ >> 2] | 0;
        ke(n, hc() | 0);
        return $ | 0;
    }
    function kJ($) {
        $ = $ | 0;
        var n = 0;
        n = _[$ >> 2] | 0;
        ke(n, kQ() | 0);
        return $ | 0;
    }
    function kQ() {
        var $ = 0;
        if (!(e[7920] | 0)) {
            kV(10452);
            $I(58, 10452, h | 0) | 0;
            $ = 7920;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        if (!(tE(10452) | 0)) kV(10452);
        return 10452;
    }
    function kV($) {
        $ = $ | 0;
        h$($);
        kf($, 1);
        return;
    }
    function kW($) {
        $ = $ | 0;
        k9(($ + 24) | 0);
        return;
    }
    function k9($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function h$($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 5, 1, n, hi() | 0, 2);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function h0($, n, r) {
        $ = $ | 0;
        n = +n;
        r = +r;
        hn($, n, r);
        return;
    }
    function hn($, n, r) {
        $ = $ | 0;
        n = +n;
        r = +r;
        var e = 0, i = 0, _ = 0, t = 0, u = 0;
        e = s;
        s = (s + 32) | 0;
        _ = (e + 8) | 0;
        u = (e + 17) | 0;
        i = e;
        t = (e + 16) | 0;
        uM(u, n);
        c[_ >> 3] = +ug(u, n);
        uM(t, r);
        c[i >> 3] = +ug(t, r);
        hr($, _, i);
        s = e;
        return;
    }
    function hr($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        he(($ + 8) | 0, +c[n >> 3], +c[r >> 3]);
        e[($ + 24) >> 0] = 1;
        return;
    }
    function he($, n, r) {
        $ = $ | 0;
        n = +n;
        r = +r;
        c[$ >> 3] = n;
        c[($ + 8) >> 3] = r;
        return;
    }
    function hi() {
        return 1472;
    }
    function h_($, n) {
        $ = +$;
        n = +n;
        return ht($, n) | 0;
    }
    function ht($, n) {
        $ = +$;
        n = +n;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        e = s;
        s = (s + 16) | 0;
        u = (e + 4) | 0;
        f = (e + 8) | 0;
        o = e;
        i = mn(8) | 0;
        r = i;
        t = CM(16) | 0;
        uM(u, $);
        $ = +ug(u, $);
        uM(f, n);
        he(t, $, +ug(f, n));
        f = (r + 4) | 0;
        _[f >> 2] = t;
        t = CM(8) | 0;
        f = _[f >> 2] | 0;
        _[o >> 2] = 0;
        _[u >> 2] = _[o >> 2];
        h2(t, f, u);
        _[i >> 2] = t;
        s = e;
        return r | 0;
    }
    function h2($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        r = CM(16) | 0;
        _[(r + 4) >> 2] = 0;
        _[(r + 8) >> 2] = 0;
        _[r >> 2] = 1452;
        _[(r + 12) >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function hu($) {
        $ = $ | 0;
        Cw($);
        CA($);
        return;
    }
    function hf($) {
        $ = $ | 0;
        $ = _[($ + 12) >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function ho($) {
        $ = $ | 0;
        CA($);
        return;
    }
    function hc() {
        var $ = 0;
        if (!(e[7928] | 0)) {
            h6(10488);
            $I(59, 10488, h | 0) | 0;
            $ = 7928;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        if (!(tE(10488) | 0)) h6(10488);
        return 10488;
    }
    function h6($) {
        $ = $ | 0;
        h4($);
        kf($, 60);
        return;
    }
    function ha($) {
        $ = $ | 0;
        h1(($ + 24) | 0);
        return;
    }
    function h1($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function h4($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 5, 6, n, hs() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function hl($) {
        $ = $ | 0;
        hv($);
        return;
    }
    function hv($) {
        $ = $ | 0;
        h7($);
        return;
    }
    function h7($) {
        $ = $ | 0;
        h5(($ + 8) | 0);
        e[($ + 24) >> 0] = 1;
        return;
    }
    function h5($) {
        $ = $ | 0;
        _[$ >> 2] = 0;
        _[($ + 4) >> 2] = 0;
        _[($ + 8) >> 2] = 0;
        _[($ + 12) >> 2] = 0;
        return;
    }
    function hs() {
        return 1492;
    }
    function h3() {
        return hb() | 0;
    }
    function hb() {
        var $ = 0, n = 0, r = 0, e = 0, i = 0, t = 0, u = 0;
        n = s;
        s = (s + 16) | 0;
        i = (n + 4) | 0;
        u = n;
        r = mn(8) | 0;
        $ = r;
        e = CM(16) | 0;
        h5(e);
        t = ($ + 4) | 0;
        _[t >> 2] = e;
        e = CM(8) | 0;
        t = _[t >> 2] | 0;
        _[u >> 2] = 0;
        _[i >> 2] = _[u >> 2];
        h2(e, t, i);
        _[r >> 2] = e;
        s = n;
        return $ | 0;
    }
    function hk() {
        var $ = 0;
        if (!(e[7936] | 0)) {
            hp(10524);
            $I(25, 10524, h | 0) | 0;
            $ = 7936;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10524;
    }
    function hh($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = hd() | 0;
        _[($ + 4) >> 2] = hw() | 0;
        _[($ + 12) >> 2] = n;
        _[($ + 8) >> 2] = h8() | 0;
        _[($ + 32) >> 2] = 7;
        return;
    }
    function hd() {
        return 11700;
    }
    function hw() {
        return 1484;
    }
    function h8() {
        return kg() | 0;
    }
    function hm($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((st(e, 896) | 0) == 512) {
            if (r | 0) {
                hy(r);
                CA(r);
            }
        } else if (n | 0) CA(n);
        return;
    }
    function hy($) {
        $ = $ | 0;
        $ = _[($ + 4) >> 2] | 0;
        if ($ | 0) Cp($);
        return;
    }
    function hp($) {
        $ = $ | 0;
        u6($);
        return;
    }
    function hC($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        $ = td(n) | 0;
        n = hM(r) | 0;
        r = hg(r, 0) | 0;
        du($, n, r, hA() | 0, 0);
        return;
    }
    function hM($) {
        $ = $ | 0;
        return $ | 0;
    }
    function hg($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = hA() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            hP(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            hE(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function hA() {
        var $ = 0, n = 0;
        if (!(e[7944] | 0)) {
            hI(10568);
            $I(61, 10568, h | 0) | 0;
            n = 7944;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10568) | 0)) {
            $ = 10568;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            hI(10568);
        }
        return 10568;
    }
    function hI($) {
        $ = $ | 0;
        hx($);
        return;
    }
    function hS($) {
        $ = $ | 0;
        hT(($ + 24) | 0);
        return;
    }
    function hT($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function hx($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 17, n, oc() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function hN($) {
        $ = $ | 0;
        return hO(_[(hL($) | 0) >> 2] | 0) | 0;
    }
    function hL($) {
        $ = $ | 0;
        return ((_[((hA() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function hO($) {
        $ = $ | 0;
        return o4(MX[$ & 7]() | 0) | 0;
    }
    function hP($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function hE($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = hG($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            hB(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            hP(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            hR($, i);
            hY(i);
            s = f;
            return;
        }
    }
    function hG($) {
        $ = $ | 0;
        return 536870911;
    }
    function hB($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function hR($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function hY($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function hU() {
        hj();
        return;
    }
    function hj() {
        hz(10604);
        return;
    }
    function hz($) {
        $ = $ | 0;
        hD($, 4955);
        return;
    }
    function hD($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = hF() | 0;
        _[$ >> 2] = r;
        hK(r, n);
        hq(_[$ >> 2] | 0);
        return;
    }
    function hF() {
        var $ = 0;
        if (!(e[7952] | 0)) {
            d0(10612);
            $I(25, 10612, h | 0) | 0;
            $ = 7952;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10612;
    }
    function hK($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = hQ() | 0;
        _[($ + 4) >> 2] = hV() | 0;
        _[($ + 12) >> 2] = n;
        _[($ + 8) >> 2] = hW() | 0;
        _[($ + 32) >> 2] = 8;
        return;
    }
    function hq($) {
        $ = $ | 0;
        var n = 0, r = 0;
        n = s;
        s = (s + 16) | 0;
        r = n;
        hH() | 0;
        _[r >> 2] = $;
        hX(10608, r);
        s = n;
        return;
    }
    function hH() {
        if (!(e[11714] | 0)) {
            _[2652] = 0;
            $I(62, 10608, h | 0) | 0;
            e[11714] = 1;
        }
        return 10608;
    }
    function hX($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = CM(8) | 0;
        _[(r + 4) >> 2] = _[n >> 2];
        _[r >> 2] = _[$ >> 2];
        _[$ >> 2] = r;
        return;
    }
    function hZ($) {
        $ = $ | 0;
        hJ($);
        return;
    }
    function hJ($) {
        $ = $ | 0;
        var n = 0, r = 0;
        n = _[$ >> 2] | 0;
        if (n | 0) do {
            r = n;
            n = _[n >> 2] | 0;
            CA(r);
        }while ((n | 0) != 0)
        _[$ >> 2] = 0;
        return;
    }
    function hQ() {
        return 11715;
    }
    function hV() {
        return 1496;
    }
    function hW() {
        return su() | 0;
    }
    function h9($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((st(e, 896) | 0) == 512) {
            if (r | 0) {
                d$(r);
                CA(r);
            }
        } else if (n | 0) CA(n);
        return;
    }
    function d$($) {
        $ = $ | 0;
        $ = _[($ + 4) >> 2] | 0;
        if ($ | 0) Cp($);
        return;
    }
    function d0($) {
        $ = $ | 0;
        u6($);
        return;
    }
    function dn($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        hH() | 0;
        r = _[2652] | 0;
        a: do if (r | 0) {
            while(1){
                e = _[(r + 4) >> 2] | 0;
                if (e | 0 ? (pF(dr(e) | 0, $) | 0) == 0 : 0) break;
                r = _[r >> 2] | 0;
                if (!r) break a;
            }
            de(e, n);
        }
        while (0)
        return;
    }
    function dr($) {
        $ = $ | 0;
        return _[($ + 12) >> 2] | 0;
    }
    function de($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        $ = ($ + 36) | 0;
        r = _[$ >> 2] | 0;
        if (r | 0) {
            i6(r);
            CA(r);
        }
        r = CM(4) | 0;
        _3(r, n);
        _[$ >> 2] = r;
        return;
    }
    function di() {
        if (!(e[11716] | 0)) {
            _[2664] = 0;
            $I(63, 10656, h | 0) | 0;
            e[11716] = 1;
        }
        return 10656;
    }
    function d_() {
        var $ = 0;
        if (!(e[11717] | 0)) {
            dt();
            _[2665] = 1504;
            e[11717] = 1;
            $ = 1504;
        } else $ = _[2665] | 0;
        return $ | 0;
    }
    function dt() {
        if (!(e[11740] | 0)) {
            e[11718] = tA(tA(8, 0) | 0, 0) | 0;
            e[11719] = tA(tA(0, 0) | 0, 0) | 0;
            e[11720] = tA(tA(0, 16) | 0, 0) | 0;
            e[11721] = tA(tA(8, 0) | 0, 0) | 0;
            e[11722] = tA(tA(0, 0) | 0, 0) | 0;
            e[11723] = tA(tA(8, 0) | 0, 0) | 0;
            e[11724] = tA(tA(0, 0) | 0, 0) | 0;
            e[11725] = tA(tA(8, 0) | 0, 0) | 0;
            e[11726] = tA(tA(0, 0) | 0, 0) | 0;
            e[11727] = tA(tA(8, 0) | 0, 0) | 0;
            e[11728] = tA(tA(0, 0) | 0, 0) | 0;
            e[11729] = tA(tA(0, 0) | 0, 32) | 0;
            e[11730] = tA(tA(0, 0) | 0, 32) | 0;
            e[11740] = 1;
        }
        return;
    }
    function d2() {
        return 1572;
    }
    function du($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        t = s;
        s = (s + 32) | 0;
        a = (t + 16) | 0;
        c = (t + 12) | 0;
        o = (t + 8) | 0;
        f = (t + 4) | 0;
        u = t;
        _[a >> 2] = $;
        _[c >> 2] = n;
        _[o >> 2] = r;
        _[f >> 2] = e;
        _[u >> 2] = i;
        di() | 0;
        df(10656, a, c, o, f, u);
        s = t;
        return;
    }
    function df($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var u = 0;
        u = CM(24) | 0;
        tg((u + 4) | 0, _[n >> 2] | 0, _[r >> 2] | 0, _[e >> 2] | 0, _[i >> 2] | 0, _[t >> 2] | 0);
        _[u >> 2] = _[$ >> 2];
        _[$ >> 2] = u;
        return;
    }
    function dc($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0, k = 0, h = 0, d = 0, w = 0, m = 0;
        m = s;
        s = (s + 32) | 0;
        k = (m + 20) | 0;
        h = (m + 8) | 0;
        d = (m + 4) | 0;
        w = m;
        n = _[n >> 2] | 0;
        if (n | 0) {
            b = (k + 4) | 0;
            o = (k + 8) | 0;
            c = (h + 4) | 0;
            a = (h + 8) | 0;
            l = (h + 8) | 0;
            v = (k + 8) | 0;
            do {
                u = (n + 4) | 0;
                f = d6(u) | 0;
                if (f | 0) {
                    i = da(f) | 0;
                    _[k >> 2] = 0;
                    _[b >> 2] = 0;
                    _[o >> 2] = 0;
                    e = ((d1(f) | 0) + 1) | 0;
                    d4(k, e);
                    if (e | 0) while(1){
                        e = (e + -1) | 0;
                        p6(h, _[i >> 2] | 0);
                        t = _[b >> 2] | 0;
                        if (t >>> 0 < (_[v >> 2] | 0) >>> 0) {
                            _[t >> 2] = _[h >> 2];
                            _[b >> 2] = (_[b >> 2] | 0) + 4;
                        } else dl(k, h);
                        if (!e) break;
                        else i = (i + 4) | 0;
                    }
                    e = dv(f) | 0;
                    _[h >> 2] = 0;
                    _[c >> 2] = 0;
                    _[a >> 2] = 0;
                    a: do if (_[e >> 2] | 0) {
                        i = 0;
                        t = 0;
                        while(1){
                            if ((i | 0) == (t | 0)) d7(h, e);
                            else {
                                _[i >> 2] = _[e >> 2];
                                _[c >> 2] = (_[c >> 2] | 0) + 4;
                            }
                            e = (e + 4) | 0;
                            if (!(_[e >> 2] | 0)) break a;
                            i = _[c >> 2] | 0;
                            t = _[l >> 2] | 0;
                        }
                    }
                    while (0)
                    _[d >> 2] = d5(u) | 0;
                    _[w >> 2] = tE(f) | 0;
                    ds(r, $, d, w, k, h);
                    d3(h);
                    db(k);
                }
                n = _[n >> 2] | 0;
            }while ((n | 0) != 0)
        }
        s = m;
        return;
    }
    function d6($) {
        $ = $ | 0;
        return _[($ + 12) >> 2] | 0;
    }
    function da($) {
        $ = $ | 0;
        return _[($ + 12) >> 2] | 0;
    }
    function d1($) {
        $ = $ | 0;
        return _[($ + 16) >> 2] | 0;
    }
    function d4($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0;
        i = s;
        s = (s + 32) | 0;
        r = i;
        e = _[$ >> 2] | 0;
        if ((((_[($ + 8) >> 2] | 0) - e) >> 2) >>> 0 < n >>> 0) {
            dH(r, n, ((_[($ + 4) >> 2] | 0) - e) >> 2, ($ + 8) | 0);
            dX($, r);
            dZ(r);
        }
        s = i;
        return;
    }
    function dl($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0;
        u = s;
        s = (s + 32) | 0;
        r = u;
        e = ($ + 4) | 0;
        i = ((((_[e >> 2] | 0) - (_[$ >> 2] | 0)) >> 2) + 1) | 0;
        t = dD($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            f = _[$ >> 2] | 0;
            c = ((_[($ + 8) >> 2] | 0) - f) | 0;
            o = c >> 1;
            dH(r, (c >> 2) >>> 0 < (t >>> 1) >>> 0 ? o >>> 0 < i >>> 0 ? i : o : t, ((_[e >> 2] | 0) - f) >> 2, ($ + 8) | 0);
            t = (r + 8) | 0;
            _[_[t >> 2] >> 2] = _[n >> 2];
            _[t >> 2] = (_[t >> 2] | 0) + 4;
            dX($, r);
            dZ(r);
            s = u;
            return;
        }
    }
    function dv($) {
        $ = $ | 0;
        return _[($ + 8) >> 2] | 0;
    }
    function d7($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0;
        u = s;
        s = (s + 32) | 0;
        r = u;
        e = ($ + 4) | 0;
        i = ((((_[e >> 2] | 0) - (_[$ >> 2] | 0)) >> 2) + 1) | 0;
        t = dU($) | 0;
        if (t >>> 0 < i >>> 0) Cd($);
        else {
            f = _[$ >> 2] | 0;
            c = ((_[($ + 8) >> 2] | 0) - f) | 0;
            o = c >> 1;
            dF(r, (c >> 2) >>> 0 < (t >>> 1) >>> 0 ? o >>> 0 < i >>> 0 ? i : o : t, ((_[e >> 2] | 0) - f) >> 2, ($ + 8) | 0);
            t = (r + 8) | 0;
            _[_[t >> 2] >> 2] = _[n >> 2];
            _[t >> 2] = (_[t >> 2] | 0) + 4;
            dK($, r);
            dq(r);
            s = u;
            return;
        }
    }
    function d5($) {
        $ = $ | 0;
        return _[$ >> 2] | 0;
    }
    function ds($, n, r, e, i, _) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        _ = _ | 0;
        dk($, n, r, e, i, _);
        return;
    }
    function d3($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -4 - e) | 0) >>> 2) << 2);
            CA(r);
        }
        return;
    }
    function db($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -4 - e) | 0) >>> 2) << 2);
            CA(r);
        }
        return;
    }
    function dk($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        u = s;
        s = (s + 48) | 0;
        a = (u + 40) | 0;
        f = (u + 32) | 0;
        l = (u + 24) | 0;
        o = (u + 12) | 0;
        c = u;
        p7(f);
        $ = _d($) | 0;
        _[l >> 2] = _[n >> 2];
        r = _[r >> 2] | 0;
        e = _[e >> 2] | 0;
        dh(o, i);
        dd(c, t);
        _[a >> 2] = _[l >> 2];
        dw($, a, r, e, o, c);
        d3(c);
        db(o);
        ps(f);
        s = u;
        return;
    }
    function dh($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        _[$ >> 2] = 0;
        _[($ + 4) >> 2] = 0;
        _[($ + 8) >> 2] = 0;
        r = (n + 4) | 0;
        e = ((_[r >> 2] | 0) - (_[n >> 2] | 0)) >> 2;
        if (e | 0) {
            dj($, e);
            dz($, _[n >> 2] | 0, _[r >> 2] | 0, e);
        }
        return;
    }
    function dd($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        _[$ >> 2] = 0;
        _[($ + 4) >> 2] = 0;
        _[($ + 8) >> 2] = 0;
        r = (n + 4) | 0;
        e = ((_[r >> 2] | 0) - (_[n >> 2] | 0)) >> 2;
        if (e | 0) {
            dR($, e);
            dY($, _[n >> 2] | 0, _[r >> 2] | 0, e);
        }
        return;
    }
    function dw($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        var u = 0, f = 0, o = 0, c = 0, a = 0, l = 0;
        u = s;
        s = (s + 32) | 0;
        a = (u + 28) | 0;
        l = (u + 24) | 0;
        f = (u + 12) | 0;
        o = u;
        c = _m(d8() | 0) | 0;
        _[l >> 2] = _[n >> 2];
        _[a >> 2] = _[l >> 2];
        n = dm(a) | 0;
        r = dy(r) | 0;
        e = dp(e) | 0;
        _[f >> 2] = _[i >> 2];
        a = (i + 4) | 0;
        _[(f + 4) >> 2] = _[a >> 2];
        l = (i + 8) | 0;
        _[(f + 8) >> 2] = _[l >> 2];
        _[l >> 2] = 0;
        _[a >> 2] = 0;
        _[i >> 2] = 0;
        i = dC(f) | 0;
        _[o >> 2] = _[t >> 2];
        a = (t + 4) | 0;
        _[(o + 4) >> 2] = _[a >> 2];
        l = (t + 8) | 0;
        _[(o + 8) >> 2] = _[l >> 2];
        _[l >> 2] = 0;
        _[a >> 2] = 0;
        _[t >> 2] = 0;
        $y(0, c | 0, $ | 0, n | 0, r | 0, e | 0, i | 0, dM(o) | 0) | 0;
        d3(o);
        db(f);
        s = u;
        return;
    }
    function d8() {
        var $ = 0;
        if (!(e[7968] | 0)) {
            dG(10708);
            $ = 7968;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10708;
    }
    function dm($) {
        $ = $ | 0;
        return dS($) | 0;
    }
    function dy($) {
        $ = $ | 0;
        return dA($) | 0;
    }
    function dp($) {
        $ = $ | 0;
        return o4($) | 0;
    }
    function dC($) {
        $ = $ | 0;
        return dI($) | 0;
    }
    function dM($) {
        $ = $ | 0;
        return dg($) | 0;
    }
    function dg($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        e = ((_[($ + 4) >> 2] | 0) - (_[$ >> 2] | 0)) | 0;
        r = e >> 2;
        e = mn((e + 4) | 0) | 0;
        _[e >> 2] = r;
        if (r | 0) {
            n = 0;
            do {
                _[(e + 4 + (n << 2)) >> 2] = dA(_[((_[$ >> 2] | 0) + (n << 2)) >> 2] | 0) | 0;
                n = (n + 1) | 0;
            }while ((n | 0) != (r | 0))
        }
        return e | 0;
    }
    function dA($) {
        $ = $ | 0;
        return $ | 0;
    }
    function dI($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        e = ((_[($ + 4) >> 2] | 0) - (_[$ >> 2] | 0)) | 0;
        r = e >> 2;
        e = mn((e + 4) | 0) | 0;
        _[e >> 2] = r;
        if (r | 0) {
            n = 0;
            do {
                _[(e + 4 + (n << 2)) >> 2] = dS(((_[$ >> 2] | 0) + (n << 2)) | 0) | 0;
                n = (n + 1) | 0;
            }while ((n | 0) != (r | 0))
        }
        return e | 0;
    }
    function dS($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0;
        i = s;
        s = (s + 32) | 0;
        n = (i + 12) | 0;
        r = i;
        e = tq(dT() | 0) | 0;
        if (!e) $ = dx($) | 0;
        else {
            tH(n, e);
            tX(r, n);
            p4($, r);
            $ = tJ(n) | 0;
        }
        s = i;
        return $ | 0;
    }
    function dT() {
        var $ = 0;
        if (!(e[7960] | 0)) {
            dE(10664);
            $I(25, 10664, h | 0) | 0;
            $ = 7960;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10664;
    }
    function dx($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0;
        r = s;
        s = (s + 16) | 0;
        i = (r + 4) | 0;
        u = r;
        e = mn(8) | 0;
        n = e;
        f = CM(4) | 0;
        _[f >> 2] = _[$ >> 2];
        t = (n + 4) | 0;
        _[t >> 2] = f;
        $ = CM(8) | 0;
        t = _[t >> 2] | 0;
        _[u >> 2] = 0;
        _[i >> 2] = _[u >> 2];
        dN($, t, i);
        _[e >> 2] = $;
        s = r;
        return n | 0;
    }
    function dN($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        r = CM(16) | 0;
        _[(r + 4) >> 2] = 0;
        _[(r + 8) >> 2] = 0;
        _[r >> 2] = 1656;
        _[(r + 12) >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function dL($) {
        $ = $ | 0;
        Cw($);
        CA($);
        return;
    }
    function dO($) {
        $ = $ | 0;
        $ = _[($ + 12) >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function dP($) {
        $ = $ | 0;
        CA($);
        return;
    }
    function dE($) {
        $ = $ | 0;
        u6($);
        return;
    }
    function dG($) {
        $ = $ | 0;
        _L($, dB() | 0, 5);
        return;
    }
    function dB() {
        return 1676;
    }
    function dR($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        if ((dU($) | 0) >>> 0 < n >>> 0) Cd($);
        if (n >>> 0 > 1073741823) $Y();
        else {
            r = CM(n << 2) | 0;
            _[($ + 4) >> 2] = r;
            _[$ >> 2] = r;
            _[($ + 8) >> 2] = r + (n << 2);
            return;
        }
    }
    function dY($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        e = ($ + 4) | 0;
        $ = (r - n) | 0;
        if (($ | 0) > 0) {
            CE(_[e >> 2] | 0, n | 0, $ | 0) | 0;
            _[e >> 2] = (_[e >> 2] | 0) + (($ >>> 2) << 2);
        }
        return;
    }
    function dU($) {
        $ = $ | 0;
        return 1073741823;
    }
    function dj($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        if ((dD($) | 0) >>> 0 < n >>> 0) Cd($);
        if (n >>> 0 > 1073741823) $Y();
        else {
            r = CM(n << 2) | 0;
            _[($ + 4) >> 2] = r;
            _[$ >> 2] = r;
            _[($ + 8) >> 2] = r + (n << 2);
            return;
        }
    }
    function dz($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        e = ($ + 4) | 0;
        $ = (r - n) | 0;
        if (($ | 0) > 0) {
            CE(_[e >> 2] | 0, n | 0, $ | 0) | 0;
            _[e >> 2] = (_[e >> 2] | 0) + (($ >>> 2) << 2);
        }
        return;
    }
    function dD($) {
        $ = $ | 0;
        return 1073741823;
    }
    function dF($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 1073741823) $Y();
            else {
                i = CM(n << 2) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 2)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 2);
        return;
    }
    function dK($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 2)) << 2)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function dq($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -4 - n) | 0) >>> 2) << 2);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function dH($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 1073741823) $Y();
            else {
                i = CM(n << 2) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 2)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 2);
        return;
    }
    function dX($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 2)) << 2)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function dZ($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -4 - n) | 0) >>> 2) << 2);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function dJ($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0, k = 0, h = 0;
        h = s;
        s = (s + 32) | 0;
        a = (h + 20) | 0;
        l = (h + 12) | 0;
        c = (h + 16) | 0;
        v = (h + 4) | 0;
        b = h;
        k = (h + 8) | 0;
        f = d_() | 0;
        t = _[f >> 2] | 0;
        u = _[t >> 2] | 0;
        if (u | 0) {
            o = _[(f + 8) >> 2] | 0;
            f = _[(f + 4) >> 2] | 0;
            while(1){
                p6(a, u);
                dQ($, a, f, o);
                t = (t + 4) | 0;
                u = _[t >> 2] | 0;
                if (!u) break;
                else {
                    o = (o + 1) | 0;
                    f = (f + 1) | 0;
                }
            }
        }
        t = d2() | 0;
        u = _[t >> 2] | 0;
        if (u | 0) do {
            p6(a, u);
            _[l >> 2] = _[(t + 4) >> 2];
            dV(n, a, l);
            t = (t + 8) | 0;
            u = _[t >> 2] | 0;
        }while ((u | 0) != 0)
        t = _[(hH() | 0) >> 2] | 0;
        if (t | 0) do {
            n = _[(t + 4) >> 2] | 0;
            p6(a, _[(dW(n) | 0) >> 2] | 0);
            _[l >> 2] = dr(n) | 0;
            d9(r, a, l);
            t = _[t >> 2] | 0;
        }while ((t | 0) != 0)
        p6(c, 0);
        t = di() | 0;
        _[a >> 2] = _[c >> 2];
        dc(a, t, i);
        t = _[(hH() | 0) >> 2] | 0;
        if (t | 0) {
            $ = (a + 4) | 0;
            n = (a + 8) | 0;
            r = (a + 8) | 0;
            do {
                o = _[(t + 4) >> 2] | 0;
                p6(l, _[(dW(o) | 0) >> 2] | 0);
                w0(v, w$(o) | 0);
                u = _[v >> 2] | 0;
                if (u | 0) {
                    _[a >> 2] = 0;
                    _[$ >> 2] = 0;
                    _[n >> 2] = 0;
                    do {
                        p6(b, _[(dW(_[(u + 4) >> 2] | 0) | 0) >> 2] | 0);
                        f = _[$ >> 2] | 0;
                        if (f >>> 0 < (_[r >> 2] | 0) >>> 0) {
                            _[f >> 2] = _[b >> 2];
                            _[$ >> 2] = (_[$ >> 2] | 0) + 4;
                        } else dl(a, b);
                        u = _[u >> 2] | 0;
                    }while ((u | 0) != 0)
                    wn(e, l, a);
                    db(a);
                }
                _[k >> 2] = _[l >> 2];
                c = wr(o) | 0;
                _[a >> 2] = _[k >> 2];
                dc(a, c, i);
                uf(v);
                t = _[t >> 2] | 0;
            }while ((t | 0) != 0)
        }
        s = h;
        return;
    }
    function dQ($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        wl($, n, r, e);
        return;
    }
    function dV($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        w4($, n, r);
        return;
    }
    function dW($) {
        $ = $ | 0;
        return $ | 0;
    }
    function d9($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        wo($, n, r);
        return;
    }
    function w$($) {
        $ = $ | 0;
        return ($ + 16) | 0;
    }
    function w0($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        t = s;
        s = (s + 16) | 0;
        i = (t + 8) | 0;
        r = t;
        _[$ >> 2] = 0;
        e = _[n >> 2] | 0;
        _[i >> 2] = e;
        _[r >> 2] = $;
        r = wu(r) | 0;
        if (e | 0) {
            e = CM(12) | 0;
            u = ((wf(i) | 0) + 4) | 0;
            $ = _[(u + 4) >> 2] | 0;
            n = (e + 4) | 0;
            _[n >> 2] = _[u >> 2];
            _[(n + 4) >> 2] = $;
            n = _[_[i >> 2] >> 2] | 0;
            _[i >> 2] = n;
            if (!n) $ = e;
            else {
                n = e;
                while(1){
                    $ = CM(12) | 0;
                    o = ((wf(i) | 0) + 4) | 0;
                    f = _[(o + 4) >> 2] | 0;
                    u = ($ + 4) | 0;
                    _[u >> 2] = _[o >> 2];
                    _[(u + 4) >> 2] = f;
                    _[n >> 2] = $;
                    u = _[_[i >> 2] >> 2] | 0;
                    _[i >> 2] = u;
                    if (!u) break;
                    else n = $;
                }
            }
            _[$ >> 2] = _[r >> 2];
            _[r >> 2] = e;
        }
        s = t;
        return;
    }
    function wn($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        we($, n, r);
        return;
    }
    function wr($) {
        $ = $ | 0;
        return ($ + 24) | 0;
    }
    function we($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 32) | 0;
        u = (e + 24) | 0;
        i = (e + 16) | 0;
        f = (e + 12) | 0;
        t = e;
        p7(i);
        $ = _d($) | 0;
        _[f >> 2] = _[n >> 2];
        dh(t, r);
        _[u >> 2] = _[f >> 2];
        wi($, u, t);
        db(t);
        ps(i);
        s = e;
        return;
    }
    function wi($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0;
        e = s;
        s = (s + 32) | 0;
        u = (e + 16) | 0;
        f = (e + 12) | 0;
        i = e;
        t = _m(w_() | 0) | 0;
        _[f >> 2] = _[n >> 2];
        _[u >> 2] = _[f >> 2];
        n = dm(u) | 0;
        _[i >> 2] = _[r >> 2];
        u = (r + 4) | 0;
        _[(i + 4) >> 2] = _[u >> 2];
        f = (r + 8) | 0;
        _[(i + 8) >> 2] = _[f >> 2];
        _[f >> 2] = 0;
        _[u >> 2] = 0;
        _[r >> 2] = 0;
        $d(0, t | 0, $ | 0, n | 0, dC(i) | 0) | 0;
        db(i);
        s = e;
        return;
    }
    function w_() {
        var $ = 0;
        if (!(e[7976] | 0)) {
            wt(10720);
            $ = 7976;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10720;
    }
    function wt($) {
        $ = $ | 0;
        _L($, w2() | 0, 2);
        return;
    }
    function w2() {
        return 1732;
    }
    function wu($) {
        $ = $ | 0;
        return _[$ >> 2] | 0;
    }
    function wf($) {
        $ = $ | 0;
        return _[$ >> 2] | 0;
    }
    function wo($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 32) | 0;
        t = (e + 16) | 0;
        i = (e + 8) | 0;
        u = e;
        p7(i);
        $ = _d($) | 0;
        _[u >> 2] = _[n >> 2];
        r = _[r >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        wc($, t, r);
        ps(i);
        s = e;
        return;
    }
    function wc($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 16) | 0;
        t = (e + 4) | 0;
        u = e;
        i = _m(w6() | 0) | 0;
        _[u >> 2] = _[n >> 2];
        _[t >> 2] = _[u >> 2];
        n = dm(t) | 0;
        $d(0, i | 0, $ | 0, n | 0, dy(r) | 0) | 0;
        s = e;
        return;
    }
    function w6() {
        var $ = 0;
        if (!(e[7984] | 0)) {
            wa(10732);
            $ = 7984;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10732;
    }
    function wa($) {
        $ = $ | 0;
        _L($, w1() | 0, 2);
        return;
    }
    function w1() {
        return 1744;
    }
    function w4($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0;
        e = s;
        s = (s + 32) | 0;
        t = (e + 16) | 0;
        i = (e + 8) | 0;
        u = e;
        p7(i);
        $ = _d($) | 0;
        _[u >> 2] = _[n >> 2];
        r = _[r >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        wc($, t, r);
        ps(i);
        s = e;
        return;
    }
    function wl($, n, r, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        i = i | 0;
        var t = 0, u = 0, f = 0, o = 0;
        t = s;
        s = (s + 32) | 0;
        f = (t + 16) | 0;
        u = (t + 8) | 0;
        o = t;
        p7(u);
        $ = _d($) | 0;
        _[o >> 2] = _[n >> 2];
        r = e[r >> 0] | 0;
        i = e[i >> 0] | 0;
        _[f >> 2] = _[o >> 2];
        wv($, f, r, i);
        ps(u);
        s = t;
        return;
    }
    function wv($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0;
        i = s;
        s = (s + 16) | 0;
        u = (i + 4) | 0;
        f = i;
        t = _m(w7() | 0) | 0;
        _[f >> 2] = _[n >> 2];
        _[u >> 2] = _[f >> 2];
        n = dm(u) | 0;
        r = w5(r) | 0;
        $H(0, t | 0, $ | 0, n | 0, r | 0, w5(e) | 0) | 0;
        s = i;
        return;
    }
    function w7() {
        var $ = 0;
        if (!(e[7992] | 0)) {
            w3(10744);
            $ = 7992;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10744;
    }
    function w5($) {
        $ = $ | 0;
        return ws($) | 0;
    }
    function ws($) {
        $ = $ | 0;
        return ($ & 255) | 0;
    }
    function w3($) {
        $ = $ | 0;
        _L($, wb() | 0, 3);
        return;
    }
    function wb() {
        return 1756;
    }
    function wk($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0;
        b = s;
        s = (s + 32) | 0;
        o = (b + 8) | 0;
        c = (b + 4) | 0;
        a = (b + 20) | 0;
        l = b;
        fv($, 0);
        i = p1(n) | 0;
        _[o >> 2] = 0;
        v = (o + 4) | 0;
        _[v >> 2] = 0;
        _[(o + 8) >> 2] = 0;
        switch((i << 24) >> 24){
            case 0:
                {
                    e[a >> 0] = 0;
                    wh(c, r, a);
                    wd($, c) | 0;
                    ia(c);
                    break;
                }
            case 8:
                {
                    v = pa(n) | 0;
                    e[a >> 0] = 8;
                    p6(l, _[(v + 4) >> 2] | 0);
                    ww(c, r, a, l, (v + 8) | 0);
                    wd($, c) | 0;
                    ia(c);
                    break;
                }
            case 9:
                {
                    u = pa(n) | 0;
                    n = _[(u + 4) >> 2] | 0;
                    if (n | 0) {
                        f = (o + 8) | 0;
                        t = (u + 12) | 0;
                        while(1){
                            n = (n + -1) | 0;
                            p6(c, _[t >> 2] | 0);
                            i = _[v >> 2] | 0;
                            if (i >>> 0 < (_[f >> 2] | 0) >>> 0) {
                                _[i >> 2] = _[c >> 2];
                                _[v >> 2] = (_[v >> 2] | 0) + 4;
                            } else dl(o, c);
                            if (!n) break;
                            else t = (t + 4) | 0;
                        }
                    }
                    e[a >> 0] = 9;
                    p6(l, _[(u + 8) >> 2] | 0);
                    w8(c, r, a, l, o);
                    wd($, c) | 0;
                    ia(c);
                    break;
                }
            default:
                {
                    v = pa(n) | 0;
                    e[a >> 0] = i;
                    p6(l, _[(v + 4) >> 2] | 0);
                    wm(c, r, a, l);
                    wd($, c) | 0;
                    ia(c);
                }
        }
        db(o);
        s = b;
        return;
    }
    function wh($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, _ = 0;
        i = s;
        s = (s + 16) | 0;
        _ = i;
        p7(_);
        n = _d(n) | 0;
        wP($, n, e[r >> 0] | 0);
        ps(_);
        s = i;
        return;
    }
    function wd($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = _[$ >> 2] | 0;
        if (r | 0) $X(r | 0);
        _[$ >> 2] = _[n >> 2];
        _[n >> 2] = 0;
        return $ | 0;
    }
    function ww($, n, r, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        i = i | 0;
        t = t | 0;
        var u = 0, f = 0, o = 0, c = 0;
        u = s;
        s = (s + 32) | 0;
        o = (u + 16) | 0;
        f = (u + 8) | 0;
        c = u;
        p7(f);
        n = _d(n) | 0;
        r = e[r >> 0] | 0;
        _[c >> 2] = _[i >> 2];
        t = _[t >> 2] | 0;
        _[o >> 2] = _[c >> 2];
        wx($, n, r, o, t);
        ps(f);
        s = u;
        return;
    }
    function w8($, n, r, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        i = i | 0;
        t = t | 0;
        var u = 0, f = 0, o = 0, c = 0, a = 0;
        u = s;
        s = (s + 32) | 0;
        c = (u + 24) | 0;
        f = (u + 16) | 0;
        a = (u + 12) | 0;
        o = u;
        p7(f);
        n = _d(n) | 0;
        r = e[r >> 0] | 0;
        _[a >> 2] = _[i >> 2];
        dh(o, t);
        _[c >> 2] = _[a >> 2];
        wA($, n, r, c, o);
        db(o);
        ps(f);
        s = u;
        return;
    }
    function wm($, n, r, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        i = i | 0;
        var t = 0, u = 0, f = 0, o = 0;
        t = s;
        s = (s + 32) | 0;
        f = (t + 16) | 0;
        u = (t + 8) | 0;
        o = t;
        p7(u);
        n = _d(n) | 0;
        r = e[r >> 0] | 0;
        _[o >> 2] = _[i >> 2];
        _[f >> 2] = _[o >> 2];
        wy($, n, r, f);
        ps(u);
        s = t;
        return;
    }
    function wy($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0, u = 0, f = 0;
        i = s;
        s = (s + 16) | 0;
        t = (i + 4) | 0;
        f = i;
        u = _m(wp() | 0) | 0;
        r = w5(r) | 0;
        _[f >> 2] = _[e >> 2];
        _[t >> 2] = _[f >> 2];
        wC($, $d(0, u | 0, n | 0, r | 0, dm(t) | 0) | 0);
        s = i;
        return;
    }
    function wp() {
        var $ = 0;
        if (!(e[8e3] | 0)) {
            wM(10756);
            $ = 8e3;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10756;
    }
    function wC($, n) {
        $ = $ | 0;
        n = n | 0;
        fv($, n);
        return;
    }
    function wM($) {
        $ = $ | 0;
        _L($, wg() | 0, 2);
        return;
    }
    function wg() {
        return 1772;
    }
    function wA($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, u = 0, f = 0, o = 0, c = 0;
        t = s;
        s = (s + 32) | 0;
        o = (t + 16) | 0;
        c = (t + 12) | 0;
        u = t;
        f = _m(wI() | 0) | 0;
        r = w5(r) | 0;
        _[c >> 2] = _[e >> 2];
        _[o >> 2] = _[c >> 2];
        e = dm(o) | 0;
        _[u >> 2] = _[i >> 2];
        o = (i + 4) | 0;
        _[(u + 4) >> 2] = _[o >> 2];
        c = (i + 8) | 0;
        _[(u + 8) >> 2] = _[c >> 2];
        _[c >> 2] = 0;
        _[o >> 2] = 0;
        _[i >> 2] = 0;
        wC($, $H(0, f | 0, n | 0, r | 0, e | 0, dC(u) | 0) | 0);
        db(u);
        s = t;
        return;
    }
    function wI() {
        var $ = 0;
        if (!(e[8008] | 0)) {
            wS(10768);
            $ = 8008;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10768;
    }
    function wS($) {
        $ = $ | 0;
        _L($, wT() | 0, 3);
        return;
    }
    function wT() {
        return 1784;
    }
    function wx($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, u = 0, f = 0, o = 0;
        t = s;
        s = (s + 16) | 0;
        f = (t + 4) | 0;
        o = t;
        u = _m(wN() | 0) | 0;
        r = w5(r) | 0;
        _[o >> 2] = _[e >> 2];
        _[f >> 2] = _[o >> 2];
        e = dm(f) | 0;
        wC($, $H(0, u | 0, n | 0, r | 0, e | 0, dp(i) | 0) | 0);
        s = t;
        return;
    }
    function wN() {
        var $ = 0;
        if (!(e[8016] | 0)) {
            wL(10780);
            $ = 8016;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10780;
    }
    function wL($) {
        $ = $ | 0;
        _L($, wO() | 0, 3);
        return;
    }
    function wO() {
        return 1800;
    }
    function wP($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0;
        e = _m(wE() | 0) | 0;
        wC($, $Z(0, e | 0, n | 0, w5(r) | 0) | 0);
        return;
    }
    function wE() {
        var $ = 0;
        if (!(e[8024] | 0)) {
            wG(10792);
            $ = 8024;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 10792;
    }
    function wG($) {
        $ = $ | 0;
        _L($, wB() | 0, 1);
        return;
    }
    function wB() {
        return 1816;
    }
    function wR() {
        wY();
        wU();
        wj();
        return;
    }
    function wY() {
        _[2702] = Cg(65536) | 0;
        return;
    }
    function wU() {
        mu(10856);
        return;
    }
    function wj() {
        wz(10816);
        return;
    }
    function wz($) {
        $ = $ | 0;
        wD($, 5044);
        wF($) | 0;
        return;
    }
    function wD($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = dT() | 0;
        _[$ >> 2] = r;
        mr(r, n);
        hq(_[$ >> 2] | 0);
        return;
    }
    function wF($) {
        $ = $ | 0;
        var n = 0;
        n = _[$ >> 2] | 0;
        ke(n, wK() | 0);
        return $ | 0;
    }
    function wK() {
        var $ = 0;
        if (!(e[8032] | 0)) {
            wq(10820);
            $I(64, 10820, h | 0) | 0;
            $ = 8032;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        if (!(tE(10820) | 0)) wq(10820);
        return 10820;
    }
    function wq($) {
        $ = $ | 0;
        wZ($);
        kf($, 25);
        return;
    }
    function wH($) {
        $ = $ | 0;
        wX(($ + 24) | 0);
        return;
    }
    function wX($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function wZ($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 5, 18, n, w9() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function wJ($, n) {
        $ = $ | 0;
        n = n | 0;
        wQ($, n);
        return;
    }
    function wQ($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        i = (r + 4) | 0;
        fT(i, n);
        _[e >> 2] = fx(i, n) | 0;
        wV($, e);
        s = r;
        return;
    }
    function wV($, n) {
        $ = $ | 0;
        n = n | 0;
        wW(($ + 4) | 0, _[n >> 2] | 0);
        e[($ + 8) >> 0] = 1;
        return;
    }
    function wW($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = n;
        return;
    }
    function w9() {
        return 1824;
    }
    function m$($) {
        $ = $ | 0;
        return m0($) | 0;
    }
    function m0($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0;
        r = s;
        s = (s + 16) | 0;
        i = (r + 4) | 0;
        u = r;
        e = mn(8) | 0;
        n = e;
        f = CM(4) | 0;
        fT(i, $);
        wW(f, fx(i, $) | 0);
        t = (n + 4) | 0;
        _[t >> 2] = f;
        $ = CM(8) | 0;
        t = _[t >> 2] | 0;
        _[u >> 2] = 0;
        _[i >> 2] = _[u >> 2];
        dN($, t, i);
        _[e >> 2] = $;
        s = r;
        return n | 0;
    }
    function mn($) {
        $ = $ | 0;
        var n = 0, r = 0;
        $ = ($ + 7) & -8;
        if ($ >>> 0 <= 32768 ? ((n = _[2701] | 0), $ >>> 0 <= ((65536 - n) | 0) >>> 0) : 0) {
            r = ((_[2702] | 0) + n) | 0;
            _[2701] = n + $;
            $ = r;
        } else {
            $ = Cg(($ + 8) | 0) | 0;
            _[$ >> 2] = _[2703];
            _[2703] = $;
            $ = ($ + 8) | 0;
        }
        return $ | 0;
    }
    function mr($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = me() | 0;
        _[($ + 4) >> 2] = mi() | 0;
        _[($ + 12) >> 2] = n;
        _[($ + 8) >> 2] = m_() | 0;
        _[($ + 32) >> 2] = 9;
        return;
    }
    function me() {
        return 11744;
    }
    function mi() {
        return 1832;
    }
    function m_() {
        return kg() | 0;
    }
    function mt($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((st(e, 896) | 0) == 512) {
            if (r | 0) {
                m2(r);
                CA(r);
            }
        } else if (n | 0) CA(n);
        return;
    }
    function m2($) {
        $ = $ | 0;
        $ = _[($ + 4) >> 2] | 0;
        if ($ | 0) Cp($);
        return;
    }
    function mu($) {
        $ = $ | 0;
        mf($, 5052);
        mo($) | 0;
        mc($, 5058, 26) | 0;
        m6($, 5069, 1) | 0;
        ma($, 5077, 10) | 0;
        m1($, 5087, 19) | 0;
        ml($, 5094, 27) | 0;
        return;
    }
    function mf($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = pi() | 0;
        _[$ >> 2] = r;
        p_(r, n);
        hq(_[$ >> 2] | 0);
        return;
    }
    function mo($) {
        $ = $ | 0;
        var n = 0;
        n = _[$ >> 2] | 0;
        ke(n, yK() | 0);
        return $ | 0;
    }
    function mc($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        yM($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function m6($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        y1($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function ma($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        mK($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function m1($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        mI($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function m4($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        a: while(1){
            r = _[2703] | 0;
            while(1){
                if ((r | 0) == (n | 0)) break a;
                e = _[r >> 2] | 0;
                _[2703] = e;
                if (!r) r = e;
                else break;
            }
            CA(r);
        }
        _[2701] = $;
        return;
    }
    function ml($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        mv($, td(n) | 0, r, 0);
        return $ | 0;
    }
    function mv($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = m7() | 0;
        $ = m5(r) | 0;
        tp(t, n, i, $, ms(r, e) | 0, e);
        return;
    }
    function m7() {
        var $ = 0, n = 0;
        if (!(e[8040] | 0)) {
            m8(10860);
            $I(65, 10860, h | 0) | 0;
            n = 8040;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10860) | 0)) {
            $ = 10860;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            m8(10860);
        }
        return 10860;
    }
    function m5($) {
        $ = $ | 0;
        return $ | 0;
    }
    function ms($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = m7() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            m3(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            mb(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function m3($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function mb($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = mk($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            mh(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            m3(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            md($, i);
            mw(i);
            s = f;
            return;
        }
    }
    function mk($) {
        $ = $ | 0;
        return 536870911;
    }
    function mh($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function md($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function mw($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function m8($) {
        $ = $ | 0;
        mp($);
        return;
    }
    function mm($) {
        $ = $ | 0;
        my(($ + 24) | 0);
        return;
    }
    function my($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function mp($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 11, n, mC() | 0, 2);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function mC() {
        return 1840;
    }
    function mM($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        mA(_[(mg($) | 0) >> 2] | 0, n, r);
        return;
    }
    function mg($) {
        $ = $ | 0;
        return ((_[((m7() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function mA($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, _ = 0;
        e = s;
        s = (s + 16) | 0;
        _ = (e + 1) | 0;
        i = e;
        fT(_, n);
        n = fx(_, n) | 0;
        fT(i, r);
        r = fx(i, r) | 0;
        MG[$ & 31](n, r);
        s = e;
        return;
    }
    function mI($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = mS() | 0;
        $ = mT(r) | 0;
        tp(t, n, i, $, mx(r, e) | 0, e);
        return;
    }
    function mS() {
        var $ = 0, n = 0;
        if (!(e[8048] | 0)) {
            mB(10896);
            $I(66, 10896, h | 0) | 0;
            n = 8048;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10896) | 0)) {
            $ = 10896;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            mB(10896);
        }
        return 10896;
    }
    function mT($) {
        $ = $ | 0;
        return $ | 0;
    }
    function mx($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = mS() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            mN(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            mL(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function mN($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function mL($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = mO($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            mP(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            mN(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            mE($, i);
            mG(i);
            s = f;
            return;
        }
    }
    function mO($) {
        $ = $ | 0;
        return 536870911;
    }
    function mP($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function mE($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function mG($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function mB($) {
        $ = $ | 0;
        mU($);
        return;
    }
    function mR($) {
        $ = $ | 0;
        mY(($ + 24) | 0);
        return;
    }
    function mY($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function mU($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 11, n, mj() | 0, 1);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function mj() {
        return 1852;
    }
    function mz($, n) {
        $ = $ | 0;
        n = n | 0;
        return mF(_[(mD($) | 0) >> 2] | 0, n) | 0;
    }
    function mD($) {
        $ = $ | 0;
        return ((_[((mS() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function mF($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        fT(e, n);
        n = fx(e, n) | 0;
        n = o4(MB[$ & 31](n) | 0) | 0;
        s = r;
        return n | 0;
    }
    function mK($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = mq() | 0;
        $ = mH(r) | 0;
        tp(t, n, i, $, mX(r, e) | 0, e);
        return;
    }
    function mq() {
        var $ = 0, n = 0;
        if (!(e[8056] | 0)) {
            y$(10932);
            $I(67, 10932, h | 0) | 0;
            n = 8056;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10932) | 0)) {
            $ = 10932;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            y$(10932);
        }
        return 10932;
    }
    function mH($) {
        $ = $ | 0;
        return $ | 0;
    }
    function mX($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = mq() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            mZ(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            mJ(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function mZ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function mJ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = mQ($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            mV(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            mZ(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            mW($, i);
            m9(i);
            s = f;
            return;
        }
    }
    function mQ($) {
        $ = $ | 0;
        return 536870911;
    }
    function mV($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function mW($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function m9($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function y$($) {
        $ = $ | 0;
        yr($);
        return;
    }
    function y0($) {
        $ = $ | 0;
        yn(($ + 24) | 0);
        return;
    }
    function yn($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function yr($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 7, n, ye() | 0, 2);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function ye() {
        return 1860;
    }
    function yi($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        return yt(_[(y_($) | 0) >> 2] | 0, n, r) | 0;
    }
    function y_($) {
        $ = $ | 0;
        return ((_[((mq() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function yt($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        e = s;
        s = (s + 32) | 0;
        u = (e + 12) | 0;
        t = (e + 8) | 0;
        f = e;
        o = (e + 16) | 0;
        i = (e + 4) | 0;
        y2(o, n);
        yu(f, o, n);
        fa(i, r);
        r = f1(i, r) | 0;
        _[u >> 2] = _[f >> 2];
        MV[$ & 15](t, u, r);
        r = yf(t) | 0;
        ia(t);
        f4(i);
        s = e;
        return r | 0;
    }
    function y2($, n) {
        $ = $ | 0;
        n = n | 0;
        return;
    }
    function yu($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        yo($, r);
        return;
    }
    function yf($) {
        $ = $ | 0;
        return _d($) | 0;
    }
    function yo($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0;
        i = s;
        s = (s + 16) | 0;
        r = i;
        e = n;
        if (!(e & 1)) _[$ >> 2] = _[n >> 2];
        else {
            yc(r, 0);
            $T(e | 0, r | 0) | 0;
            y6($, r);
            ya(r);
        }
        s = i;
        return;
    }
    function yc($, n) {
        $ = $ | 0;
        n = n | 0;
        _I($, n);
        _[($ + 4) >> 2] = 0;
        e[($ + 8) >> 0] = 0;
        return;
    }
    function y6($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = _[(n + 4) >> 2];
        return;
    }
    function ya($) {
        $ = $ | 0;
        e[($ + 8) >> 0] = 0;
        return;
    }
    function y1($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = y4() | 0;
        $ = yl(r) | 0;
        tp(t, n, i, $, yv(r, e) | 0, e);
        return;
    }
    function y4() {
        var $ = 0, n = 0;
        if (!(e[8064] | 0)) {
            yh(10968);
            $I(68, 10968, h | 0) | 0;
            n = 8064;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(10968) | 0)) {
            $ = 10968;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            yh(10968);
        }
        return 10968;
    }
    function yl($) {
        $ = $ | 0;
        return $ | 0;
    }
    function yv($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = y4() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            y7(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            y5(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function y7($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function y5($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = ys($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            y3(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            y7(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            yb($, i);
            yk(i);
            s = f;
            return;
        }
    }
    function ys($) {
        $ = $ | 0;
        return 536870911;
    }
    function y3($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function yb($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function yk($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function yh($) {
        $ = $ | 0;
        y8($);
        return;
    }
    function yd($) {
        $ = $ | 0;
        yw(($ + 24) | 0);
        return;
    }
    function yw($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function y8($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 1, n, ym() | 0, 5);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function ym() {
        return 1872;
    }
    function yy($, n, r, e, i, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        t = t | 0;
        yC(_[(yp($) | 0) >> 2] | 0, n, r, e, i, t);
        return;
    }
    function yp($) {
        $ = $ | 0;
        return ((_[((y4() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function yC($, n, r, e, i, _) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        _ = _ | 0;
        var t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        t = s;
        s = (s + 32) | 0;
        u = (t + 16) | 0;
        f = (t + 12) | 0;
        o = (t + 8) | 0;
        c = (t + 4) | 0;
        a = t;
        fa(u, n);
        n = f1(u, n) | 0;
        fa(f, r);
        r = f1(f, r) | 0;
        fa(o, e);
        e = f1(o, e) | 0;
        fa(c, i);
        i = f1(c, i) | 0;
        fa(a, _);
        _ = f1(a, _) | 0;
        MN[$ & 1](n, r, e, i, _);
        f4(a);
        f4(c);
        f4(o);
        f4(f);
        f4(u);
        s = t;
        return;
    }
    function yM($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = _[$ >> 2] | 0;
        i = yg() | 0;
        $ = yA(r) | 0;
        tp(t, n, i, $, yI(r, e) | 0, e);
        return;
    }
    function yg() {
        var $ = 0, n = 0;
        if (!(e[8072] | 0)) {
            yP(11004);
            $I(69, 11004, h | 0) | 0;
            n = 8072;
            _[n >> 2] = 1;
            _[(n + 4) >> 2] = 0;
        }
        if (!(tE(11004) | 0)) {
            $ = 11004;
            n = ($ + 36) | 0;
            do {
                _[$ >> 2] = 0;
                $ = ($ + 4) | 0;
            }while (($ | 0) < (n | 0))
            yP(11004);
        }
        return 11004;
    }
    function yA($) {
        $ = $ | 0;
        return $ | 0;
    }
    function yI($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        f = s;
        s = (s + 16) | 0;
        i = f;
        t = (f + 4) | 0;
        _[i >> 2] = $;
        o = yg() | 0;
        u = (o + 24) | 0;
        n = tA(n, 4) | 0;
        _[t >> 2] = n;
        r = (o + 28) | 0;
        e = _[r >> 2] | 0;
        if (e >>> 0 < (_[(o + 32) >> 2] | 0) >>> 0) {
            yS(e, $, n);
            n = ((_[r >> 2] | 0) + 8) | 0;
            _[r >> 2] = n;
        } else {
            yT(u, i, t);
            n = _[r >> 2] | 0;
        }
        s = f;
        return (((n - (_[u >> 2] | 0)) >> 3) + -1) | 0;
    }
    function yS($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function yT($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0;
        f = s;
        s = (s + 32) | 0;
        i = f;
        t = ($ + 4) | 0;
        u = ((((_[t >> 2] | 0) - (_[$ >> 2] | 0)) >> 3) + 1) | 0;
        e = yx($) | 0;
        if (e >>> 0 < u >>> 0) Cd($);
        else {
            o = _[$ >> 2] | 0;
            a = ((_[($ + 8) >> 2] | 0) - o) | 0;
            c = a >> 2;
            yN(i, (a >> 3) >>> 0 < (e >>> 1) >>> 0 ? c >>> 0 < u >>> 0 ? u : c : e, ((_[t >> 2] | 0) - o) >> 3, ($ + 8) | 0);
            u = (i + 8) | 0;
            yS(_[u >> 2] | 0, _[n >> 2] | 0, _[r >> 2] | 0);
            _[u >> 2] = (_[u >> 2] | 0) + 8;
            yL($, i);
            yO(i);
            s = f;
            return;
        }
    }
    function yx($) {
        $ = $ | 0;
        return 536870911;
    }
    function yN($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0;
        _[($ + 12) >> 2] = 0;
        _[($ + 16) >> 2] = e;
        do if (n) {
            if (n >>> 0 > 536870911) $Y();
            else {
                i = CM(n << 3) | 0;
                break;
            }
        } else i = 0;
        while (0)
        _[$ >> 2] = i;
        e = (i + (r << 3)) | 0;
        _[($ + 8) >> 2] = e;
        _[($ + 4) >> 2] = e;
        _[($ + 12) >> 2] = i + (n << 3);
        return;
    }
    function yL($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0, i = 0, t = 0, u = 0;
        e = _[$ >> 2] | 0;
        u = ($ + 4) | 0;
        t = (n + 4) | 0;
        i = ((_[u >> 2] | 0) - e) | 0;
        r = ((_[t >> 2] | 0) + ((0 - (i >> 3)) << 3)) | 0;
        _[t >> 2] = r;
        if ((i | 0) > 0) {
            CE(r | 0, e | 0, i | 0) | 0;
            e = t;
            r = _[t >> 2] | 0;
        } else e = t;
        t = _[$ >> 2] | 0;
        _[$ >> 2] = r;
        _[e >> 2] = t;
        t = (n + 8) | 0;
        i = _[u >> 2] | 0;
        _[u >> 2] = _[t >> 2];
        _[t >> 2] = i;
        t = ($ + 8) | 0;
        u = (n + 12) | 0;
        $ = _[t >> 2] | 0;
        _[t >> 2] = _[u >> 2];
        _[u >> 2] = $;
        _[n >> 2] = _[e >> 2];
        return;
    }
    function yO($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        n = _[($ + 4) >> 2] | 0;
        r = ($ + 8) | 0;
        e = _[r >> 2] | 0;
        if ((e | 0) != (n | 0)) _[r >> 2] = e + (~(((e + -8 - n) | 0) >>> 3) << 3);
        $ = _[$ >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function yP($) {
        $ = $ | 0;
        yB($);
        return;
    }
    function yE($) {
        $ = $ | 0;
        yG(($ + 24) | 0);
        return;
    }
    function yG($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function yB($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 1, 12, n, yR() | 0, 2);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function yR() {
        return 1896;
    }
    function yY($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        yj(_[(yU($) | 0) >> 2] | 0, n, r);
        return;
    }
    function yU($) {
        $ = $ | 0;
        return ((_[((yg() | 0) + 24) >> 2] | 0) + ($ << 3)) | 0;
    }
    function yj($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, _ = 0;
        e = s;
        s = (s + 16) | 0;
        _ = (e + 4) | 0;
        i = e;
        yz(_, n);
        n = yD(_, n) | 0;
        fa(i, r);
        r = f1(i, r) | 0;
        MG[$ & 31](n, r);
        f4(i);
        s = e;
        return;
    }
    function yz($, n) {
        $ = $ | 0;
        n = n | 0;
        return;
    }
    function yD($, n) {
        $ = $ | 0;
        n = n | 0;
        return yF(n) | 0;
    }
    function yF($) {
        $ = $ | 0;
        return $ | 0;
    }
    function yK() {
        var $ = 0;
        if (!(e[8080] | 0)) {
            yq(11040);
            $I(70, 11040, h | 0) | 0;
            $ = 8080;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        if (!(tE(11040) | 0)) yq(11040);
        return 11040;
    }
    function yq($) {
        $ = $ | 0;
        yZ($);
        kf($, 71);
        return;
    }
    function yH($) {
        $ = $ | 0;
        yX(($ + 24) | 0);
        return;
    }
    function yX($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0;
        r = _[$ >> 2] | 0;
        e = r;
        if (r | 0) {
            $ = ($ + 4) | 0;
            n = _[$ >> 2] | 0;
            if ((n | 0) != (r | 0)) _[$ >> 2] = n + (~(((n + -8 - e) | 0) >>> 3) << 3);
            CA(r);
        }
        return;
    }
    function yZ($) {
        $ = $ | 0;
        var n = 0;
        n = tR() | 0;
        tj($, 5, 7, n, yW() | 0, 0);
        _[($ + 24) >> 2] = 0;
        _[($ + 28) >> 2] = 0;
        _[($ + 32) >> 2] = 0;
        return;
    }
    function yJ($) {
        $ = $ | 0;
        yQ($);
        return;
    }
    function yQ($) {
        $ = $ | 0;
        yV($);
        return;
    }
    function yV($) {
        $ = $ | 0;
        e[($ + 8) >> 0] = 1;
        return;
    }
    function yW() {
        return 1936;
    }
    function y9() {
        return p$() | 0;
    }
    function p$() {
        var $ = 0, n = 0, r = 0, e = 0, i = 0, t = 0, u = 0;
        n = s;
        s = (s + 16) | 0;
        i = (n + 4) | 0;
        u = n;
        r = mn(8) | 0;
        $ = r;
        t = ($ + 4) | 0;
        _[t >> 2] = CM(1) | 0;
        e = CM(8) | 0;
        t = _[t >> 2] | 0;
        _[u >> 2] = 0;
        _[i >> 2] = _[u >> 2];
        p0(e, t, i);
        _[r >> 2] = e;
        s = n;
        return $ | 0;
    }
    function p0($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        _[$ >> 2] = n;
        r = CM(16) | 0;
        _[(r + 4) >> 2] = 0;
        _[(r + 8) >> 2] = 0;
        _[r >> 2] = 1916;
        _[(r + 12) >> 2] = n;
        _[($ + 4) >> 2] = r;
        return;
    }
    function pn($) {
        $ = $ | 0;
        Cw($);
        CA($);
        return;
    }
    function pr($) {
        $ = $ | 0;
        $ = _[($ + 12) >> 2] | 0;
        if ($ | 0) CA($);
        return;
    }
    function pe($) {
        $ = $ | 0;
        CA($);
        return;
    }
    function pi() {
        var $ = 0;
        if (!(e[8088] | 0)) {
            pc(11076);
            $I(25, 11076, h | 0) | 0;
            $ = 8088;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 11076;
    }
    function p_($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = pt() | 0;
        _[($ + 4) >> 2] = p2() | 0;
        _[($ + 12) >> 2] = n;
        _[($ + 8) >> 2] = pu() | 0;
        _[($ + 32) >> 2] = 10;
        return;
    }
    function pt() {
        return 11745;
    }
    function p2() {
        return 1940;
    }
    function pu() {
        return su() | 0;
    }
    function pf($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        if ((st(e, 896) | 0) == 512) {
            if (r | 0) {
                po(r);
                CA(r);
            }
        } else if (n | 0) CA(n);
        return;
    }
    function po($) {
        $ = $ | 0;
        $ = _[($ + 4) >> 2] | 0;
        if ($ | 0) Cp($);
        return;
    }
    function pc($) {
        $ = $ | 0;
        u6($);
        return;
    }
    function p6($, n) {
        $ = $ | 0;
        n = n | 0;
        _[$ >> 2] = n;
        return;
    }
    function pa($) {
        $ = $ | 0;
        return _[$ >> 2] | 0;
    }
    function p1($) {
        $ = $ | 0;
        return e[_[$ >> 2] >> 0] | 0;
    }
    function p4($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        _[e >> 2] = _[$ >> 2];
        pl(n, e) | 0;
        s = r;
        return;
    }
    function pl($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = pv(_[$ >> 2] | 0, n) | 0;
        n = ($ + 4) | 0;
        _[((_[n >> 2] | 0) + 8) >> 2] = r;
        return _[((_[n >> 2] | 0) + 8) >> 2] | 0;
    }
    function pv($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, e = 0;
        r = s;
        s = (s + 16) | 0;
        e = r;
        p7(e);
        $ = _d($) | 0;
        n = p5($, _[n >> 2] | 0) | 0;
        ps(e);
        s = r;
        return n | 0;
    }
    function p7($) {
        $ = $ | 0;
        _[$ >> 2] = _[2701];
        _[($ + 4) >> 2] = _[2703];
        return;
    }
    function p5($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = _m(p3() | 0) | 0;
        return $Z(0, r | 0, $ | 0, dp(n) | 0) | 0;
    }
    function ps($) {
        $ = $ | 0;
        m4(_[$ >> 2] | 0, _[($ + 4) >> 2] | 0);
        return;
    }
    function p3() {
        var $ = 0;
        if (!(e[8096] | 0)) {
            pb(11120);
            $ = 8096;
            _[$ >> 2] = 1;
            _[($ + 4) >> 2] = 0;
        }
        return 11120;
    }
    function pb($) {
        $ = $ | 0;
        _L($, pk() | 0, 1);
        return;
    }
    function pk() {
        return 1948;
    }
    function ph() {
        pd();
        return;
    }
    function pd() {
        var $ = 0, n = 0, r = 0, i = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0, k = 0, h = 0, d = 0, w = 0;
        d = s;
        s = (s + 16) | 0;
        v = (d + 4) | 0;
        b = d;
        $M(65536, 10804, _[2702] | 0, 10812);
        r = d_() | 0;
        n = _[r >> 2] | 0;
        $ = _[n >> 2] | 0;
        if ($ | 0) {
            i = _[(r + 8) >> 2] | 0;
            r = _[(r + 4) >> 2] | 0;
            while(1){
                $L($ | 0, t[r >> 0] | 0 | 0, e[i >> 0] | 0);
                n = (n + 4) | 0;
                $ = _[n >> 2] | 0;
                if (!$) break;
                else {
                    i = (i + 1) | 0;
                    r = (r + 1) | 0;
                }
            }
        }
        $ = d2() | 0;
        n = _[$ >> 2] | 0;
        if (n | 0) do {
            $O(n | 0, _[($ + 4) >> 2] | 0);
            $ = ($ + 8) | 0;
            n = _[$ >> 2] | 0;
        }while ((n | 0) != 0)
        $O(pw() | 0, 5167);
        l = hH() | 0;
        $ = _[l >> 2] | 0;
        a: do if ($ | 0) {
            do {
                p8(_[($ + 4) >> 2] | 0);
                $ = _[$ >> 2] | 0;
            }while (($ | 0) != 0)
            $ = _[l >> 2] | 0;
            if ($ | 0) {
                a = l;
                do {
                    while(1){
                        u = $;
                        $ = _[$ >> 2] | 0;
                        u = _[(u + 4) >> 2] | 0;
                        if (!(pm(u) | 0)) break;
                        _[b >> 2] = a;
                        _[v >> 2] = _[b >> 2];
                        py(l, v) | 0;
                        if (!$) break a;
                    }
                    pp(u);
                    a = _[a >> 2] | 0;
                    n = pC(u) | 0;
                    f = $j() | 0;
                    o = s;
                    s = (s + ((((1 * (n << 2)) | 0) + 15) & -16)) | 0;
                    c = s;
                    s = (s + ((((1 * (n << 2)) | 0) + 15) & -16)) | 0;
                    n = _[(w$(u) | 0) >> 2] | 0;
                    if (n | 0) {
                        r = o;
                        i = c;
                        while(1){
                            _[r >> 2] = _[(dW(_[(n + 4) >> 2] | 0) | 0) >> 2];
                            _[i >> 2] = _[(n + 8) >> 2];
                            n = _[n >> 2] | 0;
                            if (!n) break;
                            else {
                                r = (r + 4) | 0;
                                i = (i + 4) | 0;
                            }
                        }
                    }
                    w = dW(u) | 0;
                    n = pM(u) | 0;
                    r = pC(u) | 0;
                    i = pg(u) | 0;
                    $B(w | 0, n | 0, o | 0, c | 0, r | 0, i | 0, dr(u) | 0);
                    $A(f | 0);
                }while (($ | 0) != 0)
            }
        }
        while (0)
        $ = _[(di() | 0) >> 2] | 0;
        if ($ | 0) do {
            w = ($ + 4) | 0;
            l = d6(w) | 0;
            u = dv(l) | 0;
            f = da(l) | 0;
            o = ((d1(l) | 0) + 1) | 0;
            c = pA(l) | 0;
            a = pI(w) | 0;
            l = tE(l) | 0;
            v = d5(w) | 0;
            b = pS(w) | 0;
            $E(0, u | 0, f | 0, o | 0, c | 0, a | 0, l | 0, v | 0, b | 0, pT(w) | 0);
            $ = _[$ >> 2] | 0;
        }while (($ | 0) != 0)
        $ = _[(hH() | 0) >> 2] | 0;
        b: do if ($ | 0) {
            c: while(1){
                n = _[($ + 4) >> 2] | 0;
                if (n | 0 ? ((k = _[(dW(n) | 0) >> 2] | 0), (h = _[(wr(n) | 0) >> 2] | 0), h | 0) : 0) {
                    r = h;
                    do {
                        n = (r + 4) | 0;
                        i = d6(n) | 0;
                        d: do if (i | 0) switch(tE(i) | 0){
                            case 0:
                                break c;
                            case 4:
                            case 3:
                            case 2:
                                {
                                    c = dv(i) | 0;
                                    a = da(i) | 0;
                                    l = ((d1(i) | 0) + 1) | 0;
                                    v = pA(i) | 0;
                                    b = tE(i) | 0;
                                    w = d5(n) | 0;
                                    $E(k | 0, c | 0, a | 0, l | 0, v | 0, 0, b | 0, w | 0, pS(n) | 0, pT(n) | 0);
                                    break d;
                                }
                            case 1:
                                {
                                    o = dv(i) | 0;
                                    c = da(i) | 0;
                                    a = ((d1(i) | 0) + 1) | 0;
                                    l = pA(i) | 0;
                                    v = pI(n) | 0;
                                    b = tE(i) | 0;
                                    w = d5(n) | 0;
                                    $E(k | 0, o | 0, c | 0, a | 0, l | 0, v | 0, b | 0, w | 0, pS(n) | 0, pT(n) | 0);
                                    break d;
                                }
                            case 5:
                                {
                                    l = dv(i) | 0;
                                    v = da(i) | 0;
                                    b = ((d1(i) | 0) + 1) | 0;
                                    w = pA(i) | 0;
                                    $E(k | 0, l | 0, v | 0, b | 0, w | 0, px(i) | 0, tE(i) | 0, 0, 0, 0);
                                    break d;
                                }
                            default:
                                break d;
                        }
                        while (0)
                        r = _[r >> 2] | 0;
                    }while ((r | 0) != 0)
                }
                $ = _[$ >> 2] | 0;
                if (!$) break b;
            }
            $Y();
        }
        while (0)
        $R();
        s = d;
        return;
    }
    function pw() {
        return 11703;
    }
    function p8($) {
        $ = $ | 0;
        e[($ + 40) >> 0] = 0;
        return;
    }
    function pm($) {
        $ = $ | 0;
        return ((e[($ + 40) >> 0] | 0) != 0) | 0;
    }
    function py($, n) {
        $ = $ | 0;
        n = n | 0;
        n = pN(n) | 0;
        $ = _[n >> 2] | 0;
        _[n >> 2] = _[$ >> 2];
        CA($);
        return _[n >> 2] | 0;
    }
    function pp($) {
        $ = $ | 0;
        e[($ + 40) >> 0] = 1;
        return;
    }
    function pC($) {
        $ = $ | 0;
        return _[($ + 20) >> 2] | 0;
    }
    function pM($) {
        $ = $ | 0;
        return _[($ + 8) >> 2] | 0;
    }
    function pg($) {
        $ = $ | 0;
        return _[($ + 32) >> 2] | 0;
    }
    function pA($) {
        $ = $ | 0;
        return _[($ + 4) >> 2] | 0;
    }
    function pI($) {
        $ = $ | 0;
        return _[($ + 4) >> 2] | 0;
    }
    function pS($) {
        $ = $ | 0;
        return _[($ + 8) >> 2] | 0;
    }
    function pT($) {
        $ = $ | 0;
        return _[($ + 16) >> 2] | 0;
    }
    function px($) {
        $ = $ | 0;
        return _[($ + 20) >> 2] | 0;
    }
    function pN($) {
        $ = $ | 0;
        return _[$ >> 2] | 0;
    }
    function pL($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0, k = 0, h = 0, d = 0, w = 0, m = 0, y = 0, p = 0, C = 0;
        C = s;
        s = (s + 16) | 0;
        v = C;
        do if ($ >>> 0 < 245) {
            c = $ >>> 0 < 11 ? 16 : ($ + 11) & -8;
            $ = c >>> 3;
            l = _[2783] | 0;
            r = l >>> $;
            if ((r & 3) | 0) {
                n = (((r & 1) ^ 1) + $) | 0;
                $ = (11172 + ((n << 1) << 2)) | 0;
                r = ($ + 8) | 0;
                e = _[r >> 2] | 0;
                i = (e + 8) | 0;
                t = _[i >> 2] | 0;
                if (($ | 0) == (t | 0)) _[2783] = l & ~(1 << n);
                else {
                    _[(t + 12) >> 2] = $;
                    _[r >> 2] = t;
                }
                p = n << 3;
                _[(e + 4) >> 2] = p | 3;
                p = (e + p + 4) | 0;
                _[p >> 2] = _[p >> 2] | 1;
                p = i;
                s = C;
                return p | 0;
            }
            a = _[2785] | 0;
            if (c >>> 0 > a >>> 0) {
                if (r | 0) {
                    n = 2 << $;
                    n = (r << $) & (n | (0 - n));
                    n = ((n & (0 - n)) + -1) | 0;
                    u = (n >>> 12) & 16;
                    n = n >>> u;
                    r = (n >>> 5) & 8;
                    n = n >>> r;
                    i = (n >>> 2) & 4;
                    n = n >>> i;
                    $ = (n >>> 1) & 2;
                    n = n >>> $;
                    e = (n >>> 1) & 1;
                    e = ((r | u | i | $ | e) + (n >>> e)) | 0;
                    n = (11172 + ((e << 1) << 2)) | 0;
                    $ = (n + 8) | 0;
                    i = _[$ >> 2] | 0;
                    u = (i + 8) | 0;
                    r = _[u >> 2] | 0;
                    if ((n | 0) == (r | 0)) {
                        $ = l & ~(1 << e);
                        _[2783] = $;
                    } else {
                        _[(r + 12) >> 2] = n;
                        _[$ >> 2] = r;
                        $ = l;
                    }
                    t = ((e << 3) - c) | 0;
                    _[(i + 4) >> 2] = c | 3;
                    e = (i + c) | 0;
                    _[(e + 4) >> 2] = t | 1;
                    _[(e + t) >> 2] = t;
                    if (a | 0) {
                        i = _[2788] | 0;
                        n = a >>> 3;
                        r = (11172 + ((n << 1) << 2)) | 0;
                        n = 1 << n;
                        if (!($ & n)) {
                            _[2783] = $ | n;
                            n = r;
                            $ = (r + 8) | 0;
                        } else {
                            $ = (r + 8) | 0;
                            n = _[$ >> 2] | 0;
                        }
                        _[$ >> 2] = i;
                        _[(n + 12) >> 2] = i;
                        _[(i + 8) >> 2] = n;
                        _[(i + 12) >> 2] = r;
                    }
                    _[2785] = t;
                    _[2788] = e;
                    p = u;
                    s = C;
                    return p | 0;
                }
                f = _[2784] | 0;
                if (f) {
                    r = ((f & (0 - f)) + -1) | 0;
                    u = (r >>> 12) & 16;
                    r = r >>> u;
                    t = (r >>> 5) & 8;
                    r = r >>> t;
                    o = (r >>> 2) & 4;
                    r = r >>> o;
                    e = (r >>> 1) & 2;
                    r = r >>> e;
                    $ = (r >>> 1) & 1;
                    $ = _[(11436 + (((t | u | o | e | $) + (r >>> $)) << 2)) >> 2] | 0;
                    r = ((_[($ + 4) >> 2] & -8) - c) | 0;
                    e = _[($ + 16 + ((((_[($ + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                    if (!e) {
                        o = $;
                        t = r;
                    } else {
                        do {
                            u = ((_[(e + 4) >> 2] & -8) - c) | 0;
                            o = u >>> 0 < r >>> 0;
                            r = o ? u : r;
                            $ = o ? e : $;
                            e = _[(e + 16 + ((((_[(e + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                        }while ((e | 0) != 0)
                        o = $;
                        t = r;
                    }
                    u = (o + c) | 0;
                    if (o >>> 0 < u >>> 0) {
                        i = _[(o + 24) >> 2] | 0;
                        n = _[(o + 12) >> 2] | 0;
                        do if ((n | 0) == (o | 0)) {
                            $ = (o + 20) | 0;
                            n = _[$ >> 2] | 0;
                            if (!n) {
                                $ = (o + 16) | 0;
                                n = _[$ >> 2] | 0;
                                if (!n) {
                                    r = 0;
                                    break;
                                }
                            }
                            while(1){
                                r = (n + 20) | 0;
                                e = _[r >> 2] | 0;
                                if (e | 0) {
                                    n = e;
                                    $ = r;
                                    continue;
                                }
                                r = (n + 16) | 0;
                                e = _[r >> 2] | 0;
                                if (!e) break;
                                else {
                                    n = e;
                                    $ = r;
                                }
                            }
                            _[$ >> 2] = 0;
                            r = n;
                        } else {
                            r = _[(o + 8) >> 2] | 0;
                            _[(r + 12) >> 2] = n;
                            _[(n + 8) >> 2] = r;
                            r = n;
                        }
                        while (0)
                        do if (i | 0) {
                            n = _[(o + 28) >> 2] | 0;
                            $ = (11436 + (n << 2)) | 0;
                            if ((o | 0) == (_[$ >> 2] | 0)) {
                                _[$ >> 2] = r;
                                if (!r) {
                                    _[2784] = f & ~(1 << n);
                                    break;
                                }
                            } else {
                                _[(i + 16 + ((((_[(i + 16) >> 2] | 0) != (o | 0)) & 1) << 2)) >> 2] = r;
                                if (!r) break;
                            }
                            _[(r + 24) >> 2] = i;
                            n = _[(o + 16) >> 2] | 0;
                            if (n | 0) {
                                _[(r + 16) >> 2] = n;
                                _[(n + 24) >> 2] = r;
                            }
                            n = _[(o + 20) >> 2] | 0;
                            if (n | 0) {
                                _[(r + 20) >> 2] = n;
                                _[(n + 24) >> 2] = r;
                            }
                        }
                        while (0)
                        if (t >>> 0 < 16) {
                            p = (t + c) | 0;
                            _[(o + 4) >> 2] = p | 3;
                            p = (o + p + 4) | 0;
                            _[p >> 2] = _[p >> 2] | 1;
                        } else {
                            _[(o + 4) >> 2] = c | 3;
                            _[(u + 4) >> 2] = t | 1;
                            _[(u + t) >> 2] = t;
                            if (a | 0) {
                                e = _[2788] | 0;
                                n = a >>> 3;
                                r = (11172 + ((n << 1) << 2)) | 0;
                                n = 1 << n;
                                if (!(l & n)) {
                                    _[2783] = l | n;
                                    n = r;
                                    $ = (r + 8) | 0;
                                } else {
                                    $ = (r + 8) | 0;
                                    n = _[$ >> 2] | 0;
                                }
                                _[$ >> 2] = e;
                                _[(n + 12) >> 2] = e;
                                _[(e + 8) >> 2] = n;
                                _[(e + 12) >> 2] = r;
                            }
                            _[2785] = t;
                            _[2788] = u;
                        }
                        p = (o + 8) | 0;
                        s = C;
                        return p | 0;
                    } else l = c;
                } else l = c;
            } else l = c;
        } else if ($ >>> 0 <= 4294967231) {
            $ = ($ + 11) | 0;
            c = $ & -8;
            o = _[2784] | 0;
            if (o) {
                e = (0 - c) | 0;
                $ = $ >>> 8;
                if ($) {
                    if (c >>> 0 > 16777215) f = 31;
                    else {
                        l = ((($ + 1048320) | 0) >>> 16) & 8;
                        y = $ << l;
                        a = (((y + 520192) | 0) >>> 16) & 4;
                        y = y << a;
                        f = (((y + 245760) | 0) >>> 16) & 2;
                        f = (14 - (a | l | f) + ((y << f) >>> 15)) | 0;
                        f = ((c >>> ((f + 7) | 0)) & 1) | (f << 1);
                    }
                } else f = 0;
                r = _[(11436 + (f << 2)) >> 2] | 0;
                a: do if (!r) {
                    r = 0;
                    $ = 0;
                    y = 57;
                } else {
                    $ = 0;
                    u = c << ((f | 0) == 31 ? 0 : (25 - (f >>> 1)) | 0);
                    t = 0;
                    while(1){
                        i = ((_[(r + 4) >> 2] & -8) - c) | 0;
                        if (i >>> 0 < e >>> 0) if (!i) {
                            $ = r;
                            e = 0;
                            i = r;
                            y = 61;
                            break a;
                        } else {
                            $ = r;
                            e = i;
                        }
                        i = _[(r + 20) >> 2] | 0;
                        r = _[(r + 16 + ((u >>> 31) << 2)) >> 2] | 0;
                        t = ((i | 0) == 0) | ((i | 0) == (r | 0)) ? t : i;
                        i = (r | 0) == 0;
                        if (i) {
                            r = t;
                            y = 57;
                            break;
                        } else u = u << ((i ^ 1) & 1);
                    }
                }
                while (0)
                if ((y | 0) == 57) {
                    if (((r | 0) == 0) & (($ | 0) == 0)) {
                        $ = 2 << f;
                        $ = o & ($ | (0 - $));
                        if (!$) {
                            l = c;
                            break;
                        }
                        l = (($ & (0 - $)) + -1) | 0;
                        u = (l >>> 12) & 16;
                        l = l >>> u;
                        t = (l >>> 5) & 8;
                        l = l >>> t;
                        f = (l >>> 2) & 4;
                        l = l >>> f;
                        a = (l >>> 1) & 2;
                        l = l >>> a;
                        r = (l >>> 1) & 1;
                        $ = 0;
                        r = _[(11436 + (((t | u | f | a | r) + (l >>> r)) << 2)) >> 2] | 0;
                    }
                    if (!r) {
                        f = $;
                        u = e;
                    } else {
                        i = r;
                        y = 61;
                    }
                }
                if ((y | 0) == 61) while(1){
                    y = 0;
                    r = ((_[(i + 4) >> 2] & -8) - c) | 0;
                    l = r >>> 0 < e >>> 0;
                    r = l ? r : e;
                    $ = l ? i : $;
                    i = _[(i + 16 + ((((_[(i + 16) >> 2] | 0) == 0) & 1) << 2)) >> 2] | 0;
                    if (!i) {
                        f = $;
                        u = r;
                        break;
                    } else {
                        e = r;
                        y = 61;
                    }
                }
                if ((f | 0) != 0 ? u >>> 0 < (((_[2785] | 0) - c) | 0) >>> 0 : 0) {
                    t = (f + c) | 0;
                    if (f >>> 0 >= t >>> 0) {
                        p = 0;
                        s = C;
                        return p | 0;
                    }
                    i = _[(f + 24) >> 2] | 0;
                    n = _[(f + 12) >> 2] | 0;
                    do if ((n | 0) == (f | 0)) {
                        $ = (f + 20) | 0;
                        n = _[$ >> 2] | 0;
                        if (!n) {
                            $ = (f + 16) | 0;
                            n = _[$ >> 2] | 0;
                            if (!n) {
                                n = 0;
                                break;
                            }
                        }
                        while(1){
                            r = (n + 20) | 0;
                            e = _[r >> 2] | 0;
                            if (e | 0) {
                                n = e;
                                $ = r;
                                continue;
                            }
                            r = (n + 16) | 0;
                            e = _[r >> 2] | 0;
                            if (!e) break;
                            else {
                                n = e;
                                $ = r;
                            }
                        }
                        _[$ >> 2] = 0;
                    } else {
                        p = _[(f + 8) >> 2] | 0;
                        _[(p + 12) >> 2] = n;
                        _[(n + 8) >> 2] = p;
                    }
                    while (0)
                    do if (i) {
                        $ = _[(f + 28) >> 2] | 0;
                        r = (11436 + ($ << 2)) | 0;
                        if ((f | 0) == (_[r >> 2] | 0)) {
                            _[r >> 2] = n;
                            if (!n) {
                                e = o & ~(1 << $);
                                _[2784] = e;
                                break;
                            }
                        } else {
                            _[(i + 16 + ((((_[(i + 16) >> 2] | 0) != (f | 0)) & 1) << 2)) >> 2] = n;
                            if (!n) {
                                e = o;
                                break;
                            }
                        }
                        _[(n + 24) >> 2] = i;
                        $ = _[(f + 16) >> 2] | 0;
                        if ($ | 0) {
                            _[(n + 16) >> 2] = $;
                            _[($ + 24) >> 2] = n;
                        }
                        $ = _[(f + 20) >> 2] | 0;
                        if ($) {
                            _[(n + 20) >> 2] = $;
                            _[($ + 24) >> 2] = n;
                            e = o;
                        } else e = o;
                    } else e = o;
                    while (0)
                    do if (u >>> 0 >= 16) {
                        _[(f + 4) >> 2] = c | 3;
                        _[(t + 4) >> 2] = u | 1;
                        _[(t + u) >> 2] = u;
                        n = u >>> 3;
                        if (u >>> 0 < 256) {
                            r = (11172 + ((n << 1) << 2)) | 0;
                            $ = _[2783] | 0;
                            n = 1 << n;
                            if (!($ & n)) {
                                _[2783] = $ | n;
                                n = r;
                                $ = (r + 8) | 0;
                            } else {
                                $ = (r + 8) | 0;
                                n = _[$ >> 2] | 0;
                            }
                            _[$ >> 2] = t;
                            _[(n + 12) >> 2] = t;
                            _[(t + 8) >> 2] = n;
                            _[(t + 12) >> 2] = r;
                            break;
                        }
                        n = u >>> 8;
                        if (n) {
                            if (u >>> 0 > 16777215) n = 31;
                            else {
                                y = (((n + 1048320) | 0) >>> 16) & 8;
                                p = n << y;
                                m = (((p + 520192) | 0) >>> 16) & 4;
                                p = p << m;
                                n = (((p + 245760) | 0) >>> 16) & 2;
                                n = (14 - (m | y | n) + ((p << n) >>> 15)) | 0;
                                n = ((u >>> ((n + 7) | 0)) & 1) | (n << 1);
                            }
                        } else n = 0;
                        r = (11436 + (n << 2)) | 0;
                        _[(t + 28) >> 2] = n;
                        $ = (t + 16) | 0;
                        _[($ + 4) >> 2] = 0;
                        _[$ >> 2] = 0;
                        $ = 1 << n;
                        if (!(e & $)) {
                            _[2784] = e | $;
                            _[r >> 2] = t;
                            _[(t + 24) >> 2] = r;
                            _[(t + 12) >> 2] = t;
                            _[(t + 8) >> 2] = t;
                            break;
                        }
                        $ = u << ((n | 0) == 31 ? 0 : (25 - (n >>> 1)) | 0);
                        r = _[r >> 2] | 0;
                        while(1){
                            if (((_[(r + 4) >> 2] & -8) | 0) == (u | 0)) {
                                y = 97;
                                break;
                            }
                            e = (r + 16 + (($ >>> 31) << 2)) | 0;
                            n = _[e >> 2] | 0;
                            if (!n) {
                                y = 96;
                                break;
                            } else {
                                $ = $ << 1;
                                r = n;
                            }
                        }
                        if ((y | 0) == 96) {
                            _[e >> 2] = t;
                            _[(t + 24) >> 2] = r;
                            _[(t + 12) >> 2] = t;
                            _[(t + 8) >> 2] = t;
                            break;
                        } else if ((y | 0) == 97) {
                            y = (r + 8) | 0;
                            p = _[y >> 2] | 0;
                            _[(p + 12) >> 2] = t;
                            _[y >> 2] = t;
                            _[(t + 8) >> 2] = p;
                            _[(t + 12) >> 2] = r;
                            _[(t + 24) >> 2] = 0;
                            break;
                        }
                    } else {
                        p = (u + c) | 0;
                        _[(f + 4) >> 2] = p | 3;
                        p = (f + p + 4) | 0;
                        _[p >> 2] = _[p >> 2] | 1;
                    }
                    while (0)
                    p = (f + 8) | 0;
                    s = C;
                    return p | 0;
                } else l = c;
            } else l = c;
        } else l = -1;
        while (0)
        r = _[2785] | 0;
        if (r >>> 0 >= l >>> 0) {
            n = (r - l) | 0;
            $ = _[2788] | 0;
            if (n >>> 0 > 15) {
                p = ($ + l) | 0;
                _[2788] = p;
                _[2785] = n;
                _[(p + 4) >> 2] = n | 1;
                _[(p + n) >> 2] = n;
                _[($ + 4) >> 2] = l | 3;
            } else {
                _[2785] = 0;
                _[2788] = 0;
                _[($ + 4) >> 2] = r | 3;
                p = ($ + r + 4) | 0;
                _[p >> 2] = _[p >> 2] | 1;
            }
            p = ($ + 8) | 0;
            s = C;
            return p | 0;
        }
        u = _[2786] | 0;
        if (u >>> 0 > l >>> 0) {
            m = (u - l) | 0;
            _[2786] = m;
            p = _[2789] | 0;
            y = (p + l) | 0;
            _[2789] = y;
            _[(y + 4) >> 2] = m | 1;
            _[(p + 4) >> 2] = l | 3;
            p = (p + 8) | 0;
            s = C;
            return p | 0;
        }
        if (!(_[2901] | 0)) {
            _[2903] = 4096;
            _[2902] = 4096;
            _[2904] = -1;
            _[2905] = -1;
            _[2906] = 0;
            _[2894] = 0;
            $ = (v & -16) ^ 1431655768;
            _[v >> 2] = $;
            _[2901] = $;
            $ = 4096;
        } else $ = _[2903] | 0;
        f = (l + 48) | 0;
        o = (l + 47) | 0;
        t = ($ + o) | 0;
        i = (0 - $) | 0;
        c = t & i;
        if (c >>> 0 <= l >>> 0) {
            p = 0;
            s = C;
            return p | 0;
        }
        $ = _[2893] | 0;
        if ($ | 0 ? ((a = _[2891] | 0), (v = (a + c) | 0), (v >>> 0 <= a >>> 0) | (v >>> 0 > $ >>> 0)) : 0) {
            p = 0;
            s = C;
            return p | 0;
        }
        b: do if (!(_[2894] & 4)) {
            r = _[2789] | 0;
            c: do if (r) {
                e = 11580;
                while(1){
                    $ = _[e >> 2] | 0;
                    if ($ >>> 0 <= r >>> 0 ? ((h = (e + 4) | 0), (($ + (_[h >> 2] | 0)) | 0) >>> 0 > r >>> 0) : 0) break;
                    $ = _[(e + 8) >> 2] | 0;
                    if (!$) {
                        y = 118;
                        break c;
                    } else e = $;
                }
                n = (t - u) & i;
                if (n >>> 0 < 2147483647) {
                    $ = CY(n | 0) | 0;
                    if (($ | 0) == (((_[e >> 2] | 0) + (_[h >> 2] | 0)) | 0)) {
                        if (($ | 0) != (-1 | 0)) {
                            u = n;
                            t = $;
                            y = 135;
                            break b;
                        }
                    } else {
                        e = $;
                        y = 126;
                    }
                } else n = 0;
            } else y = 118;
            while (0)
            do if ((y | 0) == 118) {
                r = CY(0) | 0;
                if ((r | 0) != (-1 | 0) ? ((n = r), (b = _[2902] | 0), (k = (b + -1) | 0), (n = ((((k & n) | 0) == 0 ? 0 : (((k + n) & (0 - b)) - n) | 0) + c) | 0), (b = _[2891] | 0), (k = (n + b) | 0), (n >>> 0 > l >>> 0) & (n >>> 0 < 2147483647)) : 0) {
                    h = _[2893] | 0;
                    if (h | 0 ? (k >>> 0 <= b >>> 0) | (k >>> 0 > h >>> 0) : 0) {
                        n = 0;
                        break;
                    }
                    $ = CY(n | 0) | 0;
                    if (($ | 0) == (r | 0)) {
                        u = n;
                        t = r;
                        y = 135;
                        break b;
                    } else {
                        e = $;
                        y = 126;
                    }
                } else n = 0;
            }
            while (0)
            do if ((y | 0) == 126) {
                r = (0 - n) | 0;
                if (!((f >>> 0 > n >>> 0) & ((n >>> 0 < 2147483647) & ((e | 0) != (-1 | 0))))) if ((e | 0) == (-1 | 0)) {
                    n = 0;
                    break;
                } else {
                    u = n;
                    t = e;
                    y = 135;
                    break b;
                }
                $ = _[2903] | 0;
                $ = (o - n + $) & (0 - $);
                if ($ >>> 0 >= 2147483647) {
                    u = n;
                    t = e;
                    y = 135;
                    break b;
                }
                if ((CY($ | 0) | 0) == (-1 | 0)) {
                    CY(r | 0) | 0;
                    n = 0;
                    break;
                } else {
                    u = ($ + n) | 0;
                    t = e;
                    y = 135;
                    break b;
                }
            }
            while (0)
            _[2894] = _[2894] | 4;
            y = 133;
        } else {
            n = 0;
            y = 133;
        }
        while (0)
        if (((y | 0) == 133 ? c >>> 0 < 2147483647 : 0) ? ((m = CY(c | 0) | 0), (h = CY(0) | 0), (d = (h - m) | 0), (w = d >>> 0 > ((l + 40) | 0) >>> 0), !(((m | 0) == (-1 | 0)) | (w ^ 1) | (((m >>> 0 < h >>> 0) & (((m | 0) != (-1 | 0)) & ((h | 0) != (-1 | 0)))) ^ 1))) : 0) {
            u = w ? d : n;
            t = m;
            y = 135;
        }
        if ((y | 0) == 135) {
            n = ((_[2891] | 0) + u) | 0;
            _[2891] = n;
            if (n >>> 0 > (_[2892] | 0) >>> 0) _[2892] = n;
            o = _[2789] | 0;
            do if (o) {
                n = 11580;
                while(1){
                    $ = _[n >> 2] | 0;
                    r = (n + 4) | 0;
                    e = _[r >> 2] | 0;
                    if ((t | 0) == (($ + e) | 0)) {
                        y = 145;
                        break;
                    }
                    i = _[(n + 8) >> 2] | 0;
                    if (!i) break;
                    else n = i;
                }
                if (((y | 0) == 145 ? ((_[(n + 12) >> 2] & 8) | 0) == 0 : 0) ? (o >>> 0 < t >>> 0) & (o >>> 0 >= $ >>> 0) : 0) {
                    _[r >> 2] = e + u;
                    p = (o + 8) | 0;
                    p = ((p & 7) | 0) == 0 ? 0 : (0 - p) & 7;
                    y = (o + p) | 0;
                    p = ((_[2786] | 0) + (u - p)) | 0;
                    _[2789] = y;
                    _[2786] = p;
                    _[(y + 4) >> 2] = p | 1;
                    _[(y + p + 4) >> 2] = 40;
                    _[2790] = _[2905];
                    break;
                }
                if (t >>> 0 < (_[2787] | 0) >>> 0) _[2787] = t;
                r = (t + u) | 0;
                n = 11580;
                while(1){
                    if ((_[n >> 2] | 0) == (r | 0)) {
                        y = 153;
                        break;
                    }
                    $ = _[(n + 8) >> 2] | 0;
                    if (!$) break;
                    else n = $;
                }
                if ((y | 0) == 153 ? ((_[(n + 12) >> 2] & 8) | 0) == 0 : 0) {
                    _[n >> 2] = t;
                    a = (n + 4) | 0;
                    _[a >> 2] = (_[a >> 2] | 0) + u;
                    a = (t + 8) | 0;
                    a = (t + (((a & 7) | 0) == 0 ? 0 : (0 - a) & 7)) | 0;
                    n = (r + 8) | 0;
                    n = (r + (((n & 7) | 0) == 0 ? 0 : (0 - n) & 7)) | 0;
                    c = (a + l) | 0;
                    f = (n - a - l) | 0;
                    _[(a + 4) >> 2] = l | 3;
                    do if ((n | 0) != (o | 0)) {
                        if ((n | 0) == (_[2788] | 0)) {
                            p = ((_[2785] | 0) + f) | 0;
                            _[2785] = p;
                            _[2788] = c;
                            _[(c + 4) >> 2] = p | 1;
                            _[(c + p) >> 2] = p;
                            break;
                        }
                        $ = _[(n + 4) >> 2] | 0;
                        if ((($ & 3) | 0) == 1) {
                            u = $ & -8;
                            e = $ >>> 3;
                            d: do if ($ >>> 0 < 256) {
                                $ = _[(n + 8) >> 2] | 0;
                                r = _[(n + 12) >> 2] | 0;
                                if ((r | 0) == ($ | 0)) {
                                    _[2783] = _[2783] & ~(1 << e);
                                    break;
                                } else {
                                    _[($ + 12) >> 2] = r;
                                    _[(r + 8) >> 2] = $;
                                    break;
                                }
                            } else {
                                t = _[(n + 24) >> 2] | 0;
                                $ = _[(n + 12) >> 2] | 0;
                                do if (($ | 0) == (n | 0)) {
                                    e = (n + 16) | 0;
                                    r = (e + 4) | 0;
                                    $ = _[r >> 2] | 0;
                                    if (!$) {
                                        $ = _[e >> 2] | 0;
                                        if (!$) {
                                            $ = 0;
                                            break;
                                        } else r = e;
                                    }
                                    while(1){
                                        e = ($ + 20) | 0;
                                        i = _[e >> 2] | 0;
                                        if (i | 0) {
                                            $ = i;
                                            r = e;
                                            continue;
                                        }
                                        e = ($ + 16) | 0;
                                        i = _[e >> 2] | 0;
                                        if (!i) break;
                                        else {
                                            $ = i;
                                            r = e;
                                        }
                                    }
                                    _[r >> 2] = 0;
                                } else {
                                    p = _[(n + 8) >> 2] | 0;
                                    _[(p + 12) >> 2] = $;
                                    _[($ + 8) >> 2] = p;
                                }
                                while (0)
                                if (!t) break;
                                r = _[(n + 28) >> 2] | 0;
                                e = (11436 + (r << 2)) | 0;
                                do if ((n | 0) != (_[e >> 2] | 0)) {
                                    _[(t + 16 + ((((_[(t + 16) >> 2] | 0) != (n | 0)) & 1) << 2)) >> 2] = $;
                                    if (!$) break d;
                                } else {
                                    _[e >> 2] = $;
                                    if ($ | 0) break;
                                    _[2784] = _[2784] & ~(1 << r);
                                    break d;
                                }
                                while (0)
                                _[($ + 24) >> 2] = t;
                                r = (n + 16) | 0;
                                e = _[r >> 2] | 0;
                                if (e | 0) {
                                    _[($ + 16) >> 2] = e;
                                    _[(e + 24) >> 2] = $;
                                }
                                r = _[(r + 4) >> 2] | 0;
                                if (!r) break;
                                _[($ + 20) >> 2] = r;
                                _[(r + 24) >> 2] = $;
                            }
                            while (0)
                            n = (n + u) | 0;
                            i = (u + f) | 0;
                        } else i = f;
                        n = (n + 4) | 0;
                        _[n >> 2] = _[n >> 2] & -2;
                        _[(c + 4) >> 2] = i | 1;
                        _[(c + i) >> 2] = i;
                        n = i >>> 3;
                        if (i >>> 0 < 256) {
                            r = (11172 + ((n << 1) << 2)) | 0;
                            $ = _[2783] | 0;
                            n = 1 << n;
                            if (!($ & n)) {
                                _[2783] = $ | n;
                                n = r;
                                $ = (r + 8) | 0;
                            } else {
                                $ = (r + 8) | 0;
                                n = _[$ >> 2] | 0;
                            }
                            _[$ >> 2] = c;
                            _[(n + 12) >> 2] = c;
                            _[(c + 8) >> 2] = n;
                            _[(c + 12) >> 2] = r;
                            break;
                        }
                        n = i >>> 8;
                        do if (!n) n = 0;
                        else {
                            if (i >>> 0 > 16777215) {
                                n = 31;
                                break;
                            }
                            y = (((n + 1048320) | 0) >>> 16) & 8;
                            p = n << y;
                            m = (((p + 520192) | 0) >>> 16) & 4;
                            p = p << m;
                            n = (((p + 245760) | 0) >>> 16) & 2;
                            n = (14 - (m | y | n) + ((p << n) >>> 15)) | 0;
                            n = ((i >>> ((n + 7) | 0)) & 1) | (n << 1);
                        }
                        while (0)
                        e = (11436 + (n << 2)) | 0;
                        _[(c + 28) >> 2] = n;
                        $ = (c + 16) | 0;
                        _[($ + 4) >> 2] = 0;
                        _[$ >> 2] = 0;
                        $ = _[2784] | 0;
                        r = 1 << n;
                        if (!($ & r)) {
                            _[2784] = $ | r;
                            _[e >> 2] = c;
                            _[(c + 24) >> 2] = e;
                            _[(c + 12) >> 2] = c;
                            _[(c + 8) >> 2] = c;
                            break;
                        }
                        $ = i << ((n | 0) == 31 ? 0 : (25 - (n >>> 1)) | 0);
                        r = _[e >> 2] | 0;
                        while(1){
                            if (((_[(r + 4) >> 2] & -8) | 0) == (i | 0)) {
                                y = 194;
                                break;
                            }
                            e = (r + 16 + (($ >>> 31) << 2)) | 0;
                            n = _[e >> 2] | 0;
                            if (!n) {
                                y = 193;
                                break;
                            } else {
                                $ = $ << 1;
                                r = n;
                            }
                        }
                        if ((y | 0) == 193) {
                            _[e >> 2] = c;
                            _[(c + 24) >> 2] = r;
                            _[(c + 12) >> 2] = c;
                            _[(c + 8) >> 2] = c;
                            break;
                        } else if ((y | 0) == 194) {
                            y = (r + 8) | 0;
                            p = _[y >> 2] | 0;
                            _[(p + 12) >> 2] = c;
                            _[y >> 2] = c;
                            _[(c + 8) >> 2] = p;
                            _[(c + 12) >> 2] = r;
                            _[(c + 24) >> 2] = 0;
                            break;
                        }
                    } else {
                        p = ((_[2786] | 0) + f) | 0;
                        _[2786] = p;
                        _[2789] = c;
                        _[(c + 4) >> 2] = p | 1;
                    }
                    while (0)
                    p = (a + 8) | 0;
                    s = C;
                    return p | 0;
                }
                n = 11580;
                while(1){
                    $ = _[n >> 2] | 0;
                    if ($ >>> 0 <= o >>> 0 ? ((p = ($ + (_[(n + 4) >> 2] | 0)) | 0), p >>> 0 > o >>> 0) : 0) break;
                    n = _[(n + 8) >> 2] | 0;
                }
                i = (p + -47) | 0;
                $ = (i + 8) | 0;
                $ = (i + ((($ & 7) | 0) == 0 ? 0 : (0 - $) & 7)) | 0;
                i = (o + 16) | 0;
                $ = $ >>> 0 < i >>> 0 ? o : $;
                n = ($ + 8) | 0;
                r = (t + 8) | 0;
                r = ((r & 7) | 0) == 0 ? 0 : (0 - r) & 7;
                y = (t + r) | 0;
                r = (u + -40 - r) | 0;
                _[2789] = y;
                _[2786] = r;
                _[(y + 4) >> 2] = r | 1;
                _[(y + r + 4) >> 2] = 40;
                _[2790] = _[2905];
                r = ($ + 4) | 0;
                _[r >> 2] = 27;
                _[n >> 2] = _[2895];
                _[(n + 4) >> 2] = _[2896];
                _[(n + 8) >> 2] = _[2897];
                _[(n + 12) >> 2] = _[2898];
                _[2895] = t;
                _[2896] = u;
                _[2898] = 0;
                _[2897] = n;
                n = ($ + 24) | 0;
                do {
                    y = n;
                    n = (n + 4) | 0;
                    _[n >> 2] = 7;
                }while (((y + 8) | 0) >>> 0 < p >>> 0)
                if (($ | 0) != (o | 0)) {
                    t = ($ - o) | 0;
                    _[r >> 2] = _[r >> 2] & -2;
                    _[(o + 4) >> 2] = t | 1;
                    _[$ >> 2] = t;
                    n = t >>> 3;
                    if (t >>> 0 < 256) {
                        r = (11172 + ((n << 1) << 2)) | 0;
                        $ = _[2783] | 0;
                        n = 1 << n;
                        if (!($ & n)) {
                            _[2783] = $ | n;
                            n = r;
                            $ = (r + 8) | 0;
                        } else {
                            $ = (r + 8) | 0;
                            n = _[$ >> 2] | 0;
                        }
                        _[$ >> 2] = o;
                        _[(n + 12) >> 2] = o;
                        _[(o + 8) >> 2] = n;
                        _[(o + 12) >> 2] = r;
                        break;
                    }
                    n = t >>> 8;
                    if (n) {
                        if (t >>> 0 > 16777215) r = 31;
                        else {
                            y = (((n + 1048320) | 0) >>> 16) & 8;
                            p = n << y;
                            m = (((p + 520192) | 0) >>> 16) & 4;
                            p = p << m;
                            r = (((p + 245760) | 0) >>> 16) & 2;
                            r = (14 - (m | y | r) + ((p << r) >>> 15)) | 0;
                            r = ((t >>> ((r + 7) | 0)) & 1) | (r << 1);
                        }
                    } else r = 0;
                    e = (11436 + (r << 2)) | 0;
                    _[(o + 28) >> 2] = r;
                    _[(o + 20) >> 2] = 0;
                    _[i >> 2] = 0;
                    n = _[2784] | 0;
                    $ = 1 << r;
                    if (!(n & $)) {
                        _[2784] = n | $;
                        _[e >> 2] = o;
                        _[(o + 24) >> 2] = e;
                        _[(o + 12) >> 2] = o;
                        _[(o + 8) >> 2] = o;
                        break;
                    }
                    $ = t << ((r | 0) == 31 ? 0 : (25 - (r >>> 1)) | 0);
                    r = _[e >> 2] | 0;
                    while(1){
                        if (((_[(r + 4) >> 2] & -8) | 0) == (t | 0)) {
                            y = 216;
                            break;
                        }
                        e = (r + 16 + (($ >>> 31) << 2)) | 0;
                        n = _[e >> 2] | 0;
                        if (!n) {
                            y = 215;
                            break;
                        } else {
                            $ = $ << 1;
                            r = n;
                        }
                    }
                    if ((y | 0) == 215) {
                        _[e >> 2] = o;
                        _[(o + 24) >> 2] = r;
                        _[(o + 12) >> 2] = o;
                        _[(o + 8) >> 2] = o;
                        break;
                    } else if ((y | 0) == 216) {
                        y = (r + 8) | 0;
                        p = _[y >> 2] | 0;
                        _[(p + 12) >> 2] = o;
                        _[y >> 2] = o;
                        _[(o + 8) >> 2] = p;
                        _[(o + 12) >> 2] = r;
                        _[(o + 24) >> 2] = 0;
                        break;
                    }
                }
            } else {
                p = _[2787] | 0;
                if (((p | 0) == 0) | (t >>> 0 < p >>> 0)) _[2787] = t;
                _[2895] = t;
                _[2896] = u;
                _[2898] = 0;
                _[2792] = _[2901];
                _[2791] = -1;
                n = 0;
                do {
                    p = (11172 + ((n << 1) << 2)) | 0;
                    _[(p + 12) >> 2] = p;
                    _[(p + 8) >> 2] = p;
                    n = (n + 1) | 0;
                }while ((n | 0) != 32)
                p = (t + 8) | 0;
                p = ((p & 7) | 0) == 0 ? 0 : (0 - p) & 7;
                y = (t + p) | 0;
                p = (u + -40 - p) | 0;
                _[2789] = y;
                _[2786] = p;
                _[(y + 4) >> 2] = p | 1;
                _[(y + p + 4) >> 2] = 40;
                _[2790] = _[2905];
            }
            while (0)
            n = _[2786] | 0;
            if (n >>> 0 > l >>> 0) {
                m = (n - l) | 0;
                _[2786] = m;
                p = _[2789] | 0;
                y = (p + l) | 0;
                _[2789] = y;
                _[(y + 4) >> 2] = m | 1;
                _[(p + 4) >> 2] = l | 3;
                p = (p + 8) | 0;
                s = C;
                return p | 0;
            }
        }
        _[(pY() | 0) >> 2] = 12;
        p = 0;
        s = C;
        return p | 0;
    }
    function pO($) {
        $ = $ | 0;
        var n = 0, r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, o = 0;
        if (!$) return;
        r = ($ + -8) | 0;
        i = _[2787] | 0;
        $ = _[($ + -4) >> 2] | 0;
        n = $ & -8;
        o = (r + n) | 0;
        do if (!($ & 1)) {
            e = _[r >> 2] | 0;
            if (!($ & 3)) return;
            u = (r + (0 - e)) | 0;
            t = (e + n) | 0;
            if (u >>> 0 < i >>> 0) return;
            if ((u | 0) == (_[2788] | 0)) {
                $ = (o + 4) | 0;
                n = _[$ >> 2] | 0;
                if (((n & 3) | 0) != 3) {
                    f = u;
                    n = t;
                    break;
                }
                _[2785] = t;
                _[$ >> 2] = n & -2;
                _[(u + 4) >> 2] = t | 1;
                _[(u + t) >> 2] = t;
                return;
            }
            r = e >>> 3;
            if (e >>> 0 < 256) {
                $ = _[(u + 8) >> 2] | 0;
                n = _[(u + 12) >> 2] | 0;
                if ((n | 0) == ($ | 0)) {
                    _[2783] = _[2783] & ~(1 << r);
                    f = u;
                    n = t;
                    break;
                } else {
                    _[($ + 12) >> 2] = n;
                    _[(n + 8) >> 2] = $;
                    f = u;
                    n = t;
                    break;
                }
            }
            i = _[(u + 24) >> 2] | 0;
            $ = _[(u + 12) >> 2] | 0;
            do if (($ | 0) == (u | 0)) {
                r = (u + 16) | 0;
                n = (r + 4) | 0;
                $ = _[n >> 2] | 0;
                if (!$) {
                    $ = _[r >> 2] | 0;
                    if (!$) {
                        $ = 0;
                        break;
                    } else n = r;
                }
                while(1){
                    r = ($ + 20) | 0;
                    e = _[r >> 2] | 0;
                    if (e | 0) {
                        $ = e;
                        n = r;
                        continue;
                    }
                    r = ($ + 16) | 0;
                    e = _[r >> 2] | 0;
                    if (!e) break;
                    else {
                        $ = e;
                        n = r;
                    }
                }
                _[n >> 2] = 0;
            } else {
                f = _[(u + 8) >> 2] | 0;
                _[(f + 12) >> 2] = $;
                _[($ + 8) >> 2] = f;
            }
            while (0)
            if (i) {
                n = _[(u + 28) >> 2] | 0;
                r = (11436 + (n << 2)) | 0;
                if ((u | 0) == (_[r >> 2] | 0)) {
                    _[r >> 2] = $;
                    if (!$) {
                        _[2784] = _[2784] & ~(1 << n);
                        f = u;
                        n = t;
                        break;
                    }
                } else {
                    _[(i + 16 + ((((_[(i + 16) >> 2] | 0) != (u | 0)) & 1) << 2)) >> 2] = $;
                    if (!$) {
                        f = u;
                        n = t;
                        break;
                    }
                }
                _[($ + 24) >> 2] = i;
                n = (u + 16) | 0;
                r = _[n >> 2] | 0;
                if (r | 0) {
                    _[($ + 16) >> 2] = r;
                    _[(r + 24) >> 2] = $;
                }
                n = _[(n + 4) >> 2] | 0;
                if (n) {
                    _[($ + 20) >> 2] = n;
                    _[(n + 24) >> 2] = $;
                    f = u;
                    n = t;
                } else {
                    f = u;
                    n = t;
                }
            } else {
                f = u;
                n = t;
            }
        } else {
            f = r;
            u = r;
        }
        while (0)
        if (u >>> 0 >= o >>> 0) return;
        $ = (o + 4) | 0;
        e = _[$ >> 2] | 0;
        if (!(e & 1)) return;
        if (!(e & 2)) {
            $ = _[2788] | 0;
            if ((o | 0) == (_[2789] | 0)) {
                o = ((_[2786] | 0) + n) | 0;
                _[2786] = o;
                _[2789] = f;
                _[(f + 4) >> 2] = o | 1;
                if ((f | 0) != ($ | 0)) return;
                _[2788] = 0;
                _[2785] = 0;
                return;
            }
            if ((o | 0) == ($ | 0)) {
                o = ((_[2785] | 0) + n) | 0;
                _[2785] = o;
                _[2788] = u;
                _[(f + 4) >> 2] = o | 1;
                _[(u + o) >> 2] = o;
                return;
            }
            i = ((e & -8) + n) | 0;
            r = e >>> 3;
            do if (e >>> 0 < 256) {
                n = _[(o + 8) >> 2] | 0;
                $ = _[(o + 12) >> 2] | 0;
                if (($ | 0) == (n | 0)) {
                    _[2783] = _[2783] & ~(1 << r);
                    break;
                } else {
                    _[(n + 12) >> 2] = $;
                    _[($ + 8) >> 2] = n;
                    break;
                }
            } else {
                t = _[(o + 24) >> 2] | 0;
                $ = _[(o + 12) >> 2] | 0;
                do if (($ | 0) == (o | 0)) {
                    r = (o + 16) | 0;
                    n = (r + 4) | 0;
                    $ = _[n >> 2] | 0;
                    if (!$) {
                        $ = _[r >> 2] | 0;
                        if (!$) {
                            r = 0;
                            break;
                        } else n = r;
                    }
                    while(1){
                        r = ($ + 20) | 0;
                        e = _[r >> 2] | 0;
                        if (e | 0) {
                            $ = e;
                            n = r;
                            continue;
                        }
                        r = ($ + 16) | 0;
                        e = _[r >> 2] | 0;
                        if (!e) break;
                        else {
                            $ = e;
                            n = r;
                        }
                    }
                    _[n >> 2] = 0;
                    r = $;
                } else {
                    r = _[(o + 8) >> 2] | 0;
                    _[(r + 12) >> 2] = $;
                    _[($ + 8) >> 2] = r;
                    r = $;
                }
                while (0)
                if (t | 0) {
                    $ = _[(o + 28) >> 2] | 0;
                    n = (11436 + ($ << 2)) | 0;
                    if ((o | 0) == (_[n >> 2] | 0)) {
                        _[n >> 2] = r;
                        if (!r) {
                            _[2784] = _[2784] & ~(1 << $);
                            break;
                        }
                    } else {
                        _[(t + 16 + ((((_[(t + 16) >> 2] | 0) != (o | 0)) & 1) << 2)) >> 2] = r;
                        if (!r) break;
                    }
                    _[(r + 24) >> 2] = t;
                    $ = (o + 16) | 0;
                    n = _[$ >> 2] | 0;
                    if (n | 0) {
                        _[(r + 16) >> 2] = n;
                        _[(n + 24) >> 2] = r;
                    }
                    $ = _[($ + 4) >> 2] | 0;
                    if ($ | 0) {
                        _[(r + 20) >> 2] = $;
                        _[($ + 24) >> 2] = r;
                    }
                }
            }
            while (0)
            _[(f + 4) >> 2] = i | 1;
            _[(u + i) >> 2] = i;
            if ((f | 0) == (_[2788] | 0)) {
                _[2785] = i;
                return;
            }
        } else {
            _[$ >> 2] = e & -2;
            _[(f + 4) >> 2] = n | 1;
            _[(u + n) >> 2] = n;
            i = n;
        }
        $ = i >>> 3;
        if (i >>> 0 < 256) {
            r = (11172 + (($ << 1) << 2)) | 0;
            n = _[2783] | 0;
            $ = 1 << $;
            if (!(n & $)) {
                _[2783] = n | $;
                $ = r;
                n = (r + 8) | 0;
            } else {
                n = (r + 8) | 0;
                $ = _[n >> 2] | 0;
            }
            _[n >> 2] = f;
            _[($ + 12) >> 2] = f;
            _[(f + 8) >> 2] = $;
            _[(f + 12) >> 2] = r;
            return;
        }
        $ = i >>> 8;
        if ($) {
            if (i >>> 0 > 16777215) $ = 31;
            else {
                u = ((($ + 1048320) | 0) >>> 16) & 8;
                o = $ << u;
                t = (((o + 520192) | 0) >>> 16) & 4;
                o = o << t;
                $ = (((o + 245760) | 0) >>> 16) & 2;
                $ = (14 - (t | u | $) + ((o << $) >>> 15)) | 0;
                $ = ((i >>> (($ + 7) | 0)) & 1) | ($ << 1);
            }
        } else $ = 0;
        e = (11436 + ($ << 2)) | 0;
        _[(f + 28) >> 2] = $;
        _[(f + 20) >> 2] = 0;
        _[(f + 16) >> 2] = 0;
        n = _[2784] | 0;
        r = 1 << $;
        do if (n & r) {
            n = i << (($ | 0) == 31 ? 0 : (25 - ($ >>> 1)) | 0);
            r = _[e >> 2] | 0;
            while(1){
                if (((_[(r + 4) >> 2] & -8) | 0) == (i | 0)) {
                    $ = 73;
                    break;
                }
                e = (r + 16 + ((n >>> 31) << 2)) | 0;
                $ = _[e >> 2] | 0;
                if (!$) {
                    $ = 72;
                    break;
                } else {
                    n = n << 1;
                    r = $;
                }
            }
            if (($ | 0) == 72) {
                _[e >> 2] = f;
                _[(f + 24) >> 2] = r;
                _[(f + 12) >> 2] = f;
                _[(f + 8) >> 2] = f;
                break;
            } else if (($ | 0) == 73) {
                u = (r + 8) | 0;
                o = _[u >> 2] | 0;
                _[(o + 12) >> 2] = f;
                _[u >> 2] = f;
                _[(f + 8) >> 2] = o;
                _[(f + 12) >> 2] = r;
                _[(f + 24) >> 2] = 0;
                break;
            }
        } else {
            _[2784] = n | r;
            _[e >> 2] = f;
            _[(f + 24) >> 2] = e;
            _[(f + 12) >> 2] = f;
            _[(f + 8) >> 2] = f;
        }
        while (0)
        o = ((_[2791] | 0) + -1) | 0;
        _[2791] = o;
        if (!o) $ = 11588;
        else return;
        while(1){
            $ = _[$ >> 2] | 0;
            if (!$) break;
            else $ = ($ + 8) | 0;
        }
        _[2791] = -1;
        return;
    }
    function pP() {
        return 11628;
    }
    function pE($) {
        $ = $ | 0;
        var n = 0, r = 0;
        n = s;
        s = (s + 16) | 0;
        r = n;
        _[r >> 2] = pz(_[($ + 60) >> 2] | 0) | 0;
        $ = pR($Q(6, r | 0) | 0) | 0;
        s = n;
        return $ | 0;
    }
    function pG($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0;
        l = s;
        s = (s + 48) | 0;
        c = (l + 16) | 0;
        t = l;
        i = (l + 32) | 0;
        f = ($ + 28) | 0;
        e = _[f >> 2] | 0;
        _[i >> 2] = e;
        o = ($ + 20) | 0;
        e = ((_[o >> 2] | 0) - e) | 0;
        _[(i + 4) >> 2] = e;
        _[(i + 8) >> 2] = n;
        _[(i + 12) >> 2] = r;
        e = (e + r) | 0;
        u = ($ + 60) | 0;
        _[t >> 2] = _[u >> 2];
        _[(t + 4) >> 2] = i;
        _[(t + 8) >> 2] = 2;
        t = pR($9(146, t | 0) | 0) | 0;
        a: do if ((e | 0) != (t | 0)) {
            n = 2;
            while(1){
                if ((t | 0) < 0) break;
                e = (e - t) | 0;
                b = _[(i + 4) >> 2] | 0;
                v = t >>> 0 > b >>> 0;
                i = v ? (i + 8) | 0 : i;
                n = (((v << 31) >> 31) + n) | 0;
                b = (t - (v ? b : 0)) | 0;
                _[i >> 2] = (_[i >> 2] | 0) + b;
                v = (i + 4) | 0;
                _[v >> 2] = (_[v >> 2] | 0) - b;
                _[c >> 2] = _[u >> 2];
                _[(c + 4) >> 2] = i;
                _[(c + 8) >> 2] = n;
                t = pR($9(146, c | 0) | 0) | 0;
                if ((e | 0) == (t | 0)) {
                    a = 3;
                    break a;
                }
            }
            _[($ + 16) >> 2] = 0;
            _[f >> 2] = 0;
            _[o >> 2] = 0;
            _[$ >> 2] = _[$ >> 2] | 32;
            if ((n | 0) == 2) r = 0;
            else r = (r - (_[(i + 4) >> 2] | 0)) | 0;
        } else a = 3;
        while (0)
        if ((a | 0) == 3) {
            b = _[($ + 44) >> 2] | 0;
            _[($ + 16) >> 2] = b + (_[($ + 48) >> 2] | 0);
            _[f >> 2] = b;
            _[o >> 2] = b;
        }
        s = l;
        return r | 0;
    }
    function pB($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0;
        i = s;
        s = (s + 32) | 0;
        t = i;
        e = (i + 20) | 0;
        _[t >> 2] = _[($ + 60) >> 2];
        _[(t + 4) >> 2] = 0;
        _[(t + 8) >> 2] = n;
        _[(t + 12) >> 2] = e;
        _[(t + 16) >> 2] = r;
        if ((pR($W(140, t | 0) | 0) | 0) < 0) {
            _[e >> 2] = -1;
            $ = -1;
        } else $ = _[e >> 2] | 0;
        s = i;
        return $ | 0;
    }
    function pR($) {
        $ = $ | 0;
        if ($ >>> 0 > 4294963200) {
            _[(pY() | 0) >> 2] = 0 - $;
            $ = -1;
        }
        return $ | 0;
    }
    function pY() {
        return ((pU() | 0) + 64) | 0;
    }
    function pU() {
        return pj() | 0;
    }
    function pj() {
        return 2084;
    }
    function pz($) {
        $ = $ | 0;
        return $ | 0;
    }
    function pD($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, t = 0;
        t = s;
        s = (s + 32) | 0;
        i = t;
        _[($ + 36) >> 2] = 1;
        if (((_[$ >> 2] & 64) | 0) == 0 ? ((_[i >> 2] = _[($ + 60) >> 2]), (_[(i + 4) >> 2] = 21523), (_[(i + 8) >> 2] = t + 16), $z(54, i | 0) | 0) : 0) e[($ + 75) >> 0] = -1;
        i = pG($, n, r) | 0;
        s = t;
        return i | 0;
    }
    function pF($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, i = 0;
        r = e[$ >> 0] | 0;
        i = e[n >> 0] | 0;
        if ((r << 24) >> 24 == 0 ? 1 : (r << 24) >> 24 != (i << 24) >> 24) $ = i;
        else {
            do {
                $ = ($ + 1) | 0;
                n = (n + 1) | 0;
                r = e[$ >> 0] | 0;
                i = e[n >> 0] | 0;
            }while (!((r << 24) >> 24 == 0 ? 1 : (r << 24) >> 24 != (i << 24) >> 24))
            $ = i;
        }
        return ((r & 255) - ($ & 255)) | 0;
    }
    function pK($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, _ = 0;
        a: do if (!r) $ = 0;
        else {
            while(1){
                i = e[$ >> 0] | 0;
                _ = e[n >> 0] | 0;
                if ((i << 24) >> 24 != (_ << 24) >> 24) break;
                r = (r + -1) | 0;
                if (!r) {
                    $ = 0;
                    break a;
                } else {
                    $ = ($ + 1) | 0;
                    n = (n + 1) | 0;
                }
            }
            $ = ((i & 255) - (_ & 255)) | 0;
        }
        while (0)
        return $ | 0;
    }
    function pq($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, b = 0, k = 0, h = 0, d = 0;
        d = s;
        s = (s + 224) | 0;
        l = (d + 120) | 0;
        v = (d + 80) | 0;
        k = d;
        h = (d + 136) | 0;
        i = v;
        t = (i + 40) | 0;
        do {
            _[i >> 2] = 0;
            i = (i + 4) | 0;
        }while ((i | 0) < (t | 0))
        _[l >> 2] = _[r >> 2];
        if ((pH(0, n, l, k, v) | 0) < 0) r = -1;
        else {
            if ((_[($ + 76) >> 2] | 0) > -1) b = pX($) | 0;
            else b = 0;
            r = _[$ >> 2] | 0;
            a = r & 32;
            if ((e[($ + 74) >> 0] | 0) < 1) _[$ >> 2] = r & -33;
            i = ($ + 48) | 0;
            if (!(_[i >> 2] | 0)) {
                t = ($ + 44) | 0;
                u = _[t >> 2] | 0;
                _[t >> 2] = h;
                f = ($ + 28) | 0;
                _[f >> 2] = h;
                o = ($ + 20) | 0;
                _[o >> 2] = h;
                _[i >> 2] = 80;
                c = ($ + 16) | 0;
                _[c >> 2] = h + 80;
                r = pH($, n, l, k, v) | 0;
                if (u) {
                    MU[_[($ + 36) >> 2] & 7]($, 0, 0) | 0;
                    r = (_[o >> 2] | 0) == 0 ? -1 : r;
                    _[t >> 2] = u;
                    _[i >> 2] = 0;
                    _[c >> 2] = 0;
                    _[f >> 2] = 0;
                    _[o >> 2] = 0;
                }
            } else r = pH($, n, l, k, v) | 0;
            i = _[$ >> 2] | 0;
            _[$ >> 2] = i | a;
            if (b | 0) pZ($);
            r = ((i & 32) | 0) == 0 ? r : -1;
        }
        s = d;
        return r | 0;
    }
    function pH($, n, r, t, u) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        t = t | 0;
        u = u | 0;
        var f = 0, o = 0, a = 0, l = 0, v = 0, b = 0, k = 0, h = 0, d = 0, w = 0, m = 0, y = 0, p = 0, C = 0, M = 0, g = 0, A = 0, I = 0, S = 0, x = 0, N = 0, L = 0, O = 0;
        O = s;
        s = (s + 64) | 0;
        S = (O + 16) | 0;
        x = O;
        A = (O + 24) | 0;
        N = (O + 8) | 0;
        L = (O + 20) | 0;
        _[S >> 2] = n;
        C = ($ | 0) != 0;
        M = (A + 40) | 0;
        g = M;
        A = (A + 39) | 0;
        I = (N + 4) | 0;
        o = 0;
        f = 0;
        b = 0;
        a: while(1){
            do if ((f | 0) > -1) if ((o | 0) > ((2147483647 - f) | 0)) {
                _[(pY() | 0) >> 2] = 75;
                f = -1;
                break;
            } else {
                f = (o + f) | 0;
                break;
            }
            while (0)
            o = e[n >> 0] | 0;
            if (!((o << 24) >> 24)) {
                p = 87;
                break;
            } else a = n;
            b: while(1){
                switch((o << 24) >> 24){
                    case 37:
                        {
                            o = a;
                            p = 9;
                            break b;
                        }
                    case 0:
                        {
                            o = a;
                            break b;
                        }
                    default:
                        {}
                }
                y = (a + 1) | 0;
                _[S >> 2] = y;
                o = e[y >> 0] | 0;
                a = y;
            }
            c: do if ((p | 0) == 9) while(1){
                p = 0;
                if ((e[(a + 1) >> 0] | 0) != 37) break c;
                o = (o + 1) | 0;
                a = (a + 2) | 0;
                _[S >> 2] = a;
                if ((e[a >> 0] | 0) == 37) p = 9;
                else break;
            }
            while (0)
            o = (o - n) | 0;
            if (C) pJ($, n, o);
            if (o | 0) {
                n = a;
                continue;
            }
            l = (a + 1) | 0;
            o = ((e[l >> 0] | 0) + -48) | 0;
            if (o >>> 0 < 10) {
                y = (e[(a + 2) >> 0] | 0) == 36;
                m = y ? o : -1;
                b = y ? 1 : b;
                l = y ? (a + 3) | 0 : l;
            } else m = -1;
            _[S >> 2] = l;
            o = e[l >> 0] | 0;
            a = (((o << 24) >> 24) + -32) | 0;
            d: do if (a >>> 0 < 32) {
                v = 0;
                k = o;
                while(1){
                    o = 1 << a;
                    if (!(o & 75913)) {
                        o = k;
                        break d;
                    }
                    v = o | v;
                    l = (l + 1) | 0;
                    _[S >> 2] = l;
                    o = e[l >> 0] | 0;
                    a = (((o << 24) >> 24) + -32) | 0;
                    if (a >>> 0 >= 32) break;
                    else k = o;
                }
            } else v = 0;
            while (0)
            if ((o << 24) >> 24 == 42) {
                a = (l + 1) | 0;
                o = ((e[a >> 0] | 0) + -48) | 0;
                if (o >>> 0 < 10 ? (e[(l + 2) >> 0] | 0) == 36 : 0) {
                    _[(u + (o << 2)) >> 2] = 10;
                    o = _[(t + (((e[a >> 0] | 0) + -48) << 3)) >> 2] | 0;
                    b = 1;
                    l = (l + 3) | 0;
                } else {
                    if (b | 0) {
                        f = -1;
                        break;
                    }
                    if (C) {
                        b = ((_[r >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                        o = _[b >> 2] | 0;
                        _[r >> 2] = b + 4;
                        b = 0;
                        l = a;
                    } else {
                        o = 0;
                        b = 0;
                        l = a;
                    }
                }
                _[S >> 2] = l;
                y = (o | 0) < 0;
                o = y ? (0 - o) | 0 : o;
                v = y ? v | 8192 : v;
            } else {
                o = pQ(S) | 0;
                if ((o | 0) < 0) {
                    f = -1;
                    break;
                }
                l = _[S >> 2] | 0;
            }
            do if ((e[l >> 0] | 0) == 46) {
                if ((e[(l + 1) >> 0] | 0) != 42) {
                    _[S >> 2] = l + 1;
                    a = pQ(S) | 0;
                    l = _[S >> 2] | 0;
                    break;
                }
                k = (l + 2) | 0;
                a = ((e[k >> 0] | 0) + -48) | 0;
                if (a >>> 0 < 10 ? (e[(l + 3) >> 0] | 0) == 36 : 0) {
                    _[(u + (a << 2)) >> 2] = 10;
                    a = _[(t + (((e[k >> 0] | 0) + -48) << 3)) >> 2] | 0;
                    l = (l + 4) | 0;
                    _[S >> 2] = l;
                    break;
                }
                if (b | 0) {
                    f = -1;
                    break a;
                }
                if (C) {
                    y = ((_[r >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    a = _[y >> 2] | 0;
                    _[r >> 2] = y + 4;
                } else a = 0;
                _[S >> 2] = k;
                l = k;
            } else a = -1;
            while (0)
            w = 0;
            while(1){
                if ((((e[l >> 0] | 0) + -65) | 0) >>> 0 > 57) {
                    f = -1;
                    break a;
                }
                y = (l + 1) | 0;
                _[S >> 2] = y;
                k = e[((e[l >> 0] | 0) + -65 + (5178 + ((w * 58) | 0))) >> 0] | 0;
                h = k & 255;
                if (((h + -1) | 0) >>> 0 < 8) {
                    w = h;
                    l = y;
                } else break;
            }
            if (!((k << 24) >> 24)) {
                f = -1;
                break;
            }
            d = (m | 0) > -1;
            do if ((k << 24) >> 24 == 19) {
                if (d) {
                    f = -1;
                    break a;
                } else p = 49;
            } else {
                if (d) {
                    _[(u + (m << 2)) >> 2] = h;
                    d = (t + (m << 3)) | 0;
                    m = _[(d + 4) >> 2] | 0;
                    p = x;
                    _[p >> 2] = _[d >> 2];
                    _[(p + 4) >> 2] = m;
                    p = 49;
                    break;
                }
                if (!C) {
                    f = 0;
                    break a;
                }
                pV(x, h, r);
            }
            while (0)
            if ((p | 0) == 49 ? ((p = 0), !C) : 0) {
                o = 0;
                n = y;
                continue;
            }
            l = e[l >> 0] | 0;
            l = ((w | 0) != 0) & (((l & 15) | 0) == 3) ? l & -33 : l;
            d = v & -65537;
            m = ((v & 8192) | 0) == 0 ? v : d;
            e: do switch(l | 0){
                case 110:
                    switch(((w & 255) << 24) >> 24){
                        case 0:
                            {
                                _[_[x >> 2] >> 2] = f;
                                o = 0;
                                n = y;
                                continue a;
                            }
                        case 1:
                            {
                                _[_[x >> 2] >> 2] = f;
                                o = 0;
                                n = y;
                                continue a;
                            }
                        case 2:
                            {
                                o = _[x >> 2] | 0;
                                _[o >> 2] = f;
                                _[(o + 4) >> 2] = (((f | 0) < 0) << 31) >> 31;
                                o = 0;
                                n = y;
                                continue a;
                            }
                        case 3:
                            {
                                i[_[x >> 2] >> 1] = f;
                                o = 0;
                                n = y;
                                continue a;
                            }
                        case 4:
                            {
                                e[_[x >> 2] >> 0] = f;
                                o = 0;
                                n = y;
                                continue a;
                            }
                        case 6:
                            {
                                _[_[x >> 2] >> 2] = f;
                                o = 0;
                                n = y;
                                continue a;
                            }
                        case 7:
                            {
                                o = _[x >> 2] | 0;
                                _[o >> 2] = f;
                                _[(o + 4) >> 2] = (((f | 0) < 0) << 31) >> 31;
                                o = 0;
                                n = y;
                                continue a;
                            }
                        default:
                            {
                                o = 0;
                                n = y;
                                continue a;
                            }
                    }
                case 112:
                    {
                        l = 120;
                        a = a >>> 0 > 8 ? a : 8;
                        n = m | 8;
                        p = 61;
                        break;
                    }
                case 88:
                case 120:
                    {
                        n = m;
                        p = 61;
                        break;
                    }
                case 111:
                    {
                        l = x;
                        n = _[l >> 2] | 0;
                        l = _[(l + 4) >> 2] | 0;
                        h = p9(n, l, M) | 0;
                        d = (g - h) | 0;
                        v = 0;
                        k = 5642;
                        a = (((m & 8) | 0) == 0) | ((a | 0) > (d | 0)) ? a : (d + 1) | 0;
                        d = m;
                        p = 67;
                        break;
                    }
                case 105:
                case 100:
                    {
                        l = x;
                        n = _[l >> 2] | 0;
                        l = _[(l + 4) >> 2] | 0;
                        if ((l | 0) < 0) {
                            n = Cx(0, 0, n | 0, l | 0) | 0;
                            l = T;
                            v = x;
                            _[v >> 2] = n;
                            _[(v + 4) >> 2] = l;
                            v = 1;
                            k = 5642;
                            p = 66;
                            break e;
                        } else {
                            v = (((m & 2049) | 0) != 0) & 1;
                            k = ((m & 2048) | 0) == 0 ? ((m & 1) | 0) == 0 ? 5642 : 5644 : 5643;
                            p = 66;
                            break e;
                        }
                    }
                case 117:
                    {
                        l = x;
                        v = 0;
                        k = 5642;
                        n = _[l >> 2] | 0;
                        l = _[(l + 4) >> 2] | 0;
                        p = 66;
                        break;
                    }
                case 99:
                    {
                        e[A >> 0] = _[x >> 2];
                        n = A;
                        v = 0;
                        k = 5642;
                        h = M;
                        l = 1;
                        a = d;
                        break;
                    }
                case 109:
                    {
                        l = C0(_[(pY() | 0) >> 2] | 0) | 0;
                        p = 71;
                        break;
                    }
                case 115:
                    {
                        l = _[x >> 2] | 0;
                        l = l | 0 ? l : 5652;
                        p = 71;
                        break;
                    }
                case 67:
                    {
                        _[N >> 2] = _[x >> 2];
                        _[I >> 2] = 0;
                        _[x >> 2] = N;
                        h = -1;
                        l = N;
                        p = 75;
                        break;
                    }
                case 83:
                    {
                        n = _[x >> 2] | 0;
                        if (!a) {
                            Cr($, 32, o, 0, m);
                            n = 0;
                            p = 84;
                        } else {
                            h = a;
                            l = n;
                            p = 75;
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
                        o = Ci($, +c[x >> 3], o, a, m, l) | 0;
                        n = y;
                        continue a;
                    }
                default:
                    {
                        v = 0;
                        k = 5642;
                        h = M;
                        l = a;
                        a = m;
                    }
            }
            while (0)
            f: do if ((p | 0) == 61) {
                m = x;
                w = _[m >> 2] | 0;
                m = _[(m + 4) >> 2] | 0;
                h = pW(w, m, M, l & 32) | 0;
                k = (((n & 8) | 0) == 0) | (((w | 0) == 0) & ((m | 0) == 0));
                v = k ? 0 : 2;
                k = k ? 5642 : (5642 + (l >> 4)) | 0;
                d = n;
                n = w;
                l = m;
                p = 67;
            } else if ((p | 0) == 66) {
                h = C$(n, l, M) | 0;
                d = m;
                p = 67;
            } else if ((p | 0) == 71) {
                p = 0;
                m = Cn(l, 0, a) | 0;
                w = (m | 0) == 0;
                n = l;
                v = 0;
                k = 5642;
                h = w ? (l + a) | 0 : m;
                l = w ? a : (m - l) | 0;
                a = d;
            } else if ((p | 0) == 75) {
                p = 0;
                k = l;
                n = 0;
                a = 0;
                while(1){
                    v = _[k >> 2] | 0;
                    if (!v) break;
                    a = Ce(L, v) | 0;
                    if (((a | 0) < 0) | (a >>> 0 > ((h - n) | 0) >>> 0)) break;
                    n = (a + n) | 0;
                    if (h >>> 0 > n >>> 0) k = (k + 4) | 0;
                    else break;
                }
                if ((a | 0) < 0) {
                    f = -1;
                    break a;
                }
                Cr($, 32, o, n, m);
                if (!n) {
                    n = 0;
                    p = 84;
                } else {
                    v = 0;
                    while(1){
                        a = _[l >> 2] | 0;
                        if (!a) {
                            p = 84;
                            break f;
                        }
                        a = Ce(L, a) | 0;
                        v = (a + v) | 0;
                        if ((v | 0) > (n | 0)) {
                            p = 84;
                            break f;
                        }
                        pJ($, L, a);
                        if (v >>> 0 >= n >>> 0) {
                            p = 84;
                            break;
                        } else l = (l + 4) | 0;
                    }
                }
            }
            while (0)
            if ((p | 0) == 67) {
                p = 0;
                l = ((n | 0) != 0) | ((l | 0) != 0);
                m = ((a | 0) != 0) | l;
                l = (((l ^ 1) & 1) + (g - h)) | 0;
                n = m ? h : M;
                h = M;
                l = m ? ((a | 0) > (l | 0) ? a : l) : a;
                a = (a | 0) > -1 ? d & -65537 : d;
            } else if ((p | 0) == 84) {
                p = 0;
                Cr($, 32, o, n, m ^ 8192);
                o = (o | 0) > (n | 0) ? o : n;
                n = y;
                continue;
            }
            w = (h - n) | 0;
            d = (l | 0) < (w | 0) ? w : l;
            m = (d + v) | 0;
            o = (o | 0) < (m | 0) ? m : o;
            Cr($, 32, o, m, a);
            pJ($, k, v);
            Cr($, 48, o, m, a ^ 65536);
            Cr($, 48, d, w, 0);
            pJ($, n, w);
            Cr($, 32, o, m, a ^ 8192);
            n = y;
        }
        g: do if ((p | 0) == 87) if (!$) if (!b) f = 0;
        else {
            f = 1;
            while(1){
                n = _[(u + (f << 2)) >> 2] | 0;
                if (!n) break;
                pV((t + (f << 3)) | 0, n, r);
                f = (f + 1) | 0;
                if ((f | 0) >= 10) {
                    f = 1;
                    break g;
                }
            }
            while(1){
                if (_[(u + (f << 2)) >> 2] | 0) {
                    f = -1;
                    break g;
                }
                f = (f + 1) | 0;
                if ((f | 0) >= 10) {
                    f = 1;
                    break;
                }
            }
        }
        while (0)
        s = O;
        return f | 0;
    }
    function pX($) {
        $ = $ | 0;
        return 0;
    }
    function pZ($) {
        $ = $ | 0;
        return;
    }
    function pJ($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        if (!(_[$ >> 2] & 32)) Cl(n, r, $) | 0;
        return;
    }
    function pQ($) {
        $ = $ | 0;
        var n = 0, r = 0, i = 0;
        r = _[$ >> 2] | 0;
        i = ((e[r >> 0] | 0) + -48) | 0;
        if (i >>> 0 < 10) {
            n = 0;
            do {
                n = (i + ((n * 10) | 0)) | 0;
                r = (r + 1) | 0;
                _[$ >> 2] = r;
                i = ((e[r >> 0] | 0) + -48) | 0;
            }while (i >>> 0 < 10)
        } else n = 0;
        return n | 0;
    }
    function pV($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var e = 0, i = 0, t = 0.0;
        a: do if (n >>> 0 <= 20) do switch(n | 0){
            case 9:
                {
                    e = ((_[r >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    n = _[e >> 2] | 0;
                    _[r >> 2] = e + 4;
                    _[$ >> 2] = n;
                    break a;
                }
            case 10:
                {
                    e = ((_[r >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    n = _[e >> 2] | 0;
                    _[r >> 2] = e + 4;
                    e = $;
                    _[e >> 2] = n;
                    _[(e + 4) >> 2] = (((n | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 11:
                {
                    e = ((_[r >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    n = _[e >> 2] | 0;
                    _[r >> 2] = e + 4;
                    e = $;
                    _[e >> 2] = n;
                    _[(e + 4) >> 2] = 0;
                    break a;
                }
            case 12:
                {
                    e = ((_[r >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    n = e;
                    i = _[n >> 2] | 0;
                    n = _[(n + 4) >> 2] | 0;
                    _[r >> 2] = e + 8;
                    e = $;
                    _[e >> 2] = i;
                    _[(e + 4) >> 2] = n;
                    break a;
                }
            case 13:
                {
                    i = ((_[r >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    e = _[i >> 2] | 0;
                    _[r >> 2] = i + 4;
                    e = ((e & 65535) << 16) >> 16;
                    i = $;
                    _[i >> 2] = e;
                    _[(i + 4) >> 2] = (((e | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 14:
                {
                    i = ((_[r >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    e = _[i >> 2] | 0;
                    _[r >> 2] = i + 4;
                    i = $;
                    _[i >> 2] = e & 65535;
                    _[(i + 4) >> 2] = 0;
                    break a;
                }
            case 15:
                {
                    i = ((_[r >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    e = _[i >> 2] | 0;
                    _[r >> 2] = i + 4;
                    e = ((e & 255) << 24) >> 24;
                    i = $;
                    _[i >> 2] = e;
                    _[(i + 4) >> 2] = (((e | 0) < 0) << 31) >> 31;
                    break a;
                }
            case 16:
                {
                    i = ((_[r >> 2] | 0) + (4 - 1)) & ~(4 - 1);
                    e = _[i >> 2] | 0;
                    _[r >> 2] = i + 4;
                    i = $;
                    _[i >> 2] = e & 255;
                    _[(i + 4) >> 2] = 0;
                    break a;
                }
            case 17:
                {
                    i = ((_[r >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    t = +c[i >> 3];
                    _[r >> 2] = i + 8;
                    c[$ >> 3] = t;
                    break a;
                }
            case 18:
                {
                    i = ((_[r >> 2] | 0) + (8 - 1)) & ~(8 - 1);
                    t = +c[i >> 3];
                    _[r >> 2] = i + 8;
                    c[$ >> 3] = t;
                    break a;
                }
            default:
                break a;
        }
        while (0)
        while (0)
        return;
    }
    function pW($, n, r, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        i = i | 0;
        if (!((($ | 0) == 0) & ((n | 0) == 0))) do {
            r = (r + -1) | 0;
            e[r >> 0] = t[(5694 + ($ & 15)) >> 0] | 0 | i;
            $ = CP($ | 0, n | 0, 4) | 0;
            n = T;
        }while (!((($ | 0) == 0) & ((n | 0) == 0)))
        return r | 0;
    }
    function p9($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        if (!((($ | 0) == 0) & ((n | 0) == 0))) do {
            r = (r + -1) | 0;
            e[r >> 0] = ($ & 7) | 48;
            $ = CP($ | 0, n | 0, 3) | 0;
            n = T;
        }while (!((($ | 0) == 0) & ((n | 0) == 0)))
        return r | 0;
    }
    function C$($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0;
        if ((n >>> 0 > 0) | (((n | 0) == 0) & ($ >>> 0 > 4294967295))) {
            while(1){
                i = Cj($ | 0, n | 0, 10, 0) | 0;
                r = (r + -1) | 0;
                e[r >> 0] = (i & 255) | 48;
                i = $;
                $ = CR($ | 0, n | 0, 10, 0) | 0;
                if (!((n >>> 0 > 9) | (((n | 0) == 9) & (i >>> 0 > 4294967295)))) break;
                else n = T;
            }
            n = $;
        } else n = $;
        if (n) while(1){
            r = (r + -1) | 0;
            e[r >> 0] = (n >>> 0) % 10 | 0 | 48;
            if (n >>> 0 < 10) break;
            else n = ((n >>> 0) / 10) | 0;
        }
        return r | 0;
    }
    function C0($) {
        $ = $ | 0;
        return Cc($, _[((Co() | 0) + 188) >> 2] | 0) | 0;
    }
    function Cn($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, t = 0, u = 0, f = 0;
        u = n & 255;
        i = (r | 0) != 0;
        a: do if (i & ((($ & 3) | 0) != 0)) {
            t = n & 255;
            while(1){
                if ((e[$ >> 0] | 0) == (t << 24) >> 24) {
                    f = 6;
                    break a;
                }
                $ = ($ + 1) | 0;
                r = (r + -1) | 0;
                i = (r | 0) != 0;
                if (!(i & ((($ & 3) | 0) != 0))) {
                    f = 5;
                    break;
                }
            }
        } else f = 5;
        while (0)
        if ((f | 0) == 5) if (i) f = 6;
        else r = 0;
        b: do if ((f | 0) == 6) {
            t = n & 255;
            if ((e[$ >> 0] | 0) != (t << 24) >> 24) {
                i = F(u, 16843009) | 0;
                c: do if (r >>> 0 > 3) while(1){
                    u = _[$ >> 2] ^ i;
                    if ((((u & -2139062144) ^ -2139062144) & (u + -16843009)) | 0) break;
                    $ = ($ + 4) | 0;
                    r = (r + -4) | 0;
                    if (r >>> 0 <= 3) {
                        f = 11;
                        break c;
                    }
                }
                else f = 11;
                while (0)
                if ((f | 0) == 11) if (!r) {
                    r = 0;
                    break;
                }
                while(1){
                    if ((e[$ >> 0] | 0) == (t << 24) >> 24) break b;
                    $ = ($ + 1) | 0;
                    r = (r + -1) | 0;
                    if (!r) {
                        r = 0;
                        break;
                    }
                }
            }
        }
        while (0)
        return (r | 0 ? $ : 0) | 0;
    }
    function Cr($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var _ = 0, t = 0;
        t = s;
        s = (s + 256) | 0;
        _ = t;
        if (((r | 0) > (e | 0)) & (((i & 73728) | 0) == 0)) {
            i = (r - e) | 0;
            CL(_ | 0, n | 0, (i >>> 0 < 256 ? i : 256) | 0) | 0;
            if (i >>> 0 > 255) {
                n = (r - e) | 0;
                do {
                    pJ($, _, 256);
                    i = (i + -256) | 0;
                }while (i >>> 0 > 255)
                i = n & 255;
            }
            pJ($, _, i);
        }
        s = t;
        return;
    }
    function Ce($, n) {
        $ = $ | 0;
        n = n | 0;
        if (!$) $ = 0;
        else $ = Cu($, n, 0) | 0;
        return $ | 0;
    }
    function Ci($, n, r, i, u, f) {
        $ = $ | 0;
        n = +n;
        r = r | 0;
        i = i | 0;
        u = u | 0;
        f = f | 0;
        var o = 0, c = 0, a = 0, l = 0, v = 0, b = 0, k = 0, h = 0.0, d = 0, w = 0, m = 0, y = 0, p = 0, C = 0, M = 0, g = 0, A = 0, I = 0, S = 0, x = 0, N = 0, L = 0, O = 0;
        O = s;
        s = (s + 560) | 0;
        a = (O + 8) | 0;
        m = O;
        L = (O + 524) | 0;
        N = L;
        l = (O + 512) | 0;
        _[m >> 2] = 0;
        x = (l + 12) | 0;
        C_(n) | 0;
        if ((T | 0) < 0) {
            n = -n;
            I = 1;
            A = 5659;
        } else {
            I = (((u & 2049) | 0) != 0) & 1;
            A = ((u & 2048) | 0) == 0 ? ((u & 1) | 0) == 0 ? 5660 : 5665 : 5662;
        }
        C_(n) | 0;
        S = T & 2146435072;
        do if ((S >>> 0 < 2146435072) | (((S | 0) == 2146435072) & (0 < 0))) {
            h = +Ct(n, m) * 2.0;
            o = h != 0.0;
            if (o) _[m >> 2] = (_[m >> 2] | 0) + -1;
            p = f | 32;
            if ((p | 0) == 97) {
                d = f & 32;
                k = (d | 0) == 0 ? A : (A + 9) | 0;
                b = I | 2;
                o = (12 - i) | 0;
                do if (!((i >>> 0 > 11) | ((o | 0) == 0))) {
                    n = 8.0;
                    do {
                        o = (o + -1) | 0;
                        n = n * 16.0;
                    }while ((o | 0) != 0)
                    if ((e[k >> 0] | 0) == 45) {
                        n = -(n + (-h - n));
                        break;
                    } else {
                        n = h + n - n;
                        break;
                    }
                } else n = h;
                while (0)
                c = _[m >> 2] | 0;
                o = (c | 0) < 0 ? (0 - c) | 0 : c;
                o = C$(o, (((o | 0) < 0) << 31) >> 31, x) | 0;
                if ((o | 0) == (x | 0)) {
                    o = (l + 11) | 0;
                    e[o >> 0] = 48;
                }
                e[(o + -1) >> 0] = ((c >> 31) & 2) + 43;
                v = (o + -2) | 0;
                e[v >> 0] = f + 15;
                l = (i | 0) < 1;
                a = ((u & 8) | 0) == 0;
                o = L;
                do {
                    S = ~~n;
                    c = (o + 1) | 0;
                    e[o >> 0] = t[(5694 + S) >> 0] | d;
                    n = (n - +(S | 0)) * 16.0;
                    if (((c - N) | 0) == 1 ? !(a & (l & (n == 0.0))) : 0) {
                        e[c >> 0] = 46;
                        o = (o + 2) | 0;
                    } else o = c;
                }while (n != 0.0)
                S = (o - N) | 0;
                N = (x - v) | 0;
                x = ((i | 0) != 0) & (((S + -2) | 0) < (i | 0)) ? (i + 2) | 0 : S;
                o = (N + b + x) | 0;
                Cr($, 32, r, o, u);
                pJ($, k, b);
                Cr($, 48, r, o, u ^ 65536);
                pJ($, L, S);
                Cr($, 48, (x - S) | 0, 0, 0);
                pJ($, v, N);
                Cr($, 32, r, o, u ^ 8192);
                break;
            }
            c = (i | 0) < 0 ? 6 : i;
            if (o) {
                o = ((_[m >> 2] | 0) + -28) | 0;
                _[m >> 2] = o;
                n = h * 268435456.0;
            } else {
                n = h;
                o = _[m >> 2] | 0;
            }
            S = (o | 0) < 0 ? a : (a + 288) | 0;
            a = S;
            do {
                M = ~~n >>> 0;
                _[a >> 2] = M;
                a = (a + 4) | 0;
                n = (n - +(M >>> 0)) * 1.0e9;
            }while (n != 0.0)
            if ((o | 0) > 0) {
                l = S;
                b = a;
                while(1){
                    v = (o | 0) < 29 ? o : 29;
                    o = (b + -4) | 0;
                    if (o >>> 0 >= l >>> 0) {
                        a = 0;
                        do {
                            C = CO(_[o >> 2] | 0, 0, v | 0) | 0;
                            C = CN(C | 0, T | 0, a | 0, 0) | 0;
                            M = T;
                            y = Cj(C | 0, M | 0, 1e9, 0) | 0;
                            _[o >> 2] = y;
                            a = CR(C | 0, M | 0, 1e9, 0) | 0;
                            o = (o + -4) | 0;
                        }while (o >>> 0 >= l >>> 0)
                        if (a) {
                            l = (l + -4) | 0;
                            _[l >> 2] = a;
                        }
                    }
                    a = b;
                    while(1){
                        if (a >>> 0 <= l >>> 0) break;
                        o = (a + -4) | 0;
                        if (!(_[o >> 2] | 0)) a = o;
                        else break;
                    }
                    o = ((_[m >> 2] | 0) - v) | 0;
                    _[m >> 2] = o;
                    if ((o | 0) > 0) b = a;
                    else break;
                }
            } else l = S;
            if ((o | 0) < 0) {
                i = (((((c + 25) | 0) / 9) | 0) + 1) | 0;
                w = (p | 0) == 102;
                do {
                    d = (0 - o) | 0;
                    d = (d | 0) < 9 ? d : 9;
                    if (l >>> 0 < a >>> 0) {
                        v = ((1 << d) + -1) | 0;
                        b = 1e9 >>> d;
                        k = 0;
                        o = l;
                        do {
                            M = _[o >> 2] | 0;
                            _[o >> 2] = (M >>> d) + k;
                            k = F(M & v, b) | 0;
                            o = (o + 4) | 0;
                        }while (o >>> 0 < a >>> 0)
                        o = (_[l >> 2] | 0) == 0 ? (l + 4) | 0 : l;
                        if (!k) {
                            l = o;
                            o = a;
                        } else {
                            _[a >> 2] = k;
                            l = o;
                            o = (a + 4) | 0;
                        }
                    } else {
                        l = (_[l >> 2] | 0) == 0 ? (l + 4) | 0 : l;
                        o = a;
                    }
                    a = w ? S : l;
                    a = (((o - a) >> 2) | 0) > (i | 0) ? (a + (i << 2)) | 0 : o;
                    o = ((_[m >> 2] | 0) + d) | 0;
                    _[m >> 2] = o;
                }while ((o | 0) < 0)
                o = l;
                i = a;
            } else {
                o = l;
                i = a;
            }
            M = S;
            if (o >>> 0 < i >>> 0) {
                a = (((M - o) >> 2) * 9) | 0;
                v = _[o >> 2] | 0;
                if (v >>> 0 >= 10) {
                    l = 10;
                    do {
                        l = (l * 10) | 0;
                        a = (a + 1) | 0;
                    }while (v >>> 0 >= l >>> 0)
                }
            } else a = 0;
            w = (p | 0) == 103;
            y = (c | 0) != 0;
            l = (c - ((p | 0) != 102 ? a : 0) + (((y & w) << 31) >> 31)) | 0;
            if ((l | 0) < ((((((i - M) >> 2) * 9) | 0) + -9) | 0)) {
                l = (l + 9216) | 0;
                d = (S + 4 + (((((l | 0) / 9) | 0) + -1024) << 2)) | 0;
                l = (((l | 0) % 9 | 0) + 1) | 0;
                if ((l | 0) < 9) {
                    v = 10;
                    do {
                        v = (v * 10) | 0;
                        l = (l + 1) | 0;
                    }while ((l | 0) != 9)
                } else v = 10;
                b = _[d >> 2] | 0;
                k = (b >>> 0) % (v >>> 0) | 0;
                l = ((d + 4) | 0) == (i | 0);
                if (!(l & ((k | 0) == 0))) {
                    h = (((((b >>> 0) / (v >>> 0)) | 0) & 1) | 0) == 0 ? 9007199254740992.0 : 9007199254740994.0;
                    C = ((v | 0) / 2) | 0;
                    n = k >>> 0 < C >>> 0 ? 0.5 : l & ((k | 0) == (C | 0)) ? 1.0 : 1.5;
                    if (I) {
                        C = (e[A >> 0] | 0) == 45;
                        n = C ? -n : n;
                        h = C ? -h : h;
                    }
                    l = (b - k) | 0;
                    _[d >> 2] = l;
                    if (h + n != h) {
                        C = (l + v) | 0;
                        _[d >> 2] = C;
                        if (C >>> 0 > 999999999) {
                            a = d;
                            while(1){
                                l = (a + -4) | 0;
                                _[a >> 2] = 0;
                                if (l >>> 0 < o >>> 0) {
                                    o = (o + -4) | 0;
                                    _[o >> 2] = 0;
                                }
                                C = ((_[l >> 2] | 0) + 1) | 0;
                                _[l >> 2] = C;
                                if (C >>> 0 > 999999999) a = l;
                                else break;
                            }
                        } else l = d;
                        a = (((M - o) >> 2) * 9) | 0;
                        b = _[o >> 2] | 0;
                        if (b >>> 0 >= 10) {
                            v = 10;
                            do {
                                v = (v * 10) | 0;
                                a = (a + 1) | 0;
                            }while (b >>> 0 >= v >>> 0)
                        }
                    } else l = d;
                } else l = d;
                l = (l + 4) | 0;
                l = i >>> 0 > l >>> 0 ? l : i;
                C = o;
            } else {
                l = i;
                C = o;
            }
            p = l;
            while(1){
                if (p >>> 0 <= C >>> 0) {
                    m = 0;
                    break;
                }
                o = (p + -4) | 0;
                if (!(_[o >> 2] | 0)) p = o;
                else {
                    m = 1;
                    break;
                }
            }
            i = (0 - a) | 0;
            do if (w) {
                o = (((y ^ 1) & 1) + c) | 0;
                if (((o | 0) > (a | 0)) & ((a | 0) > -5)) {
                    v = (f + -1) | 0;
                    c = (o + -1 - a) | 0;
                } else {
                    v = (f + -2) | 0;
                    c = (o + -1) | 0;
                }
                o = u & 8;
                if (!o) {
                    if (m ? ((g = _[(p + -4) >> 2] | 0), (g | 0) != 0) : 0) {
                        if (!((g >>> 0) % 10 | 0)) {
                            l = 0;
                            o = 10;
                            do {
                                o = (o * 10) | 0;
                                l = (l + 1) | 0;
                            }while (!((g >>> 0) % (o >>> 0) | 0 | 0))
                        } else l = 0;
                    } else l = 9;
                    o = (((((p - M) >> 2) * 9) | 0) + -9) | 0;
                    if ((v | 32 | 0) == 102) {
                        d = (o - l) | 0;
                        d = (d | 0) > 0 ? d : 0;
                        c = (c | 0) < (d | 0) ? c : d;
                        d = 0;
                        break;
                    } else {
                        d = (o + a - l) | 0;
                        d = (d | 0) > 0 ? d : 0;
                        c = (c | 0) < (d | 0) ? c : d;
                        d = 0;
                        break;
                    }
                } else d = o;
            } else {
                v = f;
                d = u & 8;
            }
            while (0)
            w = c | d;
            b = ((w | 0) != 0) & 1;
            k = (v | 32 | 0) == 102;
            if (k) {
                y = 0;
                o = (a | 0) > 0 ? a : 0;
            } else {
                o = (a | 0) < 0 ? i : a;
                o = C$(o, (((o | 0) < 0) << 31) >> 31, x) | 0;
                l = x;
                if (((l - o) | 0) < 2) do {
                    o = (o + -1) | 0;
                    e[o >> 0] = 48;
                }while (((l - o) | 0) < 2)
                e[(o + -1) >> 0] = ((a >> 31) & 2) + 43;
                o = (o + -2) | 0;
                e[o >> 0] = v;
                y = o;
                o = (l - o) | 0;
            }
            o = (I + 1 + c + b + o) | 0;
            Cr($, 32, r, o, u);
            pJ($, A, I);
            Cr($, 48, r, o, u ^ 65536);
            if (k) {
                v = C >>> 0 > S >>> 0 ? S : C;
                d = (L + 9) | 0;
                b = d;
                k = (L + 8) | 0;
                l = v;
                do {
                    a = C$(_[l >> 2] | 0, 0, d) | 0;
                    if ((l | 0) == (v | 0)) {
                        if ((a | 0) == (d | 0)) {
                            e[k >> 0] = 48;
                            a = k;
                        }
                    } else if (a >>> 0 > L >>> 0) {
                        CL(L | 0, 48, (a - N) | 0) | 0;
                        do a = (a + -1) | 0;
                        while (a >>> 0 > L >>> 0)
                    }
                    pJ($, a, (b - a) | 0);
                    l = (l + 4) | 0;
                }while (l >>> 0 <= S >>> 0)
                if (w | 0) pJ($, 5710, 1);
                if ((l >>> 0 < p >>> 0) & ((c | 0) > 0)) while(1){
                    a = C$(_[l >> 2] | 0, 0, d) | 0;
                    if (a >>> 0 > L >>> 0) {
                        CL(L | 0, 48, (a - N) | 0) | 0;
                        do a = (a + -1) | 0;
                        while (a >>> 0 > L >>> 0)
                    }
                    pJ($, a, (c | 0) < 9 ? c : 9);
                    l = (l + 4) | 0;
                    a = (c + -9) | 0;
                    if (!((l >>> 0 < p >>> 0) & ((c | 0) > 9))) {
                        c = a;
                        break;
                    } else c = a;
                }
                Cr($, 48, (c + 9) | 0, 9, 0);
            } else {
                w = m ? p : (C + 4) | 0;
                if ((c | 0) > -1) {
                    m = (L + 9) | 0;
                    d = (d | 0) == 0;
                    i = m;
                    b = (0 - N) | 0;
                    k = (L + 8) | 0;
                    v = C;
                    do {
                        a = C$(_[v >> 2] | 0, 0, m) | 0;
                        if ((a | 0) == (m | 0)) {
                            e[k >> 0] = 48;
                            a = k;
                        }
                        do if ((v | 0) == (C | 0)) {
                            l = (a + 1) | 0;
                            pJ($, a, 1);
                            if (d & ((c | 0) < 1)) {
                                a = l;
                                break;
                            }
                            pJ($, 5710, 1);
                            a = l;
                        } else {
                            if (a >>> 0 <= L >>> 0) break;
                            CL(L | 0, 48, (a + b) | 0) | 0;
                            do a = (a + -1) | 0;
                            while (a >>> 0 > L >>> 0)
                        }
                        while (0)
                        N = (i - a) | 0;
                        pJ($, a, (c | 0) > (N | 0) ? N : c);
                        c = (c - N) | 0;
                        v = (v + 4) | 0;
                    }while ((v >>> 0 < w >>> 0) & ((c | 0) > -1))
                }
                Cr($, 48, (c + 18) | 0, 18, 0);
                pJ($, y, (x - y) | 0);
            }
            Cr($, 32, r, o, u ^ 8192);
        } else {
            L = ((f & 32) | 0) != 0;
            o = (I + 3) | 0;
            Cr($, 32, r, o, u & -65537);
            pJ($, A, I);
            pJ($, (n != n) | (0.0 != 0.0) ? L ? 5686 : 5690 : L ? 5678 : 5682, 3);
            Cr($, 32, r, o, u ^ 8192);
        }
        while (0)
        s = O;
        return ((o | 0) < (r | 0) ? r : o) | 0;
    }
    function C_($) {
        $ = +$;
        var n = 0;
        c[l >> 3] = $;
        n = _[l >> 2] | 0;
        T = _[(l + 4) >> 2] | 0;
        return n | 0;
    }
    function Ct($, n) {
        $ = +$;
        n = n | 0;
        return +(+C2($, n));
    }
    function C2($, n) {
        $ = +$;
        n = n | 0;
        var r = 0, e = 0, i = 0;
        c[l >> 3] = $;
        r = _[l >> 2] | 0;
        e = _[(l + 4) >> 2] | 0;
        i = CP(r | 0, e | 0, 52) | 0;
        switch(i & 2047){
            case 0:
                {
                    if ($ != 0.0) {
                        $ = +C2($ * 18446744073709551616.0, n);
                        r = ((_[n >> 2] | 0) + -64) | 0;
                    } else r = 0;
                    _[n >> 2] = r;
                    break;
                }
            case 2047:
                break;
            default:
                {
                    _[n >> 2] = (i & 2047) + -1022;
                    _[l >> 2] = r;
                    _[(l + 4) >> 2] = (e & -2146435073) | 1071644672;
                    $ = +c[l >> 3];
                }
        }
        return +$;
    }
    function Cu($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        do if ($) {
            if (n >>> 0 < 128) {
                e[$ >> 0] = n;
                $ = 1;
                break;
            }
            if (!(_[_[((Cf() | 0) + 188) >> 2] >> 2] | 0)) if (((n & -128) | 0) == 57216) {
                e[$ >> 0] = n;
                $ = 1;
                break;
            } else {
                _[(pY() | 0) >> 2] = 84;
                $ = -1;
                break;
            }
            if (n >>> 0 < 2048) {
                e[$ >> 0] = (n >>> 6) | 192;
                e[($ + 1) >> 0] = (n & 63) | 128;
                $ = 2;
                break;
            }
            if ((n >>> 0 < 55296) | (((n & -8192) | 0) == 57344)) {
                e[$ >> 0] = (n >>> 12) | 224;
                e[($ + 1) >> 0] = ((n >>> 6) & 63) | 128;
                e[($ + 2) >> 0] = (n & 63) | 128;
                $ = 3;
                break;
            }
            if (((n + -65536) | 0) >>> 0 < 1048576) {
                e[$ >> 0] = (n >>> 18) | 240;
                e[($ + 1) >> 0] = ((n >>> 12) & 63) | 128;
                e[($ + 2) >> 0] = ((n >>> 6) & 63) | 128;
                e[($ + 3) >> 0] = (n & 63) | 128;
                $ = 4;
                break;
            } else {
                _[(pY() | 0) >> 2] = 84;
                $ = -1;
                break;
            }
        } else $ = 1;
        while (0)
        return $ | 0;
    }
    function Cf() {
        return pj() | 0;
    }
    function Co() {
        return pj() | 0;
    }
    function Cc($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0, i = 0;
        i = 0;
        while(1){
            if ((t[(5712 + i) >> 0] | 0) == ($ | 0)) {
                $ = 2;
                break;
            }
            r = (i + 1) | 0;
            if ((r | 0) == 87) {
                r = 5800;
                i = 87;
                $ = 5;
                break;
            } else i = r;
        }
        if (($ | 0) == 2) if (!i) r = 5800;
        else {
            r = 5800;
            $ = 5;
        }
        if (($ | 0) == 5) while(1){
            do {
                $ = r;
                r = (r + 1) | 0;
            }while ((e[$ >> 0] | 0) != 0)
            i = (i + -1) | 0;
            if (!i) break;
            else $ = 5;
        }
        return C6(r, _[(n + 20) >> 2] | 0) | 0;
    }
    function C6($, n) {
        $ = $ | 0;
        n = n | 0;
        return Ca($, n) | 0;
    }
    function Ca($, n) {
        $ = $ | 0;
        n = n | 0;
        if (!n) n = 0;
        else n = C1(_[n >> 2] | 0, _[(n + 4) >> 2] | 0, $) | 0;
        return (n | 0 ? n : $) | 0;
    }
    function C1($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0;
        s = ((_[$ >> 2] | 0) + 1794895138) | 0;
        u = C4(_[($ + 8) >> 2] | 0, s) | 0;
        i = C4(_[($ + 12) >> 2] | 0, s) | 0;
        t = C4(_[($ + 16) >> 2] | 0, s) | 0;
        a: do if ((u >>> 0 < (n >>> 2) >>> 0 ? ((v = (n - (u << 2)) | 0), (i >>> 0 < v >>> 0) & (t >>> 0 < v >>> 0)) : 0) ? (((t | i) & 3) | 0) == 0 : 0) {
            v = i >>> 2;
            l = t >>> 2;
            a = 0;
            while(1){
                o = u >>> 1;
                c = (a + o) | 0;
                f = c << 1;
                t = (f + v) | 0;
                i = C4(_[($ + (t << 2)) >> 2] | 0, s) | 0;
                t = C4(_[($ + ((t + 1) << 2)) >> 2] | 0, s) | 0;
                if (!((t >>> 0 < n >>> 0) & (i >>> 0 < ((n - t) | 0) >>> 0))) {
                    i = 0;
                    break a;
                }
                if (e[($ + (t + i)) >> 0] | 0) {
                    i = 0;
                    break a;
                }
                i = pF(r, ($ + t) | 0) | 0;
                if (!i) break;
                i = (i | 0) < 0;
                if ((u | 0) == 1) {
                    i = 0;
                    break a;
                } else {
                    a = i ? a : c;
                    u = i ? o : (u - o) | 0;
                }
            }
            i = (f + l) | 0;
            t = C4(_[($ + (i << 2)) >> 2] | 0, s) | 0;
            i = C4(_[($ + ((i + 1) << 2)) >> 2] | 0, s) | 0;
            if ((i >>> 0 < n >>> 0) & (t >>> 0 < ((n - i) | 0) >>> 0)) i = (e[($ + (i + t)) >> 0] | 0) == 0 ? ($ + i) | 0 : 0;
            else i = 0;
        } else i = 0;
        while (0)
        return i | 0;
    }
    function C4($, n) {
        $ = $ | 0;
        n = n | 0;
        var r = 0;
        r = Cz($ | 0) | 0;
        return ((n | 0) == 0 ? $ : r) | 0;
    }
    function Cl($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, t = 0, u = 0, f = 0, o = 0;
        i = (r + 16) | 0;
        t = _[i >> 2] | 0;
        if (!t) {
            if (!(Cv(r) | 0)) {
                t = _[i >> 2] | 0;
                u = 5;
            } else i = 0;
        } else u = 5;
        a: do if ((u | 0) == 5) {
            o = (r + 20) | 0;
            f = _[o >> 2] | 0;
            i = f;
            if (((t - f) | 0) >>> 0 < n >>> 0) {
                i = MU[_[(r + 36) >> 2] & 7](r, $, n) | 0;
                break;
            }
            b: do if ((e[(r + 75) >> 0] | 0) > -1) {
                f = n;
                while(1){
                    if (!f) {
                        u = 0;
                        t = $;
                        break b;
                    }
                    t = (f + -1) | 0;
                    if ((e[($ + t) >> 0] | 0) == 10) break;
                    else f = t;
                }
                i = MU[_[(r + 36) >> 2] & 7](r, $, f) | 0;
                if (i >>> 0 < f >>> 0) break a;
                u = f;
                t = ($ + f) | 0;
                n = (n - f) | 0;
                i = _[o >> 2] | 0;
            } else {
                u = 0;
                t = $;
            }
            while (0)
            CE(i | 0, t | 0, n | 0) | 0;
            _[o >> 2] = (_[o >> 2] | 0) + n;
            i = (u + n) | 0;
        }
        while (0)
        return i | 0;
    }
    function Cv($) {
        $ = $ | 0;
        var n = 0, r = 0;
        n = ($ + 74) | 0;
        r = e[n >> 0] | 0;
        e[n >> 0] = (r + 255) | r;
        n = _[$ >> 2] | 0;
        if (!(n & 8)) {
            _[($ + 8) >> 2] = 0;
            _[($ + 4) >> 2] = 0;
            r = _[($ + 44) >> 2] | 0;
            _[($ + 28) >> 2] = r;
            _[($ + 20) >> 2] = r;
            _[($ + 16) >> 2] = r + (_[($ + 48) >> 2] | 0);
            $ = 0;
        } else {
            _[$ >> 2] = n | 32;
            $ = -1;
        }
        return $ | 0;
    }
    function C7($, n) {
        $ = X($);
        n = X(n);
        var r = 0, e = 0;
        r = C5($) | 0;
        do if ((r & 2147483647) >>> 0 <= 2139095040) {
            e = C5(n) | 0;
            if ((e & 2147483647) >>> 0 <= 2139095040) if (((e ^ r) | 0) < 0) {
                $ = (r | 0) < 0 ? n : $;
                break;
            } else {
                $ = $ < n ? n : $;
                break;
            }
        } else $ = n;
        while (0)
        return X($);
    }
    function C5($) {
        $ = X($);
        return ((o[l >> 2] = $), _[l >> 2] | 0) | 0;
    }
    function Cs($, n) {
        $ = X($);
        n = X(n);
        var r = 0, e = 0;
        r = C3($) | 0;
        do if ((r & 2147483647) >>> 0 <= 2139095040) {
            e = C3(n) | 0;
            if ((e & 2147483647) >>> 0 <= 2139095040) if (((e ^ r) | 0) < 0) {
                $ = (r | 0) < 0 ? $ : n;
                break;
            } else {
                $ = $ < n ? $ : n;
                break;
            }
        } else $ = n;
        while (0)
        return X($);
    }
    function C3($) {
        $ = X($);
        return ((o[l >> 2] = $), _[l >> 2] | 0) | 0;
    }
    function Cb($, n) {
        $ = X($);
        n = X(n);
        var r = 0, e = 0, i = 0, t = 0, u = 0, f = 0, c = 0, a = 0;
        t = ((o[l >> 2] = $), _[l >> 2] | 0);
        f = ((o[l >> 2] = n), _[l >> 2] | 0);
        r = (t >>> 23) & 255;
        u = (f >>> 23) & 255;
        c = t & -2147483648;
        i = f << 1;
        a: do if ((i | 0) != 0 ? !(((r | 0) == 255) | (((Ck(n) | 0) & 2147483647) >>> 0 > 2139095040)) : 0) {
            e = t << 1;
            if (e >>> 0 <= i >>> 0) {
                n = X($ * X(0.0));
                return X((e | 0) == (i | 0) ? n : $);
            }
            if (!r) {
                r = t << 9;
                if ((r | 0) > -1) {
                    e = r;
                    r = 0;
                    do {
                        r = (r + -1) | 0;
                        e = e << 1;
                    }while ((e | 0) > -1)
                } else r = 0;
                e = t << (1 - r);
            } else e = (t & 8388607) | 8388608;
            if (!u) {
                t = f << 9;
                if ((t | 0) > -1) {
                    i = 0;
                    do {
                        i = (i + -1) | 0;
                        t = t << 1;
                    }while ((t | 0) > -1)
                } else i = 0;
                u = i;
                f = f << (1 - i);
            } else f = (f & 8388607) | 8388608;
            i = (e - f) | 0;
            t = (i | 0) > -1;
            b: do if ((r | 0) > (u | 0)) {
                while(1){
                    if (t) if (!i) break;
                    else e = i;
                    e = e << 1;
                    r = (r + -1) | 0;
                    i = (e - f) | 0;
                    t = (i | 0) > -1;
                    if ((r | 0) <= (u | 0)) break b;
                }
                n = X($ * X(0.0));
                break a;
            }
            while (0)
            if (t) if (!i) {
                n = X($ * X(0.0));
                break;
            } else e = i;
            if (e >>> 0 < 8388608) do {
                e = e << 1;
                r = (r + -1) | 0;
            }while (e >>> 0 < 8388608)
            if ((r | 0) > 0) r = (e + -8388608) | (r << 23);
            else r = e >>> ((1 - r) | 0);
            n = ((_[l >> 2] = r | c), X(o[l >> 2]));
        } else a = 3;
        while (0)
        if ((a | 0) == 3) {
            n = X($ * n);
            n = X(n / n);
        }
        return X(n);
    }
    function Ck($) {
        $ = X($);
        return ((o[l >> 2] = $), _[l >> 2] | 0) | 0;
    }
    function Ch($, n) {
        $ = $ | 0;
        n = n | 0;
        return pq(_[582] | 0, $, n) | 0;
    }
    function Cd($) {
        $ = $ | 0;
        $Y();
    }
    function Cw($) {
        $ = $ | 0;
        return;
    }
    function C8($, n) {
        $ = $ | 0;
        n = n | 0;
        return 0;
    }
    function Cm($) {
        $ = $ | 0;
        if ((Cy(($ + 4) | 0) | 0) == -1) {
            ME[_[((_[$ >> 2] | 0) + 8) >> 2] & 127]($);
            $ = 1;
        } else $ = 0;
        return $ | 0;
    }
    function Cy($) {
        $ = $ | 0;
        var n = 0;
        n = _[$ >> 2] | 0;
        _[$ >> 2] = n + -1;
        return (n + -1) | 0;
    }
    function Cp($) {
        $ = $ | 0;
        if (Cm($) | 0) CC($);
        return;
    }
    function CC($) {
        $ = $ | 0;
        var n = 0;
        n = ($ + 8) | 0;
        if (!((_[n >> 2] | 0) != 0 ? (Cy(n) | 0) != -1 : 0)) ME[_[((_[$ >> 2] | 0) + 16) >> 2] & 127]($);
        return;
    }
    function CM($) {
        $ = $ | 0;
        var n = 0;
        n = ($ | 0) == 0 ? 1 : $;
        while(1){
            $ = pL(n) | 0;
            if ($ | 0) break;
            $ = CS() | 0;
            if (!$) {
                $ = 0;
                break;
            }
            MW[$ & 0]();
        }
        return $ | 0;
    }
    function Cg($) {
        $ = $ | 0;
        return CM($) | 0;
    }
    function CA($) {
        $ = $ | 0;
        pO($);
        return;
    }
    function CI($) {
        $ = $ | 0;
        if ((e[($ + 11) >> 0] | 0) < 0) CA(_[$ >> 2] | 0);
        return;
    }
    function CS() {
        var $ = 0;
        $ = _[2923] | 0;
        _[2923] = $ + 0;
        return $ | 0;
    }
    function CT() {}
    function Cx($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        e = (n - e - ((r >>> 0 > $ >>> 0) | 0)) >>> 0;
        return ((T = e), (($ - r) >>> 0) | 0) | 0;
    }
    function CN($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        r = ($ + r) >>> 0;
        return ((T = (n + e + ((r >>> 0 < $ >>> 0) | 0)) >>> 0), r | 0) | 0;
    }
    function CL($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, t = 0, u = 0, f = 0;
        u = ($ + r) | 0;
        n = n & 255;
        if ((r | 0) >= 67) {
            while($ & 3){
                e[$ >> 0] = n;
                $ = ($ + 1) | 0;
            }
            i = (u & -4) | 0;
            t = (i - 64) | 0;
            f = n | (n << 8) | (n << 16) | (n << 24);
            while(($ | 0) <= (t | 0)){
                _[$ >> 2] = f;
                _[($ + 4) >> 2] = f;
                _[($ + 8) >> 2] = f;
                _[($ + 12) >> 2] = f;
                _[($ + 16) >> 2] = f;
                _[($ + 20) >> 2] = f;
                _[($ + 24) >> 2] = f;
                _[($ + 28) >> 2] = f;
                _[($ + 32) >> 2] = f;
                _[($ + 36) >> 2] = f;
                _[($ + 40) >> 2] = f;
                _[($ + 44) >> 2] = f;
                _[($ + 48) >> 2] = f;
                _[($ + 52) >> 2] = f;
                _[($ + 56) >> 2] = f;
                _[($ + 60) >> 2] = f;
                $ = ($ + 64) | 0;
            }
            while(($ | 0) < (i | 0)){
                _[$ >> 2] = f;
                $ = ($ + 4) | 0;
            }
        }
        while(($ | 0) < (u | 0)){
            e[$ >> 0] = n;
            $ = ($ + 1) | 0;
        }
        return (u - r) | 0;
    }
    function CO($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        if ((r | 0) < 32) {
            T = (n << r) | (($ & (((1 << r) - 1) << (32 - r))) >>> (32 - r));
            return $ << r;
        }
        T = $ << (r - 32);
        return 0;
    }
    function CP($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        if ((r | 0) < 32) {
            T = n >>> r;
            return ($ >>> r) | ((n & ((1 << r) - 1)) << (32 - r));
        }
        T = 0;
        return (n >>> (r - 32)) | 0;
    }
    function CE($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0, t = 0, u = 0;
        if ((r | 0) >= 8192) return $P($ | 0, n | 0, r | 0) | 0;
        u = $ | 0;
        t = ($ + r) | 0;
        if (($ & 3) == (n & 3)) {
            while($ & 3){
                if (!r) return u | 0;
                e[$ >> 0] = e[n >> 0] | 0;
                $ = ($ + 1) | 0;
                n = (n + 1) | 0;
                r = (r - 1) | 0;
            }
            r = (t & -4) | 0;
            i = (r - 64) | 0;
            while(($ | 0) <= (i | 0)){
                _[$ >> 2] = _[n >> 2];
                _[($ + 4) >> 2] = _[(n + 4) >> 2];
                _[($ + 8) >> 2] = _[(n + 8) >> 2];
                _[($ + 12) >> 2] = _[(n + 12) >> 2];
                _[($ + 16) >> 2] = _[(n + 16) >> 2];
                _[($ + 20) >> 2] = _[(n + 20) >> 2];
                _[($ + 24) >> 2] = _[(n + 24) >> 2];
                _[($ + 28) >> 2] = _[(n + 28) >> 2];
                _[($ + 32) >> 2] = _[(n + 32) >> 2];
                _[($ + 36) >> 2] = _[(n + 36) >> 2];
                _[($ + 40) >> 2] = _[(n + 40) >> 2];
                _[($ + 44) >> 2] = _[(n + 44) >> 2];
                _[($ + 48) >> 2] = _[(n + 48) >> 2];
                _[($ + 52) >> 2] = _[(n + 52) >> 2];
                _[($ + 56) >> 2] = _[(n + 56) >> 2];
                _[($ + 60) >> 2] = _[(n + 60) >> 2];
                $ = ($ + 64) | 0;
                n = (n + 64) | 0;
            }
            while(($ | 0) < (r | 0)){
                _[$ >> 2] = _[n >> 2];
                $ = ($ + 4) | 0;
                n = (n + 4) | 0;
            }
        } else {
            r = (t - 4) | 0;
            while(($ | 0) < (r | 0)){
                e[$ >> 0] = e[n >> 0] | 0;
                e[($ + 1) >> 0] = e[(n + 1) >> 0] | 0;
                e[($ + 2) >> 0] = e[(n + 2) >> 0] | 0;
                e[($ + 3) >> 0] = e[(n + 3) >> 0] | 0;
                $ = ($ + 4) | 0;
                n = (n + 4) | 0;
            }
        }
        while(($ | 0) < (t | 0)){
            e[$ >> 0] = e[n >> 0] | 0;
            $ = ($ + 1) | 0;
            n = (n + 1) | 0;
        }
        return u | 0;
    }
    function CG($) {
        $ = $ | 0;
        var n = 0;
        n = e[(k + ($ & 255)) >> 0] | 0;
        if ((n | 0) < 8) return n | 0;
        n = e[(k + (($ >> 8) & 255)) >> 0] | 0;
        if ((n | 0) < 8) return (n + 8) | 0;
        n = e[(k + (($ >> 16) & 255)) >> 0] | 0;
        if ((n | 0) < 8) return (n + 16) | 0;
        return ((e[(k + ($ >>> 24)) >> 0] | 0) + 24) | 0;
    }
    function CB($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        var t = 0, u = 0, f = 0, o = 0, c = 0, a = 0, l = 0, v = 0, s = 0, b = 0;
        a = $;
        o = n;
        c = o;
        u = r;
        v = e;
        f = v;
        if (!c) {
            t = (i | 0) != 0;
            if (!f) {
                if (t) {
                    _[i >> 2] = (a >>> 0) % (u >>> 0);
                    _[(i + 4) >> 2] = 0;
                }
                v = 0;
                i = ((a >>> 0) / (u >>> 0)) >>> 0;
                return ((T = v), i) | 0;
            } else {
                if (!t) {
                    v = 0;
                    i = 0;
                    return ((T = v), i) | 0;
                }
                _[i >> 2] = $ | 0;
                _[(i + 4) >> 2] = n & 0;
                v = 0;
                i = 0;
                return ((T = v), i) | 0;
            }
        }
        t = (f | 0) == 0;
        do if (u) {
            if (!t) {
                t = ((H(f | 0) | 0) - (H(c | 0) | 0)) | 0;
                if (t >>> 0 <= 31) {
                    l = (t + 1) | 0;
                    f = (31 - t) | 0;
                    n = (t - 31) >> 31;
                    u = l;
                    $ = ((a >>> (l >>> 0)) & n) | (c << f);
                    n = (c >>> (l >>> 0)) & n;
                    t = 0;
                    f = a << f;
                    break;
                }
                if (!i) {
                    v = 0;
                    i = 0;
                    return ((T = v), i) | 0;
                }
                _[i >> 2] = $ | 0;
                _[(i + 4) >> 2] = o | (n & 0);
                v = 0;
                i = 0;
                return ((T = v), i) | 0;
            }
            t = (u - 1) | 0;
            if ((t & u) | 0) {
                f = ((H(u | 0) | 0) + 33 - (H(c | 0) | 0)) | 0;
                b = (64 - f) | 0;
                l = (32 - f) | 0;
                o = l >> 31;
                s = (f - 32) | 0;
                n = s >> 31;
                u = f;
                $ = (((l - 1) >> 31) & (c >>> (s >>> 0))) | (((c << l) | (a >>> (f >>> 0))) & n);
                n = n & (c >>> (f >>> 0));
                t = (a << b) & o;
                f = (((c << b) | (a >>> (s >>> 0))) & o) | ((a << l) & ((f - 33) >> 31));
                break;
            }
            if (i | 0) {
                _[i >> 2] = t & a;
                _[(i + 4) >> 2] = 0;
            }
            if ((u | 0) == 1) {
                s = o | (n & 0);
                b = $ | 0 | 0;
                return ((T = s), b) | 0;
            } else {
                b = CG(u | 0) | 0;
                s = (c >>> (b >>> 0)) | 0;
                b = (c << (32 - b)) | (a >>> (b >>> 0)) | 0;
                return ((T = s), b) | 0;
            }
        } else {
            if (t) {
                if (i | 0) {
                    _[i >> 2] = (c >>> 0) % (u >>> 0);
                    _[(i + 4) >> 2] = 0;
                }
                s = 0;
                b = ((c >>> 0) / (u >>> 0)) >>> 0;
                return ((T = s), b) | 0;
            }
            if (!a) {
                if (i | 0) {
                    _[i >> 2] = 0;
                    _[(i + 4) >> 2] = (c >>> 0) % (f >>> 0);
                }
                s = 0;
                b = ((c >>> 0) / (f >>> 0)) >>> 0;
                return ((T = s), b) | 0;
            }
            t = (f - 1) | 0;
            if (!(t & f)) {
                if (i | 0) {
                    _[i >> 2] = $ | 0;
                    _[(i + 4) >> 2] = (t & c) | (n & 0);
                }
                s = 0;
                b = c >>> ((CG(f | 0) | 0) >>> 0);
                return ((T = s), b) | 0;
            }
            t = ((H(f | 0) | 0) - (H(c | 0) | 0)) | 0;
            if (t >>> 0 <= 30) {
                n = (t + 1) | 0;
                f = (31 - t) | 0;
                u = n;
                $ = (c << f) | (a >>> (n >>> 0));
                n = c >>> (n >>> 0);
                t = 0;
                f = a << f;
                break;
            }
            if (!i) {
                s = 0;
                b = 0;
                return ((T = s), b) | 0;
            }
            _[i >> 2] = $ | 0;
            _[(i + 4) >> 2] = o | (n & 0);
            s = 0;
            b = 0;
            return ((T = s), b) | 0;
        }
        while (0)
        if (!u) {
            c = f;
            o = 0;
            f = 0;
        } else {
            l = r | 0 | 0;
            a = v | (e & 0);
            c = CN(l | 0, a | 0, -1, -1) | 0;
            r = T;
            o = f;
            f = 0;
            do {
                e = o;
                o = (t >>> 31) | (o << 1);
                t = f | (t << 1);
                e = ($ << 1) | (e >>> 31) | 0;
                v = ($ >>> 31) | (n << 1) | 0;
                Cx(c | 0, r | 0, e | 0, v | 0) | 0;
                b = T;
                s = (b >> 31) | (((b | 0) < 0 ? -1 : 0) << 1);
                f = s & 1;
                $ = Cx(e | 0, v | 0, (s & l) | 0, (((((b | 0) < 0 ? -1 : 0) >> 31) | (((b | 0) < 0 ? -1 : 0) << 1)) & a) | 0) | 0;
                n = T;
                u = (u - 1) | 0;
            }while ((u | 0) != 0)
            c = o;
            o = 0;
        }
        u = 0;
        if (i | 0) {
            _[i >> 2] = $;
            _[(i + 4) >> 2] = n;
        }
        s = ((t | 0) >>> 31) | ((c | u) << 1) | (((u << 1) | (t >>> 31)) & 0) | o;
        b = (((t << 1) | (0 >>> 31)) & -2) | f;
        return ((T = s), b) | 0;
    }
    function CR($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        return CB($, n, r, e, 0) | 0;
    }
    function CY($) {
        $ = $ | 0;
        var n = 0, r = 0;
        r = (($ + 15) & -16) | 0;
        n = _[a >> 2] | 0;
        $ = (n + r) | 0;
        if ((((r | 0) > 0) & (($ | 0) < (n | 0))) | (($ | 0) < 0)) {
            W() | 0;
            $G(12);
            return -1;
        }
        _[a >> 2] = $;
        if (($ | 0) > (V() | 0) ? (Q() | 0) == 0 : 0) {
            _[a >> 2] = n;
            $G(12);
            return -1;
        }
        return n | 0;
    }
    function CU($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        var i = 0;
        if (((n | 0) < ($ | 0)) & (($ | 0) < ((n + r) | 0))) {
            i = $;
            n = (n + r) | 0;
            $ = ($ + r) | 0;
            while((r | 0) > 0){
                $ = ($ - 1) | 0;
                n = (n - 1) | 0;
                r = (r - 1) | 0;
                e[$ >> 0] = e[n >> 0] | 0;
            }
            $ = i;
        } else CE($, n, r) | 0;
        return $ | 0;
    }
    function Cj($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        var i = 0, t = 0;
        t = s;
        s = (s + 16) | 0;
        i = t | 0;
        CB($, n, r, e, i) | 0;
        s = t;
        return ((T = _[(i + 4) >> 2] | 0), _[i >> 2] | 0) | 0;
    }
    function Cz($) {
        $ = $ | 0;
        return ((($ & 255) << 24) | ((($ >> 8) & 255) << 16) | ((($ >> 16) & 255) << 8) | ($ >>> 24) | 0);
    }
    function CD($, n, r, e, i, _) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        _ = _ | 0;
        MN[$ & 1](n | 0, r | 0, e | 0, i | 0, _ | 0);
    }
    function CF($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        ML[$ & 1](n | 0, X(r));
    }
    function CK($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        MO[$ & 31](n | 0, +r);
    }
    function Cq($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        e = X(e);
        return X(MP[$ & 0](n | 0, X(r), X(e)));
    }
    function CH($, n) {
        $ = $ | 0;
        n = n | 0;
        ME[$ & 127](n | 0);
    }
    function CX($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        MG[$ & 31](n | 0, r | 0);
    }
    function CZ($, n) {
        $ = $ | 0;
        n = n | 0;
        return MB[$ & 31](n | 0) | 0;
    }
    function CJ($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        e = +e;
        i = i | 0;
        MR[$ & 1](n | 0, +r, +e, i | 0);
    }
    function CQ($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        e = +e;
        MY[$ & 1](n | 0, +r, +e);
    }
    function CV($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        return MU[$ & 7](n | 0, r | 0, e | 0) | 0;
    }
    function CW($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        return +Mj[$ & 1](n | 0, r | 0, e | 0);
    }
    function C9($, n) {
        $ = $ | 0;
        n = n | 0;
        return +Mz[$ & 15](n | 0);
    }
    function M$($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        return MD[$ & 1](n | 0, +r) | 0;
    }
    function M0($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        return MF[$ & 15](n | 0, r | 0) | 0;
    }
    function Mn($, n, r, e, i, _) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = +e;
        i = +i;
        _ = _ | 0;
        MK[$ & 1](n | 0, r | 0, +e, +i, _ | 0);
    }
    function Mr($, n, r, e, i, _, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        _ = _ | 0;
        t = t | 0;
        Mq[$ & 1](n | 0, r | 0, e | 0, i | 0, _ | 0, t | 0);
    }
    function Me($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        return +MH[$ & 7](n | 0, r | 0);
    }
    function Mi($) {
        $ = $ | 0;
        return MX[$ & 7]() | 0;
    }
    function M_($, n, r, e, i, _) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        _ = _ | 0;
        return MZ[$ & 1](n | 0, r | 0, e | 0, i | 0, _ | 0) | 0;
    }
    function Mt($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = +i;
        MJ[$ & 1](n | 0, r | 0, e | 0, +i);
    }
    function M2($, n, r, e, i, _, t) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = X(e);
        i = i | 0;
        _ = X(_);
        t = t | 0;
        MQ[$ & 1](n | 0, r | 0, X(e), i | 0, X(_), t | 0);
    }
    function Mu($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        MV[$ & 15](n | 0, r | 0, e | 0);
    }
    function Mf($) {
        $ = $ | 0;
        MW[$ & 0]();
    }
    function Mo($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = +e;
        M9[$ & 15](n | 0, r | 0, +e);
    }
    function Mc($, n, r) {
        $ = $ | 0;
        n = +n;
        r = +r;
        return g$[$ & 1](+n, +r) | 0;
    }
    function M6($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        g0[$ & 15](n | 0, r | 0, e | 0, i | 0);
    }
    function Ma($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        Z(0);
    }
    function M1($, n) {
        $ = $ | 0;
        n = X(n);
        Z(1);
    }
    function M4($, n) {
        $ = $ | 0;
        n = +n;
        Z(2);
    }
    function Ml($, n, r) {
        $ = $ | 0;
        n = X(n);
        r = X(r);
        Z(3);
        return n0;
    }
    function Mv($) {
        $ = $ | 0;
        Z(4);
    }
    function M7($, n) {
        $ = $ | 0;
        n = n | 0;
        Z(5);
    }
    function M5($) {
        $ = $ | 0;
        Z(6);
        return 0;
    }
    function Ms($, n, r, e) {
        $ = $ | 0;
        n = +n;
        r = +r;
        e = e | 0;
        Z(7);
    }
    function M3($, n, r) {
        $ = $ | 0;
        n = +n;
        r = +r;
        Z(8);
    }
    function Mb($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        Z(9);
        return 0;
    }
    function Mk($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        Z(10);
        return 0.0;
    }
    function Mh($) {
        $ = $ | 0;
        Z(11);
        return 0.0;
    }
    function Md($, n) {
        $ = $ | 0;
        n = +n;
        Z(12);
        return 0;
    }
    function Mw($, n) {
        $ = $ | 0;
        n = n | 0;
        Z(13);
        return 0;
    }
    function M8($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        e = +e;
        i = i | 0;
        Z(14);
    }
    function Mm($, n, r, e, i, _) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        _ = _ | 0;
        Z(15);
    }
    function My($, n) {
        $ = $ | 0;
        n = n | 0;
        Z(16);
        return 0.0;
    }
    function Mp() {
        Z(17);
        return 0;
    }
    function MC($, n, r, e, i) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        i = i | 0;
        Z(18);
        return 0;
    }
    function MM($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = +e;
        Z(19);
    }
    function Mg($, n, r, e, i, _) {
        $ = $ | 0;
        n = n | 0;
        r = X(r);
        e = e | 0;
        i = X(i);
        _ = _ | 0;
        Z(20);
    }
    function MA($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        Z(21);
    }
    function MI() {
        Z(22);
    }
    function MS($, n, r) {
        $ = $ | 0;
        n = n | 0;
        r = +r;
        Z(23);
    }
    function MT($, n) {
        $ = +$;
        n = +n;
        Z(24);
        return 0;
    }
    function Mx($, n, r, e) {
        $ = $ | 0;
        n = n | 0;
        r = r | 0;
        e = e | 0;
        Z(25);
    }
    var MN = [
        Ma,
        dJ
    ];
    var ML = [
        M1,
        ii
    ];
    var MO = [
        M4,
        iC,
        iM,
        ig,
        iA,
        iI,
        iS,
        iT,
        iN,
        iL,
        iP,
        iE,
        iG,
        iB,
        iR,
        iY,
        iU,
        ij,
        iz,
        M4,
        M4,
        M4,
        M4,
        M4,
        M4,
        M4,
        M4,
        M4,
        M4,
        M4,
        M4,
        M4, 
    ];
    var MP = [
        Ml
    ];
    var ME = [
        Mv,
        Cw,
        tW,
        t9,
        u$,
        cH,
        cX,
        cZ,
        hu,
        hf,
        ho,
        dL,
        dO,
        dP,
        pn,
        pr,
        pe,
        nf,
        io,
        i4,
        ix,
        iO,
        _P,
        _E,
        tP,
        u2,
        ud,
        uz,
        ft,
        fp,
        fK,
        ou,
        om,
        oz,
        c_,
        ch,
        cE,
        aa,
        aM,
        aD,
        lt,
        ld,
        lG,
        vr,
        vs,
        vT,
        vJ,
        i0,
        sp,
        sj,
        b2,
        bm,
        bR,
        k_,
        kv,
        ks,
        kL,
        kE,
        kW,
        ha,
        hl,
        hS,
        hZ,
        uu,
        wH,
        mm,
        mR,
        y0,
        yd,
        yE,
        yH,
        yJ,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv,
        Mv, 
    ];
    var MG = [
        M7,
        il,
        iv,
        is,
        i3,
        ib,
        ik,
        ih,
        id,
        im,
        iy,
        ip,
        _e,
        _t,
        _2,
        _u,
        _f,
        _o,
        _c,
        _l,
        _s,
        _F,
        vt,
        vk,
        bM,
        wJ,
        dn,
        m4,
        M7,
        M7,
        M7,
        M7, 
    ];
    var MB = [
        M5,
        pE,
        iu,
        iq,
        iJ,
        iQ,
        iV,
        iW,
        i9,
        _$,
        _n,
        _r,
        _v,
        _7,
        _G,
        vW,
        bz,
        hN,
        m$,
        mn,
        M5,
        M5,
        M5,
        M5,
        M5,
        M5,
        M5,
        M5,
        M5,
        M5,
        M5,
        M5, 
    ];
    var MR = [
        Ms,
        _B
    ];
    var MY = [
        M3,
        h0
    ];
    var MU = [
        Mb,
        pG,
        pB,
        pD,
        fA,
        av,
        sA,
        yi
    ];
    var Mj = [
        Mk,
        cf
    ];
    var Mz = [
        Mh,
        _i,
        __,
        _6,
        _R,
        _Y,
        _U,
        _j,
        _z,
        _D,
        Mh,
        Mh,
        Mh,
        Mh,
        Mh,
        Mh
    ];
    var MD = [
        Md,
        ka
    ];
    var MF = [
        Mw,
        C8,
        _5,
        tU,
        uq,
        fZ,
        o6,
        cY,
        aS,
        vO,
        i_,
        mz,
        Mw,
        Mw,
        Mw,
        Mw
    ];
    var MK = [
        M8,
        uy
    ];
    var Mq = [
        Mm,
        yy
    ];
    var MH = [
        My,
        _a,
        _K,
        _q,
        _H,
        cm,
        My,
        My
    ];
    var MX = [
        Mp,
        _X,
        it,
        e9,
        kd,
        kY,
        h3,
        y9
    ];
    var MZ = [
        MC,
        ei
    ];
    var MJ = [
        MM,
        lo
    ];
    var MQ = [
        Mg,
        _b
    ];
    var MV = [
        MA,
        iH,
        _0,
        _1,
        _4,
        fo,
        oM,
        ly,
        lU,
        ie,
        wk,
        mM,
        yY,
        MA,
        MA,
        MA
    ];
    var MW = [
        MI
    ];
    var M9 = [
        MS,
        i7,
        i5,
        iw,
        i8,
        iD,
        iF,
        iK,
        aH,
        sK,
        ku,
        MS,
        MS,
        MS,
        MS,
        MS
    ];
    var g$ = [
        MT,
        h_
    ];
    var g0 = [
        Mx,
        oq,
        s_,
        bc,
        bQ,
        kC,
        kK,
        hm,
        h9,
        mt,
        pf,
        Mx,
        Mx,
        Mx,
        Mx,
        Mx
    ];
    return {
        _llvm_bswap_i32: Cz,
        dynCall_idd: Mc,
        dynCall_i: Mi,
        _i64Subtract: Cx,
        ___udivdi3: CR,
        dynCall_vif: CF,
        setThrew: n_,
        dynCall_viii: Mu,
        _bitshift64Lshr: CP,
        _bitshift64Shl: CO,
        dynCall_vi: CH,
        dynCall_viiddi: Mn,
        dynCall_diii: CW,
        dynCall_iii: M0,
        _memset: CL,
        _sbrk: CY,
        _memcpy: CE,
        __GLOBAL__sub_I_Yoga_cpp: eW,
        dynCall_vii: CX,
        ___uremdi3: Cj,
        dynCall_vid: CK,
        stackAlloc: nn,
        _nbind_init: ph,
        getTempRet0: n2,
        dynCall_di: C9,
        dynCall_iid: M$,
        setTempRet0: nt,
        _i64Add: CN,
        dynCall_fiff: Cq,
        dynCall_iiii: CV,
        _emscripten_get_global_libc: pP,
        dynCall_viid: Mo,
        dynCall_viiid: Mt,
        dynCall_viififi: M2,
        dynCall_ii: CZ,
        __GLOBAL__sub_I_Binding_cc: wR,
        dynCall_viiii: M6,
        dynCall_iiiiii: M_,
        stackSave: nr,
        dynCall_viiiii: CD,
        __GLOBAL__sub_I_nbind_cc: _Z,
        dynCall_vidd: CQ,
        _free: pO,
        runPostSets: CT,
        dynCall_viiiiii: Mr,
        establishStackSpace: ni,
        _memmove: CU,
        stackRestore: ne,
        _malloc: pL,
        __GLOBAL__sub_I_common_cc: hU,
        dynCall_viddi: CJ,
        dynCall_dii: Me,
        dynCall_v: Mf
    };
}
