//// [TwoInternalModulesThatMergeEachWithExportedAndNonExportedClassesOfTheSameName.ts]
var A, X;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(A || (A = {})).Point = function Point() {
    "use strict";
    _class_call_check(this, Point);
}, A || (A = {}), function(X) {
    var Y;
    ((Y = X.Y || (X.Y = {})).Z || (Y.Z = {})).Line = function Line() {
        "use strict";
        _class_call_check(this, Line);
    };
}(X || (X = {})), function(X) {
    var Y;
    (Y = X.Y || (X.Y = {})).Z || (Y.Z = {});
}(X || (X = {}));
