//// [moduleExportAliasDuplicateAlias.js]
function a() {}
exports.apply = void 0, exports.apply(), exports.apply = a, exports.apply();
//// [test.js]
var apply = require("./moduleExportAliasDuplicateAlias").apply;
apply();
