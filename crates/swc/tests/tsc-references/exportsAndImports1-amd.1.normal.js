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
    "@swc/helpers/_/_class_call_check"
], function(require, exports, _class_call_check) {
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
        C: function() {
            return C;
        },
        D: function() {
            return D;
        },
        E: function() {
            return E;
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
    var v = 1;
    function f() {}
    var C = function C() {
        "use strict";
        _class_call_check._(this, C);
    };
    var E = /*#__PURE__*/ function(E) {
        E[E["A"] = 0] = "A";
        E[E["B"] = 1] = "B";
        E[E["C"] = 2] = "C";
        return E;
    }(E || {});
    var D = /*#__PURE__*/ function(D) {
        D[D["A"] = 0] = "A";
        D[D["B"] = 1] = "B";
        D[D["C"] = 2] = "C";
        return D;
    }(D || {});
    (function(M) {})(M || (M = {}));
    var a = M.x;
    var M;
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
