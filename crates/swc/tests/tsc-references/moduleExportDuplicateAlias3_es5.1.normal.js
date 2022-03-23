// @checkJs: true
// @strict: true
// @declaration: true
// @filename: moduleExportAliasDuplicateAlias.js
// @outdir: out
exports.apply = undefined;
exports.apply = undefined;
function a() {}
exports.apply = a;
exports.apply();
exports.apply = "ok";
var OK = exports.apply.toUpperCase();
exports.apply = 1;
// @filename: test.js
var apply = require("./moduleExportAliasDuplicateAlias").apply;
var result = apply.toFixed();
