//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    var Foo;
    return (Foo || (Foo = {})).answer = 42, Foo;
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
    }), _foo0.answer;
});
