// @filename: function.ts
var A1;
(function(A) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    A.Point = Point;
})(A1 || (A1 = {
}));
(function(A) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point || (Point = {
    }));
})(A1 || (A1 = {
}));
// @filename: test.ts
var fn;
var fn = A1.Point;
var cl;
var cl = A1.Point();
var cl = A1.Point.Origin; // not expected to be an error.
// @filename: simple.ts
var B1;
(function(B) {
    function Point1() {
        return {
            x: 0,
            y: 0
        };
    }
    B.Point = Point1;
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(Point1 || (Point1 = {
    }));
})(B1 || (B1 = {
}));
var fn;
var fn = B1.Point; // not expected to be an error. bug 840000: [corelang] Function of fundule not assignalbe as expected
var cl;
var cl = B1.Point();
var cl = B1.Point.Origin;
