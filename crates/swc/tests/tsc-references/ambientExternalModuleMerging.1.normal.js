//// [ambientExternalModuleMerging_use.ts]
define([
    "require",
    "M"
], function(require, M) {
    "use strict";
    // Should be strings
    var x = M.x;
    var y = M.y;
});
//// [ambientExternalModuleMerging_declare.ts]
define([
    "require"
], function(require) {
    "use strict";
});
