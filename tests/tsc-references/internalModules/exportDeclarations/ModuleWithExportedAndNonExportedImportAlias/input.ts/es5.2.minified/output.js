var B1, Geometry, Geometry1;
(function(B) {
    var Line = function(start, end) {
        "use strict";
        (function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        })(this, Line), this.start = start, this.end = end;
    };
    B.Line = Line;
})(B1 || (B1 = {
})), (Geometry1 = Geometry || (Geometry = {
})).Points = A, Geometry1.Origin = {
    x: 0,
    y: 0
}, Geometry1.Unit = new B1.Line(Origin, {
    x: 1,
    y: 0
}), Geometry.Origin, Geometry.Unit, Geometry.Lines.Line;
