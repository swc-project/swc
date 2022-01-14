var B, Geometry;
!function(B1) {
    var Line = function(start, end) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Line), this.start = start, this.end = end;
    };
    B1.Line = Line;
}(B || (B = {})), (function(Geometry1) {
    Geometry1.Points = A;
    var Origin = Geometry1.Origin = {
        x: 0,
        y: 0
    };
    Geometry1.Unit = new B.Line(Origin, {
        x: 1,
        y: 0
    });
})(Geometry || (Geometry = {})), Geometry.Origin, Geometry.Unit, Geometry.Lines.Line;
