//// [exportsAndImports1-amd.ts]
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
        v: function() {
            return v;
        },
        f: function() {
            return f;
        },
        C: function() {
            return C;
        },
        E: function() {
            return E1;
        },
        D: function() {
            return D1;
        },
        M: function() {
            return M;
        },
        a: function() {
            return a;
        }
    });
    var E, D, x, E1, D1, M, v = 1;
    function f() {}
    var C = function C() {
        _class_call_check._(this, C);
    };
    (E = E1 || (E1 = {}))[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C", (D = D1 || (D1 = {}))[D.A = 0] = "A", D[D.B = 1] = "B", D[D.C = 2] = "C", (M || (M = {})).x = x;
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
        v: function() {
            return _t1.v;
        },
        f: function() {
            return _t1.f;
        },
        C: function() {
            return _t1.C;
        },
        I: function() {
            return _t1.I;
        },
        E: function() {
            return _t1.E;
        },
        D: function() {
            return _t1.D;
        },
        M: function() {
            return _t1.M;
        },
        N: function() {
            return _t1.N;
        },
        T: function() {
            return _t1.T;
        },
        a: function() {
            return _t1.a;
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
        v: function() {
            return _t1.v;
        },
        f: function() {
            return _t1.f;
        },
        C: function() {
            return _t1.C;
        },
        I: function() {
            return _t1.I;
        },
        E: function() {
            return _t1.E;
        },
        D: function() {
            return _t1.D;
        },
        M: function() {
            return _t1.M;
        },
        N: function() {
            return _t1.N;
        },
        T: function() {
            return _t1.T;
        },
        a: function() {
            return _t1.a;
        }
    });
});
