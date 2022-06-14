var A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(A1) {
    var Point = function() {
        "use strict";
        _class_call_check(this, Point);
    };
    A1.Point = Point;
    var Line = function(start, end) {
        "use strict";
        _class_call_check(this, Line), this.start = start, this.end = end;
    };
    A1.Line = Line, A1.fromOrigin = function(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    };
}(A || (A = {}));
