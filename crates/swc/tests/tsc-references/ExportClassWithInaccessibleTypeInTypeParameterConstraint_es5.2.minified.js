var A;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
!function(A1) {
    var Point1 = function() {
        "use strict";
        _class_call_check(this, Point1);
    };
    A1.Origin = {
        x: 0,
        y: 0
    };
    var Point3d = function(Point) {
        "use strict";
        _inherits(Point3d, Point);
        var _super = _create_super(Point3d);
        function Point3d() {
            return _class_call_check(this, Point3d), _super.apply(this, arguments);
        }
        return Point3d;
    }(Point1);
    A1.Point3d = Point3d, A1.Origin3d = {
        x: 0,
        y: 0,
        z: 0
    };
    var Line = function() {
        "use strict";
        function Line(start, end) {
            _class_call_check(this, Line), this.start = start, this.end = end;
        }
        return Line.fromorigin2d = function(p) {
            return null;
        }, Line;
    }();
    A1.Line = Line;
}(A || (A = {}));
