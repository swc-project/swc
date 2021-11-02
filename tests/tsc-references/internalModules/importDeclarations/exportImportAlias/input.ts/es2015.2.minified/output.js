var A, A1, C, X1, Z, K1, M;
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
})(X1 || (X1 = {
})), (Z || (Z = {
})).y = X1.Y, Z.y(), new Z.y.Point(0, 0), (function(K) {
    class L {
        constructor(name){
            this.name = name;
        }
    }
    K.L = L, (L || (L = {
    })).y = 12;
})(K1 || (K1 = {
})), (M || (M = {
})).D = K1.L, new M.D("Hello");
