// @filename: function.ts
var A;
(function(A1) {
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    A1.Point = Point;
})(A || (A = {
}));
(function(A2) {
    var Point1;
    (function(Point) {
        var Origin = Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point1 = A2.Point || (A2.Point = {
    }));
})(A || (A = {
}));
// @filename: test.ts
var fn;
var fn = A.Point;
var cl;
var cl = A.Point();
var cl = A.Point.Origin; // not expected to be an error.
// @filename: simple.ts
var B;
(function(B1) {
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    B1.Point = Point;
    (function(Point) {
        var Origin = Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point = B1.Point || (B1.Point = {
    }));
})(B || (B = {
}));
var fn;
var fn = B.Point; // not expected to be an error. bug 840000: [corelang] Function of fundule not assignalbe as expected
var cl;
var cl = B.Point();
var cl = B.Point.Origin;
