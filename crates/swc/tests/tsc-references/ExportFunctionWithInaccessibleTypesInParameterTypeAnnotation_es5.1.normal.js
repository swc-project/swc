import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A;
(function(A) {
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
    var Line = function Line(start, end) {
        "use strict";
        _class_call_check(this, Line);
        this.start = start;
        this.end = end;
    };
    A.Line = Line;
    A.fromOrigin = fromOrigin;
})(A || (A = {}));
