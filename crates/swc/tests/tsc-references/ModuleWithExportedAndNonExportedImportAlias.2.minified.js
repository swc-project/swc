//// [ModuleWithExportedAndNonExportedImportAlias.ts]
var B, Geometry, Geometry1, Lines, Origin, Unit;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(B || (B = {})).Line = function Line(start, end) {
    _class_call_check(this, Line), this.start = start, this.end = end;
}, (Geometry1 = Geometry || (Geometry = {})).Points = A, Lines = B, Origin = {
    x: 0,
    y: 0
}, Object.defineProperty(Geometry1, "Origin", {
    enumerable: !0,
    get: function() {
        return Origin;
    },
    set: function(v) {
        Origin = v;
    }
}), Unit = new Lines.Line(Origin, {
    x: 1,
    y: 0
}), Object.defineProperty(Geometry1, "Unit", {
    enumerable: !0,
    get: function() {
        return Unit;
    },
    set: function(v) {
        Unit = v;
    }
}), Geometry.Origin, Geometry.Unit, Geometry.Lines.Line;
