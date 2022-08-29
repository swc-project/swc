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
    E: ()=>E,
    D: ()=>D,
    M: ()=>M,
    v: ()=>v,
    f: ()=>f,
    C: ()=>C,
    a: ()=>a,
    v1: ()=>v,
    f1: ()=>f,
    C1: ()=>C,
    E1: ()=>E,
    D1: ()=>D,
    M1: ()=>M,
    N1: ()=>N,
    a1: ()=>a
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
    v: ()=>_t1.v1,
    f: ()=>_t1.f1,
    C: ()=>_t1.C1,
    I: ()=>_t1.I1,
    E: ()=>_t1.E1,
    D: ()=>_t1.D1,
    M: ()=>_t1.M1,
    N: ()=>_t1.N1,
    T: ()=>_t1.T1,
    a: ()=>_t1.a1
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
    v: ()=>_t1.v1,
    f: ()=>_t1.f1,
    C: ()=>_t1.C1,
    I: ()=>_t1.I1,
    E: ()=>_t1.E1,
    D: ()=>_t1.D1,
    M: ()=>_t1.M1,
    N: ()=>_t1.N1,
    T: ()=>_t1.T1,
    a: ()=>_t1.a1
});
const _t1 = require("./t1");
