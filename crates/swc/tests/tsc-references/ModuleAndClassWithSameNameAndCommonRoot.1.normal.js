//// [module.ts]
var X;
(function(X) {
    var Y;
    (function(Y) {
        var Point;
        (function(Point1) {
            var Origin = Point1.Origin = new Point(0, 0);
        })(Point = Y.Point || (Y.Point = {}));
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
//// [classPoint.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var X;
(function(X) {
    var Y;
    (function(Y) {
        var Point = function Point(x, y) {
            "use strict";
            _class_call_check(this, Point);
            this.x = x;
            this.y = y;
        };
        Y.Point = Point;
    })(Y = X.Y || (X.Y = {}));
})(X || (X = {}));
//// [simple.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A1) {
    var Instance = A1.Instance = new A();
})(A || (A = {}));
// duplicate identifier
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
