var A1;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
!function(A) {
    var Point = function() {
        "use strict";
        _classCallCheck(this, Point);
    }, Line = function(start, end) {
        "use strict";
        _classCallCheck(this, Line), this.start = start, this.end = end;
    };
    A.Line = Line, A.fromOrigin = function(p) {
        return new Line({
            x: 0,
            y: 0
        }, p);
    };
}(A1 || (A1 = {
}));
