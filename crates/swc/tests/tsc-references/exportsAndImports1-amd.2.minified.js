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
    });
    var E, all = {
        get C () {
            return C;
        },
        get D () {
            return D;
        },
        get E () {
            return E1;
        },
        get M () {
            return M;
        },
        get N () {
            return N;
        },
        get a () {
            return a;
        },
        get f () {
            return f;
        },
        get v () {
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
    }, E1 = ((E = E1 || {})[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C", E);
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
            return _t1.C;
        },
        get D () {
            return _t1.D;
        },
        get E () {
            return _t1.E;
        },
        get I () {
            return _t1.I;
        },
        get M () {
            return _t1.M;
        },
        get N () {
            return _t1.N;
        },
        get T () {
            return _t1.T;
        },
        get a () {
            return _t1.a;
        },
        get f () {
            return _t1.f;
        },
        get v () {
            return _t1.v;
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
            return _t1.C;
        },
        get D () {
            return _t1.D;
        },
        get E () {
            return _t1.E;
        },
        get I () {
            return _t1.I;
        },
        get M () {
            return _t1.M;
        },
        get N () {
            return _t1.N;
        },
        get T () {
            return _t1.T;
        },
        get a () {
            return _t1.a;
        },
        get f () {
            return _t1.f;
        },
        get v () {
            return _t1.v;
        }
    };
    for(var name in all)Object.defineProperty(exports, name, {
        enumerable: !0,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
});
