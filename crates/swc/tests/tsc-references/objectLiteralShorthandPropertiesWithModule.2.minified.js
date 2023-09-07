//// [objectLiteralShorthandPropertiesWithModule.ts]
// module export
var m, x1;
Object.defineProperty(m || (m = {}), "x", {
    enumerable: !0,
    get: function() {
        return x1;
    },
    set: function(v) {
        x1 = v;
    }
}), m || (m = {}), x, x, x;
