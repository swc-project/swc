//// [exportsAndImports3-amd.ts]
define([
    "require"
], function(require) {});
//// [t1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_class_call_check"
], function(require, exports, _class_call_check) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        C: function() {
            return C;
        },
        C1: function() {
            return C;
        },
        D: function() {
            return D1;
        },
        D1: function() {
            return D1;
        },
        E: function() {
            return E1;
        },
        E1: function() {
            return E1;
        },
        M: function() {
            return M;
        },
        M1: function() {
            return M;
        },
        a: function() {
            return a;
        },
        a1: function() {
            return a;
        },
        f: function() {
            return f;
        },
        f1: function() {
            return f;
        },
        v: function() {
            return v;
        },
        v1: function() {
            return v;
        }
    });
    var E, D, M, v = 1;
    function f() {}
    var C = function C() {
        _class_call_check._(this, C);
    }, E1 = ((E = {})[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C", E), D1 = ((D = {})[D.A = 0] = "A", D[D.B = 1] = "B", D[D.C = 2] = "C", D);
    M || (M = {});
    var a = M.x;
});
//// [t2.ts]
define([
    "require",
    "exports",
    "./t1"
], function(require, exports, _t1) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        C: function() {
            return _t1.C1;
        },
        D: function() {
            return _t1.D1;
        },
        E: function() {
            return _t1.E1;
        },
        I: function() {
            return _t1.I1;
        },
        M: function() {
            return _t1.M1;
        },
        N: function() {
            return _t1.N1;
        },
        T: function() {
            return _t1.T1;
        },
        a: function() {
            return _t1.a1;
        },
        f: function() {
            return _t1.f1;
        },
        v: function() {
            return _t1.v1;
        }
    });
});
//// [t3.ts]
define([
    "require",
    "exports",
    "./t1"
], function(require, exports, _t1) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), function(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: !0,
            get: all[name]
        });
    }(exports, {
        C: function() {
            return _t1.C1;
        },
        D: function() {
            return _t1.D1;
        },
        E: function() {
            return _t1.E1;
        },
        I: function() {
            return _t1.I1;
        },
        M: function() {
            return _t1.M1;
        },
        N: function() {
            return _t1.N1;
        },
        T: function() {
            return _t1.T1;
        },
        a: function() {
            return _t1.a1;
        },
        f: function() {
            return _t1.f1;
        },
        v: function() {
            return _t1.v1;
        }
    });
});
