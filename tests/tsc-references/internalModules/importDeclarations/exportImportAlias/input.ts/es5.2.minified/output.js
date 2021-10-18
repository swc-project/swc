var A, C, X, Z, K, M;
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
})(A || (A = {
})), (C || (C = {
})).a = A, C.a.x, new C.a.Point(0, 0), (function(X) {
    var Y, Point, Y1 = function() {
        return 42;
    };
    X.Y = Y1, Y = Y1 || (Y1 = {
    }), Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    }, Y.Point = Point;
})(X || (X = {
})), (Z || (Z = {
})).y = X.Y, Z.y(), new Z.y.Point(0, 0), (function(K) {
    var L = function(name) {
        "use strict";
        _classCallCheck(this, L), this.name = name;
    };
    K.L = L, (L || (L = {
    })).y = 12;
})(K || (K = {
})), (M || (M = {
})).D = K.L, new M.D("Hello");
