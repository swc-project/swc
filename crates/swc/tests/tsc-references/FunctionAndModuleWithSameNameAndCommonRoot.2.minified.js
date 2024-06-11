//// [function.ts]
var A;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
};
//// [module.ts]
var A, A1;
((A1 = A || (A = {})).Point || (A1.Point = {})).Origin = {
    x: 0,
    y: 0
};
//// [test.ts]
A.Point, A.Point(), A.Point.Origin;
//// [simple.ts]
var B;
!function(B) {
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
