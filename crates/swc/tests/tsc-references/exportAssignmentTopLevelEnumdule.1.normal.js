//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    var foo = /*#__PURE__*/ function(foo) {
        foo[foo["red"] = 0] = "red";
        foo[foo["green"] = 1] = "green";
        foo[foo["blue"] = 2] = "blue";
        return foo;
    }(foo || {});
    (function(foo) {
        foo.answer = 42;
    })(foo || (foo = {}));
    return foo;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo_0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var color;
    if (color === _foo_0.green) {
        color = _foo_0.answer;
    }
});
