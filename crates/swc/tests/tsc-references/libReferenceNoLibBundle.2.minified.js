//// [libReferenceNoLibBundle.ts]
define([
    "require"
], function(require) {});
//// [fakelib.ts]
define([
    "require"
], function(require) {});
//// [file1.ts]
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
