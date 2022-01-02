// @Filename: module.ts
var X;
(function(X1) {
    let Y1;
    (function(Y) {
        let Point1;
        (function(Point) {
            var Origin = Point.Origin = new Point1(0, 0);
        })(Point1 = Y.Point || (Y.Point = {
        }));
    })(Y1 = X1.Y || (X1.Y = {
    }));
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
    })(Y2 = X2.Y || (X2.Y = {
    }));
})(X || (X = {
}));
(function(A1) {
    var Instance = A1.Instance = new A();
})(A || (A = {
}));
// duplicate identifier
class A {
}
