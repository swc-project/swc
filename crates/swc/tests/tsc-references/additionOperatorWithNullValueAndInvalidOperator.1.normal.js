//// [additionOperatorWithNullValueAndInvalidOperator.ts]
// If one operand is the null or undefined value, it is treated as having the type of the other operand.
function foo() {
    return undefined;
}
var a;
var b;
var c;
var d;
// null + boolean/Object
var r1 = null + a;
var r2 = null + b;
var r3 = null + c;
var r4 = a + null;
var r5 = b + null;
var r6 = null + c;
// other cases
var r7 = null + d;
var r8 = null + true;
var r9 = null + {
    a: ''
};
var r10 = null + foo();
var r11 = null + function() {};
