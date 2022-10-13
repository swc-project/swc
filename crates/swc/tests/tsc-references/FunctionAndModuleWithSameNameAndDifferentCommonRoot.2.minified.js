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
var B;
!function(B) {
    (B.Point || (B.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(B || (B = {}));
//// [test.ts]
A.Point, B.Point.Origin;
