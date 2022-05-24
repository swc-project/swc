import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A;
(function(A1) {
    var fromOrigin = function fromOrigin(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    };
    var Point = function Point() {
        "use strict";
        _class_call_check(this, Point);
    };
    A1.Point = Point;
    var Line = function Line(start, end) {
        "use strict";
        _class_call_check(this, Line);
        this.start = start;
        this.end = end;
    };
    A1.fromOrigin = fromOrigin;
})(A || (A = {}));
