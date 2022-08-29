//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    function foo() {
        return "test";
    }
    return (foo || (foo = {})).answer = 42, foo;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), 42 === _foo0.answer && _foo0();
});
