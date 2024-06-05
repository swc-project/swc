//// [ModuleWithExportedAndNonExportedImportAlias.ts]
var B, Geometry, Geometry1;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(B = {}).Line = function Line(start, end) {
    _class_call_check(this, Line), this.start = start, this.end = end;
}, (Geometry1 = Geometry = {}).Points = A, Geometry1.Origin = {
    x: 0,
    y: 0
}, Geometry1.Unit = new B.Line(Geometry1.Origin, {
    x: 1,
    y: 0
}), Geometry.Origin, Geometry.Unit, Geometry.Lines.Line;
