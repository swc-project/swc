//// [moduleExportAliasDuplicateAlias.js]
function a() {}
module.exports.apply = void 0, module.exports.apply = a, module.exports.apply = a, module.exports.apply();
//// [test.js]
var apply = require("./moduleExportAliasDuplicateAlias").apply;
apply();
