//// [compoundArithmeticAssignmentLHSCanBeAssigned.ts]
var E;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
})(E || (E = {}));
var a;
var b;
var c;
var x1;
x1 *= a;
x1 *= b;
x1 *= c;
x1 *= null;
x1 *= undefined;
var x2;
x2 *= a;
x2 *= b;
x2 *= c;
x2 *= null;
x2 *= undefined;
var x3;
x3 *= a;
x3 *= b;
x3 *= c;
x3 *= null;
x3 *= undefined;
