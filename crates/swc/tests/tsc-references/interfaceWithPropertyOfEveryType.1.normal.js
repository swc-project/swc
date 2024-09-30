//// [interfaceWithPropertyOfEveryType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
function f1() {}
(function(M) {
    M.y = 1;
})(M || (M = {}));
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    return E;
}(E || {});
var a = {
    a: 1,
    b: '',
    c: true,
    d: {},
    e: null,
    f: [
        1
    ],
    g: {},
    h: function(x) {
        return 1;
    },
    i: function(x) {
        return x;
    },
    j: null,
    k: new C(),
    l: f1,
    m: M,
    n: {},
    o: 0
};
var M;
