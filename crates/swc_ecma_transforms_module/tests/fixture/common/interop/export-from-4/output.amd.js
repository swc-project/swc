define([
    "exports",
    "foo"
], function(exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "bar", {
        get: ()=>_foo.foo,
        enumerable: true
    });
});
