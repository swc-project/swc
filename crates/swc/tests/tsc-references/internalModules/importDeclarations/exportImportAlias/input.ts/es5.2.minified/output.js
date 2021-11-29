var C, A, C, X, Z, K, M, Z, M;
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
})), (C = C || (C = {
})).a = A, C.a.x, new C.a.Point(0, 0), (function(X) {
    var Y, Point, Y = function() {
        return 42;
    };
    X.Y = Y, Y = Y || (Y = {
    }), Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    }, Y.Point = Point;
})(X || (X = {
})), (Z = Z || (Z = {
})).y = X.Y, Z.y(), new Z.y.Point(0, 0), (function(K) {
    var L, L = function(name) {
        "use strict";
        _classCallCheck(this, L), this.name = name;
    };
    K.L = L, (L = L || (L = {
    })).y = 12;
})(K || (K = {
})), (M = M || (M = {
})).D = K.L, new M.D("Hello");
