var A;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
!function(A1) {
    var Point = function() {
        "use strict";
        _classCallCheck(this, Point);
    };
    A1.Point = Point;
    var Line = function(start, end) {
        "use strict";
        _classCallCheck(this, Line), this.start = start, this.end = end;
    };
    A1.Line = Line, A1.fromOrigin = function(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    };
}(A || (A = {}));
