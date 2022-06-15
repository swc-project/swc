var B, Geometry;
(B || (B = {})).Line = class {
    constructor(start, end){
        this.start = start, this.end = end;
    }
}, function(Geometry) {
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
