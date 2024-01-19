//// [ClassAndModuleThatMergeWithStaticVariableAndExportedVarThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Point, A, Point1, Point2, A1, Point3 = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
Point3.Origin = {
    x: 0,
    y: 0
}, Point = Point3 || (Point3 = {}), Point.Origin = "", A = A1 || (A1 = {}), Point1 = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, Point1.Origin = {
    x: 0,
    y: 0
}, A.Point = Point1, Point2 = Point1 = A.Point || (A.Point = {}), Point2.Origin = "";
