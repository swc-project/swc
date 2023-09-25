//// [function.ts]
var A;
(function(A) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    A.Point = Point;
})(A || (A = {}));
//// [module.ts]
var B;
(function(B) {
    var Point;
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point = B.Point || (B.Point = {}));
})(B || (B = {}));
//// [test.ts]
var fn;
var fn = A.Point;
var cl;
var cl = B.Point.Origin;
