define([
    "require",
    "exports",
    "path"
], function(require, exports, _path) {
    "use strict";
    Object.defineProperty(exports, "foo", {
        get: ()=>foo,
        enumerable: true
    });
    const foo = function() {
        function e(t) {}
        return A(e, {}), e;
    }();
});
