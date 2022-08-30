//// [exportsAndImports1-amd.ts]
define([
    "require"
], function(require) {});
//// [t1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
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
            return E;
        },
        D: function() {
            return D;
        },
        M: function() {
            return M;
        },
        a: function() {
            return a;
        }
    }), _classCallCheck = _classCallCheck.default;
    var E, D, M, v = 1;
    function f() {}
    var E1, D1, x, C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    (E1 = E || (E = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", (D1 = D || (D = {}))[D1.A = 0] = "A", D1[D1.B = 1] = "B", D1[D1.C = 2] = "C", (M || (M = {})).x = x;
    var a = M.x;
});
//// [t2.ts]
define([
    "require",
    "exports",
    "./t1"
], function(require, exports, _t1) {
    "use strict";
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
    "use strict";
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
