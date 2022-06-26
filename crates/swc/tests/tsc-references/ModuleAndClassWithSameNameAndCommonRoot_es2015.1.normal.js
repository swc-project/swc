// @Filename: module.ts
var X;
(function(X) {
    let Y;
    (function(Y) {
        let Point;
        (function(Point1) {
            var Origin = Point1.Origin = new Point(0, 0);
        })(Point = Y.Point || (Y.Point = {}));
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
(function(X) {
    let Y;
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
(function(A1) {
    var Instance = A1.Instance = new A();
})(A || (A = {}));
// duplicate identifier
class A {
}
