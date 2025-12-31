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
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get C () {
        return C;
    },
    get C1 () {
        return C;
    },
    get D () {
        return D;
    },
    get D1 () {
        return D;
    },
    get E () {
        return E;
    },
    get E1 () {
        return E;
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
const a = M.x;
var M, N;
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
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
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
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
});
const _t1 = require("./t1");
