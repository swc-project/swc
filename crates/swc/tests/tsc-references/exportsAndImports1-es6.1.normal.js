//// [exportsAndImports1-es6.ts]
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
class C {
}
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
const _t1 = require("./t1");
