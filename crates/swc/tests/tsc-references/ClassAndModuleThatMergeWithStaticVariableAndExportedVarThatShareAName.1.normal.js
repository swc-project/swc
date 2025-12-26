//// [ClassAndModuleThatMergeWithStaticVariableAndExportedVarThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap();
var Point = function Point(x, y) {
    "use strict";
    _class_call_check(this, Point);
    this.x = x;
    this.y = y;
};
(function(Point) {
    Point.Origin = ""; //expected duplicate identifier error
})(Point || (Point = {}));
(function(A) {
    var __ = new WeakMap();
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Point = Point;
    (function(Point) {
        Point.Origin = ""; //expected duplicate identifier error
    })(A.Point || (A.Point = {}));
})(A || (A = {}));
var A;
