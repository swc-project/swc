//// [invalidUndefinedValues.ts]
var M, E;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(M || (M = {})).x = 1, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), E.A;
