//// [exportsAndImports3-es6.ts]
"use strict";
//// [t1.ts]
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
    C1: function() {
        return C;
    },
    D: function() {
        return D;
    },
    D1: function() {
        return D;
    },
    E: function() {
        return E;
    },
    E1: function() {
        return E;
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
var v = 1;
function f() {}
class C {
}
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
    return E;
}({});
var D = /*#__PURE__*/ function(D) {
    D[D["A"] = 0] = "A";
    D[D["B"] = 1] = "B";
    D[D["C"] = 2] = "C";
    return D;
}({});
(function(M) {})(M || (M = {}));
const a = M.x;
var M;
//// [t2.ts]
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
const _t1 = require("./t1");
//// [t3.ts]
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
const _t1 = require("./t1");
