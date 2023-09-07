//// [function.ts]
var A;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
};
//// [module.ts]
var B, B1, Point, Origin;
Point = (B1 = B || (B = {})).Point || (B1.Point = {}), Origin = {
    x: 0,
    y: 0
}, Object.defineProperty(Point, "Origin", {
    enumerable: !0,
    get: function() {
        return Origin;
    },
    set: function(v) {
        Origin = v;
    }
});
//// [test.ts]
A.Point, B.Point.Origin;
