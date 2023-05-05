//// [enumAssignability.ts]
var E, F, Others;
import "@swc/helpers/_/_class_call_check";
!function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), function(F) {
    F[F.B = 0] = "B";
}(F || (F = {})), E.A, F.B, Others || (Others = {});
