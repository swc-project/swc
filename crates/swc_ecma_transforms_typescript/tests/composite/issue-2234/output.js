(function(Shapes) {
    (function(Polygons) {
        class Triangle {
        }
        Polygons.Triangle = Triangle;
        class Square {
        }
        Polygons.Square = Square;
    })(Shapes.Polygons || (Shapes.Polygons = {}));
})(Shapes || (Shapes = {}));
const polygons = Shapes.Polygons;
let sq = new polygons.Square();
var Shapes;
