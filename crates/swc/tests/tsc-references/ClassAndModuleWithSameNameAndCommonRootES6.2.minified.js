//// [class.ts]
var X;
((X = {}).Y || (X.Y = {})).Point = class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
};
//// [module.ts]
var X, Y, Point;
(Point = (Y = (X = {}).Y || (X.Y = {})).Point || (Y.Point = {})).Origin = new Point(0, 0);
//// [test.ts]
new X.Y.Point(1, 1), X.Y.Point.Origin;
//// [simple.ts]
var A;
class A1 {
}
(A = A1 || (A1 = {})).Instance = new A(), A1.Instance, new A1();
