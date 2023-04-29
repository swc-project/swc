//// [literalTypes2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B", E[E.C = 2] = "C";
}(E || (E = {}));
var E, a = [
    1,
    2
];
g1(1), g2(1, 1), g2(1, 2), g3(1, "two"), g4(1), g5(1, 2), g6([
    1,
    2
]), g6(a), g7(a), g8(1, function(x) {
    return x;
}), g8(1, function(x) {
    return x + 1;
}), function(a, x) {
    a.slice().push(1);
}([
    0
], 0);
