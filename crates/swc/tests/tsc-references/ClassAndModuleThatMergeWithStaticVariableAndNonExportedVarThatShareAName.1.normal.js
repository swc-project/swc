//// [ClassAndModuleThatMergeWithStaticVariableAndNonExportedVarThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var __ = new WeakMap();
var Point = function Point(x, y) {
    "use strict";
    _class_call_check(this, Point);
    this.x = x;
    this.y = y;
};
(function(Point) {
    var Origin = ""; // not an error, since not exported
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
        var Origin = ""; // not an error since not exported
    })(A.Point || (A.Point = {}));
})(A || (A = {}));
var A;
