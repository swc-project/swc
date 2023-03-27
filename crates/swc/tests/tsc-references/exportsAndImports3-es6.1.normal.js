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
    v: ()=>_t_1.v1,
    f: ()=>_t_1.f1,
    C: ()=>_t_1.C1,
    I: ()=>_t_1.I1,
    E: ()=>_t_1.E1,
    D: ()=>_t_1.D1,
    M: ()=>_t_1.M1,
    N: ()=>_t_1.N1,
    T: ()=>_t_1.T1,
    a: ()=>_t_1.a1
});
const _t_1 = require("./t1");
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
    v: ()=>_t_1.v1,
    f: ()=>_t_1.f1,
    C: ()=>_t_1.C1,
    I: ()=>_t_1.I1,
    E: ()=>_t_1.E1,
    D: ()=>_t_1.D1,
    M: ()=>_t_1.M1,
    N: ()=>_t_1.N1,
    T: ()=>_t_1.T1,
    a: ()=>_t_1.a1
});
const _t_1 = require("./t1");
