//// [ExportClassWithAccessibleTypesInTypeParameterConstraintsClassHeritageListMemberTypeAnnotations.ts]
var A, A1, Point, Point3d;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
A1 = A || (A = {}), Point = function Point() {
    _class_call_check(this, Point);
}, A1.Point = Point, A1.Origin = {
    x: 0,
    y: 0
}, Point3d = function(Point) {
    _inherits(Point3d, Point);
    var _super = _create_super(Point3d);
    function Point3d() {
        return _class_call_check(this, Point3d), _super.apply(this, arguments);
    }
    return Point3d;
}(Point), A1.Point3d = Point3d, A1.Origin3d = {
    x: 0,
    y: 0,
    z: 0
}, A1.Line = function Line(start, end) {
    _class_call_check(this, Line), this.start = start, this.end = end;
};
