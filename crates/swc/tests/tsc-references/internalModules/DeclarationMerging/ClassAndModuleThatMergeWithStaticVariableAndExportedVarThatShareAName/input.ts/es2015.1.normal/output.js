class Point1 {
    constructor(x1, y1){
        this.x = x1;
        this.y = y1;
    }
}
Point1.Origin = {
    x: 0,
    y: 0
};
(function(Point) {
    Point.Origin = "";
})(Point1 || (Point1 = {
}));
var A1;
(function(A) {
    class Point2 {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A.Point = Point2;
    Point2.Origin = {
        x: 0,
        y: 0
    };
    (function(Point) {
        Point.Origin = "";
    })(Point2 || (Point2 = {
    }));
})(A1 || (A1 = {
}));
