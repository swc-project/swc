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
(function(A) {
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(A.Point || (A.Point = {}));
})(A || (A = {}));
var A;
//// [test.ts]
var fn;
var fn = A.Point;
var cl;
var cl = A.Point();
var cl = A.Point.Origin; // not expected to be an error.
//// [simple.ts]
(function(B) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    B.Point = Point;
    (function(Point) {
        Point.Origin = {
            x: 0,
            y: 0
        };
    })(B.Point || (B.Point = {}));
})(B || (B = {}));
var fn;
var fn = B.Point; // not expected to be an error. bug 840000: [corelang] Function of fundule not assignalbe as expected
var cl;
var cl = B.Point();
var cl = B.Point.Origin;
var B;
