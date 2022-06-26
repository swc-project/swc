// expect no errors here
var A;
(function(A) {
    var x = A.x = 'hello world';
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A.Point = Point;
})(A || (A = {}));
var C;
(function(C) {
    var a = A;
    C.a = a;
})(C || (C = {}));
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
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
var Z;
(function(Z) {
    // 'y' should be a fundule here
    var y = X.Y;
    Z.y = y;
})(Z || (Z = {}));
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
        var y = L.y = 12;
    })(L = K.L || (K.L = {}));
})(K || (K = {}));
var M;
(function(M) {
    var D = K.L;
    M.D = D;
})(M || (M = {}));
var o;
var o = new M.D('Hello');
var p;
var p;
