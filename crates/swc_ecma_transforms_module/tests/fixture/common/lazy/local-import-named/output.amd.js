define([
    "exports",
    "./foo"
], function(exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    console.log(_foo.foo);
});
