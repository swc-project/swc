//// [ExportObjectLiteralAndObjectTypeLiteralWithAccessibleTypesInMemberTypeAnnotations.ts]
var A, Point;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A = {}, Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, A.Origin = {
    x: 0,
    y: 0
}, A.Unity = {
    start: new Point(0, 0),
    end: new Point(1, 0)
};
