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
    "./foo_0"
], function(require, foo) {
    "use strict";
    foo.answer;
});
