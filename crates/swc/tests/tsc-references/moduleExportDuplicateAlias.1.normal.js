//// [moduleExportAliasDuplicateAlias.js]
exports.apply = undefined;
function a() {}
exports.apply();
exports.apply = a;
exports.apply();
//// [test.js]
var apply = require('./moduleExportAliasDuplicateAlias').apply;
apply();
