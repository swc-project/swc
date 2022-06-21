define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        get: ()=>_default,
        enumerable: true
    });
    function* _default() {
        var x = yield 5;
        return 5;
    }
});
