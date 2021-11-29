var A, C, A, C, X, Z, K, M, Z, M;
(A = A || (A = {
})).x = "hello world", A.Point = class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}, (C = C || (C = {
})).a = A, C.a.x, new C.a.Point(0, 0), (function(X) {
    var Y;
    function Y() {
        return 42;
    }
    X.Y = Y, (Y = Y || (Y = {
    })).Point = class {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    };
})(X || (X = {
})), (Z = Z || (Z = {
})).y = X.Y, Z.y(), new Z.y.Point(0, 0), (function(K) {
    var L;
    class L {
        constructor(name){
            this.name = name;
        }
    }
    K.L = L, (L = L || (L = {
    })).y = 12;
})(K || (K = {
})), (M = M || (M = {
})).D = K.L, new M.D("Hello");
