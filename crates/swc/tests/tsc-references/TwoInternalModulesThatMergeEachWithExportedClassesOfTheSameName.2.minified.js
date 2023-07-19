//// [TwoInternalModulesThatMergeEachWithExportedClassesOfTheSameName.ts]
var A, X;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A || (A = {})).Point = function Point() {
    _class_call_check(this, Point);
}, (A || (A = {})).Point = function Point() {
    _class_call_check(this, Point);
}, function(X) {
    var Y;
    ((Y = X.Y || (X.Y = {})).Z || (Y.Z = {})).Line = function Line() {
        _class_call_check(this, Line);
    };
}(X || (X = {})), function(X) {
    var Y;
    ((Y = X.Y || (X.Y = {})).Z || (Y.Z = {})).Line = function Line() {
        _class_call_check(this, Line);
    };
}(X || (X = {}));
