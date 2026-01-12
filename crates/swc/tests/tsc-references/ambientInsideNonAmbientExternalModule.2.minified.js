//// [ambientInsideNonAmbientExternalModule.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "E", {
        enumerable: !0,
        get: function() {
            return E;
        }
    });
    var E = {};
});
