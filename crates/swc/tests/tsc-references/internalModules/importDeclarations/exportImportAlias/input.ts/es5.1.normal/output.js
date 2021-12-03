function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// expect no errors here
var A;
(function(A1) {
    A1.x = 'hello world';
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    A1.Point = Point;
})(A || (A = {
}));
var C;
(function(C1) {
    C1.a = A;
})(C || (C = {
}));
var a = C.a.x;
var b = new C.a.Point(0, 0);
var c;
var c;
var X;
(function(X1) {
    var Y = function Y() {
        return 42;
    };
    X1.Y = Y;
    (function(Y) {
        var Point = function Point(x, y) {
            "use strict";
            _classCallCheck(this, Point);
            this.x = x;
            this.y = y;
        };
        Y.Point = Point;
    })(Y || (Y = {
    }));
})(X || (X = {
}));
var Z;
(function(Z1) {
    Z1.y = X.Y;
})(Z || (Z = {
}));
var m = Z.y();
var n = new Z.y.Point(0, 0);
var K;
(function(K1) {
    var L = function L(name) {
        "use strict";
        _classCallCheck(this, L);
        this.name = name;
    };
    K1.L = L;
    (function(L) {
        L.y = 12;
    })(L || (L = {
    }));
})(K || (K = {
}));
var M;
(function(M1) {
    M1.D = K.L;
})(M || (M = {
}));
var o;
var o = new M.D('Hello');
var p;
var p;
