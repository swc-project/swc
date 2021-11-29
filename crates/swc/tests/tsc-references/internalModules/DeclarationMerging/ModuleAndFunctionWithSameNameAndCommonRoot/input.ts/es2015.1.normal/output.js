// @filename: module.ts
var A;
(function(A) {
    let Point;
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
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    A.Point = Point;
})(A || (A = {
}));
// @filename: simple.ts
var B;
(function(B) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point || (Point = {
    }));
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    B.Point = Point;
})(B || (B = {
}));
