var A;
import * as swcHelpers from "@swc/helpers";
!function(A1) {
    var Point1 = function() {
        swcHelpers.classCallCheck(this, Point1);
    };
    A1.Origin = {
        x: 0,
        y: 0
    };
    var Point3d = function(Point) {
        swcHelpers.inherits(Point3d, Point);
        var _super = swcHelpers.createSuper(Point3d);
        function Point3d() {
            return swcHelpers.classCallCheck(this, Point3d), _super.apply(this, arguments);
        }
        return Point3d;
    }(Point1);
    A1.Point3d = Point3d, A1.Origin3d = {
        x: 0,
        y: 0,
        z: 0
    };
    var Line = function() {
        function Line(start, end) {
            swcHelpers.classCallCheck(this, Line), this.start = start, this.end = end;
        }
        return Line.fromorigin2d = function(p) {
            return null;
        }, Line;
    }();
    A1.Line = Line;
}(A || (A = {}));
