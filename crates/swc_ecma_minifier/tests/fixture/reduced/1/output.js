var A, B, A2;
((A2 = A || (A = {})).Point || (A2.Point = {})).Origin = {
    x: 0,
    y: 0
}, (A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
}, function(B1) {
    function Point1() {
        return {
            x: 0,
            y: 0
        };
    }
    (Point1 = B1.Point || (B1.Point = {})).Origin = {
        x: 0,
        y: 0
    }, B1.Point = Point1;
}(B || (B = {}));
