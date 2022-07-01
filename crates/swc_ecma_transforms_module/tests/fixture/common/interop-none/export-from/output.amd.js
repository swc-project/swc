define([
    "require",
    "exports",
    "foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "default", {
        get: ()=>_foo.default,
        enumerable: true
    });
});
