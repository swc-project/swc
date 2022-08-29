//// [ExportFunctionWithInaccessibleTypesInParameterTypeAnnotation.ts]
var A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A) {
    var fromOrigin = function(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    }, Line = function Line(start, end) {
        "use strict";
        _class_call_check(this, Line), this.start = start, this.end = end;
    };
    A.Line = Line, A.fromOrigin = fromOrigin;
}(A || (A = {}));
