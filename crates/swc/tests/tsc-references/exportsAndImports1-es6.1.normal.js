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
    v: ()=>v,
    f: ()=>f,
    C: ()=>C,
    E: ()=>E,
    D: ()=>D,
    M: ()=>M,
    a: ()=>a
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
    v: ()=>_t1.v,
    f: ()=>_t1.f,
    C: ()=>_t1.C,
    I: ()=>_t1.I,
    E: ()=>_t1.E,
    D: ()=>_t1.D,
    M: ()=>_t1.M,
    N: ()=>_t1.N,
    T: ()=>_t1.T,
    a: ()=>_t1.a
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
    v: ()=>_t1.v,
    f: ()=>_t1.f,
    C: ()=>_t1.C,
    I: ()=>_t1.I,
    E: ()=>_t1.E,
    D: ()=>_t1.D,
    M: ()=>_t1.M,
    N: ()=>_t1.N,
    T: ()=>_t1.T,
    a: ()=>_t1.a
});
const _t1 = require("./t1");
