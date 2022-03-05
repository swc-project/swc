import * as swcHelpers from "@swc/helpers";
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
        swcHelpers.classCallCheck(this, Point);
    };
    var Line = function Line(start, end) {
        "use strict";
        swcHelpers.classCallCheck(this, Line);
        this.start = start;
        this.end = end;
    };
    A1.Line = Line;
    A1.fromOrigin = fromOrigin;
})(A || (A = {}));
