// @filename: function.ts
var A1;
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
var fn = A1.Point;
var cl;
var cl = B.Point.Origin;
