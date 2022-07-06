var A, B;
!function(A) {
    (A.Point || (A.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {})), function(A) {
    var Point = function() {
        return {
            x: 0,
            y: 0
        };
    };
    A.Point = Point;
}(A || (A = {})), function(B) {
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
