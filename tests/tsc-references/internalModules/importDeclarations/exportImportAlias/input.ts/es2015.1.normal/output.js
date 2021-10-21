// expect no errors here
var A1;
(function(A) {
    A.x = 'hello world';
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A.Point = Point;
})(A1 || (A1 = {
}));
var C1;
(function(C) {
    C.a = A1;
})(C1 || (C1 = {
}));
var a = C1.a.x;
var b = new C1.a.Point(0, 0);
var c;
var c;
var X1;
(function(X) {
    function Y1() {
        return 42;
    }
    X.Y = Y1;
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
})(X1 || (X1 = {
}));
var Z1;
(function(Z) {
    Z.y = X1.Y;
})(Z1 || (Z1 = {
}));
var m = Z1.y();
var n = new Z1.y.Point(0, 0);
var K1;
(function(K) {
    class L1 {
        constructor(name){
            this.name = name;
        }
    }
    K.L = L1;
    (function(L) {
        L.y = 12;
    })(L1 || (L1 = {
    }));
})(K1 || (K1 = {
}));
var M1;
(function(M) {
    M.D = K1.L;
})(M1 || (M1 = {
}));
var o;
var o = new M1.D('Hello');
var p;
var p;
