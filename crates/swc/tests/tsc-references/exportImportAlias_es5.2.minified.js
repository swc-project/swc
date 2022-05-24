var A, C, X, Z, K, M;
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
!function(A1) {
    A1.x = "hello world";
    var Point = function(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
    A1.Point = Point;
}(A || (A = {})), function(C1) {
    var a = A;
    C1.a = a;
}(C || (C = {})), C.a.x, new C.a.Point(0, 0), function(X1) {
    var Y, Point, Y1 = function() {
        return 42;
    };
    X1.Y = Y1, Y = Y1 = X1.Y || (X1.Y = {}), Point = function(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    }, Y.Point = Point;
}(X || (X = {})), function(Z1) {
    var y = X.Y;
    Z1.y = y;
}(Z || (Z = {})), Z.y(), new Z.y.Point(0, 0), function(K1) {
    var L = function(name) {
        "use strict";
        _class_call_check(this, L), this.name = name;
    };
    K1.L = L, (L = K1.L || (K1.L = {})).y = 12;
}(K || (K = {})), function(M1) {
    var D = K.L;
    M1.D = D;
}(M || (M = {})), new M.D("Hello");
