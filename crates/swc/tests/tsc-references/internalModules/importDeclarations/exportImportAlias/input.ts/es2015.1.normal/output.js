// expect no errors here
var A;
(function(A1) {
    A1.x = 'hello world';
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A1.Point = Point;
})(A || (A = {
}));
var C;
(function(C1) {
    C1.a = A;
})(C || (C = {
}));
var a = C.a.x;
var b = new C.a.Point(0, 0);
var c;
var c;
var X;
(function(X1) {
    function Y1() {
        return 42;
    }
    X1.Y = Y1;
    (function(Y) {
        class Point {
            constructor(x, y){
                this.x = x;
                this.y = y;
            }
        }
        Y.Point = Point;
    })(Y1 || (Y1 = {
    }));
})(X || (X = {
}));
var Z;
(function(Z1) {
    Z1.y = X.Y;
})(Z || (Z = {
}));
var m = Z.y();
var n = new Z.y.Point(0, 0);
var K;
(function(K1) {
    class L1 {
        constructor(name){
            this.name = name;
        }
    }
    K1.L = L1;
    (function(L) {
        L.y = 12;
    })(L1 || (L1 = {
    }));
})(K || (K = {
}));
var M;
(function(M1) {
    M1.D = K.L;
})(M || (M = {
}));
var o;
var o = new M.D('Hello');
var p;
var p;
