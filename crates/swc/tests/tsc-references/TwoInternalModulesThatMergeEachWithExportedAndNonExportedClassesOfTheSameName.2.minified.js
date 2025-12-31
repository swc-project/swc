//// [TwoInternalModulesThatMergeEachWithExportedAndNonExportedClassesOfTheSameName.ts]
var A, X, X1, Y, Y1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A || (A = {})).Point = function Point() {
    _class_call_check(this, Point);
}, A || (A = {}), ((Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Z || (Y.Z = {})).Line = function Line() {
    _class_call_check(this, Line);
}, X || (X = {}), (Y1 = Y2 || (Y2 = {})).Z || (Y1.Z = {});
var Y2;
export { Y2 as Y };
