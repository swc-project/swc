//// [additionOperatorWithAnyAndEveryType.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function foo() {}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    C.foo = function foo() {};
    return C;
}();
var E = /*#__PURE__*/ function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
    return E;
}(E || {});
(function(M) {})(M || (M = {}));
var a;
var b;
var c;
var d;
var e;
// any as left operand, result is type Any except plusing string
var r1 = a + a;
var r2 = a + b;
var r3 = a + c;
var r4 = a + d;
var r5 = a + e;
// any as right operand, result is type Any except plusing string
var r6 = b + a;
var r7 = c + a;
var r8 = d + a;
var r9 = e + a;
// other cases
var r10 = a + foo;
var r11 = a + foo();
var r12 = a + C;
var r13 = a + new C();
var r14 = a + E;
var r15 = a + 0;
var r16 = a + M;
var r17 = a + '';
var r18 = a + 123;
var r19 = a + {
    a: ''
};
var r20 = a + function(a) {
    return a;
};
var M;
