//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    var foo;
    (foo || (foo = {})).answer = 42;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo_0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _foo_0.answer;
});
