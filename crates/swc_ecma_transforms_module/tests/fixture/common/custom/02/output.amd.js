define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "good", {
        enumerable: true,
        get: function() {
            return good;
        }
    });
    const good = {
        a (bad1) {
            (...bad2)=>{};
        }
    };
});
