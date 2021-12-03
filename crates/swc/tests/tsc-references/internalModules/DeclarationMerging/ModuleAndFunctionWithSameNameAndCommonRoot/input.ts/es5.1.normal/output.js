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
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    A1.Point = Point;
})(A || (A = {
}));
// @filename: simple.ts
var B;
(function(B1) {
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point || (Point = {
    }));
    B1.Point = Point;
})(B || (B = {
}));
