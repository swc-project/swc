//// [TwoInternalModulesThatMergeEachWithExportedClassesOfTheSameName.ts]
var A, X;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
    A.Point = Point;
}(A || (A = {})), function(A) {
    var Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
    A.Point = Point;
}(A || (A = {})), function(X) {
    var Y, Z, Line;
    Z = (Y = X.Y || (X.Y = {})).Z || (Y.Z = {}), Line = function Line() {
        "use strict";
        _class_call_check(this, Line);
    }, Z.Line = Line;
}(X || (X = {})), function(X) {
    var Y, Z, Line;
    Z = (Y = X.Y || (X.Y = {})).Z || (Y.Z = {}), Line = function Line() {
        "use strict";
        _class_call_check(this, Line);
    }, Z.Line = Line;
}(X || (X = {}));
