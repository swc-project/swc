var Shapes;
(function(Shapes1) {
    var Polygons1;
    (function(Polygons) {
        class Triangle {
        }
        Polygons.Triangle = Triangle;
        class Square {
        }
        Polygons.Square = Square;
    })(Polygons1 || (Polygons1 = {
    }));
    Shapes1.Polygons = Polygons1;
})(Shapes || (Shapes = {
}));
var polygons = Shapes.Polygons;
let sq = new polygons.Square();
