var B, Geometry;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function(B) {
    var Line = function(start, end) {
        "use strict";
        _class_call_check(this, Line), this.start = start, this.end = end;
    };
    B.Line = Line;
}(B || (B = {})), function(Geometry) {
    Geometry.Points = A;
    var Lines = B, Origin = Geometry.Origin = {
        x: 0,
        y: 0
    };
    Geometry.Unit = new Lines.Line(Origin, {
        x: 1,
        y: 0
    });
}(Geometry || (Geometry = {})), Geometry.Origin, Geometry.Unit, Geometry.Lines.Line;
