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
var v = 1;
function f() {}
class C {
}
var E;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    E[E["C"] = 2] = "C";
})(E || (E = {}));
var D;
var M;
(function(M) {})(M || (M = {}));
const a = M.x;
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
const _t1 = require("./t1");
