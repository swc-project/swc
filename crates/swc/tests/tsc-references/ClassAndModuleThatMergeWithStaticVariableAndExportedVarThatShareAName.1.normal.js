//// [ClassAndModuleThatMergeWithStaticVariableAndExportedVarThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Point = function Point(x, y) {
    "use strict";
    _class_call_check(this, Point);
    this.x = x;
    this.y = y;
};
Point.Origin = {
    x: 0,
    y: 0
};
(function(Point) {
    var Origin = ""; //expected duplicate identifier error
    Object.defineProperty(Point, "Origin", {
        enumerable: true,
        get: function get() {
            return Origin;
        },
        set: function set(v) {
            Origin = v;
        }
    });
})(Point || (Point = {}));
var A;
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    Point.Origin = {
        x: 0,
        y: 0
    };
    A.Point = Point;
    (function(Point) {
        var Origin = ""; //expected duplicate identifier error
        Object.defineProperty(Point, "Origin", {
            enumerable: true,
            get: function get() {
                return Origin;
            },
            set: function set(v) {
                Origin = v;
            }
        });
    })(Point = A.Point || (A.Point = {}));
})(A || (A = {}));
