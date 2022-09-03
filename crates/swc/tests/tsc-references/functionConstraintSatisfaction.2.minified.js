//// [functionConstraintSatisfaction.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x) {
    return x;
}
var i, a, b, c, i2, a2, b2, c2, f2, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, r = foo(Function()), r1 = foo(function(x) {
    return x;
}), r2 = foo(function(x) {
    return x;
}), r3 = foo(function(x) {
    return x;
}), r4 = foo(function(x) {
    return x;
}), r5 = foo(i), r6 = foo(C), r7 = foo(b), r8 = foo(c), C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
}, r9 = foo(function(x) {
    return x;
}), r10 = foo(function(x) {
    return x;
}), r11 = foo(function(x) {
    return x;
}), r12 = foo(function(x, y) {
    return x;
}), r13 = foo(i2), r14 = foo(C2), r15 = foo(b2), r16 = foo(c2), r17 = foo(f2);
function foo2(x, y) {
    foo(x), foo(y);
}
