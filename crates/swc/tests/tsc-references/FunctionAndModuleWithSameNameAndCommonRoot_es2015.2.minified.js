var A, B;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
}, function(A) {
    (A.Point || (A.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {})), A.Point, A.Point(), A.Point.Origin, function(B) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    B.Point = Point, (Point = B.Point || (B.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(B || (B = {})), B.Point, B.Point(), B.Point.Origin;
