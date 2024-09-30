//// [ExportClassWithInaccessibleTypeInIndexerTypeAnnotations.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
    var Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
    var points = function points() {
        "use strict";
        _class_call_check(this, points);
    };
    A.points = points;
})(A || (A = {}));
var A;
