// Module
var Shapes;
(function(Shapes1) {
    class Point {
        // Instance member
        getDist() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        // Constructor
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    // Static member
    Point.origin = new Point(0, 0);
    Shapes1.Point = Point;
})(Shapes || (Shapes = {}));
// Local variables
var p = new Shapes.Point(3, 4);
var dist = p.getDist();
