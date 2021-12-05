var A;
!function(A1) {
    var Point = function(x, y) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Point), this.x = x, this.y = y;
    };
    A1.Point = Point;
}(A || (A = {
})), A.Point.Origin, new A.Point(0, 0);
