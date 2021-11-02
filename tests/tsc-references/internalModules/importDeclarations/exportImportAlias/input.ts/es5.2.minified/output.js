var A1, C, X1, Z, K1, M;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
(function(A) {
    A.x = "hello world";
    var Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    };
    A.Point = Point;
})(A1 || (A1 = {
})), (C || (C = {
})).a = A1, C.a.x, new C.a.Point(0, 0), (function(X) {
    var Y, Point, Y1 = function() {
        return 42;
    };
    X.Y = Y1, Y = Y1 || (Y1 = {
    }), Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    }, Y.Point = Point;
})(X1 || (X1 = {
})), (Z || (Z = {
})).y = X1.Y, Z.y(), new Z.y.Point(0, 0), (function(K) {
    var L = function(name) {
        "use strict";
        _classCallCheck(this, L), this.name = name;
    };
    K.L = L, (L || (L = {
    })).y = 12;
})(K1 || (K1 = {
})), (M || (M = {
})).D = K1.L, new M.D("Hello");
