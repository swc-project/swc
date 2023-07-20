//// [invalidNestedModules.ts]
var A, M2, A1, M21;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(A) {
    var B;
    ((B = A.B || (A.B = {})).C || (B.C = {})).Point = function Point() {
        _class_call_check(this, Point);
    };
}(A || (A = {})), ((A1 = A || (A = {})).B || (A1.B = {})).C = function C() {
    _class_call_check(this, C);
}, ((M21 = M2 || (M2 = {})).X || (M21.X = {})).Point = function Point() {
    _class_call_check(this, Point);
}, function(M2) {
    var Point;
    (M2.X || (M2.X = {})).Point = Point;
}(M2 || (M2 = {}));
