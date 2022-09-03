//// [functionConstraintSatisfaction2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x) {
    return x;
}
function foo2(x) {
    return x;
}
foo(1), foo(function() {}, 1), foo(1, function() {});
var b, b2, f2, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
}, r = foo2(Function()), r2 = foo2(function(x) {
    return x;
}), r6 = foo2(C), r7 = foo2(b), r8 = foo2(function(x) {
    return x;
}), r11 = foo2(function(x, y) {
    return x;
}), r13 = foo2(C2), r14 = foo2(b2), r16 = foo2(f2);
function fff(x, y) {
    foo2(x), foo2(y);
}
