function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// expect no errors here
var A1;
(function(A) {
    A.x = 'hello world';
    var Point = function Point(x, y) {
        "use strict";
        _classCallCheck(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Point = Point;
})(A1 || (A1 = {
}));
var C1;
(function(C) {
    C.a = A1;
})(C1 || (C1 = {
}));
var a = C1.a.x;
var b = new C1.a.Point(0, 0);
var c;
var c;
var X1;
(function(X) {
    var Y = function Y() {
        return 42;
    };
    X.Y = Y;
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
})(X1 || (X1 = {
}));
var Z1;
(function(Z) {
    Z.y = X1.Y;
})(Z1 || (Z1 = {
}));
var m = Z1.y();
var n = new Z1.y.Point(0, 0);
var K1;
(function(K) {
    var L = function L(name) {
        "use strict";
        _classCallCheck(this, L);
        this.name = name;
    };
    K.L = L;
    (function(L) {
        L.y = 12;
    })(L || (L = {
    }));
})(K1 || (K1 = {
}));
var M1;
(function(M) {
    M.D = K1.L;
})(M1 || (M1 = {
}));
var o;
var o = new M1.D('Hello');
var p;
var p;
