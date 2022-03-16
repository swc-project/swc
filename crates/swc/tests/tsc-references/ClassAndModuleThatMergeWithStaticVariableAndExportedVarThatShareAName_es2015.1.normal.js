class Point {
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
    var Origin = Point1.Origin = "";
})(Point || (Point = {}));
var A;
(function(A1) {
    class Point2 {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    Point2.Origin = {
        x: 0,
        y: 0
    };
    A1.Point = Point2;
    (function(Point3) {
        var Origin = Point3.Origin = "";
    })(Point2 = A1.Point || (A1.Point = {}));
})(A || (A = {}));
