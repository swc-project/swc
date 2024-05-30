//// [invalidEnumAssignments.ts]
var E, E2;
(E = {})[E.A = 0] = "A", E[E.B = 1] = "B", (E2 = {})[E2.A = 0] = "A", E2[E2.B = 1] = "B";
