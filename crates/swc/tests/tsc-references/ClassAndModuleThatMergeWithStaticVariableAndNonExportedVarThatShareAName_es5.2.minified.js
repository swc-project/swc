function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var A, Point = function(x, y) {
    "use strict";
    _classCallCheck(this, Point), this.x = x, this.y = y;
};
Point.Origin = {
    x: 0,
    y: 0
}, (function(A1) {
    var Point1 = function(x, y) {
        "use strict";
        _classCallCheck(this, Point1), this.x = x, this.y = y;
    };
    Point1.Origin = {
        x: 0,
        y: 0
    }, A1.Point = Point1;
})(A || (A = {}));
