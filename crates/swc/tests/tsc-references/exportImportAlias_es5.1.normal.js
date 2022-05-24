import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// expect no errors here
var A;
(function(A1) {
    var x1 = A1.x = "hello world";
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    A1.Point = Point;
})(A || (A = {}));
var C;
(function(C1) {
    var a1 = A;
    C1.a = a1;
})(C || (C = {}));
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
            _class_call_check(this, Point);
            this.x = x;
            this.y = y;
        };
        Y.Point = Point;
    })(Y = X1.Y || (X1.Y = {}));
})(X || (X = {}));
var Z;
(function(Z1) {
    // 'y' should be a fundule here
    var y = X.Y;
    Z1.y = y;
})(Z || (Z = {}));
var m = Z.y();
var n = new Z.y.Point(0, 0);
var K;
(function(K1) {
    var L = function L(name) {
        "use strict";
        _class_call_check(this, L);
        this.name = name;
    };
    K1.L = L;
    (function(L) {
        var y = L.y = 12;
    })(L = K1.L || (K1.L = {}));
})(K || (K = {}));
var M;
(function(M1) {
    var D = K.L;
    M1.D = D;
})(M || (M = {}));
var o;
var o = new M.D("Hello");
var p;
var p;
