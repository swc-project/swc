function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A1;
(function(A) {
    var fromOrigin = function fromOrigin(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    };
    var Point = function Point() {
        "use strict";
        _classCallCheck(this, Point);
    };
    A.Point = Point;
    var Line = function Line(start, end) {
        "use strict";
        _classCallCheck(this, Line);
        this.start = start;
        this.end = end;
    };
    A.Line = Line;
    A.fromOrigin = fromOrigin;
})(A1 || (A1 = {
}));
