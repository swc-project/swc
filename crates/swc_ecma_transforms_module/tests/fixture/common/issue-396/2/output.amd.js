define([
    "require"
], function(require) {
    "use strict";
    function foo() {
        bar;
        function bar() {}
    }
});
