//// [additionOperatorWithStringAndEveryType.ts]
var E;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
})(E || (E = {}));
var a;
var b;
var c;
var d;
var e;
var f;
var g;
var x;
// string could plus every type, and the result is always string
// string as left operand
var r1 = x + a;
var r2 = x + b;
var r3 = x + c;
var r4 = x + d;
var r5 = x + e;
var r6 = x + f;
var r7 = x + g;
// string as right operand
var r8 = a + x;
var r9 = b + x;
var r10 = c + x;
var r11 = d + x;
var r12 = e + x;
var r13 = f + x;
var r14 = g + x;
// other cases
var r15 = x + E;
var r16 = x + 0;
var r17 = x + "";
var r18 = x + 0;
var r19 = x + {
    a: ""
};
var r20 = x + [];
