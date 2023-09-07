//// [module.ts]
var A;
(function(A) {
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
    })(Point = A.Point || (A.Point = {}));
})(A || (A = {}));
//// [function.ts]
var A;
(function(A) {
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
    // duplicate identifier error
    A.Point = Point;
})(A || (A = {}));
//// [simple.ts]
var B;
(function(B) {
    var Point = function Point() {
        return {
            x: 0,
            y: 0
        };
    };
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
    // duplicate identifier error
    B.Point = Point;
})(B || (B = {}));
