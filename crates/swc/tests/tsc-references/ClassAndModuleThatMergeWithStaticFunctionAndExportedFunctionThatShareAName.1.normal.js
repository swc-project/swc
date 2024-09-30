//// [ClassAndModuleThatMergeWithStaticFunctionAndExportedFunctionThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Point = /*#__PURE__*/ function() {
    "use strict";
    function Point(x, y) {
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    }
    Point.Origin = function Origin() {
        return {
            x: 0,
            y: 0
        };
    } // unexpected error here bug 840246
    ;
    return Point;
}();
(function(Point) {
    function Origin() {
        return null;
    } //expected duplicate identifier error
    Point.Origin = Origin;
})(Point || (Point = {}));
(function(A) {
    var Point = /*#__PURE__*/ function() {
        "use strict";
        function Point(x, y) {
            _class_call_check(this, Point);
            this.x = x;
            this.y = y;
        }
        Point.Origin = function Origin() {
            return {
                x: 0,
                y: 0
            };
        } // unexpected error here bug 840246
        ;
        return Point;
    }();
    A.Point = Point;
    (function(Point) {
        function Origin() {
            return "";
        } //expected duplicate identifier error
        Point.Origin = Origin;
    })(A.Point || (A.Point = {}));
})(A || (A = {}));
var A;
