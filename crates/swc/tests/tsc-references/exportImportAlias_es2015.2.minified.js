var A, C, X, Z, K, M;
!function(A1) {
    A1.x = "hello world", A1.Point = class {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    };
}(A || (A = {})), function(C1) {
    var a = A;
    C1.a = a;
}(C || (C = {})), C.a.x, new C.a.Point(0, 0), function(X1) {
    function Y() {
        return 42;
    }
    X1.Y = Y, (Y = X1.Y || (X1.Y = {})).Point = class {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    };
}(X || (X = {})), function(Z1) {
    var y = X.Y;
    Z1.y = y;
}(Z || (Z = {})), Z.y(), new Z.y.Point(0, 0), function(K1) {
    class L {
        constructor(name){
            this.name = name;
        }
    }
    K1.L = L, (L = K1.L || (K1.L = {})).y = 12;
}(K || (K = {})), function(M1) {
    var D = K.L;
    M1.D = D;
}(M || (M = {})), new M.D("Hello");
