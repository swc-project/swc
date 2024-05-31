//// [class.ts]
var X;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
((X = {}).Y || (X.Y = {})).Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
//// [module.ts]
var X, Y, Point;
(Point = (Y = (X = {}).Y || (X.Y = {})).Point || (Y.Point = {})).Origin = new Point(0, 0);
//// [test.ts]
new X.Y.Point(1, 1), X.Y.Point.Origin;
//// [simple.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A, A1 = function A() {
    _class_call_check(this, A);
};
(A = A1 || (A1 = {})).Instance = new A(), A1.Instance, new A1();
