define([
    "require",
    "white",
    "black"
], function(require, _white, _black) {
    "use strict";
    function use1() {
        console.log(_white.foo1);
    }
    function use2() {
        console.log(_black.foo2);
    }
});
