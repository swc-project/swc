// If one operand is the null or undefined value, it is treated as having the type of the
// other operand.
var E;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
})(E || (E = {}));
var a;
var b;
// operator **
var r1 = Math.pow(null, a);
var r2 = Math.pow(null, b);
var r3 = Math.pow(null, 1);
var r4 = Math.pow(null, E.a);
var r5 = Math.pow(a, null);
var r6 = Math.pow(b, null);
var r7 = Math.pow(0, null);
var r8 = Math.pow(E.b, null);
