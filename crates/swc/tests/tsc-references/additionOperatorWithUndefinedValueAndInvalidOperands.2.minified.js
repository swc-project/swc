//// [additionOperatorWithUndefinedValueAndInvalidOperands.ts]
function foo() {}
var a, b, c, d, r1 = (void 0) + a, r2 = (void 0) + b, r3 = (void 0) + c, r4 = a + void 0, r5 = b + void 0, r6 = (void 0) + c, r7 = (void 0) + d, r8 = NaN, r9 = (void 0) + {
    a: ""
}, r10 = (void 0) + foo(), r11 = (void 0) + function() {};
