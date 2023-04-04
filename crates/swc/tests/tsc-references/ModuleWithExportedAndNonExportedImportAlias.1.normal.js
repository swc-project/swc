//// [ModuleWithExportedAndNonExportedImportAlias.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var B;
(function(B) {
    var Line = function Line(start, end) {
        "use strict";
        _class_call_check(this, Line);
        this.start = start;
        this.end = end;
    };
    B.Line = Line;
})(B || (B = {}));
var Geometry;
(function(Geometry) {
    var Points = A;
    Geometry.Points = Points;
    var Lines = B;
    var Origin = Geometry.Origin = {
        x: 0,
        y: 0
    };
    var Unit = Geometry.Unit = new Lines.Line(Origin, {
        x: 1,
        y: 0
    });
})(Geometry || (Geometry = {}));
// expected to work since all are exported
var p;
var p;
var p = Geometry.Origin;
var line;
var line = Geometry.Unit;
// not expected to work since non are exported
var line = Geometry.Lines.Line;
