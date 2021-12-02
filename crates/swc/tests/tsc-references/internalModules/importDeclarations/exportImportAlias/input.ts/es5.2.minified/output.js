var A, C, X, Z, K, M;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
(function(A1) {
    A1.x = "hello world";
    var Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    };
    A1.Point = Point;
})(A || (A = {
})), (C || (C = {
})).a = A, C.a.x, new C.a.Point(0, 0), (function(X1) {
    var Y, Point, Y1 = function() {
        return 42;
    };
    X1.Y = Y1, Y = Y1 || (Y1 = {
    }), Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    }, Y.Point = Point;
})(X || (X = {
})), (Z || (Z = {
})).y = X.Y, Z.y(), new Z.y.Point(0, 0), (function(K1) {
    var L = function(name) {
        "use strict";
        _classCallCheck(this, L), this.name = name;
    };
    K1.L = L, (L || (L = {
    })).y = 12;
})(K || (K = {
})), (M || (M = {
})).D = K.L, new M.D("Hello");
