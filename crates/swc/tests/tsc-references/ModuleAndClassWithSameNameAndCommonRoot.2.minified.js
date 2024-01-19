//// [module.ts]
var X, X1, Y, Point;
Point.Origin = new (Point = (Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Point || (Y.Point = {}))(0, 0);
//// [classPoint.ts]
var X, X1, Y;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Y = (X1 = X || (X = {})).Y || (X1.Y = {}), Y.Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
//// [simple.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A.Instance = new (A = A1 || (A1 = {}))();
var A, A1 = function A() {
    _class_call_check(this, A);
};
