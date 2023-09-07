//// [objectLiteralShorthandPropertiesWithModuleES6.ts]
var m;
(function(m) {
    var x1;
    Object.defineProperty(m, "x", {
        enumerable: true,
        get () {
            return x1;
        },
        set (v) {
            x1 = v;
        }
    });
})(m || (m = {}));
(function(m) {
    var z = x;
    var y = {
        a: x,
        x
    };
})(m || (m = {}));
