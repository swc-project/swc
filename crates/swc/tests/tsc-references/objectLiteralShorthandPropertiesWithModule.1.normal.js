//// [objectLiteralShorthandPropertiesWithModule.ts]
// module export
var m;
(function(m) {
    var x1;
    Object.defineProperty(m, "x", {
        enumerable: true,
        get: function get() {
            return x1;
        },
        set: function set(v) {
            x1 = v;
        }
    });
})(m || (m = {}));
(function(m) {
    var z = x;
    var y = {
        a: x,
        x: x
    };
})(m || (m = {}));
