//// [TwoInternalModulesThatMergeEachWithExportedModulesOfTheSameName.ts]
var A, X;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var x;
    (A.B || (A.B = {})).x = x;
}(A || (A = {})), function(A) {
    var B, x;
    (B || (B = {})).x = x;
}(A || (A = {})), A.B.x, function(X) {
    var Y;
    ((Y = X.Y || (X.Y = {})).Z || (Y.Z = {})).Line = function Line() {
        "use strict";
        _class_call_check(this, Line);
    };
}(X || (X = {})), function(X) {
    var Z;
    X.Y || (X.Y = {}), (Z || (Z = {})).Line = function Line() {
        "use strict";
        _class_call_check(this, Line);
    };
}(X || (X = {}));
