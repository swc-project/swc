//// [compoundAdditionAssignmentLHSCannotBeAssigned.ts]
// string can add every type, and result string cannot be assigned to below types
var E, E1;
(E1 = E || (E = {}))[E1.a = 0] = "a", E1[E1.b = 1] = "b", E1[E1.c = 2] = "c";
