var A, B;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
}, function(B) {
    (B.Point || (B.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(B || (B = {})), A.Point, B.Point.Origin;
