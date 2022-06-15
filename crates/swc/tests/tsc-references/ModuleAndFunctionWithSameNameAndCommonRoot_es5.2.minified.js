var A, B;
!function(A) {
    (A.Point || (A.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {})), (A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
}, function(B) {
    var Point = function() {
        return {
            x: 0,
            y: 0
        };
    };
    (Point = B.Point || (B.Point = {})).Origin = {
        x: 0,
        y: 0
    }, B.Point = Point;
}(B || (B = {}));
