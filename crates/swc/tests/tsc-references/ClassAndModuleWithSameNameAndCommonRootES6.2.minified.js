//// [class.ts]
var X, X1;
((X1 = X || (X = {})).Y || (X1.Y = {})).Point = class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
};
//// [module.ts]
var X, X1, Y;
((Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Point || (Y.Point = {})).Origin = new Y.Point(0, 0);
//// [test.ts]
new X.Y.Point(1, 1), X.Y.Point.Origin;
//// [simple.ts]
var A;
class A1 {
}
(A = A1 || (A1 = {})).Instance = new A(), A1.Instance, new A1();
