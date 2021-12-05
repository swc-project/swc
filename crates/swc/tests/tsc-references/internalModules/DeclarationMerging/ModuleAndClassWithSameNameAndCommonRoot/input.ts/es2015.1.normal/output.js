// @Filename: module.ts
var X;
(function(X1) {
    let Y1;
    (function(Y) {
        let Point1;
        (function(Point) {
            Point.Origin = new Point1(0, 0);
        })(Point1 || (Point1 = {
        }));
        Y.Point = Point1;
    })(Y1 || (Y1 = {
    }));
    X1.Y = Y1;
})(X || (X = {
}));
(function(X2) {
    let Y2;
    (function(Y) {
        class Point {
            constructor(x, y){
                this.x = x;
                this.y = y;
            }
        }
        Y.Point = Point;
    })(Y2 || (Y2 = {
    }));
    X2.Y = Y2;
})(X || (X = {
}));
(function(A1) {
    A1.Instance = new A();
})(A || (A = {
}));
// duplicate identifier
class A {
}
