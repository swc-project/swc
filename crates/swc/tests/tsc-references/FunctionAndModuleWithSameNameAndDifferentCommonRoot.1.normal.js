//// [function.ts]
(function(A) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    A.Point = Point;
})(A || (A = {}));
var A;
//// [module.ts]
(function(B) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(B.Point || (B.Point = {}));
})(B || (B = {}));
var B;
//// [test.ts]
var fn;
var fn = A.Point;
var cl;
var cl = B.Point.Origin;
