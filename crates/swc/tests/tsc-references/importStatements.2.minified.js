//// [importStatements.ts]
var A, A1, Point;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
A1 = A = {}, Point = function Point(x, y) {
    _class_call_check(this, Point), this.x = x, this.y = y;
}, A1.Point = Point, A1.Origin = new Point(0, 0), new A.Point(1, 1);
