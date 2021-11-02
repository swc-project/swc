function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A1;
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Origin = {
        x: 0,
        y: 0
    };
    A.Unity = {
        start: new Point(0, 0),
        end: new Point(1, 0)
    };
})(A1 || (A1 = {
}));
