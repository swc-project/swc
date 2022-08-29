//// [ambientExternalModuleMerging_use.ts]
define([
    "require",
    "exports",
    "M"
], function(require, exports, _m) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    // Should be strings
    var x = _m.x;
    var y = _m.y;
});
//// [ambientExternalModuleMerging_declare.ts]
define([
    "require"
], function(require) {
    "use strict";
});
