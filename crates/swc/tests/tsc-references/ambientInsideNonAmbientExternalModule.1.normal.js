//// [ambientInsideNonAmbientExternalModule.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "E", {
        enumerable: true,
        get: function() {
            return E;
        }
    });
    var E = /*#__PURE__*/ function(E) {
        return E;
    }({});
});
