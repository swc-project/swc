//// [ExportFunctionWithInaccessibleTypesInParameterTypeAnnotation.ts]
var A;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(A) {
    var Line = function Line(start, end) {
        _class_call_check(this, Line), this.start = start, this.end = end;
    };
    A.Line = Line, A.fromOrigin = function(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    };
}(A || (A = {}));
