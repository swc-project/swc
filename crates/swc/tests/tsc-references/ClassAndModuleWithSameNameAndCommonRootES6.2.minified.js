//// [class.ts]
!function(X1) {
    (X1.Y || (X1.Y = {})).Point = class {
        constructor(x, y){
            this.x = x, this.y = y;
        }
    };
}(X = {});
//// [module.ts]
!function(X1) {
    var Y;
    let Point;
    (Point = (Y = X1.Y || (X1.Y = {})).Point || (Y.Point = {})).Origin = new Point(0, 0);
}(X = {});
//// [test.ts]
new X.Y.Point(1, 1), X.Y.Point.Origin;
//// [simple.ts]
class A {
}
(A || (A = {})).Instance = new A(), A.Instance, new A();
