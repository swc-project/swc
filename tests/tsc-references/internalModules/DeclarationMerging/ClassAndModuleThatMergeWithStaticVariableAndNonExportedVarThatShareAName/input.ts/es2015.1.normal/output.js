class Point1 {
    constructor(x, y){
        this.x = x;
        this.y = y;
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
