//// [module.ts]
var X, X1, Y;
((Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Point || (Y.Point = {})).Origin = new Y.Point(0, 0);
//// [classPoint.ts]
var X, X1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
((X1 = X || (X = {})).Y || (X1.Y = {})).Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
//// [simple.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(A = A1 || (A1 = {})).Instance = new A();
var A, A1 = function A() {
    _class_call_check(this, A);
};
