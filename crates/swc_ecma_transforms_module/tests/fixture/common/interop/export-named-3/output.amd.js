define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "bar", {
        enumerable: true,
        get: function() {
            return foo;
        }
    });
    var foo;
});
