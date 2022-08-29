//// [ambientExternalModuleMerging_use.ts]
define([
    "require",
    "exports",
    "M"
], function(require, exports, _m) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _m.x, _m.y;
});
//// [ambientExternalModuleMerging_declare.ts]
define([
    "require"
], function(require) {});
