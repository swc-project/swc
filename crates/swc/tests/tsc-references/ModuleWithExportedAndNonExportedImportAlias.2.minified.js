//// [ModuleWithExportedAndNonExportedImportAlias.ts]
var B, Geometry, Geometry1, Points, Lines, Origin;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(B || (B = {})).Line = function Line(start, end) {
    _class_call_check(this, Line), this.start = start, this.end = end;
}, Geometry1 = Geometry || (Geometry = {}), Points = A, Geometry1.Points = Points, Lines = B, Origin = Geometry1.Origin = {
    x: 0,
    y: 0
}, Geometry1.Unit = new Lines.Line(Origin, {
    x: 1,
    y: 0
}), Geometry.Origin, Geometry.Unit, Geometry.Lines.Line;
