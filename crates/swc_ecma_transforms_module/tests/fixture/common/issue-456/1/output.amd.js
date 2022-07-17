define([
    "require",
    "exports",
    "path"
], function(require, exports, _path) {
    "use strict";
    Object.defineProperty(exports, "foo", {
        enumerable: true,
        get: ()=>foo
    });
    const foo = function() {
        function e(t) {}
        return A(e, {}), e;
    }();
});
