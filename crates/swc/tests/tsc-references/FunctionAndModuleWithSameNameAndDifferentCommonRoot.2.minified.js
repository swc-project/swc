//// [function.ts]
var A;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
};
//// [module.ts]
var B, B1;
((B1 = B || (B = {})).Point || (B1.Point = {})).Origin = {
    x: 0,
    y: 0
};
//// [test.ts]
A.Point, B.Point.Origin;
