//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    var foo;
    (function(foo) {
        foo[foo["red"] = 0] = "red";
        foo[foo["green"] = 1] = "green";
        foo[foo["blue"] = 2] = "blue";
    })(foo || (foo = {}));
    (function(foo) {
        var answer = foo.answer = 42;
    })(foo || (foo = {}));
    return foo;
});
//// [foo_1.ts]
define([
    "require",
    "exports",
    "./foo_0"
], function(require, exports, _foo0) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var color;
    if (color === _foo0.green) {
        color = _foo0.answer;
    }
});
