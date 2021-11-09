var A1;
!function(A) {
    var Point = function(x, y) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Point), this.x = x, this.y = y;
    };
    A.Point = Point;
}(A1 || (A1 = {
})), A1.Point.Origin, new A1.Point(0, 0);
