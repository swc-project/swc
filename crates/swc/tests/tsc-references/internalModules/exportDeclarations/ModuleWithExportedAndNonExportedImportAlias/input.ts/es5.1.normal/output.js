function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var B;
(function(B) {
    var Line = function Line(start, end) {
        "use strict";
        _classCallCheck(this, Line);
        this.start = start;
        this.end = end;
    };
    B.Line = Line;
})(B || (B = {
}));
var Geometry;
(function(Geometry) {
    Geometry.Points = A;
    var Lines = B;
    Geometry.Origin = {
        x: 0,
        y: 0
    };
    Geometry.Unit = new Lines.Line(Origin, {
        x: 1,
        y: 0
    });
})(Geometry || (Geometry = {
}));
// expected to work since all are exported
var p;
var p;
var p = Geometry.Origin;
var line;
var line = Geometry.Unit;
// not expected to work since non are exported
var line = Geometry.Lines.Line;
