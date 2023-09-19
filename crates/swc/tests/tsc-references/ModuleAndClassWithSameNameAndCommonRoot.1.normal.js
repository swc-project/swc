//// [module.ts]
var X;
(function(X) {
    (function(Y) {
        var Point;
        (function(Point) {
            Point.Origin = new Point(0, 0);
        })(Point = Y.Point || (Y.Point = {}));
    })(X.Y || (X.Y = {}));
})(X || (X = {}));
//// [classPoint.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var X;
(function(X) {
    (function(Y) {
        var Point = function Point(x, y) {
            "use strict";
            _class_call_check(this, Point);
            this.x = x;
            this.y = y;
        };
        // duplicate identifier
        Y.Point = Point;
    })(X.Y || (X.Y = {}));
})(X || (X = {}));
//// [simple.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    A.Instance = new A();
})(A || (A = {}));
// duplicate identifier
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
