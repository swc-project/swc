//// [TwoInternalModulesThatMergeEachWithExportedModulesOfTheSameName.ts]
var A, X;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var x;
    (A.B || (A.B = {})).x = x;
}(A || (A = {})), function(A) {
    var x;
    (B = {}).x = x;
}(A || (A = {})), A.B.x, function(X) {
    var Y, Z1, Line;
    Z1 = (Y = X.Y || (X.Y = {})).Z || (Y.Z = {}), Line = function Line() {
        "use strict";
        _class_call_check(this, Line);
    }, Z1.Line = Line;
}(X || (X = {})), function(X) {
    var Z1, Line;
    X.Y || (X.Y = {}), Z1 = Z = {}, Line = function Line() {
        "use strict";
        _class_call_check(this, Line);
    }, Z1.Line = Line;
}(X || (X = {}));
