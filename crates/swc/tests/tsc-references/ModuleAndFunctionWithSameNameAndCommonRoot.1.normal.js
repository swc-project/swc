//// [module.ts]
var A;
(function(A) {
    var Point;
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point = A.Point || (A.Point = {}));
})(A || (A = {}));
//// [function.ts]
var A;
(function(A) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    // duplicate identifier error
    A.Point = Point;
})(A || (A = {}));
//// [simple.ts]
var B;
(function(B) {
    var Point;
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point = B.Point || (B.Point = {}));
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    // duplicate identifier error
    B.Point = Point;
})(B || (B = {}));
