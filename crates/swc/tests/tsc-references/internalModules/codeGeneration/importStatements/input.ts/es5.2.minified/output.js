var A, D, E, D;
!function(A) {
    var Point = function(x, y) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Point), this.x = x, this.y = y;
    };
    A.Point = Point, A.Origin = new Point(0, 0);
}(A || (A = {
})), D = D || (D = {
}), new A.Point(1, 1), (function(E) {
    var a = A;
    E.xDist = function(x) {
        return a.Origin.x - x.x;
    };
})(E || (E = {
}));
