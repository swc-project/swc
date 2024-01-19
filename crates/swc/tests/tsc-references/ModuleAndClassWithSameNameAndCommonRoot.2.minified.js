//// [module.ts]
var X, X1, Y, Point;
Point = (Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Point || (Y.Point = {}), Point.Origin = new Point(0, 0);
//// [classPoint.ts]
var X, X1, Y;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Y = (X1 = X || (X = {})).Y || (X1.Y = {}), Y.Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
//// [simple.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A = A1 || (A1 = {}), A.Instance = new A();
var A, A1 = function A() {
    _class_call_check(this, A);
};
