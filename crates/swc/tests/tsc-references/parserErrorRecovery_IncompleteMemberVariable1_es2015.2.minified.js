var Shapes;
!function(Shapes1) {
    class Point {
        getDist() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        constructor(x, y){
            this.x = x, this.y = y;
        }
    }
    Shapes1.Point = Point, Point.origin = new Point(0, 0);
}(Shapes || (Shapes = {
})), new Shapes.Point(3, 4).getDist();
