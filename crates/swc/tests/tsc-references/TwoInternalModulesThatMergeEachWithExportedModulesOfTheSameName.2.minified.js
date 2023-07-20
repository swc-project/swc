//// [TwoInternalModulesThatMergeEachWithExportedModulesOfTheSameName.ts]
var A, X;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(A) {
    var x;
    (A.B || (A.B = {})).x = x;
}(A || (A = {})), function(A) {
    var B, x;
    (B || (B = {})).x = x;
}(A || (A = {})), A.B.x, function(X) {
    var Y;
    ((Y = X.Y || (X.Y = {})).Z || (Y.Z = {})).Line = function Line() {
        _class_call_check(this, Line);
    };
}(X || (X = {})), function(X) {
    var Z;
    X.Y || (X.Y = {}), (Z || (Z = {})).Line = function Line() {
        _class_call_check(this, Line);
    };
}(X || (X = {}));
