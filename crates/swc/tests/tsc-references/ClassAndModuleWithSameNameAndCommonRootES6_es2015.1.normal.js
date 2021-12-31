// @target: ES6
// @filename: class.ts
var X;
(function(X1) {
    let Y1;
    (function(Y) {
        class Point {
            constructor(x, y){
                this.x = x;
                this.y = y;
            }
        }
        Y.Point = Point;
    })(Y1 = X1.Y || (X1.Y = {
    }));
})(X || (X = {
}));
(function(X2) {
    let Y2;
    (function(Y) {
        let Point1;
        (function(Point) {
            var Origin = Point.Origin = new Point1(0, 0);
        })(Point1 = Y.Point || (Y.Point = {
        }));
    })(Y2 = X2.Y || (X2.Y = {
    }));
})(X || (X = {
}));
// @filename: test.ts
//var cl: { x: number; y: number; }
var cl = new X.Y.Point(1, 1);
var cl = X.Y.Point.Origin; // error not expected here same as bug 83996 ?
// @filename: simple.ts
class A {
}
(function(A1) {
    var Instance = A1.Instance = new A();
})(A || (A = {
}));
// ensure merging works as expected
var a = A.Instance;
var a = new A();
var a;
