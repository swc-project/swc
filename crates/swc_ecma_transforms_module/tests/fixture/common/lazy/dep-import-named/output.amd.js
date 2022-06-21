define([
    "require",
    "foo"
], function(require, _foo) {
    "use strict";
    function use() {
        console.log(_foo.foo);
    }
});
