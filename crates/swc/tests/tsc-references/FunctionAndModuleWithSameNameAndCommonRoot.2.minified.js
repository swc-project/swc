//// [function.ts]
!function(A1) {
    var Point = function() {
        return {
            x: 0,
            y: 0
        };
    };
    A1.Point = Point;
}(A = {});
//// [module.ts]
!function(A1) {
    (A1.Point || (A1.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(A = {});
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
}(B = {}), B.Point, B.Point(), B.Point.Origin;
