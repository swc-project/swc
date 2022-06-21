define([
    "require",
    "exports",
    "path"
], function(require, exports, _path) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "foo", {
        get: ()=>foo,
        enumerable: true
    });
    const foo = function() {
        var e = 1;
        return A(e, {}), e;
    }();
});
