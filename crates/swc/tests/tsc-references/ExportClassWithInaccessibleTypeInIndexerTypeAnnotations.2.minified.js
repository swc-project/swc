//// [ExportClassWithInaccessibleTypeInIndexerTypeAnnotations.ts]
var A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var points = function points() {
        "use strict";
        _class_call_check(this, points);
    };
    A.points = points;
}(A || (A = {}));
