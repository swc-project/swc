function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var A;
(function(A1) {
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    var Origin = A1.Origin = {
        x: 0,
        y: 0
    };
    var Unity = A1.Unity = {
        start: new Point(0, 0),
        end: new Point(1, 0)
    };
})(A || (A = {
}));
