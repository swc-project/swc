//// [invalidUndefinedAssignments.ts]
var x, E, M, E1, M1;
import "@swc/helpers/_/_class_call_check";
E1 = E || (E = {}), E1[E1.A = 0] = "A", E = x, E.A = x, I = x, M1 = M || (M = {}), M1.x = 1;
