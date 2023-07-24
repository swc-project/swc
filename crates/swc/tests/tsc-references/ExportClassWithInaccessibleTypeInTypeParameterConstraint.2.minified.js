//// [ExportClassWithInaccessibleTypeInTypeParameterConstraint.ts]
var A;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
!function(A) {
    A.Origin = {
        x: 0,
        y: 0
    };
    var Point3d = function(Point) {
        _inherits(Point3d, Point);
        var _super = _create_super(Point3d);
        function Point3d() {
            return _class_call_check(this, Point3d), _super.apply(this, arguments);
        }
        return Point3d;
    }(function Point() {
        _class_call_check(this, Point);
    });
    A.Point3d = Point3d, A.Origin3d = {
        x: 0,
        y: 0,
        z: 0
    };
    var Line = function() {
        function Line(start, end) {
            _class_call_check(this, Line), this.start = start, this.end = end;
        }
        return Line.fromorigin2d = function(p) {
            return null;
        }, Line;
    }();
    A.Line = Line;
}(A || (A = {}));
