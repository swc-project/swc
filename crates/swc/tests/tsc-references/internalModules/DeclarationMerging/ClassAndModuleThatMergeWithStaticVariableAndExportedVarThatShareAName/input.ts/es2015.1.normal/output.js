class Point {
class Point1 {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}
Point.Origin = {
    x: 0,
    y: 0
};
(function(Point1) {
    Point1.Origin = "";
})(Point || (Point = {
}));
var A;
(function(A1) {
    class Point2 {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A1.Point = Point2;
    Point2.Origin = {
        x: 0,
        y: 0
    };
    (function(Point3) {
        Point3.Origin = "";
    })(Point2 || (Point2 = {
    }));
})(A || (A = {
}));
