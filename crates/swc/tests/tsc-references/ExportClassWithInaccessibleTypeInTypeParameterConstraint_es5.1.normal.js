import * as swcHelpers from "@swc/helpers";
var A;
(function(A1) {
    var Point = function Point() {
        "use strict";
        swcHelpers.classCallCheck(this, Point);
    };
    var Origin = A1.Origin = {
        x: 0,
        y: 0
    };
    var Point3d = /*#__PURE__*/ function(Point) {
        "use strict";
        swcHelpers.inherits(Point3d, Point);
        var _super = swcHelpers.createSuper(Point3d);
        function Point3d() {
            swcHelpers.classCallCheck(this, Point3d);
            return _super.apply(this, arguments);
        }
        return Point3d;
    }(Point);
    A1.Point3d = Point3d;
    var Origin3d = A1.Origin3d = {
        x: 0,
        y: 0,
        z: 0
    };
    var Line = /*#__PURE__*/ function() {
        "use strict";
        function Line(start, end) {
            swcHelpers.classCallCheck(this, Line);
            this.start = start;
            this.end = end;
        }
        Line.fromorigin2d = function fromorigin2d(p) {
            return null;
        };
        return Line;
    }();
    A1.Line = Line;
})(A || (A = {}));
