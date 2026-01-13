//// [invalidEnumAssignments.ts]
var E2, E, E1 = ((E = E1 || {})[E.A = 0] = "A", E[E.B = 1] = "B", E), E21 = ((E2 = E21 || {})[E2.A = 0] = "A", E2[E2.B = 1] = "B", E2);
E21.A, E1.A;
