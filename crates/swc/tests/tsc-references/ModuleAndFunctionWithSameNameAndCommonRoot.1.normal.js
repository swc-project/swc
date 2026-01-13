//// [module.ts]
(function(A) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(A.Point || (A.Point = {}));
})(A || (A = {}));
var A;
//// [function.ts]
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
var A;
//// [simple.ts]
(function(B) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(B.Point || (B.Point = {}));
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    // duplicate identifier error
    B.Point = Point;
})(B || (B = {}));
var B;
