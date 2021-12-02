// @filename: module.ts
var A;
(function(A) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point || (Point = {
    }));
})(A || (A = {
}));
(function(A1) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    A1.Point = Point;
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
    })(Point1 || (Point1 = {
    }));
    function Point1() {
        return {
            x: 0,
            y: 0
        };
    }
    B1.Point = Point1;
})(B || (B = {
}));
