//// [exportsAndImports1-amd.ts]
define([
    "require"
], function(require) {
    "use strict";
});
//// [t1.ts]
define([
    "require",
    "exports",
    "@swc/helpers/src/_class_call_check.mjs"
], function(require, exports, _classCallCheck) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
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
    });
    _classCallCheck = _classCallCheck.default;
    var v = 1;
    function f() {}
    var C = function C() {
        "use strict";
        _classCallCheck(this, C);
    };
    var E;
    (function(E) {
        E[E["A"] = 0] = "A";
        E[E["B"] = 1] = "B";
        E[E["C"] = 2] = "C";
    })(E || (E = {}));
    var D;
    (function(D) {
        D[D["A"] = 0] = "A";
        D[D["B"] = 1] = "B";
        D[D["C"] = 2] = "C";
    })(D || (D = {}));
    var M;
    (function(M) {
        var x;
        M.x = x;
    })(M || (M = {}));
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
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
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
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: all[name]
        });
    }
    _export(exports, {
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
