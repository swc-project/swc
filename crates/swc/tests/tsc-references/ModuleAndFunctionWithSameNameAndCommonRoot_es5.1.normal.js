// @filename: module.ts
var A;
(function(A1) {
    var Point1;
    (function(Point) {
        var Origin = Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point1 = A1.Point || (A1.Point = {
    }));
})(A || (A = {
}));
(function(A2) {
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    A2.Point = Point;
})(A || (A = {
}));
// @filename: simple.ts
var B;
(function(B1) {
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
    })(Point = B1.Point || (B1.Point = {
    }));
    B1.Point = Point;
})(B || (B = {
}));
