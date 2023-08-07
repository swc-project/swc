//// [ExportFunctionWithInaccessibleTypesInParameterTypeAnnotation.ts]
var A, A1, Line;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), Line = function Line(start, end) {
    _class_call_check(this, Line), this.start = start, this.end = end;
}, A1.Line = Line, A1.fromOrigin = function(p) {
    return new Line({
        x: 0,
        y: 0
    }, p);
};
