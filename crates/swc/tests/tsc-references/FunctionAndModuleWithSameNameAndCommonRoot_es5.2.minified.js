var A, B;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
}, function(A1) {
    (A1.Point || (A1.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {})), A.Point, A.Point(), A.Point.Origin, function(B1) {
    var Point = function() {
        return {
            x: 0,
            y: 0
        };
    };
    B1.Point = Point, (Point = B1.Point || (B1.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(B || (B = {})), B.Point, B.Point(), B.Point.Origin;
