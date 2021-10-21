// Module
var Shapes1;
(function(Shapes) {
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
    Shapes.Point = Point;
    Point.origin = new Point(0, 0);
})(Shapes1 || (Shapes1 = {
}));
// Local variables
var p = new Shapes1.Point(3, 4);
var dist = p.getDist();
