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
    Point.Origin = "";
})(Point || (Point = {
}));
var A;
(function(A1) {
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    A1.Point = Point;
    Point.Origin = {
        x: 0,
        y: 0
    };
    (function(Point) {
        Point.Origin = "";
    })(Point = A1.Point || (A1.Point = {
    }));
})(A || (A = {
}));
