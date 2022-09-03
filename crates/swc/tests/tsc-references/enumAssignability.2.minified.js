//// [enumAssignability.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), function(F) {
    F[F.B = 0] = "B";
}(F || (F = {}));
var E, F, Others, e = E.A, f = F.B;
f = e = f, e = 1, f = 1;
var x = e;
x = f, Others || (Others = {});
