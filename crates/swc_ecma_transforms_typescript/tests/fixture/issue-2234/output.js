let Shapes;
(function(Shapes) {
    let Polygons;
    (function(Polygons) {
        class Triangle {
        }
        Polygons.Triangle = Triangle;
        class Square {
        }
        Polygons.Square = Square;
    })(Polygons || (Polygons = {
    }));
    Shapes.Polygons = Polygons;
})(Shapes || (Shapes = {
}));
var polygons = Shapes.Polygons;
let sq = new polygons.Square();
