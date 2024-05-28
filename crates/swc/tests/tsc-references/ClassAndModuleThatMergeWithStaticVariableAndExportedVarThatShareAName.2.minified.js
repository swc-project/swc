//// [ClassAndModuleThatMergeWithStaticVariableAndExportedVarThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A, Point, Point1 = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
Point1.Origin = {
    x: 0,
    y: 0
}, (Point1 || (Point1 = {})).Origin = "", A = {}, (Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}).Origin = {
    x: 0,
    y: 0
}, A.Point = Point, (Point = A.Point || (A.Point = {})).Origin = "";
