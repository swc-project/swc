//// [compoundAdditionAssignmentLHSCannotBeAssigned.ts]
// string can add every type, and result string cannot be assigned to below types
var E;
(function(E) {
    E[E["a"] = 0] = "a";
    E[E["b"] = 1] = "b";
    E[E["c"] = 2] = "c";
})(E || (E = {}));
var x1;
x1 += '';
var x2;
x2 += '';
var x3;
x3 += '';
var x4;
x4 += '';
var x5;
x5 += '';
