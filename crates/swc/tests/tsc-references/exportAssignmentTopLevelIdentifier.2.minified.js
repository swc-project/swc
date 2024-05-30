//// [foo_0.ts]
define([
    "require"
], function(require) {
    var Foo;
    return (Foo = {}).answer = 42, Foo;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo_0) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _foo_0.answer;
});
