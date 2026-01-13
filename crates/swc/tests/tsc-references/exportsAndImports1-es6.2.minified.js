//// [exportsAndImports1-es6.ts]
//// [t1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var E, target = exports, all = {
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
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
var M, v = 1;
function f() {}
class C {
}
var E1 = ((E = E1 || {})[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C", E);
M || (M = {});
let a = M.x;
//// [t2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
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
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
let _t1 = require("./t1");
//// [t3.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
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
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
let _t1 = require("./t1");
