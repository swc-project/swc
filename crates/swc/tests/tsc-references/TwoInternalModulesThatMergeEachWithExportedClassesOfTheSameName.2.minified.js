//// [TwoInternalModulesThatMergeEachWithExportedClassesOfTheSameName.ts]
var A, X, A1, A2, X1, Y, Z, X2, Y1, Z1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), A1.Point = function Point() {
    _class_call_check(this, Point);
}, A2 = A || (A = {}), A2.Point = function Point() {
    _class_call_check(this, Point);
}, Z = (Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Z || (Y.Z = {}), Z.Line = function Line() {
    _class_call_check(this, Line);
}, Z1 = (Y1 = (X2 = X || (X = {})).Y || (X2.Y = {})).Z || (Y1.Z = {}), Z1.Line = function Line() {
    _class_call_check(this, Line);
};
