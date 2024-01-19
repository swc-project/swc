//// [TwoInternalModulesThatMergeEachWithExportedAndNonExportedClassesOfTheSameName.ts]
var A, X, A1, X1, Y, Z, X2, Y1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), A1.Point = function Point() {
    _class_call_check(this, Point);
}, A || (A = {}), Z = (Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Z || (Y.Z = {}), Z.Line = function Line() {
    _class_call_check(this, Line);
}, (Y1 = (X2 = X || (X = {})).Y || (X2.Y = {})).Z || (Y1.Z = {});
