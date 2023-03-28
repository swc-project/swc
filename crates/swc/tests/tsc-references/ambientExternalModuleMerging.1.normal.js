//// [ambientExternalModuleMerging_use.ts]
define([
    "require",
    "exports",
    "M"
], function(require, exports, _M) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    // Should be strings
    var x = _M.x;
    var y = _M.y;
});
//// [ambientExternalModuleMerging_declare.ts]
define([
    "require"
], function(require) {
    "use strict";
});
