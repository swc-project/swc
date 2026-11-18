//// [ambientExternalModuleMerging_use.ts]
define([
    "require",
    "M"
], function(require, M) {
    M.x, M.y;
});
//// [ambientExternalModuleMerging_declare.ts]
define([
    "require"
], function(require) {});
