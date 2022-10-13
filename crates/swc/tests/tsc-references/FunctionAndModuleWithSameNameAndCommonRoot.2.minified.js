//// [function.ts]
var A;
!function(A) {
    var Point = function() {
        return {
            x: 0,
            y: 0
        };
    };
    A.Point = Point;
}(A || (A = {}));
//// [module.ts]
var A;
!function(A) {
    (A.Point || (A.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {}));
//// [test.ts]
A.Point, A.Point(), A.Point.Origin;
//// [simple.ts]
var B;
!function(B) {
    var Point = function() {
        return {
            x: 0,
            y: 0
        };
    };
    B.Point = Point, (Point = B.Point || (B.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(B || (B = {})), B.Point, B.Point(), B.Point.Origin;
