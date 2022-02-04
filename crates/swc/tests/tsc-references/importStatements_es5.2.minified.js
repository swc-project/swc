var A, D, E;
!function(A1) {
    var Point = function(x, y) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Point), this.x = x, this.y = y;
    };
    A1.Point = Point, A1.Origin = new Point(0, 0);
}(A || (A = {})), D || (D = {}), new A.Point(1, 1), (function(E1) {
    var a = A;
    E1.xDist = function(x) {
        return a.Origin.x - x.x;
    };
})(E || (E = {}));
