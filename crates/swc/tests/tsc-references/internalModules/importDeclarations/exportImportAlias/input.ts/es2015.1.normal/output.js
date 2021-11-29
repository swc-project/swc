// expect no errors here
var A;
(function(A) {
    A.x = 'hello world';
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A.Point = Point;
})(A || (A = {
}));
var C;
(function(C) {
    C.a = A;
})(C || (C = {
}));
var a = C.a.x;
var b = new C.a.Point(0, 0);
var c;
var c;
var X;
(function(X) {
    function Y() {
        return 42;
    }
    X.Y = Y;
    (function(Y) {
        class Point {
            constructor(x, y){
                this.x = x;
                this.y = y;
            }
        }
        Y.Point = Point;
    })(Y || (Y = {
    }));
})(X || (X = {
}));
var Z;
(function(Z) {
    Z.y = X.Y;
})(Z || (Z = {
}));
var m = Z.y();
var n = new Z.y.Point(0, 0);
var K;
(function(K) {
    class L {
        constructor(name){
            this.name = name;
        }
    }
    K.L = L;
    (function(L) {
        L.y = 12;
    })(L || (L = {
    }));
})(K || (K = {
}));
var M;
(function(M) {
    M.D = K.L;
})(M || (M = {
}));
var o;
var o = new M.D('Hello');
var p;
var p;
