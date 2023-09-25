//// [foo_0.ts]
define([
    "require"
], function(require) {
    return Foo;
});
//// [foo_1.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    var x;
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), x("test"), x(42), x.b, x.c, x.d;
});
