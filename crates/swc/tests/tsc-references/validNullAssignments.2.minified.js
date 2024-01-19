//// [validNullAssignments.ts]
var E, M, E1, M1;
import "@swc/helpers/_/_class_call_check";
E1 = E || (E = {}), E1[E1.A = 0] = "A", E.A = null, I = null, M1 = M || (M = {}), M1.x = 1;
