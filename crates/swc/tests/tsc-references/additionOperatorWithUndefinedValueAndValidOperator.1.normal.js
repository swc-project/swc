//// [additionOperatorWithUndefinedValueAndValidOperator.ts]
// If one operand is the null or undefined value, it is treated as having the type of the other operand.
var E = /*#__PURE__*/ function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
    return E;
}(E || {});
var a;
var b;
var c;
var d;
// undefined + any
var r1 = undefined + a;
var r2 = a + undefined;
// undefined + number/enum
var r3 = undefined + b;
var r4 = undefined + 1;
var r5 = undefined + c;
var r6 = undefined + 0;
var r7 = undefined + 0;
var r8 = b + undefined;
var r9 = 1 + undefined;
var r10 = c + undefined;
var r11 = 0 + undefined;
var r12 = 0 + undefined;
// undefined + string
var r13 = undefined + d;
var r14 = undefined + '';
var r15 = d + undefined;
var r16 = '' + undefined;
