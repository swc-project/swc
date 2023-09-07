//// [class.ts]
var X, X1;
((X1 = X || (X = {})).Y || (X1.Y = {})).Point = class {
    constructor(x, y){
        this.x = x, this.y = y;
    }
};
//// [module.ts]
var X, X1, Y, Point, Origin;
Origin = new (Point = (Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Point || (Y.Point = {}))(0, 0), Object.defineProperty(Point, "Origin", {
    enumerable: !0,
    get: ()=>Origin,
    set (v) {
        Origin = v;
    }
});
//// [test.ts]
//var cl: { x: number; y: number; }
new X.Y.Point(1, 1), X.Y.Point.Origin;
 // error not expected here same as bug 83996 ?
//// [simple.ts]
var A, Instance;
class A1 {
}
Instance = new (A = A1 || (A1 = {}))(), Object.defineProperty(A, "Instance", {
    enumerable: !0,
    get: ()=>Instance,
    set (v) {
        Instance = v;
    }
}), A1.Instance, new A1();
