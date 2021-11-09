// @filename: module.ts
var A1;
(function(A) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point || (Point = {
    }));
})(A1 || (A1 = {
}));
(function(A) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    A.Point = Point;
})(A1 || (A1 = {
}));
// @filename: simple.ts
var B1;
(function(B) {
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
    B.Point = Point1;
})(B1 || (B1 = {
}));
