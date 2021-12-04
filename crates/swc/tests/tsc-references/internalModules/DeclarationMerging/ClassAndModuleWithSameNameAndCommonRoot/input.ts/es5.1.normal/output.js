function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @filename: class.ts
var X;
(function(X1) {
    var Y1;
    (function(Y) {
        var Point = function Point(x, y) {
            "use strict";
            _classCallCheck(this, Point);
            this.x = x;
            this.y = y;
        };
        Y.Point = Point;
    })(Y1 || (Y1 = {
    }));
    X1.Y = Y1;
})(X || (X = {
}));
(function(X2) {
    var Y2;
    (function(Y) {
        var Point1;
        (function(Point) {
            Point.Origin = new Point1(0, 0);
        })(Point1 || (Point1 = {
        }));
        Y.Point = Point1;
    })(Y2 || (Y2 = {
    }));
    X2.Y = Y2;
})(X || (X = {
}));
// @filename: test.ts
//var cl: { x: number; y: number; }
var cl = new X.Y.Point(1, 1);
var cl = X.Y.Point.Origin; // error not expected here same as bug 83996 ?
var A = function A() {
    "use strict";
    _classCallCheck(this, A);
};
(function(A1) {
    A1.Instance = new A();
})(A || (A = {
}));
// ensure merging works as expected
var a = A.Instance;
var a = new A();
var a;
