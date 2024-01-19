//// [foo_0.ts]
define([
    "require"
], function(require) {
    var foo;
    function foo1() {
        return "test";
    }
    return foo = foo1 || (foo1 = {}), foo.answer = 42, foo1;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo_0) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), 42 === _foo_0.answer && _foo_0();
});
