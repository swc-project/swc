//// [function.ts]
var A;
(A || (A = {})).Point = function() {
    return {
        x: 0,
        y: 0
    };
};
//// [module.ts]
var A, A1, Point, Origin;
Point = (A1 = A || (A = {})).Point || (A1.Point = {}), Origin = {
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
A.Point, A.Point(), A.Point.Origin;
 // not expected to be an error.
//// [simple.ts]
var B, B1, Point, Point1, Origin;
Point = function() {
    return {
        x: 0,
        y: 0
    };
}, (B1 = B || (B = {})).Point = Point, Point1 = Point = B1.Point || (B1.Point = {}), Origin = {
    x: 0,
    y: 0
}, Object.defineProperty(Point1, "Origin", {
    enumerable: !0,
    get: function() {
        return Origin;
    },
    set: function(v) {
        Origin = v;
    }
}), B.Point, B.Point(), B.Point.Origin;
