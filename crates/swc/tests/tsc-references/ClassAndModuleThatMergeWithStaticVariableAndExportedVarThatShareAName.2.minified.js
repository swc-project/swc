//// [ClassAndModuleThatMergeWithStaticVariableAndExportedVarThatShareAName.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Point, Origin, A, Point1, Point2, Origin1, A1, Point3 = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
};
Point3.Origin = {
    x: 0,
    y: 0
}, Point = Point3 || (Point3 = {}), Origin = "", Object.defineProperty(Point, "Origin", {
    enumerable: !0,
    get: function() {
        return Origin;
    },
    set: function(v) {
        Origin = v;
    }
}), A = A1 || (A1 = {}), (Point1 = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}).Origin = {
    x: 0,
    y: 0
}, A.Point = Point1, Point2 = Point1 = A.Point || (A.Point = {}), Origin1 = "", Object.defineProperty(Point2, "Origin", {
    enumerable: !0,
    get: function() {
        return Origin1;
    },
    set: function(v) {
        Origin1 = v;
    }
});
