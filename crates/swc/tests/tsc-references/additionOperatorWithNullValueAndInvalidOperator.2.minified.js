//// [additionOperatorWithNullValueAndInvalidOperator.ts]
function foo() {}
var a, b, c, d, r1 = null + a, r2 = null + b, r3 = null + c, r4 = a + null, r5 = b + null, r6 = null + c, r7 = null + d, r8 = 1, r9 = null + {
    a: ""
}, r10 = null + foo(), r11 = null + function() {};
