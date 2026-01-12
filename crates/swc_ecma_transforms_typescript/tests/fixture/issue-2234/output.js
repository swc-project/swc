(function(Shapes) {
    (function(Polygons) {
        class Triangle {
        }
        Polygons.Triangle = Triangle;
        class Square {
        }
        Polygons.Square = Square;
    })(Polygons || (Polygons = {}));
    Shapes.Polygons = Polygons;
})(Shapes || (Shapes = {}));
const polygons = Shapes.Polygons;
let sq = new polygons.Square();
