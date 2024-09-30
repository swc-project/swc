//// [ExportModuleWithAccessibleTypesOnItsExportedMembers.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(A) {
    var Point = function Point(x, y) {
        "use strict";
        _class_call_check(this, Point);
        this.x = x;
        this.y = y;
    };
    A.Point = Point;
    (function(B) {
        B.Origin = new Point(0, 0);
        var Line = /*#__PURE__*/ function() {
            "use strict";
            function Line(start, end) {
                _class_call_check(this, Line);
            }
            Line.fromOrigin = function fromOrigin(p) {
                return new Line({
                    x: 0,
                    y: 0
                }, p);
            };
            return Line;
        }();
        B.Line = Line;
    })(A.B || (A.B = {}));
})(A || (A = {}));
var A;
