function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @Filename: module.ts
var X;
(function(X1) {
    var Y1;
    (function(Y) {
        var Point1;
        (function(Point) {
            Point.Origin = new Point1(0, 0);
        })(Point1 = Y.Point || (Y.Point = {
        }));
    })(Y1 = X1.Y || (X1.Y = {
    }));
})(X || (X = {
}));
(function(X2) {
    var Y2;
    (function(Y) {
        var Point = function Point(x, y) {
            "use strict";
            _classCallCheck(this, Point);
            this.x = x;
            this.y = y;
        };
        Y.Point = Point;
    })(Y2 = X2.Y || (X2.Y = {
    }));
})(X || (X = {
}));
(function(A1) {
    A1.Instance = new A();
})(A || (A = {
}));
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
