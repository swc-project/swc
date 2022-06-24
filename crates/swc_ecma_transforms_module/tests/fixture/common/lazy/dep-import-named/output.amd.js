define([
    "exports",
    "foo"
], function(exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function use() {
        console.log(_foo.foo);
    }
});
