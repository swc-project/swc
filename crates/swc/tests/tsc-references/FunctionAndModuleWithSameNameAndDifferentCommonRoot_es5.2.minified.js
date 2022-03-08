var A, B;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
}, function(B1) {
    (B1.Point || (B1.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(B || (B = {})), A.Point, B.Point.Origin;
