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
    });
    var E, all = {
        get C () {
            return C;
        },
        get C1 () {
            return C;
        },
        get D1 () {
            return D;
        },
        get E () {
            return E1;
        },
        get E1 () {
            return E1;
        },
        get M () {
            return M;
        },
        get M1 () {
            return M;
        },
        get N () {
            return N;
        },
        get N1 () {
            return N;
        },
        get a () {
            return a;
        },
        get a1 () {
            return a;
        },
        get f () {
            return f;
        },
        get f1 () {
            return f;
        },
        get v () {
            return v;
        },
        get v1 () {
            return v;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
    var M, N, v = 1;
    function f() {}
    var C = function C() {
        _class_call_check._(this, C);
    }, E1 = ((E = {})[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C", E);
    M || (M = {}), N || (N = {});
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
    });
    var all = {
        get C () {
            return _t1.C1;
        },
        get D () {
            return _t1.D1;
        },
        get E () {
            return _t1.E1;
        },
        get I () {
            return _t1.I1;
        },
        get M () {
            return _t1.M1;
        },
        get N () {
            return _t1.N1;
        },
        get T () {
            return _t1.T1;
        },
        get a () {
            return _t1.a1;
        },
        get f () {
            return _t1.f1;
        },
        get v () {
            return _t1.v1;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
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
    });
    var all = {
        get C () {
            return _t1.C1;
        },
        get D () {
            return _t1.D1;
        },
        get E () {
            return _t1.E1;
        },
        get I () {
            return _t1.I1;
        },
        get M () {
            return _t1.M1;
        },
        get N () {
            return _t1.N1;
        },
        get T () {
            return _t1.T1;
        },
        get a () {
            return _t1.a1;
        },
        get f () {
            return _t1.f1;
        },
        get v () {
            return _t1.v1;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
});
