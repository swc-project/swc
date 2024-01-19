//// [ModuleWithExportedAndNonExportedImportAlias.ts]
var B, Geometry, B1, Geometry1, Lines;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
B1 = B || (B = {}), B1.Line = function Line(start, end) {
    _class_call_check(this, Line), this.start = start, this.end = end;
}, Geometry1 = Geometry || (Geometry = {}), Geometry1.Points = A, Lines = B, Geometry1.Origin = {
    x: 0,
    y: 0
}, Geometry1.Unit = new Lines.Line(Geometry1.Origin, {
    x: 1,
    y: 0
}), Geometry.Origin, Geometry.Unit, Geometry.Lines.Line;
