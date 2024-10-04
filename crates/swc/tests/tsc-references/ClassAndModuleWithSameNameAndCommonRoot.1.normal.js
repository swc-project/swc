//// [class.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(X) {
    (function(Y) {
        var Point = function Point(x, y) {
            "use strict";
            _class_call_check(this, Point);
            this.x = x;
            this.y = y;
        };
        Y.Point = Point;
    })(X.Y || (X.Y = {}));
})(X || (X = {}));
var X;
//// [module.ts]
(function(X) {
    (function(Y) {
        (function(Point) {
            Point.Origin = new Y.Point(0, 0);
        })(Y.Point || (Y.Point = {}));
    })(X.Y || (X.Y = {}));
})(X || (X = {}));
var X;
//// [test.ts]
//var cl: { x: number; y: number; }
var cl = new X.Y.Point(1, 1);
var cl = X.Y.Point.Origin; // error not expected here same as bug 83996 ?
//// [simple.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
(function(A) {
    A.Instance = new A();
})(A || (A = {}));
// ensure merging works as expected
var a = A.Instance;
var a = new A();
var a;
