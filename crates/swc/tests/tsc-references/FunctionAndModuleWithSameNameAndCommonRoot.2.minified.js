//// [function.ts]
var A, A1;
A1 = A || (A = {}), A1.Point = function() {
    return {
        x: 0,
        y: 0
    };
};
//// [module.ts]
var A, A1, Point;
Point = (A1 = A || (A = {})).Point || (A1.Point = {}), Point.Origin = {
    x: 0,
    y: 0
};
//// [test.ts]
A.Point, A.Point(), A.Point.Origin;
//// [simple.ts]
var B;
!function(B) {
    var Point;
    function Point1() {
        return {
            x: 0,
            y: 0
        };
    }
    B.Point = Point1, Point = Point1 = B.Point || (B.Point = {}), Point.Origin = {
        x: 0,
        y: 0
    };
}(B || (B = {})), B.Point, B.Point(), B.Point.Origin;
