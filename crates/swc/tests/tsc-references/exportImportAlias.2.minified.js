//// [exportImportAlias.ts]
var A, C, X, Z, K, M;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(A) {
    A.x = "hello world", A.Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
}(A || (A = {})), function(C) {
    var a = A;
    C.a = a;
}(C || (C = {})), C.a.x, new C.a.Point(0, 0), function(X) {
    var Y = function() {
        return 42;
    };
    X.Y = Y, (Y = X.Y || (X.Y = {})).Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
}(X || (X = {})), function(Z) {
    var y = X.Y;
    Z.y = y;
}(Z || (Z = {})), Z.y(), new Z.y.Point(0, 0), function(K) {
    var L = function L(name) {
        "use strict";
        _class_call_check(this, L), this.name = name;
    };
    K.L = L, (L = K.L || (K.L = {})).y = 12;
}(K || (K = {})), function(M) {
    var D = K.L;
    M.D = D;
}(M || (M = {})), new M.D("Hello");
