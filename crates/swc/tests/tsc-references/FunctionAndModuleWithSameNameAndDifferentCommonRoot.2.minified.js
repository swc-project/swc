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
!function(B1) {
    (B1.Point || (B1.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(B = {});
//// [test.ts]
A.Point, B.Point.Origin;
