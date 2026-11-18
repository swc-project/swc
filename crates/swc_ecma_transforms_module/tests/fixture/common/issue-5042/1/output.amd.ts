define([
    "require",
    "exports",
    "jquery"
], function(require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "jquery", {
        enumerable: true,
        get: function() {
            return exports.$;
        }
    });
    exports.$ = $;
    (0, exports.$)(".hello");
});
