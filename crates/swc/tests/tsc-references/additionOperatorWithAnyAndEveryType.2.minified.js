//// [additionOperatorWithAnyAndEveryType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {}
var E, M, a, b, c, d, e, C = function() {
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
var r1 = a + a, r2 = a + b, r3 = a + c, r4 = a + d, r5 = a + e, r6 = b + a, r7 = c + a, r8 = d + a, r9 = e + a, r10 = a + foo, r11 = a + foo(), r12 = a + C, r13 = a + new C(), r14 = a + E, r15 = a + E.a, r16 = a + M, r17 = a + "", r18 = a + 123, r19 = a + {
    a: ""
}, r20 = a + function(a) {
    return a;
};
