//// [class.ts]
var X, X1;
((X1 = X || (X = {})).Y || (X1.Y = {})).Point = class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
};
//// [module.ts]
var X;
!function(X) {
    var Y;
    let Point;
    (Point = (Y = X.Y || (X.Y = {})).Point || (Y.Point = {})).Origin = new Point(0, 0);
}(X || (X = {}));
//// [test.ts]
new X.Y.Point(1, 1), X.Y.Point.Origin;
//// [simple.ts]
class A {
}
(A || (A = {})).Instance = new A(), A.Instance, new A();
