var Shapes;
!function(Shapes) {
    class Point {
        getDist() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    Point.origin = new Point(0, 0), Shapes.Point = Point;
}(Shapes || (Shapes = {})), new Shapes.Point(3, 4).getDist();
