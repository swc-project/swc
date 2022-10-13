//// [module.ts]
!function(A1) {
    (A1.Point || (A1.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(A = {});
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
//// [simple.ts]
!function(B1) {
    var Point = function() {
        return {
            x: 0,
            y: 0
        };
    };
    (Point = B1.Point || (B1.Point = {})).Origin = {
        x: 0,
        y: 0
    }, B1.Point = Point;
}(B = {});
