//// [module.ts]
var X, X1, Y, Point, Origin;
Origin = new (Point = (Y = (X1 = X || (X = {})).Y || (X1.Y = {})).Point || (Y.Point = {}))(0, 0), Object.defineProperty(Point, "Origin", {
    enumerable: !0,
    get: function() {
        return Origin;
    },
    set: function(v) {
        Origin = v;
    }
});
//// [classPoint.ts]
var X, X1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
((X1 = X || (X = {})).Y || (X1.Y = {})).Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
//// [simple.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Instance = new (A = A1 || (A1 = {}))(), Object.defineProperty(A, "Instance", {
    enumerable: !0,
    get: function() {
        return Instance;
    },
    set: function(v) {
        Instance = v;
    }
});
// duplicate identifier
var A, Instance, A1 = function A() {
    _class_call_check(this, A);
};
