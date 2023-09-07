//// [invalidEnumAssignments.ts]
var E, E2, E1, E21;
(E1 = E || (E = {}))[E1.A = 0] = "A", E1[E1.B = 1] = "B", (E21 = E2 || (E2 = {}))[E21.A = 0] = "A", E21[E21.B = 1] = "B";
