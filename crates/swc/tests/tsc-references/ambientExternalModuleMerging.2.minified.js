//// [ambientExternalModuleMerging_use.ts]
define([
    "require",
    "exports",
    "M"
], function(require, exports, _M) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _M.x, _M.y;
});
//// [ambientExternalModuleMerging_declare.ts]
define([
    "require"
], function(require) {});
