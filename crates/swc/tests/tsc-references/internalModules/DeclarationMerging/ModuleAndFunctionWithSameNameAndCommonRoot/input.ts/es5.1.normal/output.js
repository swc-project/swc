// @filename: module.ts
var A;
(function(A) {
    var Point;
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point || (Point = {
    }));
    A.Point = Point;
})(A || (A = {
}));
(function(A) {
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    A.Point = Point;
})(A || (A = {
}));
// @filename: simple.ts
var B;
(function(B) {
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
    B.Point = Point;
})(B || (B = {
}));
