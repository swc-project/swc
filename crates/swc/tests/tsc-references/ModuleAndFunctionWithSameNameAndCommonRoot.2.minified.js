//// [module.ts]
var A, A1;
((A1 = A || (A = {})).Point || (A1.Point = {})).Origin = {
    x: 0,
    y: 0
};
//// [function.ts]
var A;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
};
//// [simple.ts]
var B, B1;
((B1 = B || (B = {})).Point || (B1.Point = {})).Origin = {
    x: 0,
    y: 0
}, B1.Point = function() {
    return {
        x: 0,
        y: 0
    };
};
