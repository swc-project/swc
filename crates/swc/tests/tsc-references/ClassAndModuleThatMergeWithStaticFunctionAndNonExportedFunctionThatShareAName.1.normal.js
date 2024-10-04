//// [ClassAndModuleThatMergeWithStaticFunctionAndNonExportedFunctionThatShareAName.ts]
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
    };
    return Point;
}();
(function(Point) {
    function Origin() {
        return "";
    } // not an error, since not exported
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
        };
        return Point;
    }();
    A.Point = Point;
    (function(Point) {
        function Origin() {
            return "";
        } // not an error since not exported
    })(A.Point || (A.Point = {}));
})(A || (A = {}));
var A;
