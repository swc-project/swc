//// [enumAssignability.ts]
var E, F, Others;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), function(F) {
    F[F.B = 0] = "B";
}(F || (F = {})), E.A, F.B, Others || (Others = {});
