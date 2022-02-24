var A, C, X, Z, K, M;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
!function(A1) {
    A1.x = "hello world";
    var Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    };
    A1.Point = Point;
}(A || (A = {})), (C || (C = {})).a = A, C.a.x, new C.a.Point(0, 0), (function(X1) {
    var Y, Point, Y1 = function() {
        return 42;
    };
    X1.Y = Y1, Y = Y1 = X1.Y || (X1.Y = {}), Point = function(x, y) {
        "use strict";
        _classCallCheck(this, Point), this.x = x, this.y = y;
    }, Y.Point = Point;
})(X || (X = {})), (function(Z1) {
    var y = X.Y;
    Z1.y = y;
})(Z || (Z = {})), Z.y(), new Z.y.Point(0, 0), (function(K1) {
    var L = function(name) {
        "use strict";
        _classCallCheck(this, L), this.name = name;
    };
    K1.L = L, (L = K1.L || (K1.L = {})).y = 12;
})(K || (K = {})), (function(M1) {
    var D = K.L;
    M1.D = D;
})(M || (M = {})), new M.D("Hello");
