var B, Geometry;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(B1) {
    var Line = function(start, end) {
        "use strict";
        _class_call_check(this, Line), this.start = start, this.end = end;
    };
    B1.Line = Line;
}(B || (B = {})), function(Geometry1) {
    Geometry1.Points = A;
    var Lines = B, Origin = Geometry1.Origin = {
        x: 0,
        y: 0
    };
    Geometry1.Unit = new Lines.Line(Origin, {
        x: 1,
        y: 0
    });
}(Geometry || (Geometry = {})), Geometry.Origin, Geometry.Unit, Geometry.Lines.Line;
