//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    var Foo;
    (function(Foo) {
        var answer = 42;
        Object.defineProperty(Foo, "answer", {
            enumerable: true,
            get: function get() {
                return answer;
            },
            set: function set(v) {
                answer = v;
            }
        });
    })(Foo || (Foo = {}));
    return Foo;
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
    if (_foo_0.answer === 42) {}
});
