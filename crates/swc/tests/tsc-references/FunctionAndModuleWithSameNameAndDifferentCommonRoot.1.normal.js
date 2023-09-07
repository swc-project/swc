//// [function.ts]
var A;
(function(A) {
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    A.Point = Point;
})(A || (A = {}));
//// [module.ts]
var B;
(function(B) {
    var Point;
    (function(Point) {
        var Origin = {
            x: 0,
            y: 0
        };
        Object.defineProperty(Point, "Origin", {
            enumerable: true,
            get: function get() {
                return Origin;
            },
            set: function set(v) {
                Origin = v;
            }
        });
    })(Point = B.Point || (B.Point = {}));
})(B || (B = {}));
//// [test.ts]
var fn;
var fn = A.Point;
var cl;
var cl = B.Point.Origin;
