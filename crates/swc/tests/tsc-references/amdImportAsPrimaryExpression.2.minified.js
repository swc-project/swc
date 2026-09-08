//// [foo_0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "E1", {
        enumerable: !0,
        get: function() {
            return E11;
        }
    });
    var E1, E11 = ((E1 = {})[E1.A = 0] = "A", E1[E1.B = 1] = "B", E1[E1.C = 2] = "C", E1);
});
//// [foo_1.ts]
define([
    "require",
    "./foo_0"
], function(require, foo) {
    foo.E1.A;
});
