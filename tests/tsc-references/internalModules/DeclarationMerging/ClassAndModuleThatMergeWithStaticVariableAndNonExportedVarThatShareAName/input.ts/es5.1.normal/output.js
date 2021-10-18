function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Point = function Point(x, y) {
    "use strict";
    _classCallCheck(this, Point);
    this.x = x;
    this.y = y;
};
Point.Origin = {
    x: 0,
    y: 0
};
(function(Point) {
    var Origin = ""; // not an error, since not exported
})(Point || (Point = {
}));
var A;
(function(A) {
    var Point1 = function Point1(x, y) {
        "use strict";
        _classCallCheck(this, Point1);
        this.x = x;
        this.y = y;
    };
    A.Point = Point1;
    Point1.Origin = {
        x: 0,
        y: 0
    };
    (function(Point) {
        var Origin = ""; // not an error since not exported
    })(Point1 || (Point1 = {
    }));
})(A || (A = {
}));
