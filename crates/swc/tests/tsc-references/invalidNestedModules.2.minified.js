//// [invalidNestedModules.ts]
var A, M2, A1, B, C, A2, B1, M21, X, M22;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
C = (B = (A1 = A || (A = {})).B || (A1.B = {})).C || (B.C = {}), C.Point = function Point() {
    _class_call_check(this, Point);
}, B1 = (A2 = A || (A = {})).B || (A2.B = {}), B1.C = function C() {
    _class_call_check(this, C);
}, X = (M21 = M2 || (M2 = {})).X || (M21.X = {}), X.Point = function Point() {
    _class_call_check(this, Point);
}, (M22 = M2 || (M2 = {})).X || (M22.X = {});
