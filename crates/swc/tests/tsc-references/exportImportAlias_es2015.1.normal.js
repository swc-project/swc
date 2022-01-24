// expect no errors here
var A;
(function(A1) {
    var x1 = A1.x = 'hello world';
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A1.Point = Point;
})(A || (A = {}));
var C;
(function(C1) {
    var a1 = A;
    C1.a = a1;
})(C || (C = {}));
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
    })(Y1 = X1.Y || (X1.Y = {}));
})(X || (X = {}));
var Z;
(function(Z1) {
    // 'y' should be a fundule here
    var y = X.Y;
    Z1.y = y;
})(Z || (Z = {}));
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
        var y = L.y = 12;
    })(L1 = K1.L || (K1.L = {}));
})(K || (K = {}));
var M;
(function(M1) {
    var D = K.L;
    M1.D = D;
})(M || (M = {}));
var o;
var o = new M.D('Hello');
var p;
var p;
