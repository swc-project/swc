//// [TwoInternalModulesThatMergeEachWithExportedModulesOfTheSameName.ts]
var A, X, X1, Y, Z;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A || (A = {}), A.B.x, ((Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Z || (Y.Z = {})).Line = function Line() {
    _class_call_check(this, Line);
}, X || (X = {}), Y1 || (Y1 = {}), (Z || (Z = {})).Line = function Line() {
    _class_call_check(this, Line);
};
var Y1;
export { Y1 as Y };
