//// [exportImportAlias.ts]
var A, C, X, Z, K, M, A1, C1, Z1, K1, L, L1, M1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), A1.x = "hello world", A1.Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, C1 = C || (C = {}), C1.a = A, C.a.x, new C.a.Point(0, 0), function(X) {
    var Y;
    function Y1() {
        return 42;
    }
    X.Y = Y1, Y = Y1 = X.Y || (X.Y = {}), Y.Point = function Point(x, y) {
        _class_call_check(this, Point), this.x = x, this.y = y;
    };
}(X || (X = {})), Z1 = Z || (Z = {}), Z1.y = X.Y, Z.y(), new Z.y.Point(0, 0), K1 = K || (K = {}), L = function L(name) {
    _class_call_check(this, L), this.name = name;
}, K1.L = L, L1 = L = K1.L || (K1.L = {}), L1.y = 12, M1 = M || (M = {}), M1.D = K.L, new M.D("Hello");
