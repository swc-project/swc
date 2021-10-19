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
(function(Point) {
    var Origin = ""; // not an error, since not exported
})(Point || (Point = {
}));
var A;
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
})(A || (A = {
}));
