//// [newOperatorConformance.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var anyCtor, anyCtor1, nestedCtor, a, c1, d, t, C0 = function C0() {
    "use strict";
    _class_call_check(this, C0);
}, C1 = function C1(n, s) {
    "use strict";
    _class_call_check(this, C1);
}, T = function T(n) {
    "use strict";
    _class_call_check(this, T);
}, a = new C0, c1 = new T, d = new anyCtor, d = new anyCtor1(void 0);
function newFn1(s) {
    new s;
}
function newFn2(s) {
    new s(32);
}
function fnVoid() {}
var t = new fnVoid(), nested = new new new nestedCtor()()(), n = new nested(), n = new nested();
