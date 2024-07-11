var Shapes;
(function(Shapes) {
    let Polygons;
    (function(Polygons) {
        class Triangle {
        }
        Polygons.Triangle = Triangle;
        class Square {
        }
        Polygons.Square = Square;
    })(Polygons = Shapes.Polygons || (Shapes.Polygons = {}));
})(Shapes || (Shapes = {}));
const polygons = Shapes.Polygons;
let sq = new polygons.Square();
