define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _export(exports, {
        diff: function() {
            return diff;
        },
        diffLevel: function() {
            return diffLevel;
        }
    });
    let diffLevel = 0;
    function diff() {
        if (!++diffLevel) {
            console.log("hey");
        }
    }
});
