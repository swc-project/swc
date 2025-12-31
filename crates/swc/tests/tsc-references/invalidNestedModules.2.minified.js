//// [invalidNestedModules.ts]
var A, M2, A1, B, A2, M21;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
((B = (A1 = A || (A = {})).B || (A1.B = {})).C || (B.C = {})).Point = function Point() {
    _class_call_check(this, Point);
}, ((A2 = A || (A = {})).B || (A2.B = {})).C = function C() {
    _class_call_check(this, C);
}, ((M21 = M2 || (M2 = {})).X || (M21.X = {})).Point = function Point() {
    _class_call_check(this, Point);
};
