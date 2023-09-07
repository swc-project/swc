//// [class.ts]
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
        Y.Point = Point;
    })(X.Y || (X.Y = {}));
})(X || (X = {}));
//// [module.ts]
var X;
(function(X) {
    (function(Y) {
        var Point;
        (function(Point) {
            var Origin = new Point(0, 0);
            Object.defineProperty(Point, "Origin", {
                enumerable: true,
                get: function get() {
                    return Origin;
                },
                set: function set(v) {
                    Origin = v;
                }
            });
        })(Point = Y.Point || (Y.Point = {}));
    })(X.Y || (X.Y = {}));
})(X || (X = {}));
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
    var Instance = new A();
    Object.defineProperty(A, "Instance", {
        enumerable: true,
        get: function get() {
            return Instance;
        },
        set: function set(v) {
            Instance = v;
        }
    });
})(A || (A = {}));
// ensure merging works as expected
var a = A.Instance;
var a = new A();
var a;
