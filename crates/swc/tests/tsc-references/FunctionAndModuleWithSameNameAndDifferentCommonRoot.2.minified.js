//// [function.ts]
var A, A1;
A1 = A || (A = {}), A1.Point = function() {
    return {
        x: 0,
        y: 0
    };
};
//// [module.ts]
var B, B1, Point;
Point = (B1 = B || (B = {})).Point || (B1.Point = {}), Point.Origin = {
    x: 0,
    y: 0
};
//// [test.ts]
A.Point, B.Point.Origin;
