var B, Geometry;
(B || (B = {})).Line = class {
    constructor(start, end){
        this.start = start, this.end = end;
    }
}, function(Geometry1) {
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
