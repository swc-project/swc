define([
    "require",
    "exports"
], function(require, exports1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    Object.defineProperty(exports1, "jquery", {
        enumerable: true,
        get: function() {
            return $;
        }
    });
    const $ = exports.$ = require("jquery");
    $(".hello");
});
