//// [TwoInternalModulesThatMergeEachWithExportedModulesOfTheSameName.ts]
var A, X, A1, B, X1, Y, Z, X2, Z1, Z2;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A1 = A || (A = {})).B || (A1.B = {}), A || (A = {}), B || (B = {}), A.B.x, Z = (Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Z || (Y.Z = {}), Z.Line = function Line() {
    _class_call_check(this, Line);
}, (X2 = X || (X = {})).Y || (X2.Y = {}), Z2 = Z1 || (Z1 = {}), Z2.Line = function Line() {
    _class_call_check(this, Line);
};
