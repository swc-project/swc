//// [exportImportAlias.ts]
var A, C, X, Z, K, M, A1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A1 = A || (A = {})).x = "hello world", A1.Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, function(C) {
    var a = A;
    C.a = a;
}(C || (C = {})), C.a.x, new C.a.Point(0, 0), function(X) {
    var Y = function() {
        return 42;
    };
    X.Y = Y, (Y = X.Y || (X.Y = {})).Point = function Point(x, y) {
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
}(X || (X = {})), function(Z) {
    var y = X.Y;
    Z.y = y;
}(Z || (Z = {})), Z.y(), new Z.y.Point(0, 0), function(K) {
    var L = function L(name) {
        _class_call_check(this, L), this.name = name;
    };
    K.L = L, (L = K.L || (K.L = {})).y = 12;
}(K || (K = {})), function(M) {
    var D = K.L;
    M.D = D;
}(M || (M = {})), new M.D("Hello");
