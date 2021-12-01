var Shapes;
(function(Shapes1) {
    var Polygons;
    (function(Polygons1) {
        class Triangle {
        }
        Polygons1.Triangle = Triangle;
        class Square {
        }
        Polygons1.Square = Square;
    })(Polygons || (Polygons = {
    }));
    Shapes1.Polygons = Polygons;
})(Shapes || (Shapes = {
}));
var polygons = Shapes.Polygons;
let sq = new polygons.Square();
