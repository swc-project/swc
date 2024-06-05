//// [TwoInternalModulesThatMergeEachWithExportedModulesOfTheSameName.ts]
var A, X, A1, X1, Y, X2;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A1 = A || (A = {})).B || (A1.B = {}), A || (A = {}), A.B.x, ((Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Z || (Y.Z = {})).Line = function Line() {
    _class_call_check(this, Line);
}, (X2 = X || (X = {})).Y || (X2.Y = {});
