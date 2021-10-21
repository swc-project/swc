var Shapes1;
(function(Shapes) {
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
    Shapes.Polygons = Polygons1;
})(Shapes1 || (Shapes1 = {
}));
var polygons = Shapes1.Polygons;
let sq = new polygons.Square();
