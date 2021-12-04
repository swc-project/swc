// @filename: module.ts
var A;
(function(A1) {
    let Point1;
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point1 || (Point1 = {
    }));
    A1.Point = Point1;
})(A || (A = {
}));
(function(A2) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    A2.Point = Point;
})(A || (A = {
}));
// @filename: simple.ts
var B;
(function(B1) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point2 || (Point2 = {
    }));
    function Point2() {
        return {
            x: 0,
            y: 0
        };
    }
    B1.Point = Point2;
})(B || (B = {
}));
