define([
    "require",
    "exports",
    "./foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _exportStar(from, to) {
        Object.keys(from).forEach(function(k) {
            if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) Object.defineProperty(to, k, {
                get: function() {
                    return from[k];
                },
                enumerable: true
            });
        });
        return from;
    }
    _exportStar(_foo, exports);
});
