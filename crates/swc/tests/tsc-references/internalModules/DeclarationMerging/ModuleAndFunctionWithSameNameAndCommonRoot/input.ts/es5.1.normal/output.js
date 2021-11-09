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
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    A.Point = Point;
})(A1 || (A1 = {
}));
// @filename: simple.ts
var B1;
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
})(B1 || (B1 = {
}));
