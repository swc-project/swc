// @filename: function.ts
var A;
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
// @filename: module.ts
var B;
(function(B) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point || (Point = {
    }));
})(B || (B = {
}));
// @filename: test.ts
var fn;
var fn = A.Point;
var cl;
var cl = B.Point.Origin;
