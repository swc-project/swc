var B;
(function(B1) {
    class Line {
        constructor(start, end){
            this.start = start;
            this.end = end;
        }
    }
    B1.Line = Line;
})(B || (B = {
}));
var Geometry;
(function(Geometry1) {
    Geometry1.Points = A;
    var Lines = B;
    Geometry1.Origin = {
        x: 0,
        y: 0
    };
    Geometry1.Unit = new Lines.Line(Origin, {
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
