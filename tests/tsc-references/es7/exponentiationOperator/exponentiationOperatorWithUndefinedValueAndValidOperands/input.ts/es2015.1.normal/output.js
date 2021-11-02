var // If one operand is the undefined or undefined value, it is treated as having the type of the
// other operand.
E1;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
})(E1 || (E1 = {
}));
var a;
var b;
// operator *
var rk1 = Math.pow(undefined, a);
var rk2 = Math.pow(undefined, b);
var rk3 = Math.pow(undefined, 1);
var rk4 = Math.pow(undefined, E1.a);
var rk5 = Math.pow(a, undefined);
var rk6 = Math.pow(b, undefined);
var rk7 = Math.pow(0, undefined);
var rk8 = Math.pow(E1.b, undefined);
