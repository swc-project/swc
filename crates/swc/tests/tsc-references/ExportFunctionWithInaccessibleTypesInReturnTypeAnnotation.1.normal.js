//// [ExportFunctionWithInaccessibleTypesInReturnTypeAnnotation.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
    var Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
    A.Point = Point;
    var Line = function Line(start, end) {
        "use strict";
        _class_call_check(this, Line);
        this.start = start;
        this.end = end;
    };
    function fromOrigin(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    }
    A.fromOrigin = fromOrigin;
})(A || (A = {}));
var A;
