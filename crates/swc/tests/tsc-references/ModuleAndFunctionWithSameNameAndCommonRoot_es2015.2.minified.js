var A;
!function(A) {
    (A.Point || (A.Point = {})).Origin = {
        x: 0,
        y: 0
    };
}(A || (A = {}));
var A;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
};
var B;
!function(B) {
    function Point() {
        return {
            x: 0,
            y: 0
        };
    }
    (Point = B.Point || (B.Point = {})).Origin = {
        x: 0,
        y: 0
    }, B.Point = Point;
}(B || (B = {}));
