//// [ExportObjectLiteralAndObjectTypeLiteralWithAccessibleTypesInMemberTypeAnnotations.ts]
var A, A1, Point, Origin, Unity;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A || (A = {}), Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, Origin = {
    x: 0,
    y: 0
}, Object.defineProperty(A1, "Origin", {
    enumerable: !0,
    get: function() {
        return Origin;
    },
    set: function(v) {
        Origin = v;
    }
}), Unity = {
    start: new Point(0, 0),
    end: new Point(1, 0)
}, Object.defineProperty(A1, "Unity", {
    enumerable: !0,
    get: function() {
        return Unity;
    },
    set: function(v) {
        Unity = v;
    }
});
