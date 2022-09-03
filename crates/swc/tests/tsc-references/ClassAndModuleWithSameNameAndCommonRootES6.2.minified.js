//// [class.ts]
var X;
!function(X) {
    (X.Y || (X.Y = {})).Point = class {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    };
}(X || (X = {}));
//// [module.ts]
var X;
!function(X) {
    var Y;
    let Point;
    (Point = (Y = X.Y || (X.Y = {})).Point || (Y.Point = {})).Origin = new Point(0, 0);
}(X || (X = {}));
//// [test.ts]
var cl = new X.Y.Point(1, 1), cl = X.Y.Point.Origin;
//// [simple.ts]
class A {
}
(A || (A = {})).Instance = new A();
var a, a = A.Instance, a = new A();
