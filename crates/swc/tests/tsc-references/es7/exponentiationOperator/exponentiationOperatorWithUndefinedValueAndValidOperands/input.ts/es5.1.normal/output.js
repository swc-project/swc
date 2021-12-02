var // If one operand is the undefined or undefined value, it is treated as having the type of the
// other operand.
E;
(function(E1) {
    E1[E1["a"] = 0] = "a";
    E1[E1["b"] = 1] = "b";
})(E || (E = {
}));
var a;
var b;
// operator *
var rk1 = Math.pow(undefined, a);
var rk2 = Math.pow(undefined, b);
var rk3 = Math.pow(undefined, 1);
var rk4 = Math.pow(undefined, E.a);
var rk5 = Math.pow(a, undefined);
var rk6 = Math.pow(b, undefined);
var rk7 = Math.pow(0, undefined);
var rk8 = Math.pow(E.b, undefined);
