var A, B;
(A || (A = {
})).Point = function() {
    return {
        x: 0,
        y: 0
    };
}, A || (A = {
}), (Point || (Point = {
})).Origin = {
    x: 0,
    y: 0
}, A.Point, A.Point(), A.Point.Origin, (function(B) {
    var Point = function() {
        return {
            x: 0,
            y: 0
        };
    };
    B.Point = Point, (Point || (Point = {
    })).Origin = {
        x: 0,
        y: 0
    };
})(B || (B = {
})), B.Point, B.Point(), B.Point.Origin;
