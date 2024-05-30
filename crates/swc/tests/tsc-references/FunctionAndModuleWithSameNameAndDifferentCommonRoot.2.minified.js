//// [function.ts]
//// [module.ts]
var B;
((B = {}).Point || (B.Point = {})).Origin = {
    x: 0,
    y: 0
};
//// [test.ts]
A.Point, B.Point.Origin;
