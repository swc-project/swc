define([
    "require",
    "exports",
    "./foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "named", {
        enumerable: true,
        get: function() {
            return _foo.named;
        }
    });
});
