//// [invalidUndefinedValues.ts]
var M, E;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(M || (M = {})).x = 1, function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), E.A;
