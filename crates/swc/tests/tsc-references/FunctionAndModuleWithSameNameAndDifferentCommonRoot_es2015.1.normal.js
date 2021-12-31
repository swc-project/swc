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
(function(B1) {
    let Point1;
    (function(Point) {
        var Origin = Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point1 = B1.Point || (B1.Point = {
    }));
})(B || (B = {
}));
// @filename: test.ts
var fn;
var fn = A.Point;
var cl;
var cl = B.Point.Origin;
