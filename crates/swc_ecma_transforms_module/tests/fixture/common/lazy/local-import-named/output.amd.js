define([
    "require",
    "exports",
    "./foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    console.log(_foo.foo);
});
