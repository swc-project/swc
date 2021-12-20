function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @filename: classPoint.ts
var A;
(function(A1) {
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    A1.Point = Point;
})(A || (A = {
}));
// @filename: test.ts
var p;
var p = A.Point.Origin;
var p = new A.Point(0, 0); // unexpected error here, bug 840000
