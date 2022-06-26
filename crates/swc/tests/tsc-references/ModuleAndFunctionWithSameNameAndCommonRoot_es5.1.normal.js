// @filename: module.ts
var A;
(function(A) {
    var Point;
    (function(Point) {
        var Origin = Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point = A.Point || (A.Point = {}));
})(A || (A = {}));
(function(A) {
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    A.Point = Point;
})(A || (A = {}));
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
        var Origin = Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point = B.Point || (B.Point = {}));
    B.Point = Point;
})(B || (B = {}));
