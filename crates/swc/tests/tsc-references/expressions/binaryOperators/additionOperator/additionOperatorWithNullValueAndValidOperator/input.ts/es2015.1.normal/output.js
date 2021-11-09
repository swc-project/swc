var // If one operand is the null or undefined value, it is treated as having the type of the other operand.
E1;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
})(E1 || (E1 = {
}));
var a;
var b;
var c;
var d;
// null + any
var r1 = null + a;
var r2 = a + null;
// null + number/enum
var r3 = null + b;
var r4 = null + 1;
var r5 = null + c;
var r6 = null + E1.a;
var r7 = null + E1['a'];
var r8 = b + null;
var r9 = 1 + null;
var r10 = c + null;
var r11 = E1.a + null;
var r12 = E1['a'] + null;
// null + string
var r13 = null + d;
var r14 = null + '';
var r15 = d + null;
var r16 = '' + null;
