//// [moduleExportAliasDuplicateAlias.js]
function a() {}
exports.apply = void 0, exports.apply = void 0, exports.apply = a, exports.apply(), exports.apply = "ok";
var OK = exports.apply.toUpperCase();
exports.apply = 1;
//// [test.js]
var apply = require("./moduleExportAliasDuplicateAlias").apply, result = apply.toFixed();
