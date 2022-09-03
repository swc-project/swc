//// [interfaceWithPropertyOfEveryType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var M, E, C = function C() {
    "use strict";
    _class_call_check(this, C);
};
function f1() {}
(M || (M = {})).y = 1, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {}));
var a = {
    a: 1,
    b: "",
    c: !0,
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
    o: E.A
};
