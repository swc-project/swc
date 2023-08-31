//// [libReferenceNoLibBundle.ts]
// Test that passing noLib disables <reference lib> resolution.
define([
    "require"
], function(require) {});
//// [fakelib.ts]
define([
    "require"
], function(require) {});
//// [file1.ts]
/// <reference lib="dom" />
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "elem", {
        enumerable: !0,
        get: function() {
            return elem;
        }
    });
    let elem = {
        field: 'a'
    };
});
