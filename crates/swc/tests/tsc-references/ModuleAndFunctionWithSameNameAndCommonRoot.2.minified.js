//// [module.ts]
var A, A1, Point;
Point = (A1 = A || (A = {})).Point || (A1.Point = {}), Point.Origin = {
    x: 0,
    y: 0
};
//// [function.ts]
var A, A1;
A1 = A || (A = {}), A1.Point = function() {
    return {
        x: 0,
        y: 0
    };
};
//// [simple.ts]
var B;
!function(B) {
    var Point, Point1;
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    Point1 = Point = B.Point || (B.Point = {}), Point1.Origin = {
        x: 0,
        y: 0
    }, B.Point = Point;
}(B || (B = {}));
