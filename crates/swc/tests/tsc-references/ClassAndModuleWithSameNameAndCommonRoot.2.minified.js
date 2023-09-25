//// [class.ts]
var X, X1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
((X1 = X || (X = {})).Y || (X1.Y = {})).Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
//// [module.ts]
var X, X1, Y, Point;
(Point = (Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Point || (Y.Point = {})).Origin = new Point(0, 0);
//// [test.ts]
//var cl: { x: number; y: number; }
new X.Y.Point(1, 1), X.Y.Point.Origin;
 // error not expected here same as bug 83996 ?
//// [simple.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A, A1 = function A() {
    _class_call_check(this, A);
};
(A = A1 || (A1 = {})).Instance = new A(), A1.Instance, new A1();
