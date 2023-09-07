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
    var Points = Geometry.Points = A;
    var Lines = B;
    var Origin = {
        x: 0,
        y: 0
    };
    Object.defineProperty(Geometry, "Origin", {
        enumerable: true,
        get: function get() {
            return Origin;
        },
        set: function set(v) {
            Origin = v;
        }
    });
    var Unit = new Lines.Line(Origin, {
        x: 1,
        y: 0
    });
    // this is valid since B.Line _is_ visible outside Geometry
    Object.defineProperty(Geometry, "Unit", {
        enumerable: true,
        get: function get() {
            return Unit;
        },
        set: function set(v) {
            Unit = v;
        }
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
