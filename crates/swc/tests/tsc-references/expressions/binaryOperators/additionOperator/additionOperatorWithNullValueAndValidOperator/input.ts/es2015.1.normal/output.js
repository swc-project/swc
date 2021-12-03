var // If one operand is the null or undefined value, it is treated as having the type of the other operand.
E;
(function(E1) {
    E1[E1["a"] = 0] = "a";
    E1[E1["b"] = 1] = "b";
    E1[E1["c"] = 2] = "c";
})(E || (E = {
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
var r6 = null + E.a;
var r7 = null + E['a'];
var r8 = b + null;
var r9 = 1 + null;
var r10 = c + null;
var r11 = E.a + null;
var r12 = E['a'] + null;
// null + string
var r13 = null + d;
var r14 = null + '';
var r15 = d + null;
var r16 = '' + null;
