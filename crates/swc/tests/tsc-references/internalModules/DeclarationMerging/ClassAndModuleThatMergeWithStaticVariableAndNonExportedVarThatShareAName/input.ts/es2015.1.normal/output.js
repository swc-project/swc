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
    var Origin = ""; // not an error, since not exported
})(Point1 || (Point1 = {
}));
var A1;
(function(A) {
    class Point {
        constructor(x, y){
            this.x = x;
            this.y = y;
        }
    }
    A.Point = Point;
    Point.Origin = {
        x: 0,
        y: 0
    };
    (function(Point) {
        var Origin = ""; // not an error since not exported
    })(Point || (Point = {
    }));
})(A1 || (A1 = {
}));
