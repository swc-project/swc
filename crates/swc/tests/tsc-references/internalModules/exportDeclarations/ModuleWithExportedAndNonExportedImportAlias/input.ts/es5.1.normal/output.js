function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var B1;
(function(B) {
    var Line = function Line(start, end) {
        "use strict";
        _classCallCheck(this, Line);
        this.start = start;
        this.end = end;
    };
    B.Line = Line;
})(B1 || (B1 = {
}));
var Geometry1;
(function(Geometry) {
    Geometry.Points = A;
    var Lines = B1;
    Geometry.Origin = {
        x: 0,
        y: 0
    };
    Geometry.Unit = new Lines.Line(Origin, {
        x: 1,
        y: 0
    });
})(Geometry1 || (Geometry1 = {
}));
// expected to work since all are exported
var p;
var p;
var p = Geometry1.Origin;
var line;
var line = Geometry1.Unit;
// not expected to work since non are exported
var line = Geometry1.Lines.Line;
