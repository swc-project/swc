var A;
import * as swcHelpers from "@swc/helpers";
!function(A1) {
    var Point = function() {
        swcHelpers.classCallCheck(this, Point);
    }, Line = function(start, end) {
        "use strict";
        swcHelpers.classCallCheck(this, Line), this.start = start, this.end = end;
    };
    A1.Line = Line, A1.fromOrigin = function(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    };
}(A || (A = {}));
