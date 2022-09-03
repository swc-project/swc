//// [callSignatureWithoutReturnTypeAnnotationInference.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _type_of from "@swc/helpers/src/_type_of.mjs";
function foo(x) {
    return 1;
}
var M, e1, r = foo(1);
function foo2(x) {
    return foo(x);
}
var r2 = foo2(1);
function foo3() {
    return foo3();
}
var r3 = foo3();
function foo4(x) {
    return x;
}
var r4 = foo4(1);
function foo5(x) {
    return 1;
}
var r5 = foo5(1);
function foo6(x) {
    return [];
}
var r6 = foo6(1);
function foo7(x) {
    return void 0 === x ? "undefined" : _type_of(x);
}
var r7 = foo7(1);
function foo8(x) {
    return {
        x: x
    };
}
var r8 = foo8(1);
function foo9(x) {}
var r9 = foo9(1), C = function C() {
    "use strict";
    _class_call_check(this, C);
};
function foo10(x) {}
var r10 = foo10(1);
function foo11() {
    return M;
}
!function(M) {
    M.x = 1;
    var C = function C() {
        "use strict";
        _class_call_check(this, C);
    };
    M.C = C;
}(M || (M = {}));
var r11 = foo11();
function foo12() {}
var r12 = foo12();
function m1() {
    return 1;
}
function foo13() {
    return m1;
}
(m1 || (m1 = {})).y = 2;
var r13 = foo13(), c1 = function c1(x) {
    "use strict";
    _class_call_check(this, c1);
};
function foo14() {
    return c1;
}
(c1 || (c1 = {})).x = 1;
var r14 = foo14();
function foo15() {
    return e1;
}
!function(e1) {
    e1[e1.A = 0] = "A";
}(e1 || (e1 = {})), (e1 || (e1 = {})).y = 1;
var r15 = foo15();
