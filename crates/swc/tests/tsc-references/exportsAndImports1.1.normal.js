//// [exportsAndImports1.ts]
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
    get D () {
        return D;
    },
    get E () {
        return E;
    },
    get M () {
        return M;
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
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
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
var a = M.x;
var M;
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
});
var _t1 = require("./t1");
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
});
var _t1 = require("./t1");
