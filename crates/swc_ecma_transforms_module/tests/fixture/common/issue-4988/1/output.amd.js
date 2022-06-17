define([
    "require",
    "exports",
    "jquery"
], function(require, exports, _jquery) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
        "$": function() {
            return _jquery;
        },
        jquery: function() {
            return _jquery;
        }
    });
    _jquery(".hello");
});
