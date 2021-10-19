var A, A1, C, X, Z, K, M;
(A = A1 || (A1 = {
})).x = "hello world", A.Point = class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
}, (C || (C = {
})).a = A1, C.a.x, new C.a.Point(0, 0), (function(X) {
    function Y() {
        return 42;
    }
    X.Y = Y, (Y || (Y = {
    })).Point = class {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    };
})(X || (X = {
})), (Z || (Z = {
})).y = X.Y, Z.y(), new Z.y.Point(0, 0), (function(K) {
    class L {
        constructor(name){
            this.name = name;
        }
    }
    K.L = L, (L || (L = {
    })).y = 12;
})(K || (K = {
})), (M || (M = {
})).D = K.L, new M.D("Hello");
