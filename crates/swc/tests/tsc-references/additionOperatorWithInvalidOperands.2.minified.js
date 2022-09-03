//// [additionOperatorWithInvalidOperands.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {}
var E, M, a, b, c, d, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.foo = function() {}, C;
}();
!function(E) {
    E[E.a = 0] = "a", E[E.b = 1] = "b", E[E.c = 2] = "c";
}(E || (E = {})), function(M) {
    var a;
    M.a = a;
}(M || (M = {}));
var r1 = a + a, r2 = a + b, r3 = a + c, r4 = b + a, r5 = b + b, r6 = b + c, r7 = c + a, r8 = c + b, r9 = c + c, r10 = a + !0, r11 = 1, r12 = 124, r13 = {} + {}, r14 = b + d, r15 = b + foo, r16 = b + foo(), r17 = b + C, r18 = E.a + new C(), r19 = E.a + C.foo(), r20 = E.a + M;
