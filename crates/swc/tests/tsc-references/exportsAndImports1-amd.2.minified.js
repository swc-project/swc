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
        C: function() {
            return C;
        },
        D: function() {
            return D1;
        },
        E: function() {
            return E1;
        },
        M: function() {
            return M;
        },
        a: function() {
            return a;
        },
        f: function() {
            return f;
        },
        v: function() {
            return v;
        }
    });
    var E, D, E1, D1, M, v = 1;
    function f() {}
    var C = function C() {
        _class_call_check._(this, C);
    };
    (E = E1 = {})[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C", (D = D1 = {})[D.A = 0] = "A", D[D.B = 1] = "B", D[D.C = 2] = "C";
    var a = (M = {}).x;
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
            return _t1.C;
        },
        D: function() {
            return _t1.D;
        },
        E: function() {
            return _t1.E;
        },
        I: function() {
            return _t1.I;
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
        },
        f: function() {
            return _t1.f;
        },
        v: function() {
            return _t1.v;
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
            return _t1.C;
        },
        D: function() {
            return _t1.D;
        },
        E: function() {
            return _t1.E;
        },
        I: function() {
            return _t1.I;
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
        },
        f: function() {
            return _t1.f;
        },
        v: function() {
            return _t1.v;
        }
    });
});
