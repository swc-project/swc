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
    "./foo_0"
], function(require, foo) {
    "use strict";
    42 === foo.answer && foo();
});
