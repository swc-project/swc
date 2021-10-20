function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @filename: classPoint.ts
var A1;
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Point = Point;
})(A1 || (A1 = {
}));
// @filename: test.ts
var p;
var p = A1.Point.Origin;
var p = new A1.Point(0, 0); // unexpected error here, bug 840000
