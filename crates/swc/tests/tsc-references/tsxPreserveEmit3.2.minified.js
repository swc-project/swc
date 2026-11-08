//// [tsxPreserveEmit3.tsx]
define([
    "require"
], function(require) {});
//// [file.tsx]
define([
    "require"
], function(require) {});
//// [test.d.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "React", {
        enumerable: !0,
        get: function() {}
    });
});
//// [react-consumer.tsx]
define([
    "require",
    "exports",
    "./test"
], function(require, exports, _test) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
});
