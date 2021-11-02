var // operands of an enum type are treated as having the primitive type Number.
E1;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
})(E1 || (E1 = {
}));
var F1;
(function(F) {
    F[F["c"] = 0] = "c";
    F[F["d"] = 1] = "d";
})(F1 || (F1 = {
}));
var a;
var b;
var c;
// operator **
var r1 = Math.pow(c, a);
var r2 = Math.pow(c, b);
var r3 = Math.pow(c, c);
var r4 = Math.pow(a, c);
var r5 = Math.pow(b, c);
var r6 = Math.pow(E1.a, a);
var r7 = Math.pow(E1.a, b);
var r8 = Math.pow(E1.a, E1.b);
var r9 = Math.pow(E1.a, 1);
var r10 = Math.pow(a, E1.b);
var r11 = Math.pow(b, E1.b);
var r12 = Math.pow(1, E1.b);
